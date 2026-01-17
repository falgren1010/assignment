import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {Order, StripePaymentIntent} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";

export interface IOrdersService{
    createOrder(order: Order): Promise<Result<void>>
    getOrder(id: string): Promise<Result<Order>>
    processPayment(paymentIntent: StripePaymentIntent): Promise<Result<void>>
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
        try {
            const order = await c.req.json<Order>()

            const result = await this.ordersService.createOrder(order)
            if (!result.success) {
                return c.text("Bad Request: " + result.message, 400)
            }

            return c.text("OK", 200)

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"

            return c.text("Internal Server Error: " + msg, 500)
        }
    }

    private getOrder = async (c: Context) => {
        try{
            const id = c.req.param("id")

            const result = await this.ordersService.getOrder(id)
            if (!result.success) {
                return c.text("Bad Request: " + result.message, 400)
            }

            return c.json(result.data, 200)

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"

            return c.text("Internal Server Error: " + msg, 500)
        }
    }

    private processPayment = async (c: Context) => {
        try {
            const paymentIntent = await c.req.json<StripePaymentIntent>()

            const result = await this.ordersService.processPayment(paymentIntent)
            if (!result.success) {
                return c.text("Bad Request: " + result.message, 400)
            }

            return c.text("OK", 200)

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"

            return c.text("Internal Server Error: " + msg, 500)
        }
    }
}