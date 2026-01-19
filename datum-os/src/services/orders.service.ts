import type {IOrdersService} from "../controllers/orders.controller.js";
import type {Order, StripePaymentIntent} from "./models/models.js";

export interface IOrdersAdapter{
    createOrder(order: Order): Promise<Order>
    getOrder(id: string): Promise<Order>
    processPayment(paymentIntent: StripePaymentIntent): Promise<void>
}

export class OrdersService implements IOrdersService{
    private ordersAdapter: IOrdersAdapter

    constructor(ordersAdp: IOrdersAdapter) {
        this.ordersAdapter = ordersAdp
    }

     async createOrder(order: Order): Promise<Order> {
         return await this.ordersAdapter.createOrder(order)
    }

     async getOrder(id: string):  Promise<Order> {
         //todo validation of ids -> regex

        return await this.ordersAdapter.getOrder(id)
    }

    async processPayment(paymentIntent: StripePaymentIntent):  Promise<void> {
         return await this.ordersAdapter.processPayment(paymentIntent)
    }

}