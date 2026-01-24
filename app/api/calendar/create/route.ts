import { getSupabaseServerClient } from '@/lib/google-token';
import { createCalendarEvent } from '@/lib/calendar/create-events';
import { EventData } from '@/types/event';
import { updateEventStatusToConfirmed } from '@/services/server/chat.service';

export async function POST(req: Request) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await req.json();
        const { event, messageId } = body as { event: EventData; timezone: string; messageId: string };

        const createdEvent = await createCalendarEvent(user.id, event as EventData);

        // Update the message status to confirmed
        await updateEventStatusToConfirmed(messageId);

        return new Response(JSON.stringify({ 
            success: true, 
            event: createdEvent 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error creating calendar event:', error);


        return new Response(JSON.stringify({ 
            error: error.message,
            code: error?.code 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

