// Glossar = alle `terms` aus allen Lektionen. Ein Begriff gehört zu dem Level, in dem er zuerst vorkommt.
import { levels } from './index';
import type { Term } from '../types/content';

export interface GlossaryEntry extends Term {
  levelId: string;
  levelTitle: string;
}

const seen = new Set<string>();
export const glossary: GlossaryEntry[] = levels
  .flatMap((l) => l.lesson.flatMap((s) => (s.terms ?? []).map((t) => ({ ...t, levelId: l.id, levelTitle: l.title }))))
  .filter((g) => {
    const k = g.de.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  })
  .sort((a, b) => a.de.localeCompare(b.de, 'de'));

// Suchschlüssel: deutscher Begriff, englischer Begriff ohne Klammer und die Abkürzung in Klammern, z. B. „VLAN“.
const index = new Map<string, GlossaryEntry>();
for (const g of glossary) {
  const keys = [g.de, g.en.replace(/\s*\(.*\)\s*/, ''), g.en.match(/\(([^)]+)\)/)?.[1]];
  keys.filter(Boolean).forEach((k) => {
    const key = k!.toLowerCase().trim();
    if (key.length > 2 && !index.has(key)) index.set(key, g);
  });
}

/** Liefert für einen **fetten** Begriff den Link zum Level, in dem er eingeführt wurde, aber nur aus anderen Leveln. */
export const glossaryLinkFor = (currentLevelId: string) => (term: string) => {
  const g = index.get(term.toLowerCase().trim());
  return g && g.levelId !== currentLevelId ? `/level/${g.levelId}` : undefined;
};
