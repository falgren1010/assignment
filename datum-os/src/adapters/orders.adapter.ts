import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {IOrdersAdapter} from "../services/orders.service.js";
import type {Order, StripePaymentIntent} from "../services/models/models.js";

import {eq} from "drizzle-orm";

import {orders} from "../infrastructure/databases/postgres/schemas.js";
import {NotFoundError} from "../services/models/errors.js";

type OrdersInsert = typeof orders.$inferInsert

export class OrdersAdapter implements IOrdersAdapter{
    private ordersDB : NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.ordersDB = db
    }

    async createOrder(order: Order): Promise<Order>{
        const dbObject: OrdersInsert = {
            quoteId: order.quoteId,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            totalAmount: String(order.totalAmount),
            currency: order.currency
        };

        const insertResult = await this.ordersDB
            .insert(orders)
            .values(dbObject)
            .returning();

        const dbOrder = insertResult[0]

        if (!dbOrder) {
            throw (new NotFoundError("DB Error: Order Not Found"))
        }

        return {
            id: dbOrder.id,
            quoteId: dbOrder.quoteId,
            customerName: dbOrder.customerName,
            customerEmail: dbOrder.customerEmail,
            customerCompany: dbOrder.customerCompany,
            paymentMethod: dbOrder.paymentMethod,
            paymentStatus: dbOrder.paymentStatus,
            purchaseOrderFileId: dbOrder.purchaseOrderFileId,
            totalAmount: Number(dbOrder.totalAmount),
            currency: dbOrder.currency,
            createdAt: dbOrder.createdAt,
        }
    }

    async getOrder(id: string): Promise<Order>{

        const getResult = await this.ordersDB
            .select()
            .from(orders)
            .where(eq(orders.id, id))
            .limit(1)

        const dbOrder = getResult[0]

        if (!dbOrder) {
            throw(new NotFoundError("DB Error: Order Not Found"))
        }

        return {
            id: dbOrder.id,
            quoteId: dbOrder.quoteId,
            currency: dbOrder.currency,
            customerEmail: dbOrder.customerEmail,
            customerName: dbOrder.customerName,
            paymentMethod: dbOrder.paymentMethod,
            customerCompany: dbOrder.customerCompany,
            totalAmount: Number(dbOrder.totalAmount),
            paymentStatus: dbOrder.paymentStatus,
            purchaseOrderFileId: dbOrder.purchaseOrderFileId,
            createdAt: dbOrder.createdAt
        }
    }

    processPayment(paymentIntent: StripePaymentIntent): Promise<void>{
        // this is a mocked payment process
        // no DB is set up
        // in prod -> create Payment Object and store in DB
        console.log("Payment processed: " + paymentIntent)

        return Promise.resolve();
    }
}