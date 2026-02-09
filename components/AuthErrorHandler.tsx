"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const ERROR_MESSAGES: Record<string, string> = {
	missing_code: "Authentication failed: Missing authorization code.",
	session_exchange_failed:
		"Authentication failed: Could not verify your session.",
	no_session: "Authentication failed: No session was created.",
	token_save_failed: "Authentication failed: Could not save your token.",
	unexpected_error: "An unexpected error occurred during authentication.",
	identity_already_exists:
		"This Google account is already linked to another user.",
	todoist_not_connected:
		"Todoist is not connected. Please connect your Todoist account in Integrations.",
};

export function AuthErrorHandler() {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const errorCode = searchParams.get("error_code");

		if (errorCode) {
			const message =
				ERROR_MESSAGES[errorCode] || "Authentication failed. Please try again.";
			toast.error(message);

			const url = new URL(window.location.href);
			url.searchParams.delete("error_code");
			router.replace(url.pathname + url.search);
		}
	}, [searchParams, router]);

	return null;
}
