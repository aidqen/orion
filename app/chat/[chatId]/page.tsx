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

  return (
    <div className="w-full pt-10 h-full flex flex-col justify-start items-center dark:bg-[#161618] bg-white text-black">
      <StickToBottom
        className="w-full h-full overflow-y-auto scrollbar"
        resize="smooth"
      >
        <StickToBottom.Content className="w-full flex flex-col items-center">
          <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] flex flex-col">
            <MessagesList messages={messages} error={error} reload={reload} />
            <div className="w-full  sticky bottom-5">
              <CustomPromptInput
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
        </StickToBottom.Content>
      </StickToBottom>
    </div>
  );
}
