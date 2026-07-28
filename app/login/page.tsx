'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async () => {
    const oauthUrl = process.env.NEXT_PUBLIC_GEEK_OAUTH_URL || 'https://auth.geekatyourspot.com';
    const clientId = 'content-writer-v3';
    const redirectUri = `${window.location.origin}/auth/callback`;

    const { createPkceChallenge, persistPkceSession } = await import('@/lib/pkce');
    const { verifier, challenge, state } = await createPkceChallenge();
    persistPkceSession(verifier, state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email offline_access',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
    });

    window.location.href = `${oauthUrl}/connect/authorize?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Content Writer V3</h1>
            <p className="text-slate-600 mt-2">Sign in to continue</p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Sign in with GeekOAuth
          </button>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600">
                You will be redirected to GeekOAuth to authenticate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
