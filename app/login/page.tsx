'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, logout } = useUser();
  const [starting, setStarting] = useState(false);

  // Do not auto-redirect away from /login — users must choose Continue or Sign in
  // so GeekOAuth can present the identity form (prompt=login).

  const startOAuth = async (opts?: { switchAccount?: boolean }) => {
    setStarting(true);
    try {
      if (opts?.switchAccount) {
        logout();
      }

      const { getOauthBaseUrl } = await import('@/lib/config');
      const oauthUrl = getOauthBaseUrl();
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
        // Always show GeekOAuth credentials UI (avoids silent SSO with no identity prompt).
        prompt: 'login',
      });

      // #region agent log
      fetch('/api/agent-debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: '2d6b04',
          runId: 'prompt-login',
          hypothesisId: 'H21',
          location: 'login/page.tsx:startOAuth',
          message: 'authorize with prompt=login',
          data: {
            prompt: 'login',
            switchAccount: !!opts?.switchAccount,
            origin: window.location.origin,
            hadUser: !!user,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      window.location.href = `${oauthUrl}/connect/authorize?${params.toString()}`;
    } catch (err) {
      console.error(err);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Content Writer V3</h1>
            <p className="text-slate-600 mt-2">Sign in to continue</p>
          </div>

          {user && user.id !== 'pending' ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 text-center">
                Signed in as <span className="font-medium text-slate-900">{user.email || user.id}</span>
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                disabled={starting}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-60"
              >
                Continue to dashboard
              </button>
              <button
                onClick={() => startOAuth({ switchAccount: true })}
                disabled={starting}
                className="w-full px-4 py-3 border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-50 font-medium transition disabled:opacity-60"
              >
                Sign in as a different user
              </button>
            </div>
          ) : (
            <button
              onClick={() => startOAuth()}
              disabled={starting}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-60"
            >
              {starting ? 'Redirecting…' : 'Sign in with GeekOAuth'}
            </button>
          )}

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600">
                You will be redirected to GeekOAuth to authenticate (login form is always shown).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
