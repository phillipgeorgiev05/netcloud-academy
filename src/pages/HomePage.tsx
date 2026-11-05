import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getLevel, levels, tracks } from '../content';
import type { Level, Track } from '../types/content';
import { tickets } from '../content/tickets';
import {
  DEFAULT_DAILY_GOAL, dailyXp, dueReviews, isPassed, isUnlocked, lastWeek, levelProgress, levelStars, playerLevel, PASS_THRESHOLD, ticketOfDay, today, XP,
} from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import { Flame, Icon, Star } from '../components/Icons';
import { Ring, Stars } from '../components/Celebrate';

const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
const dayLetter = new Intl.DateTimeFormat('de-DE', { weekday: 'narrow' });

export function HomePage() {
  const { progress } = useProgress();
  // Nächstes Level: erstes offenes, noch nicht bestandenes in Lernreihenfolge (Teil 0 zuerst)
  const next = levels.find((l) => isUnlocked(l, levels, progress) && !isPassed(levelProgress(progress, l.id)));

  return (
    <div className="space-y-10">
      <header className="anim-rise">
        <div className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">{weekday.format(new Date())}</div>
        <h1 className="text-[34px] font-bold leading-tight tracking-tight sm:text-[40px]">Lernpfad</h1>
      </header>

      <TodayCard />

      {next && (
        <Link
          to={`/level/${next.id}`}
          className="anim-rise group flex items-center gap-4 rounded-[22px] bg-cyan-500 p-5 text-snow shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold uppercase tracking-wide opacity-80">Weiter lernen · {tracks[next.track].title.split(' – ')[0]}</span>
            <span className="block truncate text-xl font-semibold tracking-tight">{next.title}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-x-0.5">
            <Icon name="chevron" className="h-5 w-5" />
          </span>
        </Link>
      )}

      {(Object.keys(tracks) as Track[]).map((t) => (
        <TrackSection key={t} track={t} current={next?.id} />
      ))}
    </div>
  );
}

function TodayCard() {
  const { progress } = useProgress();
  const pl = playerLevel(progress.xp);
  const due = dueReviews(progress).length;
  const goal = progress.settings.dailyGoal ?? DEFAULT_DAILY_GOAL;
  const xpToday = dailyXp(progress);
  const reached = xpToday >= goal;
  const week = lastWeek(progress);
  const weekXp = week.reduce((s, d) => s + d.xp, 0);
  const max = Math.max(goal, ...week.map((d) => d.xp));

  return (
    <section className="anim-rise rounded-[22px] bg-slate-900 p-5" style={{ animationDelay: '0.05s' }}>
      <div className="flex items-center gap-5">
        <Ring value={xpToday / goal} size={92} stroke={10} color={reached ? 'stroke-emerald-400' : 'stroke-cyan-400'}>
          <Ring value={pl.into / pl.needed} size={60} stroke={8} color="stroke-yellow-400">
            <span className="text-sm font-bold">{pl.level}</span>
          </Ring>
        </Ring>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div>
            <div className="text-[13px] font-medium text-slate-400">Tagesziel</div>
            <div className="text-xl font-semibold tracking-tight">
              {reached ? 'Geschafft' : `${xpToday} / ${goal} XP`}
              {reached && <span className="ml-1.5 text-base text-emerald-400">✓</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-1 font-semibold text-amber-400"><Flame />{progress.streak.current} {progress.streak.current === 1 ? 'Tag' : 'Tage'}</span>
            <span className="text-slate-400">Level {pl.level} · {pl.needed - pl.into} XP bis {pl.level + 1}</span>
          </div>
        </div>
      </div>

      {/* Wochenrückblick: XP pro Tag, Linie = Tagesziel */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between text-[13px]">
          <span className="font-medium text-slate-400">Diese Woche</span>
          <span className="font-semibold">{weekXp} XP</span>
        </div>
        <div className="relative flex h-16 items-end gap-2">
          <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-700" style={{ bottom: `${(goal / max) * 100}%` }} />
          {week.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div
                className={`w-full max-w-7 rounded-md ${d.xp >= goal ? 'bg-emerald-400' : d.xp > 0 ? 'bg-cyan-400' : 'bg-slate-800'}`}
                style={{ height: `${Math.max(d.xp / max, 0.06) * 100}%`, transition: 'height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                title={`${d.day}: ${d.xp} XP`}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-2">
          {week.map((d) => (
            <span key={d.day} className={`flex-1 text-center text-[11px] font-medium ${d.day === today() ? 'text-white' : 'text-slate-500'}`}>
              {dayLetter.format(new Date(`${d.day}T12:00`))}
            </span>
          ))}
        </div>
      </div>

      {(due > 0 || progress.deskDaily !== today()) && (
        <div className="mt-5 divide-y divide-slate-700/60 overflow-hidden rounded-2xl bg-slate-800/60">
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

function TrackSection({ track, current }: { track: Track; current?: string }) {
  const { progress } = useProgress();
  const info = tracks[track];
  const trackLevels = levels.filter((l) => l.track === track);
  const passed = trackLevels.filter((l) => isPassed(levelProgress(progress, l.id))).length;
  const stars = trackLevels.reduce((s, l) => s + levelStars(levelProgress(progress, l.id)), 0);
  const [part, name] = info.title.split(' – ');

  return (
    <section className="anim-rise">
      <div className="mb-4 flex items-center gap-4 px-1">
        <Ring value={passed / info.planned.length} size={48} stroke={5} color="stroke-emerald-400">
          <span className="text-[11px] font-semibold text-slate-400">{passed}/{info.planned.length}</span>
        </Ring>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">{part}</div>
          <h2 className="text-[24px] font-bold leading-tight tracking-tight">{name}</h2>
          <p className="text-sm text-slate-400">{info.subtitle}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 self-start text-sm font-semibold text-slate-400" title="Gesammelte Sterne">
          <Star className="h-4 w-4 text-yellow-400" />{stars}
        </span>
      </div>
      {info.basics && <BasicsRefresher ids={info.basics} />}
      <TrackMap planned={info.planned} trackLevels={trackLevels} current={current} />
    </section>
  );
}

/** Verweis auf Vorwissen (meist Teil 0): Welche Grundlagen braucht dieser Teil, und sitzen sie schon? */
function BasicsRefresher({ ids }: { ids: string[] }) {
  const { progress } = useProgress();
  const items = ids.map(getLevel).filter((l): l is Level => !!l);
  const open = items.filter((l) => !isPassed(levelProgress(progress, l.id))).length;
  return (
    <div className="mb-4 rounded-2xl bg-slate-900 p-4">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold">Vorwissen{ids.every((id) => id.startsWith('basics-')) ? ' aus Teil 0' : ''}</span>
        <span className="text-xs text-slate-400">{open === 0 ? 'alles sitzt' : `${open} offen`}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((l) => {
          const ok = isPassed(levelProgress(progress, l.id));
          return (
            <Link key={l.id} to={`/level/${l.id}`} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium ${ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
              {ok && <Icon name="check" className="h-3.5 w-3.5" />}{l.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const ROW = 128; // Höhe einer Station in px
const XS = [50, 76, 50, 24]; // Zickzack der Stationen in % der Breite

/** Lernpfad als Karte: Stationen im Zickzack, verbunden durch einen Weg, der sich mit dem Fortschritt einfärbt. */
function TrackMap({ planned, trackLevels, current }: { planned: string[]; trackLevels: Level[]; current?: string }) {
  const { progress } = useProgress();
  const pts = planned.map((_, i) => ({ x: XS[i % XS.length], y: i * ROW + 36 }));
  const height = planned.length * ROW;
  const passedAt = (i: number) => {
    const l = trackLevels.find((x) => x.order === i + 1);
    return !!l && isPassed(levelProgress(progress, l.id));
  };

  return (
    <ol className="relative" style={{ height }}>
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {pts.slice(1).map((p, i) => {
          const a = pts[i];
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} C ${a.x} ${a.y + ROW / 2}, ${p.x} ${p.y - ROW / 2}, ${p.x} ${p.y}`}
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeWidth={passedAt(i) ? 5 : 3}
              strokeLinecap="round"
              strokeDasharray={passedAt(i) ? undefined : '2 9'}
              className={passedAt(i) ? 'stroke-emerald-400' : 'stroke-slate-700'}
            />
          );
        })}
      </svg>
      {planned.map((title, i) => {
        const level = trackLevels.find((l) => l.order === i + 1);
        return (
          <li key={title} className="absolute flex w-36 -translate-x-1/2 flex-col items-center text-center" style={{ left: `${pts[i].x}%`, top: pts[i].y - 32 }}>
            {level ? <Station level={level} current={level.id === current} /> : <PlannedStation n={i + 1} title={title} />}
          </li>
        );
      })}
    </ol>
  );
}

function Station({ level, current }: { level: Level; current: boolean }) {
  const { progress } = useProgress();
  const lp = levelProgress(progress, level.id);
  const open = isUnlocked(level, levels, progress);
  const done = isPassed(lp);
  const steps = Number(lp.lessonDone) + Number(lp.quizBest >= PASS_THRESHOLD) + Number(lp.bossPassed);

  const node = (
    <Ring value={steps / 3} size={64} stroke={4} color={done ? 'stroke-emerald-400' : 'stroke-cyan-400'}>
      <span
        className={`flex h-[50px] w-[50px] items-center justify-center rounded-full text-lg font-semibold shadow-md transition-transform group-hover:scale-105 ${
          done ? 'bg-emerald-500 text-snow' : open ? 'bg-cyan-500 text-snow' : 'bg-slate-800 text-slate-500'
        } ${current ? 'anim-halo' : ''}`}
      >
        {done ? <Icon name="check" className="h-6 w-6" /> : open ? level.order : <Icon name="lock" className="h-5 w-5" />}
      </span>
    </Ring>
  );
  const label = (
    <>
      <span className={`mt-1 line-clamp-2 rounded-lg bg-slate-950 px-1.5 py-0.5 text-[13px] font-semibold leading-tight ${open ? '' : 'text-slate-500'}`}>{level.title}</span>
      {done ? <span className="mt-0.5"><Stars n={levelStars(lp)} size="h-3 w-3" /></span> : current && <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-400">Hier geht’s weiter</span>}
    </>
  );
  return open ? (
    <Link to={`/level/${level.id}`} className="group flex flex-col items-center" aria-label={`${level.title}${done ? `, bestanden, ${levelStars(lp)} Sterne` : ''}`}>
      {node}
      {label}
    </Link>
  ) : (
    <div className="flex flex-col items-center opacity-70" title="Vorheriges Level mit mind. 80 % bestehen">
      {node}
      {label}
    </div>
  );
}

function PlannedStation({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex flex-col items-center opacity-50">
      <span className="flex h-16 w-16 items-center justify-center">
        <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-dashed border-slate-700 text-sm text-slate-500">{n}</span>
      </span>
      <span className="mt-1 line-clamp-2 rounded-lg bg-slate-950 px-1.5 py-0.5 text-[13px] font-semibold leading-tight">{title}</span>
      <span className="text-[11px] text-slate-500">in Arbeit</span>
    </div>
  );
}
