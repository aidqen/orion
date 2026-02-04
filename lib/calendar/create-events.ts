import { calendar_v3 } from "@googleapis/calendar";
import { getGoogleAccessToken } from "../google-token";
import { createCalendarClient } from "./fetch-events";
import { CalendarEvent, CreateEventInput } from "../../types/types";



export function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatCalendarEvent(input: CreateEventInput, timezone: string): calendar_v3.Schema$Event {
    return {
        summary: input.title,
        description: input.description,
        location: input.location,
        start: {
            dateTime: input.startDateTime,
            timeZone: timezone,
        },
        end: {
            dateTime: input.endDateTime,
            timeZone: timezone,
        },
        attendees: input.attendees?.map(attendee => ({ email: attendee })) || [],
    };
}

export async function createCalendarEvent(
    userId: string, 
    event: calendar_v3.Schema$Event,
    calendarId: string = 'primary'
): Promise<CalendarEvent> {
    const accessToken = await getGoogleAccessToken(userId);
    const calendar = createCalendarClient(accessToken);

    const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
    });

    if (!response.data) {
        throw { code: 'event_creation_failed' };
    }

    return response.data as CalendarEvent;
}
