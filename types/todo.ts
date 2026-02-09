import type { ItemStatus } from "./chat";

export interface TodoData {
	id?: string;
	content: string;
	description?: string;
	priority?: number;
	dueString?: string;
	labels?: string[];
	projectId?: string;
	completedAt?: string | null;
}

export interface TodoWithStatus {
	status: ItemStatus;
	todo: TodoData;
	error?: string;
}
