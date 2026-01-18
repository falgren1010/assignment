import type {IMaterialAdapter} from "../services/material.service.js";
import type { Result } from "../services/models/common.models.js";
import type {Material, MaterialPrice} from "../services/models/models.js";
import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import {eq, and, isNull} from "drizzle-orm";

import { materialPrices, materials } from "../infrastructure/databases/postgres/schemas.js";


export class MaterialAdapter implements IMaterialAdapter {

    private materialsDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.materialsDB = db
    }

    async listMaterial(): Promise<Result<Material[]>> {

        try {
            const getResult = await this.materialsDB
                .select()
                .from(materials)

            if (getResult.length === 0) {
                return { success: false, message: "DB Error: Materials Not Found"}
            }

            const materialList: Material[] = []

            getResult.forEach((m) =>{
                materialList.push({
                    id: m.id,
                    name: m.name,
                    code: m.code,
                    price: Number(m.price),
                    leadTime: m.leadTime,
                    properties: m.properties,
                    available: m.available
                })
            })

            return { success: true, data: materialList };

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            return {success: false, message: "DB Error: Retrieving Materials" + msg}
        }

    }

    async getMaterialPrice(materialCode: string):  Promise<Result<MaterialPrice>>{
        try {
            const getResult = await this.materialsDB
                .select()
                .from(materialPrices)
                .where(and(eq(materialPrices.materialCode, materialCode), isNull(materialPrices.validTo)))
                .limit(1)

            const dbPrice = getResult[0]

            if (!dbPrice) {
                return { success: false, message: "DB Error: Material Price Not Found"}
            }

            const materialPrice: MaterialPrice = {
                id: dbPrice.id,
                materialCode: dbPrice.materialCode,
                materialPrice: Number(dbPrice.materialPrice),
                validFrom: dbPrice.validFrom,
                validTo: dbPrice.validTo
            };

            return { success: true, data: materialPrice };

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            return {success: false, message: "DB Error: Retrieving Material Price" + msg}
        }
    }
}