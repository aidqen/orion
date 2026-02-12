import { AlignLeft, MapPin, User } from "lucide-react";
import type React from "react";

interface EventBodyProps {
	start?: string | null;
	end?: string | null;
	location?: string;
	description?: string;
	attendees?: { email?: string | null }[] | null;
}

const formatDate = (dateStr: string) => {
	try {
		return new Date(dateStr).toLocaleDateString(undefined, {
			weekday: "long",
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch (_error: unknown) {
		return dateStr;
	}
};

const formatTime = (dateStr: string) => {
	try {
		return new Date(dateStr).toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit",
		});
	} catch (_error: unknown) {
		return "";
	}
};

export const EventBody: React.FC<EventBodyProps> = ({
	start,
	end,
	location,
	description,
	attendees,
}) => (
	<div className="grid gap-3 p-4 text-sm">
		<div className="flex flex-col items-start gap-1">
			{start ? <span className="font-medium">{formatDate(start)}</span> : null}
			{start && end ? (
				<span className="text-muted-foreground">
					{formatTime(start)} - {formatTime(end)}
				</span>
			) : null}
		</div>

		{location ? (
			<div className="flex items-start gap-2">
				<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
				<span className="wrap-break-word text-muted-foreground">
					{location}
				</span>
			</div>
		) : null}

		{description ? (
			<div className="flex items-start gap-2">
				<AlignLeft className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
				<p className="wrap-break-word text-muted-foreground">{description}</p>
			</div>
		) : null}
		{attendees && attendees.length > 0 ? (
			<div className="flex items-start gap-2">
				<User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
				<p className="wrap-break-word text-muted-foreground">
					{attendees
						.filter((a) => a.email)
						.map((attendee) => attendee.email)
						.join(", ")}
				</p>
			</div>
		) : null}
	</div>
);
