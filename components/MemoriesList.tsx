"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { deleteMemory } from "@/lib/memory"
import { useQueryClient } from "@tanstack/react-query"

interface Memory {
    id: number
    memory_text: string
    category: string | null
    created_at: string
}

interface MemoriesListProps {
    memories: Memory[]
    userId: string
}

export function MemoriesList({ memories, userId }: MemoriesListProps) {
    const queryClient = useQueryClient()
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleDelete = async (memoryId: number) => {
        setDeletingId(memoryId)
        const supabase = createClient()
        const success = await deleteMemory(supabase, memoryId)

        if (success) {
            queryClient.invalidateQueries({ queryKey: ["memories", userId] })
        } else {
            toast.error("Failed to delete memory")
        }
        setDeletingId(null)
    }

    return (
        <>
            {memories.map((memory) => (
                <div
                    key={memory.id}
                    className="py-[16px] border-b border-gray-200 dark:border-[#333333] text-gray-700 dark:text-[#ECECEC] text-[14px] leading-normal last:border-b-0 flex justify-between items-start gap-3"
                >
                    <span>{memory.memory_text}</span>
                    <button
                        onClick={() => handleDelete(memory.id)}
                        disabled={deletingId === memory.id}
                        className="text-gray-400 hover:text-red-500 dark:text-[#9CA3AF] dark:hover:text-red-500 transition-colors shrink-0 disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </>
    )
}
