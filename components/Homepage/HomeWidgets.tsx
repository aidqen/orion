"use client";

import { RecentChats } from "@/components/RecentChats";
import type { Chat } from "@/types/chat";
import { ContextAwareWidget } from "./ContextAwareWidget";
import { WeatherWidget } from "./WeatherWidget";

interface HomeWidgetsProps {
	chats?: Chat[];
	loading?: boolean;
}

export function HomeWidgets({ chats = [], loading = false }: HomeWidgetsProps) {
	return (
		<div className="w-full flex flex-col gap-7 mt-5">
			<div className="grid grid-cols-[2.5fr_4fr] gap-3 w-full">
				<WeatherWidget />
				<ContextAwareWidget />
			</div>

			<RecentChats chats={chats} loading={loading} />
		</div>
	);
}
