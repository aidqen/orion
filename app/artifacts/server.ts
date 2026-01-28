import { smoothStream, streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { CustomUIDataTypes } from "@/types/chat";
import { AI_MODEL } from "@/constants/chat.constant";
import { createDocumentPrompt } from "@/constants/prompt.constant";

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

type OnCreateDocumentProps = {
    id: string;
    title: string;
    description: string;
    dataStream: any;
};

export async function onCreateDocument({
    id,
    title,
    description,
    dataStream,
}: OnCreateDocumentProps) {
    console.log("🚀 onCreateDocument called with:", { id, title, description });
    let draftContent = "";

    const { fullStream } = streamText({
        model: anthropic(AI_MODEL),
        system: createDocumentPrompt.system,
        prompt: createDocumentPrompt.prompt(title, description),
        experimental_transform: smoothStream({ chunking: "word" }),
        onError: (error) => {
            console.error("❌ Error streaming document content:", error);
        }
    });

    console.log("📝 Starting to stream document content...");

    for await (const delta of fullStream) {
        const { type } = delta;

        if (type === "text-delta") {
            const { text } = delta;

            draftContent += text;
            console.log("✍️ Text delta:", text);

            dataStream.write({
                type: "data-textDelta",
                data: text,
                transient: true
            });
        }
    }

    console.log("✅ Document streaming complete. Total length:", draftContent.length);
    return draftContent;
}
