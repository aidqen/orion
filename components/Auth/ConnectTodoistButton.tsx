"use client";

import { useState } from "react";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { connectTodoist } from "@/services/client/todoist";
import { TodoistIcon } from "../Icons/TodoistIcon";
import { Button } from "../ui/button";
import { cn } from "@/utils/shared";
import { useUser } from "@/contexts/UserContext";

interface ConnectTodoistButtonProps {
	className?: string;
	onClick?: () => void;
}

export function ConnectTodoistButton({
	className,
	onClick,
}: ConnectTodoistButtonProps) {
	const { isTodoistConnected } = useUser();
	const [err, setErr] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleConnect = async () => {
		if (onClick) {
			onClick();
			return;
		}

		setErr(null);
		setLoading(true);
		try {
			connectTodoist();
			// redirects away
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed to connect Todoist");
			setLoading(false);
		}
	};

	return (
		<>
			{err && <ErrorBanner message={err} className="mt-3" />}
			<Button
				onClick={handleConnect}
				disabled={loading || isTodoistConnected}
				className={cn("bg-[#E44332] hover:bg-[#c93a2b] text-white", className)}
			>
				<TodoistIcon />
				{isTodoistConnected ? "Connected" : loading ? "Connecting..." : "Connect Todoist"}
			</Button>
		</>
	);
}
