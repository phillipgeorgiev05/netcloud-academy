// Prüft alle Inhalte auf Konsistenz. Läuft mit `npm test`.
import { describe, expect, it } from 'vitest';
import { levels, tracks } from './index';
import { certs } from './certs';
import { glossary } from './glossary';
import { decisionTree } from './decisions';
import { tickets } from './tickets';
import { supportTickets } from './support-tickets';
import { interviewCards } from './interview';
import type { Question } from '../types/content';

const MIN_QUIZ = 15;

function problems(q: Question): string[] {
  const errs: string[] = [];
  switch (q.type) {
    case 'single':
    case 'scenario':
    case 'multi': {
      const ids = q.options.map((o) => o.id);
      if (new Set(ids).size !== ids.length) errs.push('doppelte Option-IDs');
      const correct = q.type === 'multi' ? q.correct : [q.correct];
      correct.forEach((c) => !ids.includes(c) && errs.push(`correct "${c}" existiert nicht`));
      if (q.type === 'multi' && correct.length < 2) errs.push('multi braucht mind. 2 richtige');
      // Falsche Optionen ohne whyWrong sind erlaubt (Fallback), aber nicht erwünscht.
      q.options.filter((o) => !correct.includes(o.id) && !o.whyWrong).forEach((o) => errs.push(`Option "${o.id}" ohne whyWrong`));
      break;
    }
    case 'dragdrop':
      q.items.forEach((it) => {
        if (!q.buckets.some((b) => b.id === q.solution[it.id])) errs.push(`Item "${it.id}" ohne gültigen Bucket`);
      });
      break;
    case 'cli': {
      const n = (q.template.match(/\{\{\d+\}\}/g) ?? []).length;
      if (n !== q.blanks.length) errs.push(`${n} Lücken im Template, aber ${q.blanks.length} blanks`);
      break;
    }
    case 'topology': {
      const ids = q.nodes.map((n) => n.id);
      q.links.flatMap(([a, b]) => [a, b]).forEach((id) => !ids.includes(id) && errs.push(`Link zu unbekanntem Knoten "${id}"`));
      if (q.mode === 'click') q.correct.forEach((id) => !ids.includes(id) && errs.push(`correct "${id}" unbekannt`));
      else q.nodes.filter((n) => n.kind === 'unknown').forEach((n) => !q.choices.includes(q.solution[n.id]) && errs.push(`Lösung für "${n.id}" nicht in choices`));
      break;
    }
    case 'subnet':
      if (q.prefixRange[0] > q.prefixRange[1] || q.prefixRange[0] < 8 || q.prefixRange[1] > 30) errs.push('prefixRange ungültig');
      break;
    case 'ordering':
      if (q.items.length < 3) errs.push('ordering braucht mind. 3 Schritte');
      break;
    case 'chain': {
      const ids = q.steps.map((s) => s.id);
      q.steps.forEach((s) => {
        if (!s.options.some((o) => o.correct)) errs.push(`Schritt "${s.id}" ohne richtige Option`);
        s.options.forEach((o) => o.next && !ids.includes(o.next) && errs.push(`next "${o.next}" unbekannt`));
      });
      break;
    }
    case 'config': {
      const ids = q.toggles.map((t) => t.id);
      [...q.solution, ...q.requirements.flatMap((r) => r.needs)].forEach((id) => !ids.includes(id) && errs.push(`Schalter "${id}" unbekannt`));
      q.requirements.forEach((r) => r.needs.forEach((id) => !q.solution.includes(id) && errs.push(`Anforderung braucht "${id}", der nicht in solution ist`)));
      const nodeIds = (q.nodes ?? []).map((n) => n.id);
      (q.links ?? []).flatMap(([a, b]) => [a, b]).forEach((id) => !nodeIds.includes(id) && errs.push(`Link zu unbekanntem Knoten "${id}"`));
      break;
    }
  }
  if (q.certs?.length === 0) errs.push('certs leer');
  return errs;
}

describe('Zusatzinhalte', () => {
  it('Glossar: genug Begriffe aus mehreren Leveln', () => {
    expect(glossary.length).toBeGreaterThan(20);
    expect(new Set(glossary.map((g) => g.levelId)).size).toBeGreaterThan(1);
  });

  it('Entscheidungsbaum: alle Verweise existieren', () => {
    const ids = Object.keys(decisionTree);
    const errs = Object.values(decisionTree).flatMap((n) => ('options' in n ? n.options.filter((o) => !ids.includes(o.next)).map((o) => o.next) : []));
    expect(errs).toEqual([]);
    expect(ids).toContain('start');
  });

  it('Vorwissen-Verweise der Tracks zeigen auf vorhandene Level', () => {
    const basicsIds = levels.filter((l) => l.track === 'basics').map((l) => l.id);
    expect(basicsIds.length).toBe(tracks.basics.planned.length);
    const errs = Object.values(tracks).flatMap((t) => (t.basics ?? []).filter((id) => !levels.some((l) => l.id === id)));
    expect(errs).toEqual([]);
  });
});

describe('Service-Desk-Tickets', () => {
  it('mind. 20 Tickets, eindeutige IDs, alle Kategorien', () => {
    expect(tickets.length).toBeGreaterThanOrEqual(20);
    expect(new Set(tickets.map((t) => t.id)).size).toBe(tickets.length);
    expect(new Set(tickets.map((t) => t.category))).toEqual(new Set(['network', 'cloud', 'it']));
  });
  for (const t of tickets) {
    it(`Ticket ${t.id} gültig`, () => {
      expect(problems(t)).toEqual([]);
      expect(t.title && t.reporter && t.prompt && t.explanation).toBeTruthy();
      // learn darf auf ein geplantes, noch nicht geschriebenes Level zeigen
      if (t.learn) {
        const [track, n] = t.learn.split('-');
        const planned = tracks[({ net: 'network', cloud: 'cloud', fisi: 'fisi' } as const)[track as 'net']]?.planned.length ?? 0;
        expect(Number(n)).toBeGreaterThan(0);
        expect(Number(n)).toBeLessThanOrEqual(planned);
      }
    });
  }
});

describe('Ticket-Simulator (Teil D)', () => {
  const areas = certs.jobready.domains.map((d) => d.id);
  it('ca. 30 Tickets, eindeutige IDs, ein Teil auf Englisch, alle Bereiche', () => {
    expect(supportTickets.length).toBeGreaterThanOrEqual(30);
    expect(new Set(supportTickets.map((t) => t.id)).size).toBe(supportTickets.length);
    expect(supportTickets.filter((t) => t.lang === 'en').length).toBeGreaterThanOrEqual(6);
    expect(new Set(supportTickets.map((t) => t.difficulty))).toEqual(new Set([1, 2, 3]));
  });
  for (const t of supportTickets) {
    it(`Ticket ${t.id} gültig`, () => {
      expect(problems(t)).toEqual([]);
      expect(t.title && t.requester && t.company && t.prompt && t.explanation && t.doc.model).toBeTruthy();
      expect(areas).toContain(t.area);
      expect(t.steps.length).toBeGreaterThanOrEqual(3);
      expect(t.doc.points.length).toBeGreaterThanOrEqual(3);
      t.doc.points.forEach((p) => expect(p.keywords.length).toBeGreaterThan(0));
      if (t.learn) expect(levels.some((l) => l.id === t.learn)).toBe(true);
    });
  }
});

describe('Bewerbungsmodus', () => {
  const areas = certs.jobready.domains.map((d) => d.id);
  it('Karten: eindeutige IDs, jeder Bereich mit mind. 5 Karten', () => {
    expect(new Set(interviewCards.map((c) => c.id)).size).toBe(interviewCards.length);
    interviewCards.forEach((c) => expect(areas).toContain(c.area));
    for (const a of areas) expect(interviewCards.filter((c) => c.area === a || (a === 'english' && c.lang === 'en')).length).toBeGreaterThanOrEqual(5);
  });
});

describe('Inhalte', () => {
  it('Level-IDs eindeutig, Reihenfolge pro Track lückenlos', () => {
    expect(new Set(levels.map((l) => l.id)).size).toBe(levels.length);
    for (const track of ['basics', 'network', 'cloud', 'fisi', 'support'] as const) {
      const orders = levels.filter((l) => l.track === track).map((l) => l.order);
      expect(orders).toEqual(orders.map((_, i) => i + 1));
    }
  });

  for (const level of levels) {
    describe(level.id, () => {
      it(`hat mind. ${MIN_QUIZ} Quizfragen und einen Boss`, () => {
        expect(level.quiz.length).toBeGreaterThanOrEqual(MIN_QUIZ);
        expect(level.boss.questions.length).toBeGreaterThanOrEqual(5);
        expect(level.lesson.length).toBeGreaterThan(0);
      });

      it('Frage-IDs eindeutig innerhalb des Levels', () => {
        const ids = [...level.quiz, ...level.boss.questions].map((q) => q.id);
        expect(ids.length - new Set(ids).size).toBe(0);
      });

      it('alle Fragen konsistent', () => {
        const checks = level.lesson.flatMap((s) => (s.check ? [s.check] : []));
        const errs = [...level.quiz, ...level.boss.questions, ...checks].flatMap((q) => problems(q).map((e) => `${q.id}: ${e}`));
        expect(errs).toEqual([]);
      });

      it('Zertifikate, Prüfungsbereiche und Quellen gültig', () => {
        const errs: string[] = [];
        for (const [c, d] of Object.entries(level.domains ?? {}))
          if (!certs[c as keyof typeof certs].domains.some((x) => x.id === d)) errs.push(`Level-Domain ${c}:${d}`);
        for (const q of [...level.quiz, ...level.boss.questions]) {
          q.certs?.forEach((c) => !level.certs.includes(c) && errs.push(`${q.id}: cert ${c} gehört nicht zum Level`));
          if (q.domain && !level.certs.some((c) => certs[c].domains.some((x) => x.id === q.domain))) errs.push(`${q.id}: domain ${q.domain}`);
        }
        level.lesson.forEach((s) => s.sources?.forEach((src) => !src.url.startsWith('https://') && errs.push(`Quelle ohne https: ${src.url}`)));
        if (level.lab && level.lab.steps.length < 3) errs.push('Lab braucht mind. 3 Schritte');
        expect(errs).toEqual([]);
      });
    });
  }
});
