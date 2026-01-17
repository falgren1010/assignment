import {Hono} from "hono";
import { NodePgDatabase} from "drizzle-orm/node-postgres";
import  {FilesController} from "../controllers/files.controller.js";
import  {MaterialController} from "../controllers/material.controller.js";
import  {OrdersController} from "../controllers/orders.controller.js";
import  {QuotesController} from "../controllers/quotes.controller.js";

export interface RouteInitializer{
    initRoutes(router: Hono): void
}

export class Registry{
    private database: NodePgDatabase

    private router : Hono

    private filesController: FilesController
    private materialController: MaterialController
    private ordersController: OrdersController
    private quotesController: QuotesController

    constructor(db: NodePgDatabase){
        this.database = db

        this.router = new Hono()

        this.filesController = new FilesController()
        this.materialController = new MaterialController()
        this.ordersController = new OrdersController()
        this.quotesController = new QuotesController()
    }

    public getRouter(): Hono{
        return this.router
    }

    public initRoutes(){
        const controllers: RouteInitializer[] = [
            this.filesController,
            this.materialController,
            this.ordersController,
            this.quotesController
        ]

        controllers.forEach((ctrl: RouteInitializer) => {
            ctrl.initRoutes(this.router)
        })
    }

}