"use client";

import { AuthCard } from "@/components/Auth/AuthCards";
import { useRouter } from "next/navigation";

export default function AuthPage() {
	const router = useRouter();

	const handleAuthSuccess = (open: boolean) => {
		if (!open) {
			router.push("/");
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0E1013] p-4">
			<AuthCard setOpen={handleAuthSuccess} />
		</div>
	);
}
