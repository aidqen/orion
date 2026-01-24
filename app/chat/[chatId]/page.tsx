"use client";
import { useParams } from "next/navigation";
import { StickToBottom } from "use-stick-to-bottom";
import { CustomPromptInput } from "@/components/CustomPromptInput";
import { MessagesList } from "@/components/MessagesList";
import { useChatMessages } from "@/hooks/useChatMessages";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  const { input, setInput, messages, status, stop, handleSendMessage, error, reload } = useChatMessages(chatId);
  console.log("🚀 ~ ChatPage ~ messages:", messages)

  return (
    <div className="w-full h-full flex flex-col dark:bg-[#161618] bg-white text-black">
      <StickToBottom
        className="flex-1 w-full overflow-y-auto scrollbar"
        resize="smooth"
      >
        <StickToBottom.Content className="w-full flex flex-col items-center pt-10 pb-4">
          <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[60%] 2xl:max-w-[50%] flex flex-col">
            <MessagesList messages={messages} error={error} reload={reload} />
          </div>
        </StickToBottom.Content>
      </StickToBottom>
      
      <div className="w-full flex justify-center pb-5 pt-2 dark:bg-[#161618] bg-white">
        <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[50%]">
          <CustomPromptInput
            onSubmit={handleSendMessage}
            input={input}
            setInput={setInput}
            textAnimation={false}
            status={status}
            stop={stop}
          />
        </div>
      </div>
    </div>
  );
}
