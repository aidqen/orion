'use client'
import { Palette, Settings } from "lucide-react"
import { useState } from "react"

import { AppearanceModal } from "@/components/AppearanceModal/AppearanceModal"
import { SettingsModal } from "@/components/SettingsModal/SettingsModal"

export function HomepageHeader() {
    const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    return (
        <>
            <AppearanceModal
                isOpen={isAppearanceModalOpen}
                onClose={() => setIsAppearanceModalOpen(false)}
            />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
            <div className="w-full z-10 absolute flex flex-row gap-4 items-center justify-end px-4 py-2 top-0">
                <button
                    onClick={() => setIsAppearanceModalOpen(true)}
                    className="cursor-pointer px-2.5 h-7 flex flex-row items-center gap-1  dark:hover:bg-[#2C2B29] dark:bg-[#2D2D2F] bg-gray-200/50 hover:bg-gray-200/80 transition-colors duration-200 rounded-sm text-[0.8rem] text-black/80 dark:text-stone-300 font-medium"
                >
                    <Palette className="h-4 w-4" />
                    Appearance
                </button>
                <button className="rounded-sm h-7 w-7 flex justify-center items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-[#292929] transition-color duration-200"
                    onClick={() => setIsSettingsModalOpen(true)}
                >
                    <Settings className="h-5 w-5 text-stone-600 dark:text-stone-300" />
                </button>
            </div>
        </>
    )
}