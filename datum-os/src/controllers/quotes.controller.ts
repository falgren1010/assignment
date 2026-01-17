import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export class QuotesController implements RouteInitializer {

    constructor() {
    }

    public initRoutes(router: Hono) {
        router.post("/api/quotes", this.createQuote)
        router.get("/api/quotes/:id", this.getQuote)
    }

    private createQuote = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }

    private getQuote = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }
}