"use client";

import { Calendar } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { EventData } from "@/types/event";
import { formatEventDate, formatEventTime } from "@/utils/calendar";
import { Preview } from "../../Preview/Preview";
import { EventDetailsModal } from "./EventDetailsModal";

interface EventListProps {
	data: {
		isVisible: boolean;
		events: EventData[];
	};
}

export const EventList: React.FC<EventListProps> = ({ data }) => {
	const { isVisible, events } = data || {};
	const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

	if (!isVisible || !events || events.length === 0) return null;

	return (
		<>
			<div className="flex flex-col w-full max-w-lg min-w-[250px] sm:min-w-[400px] border rounded-lg overflow-hidden my-2">
				{events.map((event, index) => {
					const dateStr = formatEventDate(event);
					const timeStr = formatEventTime(event);

					return (
						<Preview.Container key={event.id || index}>
							<Preview.Group>
								<Preview.Icon icon={Calendar} />
								<Preview.TextGroup>
									<Preview.Title>{event.summary || "No Title"}</Preview.Title>
									<Preview.Description>
										{dateStr}
										{timeStr && ` • ${timeStr}`}
									</Preview.Description>
								</Preview.TextGroup>
							</Preview.Group>
							<Preview.Button onClick={() => setSelectedEvent(event)}>
								See Details
							</Preview.Button>
						</Preview.Container>
					);
				})}
			</div>

			{selectedEvent && (
				<EventDetailsModal
					event={selectedEvent}
					isOpen={!!selectedEvent}
					onClose={() => setSelectedEvent(null)}
				/>
			)}
		</>
	);
};
