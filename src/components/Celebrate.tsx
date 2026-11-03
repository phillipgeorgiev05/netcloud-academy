import { useEffect, useMemo, useState, type ReactNode } from 'react';

const colors = ['#0a84ff', '#30d158', '#ffd60a', '#ff9f0a', '#ff453a', '#5e5ce6', '#64d2ff'];

/** Konfetti-Regen ohne Zusatzpaket, verschwindet nach 3 s von selbst. */
export function Confetti() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 3000);
    return () => clearTimeout(t);
  }, []);
  const bits = useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({
      left: Math.random() * 100,
      dx: `${Math.round((Math.random() - 0.5) * 160)}px`,
      delay: Math.random() * 0.6,
      color: colors[i % colors.length],
    })),
    [],
  );
  if (!on) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} className="confetti" style={{ left: `${b.left}%`, background: b.color, animationDelay: `${b.delay}s`, ['--dx' as string]: b.dx }} />
      ))}
    </div>
  );
}

/** 0–3 Sterne, verdiente gelb, mit kurzer Pop-Animation auf Wunsch. */
export function Stars({ n, size = 'h-3.5 w-3.5', animate = false }: { n: number; size?: string; animate?: boolean }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} von 3 Sternen`}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`${size} ${i < n ? 'text-yellow-400' : 'text-slate-700'} ${animate && i < n ? 'anim-pop' : ''}`}
          style={animate ? { animationDelay: `${0.25 + i * 0.25}s` } : undefined}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

/** Fortschrittsring (0–1) im Stil der Aktivitätsringe, Inhalt in der Mitte. */
export function Ring({ value, size = 64, stroke = 7, color = 'stroke-cyan-400', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const f = Math.max(0, Math.min(value, 1));
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-slate-800" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - f)} className={color}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
