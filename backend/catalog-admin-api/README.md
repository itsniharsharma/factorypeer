# Catalog admin API — CRUD foundation

Fastify HTTP service over MongoDB using `@factorypeer/catalog-models` (Mongoose). Intended for **admin-only** catalog operations (taxonomy, spec matrix, products/SKUs).

## Layout

| Layer | Responsibility |
|-------|----------------|
| `src/routes/` | HTTP handlers; parse params/body with **Zod** (`src/validation/`). |
| `src/services/` | Business rules: path rewriting on move/slug change, reorder validation, publish hooks, variant↔row linking. |
| `src/repositories/` | Mongoose queries — tenant scope + optional **`ExecOpts`** (`session`, `actorId`). |
| `src/db/connection.ts` | `connectMongo` + model registration. |
| `src/db/with-transaction.ts` | `withTransaction(fn)` — wraps Mongo **multi-document ACID** sessions. |
| `src/http/plugins/auth-context.ts` | **`registerCatalogAuthContext`** — actor placeholder (`X-Catalog-Actor-Id`). |
| `src/http/write-context.ts` | Maps request → `WriteContext` for services (audit). |
| `src/errors/domain.ts` | Domain-specific messages + stable **error codes**. |
| `src/composition-root.ts` | Wires repositories → services. |

## Audit & versioning

Mongoose **`timestamps`** continue to provide **`createdAt` / `updatedAt`**. Schemas in `@factorypeer/catalog-models` now include optional **`createdBy`**, **`updatedBy`** (ObjectIds), and **`documentVersion`** (incremented on each audited update). Writes pass an actor via header **`X-Catalog-Actor-Id`** (24-hex ObjectId). **`CatalogSpecSchema.version`** remains the schema-evolution counter (distinct from **`documentVersion`**).

## Pagination & filters

List endpoints keep their **JSON body shape** (arrays of documents). Total hits are returned in the **`X-Total-Count`** response header. Supported query params:

| Endpoint area | Query params |
|---------------|----------------|
| `GET /products` | `skip`, `limit` (max 200), `status`, `q` (title/slug substring), `sort` (`title`, `-title`, `updatedAt`, …) |
| `GET /products/:id/variants` | `skip`, `limit`, `status`, `q` (sku / item / mpn substring) |
| `GET /spec-schemas/:id/rows` | `skip`, `limit`, `status` |
| `GET /categories/.../children` | `status` |

## Transactions

These flows run inside **`withTransaction`**: category move & reorder-siblings; category slug change with subtree path rewrite; spec schema publish; spec row create **with** variant bindings; spec row update/replace **bindings**; spec row reorder; product variant **link-row**.

## Environment

Copy `env.example` to **`.env`** in this package (loaded automatically via `dotenv` when starting the server). The Next.js app does **not** connect to Mongo directly; only this API uses `MONGODB_URI`.

| Variable | Default |
|----------|---------|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/factorypeer_catalog` if unset (use `.env` for Atlas or local) |
| `PORT` | `4040` |
| `HOST` | `0.0.0.0` |
| `CATALOG_TENANT_ID` | _(optional)_ 24-char hex ObjectId for multi-tenant filtering |
| `UPSTASH_REDIS_REST_URL` | _(optional)_ Upstash Redis REST base URL used for cache invalidation |
| `UPSTASH_REDIS_REST_TOKEN` | _(optional)_ Upstash Redis REST token used for cache invalidation |

**Atlas:** URI must include the database name at the end, e.g. `...mongodb.net/factorypeer_catalog?retryWrites=true&w=majority`.

**Network access:** In Atlas → **Network Access**, allow your IP (or `0.0.0.0/0` for dev). Without this, connections fail (sometimes as TLS `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR` on Windows).

**TLS / Windows:** If you still see that SSL alert when connecting, the app defaults to **IPv4** (`family: 4`, `autoSelectFamily: false`). Override with `MONGODB_DNS_FAMILY=auto` or `6` if needed.

## Scripts

```bash
npm install
npm run dev      # tsx watch src/server.ts
npm run build    # tsc → dist/
npm run start    # node dist/server.js
npm run typecheck
```

## Route map (prefix `/admin/catalog`)

### Categories

| Method | Path | Notes |
|--------|------|------|
| GET | `/categories/tree` | Nested tree for admin |
| GET | `/categories/root/children` | Query `status`; top-level nodes |
| GET | `/categories/:id/children` | Query `status`; direct children |
| GET | `/categories/:id` | Single node |
| POST | `/categories` | Create (computes `path`) |
| PATCH | `/categories/:id` | Update (slug → subtree path rewrite) |
| POST | `/categories/:id/move` | Body `{ newParentId }` — null = move to root |
| POST | `/categories/:id/reorder-siblings` | Body `{ orderedIds }` |
| PATCH | `/categories/:id/kind` | `{ kind: branch \| family }` |
| PATCH | `/categories/:id/active-spec-schema` | `{ specSchemaId }` |
| DELETE | `/categories/:id` | Fails if children exist |

### Spec schema / columns / rows

| Method | Path | Notes |
|--------|------|------|
| GET | `/taxonomy/:categoryId/spec-schema` | Active schema doc or null |
| POST | `/taxonomy/:categoryId/spec-schema` | Create draft schema for **family** node |
| PATCH | `/spec-schemas/:id` | Update header |
| POST | `/spec-schemas/:id/publish` | Sets published + updates category `activeSpecSchemaId` |
| GET/POST | `/spec-schemas/:id/columns` | List / add column |
| PATCH/DELETE | `/spec-columns/:id` | Update / delete column |
| GET | `/spec-schemas/:id/rows` | Pagination/filter query params; **`X-Total-Count`** header |
| POST | `/spec-schemas/:id/rows/reorder` | Body `{ orderedIds }` |
| POST | `/spec-schemas/:id/rows` | Create row + optional variant bindings |
| PATCH | `/spec-rows/:id` | Update row |
| POST | `/spec-rows/:id/bindings` | Replace bindings array |
| DELETE | `/spec-rows/:id` | |

### Products / variants

| Method | Path | Notes |
|--------|------|------|
| GET | `/products` | See pagination table; **`X-Total-Count`** |
| GET | `/products/:id/variants` | Query pagination + filters; **`X-Total-Count`** |
| POST | `/products/:id/variants` | Create SKU |
| GET | `/products/:id` | Product shell |
| POST | `/products` | Create product |
| PATCH | `/products/:id` | Update |
| DELETE | `/products/:id` | Fails if variants remain |
| PATCH | `/products/variants/:id` | Update variant |
| DELETE | `/products/variants/:id` | |
| POST | `/products/variants/:id/link-row` | Body `{ specRowId, syncBindings?, bindingRole? }` |

### Health

`GET /health` → `{ ok: true }`

## Library usage (no HTTP)

From the monorepo, depend on this package (e.g. `"@factorypeer/catalog-admin-api": "file:../catalog-admin-api"`) or import by relative path. Use `createCatalogAdminServices(models, tenantId)` after `connectMongo` / `registerCatalogModels` for tests or a custom server; `buildApp(services)` returns a configured Fastify instance.

## Next steps (not in scope here)

- AuthZ / admin-only middleware  
- Transactions around multi-collection writes  
- Cascade deletes / archive workflows  
- Next.js Route Handlers proxying to this service  
