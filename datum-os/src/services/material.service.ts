import type {Result} from "./models/common.models.js";
import type {Material} from "./models/models.js";

export interface IMaterialAdapter{
    listMaterial(): Promise<Result<Material[]>>
}

export class MaterialService{
    private materialAdapter: IMaterialAdapter

    constructor(materialAdp: IMaterialAdapter) {
        this.materialAdapter  = materialAdp
    }

    async listMaterial(): Promise<Result<Material[]>> {
        // todo id validation
        const result = await this.materialAdapter.listMaterial()
        if (!result.success){
            return { success: false, message: "Not Found: " + result.message }
        }

        return { success: true, data: result.data }
    }

}