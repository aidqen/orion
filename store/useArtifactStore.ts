import type { UIMessage } from "ai";
import { create } from "zustand";
import { AI_TOOLS } from "@/constants/chat.constant";

export interface Artifact {
	id: string;
	title: string;
	content: string;
	status: "streaming" | "completed";
}

interface ArtifactStore {
	artifacts: Map<string, Artifact>;
	activeArtifactId: string | null;
	isOpen: boolean;

	// Core actions
	createArtifact: (id: string, title: string) => void;
	appendContent: (id: string, textDelta: string) => void;
	completeArtifact: (id: string) => void;

	// UI actions
	setActiveArtifact: (id: string | null) => void;
	openArtifact: (id: string) => void;
	closeArtifact: () => void;

	// History reconstruction
	reconstructArtifacts: (messages: UIMessage[]) => void;
}

export const useArtifactStore = create<ArtifactStore>((set, get) => ({
	artifacts: new Map(),
	activeArtifactId: null,
	isOpen: false,

	// Create a new artifact when data-id and data-title arrive
	createArtifact: (id: string, title: string) => {
		set((state) => {
			const newArtifacts = new Map(state.artifacts);
			newArtifacts.set(id, {
				id,
				title,
				content: "",
				status: "streaming",
			});
			return { artifacts: newArtifacts };
		});
	},

	// Append streaming text content as data-textDelta arrives
	appendContent: (id: string, textDelta: string) => {
		set((state) => {
			const artifact = state.artifacts.get(id);
			if (!artifact) {
				console.warn(`Artifact ${id} not found for content append`);
				return state;
			}

			const newArtifacts = new Map(state.artifacts);
			newArtifacts.set(id, {
				...artifact,
				content: artifact.content + textDelta,
			});
			return { artifacts: newArtifacts };
		});
	},

	// Mark artifact as completed when tool execution finishes
	completeArtifact: (id: string) => {
		set((state) => {
			const artifact = state.artifacts.get(id);
			if (!artifact) {
				console.warn(`Artifact ${id} not found for completion`);
				return state;
			}

			const newArtifacts = new Map(state.artifacts);
			newArtifacts.set(id, {
				...artifact,
				status: "completed",
			});
			return { artifacts: newArtifacts };
		});
	},

	// Set the currently active artifact (null to clear)
	setActiveArtifact: (id: string | null) => {
		set({ activeArtifactId: id });
	},

	// Open artifact in side panel
	openArtifact: (id: string) => {
		const artifact = get().artifacts.get(id);
		if (!artifact) {
			console.warn(`Artifact ${id} not found for opening`);
			return;
		}
		set({ activeArtifactId: id, isOpen: true });
	},

	closeArtifact: () => {
		set({ isOpen: false });
	},

	reconstructArtifacts: (messages: UIMessage[]) => {
		const newArtifacts = new Map<string, Artifact>();

		for (const message of messages) {
			if (message.role !== "assistant") continue;

			const parts = message.parts || [];
			for (const part of parts) {
				// Look for completed document tool results
				if (
					part.type === AI_TOOLS.CREATE_DOCUMENT &&
					part.state === "output-available" &&
					part.output
				) {
					const { id, title, content } = part.output as {
						id: string;
						title: string;
						content: string;
					};

					if (id && title && content) {
						newArtifacts.set(id, {
							id,
							title,
							content,
							status: "completed",
						});
					}
				}
			}
		}

		set({ artifacts: newArtifacts });
	},
}));
