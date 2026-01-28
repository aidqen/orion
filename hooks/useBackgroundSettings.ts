import { useState, useEffect } from 'react';

const STORAGE_KEY = 'app-background-settings';

interface BackgroundSettings {
  backgroundImage: string | null;
  blur: number;
  blurEnabled: boolean;
}

interface UseBackgroundSettingsReturn {
  backgroundImage: string | null;
  blur: number;
  blurEnabled: boolean;
  setBackgroundImage: (url: string | null) => void;
  setBlur: (blur: number) => void;
  setBlurEnabled: (enabled: boolean) => void;
  clearBackground: () => void;
}

export function useBackgroundSettings(): UseBackgroundSettingsReturn {
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
  const [blur, setBlurState] = useState<number>(0);
  const [blurEnabled, setBlurEnabledState] = useState<boolean>(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings: BackgroundSettings = JSON.parse(stored);
        setBackgroundImageState(settings.backgroundImage || null);
        setBlurState(settings.blur ?? 0);
        setBlurEnabledState(settings.blurEnabled ?? false);
      }
    } catch (error) {
      console.error('Failed to load background settings:', error);
    }
  }, []);

  // Update CSS class and blur variable whenever settings change
  useEffect(() => {
    const root = document.documentElement;

    // Add/remove class for has-bg-image (for styling purposes)
    if (backgroundImage) {
      root.classList.add('has-bg-image');
    } else {
      root.classList.remove('has-bg-image');
    }
  }, [backgroundImage, blur, blurEnabled]);

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      const settings: BackgroundSettings = {
        backgroundImage,
        blur,
        blurEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save background settings:', error);
    }
  }, [backgroundImage, blur, blurEnabled]);

  const setBackgroundImage = (url: string | null) => {
    setBackgroundImageState(url);
  };

  const setBlur = (value: number) => {
    // Clamp blur value between 0 and 20
    const clampedBlur = Math.max(0, Math.min(20, value));
    setBlurState(clampedBlur);
  };

  const setBlurEnabled = (enabled: boolean) => {
    setBlurEnabledState(enabled);
  };

  const clearBackground = () => {
    setBackgroundImageState(null);
    setBlurState(0);
    setBlurEnabledState(false);
  };

  return {
    backgroundImage,
    blur,
    blurEnabled,
    setBackgroundImage,
    setBlur,
    setBlurEnabled,
    clearBackground,
  };
}
