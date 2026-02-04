"use client"

import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Chat } from "@/types/chat"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Modal } from "./Modal"

interface SearchChatsModalProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    chats?: Chat[]
}

export function SearchChatsModal({ open, onOpenChange, chats = [] }: SearchChatsModalProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange?.(!open)
            }
            if (e.key === "Escape" && open) {
                onOpenChange?.(false)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, onOpenChange])

    const filteredChats = useMemo(() => {
        if (!searchQuery) return chats
        return chats.filter(chat =>
            chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [chats, searchQuery])

    const handleChatSelect = (chatId: string) => {
        router.push(`/chat/${chatId}`)
        onOpenChange?.(false)
    }

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <div className="sr-only">Search Commands</div>

            <div className="flex h-[56px] items-center justify-between border-b border-border px-4 py-4">
                <input
                    type="text"
                    placeholder="Search for apps and commands..."
                    className="w-full bg-transparent text-base font-normal text-foreground placeholder:text-muted-foreground focus:outline-none border-none"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex items-center text-sm">
                    <span>Close</span>
                    <span className="ml-[6px] whitespace-nowrap rounded-[4px] bg-border px-[6px] py-[2px] text-muted-foreground">⌘ K</span>
                </div>
            </div>

            <div className="flex flex-col gap-[2px] p-3 max-h-[600px] overflow-y-auto">
                {filteredChats.length > 0 && (
                    <>
                        <div className="mb-2 ml-2 text-[12px] font-semibold text-muted-foreground">Chats</div>
                        <div className="flex flex-col gap-[2px]">
                            {filteredChats.map(chat => (
                                <ListItem
                                    key={chat.id}
                                    title={chat.title}
                                    rightLabel="Open"
                                    onClick={() => handleChatSelect(chat.id)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}

interface ListItemProps {
    title: string
    rightLabel: string
    onClick?: () => void
}

function ListItem({ title, rightLabel, onClick }: ListItemProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-3 py-[10px] rounded-lg cursor-pointer hover:bg-accent",
            )}
        >
            <div className="flex items-center overflow-hidden">
                <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] mr-3"
                >
                    <MessageCircle size={20} className="text-foreground" />
                </div>
                <span className="truncate text-[14px] font-medium text-foreground">
                    {title}
                </span>
            </div>

            <span className="shrink-0 text-[13px] text-muted-foreground">
                {rightLabel}
            </span>
        </div>
    )
}
