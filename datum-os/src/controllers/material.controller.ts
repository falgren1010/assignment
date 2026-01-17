import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export interface IMaterialService{
    listMaterial(): void
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
        this.materialService.listMaterial()

        return c.text("Internal Server Error", 500)
    }
}