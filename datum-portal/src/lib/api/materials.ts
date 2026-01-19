import type { components } from "@/lib/api-contract/models";

export type MaterialList = components["schemas"]["MaterialList"];
export type Material = components["schemas"]["Material"];

export async function getMaterials(): Promise<MaterialList> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/api/materials`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch materials: ${res.status}`);
    }

    return await res.json();
}