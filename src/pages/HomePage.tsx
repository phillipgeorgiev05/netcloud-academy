import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { levels, tracks } from '../content';
import { certs } from '../content/certs';
import type { Level, Track } from '../types/content';
import { tickets } from '../content/tickets';
import { dueReviews, ticketOfDay, today, XP, isPassed, isUnlocked, levelProgress, playerLevel, PASS_THRESHOLD } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import { Icon } from '../components/Icons';

export function HomePage() {
  const { progress } = useProgress();
  const pl = playerLevel(progress.xp);
  const due = dueReviews(progress).length;

  return (
    <div className="space-y-8">
      <h1 className="text-[34px] font-bold leading-tight tracking-tight">Lernpfad</h1>
      <section className="-mt-4 rounded-2xl bg-slate-900 p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Spielerlevel {pl.level}</h2>
          <span className="text-sm font-medium text-slate-400">{progress.xp} XP</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-cyan-400" style={{ width: `${(pl.into / pl.needed) * 100}%` }} />
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {pl.needed - pl.into} XP bis Level {pl.level + 1} · {progress.streak.current} {progress.streak.current === 1 ? 'Tag' : 'Tage'} Streak (Rekord {progress.streak.longest})
        </div>
        {(due > 0 || progress.deskDaily !== today()) && (
          <div className="mt-4 divide-y divide-slate-700/60 overflow-hidden rounded-xl bg-slate-800/60">
            {due > 0 && (
              <ActionRow to="/review" icon="review" tint="bg-rose-500">
                {due} {due === 1 ? 'Frage ist' : 'Fragen sind'} zum Wiederholen fällig
              </ActionRow>
            )}
            {progress.deskDaily !== today() && (
              <ActionRow to="/desk" icon="headset" tint="bg-emerald-500">
                Ticket des Tages: „{ticketOfDay(tickets).title}“ <span className="text-slate-400">· +{XP.dailyTicket} XP</span>
              </ActionRow>
            )}
          </div>
        )}
      </section>

      {(Object.keys(tracks) as Track[]).map((t) => (
        <TrackSection key={t} track={t} />
      ))}
    </div>
  );
}

function ActionRow({ to, icon, tint, children }: { to: string; icon: 'review' | 'headset'; tint: string; children: ReactNode }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-slate-700/40">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-snow ${tint}`}><Icon name={icon} className="h-4 w-4" /></span>
      <span className="min-w-0 flex-1 font-medium">{children}</span>
      <Icon name="chevron" className="h-4 w-4 shrink-0 text-slate-500" />
    </Link>
  );
}

function TrackSection({ track }: { track: Track }) {
  const { progress } = useProgress();
  const info = tracks[track];
  const trackLevels = levels.filter((l) => l.track === track);
  const passed = trackLevels.filter((l) => isPassed(levelProgress(progress, l.id))).length;

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-xl font-bold tracking-tight sm:text-[22px]">{info.title}</h2>
        <span className="shrink-0 text-sm text-slate-400">{passed}/{info.planned.length} bestanden</span>
      </div>
      <div className="mx-1 mb-3 h-1 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(passed / info.planned.length) * 100}%` }} />
      </div>
      <ol className="divide-y divide-slate-800 overflow-hidden rounded-2xl bg-slate-900">
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
    <div className={`flex items-center gap-3 px-4 py-3 ${open ? 'hover:bg-slate-800/50' : 'opacity-50'}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${done ? 'bg-emerald-500 text-snow' : open ? 'bg-cyan-500 text-snow' : 'bg-slate-800 text-slate-400'}`}>
        {done ? <Icon name="check" className="h-4 w-4" /> : open ? level.order : <Icon name="lock" className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{level.title}</div>
        <div className="truncate text-xs text-slate-400">{level.titleEn} · {level.certs.map((c) => certs[c].exam).join(', ')}</div>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${i < steps ? 'bg-emerald-400' : 'bg-slate-800'}`} />)}
        </div>
      </div>
      {open && <Icon name="chevron" className="h-4 w-4 shrink-0 text-slate-500" />}
    </div>
  );
  return <li>{open ? <Link to={`/level/${level.id}`}>{body}</Link> : <div title="Vorheriges Level mit mind. 80 % bestehen">{body}</div>}</li>;
}

function PlannedCard({ n, title }: { n: number; title: string }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 opacity-50">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm text-slate-400">{n}</span>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-slate-500">Inhalte in Arbeit</div>
      </div>
    </li>
  );
}
