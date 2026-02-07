// SERVER-ONLY: Uses Anthropic API with server-side API key

import { createAnthropic } from "@ai-sdk/anthropic";
import { smoothStream, streamText, type UIMessageStreamWriter } from "ai";
import { AI_MODEL } from "@/constants/chat.constant";
import { createDocumentPrompt } from "@/constants/prompt.constant";
import type { ChatMessage } from "@/types/chat";

const anthropic = createAnthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

type OnCreateDocumentProps = {
	id: string;
	title: string;
	description: string;
	dataStream: UIMessageStreamWriter<ChatMessage>;
};

export async function onCreateDocument({
	id,
	title,
	description,
	dataStream,
}: OnCreateDocumentProps) {
	let draftContent = "";

	const { fullStream } = streamText({
		model: anthropic(AI_MODEL),
		system: createDocumentPrompt.system,
		prompt: createDocumentPrompt.prompt(title, description),
		experimental_transform: smoothStream({ chunking: "word" }),
		onError: (error) => {
			console.error("❌ Error streaming document content:", error);
		},
	});

	for await (const delta of fullStream) {
		const { type } = delta;

		if (type === "text-delta") {
			const { text } = delta;

			draftContent += text;

			dataStream.write({
				type: "data-textDelta",
				data: text,
				transient: true,
			});
		}
	}
	dataStream.write({
		type: "data-finish",
		data: { id },
		transient: true,
	});
	return draftContent;
}
