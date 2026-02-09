export const MESSAGE_ROLES = {
	USER: "user",
	ASSISTANT: "assistant",
	SYSTEM: "system",
} as const;

export const AI_MODEL = "claude-sonnet-4-5-20250929" as const;
// export const AI_MODEL = "claude-3-5-haiku-20241022" as const;
export const SIMPLE_FAST_MODEL = "claude-3-5-haiku-20241022" as const;
export const EMBEDDING_MODEL = "text-embedding-3-small" as const;

export const AI_TOOLS = {
	GET_CALENDAR_EVENTS: "tool-getCalendarEvents",
	CREATE_NEW_EVENTS: "tool-createNewEvents",
	WEB_SEARCH: "tool-webSearchTool",
	CREATE_DOCUMENT: "tool-createDocument",
	FETCH_TODOS: "tool-fetchTodos",
	SUGGEST_NEW_TODOS: "tool-suggestNewTodos",
	TEXT: "text",
} as const;
