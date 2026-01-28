'use client';

import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { BackgroundImageItem } from './BackgroundImageItem';
import type { BackgroundImageGridProps } from './types';

export const BackgroundImageGrid = memo(function BackgroundImageGrid({
  category,
  onImageSelect,
  selectedImageUrl
}: BackgroundImageGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-[#EBEBF5]">
          {category.title}
        </h4>
        <button className="flex items-center gap-1 text-xs text-gray-600 dark:text-[#8E8E93] hover:text-gray-900 dark:hover:text-[#EBEBF5] transition-colors">
          View All
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {category.images.map((image) => (
          <BackgroundImageItem
            key={image.id}
            image={image}
            isSelected={selectedImageUrl === image.url}
            onSelect={onImageSelect}
          />
        ))}
      </div>
    </div>
  );
});
