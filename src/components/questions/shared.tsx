import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Ergebnis einer beantworteten Frage, Grundlage für das Feedback-Panel. */
export interface Result {
  correct: boolean;
  /** Richtige Antwort in Klartext. */
  solution: string;
  /** Warum die gewählten Antworten falsch waren. */
  whyWrong: string[];
  /** Überschreibt q.explanation (z. B. generierter Rechenweg beim Subnetting). */
  explanation?: string;
}

export interface QProps<Q> {
  q: Q;
  onResult: (r: Result) => void;
  /** true, sobald geprüft wurde: Eingaben sperren, richtig/falsch einfärben. */
  locked: boolean;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CheckButton({ disabled, onClick, children = 'Prüfen' }: { disabled?: boolean; onClick: () => void; children?: ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-snow transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
    >
      {children}
    </button>
  );
}

type Linker = ((term: string) => string | undefined) | undefined;

/** Mini-Markdown: Absätze (Leerzeile), "- " Listen (eingerückt = Unterpunkt), "|" Tabellen, ```Code-Blöcke```, `code`, **fett**.
 *  `link` macht **fette** Fachbegriffe zu Links (Glossar-Verlinkung), wenn es ein Ziel liefert. */
export function RichText({ text, className = '', link }: { text: string; className?: string; link?: Linker }) {
  // Code-Blöcke zuerst herauslösen, sie dürfen Leerzeilen enthalten. Ungerade Indizes = Code.
  const segments = text.trim().split(/```[a-z]*\n?([\s\S]*?)```/);
  return (
    <div className={`space-y-3 leading-relaxed ${className}`}>
      {segments.map((seg, si) =>
        si % 2 === 1 ? (
          <pre key={si} className="overflow-x-auto rounded-lg border border-slate-700 bg-black p-3 font-mono text-xs leading-relaxed text-term sm:text-sm">
            {seg.replace(/\n$/, '')}
          </pre>
        ) : (
          blocksOf(seg).map((b, i) => <Block key={`${si}-${i}`} b={b} link={link} />)
        ),
      )}
    </div>
  );
}

// Blöcke = Leerzeilen-getrennt, zusätzlich aufgeteilt in Läufe gleicher Art (Text / Liste / Tabelle),
// damit z. B. „Vorteile:“ direkt über einer Liste funktioniert.
function blocksOf(text: string): string[] {
  const kind = (l: string) => (l.trim().startsWith('- ') ? 'li' : l.trim().startsWith('|') ? 'tr' : 'p');
  return text
    .split(/\n\s*\n/)
    .filter((b) => b.trim())
    .flatMap((b) =>
      b
        .trim()
        .split('\n')
        .reduce<string[][]>((runs, l) => {
          const last = runs[runs.length - 1];
          if (last && kind(last[0]) === kind(l)) last.push(l);
          else runs.push([l]);
          return runs;
        }, []),
    )
    .map((run) => run.join('\n'));
}

function Block({ b, link }: { b: string; link: Linker }) {
  const lines = b.split('\n');
  if (lines.every((l) => l.trim().startsWith('- ')))
    return (
      <ul className="list-disc space-y-1 pl-5">
        {lines.map((l, j) => (
          <li key={j} className={/^\s{2,}-/.test(l) ? 'ml-5 list-[circle]' : ''}>{inline(l.trim().slice(2), link)}</li>
        ))}
      </ul>
    );
  if (lines.every((l) => l.trim().startsWith('|'))) {
    const rows = lines
      .filter((l) => !/^\|[\s|:-]+\|$/.test(l.trim()))
      .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>{rows[0].map((c, j) => <th key={j} className="border border-slate-700 bg-slate-800 px-2 py-1 text-left">{inline(c, link)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(1).map((r, j) => (
              <tr key={j}>{r.map((c, k) => <td key={k} className="border border-slate-700 px-2 py-1 align-top">{inline(c, link)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <p className="whitespace-pre-line">{inline(b, link)}</p>;
}

function inline(s: string, link: Linker): ReactNode[] {
  return s.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1)
      return <code key={i} className="rounded bg-slate-800 px-1 py-0.5 text-[0.9em] text-cyan-300 [overflow-wrap:anywhere]">{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 3) {
      const term = part.slice(2, -2);
      const href = link?.(term);
      return href ? (
        <Link key={i} to={href} title="Eingeführt in einem anderen Level" className="font-semibold text-white underline decoration-cyan-500 decoration-dotted underline-offset-2">
          {term}
        </Link>
      ) : (
        <strong key={i} className="text-white">{term}</strong>
      );
    }
    return part;
  });
}
