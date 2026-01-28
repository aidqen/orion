import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useChatStore } from "@/store/useChatStore";
import { useArtifactStore } from "@/store/useArtifactStore";
import { getChatMessages } from "@/lib/supabase/messages";
import { generateId, UIMessage } from "ai";
import { saveLatestMessages } from "@/utils/messages";
import { AI_MODEL, AI_TOOLS } from "@/constants/chat.constant";

interface MessagePart {
  type: 'file' | 'text';
  url?: string;
  mediaType?: string;
  text?: string;
}

/** Builds message parts from files (already uploaded) and text */
function buildMessageParts(files: any[], text?: string): MessagePart[] {
  const parts: MessagePart[] = [];
  
  // Add file parts (URLs are already Supabase URLs from CustomPromptInput)
  for (const file of files) {
    if (file.mediaType?.startsWith('image/')) {
      parts.push({ 
        type: 'file', 
        url: file.url,
        mediaType: file.mediaType,
      });
    }
  }
  
  // Add text part
  if (text?.trim()) {
    parts.push({ type: 'text', text: text.trim() });
  }
  
  return parts;
}

export function useMessages(chatId: string) {
  const [input, setInput] = useState("");
  const setPendingMessage = useChatStore(state => state.setPendingMessage);
  const pendingMessage = useChatStore(state => state.pendingMessage);

  const hasSentPendingMessage = useRef(false);
  const hasFetchedMessages = useRef(false);
  const savedMessageIds = useRef(new Set<string>());
  const artifactIdRef = useRef<string | null>(null);

  const { messages, status, stop, sendMessage, setMessages, error, regenerate } = useChat({
    id: chatId,
    generateId: () => generateId(),
    onFinish: async ({ messages: allMessages }) => {
      // Mark streaming artifacts as completed
      const artifactStore = useArtifactStore.getState();
      const lastMessage = allMessages[allMessages.length - 1];

      if (lastMessage?.role === 'assistant') {
        const parts = lastMessage.parts || [];
        for (const part of parts) {
          if (part.type === AI_TOOLS.CREATE_DOCUMENT && part.state === 'output-available' && (part as any).output?.id) {
            artifactStore.completeArtifact((part as any).output.id, (part as any).toolCallId);
          }
        }
      }
      // Get the last assistant message ID to check if already saved
      const lastAssistantMessage = allMessages
        .slice()
        .reverse()
        .find(msg => msg.role === 'assistant');

      if (lastAssistantMessage && !savedMessageIds.current.has(lastAssistantMessage.id)) {
        try {
          await saveLatestMessages(chatId, allMessages, AI_MODEL);
          savedMessageIds.current.add(lastAssistantMessage.id);
        } catch (error) {
          console.error('❌ Error saving messages:', error);
        }
      }
    },
    onData: (data: any) => {
      const artifactStore = useArtifactStore.getState();

      if (data.type === 'data-id') {
        artifactIdRef.current = data.data as string;
      }

      if (data.type === 'data-title') {
        if (artifactIdRef.current) {
          artifactStore.createArtifact(artifactIdRef.current, data.data as string);
          // artifactStore.openArtifact(artifactIdRef.current);
        }
      }

      if (data.type === 'data-textDelta') {
        if (artifactIdRef.current) {
          artifactStore.appendContent(artifactIdRef.current, data.data as string);
        }
      }
    }
  });

  useEffect(() => {
    if (pendingMessage && !hasSentPendingMessage.current) {
      appendPendingMessage();
    } else {
      fetchChatMessages();
    }
  }, [chatId, pendingMessage, sendMessage, setPendingMessage, setMessages]);

  async function appendPendingMessage() {
    if (pendingMessage && !hasSentPendingMessage.current) {
      hasSentPendingMessage.current = true;
      handleSendMessage(pendingMessage);
      setPendingMessage(null);
    }
  }

  async function fetchChatMessages() {
    if (!hasFetchedMessages.current) {
      hasFetchedMessages.current = true;
      try {
        const fetchedMessages = await getChatMessages(chatId);
        if (fetchedMessages.length > 0) {
          setMessages(fetchedMessages as UIMessage[]);
          // Reconstruct artifacts from history
          useArtifactStore.getState().reconstructArtifacts(fetchedMessages as UIMessage[]);
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    }
  }

  function handleSendMessage(message: any) {
    const messageText = message.text || input;
    const files = message.files || [];
    
    const parts = buildMessageParts(files, messageText);
    
    if (parts.length > 0) {
      setInput("");
      sendMessage({ parts } as any, { body: { chatId } });
    }
  }

  return {
    input,
    setInput,
    messages,
    status,
    error,
    stop,
    reload: regenerate,
    handleSendMessage,
  };
}
