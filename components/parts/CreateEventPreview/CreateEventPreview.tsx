'use client'

import React from 'react';
import { EventHeader } from './EventHeader';
import { EventBody } from './EventBody';
import { AddEventButton } from './AddEventButton';
import { useMutation } from '@tanstack/react-query';
import { createCalendarEvent } from '@/services/client/calendar.service';
import { EventData } from '@/types/event';



interface CreateEventPreviewProps {
    data: {
        status: string;
        event: EventData;
        timezone: string;
    };
    messageId: string;
}

export const CreateEventPreview: React.FC<CreateEventPreviewProps> = ({ data, messageId }) => {
    const { mutate, isPending, isSuccess, error } = useMutation({
        mutationFn: createCalendarEvent,
    });

    if (!data?.event) return null;

    const { event, timezone, status } = data;
    const isConfirmed = status === 'confirmed' || isSuccess;

    return (
        <div className="w-fit min-w-[250px] sm:min-w-[400px] max-w-full">
            <div className="w-full my-2 overflow-hidden rounded-xl border bg-card backdrop-blur-md text-card-foreground shadow-sm">
                <EventHeader title={event.summary} isSuccess={isConfirmed}/>
                
                <EventBody
                    start={event.start?.dateTime}
                    end={event.end?.dateTime}
                    location={event.location ?? undefined}
                    description={event.description ?? undefined}
                    attendees={event.attendees ?? undefined}
                />
            </div>

            <AddEventButton
                onClick={() => mutate({ event, timezone, messageId })}
                isPending={isPending}
                isSuccess={isConfirmed}
                error={error}
            />
        </div>
    );
};
