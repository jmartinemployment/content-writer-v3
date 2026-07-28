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

const DEFAULT_WORKSPACE_ID = '550e8400-e29b-41d4-a716-446655440001';

function isGuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/** Best-effort profile from the access token when /auth/me is unavailable. */
function userFromAccessToken(token: string): User {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      return {
        id: 'pending',
        email: '',
        clientId: '',
        workspaceId: DEFAULT_WORKSPACE_ID,
      };
    }
    const padded = parts[1] + '='.repeat((4 - (parts[1].length % 4)) % 4);
    const json = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { sub?: string; email?: string };
    const id = typeof payload.sub === 'string' && payload.sub ? payload.sub : 'pending';
    return {
      id,
      email: typeof payload.email === 'string' ? payload.email : '',
      // AuthController maps clientId = userId for content-writer v3.
      clientId: isGuid(id) ? id : '',
      workspaceId: DEFAULT_WORKSPACE_ID,
    };
  } catch {
    return {
      id: 'pending',
      email: '',
      clientId: '',
      workspaceId: DEFAULT_WORKSPACE_ID,
    };
  }
}

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

      if (!response.ok) {
        console.warn('auth/me returned', response.status);
        const fallback = userFromAccessToken(token);
        // #region agent log
        fetch('http://127.0.0.1:7348/ingest/f9329de2-14be-4120-a838-fc1db3a1d0c6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2d6b04'},body:JSON.stringify({sessionId:'2d6b04',runId:'post-fix',hypothesisId:'H22',location:'UserContext.tsx:validateToken',message:'auth/me failed; JWT fallback',data:{status:response.status,hasClientId:!!fallback.clientId,userIdPrefix:fallback.id.slice(0,8)},timestamp:Date.now()})}).catch(()=>{});
        fetch('/api/agent-debug',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'H22',message:'auth/me failed; JWT fallback',data:{status:response.status,hasClientId:!!fallback.clientId}})}).catch(()=>{});
        // #endregion
        setUser(fallback);
        return;
      }

      const userData = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7348/ingest/f9329de2-14be-4120-a838-fc1db3a1d0c6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2d6b04'},body:JSON.stringify({sessionId:'2d6b04',runId:'post-fix',hypothesisId:'H22',location:'UserContext.tsx:validateToken',message:'auth/me ok',data:{hasClientId:!!userData?.clientId,userIdPrefix:String(userData?.id||'').slice(0,8)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setUser(userData);
    } catch (err) {
      console.warn('auth/me unreachable; keeping OAuth token', err);
      setUser(userFromAccessToken(token));
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
        console.warn('auth/me returned', response.status);
        setUser(userFromAccessToken(token));
      }
    } catch (err) {
      console.warn('auth/me unreachable; keeping OAuth token', err);
      setUser(userFromAccessToken(token));
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
