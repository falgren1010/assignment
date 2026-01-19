"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { components } from "@/lib/api-contract/models";

type Material = components["schemas"]["Material"];
type FileDetails = components["schemas"]["FileDetails"];

export default function SummaryPage() {
    const router = useRouter();

    const [quantityError, setQuantityError] = useState(false);

    const [material] = useState<Material | null>(() => {
        try {
            const raw = sessionStorage.getItem("selectedMaterial");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [fileDetails] = useState<FileDetails | null>(() => {
        try {
            const raw = sessionStorage.getItem("localFileDetails");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [quantity, setQuantity] = useState<number>(() => {
        const raw = sessionStorage.getItem("quantity");
        const q = raw ? Number(raw) : 1;
        return Number.isFinite(q) ? q : 1;
    });

    useEffect(() => {
        const stored = sessionStorage.getItem("quantity");
        if (stored !== String(quantity)) {
            sessionStorage.setItem("quantity", String(quantity));
        }
    }, [quantity]);

    const isQuantityValid = (q: number) => q > 0 && q <= 500;

    function handleRequestQuote() {
        if (!isQuantityValid(quantity)) {
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
                    {fileDetails && (
                        <div className="p-6 bg-base-200 rounded-xl border border-base-300 max-w-xl">
                            <h2 className="font-bold mb-4 text-xl">Uploaded File</h2>

                            <p><strong>Name:</strong> {fileDetails.originalName}</p>
                            <p><strong>Size:</strong> {fileDetails.sizeBytes} bytes</p>
                            <p><strong>MIME:</strong> {fileDetails.mimeType}</p>
                            <p><strong>Uploaded:</strong> {fileDetails.uploadedAt}</p>

                            {fileDetails.geometry && (
                                <div className="p-6 bg-base-200 rounded-xl border border-base-300 max-w-xl mt-6">
                                    <h2 className="font-bold mb-4 text-xl">Geometry</h2>

                                    <p><strong>Bounding Box X:</strong> {fileDetails.geometry.boundingBox.x} mm</p>
                                    <p><strong>Bounding Box Y:</strong> {fileDetails.geometry.boundingBox.y} mm</p>
                                    <p><strong>Bounding Box Z:</strong> {fileDetails.geometry.boundingBox.z} mm</p>

                                    <p className="mt-4"><strong>Volume:</strong> {fileDetails.geometry.volume} mm³</p>
                                    <p><strong>Volume (cm³):</strong> {fileDetails.geometry.volumeCm3} cm³</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MATERIAL CARD */}
                    <div className="p-6 bg-base-200 rounded-xl border border-base-300 w-80">
                        <h2 className="font-bold text-xl mb-4">Selected Material</h2>
                        {material ? (
                            <>
                                <p><strong>Name:</strong> {material.name}</p>
                                <p><strong>Code:</strong> {material.code}</p>
                                <p><strong>Price:</strong> {material.price} €</p>
                                <p><strong>Lead Time:</strong> {material.leadTime} days</p>

                                <div className="mt-3">
                                    <strong>Properties:</strong>
                                    <ul className="list-disc list-inside text-sm mt-1">
                                        {material.properties.map((prop, idx) => (
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
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="input input-bordered w-full"
                            />
                            {quantity > 0 || <div>Quantity cant be 0</div>}
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
