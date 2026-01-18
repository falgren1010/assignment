import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {Quote} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";

export interface IQuotesService{
    createQuote(quote: Quote): Promise<Result<Quote>>
    getQuote(id: string): Promise<Result<Quote>>
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
            const quote = await c.req.json<Quote>()

            const result = await this.quotesService.createQuote(quote)
            if (!result.success) {
                return c.text("Bad Request: " + result.message, 400)
            }

            return c.json(result.data, 200)

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            return c.text("Internal Server Error: " + msg, 500)
        }
    }

    private getQuote = async (c: Context) => {
        try{
            const id = c.req.param("id")

            const result = await this.quotesService.getQuote(id)
            if (!result.success) {
                return c.text("Bad Request: " + result.message, 400)
            }

            return c.json(result.data, 200)

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            return c.text("Internal Server Error: " + msg, 500)
        }
    }
}