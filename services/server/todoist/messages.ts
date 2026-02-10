import type { SupabaseClient } from "@supabase/supabase-js";

export async function updateTaskInMessage(
	supabase: SupabaseClient,
	messageId: string,
	taskId: string,
	isNowCompleted: boolean,
) {
	const { data: message, error: fetchError } = await supabase
		.from("chat_messages")
		.select("parts_json")
		.eq("temp_id", messageId)
		.single();

	if (fetchError) {
		throw new Error(`Failed to fetch message: ${fetchError.message}`);
	}

	if (!message?.parts_json) {
		throw new Error("Message has no parts data");
	}

	const parts = message.parts_json as Record<string, unknown>[];

	const updatedParts = parts.map((part) => {
		if (part.type !== "tool-fetchTodos" || !part.output) return part;

		const output = part.output as { tasks: Record<string, unknown>[] };

		return {
			...part,
			output: {
				...output,
				tasks: output.tasks.map((task) =>
					task.id === taskId
						? {
								...task,
								completedAt: isNowCompleted ? new Date().toISOString() : null,
							}
						: task,
				),
			},
		};
	});

	const { error: updateError } = await supabase
		.from("chat_messages")
		.update({ parts_json: updatedParts })
		.eq("temp_id", messageId);

	if (updateError) {
		throw new Error(`Failed to update message: ${updateError.message}`);
	}
}
