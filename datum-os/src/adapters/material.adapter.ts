import type {IMaterialAdapter} from "../services/material.service.js";
import type { Result } from "../services/models/common.models.js";
import type {Material, MaterialPrice} from "../services/models/models.js";
import type {NodePgDatabase} from "drizzle-orm/node-postgres";

export interface IMaterialDatabase {
    find(): void
}

export class MaterialAdapter implements IMaterialAdapter {

    private filesDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.filesDB = db
    }

    listMaterial(): Promise<Result<Material[]>> {

        const result: Result<Material[]> = {
            data: [],
            success: true
        };

        return Promise.resolve(result);

    }

    getMaterialPrice():  Promise<Result<MaterialPrice>>{
        const result: Result<MaterialPrice> = {
            data: {
                materialCode: "",
                materialPrice: 0,
                validFrom: new Date(),
                validTo: null
            },
            success: true
        };

        return Promise.resolve(result);
    }
}