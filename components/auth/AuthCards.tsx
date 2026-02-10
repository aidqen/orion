"use client";

import { Link } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AuthForm, { type Mode } from "@/components/Auth/AuthForm";
import ModeSwitch from "@/components/Auth/ModeSwitch";
import { linkGoogleIdentity } from "@/data/auth";
import GoogleButton from "@/components/Auth/GoogleButton";

function getInitialMode(): Mode {
	if (typeof window === "undefined") return "login";

	const params = new URLSearchParams(window.location.search);
	return params.get("mode") === "signup" ? "signup" : "login";
}

export function AuthCard({ setOpen }: { setOpen: (open: boolean) => void }) {
	const [mode, setMode] = useState<Mode>(getInitialMode);

	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set("mode", mode);
		window.history.replaceState(null, "", url.toString());
	}, [mode]);

	const toggleMode = useCallback(() => {
		setMode((prev) => (prev === "login" ? "signup" : "login"));
	}, []);

	return (
		<div className="w-[360px] rounded-2xl border border-gray-200 dark:border-[#1E222B] bg-white dark:bg-[#14161A] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
			<div className="mx-auto mb-6 h-12 w-12 rounded-xl border border-gray-200 dark:border-[#1E222B] bg-gray-50 dark:bg-[#0E1013]" />
			<h1 className="text-center text-[22px] font-semibold text-gray-900 dark:text-gray-100">
				{mode === "login" ? "Welcome Back" : "Create Account"}
			</h1>
			<ModeSwitch mode={mode} onToggle={toggleMode} />
			<AuthForm mode={mode} setOpen={setOpen} />
		</div>
	);
}

export function ConnectGoogleCard() {
	return (
		<div className="flex flex-col items-center w-[360px] rounded-2xl border border-gray-200 dark:border-[#1E222B] bg-white dark:bg-[#14161A] p-12 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
			<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-[#1F232C] border border-gray-100 dark:border-[#2A2F3A]">
				<Link />
			</div>
			<h1 className="mb-2 text-center text-[22px] font-semibold text-gray-900 dark:text-gray-100">
				Connect Google
			</h1>
			<p className="mb-8 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
				Link your Google account to continue.
			</p>
			<div className="w-full">
				<GoogleButton text="Login With Google" onClick={linkGoogleIdentity} />
			</div>
		</div>
	);
}
