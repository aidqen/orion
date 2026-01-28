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
  const { open, toggleSidebar, } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarTitle open={open} toggleSidebar={toggleSidebar} />
          <SidebarMenuItem>
            <SidebarMenuButton
              size="default"
              className="dark:bg-sidebar-accent bg-white hover:bg-sidebar-accent/70 text-sidebar-accent-foreground transition-all border border-sidebar-border mt-2 group text-center py-2"

              onClick={() => router.push('/')}
            >
              <MessageSquarePlus className="text-primary transition-transform duration-200" />
              {open && <span className="font-medium">New Chat</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
