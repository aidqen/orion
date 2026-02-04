import { MessageInput } from '@/types/chat';
import { create } from 'zustand';

interface ChatStore {
  pendingMessage: MessageInput | null;
  setPendingMessage: (message: MessageInput | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessage: null,
  setPendingMessage: (message) => set({ pendingMessage: message }),
}));
