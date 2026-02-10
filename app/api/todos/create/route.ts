import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/infra/supabase/server";
import { updateToolOutput } from "@/services/server/chat/chat";
import { fetchUserTokens } from "@/services/server/integrations";
import { createTodoistTask } from "@/services/server/todoist/tasks";
import type { TodoData, TodoWithStatus } from "@/types/todo";

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
		const { todos, messageId } = body;

		if (!Array.isArray(todos) || !messageId) {
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 },
			);
		}

		const { access_token: accessToken } = await fetchUserTokens(
			user.id,
			"todoist",
		);

		const toProcess = todos
			.map((item, index) => ({ item, index }))
			.filter(({ item }) => item.status !== "confirmed");

		const results = await Promise.allSettled(
			toProcess.map(({ item }) => createTodoistTask(accessToken, item.todo)),
		);

		const updatedTodos: TodoWithStatus[] = todos.map((item, index) => {
			if (item.status === "confirmed") {
				return item;
			}

			const processIndex = toProcess.findIndex((p) => p.index === index);
			const result = results[processIndex];

			if (result.status === "fulfilled") {
				return {
					status: "confirmed" as const,
					todo: result.value as TodoData,
				};
			}

			return {
				status: "failed" as const,
				todo: item.todo,
				error: result.reason?.message || "Unknown error",
			};
		});

		await updateToolOutput(messageId, "todos", updatedTodos);

		const confirmedCount = updatedTodos.filter(
			(t) => t.status === "confirmed",
		).length;
		const failedCount = updatedTodos.filter(
			(t) => t.status === "failed",
		).length;

		return NextResponse.json({
			success: failedCount === 0,
			todos: updatedTodos,
			summary: { confirmed: confirmedCount, failed: failedCount },
		});
	} catch (error: unknown) {
		console.error("Error creating todos:", error);

		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
