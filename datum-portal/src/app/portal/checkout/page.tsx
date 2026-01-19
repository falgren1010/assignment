"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { components } from "@/lib/api-contract/models";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/order";

type Quote = components["schemas"]["Quote"];
type FileDetails = components["schemas"]["FileDetails"];

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function CheckoutForm() {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerCompany, setCustomerCompany] = useState("");

    const isClient = typeof window !== "undefined";

    const [storedQuote, setStoredQuote] = useState<Quote | null>(() => {
        if (!isClient) return null;
        try {
            const raw = sessionStorage.getItem("quote");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [storedFile, setStoredFile] = useState<FileDetails | null>(() => {
        if (!isClient) return null;
        try {
            const raw = sessionStorage.getItem("localFileDetails");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setMessage("");

        try {
            if (!storedQuote || !storedQuote.id) {
                setMessage("Missing order data. Please restart checkout.");
                setLoading(false);
                return;
            }
            if (!storedFile || !storedFile.id) {
                setMessage("Missing order data. Please restart checkout.");
                setLoading(false);
                return;
            }

            const order = {
                quoteId: storedQuote.id,
                customerName,
                customerEmail,
                customerCompany: customerCompany || null,
                paymentMethod: "card" as const,
                paymentStatus: "paid" as const,
                purchaseOrderFileId: storedFile.id,
                totalAmount: storedQuote.totalPrice,
                currency: "EUR" as const,
                createdAt: new Date().toISOString(),
            };

            const orderResponse = await createOrder(order);
            sessionStorage.setItem("order", JSON.stringify(orderResponse));

            router.push("/portal/order");
        } catch (error) {
            console.error("Create order failed:", error);
            setMessage("Payment failed. Please try again.");
        }

        setLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full p-8 bg-base-200 rounded-xl border border-base-300 shadow"
        >
            {/* LEFT SIDE – CUSTOMER + PAYMENT */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Checkout</h2>

                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="input input-bordered w-full"
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Company (optional)"
                        value={customerCompany}
                        onChange={(e) => setCustomerCompany(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="p-4 border border-base-300 rounded-lg bg-white">
                    <CardElement options={{ hidePostalCode: true }} />
                </div>

                <p className="text-xs opacity-70">
                    Test Mode: Use card number <strong>4242 4242 4242 4242</strong>, any future date, any CVC.
                </p>

                <button type="submit" disabled={!stripe || loading} className="btn btn-primary w-full">
                    {loading ? "Processing..." : "Pay Now"}
                </button>

                {message && <p className="mt-2 text-center text-sm text-error">{message}</p>}
            </div>

            {/* RIGHT SIDE – ORDER SUMMARY */}
            <div className="bg-base-100 border border-base-300 rounded-xl p-6 h-fit shadow-inner">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="opacity-70">Product:</span>
                        <span className="font-medium">{storedFile?.originalName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="opacity-70">Volume:</span>
                        <span className="font-medium">{storedQuote?.volumeCm3} cm3</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="opacity-70">Material:</span>
                        <span className="font-medium">{storedQuote?.materialName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="opacity-70">Quantity:</span>
                        <span className="font-medium">{storedQuote?.quantity}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="opacity-70">Unit Price:</span>
                        <span className="font-medium">{storedQuote?.unitPrice} €</span>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{storedQuote?.totalPrice?.toFixed(2)} €</span>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default function CheckoutPage() {
    return (
        <div className="flex flex-grow min-h-screen">
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
            <main className="flex-grow p-10 flex flex-col items-center justify-start">
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </main>
        </div>
    );
}
