import {Hono} from "hono";
import { NodePgDatabase} from "drizzle-orm/node-postgres";
import  {FilesController} from "../controllers/files.controller.js";
import  {MaterialController} from "../controllers/material.controller.js";
import  {OrdersController} from "../controllers/orders.controller.js";
import  {QuotesController} from "../controllers/quotes.controller.js";
import  {FilesService} from "../services/files.service.js";
import  {MaterialService} from "../services/material.service.js";
import  {OrdersService} from "../services/orders.service.js";
import  {QuotesService} from "../services/quotes.service.js";

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

    private filesService: FilesService
    private materialService: MaterialService
    private ordersService: OrdersService
    private quotesService: QuotesService

    constructor(db: NodePgDatabase){
        this.database = db

        this.router = new Hono()

        this.filesService = new FilesService()
        this.materialService = new MaterialService()
        this.ordersService = new OrdersService()
        this.quotesService = new QuotesService()

        this.filesController = new FilesController(this.filesService)
        this.materialController = new MaterialController(this.materialService)
        this.ordersController = new OrdersController(this.ordersService)
        this.quotesController = new QuotesController(this.quotesService)
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