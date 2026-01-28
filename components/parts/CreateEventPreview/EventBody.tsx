import React from 'react';
import { MapPin, AlignLeft, User } from 'lucide-react';

interface EventBodyProps {
    start?: string | null;
    end?: string | null;
    location?: string;
    description?: string;
    attendees?: {email: string}[];
}

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
};

const formatTime = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
        });
    } catch (e) {
        return '';
    }
};

export const EventBody: React.FC<EventBodyProps> = ({ start, end, location, description, attendees }) => (
    <div className="grid gap-3 p-4 text-sm">
        <div className="flex flex-col items-start gap-1">
                {start &&<span className="font-medium">
                    {formatDate(start)}
                </span>}
                {(start && end) && <span className="text-muted-foreground">
                    {formatTime(start)} - {formatTime(end)}
                </span>}
        </div>

        {location && (
            <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="wrap-break-word text-muted-foreground">
                    {location}
                </span>
            </div>
        )}

        {description && (
            <div className="flex items-start gap-2">
                <AlignLeft className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="wrap-break-word text-muted-foreground">
                    {description}
                </p>
            </div>
        )}
        {attendees && attendees.length > 0 && (
            <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="wrap-break-word text-muted-foreground">
                    {attendees.map((attendee: {email: string}) => attendee.email).join(', ')}
                </p>
            </div>
        )}
    </div>
);
