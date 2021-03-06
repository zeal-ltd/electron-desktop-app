import { createContext, useContext } from "react";

import axios from "axios";

import { convertCentsToDollars } from "../util/util";
import { CREATE_EFTPOS_TRANSACTION_LOG } from "../graphql/customMutations";
import { useMutation } from "react-apollo-hooks";
import { useRestaurant } from "./restaurant-context";
var convert = require("xml-js");

export enum WindcaveTransactionOutcome {
    Accepted,
    Declined,
    Cancelled,
    Failed,
}

export enum EWindcaveStatus {
    Initiating = "1",
    TransactionStarted_2 = "2",
    TransactionStarted_3 = "3",
    Processing = "4",
    Authenticating = "5",
    TransactionCompleted = "6",
}

export enum EWindcaveTxnStatus {
    Idle = "1",
    PresentOrInsertCard = "2",
    SelectAccount = "3",
    SelectApp = "4",
    EnterPin = "5",
    Processing = "6",
    VerifyingSignature = "7",
    DisplayResult = "8",
}

export interface WindcaveTransactionOutcomeResult {
    transactionOutcome: WindcaveTransactionOutcome;
    eftposReceipt?: string;
}

interface IWindcaveInitTransactionResponse {
    Scr: {
        TxnType?: {
            _text?: string;
        };
        TxnRef?: {
            _text?: string;
        };
        StatusId?: {
            _text?: string;
        };
        TxnStatusId?: {
            _text?: string;
        };
        Complete?: {
            _text?: string;
        };
        ReCo?: {
            _text?: string;
        };
        //Not in spec but it is returned at times
        Result?: {
            AP?: {
                _text?: string;
            };
            RC?: {
                _text?: string;
            };
            RT?: {
                _text?: string;
            };
        };
    };
}

interface IWindcaveStatusResponse {
    Scr: {
        TxnType?: {
            _text?: string;
        };
        TxnRef?: {
            _text?: string;
        };
        StatusId?: {
            _text?: string;
        };
        TxnStatusId?: {
            _text?: string;
        };
        Complete?: {
            _text?: string;
        };
        RcptW?: {
            _text?: string;
        };
        Rcpt?: {
            _text?: string;
        };
        ReCo?: {
            _text?: string;
        };
        Result?: {
            AP?: {
                _text?: string;
            };
            RC?: {
                _text?: string;
            };
            RT?: {
                _text?: string;
            };
        };
    };
}

const windcaveResponseCodeMessages = {
    P4: "PosDeviceId is greater than 32 characters",
    P5: "PosDeviceId not matched",
    P7: "Invalid transaction type",
    P8: "Authentication error",
    P9: "Authentication error—Station Id mismatch",
    PA: "Status request error",
    PB: "SCRHIT Init Session Error",
    PC: "Existing Transaction In progress. Please complete previous transaction before continuing.",
    PD: "SCRHIT Transmit Error— network connection issue, ensure the terminal has performed a Logon to the Windcave HOST.",
    PE: "SCRHIT Transmit Error— network connection issue, ensure the terminal has performed a Logon to the Windcave HOST.",
    PF: "SCRHIT Transmit Error— network connection issue, ensure the terminal has performed a Logon to the Windcave HOST.",
    PG: "Init Wait Timeout. Please check if the device is powered on correctly and online.",
    PJ: "TxnRef not matched",
    PK: "SCRHIT not enabled",
    PL: "Invalid input parameter",
    PM: "Txn type not allowed",
    PO: "Invalid Station Id. Please check if the device is powered on and online.",
    TQ: "HIT Start Failed— connection lost, ensure the terminal has performed a Logon to the Windcave HOST.",
    VB: "Transaction timed out. Please check if the device is powered on correctly and online.",
    VW: "Transaction cancelled. Please try again.",
    V6: "Card read error. Please try again.",
    PH: "User Error",
};

const ACTION: string = "doScrHIT";
const USER: string = "TabinHIT_Dev";
const KEY: string = "6b06b931c1942fa4222903055c9ac749c77fa4b86471d91b2909da74a69d928c";

type ContextProps = {
    createTransaction: (stationId: string, amount: number, transactionType: string, action?: string, user?: string, key?: string) => Promise<string>;
    pollForOutcome: (stationId: string, txnRef: string, action?: string, user?: string, key?: string) => Promise<WindcaveTransactionOutcomeResult>;
};

const WindcaveContext = createContext<ContextProps>({
    createTransaction: (stationId: string, amount: number, transactionType: string, action?: string, user?: string, key?: string) => {
        return new Promise(() => {
            console.log("");
        });
    },
    pollForOutcome: (stationId: string, txnRef: string, action?: string, user?: string, key?: string) => {
        return new Promise(() => {
            console.log("");
        });
    },
});

const WindcaveProvider = (props: { children: React.ReactNode }) => {
    const { restaurant } = useRestaurant();

    const _baseUrl: string = "https://uat.windcave.com/pxmi3/pos.aspx";
    const currency = "NZD";

    const formatReceipt = (receipt: string, width: number) => {
        let result = "";

        while (receipt.length > 0) {
            result += receipt.substring(0, width) + "\n";
            receipt = receipt.substring(width);
        }

        if (result.length > width) {
            receipt = receipt.substr(0, result.length - 2);
        }

        return result;
    };

    const createEftposTransactionLogMutation = useMutation(CREATE_EFTPOS_TRANSACTION_LOG, {
        update: (proxy, mutationResult) => {},
    });

    const createTransaction = (
        stationId: string,
        amount: number,
        transactionType: string,
        action: string = ACTION,
        user: string = USER,
        key: string = KEY
    ): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            if (!amount) {
                reject("The amount has to be supplied");
                return;
            } else if (amount == 0) {
                reject("The amount must be greater than 0");
                return;
            } else if (!transactionType) {
                reject("The transactionType has to be supplied");
                return;
            }

            const d = new Date();
            const txnRef = Math.round(d.getTime() / 1000).toString(); //secondsSinceEpoch

            const params = {
                Scr: {
                    _attributes: {
                        action: action,
                        user: user,
                        key: key,
                    },
                    Amount: {
                        _text: convertCentsToDollars(amount),
                    },
                    Cur: {
                        _text: currency,
                    },
                    TxnType: {
                        _text: transactionType,
                    },
                    Station: {
                        _text: stationId,
                    },
                    TxnRef: {
                        _text: txnRef,
                    },
                    DeviceId: {
                        _text: stationId,
                    },
                    PosName: {
                        _text: stationId,
                    },
                    PosVersion: {
                        _text: stationId,
                    },
                    VendorId: {
                        _text: stationId,
                    },
                    MRef: {
                        _text: `Tabin-${txnRef}`,
                    },
                },
            };

            const paramsXML = convert.json2xml(params, { compact: true, spaces: 4 });

            try {
                const response = await axios.post(_baseUrl, paramsXML, {
                    headers: {
                        "Content-Type": "application/xml",
                    },
                });

                // console.log(`Transaction POST response received (${response.status}) ${response.data}`);

                if (response.status == 200) {
                    const resJSON = convert.xml2json(response.data, { compact: true, spaces: 4 });
                    const res = JSON.parse(resJSON) as IWindcaveInitTransactionResponse;

                    console.log("xxx...res", res);

                    await createEftposTransactionLogMutation({
                        variables: {
                            eftposProvider: "WINDCAVE",
                            transactionId: txnRef,
                            amount: amount,
                            type: transactionType,
                            payload: response.data,
                            restaurantId: restaurant ? restaurant.id : "Invalid",
                            expiry: Number(Math.floor(Number(new Date()) / 1000) + 2592000), // Add 30 days to timeStamp for DynamoDB TTL
                        },
                    });

                    if (res.Scr.Complete) {
                        const transactionComplete = res.Scr.Complete._text === "1"; //If transaction is completed this field will be set to 1.

                        //Some other misc error
                        if (transactionComplete && res.Scr.ReCo && res.Scr.ReCo._text) {
                            reject(windcaveResponseCodeMessages[res.Scr.ReCo._text] || "Unknown error");
                            return;
                        }

                        //Not in spec but result is returned at times
                        if (transactionComplete && res.Scr.Result && res.Scr.Result.RC && res.Scr.Result.RC._text) {
                            reject(windcaveResponseCodeMessages[res.Scr.Result.RC._text] || "Unknown error");
                            return;
                        }
                    }

                    resolve(txnRef);
                    return;
                } else {
                    reject("Invalid status code received");
                    return;
                }
            } catch (err) {
                reject(err);
                return;
            }
        });
    };

    const pollForOutcome = (
        stationId: string,
        txnRef: string,
        action: string = ACTION,
        user: string = USER,
        key: string = KEY
    ): Promise<WindcaveTransactionOutcomeResult> => {
        const interval = 2 * 1000; // 2 seconds
        const timeout = 30 * 60 * 1000; // 10 minutes

        const endTime = Number(new Date()) + timeout;

        const checkCondition = async (resolve: any, reject: any) => {
            try {
                const params = {
                    Scr: {
                        _attributes: {
                            action: action,
                            user: user,
                            key: key,
                        },
                        Station: {
                            _text: stationId,
                        },
                        TxnType: {
                            _text: "Status",
                        },
                        TxnRef: {
                            _text: txnRef,
                        },
                    },
                };

                const paramsXML = convert.json2xml(params, { compact: true, spaces: 4 });

                const response = await axios.post(_baseUrl, paramsXML, {
                    headers: {
                        "Content-Type": "application/xml",
                    },
                });

                // console.log(`Transaction GET response received (${response.status}) ${response.data}`);

                let transactionComplete = false;
                let transactionOutcome;
                let eftposReceipt;

                if (response.status == 200) {
                    const resJSON = convert.xml2json(response.data, { compact: true, spaces: 4 });
                    const res = JSON.parse(resJSON) as IWindcaveStatusResponse;

                    console.log("xxx...res", res);

                    await createEftposTransactionLogMutation({
                        variables: {
                            eftposProvider: "WINDCAVE",
                            transactionId: txnRef,
                            payload: response.data,
                            restaurantId: restaurant ? restaurant.id : "Invalid",
                            expiry: Number(Math.floor(Number(new Date()) / 1000) + 2592000), // Add 30 days to timeStamp for DynamoDB TTL
                        },
                    });

                    if (res.Scr.Complete) {
                        transactionComplete = res.Scr.Complete._text === "1"; //If transaction is completed this field will be set to 1.

                        if (res.Scr.Result && res.Scr.Result.AP) {
                            if (res.Scr.Result.AP._text === "1") {
                                //Accepted
                                transactionOutcome = WindcaveTransactionOutcome.Accepted;
                            } else if (res.Scr.Result.AP._text === "0") {
                                //Declined or some other issue

                                if (
                                    (res.Scr.Result && res.Scr.Result.RC && res.Scr.Result.RC._text === "VW") ||
                                    (res.Scr.ReCo && res.Scr.ReCo._text === "VW")
                                ) {
                                    transactionOutcome = WindcaveTransactionOutcome.Cancelled;
                                } else if (
                                    (res.Scr.Result && res.Scr.Result.RC && res.Scr.Result.RC._text === "76") ||
                                    (res.Scr.ReCo && res.Scr.ReCo._text === "76")
                                ) {
                                    transactionOutcome = WindcaveTransactionOutcome.Declined;
                                } else if (transactionComplete && res.Scr.ReCo && res.Scr.ReCo._text) {
                                    reject(windcaveResponseCodeMessages[res.Scr.ReCo._text] || "Unknown error");
                                    return;
                                } else if (transactionComplete && res.Scr.Result && res.Scr.Result.RC && res.Scr.Result.RC._text) {
                                    reject(windcaveResponseCodeMessages[res.Scr.Result.RC._text] || "Unknown error");
                                    return;
                                }
                            }

                            //Fail any transaction approved with signature
                            if (
                                res.Scr.StatusId &&
                                res.Scr.TxnStatusId &&
                                res.Scr.StatusId._text == EWindcaveStatus.TransactionCompleted &&
                                res.Scr.TxnStatusId._text == EWindcaveTxnStatus.VerifyingSignature
                            ) {
                                transactionOutcome = WindcaveTransactionOutcome.Failed;
                            }

                            if (res.Scr.Rcpt) {
                                eftposReceipt = res.Scr.Rcpt._text;

                                if (res.Scr.RcptW && res.Scr.RcptW._text) {
                                    eftposReceipt = formatReceipt(eftposReceipt, parseInt(res.Scr.RcptW._text));
                                }
                            }
                        } else {
                            //Some other misc error
                            if (res.Scr.Result && res.Scr.Result.RC && res.Scr.Result.RC._text) {
                                reject(windcaveResponseCodeMessages[res.Scr.Result.RC._text] || "Unknown error");
                                return;
                            }
                        }
                    }
                } else {
                    console.log("Ignoring failed request...");
                }

                console.log(transactionComplete, transactionOutcome);

                if (transactionComplete && transactionOutcome != null) {
                    resolve({ transactionOutcome: transactionOutcome, eftposReceipt: eftposReceipt });
                    return;
                } else if (Number(new Date()) < endTime) {
                    setTimeout(checkCondition, interval, resolve, reject);
                    return;
                } else {
                    reject("Polling timed out");
                    return;
                }
            } catch (error) {
                reject(error);
            }
        };

        return new Promise(checkCondition);
    };

    return (
        <WindcaveContext.Provider
            value={{
                createTransaction: createTransaction,
                pollForOutcome: pollForOutcome,
            }}
            children={props.children}
        />
    );
};

const useWindcave = () => {
    const context = useContext(WindcaveContext);
    if (context === undefined) {
        throw new Error(`useWindcave must be used within a WindcaveProvider`);
    }
    return context;
};

export { WindcaveProvider, useWindcave };
