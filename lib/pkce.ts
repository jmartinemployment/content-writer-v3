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
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);
}

/** Read PKCE session without clearing — safe under React Strict Mode remounts. */
export function peekPkceSession(): { verifier: string | null; state: string | null } {
  return {
    verifier: sessionStorage.getItem(VERIFIER_KEY),
    state: sessionStorage.getItem(STATE_KEY),
  };
}

export function clearPkceSession(): void {
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
}
