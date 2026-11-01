import { useState } from 'react';
import { GenProblemForm } from '../components/questions/GeneratedQuestionView';
import { RichText, type Result } from '../components/questions/shared';
import { generate, generatorNames, type GenProblem } from '../lib/generators';
import { recordPractice, recordTrainerTime } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import { generateSubnetProblem } from '../lib/subnet';
import type { GeneratorId, SubnetTask } from '../types/content';

const ROUND = 10;

const subnetTasks: Record<SubnetTask, string> = {
  network: 'IPv4 Netzadresse',
  broadcast: 'IPv4 Broadcast',
  range: 'IPv4 Host-Bereich',
  hosts: 'IPv4 Hosts pro Präfix',
  mask: 'IPv4 Maske zu Präfix',
  prefixForHosts: 'IPv4 Präfix für X Hosts',
};

type TaskId = `subnet:${SubnetTask}` | GeneratorId;

const allTasks: { id: TaskId; name: string }[] = [
  ...(Object.keys(subnetTasks) as SubnetTask[]).map((t) => ({ id: `subnet:${t}` as TaskId, name: subnetTasks[t] })),
  ...(Object.keys(generatorNames) as GeneratorId[]).map((g) => ({ id: g as TaskId, name: generatorNames[g] })),
];

function make(id: TaskId): GenProblem {
  if (id.startsWith('subnet:')) {
    const p = generateSubnetProblem(id.slice(7) as SubnetTask, [16, 30]);
    return { prompt: p.prompt, fields: p.fields, explanation: p.explanation };
  }
  return generate(id as GeneratorId);
}

const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.round((ms % 60000) / 1000)).padStart(2, '0')}`;

export function TrainerPage() {
  const { progress, update } = useProgress();
  const [task, setTask] = useState<TaskId | null>(null);
  const [problem, setProblem] = useState<GenProblem | null>(null);
  const [n, setN] = useState(0);
  const [right, setRight] = useState(0);
  const [start, setStart] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [finished, setFinished] = useState<number | null>(null);

  const begin = (id: TaskId) => {
    setTask(id);
    setProblem(make(id));
    setN(0);
    setRight(0);
    setResult(null);
    setFinished(null);
    setStart(Date.now());
  };

  const onResult = (r: Result) => {
    setResult(r);
    if (r.correct) setRight((x) => x + 1);
    update((p) => recordPractice(p, r.correct));
  };

  const next = () => {
    if (n + 1 >= ROUND) {
      const ms = Date.now() - start;
      setFinished(ms);
      // Bestzeit zählt nur bei fehlerfreier Runde
      if (right === ROUND) update((p) => recordTrainerTime(p, task!, ms));
      return;
    }
    setN(n + 1);
    setResult(null);
    setProblem(make(task!));
  };

  if (!task || !problem)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">🧮 Trainer</h1>
        <p className="text-sm text-slate-400">Runden à {ROUND} Zufallsaufgaben. Fehlerfreie Runden zählen für die Bestzeit. Jede richtige Antwort bringt etwas XP und hält die Streak am Leben.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {allTasks.map((t) => (
            <button key={t.id} type="button" onClick={() => begin(t.id)} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-3 text-left hover:border-cyan-400">
              <span>{t.name}</span>
              {progress.trainerBest[t.id] !== undefined && <span className="text-xs text-yellow-300">🏅 {fmt(progress.trainerBest[t.id])}</span>}
            </button>
          ))}
        </div>
      </div>
    );

  const name = allTasks.find((t) => t.id === task)!.name;
  if (finished !== null)
    return (
      <div className="space-y-4 text-center">
        <div className="text-5xl">{right === ROUND ? '🏅' : '💪'}</div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p>{right}/{ROUND} richtig in {fmt(finished)}.</p>
        {right === ROUND && <p className="text-yellow-300">Bestzeit: {fmt(Math.min(finished, progress.trainerBest[task] ?? finished))}</p>}
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => begin(task)} className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">Neue Runde</button>
          <button type="button" onClick={() => setTask(null)} className="rounded-xl bg-slate-800 px-4 py-3">Andere Aufgabe</button>
        </div>
      </div>
    );

  return (
    <div>
      <button type="button" onClick={() => setTask(null)} className="mb-3 text-sm text-slate-400 hover:text-white">← Aufgabenwahl</button>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{name}</h1>
        <span className="text-sm text-slate-400">{n + 1}/{ROUND} · ✅ {right}</span>
      </div>
      <GenProblemForm key={n} problem={problem} locked={result !== null} onResult={onResult} />
      {result && (
        <div className={`mt-4 rounded-xl border-2 p-3 text-sm ${result.correct ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-rose-500/60 bg-rose-500/10'}`}>
          <div className="font-bold">{result.correct ? '✅ Richtig' : `❌ Richtig wäre: ${result.solution}`}</div>
          {result.explanation && <RichText text={result.explanation} className="mt-2" />}
        </div>
      )}
      {result && (
        <button type="button" onClick={next} className="mt-4 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 sm:w-auto">
          {n + 1 >= ROUND ? 'Auswertung' : 'Nächste Aufgabe →'}
        </button>
      )}
    </div>
  );
}
