import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {Order, StripePaymentIntent} from "../services/models/models.js";
import {AppError} from "../services/models/errors.js";
import {renderError} from "./common.js";

export interface IOrdersService{
    createOrder(order: Order): Promise<string>
    getOrder(id: string): Promise<Order>
    processPayment(paymentIntent: StripePaymentIntent): Promise<void>
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

            return c.json(result, 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }

    private getOrder = async (c: Context) => {
        try{
            const id = c.req.param("id")

            const order = await this.ordersService.getOrder(id)

            return c.json(order, 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }

    private processPayment = async (c: Context) => {
        try {
            const paymentIntent = await c.req.json<StripePaymentIntent>()
            await this.ordersService.processPayment(paymentIntent)

            return c.text("OK", 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }
}