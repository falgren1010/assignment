import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {IFilesAdapter} from "../services/files.service.js";
import type {File as FileDetails} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";

export interface IFilesDatabase {
    find(): void
    save(): void
}

export class FilesAdapter implements IFilesAdapter {

    private filesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.filesDB = db
    }

    uploadFile(file: File): Promise<Result<void>>{
        //rm later
        console.log(file)
        const result: Result<void> = {
            data: null,
            success: true
        };

        return Promise.resolve(result);
    }

    getFileDetails(id: string): Promise<Result<FileDetails>>{
        //rm later
        console.log(id)
        const result: Result<FileDetails> = {
            data: {
                id: "",
                originalName: "",
                storagePath: "",
                sizeBytes: 0,
                mimeType: "",
                geometry: null,
                uploadedAt: new Date()
            },
            success: true
        };

        return Promise.resolve(result);
    }
}