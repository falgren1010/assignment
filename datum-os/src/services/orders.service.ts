import type {IOrdersService} from "../controllers/orders.controller.js";
import type {Order, StripePaymentIntent} from "./models/models.js";
import {validate} from "uuid";
import {ValidationError} from "./models/errors.js";

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
         // todo validate object

         return await this.ordersAdapter.createOrder(order)
    }

     async getOrder(id: string):  Promise<Order> {
         if(validate(id)){
             throw(new ValidationError("Invalid ID"))
         }

        return await this.ordersAdapter.getOrder(id)
    }

    async processPayment(paymentIntent: StripePaymentIntent):  Promise<void> {
        // todo validate object

         return await this.ordersAdapter.processPayment(paymentIntent)
    }

}