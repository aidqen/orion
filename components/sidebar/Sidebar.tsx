'use client'

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
} from "@/components/ui/sidebar"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarNav } from "./SidebarNav"
// import { SidebarFolders } from "./SidebarFolders"
import { SidebarHistory } from "./SidebarHistory"

export function Sidebar() {
  return (
    <ShadcnSidebar collapsible="icon" >
      <SidebarHeader />

      <SidebarContent>
        <SidebarNav />
        {/* <SidebarFolders /> */}
        <SidebarHistory />       
      </SidebarContent>
    </ShadcnSidebar>
  )
}
