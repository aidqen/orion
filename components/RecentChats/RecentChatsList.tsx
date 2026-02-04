"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { motion } from "motion/react";
import type { Chat } from "@/types/chat";
import { formatRelativeTime } from "./utils";

interface RecentChatsListProps {
	chats: Chat[];
	onChatClick: (chatId: string) => void;
}

export function RecentChatsList({ chats, onChatClick }: RecentChatsListProps) {
	return (
		<div className="grid grid-cols-3 w-full items-center justify-start gap-4">
			{chats.slice(0, 3).map((chat, index) => (
				<motion.div
					onClick={() => onChatClick(chat.id)}
					initial={{ y: "30%", opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{
						type: "spring",
						stiffness: 100,
						damping: 15,
						mass: 1,
						delay: 0.8 + 0.1 * -index,
						duration: 0.15,
					}}
					key={chat.id}
					className="flex flex-col gap-4 bg-[#FAFBF9] hover:bg-sidebar/50 dark:hover:bg-[#292929] transition-colors p-3 border dark:border-stone-700/60 border-stone-300 rounded-2xl cursor-pointer"
				>
					<IconMessageCircle
						style={{ transform: "rotateY(180deg)" }}
						className="w-5 h-5 text-stone-600 dark:text-stone-300"
					/>
					<div>
						<h4 className="text-sm text-black truncate dark:text-white font-medium">
							{chat.title}
						</h4>
						<span className="text-xs text-stone-500 dark:text-stone-300">
							{formatRelativeTime(chat.createdAt)}
						</span>
					</div>
				</motion.div>
			))}
		</div>
	);
}
