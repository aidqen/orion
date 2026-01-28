'use client';

import { useState } from 'react';
import { Switch } from './Switch';

export function ChatColorSection() {
  const [enabled, setEnabled] = useState(false);
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
        onChange={setEnabled}
        disabled={false}
      />
    </div>
  );
}

