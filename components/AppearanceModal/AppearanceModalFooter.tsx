'use client';

interface AppearanceModalFooterProps {
  onClose: () => void;
  onSave: () => void;
}

export function AppearanceModalFooter({ onClose, onSave }: AppearanceModalFooterProps) {
  return (
    <div className="flex justify-end gap-3 pt-3">
      <button
        onClick={onClose}
        className="px-4 py-2 h-9 rounded-[12px] border border-[rgba(17,24,39,0.06)] bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.04)] text-[#111827] dark:text-[#E5E7EB] text-[14px] font-medium hover:bg-[#E5E7EB] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 h-9 rounded-[12px] bg-[#111827] dark:bg-[#E5E7EB] text-white dark:text-[#0B0F1A] text-[14px] font-medium hover:bg-black dark:hover:bg-white transition-colors"
      >
        Save changes
      </button>
    </div>
  );
}

