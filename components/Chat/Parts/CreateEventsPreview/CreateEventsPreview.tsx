"use client";

import { useMutation } from "@tanstack/react-query";
import type React from "react";
import GoogleButton from "@/components/Auth/GoogleButton";
import { useUser } from "@/contexts/UserContext";
import { createCalendarEvents } from "@/services/client/calendar";
import type { EventWithStatus } from "@/types/event";
import { EventCard } from "./EventCard";
import { type ButtonState, SubmitItemsButton } from "./SubmitItemsButton";

interface CreateEventsPreviewProps {
	data: {
		events: EventWithStatus[];
		timezone: string;
	};
	messageId: string;
}

export const CreateEventsPreview: React.FC<CreateEventsPreviewProps> = ({
	data,
	messageId,
}) => {
	const { isGoogleConnected } = useUser();
	const {
		mutate,
		isPending,
		data: result,
	} = useMutation({
		mutationFn: createCalendarEvents,
	});

	if (!data?.events?.length) return null;

	const { timezone } = data;

	const events = result?.events ?? data.events;

	const counts = events.reduce(
		(acc, e) => {
			if (e.status === "pending_confirmation") acc.pending++;
			else if (e.status === "confirmed") acc.confirmed++;
			else if (e.status === "failed") acc.failed++;
			return acc;
		},
		{ pending: 0, confirmed: 0, failed: 0 },
	);

	const handleSubmit = () => mutate({ events, timezone, messageId });

	const getButtonState = (): ButtonState => {
		if (isPending) return "pending";
		if (counts.confirmed === events.length) return "success";
		if (counts.failed > 0 && counts.pending === 0) return "error";
		return "idle";
	};

	const labels = {
		idle: "Add to Calendar",
		pending: "Adding...",
		success: "Added",
		error: `Retry ${counts.failed} failed event${counts.failed > 1 ? "s" : ""}`,
	};

	const showButton =
		counts.pending > 0 ||
		counts.confirmed === events.length ||
		counts.failed > 0;

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

			{showButton && (
				<SubmitItemsButton
					state={getButtonState()}
					onClick={handleSubmit}
					labels={labels}
					renderOverride={
						!isGoogleConnected ? (
							<GoogleButton text="Connect Google Calendar" />
						) : undefined
					}
				/>
			)}
		</div>
	);
};
