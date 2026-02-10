"use client";

import { Check, Loader2, Plus, RefreshCw } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type ButtonState = "idle" | "pending" | "success" | "error";

export interface AddItemsButtonProps {
	state: ButtonState;
	onClick: () => void;
	labels: {
		idle: string;
		pending: string;
		success: string;
		error: string;
	};
	renderOverride?: ReactNode;
	className?: string;
}

export const SubmitItemsButton: React.FC<AddItemsButtonProps> = ({
	state,
	onClick,
	labels,
	renderOverride,
	className,
}) => {
	if (renderOverride) {
		return (
			<div className="flex flex-col items-start gap-2 py-2">
				{renderOverride}
			</div>
		);
	}

	const isDisabled = state === "pending" || state === "success";
	const isError = state === "error";

	const icon = {
		idle: <Plus className="h-4 w-4" />,
		pending: <Loader2 className="h-4 w-4 animate-spin" />,
		success: <Check className="h-4 w-4" />,
		error: <RefreshCw className="h-4 w-4" />,
	}[state];

	const buttonStyles = {
		idle: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
		pending: "bg-green-600 dark:bg-green-700",
		success: "bg-green-800 dark:bg-green-800",
		error: "",
	}[state];

	return (
		<div className="flex flex-col items-start gap-2 py-2">
			<Button
				onClick={onClick}
				disabled={isDisabled}
				size="lg"
				variant={isError ? "destructive" : "default"}
				className={`w-fit gap-2 font-medium text-white disabled:opacity-80 
					${buttonStyles} 
					${className ?? ""}`}
			>
				{icon}
				{labels[state]}
			</Button>
		</div>
	);
};
