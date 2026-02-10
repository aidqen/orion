import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/infra/supabase/server";
import {
	generateChatTitle,
	updateChatTitle,
} from "@/services/server/chat/chat";

export async function POST(request: Request) {
	try {
		const supabase = await getSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { chatId, firstMessage } = await request.json();

		if (!chatId || !firstMessage) {
			return NextResponse.json(
				{ error: "Missing chatId or firstMessage" },
				{ status: 400 },
			);
		}

		// Generate title using AI
		const generatedTitle = await generateChatTitle(firstMessage);

		// Update database
		await updateChatTitle(chatId, generatedTitle);

		return NextResponse.json({ title: generatedTitle });
	} catch (_error) {
		return NextResponse.json(
			{ error: "Failed to generate title" },
			{ status: 500 },
		);
	}
}
