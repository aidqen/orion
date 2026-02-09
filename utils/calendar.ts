import {
	endOfWeek,
	format,
	isBefore,
	isWithinInterval,
	parseISO,
	startOfDay,
	startOfWeek,
} from "date-fns";
import type { EventData } from "@/types/event";

export const formatEventDate = (event: EventData) => {
	const dateStr = event.start?.dateTime || event.start?.date;
	if (!dateStr) return "";

	try {
		return format(parseISO(dateStr), "EEE, MMM d");
	} catch {
		return dateStr;
	}
};

export const formatDueDate = (dateStr: string) => {
	try {
		const date = parseISO(dateStr);
		const now = new Date();

		const isThisWeek = isWithinInterval(date, {
			start: startOfWeek(now, { weekStartsOn: 1 }),
			end: endOfWeek(now, { weekStartsOn: 1 }),
		});

		if (isThisWeek) return format(date, "EEEE");

		const isThisYear = date.getFullYear() === now.getFullYear();

		if (isThisYear) return format(date, "d MMM");

		return format(date, "d MMM yyyy");
	} catch {
		return dateStr;
	}
};

export const isOverdue = (dateStr: string) => {
	try {
		return isBefore(parseISO(dateStr), startOfDay(new Date()));
	} catch {
		return false;
	}
};

export const formatEventTime = (event: EventData) => {
	if (event.start?.date && !event.start?.dateTime) return null;

	const startStr = event.start?.dateTime;
	if (!startStr) return null;

	try {
		return format(parseISO(startStr), "h:mm a");
	} catch {
		return null;
	}
};
