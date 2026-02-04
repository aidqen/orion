"use client";

import { useState } from "react";
import { signInWithGoogle, normalizeAuthError } from "@/lib/supabase/auth";
import ErrorBanner from "@/components/ui/ErrorBanner";
import Image from "next/image";

interface GoogleButtonProps {
  text?: string;
  onClick?: () => void;
}

export default function GoogleButton({ text = "Continue with Google", onClick }: GoogleButtonProps) {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onGoogle = async () => {
    if (onClick) {
      onClick();
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      // redirects away
    } catch (e) {
      setErr(normalizeAuthError(e));
      setLoading(false);
    }
  };

  return (
    <>
      {err && <ErrorBanner message={err} className="mt-3" />}
      <button
        type="button"
        onClick={onGoogle}
        disabled={loading}
        className="cursor-pointer flex flex-row items-center gap-2 justify-center h-11 w-full rounded-lg border border-gray-200 dark:border-[#2A2F3A] bg-gray-50 dark:bg-[#1B1F27] text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#20242E] disabled:opacity-70"
      >
        <Image
          src="/google-icon-logo-svgrepo-com.svg"
          alt="Google"
          className="h-5 w-5"
          width={20}
          height={20}
        />
        {text}
      </button>
    </>
  );
}

