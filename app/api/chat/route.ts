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
import { getSupabaseServerClient } from "@/infra/supabase/server";
import {
  formatMemoryContext,
  processMemoryExtraction,
} from "@/services/server/memory/extraction";
import { createCalendarTools } from "@/tools/calendar.tools";
import { createDocumentTool } from "@/tools/document.tools";
import { createTodoTools } from "@/tools/todos.tools";
import { getLastUserMessageText } from "@/utils/messages";
import { tavilySearch } from "@tavily/ai-sdk";

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

    processMemoryExtraction(
      supabase,
      user.id,
      lastUserMessageText,
      memories.slice(0, 3),
    );

    

    const modelMessages = await convertToModelMessages(messages);

    const uiStream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer: dataStream }) => {
        
        const tools = {
          ...createCalendarTools(user.id),
          ...createTodoTools(user.id),
          webSearch: tavilySearch(),
          createDocument: createDocumentTool({ dataStream }),
        };

        const result = streamText({
          model: anthropic(AI_MODEL),
          system: SYSTEM_PROMPT + formatMemoryContext(memories),
          messages: modelMessages,
          tools,
          temperature: 0.7,
          stopWhen: stepCountIs(5),
        });

        dataStream.merge(result.toUIMessageStream({ sendReasoning: true }));
      },
    });

    return createUIMessageStreamResponse({ stream: uiStream });
  } catch (error) {
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
