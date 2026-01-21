import { Message, saveMessages } from '@/lib/supabase/messages';
import { MESSAGE_ROLES } from '@/constants/chat.constant';
import { TextUIPart, UIMessage } from 'ai';

/**
 * Formats an incoming user message for database storage
 * 
 * @param incomingMessage - The message from the client
 * @returns The formatted user message
 */
export function formatUserMessage(
  incomingMessage: UIMessage
): Message {
  return {
    role: MESSAGE_ROLES.USER,
    parts: incomingMessage.parts as TextUIPart[] || [],
    metadata: incomingMessage.metadata as Record<string, any> || {},
  };
}

/**
 * Formats an assistant response message for database storage
 * 
 * @param responseMessage - The response message from the AI SDK
 * @param model - The model name used for the response
 * @param tokenUsage - Optional token usage statistics
 * @returns The formatted assistant message
 */
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
    role: MESSAGE_ROLES.ASSISTANT,
    parts: responseMessage.parts as TextUIPart[] || [],
    metadata: {},
    model,
    tokenUsage,
  };
}

/**
 * Handles saving conversation messages to the database
 * 
 * @param chatId - The chat ID to save messages to
 * @param originalMessages - The original messages from the request body
 * @param allMessages - All messages including the new assistant response
 * @param model - The AI model used for the response
 */
export async function saveLatestMessages(
  chatId: string,
  originalMessages: UIMessage[],
  allMessages: UIMessage[],
  model: string
): Promise<void> {
  const messagesToSave = [];

  const newUserMessage = originalMessages[originalMessages.length - 1];
  if (newUserMessage?.role === MESSAGE_ROLES.USER) {
    messagesToSave.push(formatUserMessage(newUserMessage));
  }

  const newAssistantMessage = allMessages[allMessages.length - 1];
  if (newAssistantMessage?.role === MESSAGE_ROLES.ASSISTANT) {
    messagesToSave.push(formatAssistantMessage(newAssistantMessage, model));
  }

  if (messagesToSave.length > 0) {
    await saveMessages(chatId, messagesToSave);
    console.log(`✅ Saved ${messagesToSave.length} message(s)`);
  }
}
