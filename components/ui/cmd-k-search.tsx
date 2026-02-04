"use client"

import { useState, useRef, useEffect, ButtonHTMLAttributes } from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CmdKSearchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    open: boolean;
}

export function CmdKSearch({ className, open, ...props }: CmdKSearchProps) {
    const [isMac, setIsMac] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                buttonRef.current?.click()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <button
            ref={buttonRef}
            type="button"
            className={cn(
                "inline-flex w-full da items-center gap-2 rounded-lg border bg-white p-1.5 ps-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                className
            )}
            {...props}
        >
            <Search className="h-4 w-4" aria-hidden="true" />
            {open && 
            <>
            <span>
                Search
            </span>
            <div className="ms-auto inline-flex gap-0.5">
                <kbd className="rounded-sm border bg-background px-2 py-1 font-mono text-[10px] font-medium text-muted-foreground">
                        {isMac ? "⌘" : "Ctrl"}
                    </kbd>
                    <kbd className="rounded-sm border bg-background px-2 py-1 font-mono text-[10px] font-medium text-muted-foreground">
                        K
                    </kbd>
                </div>
            </>}
        </button>
    )
}
