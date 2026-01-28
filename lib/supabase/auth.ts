import { createClient } from '@/lib/supabase/client';

// Google Calendar scopes for OAuth
const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/docs',
].join(' ');

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithPassword(email: string, password: string, name?: string) {
  // Supabase prevents duplicate users. It returns error: "User already registered"
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

function redirectToSaveToken() {
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const redirectTo = redirectToSaveToken();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      scopes: GOOGLE_SCOPES,
      queryParams: { 
        access_type: 'offline', 
        prompt: 'consent', 
        include_granted_scopes: 'true' 
      },
    }
  });
  if (error) throw error;
}

export async function linkGoogleIdentity() {
  const supabase = createClient();
  const redirectTo = redirectToSaveToken();

  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'google',
    options: {
      redirectTo,
      scopes: GOOGLE_SCOPES,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function normalizeAuthError(err: unknown): string {
  const msg = (err as any)?.message?.toString?.() ?? 'Authentication error';
  if (msg.toLowerCase().includes('already registered')) {
    return 'Email already registered. Try logging in or reset your password.';
  }
  return msg;
}


