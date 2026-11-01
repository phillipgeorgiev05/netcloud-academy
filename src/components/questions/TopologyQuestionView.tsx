import { useState, type ReactNode } from 'react';
import type { NodeKind, TopoLink, TopologyQuestion, TopoNode } from '../../types/content';
import { CheckButton, type QProps } from './shared';

export const kindNames: Record<NodeKind, string> = {
  pc: 'PC',
  laptop: 'Laptop',
  phone: 'Smartphone',
  server: 'Server',
  switch: 'Switch',
  router: 'Router',
  firewall: 'Firewall',
  ap: 'Access Point',
  cloud: 'Internet / Cloud',
  unknown: '?',
};

const kindIcons: Record<NodeKind, string> = {
  pc: '🖥️',
  laptop: '💻',
  phone: '📱',
  server: '🗄️',
  switch: '🔀',
  router: '🔁',
  firewall: '🧱',
  ap: '📶',
  cloud: '☁️',
  unknown: '❓',
};

/** Zeichnet Knoten und (optional beschriftete) Verbindungen. Wird von Topologie-, Generator- und Baukasten-Fragen genutzt. */
export function TopologyCanvas({
  nodes,
  links,
  nodeClass = () => 'border-slate-600 bg-slate-800',
  onNodeClick,
  kindOf = (n) => n.kind,
  extra,
  linkColor = () => 'var(--color-slate-500)',
  onLinkClick,
}: {
  nodes: TopoNode[];
  links: TopoLink[];
  nodeClass?: (id: string) => string;
  onNodeClick?: (id: string) => void;
  kindOf?: (n: TopoNode) => NodeKind;
  extra?: (n: TopoNode) => ReactNode;
  /** Strichfarbe pro Verbindung (Index in `links`) */
  linkColor?: (i: number) => string;
  /** Macht die Beschriftung jeder Verbindung zum Klickziel */
  onLinkClick?: (i: number) => void;
}) {
  const pos = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900" style={{ aspectRatio: '16 / 11' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {links.map(([a, b], i) => (
          <line key={`${a}-${b}`} x1={pos(a).x} y1={pos(a).y} x2={pos(b).x} y2={pos(b).y} style={{ stroke: linkColor(i) }} strokeWidth={onLinkClick ? 3 : 2} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {links.map(([a, b, label], i) => {
        const style = { left: `${(pos(a).x + pos(b).x) / 2}%`, top: `${(pos(a).y + pos(b).y) / 2}%` };
        return onLinkClick ? (
          <button
            key={`l-${a}-${b}`}
            type="button"
            onClick={() => onLinkClick(i)}
            aria-label={`Verbindung ${a}–${b}${label ? ` (${label})` : ''}`}
            className="absolute min-h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 bg-slate-950 px-1.5 text-[10px] text-amber-300 sm:text-xs"
            style={{ ...style, borderColor: linkColor(i) }}
          >
            {label ?? '⋯'}
          </button>
        ) : label ? (
          <span key={`l-${a}-${b}`} className="absolute -translate-x-1/2 -translate-y-1/2 rounded bg-slate-950 px-1 text-[10px] text-amber-300 sm:text-xs" style={style}>
            {label}
          </span>
        ) : null;
      })}
      {nodes.map((n) => (
        <div key={n.id} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <button
            type="button"
            disabled={!onNodeClick}
            onClick={() => onNodeClick?.(n.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl sm:h-12 sm:w-12 sm:text-2xl ${nodeClass(n.id)}`}
            aria-label={n.label}
          >
            {kindIcons[kindOf(n)]}
          </button>
          <span className="mt-0.5 max-w-24 truncate rounded bg-slate-950/80 px-1 text-[10px] sm:text-xs">{n.label}</span>
          {extra?.(n)}
        </div>
      ))}
    </div>
  );
}

export function TopologyQuestionView({ q, onResult, locked }: QProps<TopologyQuestion>) {
  const [clicked, setClicked] = useState<string[]>([]);
  const [filled, setFilled] = useState<Record<string, NodeKind>>({});
  const unknowns = q.nodes.filter((n) => n.kind === 'unknown');
  const label = (id: string) => q.nodes.find((n) => n.id === id)!.label;

  const ready = q.mode === 'click' ? clicked.length > 0 : unknowns.every((n) => filled[n.id]);

  const check = () => {
    if (q.mode === 'click') {
      const correct = clicked.length === q.correct.length && clicked.every((id) => q.correct.includes(id));
      onResult({
        correct,
        solution: q.correct.map(label).join(', '),
        whyWrong: [
          ...clicked.filter((id) => !q.correct.includes(id)).map((id) => `${label(id)} ist hier nicht gesucht.`),
          ...q.correct.filter((id) => !clicked.includes(id)).map((id) => `${label(id)} hat gefehlt.`),
        ],
      });
    } else {
      const wrong = unknowns.filter((n) => filled[n.id] !== q.solution[n.id]);
      onResult({
        correct: wrong.length === 0,
        solution: unknowns.map((n) => `${n.label}: ${kindNames[q.solution[n.id]]}`).join(' · '),
        whyWrong: wrong.map((n) => `${n.label}: ${kindNames[filled[n.id]]} gewählt, richtig ist ${kindNames[q.solution[n.id]]}.`),
      });
    }
  };

  const nodeClass = (id: string) => {
    if (q.mode === 'click') {
      const sel = clicked.includes(id);
      if (locked) return q.correct.includes(id) ? 'border-emerald-500 bg-emerald-500/20' : sel ? 'border-rose-500 bg-rose-500/20' : 'border-slate-600 bg-slate-800';
      return sel ? 'border-cyan-400 bg-cyan-400/20 ring-2 ring-cyan-400' : 'border-slate-600 bg-slate-800 hover:border-slate-400';
    }
    const node = q.nodes.find((n) => n.id === id)!;
    if (!locked || node.kind !== 'unknown') return 'border-slate-600 bg-slate-800';
    return filled[id] === q.solution[id] ? 'border-emerald-500 bg-emerald-500/20' : 'border-rose-500 bg-rose-500/20';
  };

  return (
    <div>
      <p className="mb-2 text-sm text-slate-400">
        {q.mode === 'click' ? 'Tippe die gesuchten Geräte an (mehrere möglich).' : 'Wähle für jedes ❓ das passende Gerät.'}
      </p>
      <TopologyCanvas
        nodes={q.nodes}
        links={q.links}
        nodeClass={nodeClass}
        onNodeClick={q.mode === 'click' && !locked ? (id) => setClicked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id])) : undefined}
        kindOf={(n) => (n.kind === 'unknown' && filled[n.id] ? filled[n.id] : n.kind)}
        extra={(n) =>
          q.mode === 'fill' && n.kind === 'unknown' ? (
            <select
              disabled={locked}
              value={filled[n.id] ?? ''}
              onChange={(e) => setFilled((f) => ({ ...f, [n.id]: e.target.value as NodeKind }))}
              className="mt-0.5 rounded bg-slate-800 text-[11px] sm:text-xs"
              aria-label={`Gerät für ${n.label}`}
            >
              <option value="" disabled>wählen…</option>
              {q.choices.map((c) => (
                <option key={c} value={c}>{kindNames[c]}</option>
              ))}
            </select>
          ) : null
        }
      />
      {!locked && <CheckButton disabled={!ready} onClick={check} />}
    </div>
  );
}
