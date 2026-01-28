'use client';

import { useAuthPopupStore } from '@/store/useAuthPopupStore';
import { LogOut, LogIn } from 'lucide-react';

interface SettingsModalFooterProps {
  onClose: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export function SettingsModalFooter({ onClose, onLogout, isAuthenticated }: SettingsModalFooterProps) {
  const openAuthPopup = useAuthPopupStore(state => state.open)
  return (
    <div className="flex justify-between items-center pt-3">
      {isAuthenticated ? (
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 h-9 rounded-[12px] border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/30 text-red-600 dark:text-red-400 text-[14px] font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      ) : (
        <button
          onClick={openAuthPopup}
          className="flex items-center gap-2 px-4 py-2 h-9 rounded-[12px] border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-[14px] font-medium hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Log in
        </button>
      )}
      
      <button
        onClick={onClose}
        className="px-4 py-2 h-9 rounded-[12px] bg-[#111827] dark:bg-[#E5E7EB] text-white dark:text-[#0B0F1A] text-[14px] font-medium hover:bg-black dark:hover:bg-white transition-colors"
      >
        Done
      </button>
    </div>
  );
}
