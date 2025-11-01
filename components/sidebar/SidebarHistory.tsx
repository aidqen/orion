'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HISTORY } from "./constants"

export function SidebarHistory() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>History</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {HISTORY.map((item) => (
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
