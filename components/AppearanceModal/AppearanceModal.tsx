'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import type { AppearanceModalProps, AppearanceSettings, ThemeMode } from './types';
import { AppearanceModalHeader } from './AppearanceModalHeader';
import { ThemeChooserSection } from './ThemeChooserSection';
import { BackgroundSection } from './BackgroundSection';
import { ChatColorSection } from './ChatColorSection';
import { AppearanceModalFooter } from './AppearanceModalFooter';

export function AppearanceModal({ isOpen, onClose, onSave }: AppearanceModalProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [chatColorEnabled, setChatColorEnabled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  console.log("🚀 ~ AppearanceModal ~ resolvedTheme:", resolvedTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [setTheme])

  useEffect(() => {
    if (typeof window === 'undefined' || !resolvedTheme) return

    window.localStorage.setItem('theme', resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (isOpen) {
      // Load settings from localStorage
      const saved = localStorage.getItem('appearance-settings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          setThemeMode(settings.themeMode || 'system');
          setBackgroundEnabled(settings.backgroundEnabled || false);
          setChatColorEnabled(settings.chatColorEnabled || false);
        } catch (err) {
          console.warn('Failed to parse appearance settings', err);
        }
      } else {
        // If no saved settings, sync with current theme
        if (resolvedTheme) {
          setThemeMode(resolvedTheme as ThemeMode);
        }
      }
    }
  }, [isOpen, resolvedTheme]);

  const handleSave = () => {
    const settings: AppearanceSettings = {
      themeMode,
      backgroundEnabled,
      chatColorEnabled,
    };

    // Save to localStorage
    localStorage.setItem('appearance-settings', JSON.stringify(settings));

    // Apply theme using next-themes
    setTheme(themeMode);

    // onSave(settings);
    onClose();
  };

  return (  
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="appearance-modal" className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              duration: 0.25,
              bounce: 0
            }}
            className="relative w-full max-w-[840px] mx-4 max-h-[84vh] overflow-hidden rounded-[16px] border-2 border-[#E5E7EB] shadow-[0_16px_40px_rgba(0,0,0,0.16)] bg-[#F7F7F8] text-[#111827] dark:bg-[#0E1116] dark:text-[#E5E7EB] dark:border-[rgba(255,255,255,0.1)]"
          >
            <div className="p-6 space-y-4">
              <AppearanceModalHeader />

              <ThemeChooserSection
                themeMode={themeMode}
                onSelect={setThemeMode}
              />

              {/* Options List */}
              <div className="space-y-4">
                <h3 className="text-[16px] font-medium text-[#111827] dark:text-[#E5E7EB]">
                  Customization
                </h3>

                <div className="space-y-2">
                  <BackgroundSection
                    enabled={backgroundEnabled}
                    onChange={setBackgroundEnabled}
                  />

                  <div className="h-px bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)]" />

                  <ChatColorSection
                    enabled={chatColorEnabled}
                    onChange={setChatColorEnabled}
                  />
                </div>
              </div>

              <AppearanceModalFooter
                onClose={onClose}
                onSave={handleSave}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

