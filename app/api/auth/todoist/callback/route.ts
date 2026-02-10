import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { saveUserIntegration } from "@/services/server/integrations";
import { createClient } from "@/infra/supabase/server";

const TODOIST_TOKEN_URL = "https://todoist.com/oauth/access_token";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const appUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;

	const redirectWithError = (errorCode: string) => {
		const redirectUrl = new URL("/", appUrl);
		redirectUrl.searchParams.set("error_code", errorCode);
		return NextResponse.redirect(redirectUrl);
	};

	if (!code) return redirectWithError("missing_code");
	if (!state) return redirectWithError("missing_state");

	const cookieStore = cookies();
	const storedState = (await cookieStore).get("todoist_oauth_state")?.value;

	if (!storedState || storedState !== state) {
		return redirectWithError("invalid_state");
	}

	(await cookieStore).delete("todoist_oauth_state");

	try {
		const tokenResponse = await fetch(TODOIST_TOKEN_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				client_id: process.env.NEXT_PUBLIC_TODOIST_CLIENT_ID,
				client_secret: process.env.TODOIST_CLIENT_SECRET,
				code,
			}),
		});

		if (!tokenResponse.ok) {
			console.error("Todoist token exchange failed:", tokenResponse.status);
			return redirectWithError("token_exchange_failed");
		}

		const { access_token } = await tokenResponse.json();

		if (!access_token) {
			return redirectWithError("no_access_token");
		}

		// Get the authenticated Supabase user
		const supabase = createClient(cookieStore);
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			console.error("Todoist callback: user not authenticated", userError);
			return redirectWithError("not_authenticated");
		}

		try {
			await saveUserIntegration(user.id, "todoist", access_token);
		} catch {
			return redirectWithError("token_save_failed");
		}

		// Redirect back to the app
		return NextResponse.redirect(new URL("/?todoist=connected", appUrl));
	} catch (error) {
		console.error("Todoist callback unexpected error:", error);
		return redirectWithError("unexpected_error");
	}
}
