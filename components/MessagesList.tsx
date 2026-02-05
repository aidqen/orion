import { StickToBottom } from "use-stick-to-bottom";
import { ChatError } from "@/components/ChatError";
import { Message } from "@/components/Message";
import { useArtifactStore } from "@/store/useArtifactStore";
import type { ChatMessage } from "@/types/chat";
import { cn } from "@/utils/shared";

interface MessagesListProps {
	messages: ChatMessage[];
	error: Error | undefined;
	reload: () => void;
}

export function MessagesList({ messages, error, reload }: MessagesListProps) {
	const isArtifactOpen = useArtifactStore((state) => state.isOpen);
	return (
		<StickToBottom
			className="flex-1 w-full overflow-y-auto scrollbar"
			resize="smooth"
			initial={true}
		>
			<StickToBottom.Content className="w-full flex flex-col items-center pt-10 pb-4">
				<div
					className={cn(
						"w-full mb-5 gap-7 py-4 flex flex-col transition-[max-width] duration-300 ease-out",
						isArtifactOpen
							? "prompt-input-width-artifact-open"
							: "prompt-input-width-default",
					)}
				>
					{messages.map((msg) => (
						<Message key={msg.id} message={msg} />
					))}
					<ChatError error={error} reload={reload} />
				</div>
			</StickToBottom.Content>
		</StickToBottom>
	);
}
