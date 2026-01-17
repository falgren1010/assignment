import type {IFilesService} from "../controllers/files.controller.js";

export interface IFilesAdapter{
    uploadFile(): void
    getFile(): void
}

export class FilesService implements IFilesService{
    private filesAdapter: IFilesAdapter

    constructor(filesAdp: IFilesAdapter) {
        this.filesAdapter = filesAdp
    }

    uploadFile(): void {
        // todo validation func
        this.filesAdapter.uploadFile()

    }

    getFile(): void {
        // todo id validation
        this.filesAdapter.getFile()
    }
}