import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {IOrdersAdapter} from "../services/orders.service.js";
import type {Order, StripePaymentIntent} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";

export interface IOrdersDatabase{
    find(): void
    save(): void
    savePayment(): void
}

export class OrdersAdapter implements IOrdersAdapter{
    private ordersDB : NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.ordersDB = db
    }

    createOrder(order: Order): Promise<Result<void>>{
        //rm later
        console.log(order)
        const result: Result<void> = {
            data: null,
            success: true
        };

        return Promise.resolve(result);
    }

    getOrder(id: string): Promise<Result<Order>>{
        //rm later
        console.log(id)
        const result: Result<Order> = {
            data: {
                id: "",
                quoteId: "",
                customerName: "",
                customerEmail: "",
                customerCompany: null,
                paymentMethod: "card",
                paymentStatus: "pending",
                purchaseOrderFileId: null,
                totalAmount: 0,
                currency: "EUR",
                createdAt: new Date()
            },
            success: true
        };

        return Promise.resolve(result);
    }

    processPayment(paymentIntent: StripePaymentIntent): Promise<Result<void>>{
        //rm later
        console.log(paymentIntent)
        const result: Result<void> = {
            data: null,
            success: true
        };

        return Promise.resolve(result);
    }
}