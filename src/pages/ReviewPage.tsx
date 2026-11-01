import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getLevel } from '../content';
import { QuestionSession, type SessionItem, type SessionSummary } from '../components/QuestionSession';
import { dueReviews } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';

const MAX_PER_ROUND = 15;

export function ReviewPage() {
  const { progress } = useProgress();
  const [items, setItems] = useState<SessionItem[] | null>(null);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const total = Object.keys(progress.review).length;

  const due = (): SessionItem[] =>
    dueReviews(progress)
      .map((key) => {
        const [levelId, qid] = key.split('/');
        const level = getLevel(levelId);
        const q = level && [...level.quiz, ...level.boss.questions].find((x) => x.id === qid);
        return q ? { levelId, q } : null; // gelöschte Fragen still überspringen
      })
      .filter((x): x is SessionItem => x !== null)
      .slice(0, MAX_PER_ROUND);

  if (items)
    return (
      <div>
        <h1 className="mb-4 text-xl font-bold">Wiederholen</h1>
        <QuestionSession
          items={items}
          mode="review"
          onFinish={(s) => {
            setSummary(s);
            setItems(null);
          }}
        />
      </div>
    );

  const dueNow = due();
  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight">Wiederholen</h1>
      {summary && (
        <p className="rounded-xl bg-emerald-500/10 p-3 text-emerald-200">
          Runde beendet: {summary.correct}/{summary.total} richtig. Richtige Antworten rücken eine Box weiter.
        </p>
      )}
      <p className="text-slate-300">
        Falsch beantwortete Fragen landen hier (Spaced Repetition, Leitner-System). Jede richtige Wiederholung schiebt die Frage
        weiter nach hinten: 1 → 3 → 7 → 14 → 30 Tage. Nach Box 5 gilt sie als gemeistert.
      </p>
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[1, 2, 3, 4, 5].map((b) => (
          <div key={b} className="rounded-lg bg-slate-900 p-2">
            <div className="text-lg font-bold">{Object.values(progress.review).filter((r) => r.box === b).length}</div>
            Box {b}
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-400">{total} im Stapel · {progress.mastered} gemeistert</p>
      {dueNow.length ? (
        <button type="button" onClick={() => setItems(dueNow)} className="w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-snow hover:bg-cyan-400">
          {dueNow.length} fällige Fragen wiederholen
        </button>
      ) : (
        <p className="rounded-xl bg-slate-900 p-4 text-center text-slate-300">
          Heute nichts fällig. 🎉 <Link to="/" className="text-cyan-400">Weiterlernen →</Link>
        </p>
      )}
    </div>
  );
}
