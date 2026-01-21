'use client';

import { Palette } from 'lucide-react';

export function AppearanceModalHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex flex-row items-center gap-1 text-[20px] font-semibold text-[#111827] dark:text-[#E5E7EB]">
        <Palette className='w-6 h-6'/>
        Appearance
      </h2>
    </div>
  );
}

