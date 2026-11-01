import { useState } from 'react';
import type { ChainQuestion } from '../../types/content';
import { RichText, shuffle, type QProps } from './shared';

/** Fehlersuche Schritt für Schritt. Jede Wahl zeigt sofort Feedback, `next` bestimmt den nächsten Schritt. */
export function ChainQuestionView({ q, onResult, locked }: QProps<ChainQuestion>) {
  const [path, setPath] = useState<{ stepId: string; optionId: string }[]>([]);
  const [current, setCurrent] = useState<string | null>(q.steps[0].id);
  const step = (id: string) => q.steps.find((s) => s.id === id)!;
  // Optionen pro Schritt einmal mischen, sonst stünde die richtige Antwort immer an derselben Stelle
  const [order] = useState(() => Object.fromEntries(q.steps.map((s) => [s.id, shuffle(s.options)])));

  const choose = (optId: string) => {
    if (!current || locked) return;
    const s = step(current);
    const o = s.options.find((x) => x.id === optId)!;
    const nextPath = [...path, { stepId: current, optionId: optId }];
    setPath(nextPath);
    const idx = q.steps.findIndex((x) => x.id === current);
    const next = o.next ?? q.steps[idx + 1]?.id ?? null;
    setCurrent(next);
    if (!next) {
      const mistakes = nextPath
        .map((p) => ({ s: step(p.stepId), o: step(p.stepId).options.find((x) => x.id === p.optionId)! }))
        .filter((x) => !x.o.correct);
      onResult({
        correct: mistakes.length === 0,
        solution: q.steps.map((s) => s.options.find((o) => o.correct)?.text).filter(Boolean).join(' → '),
        whyWrong: mistakes.map((m) => `${m.s.text.split('\n')[0]} – „${m.o.text}“: ${m.o.feedback}`),
      });
    }
  };

  return (
    <div className="space-y-4">
      {path.map((p, i) => {
        const s = step(p.stepId);
        const o = s.options.find((x) => x.id === p.optionId)!;
        return (
          <div key={i} className={`rounded-xl border-l-4 p-3 text-sm ${o.correct ? 'border-emerald-500 bg-emerald-500/10' : 'border-rose-500 bg-rose-500/10'}`}>
            <div className="text-slate-400">Schritt {i + 1}</div>
            <RichText text={s.text} />
            <div className="mt-1 font-semibold">{o.correct ? '✅' : '❌'} {o.text}</div>
            <div className="text-slate-300">{o.feedback}</div>
          </div>
        );
      })}
      {current && !locked && (
        <div>
          <div className="mb-2 text-sm text-slate-400">Schritt {path.length + 1}</div>
          <RichText text={step(current).text} className="mb-3" />
          <div className="space-y-2">
            {order[current].map((o) => (
              <button key={o.id} type="button" onClick={() => choose(o.id)} className="w-full rounded-xl border-2 border-slate-700 p-3 text-left hover:border-cyan-400">
                {o.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
