// SERVER-ONLY: Supabase server client factory (uses cookies from next/headers)

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
	return createServerClient(supabaseUrl!, supabaseKey!, {
		cookies: {
			async getAll() {
				return (await cookieStore).getAll();
			},
			async setAll(cookiesToSet) {
				try {
					const cookies = await cookieStore;
					cookiesToSet.forEach(({ name, value, options }) =>
						cookies.set(name, value, options),
					);
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	});
};

export async function getSupabaseServerClient() {
	const cookieStore = cookies();
	return createClient(cookieStore);
}