import type {NodePgDatabase} from "drizzle-orm/node-postgres";

export interface IOrdersDatabase{
    find(): void
    save(): void
    savePayment(): void
}

export class OrdersAdapter{
    private ordersDB : NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.ordersDB = db
    }

    createOrder(): void{
        throw new Error("not implemented")
    }
    getOrder(): void{
        throw new Error("not implemented")
    }
    processPayment(): void{
        throw new Error("not implemented")
    }
}