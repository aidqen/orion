import type { FileUIPart, InferUITool, UIMessage } from "ai";
import type {
	createNewEventsTool,
	getCalendarEventsTool,
} from "@/tools/calendar.tools";
import type { createDocumentTool } from "@/tools/document.tools";
import type { fetchTodosTool, suggestNewTodosTool } from "@/tools/todos.tools";

export interface Chat {
	id: string;
	title: string;
	createdAt: string;
}

export type ItemStatus = "pending_confirmation" | "confirmed" | "failed";

// Tavily Search Types
export type TavilySearchResult = {
	title: string;
	url: string;
	content: string;
	score: number;
	rawContent?: string;
	publishedDate?: string;
	favicon?: string;
};

export type TavilyImageResult = {
	url: string;
	description?: string;
};

export type TavilySearchOutput = {
	query: string;
	results: TavilySearchResult[];
	responseTime: number;
	requestId: string;
	answer?: string;
	images?: string[] | TavilyImageResult[];
};

export type webSearchToolType = {
	type: "tool-webSearch";
	input: { query: string };
	output: TavilySearchOutput;
};

export type ChatTools = {
	getCalendarEvents: getCalendarEventsToolType;
	createNewEvents: createNewEventsToolType;
	createDocument: createDocumentToolType;
	webSearch: webSearchToolType;
	fetchTodos: fetchTodosToolType;
	suggestNewTodos: suggestNewTodosToolType;
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
type fetchTodosToolType = InferUITool<ReturnType<typeof fetchTodosTool>>;
type suggestNewTodosToolType = InferUITool<
	ReturnType<typeof suggestNewTodosTool>
>;

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
