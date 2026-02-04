import { anthropic } from "@ai-sdk/anthropic";
import { generateText, type UIMessagePart } from "ai";
import { AI_TOOLS, SIMPLE_FAST_MODEL } from "@/constants/chat.constant";
import { GENERATE_TITLE_PROMPT } from "@/constants/prompt.constant";
import { getSupabaseServerClient } from "@/lib/google-token";
import type { ChatTools, CustomUIDataTypes } from "@/types/chat";
import type { EventWithStatus } from "@/types/event";

/**
 * Updates the events statuses for a specific message
 * Finds the part with type CREATE_NEW_EVENTS and updates its output.events with new statuses
 */
export async function updateEventsStatuses(
	messageId: string,
	updatedEvents: EventWithStatus[],
): Promise<void> {
	const supabase = await getSupabaseServerClient();

	// Fetch the message by temp_id
	const { data: message, error: fetchError } = await supabase
		.from("chat_messages")
		.select("parts_json, id")
		.eq("temp_id", messageId)
		.single();

	if (fetchError || !message) {
		console.error("Failed to fetch message:", fetchError);
		throw new Error("Message not found");
	}

	// Find and update the CREATE_NEW_EVENTS part
	const parts = message.parts_json as UIMessagePart<
		CustomUIDataTypes,
		ChatTools
	>[];
	const updatedParts = parts.map((part) => {
		if (part.type === AI_TOOLS.CREATE_NEW_EVENTS && part.output) {
			return {
				...part,
				output: {
					...part.output,
					events: updatedEvents,
				},
			};
		}
		return part;
	});

	// Update the message with the modified parts using the actual database id
	const { error: updateError } = await supabase
		.from("chat_messages")
		.update({ parts_json: updatedParts })
		.eq("id", message.id);

	if (updateError) {
		console.error("Failed to update message:", updateError);
		throw new Error("Failed to update event statuses");
	}
}

/**
 * Generates a concise title for a chat conversation using AI
 * @param firstMessage - The first user message in the chat
 * @returns A 3-6 word title for the chat
 */
export async function generateChatTitle(firstMessage: string): Promise<string> {
	const result = await generateText({
		model: anthropic(SIMPLE_FAST_MODEL),
		temperature: 0.5,
		system: GENERATE_TITLE_PROMPT.system,
		prompt: GENERATE_TITLE_PROMPT.prompt(firstMessage),
	});

	return result.text.trim();
}

/**
 * Updates the title of a chat in the database
 */
export async function updateChatTitle(
	chatId: string,
	title: string,
): Promise<void> {
	const supabase = await getSupabaseServerClient();

	const { error } = await supabase
		.from("chats")
		.update({ title })
		.eq("id", chatId);

	if (error) throw error;
}
