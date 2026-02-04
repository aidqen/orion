"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { Chat } from "@/types/chat";

interface SidebarChatListProps {
	chats: Chat[];
	loading: boolean;
}

function ChatSkeleton({ number }: { number: number }) {
	return (
		<>
			{Array.from({ length: number }).map((_, index) => (
				<SidebarMenuItem key={index}>
					<div className="flex w-full items-center gap-2 rounded-md p-2">
						<div className="size-4 rounded-full bg-muted animate-pulse" />
						<div className="h-4 flex-1 rounded bg-muted animate-pulse" />
					</div>
				</SidebarMenuItem>
			))}
		</>
	);
}

export function SidebarChatList({ chats, loading }: SidebarChatListProps) {
	const params = useParams();
	const currentChatId = params?.chatId as string | undefined;

	return (
		<>
			{chats.map((item) => {
				const isActive = currentChatId === item.id;

				return (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton asChild isActive={isActive}>
							{isActive ? (
								<span className="cursor-default ps-4">
									<MessageCircle size={4} />
									<span>{item.title}</span>
								</span>
							) : (
								<Link href={`/chat/${item.id}`} className="ps-4">
									<MessageCircle size={4} />
									<span>{item.title}</span>
								</Link>
							)}
						</SidebarMenuButton>
					</SidebarMenuItem>
				);
			})}
			{loading && (
				<>
					<ChatSkeleton number={10} />
				</>
			)}
		</>
	);
}
