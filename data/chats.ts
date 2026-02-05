// UNIVERSAL: All functions work everywhere (browser, server components, API routes)

import { createClient } from "@/infra/supabase/client";
import type { Chat } from "@/types/chat";

export interface ChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

/**
 * Creates a new chat for the given user
 */
export async function createChat(userId: string) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("chats")
		.insert({
			user_id: userId,
		})
		.select("id")
		.single();

	if (error) throw error;
	return data.id as string;
}

export async function getUserChats(userId: string): Promise<Chat[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("chats")
		.select(`
    id,
    created_at,
    title
  `)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(10);

	if (error) throw error;

	return (data || []).map((chat) => ({
		id: chat.id,
		title: chat.title || "New Chat",
		createdAt: chat.created_at,
	}));
}

export async function updateChatTitle(
	chatId: string,
	title: string,
): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("chats")
		.update({ title })
		.eq("id", chatId);

	if (error) throw error;
}

// Removed duplicate functions:
// - saveMessages (canonical version in messages.ts with tempId support)
// - getChatMessages (canonical version in messages.ts with better typing)
