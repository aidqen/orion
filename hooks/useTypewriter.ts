import { useEffect, useRef, useState } from "react";

interface UseTypewriterProps {
	text: string;
	speed?: number;
	enabled?: boolean;
}

export function useTypewriter({
	text,
	speed = 5,
	enabled = true,
}: UseTypewriterProps) {
	const [displayedContent, setDisplayedContent] = useState("");
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const indexRef = useRef(0);

	// Derived - always in sync
	const isFinished = displayedContent === text;

	useEffect(() => {
		const clearInterval_ = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};

		// If disabled, show content immediately
		if (!enabled) {
			clearInterval_();
			setDisplayedContent(text); // eslint-disable-line react-hooks/set-state-in-effect
			indexRef.current = text.length;
			return;
		}

		// Handle text shrinking (edge case)
		if (indexRef.current > text.length) {
			indexRef.current = text.length;
			setDisplayedContent(text);
		}

		// Already caught up
		if (indexRef.current >= text.length) {
			clearInterval_();
			return;
		}

		// Interval already running, let it continue
		if (intervalRef.current) {
			return;
		}

		// Start typewriter
		intervalRef.current = setInterval(() => {
			if (indexRef.current < text.length) {
				indexRef.current++;
				setDisplayedContent(text.slice(0, indexRef.current));
			} else {
				clearInterval_();
			}
		}, speed);

		return clearInterval_;
	}, [text, enabled, speed]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return { displayedContent, isFinished };
}
