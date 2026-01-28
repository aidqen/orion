"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FilePlusCorner } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragOverlayProps {
    className?: string;
}

export function DragOverlay({ className }: DragOverlayProps) {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounterRef = useRef(0);
    const isDraggingRef = useRef(false);

    const handleDragEnter = useCallback((e: DragEvent) => {
        if (!e.dataTransfer?.types?.includes("Files")) return;

        e.preventDefault();
        dragCounterRef.current++;

        if (!isDraggingRef.current) {
            isDraggingRef.current = true;
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        if (!e.dataTransfer?.types?.includes("Files")) return;

        e.preventDefault();
        dragCounterRef.current--;

        if (dragCounterRef.current === 0 && isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        if (!e.dataTransfer?.types?.includes("Files")) return;
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        dragCounterRef.current = 0;
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
        }
    }, []);

    const handleDragEnd = useCallback(() => {
        dragCounterRef.current = 0;
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("dragenter", handleDragEnter);
        document.addEventListener("dragleave", handleDragLeave);
        document.addEventListener("dragover", handleDragOver, { passive: false });
        document.addEventListener("drop", handleDrop);
        document.addEventListener("dragend", handleDragEnd);

        return () => {
            document.removeEventListener("dragenter", handleDragEnter);
            document.removeEventListener("dragleave", handleDragLeave);
            document.removeEventListener("dragover", handleDragOver);
            document.removeEventListener("drop", handleDrop);
            document.removeEventListener("dragend", handleDragEnd);
        };
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd]);

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center",
                "bg-black/60 backdrop-blur-sm",
                "transition-opacity duration-200 ease-out",
                "will-change-[opacity]",
                isDragging
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none",
                className
            )}
            aria-hidden={!isDragging}
        >
            <div
                className={cn(
                    "flex flex-col items-center justify-center gap-4 p-8",
                    "rounded-2xl border-2 border-dashed border-white/40",
                    "bg-white/10 backdrop-blur-md",
                    "min-w-[280px] min-h-[200px]",
                    "transition-transform duration-200 ease-out",
                    isDragging ? "scale-100" : "scale-95"
                )}
            >
                <FilePlusCorner className="w-8 h-8 text-white" strokeWidth={2} />

                <p className="text-white text-lg font-medium text-center">
                    Drop files here to add to chat
                </p>
            </div>
        </div>
    );
}

