import { jsonSchema, tool } from "ai";
import {
	formatCalendarEvent,
	getUserTimezone,
} from "@/lib/calendar/create-events";
import { fetchCalendarEvents } from "@/lib/calendar/fetch-events";
import type { CreateEventInput } from "@/types/types";

export function createCalendarTools(userId: string) {
	return {
		getCalendarEvents: getCalendarEventsTool(userId),
		createNewEvents: createNewEventsTool(),
	};
}

export function getCalendarEventsTool(userId: string) {
	return tool({
		description:
			"Get calendar events for a specific date range. Use this to check the user's schedule, find free time, or list upcoming events.",
		inputSchema: jsonSchema<{
			minDate: string;
			maxDate: string;
			isVisible: boolean;
		}>({
			type: "object",
			properties: {
				minDate: {
					type: "string",
					description: "Start date in ISO format (e.g., 2026-01-21)",
				},
				maxDate: {
					type: "string",
					description: "End date in ISO format (e.g., 2026-01-28)",
				},
				isVisible: {
					type: "boolean",
					description: "Whether to show the events to the user",
				},
			},
			required: ["minDate", "maxDate"],
		}),
		execute: async ({
			minDate,
			maxDate,
			isVisible,
		}: {
			minDate: string;
			maxDate: string;
			isVisible: boolean;
		}) => {
			const fetchedEvents = await fetchCalendarEvents(userId, minDate, maxDate);
			return {
				isVisible,
				events: fetchedEvents.map((event) => ({
					id: event.id,
					summary: event.summary,
					description: event.description,
					location: event.location,
					start: event.start,
					end: event.end,
				})),
			};
		},
	});
}

export function createNewEventsTool() {
	return tool({
		description:
			"Format one or more calendar events for preview. Can create one or multiple events. Returns formatted events that can be confirmed by the user before actually creating them.",
		inputSchema: jsonSchema<{ events: CreateEventInput[] }>({
			type: "object",
			properties: {
				events: {
					type: "array",
					description:
						"List of events to create (use single-item array for one event)",
					items: {
						type: "object",
						properties: {
							title: {
								type: "string",
								description: "Title/summary of the event",
							},
							startDateTime: {
								type: "string",
								description:
									"Start date and time in ISO format (e.g., 2026-01-21T10:00:00)",
							},
							endDateTime: {
								type: "string",
								description:
									"End date and time in ISO format (e.g., 2026-01-21T11:00:00)",
							},
							description: {
								type: "string",
								description: "Optional description of the event",
							},
							location: {
								type: "string",
								description: "Optional location of the event",
							},
							attendees: {
								type: "array",
								description: "Optional list of attendee email addresses",
								items: { type: "string" },
							},
						},
						required: ["title", "startDateTime", "endDateTime"],
					},
					minItems: 1,
				},
			},
			required: ["events"],
		}),
		execute: async ({ events }: { events: CreateEventInput[] }) => {
			const timezone = getUserTimezone();
			const formattedEvents = events.map((event) => ({
				status: "pending_confirmation" as const,
				event: formatCalendarEvent(event, timezone),
			}));

			return {
				events: formattedEvents,
				timezone,
			};
		},
	});
}
