import { useEffect } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { badges } from './content/badges';
import { Flame, Icon, Logo, Star } from './components/Icons';
import { DEV_UNLOCK } from './lib/dev';
import { useStreakReminder } from './lib/reminder';
import { useThemeSync } from './lib/theme';
import { DEFAULT_DAILY_GOAL, dailyXp, dueReviews, playerLevel } from './lib/progress';
import { ProgressProvider, useProgress } from './lib/ProgressContext';
import { HomePage } from './pages/HomePage';
import { LevelPage } from './pages/LevelPage';
import { ProfilePage } from './pages/ProfilePage';
import { DecidePage } from './pages/DecidePage';
import { DeskPage } from './pages/DeskPage';
import { ExamPage } from './pages/ExamPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { ReviewPage } from './pages/ReviewPage';
import { SheetPage } from './pages/SheetPage';
import { ToolsPage } from './pages/ToolsPage';
import { TrainerPage } from './pages/TrainerPage';

export function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Header />
        <main className="mx-auto max-w-3xl px-4 pb-24 pt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/level/:id" element={<LevelPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/trainer" element={<TrainerPage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/decide" element={<DecidePage />} />
            <Route path="/desk" element={<DeskPage />} />
            <Route path="/sheet/:id" element={<SheetPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <BadgeToast />
        <Reminder />
      </HashRouter>
    </ProgressProvider>
  );
}

const tabs = [
  { to: '/', label: 'Pfad', icon: 'path' },
  { to: '/review', label: 'Wiederholen', icon: 'review' },
  { to: '/tools', label: 'Tools', icon: 'tools' },
  { to: '/profile', label: 'Profil', icon: 'profile' },
] as const;

function Header() {
  const { progress } = useProgress();
  const pl = playerLevel(progress.xp);
  const due = dueReviews(progress).length;
  const badge = (cls: string) => due > 0 && <span className={`absolute rounded-full bg-rose-500 px-1.5 text-[10px] font-bold leading-4 text-snow ${cls}`}>{due}</span>;
  return (
    <>
      <header className="print:hidden sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl backdrop-saturate-150">
        {DEV_UNLOCK && <div className="bg-amber-500 px-4 py-0.5 text-center text-xs font-semibold text-ink">Testmodus: alle Level offen, getrennter Speicher</div>}
        <div className="mx-auto flex h-12 max-w-3xl items-center gap-2.5 px-4">
          <NavLink to="/" className="mr-auto flex min-w-0 items-center gap-2" aria-label="NetCloud Academy, Startseite">
            <Logo className="h-7 w-7 shrink-0 drop-shadow-sm" />
            <span className="truncate text-[17px] font-semibold tracking-tight text-white">NetCloud Academy</span>
          </NavLink>
          <nav className="hidden gap-1 sm:flex">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) => `relative rounded-full px-3 py-1 text-sm font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {t.label}
                {t.to === '/review' && badge('-right-1 -top-1')}
              </NavLink>
            ))}
          </nav>
          <DailyRing xp={dailyXp(progress)} goal={progress.settings.dailyGoal ?? DEFAULT_DAILY_GOAL} />
          <span className="flex items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-amber-400" title="Streak (Tage am Stück)">
            <Flame />{progress.streak.current}
          </span>
          <span className="flex items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-yellow-400" title={`${pl.into}/${pl.needed} XP bis Level ${pl.level + 1}`}>
            <Star />{pl.level}
          </span>
        </div>
      </header>
      {/* iOS-Tab-Bar auf schmalen Bildschirmen */}
      <nav className="print:hidden fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-slate-950/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 sm:hidden">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) => `relative flex flex-1 flex-col items-center gap-0.5 pb-1 pt-1.5 text-[10px] font-medium ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}
          >
            <Icon name={t.icon} className="h-6 w-6" />
            {t.label}
            {t.to === '/review' && badge('left-1/2 top-0.5 ml-1.5')}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

function DailyRing({ xp, goal }: { xp: number; goal: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  const f = Math.min(xp / goal, 1);
  return (
    <NavLink to="/profile" title={`Tagesziel: ${xp}/${goal} XP`} aria-label={`Tagesziel ${xp} von ${goal} XP`} className="shrink-0">
      <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-90">
        <circle cx="12" cy="12" r={r} fill="none" strokeWidth="3" className="stroke-slate-700" />
        <circle cx="12" cy="12" r={r} fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - f)} className={f >= 1 ? 'stroke-emerald-400' : 'stroke-cyan-400'} />
      </svg>
    </NavLink>
  );
}

function BadgeToast() {
  const { newBadges, dismissBadge } = useProgress();
  const b = badges.find((x) => x.id === newBadges[0]);
  useEffect(() => {
    if (!b) return;
    const t = setTimeout(dismissBadge, 4000);
    return () => clearTimeout(t);
  }, [b, dismissBadge]);
  if (!b) return null;
  return (
    <div className="fixed inset-x-0 bottom-20 z-50 sm:bottom-4 flex justify-center px-4">
      <button
        type="button"
        onClick={dismissBadge}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
      >
        <span className="text-3xl">{b.icon}</span>
        <span className="text-left">
          <span className="block text-xs uppercase tracking-wide text-yellow-300">Neues Abzeichen</span>
          <span className="block font-semibold">{b.name}</span>
          <span className="block text-xs text-slate-400">{b.description}</span>
        </span>
      </button>
    </div>
  );
}

function Reminder() {
  useStreakReminder();
  useThemeSync();
  return null;
}
