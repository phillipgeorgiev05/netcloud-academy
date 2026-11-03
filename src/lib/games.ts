/** Reine Logik der Mini-Spiele in den Lektionen (Anzeige in components/MiniGames.tsx). */

/** 9 Rechte (u/g/o × r/w/x) → Oktal wie `750` und symbolisch wie `rwxr-x---`. */
export function chmodOf(bits: boolean[]): { octal: string; symbolic: string } {
  let octal = '';
  let symbolic = '';
  for (let who = 0; who < 3; who++) {
    const [r, w, x] = bits.slice(who * 3, who * 3 + 3);
    octal += String((r ? 4 : 0) + (w ? 2 : 0) + (x ? 1 : 0));
    symbolic += (r ? 'r' : '-') + (w ? 'w' : '-') + (x ? 'x' : '-');
  }
  return { octal, symbolic };
}

export type GpoLevel = 'L' | 'S' | 'D' | 'OU';
export const GPO_ORDER: GpoLevel[] = ['L', 'S', 'D', 'OU'];
export interface GpoLink { value: string | null; enforced?: boolean } // null = nicht konfiguriert

/**
 * Welche Einstellung gilt nach LSDOU? Verarbeitet wird L → S → D → OU, die letzte konfigurierte gewinnt.
 * Erzwungen (enforced) dreht das um: Die am weitesten oben erzwungene GPO gewinnt gegen alles darunter.
 */
export function lsdouWinner(links: Record<GpoLevel, GpoLink>): { value: string | null; from: GpoLevel | null } {
  const enforced = GPO_ORDER.find((l) => links[l].value !== null && links[l].enforced);
  if (enforced) return { value: links[enforced].value, from: enforced };
  const last = [...GPO_ORDER].reverse().find((l) => links[l].value !== null);
  return last ? { value: links[last].value, from: last } : { value: null, from: null };
}
