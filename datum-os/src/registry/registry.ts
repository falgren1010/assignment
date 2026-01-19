import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {FilesController} from "../controllers/files.controller.js";
import {MaterialController} from "../controllers/material.controller.js";
import {OrdersController} from "../controllers/orders.controller.js";
import {QuotesController} from "../controllers/quotes.controller.js";
import {FilesService} from "../services/files.service.js";
import {MaterialService} from "../services/material.service.js";
import {OrdersService} from "../services/orders.service.js";
import {QuotesService} from "../services/quotes.service.js";
import {FilesAdapter} from "../adapters/files.adapter.js";
import {MaterialAdapter} from "../adapters/material.adapter.js";
import {OrdersAdapter} from "../adapters/orders.adapter.js";
import {QuotesAdapter} from "../adapters/quotes.adapter.js";
import {Hono} from "hono";
import { cors } from "hono/cors";
import {MockGeometryService} from "../mockGeometryService/mock-geometry-service.js";
import {GeometryServiceAdapter} from "../adapters/geometry-service.adapter.js";
import "dotenv/config";

export interface RouteInitializer{
    initRoutes(router: Hono): void
}

export class Registry {
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

    private filesAdapter: FilesAdapter
    private materialAdapter: MaterialAdapter
    private ordersAdapter: OrdersAdapter
    private quotesAdapter: QuotesAdapter
    private geometryServiceAdapter: GeometryServiceAdapter

    private geometryServiceMock: MockGeometryService


    constructor(db: NodePgDatabase) {
        this.database = db

        this.router = new Hono()

        this.geometryServiceMock = new MockGeometryService()

        this.filesAdapter = new FilesAdapter(this.database)
        this.materialAdapter = new MaterialAdapter(this.database)
        this.ordersAdapter = new OrdersAdapter(this.database)
        this.quotesAdapter = new QuotesAdapter(this.database)
        this.geometryServiceAdapter = new GeometryServiceAdapter(this.geometryServiceMock)

        this.filesService = new FilesService(this.filesAdapter, this.geometryServiceAdapter)
        this.materialService = new MaterialService(this.materialAdapter)
        this.ordersService = new OrdersService(this.ordersAdapter)
        this.quotesService = new QuotesService(this.quotesAdapter, this.filesAdapter, this.materialAdapter)

        this.filesController = new FilesController(this.filesService)
        this.materialController = new MaterialController(this.materialService)
        this.ordersController = new OrdersController(this.ordersService)
        this.quotesController = new QuotesController(this.quotesService)
    }

    public getRouter(): Hono{
        return this.router
    }

    public initRoutes(){
        this.router.use("*", cors({
            origin: process.env.FRONTEND_URL!,
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowHeaders: ["Content-Type"], }))

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
