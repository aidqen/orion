import {
	fetchUserTokens,
	updateAccessToken,
} from "@/services/server/integrations";

export async function getGoogleAccessToken(userId: string): Promise<string> {
	const tokens = await fetchUserTokens(userId, "google");

	const newAccessToken = await refreshAccessToken(tokens.refresh_token);
	await updateAccessToken(userId, "google", newAccessToken);

	return newAccessToken;
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
		console.error("Failed to refresh Google access token:", tokenData.error);
		throw { code: "google_access_revoked" };
	}

	return tokenData.access_token;
}
