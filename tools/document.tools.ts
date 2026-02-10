import { tool, type UIMessageStreamWriter } from "ai";
import { z } from "zod";
import { onCreateDocument } from "@/services/server/artifacts/document";
import type { ChatMessage } from "@/types/chat";
import { generateUUID } from "@/utils/shared";

type CreateDocumentToolProps = {
	dataStream: UIMessageStreamWriter<ChatMessage>;
};

export function createDocumentTool({ dataStream }: CreateDocumentToolProps) {
	return tool({
		description:
			"Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.",
		inputSchema: z.object({
			title: z.string(),
			description: z.string(),
		}),
		execute: async ({
			title,
			description,
		}: {
			title: string;
			description: string;
		}) => {
			const id = generateUUID();

			dataStream.write({
				type: "data-id",
				data: id,
			});

			dataStream.write({
				type: "data-title",
				data: title,
			});

			const content = await onCreateDocument({
				id,
				title,
				description,
				dataStream,
			});

			return {
				id,
				title,
				description,
				content,
			};
		},
	});
}
