"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMaterials } from "@/lib/api/materials";
import type { components } from "@/lib/api-contract/models";
type Material = components["schemas"]["Material"];
type MaterialList = components["schemas"]["MaterialList"];

export default function MaterialsPage() {
    const router = useRouter();

    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const result: MaterialList = await getMaterials();
                setMaterials(result.materials);
            } catch (err) {
                console.error(err);
                setError("Could not load materials.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    function handleChoose(materialId: string | undefined) {
        if (!materialId) return;

        const selected = materials.find(m => m.id === materialId);
        if (!selected){
            setError("Error choosing Material");
        }

        sessionStorage.setItem("selectedMaterial", JSON.stringify(selected));

        router.push(`/portal/overview`);
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
            <main className="flex-grow p-10 flex flex-col">
                <h1 className="text-3xl font-bold mb-6">Choose Material</h1>

                {loading && (
                    <div className="flex justify-center items-center flex-grow">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}

                {error && !loading && (
                    <p className="text-error">{error}</p>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials.map((mat) => (
                            <div
                                key={mat.id}
                                className="p-6 bg-base-200 rounded-xl border border-base-300 flex flex-col"
                            >
                                <h2 className="font-bold text-xl mb-2">{mat.name}</h2>
                                <p><strong>Code:</strong> {mat.code}</p>
                                <p><strong>Price:</strong> {mat.price} €</p>
                                <p><strong>Lead Time:</strong> {mat.leadTime} days</p>
                                <div className="mt-3">
                                    <strong>Properties:</strong>
                                    <ul className="list-disc list-inside text-sm mt-1">
                                        {mat.properties.map((prop, idx) => (
                                            <li key={idx}>{prop}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    className="btn btn-primary mt-6"
                                    onClick={() => handleChoose(mat.id)}
                                >
                                    Choose Material
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
