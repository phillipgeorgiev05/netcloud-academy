import { useState } from 'react';
import type { OrderingQuestion } from '../../types/content';
import { CheckButton, shuffle, type QProps } from './shared';

// Hoch/runter-Knöpfe statt Drag & Drop: funktioniert mit Tastatur, Screenreader und Touch gleich gut.
export function OrderingQuestionView({ q, onResult, locked }: QProps<OrderingQuestion>) {
  const [order, setOrder] = useState(() => {
    let s = shuffle(q.items);
    while (s.length > 1 && s.every((it, i) => it.id === q.items[i].id)) s = shuffle(q.items);
    return s;
  });

  const move = (i: number, d: -1 | 1) =>
    setOrder((o) => {
      const n = [...o];
      [n[i], n[i + d]] = [n[i + d], n[i]];
      return n;
    });

  const check = () => {
    const wrong = order.map((it, i) => ({ it, i })).filter(({ it, i }) => it.id !== q.items[i].id);
    onResult({
      correct: wrong.length === 0,
      solution: q.items.map((it, i) => `${i + 1}. ${it.text}`).join(' → '),
      whyWrong: wrong.map(({ it, i }) => `„${it.text}“ steht an Position ${i + 1}, gehört aber an Position ${q.items.findIndex((x) => x.id === it.id) + 1}.`),
    });
  };

  return (
    <div>
      <p className="mb-2 text-sm text-slate-400">Bringe die Schritte mit ▲/▼ in die richtige Reihenfolge.</p>
      <ol className="space-y-2">
        {order.map((it, i) => {
          const ok = locked && it.id === q.items[i].id;
          return (
            <li
              key={it.id}
              className={`flex items-center gap-2 rounded-xl border-2 p-2 ${locked ? (ok ? 'border-emerald-500 bg-emerald-500/10' : 'border-rose-500 bg-rose-500/10') : 'border-slate-700 bg-slate-900'}`}
            >
              <span className="w-6 text-center font-mono text-slate-400">{i + 1}</span>
              <span className="flex-1 text-sm">{it.text}</span>
              {!locked && (
                <span className="flex flex-col">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`${it.text} nach oben`} className="px-2 text-slate-300 disabled:opacity-20">▲</button>
                  <button type="button" disabled={i === order.length - 1} onClick={() => move(i, 1)} aria-label={`${it.text} nach unten`} className="px-2 text-slate-300 disabled:opacity-20">▼</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!locked && <CheckButton onClick={check} />}
    </div>
  );
}
