import { getSupabaseServerClient } from '@/lib/google-token';
import { AI_TOOL_IDS } from '@/constants/chat.constant';

/**
 * Updates the event creation status to "confirmed" for a specific message
 * Finds the part with type CREATE_NEW_EVENT and updates its output.status
 */
export async function updateEventStatusToConfirmed(messageId: string): Promise<void> {
    const supabase = await getSupabaseServerClient();

    // Fetch the message
    const { data: message, error: fetchError } = await supabase
        .from('chat_messages')
        .select('parts_json')
        .eq('id', messageId)
        .single();

    if (fetchError || !message) {
        console.error('Failed to fetch message:', fetchError);
        throw new Error('Message not found');
    }

    // Find and update the CREATE_NEW_EVENT part
    const parts = message.parts_json as any[];
    const updatedParts = parts.map((part) => {
        if (part.type === AI_TOOL_IDS.CREATE_NEW_EVENT && part.output) {
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

    // Update the message with the modified parts
    const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ parts_json: updatedParts })
        .eq('id', messageId);

    if (updateError) {
        console.error('Failed to update message:', updateError);
        throw new Error('Failed to update event status');
    }
}

