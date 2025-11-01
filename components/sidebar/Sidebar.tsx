'use client'

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarNav } from "./SidebarNav"
import { SidebarFolders } from "./SidebarFolders"
import { SidebarHistory } from "./SidebarHistory"

export function Sidebar() {
  return (
    <ShadcnSidebar collapsible="offcanvas">
      <SidebarHeader />

      <SidebarContent>
        <SidebarNav />
        <SidebarFolders />
        <SidebarHistory />       
      </SidebarContent>
    </ShadcnSidebar>
  )
}
