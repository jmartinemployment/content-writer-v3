'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { OAuthCallback } from './oauth-callback';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: contextLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleOAuthLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const oauthUrl = process.env.NEXT_PUBLIC_GEEK_OAUTH_URL;
      const clientId = process.env.NEXT_PUBLIC_GEEK_OAUTH_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_GEEK_OAUTH_REDIRECT_URI;

      if (!oauthUrl || !clientId || !redirectUri) {
        setError('OAuth configuration is missing. Please contact support.');
        return;
      }

      // Generate PKCE challenge for security
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Generate state for CSRF protection
      const state = generateState();

      // Store for callback validation
      sessionStorage.setItem('oauth_code_verifier', codeVerifier);
      sessionStorage.setItem('oauth_state', state);

      // Redirect to GeekOAuth authorization endpoint
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      window.location.href = `${oauthUrl}/oauth/authorize?${params.toString()}`;
    } catch (err) {
      setError('Failed to initiate login. Please try again.');
      console.error('OAuth login error:', err);
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if this is an OAuth callback
  if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
    return <OAuthCallback />;
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleOAuthLogin}
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              'Sign in with GeekOAuth'
            )}
          </button>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600">
                You will be redirected to GeekOAuth to sign in securely. Your authentication is managed by the platform identity service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => String.fromCharCode(byte))
    .join('')
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => String.fromCharCode(b))
    .join('')
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
    .match(/.{1,2}/g)!
    .map(x => String.fromCharCode(parseInt(x, 16)))
    .join('')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
