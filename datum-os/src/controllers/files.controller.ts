import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";

export interface IFilesService {
    uploadFile(): void
    getFile(): void
}

export class FilesController implements RouteInitializer {
    private filesService: IFilesService

    constructor(filesScv: IFilesService) {
        this.filesService= filesScv
    }

    public initRoutes(router: Hono) {
        router.post("/api/files/upload", this.uploadFile)
        router.get("/api/files/:id", this.getFile)
    }

    private uploadFile = async (c: Context) => {
        this.filesService.uploadFile()

        return c.text("Internal Server Error", 500)
    }

    private getFile = async (c: Context) => {
        this.filesService.getFile()

        return c.text("Internal Server Error", 500)
    }
}