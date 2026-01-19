import type {IQuotesService} from "../controllers/quotes.controller.js";
import type {Discount, FileDetails, Material, Quote, QuoteRequest} from "./models/models.js";
import type {IFilesAdapter} from "./files.service.js";
import type {IMaterialAdapter} from "./material.service.js";

export interface IQuotesAdapter{
    createQuote(quote: Quote): Promise<Quote>
    getQuote(id: string): Promise<Quote>
}

export class QuotesService implements IQuotesService{
    private quotesAdapter: IQuotesAdapter
    private filesAdapter: IFilesAdapter
    private materialAdapter: IMaterialAdapter

    constructor(quotesAdp: IQuotesAdapter, filesAdp: IFilesAdapter, materialsAdp: IMaterialAdapter) {
        this.quotesAdapter = quotesAdp
        this.filesAdapter = filesAdp
        this.materialAdapter= materialsAdp
    }

    async createQuote(quoteRequest: QuoteRequest): Promise<Quote> {
        // todo validation of ids -> regex

        const fileDetails = await this.filesAdapter.getFileDetails(quoteRequest.fileID)
        const material = await this.materialAdapter.getMaterial(quoteRequest.materialID)

        const createdQuote = this.createInitialQuote(fileDetails, material, quoteRequest.quantity)

        return await this.quotesAdapter.createQuote(createdQuote)
    }

    async getQuote(id: string): Promise<Quote> {
        // todo validation of ids -> regex

        return await this.quotesAdapter.getQuote(id)
    }


    // Helper Functions ---------------------------------------------------------------------------

    private createInitialQuote(fileDetails: FileDetails, material: Material, quantity: number ): Quote {
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + 7);


        const discountPercent = this.calculateDiscount(quantity)
        const unitPrice = fileDetails.geometry!.volumeCm3 * material.price
        const subtotal = unitPrice * quantity
        const quantityDiscount = subtotal - subtotal * (1 - discountPercent / 100)
        const totalPrice = subtotal - quantity

        return {
            fileId: fileDetails.id!,
            materialId: material.id!,
            materialName: material.name,
            materialPriceFactor: subtotal / fileDetails.geometry!.volumeCm3,
            quantity: quantity,
            quantityDiscount: quantityDiscount,
            status: "ready",
            totalPrice: totalPrice,
            unitPrice: unitPrice,
            volumeCm3: fileDetails.geometry!.volumeCm3,
            createdAt: new Date(),
            expiresAt: expiresDate,
        }

    }

    private calculateDiscount(quantity: number): number{

        // should be stored in DB and data-driven for CRUD too in case this needs to be changed
        // just hardcoded for time-saving purposes
        const discounts: Discount[] = [
            { min: 1, max: 4, discountPercent: 0 },
            { min: 5, max: 9, discountPercent: 5 },
            { min: 10, max: 24, discountPercent: 10 },
            { min: 25, max: 49, discountPercent: 15 },
            { min: 50, discountPercent: 20 },
        ];

        const discountRule = discounts.find(
            r => quantity >= r.min && (r.max === undefined || quantity <= r.max)
        );

        return discountRule?.discountPercent ?? 0;

    }
}

