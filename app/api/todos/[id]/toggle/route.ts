import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/services/server/google/tokens";
import { updateTaskInMessage } from "@/services/server/todoist/messages";
import { toggleTodoistTask } from "@/services/server/todoist/tasks";
import { getTodoistAccessToken } from "@/services/server/todoist/tokens";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const supabase = await getSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id: taskId } = await params;
		const { messageId, completed } = await request.json();

		if (!taskId) {
			return NextResponse.json(
				{ error: "Task ID is required" },
				{ status: 400 },
			);
		}

		if (!messageId) {
			return NextResponse.json(
				{ error: "Message ID is required" },
				{ status: 400 },
			);
		}

		const accessToken = await getTodoistAccessToken(user.id);
		await toggleTodoistTask(accessToken, taskId, completed);

		await updateTaskInMessage(supabase, messageId, taskId, completed);

		return NextResponse.json({
			success: true,
			data: { taskId, isNowCompleted: completed },
		});
	} catch (error) {
		console.error("Toggle todo error:", error);

		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 },
		);
	}
}
