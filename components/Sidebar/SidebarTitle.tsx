"use client";

import { OrionIcon } from "@/components/ui/orion-icon";
import { SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";

export function SidebarTitle() {
	return (
		<SidebarMenuItem className="flex justify-between items-center mb-5 ps-2">
			<OrionIcon width="1.3em" height="1.3em" />
			<SidebarTrigger />
		</SidebarMenuItem>
	);
}
