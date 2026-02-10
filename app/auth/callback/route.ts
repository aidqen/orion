// app/api/auth/callback/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createWelcomeChat, userHasChats } from "@/data/chats";
import { createClient } from "@/infra/supabase/server";
import {
	type IntegrationProvider,
	saveUserIntegration,
} from "@/services/server/integrations";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const cookieStore = cookies();

	let returnUrl = requestUrl.searchParams.get("returnUrl") || "/";

	if (!returnUrl.startsWith("/") || returnUrl.includes("://")) {
		returnUrl = "/";
	}

	const redirectWithError = (errorCode: string) => {
		const url = new URL(returnUrl, requestUrl.origin);
		url.searchParams.set("error_code", errorCode);
		return NextResponse.redirect(url);
	};

	const supabaseError = requestUrl.searchParams.get("error_code");
	if (supabaseError) {
		return redirectWithError(supabaseError);
	}

	if (!code) {
		return redirectWithError("missing_code");
	}

	try {
		const supabase = createClient(cookieStore);
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.exchangeCodeForSession(code);

		if (sessionError) {
			console.error("Auth callback session error:", sessionError);
			return redirectWithError("session_exchange_failed");
		}

		if (!session) {
			return redirectWithError("no_session");
		}

		if (session.provider_token) {
			const provider = session.user.identities?.[0]
				?.provider as IntegrationProvider;

			try {
				await saveUserIntegration(
					session.user.id,
					provider,
					session.provider_token,
					session.provider_refresh_token,
				);
			} catch {
				return redirectWithError("token_save_failed");
			}
		}

		try {
			const hasChats = await userHasChats(session.user.id, supabase);

			if (!hasChats) {
				await createWelcomeChat(session.user.id, supabase);
			}
		} catch (welcomeError) {
			console.error("Failed to create welcome chat:", welcomeError);
		}

		return NextResponse.redirect(new URL(returnUrl, requestUrl.origin));
	} catch (error) {
		console.error("Auth callback unexpected error:", error);
		return redirectWithError("unexpected_error");
	}
}
