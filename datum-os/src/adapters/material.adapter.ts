import type {IMaterialAdapter} from "../services/material.service.js";
import type { Result } from "../services/models/common.models.js";
import type {Material} from "../services/models/models.js";

export class MaterialAdapter implements IMaterialAdapter {

    constructor() {
    }

    listMaterial(): Promise<Result<Material[]>> {
        const result: Result<Material[]> = {
            data: [],
            success: true
        };

        return Promise.resolve(result);

    }
}