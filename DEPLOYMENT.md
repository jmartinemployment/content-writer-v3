# Content Writer V3 — Deployment & Configuration Guide

## Environment Variables

### Frontend (`content-writer-v3`)

```bash
# API endpoint (required for production)
NEXT_PUBLIC_API_URL=https://api.geekatyourspot.com/api/content-writer/v3

# Development default: http://localhost:5000/api/content-writer/v3
```

**Location**: Add to `.env.local` (local dev) or Vercel project settings (production)

---

### GeekAPI (HTTP Gateway)

```bash
# Port to run on (default: 8080)
PORT=8080

# GeekRepository connection
REPO_URL=http://localhost:5050
REPO_API_KEY=your-internal-service-api-key

# API Authentication
GEEK_BACKEND_API_KEY=your-api-key-for-clients

# CORS Origins (comma-separated, no trailing slash)
CORS_ORIGINS=http://localhost:3000,https://www.geekatyourspot.com,https://admin.geekatyourspot.com

# Optional: WordPress integration
WORDPRESS_URL=https://blog.example.com

# Optional: Claude API (for content generation)
ANTHROPIC_API_KEY=sk-ant-...
```

**Location**: `.env` file in GeekAPI project root, or Railway environment variables

---

### GeekRepository (Data Layer)

```bash
# PostgreSQL connection string (required)
DATABASE_URL=postgresql://user:password@localhost:5432/content_writer_v3

# Port to run on (default: 5050)
PORT=5050

# Optional: Separate Geek SEO database
GEEK_SEO_DATABASE_URL=postgresql://user:password@localhost:5432/geek_seo
```

**Location**: `.env` file in GeekRepository project root, or Railway environment variables

---

## Local Development Setup

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb content_writer_v3

# Apply migrations (if any)
# Migrations are applied on first run via EF Core
```

### 2. Start GeekRepository (Data Layer)

```bash
cd /Users/jeffmartin/development/GeekBackend
export DATABASE_URL="postgresql://postgres:password@localhost:5432/content_writer_v3"
export PORT=5050
dotnet run --project GeekRepository/GeekRepository.csproj
```

Output should show: `Now listening on: http://localhost:5050`

### 3. Start GeekAPI (HTTP Gateway)

In a new terminal:

```bash
cd /Users/jeffmartin/development/GeekBackend
export REPO_URL="http://localhost:5050"
export REPO_API_KEY="dev-key"
export GEEK_BACKEND_API_KEY="dev-key"
export PORT=5000
dotnet run --project GeekAPI/GeekAPI.csproj
```

Output should show: `Now listening on: http://localhost:5000`

### 4. Start Frontend

In a new terminal:

```bash
cd /Users/jeffmartin/development/content-writer-v3
export NEXT_PUBLIC_API_URL="http://localhost:5000/api/content-writer/v3"
npm run dev
```

Visit http://localhost:3000

---

## Production Deployment (Railway)

### 1. Database

- Create PostgreSQL service on Railway
- Run migrations on first deploy
- Note connection string for `DATABASE_URL`

### 2. GeekRepository Service

**Settings**:
- Build command: (empty, Railway auto-detects)
- Start command: `dotnet run --project GeekRepository/GeekRepository.csproj`

**Environment Variables**:
```
DATABASE_URL=postgresql://...  (from Railway database)
PORT=5050
```

### 3. GeekAPI Service

**Settings**:
- Build command: (empty, Railway auto-detects)
- Start command: `dotnet run --project GeekAPI/GeekAPI.csproj`

**Environment Variables**:
```
REPO_URL=http://geek-repository:5050  (Railway internal DNS)
REPO_API_KEY=your-production-key
GEEK_BACKEND_API_KEY=your-api-key
PORT=5000
CORS_ORIGINS=https://your-domain.vercel.app
```

### 4. Vercel Deployment

**Build Settings**:
- Framework: Next.js (auto-detected)
- Build command: `npm run build`
- Output directory: `.next`

**Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://api.geekatyourspot.com/api/content-writer/v3
```

### 5. DNS & Routing

```
api.geekatyourspot.com → Railway GeekAPI service
www.geekatyourspot.com → Vercel frontend
```

---

## Testing the Integration

### Health Checks

```bash
# GeekRepository health
curl http://localhost:5050/health

# GeekAPI health
curl http://localhost:5000/health

# Frontend
curl http://localhost:3000
```

### Auth Flow

```bash
# 1. Get auth token (implementation-specific, check AuthController)
export TOKEN="your-jwt-token"

# 2. Validate token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/content-writer/v3/auth/me

# 3. If valid, response includes:
# { "id": "...", "email": "...", "clientId": "...", "workspaceId": "..." }
```

### API Flow

```bash
# 1. Get campaigns for a client
export CLIENT_ID="..."
curl -H "X-API-Key: $GEEK_BACKEND_API_KEY" \
  "http://localhost:5000/api/content-writer/v3/campaigns?clientId=$CLIENT_ID"

# 2. Get assets for a campaign
export CAMPAIGN_ID="..."
curl -H "X-API-Key: $GEEK_BACKEND_API_KEY" \
  "http://localhost:5000/api/content-writer/v3/assets?campaignId=$CAMPAIGN_ID"
```

---

## Troubleshooting

### Frontend Can't Connect to Backend

**Check**:
1. Backend is running on correct port (5000 for GeekAPI)
2. `NEXT_PUBLIC_API_URL` is set correctly
3. CORS is configured to allow frontend origin
4. Firewall/network allows connection

**Fix**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Restart dev server
npm run dev
```

### GeekAPI Can't Connect to GeekRepository

**Check**:
1. GeekRepository is running on port 5050
2. `REPO_URL` env var points to correct address
3. Network allows connection between services

**Fix**:
```bash
# Test connectivity
curl http://localhost:5050/

# If fails, restart GeekRepository
dotnet run --project GeekRepository/GeekRepository.csproj
```

### Database Connection Errors

**Check**:
1. PostgreSQL is running
2. `DATABASE_URL` is correct
3. Database exists and user has permissions

**Fix**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Create database if missing
createdb content_writer_v3
```

---

## Performance Tuning

### Connection Pooling

GeekAPI uses HTTP client pooling by default. Connection pool size is set in `GeekAPI/Program.cs`.

### Caching

Consider adding Redis for session caching (not currently implemented).

### Database

- Ensure indexes on foreign keys and common filters
- Monitor slow queries in PostgreSQL logs

---

## Monitoring

### Logging

All three services (GeekRepository, GeekAPI, Frontend) log to stdout:

```bash
# GeekRepository logs
dotnet run --project GeekRepository/GeekRepository.csproj 2>&1 | grep -i error

# GeekAPI logs
dotnet run --project GeekAPI/GeekAPI.csproj 2>&1 | grep -i error

# Frontend logs (browser console)
# Check browser DevTools → Console tab
```

### Metrics

- **GeekAPI**: Monitor request latency and error rates
- **GeekRepository**: Monitor database query times
- **Frontend**: Monitor page load times and error tracking (if integrated)

---

## Rollback Plan

1. **Frontend**: Revert Vercel to previous deployment
2. **GeekAPI**: Restart Railway service or roll back container
3. **GeekRepository**: Restart Railway service or roll back container
4. **Database**: Keep automated backups; restore if needed

---

## Security Checklist

- [ ] `GEEK_BACKEND_API_KEY` rotated regularly
- [ ] `REPO_API_KEY` rotated regularly
- [ ] CORS origins pinned to specific domains (no wildcards)
- [ ] Database password is strong and stored securely
- [ ] HTTPS enforced in production
- [ ] API keys not logged or exposed in error messages
- [ ] JWT tokens have appropriate expiration
