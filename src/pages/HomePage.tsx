import { Link } from 'react-router-dom';
import { levels, tracks } from '../content';
import { certs } from '../content/certs';
import type { Level, Track } from '../types/content';
import { tickets } from '../content/tickets';
import { dueReviews, ticketOfDay, today, XP, isPassed, isUnlocked, levelProgress, playerLevel, PASS_THRESHOLD } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';

export function HomePage() {
  const { progress } = useProgress();
  const pl = playerLevel(progress.xp);
  const due = dueReviews(progress).length;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-slate-900 p-5">
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-bold">Spielerlevel {pl.level}</h1>
          <span className="text-sm text-yellow-300">{progress.xp} XP</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-yellow-400" style={{ width: `${(pl.into / pl.needed) * 100}%` }} />
        </div>
        <div className="mt-1 text-xs text-slate-400">
          {pl.needed - pl.into} XP bis Level {pl.level + 1} · 🔥 {progress.streak.current} {progress.streak.current === 1 ? 'Tag' : 'Tage'} Streak (Rekord {progress.streak.longest})
        </div>
        {due > 0 && (
          <Link to="/review" className="mt-3 block rounded-xl bg-rose-500/20 p-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/30">
            🧠 {due} {due === 1 ? 'Frage ist' : 'Fragen sind'} zum Wiederholen fällig →
          </Link>
        )}
        {progress.deskDaily !== today() && (
          <Link to="/desk" className="mt-3 block rounded-xl bg-yellow-400/15 p-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/25">
            🎧 Ticket des Tages: „{ticketOfDay(tickets).title}“ · +{XP.dailyTicket} XP Bonus →
          </Link>
        )}
      </section>

      {(Object.keys(tracks) as Track[]).map((t) => (
        <TrackSection key={t} track={t} />
      ))}
    </div>
  );
}

function TrackSection({ track }: { track: Track }) {
  const { progress } = useProgress();
  const info = tracks[track];
  const trackLevels = levels.filter((l) => l.track === track);
  const passed = trackLevels.filter((l) => isPassed(levelProgress(progress, l.id))).length;

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">{info.title}</h2>
        <span className="text-sm text-slate-400">{passed}/{info.planned.length} bestanden</span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full bg-emerald-400" style={{ width: `${(passed / info.planned.length) * 100}%` }} />
      </div>
      <ol className="space-y-2">
        {info.planned.map((title, i) => {
          const level = trackLevels.find((l) => l.order === i + 1);
          return level ? <LevelCard key={level.id} level={level} /> : <PlannedCard key={title} n={i + 1} title={title} />;
        })}
      </ol>
    </section>
  );
}

function LevelCard({ level }: { level: Level }) {
  const { progress } = useProgress();
  const lp = levelProgress(progress, level.id);
  const open = isUnlocked(level, levels, progress);
  const done = isPassed(lp);
  // Lektion, Quiz ≥ 80 %, Boss = 3 Schritte
  const steps = Number(lp.lessonDone) + Number(lp.quizBest >= PASS_THRESHOLD) + Number(lp.bossPassed);

  const body = (
    <div className={`flex items-center gap-3 rounded-xl border p-3 transition ${
      done ? 'border-emerald-500/50 bg-emerald-500/5' : open ? 'border-transparent bg-slate-900 hover:border-cyan-400' : 'border-transparent bg-slate-900/50 opacity-60'
    }`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${done ? 'bg-emerald-500 text-snow' : open ? 'bg-cyan-500 text-snow' : 'bg-slate-800'}`}>
        {done ? '✓' : open ? level.order : '🔒'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{level.title}</div>
        <div className="truncate text-xs text-slate-400">{level.titleEn} · {level.certs.map((c) => certs[c].exam).join(', ')}</div>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2].map((i) => <span key={i} className={`h-1 flex-1 rounded ${i < steps ? 'bg-emerald-400' : 'bg-slate-700'}`} />)}
        </div>
      </div>
    </div>
  );
  return <li>{open ? <Link to={`/level/${level.id}`}>{body}</Link> : <div title="Vorheriges Level mit mind. 80 % bestehen">{body}</div>}</li>;
}

function PlannedCard({ n, title }: { n: number; title: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-dashed border-slate-800 p-3 opacity-50">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm">{n}</span>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-slate-500">Inhalte in Arbeit</div>
      </div>
    </li>
  );
}
