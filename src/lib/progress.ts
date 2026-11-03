// Reine Funktionen auf dem Fortschritts-Objekt. Kein React hier, damit alles testbar bleibt.
import type { CertId, Level } from '../types/content';
import { DEV_UNLOCK } from './dev';

export const PASS_THRESHOLD = 0.8;
export const XP = { correct: 10, repeat: 2, practice: 2, bossWin: 50, perfect: 25, lesson: 5, lab: 20, ticket: 15, dailyTicket: 30 } as const;
/** Leitner-Abstände in Tagen für Box 1–5. */
export const BOX_DAYS = [1, 3, 7, 14, 30] as const;

export interface LevelProgress {
  lessonDone: boolean;
  quizBest: number; // 0–1
  bossBest: number; // 0–1
  bossPassed: boolean;
  bossPerfect: boolean;
}

export interface ReviewItem {
  box: 1 | 2 | 3 | 4 | 5;
  due: string; // YYYY-MM-DD
  wrongCount: number;
}

export interface Progress {
  version: 1;
  xp: number;
  answered: number;
  mastered: number; // aus dem Wiederholen-Stapel entfernte Fragen
  streak: { current: number; longest: number; lastDay: string };
  levels: Record<string, LevelProgress>;
  review: Record<string, ReviewItem>; // key = levelId/questionId
  badges: Record<string, string>; // badgeId -> Datum
  // Ab hier optionale Erweiterungen: alte Exporte bekommen über emptyProgress() Standardwerte.
  solved: Record<string, 1>; // einmal richtig beantwortet -> danach nur noch XP.repeat
  wrongTotal: Record<string, number>; // Fehler pro Frage, bleibt auch nach „gemeistert“ erhalten
  labs: Record<string, number[]>; // levelId -> erledigte Lab-Schritte
  labsDone: Record<string, 1>; // Lab einmal komplett -> XP schon vergeben
  trainerBest: Record<string, number>; // Generator -> beste Zeit in ms für 10 richtige
  exams: Partial<Record<CertId, { best: number; last: number; date: string }>>;
  settings: { focusCert?: CertId; reminder?: boolean; dailyGoal?: number };
  daily: { day: string; xp: number }; // heute verdiente XP für das Tagesziel
  desk: Record<string, 1>; // Service-Desk-Ticket einmal gelöst -> danach nur noch XP.repeat
  deskDaily: string; // Tag, an dem der Bonus für das Ticket des Tages vergeben wurde
  history: Record<string, number>; // YYYY-MM-DD -> an dem Tag verdiente XP (Wochenrückblick)
}

export const emptyProgress = (): Progress => ({
  version: 1,
  xp: 0,
  answered: 0,
  mastered: 0,
  streak: { current: 0, longest: 0, lastDay: '' },
  levels: {},
  review: {},
  badges: {},
  solved: {},
  wrongTotal: {},
  labs: {},
  labsDone: {},
  trainerBest: {},
  exams: {},
  settings: {},
  daily: { day: '', xp: 0 },
  desk: {},
  deskDaily: '',
  history: {},
});

export const emptyLevel = (): LevelProgress => ({
  lessonDone: false,
  quizBest: 0,
  bossBest: 0,
  bossPassed: false,
  bossPerfect: false,
});

/** Lokales Datum als YYYY-MM-DD (nicht UTC, sonst springt die Streak um Mitternacht falsch). */
export const today = (d = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const addDays = (day: string, n: number): string => {
  const [y, m, d] = day.split('-').map(Number);
  return today(new Date(y, m - 1, d + n));
};

export const reviewKey = (levelId: string, questionId: string) => `${levelId}/${questionId}`;

export const levelProgress = (p: Progress, id: string): LevelProgress => p.levels[id] ?? emptyLevel();

export const isPassed = (lp: LevelProgress) => lp.quizBest >= PASS_THRESHOLD && lp.bossPassed;

/** 0 = nicht bestanden, 1 = bestanden, +1 Quiz ≥ 95 %, +1 Boss ohne Herzverlust. */
export const levelStars = (lp: LevelProgress) =>
  isPassed(lp) ? 1 + Number(lp.quizBest >= 0.95) + Number(lp.bossPerfect) : 0;

/** Level 1 jedes Tracks ist offen, sonst muss das vorherige Level im selben Track bestanden sein. */
export function isUnlocked(level: Level, all: Level[], p: Progress, unlockAll = DEV_UNLOCK): boolean {
  if (unlockAll) return true;
  const prev = all.filter((l) => l.track === level.track && l.order < level.order).sort((a, b) => b.order - a.order)[0];
  return !prev || isPassed(levelProgress(p, prev.id));
}

/** Gesamt-XP, ab der Spielerlevel L erreicht ist: 0, 100, 300, 600, 1000 … */
export const xpForPlayerLevel = (l: number) => 50 * l * (l - 1);
export function playerLevel(xp: number) {
  let l = 1;
  while (xp >= xpForPlayerLevel(l + 1)) l++;
  const from = xpForPlayerLevel(l);
  const to = xpForPlayerLevel(l + 1);
  return { level: l, into: xp - from, needed: to - from };
}

function touchStreak(p: Progress, now: string): Progress['streak'] {
  const s = p.streak;
  if (s.lastDay === now) return s;
  const current = s.lastDay === addDays(now, -1) ? s.current + 1 : 1;
  return { current, longest: Math.max(s.longest, current), lastDay: now };
}

export const DEFAULT_DAILY_GOAL = 30;

export const dailyXp = (p: Progress, now = today()) => (p.daily.day === now ? p.daily.xp : 0);

/** Rechnet den XP-Zuwachs einer Änderung dem heutigen Tagesziel zu. */
export function trackDaily(before: Progress, after: Progress, now = today()): Progress {
  const gain = after.xp - before.xp;
  if (gain <= 0) return after;
  const history = after.history ?? {};
  return { ...after, daily: { day: now, xp: dailyXp(after, now) + gain }, history: { ...history, [now]: (history[now] ?? 0) + gain } };
}

/** XP der letzten 7 Tage, ältester zuerst. */
export const lastWeek = (p: Progress, now = today()) =>
  [6, 5, 4, 3, 2, 1, 0].map((n) => {
    const day = addDays(now, -n);
    return { day, xp: p.history?.[day] ?? 0 };
  });

export type AnswerMode = 'quiz' | 'boss' | 'review';

export function recordAnswer(p: Progress, key: string, correct: boolean, mode: AnswerMode, now = today()): Progress {
  const review = { ...p.review };
  let mastered = p.mastered;
  const item = review[key];
  if (!correct) {
    review[key] = { box: 1, due: addDays(now, BOX_DAYS[0]), wrongCount: (item?.wrongCount ?? 0) + 1 };
  } else if (item && mode === 'review') {
    if (item.box === 5) {
      delete review[key];
      mastered++;
    } else {
      const box = (item.box + 1) as ReviewItem['box'];
      review[key] = { ...item, box, due: addDays(now, BOX_DAYS[box - 1]) };
    }
  }
  // Wiederholte Quiz-Durchläufe sollen kein XP-Farming erlauben, Review-Antworten zählen voll.
  const gain = !correct ? 0 : p.solved[key] && mode !== 'review' ? XP.repeat : XP.correct;
  return {
    ...p,
    xp: p.xp + gain,
    answered: p.answered + 1,
    mastered,
    review,
    solved: correct ? { ...p.solved, [key]: 1 } : p.solved,
    wrongTotal: correct ? p.wrongTotal : { ...p.wrongTotal, [key]: (p.wrongTotal[key] ?? 0) + 1 },
    streak: touchStreak(p, now),
  };
}

/** Übungsaufgaben (Trainer): wenig XP, zählt für die Streak, landet nicht im Wiederholen-Stapel. */
export function recordPractice(p: Progress, correct: boolean, now = today()): Progress {
  return { ...p, xp: p.xp + (correct ? XP.practice : 0), answered: p.answered + 1, streak: touchStreak(p, now) };
}

/** Service-Desk-Ticket abgeschlossen. Das Ticket des Tages bringt einmal pro Tag zusätzlich XP.dailyTicket. */
export function recordTicket(p: Progress, ticketId: string, correct: boolean, isDaily: boolean, now = today()): Progress {
  const gain = !correct ? 0 : p.desk[ticketId] ? XP.repeat : XP.ticket;
  const bonus = correct && isDaily && p.deskDaily !== now;
  return {
    ...p,
    xp: p.xp + gain + (bonus ? XP.dailyTicket : 0),
    answered: p.answered + 1,
    desk: correct ? { ...p.desk, [ticketId]: 1 } : p.desk,
    deskDaily: bonus ? now : p.deskDaily,
    streak: touchStreak(p, now),
  };
}

/** Wechselt täglich, für alle Nutzer gleich. */
export function ticketOfDay<T>(tickets: T[], now = today()): T {
  const [y, m, d] = now.split('-').map(Number);
  return tickets[Math.floor(Date.UTC(y, m - 1, d) / 86_400_000) % tickets.length];
}

export function recordTrainerTime(p: Progress, generator: string, ms: number): Progress {
  const best = p.trainerBest[generator];
  return best !== undefined && best <= ms ? p : { ...p, trainerBest: { ...p.trainerBest, [generator]: ms } };
}

/** Lab-Schritt an/aus. Beim ersten vollständigen Abschluss gibt es einmalig XP.lab. */
export function toggleLabStep(p: Progress, levelId: string, step: number, totalSteps: number): Progress {
  const before = p.labs[levelId] ?? [];
  const after = before.includes(step) ? before.filter((s) => s !== step) : [...before, step];
  const firstComplete = after.length === totalSteps && !p.labsDone[levelId];
  return {
    ...p,
    labs: { ...p.labs, [levelId]: after },
    xp: p.xp + (firstComplete ? XP.lab : 0),
    labsDone: firstComplete ? { ...p.labsDone, [levelId]: 1 } : p.labsDone,
  };
}

export function recordExam(p: Progress, cert: CertId, score: number, now = today()): Progress {
  const prev = p.exams[cert];
  return { ...p, exams: { ...p.exams, [cert]: { best: Math.max(prev?.best ?? 0, score), last: score, date: now } } };
}

export const dueReviews = (p: Progress, now = today()) =>
  Object.entries(p.review).filter(([, r]) => r.due <= now).map(([k]) => k);

export function completeLesson(p: Progress, levelId: string): Progress {
  const lp = levelProgress(p, levelId);
  if (lp.lessonDone) return p;
  return { ...p, xp: p.xp + XP.lesson, levels: { ...p.levels, [levelId]: { ...lp, lessonDone: true } } };
}

export function finishQuiz(p: Progress, levelId: string, score: number): Progress {
  const lp = levelProgress(p, levelId);
  return { ...p, levels: { ...p.levels, [levelId]: { ...lp, quizBest: Math.max(lp.quizBest, score) } } };
}

export function finishBoss(p: Progress, levelId: string, score: number, heartsLeft: number, hearts: number): Progress {
  const lp = levelProgress(p, levelId);
  const passed = heartsLeft > 0 && score >= PASS_THRESHOLD;
  const perfect = passed && heartsLeft === hearts;
  return {
    ...p,
    xp: p.xp + (passed ? XP.bossWin : 0) + (perfect ? XP.perfect : 0),
    levels: {
      ...p.levels,
      [levelId]: {
        ...lp,
        bossBest: Math.max(lp.bossBest, score),
        bossPassed: lp.bossPassed || passed,
        bossPerfect: lp.bossPerfect || perfect,
      },
    },
  };
}

/** Prüft ein importiertes JSON grob auf die erwartete Form. Wirft bei ungültigen Daten. */
export function parseImport(text: string): Progress {
  const data = JSON.parse(text);
  const ok =
    data && data.version === 1 &&
    typeof data.xp === 'number' &&
    typeof data.streak === 'object' &&
    typeof data.levels === 'object' &&
    typeof data.review === 'object' &&
    typeof data.badges === 'object';
  if (!ok) throw new Error('Datei ist kein gültiger NetCloud-Fortschritt (version 1).');
  return { ...emptyProgress(), ...data };
}
