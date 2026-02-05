"use client";
import { use } from "react";
import { Artifact } from "@/components/Artifact/Artifact";
import { CustomPromptInput } from "@/components/CustomPromptInput/CustomPromptInput";
import { DataStreamHandler } from "@/components/DataStreamHandler";
import { MessagesList } from "@/components/MessagesList";
import { useUser } from "@/contexts/UserContext";
import { useMessages } from "@/hooks/useMessages";
import { useArtifactStore } from "@/store/useArtifactStore";
import { cn } from "@/utils/shared";

interface ChatPageProps {
	params: Promise<{
		chatId: string;
	}>;
}

export default function ChatPage({ params }: ChatPageProps) {
	const { chatId } = use(params);
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
