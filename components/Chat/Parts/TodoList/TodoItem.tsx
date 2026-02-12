"use client";

import { Flag } from "lucide-react";
import type React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDueDate, isOverdue } from "@/utils/calendar";
import { Preview } from "../../Preview/Preview";

interface TodoTask {
	id: string;
	content: string;
	description: string;
	priority: number;
	due: { date: string; string: string; datetime?: string | null } | null;
	labels: string[];
	completedAt: string | null;
}

interface TodoItemProps {
	task: TodoTask;
	isToggling: boolean;
	onToggle?: (taskId: string, currentlyCompleted: boolean) => void;
}

const getPriorityLabel = (priority: number) => {
	switch (priority) {
		case 4:
			return "urgent";
		case 3:
			return "high";
		case 2:
			return "medium";
		case 1:
			return "low";
		default:
			return null;
	}
};

export const TodoItem: React.FC<TodoItemProps> = ({
	task,
	isToggling,
	onToggle,
}) => {
	const priorityLabel = getPriorityLabel(task.priority);
	const isCompleted = !!task.completedAt;

	const handleToggle = () => {
		if (onToggle) {
			onToggle(task.id, isCompleted);
		}
	};

	const subtitle = [priorityLabel, ...task.labels].filter(Boolean).join(" • ");

	return (
		<Preview.Container>
			<Preview.Group>
				<Checkbox
					checked={isCompleted}
					disabled={isToggling}
					onCheckedChange={handleToggle}
					className="bg-background dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
				/>
				<Preview.TextGroup>
					<Preview.Title
						className={isCompleted ? "line-through text-muted-foreground" : ""}
					>
						{task.content}
					</Preview.Title>
					{subtitle ? (
						<Preview.Description className="capitalize">
							{subtitle}
						</Preview.Description>
					) : null}
				</Preview.TextGroup>
			</Preview.Group>
			{task.due ? (
				<span
					className={`text-xs flex flex-row items-center gap-0.5 shrink-0 ${
						isOverdue(task.due.date)
							? "text-red-500 dark:text-red-400"
							: "text-stone-300/80"
					}`}
				>
					{formatDueDate(task.due.date)}
					<Flag size={12} />
				</span>
			) : null}
		</Preview.Container>
	);
};
