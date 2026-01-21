"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Infer User type from Supabase client
type SupabaseClient = ReturnType<typeof createClient>;
type SessionResponse = Awaited<ReturnType<SupabaseClient["auth"]["getSession"]>>["data"]["session"];
type User = NonNullable<SessionResponse>["user"];

interface UseUserReturn {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  error: Error | null;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      setError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      // User state will be updated via onAuthStateChange listener
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    setError(null);

    try {
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

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          scopes,
          // Ask for consent to ensure refresh token and extended scopes
          queryParams: { access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true' },
        }
      });

      if (oauthError) throw oauthError;
      // User will be redirected, so state will update on return
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      // User state will be updated via onAuthStateChange listener
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const authenticated = user !== null;

  return { user, authenticated, loading, error, signInWithPassword, signInWithGoogle, signOut };
}

