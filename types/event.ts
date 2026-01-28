export interface EventData {
    id?: string | null;
    summary?: string | null;
    description?: string | null;
    location?: string | null;
    start?: { dateTime?: string | null; date?: string | null; timeZone?: string | null };
    end?: { dateTime?: string | null; date?: string | null; timeZone?: string | null };
    attendees?: {email: string}[];
}
