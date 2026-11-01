import { useEffect, useRef, useState } from 'react';
import { levels } from '../content';
import { certs } from '../content/certs';
import { QuestionSession, type SessionItem } from '../components/QuestionSession';
import { shuffle } from '../components/questions/shared';
import { PASS_THRESHOLD, recordExam } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import type { CertId } from '../types/content';

const MAX_QUESTIONS = 30;
const SECONDS_PER_QUESTION = 60;

interface ExamItem extends SessionItem {
  domain: string;
}

/** Alle Fragen der Level, die zum Zertifikat gehören (ohne Fragen, die per `certs` auf andere Zertifikate beschränkt sind). */
export function examPool(cert: CertId): ExamItem[] {
  return levels
    .filter((l) => l.certs.includes(cert))
    .flatMap((l) =>
      [...l.quiz, ...l.boss.questions]
        .filter((q) => !q.certs || q.certs.includes(cert))
        // q.domain gilt nur, wenn es ein Bereich dieses Zertifikats ist (eine Frage kann zu mehreren Zertifikaten gehören)
        .map((q) => ({
          levelId: l.id,
          q,
          domain: (q.domain && certs[cert].domains.some((d) => d.id === q.domain) ? q.domain : l.domains?.[cert]) ?? '?',
        })),
    );
}

export function ExamPage() {
  const { progress, update } = useProgress();
  const [cert, setCert] = useState<CertId | null>(null);
  const [items, setItems] = useState<ExamItem[]>([]);
  const answers = useRef<(boolean | undefined)[]>([]);
  const [left, setLeft] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!cert || done) return;
    if (left <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  });

  const begin = (c: CertId) => {
    const pool = shuffle(examPool(c)).slice(0, MAX_QUESTIONS);
    answers.current = pool.map(() => undefined);
    setItems(pool);
    setCert(c);
    setDone(false);
    setLeft(pool.length * SECONDS_PER_QUESTION);
  };

  function finish() {
    const score = answers.current.filter(Boolean).length / items.length;
    update((p) => recordExam(p, cert!, score));
    setDone(true);
  }

  if (!cert)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">🎓 Prüfungssimulation</h1>
        <p className="text-sm text-slate-400">
          Bis zu {MAX_QUESTIONS} zufällige Fragen aus allen verfügbaren Leveln des Zertifikats, {SECONDS_PER_QUESTION} s pro Frage. Falsche Antworten landen im Wiederholen-Stapel. Bisher deckt die App nur einen Teil der Prüfungsthemen ab.
        </p>
        <div className="space-y-2">
          {(Object.keys(certs) as CertId[]).map((c) => {
            const n = examPool(c).length;
            const ex = progress.exams[c];
            return (
              <button
                key={c}
                type="button"
                disabled={n === 0}
                onClick={() => begin(c)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-3 text-left hover:border-cyan-400 disabled:opacity-40"
              >
                <span>
                  <b>{certs[c].name}</b> <span className="text-slate-500">({certs[c].exam})</span>
                  <br />
                  <span className="text-xs text-slate-400">{n} Fragen im Pool</span>
                </span>
                {ex && <span className="text-xs text-slate-300">Best {Math.round(ex.best * 100)} % · Letzte {Math.round(ex.last * 100)} %</span>}
              </button>
            );
          })}
        </div>
      </div>
    );

  if (done) {
    const byDomain = certs[cert].domains
      .map((d) => {
        const idx = items.map((it, i) => ({ it, i })).filter(({ it }) => it.domain === d.id);
        return { d, total: idx.length, right: idx.filter(({ i }) => answers.current[i]).length };
      })
      .filter((x) => x.total > 0);
    const score = answers.current.filter(Boolean).length / items.length;
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Ergebnis {certs[cert].exam}</h1>
        <p className="text-lg">
          {answers.current.filter(Boolean).length}/{items.length} richtig ({Math.round(score * 100)} %) {score >= PASS_THRESHOLD ? '🎉' : '💪'}
        </p>
        <p className="text-xs text-slate-400">Die echte Prüfung bewertet anders (skalierte Punkte). Nutze das Ergebnis als Orientierung.</p>
        <h2 className="font-semibold">Nach Prüfungsbereich</h2>
        <div className="space-y-2">
          {byDomain.map(({ d, total, right }) => (
            <div key={d.id} className="rounded-xl bg-slate-900 p-3">
              <div className="flex justify-between text-sm">
                <span>{d.name}</span>
                <span className="text-slate-400">{right}/{total}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full ${right / total >= PASS_THRESHOLD ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ width: `${(right / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setCert(null)} className="rounded-xl bg-slate-800 px-4 py-3">Zurück</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">🎓 {certs[cert].exam}</h1>
        <span className={`font-mono ${left < 60 ? 'text-rose-400' : 'text-slate-300'}`} aria-label="Restzeit">⏱ {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>
      </div>
      <QuestionSession
        items={items}
        mode="quiz"
        onAnswer={(i, ok) => (answers.current[i] = ok)}
        onFinish={finish}
      />
    </div>
  );
}
