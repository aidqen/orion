import { useCallback, useEffect, useRef, useState } from "react";
import { grab } from "@/utils/browser/cursor";

interface UseResizePanelOptions {
	initialWidth?: number;
	minWidth?: number;
	maxWidth?: number;
	onWidthChange?: (width: number) => void;
}

interface UseResizePanelReturn {
	width: number;
	handleMouseDown: (e: React.MouseEvent) => void;
	isDragging: boolean;
}

export function useResizePanel({
	initialWidth = 500,
	minWidth = 300,
	maxWidth = 900,
	onWidthChange,
}: UseResizePanelOptions = {}): UseResizePanelReturn {
	const [width, setWidth] = useState(initialWidth);
	const [isDragging, setIsDragging] = useState(false);

	const isDraggingRef = useRef(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(0);
	const rafIdRef = useRef<number | null>(null);
	const pendingWidthRef = useRef<number | null>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDraggingRef.current) return;

			const deltaX = startXRef.current - e.clientX;
			const newWidth = Math.min(
				maxWidth,
				Math.max(minWidth, startWidthRef.current + deltaX),
			);

			pendingWidthRef.current = newWidth;

			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(() => {
					if (pendingWidthRef.current !== null) {
						setWidth(pendingWidthRef.current);
						onWidthChange?.(pendingWidthRef.current);
					}
					rafIdRef.current = null;
				});
			}
		};

		const handleMouseUp = () => {
			if (!isDraggingRef.current) return;

			isDraggingRef.current = false;
			setIsDragging(false);
			grab.end();

			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}

			if (pendingWidthRef.current !== null) {
				setWidth(pendingWidthRef.current);
				onWidthChange?.(pendingWidthRef.current);
				pendingWidthRef.current = null;
			}
		};

		// Attach listeners to document for better drag handling
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);

			// Cleanup rAF on unmount
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [minWidth, maxWidth, onWidthChange]);

	// Mouse down handler to start dragging
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();

			isDraggingRef.current = true;
			startXRef.current = e.clientX;
			startWidthRef.current = width;
			pendingWidthRef.current = null;

			setIsDragging(true);
			grab.start();
		},
		[width],
	);

	return {
		width,
		handleMouseDown,
		isDragging,
	};
}
