import type {IFilesService} from "../controllers/files.controller.js";
import type {Result} from "./models/common.models.js";
import type {FileDetails, GeometryProperties, GeometryResult} from "./models/models.js";
import {ValidationError} from "./models/errors.js";
import { validate } from "uuid";

export interface IFilesAdapter{
    uploadFileToDatabase(file: File): Promise<string>
    createFileDetails(fileDetails: FileDetails): Promise<FileDetails>
    getFileDetails(id: string): Promise<FileDetails>
}

export interface IGeometryServiceAdapter{
    extractProperties(fileBuffer: Buffer): Promise<GeometryResult>
}

export class FilesService implements IFilesService{
    private filesAdapter: IFilesAdapter
    private geometryServiceAdapter: IGeometryServiceAdapter

    constructor(filesAdp: IFilesAdapter, geoServiceAdapter: IGeometryServiceAdapter) {
        this.filesAdapter = filesAdp
        this.geometryServiceAdapter = geoServiceAdapter
    }

    async uploadFile(file: File): Promise<FileDetails> {
        const validation = this.validateFile(file)
        if(!validation.success){
            throw(new ValidationError("ValidationError: " + validation.message))
        }

        // extract buffer from file
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const geoResult = await this.geometryServiceAdapter.extractProperties(fileBuffer)

        const uploadResult = await this.filesAdapter.uploadFileToDatabase(file)

        const fileDetails = this.extractFileDetails(uploadResult, file, geoResult.properties!);

        return await this.filesAdapter.createFileDetails(fileDetails)
    }

    async getFileDetails(id: string): Promise<FileDetails> {
        if(validate(id)){
            throw(new ValidationError("Invalid ID"))
        }

        return await this.filesAdapter.getFileDetails(id)
    }


    // Helper Functions ---------------------------------------------------------------------------

    private validateFile(file: File): Result<boolean> {
        if(!file) {
            return { success: false, message: "No File" }
        }
        if( !(file.name.endsWith(".step") || file.name.endsWith(".stp")) ) {
            return { success: false, message: "Invalid File Type" }
        }
        if (file.size > 50_000_000){
            return { success: false, message: "File to big (max. 50MB)" }
        }

        return { success: true, data: null }
    }

    private extractFileDetails(dbFileID: string, file: File, geoData: GeometryProperties): FileDetails{
        return {
            originalName: file.name,
            storagePath: dbFileID,
            sizeBytes: file.size,
            mimeType: file.type,
            geometry: geoData,
            uploadedAt: new Date()
        }
    }
}