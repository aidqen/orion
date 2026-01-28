'use client';

import { Palette } from 'lucide-react';

export function AppearanceModalHeader() {
  return (
    <div className="flex items-center justify-between border-b p-5 pb-3 border-[[rgba(0,0,0,0.06)]] dark:border-[[rgba(255,255,255,0.08)]]">
      <h2 className="flex flex-row items-center gap-1.5 text-[20px] font-semibold text-[#111827] dark:text-[#E5E7EB]">
        <Palette className='size-5'/>
        Appearance
      </h2>
    </div>
  );
}

