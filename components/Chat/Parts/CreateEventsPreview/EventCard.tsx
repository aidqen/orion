"use client";

import {
	AlertCircle,
	CalendarCheck2,
	CalendarPlus,
	Check,
	Clock,
} from "lucide-react";
import type React from "react";
import type { ItemStatus } from "@/types/chat";
import type { EventData } from "@/types/event";
import { EventBody } from "./EventBody";

interface EventCardProps {
	event: EventData;
	status: ItemStatus;
	error?: string;
}

const StatusIcon = ({ status }: { status: ItemStatus }) => {
	switch (status) {
		case "confirmed":
			return <Check className="h-4 w-4 text-green-500" />;
		case "failed":
			return <AlertCircle className="h-4 w-4 text-red-500" />;
		default:
			return <Clock className="h-4 w-4 text-muted-foreground" />;
	}
};

const CalendarIcon: React.FC<{ status: ItemStatus }> = ({ status }) => {
	return status === "confirmed" ? (
		<CalendarCheck2 className="h-5 w-5" />
	) : (
		<CalendarPlus className="h-5 w-5" />
	);
};

export const EventCard: React.FC<EventCardProps> = ({
	event,
	status,
	error,
}) => {
	const statusStyles = {
		pending_confirmation: "border-border",
		confirmed: "",
		failed: "border-red-500/50 bg-red-500/5",
	};

	return (
		<div
			className={`w-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm ${statusStyles[status]}`}
		>
			<div className="border-b bg-muted/40 p-4">
				<div className="flex items-start gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<CalendarIcon status={status} />
					</div>
					<div className="grid gap-1 flex-1">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold leading-none tracking-tight">
								{event.summary}
							</h3>
							<StatusIcon status={status} />
						</div>
						<p className="text-sm text-muted-foreground">
							{status === "confirmed"
								? "Added to Calendar"
								: status === "failed"
									? "Failed to Add"
									: "Proposed Event"}
						</p>
					</div>
				</div>
			</div>

			<EventBody
				start={event.start?.dateTime}
				end={event.end?.dateTime}
				location={event.location ?? undefined}
				description={event.description ?? undefined}
				attendees={event.attendees ?? undefined}
			/>

			{status === "failed" && error ? (
				<div className="px-4 pb-3 text-sm text-red-500">{error}</div>
			) : null}
		</div>
	);
};
