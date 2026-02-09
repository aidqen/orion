"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar as ShadcnSidebar, useSidebar } from "@/components/ui/sidebar";
import { useChats } from "@/hooks";
import { useArtifactStore } from "@/store/useArtifactStore";
import { SearchChatsModal } from "../SearchChatsModal";
import { SidebarHeader } from "../Sidebar/SidebarHeader";
import { SidebarHistory } from "../Sidebar/SidebarHistory";
import { SidebarNav } from "../Sidebar/SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar() {
	const { setOpen, state } = useSidebar();
	const isArtifactOpen = useArtifactStore((state) => state.isOpen);
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const { chats, loading } = useChats();
	const wasArtifactOpen = useRef(isArtifactOpen);

	useEffect(() => {
		if (isArtifactOpen && !wasArtifactOpen.current && state === "expanded") {
			setOpen(false);
		}
		wasArtifactOpen.current = isArtifactOpen;
	}, [isArtifactOpen, setOpen, state]);
	return (
		<>
			<ShadcnSidebar className="flex flex-col justify-between h-full dark:bg-card">
				<div>
					<SidebarHeader onSearchClick={() => setIsSearchModalOpen(true)} />

					<SidebarNav />
					<SidebarHistory chats={chats} loading={loading} />
				</div>
				<SidebarFooter />
			</ShadcnSidebar>
			<SearchChatsModal
				open={isSearchModalOpen}
				onOpenChange={setIsSearchModalOpen}
				chats={chats}
			/>
		</>
	);
}
