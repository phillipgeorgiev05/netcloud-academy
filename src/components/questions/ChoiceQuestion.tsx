import { useMemo, useState } from 'react';
import type { MultiQuestion, SingleQuestion } from '../../types/content';
import { CheckButton, RichText, shuffle, type QProps } from './shared';

const FALLBACK_WRONG = 'Diese Antwort trifft hier nicht zu.';

export function ChoiceQuestion({ q, onResult, locked }: QProps<SingleQuestion | MultiQuestion>) {
  const multi = q.type === 'multi';
  const correctIds = multi ? q.correct : [q.correct];
  const options = useMemo(() => shuffle(q.options), [q]);
  const [sel, setSel] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (locked) return;
    setSel((s) => (multi ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id]));
  };

  const text = (id: string) => q.options.find((x) => x.id === id)!.text;

  const check = () => {
    const correct = sel.length === correctIds.length && sel.every((id) => correctIds.includes(id));
    const whyWrong = [
      ...sel
        .filter((id) => !correctIds.includes(id))
        .map((id) => `„${text(id)}“: ${q.options.find((x) => x.id === id)!.whyWrong ?? FALLBACK_WRONG}`),
      ...(multi ? correctIds.filter((id) => !sel.includes(id)).map((id) => `Gefehlt hat: „${text(id)}“`) : []),
    ];
    const others = q.options
      .filter((o) => !correctIds.includes(o.id) && !sel.includes(o.id))
      .map((o) => `„${o.text}“: ${o.whyWrong ?? FALLBACK_WRONG}`);
    onResult({ correct, whyWrong, others, solution: correctIds.map(text).join(' · ') });
  };

  return (
    <div>
      {q.type !== 'multi' && q.scenario && (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
          <div className="mb-1 font-semibold text-amber-300">Szenario</div>
          <RichText text={q.scenario} />
        </div>
      )}
      {multi && <p className="mb-2 text-sm text-slate-400">Mehrere Antworten möglich.</p>}
      <div className="space-y-2">
        {options.map((o) => {
          const chosen = sel.includes(o.id);
          const isRight = correctIds.includes(o.id);
          const color = locked
            ? isRight
              ? 'border-emerald-500 bg-emerald-500/15'
              : chosen
                ? 'border-rose-500 bg-rose-500/15'
                : 'border-slate-700 opacity-60'
            : chosen
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-slate-700 hover:border-slate-500';
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              aria-pressed={chosen}
              className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition ${color}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${multi ? 'rounded' : 'rounded-full'} ${
                  chosen ? 'border-cyan-400 bg-cyan-400' : 'border-slate-500'
                }`}
              >
                {chosen && <span className="text-xs text-ink">✓</span>}
              </span>
              <RichText text={o.text} />
            </button>
          );
        })}
      </div>
      {!locked && <CheckButton disabled={!sel.length} onClick={check} />}
    </div>
  );
}
