export type ThemeMode = 'system' | 'light' | 'dark';

export type AppearanceSettings = {
  themeMode: ThemeMode;
  backgroundEnabled: boolean;
  chatColorEnabled: boolean;
};

export interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: AppearanceSettings) => void;
}

