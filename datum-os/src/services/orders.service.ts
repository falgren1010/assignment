import type {IOrdersService} from "../controllers/orders.controller.js";

export interface IOrdersAdapter{
    createOrder(): void
    getOrder(): void
    processPayment(): void
}

export class OrdersService implements IOrdersService{
    private ordersAdapter: IOrdersAdapter

    constructor(ordersAdp: IOrdersAdapter) {
        this.ordersAdapter = ordersAdp
    }

     createOrder(): void {
        // todo implement
        this.ordersAdapter.createOrder()
    }

     getOrder(): void {
        // todo implement
         this.ordersAdapter.getOrder()

    }

     processPayment(): void {
        // todo implement
         this.ordersAdapter.processPayment()
    }
}