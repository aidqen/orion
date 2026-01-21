import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useChatStore } from "@/store/useChatStore";
import { getChatMessages } from "@/lib/supabase/messages";

export function useChatPage(chatId: string) {
  const [input, setInput] = useState("");
  const { pendingMessage, setPendingMessage } = useChatStore();
  const hasSentPendingMessage = useRef(false);
  const hasFetchedMessages = useRef(false);

  const { messages, status, stop, sendMessage, setMessages, error } = useChat({
    id: chatId,
    onError: (error) => {
      console.error('useChat error:', error);
    },
  });

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
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    }
  }

  useEffect(() => {
    if (pendingMessage && !hasSentPendingMessage.current) {
      appendPendingMessage();
    } else {
      fetchChatMessages();
    }
  }, [chatId, pendingMessage, sendMessage, setPendingMessage, setMessages]);

  function handleSendMessage(message: any) {
    console.log("🚀 ~ handleSendMessage ~ message:", message)
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
    stop,
    handleSendMessage,
  };
}

