import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import type {IFilesAdapter} from "../services/files.service.js";

export interface IFilesDatabase {
    find(): void
    save(): void
}

export class FilesAdapter implements IFilesAdapter {

    private filesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.filesDB = db
    }

    uploadFile(): void {
        throw new Error("Method not implemented.");
    }
    getFile(): void {
        throw new Error("Method not implemented.");
    }


}