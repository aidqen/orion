// UNIVERSAL: Memory CRUD operations (work with any SupabaseClient)

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetches all memories for the current user
 */
export async function fetchAllMemories(
	supabase: SupabaseClient,
	userId: string,
) {
	const { data, error } = await supabase
		.from("memories")
		.select("id, memory_text, category, created_at")
		.eq("user_id", userId)
		.order("created_at", { ascending: true }); // oldest first so newer memories have more weight at the end

	if (error) {
		console.error("Error fetching memories:", error);
		return [];
	}

	return data || [];
}

/**
 * Deletes a single memory by id
 */
export async function deleteMemory(supabase: SupabaseClient, memoryId: number) {
	const { error } = await supabase.from("memories").delete().eq("id", memoryId);

	if (error) {
		console.error("Error deleting memory:", error);
		return false;
	}

	return true;
}
