'use client'

import { PanelLeft } from "lucide-react"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { AnimatePresence, motion } from "motion/react"

const letterVariants = {
    hidden: {
        opacity: 0,
        // filter: "blur(10px)"
    },
    visible: (i: number) => ({
        opacity: 1,
        // filter: "blur(0px)",
        transition: {
            duration: 0.1,
            ease: "easeInOut" as const,
            //   delay: i * 0.015
        }
    }),
    exit: (i: number) => ({
        opacity: 0,
        // filter: "blur(10px)",
        transition: {
            duration: 0.1,
            ease: "easeInOut" as const,
            //   delay: (array.length - 1 - i) * 0.015
        }
    })
}

interface SidebarTitleProps {
    open: boolean
    toggleSidebar: () => void
}

export function SidebarTitle({ open, toggleSidebar }: SidebarTitleProps) {
    return (
        <SidebarMenuItem className="flex justify-between items-center mb-5">
            <AnimatePresence mode="popLayout">
                {open && (
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex text-base"
                    >
                        {"Planwise".split("").map((letter, index, array) => (
                            <motion.span
                                key={index}
                                custom={index}
                                variants={letterVariants}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </motion.h1>
                )}
            </AnimatePresence>
            <motion.div layout onClick={toggleSidebar} className="cursor-pointer p-2" transition={{ duration: 0.2, ease: 'linear' }}>
                <PanelLeft size={18} />
            </motion.div>
        </SidebarMenuItem>
    )
}

