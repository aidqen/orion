"use client";

import { useEffect, useState } from "react";
import { Sidebar as ShadcnSidebar, useSidebar } from "@/components/ui/sidebar";
import { useChats } from "@/hooks";
import { useArtifactStore } from "@/store/useArtifactStore";
import { SearchChatsModal } from "../SearchChatsModal";
import { SidebarHeader } from "../Sidebar/SidebarHeader";
import { SidebarHistory } from "../Sidebar/SidebarHistory";
import { SidebarNav } from "../Sidebar/SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar() {
	const { setOpen } = useSidebar();
	const isArtifactOpen = useArtifactStore((state) => state.isOpen);
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const { chats, loading } = useChats();

	useEffect(() => {
		if (isArtifactOpen) {
			setOpen(false);
		}
	}, [isArtifactOpen, setOpen]);
	return (
		<>
			<ShadcnSidebar className="flex flex-col justify-between h-full">
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
