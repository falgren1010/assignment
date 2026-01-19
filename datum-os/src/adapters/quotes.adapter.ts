import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {Quote} from "../services/models/models.js";
import {quotes} from "../infrastructure/databases/postgres/schemas.js";
import {eq} from "drizzle-orm";
import {InternalServerError, NotFoundError} from "../services/models/errors.js";

type QuotesInsert = typeof quotes.$inferInsert

export class QuotesAdapter{
    private quotesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.quotesDB = db
    }

    async createQuote(quote: Quote): Promise<Quote>{

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
            createdAt: quote.createdAt,
            expiresAt: quote.expiresAt,
        };


        const insertResult = await this.quotesDB
            .insert(quotes)
            .values(dbObject)
            .returning();

        const dbQuote = insertResult[0]

        if(!dbQuote){
            throw( new InternalServerError("DB Error: Insert Failed"))
        }

        return {
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

    }

    async getQuote(id: string): Promise<Quote>{
            const getResult = await this.quotesDB
                .select()
                .from(quotes)
                .where(eq(quotes.id, id))
                .limit(1)

            const dbQuote = getResult[0]

            if(!dbQuote){
               throw(new NotFoundError("DB Error: Quote Not Found"))
            }

        return {
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

    }
}