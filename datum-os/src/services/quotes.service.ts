import type {IQuotesService} from "../controllers/quotes.controller.js";
import type {Quote} from "./models/models.js";
import type {Result} from "./models/common.models.js";

export interface IQuotesAdapter{
    createQuote(quote: Quote): Promise<Result<void>>
    getQuote(id: string): Promise<Result<Quote>>
}

export class QuotesService implements IQuotesService{
    private quotesAdapter: IQuotesAdapter

    constructor(quotesAdp: IQuotesAdapter) {
        this.quotesAdapter = quotesAdp
    }

    async createQuote(quote: Quote): Promise<Result<void>> {
        // todo validation

        const result = await this.quotesAdapter.createQuote(quote)
        if (!result.success){
            return { success: false, message: "Error creating Quote:" + result.message }
        }

        return { success: true, data: null }
    }

    async getQuote(id: string): Promise<Result<Quote>> {
        // todo id validation

        const result = await this.quotesAdapter.getQuote(id)
        if (!result.success){
            return { success: false, message: "Not Found: " + result.message }
        }

        return { success: true, data: result.data }
    }
}