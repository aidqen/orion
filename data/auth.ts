// UNIVERSAL: Most functions work everywhere
// BROWSER-ONLY: redirectToSaveToken() uses window.location

import { createClient } from "@/infra/supabase/client";
import { createWelcomeChat } from "@/data/chats";

// Google Calendar scopes for OAuth
const GOOGLE_SCOPES = [
	"openid",
	"email",
	"profile",
	"https://www.googleapis.com/auth/calendar.calendarlist.readonly",
	"https://www.googleapis.com/auth/calendar.events",
	"https://www.googleapis.com/auth/documents",
].join(" ");

// UNIVERSAL
export async function signInWithPassword(email: string, password: string) {
	const supabase = createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	return data;
}

// UNIVERSAL
export async function signUpWithPassword(
	email: string,
	password: string,
	name?: string,
): Promise<{ userId: string; welcomeChatId: string }> {
	// Supabase prevents duplicate users. It returns error: "User already registered"
	const supabase = createClient();

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				name: name,
			},
		},
	});
	if (error) throw error;

	const userId = data.user?.id;
	if (!userId) throw new Error("User ID not found after signup");

	const welcomeChatId = await createWelcomeChat(userId);

	return { userId, welcomeChatId };
}

// BROWSER-ONLY: uses window.location
function redirectToSaveToken(returnUrl?: string) {
	return `${window.location.origin}/auth/callback${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`;
}

// UNIVERSAL (but calls browser-only redirectToSaveToken internally)
export async function signInWithGoogle() {
	const supabase = createClient();
	const redirectTo = redirectToSaveToken();

	const { error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo,
			scopes: GOOGLE_SCOPES,
			queryParams: {
				access_type: "offline",
				prompt: "consent",
				include_granted_scopes: "true",
			},
		},
	});
	if (error) throw error;
}

// UNIVERSAL (but calls browser-only window.location internally)
export async function linkGoogleIdentity() {
	const supabase = createClient();
	const currentPath = window.location.pathname;
	const redirectTo = redirectToSaveToken(currentPath);

	const { data, error } = await supabase.auth.linkIdentity({
		provider: "google",
		options: {
			redirectTo,
			scopes: GOOGLE_SCOPES,
			queryParams: {
				access_type: "offline",
				prompt: "consent",
				include_granted_scopes: "true",
			},
		},
	});
	console.log("🚀 ~ linkGoogleIdentity ~ data:", data);

	if (error) throw error;
	return data;
}

// UNIVERSAL
export async function signOut() {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}

// UNIVERSAL
export function normalizeAuthError(err: unknown): string {
	const msg = (err as Error)?.message?.toString?.() ?? "Authentication error";
	if (msg.toLowerCase().includes("already registered")) {
		return "Email already registered. Try logging in or reset your password.";
	}
	return msg;
}
