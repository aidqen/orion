"use client";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/shared";
import { IntegrationsModal } from "../Modals/IntegrationModal/IntegrationsModal";
import { MemoriesModal } from "../Modals/MemoriesModal/MemoriesModal";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import {
	type ModalState,
	ProfileDropdownBubble,
} from "./ProfileDropdownBubble";

export function Header() {
	const isMobile = useIsMobile();
	const { state } = useSidebar();
	const [activeModal, setActiveModal] = useState<ModalState>("closed");

	return (
		<div className="w-full flex relative justify-end items-center p-2 gap-10 pe-6">
			<SidebarTrigger
				className={cn(
					"absolute top-1/2 left-2 -translate-y-1/2 z-5 flex justify-center items-center dark:text-white text-black size-9",
					state === "expanded" && !isMobile ? "hidden" : "flex",
				)}
			/>
			<ProfileDropdownBubble setActiveModal={setActiveModal} />
			<MemoriesModal
				open={activeModal === "memories"}
				onOpenChange={(open) => setActiveModal(open ? "memories" : "closed")}
			/>
			<IntegrationsModal
				open={activeModal === "integrations"}
				onOpenChange={(open) =>
					setActiveModal(open ? "integrations" : "closed")
				}
			/>
		</div>
	);
}
