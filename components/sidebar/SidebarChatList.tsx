'use client'

import { useParams } from "next/navigation"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Chat } from "@/types/chat"
import { AnimatePresence, motion } from "motion/react";

interface SidebarChatListProps {
  chats: Chat[]
  loading: boolean
}

function ChatSkeleton({number}: {number: number}) {
  return (
    <>
    {Array.from({ length: number }).map((_, index) => (
      <SidebarMenuItem key={index}>
        <div className="flex w-full items-center gap-2 rounded-md p-2">
          <div className="size-4 rounded-full bg-muted animate-pulse" />
          <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
        </div>
      </SidebarMenuItem>
    ))}
    </>
  );
}

export function SidebarChatList({ chats, loading }: SidebarChatListProps) {
  const params = useParams()
  const currentChatId = params?.chatId as string | undefined

  return (
    <>
      {chats.map((item, index) => {
        const isActive = currentChatId === item.id

        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild isActive={isActive}>
              {isActive ? (
                <span className="cursor-default">
                  <MessageCircle size={4} />
                  <span>{item.title}</span>
                </span>
              ) : (
                <Link href={`/chat/${item.id}`}>
                  <MessageCircle size={4} />
                  <span>{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
      {loading  && (
        <>
          <ChatSkeleton number={10} />
        </>
      )}
    </>
  )
}

