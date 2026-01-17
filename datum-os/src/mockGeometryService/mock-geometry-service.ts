import type {GeometryResult} from "../services/models/models.js";
import type {IGeometryService} from "../adapters/geometry-service.adapter.js"


export class MockGeometryService implements IGeometryService {
    async extractProperties(fileBuffer: Buffer): Promise<GeometryResult> {

        console.log("Calculating geometry data...")
        console.log("Buffer size:", fileBuffer.length);

        // simulated calculation time -> 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        // For: Blisk.step
        return {
            success: true,
            properties: {
                boundingBox: {x: 250, y: 250, z: 45},
                volume: 2812500,      // mm³
                volumeCm3: 2812.5,    // cm³
                surfaceArea: 486000,  // mm²
            },
            processingTimeMs: 8047,
        }
    }
}

