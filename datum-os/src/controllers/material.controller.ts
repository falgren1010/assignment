import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export class MaterialController implements RouteInitializer{

    constructor() {
    }

    public initRoutes(router: Hono) {
        router.get("/api/materials", this.listMaterial)
    }

    private listMaterial = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }
}