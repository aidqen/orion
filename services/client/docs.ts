export type DocsApiError = Error & {
	code?: string;
	status?: number;
};

export function isDocsApiError(error: unknown): error is DocsApiError {
	return error instanceof Error && "code" in error;
}

export async function createDocumentFromArtifact(payload: {
	title: string;
	content: string;
}) {
	const response = await fetch("/api/docs/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		const error = new Error(
			result.error || "Failed to create Google Doc",
		) as DocsApiError;
		error.code = result.code;
		error.status = result.status;
		throw error;
	}

	return result as { success: boolean; documentId: string; url: string };
}
