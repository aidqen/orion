import { Message } from "@/components/Message";
import { ChatError } from "@/components/ChatError";
import { StickToBottom } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { useArtifactStore } from "@/store/useArtifactStore";

interface MessagesListProps {
  messages: any[];
  error: Error | undefined;
  reload: () => void;
}

export function MessagesList({ messages, error, reload }: MessagesListProps) {
  const isArtifactOpen = useArtifactStore(state => state.isOpen);
  return (
    <StickToBottom
      className="flex-1 w-full overflow-y-auto scrollbar"
      resize="smooth"
      initial={true}
    >
      <StickToBottom.Content className="w-full flex flex-col items-center pt-10 pb-4">
        <div className={cn("w-full  flex flex-col", 
          isArtifactOpen ? "prompt-input-width-artifact-open" : "prompt-input-width-default",)}>
          <div className="flex flex-col mb-5 gap-3 py-4">
            {messages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
              />
            ))}
            <ChatError error={error} reload={reload} />
          </div>
        </div>
      </StickToBottom.Content>
    </StickToBottom>
  );
}
