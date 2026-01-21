import { MessageBubble } from "@/components/MessageBubble";
import { ChatError } from "@/components/ChatError";

interface MessagesListProps {
  messages: any[];
  error: Error | undefined;
  reload: () => void;
}

export function MessagesList({ messages, error, reload }: MessagesListProps) {
  return (
    <div className="flex flex-col mb-5 gap-3 py-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          speed={5}
        />
      ))}
      <ChatError error={error} reload={reload} />
    </div>
  );
}
