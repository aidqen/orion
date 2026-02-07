// app/api/auth/callback/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/infra/supabase/server";

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
			const { error: tokenError } = await supabase
				.from("user_integrations")
				.upsert({
					user_id: session.user.id,
					access_token: session.provider_token,
					refresh_token: session.provider_refresh_token,
					provider: session.user.identities?.[0]?.provider,
					updated_at: new Date().toISOString(),
				});

			if (tokenError) {
				console.error("Auth callback token save error:", tokenError);
				return redirectWithError("token_save_failed");
			}
		}

		return NextResponse.redirect(new URL(returnUrl, requestUrl.origin));
	} catch (error) {
		console.error("Auth callback unexpected error:", error);
		return redirectWithError("unexpected_error");
	}
}
