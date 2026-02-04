import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import { getUserChats } from "@/lib/supabase/chats";
import { generateAndSaveChatTitle } from "@/services/client/chat.service";
import type { Chat, MessageInput } from "@/types/chat";

export function useChats() {
	const { user, authenticated } = useUser();
	const queryClient = useQueryClient();

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["chats", user?.id],
		queryFn: async () => {
			if (!authenticated || !user) {
				return [];
			}
			const userChats = await getUserChats(user.id);
			return userChats;
		},
		enabled: !!authenticated && !!user,
		staleTime: 1000 * 10,
		refetchInterval: 5000,
	});

	const addOptimisticChat = (chat: Chat) => {
		queryClient.setQueryData<Chat[]>(["chats", user?.id], (old = []) => [
			chat,
			...old,
		]);
	};

	const updateChatTitle = (chatId: string, newTitle: string) => {
		queryClient.setQueryData<Chat[]>(["chats", user?.id], (old = []) =>
			old.map((chat) =>
				chat.id === chatId ? { ...chat, title: newTitle } : chat,
			),
		);
	};

	const generateChatTitle = async (
		chatId: string,
		firstMessage: MessageInput,
	) => {
		try {
			const { title } = await generateAndSaveChatTitle(
				chatId,
				firstMessage.text,
			);
			updateChatTitle(chatId, title);
		} catch (error) {
			console.error("Failed to generate chat title:", error);
			throw error;
		}
	};

	return {
		chats: data ?? [],
		loading: isLoading,
		error: error as Error | null,
		refetch,
		addOptimisticChat,
		updateChatTitle,
		generateChatTitle,
	};
}
