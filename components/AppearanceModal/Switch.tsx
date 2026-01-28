'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onChange, disabled = false }: SwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors',
        'focus:outline-none focus:ring-2 focus-within:ring-[#6366F1] focus-within:ring-offset-2',
        checked
          ? 'bg-[#111827] dark:bg-[#E5E7EB]'
          : 'bg-gray-400/70 dark:bg-[rgba(255,255,255,0.08)]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.20)] transition-transform',
          checked ? 'translate-x-6' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

