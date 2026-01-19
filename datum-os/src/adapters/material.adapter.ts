import type {IMaterialAdapter} from "../services/material.service.js";
import type {Material, MaterialPrice} from "../services/models/models.js";
import type {NodePgDatabase} from "drizzle-orm/node-postgres";
import {and, eq, isNull} from "drizzle-orm";

import {materialPrices, materials} from "../infrastructure/databases/postgres/schemas.js";
import {NotFoundError} from "../services/models/errors.js";


export class MaterialAdapter implements IMaterialAdapter {

    private materialsDB: NodePgDatabase

    constructor(db: NodePgDatabase) {
        this.materialsDB = db
    }

    async listMaterial(): Promise<Material[]> {
        const getResult = await this.materialsDB
            .select()
            .from(materials)

        if (getResult.length === 0) {
               throw(new NotFoundError("DB Error: Materials Not Found"))
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

            return materialList
    }

    async getMaterial(materialID: string):  Promise<Material>{
        const getResult = await this.materialsDB
            .select()
            .from(materials)
            .where(eq(materials.id, materialID))
            .limit(1)

        const dbMaterial = getResult[0]

        if (!dbMaterial) {
            throw(new NotFoundError("DB Error: Material Not Found"))
        }

        return {
            id: dbMaterial.id,
            name: dbMaterial.name,
            code: dbMaterial.code,
            price: Number(dbMaterial.price),
            leadTime: dbMaterial.leadTime,
            properties: dbMaterial.properties,
            available: dbMaterial.available
        }
    }

    async getMaterialPrice(materialCode: string):  Promise<MaterialPrice>{
       const getResult = await this.materialsDB
                .select()
                .from(materialPrices)
                .where(and(eq(materialPrices.materialCode, materialCode), isNull(materialPrices.validTo)))
                .limit(1)
       const dbPrice = getResult[0]

       if (!dbPrice) {
            throw(new NotFoundError("DB Error: Material Price Not Found"))
       }

        return {
                id: dbPrice.id,
                materialCode: dbPrice.materialCode,
                materialPrice: Number(dbPrice.materialPrice),
                validFrom: dbPrice.validFrom,
                validTo: dbPrice.validTo
        }
    }

}