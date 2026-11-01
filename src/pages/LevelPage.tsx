import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLevel, levels } from '../content';
import { certs } from '../content/certs';
import { QuestionSession, type SessionSummary } from '../components/QuestionSession';
import { LessonView } from '../components/LessonView';
import { generatorNames } from '../lib/generators';
import { RichText, shuffle } from '../components/questions/shared';
import type { CertId, Level, Question } from '../types/content';
import { completeLesson, finishBoss, finishQuiz, isPassed, isUnlocked, levelProgress, PASS_THRESHOLD, reviewKey, toggleLabStep, XP } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';

type Stage = 'overview' | 'lesson' | 'quiz' | 'boss' | 'result' | 'lab';

/** Zertifikats-Fokus: Fragen mit `certs`, die den Fokus nicht enthalten, werden ausgeblendet. */
export const forFocus = (qs: Question[], level: Level, focus?: CertId) =>
  focus && level.certs.includes(focus) ? qs.filter((q) => !q.certs || q.certs.includes(focus)) : qs;

const subnetTaskNames = { network: 'Netzadresse', broadcast: 'Broadcast', hosts: 'Hosts pro Präfix', mask: 'Maske', range: 'Host-Bereich', prefixForHosts: 'Präfix für X Hosts' };
const plainPrompt = (q: Question) =>
  q.type === 'generated' ? `Rechenaufgabe: ${generatorNames[q.generator]}`
  : q.type === 'subnet' ? `Subnetting: ${subnetTaskNames[q.task]}`
  : (q.prompt ?? '').replace(/[*`]/g, '').split('\n')[0];

export function LevelPage() {
  const { id } = useParams();
  const level = id ? getLevel(id) : undefined;
  const { progress } = useProgress();

  if (!level) return <p>Level nicht gefunden. <Link to="/" className="text-cyan-400">Zurück</Link></p>;
  if (!isUnlocked(level, levels, progress))
    return <p>🔒 Dieses Level ist noch gesperrt. Bestehe zuerst das vorherige Level mit mind. 80 %. <Link to="/" className="text-cyan-400">Zurück</Link></p>;
  return <LevelFlow key={level.id} level={level} />;
}

function LevelFlow({ level }: { level: Level }) {
  const { progress, update } = useProgress();
  const [stage, setStage] = useState<Stage>('overview');
  const [last, setLast] = useState<{ kind: 'quiz' | 'boss'; s: SessionSummary } | null>(null);
  const [run, setRun] = useState(0); // neue Mischung bei jedem Start
  const lp = levelProgress(progress, level.id);
  const quizOk = lp.quizBest >= PASS_THRESHOLD;
  // Nur pro Start neu mischen, nicht bei jedem Render (Fortschritts-Updates rendern neu).
  const focus = progress.settings.focusCert;
  const quizQs = forFocus(level.quiz, level, focus);
  const bossQs = forFocus(level.boss.questions, level, focus);
  // `run` erzwingt neues Mischen pro Start, nicht bei jedem Render.
  const quizItems = useMemo(() => shuffle(quizQs).map((q) => ({ levelId: level.id, q })), [level, run, focus]);
  const bossItems = useMemo(() => shuffle(bossQs).map((q) => ({ levelId: level.id, q })), [level, run, focus]);
  // Häufige Fehler: die 3 Fragen mit den meisten Fehlversuchen in diesem Level
  const mistakes = [...level.quiz, ...level.boss.questions]
    .map((q) => ({ q, n: progress.wrongTotal[reviewKey(level.id, q.id)] ?? 0 }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);

  const start = (s: Stage) => {
    setRun((r) => r + 1);
    setStage(s);
    window.scrollTo({ top: 0 });
  };

  const done = (kind: 'quiz' | 'boss') => (s: SessionSummary) => {
    const score = s.correct / s.total;
    update((p) => (kind === 'quiz' ? finishQuiz(p, level.id, score) : finishBoss(p, level.id, score, s.heartsLeft, level.boss.hearts)));
    setLast({ kind, s });
    start('result');
  };

  const back = (
    <button type="button" onClick={() => start('overview')} className="mb-3 text-sm text-slate-400 hover:text-white">
      ← Level-Übersicht
    </button>
  );

  if (stage === 'lesson')
    return (
      <div>
        {back}
        <h1 className="mb-4 text-2xl font-bold">📖 {level.title}</h1>
        <LessonView level={level} />
        <button
          type="button"
          onClick={() => {
            update((p) => completeLesson(p, level.id));
            start('quiz');
          }}
          className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Lektion abgeschlossen – zum Quiz →
        </button>
      </div>
    );

  if (stage === 'lab' && level.lab) {
    const lab = level.lab;
    const done = progress.labs[level.id] ?? [];
    return (
      <div>
        {back}
        <h1 className="mb-1 text-xl font-bold">🧪 Praxis-Lab: {lab.title}</h1>
        <p className="mb-4 text-sm text-slate-400">Du brauchst: {lab.needs}</p>
        <ol className="space-y-2">
          {lab.steps.map((st, i) => (
            <li key={i}>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 ${done.includes(i) ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-slate-700'}`}>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-emerald-400"
                  checked={done.includes(i)}
                  onChange={() => update((p) => toggleLabStep(p, level.id, i, lab.steps.length))}
                />
                <span className="text-sm"><RichText text={`**${i + 1}.** ${st}`} /></span>
              </label>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-slate-400">
          {progress.labsDone[level.id] ? '✅ Lab abgeschlossen.' : `Alle Schritte erledigt = einmalig +${XP.lab} XP.`} Das Lab ist freiwillig und zählt nicht zum Bestehen des Levels.
        </p>
      </div>
    );
  }

  if (stage === 'quiz')
    return (
      <div>
        {back}
        <h1 className="mb-4 text-xl font-bold">📝 Quiz: {level.title}</h1>
        <QuestionSession key={run} items={quizItems} mode="quiz" onFinish={done('quiz')} />
      </div>
    );

  if (stage === 'boss')
    return (
      <div>
        {back}
        <h1 className="mb-4 text-xl font-bold">👾 Boss-Challenge: {level.title}</h1>
        <QuestionSession
          key={run}
          items={bossItems}
          mode="boss"
          hearts={level.boss.hearts}
          onFinish={done('boss')}
        />
      </div>
    );

  if (stage === 'result' && last) {
    const pct = Math.round((last.s.correct / last.s.total) * 100);
    const ok = pct >= PASS_THRESHOLD * 100 && (last.kind === 'quiz' || last.s.heartsLeft > 0);
    return (
      <div className="space-y-4 text-center">
        <div className="text-6xl">{ok ? (last.kind === 'boss' ? '🏆' : '🎉') : '💪'}</div>
        <h1 className="text-2xl font-bold">{ok ? (last.kind === 'boss' ? 'Boss besiegt!' : 'Quiz bestanden!') : 'Noch nicht ganz'}</h1>
        <p className="text-slate-300">
          {last.s.correct} von {last.s.total} richtig ({pct} %).
          {last.kind === 'boss' && last.s.heartsLeft <= 0 && ' Alle Herzen verloren.'}
        </p>
        {!ok && <p className="text-sm text-slate-400">Zum Bestehen brauchst du mindestens 80 %. Falsche Fragen liegen jetzt im Wiederholen-Stapel.</p>}
        {ok && isPassed(lp) && <p className="text-emerald-300">Level abgeschlossen – das nächste Level ist freigeschaltet.</p>}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          {ok && last.kind === 'quiz' && (
            <button type="button" onClick={() => start('boss')} className="rounded-xl bg-rose-500 px-4 py-3 font-semibold hover:bg-rose-400">
              👾 Zur Boss-Challenge
            </button>
          )}
          {!ok && (
            <button type="button" onClick={() => start(last.kind)} className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
              Nochmal versuchen
            </button>
          )}
          <button type="button" onClick={() => start('overview')} className="rounded-xl bg-slate-800 px-4 py-3 hover:bg-slate-700">
            Level-Übersicht
          </button>
          <Link to="/" className="rounded-xl bg-slate-800 px-4 py-3 hover:bg-slate-700">Lernpfad</Link>
        </div>
      </div>
    );
  }

  const stepCls = 'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition';
  return (
    <div>
      <Link to="/" className="mb-3 inline-block text-sm text-slate-400 hover:text-white">← Lernpfad</Link>
      <h1 className="text-2xl font-bold">{level.title}</h1>
      <p className="text-sm text-slate-400">{level.titleEn}</p>
      <p className="mt-3 text-slate-300">{level.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {level.certs.map((c) => (
          <span key={c} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">🎓 {certs[c].name} ({certs[c].exam})</span>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => start('lesson')} className={`${stepCls} border-slate-700 bg-slate-900 hover:border-cyan-400`}>
          <span className="text-2xl">📖</span>
          <span className="flex-1"><b>1. Lektion</b><br /><span className="text-sm text-slate-400">{level.lesson.length} Abschnitte</span></span>
          {lp.lessonDone && <span className="text-emerald-400">✓</span>}
        </button>
        <button type="button" onClick={() => start('quiz')} className={`${stepCls} border-slate-700 bg-slate-900 hover:border-cyan-400`}>
          <span className="text-2xl">📝</span>
          <span className="flex-1"><b>2. Quiz</b><br /><span className="text-sm text-slate-400">{quizQs.length} Fragen{quizQs.length < level.quiz.length ? ` (Fokus ${focus?.toUpperCase()})` : ''} · Bestwert {Math.round(lp.quizBest * 100)} % · mind. 80 %</span></span>
          {quizOk && <span className="text-emerald-400">✓</span>}
        </button>
        <button
          type="button"
          disabled={!quizOk}
          onClick={() => start('boss')}
          className={`${stepCls} ${quizOk ? 'border-rose-500/50 bg-slate-900 hover:border-rose-400' : 'cursor-not-allowed border-slate-800 bg-slate-900/50 opacity-50'}`}
        >
          <span className="text-2xl">{quizOk ? '👾' : '🔒'}</span>
          <span className="flex-1">
            <b>3. Boss-Challenge</b><br />
            <span className="text-sm text-slate-400">
              {quizOk ? `${level.boss.questions.length} schwere Fragen · ${'❤️'.repeat(level.boss.hearts)}` : 'Erst Quiz mit mind. 80 % bestehen'}
            </span>
          </span>
          {lp.bossPassed && <span className="text-emerald-400">✓</span>}
        </button>
        {level.lab && (
          <button type="button" onClick={() => start('lab')} className={`${stepCls} border-slate-700 bg-slate-900 hover:border-emerald-400`}>
            <span className="text-2xl">🧪</span>
            <span className="flex-1">
              <b>Bonus: Praxis-Lab</b><br />
              <span className="text-sm text-slate-400">{level.lab.title} · {(progress.labs[level.id] ?? []).length}/{level.lab.steps.length} Schritte</span>
            </span>
            {progress.labsDone[level.id] && <span className="text-emerald-400">✓</span>}
          </button>
        )}
      </div>
      {mistakes.length > 0 && (
        <section className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
          <h2 className="mb-2 font-semibold text-rose-300">⚠️ Deine häufigsten Fehler in diesem Level</h2>
          <ul className="space-y-1 text-sm">
            {mistakes.map(({ q, n }) => (
              <li key={q.id} className="flex gap-2">
                <span className="shrink-0 rounded bg-rose-500/20 px-1.5 text-xs leading-5">{n}×</span>
                <span>{plainPrompt(q) || 'Rechenaufgabe'}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-400">Tipp: Lektion zu diesen Themen nochmal lesen, die Fragen kommen im Wiederholen-Stapel wieder.</p>
        </section>
      )}
    </div>
  );
}
