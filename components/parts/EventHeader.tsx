import React from 'react';
import { CalendarCheck, CalendarCheck2, CalendarDays, CalendarPlus } from 'lucide-react';

interface EventHeaderProps {
    title: string | undefined | null;
    isSuccess: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ title, isSuccess }) => (
    <div className="border-b bg-muted/40 p-4">
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {isSuccess ? <CalendarCheck2 className="h-5 w-5" /> : <CalendarPlus className="h-5 w-5" />}
            </div>
            <div className="grid gap-1">
                <h3 className="font-semibold leading-none tracking-tight">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">
                    Proposed Event
                </p>
            </div>
        </div>
    </div>
);

