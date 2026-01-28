export type ThemeMode = 'system' | 'light' | 'dark';

export type AppearanceSettings = {
  themeMode: ThemeMode;
};

export interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: AppearanceSettings) => void;
}

// Background Section Types
export interface BackgroundImage {
  id: string;
  url: string;
  alt: string;
}

export interface BackgroundCategory {
  id: string;
  title: string;
  images: BackgroundImage[];
}



export interface BackgroundImageGridProps {
  category: BackgroundCategory;
  onImageSelect: (imageUrl: string) => void;
  selectedImageUrl?: string | null;
}

export interface BackgroundImageItemProps {
  image: BackgroundImage;
  isSelected: boolean;
  onSelect: (imageUrl: string) => void;
}

export interface BackgroundControlsProps {
  blurEnabled: boolean;
  onBlurToggle: (enabled: boolean) => void;
}

export interface BackgroundUploadPanelProps {
  currentImage?: string | null;
  onUploadClick: () => void;
}

