import { createNewEventTool, getCalendarEventsTool } from "@/tools/calendar.tools";
import { createDocumentTool } from "@/tools/document.tools";
import { InferUITool, UIMessage } from "ai";

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

export type ChatTools = {
  getCalendarEvents: getCalendarEventsToolType;
  createNewEvent: createNewEventToolType;
  createDocument: createDocumentToolType;
}

export type CustomUIDataTypes =
  | { type: 'data-id'; data: string }
  | { type: 'data-title'; data: string }
  | { type: 'data-textDelta'; data: string };


type getCalendarEventsToolType = InferUITool<ReturnType<typeof getCalendarEventsTool>>;
type createNewEventToolType = InferUITool<ReturnType<typeof createNewEventTool>>;
type createDocumentToolType = InferUITool<ReturnType<typeof createDocumentTool>>;

export type ChatMessage = UIMessage<
  CustomUIDataTypes,
  ChatTools
>;