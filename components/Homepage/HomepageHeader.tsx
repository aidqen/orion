'use client'
import { Palette, Settings } from "lucide-react"
import { useState } from "react"

import { SettingsModal } from "@/components/SettingsModal/SettingsModal"

export function HomepageHeader() {
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    return (
        <>
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
            <div className="w-full z-10 absolute flex flex-row gap-4 items-center justify-end px-4 py-2 top-0">
                <button className="rounded-sm h-7 w-7 flex justify-center items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-[#292929] transition-color duration-200"
                    onClick={() => setIsSettingsModalOpen(true)}
                >
                    <Settings className="h-5 w-5 text-stone-600 dark:text-stone-300" />
                </button>
            </div>
        </>
    )
}