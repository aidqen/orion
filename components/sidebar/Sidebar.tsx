'use client'

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarNav } from "./SidebarNav"
// import { SidebarFolders } from "./SidebarFolders"
import { SidebarHistory } from "./SidebarHistory"
import { useArtifactStore } from "@/store/useArtifactStore"
import { useEffect } from "react"

export function Sidebar() {
  const { setOpen } = useSidebar()
  const isArtifactOpen = useArtifactStore(state => state.isOpen)
  useEffect(() => {
    console.log("🚀 ~ Sidebar ~ isArtifactOpen:", isArtifactOpen)
    if (isArtifactOpen) {
      setOpen(false)
    }
  }, [isArtifactOpen])
  return (
    <ShadcnSidebar collapsible="icon" className="backdrop-blur-lg">
      <SidebarHeader />

      <SidebarContent>
        <SidebarNav />
        {/* <SidebarFolders /> */}
        <SidebarHistory />
      </SidebarContent>
    </ShadcnSidebar>
  )
}
