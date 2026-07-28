# GeekOAuth Setup Guide

Content Writer V3 uses **GeekOAuth** (`auth.geekatyourspot.com`) for authentication. This guide explains how to configure OAuth for both development and production.

---

## Architecture Overview

```
User Browser (localhost:3000)
    ↓ (1) Clicks "Sign in with GeekOAuth"
Frontend (Next.js)
    ↓ (2) Redirects to OAuth provider
GeekOAuth (auth.geekatyourspot.com)
    ↓ (3) User authenticates
GeekOAuth → Frontend
    ↓ (4) Redirect with authorization code
Frontend
    ↓ (5) Exchange code for token
GeekOAuth
    ↓ (6) Return access token
Frontend stores token in localStorage
    ↓ (7) Uses token in Authorization header
GeekAPI (localhost:5000)
    ↓ (8) Validates token & returns user info
PostgreSQL (user data)
```

**Key Points:**
- GeekOAuth is a **separate service** (not in this repo)
- Handles user authentication & token issuance
- Content Writer V3 frontend receives tokens and uses them for API calls
- Backend (GeekAPI) validates tokens but doesn't issue them

---

## Configuration

### Environment Variables

All OAuth configuration is via environment variables. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then fill in the values:

```env
# GeekOAuth Configuration
NEXT_PUBLIC_GEEK_OAUTH_URL=https://auth.geekatyourspot.com
NEXT_PUBLIC_GEEK_OAUTH_CLIENT_ID=your-client-id
NEXT_PUBLIC_GEEK_OAUTH_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GEEK_OAUTH_REDIRECT_URI=http://localhost:3000/login
```

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser. `CLIENT_SECRET` should ideally be stored on the backend, but for PKCE flow it's optional.

### Local Development Setup

1. **Get OAuth credentials from GeekOAuth:**
   - Contact the GeekOAuth team or admin
   - Register "Content Writer V3" as a new OAuth client
   - Redirect URI: `http://localhost:3000/login`
   - Request these values:
     - `Client ID`
     - `Client Secret` (if using authorization code grant without PKCE)

2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_GEEK_OAUTH_URL=https://auth.geekatyourspot.com
   NEXT_PUBLIC_GEEK_OAUTH_CLIENT_ID=content-writer-v3-dev
   NEXT_PUBLIC_GEEK_OAUTH_REDIRECT_URI=http://localhost:3000/login
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

4. **Test the flow:**
   - Navigate to `http://localhost:3000/login`
   - Click "Sign in with GeekOAuth"
   - You should be redirected to GeekOAuth login
   - After authentication, you're redirected back with an authorization code
   - Frontend exchanges code for token
   - You're logged in and redirected to dashboard

### Production Setup

1. **Get production OAuth credentials:**
   - Register a new OAuth client in GeekOAuth for production
   - Redirect URI: `https://content-writer.geekatyourspot.com/login`

2. **Update Vercel environment variables:**
   - Go to Vercel project settings
   - Add environment variables:
     ```
     NEXT_PUBLIC_GEEK_OAUTH_URL=https://auth.geekatyourspot.com
     NEXT_PUBLIC_GEEK_OAUTH_CLIENT_ID=content-writer-v3-prod
     NEXT_PUBLIC_GEEK_OAUTH_REDIRECT_URI=https://content-writer.geekatyourspot.com/login
     ```

3. **Deploy:**
   ```bash
   git push origin main  # or your deployment branch
   ```

---

## OAuth Flow Details

### 1. Login Initiation

User clicks "Sign in with GeekOAuth" on `/login` page.

Frontend generates:
- **PKCE Code Verifier** — random 32-byte value for security
- **PKCE Code Challenge** — SHA256 hash of code verifier
- **State** — random 32-byte value for CSRF protection

Stores in `sessionStorage`:
```javascript
sessionStorage.setItem('oauth_code_verifier', codeVerifier);
sessionStorage.setItem('oauth_state', state);
```

Redirects to GeekOAuth:
```
https://auth.geekatyourspot.com/oauth/authorize?
  client_id=content-writer-v3-dev&
  redirect_uri=http://localhost:3000/login&
  response_type=code&
  scope=openid%20profile%20email&
  state=RANDOM_STATE&
  code_challenge=PKCE_CHALLENGE&
  code_challenge_method=S256
```

### 2. GeekOAuth Authentication

User authenticates at GeekOAuth (login, MFA, etc.). GeekOAuth redirects back:
```
http://localhost:3000/login?code=AUTH_CODE&state=RANDOM_STATE
```

### 3. Code Exchange (Frontend)

Frontend:
1. Validates `state` parameter matches stored value (CSRF protection)
2. Retrieves `code_verifier` from sessionStorage
3. Exchanges authorization code for access token:

```bash
POST https://auth.geekatyourspot.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=content-writer-v3-dev&
client_secret=CLIENT_SECRET&
redirect_uri=http://localhost:3000/login&
code_verifier=CODE_VERIFIER
```

### 4. Token Storage

Frontend receives `access_token`:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Stores in localStorage:
```javascript
localStorage.setItem('auth_token', accessToken);
```

### 5. API Requests

All requests to GeekAPI include the Bearer token:
```bash
Authorization: Bearer eyJhbGc...
```

Backend (ApiKeyMiddleware) validates the token:
- For JWTs: extracts `sub` claim (user ID)
- For UUIDs: uses UUID directly
- Validates non-empty token in dev mode

Backend returns user info from `/auth/me`:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "clientId": "550e8400-e29b-41d4-a716-446655440001",
  "workspaceId": "550e8400-e29b-41d4-a716-446655440002"
}
```

Frontend stores user context and displays the dashboard.

---

## Security Features

### PKCE (Proof Key for Code Exchange)
- Prevents authorization code interception attacks
- Particularly important for public clients (SPA/frontend)
- Implementation: `S256` (SHA256 method)

### State Parameter
- Prevents CSRF attacks
- Random value generated and validated
- Must match between authorization request and redirect callback

### HTTPS Only (Production)
- All OAuth communications must be HTTPS in production
- Tokens transmitted securely
- No credentials in URL parameters

### Token Storage
- Access token stored in `localStorage`
- Token sent only in `Authorization` header
- Never exposed in URLs or cookies (by default)

### Token Validation
- Backend validates every token on every request
- Invalid/expired tokens rejected with 401 Unauthorized
- User redirected to login on token expiry

---

## Troubleshooting

### "OAuth configuration is missing"
**Problem:** Environment variables not set  
**Solution:** Copy `.env.local.example` to `.env.local` and fill in values

### "Invalid state parameter"
**Problem:** State value doesn't match  
**Solution:** This is a CSRF attack prevention—clear sessionStorage and try again

### "Failed to exchange code for token"
**Problem:** GeekOAuth token endpoint returned error  
**Possible causes:**
- Client ID/Secret incorrect
- Redirect URI doesn't match registered URI
- Code has expired (authorization codes are short-lived)
- GeekOAuth service is down

**Solution:**
- Verify environment variables are correct
- Check GeekOAuth logs
- Ensure redirect URI matches exactly in GeekOAuth client registration

### "Token validation failed" (401 Unauthorized)
**Problem:** Backend rejected the token  
**Possible causes:**
- Token is malformed
- Token has expired
- Token is from a different issuer
- Backend date/time is out of sync

**Solution:**
- Clear localStorage and log in again
- Check backend logs for validation errors
- Ensure backend/frontend time sync

### Can't login on production
**Problem:** Getting redirected to wrong domain or auth fails  
**Solution:**
- Verify Vercel environment variables are set
- Check redirect URI matches Vercel domain exactly
- Verify GeekOAuth client registration includes correct production redirect URI
- Check CORS settings on GeekAPI

---

## Token Refresh / Expiration

Currently: Access tokens are treated as long-lived (no refresh implemented).

Future enhancement (Phase 2):
- Implement refresh token flow
- Auto-refresh tokens before expiry
- Handle token expiry gracefully

---

## Testing

### Local Testing

1. Set environment variables in `.env.local`
2. Run frontend: `npm run dev`
3. Visit `http://localhost:3000/login`
4. Click "Sign in with GeekOAuth"
5. Authenticate at GeekOAuth
6. You should see dashboard with user info

### Testing with Mock Token (Dev Only)

If GeekOAuth is unavailable:
1. Generate a test JWT or UUID
2. Manually set in localStorage: `localStorage.setItem('auth_token', 'test-uuid-or-jwt')`
3. The `/auth/me` endpoint will accept any non-empty token in dev mode
4. You can test the dashboard flow

---

## Reference

### Files Modified
- `/app/login/page.tsx` — Login page with OAuth initiation
- `/app/login/oauth-callback.tsx` — OAuth callback handler
- `/lib/context/UserContext.tsx` — Token storage and user context

### Environment Variables
- `NEXT_PUBLIC_API_URL` — Backend API URL
- `NEXT_PUBLIC_GEEK_OAUTH_URL` — GeekOAuth authorization server
- `NEXT_PUBLIC_GEEK_OAUTH_CLIENT_ID` — OAuth client ID
- `NEXT_PUBLIC_GEEK_OAUTH_CLIENT_SECRET` — OAuth client secret (optional for PKCE)
- `NEXT_PUBLIC_GEEK_OAUTH_REDIRECT_URI` — Where GeekOAuth redirects back

### Endpoints
- **GeekOAuth Authorization:** `GET {OAUTH_URL}/oauth/authorize`
- **GeekOAuth Token:** `POST {OAUTH_URL}/oauth/token`
- **Content Writer Auth Check:** `GET http://localhost:5000/api/content-writer/v3/auth/me`

### Token Validation (Backend)
- File: `GeekAPI/Middleware/ApiKeyMiddleware.cs`
- Lines: 50-149 (Bearer token validation)
- Supports: JWT tokens, UUID tokens, API keys

---

**Last Updated:** July 28, 2026  
**Status:** Production-ready OAuth flow implemented
