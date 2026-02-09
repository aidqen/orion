import type { calendar_v3 } from "@googleapis/calendar";
import type { ItemStatus } from "./chat";

export interface EventData {
	id?: string | null;
	summary?: string | null;
	description?: string | null;
	location?: string | null;
	start?: {
		dateTime?: string | null;
		date?: string | null;
		timeZone?: string | null;
	};
	end?: {
		dateTime?: string | null;
		date?: string | null;
		timeZone?: string | null;
	};
	attendees?: { email?: string | null }[];
}

export interface EventWithStatus {
	status: ItemStatus;
	event: calendar_v3.Schema$Event;
	error?: string;
}

export type CalendarEvent = calendar_v3.Schema$Event;

export interface CreateEventInput {
	title: string;
	startDateTime: string; // ISO format: "2026-01-21T10:00:00"
	endDateTime: string; // ISO format: "2026-01-21T11:00:00"
	description?: string;
	location?: string;
	attendees?: string[];
	calendarId?: string; // defaults to 'primary'
}
