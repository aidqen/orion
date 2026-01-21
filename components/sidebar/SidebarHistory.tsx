'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useChats } from "@/hooks"
import { SidebarChatList } from "./SidebarChatList"

export function SidebarHistory() {
  const { chats } = useChats()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>History</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarChatList chats={chats} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
