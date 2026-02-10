"use client";

import { useEffect } from "react";
import { usePromptInputAttachments } from "@/components/ui/prompt-input";

/** Enables paste support for images */
export function PasteHandler() {
	const { add } = usePromptInputAttachments() as {
		add: (files: File[]) => void;
	};

	useEffect(() => {
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			const imageFiles: File[] = [];
			for (const item of items) {
				if (item.type.startsWith("image/")) {
					const file = item.getAsFile();
					if (file) {
						imageFiles.push(file);
					}
				}
			}

			if (imageFiles.length > 0) {
				e.preventDefault();
				add(imageFiles);
			}
		};

		document.addEventListener("paste", handlePaste);
		return () => document.removeEventListener("paste", handlePaste);
	}, [add]);

	return null;
}
