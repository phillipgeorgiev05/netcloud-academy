import { useState } from 'react';
import { generateSubnetProblem, subnetAnswerMatches } from '../../lib/subnet';
import type { SubnetQuestion } from '../../types/content';
import { CheckButton, type QProps } from './shared';

export function SubnetQuestionView({ q, onResult, locked }: QProps<SubnetQuestion>) {
  // Neue Zufallswerte bei jedem Mount (QuestionRenderer setzt key pro Durchlauf).
  const [problem] = useState(() => generateSubnetProblem(q.task, q.prefixRange));
  const [vals, setVals] = useState<string[]>(() => problem.fields.map(() => ''));
  const ready = vals.every((v) => v.trim());

  const check = () => {
    const wrong = problem.fields.map((f, i) => ({ f, i })).filter(({ f, i }) => !subnetAnswerMatches(vals[i], f.answer));
    onResult({
      correct: wrong.length === 0,
      solution: problem.fields.map((f) => `${f.label}: ${f.answer}`).join(' · '),
      whyWrong: wrong.map(({ f, i }) => `${f.label}: du hattest „${vals[i]}“, richtig ist ${f.answer}.`),
      explanation: problem.explanation + (q.explanation ? `\n\n${q.explanation}` : ''),
    });
  };

  return (
    <div>
      <p className="mb-3 rounded-xl bg-slate-800 p-3 font-mono text-cyan-200">{problem.prompt}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {problem.fields.map((f, i) => (
          <label key={f.label} className="block">
            <span className="mb-1 block text-sm text-slate-400">{f.label}</span>
            <input
              value={vals[i]}
              disabled={locked}
              autoComplete="off"
              placeholder={f.placeholder}
              onChange={(e) => setVals((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || !ready || locked) return;
                e.preventDefault(); // sonst löst dasselbe Enter gleich den fokussierten „Weiter“-Button aus
                check();
              }}
              className={`w-full rounded-lg border-2 bg-slate-900 px-3 py-2 font-mono outline-none focus:border-cyan-400 ${
                locked ? (subnetAnswerMatches(vals[i], f.answer) ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-700'
              }`}
            />
          </label>
        ))}
      </div>
      {!locked && <CheckButton disabled={!ready} onClick={check} />}
    </div>
  );
}
