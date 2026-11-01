import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { badges } from '../content/badges';
import { levels } from '../content';
import { DEV_UNLOCK } from './dev';
import { emptyProgress, parseImport, today, trackDaily, type Progress } from './progress';

const STORAGE_KEY = DEV_UNLOCK ? 'netcloud-progress-dev' : 'netcloud-progress-v1';

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseImport(raw) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

interface Ctx {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  replace: (p: Progress) => void;
  newBadges: string[];
  dismissBadge: () => void;
}

const ProgressContext = createContext<Ctx | null>(null);

function withBadges(p: Progress): Progress {
  const fresh = badges.filter((b) => !p.badges[b.id] && b.earned(p, levels)).map((b) => b.id);
  if (!fresh.length) return p;
  const d = today();
  return { ...p, badges: { ...p.badges, ...Object.fromEntries(fresh.map((id) => [id, d])) } };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  // Neue Abzeichen per Vergleich erkennen (Updater müssen rein bleiben, StrictMode ruft sie doppelt auf).
  const known = useRef(new Set(Object.keys(progress.badges)));
  useEffect(() => {
    const fresh = Object.keys(progress.badges).filter((id) => !known.current.has(id));
    fresh.forEach((id) => known.current.add(id));
    if (fresh.length) setNewBadges((q) => [...q, ...fresh]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Speicher voll oder privat-Modus: App läuft trotzdem weiter, nur ohne Persistenz.
    }
  }, [progress]);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => withBadges(trackDaily(prev, fn(prev))));
  }, []);

  const replace = useCallback((p: Progress) => {
    known.current = new Set(Object.keys(p.badges));
    setProgress(p);
  }, []);
  const dismissBadge = useCallback(() => setNewBadges((q) => q.slice(1)), []);

  return (
    <ProgressContext.Provider value={{ progress, update, replace, newBadges, dismissBadge }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress außerhalb von ProgressProvider');
  return ctx;
}
