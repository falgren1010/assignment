"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { components } from "@/lib/api-contract/models";
import { requestQuote } from "@/lib/api/quote";

type Material = components["schemas"]["Material"];
type FileDetails = components["schemas"]["FileDetails"];
type Quote = components["schemas"]["Quote"];

export default function QuotePage() {
    const router = useRouter();

    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [material, setMaterial] = useState<Material | null>(null);
    const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
    const [quantity, setQuantity] = useState<number | null>(1)

    useEffect(() => {
        const storedMaterial = sessionStorage.getItem("selectedMaterial");
        const storedFile = sessionStorage.getItem("localFileDetails");
        const storedQuantity = sessionStorage.getItem("quantity");

        if (storedMaterial) {
            setMaterial(JSON.parse(storedMaterial));
        }
        if (storedFile) {
            setFileDetails(JSON.parse(storedFile));
        }
        if (storedQuantity) {
            setQuantity(JSON.parse(storedQuantity));
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                if (material && fileDetails && quantity){
                    const q = await requestQuote(fileDetails, material, quantity);
                    setQuote(q);
                }
            } catch (err) {
                console.error(err);
                setError("Could not create quote.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [material, fileDetails, quantity]);


    async function handleOrder() {
        sessionStorage.setItem("quote", JSON.stringify(quote));
        router.push('/portal/checkout');
    }

    return (
        <div className="flex flex-grow">
            {/* SIDEBAR */}
            <aside className="w-64 bg-base-200 p-6 border-r border-base-300">
                <nav className="flex flex-col gap-3">
                    <a href="/portal/upload" className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Create Order
                    </a>
                    <a href="/portal/orders" className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Active Orders
                    </a>
                    <a href="/portal/history" className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Order History
                    </a>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow p-10 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-10">Your Quote</h1>

                {/* LOADING */}
                {loading && (
                    <div className="flex justify-center items-center flex-grow">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}

                {/* ERROR */}
                {error && !loading && (
                    <p className="text-error">{error}</p>
                )}

                {/* QUOTE CARD */}
                {quote && !loading && (
                    <div className="p-6 bg-base-200 rounded-xl border border-base-300 max-w-xl w-full mb-10">
                        <h2 className="font-bold text-xl mb-4">Quote Details</h2>

                        <p><strong>Product:</strong> {fileDetails!.originalName}</p>
                        <p><strong>Material:</strong> {quote.materialName}</p>
                        <p><strong>Volume:</strong> {quote.volumeCm3} cm³</p>
                        <br />
                        <p><strong>Price/cm3:</strong> {quote.materialPriceFactor.toFixed(2)} €</p>
                        <p><strong>Unit Price:</strong> {quote.unitPrice.toFixed(2)} €</p>
                        <p><strong>Quantity:</strong> {quote.quantity}</p>
                        <p><strong>Subtotal:</strong> {(quote.quantity * quote.unitPrice).toFixed(2)} €</p>
                        <p><strong>Quantity Discount:</strong> {quote.quantityDiscount} €</p>

                        <p className="mt-4 text-lg font-bold">
                            Total Price: {quote.totalPrice.toFixed(2)} €
                        </p>

                        <div className="mt-6">
                            <p><strong>Status:</strong> {quote.status}</p>
                            <p><strong>Created:</strong> {new Date(quote.createdAt).toLocaleString()}</p>
                            <p><strong>Expires:</strong> {new Date(quote.expiresAt).toLocaleString()}</p>
                        </div>
                    </div>
                )}

                {/* ORDER BUTTON */}
                {!loading && quote && (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleOrder}
                    >
                        Order & Pay
                    </button>
                )}
            </main>
        </div>
    );
}
