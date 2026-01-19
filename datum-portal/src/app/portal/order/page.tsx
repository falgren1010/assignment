"use client";

import type { components } from "@/lib/api-contract/models";

type Order = components["schemas"]["Order"];

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderPage() {
    const router = useRouter();

    const isClient = typeof window !== "undefined";

    const [order, setOrder] = useState<Order | null>(() => {
        if (!isClient) return null;

        try {
            const stored = sessionStorage.getItem("order");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    return (
        <div className="flex flex-grow">
            {/* SIDEBAR */}
            <aside className="w-64 bg-base-200 p-6 border-r border-base-300">
                <nav className="flex flex-col gap-3">
                    <a
                        href="/portal/upload"
                        className="btn bg-base-100 border border-base-300 justify-start text-left"
                    >
                        Create Order
                    </a>
                    <a
                        href="/portal/orders"
                        className="btn bg-base-100 border border-base-300 justify-start text-left"
                    >
                        Active Orders
                    </a>
                    <a
                        href="/portal/history"
                        className="btn bg-base-100 border border-base-300 justify-start text-left"
                    >
                        Order History
                    </a>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow p-10 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-10">Order Details</h1>

                {!order && <p className="text-error">No order found in session storage.</p>}

                {order && (
                    <div className="p-6 bg-base-200 rounded-xl border border-base-300 max-w-xl w-full mb-10 shadow">
                        <h2 className="font-bold text-xl mb-4">Order Summary</h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="opacity-70">Order ID:</span>
                                <span className="font-medium">{order.id}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="opacity-70">Customer Name:</span>
                                <span className="font-medium">{order.customerName}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="opacity-70">Email:</span>
                                <span className="font-medium">{order.customerEmail}</span>
                            </div>

                            {order.customerCompany && (
                                <div className="flex justify-between">
                                    <span className="opacity-70">Company:</span>
                                    <span className="font-medium">{order.customerCompany}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="opacity-70">Payment Method:</span>
                                <span className="font-medium capitalize">{order.paymentMethod}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="opacity-70">Payment Status:</span>
                                <span className="font-medium text-success">{order.paymentStatus}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="opacity-70">Created At:</span>
                                <span className="font-medium">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>

                            <hr className="my-4" />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount:</span>
                                <span>
                  {order.totalAmount.toFixed(2)} {order.currency}
                </span>
                            </div>
                        </div>
                    </div>
                )}

                <button className="btn btn-primary btn-lg" onClick={() => router.push("/portal")}>
                    Back to Home Page
                </button>
            </main>
        </div>
    );
}
