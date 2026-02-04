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
		throw new Error(result.error || "Failed to create Google Doc");
	}

	return result as { success: boolean; documentId: string; url: string };
}
