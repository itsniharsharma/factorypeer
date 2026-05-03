# Deployment guide

Factorypeer splits the stack into **Vercel** (Next.js storefront + admin UI) and **Render** (or any Node host) for **catalog-admin-api**. MongoDB is typically **MongoDB Atlas**; both services need the DB URI only where data lives (the API).

## Prerequisites

- Git repository connected to Vercel and Render (or equivalents).
- MongoDB Atlas cluster (or self-hosted Mongo) and connection string.
- Long random secrets for `CATALOG_ADMIN_API_KEY` (≥16 chars) and optional `NEXT_ADMIN_TOKEN`.

## Local development

1. **MongoDB** running locally or Atlas URI.
2. **Root** — copy patterns from `.env.example` into `.env.local` (Next) at repo root.
3. **catalog-admin-api** — from `backend/catalog-admin-api`: `npm install`, `npm run dev` (uses `tsx watch`; loads root `.env` / `.env.local` then optional `backend/catalog-admin-api/.env`).
4. **Next** — from repo root: `npm install`, `npm run dev`.

Default API URL: `http://127.0.0.1:4040`. Set `CATALOG_ADMIN_API_URL` in `.env.local` if different.

## Vercel (Next.js)

1. Import the Git repo; framework preset **Next.js** (root directory `/`).
2. **Environment variables** (Production / Preview as needed):

   | Variable | Notes |
   |----------|--------|
   | `CATALOG_ADMIN_API_URL` | HTTPS URL of deployed catalog-admin-api (no trailing slash). |
   | `CATALOG_ADMIN_API_KEY` | Same secret as Render `CATALOG_ADMIN_API_KEY`. |
   | `NEXT_ADMIN_TOKEN` | Optional; locks `/admin/*` behind `/admin/login`. |

3. Deploy. Build command: `npm run build`; Output: Next defaults. A root `vercel.json` is **not** required for this app.

**Node:** Match `engines` in root `package.json` (Node 20.x LTS is a safe choice on Vercel; Node 22 can hit toolchain edge cases locally).

## Render (catalog-admin-api)

### Option A — Blueprint (`render.yaml`)

1. **New** → **Blueprint** → select this repository.
2. Render detects `render.yaml` and creates the **factorypeer-catalog-admin-api** web service with `rootDir: backend/catalog-admin-api`.
3. In the service **Environment**, add:

   - `MONGODB_URI` — Atlas connection string (secret).
   - `CATALOG_ADMIN_API_KEY` — match Vercel (secret).
   - Optional: `CATALOG_TENANT_ID`, `LOG_LEVEL`.

4. Note **Public URL** of the service and set `CATALOG_ADMIN_API_URL` on Vercel to that URL.

### Option B — Manual Web Service

- **Root directory**: `backend/catalog-admin-api`
- **Build command**: `npm ci && npm run build`
- **Start command**: `npm start` → `node dist/server.js`
- **Health check path**: `/health`

Render sets `PORT`; the app reads `process.env.PORT` via existing config.

## Smoke checks

- API: `GET https://<api-host>/health` → `{ "ok": true }`.
- Next: open storefront; admin at `/admin` (and `/admin/login` if `NEXT_ADMIN_TOKEN` is set).
- Catalog proxy: admin UI loads taxonomy/products after API URL and optional API key are correct.

## Troubleshooting

- **401 from catalog API** — `CATALOG_ADMIN_API_KEY` mismatch between Vercel and Render, or missing on one side.
- **503 from `/api/admin/catalog/*`** — Next cannot reach `CATALOG_ADMIN_API_URL`; check URL, firewall, and that Render service is live.

See [env-reference.md](./env-reference.md) for variable ownership and load order.
