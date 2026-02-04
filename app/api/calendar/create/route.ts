import { NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/calendar/create-events";
import { getSupabaseServerClient } from "@/lib/google-token";
import { updateEventsStatuses } from "@/services/server/chat.service";
import type { EventData, EventWithStatus } from "@/types/event";

export async function POST(req: Request) {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await req.json();
		const { events, messageId } = body;

		// Validate required fields
		if (!Array.isArray(events) || !messageId) {
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 },
			);
		}

		const toProcess = events
			.map((item, index) => ({ item, index }))
			.filter(({ item }) => item.status !== "confirmed");

		const results = await Promise.allSettled(
			toProcess.map(({ item }) => createCalendarEvent(user.id, item.event)),
		);

		const updatedEvents: EventWithStatus[] = events.map((item, index) => {
			if (item.status === "confirmed") {
				return item;
			}

			const processIndex = toProcess.findIndex((p) => p.index === index);
			const result = results[processIndex];

			if (result.status === "fulfilled") {
				return {
					status: "confirmed" as const,
					event: result.value as EventData,
				};
			}

			return {
				status: "failed" as const,
				event: item.event,
				error: result.reason?.message || "Unknown error",
			};
		});

		await updateEventsStatuses(messageId, updatedEvents);

		const confirmedCount = updatedEvents.filter(
			(e) => e.status === "confirmed",
		).length;
		const failedCount = updatedEvents.filter(
			(e) => e.status === "failed",
		).length;

		return NextResponse.json({
			success: failedCount === 0,
			events: updatedEvents,
			summary: { confirmed: confirmedCount, failed: failedCount },
		});
	} catch (error: unknown) {
		console.error("Error creating calendar events:", error);

		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
