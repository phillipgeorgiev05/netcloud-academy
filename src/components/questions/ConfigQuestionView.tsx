import { useState } from 'react';
import type { ConfigQuestion } from '../../types/content';
import { CheckButton, type QProps } from './shared';
import { TopologyCanvas } from './TopologyQuestionView';

/** Baukasten: Schalter setzen. Richtig, wenn genau die nötigen an sind; Feedback pro Anforderung und pro Schalter. */
export function ConfigQuestionView({ q, onResult, locked }: QProps<ConfigQuestion>) {
  const [on, setOn] = useState<string[]>([]);
  const text = (id: string) => q.toggles.find((t) => t.id === id)!.text;

  const check = () => {
    const extra = on.filter((id) => !q.solution.includes(id));
    const missing = q.solution.filter((id) => !on.includes(id));
    const unmet = q.requirements.filter((r) => !r.needs.every((id) => on.includes(id)));
    onResult({
      correct: extra.length === 0 && missing.length === 0,
      solution: q.solution.map(text).join(' · '),
      whyWrong: [
        ...unmet.map((r) => `Nicht erfüllt: ${r.text}`),
        ...extra.map((id) => `Unnötig/falsch: „${text(id)}“ – ${q.toggles.find((t) => t.id === id)!.why}`),
        ...missing.map((id) => `Fehlt: „${text(id)}“ – ${q.toggles.find((t) => t.id === id)!.why}`),
      ],
    });
  };

  return (
    <div>
      {q.nodes && q.links && (
        <div className="mb-3">
          <TopologyCanvas nodes={q.nodes} links={q.links} />
        </div>
      )}
      <div className="mb-3 rounded-xl bg-slate-800/60 p-3 text-sm">
        <div className="mb-1 font-semibold text-amber-300">Anforderungen</div>
        <ul className="list-disc pl-5">
          {q.requirements.map((r) => <li key={r.text}>{r.text}</li>)}
        </ul>
      </div>
      <div className="space-y-2">
        {q.toggles.map((t) => {
          const checked = on.includes(t.id);
          const right = q.solution.includes(t.id);
          return (
            <label
              key={t.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 ${
                locked ? (checked === right ? 'border-emerald-500/60' : 'border-rose-500') : checked ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-cyan-400"
                checked={checked}
                disabled={locked}
                onChange={() => setOn((o) => (checked ? o.filter((x) => x !== t.id) : [...o, t.id]))}
              />
              <span className="text-sm">{t.text}</span>
            </label>
          );
        })}
      </div>
      {!locked && <CheckButton onClick={check} />}
    </div>
  );
}
