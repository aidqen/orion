import type React from "react";
import type { EventData } from "@/types/event";
import { EventPreview } from "./EventPreview";

interface EventListProps {
	data: {
		isVisible: boolean;
		events: EventData[];
	};
}

export const EventList: React.FC<EventListProps> = ({ data }) => {
	const { isVisible, events } = data || {};

	if (!isVisible || !events || events.length === 0) return null;

	return (
		<div className="flex flex-col w-full min-w-[250px] sm:min-w-[400px] border rounded-lg overflow-hidden my-2">
			{events.map((event, index) => (
				<EventPreview key={event.id || index} event={event} />
			))}
		</div>
	);
};
