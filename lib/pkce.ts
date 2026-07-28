/** PKCE helpers for OAuth 2.1 authorization-code flows (S256). */

const VERIFIER_KEY = 'cw_v3_pkce_verifier';
const STATE_KEY = 'cw_v3_oauth_state';

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]!);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomUrlSafeString(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

function write(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; Path=/; Max-Age=600; SameSite=Lax; Secure`;
  } catch {
    /* ignore */
  }
}

function read(key: string): string | null {
  try {
    const fromSession = sessionStorage.getItem(key);
    if (fromSession) return fromSession;
  } catch {
    /* ignore */
  }
  try {
    const fromLocal = localStorage.getItem(key);
    if (fromLocal) return fromLocal;
  } catch {
    /* ignore */
  }
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${key.replace(/[$()*+./?[\\\]^{|}-]/g, '\\$&')}=([^;]*)`),
    );
    if (match?.[1]) return decodeURIComponent(match[1]);
  } catch {
    /* ignore */
  }
  return null;
}

function remove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${encodeURIComponent(key)}=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
  } catch {
    /* ignore */
  }
}

export async function createPkceChallenge(): Promise<{
  verifier: string;
  challenge: string;
  state: string;
}> {
  const verifier = randomUrlSafeString(32);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = base64UrlEncode(digest);
  const state = randomUrlSafeString(16);
  return { verifier, challenge, state };
}

export function persistPkceSession(verifier: string, state: string): void {
  write(VERIFIER_KEY, verifier);
  write(STATE_KEY, state);
}

export function peekPkceSession(): {
  verifier: string | null;
  state: string | null;
  source: 'session' | 'local' | 'cookie' | 'none';
} {
  try {
    const verifier = sessionStorage.getItem(VERIFIER_KEY);
    if (verifier) {
      return { verifier, state: sessionStorage.getItem(STATE_KEY) ?? read(STATE_KEY), source: 'session' };
    }
  } catch {
    /* ignore */
  }
  try {
    const verifier = localStorage.getItem(VERIFIER_KEY);
    if (verifier) {
      return { verifier, state: localStorage.getItem(STATE_KEY) ?? read(STATE_KEY), source: 'local' };
    }
  } catch {
    /* ignore */
  }
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${VERIFIER_KEY.replace(/[$()*+./?[\\\]^{|}-]/g, '\\$&')}=([^;]*)`),
    );
    if (match?.[1]) {
      return {
        verifier: decodeURIComponent(match[1]),
        state: read(STATE_KEY),
        source: 'cookie',
      };
    }
  } catch {
    /* ignore */
  }
  return { verifier: null, state: read(STATE_KEY), source: 'none' };
}

export function clearPkceSession(): void {
  remove(VERIFIER_KEY);
  remove(STATE_KEY);
}

export function markAuthCodeProcessed(code: string): void {
  write(`cw_v3_oauth_processed_${code}`, '1');
}

export function wasAuthCodeProcessed(code: string): boolean {
  return read(`cw_v3_oauth_processed_${code}`) === '1';
}
