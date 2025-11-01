'use client'

import { MessageSquarePlus, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarHeader as ShadcnSidebarHeader, useSidebar } from "@/components/ui/sidebar"

export function SidebarHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <ShadcnSidebarHeader>
      <div className="flex items-center justify-between px-2 py-2">
        <span className="font-bold text-lg">Synapse</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="size-8 cursor-pointer"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-2">
        <Button
          className="w-full justify-center gap-2 cursor-pointer rounded-md"
          variant="outline"
        >
          <MessageSquarePlus className="size-5" />
          New Chat
        </Button>
      </div>
    </ShadcnSidebarHeader>
  )
}
