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

### 2. Run GeekRepository Migrations

```bash
cd /Users/jeffmartin/development/GeekBackend

# Set environment variables
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require"

# Run migrations
dotnet ef database update --project GeekRepository/GeekRepository.csproj
```

### 3. Run GeekOAuth Migrations

```bash
cd /Users/jeffmartin/development/GeekOAuth

# Set environment variables
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres?schema=content-writer-3&sslmode=require"
export ISSUER_URL="https://auth.geekatyourspot.com"
export DATA_PROTECTION_PURPOSE="GeekOAuth-production"

# Run migrations (OpenIddict tables only)
dotnet ef database update --project src/GeekOAuth.Server/GeekOAuth.Server.csproj --context OpenIddictDbContext

# Run identity tables (run once)
psql "$DATABASE_URL" -f src/GeekOAuth.Server/Data/identity_tables.sql
```

### 4. Verify Schema

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

For local PostgreSQL development:

```bash
# Create local database
createdb postgres

# Create schema
psql -d postgres -c 'CREATE SCHEMA "content-writer-3";'

# Run migrations with local connection
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=content-writer-3"
dotnet ef database update --project GeekRepository/GeekRepository.csproj
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
