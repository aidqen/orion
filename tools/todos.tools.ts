import { jsonSchema, tool } from "ai";
import { fetchUserTokens } from "@/services/server/integrations";
import { fetchTodoistTasks } from "@/services/server/todoist/tasks";

export function createTodoTools(userId: string) {
	return {
		fetchTodos: fetchTodosTool(userId),
		suggestNewTodos: suggestNewTodosTool(),
	};
}

export function fetchTodosTool(userId: string) {
	return tool({
		description:
			"Fetch the user's tasks from Todoist. Use this to show current todos, check what's on their plate, or reference existing tasks.",
		inputSchema: jsonSchema<{
			filter?: string;
			projectId?: string;
		}>({
			type: "object",
			properties: {
				filter: {
					type: "string",
					description:
						"Optional Todoist filter query (e.g., 'today', 'overdue', 'priority 1')",
				},
				projectId: {
					type: "string",
					description: "Optional project ID to filter tasks by project",
				},
			},
		}),
		execute: async ({
			filter,
			projectId,
		}: {
			filter?: string;
			projectId?: string;
		}) => {
			const { access_token } = await fetchUserTokens(userId, "todoist");
			const tasks = await fetchTodoistTasks(access_token, {
				filter,
				projectId,
			});

			return { tasks };
		},
	});
}

interface SuggestedTodo {
	content: string;
	description?: string;
	priority?: number;
	dueString?: string;
	labels?: string[];
}

export function suggestNewTodosTool() {
	return tool({
		description:
			"Suggest new todos for the user. Returns formatted todos for preview — does NOT submit them to Todoist yet. The user can review and confirm before adding.",
		inputSchema: jsonSchema<{ todos: SuggestedTodo[] }>({
			type: "object",
			properties: {
				todos: {
					type: "array",
					description: "List of suggested todos to preview",
					items: {
						type: "object",
						properties: {
							content: {
								type: "string",
								description: "The task title/content",
							},
							description: {
								type: "string",
								description: "Optional detailed description",
							},
							priority: {
								type: "number",
								description: "Priority level: 1 (normal) to 4 (urgent)",
							},
							dueString: {
								type: "string",
								description:
									"Natural language due date (e.g., 'tomorrow at 3 pm', 'next Monday', 'Jan 15')",
							},
							labels: {
								type: "array",
								description: "Optional labels/tags",
								items: { type: "string" },
							},
						},
						required: ["content"],
					},
					minItems: 1,
				},
			},
			required: ["todos"],
		}),
		execute: async ({ todos }: { todos: SuggestedTodo[] }) => {
			const suggestedTodos = todos.map((todo) => ({
				status: "pending_confirmation" as const,
				todo: {
					content: todo.content,
					description: todo.description ?? "",
					priority: todo.priority ?? 1,
					dueString: todo.dueString,
					labels: todo.labels ?? [],
				},
			}));

			return { todos: suggestedTodos };
		},
	});
}
