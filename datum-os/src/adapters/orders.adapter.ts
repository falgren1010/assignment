import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {IOrdersAdapter} from "../services/orders.service.js";
import type {Order} from "../services/models/models.js";
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

    getOrder(): void{
        throw new Error("not implemented")
    }
    processPayment(): void{
        throw new Error("not implemented")
    }
}