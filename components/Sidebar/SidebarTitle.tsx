"use client";

import { SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";

export function SidebarTitle() {
	return (
		<SidebarMenuItem className="flex justify-between items-center mb-5 ps-2">
			<h1 className="text-lg uppercase">Orion</h1>
			<SidebarTrigger />
		</SidebarMenuItem>
	);
}
