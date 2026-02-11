"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { ConnectTodoistButton } from "@/components/Auth/ConnectTodoistButton";
import { toggleTodo } from "@/services/client/todoist";
import { TodoItem } from "./TodoItem";

interface TodoTask {
	id: string;
	content: string;
	description: string;
	priority: number;
	due: { date: string; string: string; datetime?: string | null } | null;
	labels: string[];
	completedAt: string | null;
}

interface TodoListProps {
	data: {
		tasks?: TodoTask[];
		error?: { code: string };
	};
	messageId: string;
}

export const TodoList: React.FC<TodoListProps> = ({ data, messageId }) => {
	const { tasks: initialTasks, error } = data || {};

	if (error?.code === "todoist_not_connected") {
		return (
				<ConnectTodoistButton className="w-fit"/>
		);
	}

	const [tasks, setTasks] = useState(initialTasks || []);
	const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

	if (!tasks || tasks.length === 0) return null;

	const updateTaskStatus = (taskId: string, completed: boolean) => {
		setTasks((prev) =>
			(prev || []).map((t) =>
				t.id === taskId
					? {
							...t,
							completedAt: completed ? new Date().toISOString() : null,
						}
					: t,
			),
		);
	};

	const handleToggle = async (taskId: string, currentlyCompleted: boolean) => {
		const shouldComplete = !currentlyCompleted;

		setTogglingIds((prev) => new Set(prev).add(taskId));
		updateTaskStatus(taskId, shouldComplete);

		try {
			await toggleTodo(taskId, messageId, shouldComplete);
		} catch {
			updateTaskStatus(taskId, currentlyCompleted);
			toast.error("Failed to update task");
		} finally {
			setTogglingIds((prev) => {
				const next = new Set(prev);
				next.delete(taskId);
				return next;
			});
		}
	};

	return (
		<div className="flex flex-col w-full max-w-lg min-w-[250px] sm:min-w-[400px] border rounded-lg overflow-hidden my-2">
			{tasks.map((task) => (
				<TodoItem
					key={task.id}
					task={task}
					isToggling={togglingIds.has(task.id)}
					onToggle={handleToggle}
				/>
			))}
		</div>
	);
};
