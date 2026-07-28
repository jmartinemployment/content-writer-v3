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

function pendingUser(): User {
  return {
    id: 'pending',
    email: '',
    clientId: '',
    workspaceId: DEFAULT_WORKSPACE_ID,
  };
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
        // Keep OAuth token; API may be briefly unavailable without invalidating login.
        console.warn('auth/me returned', response.status);
        setUser(pendingUser());
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.warn('auth/me unreachable; keeping OAuth token', err);
      setUser(pendingUser());
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
        setUser(pendingUser());
      }
    } catch (err) {
      console.warn('auth/me unreachable; keeping OAuth token', err);
      setUser(pendingUser());
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
