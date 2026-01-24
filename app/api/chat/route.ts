import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { saveLatestMessages } from '@/utils/messages';
import { AI_MODEL } from '@/constants/chat.constant';
import { SYSTEM_PROMPT } from '@/constants/prompt.constant';
import { createCalendarTools } from '@/tools/calendar.tools';
import { getSupabaseServerClient } from '@/lib/google-token';

// Removed edge runtime - incompatible with cookies() from next/headers
export const maxDuration = 30;

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('Unauthorized');
    
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { messages, id } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      console.log('Messages array is required');
      
      return new Response('Messages array is required', { status: 400 });
    }
    if (!id) {
      console.log('Chat ID is required');
      
      return new Response('Chat ID is required', { status: 400 });
    }

    const modelMessages = await convertToModelMessages(messages);
    const calendarTools = createCalendarTools(user.id);

    const result = streamText({
      model: anthropic(AI_MODEL),
      messages: modelMessages,
      system: SYSTEM_PROMPT,
      tools: calendarTools,
      temperature: 0.7,
      stopWhen: stepCountIs(5),
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
