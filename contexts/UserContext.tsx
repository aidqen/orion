"use client";

import { createContext, useContext, useCallback, useEffect, useState, ReactNode, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import * as auth from "@/lib/supabase/auth";

// Infer User type from Supabase client
type SupabaseClient = ReturnType<typeof createClient>;
type SessionResponse = Awaited<ReturnType<SupabaseClient["auth"]["getSession"]>>["data"]["session"];
type User = NonNullable<SessionResponse>["user"];

interface UserContextType {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  error: Error | null;
  isGoogleConnected: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isGoogleConnected = useMemo(() => 
    user?.identities?.some(i => i.provider === 'google') ?? false,
    [user]
  )

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

    // Listen for auth state changes (SINGLE listener for entire app)
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

  const handleSignInWithPassword = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await auth.signInWithPassword(email, password);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignInWithGoogle = useCallback(async () => {
    setError(null);

    try {
      await auth.signInWithGoogle();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const authenticated = user !== null;

  return (
    <UserContext.Provider
      value={{
        user,
        authenticated,
        loading,
        error,
        isGoogleConnected,
        signInWithPassword: handleSignInWithPassword,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

