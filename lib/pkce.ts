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

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key) ?? localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode / blocked */
  }
  try {
    // localStorage survives some cross-site redirect cases where sessionStorage is empty on return.
    localStorage.setItem(key, value);
  } catch {
    /* private mode / blocked */
  }
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

/** Read PKCE session without clearing — safe under React Strict Mode remounts. */
export function peekPkceSession(): {
  verifier: string | null;
  state: string | null;
  source: 'session' | 'local' | 'none';
} {
  let source: 'session' | 'local' | 'none' = 'none';
  let verifier: string | null = null;
  let state: string | null = null;
  try {
    verifier = sessionStorage.getItem(VERIFIER_KEY);
    state = sessionStorage.getItem(STATE_KEY);
    if (verifier) source = 'session';
  } catch {
    /* ignore */
  }
  if (!verifier) {
    try {
      verifier = localStorage.getItem(VERIFIER_KEY);
      state = state ?? localStorage.getItem(STATE_KEY);
      if (verifier) source = 'local';
    } catch {
      /* ignore */
    }
  }
  return { verifier, state, source };
}

export function clearPkceSession(): void {
  remove(VERIFIER_KEY);
  remove(STATE_KEY);
}
