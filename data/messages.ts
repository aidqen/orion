// UNIVERSAL: All functions work everywhere (browser, server components, API routes)

import type { TextUIPart } from "ai";
import { createClient } from "@/infra/supabase/client";

export interface Message {
	id?: string;
	role: "user" | "assistant" | "system";
	tempId?: string;
	parts: TextUIPart[];
	metadata?: Record<string, unknown>;
	model?: string;
	tokenUsage?: {
		promptTokens?: number;
		completionTokens?: number;
		totalTokens?: number;
	};
}

/**
 * Saves a single message to the chat_messages table
 */
export async function saveMessage(chatId: string, message: Message) {
	const supabase = createClient();

	const messageToInsert = {
		chat_id: chatId,
		role: message.role,
		parts_json: message.parts || [],
		metadata: message.metadata || {},
		model: message.model || null,
		token_usage: message.tokenUsage || null,
	};

	const { data, error } = await supabase
		.from("chat_messages")
		.insert(messageToInsert)
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Saves multiple messages to the chat_messages table
 */
export async function saveMessages(chatId: string, messages: Message[]) {
	const supabase = createClient();

	const messagesToInsert = messages.map((msg) => ({
		chat_id: chatId,
		temp_id: msg.tempId,
		role: msg.role,
		parts_json: msg.parts || [],
		metadata: msg.metadata || {},
		model: msg.model || null,
		token_usage: msg.tokenUsage || null,
	}));

	const { data, error } = await supabase
		.from("chat_messages")
		.insert(messagesToInsert)
		.select();

	if (error) throw error;
	return data;
}

/**
 * Retrieves all messages for a chat
 */
export async function getChatMessages(chatId: string) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("chat_messages")
		// .select('id, chat_id, role, parts_json, metadata, model, token_usage, created_at')
		.select("*")
		.eq("chat_id", chatId)
		.order("created_at", { ascending: true });

	if (error) throw error;

	return (data || []).map((msg) => ({
		id: msg.id,
		tempId: msg.temp_id,
		role: msg.role as "user" | "assistant" | "system",
		parts: (msg.parts_json as TextUIPart[]) || [],
		metadata: msg.metadata || {},
		model: msg.model,
		tokenUsage: msg.token_usage,
		createdAt: msg.created_at,
	}));
}

/**
 * Updates a message (useful for streaming responses)
 */
export async function updateMessage(
	messageId: string,
	updates: Partial<Message>,
) {
	const supabase = createClient();

	const updateData: Record<string, unknown> = {};

	if (updates.parts !== undefined) updateData.parts_json = updates.parts;
	if (updates.metadata !== undefined) updateData.metadata = updates.metadata;
	if (updates.model !== undefined) updateData.model = updates.model;
	if (updates.tokenUsage !== undefined)
		updateData.token_usage = updates.tokenUsage;

	const { data, error } = await supabase
		.from("chat_messages")
		.update(updateData)
		.eq("id", messageId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Deletes all messages for a chat
 */
export async function deleteChatMessages(chatId: string) {
	const supabase = createClient();

	const { error } = await supabase
		.from("chat_messages")
		.delete()
		.eq("chat_id", chatId);

	if (error) throw error;
}
