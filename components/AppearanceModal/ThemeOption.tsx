'use client';

import { useMemo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeMode } from './types';

interface ThemeOptionProps {
  option: {
    key: ThemeMode;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  themeMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}

export function ThemeOption({ option, themeMode, onSelect }: ThemeOptionProps) {
  const previewTheme = useMemo(() => {
    if (option.key === 'light') return 'light';
    if (option.key === 'dark') return 'dark';
    if (option.key === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return 'light';
  }, [option.key]);

  const isDark = previewTheme === 'dark';
  const isSelected = themeMode === option.key;

  return (
    <div className='w-full flex flex-col'>

      <button
        onClick={() => onSelect(option.key)}
        className={cn(
          'group relative p-0.5 rounded-[14px] cursor-pointer border transition-all',
          'bg-[#F9FAFB] border-[#E5E7EB] dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.08)]',
          'hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
          isSelected && 'ring-2 ring-[#6366F1] '
        )}
      >
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

        {/* Selection indicator */}
      </button>
      <div className="mt-3 text-center flex flex-row justify-center items-center gap-1.5">
        <option.icon className="size-5 text-gray-700 dark:text-[#9CA3AF]" />
        <div className="text-[14px] font-medium text-[#111827] dark:text-[#E5E7EB]">
          {option.text}
        </div>
      </div>
    </div>
  );
}

