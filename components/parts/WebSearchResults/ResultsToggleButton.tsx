'use client';

import { ChevronDown, Globe } from 'lucide-react';

interface ResultsToggleButtonProps {
  query: string;
  resultCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ResultsToggleButton({
  query,
  resultCount,
  isExpanded,
  onToggle
}: ResultsToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full hover:bg-bg-200 rounded py-1.5 gap-2 transition-colors"
    >
      <div className="flex items-center gap-2 text-sm">
        <div className="h-6 w-5 flex justify-center items-center relative">
          <Globe size={16} className="" />
        </div>
        <span className="leading-tight text-start h-full">{query}</span>
      </div>

      <div className="flex flex-row items-center gap-2">
        <span className="text-stone-700 dark:text-stone-300 text-xs whitespace-nowrap leading-tight h-full flex items-center">
          {resultCount} results
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>
    </button>
  );
}
