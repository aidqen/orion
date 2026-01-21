"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { CustomPromptInput } from "@/components/CustomPromptInput";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { StickToBottom } from "use-stick-to-bottom";
import { MessageBubble } from "@/components/MessageBubble";

export default function ExperimentalChat() {
  const [input, setInput] = useState("");
  const { messages, status, stop, sendMessage } = useChat({
  });
  console.log("🚀 ~ ExperimentalChat ~ messages:", messages);

  function handleSendMessage(message: string) {
    console.log("🚀 ~ handleSendMessage ~ message:", message);
    if (input.length > 0) {
      setInput("");
      sendMessage({ text: input });
    }
  }
  return (
    <div className="w-full h-full flex flex-col justify-start items-center dark:bg-[#161618] bg-white text-black">
      <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] h-full flex flex-col justify-end relative">
        <StickToBottom
          className="relative overflow-y-auto overflow-x-hidden flex-1 scrollbar ps-3"
          resize="smooth"
          initial="smooth"
        >
          <StickToBottom.Content className="flex flex-col">
            <div className="flex flex-col gap-3 py-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  type="regular"
                  speed={5}
                />
              ))}
            </div>
          </StickToBottom.Content>
        </StickToBottom>
        <CustomPromptInput
          className="sticky bottom-5"
          onSubmit={handleSendMessage}
          isBorderShine={false}
          input={input}
          setInput={setInput}
          textAnimation={false}
          status={status}
          stop={stop}
        />
      </div>
    </div>
  );
}
