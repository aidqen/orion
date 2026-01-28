'use client'

import { motion } from "motion/react";
import { useArtifactStore } from "@/store/useArtifactStore";
import { X, Copy, Download, Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { ArtifactHeader } from "./ArtifactHeader";

interface ArtifactProps {
    isActive: boolean;
}

export function Artifact({ isActive }: ArtifactProps) {
    const isMobile = useIsMobile()
    const activeArtifactId = useArtifactStore(state => state.activeArtifactId);
    const artifacts = useArtifactStore(state => state.artifacts);
    const closeArtifact = useArtifactStore(state => state.closeArtifact);

    const activeArtifact = activeArtifactId ? artifacts.get(activeArtifactId) : null;



    return (
        <>
            {/* Backdrop */}
            {(isMobile && isActive) && (
                <motion.div
                    className="fixed top-0 left-0 w-dvw h-dvh backdrop-blur-sm z-10 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    onClick={closeArtifact}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />
            )}
            {/* Artifact */}
            <motion.div
                className="fixed md:relative top-0 right-0 bottom-0 flex z-20 overflow-hidden bg-background border-l"
                initial={false}
                animate={{
                    width: !isMobile ? (isActive ? "50%" : "0%") : "100%",
                    translateY: isMobile ? (isActive ? "10%" : "100%") : "0%",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {activeArtifact && (
                    <div className="h-full w-full flex flex-col">
                        {/* Header */}
                        <ArtifactHeader status={activeArtifact.status} title={activeArtifact.title} closeArtifact={closeArtifact} />


                        {/* Content */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="p-6">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <Streamdown isAnimating={activeArtifact.status === 'streaming'}>
                                        {activeArtifact.content}
                                    </Streamdown>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    )
}