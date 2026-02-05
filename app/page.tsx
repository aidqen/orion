"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomPromptInput } from "@/components/CustomPromptInput/CustomPromptInput";
import { HomeWidgets } from "@/components/Homepage/HomeWidgets";
import { QuickActionButtons } from "@/components/QuickActionButtons";
import { AUTH_POPUP_MODES } from "@/constants/auth.constant";
import { useUser } from "@/contexts/UserContext";
import { createChat } from "@/data/chats";
import { useChats } from "@/hooks";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";
import { useChatStore } from "@/store/useChatStore";
import type { MessageInput } from "@/types/chat";

type User = {
	user_metadata?: {
		name?: string;
	};
};

export default function Home() {
	const [input, setInput] = useState("");
	const { user, authenticated } = useUser();
	const { chats, loading, refetch } = useChats();
	const router = useRouter();
	const setPendingMessage = useChatStore((state) => state.setPendingMessage);
	const openAuthPopup = useAuthPopupStore((state) => state.open);

	const startChat = async (message: MessageInput) => {
		if (!authenticated || !user) {
			openAuthPopup(AUTH_POPUP_MODES.SIGN_IN);
			return;
		}
		const chatId = await createChat(user.id);
		setPendingMessage(message);
		refetch();
		router.push(`/chat/${chatId}`);
	};

	return (
		<>
			<div className="w-full h-full flex flex-col pt-[20vh] md:pt-[20vh] justify-start items-center bg-background text-black dark:text-white">
				<div className="w-full max-w-[720px] px-5 flex flex-col items-center gap-2">
					<div className="flex flex-col items-center text-black dark:text-white mb-8">
						<h1 className="text-3xl font-medium tracking-tight mb-1">
							Good evening,{" "}
							<span className="capitalize">
								{(user as User | null)?.user_metadata?.name || "user"}
							</span>
						</h1>
						<p className="text-2xl text-stone-600 tracking-tight dark:text-gray-300">
							How can I help you?
						</p>
					</div>
					<CustomPromptInput
						setInput={setInput}
						input={input}
						onSubmit={startChat}
						chatId={""}
						userId={user?.id}
					/>
					<QuickActionButtons />
					<HomeWidgets chats={chats} loading={loading} />
				</div>
			</div>
		</>
	);
}
