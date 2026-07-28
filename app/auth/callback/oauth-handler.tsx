'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

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

    handleCallback(code, state || '');
  }, [searchParams, login, router]);

  const handleCallback = async (code: string, state: string) => {
    try {
      const oauthUrl = process.env.NEXT_PUBLIC_GEEK_OAUTH_URL || 'https://auth.geekatyourspot.com';
      const clientId = 'content-writer-v3';
      const redirectUri = `${window.location.origin}/auth/callback`;

      const { takePkceSession } = await import('@/lib/pkce');
      const { verifier, state: storedState } = takePkceSession();
      if (!verifier) {
        throw new Error('Missing PKCE verifier — restart sign-in from /login');
      }
      if (storedState && state && storedState !== state) {
        throw new Error('OAuth state mismatch — restart sign-in from /login');
      }

      // Exchange authorization code for access token
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

      // Login with the token
      await login(accessToken);
      router.push('/dashboard');
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

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
