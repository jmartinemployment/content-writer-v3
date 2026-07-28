'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  clientId: string;
  workspaceId: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  handleOAuthCallback: (code: string, state: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if token exists and validate on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/content-writer/v3';
      const response = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error('Token validation error:', err);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('auth_token', token);
    await validateToken(token);
  };

  const handleOAuthCallback = useCallback(async (code: string, state: string) => {
    try {
      setLoading(true);
      setError(null);

      // Verify state for CSRF protection
      const storedState = sessionStorage.getItem('oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
      if (!codeVerifier) {
        throw new Error('Missing code verifier');
      }

      // Exchange code for token
      const oauthUrl = process.env.NEXT_PUBLIC_GEEK_OAUTH_URL;
      const clientId = process.env.NEXT_PUBLIC_GEEK_OAUTH_CLIENT_ID;
      const clientSecret = process.env.NEXT_PUBLIC_GEEK_OAUTH_CLIENT_SECRET;
      const redirectUri = process.env.NEXT_PUBLIC_GEEK_OAUTH_REDIRECT_URI;

      if (!oauthUrl || !clientId || !redirectUri) {
        throw new Error('OAuth configuration is missing');
      }

      const tokenResponse = await fetch(`${oauthUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret || '',
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;

      // Clear session storage
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_code_verifier');

      // Login with the token
      await login(token);
      router.push('/dashboard');
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setError(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout, handleOAuthCallback }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
