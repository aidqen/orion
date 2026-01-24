'use client';

import { Settings } from 'lucide-react';

export function SettingsModalHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex flex-row items-center gap-2 text-[20px] font-semibold text-[#111827] dark:text-[#E5E7EB]">
        <Settings className='size-5'/>
        Settings
      </h2>
    </div>
  );
}

