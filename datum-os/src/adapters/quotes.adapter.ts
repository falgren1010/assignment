import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {Quote} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";

export interface IQuotesDatabase{
    find(): void
    save(): void
}

export class QuotesAdapter{
    private quotesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.quotesDB = db
    }

    createQuote(quote: Quote): Promise<Result<void>>{
        //rm later
        console.log(quote)
        const result: Result<void> = {
            data: null,
            success: true
        };

        return Promise.resolve(result);
    }

    getQuote(id: string): Promise<Result<Quote>>{
        console.log(id)
        const result: Result<Quote> = {
            data: {
                id: "",
                fileId: "",
                materialId: "",
                materialName: "",
                materialPriceFactor: 0,
                quantity: 0,
                volumeCm3: 0,
                unitPrice: 0,
                quantityDiscount: 0,
                totalPrice: 0,
                status: "draft",
                createdAt: new Date(),
                expiresAt: new Date()
            },
            success: true
        };

        return Promise.resolve(result);
    }
}