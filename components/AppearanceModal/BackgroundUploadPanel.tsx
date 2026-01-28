'use client';

import { memo } from 'react';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import type { BackgroundUploadPanelProps } from './types';

export const BackgroundUploadPanel = memo(function BackgroundUploadPanel({
  currentImage,
  onUploadClick
}: BackgroundUploadPanelProps) {
  return (
    <div className="space-y-3">
      <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-[#2C2C2E] border border-gray-200 dark:border-white/10 relative overflow-hidden flex items-center justify-center">
        {currentImage && (
          <Image
            src={currentImage}
            alt="Current background"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
      <button
        onClick={onUploadClick}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-[#38383A] text-sm font-medium text-gray-900 dark:text-[#EBEBF5] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add image
      </button>
    </div>
  );
});
