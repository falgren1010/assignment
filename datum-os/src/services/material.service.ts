import type {Result} from "./models/common.models.js";
import type {Material, MaterialPrice} from "./models/models.js";
import type {IMaterialService} from "../controllers/material.controller.js";

export interface IMaterialAdapter{
    listMaterial(): Promise<Result<Material[]>>
    getMaterialPrice(materialCode: string):  Promise<Result<MaterialPrice>>
}

export class MaterialService implements IMaterialService{
    private materialAdapter: IMaterialAdapter

    constructor(materialAdp: IMaterialAdapter) {
        this.materialAdapter  = materialAdp
    }

    async listMaterial(): Promise<Result<Material[]>> {
        const result = await this.materialAdapter.listMaterial();
        if (!result.success) {
            return { success: false, message: "Not Found: " + result.message };
        }

        // check if data is truly present since result.data could be null
        if(!result.data){
            return { success: false, message: "Error retrieving Materials" };
        }

        // add current price to material
        for (const material of result.data) {
            const priceResult = await this.materialAdapter.getMaterialPrice(material.code);
            if (!priceResult.success) {
                return {success: false, message: "Error retrieving Material prices" + priceResult.message};
            }

            if (!priceResult.data) {
                return {success: false, message: "Error retrieving Material prices"};
            }

            material.price = priceResult.data.materialPrice;
        }

        return {success: true, data: result.data}

    }

}