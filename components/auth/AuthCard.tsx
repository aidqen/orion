'use client';

import { useEffect, useState } from 'react';
import AuthForm, { Mode } from '@/components/auth/AuthForm';
import ModeSwitch from '@/components/auth/ModeSwitch';
import { useAuthPopupStore } from '@/store/useAuthPopupStore';

function getInitialMode(): Mode {
  if (typeof window === 'undefined') return 'login';

  const params = new URLSearchParams(window.location.search);
  return params.get('mode') === 'signup' ? 'signup' : 'login';
}

export default function AuthCard() {
  const [mode, setMode] = useState<Mode>(getInitialMode);
  const setOpen = useAuthPopupStore(state => state.setOpen);

  useEffect(() => {
    syncModeToURL();
  }, [mode]);

  function syncModeToURL() {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.replaceState(null, '', url.toString());
  }

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
