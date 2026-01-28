'use client';

import { useState, useEffect, useRef } from 'react';
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

  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;

    const savedSettings = localStorage.getItem('appearance-settings');

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const savedThemeMode = settings.themeMode || 'system';
        setThemeMode(savedThemeMode);
      } catch (error) {
        console.warn('Failed to parse appearance settings:', error);
        setThemeMode((resolvedTheme as ThemeMode) || 'system');
      }
    } else {
      setThemeMode((resolvedTheme as ThemeMode) || 'system');
    }
  }, [isOpen, resolvedTheme]);

  const handleSave = () => {
    const settings: AppearanceSettings = {
      themeMode,
    };

    localStorage.setItem('appearance-settings', JSON.stringify(settings));

    setTheme(themeMode);

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
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{
              type: 'spring',
              duration: 0.35,
              bounce: 0
            }}
            className="relative w-full max-w-[840px] mx-4 max-h-[84vh] overflow-hidden rounded-[16px] border-2 border-[#E5E7EB] shadow-[0_16px_40px_rgba(0,0,0,0.16)] bg-[#e3e4e3] dark:bg-[#2A2B2A] text-[#111827] dark:text-[#E5E7EB] dark:border-[rgba(255,255,255,0.1)] overflow-y-auto"
          >
            <AppearanceModalHeader />
            <div className="p-6 space-y-4">

              <ThemeChooserSection
                themeMode={themeMode}
                onSelect={setThemeMode}
              />

                <div className="space-y-2">
                  <BackgroundSection />

                  <div className="h-px bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)]" />

                  <ChatColorSection />
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

