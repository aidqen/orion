"use client";

import { useEffect, useRef } from "react";
import { useDataStream } from "@/contexts/DataStreamContext";
import { useArtifactStore } from "@/store/useArtifactStore";
import type { CustomUIDataTypes } from "@/types/chat";

export function DataStreamHandler() {
	const { dataStream } = useDataStream();
	const lastProcessedIndex = useRef(-1);
	const artifactIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (!dataStream?.length) {
			return;
		}

		// Only process new deltas since last render
		const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
		lastProcessedIndex.current = dataStream.length - 1;

		const artifactStore = useArtifactStore.getState();

		for (const delta of newDeltas) {
			// The delta itself contains type and data from CustomUIDataTypes
			const streamData = delta as unknown as CustomUIDataTypes;

			if (streamData.type === "data-id") {
				console.log("🔵 Setting artifactId:", streamData.data);
				artifactIdRef.current = streamData.data;
			}

			if (streamData.type === "data-title") {
				if (artifactIdRef.current) {
					console.log("🔵 Creating artifact:", {
						id: artifactIdRef.current,
						title: streamData.data,
					});
					artifactStore.createArtifact(artifactIdRef.current, streamData.data);
				}
			}

			if (streamData.type === "data-textDelta") {
				if (artifactIdRef.current) {
					artifactStore.appendContent(artifactIdRef.current, streamData.data);
				}
			}

			if (streamData.type === "data-finish") {
				console.log("🔵 Completing artifact:", streamData.data);
				artifactStore.completeArtifact(streamData.data.id);
				artifactIdRef.current = null;
			}
		}
	}, [dataStream]);

	return null;
}
