import type { anthropic } from "@ai-sdk/anthropic";
import type { FileUIPart, InferUITool, UIMessage } from "ai";
import type {
	createNewEventsTool,
	getCalendarEventsTool,
} from "@/tools/calendar.tools";
import type { createDocumentTool } from "@/tools/document.tools";

export interface Chat {
	id: string;
	title: string;
	createdAt: string;
}

export type ChatTools = {
	getCalendarEvents: getCalendarEventsToolType;
	createNewEvents: createNewEventsToolType;
	createDocument: createDocumentToolType;
	webSearchTool: webSearchToolType;
};

export type CustomUIDataTypes = {
	id: string;
	title: string;
	textDelta: string;
	finish: { id: string };
};

export type CreateDocumentToolType = {
	id: string;
	title: string;
	description: string;
	content: string;
};

type MessageMetadata = unknown;

type getCalendarEventsToolType = InferUITool<
	ReturnType<typeof getCalendarEventsTool>
>;
type createNewEventsToolType = InferUITool<
	ReturnType<typeof createNewEventsTool>
>;
type createDocumentToolType = InferUITool<
	ReturnType<typeof createDocumentTool>
>;
type AnthropicWebSearchType = InferUITool<
	ReturnType<typeof anthropic.tools.webSearch_20250305>
>;
export type webSearchToolType = Omit<AnthropicWebSearchType, "type"> & {
	type: "tool-webSearchTool";
};

export type ChatMessage = UIMessage<
	MessageMetadata,
	CustomUIDataTypes,
	ChatTools
> & {
	tempId?: string;
};

export type ChatMessagePart = ChatMessage["parts"][number];

export type FileUIPartWithId = FileUIPart & { id: string };
export type MessageInput = { text: string; files?: FileUIPartWithId[] };
