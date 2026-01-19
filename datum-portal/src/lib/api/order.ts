import type { components } from "@/lib/api-contract/models";

export type Order = components["schemas"]["Order"];

export async function createOrder(order: Order): Promise<Order> {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        body: JSON.stringify(order),
    });

    if (!res.ok) {
        throw new Error(`failed creating order ${res.status}`);
    }

    return await res.json();
}