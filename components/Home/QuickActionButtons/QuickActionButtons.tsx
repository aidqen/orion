"use client";

import { motion } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { quickActions } from "./constants";

const buttonAnimationVariants = {
	initial: { y: "50%", opacity: 0 },
	animate: { y: 0, opacity: 1 },
};

const buttonAnimationConfig = {
	type: "spring" as const,
	bounce: 0,
	damping: 35,
	mass: 1,
	stiffness: 300,
	duration: 0.1,
	baseDelay: 0.4,
	staggerDelay: 0.1,
};

export function QuickActionButtons({
	setInput,
}: {
	setInput?: (value: string) => void;
}) {
	const isMobile = useMediaQuery("(max-width: 460px)");

	// Show only 3 items on mobile, all items otherwise
	const displayedActions = isMobile ? quickActions.slice(0, 3) : quickActions;

	const handleActionClick = (prompt: string) => {
		if (setInput) {
			setInput(prompt);
		}
	};

	return (
		<div className="flex flex-row items-center justify-between w-full gap-2 mt-0">
			{displayedActions.map((action, index: number) => (
				<motion.button
					key={action.id}
					initial={buttonAnimationVariants.initial}
					animate={buttonAnimationVariants.animate}
					transition={{
						...buttonAnimationConfig,
						delay:
							buttonAnimationConfig.baseDelay +
							buttonAnimationConfig.staggerDelay * index,
					}}
					onClick={() => handleActionClick(action.prompt)}
					className="rounded-full flex flex-row gap-1 font-medium text-muted-foreground dark:text-stone-300 items-center justify-center bg-secondary hover:bg-muted px-3 py-1.5 text-xs text-start whitespace-nowrap transition-colors cursor-pointer"
				>
					<action.icon className="w-4 h-4" />
					{action.label}
				</motion.button>
			))}
		</div>
	);
}
