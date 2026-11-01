import { useState } from 'react';
import type { CliQuestion, Shell } from '../../types/content';
import { CheckButton, type QProps } from './shared';

const shellNames: Record<Shell, string> = {
  ios: 'Cisco IOS',
  windows: 'Windows (cmd/PowerShell)',
  linux: 'Linux (bash)',
  azcli: 'Azure CLI',
  awscli: 'AWS CLI',
};

const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
export const blankOk = (val: string, accept: string[]) => accept.some((a) => norm(a) === norm(val));
const blankIndex = (part: string) => part.match(/^\{\{(\d+)\}\}$/)?.[1];

export function CliQuestionView({ q, onResult, locked }: QProps<CliQuestion>) {
  const parts = q.template.split(/(\{\{\d+\}\})/);
  const [vals, setVals] = useState<string[]>(() => q.blanks.map(() => ''));

  const check = () => {
    const wrong = q.blanks.map((b, i) => ({ b, i })).filter(({ b, i }) => !blankOk(vals[i], b.accept));
    onResult({
      correct: wrong.length === 0,
      solution: parts.map((p) => (blankIndex(p) ? q.blanks[Number(blankIndex(p))].accept[0] : p)).join(''),
      whyWrong: wrong.map(
        ({ b, i }) =>
          `Lücke ${i + 1}: „${vals[i]}“ statt „${b.accept[0]}“` + (b.accept.length > 1 ? ` (auch richtig: ${b.accept.slice(1).join(', ')})` : ''),
      ),
    });
  };

  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wide text-slate-400">{shellNames[q.shell]}</div>
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-black p-3 font-mono text-sm leading-9 text-term">
        {parts.map((p, k) => {
          const idx = blankIndex(p);
          if (idx === undefined) return <span key={k} className="whitespace-pre-wrap">{p}</span>;
          const i = Number(idx);
          const ok = locked && blankOk(vals[i], q.blanks[i].accept);
          return (
            <input
              key={k}
              value={vals[i]}
              disabled={locked}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label={`Lücke ${i + 1}`}
              onChange={(e) => setVals((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
              style={{ width: `${Math.max(5, q.blanks[i].accept[0].length + 2)}ch` }}
              className={`mx-1 rounded border-b-2 bg-slate-800 px-1 text-white outline-none focus:border-cyan-400 ${
                locked ? (ok ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-500'
              }`}
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">Groß-/Kleinschreibung und doppelte Leerzeichen egal.</p>
      {!locked && <CheckButton disabled={!vals.every((v) => v.trim())} onClick={check} />}
    </div>
  );
}
