// SERVER-ONLY: Uses server Supabase client and AI

import { anthropic } from "@ai-sdk/anthropic";
import { generateText, type UIMessagePart } from "ai";
import { AI_TOOLS, SIMPLE_FAST_MODEL } from "@/constants/chat.constant";
import { GENERATE_TITLE_PROMPT } from "@/constants/prompt.constant";
import { getSupabaseServerClient } from "@/services/server/google/tokens";
import type { ChatTools, CustomUIDataTypes } from "@/types/chat";
import type { EventWithStatus } from "@/types/event";
import type { TodoWithStatus } from "@/types/todo";

type ItemType = "events" | "todos";

const ITEM_CONFIG = {
	events: {
		toolType: AI_TOOLS.CREATE_NEW_EVENTS,
		outputField: "events",
	},
	todos: {
		toolType: AI_TOOLS.SUGGEST_NEW_TODOS,
		outputField: "todos",
	},
} as const;

export async function updateToolOutput(
	messageId: string,
	itemType: ItemType,
	updatedItems: EventWithStatus[] | TodoWithStatus[],
): Promise<void> {
	const supabase = await getSupabaseServerClient();
	const config = ITEM_CONFIG[itemType];

	const { data: message, error: fetchError } = await supabase
		.from("chat_messages")
		.select("parts_json, id")
		.eq("temp_id", messageId)
		.single();

	if (fetchError || !message) {
		console.error("Failed to fetch message:", fetchError);
		throw new Error("Message not found");
	}

	const parts = message.parts_json as UIMessagePart<
		CustomUIDataTypes,
		ChatTools
	>[];
	const updatedParts = parts.map((part) => {
		if (part.type === config.toolType && part.output) {
			return {
				...part,
				output: {
					...part.output,
					[config.outputField]: updatedItems,
				},
			};
		}
		return part;
	});

	const { error: updateError } = await supabase
		.from("chat_messages")
		.update({ parts_json: updatedParts })
		.eq("id", message.id);

	if (updateError) {
		console.error("Failed to update message:", updateError);
		throw new Error(`Failed to update ${itemType} statuses`);
	}
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
	const result = await generateText({
		model: anthropic(SIMPLE_FAST_MODEL),
		temperature: 0.5,
		system: GENERATE_TITLE_PROMPT.system,
		prompt: GENERATE_TITLE_PROMPT.prompt(firstMessage),
	});

	return result.text.trim();
}

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
