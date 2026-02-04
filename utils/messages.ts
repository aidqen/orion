import { Message, saveMessages } from '@/lib/supabase/messages';
import { MESSAGE_ROLES } from '@/constants/chat.constant';
import { TextUIPart, UIMessage } from 'ai';

export function getLastUserMessageText(messages: UIMessage[]): string {
  const lastUserMessage = messages
    .filter((m) => m.role === 'user')
    .pop();

  return lastUserMessage?.parts
    ?.filter((p): p is TextUIPart => p.type === 'text')
    ?.map((p) => p.text)
    ?.join(' ') || '';
}

export function formatUserMessage(
  incomingMessage: UIMessage
): Message {
  return {
    tempId: incomingMessage.id,
    role: MESSAGE_ROLES.USER,
    parts: incomingMessage.parts as TextUIPart[] || [],
    metadata: incomingMessage.metadata as Record<string, unknown> || {},
  };
}

export function formatAssistantMessage(
  responseMessage: UIMessage,
  model: string,
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  }
): Message {
  return {
    tempId: responseMessage.id,
    role: MESSAGE_ROLES.ASSISTANT,
    parts: responseMessage.parts as TextUIPart[] || [],
    metadata: {},
    model,
    tokenUsage,
  };
}

/**
 * Handles saving conversation messages to the database
 * Saves the last user message and last assistant message from the array
 *
 * @param chatId - The chat ID to save messages to
 * @param messages - All messages including the new assistant response
 * @param model - The AI model used for the response
 */
export async function saveLatestMessages(
  chatId: string,
  messages: UIMessage[],
  model: string
): Promise<UIMessage[] | void> {
  const messagesToSave: Message[] = [];

  const lastUserMessage = messages.findLast(msg => msg?.role === MESSAGE_ROLES.USER);
  const lastAssistantMessage = messages.findLast(msg => msg?.role === MESSAGE_ROLES.ASSISTANT);

  if (lastUserMessage) {
    messagesToSave.push(formatUserMessage(lastUserMessage));
  }

  if (lastAssistantMessage) {
    messagesToSave.push(formatAssistantMessage(lastAssistantMessage, model));
  }

  if (messagesToSave.length > 0) {
    return await saveMessages(chatId, messagesToSave);
  }
}
