import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { EventData } from '@/types/event';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { EventDetailsModal } from './EventDetailsModal';

interface EventPreviewProps {
    event: EventData;
}

export const EventPreview: React.FC<EventPreviewProps> = ({ event }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const getStartDate = () => event.start?.dateTime || event.start?.date;

    const formatDate = () => {
        const dateStr = getStartDate();
        if (!dateStr) return '';

        try {
            const date = parseISO(dateStr);
            return format(date, 'EEE, MMM d');
        } catch (e) {
            console.error('Error formatting date', e);
            return dateStr;
        }
    };

    const formatTime = () => {
        if (event.start?.date && !event.start?.dateTime) return null;
        
        const startStr = event.start?.dateTime;

        if (!startStr) return null;

        try {
            const startDate = parseISO(startStr);
            const timeStr = format(startDate, 'h:mm a');
            
            return timeStr;
        } catch (e) {
            return null;
        }
    };

    const timeStr = formatTime();
    const dateStr = formatDate();

    return (
        <>
            <div className="border-b last:border-0 transition-all bg-muted/40">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div className="grid gap-0.5 overflow-hidden">
                            <h3 className="font-semibold leading-none text-base tracking-tight truncate">
                                {event.summary || 'No Title'}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                                {dateStr}
                                {timeStr && ` • ${timeStr}`}
                            </p>
                        </div>
                    </div>
                    
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="shrink-0 dark:bg-muted/10 font-medium text-sm"
                        onClick={() => setIsModalOpen(true)}
                    >
                        See Details
                    </Button>
                </div>
            </div>

            <EventDetailsModal 
                event={event} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
};
