import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export interface IOrdersService{
    createOrder(): void
    getOrder(): void
    processPayment(): void
}

export class OrdersController implements RouteInitializer{
    private ordersService: IOrdersService

    constructor(ordersScv: IOrdersService) {
        this.ordersService = ordersScv
    }

    public initRoutes(router: Hono) {
        router.post("/api/orders", this.createOrder)
        router.get("/api/orders/:id", this.getOrder)
        router.post("/api/orders/:id/payment", this.processPayment)
    }

    private createOrder = async (c: Context) => {
        this.ordersService.createOrder()

        return c.text("Internal Server Error", 500)
    }

    private getOrder = async (c: Context) => {
        this.ordersService.getOrder()

        return c.text("Internal Server Error", 500)
    }

    private processPayment = async (c: Context) => {
        this.ordersService.processPayment()

        return c.text("Internal Server Error", 500)
    }
}