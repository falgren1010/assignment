"use client";

import { useEffect, useRef } from "react";
import * as OV from "online-3d-viewer";

type Props = {
    modelUrl: string;
};

export function ModelViewer({ modelUrl }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current || !modelUrl) return;

        const container = containerRef.current;

        const viewer = new OV.EmbeddedViewer(container, {
            backgroundColor: new OV.RGBAColor(245, 245, 245, 255),
            defaultColor: new OV.RGBColor(200, 200, 200),
        });

        viewer.LoadModelFromUrlList([modelUrl]);

        return () => {
            container.innerHTML = "";
        };
    }, [modelUrl]);

    return (
        <div
            ref={containerRef}
            className="w-full h-[600px] mt-6 rounded-xl border"
        />
    );
}
