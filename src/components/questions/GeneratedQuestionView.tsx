import { useState } from 'react';
import { fieldMatches, generate, type GenProblem } from '../../lib/generators';
import type { GeneratedQuestion } from '../../types/content';
import { CheckButton, RichText, type QProps, type Result } from './shared';
import { TopologyCanvas } from './TopologyQuestionView';

export function GeneratedQuestionView({ q, onResult, locked }: QProps<GeneratedQuestion>) {
  // Neue Zufallswerte bei jedem Mount (QuestionRenderer setzt key pro Durchlauf).
  const [problem] = useState(() => generate(q.generator));
  return <GenProblemForm problem={problem} locked={locked} onResult={(r) => onResult({ ...r, explanation: r.explanation + (q.explanation ? `\n\n${q.explanation}` : '') })} />;
}

/** Formular für eine generierte Aufgabe. Auch vom Trainer genutzt. */
export function GenProblemForm({ problem, locked, onResult }: { problem: GenProblem; locked: boolean; onResult: (r: Result) => void }) {
  const [vals, setVals] = useState<string[]>(() => problem.fields.map(() => ''));
  const ready = vals.every((v) => v.trim());
  const set = (i: number, v: string) => setVals((x) => x.map((y, j) => (j === i ? v : y)));

  const check = () => {
    const wrong = problem.fields.map((f, i) => ({ f, i })).filter(({ f, i }) => !fieldMatches(f, vals[i]));
    onResult({
      correct: wrong.length === 0,
      solution: problem.fields.map((f) => `${f.label}: ${f.answer}`).join(' · '),
      whyWrong: wrong.map(({ f, i }) => `${f.label}: du hattest „${vals[i]}“, richtig ist ${f.answer}.`),
      explanation: problem.explanation,
    });
  };

  const border = (i: number) =>
    locked ? (fieldMatches(problem.fields[i], vals[i]) ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-700';

  return (
    <div>
      <div className="mb-3 rounded-xl bg-slate-800/60 p-3"><RichText text={problem.prompt} /></div>
      {problem.topology && (
        <div className="mb-3">
          <TopologyCanvas nodes={problem.topology.nodes} links={problem.topology.links} />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {problem.fields.map((f, i) => (
          <label key={f.label} className="block">
            <span className="mb-1 block text-sm text-slate-400">{f.label}</span>
            {f.options ? (
              <select
                value={vals[i]}
                disabled={locked}
                onChange={(e) => set(i, e.target.value)}
                className={`w-full rounded-lg border-2 bg-slate-900 px-3 py-2 ${border(i)}`}
              >
                <option value="" disabled>wählen…</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                value={vals[i]}
                disabled={locked}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={f.placeholder}
                onChange={(e) => set(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || !ready || locked) return;
                  e.preventDefault(); // sonst löst dasselbe Enter den fokussierten „Weiter“-Button aus
                  check();
                }}
                className={`w-full rounded-lg border-2 bg-slate-900 px-3 py-2 font-mono outline-none focus:border-cyan-400 ${border(i)}`}
              />
            )}
          </label>
        ))}
      </div>
      {!locked && <CheckButton disabled={!ready} onClick={check} />}
    </div>
  );
}
