'use client';

import { Switch } from './Switch';

interface ChatColorSectionProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function ChatColorSection({ enabled, onChange }: ChatColorSectionProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-[16px] font-medium text-[#111827] dark:text-[#E5E7EB]">
          Chat Color
        </div>
        <div className="text-[14px] text-[#6B7280] dark:text-[#9CA3AF]">
          Customize your chat
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

