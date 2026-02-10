"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { Chat } from "@/types/chat";
import { RecentChatsList } from "./RecentChatsList";

interface RecentChatsProps {
	chats?: Chat[];
	loading?: boolean;
}

export function RecentChats({ chats = [], loading = false }: RecentChatsProps) {
	const router = useRouter();

	const sortedChats = useMemo(() => {
		return [...chats].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}, [chats]);

	const isHidden = useMemo(
		() => !sortedChats.length && !loading,
		[sortedChats.length, loading],
	);

	const handleChatClick = (chatId: string) => {
		router.push(`/chat/${chatId}`);
	};

	return (
		<div className="w-full flex flex-col items-start gap-3 h-[150px]">
			{!isHidden && (
				<>
					<div className="flex flex-row items-center justify-start gap-1">
						<motion.h3
							initial={{ y: "50%", opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{
								type: "spring",
								bounce: 0,
								damping: 15,
								mass: 1,
								stiffness: 100,
								delay: 0.7,
								duration: 0.1,
							}}
							className="recent-chats-header tracking-tight cursor-pointer group flex flex-row items-center gap-1.5 text-lg font-medium text-foreground"
						>
							Your recent chats
							<ChevronRight className="chevron group-hover:translate-x-1 transition-transform duration-100 size-4 mt-px text-foreground" />
						</motion.h3>
					</div>
					<RecentChatsList chats={sortedChats} onChatClick={handleChatClick} />
				</>
			)}
		</div>
	);
}
