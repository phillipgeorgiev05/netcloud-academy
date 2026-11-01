import { Link, useParams } from 'react-router-dom';
import { getLevel, levels } from '../content';
import { RichText } from '../components/questions/shared';
import { isUnlocked } from '../lib/progress';
import { tablesOf } from '../lib/sheet';
import { useProgress } from '../lib/ProgressContext';

/** Druckansicht pro Level: Tabellen, Fachbegriffe, Vergleiche und Analogien auf wenigen Seiten. */
export function SheetPage() {
  const { id } = useParams();
  const level = id ? getLevel(id) : undefined;
  const { progress } = useProgress();
  if (!level || !isUnlocked(level, levels, progress)) return <p>Level nicht verfügbar. <Link to="/" className="text-cyan-400">Zurück</Link></p>;

  const terms = level.lesson.flatMap((s) => s.terms ?? []);
  return (
    <div className="sheet space-y-4">
      <div className="flex items-center justify-between gap-2 print:hidden">
        <Link to={`/level/${level.id}`} className="text-sm text-slate-400 hover:text-white">← Level</Link>
        <button type="button" onClick={() => window.print()} className="rounded-full bg-cyan-500 px-5 py-2 font-semibold text-snow">🖨️ Drucken / als PDF</button>
      </div>
      <h1 className="text-[28px] font-bold leading-tight tracking-tight">Spickzettel: {level.title}</h1>
      <p className="text-sm text-slate-400">{level.summary}</p>
      {level.lesson.map((s) => {
        const tables = tablesOf(s.body);
        if (!tables.length && !s.compare && !s.analogy) return null;
        return (
          <section key={s.heading} className="break-inside-avoid space-y-2">
            <h2 className="font-semibold text-cyan-300">{s.heading}</h2>
            {tables.map((t, i) => <RichText key={i} text={t} className="text-sm" />)}
            {s.compare && (
              <RichText
                className="text-sm"
                text={[`| | ${s.compare.left} | ${s.compare.right} |`, '|---|---|---|', ...s.compare.rows.map(([l, r], i) => `| ${i + 1} | ${l} | ${r} |`)].join('\n')}
              />
            )}
            {s.analogy && <p className="text-sm">💡 {s.analogy}</p>}
          </section>
        );
      })}
      {terms.length > 0 && (
        <section className="break-inside-avoid">
          <h2 className="mb-1 font-semibold text-cyan-300">Fachbegriffe</h2>
          <p className="text-sm">{terms.map((t) => `${t.de} (${t.en})`).join(' · ')}</p>
        </section>
      )}
    </div>
  );
}
