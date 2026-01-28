'use client';

import { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { BackgroundImageItemProps } from './types';

export const BackgroundImageItem = memo(function BackgroundImageItem({ image, isSelected, onSelect }: BackgroundImageItemProps) {
  return (
    <button
      onClick={() => onSelect(image.url)}
      className={cn(
        "aspect-video rounded-lg bg-gray-200 dark:bg-[#2C2C2E]",
        "hover:bg-gray-300 dark:hover:bg-[#3A3A3C]",
        "transition-colors cursor-pointer relative overflow-hidden group",
        isSelected && "ring-2 ring-[#6366F1]"
      )}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors" />
      <Image
        src={image.url}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
    </button>
  );
});
