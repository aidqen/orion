'use client';

import { Shimmer } from '@/components/ai-elements/shimmer';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchHeaderProps {
  query: string;
  isOutputAvailable: boolean;
}

export function SearchHeader({ query, isOutputAvailable }: SearchHeaderProps) {
  const loadingText = `Searching data for ${query}`;
  const successText = `Found results for ${query}`;
  const words = loadingText.split(' ');

  return (
    <div className="px-3 py-3.5 flex items-center gap-2 text-sm text-text-300 overflow-hidden">
      <div className="w-5 h-4 flex justify-center items-center relative">
        <Search size={16} className="text-text-300" />
      </div>
      <span className="font-medium flex flex-wrap gap-x-1">
        {isOutputAvailable ? (
          <span>{successText}</span>
        ) : (
          <Shimmer duration={1.1}>{loadingText}</Shimmer>
        )}
      </span>
    </div>
  );
}
