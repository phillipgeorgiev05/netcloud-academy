import { useEffect } from 'react';
import { useProgress } from './ProgressContext';
import { today } from './progress';

const REMINDED_KEY = 'netcloud-reminded';
const FROM_HOUR = 18;

// shortcut: erinnert nur, solange die App (Tab/PWA) geöffnet ist; echte Push-Erinnerungen bräuchten einen Server.
export function useStreakReminder() {
  const { progress } = useProgress();
  const { reminder } = progress.settings;
  const { lastDay, current } = progress.streak;
  useEffect(() => {
    if (!reminder || typeof Notification === 'undefined') return;
    const check = () => {
      const d = today();
      let reminded: string | null = null;
      try {
        reminded = localStorage.getItem(REMINDED_KEY);
      } catch {
        // ohne Speicher lieber gar nicht erinnern als mehrfach
        return;
      }
      if (Notification.permission !== 'granted' || lastDay === d || reminded === d || new Date().getHours() < FROM_HOUR) return;
      new Notification('NetCloud Academy', { body: current > 0 ? `Deine ${current}-Tage-Streak wartet! Eine Frage reicht.` : 'Zeit für ein paar Fragen?' });
      try {
        localStorage.setItem(REMINDED_KEY, d);
      } catch {
        // egal
      }
    };
    check();
    const t = setInterval(check, 15 * 60 * 1000);
    return () => clearInterval(t);
  }, [reminder, lastDay, current]);
}
