import { useEffect, useState } from 'react';
import { levels } from '../content';
import { certs } from '../content/certs';
import type { SessionItem } from '../components/QuestionSession';
import { Feedback, QuestionRenderer } from '../components/questions/QuestionRenderer';
import { RichText, shuffle, type Result } from '../components/questions/shared';
import { PASS_THRESHOLD, recordAnswer, recordExam, reviewKey } from '../lib/progress';
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
        // Fehlersuche-Ketten geben schon während der Bearbeitung Feedback, passt nicht zur Prüfung ohne Sofort-Auswertung.
        .filter((q) => q.type !== 'chain' && (!q.certs || q.certs.includes(cert)))
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
  // Wie in der echten Prüfung: Antworten werden nur gespeichert und erst bei der Abgabe ausgewertet.
  const [answers, setAnswers] = useState<(Result | null)[]>([]);
  const [marked, setMarked] = useState<boolean[]>([]);
  const [idx, setIdx] = useState(0);
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
    setItems(pool);
    setAnswers(pool.map(() => null));
    setMarked(pool.map(() => false));
    setIdx(0);
    setCert(c);
    setDone(false);
    setLeft(pool.length * SECONDS_PER_QUESTION);
  };

  function finish() {
    const score = answers.filter((a) => a?.correct).length / items.length;
    update((p) => {
      // Unbeantwortete Fragen zählen als falsch, kommen aber nicht in den Wiederholen-Stapel.
      const after = answers.reduce((acc, a, i) => (a ? recordAnswer(acc, reviewKey(items[i].levelId, items[i].q.id), a.correct, 'quiz') : acc), p);
      return recordExam(after, cert!, score);
    });
    setDone(true);
    window.scrollTo({ top: 0 });
  }

  const submit = () => {
    const open = answers.filter((a) => !a).length;
    const flagged = marked.filter(Boolean).length;
    const warn = [open && `${open} unbeantwortet`, flagged && `${flagged} markiert`].filter(Boolean).join(', ');
    if (!warn || window.confirm(`Noch ${warn}. Trotzdem abgeben?`)) finish();
  };

  if (!cert)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">🎓 Prüfungssimulation</h1>
        <p className="text-sm text-slate-400">
          Bis zu {MAX_QUESTIONS} zufällige Fragen aus allen verfügbaren Leveln des Zertifikats, {SECONDS_PER_QUESTION} s pro Frage. Wie in der echten Prüfung: kein Sofort-Feedback, Fragen markieren, frei springen und am Ende abgeben. Falsche Antworten landen im Wiederholen-Stapel. Bisher deckt die App nur einen Teil der Prüfungsthemen ab.
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
    const right = answers.filter((a) => a?.correct).length;
    const byDomain = certs[cert].domains
      .map((d) => {
        const idxs = items.map((it, i) => (it.domain === d.id ? i : -1)).filter((i) => i >= 0);
        return { d, total: idxs.length, right: idxs.filter((i) => answers[i]?.correct).length };
      })
      .filter((x) => x.total > 0);
    const score = right / items.length;
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Ergebnis {certs[cert].exam}</h1>
        <p className="text-lg">
          {right}/{items.length} richtig ({Math.round(score * 100)} %) {score >= PASS_THRESHOLD ? '🎉' : '💪'}
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
        <h2 className="font-semibold">Alle Antworten</h2>
        <div className="space-y-3">
          {items.map((it, i) => {
            const a = answers[i];
            return (
              <details key={i} className="rounded-xl bg-slate-900 p-3" open={!a?.correct}>
                <summary className="cursor-pointer text-sm">
                  {a ? (a.correct ? '✅' : '❌') : '⏭️'} <b>Frage {i + 1}</b>
                  {marked[i] && ' 🚩'}
                </summary>
                {it.q.prompt && <RichText text={it.q.prompt} className="mt-2 text-sm font-medium" />}
                {a ? (
                  <Feedback q={it.q} r={a} />
                ) : (
                  <div className="mt-3 text-sm text-slate-400">
                    Nicht beantwortet.
                    {it.q.explanation && <RichText text={it.q.explanation} className="mt-2" />}
                  </div>
                )}
              </details>
            );
          })}
        </div>
        <button type="button" onClick={() => setCert(null)} className="rounded-xl bg-slate-800 px-4 py-3">Zurück</button>
      </div>
    );
  }

  const go = (i: number) => {
    setIdx(i);
    window.scrollTo({ top: 0 });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">🎓 {certs[cert].exam}</h1>
        <span className={`font-mono ${left < 60 ? 'text-rose-400' : 'text-slate-300'}`} aria-label="Restzeit">⏱ {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>
      </div>
      <nav aria-label="Fragenübersicht" className="mb-4 flex flex-wrap gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-current={i === idx}
            aria-label={`Frage ${i + 1}${answers[i] ? ', beantwortet' : ''}${marked[i] ? ', markiert' : ''}`}
            className={`relative h-8 w-8 rounded-lg text-xs font-semibold ${i === idx ? 'ring-2 ring-white' : ''} ${answers[i] ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            {i + 1}
            {marked[i] && <span className="absolute -right-1 -top-1 text-[10px]">🚩</span>}
          </button>
        ))}
      </nav>
      <p className="mb-3 text-xs text-slate-400">„Prüfen“ speichert hier nur deine Antwort, ausgewertet wird erst bei der Abgabe. Du kannst jederzeit ändern und erneut speichern.</p>
      {/* Alle Fragen bleiben montiert, damit Eingaben und Zufallswerte beim Springen erhalten bleiben. */}
      {items.map((it, i) => (
        <div key={i} hidden={i !== idx}>
          <QuestionRenderer
            q={it.q}
            result={null}
            onResult={(r) => setAnswers((as) => as.map((a, j) => (j === i ? r : a)))}
          />
          {answers[i] && <p className="mt-2 text-sm text-cyan-300">✓ Antwort gespeichert</p>}
        </div>
      ))}
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" disabled={idx === 0} onClick={() => go(idx - 1)} className="rounded-xl bg-slate-800 px-4 py-3 disabled:opacity-40">← Zurück</button>
        <button
          type="button"
          onClick={() => setMarked((m) => m.map((x, j) => (j === idx ? !x : x)))}
          aria-pressed={marked[idx]}
          className={`rounded-xl px-4 py-3 ${marked[idx] ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'}`}
        >
          🚩 {marked[idx] ? 'Markiert' : 'Markieren'}
        </button>
        {idx + 1 < items.length && <button type="button" onClick={() => go(idx + 1)} className="rounded-xl bg-slate-800 px-4 py-3">Weiter →</button>}
        <button type="button" onClick={submit} className="ml-auto rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-200">Abgeben</button>
      </div>
    </div>
  );
}
