import { useEffect } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { badges } from './content/badges';
import { DEV_UNLOCK } from './lib/dev';
import { useStreakReminder } from './lib/reminder';
import { dueReviews, playerLevel } from './lib/progress';
import { ProgressProvider, useProgress } from './lib/ProgressContext';
import { HomePage } from './pages/HomePage';
import { LevelPage } from './pages/LevelPage';
import { ProfilePage } from './pages/ProfilePage';
import { DecidePage } from './pages/DecidePage';
import { ExamPage } from './pages/ExamPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { ReviewPage } from './pages/ReviewPage';
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
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <BadgeToast />
        <Reminder />
      </HashRouter>
    </ProgressProvider>
  );
}

function Header() {
  const { progress } = useProgress();
  const pl = playerLevel(progress.xp);
  const due = dueReviews(progress).length;
  const link = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-lg px-2 py-1 text-sm sm:px-3 ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}`;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      {DEV_UNLOCK && <div className="bg-amber-500 px-4 py-0.5 text-center text-xs font-semibold text-slate-950">Testmodus: alle Level offen, getrennter Speicher</div>}
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2">
        <NavLink to="/" className="mr-auto font-bold text-cyan-400">
          NetCloud<span className="hidden sm:inline"> Academy</span>
        </NavLink>
        <span className="whitespace-nowrap text-sm" title="Streak (Tage am Stück)">🔥 {progress.streak.current}</span>
        <span className="whitespace-nowrap text-sm text-yellow-300" title={`${pl.into}/${pl.needed} XP bis Level ${pl.level + 1}`}>
          ⭐ Lv {pl.level}
        </span>
        <nav className="flex gap-1">
          <NavLink to="/" end className={link}>Pfad</NavLink>
          <NavLink to="/review" className={link} aria-label="Wiederholen">
            <span className="sm:hidden">🧠</span>
            <span className="hidden sm:inline">Wiederholen</span>
            {due > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold">{due}</span>}
          </NavLink>
          <NavLink to="/tools" className={link} aria-label="Werkzeuge">
            <span className="sm:hidden">🧰</span>
            <span className="hidden sm:inline">Tools</span>
          </NavLink>
          <NavLink to="/profile" className={link}>Profil</NavLink>
        </nav>
      </div>
    </header>
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
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <button
        type="button"
        onClick={dismissBadge}
        className="flex items-center gap-3 rounded-2xl border border-yellow-400/50 bg-slate-900 px-4 py-3 shadow-2xl"
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
  return null;
}
