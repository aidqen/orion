import { create } from "zustand";
import type { MessageInput } from "@/types/chat";

interface ChatStore {
	pendingMessage: MessageInput | null;
	setPendingMessage: (message: MessageInput | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
	pendingMessage: null,
	setPendingMessage: (message) => set({ pendingMessage: message }),
}));
