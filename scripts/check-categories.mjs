import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
function loadEnv() {
  const p = path.join(repoRoot, '.env');
  if (!fs.existsSync(p)) return {};
  const txt = fs.readFileSync(p, 'utf8');
  const out = {};
  for (const line of txt.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('='); if (i===-1) continue;
    const k = t.slice(0,i).trim(); let v = t.slice(i+1).trim(); if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1);
    out[k]=v;
  }
  return out;
}
(async ()=>{
  const env = loadEnv();
  const key = env.CATALOG_ADMIN_API_KEY || process.env.CATALOG_ADMIN_API_KEY;
  const base = env.CATALOG_ADMIN_API_URL || process.env.CATALOG_ADMIN_API_URL || 'http://127.0.0.1:4040';
  const url = `${base}/admin/catalog/categories/tree`;
  const headers = { 'accept': 'application/json' };
  if (key) headers.authorization = `Bearer ${key}`;
  try {
    const res = await fetch(url, { headers });
    const txt = await res.text();
    console.log('status', res.status);
    console.log(txt);
  } catch (e) { console.error('err', e); process.exit(2);} 
})();
