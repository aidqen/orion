'use client'
import { Palette, PanelLeft,  Settings } from "lucide-react"
import { useState } from "react"

import { AppearanceModal } from "@/components/AppearanceModal/AppearanceModal"
import { useSidebar } from "./ui/sidebar"

export function HomepageHeader() {
    const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false)
    const { open, toggleSidebar } = useSidebar()
    return (
        <>
            <AppearanceModal
                isOpen={isAppearanceModalOpen}
                onClose={() => setIsAppearanceModalOpen(false)}
                // onSave={handleAppearanceSave}
            />
            <div className="w-full z-10 absolute flex flex-row gap-4 items-center justify-end px-4 py-2 top-0">
                {!open && (
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="absolute left-4 flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:bg-[#F3F4F6] dark:border-white/10 dark:bg-[#161A20] dark:text-white dark:hover:bg-white/10"
                        aria-label="Open sidebar"
                    >
                        <PanelLeft className="size-5" />
                    </button>
                )}
                <button
                    onClick={() => setIsAppearanceModalOpen(true)}
                    className="cursor-pointer px-2 h-7 flex flex-row items-center gap-1 dark:bg-[#222124] dark:hover:bg-[#292929] bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-sm text-[0.8rem] text-stone-600 dark:text-stone-300"
                >
                    <Palette className="h-4 w-4" />
                    Appearance
                </button>
                <button className="rounded-sm h-7 w-7 flex justify-center items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-[#292929] transition-color duration-200">
                    <Settings className="h-5 w-5 text-stone-600 dark:text-stone-300" />
                </button>
            </div>
        </>
    )
}