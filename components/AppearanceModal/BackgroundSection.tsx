'use client';

import { Switch } from './Switch';

interface BackgroundSectionProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function BackgroundSection({ enabled, onChange }: BackgroundSectionProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-[16px] font-medium text-[#111827] dark:text-[#E5E7EB]">
          Background
        </div>
        <div className="text-[14px] text-[#6B7280] dark:text-[#9CA3AF]">
          Customize your background
        </div>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={false}
      />
    </div>
  );
}

