import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import {eq} from "drizzle-orm";
import type {IFilesAdapter} from "../services/files.service.js";
import type {FileDetails} from "../services/models/models.js";
import type {Result} from "../services/models/common.models.js";

import { fileDetails, files } from "../infrastructure/databases/postgres/schemas.js";
type FileDetailsInsert = typeof fileDetails.$inferInsert;
type FileInsert = typeof files.$inferInsert;


export class FilesAdapter implements IFilesAdapter {

    private filesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.filesDB = db
    }

    async uploadFileToDatabase(file: File): Promise<Result<string>>{
        try{
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

            return {success: true, data: insertResult[0].id}

        } catch (err){
            const msg = err instanceof Error ? err.message : "Unknown error"
            return {success: false, message: "DB Error: File Upload Failed"+ msg}
        }

    }

    async createFileDetails(details: FileDetails):  Promise<Result<FileDetails>> {
        const dbObject: FileDetailsInsert = {
            originalName: details.originalName,
            storagePath: details.storagePath,
            sizeBytes: details.sizeBytes,
            mimeType: details.mimeType,
            geometry: details.geometry ?? null,
        };

        try {
            const insertResult = await this.filesDB
                .insert(fileDetails)
                .values(dbObject)
                .returning();

            const dbDetails = insertResult[0]

            if (!dbDetails) {
                return { success: false, message: "DB Error: Insert Failed"}
            }

            const domainDetails: FileDetails = {
                id: dbDetails.id,
                originalName: dbDetails.originalName,
                storagePath: dbDetails.storagePath,
                sizeBytes: dbDetails.sizeBytes,
                mimeType: dbDetails.mimeType,
                geometry: dbDetails.geometry,
                uploadedAt: dbDetails.uploadedAt,
            };

            return { success: true, data: domainDetails };

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            return {success: false, message: "DB Error: Insert Failed"+ msg}
        }
    }


    async getFileDetails(id: string): Promise<Result<FileDetails>> {
        try {
            const getResult = await this.filesDB
                .select()
                .from(fileDetails)
                .where(eq(fileDetails.id, id))
                .limit(1)

            const dbDetails = getResult[0]

            if (!dbDetails) {
                return { success: false, message: "DB Error: FileDetails Not Found"}
            }

            const details: FileDetails = {
                id: dbDetails.id,
                originalName: dbDetails.originalName,
                storagePath: dbDetails.storagePath,
                sizeBytes: dbDetails.sizeBytes,
                mimeType: dbDetails.mimeType,
                geometry: dbDetails.geometry,
                uploadedAt: dbDetails.uploadedAt,
            };

            return { success: true, data: details };

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            return {success: false, message: "DB Error: Retrieving FileDetails" + msg}
        }
    }
}