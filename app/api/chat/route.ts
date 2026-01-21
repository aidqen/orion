import { streamText, convertToCoreMessages, convertToModelMessages } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { saveLatestMessages } from '@/utils/messages';
import { AI_MODEL } from '@/constants/chat.constant';

export const runtime = 'edge';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, id } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    if (!id) {
      return new Response('Chat ID is required', { status: 400 });
    }

    const modelMessages =  convertToModelMessages(messages);
    console.log("🚀 ~ POST ~ modelMessages:", modelMessages)

    const result = streamText({
      model: anthropic(AI_MODEL),
      messages: modelMessages,
      temperature: 0.7,
    });


    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: allMessages }) => {
        try {
          await saveLatestMessages(id, messages, allMessages, AI_MODEL);
        } catch (error) {
          console.error('❌ Error saving messages:', error);
        }
      }
    });

  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: String(error),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
