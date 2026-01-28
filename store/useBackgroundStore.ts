import { create } from 'zustand';

const STORAGE_KEY = 'app-background-settings';

interface BackgroundSettings {
  backgroundImage: string | null;
  blur: number;
  blurEnabled: boolean;
  backgroundEnabled: boolean;
}

interface BackgroundStore {
  backgroundImage: string | null;
  blur: number;
  blurEnabled: boolean;
  backgroundEnabled: boolean;
  isInitialized: boolean;
  setBackgroundImage: (url: string | null) => void;
  setBlur: (blur: number) => void;
  setBlurEnabled: (enabled: boolean) => void;
  setBackgroundEnabled: (enabled: boolean) => void;
  clearBackground: () => void;
  loadFromStorage: () => void;
}

export const useBackgroundStore = create<BackgroundStore>((set, get) => ({
  backgroundImage: null,
  blur: 0,
  blurEnabled: false,
  backgroundEnabled: false,
  isInitialized: false,

  setBackgroundImage: (url) => {
    set({ backgroundImage: url });
    saveToStorage(get());
    updateCSS(get());
  },

  setBlur: (value) => {
    const clampedBlur = Math.max(0, Math.min(20, value));
    set({ blur: clampedBlur });
    saveToStorage(get());
    updateCSS(get());
  },

  setBlurEnabled: (enabled) => {
    set({ blurEnabled: enabled });
    saveToStorage(get());
    updateCSS(get());
  },

  setBackgroundEnabled: (enabled) => {
    set({ backgroundEnabled: enabled });
    saveToStorage(get());
    updateCSS(get());
  },

  clearBackground: () => {
    set({ backgroundImage: null, blur: 0, blurEnabled: false, backgroundEnabled: false });
    saveToStorage(get());
    updateCSS(get());
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings: BackgroundSettings = JSON.parse(stored);
        set({
          backgroundImage: settings.backgroundImage || null,
          blur: settings.blur ?? 0,
          blurEnabled: settings.blurEnabled ?? false,
          backgroundEnabled: settings.backgroundEnabled ?? false,
          isInitialized: true,
        });
        updateCSS(get());
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error('Failed to load background settings:', error);
      set({ isInitialized: true });
    }
  },
}));

// Helper function to save to localStorage
function saveToStorage(state: BackgroundStore) {
  if (typeof window === 'undefined') return;

  try {
    const settings: BackgroundSettings = {
      backgroundImage: state.backgroundImage,
      blur: state.blur,
      blurEnabled: state.blurEnabled,
      backgroundEnabled: state.backgroundEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save background settings:', error);
  }
}

// Helper function to update CSS
function updateCSS(state: BackgroundStore) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Add/remove class for has-bg-image (for styling purposes)
  // Only add the class if both backgroundImage exists AND backgroundEnabled is true
  if (state.backgroundImage && state.backgroundEnabled) {
    root.classList.add('has-bg-image');
  } else {
    root.classList.remove('has-bg-image');
  }
}

// Initialize on client side
if (typeof window !== 'undefined') {
  useBackgroundStore.getState().loadFromStorage();
}
