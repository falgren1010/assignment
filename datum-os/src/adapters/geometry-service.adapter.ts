import type {GeometryResult} from "../services/models/models.js";
import type { Result } from "../services/models/common.models.js";
import type {IGeometryServiceAdapter} from "../services/files.service.js";

export interface IGeometryService {
    extractProperties(fileBuffer: Buffer): Promise<GeometryResult>;
}

export class GeometryServiceAdapter implements IGeometryServiceAdapter {
    // hardcoded only for testing/assignment -> should be set globally in config or via .env
    private static readonly TIMEOUT_MS = 15000; // 15 sec
    private static readonly MAX_ATTEMPTS = 3;

    constructor(private readonly geometryService: IGeometryService) {}

    async extractProperties(fileBuffer: Buffer): Promise<Result<GeometryResult>> {
        for (let attempt = 1; attempt <= GeometryServiceAdapter.MAX_ATTEMPTS; attempt++) {
            try {
                const geoData = await withTimeout(
                    this.geometryService.extractProperties(fileBuffer),
                    GeometryServiceAdapter.TIMEOUT_MS
                );

                return {success: true, data: geoData}

            } catch (err) {
                if (attempt >= GeometryServiceAdapter.MAX_ATTEMPTS) {
                    return {
                        success: false,
                        message: err instanceof Error
                            ? err.message
                            : "Geometry Service failed or not available"
                    };
                }
            }
        }

        return {success: false, message: "Geometry Service failed or not available"}
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
