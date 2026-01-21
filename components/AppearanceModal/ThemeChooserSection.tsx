'use client';

import type { ThemeMode } from './types';
import { themeOptions } from './constants';
import { ThemeOption } from './ThemeOption';

interface ThemeChooserSectionProps {
  themeMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}

export function ThemeChooserSection({ themeMode, onSelect }: ThemeChooserSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[16px] font-medium text-[#111827] dark:text-[#E5E7EB]">
        Theme
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {themeOptions.map((option) => (
          <ThemeOption
            key={option.key}
            option={option}
            themeMode={themeMode}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

