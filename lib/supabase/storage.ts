import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "images"; // Create this bucket in Supabase

export async function uploadChatImage(
	file: File,
	chatId: string,
	userId: string,
): Promise<string> {
	const supabase = createClient();

	const fileExt = file.name.split(".").pop();
	const fileName = `${userId}/${chatId}/${Date.now()}.${fileExt}`;

	const { data, error } = await supabase.storage
		.from(BUCKET_NAME)
		.upload(fileName, file, {
			cacheControl: "3600",
			upsert: false,
		});

	if (error) throw error;

	// Get public URL
	const {
		data: { publicUrl },
	} = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

	return publicUrl;
}

export async function uploadMultipleImages(
	files: { file: File; mediaType: string }[],
	chatId: string,
	userId: string,
): Promise<{ url: string; mediaType: string }[]> {
	const uploads = files.map(({ file, mediaType }) =>
		uploadChatImage(file, chatId, userId).then((url) => ({ url, mediaType })),
	);
	return Promise.all(uploads);
}
