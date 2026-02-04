// app/api/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const cookieStore = cookies()
  
  if (code) {
    const supabase = await createClient(cookieStore);
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.provider_token) {
      await supabase.from('user_google_tokens').upsert({
        user_id: session.user.id,
        access_token: session.provider_token,
        refresh_token: session.provider_refresh_token,
        updated_at: new Date().toISOString(),
      });
    }
  }

  let returnUrl = requestUrl.searchParams.get('returnUrl') || '/';

  if (!returnUrl.startsWith('/') || returnUrl.includes('://')) {
    returnUrl = '/';
  }

  return NextResponse.redirect(new URL(returnUrl, requestUrl.origin));
}