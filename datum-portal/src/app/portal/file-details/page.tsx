"use client";

import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import type { components } from "@/lib/api-contract/models";

type FileDetails = components["schemas"]["FileDetails"];

export default function FileDetailsPage() {

    const [fileDetails, setFile] = useState<FileDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            setLoading(true);

            const stored = sessionStorage.getItem("localFileDetails");
            const fileDetails = stored ? JSON.parse(stored) : null;

            if (!fileDetails) {
                setError("File not saved, please upload again.");
                setLoading(false);
                return;
            }

            setFile(fileDetails);
        }
        catch (err) {
            console.error(err);
            setError("Cannot access File Details.");
        } finally {
            setLoading(false);
        }
    }, []);

    const router = useRouter();
    function handleCreate() {
        router.push("/portal/upload");
    }

    return (
        <div className="flex flex-grow">
            {/* SIDEBAR */}
            <aside className="w-64 bg-base-200 p-6 border-r border-base-300">
                <nav className="flex flex-col gap-3">
                    <a onClick={handleCreate} className="btn btn-primary border border-base-300 justify-start text-left">
                        Create Order
                    </a>
                    <a className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Active Orders
                    </a>
                    <a className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Order Details
                    </a>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow p-10 flex flex-col">
                <h1 className="text-3xl font-bold mb-6">File Details</h1>

                {loading && (
                    <div className="flex justify-center items-center flex-grow">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}

                {error && !loading && (
                    <p className="text-error">{error}</p>
                )}

                {fileDetails && !loading && (
                    <div className="flex flex-col items-center justify-center flex-grow">
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
                        <div className="mt-6"> <a href="/portal/materials" className="btn btn-primary w-full" > Continue to Material </a> </div>
                    </div>
                )}
            </main>
        </div>
    );
}
