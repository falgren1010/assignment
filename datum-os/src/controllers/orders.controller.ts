import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export class OrdersController implements RouteInitializer{

    constructor() {
    }

    public initRoutes(router: Hono) {
        router.post("/api/orders", this.createOrder)
        router.get("/api/orders/:id", this.getOrder)
        router.post("/api/orders/:id/payment", this.processPayment)
    }

    private createOrder = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }

    private getOrder = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }

    private processPayment = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }
}