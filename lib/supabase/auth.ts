import { createClient } from '@/lib/supabase/client';

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithPassword(email: string, password: string, name?: string) {
  // Supabase prevents duplicate users. It returns error: "User already registered"
  const supabase = createClient();
  const timezone = typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : undefined;
  console.log("🚀 ~ signUpWithPassword ~ timezone:", timezone)

  const metadata: Record<string, string | undefined> = {
    name,
    timezone,
  };
  console.log("🚀 ~ signUpWithPassword ~ metadata:", metadata)

  // const { data, error } = await supabase.auth.signUp({
  //   email,
  //   password,
  //   options: {
  //     emailRedirectTo: typeof window !== 'undefined'
  //       ? `${window.location.origin}${process.env.NEXT_PUBLIC_AUTH_REDIRECT ?? '/experimental/home'}`
  //       : undefined,
  //     data: metadata,
  //   }
  // });
  // if (error) throw error;
  // return data;
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}${process.env.NEXT_PUBLIC_AUTH_REDIRECT ?? '/'}`
    : undefined;

  // Request required Google scopes: basic profile + Calendar list + Calendar events
  const scopes = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ].join(' ');

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      scopes,
      // Ask for consent to ensure refresh token and extended scopes
      queryParams: { access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true' },
    }
  });
  if (error) throw error;
}

export function normalizeAuthError(err: unknown): string {
  const msg = (err as any)?.message?.toString?.() ?? 'Authentication error';
  if (msg.toLowerCase().includes('already registered')) {
    return 'Email already registered. Try logging in or reset your password.';
  }
  return msg;
}


