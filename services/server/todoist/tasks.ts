// SERVER-ONLY: Thin wrapper around the Todoist SDK

import { TodoistApi } from "@doist/todoist-api-typescript";
import type { TodoData } from "@/types/todo";

export async function fetchTodoistTasks(
	accessToken: string,
	options?: { filter?: string; projectId?: string },
) {
	const api = new TodoistApi(accessToken);

	const { results: tasks } = await api.getTasks({
		...(options?.filter && { filter: options.filter }),
		...(options?.projectId && { projectId: options.projectId }),
	});

	return tasks.map((task) => ({
		id: task.id,
		content: task.content,
		description: task.description,
		priority: task.priority,
		due: task.due,
		projectId: task.projectId,
		labels: task.labels,
		completedAt: task.completedAt,
		url: task.url,
	}));
}

export async function toggleTodoistTask(
	accessToken: string,
	taskId: string,
	completed: boolean,
) {
	const api = new TodoistApi(accessToken);

	try {
		if (completed) {
			await api.closeTask(taskId);
		} else {
			await api.reopenTask(taskId);
		}
	} catch (error) {
		throw new Error(
			`Failed to ${completed ? "complete" : "reopen"} task: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function createTodoistTask(
	accessToken: string,
	todo: TodoData,
): Promise<TodoData> {
	const api = new TodoistApi(accessToken);

	const task = await api.addTask({
		content: todo.content,
		description: todo.description,
		priority: todo.priority,
		dueString: todo.dueString,
		labels: todo.labels,
	});

	return {
		id: task.id,
		content: task.content,
		description: task.description,
		priority: task.priority,
		dueString: todo.dueString,
		labels: task.labels,
		completedAt: null,
	};
}
