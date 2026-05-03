/**
 * Constant-time string equality (Edge-safe; avoids leaking length via early exit).
 */
export function timingSafeStringEqual(expected: string, actual: string): boolean {
  if (expected.length !== actual.length) return false;
  let out = 0;
  for (let i = 0; i < expected.length; i++) {
    out |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  }
  return out === 0;
}
