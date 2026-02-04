'use client'

import React from 'react';
import { EventCard } from './EventCard';
import { AddAllEventsButton } from './AddAllEventsButton';
import { useMutation } from '@tanstack/react-query';
import { createCalendarEvents } from '@/services/client/calendar.service';
import { EventWithStatus } from '@/types/event';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface CreateEventPreviewProps {
    data: {
        events: EventWithStatus[];
        timezone: string;
    };
    messageId: string;
}

export const CreateEventPreview: React.FC<CreateEventPreviewProps> = ({ data, messageId }) => {
    const { mutate, isPending, data: result } = useMutation({
        mutationFn: createCalendarEvents,
    });

    if (!data?.events?.length) return null;

    const { timezone } = data;
    
    const events = result?.events ?? data.events;
    
    const pendingCount = events.filter(e => e.status === 'pending_confirmation').length;
    const failedCount = events.filter(e => e.status === 'failed').length;

    const hasPending = pendingCount > 0;
    const hasFailures = failedCount > 0;

    return (
        <div className="w-fit min-w-[250px] sm:min-w-[400px] max-w-full space-y-3">
            {events.map((item, index) => (
                <EventCard 
                    key={index} 
                    event={item.event} 
                    status={item.status}
                    error={item.error}
                />
            ))}

            {hasPending && (
                <AddAllEventsButton
                    onClick={() => mutate({ events, timezone, messageId })}
                    isPending={isPending}
                    pendingCount={pendingCount}
                />
            )}

            {hasFailures && !hasPending && (
                <Button
                    onClick={() => mutate({ events, timezone, messageId })}
                    variant="destructive"
                    size="sm"
                >
                    <RefreshCw className="h-4 w-4" />
                    Retry {failedCount} failed event{failedCount > 1 ? 's' : ''}
                </Button>
            )}
        </div>
    );
};
