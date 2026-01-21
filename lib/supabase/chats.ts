import { createClient } from '@/lib/supabase/client';
import { Chat } from '@/types/chat';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}



/**
 * Creates a new chat for the given user
 */
export async function createChat(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('chats')
    .insert({
      user_id: userId,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function saveMessages(chatId: string, messages: ChatMessage[]) {
  const supabase = createClient();

  const messagesToInsert = messages.map((msg) => ({
    chat_id: chatId,
    role: msg.role,
    parts_json: [
      {
        type: 'text',
        text: msg.content,
      },
    ],
  }));

  const { error } = await supabase
    .from('chat_messages')
    .insert(messagesToInsert);

  if (error) throw error;
}


export async function getChatMessages(chatId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, parts_json, created_at')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: msg.parts_json || [],
    createdAt: msg.created_at,
  }));
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const supabase = createClient();

  const { data, error } = await supabase
  .from('chats')
  .select(`
    id,
    created_at,
    title
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);
  console.log("🚀 ~ getUserChats ~ data:", data)

  if (error) throw error;

  return (data || []).map((chat: any) => ({
    id: chat.id,
    title: chat.title || 'New Chat',
    createdAt: chat.created_at,
  }));
}

