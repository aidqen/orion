'use client';

import { useEffect, useMemo, useState } from 'react';
import AuthForm, { Mode } from '@/components/auth/AuthForm';
import ModeSwitch from '@/components/auth/ModeSwitch';

export default function AuthCard({setOpen}: {setOpen?: (open: boolean) => void}) {
  const search = useMemo(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null, []);
  const initialMode = (search?.get('mode') === 'signup' ? 'signup' : 'login') as Mode;
  const [mode, setMode] = useState<Mode>(initialMode);

  // keep the URL in sync when toggling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.replaceState(null, '', url.toString());
  }, [mode]);

  return (
    <div className="w-[360px] rounded-2xl border border-gray-200 dark:border-[#1E222B] bg-white dark:bg-[#14161A] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
      <div className="mx-auto mb-6 h-12 w-12 rounded-xl border border-gray-200 dark:border-[#1E222B] bg-gray-50 dark:bg-[#0E1013]" />
      <h1 className="text-center text-[22px] font-semibold text-gray-900 dark:text-gray-100">
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h1>
      <ModeSwitch mode={mode} onToggle={() => setMode(mode === 'login' ? 'signup' : 'login')} />
      <AuthForm mode={mode} setOpen={setOpen} />
    </div>
  );
}
