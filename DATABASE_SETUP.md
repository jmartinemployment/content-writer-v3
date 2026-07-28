# Database Setup — Supabase PostgreSQL

All Content Writer V3 services use a shared Supabase PostgreSQL database with schema `content-writer-3`.

## Architecture

```
Supabase PostgreSQL (content-writer-3 schema)
├── GeekOAuth (direct connection - exception for auth)
├── GeekRepository (via EF Core migrations)
└── GeekAPI (via GeekRepository HTTP)
```

**Exception Note:** GeekOAuth connects directly to Supabase (not through GeekRepository) because it must issue tokens before any other service can authenticate.

## Setup Steps

### 1. Create Schema in Supabase

```sql
-- Connect to Supabase and run:
CREATE SCHEMA "content-writer-3";
GRANT USAGE ON SCHEMA "content-writer-3" TO postgres;
GRANT CREATE ON SCHEMA "content-writer-3" TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "content-writer-3" GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "content-writer-3" GRANT ALL ON SEQUENCES TO postgres;
```

### 2. Start Services (Migrations Run Automatically)

GeekOAuth and GeekRepository run migrations automatically on startup via `db.Database.MigrateAsync()`. No manual migration steps needed.

**Terminal 1 — GeekOAuth:**
```bash
cd /Users/jeffmartin/development/GeekOAuth
export DATABASE_URL="postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require"
export ISSUER_URL="https://auth.geekatyourspot.com"
dotnet run --project src/GeekOAuth.Server
# Migrations run automatically on startup
```

**Terminal 2 — GeekRepository:**
```bash
cd /Users/jeffmartin/development/GeekBackend
export DATABASE_URL="postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require"
dotnet run --project GeekRepository/GeekRepository.csproj
# Migrations run automatically on startup
```

**Terminal 3 — GeekAPI:**
```bash
cd /Users/jeffmartin/development/GeekBackend
export REPO_URL=http://localhost:5050
export REPO_API_KEY=dev-key
dotnet run --project GeekAPI/GeekAPI.csproj
```

**Terminal 4 — Frontend:**
```bash
cd /Users/jeffmartin/development/content-writer-v3
export NEXT_PUBLIC_API_URL=http://localhost:5000/api/content-writer/v3
export NEXT_PUBLIC_GEEK_OAUTH_URL=http://localhost:8080
npm run dev
```

Tables will be created in the `content-writer-3` schema automatically.

### 3. Verify Schema

```sql
-- List all tables in content-writer-3 schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'content-writer-3' 
ORDER BY table_name;

-- Should include:
-- GeekRepository tables: campaigns, clients, assets, keywords, etc.
-- GeekOAuth tables: AspNetUsers, OpenIddictApplications, OpenIddictAuthorizations, etc.
```

## Local Development

For local PostgreSQL development, migrations run automatically on service startup:

```bash
# Create local database and schema
createdb postgres
psql -d postgres -c 'CREATE SCHEMA "content-writer-3";'

# Set local DATABASE_URL and start services
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=content-writer-3"

# Services run migrations automatically on startup
dotnet run --project GeekRepository/GeekRepository.csproj
dotnet run --project src/GeekOAuth.Server
```

## Environment Variables

### GeekOAuth

```
DATABASE_URL=postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require
ISSUER_URL=https://auth.geekatyourspot.com
SIGNING_CERT_BASE64=(required in production)
CORS_ORIGINS=https://content-writer.geekatyourspot.com,http://localhost:3000
```

### GeekRepository

```
DATABASE_URL=postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require
PORT=5050
```

### GeekAPI

```
REPO_URL=http://localhost:5050 (or Railway URL in production)
REPO_API_KEY=(API key)
CORS_ORIGINS=https://content-writer.geekatyourspot.com,http://localhost:3000
```

### Content Writer V3 Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/content-writer/v3
NEXT_PUBLIC_GEEK_OAUTH_URL=http://localhost:8080 (local) or https://auth.geekatyourspot.com (prod)
```

## Verification

### Test GeekOAuth Health

```bash
curl http://localhost:8080/health
# Should return 200 OK
```

### Test GeekRepository Health

```bash
curl http://localhost:5050/health
# Should return 200 OK
```

### Test GeekAPI Health

```bash
curl http://localhost:5000/health
# Should return 200 OK
```

### Test OAuth Flow

1. Open http://localhost:3000/login
2. Click "Sign in with GeekOAuth"
3. Should redirect to http://localhost:8080/Account/Login
4. After authentication, should return to http://localhost:3000/login with token
5. Should see dashboard with user info

## Troubleshooting

### Connection refused to Supabase

- Verify DATABASE_URL is correct
- Check Supabase project is active
- Verify credentials are correct
- Ensure `sslmode=require` is in connection string

### Schema not found

```sql
-- Check if schema exists
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name = 'content-writer-3';

-- If not, create it
CREATE SCHEMA "content-writer-3";
```

### Migration fails

- Check schema exists and is accessible
- Run migrations one at a time to identify which fails
- Check Supabase logs for detailed error messages

### Tables in wrong schema

- GeekRepository migrations should create tables in `content-writer-3`
- Verify `appsettings.json` includes `schema=content-writer-3` in connection string
- Clear migrations and rerun if needed

## References

- Supabase docs: https://supabase.com/docs/guides/database
- EF Core migrations: https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations
- GeekOAuth CLAUDE.md: Detailed OAuth server documentation
