import { useState } from "react";

export function useChatTitle(initialTitle: string) {
	const [title, setTitle] = useState(initialTitle);
	const [isAnimating, setIsAnimating] = useState(false);

	const updateTitle = (newTitle: string) => {
		if (newTitle !== title && newTitle !== "New Chat") {
			setIsAnimating(true);
			setTitle(newTitle);
		}
	};

	const handleAnimationComplete = () => {
		setIsAnimating(false);
	};

	return {
		title,
		isAnimating,
		updateTitle,
		handleAnimationComplete,
	};
}
