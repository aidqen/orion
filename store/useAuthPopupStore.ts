import { create } from "zustand";
import {
	AUTH_POPUP_MODES,
	type AuthPopupModesType,
} from "@/constants/auth.constant";

interface AuthPopupStore {
	isOpen: boolean;
	open: (intent: AuthPopupModesType) => void;
	close: () => void;
	setOpen: (isOpen: boolean) => void;
	intent: AuthPopupModesType;
	setIntent: (intent: AuthPopupModesType) => void;
}

export const useAuthPopupStore = create<AuthPopupStore>((set) => ({
	isOpen: false,
	open: (intent: AuthPopupModesType) => set({ isOpen: true, intent }),
	close: () => set({ isOpen: false }),
	setOpen: (isOpen) => set({ isOpen }),
	intent: AUTH_POPUP_MODES.SIGN_IN,
	setIntent: (intent) => set({ intent }),
}));
