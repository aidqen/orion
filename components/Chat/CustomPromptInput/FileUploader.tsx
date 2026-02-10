"use client";

import { useEffect } from "react";
import { usePromptInputAttachments } from "@/components/ui/prompt-input";
import { uploadChatImage } from "@/data/storage";
import type { AttachmentFile } from "./types";

export interface FileUploaderProps {
	chatId?: string;
	userId?: string;
	uploadedUrlsRef: React.MutableRefObject<Map<string, string>>;
	uploadingIdsRef: React.MutableRefObject<Set<string>>;
	failedIds: Set<string>;
	onMarkFailed: (id: string) => void;
}

/** Watches for new files and uploads them immediately */
export function FileUploader({
	chatId,
	userId,
	uploadedUrlsRef,
	uploadingIdsRef,
	failedIds,
	onMarkFailed,
}: FileUploaderProps) {
	const { files } = usePromptInputAttachments() as { files: AttachmentFile[] };

	useEffect(() => {
		if (!chatId || !userId) return;

		for (const file of files) {
			const alreadyUploaded = uploadedUrlsRef.current.has(file.id);
			const currentlyUploading = uploadingIdsRef.current.has(file.id);
			const alreadyFailed = failedIds.has(file.id);

			if (
				!alreadyUploaded &&
				!currentlyUploading &&
				!alreadyFailed &&
				file.file
			) {
				uploadingIdsRef.current.add(file.id);

				uploadChatImage(file.file, chatId, userId)
					.then((url) => {
						uploadedUrlsRef.current.set(file.id, url);
					})
					.catch(() => {
						onMarkFailed(file.id);
					})
					.finally(() => {
						uploadingIdsRef.current.delete(file.id);
					});
			}
		}
	}, [
		files,
		chatId,
		userId,
		uploadedUrlsRef,
		uploadingIdsRef,
		failedIds,
		onMarkFailed,
	]);

	return null;
}
