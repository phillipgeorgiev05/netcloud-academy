// App-Logo und Linien-Icons im Stil von SF Symbols. Geometrie des Logos identisch mit scripts/make-icons.mjs.

export function Logo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3ea6ff" />
          <stop offset="1" stopColor="#3d3bf3" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14.5" fill="url(#logo-bg)" />
      <g fill="#fff">
        <circle cx="22.5" cy="36" r="9" />
        <circle cx="32.5" cy="29" r="12" />
        <circle cx="42.5" cy="37" r="8" />
        <rect x="22.5" y="36" width="20" height="9" />
      </g>
      <g stroke="#2a6cff" strokeWidth="2" fill="#2a6cff">
        <path d="M25 38.5 32.5 30.5 40 38.5Z" fill="none" strokeLinejoin="round" />
        <circle cx="25" cy="38.5" r="2.6" stroke="none" />
        <circle cx="32.5" cy="30.5" r="2.6" stroke="none" />
        <circle cx="40" cy="38.5" r="2.6" stroke="none" />
      </g>
    </svg>
  );
}

const paths = {
  path: 'M3 6.5 9 3.5l6 3 6-3v14l-6 3-6-3-6 3zM9 3.5v14M15 6.5v14',
  review: 'M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5',
  tools: 'M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0',
  chevron: 'M9.5 6l6 6-6 6',
  headset: 'M4 15v-3a8 8 0 0 1 16 0v3M4 14.5h3.5v6H5.5A1.5 1.5 0 0 1 4 19zM20 14.5h-3.5v6h2a1.5 1.5 0 0 0 1.5-1.5z',
  calculator: 'M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3zM8.5 7h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01',
  cap: 'M2 9.5 12 4.5l10 5-10 5zM6 11.5v5c3.5 2.3 8.5 2.3 12 0v-5M22 9.5v5.5',
  book: 'M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9.5H6z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  bolt: 'M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z',
  flask: 'M9 3h6M10 3v6l-5 9.5A1.5 1.5 0 0 0 6.3 21h11.4a1.5 1.5 0 0 0 1.3-2.5L14 9V3M7.5 15h9',
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

/** Gefüllte Symbole für Streak und Level. */
export function Flame({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c1 3.2 5.5 5.3 5.5 10.6a5.5 5.5 0 0 1-11 0c0-2.3 1-3.9 2.2-5 0 2.1 1 3.2 2.1 3.2 0-3.3-.9-5.6 1.2-8.8z" />
    </svg>
  );
}

export function Star({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" />
    </svg>
  );
}
