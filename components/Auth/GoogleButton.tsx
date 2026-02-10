"use client";

import { useState } from "react";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { normalizeAuthError, signInWithGoogle } from "@/data/auth";
import { GoogleIcon } from "../Icons/GoogleIcon";

interface GoogleButtonProps {
	text?: string;
	onClick?: () => void;
}

export default function GoogleButton({
	text = "Continue with Google",
	onClick,
}: GoogleButtonProps) {
	const [err, setErr] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const onGoogle = async () => {
		if (onClick) {
			onClick();
			return;
		}
		setErr(null);
		setLoading(true);
		try {
			await signInWithGoogle();
			// redirects away
		} catch (e) {
			setErr(normalizeAuthError(e));
			setLoading(false);
		}
	};

	return (
		<>
			{err && <ErrorBanner message={err} className="mt-3" />}
			<button
				type="button"
				onClick={onGoogle}
				disabled={loading}
				className="cursor-pointer flex flex-row items-center gap-2 justify-center h-11 w-full rounded-lg border border-gray-200 dark:border-[#2A2F3A] bg-gray-50 dark:bg-[#1B1F27] text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#20242E] disabled:opacity-70"
			>
				<GoogleIcon />
				{text}
			</button>
		</>
	);
}
