'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

/** Survives React Strict Mode remounts within the same JS realm. */
const processedAuthCodes = new Set<string>();

export function OAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    void (async () => {
      const {
        peekPkceSession,
        clearPkceSession,
        markAuthCodeProcessed,
        wasAuthCodeProcessed,
      } = await import('@/lib/pkce');

      // Already finished this code (success path or prior attempt) — don't error on remount.
      if (processedAuthCodes.has(code) || wasAuthCodeProcessed(code)) {
        // #region agent log
        const { agentDebug } = await import('@/lib/agent-debug');
        agentDebug('H4', 'oauth-handler.tsx:lock', 'code already processed — resume session', {
          codeLen: code.length,
          hasToken: !!localStorage.getItem('auth_token'),
        });
        // #endregion
        if (localStorage.getItem('auth_token')) {
          router.replace('/dashboard');
          return;
        }
        return;
      }

      processedAuthCodes.add(code);
      markAuthCodeProcessed(code);

      try {
        const { getOauthBaseUrl } = await import('@/lib/config');
        const oauthUrl = getOauthBaseUrl();
        const clientId = 'content-writer-v3';
        const redirectUri = `${window.location.origin}/auth/callback`;

        const { verifier, state: storedState, source } = peekPkceSession();

        // #region agent log
        const { agentDebug } = await import('@/lib/agent-debug');
        agentDebug('H4', 'oauth-handler.tsx:callback', 'PKCE peek before token exchange', {
          hasVerifier: !!verifier,
          verifierLen: verifier?.length ?? 0,
          source,
          hasStoredState: !!storedState,
          hasCode: !!code,
          origin: window.location.origin,
        });
        // #endregion

        if (!verifier) {
          throw new Error('Missing PKCE verifier — restart sign-in from /login');
        }
        if (storedState && state && storedState !== state) {
          clearPkceSession();
          throw new Error('OAuth state mismatch — restart sign-in from /login');
        }

        const response = await fetch(`${oauthUrl}/connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
            code_verifier: verifier,
          }).toString(),
        });

        if (!response.ok) {
          const errBody = await response.text().catch(() => '');
          throw new Error(`Token exchange failed: ${response.status} ${errBody || response.statusText}`);
        }

        const tokenData = await response.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
          throw new Error('No access token in response');
        }

        // Keep PKCE until after login+navigation so remounts can still short-circuit via lock.
        await login(accessToken);
        clearPkceSession();
        router.replace('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        // #region agent log
        const { agentDebug } = await import('@/lib/agent-debug');
        agentDebug('H4', 'oauth-handler.tsx:catch', 'OAuth callback failed', {
          error: err instanceof Error ? err.message : String(err),
        });
        // #endregion
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    })();
  }, [searchParams, login, router]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        <p className="font-medium mb-2">Authentication Error</p>
        <p>{error}</p>
        <a
          href="/login"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-slate-600">Completing sign in...</p>
    </div>
  );
}
