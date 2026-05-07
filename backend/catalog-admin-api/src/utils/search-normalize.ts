function normalizeText(s?: string | null): string {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTokens(s?: string | null): string[] {
  const n = normalizeText(s);
  if (!n) return [];
  return Array.from(new Set(n.split(/\s+/).filter(Boolean)));
}

export function normalizeAndTokenize(...inputs: Array<string | undefined | null>): string[] {
  const out = new Set<string>();
  for (const v of inputs) {
    for (const t of extractTokens(v)) out.add(t);
  }
  return Array.from(out);
}

export function normalizeForBlob(...inputs: Array<string | undefined | null>): string {
  return normalizeText(inputs.filter(Boolean).join(" "));
}

export function normalizeArrayStrings(values?: Array<string | undefined | null>): string[] {
  if (!values) return [];
  const out = new Set<string>();
  for (const v of values) {
    const n = normalizeText(v ?? "");
    if (n) out.add(n);
  }
  return Array.from(out);
}
