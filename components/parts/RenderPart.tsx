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
	switch (part.type) {
		case AI_TOOLS.TEXT:
			return (
				<TextPart
					text={part.text}
					speed={5}
					isUser={isUser}
					isStreaming={part.state === "streaming" || isStreaming}
				/>
			);

		case AI_TOOLS.WEB_SEARCH:
			return <WebSearchResults data={part} />;

		case AI_TOOLS.CREATE_DOCUMENT:
			return (
				<ArtifactPreview
					data={
						part.output || { id: "", title: "", description: "", content: "" }
					}
					isStreaming={part.state !== "output-available"}
				/>
			);

		case AI_TOOLS.CREATE_NEW_EVENTS:
			if (!part.output) return null;
			return <CreateEventPreview data={part.output} messageId={messageId} />;

		case AI_TOOLS.GET_CALENDAR_EVENTS:
			if (!part.output) return null;
			return <EventList data={part.output} />;

		default:
			return null;
	}
}
