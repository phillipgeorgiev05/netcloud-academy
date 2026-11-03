import { useState } from 'react';
import { glossaryLinkFor } from '../content/glossary';
import type { Compare, Level, LessonSection } from '../types/content';
import { Diagram } from './Diagrams';
import { QuestionRenderer } from './questions/QuestionRenderer';
import { RichText, type Result } from './questions/shared';

/** Lektion in Häppchen: eine Karte pro Abschnitt, weiter erst nach der Kurzfrage. */
export function LessonView({ level, onDone }: { level: Level; onDone: () => void }) {
  const link = glossaryLinkFor(level.id);
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(0); // weiteste erreichte Karte, dorthin darf man zurückspringen
  const [answered, setAnswered] = useState<number[]>([]);
  const s = level.lesson[i];
  const last = i === level.lesson.length - 1;
  const canGo = !s.check || answered.includes(i);
  const go = (n: number) => {
    setI(n);
    setSeen((m) => Math.max(m, n));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-4 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={level.lesson.length} aria-valuenow={i + 1} aria-label="Karten der Lektion">
        {level.lesson.map((x, n) => (
          <button
            key={x.heading}
            type="button"
            onClick={() => n <= seen && go(n)}
            aria-label={`Karte ${n + 1}: ${x.heading}`}
            className={`h-1.5 flex-1 rounded-full transition-colors ${n < i ? 'bg-cyan-400' : n === i ? 'bg-cyan-400/60' : 'bg-slate-800'}`}
          />
        ))}
      </div>
      <div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-500">Karte {i + 1} von {level.lesson.length}</div>
      <Section key={i} s={s} link={link} onAnswered={() => setAnswered((a) => (a.includes(i) ? a : [...a, i]))} />
      <div className="mt-5 flex gap-3">
        {i > 0 && (
          <button type="button" onClick={() => go(i - 1)} className="rounded-full bg-slate-800 px-5 py-3 font-semibold hover:bg-slate-700">
            Zurück
          </button>
        )}
        <button
          type="button"
          disabled={!canGo}
          onClick={() => (last ? onDone() : go(i + 1))}
          className="flex-1 rounded-full bg-cyan-500 px-5 py-3 font-semibold text-snow hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {!canGo ? 'Erst die Kurzfrage beantworten' : last ? 'Lektion abschließen – zum Quiz' : 'Weiter'}
        </button>
      </div>
    </div>
  );
}

function Section({ s, link, onAnswered }: { s: LessonSection; link: (t: string) => string | undefined; onAnswered: () => void }) {
  return (
    <section className="anim-slide rounded-[22px] bg-slate-900 p-5">
      <h2 className="mb-3 text-[22px] font-bold leading-tight tracking-tight">{s.heading}</h2>
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
      {s.check && <CheckQuestion s={s} onAnswered={onAnswered} />}
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

function CheckQuestion({ s, onAnswered }: { s: LessonSection; onAnswered: () => void }) {
  const [result, setResult] = useState<Result | null>(null);
  const [round, setRound] = useState(0);
  return (
    <div className="mt-5 rounded-2xl bg-cyan-500/[0.07] p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">Kurz prüfen · zählt nicht</div>
      <QuestionRenderer key={round} q={s.check!} result={result} onResult={(r) => { setResult(r); onAnswered(); }} />
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
              <div className="text-[11px] uppercase tracking-wide text-slate-400">{f ? c.right : c.left}</div>
              <div className="font-semibold">{f ? r : l}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
