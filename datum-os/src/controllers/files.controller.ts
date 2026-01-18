import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {Result} from "../services/models/common.models.js";
import type {FileDetails} from "../services/models/models.js"

export interface IFilesService {
    uploadFile(file: File): Promise<Result<FileDetails>>
    getFileDetails(id: string): Promise<Result<FileDetails>>
}

export class FilesController implements RouteInitializer {
    private filesService: IFilesService

    constructor(filesScv: IFilesService) {
        this.filesService= filesScv
    }

    public initRoutes(router: Hono) {
        router.post("/api/files/upload", this.uploadFile)
        router.get("/api/files/:id", this.getFileDetails)
    }

    private uploadFile = async (c: Context) => {
        try {
            const form = await c.req.parseBody()
            const file = form["file"] as File

            const result = await this.filesService.uploadFile(file)
            if (!result.success) {
                return c.text("Error: " + result.message, 400)
            }

            return c.json(result.data, 200)

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            return c.text("Internal Server Error: " + msg, 500)
        }
    }

    private getFileDetails = async (c: Context) => {
        try{
            const id = c.req.param("id")

            const result = await this.filesService.getFileDetails(id)
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