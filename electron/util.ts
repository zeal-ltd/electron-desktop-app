import { printer as ThermalPrinter, types as PrinterTypes } from "node-thermal-printer";
import { IOrderReceipt, ICartProduct, ICartModifierGroup, ICartModifier, EReceiptPrinterType } from "./model";
import usbPrinter from "@thiagoelg/node-printer";

export const calculateLRC = (str: string): string => {
    var bytes: number[] = [];
    var lrc = 0;
    for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }

    for (var i = 0; i < str.length; i++) {
        lrc ^= bytes[i];
    }

    return String.fromCharCode(lrc);
};

export const encodeCommandBuffer = (command: string): Buffer => {
    const messageIdentifier = Buffer.from("V2");
    const payloadLength = Buffer.from([0, command.length]);
    const payload = Buffer.from(command);
    const lrc = Buffer.from(calculateLRC(command));

    var arr = [messageIdentifier, payloadLength, payload, lrc];

    return Buffer.concat(arr);
};

export const decodeCommandBuffer = (data: Buffer): string => {
    // Remove V2
    let dataBuffer = data.slice(2);

    // Remove payload length
    dataBuffer = dataBuffer.slice(2);

    // Remove LRC
    dataBuffer = dataBuffer.slice(0, -1);

    return dataBuffer.toString();
};

const getCurrentDate = (date: Date) => {
    const pad = (num: number) => {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? "0" : "") + norm;
    };

    return (
        pad(date.getDate()) +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        date.getFullYear() +
        " " +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds())
    );
};

export const convertDollarsToCents = (price: number) => (price * 100).toFixed(0);

export const convertCentsToDollars = (price: number) => (price / 100).toFixed(2);

const getProductTotal = (product: ICartProduct) => {
    let total = product.price;

    product.modifierGroups.forEach((modifierGroup) => {
        modifierGroup.modifiers.forEach((modifier) => {
            total += modifier.price * modifier.quantity;
        });
    });

    return total * product.quantity;
};

export const printReceipt = async (order: IOrderReceipt) => {
    let printer;

    let failedRetryCount = 10;
    let retryInterval = 5000; //5 seconds

    const print = async () => {
        if (order.printerType == EReceiptPrinterType.WIFI) {
            //@ts-ignore
            printer = new ThermalPrinter({
                type: PrinterTypes.EPSON, // 'star' or 'epson'
                interface: `tcp://${order.printerAddress}`,
            });
        } else if (order.printerType == EReceiptPrinterType.USB) {
            //@ts-ignore
            printer = new ThermalPrinter({
                type: PrinterTypes.EPSON, // 'star' or 'epson'
            });
        } else {
            //Bluetooth
        }

        // let isConnected = await printer.isPrinterConnected();
        // console.log("Printer connected:", isConnected);

        printer.alignCenter();
        printer.bold(true);
        printer.setTextSize(1, 1);
        printer.println(order.restaurant.name);

        printer.newLine();

        printer.bold(false);
        printer.setTextNormal();
        printer.println(order.restaurant.address);

        printer.newLine();

        if (order.restaurant.gstNumber) {
            printer.bold(false);
            printer.setTextNormal();
            printer.println(`GST: ${order.restaurant.gstNumber}`);

            printer.newLine();
        }

        printer.setTextNormal();
        printer.println(`Order Placed ${getCurrentDate(new Date())} for ${order.type}`);

        if (order.table) {
            printer.newLine();
            printer.println(`Table Number: ${order.table}`);
        }

        printer.newLine();

        printer.println("Your order number is");
        printer.newLine();
        printer.setTextSize(1, 1);
        printer.println(order.number);
        printer.newLine();

        if (order.paid == false) {
            printer.setTextNormal();
            printer.underlineThick(true);
            printer.println("Payment Required");
            printer.underlineThick(true);
            printer.newLine();
        }

        printer.setTextNormal();
        printer.alignLeft();

        order.products.forEach((product: ICartProduct) => {
            printer.drawLine();
            printer.bold(true);

            printer.tableCustom([
                {
                    text: `${product.quantity > 1 ? product.quantity + " x " : ""}${product.name}`,
                    align: "LEFT",
                    width: 0.75,
                    bold: true,
                },
                {
                    text: `\$${convertCentsToDollars(getProductTotal(product))}`,
                    align: "RIGHT",
                    width: 0.25,
                    bold: true,
                },
            ]);

            product.modifierGroups.forEach((modifierGroup: ICartModifierGroup) => {
                if (order.hideModifierGroupsForCustomer == true && modifierGroup.hideForCustomer == true) {
                    return;
                }

                printer.newLine();
                printer.bold(false);
                printer.println(`${modifierGroup.name}`);

                modifierGroup.modifiers.forEach((modifier: ICartModifier) => {
                    const changedQuantity = modifier.quantity - modifier.preSelectedQuantity;
                    let mStr = "";

                    if (changedQuantity < 0 && Math.abs(changedQuantity) == modifier.preSelectedQuantity) {
                        mStr = `(REMOVE) ${changedQuantity > 1 ? `${Math.abs(changedQuantity)} x ` : ""}${modifier.name}`;
                    } else {
                        mStr = `${modifier.quantity > 1 ? `${Math.abs(modifier.quantity)} x ` : ""}${modifier.name}`;
                    }

                    if (modifier.price > 0 && changedQuantity > 0) {
                        mStr += ` ($${convertCentsToDollars(modifier.price)})`;
                    }

                    printer.println(mStr);
                });
            });

            if (product.notes) {
                printer.bold(false);
                printer.newLine();
                printer.println(`Notes: ${product.notes}`);
            }
        });

        printer.drawLine();

        if (order.notes) {
            printer.bold(false);
            printer.println(`Notes: ${order.notes}`);
            printer.newLine();
        }

        const GST = order.total * 0.15;

        printer.tableCustom([
            { text: "GST (15.00%)", align: "LEFT", width: 0.75 },
            { text: `\$${convertCentsToDollars(GST)}`, align: "RIGHT", width: 0.25 },
        ]);
        printer.tableCustom([
            { text: "Total", align: "LEFT", width: 0.75, bold: true },
            {
                text: `\$${convertCentsToDollars(order.total)}`,
                align: "RIGHT",
                width: 0.25,
                bold: true,
            },
        ]);

        printer.newLine();

        printer.alignCenter();

        if (order.eftposReceipt && !order.kitchenPrinter) {
            printer.println(order.eftposReceipt);
        }

        printer.newLine();
        printer.alignCenter();
        printer.setTypeFontB();
        printer.println("Order Placed on Tabin Kiosk");

        printer.partialCut();
        printer.openCashDrawer();

        try {
            if (order.printerType == EReceiptPrinterType.WIFI) {
                await printer.execute();
            } else if (order.printerType == EReceiptPrinterType.USB) {
                await usbPrinterExecute(order.printerAddress, printer.getBuffer());
                printer.clear();
            } else {
                //Bluetooth
            }
        } catch (error) {
            if (order.printerType == EReceiptPrinterType.WIFI) {
                if (failedRetryCount > 0) {
                    setTimeout(print, retryInterval, order);
                }

                failedRetryCount--;
            }

            throw error;
        }
    };

    await print();
};

const usbPrinterExecute = (address: string, dataBuffer: any) => {
    return new Promise(async (resolve, reject) => {
        usbPrinter.printDirect({
            data: dataBuffer,
            printer: address,
            type: "RAW",
            success: (jobId) => {
                resolve(jobId);
            },
            error: (err) => {
                reject(err);
            },
        });
    });
};
