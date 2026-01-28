'use client';

import { memo } from 'react';
import { Switch } from './Switch';
import type { BackgroundControlsProps } from './types';

export const BackgroundControls = memo(function BackgroundControls({
  blurEnabled,
  onBlurToggle,
}: BackgroundControlsProps) {
  return (
    <div className="space-y-6">
      {/* Blur */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-900 dark:text-[#EBEBF5]">Blur</span>
        <Switch checked={blurEnabled} onChange={onBlurToggle} />
      </div>
    </div>
  );
});
