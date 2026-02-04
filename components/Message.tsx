import { AI_TOOLS } from "@/constants/chat.constant";
import type { ChatMessage } from "@/types/chat";
import { PreviewAttachment } from "./parts/PreviewAttachment";
import { RenderPart } from "./parts/RenderPart";

interface MessageProps {
	message: ChatMessage;
}
const VALID_CONTENT_TYPES: readonly string[] = Object.values(AI_TOOLS);
export function Message({ message }: MessageProps) {
	const { parts, role } = message;

	const isUser = role === "user";

	const isStreaming = parts.some(
		(part) => "state" in part && part.state === "streaming",
	);

	const attachments = parts.filter((part) => part.type === "file");

	const hasVisibleContent = parts.some(
		(part) => VALID_CONTENT_TYPES.includes(part.type) || part.type === "file",
	);
	if (!hasVisibleContent) return null;

	return (
		<div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`flex flex-col gap-2 transition-all duration-300 ease-out 
      ${isUser ? "w-fit sm:max-w-[90%]" : "w-full"}`}
			>
				{attachments.length > 0 && (
					<div
						className={`flex flex-row gap-2 ${isUser ? "justify-end" : "justify-start"}`}
						data-testid="message-attachments"
					>
						{attachments.map((attachment) => (
							<PreviewAttachment
								attachment={{
									name: attachment.filename ?? "file",
									contentType: attachment.mediaType,
									url: attachment.url,
								}}
								key={attachment.url}
							/>
						))}
					</div>
				)}
				{parts.map((part, index) => (
					<RenderPart
						key={index}
						part={part}
						isUser={isUser}
						isStreaming={isStreaming}
						messageId={message.tempId ?? message.id}
					/>
				))}
			</div>
		</div>
	);
}
