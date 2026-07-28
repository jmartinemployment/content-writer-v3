'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

export function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, handleOAuthCallback } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      handleOAuthCallback(code, state).catch(err => {
        setError(err.message || 'Authentication failed');
      });
      return;
    }

    if (user) {
      router.push('/dashboard');
    }
  }, [searchParams, user, router, handleOAuthCallback]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p className="font-medium mb-2">Authentication Error</p>
              <p>{error}</p>
            </div>
            <a
              href="/login"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
