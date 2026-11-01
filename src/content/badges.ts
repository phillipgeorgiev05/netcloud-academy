import type { Badge, Level } from '../types/content';
import { tracks } from './index';
import { isPassed, levelProgress, type Progress } from '../lib/progress';

export interface BadgeDef extends Badge {
  earned: (p: Progress, levels: Level[]) => boolean;
}

const passed = (p: Progress, id: string) => isPassed(levelProgress(p, id));
const passedCount = (p: Progress, levels: Level[], track: Level['track']) =>
  levels.filter((l) => l.track === track && passed(p, l.id)).length;

export const badges: BadgeDef[] = [
  { id: 'first-answer', icon: '🎯', name: 'Erster Treffer', description: 'Erste Frage richtig beantwortet', earned: (p) => p.xp >= 10 },
  { id: 'first-lesson', icon: '📖', name: 'Wissbegierig', description: 'Erste Lektion gelesen', earned: (p) => Object.values(p.levels).some((l) => l.lessonDone) },
  { id: 'first-level', icon: '🏁', name: 'Level geschafft', description: 'Erstes Level bestanden', earned: (p, ls) => ls.some((l) => passed(p, l.id)) },
  { id: 'boss-perfect', icon: '💎', name: 'Makellos', description: 'Boss-Challenge ohne Herzverlust', earned: (p) => Object.values(p.levels).some((l) => l.bossPerfect) },
  { id: 'subnet-master', icon: '🧮', name: 'Subnetting-Profi', description: 'Level „IPv4 & Subnetting“ bestanden', earned: (p) => passed(p, 'net-04') },
  { id: 'cloud-starter', icon: '☁️', name: 'Wolkenstürmer', description: 'Erstes Cloud-Level bestanden', earned: (p) => passed(p, 'cloud-01') },
  { id: 'streak-3', icon: '🔥', name: 'Am Ball', description: '3 Tage Streak', earned: (p) => p.streak.longest >= 3 },
  { id: 'streak-7', icon: '🔥', name: 'Wochenkrieger', description: '7 Tage Streak', earned: (p) => p.streak.longest >= 7 },
  { id: 'streak-30', icon: '🏆', name: 'Unaufhaltsam', description: '30 Tage Streak', earned: (p) => p.streak.longest >= 30 },
  { id: 'review-10', icon: '🧠', name: 'Gedächtnis-Champion', description: '10 Fragen im Wiederholen-Stapel gemeistert', earned: (p) => p.mastered >= 10 },
  { id: 'xp-1000', icon: '⭐', name: '1000 XP', description: '1000 XP gesammelt', earned: (p) => p.xp >= 1000 },
  { id: 'desk-1', icon: '🎧', name: 'Erstes Ticket', description: 'Erstes Service-Desk-Ticket gelöst', earned: (p) => Object.keys(p.desk).length >= 1 },
  { id: 'desk-10', icon: '🛠️', name: 'Service-Desk-Profi', description: '10 Service-Desk-Tickets gelöst', earned: (p) => Object.keys(p.desk).length >= 10 },
  { id: 'network-complete', icon: '🌐', name: 'Netzwerk-Techniker', description: `Alle ${tracks.network.planned.length} Netzwerk-Level bestanden`, earned: (p, ls) => passedCount(p, ls, 'network') >= tracks.network.planned.length },
  { id: 'cloud-complete', icon: '🚀', name: 'Cloud-Engineer', description: `Alle ${tracks.cloud.planned.length} Cloud-Level bestanden`, earned: (p, ls) => passedCount(p, ls, 'cloud') >= tracks.cloud.planned.length },
];
