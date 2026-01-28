export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

export const AI_MODEL = 'claude-sonnet-4-5-20250929';
// export const AI_MODEL = 'gpt-4o';

export const AI_TOOLS = {
  GET_CALENDAR_EVENTS: 'tool-getCalendarEvents',
  CREATE_NEW_EVENT: 'tool-createNewEvent',
  WEB_SEARCH: 'tool-webSearchTool',
  CREATE_DOCUMENT: 'tool-createDocument',
  TEXT: 'text',
  IMAGE: 'file'
} as const;
