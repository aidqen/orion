import { getSupabaseServerClient } from '@/lib/google-token';
import { AI_TOOLS } from '@/constants/chat.constant';

/**
 * Updates the event creation status to "confirmed" for a specific message
 * Finds the part with type CREATE_NEW_EVENT and updates its output.status
 */
export async function updateEventStatusToConfirmed(messageId: string): Promise<void> {
    const supabase = await getSupabaseServerClient();

    // Fetch the message by temp_id
    const { data: message, error: fetchError } = await supabase
        .from('chat_messages')
        .select('parts_json, id')
        .eq('temp_id', messageId)
        .single();

    if (fetchError || !message) {
        console.error('Failed to fetch message:', fetchError);
        throw new Error('Message not found');
    }

    // Find and update the CREATE_NEW_EVENT part
    const parts = message.parts_json as any[];
    const updatedParts = parts.map((part) => {
        if (part.type === AI_TOOLS.CREATE_NEW_EVENT && part.output) {
            return {
                ...part,
                output: {
                    ...part.output,
                    status: 'confirmed',
                },
            };
        }
        return part;
    });

    // Update the message with the modified parts using the actual database id
    const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ parts_json: updatedParts })
        .eq('id', message.id);

    if (updateError) {
        console.error('Failed to update message:', updateError);
        throw new Error('Failed to update event status');
    }
}

