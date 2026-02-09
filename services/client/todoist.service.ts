import type { TodoWithStatus } from "@/types/todo";

export async function createTodos(payload: {
	todos: TodoWithStatus[];
	messageId: string;
}) {
	const response = await fetch("/api/todos/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.error || "Failed to create todos");
	}

	return result as {
		success: boolean;
		todos: TodoWithStatus[];
		summary: { confirmed: number; failed: number };
	};
}

export function connectTodoist() {
	const clientId = process.env.NEXT_PUBLIC_TODOIST_CLIENT_ID;
	const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
	const redirectUri = `${appUrl}/api/auth/todoist/callback`;

	const state = crypto.randomUUID();

	document.cookie = `todoist_oauth_state=${state}; path=/; max-age=600; SameSite=Lax`;

	const params = new URLSearchParams({
		client_id: clientId!,
		scope: "data:read_write",
		state,
		redirect_uri: redirectUri,
	});

	window.location.href = `https://todoist.com/oauth/authorize?${params.toString()}`;
}

export async function toggleTodo(
	taskId: string,
	messageId: string,
	completed: boolean,
) {
	const response = await fetch(`/api/todos/${taskId}/toggle`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ messageId, completed }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to toggle todo");
	}

	const { data } = await response.json();
	return data as { taskId: string; isNowCompleted: boolean };
}
