'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

export function OAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

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

    // Guard against React Strict Mode / dependency remounts consuming PKCE twice.
    if (startedRef.current) return;
    startedRef.current = true;

    void (async () => {
      try {
        const oauthUrl = process.env.NEXT_PUBLIC_GEEK_OAUTH_URL || 'https://auth.geekatyourspot.com';
        const clientId = 'content-writer-v3';
        const redirectUri = `${window.location.origin}/auth/callback`;

        const { peekPkceSession, clearPkceSession } = await import('@/lib/pkce');
        const { verifier, state: storedState } = peekPkceSession();

        // #region agent log
        fetch('http://127.0.0.1:7348/ingest/f9329de2-14be-4120-a838-fc1db3a1d0c6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2d6b04'},body:JSON.stringify({sessionId:'2d6b04',runId:'pkce-callback',hypothesisId:'H1',location:'oauth-handler.tsx:callback',message:'PKCE peek before token exchange',data:{hasVerifier:!!verifier,verifierLen:verifier?.length??0,hasStoredState:!!storedState,hasCode:!!code,origin:window.location.origin},timestamp:Date.now()})}).catch(()=>{});
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

        clearPkceSession();
        await login(accessToken);
        router.push('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        // #region agent log
        fetch('http://127.0.0.1:7348/ingest/f9329de2-14be-4120-a838-fc1db3a1d0c6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2d6b04'},body:JSON.stringify({sessionId:'2d6b04',runId:'pkce-callback',hypothesisId:'H1',location:'oauth-handler.tsx:catch',message:'OAuth callback failed',data:{error:err instanceof Error?err.message:String(err)},timestamp:Date.now()})}).catch(()=>{});
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
