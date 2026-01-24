'use client'

import { useParams } from "next/navigation"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Chat } from "@/types/chat"

interface SidebarChatListProps {
  chats: Chat[]
}

export function SidebarChatList({ chats }: SidebarChatListProps) {
  const params = useParams()
  const currentChatId = params?.chatId as string | undefined

  return (
    <>
      {chats.map((item) => {
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
    </>
  )
}

