'use client'

import { MessageSquarePlus } from "lucide-react"
import {
  SidebarHeader as ShadcnSidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { SidebarTitle } from "./SidebarTitle"

export function SidebarHeader() {
  const router = useRouter()
  const { open, toggleSidebar } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarTitle open={open} toggleSidebar={toggleSidebar} />
          <SidebarMenuItem>
            <SidebarMenuButton
              variant="outline"
              onClick={() => router.push('/')}
            >
              <MessageSquarePlus />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
