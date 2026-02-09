import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/services/server/google/tokens";

export async function getTodoistAccessToken(userId: string): Promise<string> {
	const supabase = await getSupabaseServerClient();

	const { data, error } = await supabase
		.from("user_integrations")
		.select("access_token")
		.eq("user_id", userId)
		.eq("provider", "todoist")
		.single();

	if (error || !data?.access_token) {
		console.error("Failed to fetch Todoist token:", error);
		throw { code: "todoist_not_connected" };
	}

	return data.access_token;
}

export async function saveTodoistToken(
	supabase: SupabaseClient,
	userId: string,
	accessToken: string,
) {
	const { error } = await supabase.from("user_integrations").upsert(
		{
			user_id: userId,
			provider: "todoist",
			access_token: accessToken,
			updated_at: new Date().toISOString(),
		},
		{ onConflict: "user_id,provider" },
	);

	if (error) {
		console.error("Failed to save Todoist token:", error);
		throw { code: "token_save_failed" };
	}
}
