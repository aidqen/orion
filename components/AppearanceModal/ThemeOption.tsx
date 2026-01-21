'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeMode } from './types';

interface ThemeOptionProps {
  option: {
    key: ThemeMode;
    text: string;
    caption: string;
  };
  themeMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}

export function ThemeOption({ option, themeMode, onSelect }: ThemeOptionProps) {
  // Determine the preview theme based on the option
  const getPreviewTheme = () => {
    if (option.key === 'light') return 'light';
    if (option.key === 'dark') return 'dark';
    if (option.key === 'system') {
      // For system, show what the system preference would be
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light'; // fallback
    }
    return 'light';
  };

  const previewTheme = getPreviewTheme();
  const isDark = previewTheme === 'dark';
  const isSelected = themeMode === option.key;

  return (
    <button
      onClick={() => onSelect(option.key)}
      className={cn(
        'group relative p-2 rounded-[14px] cursor-pointer border transition-all',
        'bg-[#F9FAFB] border-[#E5E7EB] dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.08)]',
        'hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        isSelected && 'ring-2 ring-[#6366F1] '
      )}
    >
      {/* Preview */}
      <div className={cn(
        "h-[140px] w-full rounded-lg border p-2",
        isDark 
          ? "bg-[#1F2937] border-[rgba(255,255,255,0.12)]" 
          : "bg-white border-[#E5E7EB]"
      )}>
        <div className="space-y-2">
          {/* Header bar */}
          <div className={cn(
            "h-4 rounded",
            isDark 
              ? "bg-[rgba(255,255,255,0.08)]" 
              : "bg-[#F3F4F6]"
          )} />
          {/* Sidebar */}
          <div className="flex gap-2">
            <div className={cn(
              "w-11 h-12 rounded",
              isDark 
                ? "bg-[rgba(255,255,255,0.08)]" 
                : "bg-[#F3F4F6]"
            )} />
            <div className="flex-1 space-y-1">
              <div className={cn(
                "h-3 rounded",
                isDark 
                  ? "bg-[rgba(255,255,255,0.12)]" 
                  : "bg-[#E5E7EB]"
              )} />
              <div className={cn(
                "h-3 rounded w-3/4",
                isDark 
                  ? "bg-[rgba(255,255,255,0.12)]" 
                  : "bg-[#E5E7EB]"
              )} />
              <div className={cn(
                "h-3 rounded w-1/2",
                isDark 
                  ? "bg-[rgba(255,255,255,0.12)]" 
                  : "bg-[#E5E7EB]"
              )} />
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <div className="text-[14px] font-medium text-[#111827] dark:text-[#E5E7EB]">
          {option.text}
        </div>
        <div className="text-[12px] text-[#6B7280] dark:text-[#9CA3AF]">
          {option.caption}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

