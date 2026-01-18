import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {Quote} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";
import {quotes} from "../infrastructure/databases/postgres/schemas.js";
import {eq} from "drizzle-orm";

type QuotesInsert = typeof quotes.$inferInsert

export class QuotesAdapter{
    private quotesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.quotesDB = db
    }

    async createQuote(quote: Quote): Promise<Result<Quote>>{

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);

        const dbObject: QuotesInsert = {
            fileId: quote.fileId,
            materialId: quote.materialId,
            materialName: quote.materialName,
            materialPriceFactor: String(quote.materialPriceFactor),
            quantity: quote.quantity,
            volumeCm3: String(quote.volumeCm3),
            unitPrice: String(quote.unitPrice),
            quantityDiscount: String(quote.quantityDiscount),
            totalPrice: String(quote.totalPrice),
            status: quote.status,
            expiresAt: expireDate,
        };

        try {
            const insertResult = await this.quotesDB
                .insert(quotes)
                .values(dbObject)
                .returning();

            const dbQuote = insertResult[0]

            if(!dbQuote){
                return {success: false, message: "DB Error: Insert Failed"}
            }

            const domainQuote: Quote = {
                id: dbQuote.id,
                fileId: dbQuote.fileId,
                materialId: dbQuote.materialId,
                materialName: dbQuote.materialName,
                materialPriceFactor: Number(dbQuote.materialPriceFactor),
                quantity: dbQuote.quantity,
                quantityDiscount: Number(dbQuote.quantityDiscount),
                status: dbQuote.status,
                totalPrice: Number(dbQuote.totalPrice),
                unitPrice: Number(dbQuote.unitPrice),
                volumeCm3: Number(dbQuote.volumeCm3),
                createdAt: dbQuote.createdAt,
                expiresAt: dbQuote.expiresAt
            }

            return {success: true, data: domainQuote}

        } catch {
            return {success: false, message: "DB Error: Insert Failed"}
        }
    }

    async getQuote(id: string): Promise<Result<Quote>>{
        try {
            const getResult = await this.quotesDB
                .select()
                .from(quotes)
                .where(eq(quotes.id, id))
                .limit(1)

            const dbQuote = getResult[0]

            if(!dbQuote){
                return {success: false, message: "DB Error: Retrieving Quote"}
            }

            const domainQuote: Quote = {
                id: dbQuote.id,
                fileId: dbQuote.fileId,
                materialId: dbQuote.materialId,
                materialName: dbQuote.materialName,
                materialPriceFactor: Number(dbQuote.materialPriceFactor),
                quantity: dbQuote.quantity,
                quantityDiscount: Number(dbQuote.quantityDiscount),
                status: dbQuote.status,
                totalPrice: Number(dbQuote.totalPrice),
                unitPrice: Number(dbQuote.unitPrice),
                volumeCm3: Number(dbQuote.volumeCm3),
                createdAt: dbQuote.createdAt,
                expiresAt: dbQuote.expiresAt
            }

            return {success: true, data: domainQuote}

        } catch {
            return {success: false, message: "DB Error: Retrieving Quote"}
        }
    }
}