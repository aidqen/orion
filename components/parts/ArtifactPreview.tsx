"use client";

import { FileText, Loader2, Maximize2 } from "lucide-react";
import type React from "react";
import { Streamdown } from "streamdown";
import { useArtifactStore } from "@/store/useArtifactStore";

interface ArtifactPreviewProps {
	data: {
		id: string;
		title: string;
		description: string;
		content: string;
	};
	isStreaming: boolean;
}

export const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({
	data,
	isStreaming,
}) => {
	const openArtifact = useArtifactStore((state) => state.openArtifact);
	const artifactFromStore = useArtifactStore((state) => {
		if (data?.id) {
			return state.artifacts.get(data.id);
		}
		for (const artifact of state.artifacts.values()) {
			if (artifact.status === "streaming") {
				return artifact;
			}
		}
		return null;
	});

	const displayData = artifactFromStore || data;

	if (!displayData) return null;

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		openArtifact(displayData.id);
	};

	const isCurrentlyStreaming =
		artifactFromStore?.status === "streaming" || isStreaming;

	return (
		<div
			className="relative w-full max-w-[450px] cursor-pointer group"
			onClick={handleClick}
		>
			{/* Overlay with Maximize Button */}
			<div className="absolute top-[13px] right-[9px] rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-muted-foreground transition-colors">
				<Maximize2 className="h-4 w-4" />
			</div>

			{/* Header */}
			<div className="flex flex-row items-start justify-between gap-2 rounded-t-2xl border border-b-0 text-black dark:text-white p-4 sm:items-center bg-card dark:border-zinc-700 dark:bg-muted">
				<div className="flex flex-row items-start gap-3 sm:items-center">
					<div>
						{isCurrentlyStreaming ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<FileText className="h-4 w-4" />
						)}
					</div>
					<div className="-translate-y-1 font-medium sm:translate-y-0 ">
						{displayData.title}
					</div>
				</div>
			</div>

			{/* Content Body */}
			<div className="h-[257px] overflow-y-hidden rounded-b-2xl border border-t-0 bg-card dark:border-zinc-700 dark:bg-muted p-4 sm:px-8 ">
				<div className="prose dark:prose-invert relative w-full">
					<Streamdown className="text-sm text-muted-foreground whitespace-pre-wrap">
						{displayData.content || ""}
					</Streamdown>
				</div>
			</div>
		</div>
	);
};
