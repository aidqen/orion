import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function getSupabaseServerClient() {
	const cookieStore = cookies();
	return createClient(cookieStore);
}

export async function getGoogleAccessToken(userId: string): Promise<string> {
	const tokens = await fetchUserTokens(userId);

	const newAccessToken = await refreshAccessToken(tokens.refresh_token);
	await saveAccessToken(userId, newAccessToken);

	return newAccessToken;
}

async function fetchUserTokens(userId: string) {
	const supabase = await getSupabaseServerClient();

	const { data, error } = await supabase
		.from("user_google_tokens")
		.select("access_token, refresh_token")
		.eq("user_id", userId)
		.single();

	if (error || !data) {
		console.error("❌ Failed to fetch user tokens:", error);
		throw { code: "google_not_connected" };
	}

	return data;
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		}),
	});

	const tokenData = await res.json();

	if (tokenData.error) {
		console.error("❌ Failed to refresh Google access token:", tokenData.error);
		throw { code: "google_access_revoked" };
	}

	return tokenData.access_token;
}

async function saveAccessToken(userId: string, accessToken: string) {
	const supabase = await getSupabaseServerClient();

	await supabase
		.from("user_google_tokens")
		.update({
			access_token: accessToken,
			updated_at: new Date().toISOString(),
		})
		.eq("user_id", userId);
}
