"use client";
import { useParams } from "next/navigation";
import { ChatpageHeader } from "@/components/Chatpage/ChatpageHeader";
import { CustomPromptInput } from "@/components/CustomPromptInput/CustomPromptInput";
import { DataStreamHandler } from "@/components/DataStreamHandler";
import { MessagesList } from "@/components/MessagesList";
import { useUser } from "@/contexts/UserContext";
import { useMessages } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";
import { useArtifactStore } from "@/store/useArtifactStore";
import { Artifact } from "@/components/Artifact/Artifact";

export default function ChatPage() {
	const params = useParams();
	const chatId = params.chatId as string;
	const { user } = useUser();

	const {
		input,
		setInput,
		messages,
		status,
		stop,
		handleSendMessage,
		error,
		reload,
	} = useMessages(chatId);
	const isArtifactOpen = useArtifactStore((state) => state.isOpen);

	return (
		<>
			<div className="flex flex-1 h-full grow overflow-hidden relative">
				<div className="flex-50 h-full flex flex-col bg-background text-black">
					<ChatpageHeader />
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
						className={cn(
							isArtifactOpen
								? "prompt-input-width-artifact-open"
								: "prompt-input-width-default",
							"my-4",
						)}
					/>
				</div>

				<Artifact isActive={isArtifactOpen} />
			</div>

			<DataStreamHandler />
		</>
	);
}
