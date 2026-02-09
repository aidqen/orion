import { createAnthropic } from "@ai-sdk/anthropic";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	stepCountIs,
	streamText,
} from "ai";
import { AI_MODEL } from "@/constants/chat.constant";
import { SYSTEM_PROMPT } from "@/constants/prompt.constant";
import { fetchAllMemories } from "@/data/memories";
import { getSupabaseServerClient } from "@/services/server/google/tokens";
import {
	formatMemoryContext,
	processMemoryExtraction,
} from "@/services/server/memory/extraction";
import { createCalendarTools } from "@/tools/calendar.tools";
import { createDocumentTool } from "@/tools/document.tools";
import { createTodoTools } from "@/tools/todos.tools";
import { getLastUserMessageText } from "@/utils/messages";

export const maxDuration = 30;

const anthropic = createAnthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const { messages, id } = await req.json();

		if (!messages || !Array.isArray(messages)) {
			return new Response("Messages array is required", { status: 400 });
		}
		if (!id) {
			return new Response("Chat ID is required", { status: 400 });
		}

		const memories = await fetchAllMemories(supabase, user.id);

		const lastUserMessageText = getLastUserMessageText(messages);

		// Fire and forget: extract memories in background (don't await)
		processMemoryExtraction(
			supabase,
			user.id,
			lastUserMessageText,
			memories.slice(0, 3),
		);

		const modelMessages = await convertToModelMessages(messages);
		const webSearchTool = anthropic.tools.webSearch_20250305({ maxUses: 3 });

		const uiStream = createUIMessageStream({
			originalMessages: messages,
			execute: async ({ writer: dataStream }) => {
				const result = streamText({
					model: anthropic(AI_MODEL),
					system: SYSTEM_PROMPT + formatMemoryContext(memories),
					messages: modelMessages,
					tools: {
						...createCalendarTools(user.id),
						...createTodoTools(user.id),
						webSearchTool,
						createDocument: createDocumentTool({ dataStream }),
					},
					temperature: 0.7,
					stopWhen: stepCountIs(5),
				});

				dataStream.merge(result.toUIMessageStream({ sendReasoning: true }));
			},
		});

		return createUIMessageStreamResponse({ stream: uiStream });
	} catch (error) {
		console.error("Error details:", error);
		return new Response(
			JSON.stringify({
				error: "Internal server error",
				message: String(error),
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
