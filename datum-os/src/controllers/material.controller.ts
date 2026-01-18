import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {Material} from "../services/models/models.js"
import {renderError} from "./common.js";
import {AppError} from "../services/models/errors.js";

export interface IMaterialService{
    listMaterial(): Promise<Material[]>
}

export class MaterialController implements RouteInitializer{
    private materialService: IMaterialService

    constructor(materialScv: IMaterialService) {
        this.materialService = materialScv
    }

    public initRoutes(router: Hono) {
        router.get("/api/materials", this.listMaterial)
    }

    private listMaterial = async (c: Context) => {
        try{
            const materials = await this.materialService.listMaterial()

            return c.json(materials, 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }
}