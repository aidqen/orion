'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { PRIMARY_NAV } from "./constants"

export function SidebarNav() {
  return (
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
  )
}
