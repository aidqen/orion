import { format, parseISO } from "date-fns";
import {
	AlignLeft,
	Bell,
	Calendar as CalendarIcon,
	MapPin,
} from "lucide-react";
import type React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { EventData } from "@/types/event";

interface EventDetailsModalProps {
	event: EventData;
	isOpen: boolean;
	onClose: () => void;
}

const DetailRow = ({
	icon: Icon,
	children,
	isMuted = false,
}: {
	icon: React.ElementType;
	children: React.ReactNode;
	isMuted?: boolean;
}) => (
	<div className="flex gap-3 items-start text-sm">
		<Icon className="size-4 text-muted-foreground shrink-0 mt-1" />
		<div
			className={`text-base whitespace-pre-wrap ${isMuted ? "text-muted-foreground" : "text-foreground"}`}
		>
			{children}
		</div>
	</div>
);

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
	event,
	isOpen,
	onClose,
}) => {
	const formatDate = () => {
		const startStr = event.start?.dateTime || event.start?.date;
		const endStr = event.end?.dateTime || event.end?.date;

		if (!startStr) return "";

		try {
			const startDate = parseISO(startStr);
			const endDate = endStr ? parseISO(endStr) : null;

			const dateText = format(startDate, "EEEE, MMMM d");
			const timeText = event.start?.dateTime
				? `${format(startDate, "h:mm a")} - ${endDate ? format(endDate, "h:mm a") : ""}`
				: "";

			return (
				<div className="flex flex-col">
					<span>{dateText}</span>
					{timeText ? (
						<span className="text-sm text-muted-foreground">{timeText}</span>
					) : null}
				</div>
			);
		} catch (_error: unknown) {
			return startStr;
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[480px] max-w-[95%] p-0 gap-0 overflow-hidden bg-card border-none shadow-2xl rounded-xl">
				{/* Header Actions Toolbar */}

				<div className="grid gap-5 p-6">
					{/* Title */}
					<div className="flex gap-4">
						<div className="w-5 h-5 mt-1 shrink-0 flex items-center justify-center">
							<div className="w-3 h-3 rounded-sm bg-blue-500" />
						</div>
						<div>
							<DialogTitle className="text-xl font-normal leading-tight">
								{event.summary || "(No Title)"}
							</DialogTitle>
							<div className="mt-1 text-sm">{formatDate()}</div>
						</div>
					</div>

					{/* Location */}
					{event.location ? (
						<DetailRow icon={MapPin}>{event.location}</DetailRow>
					) : null}

					{/* Description */}
					{event.description ? (
						<DetailRow icon={AlignLeft}>{event.description}</DetailRow>
					) : null}

					{/* Notification (Mocked) */}
					<DetailRow icon={Bell} isMuted>
						30 minutes before
					</DetailRow>

					{/* Calendar (Mocked) */}
					<DetailRow icon={CalendarIcon} isMuted>
						user@example.com
					</DetailRow>
				</div>
			</DialogContent>
		</Dialog>
	);
};
