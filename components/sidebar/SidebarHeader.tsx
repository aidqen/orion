'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { SidebarTitle } from "../Sidebar/SidebarTitle"
import { CmdKSearch } from "../ui/cmd-k-search"

interface SidebarHeaderProps {
  onSearchClick?: () => void
}

export function SidebarHeader({ onSearchClick }: SidebarHeaderProps) {
  const { open, toggleSidebar, } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarTitle open={open} toggleSidebar={toggleSidebar} />

          <SidebarMenuItem>

            {/* <button
              type="button"
              className={cn(
                "inline-flex w-full da items-center gap-2 whitespace-nowrap rounded-lg border bg-secondary px-2 py-1 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            )}
              onClick={() => router.push('/')}
            >
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
              {open && 
              <>
                <span>New Chat</span>
                <div className="ms-auto inline-flex gap-0.5">
                </div>
              </>}
            </button> */}
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-1">

            <CmdKSearch open={open} onClick={onSearchClick}/>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
