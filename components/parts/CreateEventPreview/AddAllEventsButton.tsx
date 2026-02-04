"use client";

import { Loader2, Plus } from "lucide-react";
import type React from "react";
import GoogleButton from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

interface AddAllEventsButtonProps {
	onClick: () => void;
	isPending: boolean;
	pendingCount: number;
}

export const AddAllEventsButton: React.FC<AddAllEventsButtonProps> = ({
	onClick,
	isPending,
	pendingCount,
}) => {
	const { isGoogleConnected } = useUser();

	if (!isGoogleConnected) {
		return (
			<div className="flex flex-col items-start gap-2 py-2">
				<GoogleButton text="Connect Google Calendar" />
			</div>
		);
	}

	const label =
		pendingCount === 1 ? "Add to Calendar" : `Add Events to Calendar`;

	return (
		<div className="flex flex-col items-start gap-2 py-2">
			<Button
				onClick={onClick}
				disabled={isPending}
				size="lg"
				className="w-fit gap-2 font-medium bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 disabled:opacity-80"
			>
				{isPending ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Adding...
					</>
				) : (
					<>
						<Plus className="h-4 w-4" />
						{label}
					</>
				)}
			</Button>
		</div>
	);
};
