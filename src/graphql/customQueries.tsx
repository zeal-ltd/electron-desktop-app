import gql from "graphql-tag";
import { EReceiptPrinterType } from "../model/model";

export const GET_USER = gql`
    query GetUser($userID: ID!) {
        getUser(id: $userID) {
            id
            identityPoolId
            firstName
            lastName
            email
            restaurants {
                items {
                    id
                    name
                    advertisements {
                        items {
                            id
                            name
                            content {
                                key
                                bucket
                                region
                                identityPoolId
                            }
                        }
                    }
                    registers {
                        items {
                            id
                            active
                            name
                            enableTableFlags
                            enablePayLater
                            enableCashPayments
                            type
                            eftposProvider
                            eftposIpAddress
                            eftposPortNumber
                            windcaveStationId
                            orderNumberSuffix
                            customStyleSheet {
                                key
                                bucket
                                region
                                identityPoolId
                            }
                            printers {
                                items {
                                    id
                                    name
                                    type
                                    address
                                    kitchenPrinter
                                    ignoreProducts(limit: 500) {
                                        items {
                                            id
                                            product {
                                                id
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export interface IGET_USER {
    id: string;
    identityPoolId: string;
    firstName: string;
    lastName: string;
    email: string;
    restaurants: {
        items: IGET_USER_RESTAURANT[];
    };
}

export interface IGET_USER_RESTAURANT {
    id: string;
    name: string;
}

export interface IGET_USER_REGISTER_PRINTER {
    id: string;
    name: string;
    type: EReceiptPrinterType;
    address: string;
    kitchenPrinter: boolean;
    ignoreProducts: {
        items: IGET_USER_REGISTER_PRINTER_IGNORE_PRODUCT[];
    };
}

export interface IGET_USER_REGISTER_PRINTER_IGNORE_PRODUCT {
    id: string;
    product: {
        id: string;
        name: string;
    };
}

export const GET_RESTAURANT = gql`
    query GetRestaurant($restaurantId: ID!) {
        getRestaurant(id: $restaurantId) {
            id
            name
            description
            isAcceptingOrders
            verified
            address {
                aptSuite
                formattedAddress
            }
            operatingHours {
                monday {
                    openingTime
                    closingTime
                }
                tuesday {
                    openingTime
                    closingTime
                }
                wednesday {
                    openingTime
                    closingTime
                }
                thursday {
                    openingTime
                    closingTime
                }
                friday {
                    openingTime
                    closingTime
                }
                saturday {
                    openingTime
                    closingTime
                }
                sunday {
                    openingTime
                    closingTime
                }
            }
            logo {
                key
                bucket
                region
                identityPoolId
            }
            gstNumber
            customStyleSheet {
                key
                bucket
                region
                identityPoolId
            }
            autoCompleteOrders
            salesReportMailingList
            advertisements {
                items {
                    id
                    name
                    content {
                        key
                        bucket
                        region
                        identityPoolId
                    }
                }
            }
            upSellCrossSell {
                id
                customCategories {
                    items {
                        id
                    }
                }
                customProducts {
                    items {
                        id
                        categories {
                            items {
                                category {
                                    id
                                }
                            }
                        }
                    }
                }
            }
            registers {
                items {
                    id
                    active
                    name
                    enableTableFlags
                    enablePayLater
                    enableCashPayments
                    type
                    eftposProvider
                    eftposIpAddress
                    eftposPortNumber
                    windcaveStationId
                    orderNumberSuffix
                    customStyleSheet {
                        key
                        bucket
                        region
                        identityPoolId
                    }
                    printers {
                        items {
                            id
                            name
                            type
                            address
                            kitchenPrinter
                            ignoreProducts(limit: 500) {
                                items {
                                    id
                                    product {
                                        id
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
            categories(limit: 500) {
                items {
                    id
                    name
                    image {
                        key
                        bucket
                        region
                        identityPoolId
                    }
                    displaySequence
                    availability {
                        monday {
                            startTime
                            endTime
                        }
                        tuesday {
                            startTime
                            endTime
                        }
                        wednesday {
                            startTime
                            endTime
                        }
                        thursday {
                            startTime
                            endTime
                        }
                        friday {
                            startTime
                            endTime
                        }
                        saturday {
                            startTime
                            endTime
                        }
                        sunday {
                            startTime
                            endTime
                        }
                    }
                    products(limit: 500) {
                        items {
                            id
                            displaySequence
                            product {
                                id
                                name
                                description
                                price
                                tags
                                totalQuantitySold
                                totalQuantityAvailable
                                soldOut
                                soldOutDate
                                image {
                                    key
                                    bucket
                                    region
                                    identityPoolId
                                }
                                availability {
                                    monday {
                                        startTime
                                        endTime
                                    }
                                    tuesday {
                                        startTime
                                        endTime
                                    }
                                    wednesday {
                                        startTime
                                        endTime
                                    }
                                    thursday {
                                        startTime
                                        endTime
                                    }
                                    friday {
                                        startTime
                                        endTime
                                    }
                                    saturday {
                                        startTime
                                        endTime
                                    }
                                    sunday {
                                        startTime
                                        endTime
                                    }
                                }
                                modifierGroups(limit: 500) {
                                    items {
                                        id
                                        displaySequence
                                        hideForCustomer
                                        modifierGroup {
                                            id
                                            name
                                            choiceMin
                                            choiceMax
                                            choiceDuplicate
                                            modifiers(limit: 500) {
                                                items {
                                                    id
                                                    displaySequence
                                                    preSelectedQuantity
                                                    modifier {
                                                        id
                                                        name
                                                        price
                                                        image {
                                                            key
                                                            bucket
                                                            region
                                                            identityPoolId
                                                        }
                                                        totalQuantitySold
                                                        totalQuantityAvailable
                                                        soldOut
                                                        soldOutDate
                                                        productModifier {
                                                            id
                                                            soldOut
                                                            soldOutDate
                                                            totalQuantityAvailable
                                                            availability {
                                                                monday {
                                                                    startTime
                                                                    endTime
                                                                }
                                                                tuesday {
                                                                    startTime
                                                                    endTime
                                                                }
                                                                wednesday {
                                                                    startTime
                                                                    endTime
                                                                }
                                                                thursday {
                                                                    startTime
                                                                    endTime
                                                                }
                                                                friday {
                                                                    startTime
                                                                    endTime
                                                                }
                                                                saturday {
                                                                    startTime
                                                                    endTime
                                                                }
                                                                sunday {
                                                                    startTime
                                                                    endTime
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            products(limit: 500) {
                items {
                    id
                    name
                    soldOut
                    soldOutDate
                    totalQuantityAvailable
                }
            }
            # Only for stock component
            modifiers(limit: 500) {
                items {
                    id
                    name
                    soldOut
                    soldOutDate
                    totalQuantityAvailable
                }
            }
        }
    }
`;

export interface IGET_RESTAURANT {
    id: string;
    name: string;
    description: string;
    // averagePreparationTimeInMinutes: number;
    isAcceptingOrders: boolean;
    verified: boolean;
    address: {
        aptSuite: string;
        formattedAddress: string;
    };
    operatingHours: IGET_RESTAURANT_OPERATING_HOURS;
    logo?: IS3Object;
    gstNumber: string | null;
    customStyleSheet?: IS3Object;
    autoCompleteOrders: boolean | null;
    salesReportMailingList: string | null;
    advertisements: { items: IGET_RESTAURANT_ADVERTISEMENT[] };
    upSellCrossSell?: IGET_DASHBOARD_UP_SELL_CROSS_SELL;
    registers: { items: IGET_RESTAURANT_REGISTER[] };
    categories: {
        items: IGET_RESTAURANT_CATEGORY[];
    };
    products: {
        items: IGET_RESTAURANT_PRODUCT[];
    };
    modifiers: {
        items: IGET_RESTAURANT_MODIFIER[];
    };
}

export interface IGET_RESTAURANT_ADVERTISEMENT {
    id: string;
    name: string;
    content: IS3Object;
}

export interface IGET_RESTAURANT_REGISTER {
    id: string;
    active: boolean;
    name: string;
    enableTableFlags: boolean;
    enablePayLater: boolean;
    enableCashPayments: boolean;
    type: string;
    eftposProvider: string;
    eftposIpAddress: string;
    eftposPortNumber: string;
    windcaveStationId: string;
    orderNumberSuffix: string;
    customStyleSheet?: IS3Object;
    printers: {
        items: IGET_RESTAURANT_REGISTER_PRINTER[];
    };
}

export interface IGET_RESTAURANT_REGISTER_PRINTER {
    id: string;
    name: string;
    type: EReceiptPrinterType;
    address: string;
    kitchenPrinter: boolean;
    ignoreProducts: {
        items: IGET_RESTAURANT_REGISTER_PRINTER_IGNORE_PRODUCT[];
    };
}

export interface IGET_RESTAURANT_REGISTER_PRINTER_IGNORE_PRODUCT {
    id: string;
    product: {
        id: string;
        name: string;
    };
}

export interface IGET_DASHBOARD_UP_SELL_CROSS_SELL {
    id: string;
    customCategories: {
        items: IGET_DASHBOARD_UP_SELL_CROSS_SELL_CUSTOM_CATEGORY[];
    };
    customProducts: {
        items: IGET_DASHBOARD_UP_SELL_CROSS_SELL_CUSTOM_PRODUCT[];
    };
}

export interface IGET_DASHBOARD_UP_SELL_CROSS_SELL_CUSTOM_CATEGORY {
    id: string;
}

export interface IGET_DASHBOARD_UP_SELL_CROSS_SELL_CUSTOM_PRODUCT {
    id: string;
    categories: {
        items: IGET_DASHBOARD_UP_SELL_CROSS_SELL_CUSTOM_PRODUCT_CATEGORY[];
    };
}

export interface IGET_DASHBOARD_UP_SELL_CROSS_SELL_CUSTOM_PRODUCT_CATEGORY {
    id: string;
}

export interface IGET_RESTAURANT_OPERATING_HOURS {
    sunday: {
        openingTime: string;
        closingTime: string;
    }[];
    monday: {
        openingTime: string;
        closingTime: string;
    }[];
    tuesday: {
        openingTime: string;
        closingTime: string;
    }[];
    wednesday: {
        openingTime: string;
        closingTime: string;
    }[];
    thursday: {
        openingTime: string;
        closingTime: string;
    }[];
    friday: {
        openingTime: string;
        closingTime: string;
    }[];
    saturday: {
        openingTime: string;
        closingTime: string;
    }[];
}

export interface IGET_RESTAURANT_ITEM_AVAILABILITY_HOURS {
    monday: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[];
    tuesday: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[];
    wednesday: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[];
    thursday: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[];
    friday: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[];
    saturday: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[];
    sunday: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[];
    [key: string]: IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES[]; //this is used to map over the operating hours object, https://www.logicbig.com/tutorials/misc/typescript/indexable-types.html
}

export interface IGET_RESTAURANT_ITEM_AVAILABILITY_TIMES {
    startTime: string;
    endTime: string;
}

export interface IGET_RESTAURANT_CATEGORY {
    id: string;
    name: string;
    displaySequence: number;
    image?: IS3Object;
    availability: IGET_RESTAURANT_ITEM_AVAILABILITY_HOURS;
    products?: {
        items: IGET_RESTAURANT_PRODUCT_LINK[];
    };
}

export interface IGET_RESTAURANT_PRODUCT_LINK {
    id: string;
    displaySequence: number;
    product: IGET_RESTAURANT_PRODUCT;
}

export interface IGET_RESTAURANT_PRODUCT {
    id: string;
    name: string;
    description?: string;
    price: number;
    tags: string | null;
    totalQuantitySold?: number;
    totalQuantityAvailable?: number;
    soldOut?: boolean;
    soldOutDate?: string;
    image?: IS3Object;
    availability?: IGET_RESTAURANT_ITEM_AVAILABILITY_HOURS;
    modifierGroups?: {
        items: IGET_RESTAURANT_MODIFIER_GROUP_LINK[];
    };
}

export interface IGET_RESTAURANT_MODIFIER_GROUP_LINK {
    id: string;
    displaySequence: number;
    hideForCustomer?: boolean;
    modifierGroup: IGET_RESTAURANT_MODIFIER_GROUP;
}

export interface IGET_RESTAURANT_MODIFIER_GROUP {
    id: string;
    name: string;
    choiceMin: number;
    choiceMax: number;
    choiceDuplicate: number;
    modifiers?: {
        items: IGET_RESTAURANT_MODIFIER_LINK[];
    };
}

export interface IGET_RESTAURANT_MODIFIER_LINK {
    id: string;
    displaySequence: number;
    preSelectedQuantity: number;
    modifier: IGET_RESTAURANT_MODIFIER;
}

export interface IGET_RESTAURANT_MODIFIER {
    id: string;
    name: string;
    price: number;
    image?: IS3Object;
    totalQuantitySold?: number;
    totalQuantityAvailable?: number;
    soldOut?: boolean;
    soldOutDate?: string;
    productModifier?: IGET_DASHBOARD_MODIFIER_PRODUCT_MODIFIER;
}

export interface IGET_DASHBOARD_MODIFIER_PRODUCT_MODIFIER {
    id: string;
    soldOut: boolean;
    soldOutDate: string;
    totalQuantityAvailable?: number;
    availability: IGET_RESTAURANT_ITEM_AVAILABILITY_HOURS;
}

export interface IS3Object {
    key: string;
    bucket: string;
    region: string;
    identityPoolId: string;
}
