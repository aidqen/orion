import { AUTH_POPUP_MODES, AuthPopupModesType } from '@/constants/auth.constant';
import { create } from 'zustand';

interface AuthPopupStore {
  isOpen: boolean;
  open: (mode: AuthPopupModesType) => void;
  close: () => void;
  setOpen: (isOpen: boolean) => void;
  mode: AuthPopupModesType;
  setMode: (mode: AuthPopupModesType) => void;
}

export const useAuthPopupStore = create<AuthPopupStore>((set) => ({
  isOpen: false,
  open: (mode: AuthPopupModesType) => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
  setOpen: (isOpen) => set({ isOpen }),
  mode: AUTH_POPUP_MODES.SIGN_IN,
  setMode: (mode) => set({ mode }),
}));

