import type { calendar_v3 } from "@googleapis/calendar";

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

export type EventStatus = "pending_confirmation" | "confirmed" | "failed";

export interface EventWithStatus {
	status: EventStatus;
	event: calendar_v3.Schema$Event;
	error?: string;
}
