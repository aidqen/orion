// SERVER-ONLY: Uses Google Docs API with access tokens

import { docs } from "@googleapis/docs";
import { getGoogleAccessToken } from "./tokens";

export async function createGoogleDoc(
	userId: string,
	title: string,
	content: string,
) {
	const accessToken = await getGoogleAccessToken(userId);

	if (!accessToken) {
		throw new Error("No Google access token");
	}

	const client = docs({ version: "v1" });

	// Create document - pass access_token directly
	const createRes = await client.documents.create({
		access_token: accessToken,
		requestBody: { title },
	});

	const documentId = createRes.data.documentId!;

	// Insert content
	if (content) {
		await client.documents.batchUpdate({
			access_token: accessToken,
			documentId,
			requestBody: {
				requests: [
					{
						insertText: {
							location: { index: 1 },
							text: content,
						},
					},
				],
			},
		});
	}

	return {
		documentId,
		url: `https://docs.google.com/document/d/${documentId}/edit`,
	};
}
