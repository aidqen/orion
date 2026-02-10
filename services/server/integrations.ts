
import { getSupabaseServerClient } from "@/infra/supabase/server";

export type IntegrationProvider = "google" | "todoist";



export async function fetchUserTokens(
	userId: string,
	provider: IntegrationProvider,
) {
	const supabase = await getSupabaseServerClient();

	const { data, error } = await supabase
		.from("user_integrations")
		.select("access_token, refresh_token")
		.eq("user_id", userId)
		.eq("provider", provider)
		.single();

	if (error || !data) {
		console.error(`Failed to fetch ${provider} tokens:`, error);
		throw { code: `${provider}_not_connected` };
	}

	return data;
}

export async function saveUserIntegration(
	userId: string,
	provider: IntegrationProvider,
	accessToken: string,
	refreshToken?: string | null,
) {
	const supabase = await getSupabaseServerClient();

	const { error } = await supabase.from("user_integrations").upsert(
		{
			user_id: userId,
			provider,
			access_token: accessToken,
			...(refreshToken !== undefined && { refresh_token: refreshToken }),
			updated_at: new Date().toISOString(),
		},
		{ onConflict: "user_id,provider" },
	);

	if (error) {
		console.error(`Failed to save ${provider} integration:`, error);
		throw { code: "token_save_failed" };
	}
}

export async function updateAccessToken(
	userId: string,
	provider: IntegrationProvider,
	accessToken: string,
) {
	const supabase = await getSupabaseServerClient();

	await supabase
		.from("user_integrations")
		.update({
			access_token: accessToken,
			updated_at: new Date().toISOString(),
		})
		.eq("user_id", userId)
		.eq("provider", provider);
}
