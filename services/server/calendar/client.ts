// SERVER-ONLY: Creates Google Calendar API client

import { auth, calendar_v3 } from "@googleapis/calendar";

export function createCalendarClient(accessToken: string) {
	const oauth2Client = new auth.OAuth2();
	oauth2Client.setCredentials({ access_token: accessToken });
	return new calendar_v3.Calendar({ auth: oauth2Client });
}
