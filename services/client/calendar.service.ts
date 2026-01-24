import { EventData } from "@/types/event";


export async function createCalendarEvent(payload: { event: EventData; timezone: string; messageId: string }) {
    const response = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Failed to create event');
    }

    return result;
}

