"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PRIMARY_NAV } from "./constants";
import Link from "next/link";

export function SidebarNav() {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{PRIMARY_NAV.map((item) => (
						<SidebarMenuItem key={item.text}>
							<SidebarMenuButton asChild>
								<Link href={`${item.href}`}>
									{item.icon && <item.icon className="size-4" />}
									<span>{item.text}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
