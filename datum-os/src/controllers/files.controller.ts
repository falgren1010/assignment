import type {RouteInitializer} from "../registry/registry.js";
import type {Context, Hono} from "hono";
import type {FileDetails} from "../services/models/models.js"
import {renderError} from "./common.js";
import {AppError} from "../services/models/errors.js";

export interface IFilesService {
    uploadFile(file: File): Promise<FileDetails>
    getFileDetails(id: string): Promise<FileDetails>
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

            const fileDetails = await this.filesService.uploadFile(file)

            return c.json(fileDetails, 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }

    private getFileDetails = async (c: Context) => {
        try{
            const id = c.req.param("id")
            const fileDetails = await this.filesService.getFileDetails(id)

            return c.json(fileDetails, 200)

        } catch (err) {
            if(err instanceof AppError){
                return renderError(err, c)
            }
            return c.text("Internal Server Error: Unknown Error ", 500)
        }
    }
}