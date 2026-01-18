import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {IOrdersAdapter} from "../services/orders.service.js";
import type {Order, StripePaymentIntent} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";

import {eq} from "drizzle-orm";

import {orders} from "../infrastructure/databases/postgres/schemas.js";
type OrdersInsert = typeof orders.$inferInsert

export class OrdersAdapter implements IOrdersAdapter{
    private ordersDB : NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.ordersDB = db
    }

    async createOrder(order: Order): Promise<Result<string>>{
        const dbObject: OrdersInsert = {
            quoteId: order.quoteId,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            totalAmount: String(order.totalAmount),
            currency: order.currency
        };

        try {
            const insertResult = await this.ordersDB
                .insert(orders)
                .values(dbObject)
                .returning();

            const dbOrder = insertResult[0]

            if (!dbOrder) {
                return { success: false, message: "DB Error: Order Not Found"}
            }

            const orderID: string = dbOrder.id

            return { success: true, data: orderID };

        } catch {
            return {success: false, message: "DB Error: Insert Failed"}
        }
    }

    async getOrder(id: string): Promise<Result<Order>>{
        try {
            const getResult = await this.ordersDB
                .select()
                .from(orders)
                .where(eq(orders.id, id))
                .limit(1)

            const dbOrder = getResult[0]

            if (!dbOrder) {
                return { success: false, message: "DB Error: Order Not Found"}
            }

            const order: Order = {
                id: dbOrder.id,
                quoteId: dbOrder.quoteId,
                currency: dbOrder.currency,
                customerEmail:dbOrder.customerEmail,
                customerName: dbOrder.customerName,
                paymentMethod: dbOrder.paymentMethod,
                customerCompany: dbOrder.customerCompany,
                totalAmount: Number(dbOrder.totalAmount),
                paymentStatus: dbOrder.paymentStatus,
                purchaseOrderFileId: dbOrder.purchaseOrderFileId,
                createdAt: dbOrder.createdAt
            };

            return { success: true, data: order };

        } catch {
            return {success: false, message: "DB Error: Retrieving Order"}
        }
    }

    processPayment(paymentIntent: StripePaymentIntent): Promise<Result<void>>{
        // this is a mocked payment process
        // no DB is set up
        // in prod -> create Payment Object and store in DB
        console.log("Payment processed: " + paymentIntent)
        const result: Result<void> = {
            success: true,
            data: null
        };

        return Promise.resolve(result);
    }
}