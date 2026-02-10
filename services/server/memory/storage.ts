// SERVER-ONLY: Memory operations requiring server-side APIs

import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { EMBEDDING_MODEL } from "@/constants/chat.constant";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Saves a memory to the database with embeddings
 * SERVER-ONLY: Uses OpenAI API with server-side API key
 */
export async function saveMemory(
	supabase: SupabaseClient,
	userId: string,
	memoryText: string,
	category?: string,
) {
	if (!memoryText) {
		return null;
	}
	const response = await openai.embeddings.create({
		model: EMBEDDING_MODEL,
		input: memoryText,
	});

	const embedding = response.data[0].embedding;

	// Save to database
	const { data, error } = await supabase
		.from("memories")
		.insert({
			user_id: userId,
			memory_text: memoryText,
			embedding: embedding,
			category: category || null,
		})
		.select()
		.single();

	if (error) {
		return null;
	}

	return data;
}
