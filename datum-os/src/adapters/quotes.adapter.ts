import type {NodePgDatabase} from "drizzle-orm/node-postgres";

export interface IQuotesDatabase{
    find(): void
    save(): void
}

export class QuotesAdapter{
    private quotesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.quotesDB = db
    }

    createQuote():void {
        throw new Error("not implemented")
    }
    getQuote(): void{
        throw new Error("not implemented")
    }
}