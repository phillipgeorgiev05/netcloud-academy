// IPv6-Hilfsfunktionen: expandieren, nach RFC 5952 kürzen, Eingaben normalisieren.

/** Liefert 8 Hextets als Zahlen oder null, wenn die Eingabe keine gültige IPv6-Adresse ist. */
export function parseIPv6(input: string): number[] | null {
  const s = input.trim().toLowerCase();
  if (!/^[0-9a-f:]+$/.test(s) || (s.match(/::/g) ?? []).length > 1 || s.includes(':::')) return null;
  const [head, tail] = s.includes('::') ? s.split('::') : [s, undefined];
  const part = (x: string) => (x === '' ? [] : x.split(':'));
  const h = part(head);
  const t = tail === undefined ? [] : part(tail);
  const missing = 8 - h.length - t.length;
  if (tail === undefined ? h.length !== 8 : missing < 1) return null;
  const groups = [...h, ...Array(tail === undefined ? 0 : missing).fill('0'), ...t];
  if (groups.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return null;
  return groups.map((g) => parseInt(g, 16));
}

export const expandIPv6 = (h: number[]) => h.map((x) => x.toString(16).padStart(4, '0')).join(':');

/** RFC 5952: Kleinbuchstaben, führende Nullen weg, längste Nullfolge (≥ 2 Blöcke, bei Gleichstand die erste) als ::. */
export function compressIPv6(h: number[]): string {
  let bestStart = -1;
  let bestLen = 0;
  for (let i = 0; i < 8; ) {
    if (h[i] !== 0) {
      i++;
      continue;
    }
    let j = i;
    while (j < 8 && h[j] === 0) j++;
    if (j - i > bestLen) {
      bestStart = i;
      bestLen = j - i;
    }
    i = j;
  }
  const hex = h.map((x) => x.toString(16));
  if (bestLen < 2) return hex.join(':');
  return `${hex.slice(0, bestStart).join(':')}::${hex.slice(bestStart + bestLen).join(':')}`;
}

/** Normalisiert eine Adresse (optional mit /Präfix) auf die RFC-5952-Form, sonst null. */
export function normalizeIPv6(input: string): string | null {
  const [addr, prefix] = input.trim().split('/');
  const h = parseIPv6(addr);
  if (!h || (prefix !== undefined && !/^\d{1,3}$/.test(prefix))) return null;
  return compressIPv6(h) + (prefix !== undefined ? `/${Number(prefix)}` : '');
}

/** MAC (aa:bb:cc:dd:ee:ff) -> EUI-64-Interface-ID als 4 Hextets. */
export function eui64(mac: string): number[] {
  const b = mac.split(/[:-]/).map((x) => parseInt(x, 16));
  const bytes = [b[0] ^ 0x02, b[1], b[2], 0xff, 0xfe, b[3], b[4], b[5]];
  return [0, 2, 4, 6].map((i) => (bytes[i] << 8) | bytes[i + 1]);
}
