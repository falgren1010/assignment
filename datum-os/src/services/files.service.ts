import type {IFilesService} from "../controllers/files.controller.js";
import type {Result} from "./models/common.models.js";
import type {File as FileDetails, GeometryProperties, GeometryResult} from "./models/models.js";

export interface IFilesAdapter{
    uploadFileToDatabase(file: File): Promise<Result<string>>
    createFileDetails(fileDetails: FileDetails): Promise<Result<FileDetails>>
    getFileDetails(id: string): Promise<Result<FileDetails>>
}

export interface IGeometryServiceAdapter{
    extractProperties(fileBuffer: Buffer): Promise<Result<GeometryResult>>;
}

export class FilesService implements IFilesService{
    private filesAdapter: IFilesAdapter
    private geometryServiceAdapter: IGeometryServiceAdapter

    constructor(filesAdp: IFilesAdapter, geoServiceAdapter: IGeometryServiceAdapter) {
        this.filesAdapter = filesAdp
        this.geometryServiceAdapter = geoServiceAdapter
    }

    async uploadFile(file: File): Promise<Result<void>> {
        const validation = this.validateFile(file)
        if(!validation.success){
            return { success: false, message: "Error File Validation:" + validation.message }
        }

        // extract buffer from file
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const geoResult = await this.geometryServiceAdapter.extractProperties(fileBuffer)
        if (!geoResult.success){
            return { success: false, message: "Error extracting properties: " + geoResult.message }
        }

        const uploadResult = await this.filesAdapter.uploadFileToDatabase(file)
        if (!uploadResult.success){
            return { success: false, message: "Error uploading File to DB: " + uploadResult.message }
        }

        // check if data is truly present since result.data could be null
        if (!uploadResult.data) {
            return { success: false, message: "File upload returned no data" };
        }
        if (!geoResult.data || !geoResult.data.properties) {
            return { success: false, message: "Geometry result incomplete" };
        }

        const fileDetails = this.extractFileDetails(uploadResult.data, file, geoResult.data.properties);

        const detailsResult = await this.filesAdapter.createFileDetails(fileDetails)
        if (!detailsResult.success){
            return { success: false, message: "Error uploading File to DB: " + detailsResult.message }
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
            id: file.name, //overwritten by postgres later
            originalName: file.name,
            storagePath: dbFileID,
            sizeBytes: file.size,
            mimeType: file.type,
            geometry: geoData,
            uploadedAt: new Date()
        }
    }
}