"use client";
import { useParams } from "next/navigation";
import { CustomPromptInput } from "@/components/CustomPromptInput/CustomPromptInput";
import { MessagesList } from "@/components/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { useUser } from "@/contexts/UserContext";
import { Artifact } from "@/components/Artifact/Artifact";
import { useArtifactStore } from "@/store/useArtifactStore";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { user } = useUser();

  const { input, setInput, messages, status, stop, handleSendMessage, error, reload } = useMessages(chatId);
  console.log("🚀 ~ ChatPage ~ messages:", messages)
  const isArtifactOpen = useArtifactStore(state => state.isOpen);

  return (
    <div className="flex flex-1 h-full grow overflow-hidden relative">
      <div className="flex-50 h-full flex flex-col bg-background text-black">
        <MessagesList messages={messages} error={error} reload={reload} />

            <CustomPromptInput
              onSubmit={handleSendMessage}
              input={input}
              setInput={setInput}
              textAnimation={false}
              status={status}
              stop={stop}
              chatId={chatId}
              userId={user?.id || ""}
              className={isArtifactOpen ? "prompt-input-width-artifact-open" : "prompt-input-width-default"}
            />
      </div>
      
      <Artifact isActive={isArtifactOpen} />
    </div>
  );
}
