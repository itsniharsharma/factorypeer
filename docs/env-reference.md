# Environment variables reference

Canonical template: **`.env.example`** at the repository root. Use it as the single source of truth when copying values into Vercel, Render, or local files.

## Ownership matrix

| Variable | Vercel | Render (catalog-admin-api) | Shared |
|----------|--------|----------------------------|--------|
| `CATALOG_ADMIN_API_URL` | ✓ (HTTPS URL of API) | — | — |
| `CATALOG_ADMIN_API_KEY` | ✓ | ✓ | Same value on both |
| `NEXT_ADMIN_TOKEN` | ✓ | — | — |
| `NEXT_PUBLIC_CATALOG_ACTOR_ID` | ✓ | — | — |
| `MONGODB_URI` | — | ✓ | — |
| `PORT` | — | ✓ (often auto on Render) | — |
| `HOST` | — | ✓ (`0.0.0.0` typical) | — |
| `CATALOG_TENANT_ID` | — | ✓ optional | — |
| `LOG_LEVEL` | — | ✓ optional | — |

## Local file layout

| File | Purpose |
|------|---------|
| Repo root `.env` | Optional shared defaults (not required). |
| Repo root `.env.local` | Next.js local overrides; gitignored. |
| `backend/catalog-admin-api/.env` | API-only overrides; gitignored. |

## Load order (catalog-admin-api process)

Defined in `backend/catalog-admin-api/src/bootstrap-env.ts`:

1. Monorepo root `.env`
2. Monorepo root `.env.local` (overrides 1)
3. `backend/catalog-admin-api/.env` (overrides 1–2)

Next.js loads `.env*` per [Next.js env rules](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) from the **project root** only.

## Next.js server-only vs public

- **`NEXT_PUBLIC_*`** — exposed to the browser bundle.
- **`CATALOG_ADMIN_API_URL`**, **`CATALOG_ADMIN_API_KEY`**, **`NEXT_ADMIN_TOKEN`** — server-only (API routes, Server Components, middleware); never prefix with `NEXT_PUBLIC_`.

## Generating secrets

```bash
openssl rand -hex 24
```

Use ≥16 characters for `CATALOG_ADMIN_API_KEY` (API validation).
