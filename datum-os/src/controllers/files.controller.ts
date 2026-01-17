import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export class FilesController implements RouteInitializer {

    constructor() {
    }

    public initRoutes(router: Hono) {
        router.post("/api/files/upload", this.uploadFile)
        router.get("/api/files/:id", this.getFile)
    }

    private uploadFile = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }

    private getFile = async (c: Context) => {
        return c.text("Internal Server Error", 500)
    }
}