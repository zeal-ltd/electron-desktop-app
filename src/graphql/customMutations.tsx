import gql from "graphql-tag";

export const CREATE_EFTPOS_TRANSACTION_LOG = gql`
    mutation createEftposTransactionLog(
        $eftposProvider: EftposProvider!
        $transactionId: Int
        $merchantId: Int
        $amount: Int
        $type: String
        $payload: String!
        $restaurantId: ID!
        $expiry: Int!
    ) {
        createEftposTransactionLog(
            input: {
                eftposProvider: $eftposProvider
                transactionId: $transactionId
                merchantId: $merchantId
                amount: $amount
                type: $type
                payload: $payload
                restaurantId: $restaurantId
                expiry: $expiry
            }
        ) {
            id
        }
    }
`;

export const UPDATE_REGISTER_KEY = gql`
    mutation UpdateRegister($id: ID!, $active: Boolean!) {
        updateRegister(input: { id: $id, active: $active }) {
            id
            active
        }
    }
`;

export const CREATE_ORDER = gql`
    mutation createOrder(
        $status: OrderStatus!
        $paid: Boolean!
        $cashPayment: Boolean!
        $type: OrderType!
        $number: String!
        $table: String
        $notes: String
        $total: Int!
        $registerId: ID!
        $products: [OrderProductInput!]
        $placedAt: String!
        $placedAtUtc: String!
        $orderUserId: ID!
        $orderRestaurantId: ID!
    ) {
        createOrder(
            input: {
                status: $status
                paid: $paid
                cashPayment: $cashPayment
                type: $type
                number: $number
                table: $table
                notes: $notes
                total: $total
                registerId: $registerId
                products: $products
                placedAt: $placedAt
                placedAtUtc: $placedAtUtc
                orderUserId: $orderUserId
                orderRestaurantId: $orderRestaurantId
            }
        ) {
            id
        }
    }
`;

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($id: ID!, $soldOut: Boolean, $soldOutDate: String, $totalQuantityAvailable: Int) {
        updateProduct(input: { id: $id, soldOut: $soldOut, soldOutDate: $soldOutDate, totalQuantityAvailable: $totalQuantityAvailable }) {
            id
        }
    }
`;

export const UPDATE_MODIFIER = gql`
    mutation UpdateModifier($id: ID!, $soldOut: Boolean, $soldOutDate: String, $totalQuantityAvailable: Int) {
        updateModifier(input: { id: $id, soldOut: $soldOut, soldOutDate: $soldOutDate, totalQuantityAvailable: $totalQuantityAvailable }) {
            id
        }
    }
`;

export const EMAIL_SALES_REPORTS = gql`
    mutation EmailSalesReports($restaurantId: String!, $emails: String!) {
        emailSalesReports(input: { restaurantId: $restaurantId, emails: $emails })
    }
`;
