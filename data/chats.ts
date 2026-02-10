// UNIVERSAL: All functions work everywhere (browser, server components, API routes)

import type { SupabaseClient } from "@supabase/supabase-js";
import { WELCOME_MESSAGE } from "@/constants/prompt.constant";
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

export async function createWelcomeChat(
	userId: string,
	supabaseClient?: SupabaseClient,
): Promise<string> {
	const supabase = supabaseClient || createClient();

	const { data: chatData, error: chatError } = await supabase
		.from("chats")
		.insert({
			user_id: userId,
			title: "Welcome to Orion!",
		})
		.select("id")
		.single();

	if (chatError) throw chatError;

	const chatId = chatData.id as string;

	const { error: messageError } = await supabase.from("chat_messages").insert({
		chat_id: chatId,
		role: "assistant",
		parts_json: [{ type: "text", text: WELCOME_MESSAGE }],
		metadata: {},
	});

	if (messageError) throw messageError;

	return chatId;
}

export async function userHasChats(
	userId: string,
	supabaseClient?: SupabaseClient,
): Promise<boolean> {
	const supabase = supabaseClient || createClient();

	const { count, error } = await supabase
		.from("chats")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId);

	if (error) throw error;

	return (count ?? 0) > 0;
}
