import { auth, calendar_v3 } from "@googleapis/calendar";
import { getGoogleAccessToken } from "@/lib/google-token";
import type { CalendarEvent } from "../../types/types";

export function createCalendarClient(accessToken: string) {
	const oauth2Client = new auth.OAuth2();
	oauth2Client.setCredentials({ access_token: accessToken });
	return new calendar_v3.Calendar({ auth: oauth2Client });
}

function parseDateRange(minDate: string, maxDate: string) {
	const start = new Date(minDate);
	start.setHours(0, 0, 0, 0);

	const end = new Date(maxDate);
	end.setHours(23, 59, 59, 999);

	return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

async function fetchEventsFromCalendar(
	calendar: calendar_v3.Calendar,
	calendarId: string,
	timeMin: string,
	timeMax: string,
): Promise<CalendarEvent[]> {
	try {
		const response = await calendar.events.list({
			calendarId,
			timeMin,
			timeMax,
			singleEvents: true,
			orderBy: "startTime",
		});
		return (response.data.items || []) as CalendarEvent[];
	} catch (error) {
		console.error(`Failed to fetch events from calendar ${calendarId}:`, error);
		return [];
	}
}

function sortEventsByStartTime(events: CalendarEvent[]): CalendarEvent[] {
	return events.sort((a, b) => {
		const aTime = new Date(a.start?.dateTime || a.start?.date || 0).getTime();
		const bTime = new Date(b.start?.dateTime || b.start?.date || 0).getTime();
		return aTime - bTime;
	});
}

export async function fetchCalendarEvents(
	userId: string,
	minDate: string,
	maxDate: string,
): Promise<CalendarEvent[]> {
	const accessToken = await getGoogleAccessToken(userId);
	const calendar = createCalendarClient(accessToken);
	const { timeMin, timeMax } = parseDateRange(minDate, maxDate);

	// Fetch all calendars
	const { data } = await calendar.calendarList.list();
	const calendarIds = (data.items || [])
		.map((cal) => cal.id)
		.filter(Boolean) as string[];

	// Fetch events from all calendars in parallel
	const eventsArrays = await Promise.all(
		calendarIds.map((id) =>
			fetchEventsFromCalendar(calendar, id, timeMin, timeMax),
		),
	);

	const allEvents = eventsArrays.flat();
	return sortEventsByStartTime(allEvents);
}
