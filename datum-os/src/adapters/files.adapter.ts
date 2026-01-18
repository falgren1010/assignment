import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import {eq} from "drizzle-orm";
import type {IFilesAdapter} from "../services/files.service.js";
import type {FileDetails} from "../services/models/models.js";

import {fileDetails, files} from "../infrastructure/databases/postgres/schemas.js";
import {InternalServerError, NotFoundError} from "../services/models/errors.js";

type FileDetailsInsert = typeof fileDetails.$inferInsert;
type FileInsert = typeof files.$inferInsert;


export class FilesAdapter implements IFilesAdapter {

    private filesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.filesDB = db
    }

    async uploadFileToDatabase(file: File): Promise<string>{
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        const base64Data = fileBuffer.toString("base64");

        const dbObject: FileInsert = {
            name: file.name,
            dataBase64: base64Data,
        }

        const insertResult = await this.filesDB
            .insert(files)
            .values(dbObject)
            .returning();

        if (insertResult.length === 0) {
            throw(new InternalServerError("DB Error: File upload failed"))
        }

        return insertResult[0].id
    }

    async createFileDetails(details: FileDetails):  Promise<FileDetails> {
        const dbObject: FileDetailsInsert = {
            originalName: details.originalName,
            storagePath: details.storagePath,
            sizeBytes: details.sizeBytes,
            mimeType: details.mimeType,
            geometry: details.geometry ?? null,
        };

        const insertResult = await this.filesDB
            .insert(fileDetails)
            .values(dbObject)
            .returning();

        const dbDetails = insertResult[0]

        if (!dbDetails) {
            throw(new InternalServerError("DB Error: File insert failed"))
        }

        return {
                id: dbDetails.id,
                originalName: dbDetails.originalName,
                storagePath: dbDetails.storagePath,
                sizeBytes: dbDetails.sizeBytes,
                mimeType: dbDetails.mimeType,
                geometry: dbDetails.geometry,
                uploadedAt: dbDetails.uploadedAt,
            }
    }


    async getFileDetails(id: string): Promise<FileDetails> {
        const getResult = await this.filesDB
            .select()
            .from(fileDetails)
            .where(eq(fileDetails.id, id))
            .limit(1)

        const dbDetails = getResult[0]

        if (!dbDetails) {
            throw(new NotFoundError("DB Error: FileDetails not found"))
        }

        return {
            id: dbDetails.id,
            originalName: dbDetails.originalName,
            storagePath: dbDetails.storagePath,
            sizeBytes: dbDetails.sizeBytes,
            mimeType: dbDetails.mimeType,
            geometry: dbDetails.geometry,
            uploadedAt: dbDetails.uploadedAt,
        }
    }
}