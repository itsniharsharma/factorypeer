/**
 * Load monorepo-root `.env` / `.env.local` before `config.ts` reads `process.env`.
 * Keeps a single env source for local dev (run API from `backend/catalog-admin-api` or anywhere).
 */
import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Repository root: backend/catalog-admin-api/src -> ../../../ */
const monorepoRoot = resolve(__dirname, "../../..");

config({ path: resolve(monorepoRoot, ".env") });
config({ path: resolve(monorepoRoot, ".env.local"), override: true });
