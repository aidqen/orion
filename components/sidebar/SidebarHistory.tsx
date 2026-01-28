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
  const { chats, loading } = useChats()
  return (
    <SidebarGroup>
      {chats.length ? <SidebarGroupLabel className="px-1.5 text-xs">History</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarChatList chats={chats} loading={loading} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
