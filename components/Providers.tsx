'use client';

import { UserProvider } from '@/lib/context/UserContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
