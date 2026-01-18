import type {IQuotesService} from "../controllers/quotes.controller.js";
import type {Quote} from "./models/models.js";

export interface IQuotesAdapter{
    createQuote(quote: Quote): Promise<Quote>
    getQuote(id: string): Promise<Quote>
}

export class QuotesService implements IQuotesService{
    private quotesAdapter: IQuotesAdapter

    constructor(quotesAdp: IQuotesAdapter) {
        this.quotesAdapter = quotesAdp
    }

    async createQuote(quote: Quote): Promise<Quote> {
        // todo validation

        return await this.quotesAdapter.createQuote(quote)
    }

    async getQuote(id: string): Promise<Quote> {
        // todo id validation

        return await this.quotesAdapter.getQuote(id)
    }
}