import { useState } from 'react';
import { glossaryLinkFor } from '../content/glossary';
import type { Compare, Level, LessonSection } from '../types/content';
import { Diagram } from './Diagrams';
import { QuestionRenderer } from './questions/QuestionRenderer';
import { RichText, type Result } from './questions/shared';

export function LessonView({ level }: { level: Level }) {
  const link = glossaryLinkFor(level.id);
  return (
    <div className="space-y-6">
      {level.lesson.map((s) => (
        <Section key={s.heading} s={s} link={link} />
      ))}
    </div>
  );
}

function Section({ s, link }: { s: LessonSection; link: (t: string) => string | undefined }) {
  return (
    <section className="rounded-2xl bg-slate-900 p-4">
      <h2 className="mb-2 text-lg font-semibold text-cyan-300">{s.heading}</h2>
      <RichText text={s.body} link={link} />
      {s.diagram && <Diagram id={s.diagram} />}
      {s.compare && <FlipCards c={s.compare} />}
      {s.analogy && (
        <div className="mt-3 rounded-lg bg-amber-400/10 p-3 text-sm">
          <span className="font-semibold text-amber-300">💡 Alltagsanalogie: </span>
          {s.analogy}
        </div>
      )}
      {s.terms && (
        <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
          {s.terms.map((t) => (
            <div key={t.de} className="flex gap-2">
              <dt className="text-slate-300">{t.de}</dt>
              <dd className="text-slate-500">= {t.en}</dd>
            </div>
          ))}
        </dl>
      )}
      {s.check && <CheckQuestion s={s} />}
      {s.sources && (
        <div className="mt-3 text-xs text-slate-400">
          📚 Zum Nachlesen:{' '}
          {s.sources.map((src, i) => (
            <span key={src.url}>
              {i > 0 && ' · '}
              <a href={src.url} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{src.title}</a>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function CheckQuestion({ s }: { s: LessonSection }) {
  const [result, setResult] = useState<Result | null>(null);
  const [round, setRound] = useState(0);
  return (
    <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">🤔 Kurz prüfen (zählt nicht)</div>
      <QuestionRenderer key={round} q={s.check!} result={result} onResult={setResult} />
      {result && !result.correct && (
        <button type="button" onClick={() => { setResult(null); setRound(round + 1); }} className="mt-3 text-sm text-cyan-400 underline">
          Nochmal versuchen
        </button>
      )}
    </div>
  );
}

function FlipCards({ c }: { c: Compare }) {
  const [flipped, setFlipped] = useState<number[]>([]);
  return (
    <div className="mt-3">
      <div className="mb-2 text-xs text-slate-400">Antippen zum Umdrehen: {c.left} → {c.right}</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {c.rows.map(([l, r], i) => {
          const f = flipped.includes(i);
          return (
            <button
              key={l}
              type="button"
              onClick={() => setFlipped((x) => (f ? x.filter((y) => y !== i) : [...x, i]))}
              className={`min-h-16 rounded-xl border-2 p-2 text-sm transition ${f ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800'}`}
              aria-label={`${c.left}: ${l}. ${f ? `${c.right}: ${r}` : 'umdrehen'}`}
            >
              <div className="text-[10px] uppercase tracking-wide text-slate-400">{f ? c.right : c.left}</div>
              <div className="font-semibold">{f ? r : l}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
