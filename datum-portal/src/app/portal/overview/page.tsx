"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { components } from "@/lib/api-contract/models";

type Material = components["schemas"]["Material"];
type FileDetails = components["schemas"]["FileDetails"];

type State = {
    material: Material | null;
    fileDetails: FileDetails | null;
    quantity: number;
};

export default function SummaryPage() {
    const router = useRouter();

    const isClient = typeof window !== "undefined";

    const [state, setState] = useState<State>(() => {
        if (!isClient) {
            return {
                material: null,
                fileDetails: null,
                quantity: 1,
            };
        }

        try {
            const storedMaterial = sessionStorage.getItem("selectedMaterial");
            const storedFileDetails = sessionStorage.getItem("localFileDetails");
            const storedQuantity = sessionStorage.getItem("quantity");

            return {
                material: storedMaterial ? JSON.parse(storedMaterial) : null,
                fileDetails: storedFileDetails ? JSON.parse(storedFileDetails) : null,
                quantity:
                    storedQuantity && Number.isFinite(Number(storedQuantity))
                        ? Number(storedQuantity)
                        : 1,
            };
        } catch {
            return {
                material: null,
                fileDetails: null,
                quantity: 1,
            };
        }
    });

    const [quantityError, setQuantityError] = useState(false);

    useEffect(() => {
        if (!isClient) return;
        sessionStorage.setItem("quantity", String(state.quantity));
    }, [state.quantity, isClient]);

    const isQuantityValid = (q: number) => q > 0 && q <= 500;

    function handleRequestQuote() {
        if (!isQuantityValid(state.quantity)) {
            setQuantityError(true);
            return;
        }
        setQuantityError(false);
        router.push("/portal/quote");
    }

    function handleBackToMaterial() {
        router.push("/portal/materials");
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

            <main className="flex-grow p-10 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-10">Order Summary</h1>

                {/* FLEX CONTAINER FOR ALL THREE CARDS */}
                <div className="flex flex-row flex-wrap justify-center gap-8 mb-10 w-full">

                    {/* FILE DETAILS CARD */}
                    {state.fileDetails && (
                        <div className="p-6 bg-base-200 rounded-xl border border-base-300 max-w-xl">
                            <h2 className="font-bold mb-4 text-xl">Uploaded File</h2>

                            <p><strong>Name:</strong> {state.fileDetails.originalName}</p>
                            <p><strong>Size:</strong> {state.fileDetails.sizeBytes} bytes</p>
                            <p><strong>MIME:</strong> {state.fileDetails.mimeType}</p>
                            <p><strong>Uploaded:</strong> {state.fileDetails.uploadedAt}</p>

                            {state.fileDetails.geometry && (
                                <div className="p-6 bg-base-200 rounded-xl border border-base-300 max-w-xl mt-6">
                                    <h2 className="font-bold mb-4 text-xl">Geometry</h2>

                                    <p><strong>Bounding Box X:</strong> {state.fileDetails.geometry.boundingBox.x} mm</p>
                                    <p><strong>Bounding Box Y:</strong> {state.fileDetails.geometry.boundingBox.y} mm</p>
                                    <p><strong>Bounding Box Z:</strong> {state.fileDetails.geometry.boundingBox.z} mm</p>

                                    <p className="mt-4"><strong>Volume:</strong> {state.fileDetails.geometry.volume} mm³</p>
                                    <p><strong>Volume (cm³):</strong> {state.fileDetails.geometry.volumeCm3} cm³</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MATERIAL CARD */}
                    <div className="p-6 bg-base-200 rounded-xl border border-base-300 w-80">
                        <h2 className="font-bold text-xl mb-4">Selected Material</h2>
                        {state.material ? (
                            <>
                                <p><strong>Name:</strong> {state.material.name}</p>
                                <p><strong>Code:</strong> {state.material.code}</p>
                                <p><strong>Price:</strong> {state.material.price} €</p>
                                <p><strong>Lead Time:</strong> {state.material.leadTime} days</p>

                                <div className="mt-3">
                                    <strong>Properties:</strong>
                                    <ul className="list-disc list-inside text-sm mt-1">
                                        {state.material.properties.map((prop, idx) => (
                                            <li key={idx}>{prop}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p className="text-base-content/50">No material selected.</p>
                        )}
                    </div>

                    {/* QUANTITY CARD */}
                    <div className="p-6 bg-base-200 rounded-xl border border-base-300 w-80">
                        <h2 className="font-bold text-xl mb-4">Quantity</h2>

                        <label className="form-control w-full">
                            <span className="label-text mb-2">Choose quantity (1–500)</span>
                            <input
                                type="number"
                                min={1}
                                max={500}
                                value={state.quantity}
                                onChange={(e) =>
                                    setState((prev) => ({
                                        ...prev,
                                        quantity: Number(e.target.value),
                                    }))
                                }
                                className="input input-bordered w-full"
                            />
                            {state.quantity > 0 || <div>Quantity cant be 0</div>}
                        </label>
                    </div>
                </div>
                {/* BUTTONS */}
                <div className="flex gap-4">
                    <button className="btn btn-lg bg-gray-200 text-gray-800 border border-gray-300" onClick={handleBackToMaterial}>
                        Back to Material
                    </button>
                    <button className="btn btn-primary btn-lg" onClick={handleRequestQuote}>
                        Request Quote
                    </button>
                </div>
                {quantityError && <div className="flex gap-4">Quantity needs to between 1 and 500</div>}

            </main>
        </div>
    );
}
