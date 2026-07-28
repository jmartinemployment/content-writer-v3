'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading: contextLoading } = useUser();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(token);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to login. Please check your token and try again.');
      console.error('Login error:', err);
    } finally {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Content Writer V3</h1>
            <p className="text-slate-600 mt-2">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-slate-900 mb-2">
                Authentication Token
              </label>
              <textarea
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT token here"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-slate-500 mt-2">
                Get a token from GeekOAuth or use your API key
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!token.trim() || loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">Development Mode</p>
              <p className="text-xs text-blue-800 mb-3">
                For testing, use any JWT token or your GeekOAuth bearer token. The system will validate it against the backend.
              </p>
              <Link
                href="/dashboard"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Try demo (guest mode) →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
