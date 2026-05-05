import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'url';

// Lightweight .env loader (no deps) — load repo root .env and .env.local
function loadDotEnvFiles(repoRoot) {
  const files = [path.join(repoRoot, '.env.local'), path.join(repoRoot, '.env')];
  for (const f of files) {
    try {
      if (!fs.existsSync(f)) continue;
      const txt = fs.readFileSync(f, 'utf8');
      for (const line of txt.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        // remove surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) process.env[key] = val;
      }
    } catch (e) {
      // ignore
    }
  }
}

function getApiBase() {
  return process.env.CATALOG_ADMIN_API_URL || "http://127.0.0.1:4040";
}

function getAdminAuthHeaders() {
  const key = process.env.CATALOG_ADMIN_API_KEY || "";
  return key ? { authorization: `Bearer ${key}` } : {};
}

function log(...a) { console.log(new Date().toISOString(), ...a); }

async function api(method, suffix, opts = {}) {
  const url = `${getApiBase()}/admin/catalog${suffix}`;
  const headers = { ...(opts.headers || {}), ...getAdminAuthHeaders() };
  if (opts.json && !(opts.body instanceof FormData)) {
    headers['content-type'] = 'application/json';
  }
  // Safe debug: indicate whether Authorization header will be sent
  try {
    const hasAuth = !!headers.authorization || !!headers.Authorization;
    log('[http] ->', method, url, 'auth:', hasAuth ? 'yes' : 'no');
  } catch (e) {}
  const res = await fetch(url + (opts.query || ''), {
    method,
    headers,
    body: opts.body,
  });
  const txt = await res.text();
  let json;
  try { json = txt ? JSON.parse(txt) : undefined; } catch(e) { json = txt; }
  return { status: res.status, headers: res.headers, body: json };
}

async function uploadMedia(localPath, folder) {
  const mime = (() => {
    const ext = path.extname(localPath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.png') return 'image/png';
    if (ext === '.webp') return 'image/webp';
    if (ext === '.gif') return 'image/gif';
    return 'application/octet-stream';
  })();

  const boundary = `----fp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const CRLF = '\r\n';
  const filename = path.basename(localPath);
  const pre = Buffer.from(
    `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"${CRLF}` +
      `Content-Type: ${mime}${CRLF}${CRLF}`,
    'utf8',
  );
  const post = Buffer.from(`${CRLF}--${boundary}--${CRLF}`, 'utf8');
  const fileBuf = fs.readFileSync(localPath);
  const body = Buffer.concat([pre, fileBuf, post]);

  const headers = { ...(getAdminAuthHeaders() || {}), 'content-type': `multipart/form-data; boundary=${boundary}`, 'content-length': String(body.length) };
  const url = `${getApiBase()}/admin/catalog/media/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`;
  const res = await fetch(url, { method: 'POST', headers, body });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, body: json };
}

async function createCategory(slug, title, kind='branch', parentId=null) {
  const body = { slug, title, kind, status: 'published' };
  if (parentId) body.parentId = parentId;
  const res = await api('POST', '/categories', { json: true, body: JSON.stringify(body) });
  if (res.status === 409) {
    // find existing category id from tree
    const tree = await api('GET', '/categories/tree');
    const nodes = Array.isArray(tree.body) ? tree.body : [];
    const found = (function find(nodes) {
      for (const n of nodes) {
        if (n.slug === slug) return n;
        if (Array.isArray(n.children) && n.children.length) {
          const f = find(n.children);
          if (f) return f;
        }
      }
      return null;
    })(nodes);
    if (found) return { status: 200, body: found };
  }
  return res;
}

async function createProduct(spec) {
  const res = await api('POST', '/products', { json: true, body: JSON.stringify(spec) });
  if (res.status === 409) {
    // try to find existing product by listing
    const list = await api('GET', '/products?limit=200');
    const items = Array.isArray(list.body) ? list.body : [];
    const f = items.find((p) => p.slug === spec.slug);
    if (f) return { status: 200, body: f };
  }
  return res;
}

async function createVariant(productId, body) {
  return api('POST', `/products/${productId}/variants`, { json: true, body: JSON.stringify(body) });
}

async function createSpecSchemaForCategory(categoryId, title) {
  const body = { title };
  return api('POST', `/taxonomy/${categoryId}/spec-schema`, { json: true, body: JSON.stringify(body) });
}

async function addColumn(schemaId, col) {
  return api('POST', `/spec-schemas/${schemaId}/columns`, { json: true, body: JSON.stringify(col) });
}

async function addRow(schemaId, row) {
  return api('POST', `/spec-schemas/${schemaId}/rows`, { json: true, body: JSON.stringify(row) });
}

async function run() {
  log('Seeder started, API base', getApiBase());
  try {
    // Resolve repo root relative to this script file so script can be run from any CWD
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const repoRoot = path.resolve(__dirname, '..');

    // Load .env files into process.env if present (don't override existing env vars)
    loadDotEnvFiles(repoRoot);

    // Safe debug: report presence of key envs (do NOT print values)
    log('ENV: CATALOG_ADMIN_API_KEY present?', !!process.env.CATALOG_ADMIN_API_KEY);
    log('ENV: CATALOG_ADMIN_API_URL', process.env.CATALOG_ADMIN_API_URL ? '(present)' : '(missing)');

    const seedImage = path.join(repoRoot, 'public', 'images', 'landing-top-1.jpg');
    if (!fs.existsSync(seedImage)) throw new Error('Seed image not found: ' + seedImage);

    const categories = [
      { slug: 'safety-equipment', title: 'Safety Equipment' },
      { slug: 'electrical-components', title: 'Electrical Components' },
      { slug: 'power-tools', title: 'Power Tools' },
      { slug: 'material-handling', title: 'Material Handling' },
    ];

    const createdCats = {};
    for (const c of categories) {
      log('Creating category', c.slug);
      const r = await createCategory(c.slug, c.title, 'family');
      log('=>', r.status);
      if (r.status >= 300) { console.error('Category create failed', r.body); continue; }
      const id = r.body._id ?? r.body.id ?? r.body._doc?._id;
      createdCats[c.slug] = id;
    }

    // For each category, create 2 products with variants and upload image
    const results = [];
    for (const c of categories) {
      const catId = createdCats[c.slug];
      if (!catId) continue;
      // create spec schema for category
      log('Creating spec schema for', c.slug);
      const sres = await createSpecSchemaForCategory(catId, `${c.title} Spec Schema`);
      log('spec-schema', sres.status);
      const schemaId = sres.body._id ?? sres.body.id;
      if (schemaId) {
        await addColumn(schemaId, { label: 'Weight', dataType: 'string' });
        await addColumn(schemaId, { label: 'Dimensions', dataType: 'string' });
        await addRow(schemaId, { values: { '0': '1.2kg', '1': '10x5x3' } });
        // publish
        await api('POST', `/spec-schemas/${schemaId}/publish`);
        // attach active schema to category
        await api('PATCH', `/categories/${catId}/active-spec-schema`, { json: true, body: JSON.stringify({ specSchemaId: schemaId }) });
      }

      for (let i = 1; i <= 2; i++) {
        const slug = `${c.slug}-product-${i}`;
        const title = `${c.title} Item ${i}`;
        const prodSpec = {
          slug,
          title,
          brand: 'Acme Corp',
          status: 'published',
          categoryIds: [catId],
          longDescription: `${title} — industrial grade item for ${c.title}.`,
          marketingBullets: ['High quality', 'Industrial grade'],
        };
        log('Creating product', slug);
        const p = await createProduct(prodSpec);
        log('product create', p.status);
        if (p.status >= 300) { console.error('Product failed', p.body); continue; }
        const pid = p.body._id ?? p.body.id;
        // upload image
        log('Uploading image for', slug);
        const up = await uploadMedia(seedImage, `catalog/${c.slug}`);
        log('upload', up.status, up.body?.publicId ? up.body.publicId : up.body);
        const media = up.status === 200 ? [{ url: up.body.url, publicId: up.body.publicId, alt: title }] : [];
        // patch product with media
        await api('PATCH', `/products/${pid}`, { json: true, body: JSON.stringify({ media }) });
        // add variant
        // Keep variants in draft unless a specRowId is provided (family categories require spec rows for published variants)
        const v = { sku: `${slug}-sku`, unitPrice: '99.00', currency: 'USD', status: 'draft' };
        const vr = await createVariant(pid, v);
        log('variant', vr.status);
        results.push({ category: c.slug, product: slug, productId: pid, variant: v.sku });
      }
    }

    log('Seed complete. Created items:', results.length);
    console.log(JSON.stringify({ categories: createdCats, items: results }, null, 2));

    // Validation quick checks: fetch category tree and sample product list
    const tree = await api('GET', '/categories/tree');
    log('/categories/tree', tree.status);
    const listSample = await api('GET', '/products?limit=10');
    log('/products?limit=10', listSample.status, listSample.body?.length ?? 'n/a');

  } catch (e) {
    console.error('Seeder error', e);
    process.exitCode = 2;
  }
}

run();
