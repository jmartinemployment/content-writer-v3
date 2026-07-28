/** Runtime config — never fall back to localhost when running on a deployed host. */

const PROD_API = 'https://api.geekatyourspot.com/api/content-writer/v3';
const LOCAL_API = 'http://localhost:5000/api/content-writer/v3';
const PROD_OAUTH = 'https://auth.geekatyourspot.com';

function isBrowserLocalHost(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1';
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // Build/SSR without env: prefer production API unless we know we are on localhost.
  if (typeof window !== 'undefined' && !isBrowserLocalHost()) {
    return PROD_API;
  }
  return LOCAL_API;
}

export function getOauthBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GEEK_OAUTH_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return PROD_OAUTH;
}
