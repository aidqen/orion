import { calendar_v3 } from "@googleapis/calendar";

// export interface CalendarEvent {
//     id: string;
//     summary: string;
//     description?: string;
//     start: { dateTime?: string; date?: string };
//     end: { dateTime?: string; date?: string };
//     location?: string;
//     status: string;
// }

export type CalendarEvent = calendar_v3.Schema$Event

export interface CreateEventInput {
    title: string;
    startDateTime: string;  // ISO format: "2026-01-21T10:00:00"
    endDateTime: string;    // ISO format: "2026-01-21T11:00:00"
    description?: string;
    location?: string;
    attendees?: string[];
    calendarId?: string;    // defaults to 'primary'
}