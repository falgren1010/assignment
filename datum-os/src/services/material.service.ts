import type {Material, MaterialPrice} from "./models/models.js";
import type {IMaterialService} from "../controllers/material.controller.js";

export interface IMaterialAdapter{
    listMaterial(): Promise<Material[]>
    getMaterial(materialID: string): Promise<Material>
    getMaterialPrice(materialCode: string):  Promise<MaterialPrice>
}

export class MaterialService implements IMaterialService{
    private materialAdapter: IMaterialAdapter

    constructor(materialAdp: IMaterialAdapter) {
        this.materialAdapter  = materialAdp
    }

    async listMaterial(): Promise<Material[]> {
        const materials = await this.materialAdapter.listMaterial();

        // add current price to material
        for (const material of materials) {
            const price = await this.materialAdapter.getMaterialPrice(material.code);
            material.price = price.materialPrice;
        }

        return materials
    }

}