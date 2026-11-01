import { describe, expect, it } from 'vitest';
import { broadcastOf, generateSubnetProblem, networkOf, prefixForHosts, prefixToMask, subnetAnswerMatches, usableHosts } from './subnet';
import { addDays, emptyProgress, finishBoss, finishQuiz, isPassed, levelProgress, parseImport, playerLevel, recordAnswer } from './progress';
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
});
