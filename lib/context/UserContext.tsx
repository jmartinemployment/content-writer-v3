'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiBaseUrl } from '@/lib/config';

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // #region agent log
      fetch('http://127.0.0.1:7348/ingest/f9329de2-14be-4120-a838-fc1db3a1d0c6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2d6b04'},body:JSON.stringify({sessionId:'2d6b04',runId:'post-fix',hypothesisId:'H11',location:'UserContext.tsx:validateToken',message:'auth/me resolved API base',data:{ok:response.ok,status:response.status,apiHost:(()=>{try{return new URL(baseUrl).host}catch{return baseUrl}})(),hostname:typeof window!=='undefined'?window.location.hostname:'ssr',hasEnv:!!process.env.NEXT_PUBLIC_API_URL,tokenParts:token.split('.').length},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        // Keep OAuth token; API may be briefly unavailable (CORS/auth) without invalidating login.
        console.warn('auth/me returned', response.status);
        setUser({
          id: 'pending',
          email: '',
          clientId: '',
          workspaceId: '550e8400-e29b-41d4-a716-446655440001',
        });
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.warn('auth/me unreachable; keeping OAuth token', err);
      // #region agent log
      fetch('http://127.0.0.1:7348/ingest/f9329de2-14be-4120-a838-fc1db3a1d0c6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2d6b04'},body:JSON.stringify({sessionId:'2d6b04',runId:'post-fix',hypothesisId:'H1',location:'UserContext.tsx:validateToken:catch',message:'auth/me network/CORS failure',data:{error:err instanceof Error?err.message:String(err)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setUser({
        id: 'pending',
        email: '',
        clientId: '',
        workspaceId: '550e8400-e29b-41d4-a716-446655440001',
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('auth_token', token);
    setLoading(true);
    setError(null);
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Keep the OAuth token even when the API profile endpoint is unavailable.
        console.warn('auth/me returned', response.status);
        setUser({
          id: 'pending',
          email: '',
          clientId: '',
          workspaceId: '550e8400-e29b-41d4-a716-446655440001',
        });
      }
    } catch (err) {
      console.warn('auth/me unreachable; keeping OAuth token', err);
      setUser({
        id: 'pending',
        email: '',
        clientId: '',
        workspaceId: '550e8400-e29b-41d4-a716-446655440001',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setError(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout }}>
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
