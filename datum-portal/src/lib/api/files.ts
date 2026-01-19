import type { components } from "@/lib/api-contract/models";

export type FileDetails = components["schemas"]["FileDetails"];

export async function uploadFile(file: File): Promise<FileDetails> {
    const formData = new FormData();
    formData.append("file", file);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/api/files/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
    }

    return await res.json();
}

export async function getFileDetails(fileId: string): Promise<FileDetails> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/api/files/${fileId}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch file details: ${res.status}`);
    }

    return await res.json();
}

