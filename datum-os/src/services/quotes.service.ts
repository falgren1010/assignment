import type {IQuotesService} from "../controllers/quotes.controller.js";

export interface IQuotesAdapter{
    createQuote(): void
    getQuote(): void
}

export class QuotesService implements IQuotesService{
    private quotesAdapter: IQuotesAdapter

    constructor(quotesAdp: IQuotesAdapter) {
        this.quotesAdapter = quotesAdp
    }

     createQuote(): void  {
        // todo implement
         this.quotesAdapter.createQuote()
    }

     getQuote():  void{
        // todo implement
         this.quotesAdapter.getQuote()
    }
}