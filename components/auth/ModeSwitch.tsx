"use client";

import type { Mode } from "./AuthForm";

export default function ModeSwitch({
	mode,
	onToggle,
}: {
	mode: Mode;
	onToggle: () => void;
}) {
	return (
		<p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
			{mode === "login"
				? "Don't have an account yet?"
				: "Already have an account?"}{" "}
			<button
				type="button"
				onClick={onToggle}
				className="font-semibold text-[#1E6BFF] hover:text-[#2D7DFF] cursor-pointer"
			>
				{mode === "login" ? "Sign up" : "Log in"}
			</button>
		</p>
	);
}
