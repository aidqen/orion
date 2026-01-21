import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useChatStore } from "@/store/useChatStore";
import { getChatMessages } from "@/lib/supabase/messages";
import { UIMessage } from "ai";

export function useChatMessages(chatId: string) {
  const [input, setInput] = useState("");
  const { pendingMessage, setPendingMessage } = useChatStore();

  const hasSentPendingMessage = useRef(false);
  const hasFetchedMessages = useRef(false);

  const { messages, status, stop, sendMessage, setMessages, error, regenerate } = useChat({
    id: chatId,
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
      sendMessage({ text: pendingMessage });
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
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    }
  }

  function handleSendMessage(message: any) {
    const messageText = message.text || input;
    
    if (messageText && messageText.trim().length > 0) {
      setInput("");
      sendMessage({ text: messageText }, { body: { chatId}});
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

