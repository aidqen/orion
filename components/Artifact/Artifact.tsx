"use client";

import { motion } from "motion/react";
import { Streamdown } from "streamdown";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useResizePanel } from "@/hooks/useResizePanel";
import { useArtifactStore } from "@/store/useArtifactStore";
import { ArtifactHeader } from "./ArtifactHeader";

interface ArtifactProps {
	isActive: boolean;
}

export function Artifact({ isActive }: ArtifactProps) {
	const isMobile = useIsMobile();
	const activeArtifactId = useArtifactStore((state) => state.activeArtifactId);
	const artifacts = useArtifactStore((state) => state.artifacts);
	const closeArtifact = useArtifactStore((state) => state.closeArtifact);

	const { width, handleMouseDown, isDragging } = useResizePanel({
		initialWidth: 700,
		minWidth: 300,
		maxWidth: 900,
	});

	const activeArtifact = activeArtifactId
		? artifacts.get(activeArtifactId)
		: null;

	const getAnimatedWidth = () => {
		if (isMobile) return "100%";
		if (!isActive) return 0;
		return width;
	};

	return (
		<>
			{isMobile && isActive && (
				<motion.div
					className="fixed top-0 left-0 w-dvw h-dvh backdrop-blur-sm z-10 bg-black/50"
					initial={{ opacity: 0 }}
					animate={{ opacity: isActive ? 1 : 0 }}
					exit={{ opacity: 0 }}
					onClick={closeArtifact}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				/>
			)}
			<motion.div
				className="fixed md:relative top-0 right-0 bottom-0 flex z-20 overflow-hidden bg-background border-l"
				initial={false}
				animate={{
					width: getAnimatedWidth(),
					translateY: isMobile ? (isActive ? "10%" : "100%") : "0%",
				}}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 35,
					width: isDragging ? { duration: 0 } : undefined,
				}}
			>
				{!isMobile && (
					<div
						className={`absolute hit-area-lg top-0 bottom-0 w-px cursor-col-resize transition-colors ${
							isDragging
								? "bg-blue-500"
								: "bg-stone-200 hover:bg-stone-400 dark:bg-stone-800 dark:hover:bg-gray-600"
						}`}
						onMouseDown={isActive ? handleMouseDown : undefined}
					/>
				)}
				{activeArtifact && (
					<div className="h-full w-full flex flex-col">
						<ArtifactHeader
							status={activeArtifact.status}
							title={activeArtifact.title}
							closeArtifact={closeArtifact}
						/>

						<div className="flex-1 overflow-y-auto min-h-0">
							<div className="p-6">
								<div className="prose prose-sm dark:prose-invert max-w-none">
									<Streamdown
										isAnimating={activeArtifact.status === "streaming"}
									>
										{activeArtifact.content}
									</Streamdown>
								</div>
							</div>
						</div>
					</div>
				)}
			</motion.div>
		</>
	);
}
