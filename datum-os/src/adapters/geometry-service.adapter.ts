import type {GeometryResult} from "../services/models/models.js";
import type {IGeometryServiceAdapter} from "../services/files.service.js";
import {InternalServerError} from "../services/models/errors.js";

export interface IGeometryService {
    extractProperties(fileBuffer: Buffer): Promise<GeometryResult>;
}

export class GeometryServiceAdapter implements IGeometryServiceAdapter {
    // hardcoded only for testing/assignment -> should be set globally in config or via .env
    private static readonly TIMEOUT_MS = 15000; // 15 sec
    private static readonly MAX_ATTEMPTS = 3;

    constructor(private readonly geometryService: IGeometryService) {}

    async extractProperties(fileBuffer: Buffer): Promise<GeometryResult> {
        for (let attempt = 1; attempt <= GeometryServiceAdapter.MAX_ATTEMPTS; attempt++) {
            try {
                return await withTimeout(
                    this.geometryService.extractProperties(fileBuffer),
                    GeometryServiceAdapter.TIMEOUT_MS
                )

            } catch {
                if (attempt >= GeometryServiceAdapter.MAX_ATTEMPTS) {
                    throw (new InternalServerError("Unexpected Error: Geometry Service failed or not available"))
                }
            }
        }

        throw (new InternalServerError("Unexpected Error: Geometry Service failed or not available"))
    }
}



// Timeout Error Helper Class ---------------------------------------------------------------

class TimeoutError extends Error {
    constructor() {
        super("Error Geometry Service timeout");
        this.name = "TimeoutError";
    }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new TimeoutError()), ms);

        promise
            .then((res) => {
                clearTimeout(timer);
                resolve(res);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}
