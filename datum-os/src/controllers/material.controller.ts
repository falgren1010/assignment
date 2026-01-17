import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {Result} from "../services/models/common.models.js";
import type {Material} from "../services/models/models.js"

export interface IMaterialService{
    listMaterial(): Promise<Result<Material[]>>
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
            const result = await this.materialService.listMaterial()
            if (!result.success) {
                return c.text("Bad Request: " + result.message, 400)
            }

            return c.json(result.data, 200)

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"

            return c.text("Internal Server Error: " + msg, 500)
        }
    }
}