import type {IOrdersService} from "../controllers/orders.controller.js";
import type {Order, StripePaymentIntent} from "./models/models.js";
import type {Result} from "./models/common.models.js";

export interface IOrdersAdapter{
    createOrder(order: Order): Promise<Result<void>>
    getOrder(id: string): Promise<Result<Order>>
    processPayment(paymentIntent: StripePaymentIntent): Promise<Result<void>>
}

export class OrdersService implements IOrdersService{
    private ordersAdapter: IOrdersAdapter

    constructor(ordersAdp: IOrdersAdapter) {
        this.ordersAdapter = ordersAdp
    }

     async createOrder(order: Order): Promise<Result<void>> {
        const result = await this.ordersAdapter.createOrder(order)
        if(!result.success){
            return { success: false, message: "Error creating Order: " + result.message }
        }

        return { success: true, data: result.data }
    }

     async getOrder(id: string):  Promise<Result<Order>> {
         const result = await this.ordersAdapter.getOrder(id)
         if (!result.success){
             return { success: false, message: "Error getting Order:" + result.message }
         }

         return { success: true, data: result.data }
    }

    async processPayment(paymentIntent: StripePaymentIntent):  Promise<Result<void>> {
        const result = await this.ordersAdapter.processPayment(paymentIntent)
        if (!result.success){
            return { success: false, message: "Error Payment Processing:" + result.message }
        }

        return { success: true, data: null }
    }
}