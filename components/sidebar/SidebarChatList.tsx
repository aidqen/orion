'use client'

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
  return (
    <>
      {chats.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton asChild>
            <a href={`chat/${item.id}`}>
              <MessageCircle size={4} />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  )
}

