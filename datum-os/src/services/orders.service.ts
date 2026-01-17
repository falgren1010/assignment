import type {IOrdersService} from "../controllers/orders.controller.js";
import type {Order} from "./models/models.js";
import type {Result} from "./models/common.models.js";

export interface IOrdersAdapter{
    createOrder(order: Order): Promise<Result<void>>
    getOrder(): void
    processPayment(): void
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

     getOrder(): void {
        // todo implement
         this.ordersAdapter.getOrder()

    }

     processPayment(): void {
        // todo implement
         this.ordersAdapter.processPayment()
    }
}