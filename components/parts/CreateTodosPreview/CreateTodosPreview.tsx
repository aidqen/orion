"use client";

import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useRef, useState } from "react";
import { ConnectTodoistButton } from "@/components/Todoist/ConnectTodoistButton";
import { useUser } from "@/contexts/UserContext";
import { createTodos } from "@/services/client/todoist.service";
import type { TodoWithStatus } from "@/types/todo";
import {
	type ButtonState,
	SubmitItemsButton,
} from "../CreateEventsPreview/SubmitItemsButton";
import { TodoItem } from "../TodoList/TodoItem";

interface CreateTodosPreviewProps {
	data: {
		todos: TodoWithStatus[];
	};
	messageId: string;
}

export const CreateTodosPreview: React.FC<CreateTodosPreviewProps> = ({
	data,
	messageId,
}) => {
	const { isTodoistConnected } = useUser();
	const [todos, setTodos] = useState<TodoWithStatus[]>(data.todos);
	const isTodosSubmitted = useRef(false);

	const { mutate, isPending } = useMutation({
		mutationFn: createTodos,
		onSuccess: (result) => {
			setTodos(result.todos);
			isTodosSubmitted.current = true;
		},
	});

	if (!todos?.length || todos.length === 0) return null;

	const counts = todos.reduce(
		(acc, t) => {
			if (t.status === "pending_confirmation") acc.pending++;
			else if (t.status === "confirmed") acc.confirmed++;
			else if (t.status === "failed") acc.failed++;
			return acc;
		},
		{ pending: 0, confirmed: 0, failed: 0 },
	);

	const handleSubmit = () => mutate({ todos, messageId });

	const getButtonState = (): ButtonState => {
		if (isPending) return "pending";
		if (counts.confirmed === todos.length) return "success";
		if (counts.failed > 0 && counts.pending === 0) return "error";
		return "idle";
	};

	const labels = {
		idle: todos.length === 1 ? "Add to Todoist" : "Add Tasks to Todoist",
		pending: "Adding...",
		success: "Added",
		error: `Retry ${counts.failed} failed task${counts.failed > 1 ? "s" : ""}`,
	};

	const showButton =
		counts.pending > 0 ||
		counts.confirmed === todos.length ||
		counts.failed > 0;

	return (
		<div className="flex flex-col w-full max-w-lg min-w-[250px] gap-2 sm:min-w-[400px]">
			<div className="border rounded-lg overflow-hidden">
				{todos.map((item, index) => (
					<TodoItem
						key={index}
						task={{
							id: item.todo.id ?? `pending-${index}`,
							content: item.todo.content,
							description: item.todo.description ?? "",
							priority: item.todo.priority ?? 1,
							due: item.todo.dueString
								? { date: "", string: item.todo.dueString }
								: null,
							labels: item.todo.labels ?? [],
							completedAt: null,
						}}
						isToggling={false}
					/>
				))}
			</div>

			{showButton && (
				<SubmitItemsButton
					state={getButtonState()}
					onClick={handleSubmit}
					labels={labels}
					renderOverride={
						!isTodoistConnected ? <ConnectTodoistButton /> : undefined
					}
				/>
			)}
		</div>
	);
};
