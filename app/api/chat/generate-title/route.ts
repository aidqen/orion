import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/google-token";
import {
	generateChatTitle,
	updateChatTitle,
} from "@/services/server/chat.service";

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
		console.log("🚀 ~ POST ~ firstMessage:", firstMessage);
		console.log("🚀 ~ POST ~ chatId:", chatId);

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
	} catch (error) {
		console.error("Error generating chat title:", error);
		return NextResponse.json(
			{ error: "Failed to generate title" },
			{ status: 500 },
		);
	}
}
