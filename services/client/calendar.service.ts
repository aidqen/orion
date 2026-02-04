import { EventWithStatus } from "@/types/event";

export async function createCalendarEvents(payload: { 
    events: EventWithStatus[]; 
    timezone: string; 
    messageId: string 
}) {
    const response = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Failed to create events');
    }

    return result as { 
        success: boolean; 
        events: EventWithStatus[]; 
        summary: { confirmed: number; failed: number } 
    };
}

