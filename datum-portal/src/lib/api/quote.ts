import type { components } from "@/lib/api-contract/models";

export type Quote = components["schemas"]["Quote"];
export type QuoteRequest = components["schemas"]["QuoteRequest"];
export type Material = components["schemas"]["Material"];
export type FileDetails = components["schemas"]["FileDetails"];

export async function requestQuote(fileDetails: FileDetails, material: Material, quantity: number): Promise<Quote> {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const requestQuote: QuoteRequest = {
        fileId: fileDetails.id!,
        materialId: material.id!,
        quantity: quantity,
    }

    console.log(requestQuote)

    const res = await fetch(`${apiUrl}/api/quotes`, {
        method: "POST",
        body: JSON.stringify(requestQuote),
    });

    console.log(res)

    if (!res.ok) {
        throw new Error(`failed requesting quote ${res.status}`);
    }

    return await res.json();
}