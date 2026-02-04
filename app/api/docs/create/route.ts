import { GaxiosError } from "gaxios";
import { createGoogleDoc } from "@/lib/docs/docs";
import { getSupabaseServerClient } from "@/lib/google-token";

export async function POST(req: Request) {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const body = await req.json();
		const { title, content } = body as { title: string; content: string };

		if (!title) {
			return new Response(JSON.stringify({ error: "Title is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const result = await createGoogleDoc(user.id, title, content || "");

		return new Response(
			JSON.stringify({
				success: true,
				documentId: result.documentId,
				url: result.url,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error creating Google Doc:", error);

		if (error instanceof GaxiosError) {
			return new Response(
				JSON.stringify({
					error: error.message,
					code: error.code,
					status: error.status,
				}),
				{
					status: error.status || 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		return new Response(
			JSON.stringify({
				error:
					error instanceof Error
						? error.message
						: "Failed to create Google Doc",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
