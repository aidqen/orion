'use client'

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  FolderClosed,
  Globe,
  Home,
  MessageCircle,
  MessageSquarePlus,
  PanelLeft,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"

type MenuItem = {
  icon?: React.ComponentType<{ className?: string }>,
  text: string,
  href?: string
}

const PRIMARY_NAV: MenuItem[] = [
  { icon: Home, text: 'Home', href: '#' },
  { icon: Globe, text: 'Explore Synapse AI', href: '#' }
]

const FOLDERS: MenuItem[] = [
  { icon: FolderClosed, text: 'Selasa', href: '#' },
  { icon: FolderClosed, text: 'Analytica ideas', href: '#' }
]

const HISTORY: MenuItem[] = [
  { text: 'Poem of the past', href: '#' },
  { text: 'Assistance request', href: '#' },
  { text: 'What is this?', href: '#' },
  { text: 'Analytica ideas', href: '#' }
]

export function Sidebar() {
  const { toggleSidebar } = useSidebar()

  return (
    <ShadcnSidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="font-bold text-lg">Synapse</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-2">
          <Button
            className="w-full justify-center gap-2"
            variant="outline"
          >
            <MessageSquarePlus className="size-5" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV.map((item) => (
                <SidebarMenuItem key={item.text}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.text}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Folders Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Folder</SidebarGroupLabel>
          <SidebarGroupAction title="Add Folder">
            <Plus className="size-4" />
            <span className="sr-only">Add Folder</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {FOLDERS.map((item) => (
                <SidebarMenuItem key={item.text}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.text}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* History Section */}
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {HISTORY.map((item) => (
                <SidebarMenuItem key={item.text}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <MessageCircle className="size-4" />
                      <span>{item.text}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Authentication Section - Commented out for now */}
        {/*
        <SidebarGroup>
          <SidebarGroupContent>
            <SignInWithGoogleButton />
          </SidebarGroupContent>
        </SidebarGroup>
        */}
      </SidebarContent>
    </ShadcnSidebar>
  )
}
