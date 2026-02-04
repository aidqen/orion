"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
} from "@/components/ui/sidebar";
import type { Chat } from "@/types/chat";
import { SidebarChatList } from "./SidebarChatList";

interface SidebarHistoryProps {
	chats: Chat[];
	loading: boolean;
}

export function SidebarHistory({ chats, loading }: SidebarHistoryProps) {
	return (
		<SidebarGroup>
			{chats.length ? (
				<SidebarGroupLabel className="px-1.5 text-xs">
					History
				</SidebarGroupLabel>
			) : null}
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarChatList chats={chats} loading={loading} />
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
