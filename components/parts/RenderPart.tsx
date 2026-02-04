import { AI_TOOLS } from "@/constants/chat.constant";
import type { ChatMessagePart } from "@/types/chat";
import { ArtifactPreview } from "./ArtifactPreview";
import { CreateEventPreview } from "./CreateEventPreview/CreateEventPreview";
import { EventList } from "./EventList/EventList";
import { TextPart } from "./TextPart";
import { WebSearchResults } from "./WebSearchResults/WebSearchResults";

interface RenderPartProps {
	part: ChatMessagePart;
	isUser: boolean;
	isStreaming: boolean;
	messageId: string;
}

export function RenderPart({
	part,
	isUser,
	isStreaming,
	messageId,
}: RenderPartProps) {
	if (part.type === AI_TOOLS.TEXT) {
		return (
			<TextPart
				text={part.text}
				speed={5}
				isUser={isUser}
				isStreaming={part.state === "streaming" || isStreaming}
			/>
		);
	}

	if (part.type === AI_TOOLS.WEB_SEARCH) {
		return <WebSearchResults data={part} />;
	}

	if (!("output" in part) || !part.output) return null;

	switch (part.type) {
		case AI_TOOLS.CREATE_NEW_EVENTS:
			return <CreateEventPreview data={part.output} messageId={messageId} />;
		case AI_TOOLS.GET_CALENDAR_EVENTS:
			return <EventList data={part.output} />;
		case AI_TOOLS.CREATE_DOCUMENT:
			return (
				<ArtifactPreview
					data={part.output}
					isStreaming={part.state !== "output-available"}
				/>
			);
		default:
			return null;
	}
}
