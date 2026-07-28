# Content Writer V3 — Complete Setup & Testing Guide

End-to-end setup for running all services locally with GeekOAuth authentication.

## Prerequisites

- Node.js 18+ (`node --version`)
- .NET 10 SDK (`dotnet --version`)
- PostgreSQL 14+ (`psql --version`)
- Git (`git --version`)

## Part 1: Database Setup (5 minutes)

### Create Local PostgreSQL Database

```bash
# Create database
createdb postgres

# Create schema
psql -d postgres -c 'CREATE SCHEMA "content-writer-3";'

# Verify
psql -d postgres -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'content-writer-3';"
# Should return: content-writer-3
```

### Create Supabase Database (Production)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. In SQL Editor, create schema:
   ```sql
   CREATE SCHEMA "content-writer-3";
   GRANT USAGE ON SCHEMA "content-writer-3" TO postgres;
   GRANT CREATE ON SCHEMA "content-writer-3" TO postgres;
   ALTER DEFAULT PRIVILEGES IN SCHEMA "content-writer-3" GRANT ALL ON TABLES TO postgres;
   ALTER DEFAULT PRIVILEGES IN SCHEMA "content-writer-3" GRANT ALL ON SEQUENCES TO postgres;
   ```
4. Get connection string from Database → Connection String (PostgreSQL)

## Part 2: Environment Configuration (5 minutes)

### GeekOAuth

**File:** `GeekOAuth/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=content-writer-3
ISSUER_URL=https://auth.localhost.test
DATA_PROTECTION_PURPOSE=GeekOAuth-dev
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
FORM_ACTION_ORIGINS=http://localhost:3000,http://localhost:8080
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

For production (Supabase):
```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require
ISSUER_URL=https://auth.geekatyourspot.com
```

### GeekRepository

**File:** `GeekBackend/GeekRepository/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=content-writer-3
PORT=5050
```

For production:
```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require
PORT=5050
```

### GeekAPI

**File:** `GeekBackend/GeekAPI/.env`

```env
PORT=5000
REPO_URL=http://localhost:5050
REPO_API_KEY=dev-api-key
GEEK_BACKEND_API_KEY=dev-api-key
CORS_ORIGINS=http://localhost:3000
```

### Content Writer V3 Frontend

**File:** `content-writer-v3/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/content-writer/v3
NEXT_PUBLIC_GEEK_OAUTH_URL=http://localhost:8080
```

## Part 3: Start Services (5 minutes)

Open 4 terminal windows in the directories below and run these commands in parallel.

### Terminal 1 — GeekOAuth

```bash
cd /Users/jeffmartin/development/GeekOAuth
export $(cat .env | xargs)
dotnet run --project src/GeekOAuth.Server

# Expected output:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: http://localhost:8080
```

### Terminal 2 — GeekRepository

```bash
cd /Users/jeffmartin/development/GeekBackend
export $(cat GeekRepository/.env | xargs)
dotnet run --project GeekRepository/GeekRepository.csproj

# Expected output:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: http://localhost:5050
# 
# On first run, should log:
# info: GeekRepository.Infrastructure[0]
#       Applying pending migrations...
```

### Terminal 3 — GeekAPI

```bash
cd /Users/jeffmartin/development/GeekBackend
export $(cat GeekAPI/.env | xargs)
export REPO_URL=http://localhost:5050
dotnet run --project GeekAPI/GeekAPI.csproj

# Expected output:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: http://localhost:5000
```

### Terminal 4 — Frontend

```bash
cd /Users/jeffmartin/development/content-writer-v3
export $(cat .env.local | xargs)
npm run dev

# Expected output:
# ▲ Next.js 16.2.12 (Turbopack)
# - Local:        http://localhost:3000
# - Environments: .env.local
```

## Part 4: Test the System (5 minutes)

### Verify All Services Are Running

```bash
# In a new terminal window, run these checks:

# GeekOAuth health
curl http://localhost:8080/health
# Expected: 200 OK

# GeekRepository health
curl http://localhost:5050/health
# Expected: 200 OK

# GeekAPI health
curl http://localhost:5000/health
# Expected: 200 OK

# Frontend loads
curl http://localhost:3000
# Expected: 200 OK
```

### Test OAuth Login Flow

1. **Open browser:** http://localhost:3000
2. **You should see:** Content Writer V3 home page
3. **Click:** "Sign In" (or navigate to /login)
4. **Click:** "Sign in with GeekOAuth"
5. **You should see:** GeekOAuth login page (http://localhost:8080/Account/Login)
6. **Sign up or login:** Create a test account or use existing credentials
7. **Grant consent:** Click "Yes, Allow" (first time only)
8. **Redirect:** Should redirect back to http://localhost:3000/auth/callback
9. **Then redirect to:** http://localhost:3000/dashboard
10. **You should see:** Dashboard with your user info

### Test API Access

Once logged in, the frontend should be able to:
- Load campaigns from `/api/content-writer/v3/campaigns?clientId=...`
- Load clients from `/api/content-writer/v3/clients`
- Load assets, keywords, research runs, etc.

Check DevTools (F12) → Network tab to see API requests.

## Part 5: Verify Database

Check that tables were created:

```bash
psql -d postgres -c "
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'content-writer-3' 
ORDER BY table_name;
"

# Should include tables like:
# campaigns
# clients
# assets
# keywords
# AspNetUsers (from GeekOAuth)
# OpenIddictApplications (from GeekOAuth)
# And 15+ others
```

## Troubleshooting

### Port Already in Use

```bash
# Find what's using port 8080
lsof -i :8080

# Kill it (if safe)
kill -9 <PID>
```

### Database Connection Failed

```bash
# Test PostgreSQL connection
psql -d postgres

# Check schema exists
psql -d postgres -c "\dn"  # List schemas

# Create schema if missing
psql -d postgres -c 'CREATE SCHEMA "content-writer-3";'
```

### OAuth Login Redirects to Wrong URL

- Check `CORS_ORIGINS` in GeekOAuth/.env includes `http://localhost:3000`
- Check `FORM_ACTION_ORIGINS` in GeekOAuth/.env includes `http://localhost:3000`
- Check GeekOAuth client registration has correct redirect URIs:
  - `http://localhost:3000/auth/callback`
  - Post-logout: `http://localhost:3000/`

### "No access token in response" Error

- Verify GeekOAuth is running on port 8080
- Check `/connect/token` endpoint exists: `curl -X POST http://localhost:8080/connect/token`
- Check code_verifier is being sent (PKCE)

### Frontend Won't Build

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Performance Checklist

- [ ] Frontend loads in <3 seconds
- [ ] API responses in <200ms
- [ ] Database queries in <100ms
- [ ] OAuth login in <2 seconds

Monitor in DevTools → Network tab.

## Next Steps

1. **Staging Deployment:** See `DEPLOYMENT.md`
2. **Production Launch:** See `LAUNCH_CHECKLIST.md`
3. **Monitoring:** See `MONITORING_GUIDE.md`
4. **Team Onboarding:** See `TEAM_HANDOFF.md`

## Quick Reference

| Service | URL | Health Check |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | `curl http://localhost:3000` |
| GeekAPI | http://localhost:5000 | `curl http://localhost:5000/health` |
| GeekRepository | http://localhost:5050 | `curl http://localhost:5050/health` |
| GeekOAuth | http://localhost:8080 | `curl http://localhost:8080/health` |
| Database | localhost:5432 | `psql -d postgres` |

## Getting Help

- **Build fails?** Check .NET version: `dotnet --version` (need 10+)
- **Port error?** Check `lsof -i :<port>`
- **Database error?** Check connection string in .env files
- **OAuth error?** Check browser console (F12) for detailed errors
- **API error?** Check GeekAPI/GeekRepository logs in terminal

---

**Last Updated:** July 28, 2026  
**Status:** Production-Ready
