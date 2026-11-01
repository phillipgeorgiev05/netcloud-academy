import { useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary } from '../content/glossary';

export function GlossaryPage() {
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const hits = s ? glossary.filter((g) => g.de.toLowerCase().includes(s) || g.en.toLowerCase().includes(s)) : glossary;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📚 Glossar</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Suchen (Deutsch oder Englisch) …"
        aria-label="Glossar durchsuchen"
        className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-cyan-400"
      />
      <p className="text-xs text-slate-400">{hits.length} von {glossary.length} Begriffen</p>
      <dl className="divide-y divide-slate-800">
        {hits.map((g) => (
          <div key={g.de} className="py-2">
            <dt className="font-semibold">{g.de}</dt>
            <dd className="text-sm text-slate-300">{g.en}</dd>
            <dd className="text-xs">
              <Link to={`/level/${g.levelId}`} className="text-cyan-400">→ {g.levelTitle}</Link>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
