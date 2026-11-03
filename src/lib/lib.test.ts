import { tablesOf } from './sheet';
import { chmodOf, lsdouWinner } from './games';
import { describe, expect, it } from 'vitest';
import { broadcastOf, generateSubnetProblem, networkOf, prefixForHosts, prefixToMask, subnetAnswerMatches, usableHosts } from './subnet';
import { addDays, emptyProgress, finishBoss, finishQuiz, isPassed, levelProgress, parseImport, playerLevel, recordAnswer, dailyXp, trackDaily, lastWeek, levelStars, emptyLevel, recordTicket, ticketOfDay } from './progress';
import type { SubnetTask } from '../types/content';

describe('subnet', () => {
  it('rechnet Netz und Broadcast', () => {
    expect(networkOf('172.16.45.200', 20)).toBe('172.16.32.0');
    expect(broadcastOf('172.16.45.200', 20)).toBe('172.16.47.255');
    expect(networkOf('192.168.1.190', 26)).toBe('192.168.1.128');
    expect(broadcastOf('10.1.2.3', 8)).toBe('10.255.255.255');
  });

  it('Masken und Hosts', () => {
    expect(prefixToMask(26)).toBe('255.255.255.192');
    expect(prefixToMask(0)).toBe('0.0.0.0');
    expect(prefixToMask(32)).toBe('255.255.255.255');
    expect(usableHosts(24)).toBe(254);
    expect(usableHosts(31)).toBe(2);
    expect(prefixForHosts(20)).toBe(27);
    expect(prefixForHosts(30)).toBe(27);
    expect(prefixForHosts(31)).toBe(26);
  });

  it('Zufallsaufgaben sind in sich stimmig', () => {
    const tasks: SubnetTask[] = ['network', 'broadcast', 'hosts', 'mask', 'range', 'prefixForHosts'];
    for (let i = 0; i < 500; i++) {
      for (const t of tasks) {
        const p = generateSubnetProblem(t, [16, 30]);
        expect(p.fields.length).toBeGreaterThan(0);
        if (t === 'prefixForHosts') {
          const hosts = Number(p.prompt.match(/(\d+) Hosts/)![1]);
          expect(p.fields[0].answer).toBe(`/${prefixForHosts(hosts)}`);
        }
      }
    }
  });

  it('Eingabe-Toleranz', () => {
    expect(subnetAnswerMatches(' /26 ', '/26')).toBe(true);
    expect(subnetAnswerMatches('26', '/26')).toBe(true);
    expect(subnetAnswerMatches('10.0.0.1', '10.0.0.10')).toBe(false);
  });
});

describe('progress', () => {
  it('Streak zählt Folgetage, reißt bei Lücke', () => {
    let p = emptyProgress();
    p = recordAnswer(p, 'a/q1', true, 'quiz', '2026-01-01');
    p = recordAnswer(p, 'a/q1', true, 'quiz', '2026-01-02');
    expect(p.streak.current).toBe(2);
    p = recordAnswer(p, 'a/q1', true, 'quiz', '2026-01-05');
    expect(p.streak).toEqual({ current: 1, longest: 2, lastDay: '2026-01-05' });
  });

  it('Leitner: falsch -> Box 1, richtig in Review -> weiter, nach Box 5 gemeistert', () => {
    let p = recordAnswer(emptyProgress(), 'a/q1', false, 'quiz', '2026-01-01');
    expect(p.review['a/q1']).toMatchObject({ box: 1, due: '2026-01-02' });
    p = recordAnswer(p, 'a/q1', true, 'quiz', '2026-01-02');
    expect(p.review['a/q1'].box).toBe(1); // im Quiz keine Beförderung
    for (let i = 0; i < 4; i++) p = recordAnswer(p, 'a/q1', true, 'review', '2026-01-02');
    expect(p.review['a/q1'].box).toBe(5);
    p = recordAnswer(p, 'a/q1', true, 'review', '2026-02-01');
    expect(p.review['a/q1']).toBeUndefined();
    expect(p.mastered).toBe(1);
  });

  it('bestanden erst mit Quiz >= 80 % und Boss', () => {
    let p = finishQuiz(emptyProgress(), 'l', 0.8);
    expect(isPassed(levelProgress(p, 'l'))).toBe(false);
    p = finishBoss(p, 'l', 0.9, 0, 3); // keine Herzen mehr
    expect(isPassed(levelProgress(p, 'l'))).toBe(false);
    p = finishBoss(p, 'l', 0.8, 3, 3);
    expect(isPassed(levelProgress(p, 'l'))).toBe(true);
    expect(levelProgress(p, 'l').bossPerfect).toBe(true);
  });

  it('Spielerlevel und Datumsrechnung', () => {
    expect(playerLevel(0).level).toBe(1);
    expect(playerLevel(100).level).toBe(2);
    expect(playerLevel(299).level).toBe(2);
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('Import lehnt Fremddaten ab', () => {
    expect(() => parseImport('{"foo":1}')).toThrow();
    expect(parseImport(JSON.stringify(emptyProgress())).version).toBe(1);
  });

  it('Tagesziel zählt nur XP von heute', () => {
    const p0 = emptyProgress();
    const p1 = trackDaily(p0, recordAnswer(p0, 'a/q1', true, 'quiz', '2026-05-01'), '2026-05-01');
    expect(dailyXp(p1, '2026-05-01')).toBe(10);
    const p2 = trackDaily(p1, recordAnswer(p1, 'a/q2', true, 'quiz', '2026-05-02'), '2026-05-02');
    expect(dailyXp(p2, '2026-05-02')).toBe(10);
    expect(dailyXp(p2, '2026-05-03')).toBe(0);
    // Alte Exporte ohne `daily` bekommen den Standardwert
    const { daily: _, ...old } = p0;
    expect(parseImport(JSON.stringify(old)).daily).toEqual({ day: '', xp: 0 });
  });

  it('Wochenrückblick: XP pro Tag, 7 Tage, ältester zuerst', () => {
    const p0 = emptyProgress();
    const p1 = trackDaily(p0, recordAnswer(p0, 'a/q1', true, 'quiz', '2026-05-01'), '2026-05-01');
    const p2 = trackDaily(p1, recordAnswer(p1, 'a/q2', true, 'quiz', '2026-05-03'), '2026-05-03');
    const w = lastWeek(p2, '2026-05-03');
    expect(w).toHaveLength(7);
    expect(w[6]).toEqual({ day: '2026-05-03', xp: 10 });
    expect(w[4]).toEqual({ day: '2026-05-01', xp: 10 });
    expect(w[5].xp).toBe(0);
  });

  it('Sterne: 0 offen, 1 bestanden, bis 3 mit Bestwerten', () => {
    const lp = { ...emptyLevel(), quizBest: 0.8, bossPassed: true };
    expect(levelStars(emptyLevel())).toBe(0);
    expect(levelStars(lp)).toBe(1);
    expect(levelStars({ ...lp, quizBest: 1 })).toBe(2);
    expect(levelStars({ ...lp, quizBest: 1, bossPerfect: true })).toBe(3);
  });

  it('Spickzettel findet nur Tabellen', () => {
    expect(tablesOf('Text\n| a | b |\n|---|---|\n| 1 | 2 |\nmehr\n\n| x |')).toEqual(['| a | b |\n|---|---|\n| 1 | 2 |', '| x |']);
  });
});

describe('Service Desk', () => {
  it('Ticket: 15 XP erstmals, danach 2, Tagesbonus nur einmal pro Tag', () => {
    let p = recordTicket(emptyProgress(), 'n01', true, true, '2026-11-01');
    expect(p.xp).toBe(15 + 30);
    expect(p.deskDaily).toBe('2026-11-01');
    p = recordTicket(p, 'n01', true, true, '2026-11-01');
    expect(p.xp).toBe(45 + 2);
    p = recordTicket(p, 'n02', false, false, '2026-11-01');
    expect(p.xp).toBe(47);
    expect(p.desk).toEqual({ n01: 1 });
  });
  it('Ticket des Tages wechselt täglich und ist deterministisch', () => {
    const list = ['a', 'b', 'c'];
    expect(ticketOfDay(list, '2026-11-01')).toBe(ticketOfDay(list, '2026-11-01'));
    expect(ticketOfDay(list, '2026-11-01')).not.toBe(ticketOfDay(list, '2026-11-02'));
  });
});

describe('Mini-Spiele', () => {
  it('chmod: Bits → Oktal und Symbolik', () => {
    const bits = (s: string) => s.split('').map((c) => c !== '-');
    expect(chmodOf(bits('rwxr-x---'))).toEqual({ octal: '750', symbolic: 'rwxr-x---' });
    expect(chmodOf(bits('rw-r--r--')).octal).toBe('644');
    expect(chmodOf(bits('---------')).octal).toBe('000');
  });

  it('LSDOU: letzte gewinnt, erzwungen ganz oben schlägt alles', () => {
    const none = { value: null };
    expect(lsdouWinner({ L: { value: 'blau' }, S: none, D: { value: 'rot' }, OU: { value: 'grün' } })).toEqual({ value: 'grün', from: 'OU' });
    expect(lsdouWinner({ L: { value: 'blau' }, S: none, D: none, OU: none })).toEqual({ value: 'blau', from: 'L' });
    expect(lsdouWinner({ L: none, S: { value: 'gelb', enforced: true }, D: { value: 'rot', enforced: true }, OU: { value: 'grün' } })).toEqual({ value: 'gelb', from: 'S' });
    expect(lsdouWinner({ L: none, S: none, D: none, OU: none })).toEqual({ value: null, from: null });
  });
});
