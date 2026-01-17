import type {IFilesService} from "../controllers/files.controller.js";
import type {Result} from "./models/common.models.js";
import type {File as FileDetails} from "./models/models.js";

export interface IFilesAdapter{
    uploadFile(file: File): Promise<Result<void>>
    getFileDetails(id: string): Promise<Result<FileDetails>>
}

export class FilesService implements IFilesService{
    private filesAdapter: IFilesAdapter

    constructor(filesAdp: IFilesAdapter) {
        this.filesAdapter = filesAdp
    }

    async uploadFile(file: File): Promise<Result<void>> {
        // todo validation func

        const result = await this.filesAdapter.uploadFile(file)
        if (!result.success){
            return { success: false, message: "Error uploading File: " + result.message }
        }

        return { success: true, data: null }
    }

    async getFileDetails(id: string): Promise<Result<FileDetails>> {
        // todo id validation

        const result = await this.filesAdapter.getFileDetails(id)
        if (!result.success){
            return { success: false, message: "Not Found: " + result.message }
        }

        return { success: true, data: result.data }
    }
}