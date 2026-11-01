import { useState } from 'react';
import { Link } from 'react-router-dom';
import { decisionTree } from '../content/decisions';
import { RichText } from '../components/questions/shared';

export function DecidePage() {
  const [path, setPath] = useState<string[]>(['start']);
  const node = decisionTree[path[path.length - 1]];
  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight">Entscheidungshilfe</h1>
      {path.length > 1 && (
        <button type="button" onClick={() => setPath(path.slice(0, -1))} className="text-sm text-slate-400 hover:text-white">← Zurück</button>
      )}
      {'question' in node ? (
        <div>
          <h2 className="mb-3 text-lg font-semibold">{node.question}</h2>
          <div className="space-y-2">
            {node.options.map((o) => (
              <button key={o.next} type="button" onClick={() => setPath([...path, o.next])} className="w-full rounded-xl border-2 border-slate-700 p-3 text-left hover:border-cyan-400">
                {o.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4">
          <RichText text={node.result} />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-900 p-3"><div className="text-xs text-sky-300">Azure</div><div className="font-semibold">{node.azure}</div></div>
            <div className="rounded-xl bg-slate-900 p-3"><div className="text-xs text-amber-300">AWS</div><div className="font-semibold">{node.aws}</div></div>
          </div>
          {node.levelId && <Link to={`/level/${node.levelId}`} className="inline-block text-sm text-cyan-400">→ Mehr dazu im Level</Link>}
          <div>
            <button type="button" onClick={() => setPath(['start'])} className="rounded-full bg-slate-800 px-5 py-2 text-sm">Neu starten</button>
          </div>
        </div>
      )}
    </div>
  );
}
