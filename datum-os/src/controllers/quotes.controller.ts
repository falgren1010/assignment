import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export interface IQuotesService{
    createQuote(): void
    getQuote(): void
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
        this.quotesService.createQuote()

        return c.text("Internal Server Error", 500)
    }

    private getQuote = async (c: Context) => {
        this.quotesService.getQuote()

        return c.text("Internal Server Error", 500)
    }
}