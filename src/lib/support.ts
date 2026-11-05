// Reine Logik für Ticket-Simulator und Bewerbungsmodus (Teil D). Inhalte kommen als Parameter, damit alles testbar bleibt.
import type { InterviewCard, Level, ReadinessArea, SupportTicket } from '../types/content';
import { reviewKey, SUPPORT_PASS, type Progress } from './progress';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ');

/** Welche Pflichtpunkte der Dokumentation sind im Text enthalten?
 *  shortcut: reine Stichwortsuche, erkennt keine Umschreibungen. Musterlösung zeigt das Fehlende. */
export function docHits(text: string, points: SupportTicket['doc']['points']): boolean[] {
  const t = norm(text);
  return points.map((p) => p.keywords.some((k) => t.includes(norm(k))));
}

/** Gesamtbewertung 0–100: 60 % Analyse (richtige Schritte beim ersten Versuch), 40 % Dokumentation. */
export function ticketScore(steps: number, mistakes: number, hits: boolean[]): number {
  const analysis = steps ? Math.max(0, steps - mistakes) / steps : 0;
  const doc = hits.length ? hits.filter(Boolean).length / hits.length : 0;
  return Math.round(analysis * 60 + doc * 40);
}

export function grade(score: number): string {
  if (score >= 90) return 'Sehr gut: so würde ein erfahrener 2nd-Level-Kollege arbeiten';
  if (score >= SUPPORT_PASS) return 'Gut: gelöst, an der Dokumentation oder Analyse geht noch was';
  if (score >= 50) return 'Ausbaufähig: Ursache oder Doku unvollständig';
  return 'Nicht gelöst: Musterlösung ansehen und nochmal bearbeiten';
}

/** Englische Tickets und Karten zählen zusätzlich für „Technisches Englisch“. */
const areasOf = (x: { area: ReadinessArea; lang: 'de' | 'en' }): ReadinessArea[] => (x.lang === 'en' && x.area !== 'english' ? [x.area, 'english'] : [x.area]);

export interface Readiness {
  area: ReadinessArea;
  /** 0–1 */
  value: number;
  parts: { label: string; done: number; total: number }[];
}

/** Job-Readiness pro Bereich: 50 % Fragen aus Teil D richtig, 30 % Simulator-Tickets gelöst, 20 % Interview-Karten gekonnt.
 *  Fehlt eine Quelle für einen Bereich, werden die übrigen Gewichte hochgerechnet. */
export function readiness(p: Progress, levels: Level[], tickets: SupportTicket[], cards: InterviewCard[], areas: ReadinessArea[]): Readiness[] {
  const questions = levels
    .filter((l) => l.certs.includes('jobready'))
    .flatMap((l) => [...l.quiz, ...l.boss.questions].map((q) => ({ key: reviewKey(l.id, q.id), area: (q.domain ?? l.domains?.jobready) as ReadinessArea })));
  return areas.map((area) => {
    const qs = questions.filter((q) => q.area === area);
    const ts = tickets.filter((t) => areasOf(t).includes(area));
    const cs = cards.filter((c) => areasOf(c).includes(area));
    const parts = [
      { label: 'Fragen', weight: 0.5, done: qs.filter((q) => p.solved[q.key]).length, total: qs.length },
      { label: 'Tickets', weight: 0.3, done: ts.filter((t) => (p.support[t.id] ?? 0) >= SUPPORT_PASS).length, total: ts.length },
      { label: 'Interview', weight: 0.2, done: cs.filter((c) => p.interview[c.id]).length, total: cs.length },
    ].filter((x) => x.total > 0);
    const weights = parts.reduce((s, x) => s + x.weight, 0);
    const value = weights ? parts.reduce((s, x) => s + (x.weight * x.done) / x.total, 0) / weights : 0;
    return { area, value, parts: parts.map(({ label, done, total }) => ({ label, done, total })) };
  });
}
