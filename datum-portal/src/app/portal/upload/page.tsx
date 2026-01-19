"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/api/files";

export default function UploadFilePage() {
    const router = useRouter();

    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleFileSelected(file: File) {
        setIsUploading(true);
        setErrorMessage(null);

        try {
            const localUrl = URL.createObjectURL(file);
            sessionStorage.setItem("localFileUrl", localUrl);

            const result = await uploadFile(file);
            sessionStorage.setItem("localFileDetails", JSON.stringify(result));

            router.push(`/portal/file-details`);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (message.includes("400")) {
                setErrorMessage("Wrong file type. Only .stp or .STEP allowed.");
            }
            else {
                setErrorMessage("Upload failed. Please try again.");
            }
        } finally {
            setIsUploading(false);
        }
    }


    function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelected(file);
    }

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
                        Order History
                    </a>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow p-10 flex flex-col">
                <h1 className="text-3xl font-bold mb-6">Create Order</h1>

                <div className="flex flex-col items-center justify-center flex-grow text-center max-w-xl mx-auto">
                    <p className="text-base-content/70 mb-6"> Upload your CAD file to begin your order. </p>
                    {errorMessage && ( <p className="text-error mb-4">{errorMessage}</p> )}

                    {/* UPLOAD FIELD */}
                    <label
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                        }}
                        onDrop={handleDrop}
                        className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition
              ${isDragging ? "border-primary bg-base-200" : "border-base-300"}`}
                    >
                        {isUploading ? (
                            <div>
                                <div>Uploading...Please wait</div>
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : (
                            <>
                                <span className="text-base-content/70">Drag & Drop your file here</span>
                                <span className="text-sm text-base-content/50">or</span>
                                <span className="btn btn-primary">Choose File</span>
                            </>
                        )}

                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelected(file);
                            }}
                        />
                    </label>
                </div>
            </main>
        </div>
    );
}
