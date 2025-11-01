'use client'

import { Plus } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FOLDERS } from "./constants"

export function SidebarFolders() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folder</SidebarGroupLabel>
      <SidebarGroupAction title="Add Folder" className="">
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
  )
}
