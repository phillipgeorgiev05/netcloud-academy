import { useEffect, useRef, useState } from 'react';
import type { Question } from '../types/content';
import { recordAnswer, reviewKey, type AnswerMode } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import { QuestionRenderer } from './questions/QuestionRenderer';
import type { Result } from './questions/shared';

export interface SessionItem {
  levelId: string;
  q: Question;
}

export interface SessionSummary {
  correct: number;
  total: number;
  heartsLeft: number;
}

/** Spielt eine Liste von Fragen ab (Quiz, Boss oder Wiederholen). Mit `hearts` endet die Runde bei 0 Herzen. */
export function QuestionSession({
  items,
  mode,
  hearts,
  onFinish,
  onAnswer,
}: {
  items: SessionItem[];
  mode: AnswerMode;
  hearts?: number;
  onFinish: (s: SessionSummary) => void;
  /** Wird nach jeder geprüften Antwort aufgerufen (z. B. für Prüfungsstatistik). */
  onAnswer?: (index: number, correct: boolean) => void;
}) {
  const { update } = useProgress();
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [correct, setCorrect] = useState(0);
  const [lives, setLives] = useState(hearts ?? 0);

  const item = items[idx];
  const nextRef = useRef<HTMLButtonElement>(null);
  // Fokus für Tastatur-Nutzer, ohne dass die Seite springt (autoFocus würde scrollen).
  useEffect(() => {
    if (result) nextRef.current?.focus({ preventScroll: true });
  }, [result]);

  const onResult = (r: Result) => {
    setResult(r);
    if (r.correct) setCorrect((c) => c + 1);
    else if (hearts) setLives((l) => l - 1);
    update((p) => recordAnswer(p, reviewKey(item.levelId, item.q.id), r.correct, mode));
    onAnswer?.(idx, r.correct);
  };

  const next = () => {
    const dead = hearts !== undefined && lives <= 0;
    if (dead || idx + 1 >= items.length) {
      onFinish({ correct, total: items.length, heartsLeft: lives });
      return;
    }
    setIdx(idx + 1);
    setResult(null);
    window.scrollTo({ top: 0 });
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-cyan-400 transition-all" style={{ width: `${((idx + (result ? 1 : 0)) / items.length) * 100}%` }} />
        </div>
        <span className="text-sm text-slate-400">{idx + 1}/{items.length}</span>
        {hearts !== undefined && (
          <span className="text-lg" aria-label={`${lives} Herzen übrig`}>
            {'❤️'.repeat(Math.max(lives, 0))}
            {'🖤'.repeat(hearts - Math.max(lives, 0))}
          </span>
        )}
      </div>
      <QuestionRenderer key={`${idx}-${item.levelId}-${item.q.id}`} q={item.q} result={result} onResult={onResult} />
      {result && (
        <button
          type="button"
          ref={nextRef}
          onClick={next}
          className="mt-4 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-200 sm:w-auto"
        >
          {hearts !== undefined && lives <= 0 ? 'Keine Herzen mehr – Auswertung' : idx + 1 >= items.length ? 'Auswertung' : 'Weiter →'}
        </button>
      )}
    </div>
  );
}
