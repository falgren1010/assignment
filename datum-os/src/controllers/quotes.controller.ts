import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {Quote} from "../services/models/models.js";
import {renderError} from "./common.js";
import {AppError} from "../services/models/errors.js";

export interface IQuotesService{
    createQuote(quote: Quote): Promise<Quote>
    getQuote(id: string): Promise<Quote>
}

export class QuotesController implements RouteInitializer {
    private quotesService: IQuotesService

    constructor(quotesScv: IQuotesService) {
        this.quotesService = quotesScv
    }

    public initRoutes(router: Hono) {
        router.post("/api/quotes", this.createQuote)
        router.get("/api/quotes/:id", this.getQuote)
    }

    private createQuote = async (c: Context) => {
        try {
            const quotePayload = await c.req.json<Quote>()
            const quote = await this.quotesService.createQuote(quotePayload)

            return c.json(quote, 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }

    private getQuote = async (c: Context) => {
        try{
            const id = c.req.param("id")
            const result = await this.quotesService.getQuote(id)

            return c.json(result, 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }
}