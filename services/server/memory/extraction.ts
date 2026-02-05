// SERVER-ONLY: AI-powered memory extraction logic

import { anthropic } from "@ai-sdk/anthropic";
import type { SupabaseClient } from "@supabase/supabase-js";
import { generateText, Output } from "ai";
import { z } from "zod";
import { SIMPLE_FAST_MODEL } from "@/constants/chat.constant";
import {
	createMemoryExtractionPrompt,
	createShouldExtractMemoryPrompt,
} from "@/constants/prompt.constant";
import { saveMemory } from "./storage";

const memorySchema = z.object({
	memory_text: z.string().describe("A short, clear statement about the user"),
	category: z
		.enum(["preference", "fact", "habit", "goal"])
		.describe("The type of memory"),
});

/**
 * Extracts memories from user message using AI and saves them
 */
export async function extractAndSaveMemories(
	supabase: SupabaseClient,
	userId: string,
	userMessage: string,
	recentMemories: { memory_text: string }[],
) {
	const recentMemoriesText =
		recentMemories.length > 0
			? recentMemories.map((m) => `- ${m.memory_text}`).join("\n")
			: "None yet.";

	const { output } = await generateText({
		model: anthropic(SIMPLE_FAST_MODEL),
		output: Output.array({ element: memorySchema }),
		prompt: createMemoryExtractionPrompt(recentMemoriesText, userMessage),
	});

	if (!output || !Array.isArray(output)) {
		console.log("No memories extracted");
		return;
	}

	for (const memory of output) {
		if (memory?.memory_text) {
			await saveMemory(supabase, userId, memory.memory_text, memory.category);
		}
	}
}

const MEMORY_KEYWORDS = [
	"love",
	"hate",
	"like",
	"dislike",
	"prefer",
	"favorite",
	"favourite",
	"my",
	"i",
	"i'm",
	"my",
	"always",
	"never",
	"usually",
	"every ",
	"every ",
	"remember",
	"don't forget",
	"keep in mind",
	"note that",
	"save",
];

/**
 * Quick check if message contains memory-related keywords
 */
export function hasMemoryKeywords(message: string): boolean {
	const lowercaseMessage = message.toLowerCase();
	return MEMORY_KEYWORDS.some((keyword) => lowercaseMessage.includes(keyword));
}

const shouldExtractSchema = z.object({
	shouldExtract: z
		.boolean()
		.describe(
			"Whether the message contains personal information worth remembering",
		),
});

/**
 * Uses AI to determine if memory extraction should happen
 */
async function shouldExtractMemory(
	message: string,
	memories: { memory_text: string }[],
): Promise<boolean> {
	const { output } = await generateText({
		model: anthropic(SIMPLE_FAST_MODEL),
		output: Output.object({ schema: shouldExtractSchema }),
		prompt: createShouldExtractMemoryPrompt(message, memories),
	});

	return output.shouldExtract;
}

/**
 * Main memory extraction workflow
 * Checks keywords -> AI decision -> extract and save
 */
export async function processMemoryExtraction(
	supabase: SupabaseClient,
	userId: string,
	userMessage: string,
	memories: { memory_text: string }[],
) {
	try {
		if (!hasMemoryKeywords(userMessage)) {
			return;
		}

		const shouldExtract = await shouldExtractMemory(userMessage, memories);
		if (!shouldExtract) {
			return;
		}

		await extractAndSaveMemories(supabase, userId, userMessage, memories);
	} catch (error) {
		console.error("Error processing memory extraction:", error);
	}
}

/**
 * Formats memories for inclusion in AI prompts
 */
export function formatMemoryContext(
	memories: { memory_text: string }[],
): string {
	if (memories.length === 0) return "";

	return `\n\n--- User Memories ---\nThe following are things you know about the user. Use them to personalize your responses naturally, without explicitly saying "based on your memories":\n${memories.map((m) => `- ${m.memory_text}`).join("\n")}\n--- End Memories ---\n`;
}
