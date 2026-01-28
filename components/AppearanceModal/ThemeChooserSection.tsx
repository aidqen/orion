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
    <div className="space-y-5">
      <div className='flex flex-col gap-1'>
        <h3 className="text-[16px] leading-tight font-medium text-[#111827] dark:text-[#E5E7EB]">
          Interface Theme
        </h3>
        <p className='text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-tight'>Select or customize your UI theme</p>
      </div>
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

