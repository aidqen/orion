"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import ErrorBanner from "@/components/ui/ErrorBanner";
import OAuthButtons from "@/components/OAuthButtons";
import {
  signInWithPassword,
  signUpWithPassword,
  normalizeAuthError,
} from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export type Mode = "login" | "signup";

export default function AuthForm({
  mode,
  setOpen,
}: {
  mode: Mode;
  setOpen?: (open: boolean) => void;
}) {
  const router = useRouter();
  const TextInput = Input as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (mode === "signup") {
      if (!name.trim()) return setErr("Display name is required.");
      if (password.length < 8)
        return setErr("Password must be at least 8 characters.");
      if (password !== confirm) return setErr("Passwords do not match.");
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithPassword(email, password);
        if (setOpen) setOpen(false);
        // router.push('/experimental/home');
      } else {
        await signUpWithPassword(email, password, name);
        if (setOpen) setOpen(false);
        // router.push('/experimental/home');
      }
    } catch (e) {
      setErr(normalizeAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {err && <ErrorBanner message={err} className="mt-4" />}

      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === "signup" && (
          <label className="block">
            <span className="sr-only">Display name</span>
            <TextInput
              type="text"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              placeholder="Display name"
              autoComplete="name"
              className={`h-12 bg-gray-50 dark:bg-[#0E1013] border ${
                err?.toLowerCase().includes("name")
                  ? "border-red-500 dark:border-[#7F1D1D]"
                  : "border-gray-200 dark:border-[#262A33]"
              } text-gray-900 dark:text-gray-100`}
            />
          </label>
        )}
        <label className="block">
          <span className="sr-only">Email address</span>
          <TextInput
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="Email Address"
            autoComplete="email"
            className={`h-12 bg-gray-50 dark:bg-[#0E1013] border ${
              err?.toLowerCase().includes("email")
                ? "border-red-500 dark:border-[#7F1D1D]"
                : "border-gray-200 dark:border-[#262A33]"
            } text-gray-900 dark:text-gray-100`}
          />
        </label>
        <label className="block">
          <span className="sr-only">Password</span>
          <TextInput
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            className={`h-12 bg-gray-50 dark:bg-[#0E1013] border ${
              err?.toLowerCase().includes("password")
                ? "border-red-500 dark:border-[#7F1D1D]"
                : "border-gray-200 dark:border-[#262A33]"
            } text-gray-900 dark:text-gray-100`}
          />
        </label>
        {mode === "signup" && (
          <label className="block">
            <span className="sr-only">Confirm password</span>
            <TextInput
              type="password"
              value={confirm}
              onChange={(e: any) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              className={`h-12 bg-gray-50 dark:bg-[#0E1013] border ${
                err?.toLowerCase().includes("match")
                  ? "border-red-500 dark:border-[#7F1D1D]"
                  : "border-gray-200 dark:border-[#262A33]"
              } text-gray-900 dark:text-gray-100`}
            />
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer mt-1 h-11 w-full rounded-xl bg-[#1E6BFF] font-semibold text-white hover:bg-[#2D7DFF] disabled:opacity-70"
        >
          {loading
            ? "Please wait…"
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="h-px flex-1 bg-gray-200 dark:bg-[#2A2F3A]" />
        <span>OR</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-[#2A2F3A]" />
      </div>

      <OAuthButtons />
    </>
  );
}
