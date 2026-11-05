import { useState } from 'react';
import { Link } from 'react-router-dom';
import { levels } from '../content';
import { certs } from '../content/certs';
import { interviewCards } from '../content/interview';
import { supportTickets } from '../content/support-tickets';
import type { ReadinessArea } from '../types/content';
import { Ring } from '../components/Celebrate';
import { RichText } from '../components/questions/shared';
import { markInterviewCard } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import { readiness } from '../lib/support';

const areas = certs.jobready.domains.map((d) => d.id as ReadinessArea);
const areaName = (a: ReadinessArea) => certs.jobready.domains.find((d) => d.id === a)!.name;
const pct = (v: number) => `${Math.round(v * 100)} %`;

/** Bewerbungsmodus: Interviewfragen als Karten mit Musterantwort und Job-Readiness pro Anforderung. */
export function InterviewPage() {
  const { progress, update } = useProgress();
  const [area, setArea] = useState<ReadinessArea | 'all'>('all');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(false);

  const ready = readiness(progress, levels, supportTickets, interviewCards, areas);
  const overall = ready.reduce((s, r) => s + r.value, 0) / ready.length;
  const deck = interviewCards.filter((c) => (area === 'all' || c.area === area) && (!onlyOpen || !progress.interview[c.id]));
  const card = deck[Math.min(idx, deck.length - 1)];
  const go = (n: number) => {
    setShown(false);
    setIdx((i) => (deck.length ? (i + n + deck.length) % deck.length : 0));
  };
  const pickArea = (a: ReadinessArea | 'all') => {
    setArea(a);
    setIdx(0);
    setShown(false);
  };
  const mark = (known: boolean) => {
    update((p) => markInterviewCard(p, card.id, known));
    go(onlyOpen && known ? 0 : 1);
  };
  const chip = (active: boolean) => `rounded-full px-3 py-1 text-sm ${active ? 'bg-cyan-500 text-snow' : 'bg-slate-800 text-slate-300'}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">Bewerbungsmodus</h1>
        <p className="mt-1 text-sm text-slate-400">
          Vorbereitung auf das Vorstellungsgespräch als IT Support Specialist bei einem IAM-Softwarehersteller: typische technische Fragen mit Musterantworten und deine Job-Readiness pro Anforderung.
        </p>
      </div>

      <section className="rounded-[22px] bg-slate-900 p-5">
        <div className="mb-4 flex items-center gap-4">
          <Ring value={overall} size={72} stroke={8} color={overall >= 0.8 ? 'stroke-emerald-400' : 'stroke-cyan-400'}>
            <span className="text-sm font-bold">{pct(overall)}</span>
          </Ring>
          <div>
            <div className="text-lg font-semibold">Job-Readiness</div>
            <p className="text-xs text-slate-400">50 % Fragen aus Teil D richtig · 30 % Simulator-Tickets gelöst · 20 % Interview-Karten gekonnt. Englische Tickets und Karten zählen auch für Technisches Englisch.</p>
          </div>
        </div>
        <ul className="space-y-3">
          {ready.map((r) => (
            <li key={r.area}>
              <button type="button" onClick={() => pickArea(r.area)} className="block w-full text-left">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{areaName(r.area)}</span>
                  <span className={r.value >= 0.8 ? 'font-semibold text-emerald-400' : 'text-slate-400'}>{pct(r.value)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className={`h-full ${r.value >= 0.8 ? 'bg-emerald-400' : 'bg-cyan-400'}`} style={{ width: pct(r.value) }} />
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">{r.parts.map((x) => `${x.label} ${x.done}/${x.total}`).join(' · ')}</div>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link to="/support" className="rounded-full bg-slate-800 px-3 py-1">🎫 Ticket-Simulator</Link>
          <Link to="/exam" className="rounded-full bg-slate-800 px-3 py-1">📝 Interview-Check (Prüfungssimulation)</Link>
        </div>
      </section>

      <details className="rounded-2xl bg-slate-900 p-4 text-sm">
        <summary className="cursor-pointer font-semibold">💡 So beantwortest du technische Fragen im Interview</summary>
        <div className="mt-3 space-y-2 text-slate-300">
          <p><b>Strukturiert denken, laut denken:</b> Bei Troubleshooting-Fragen erst Fakten sammeln, eingrenzen, Hypothese prüfen, lösen, dokumentieren. Interviewer bewerten oft den Weg mehr als die Endantwort.</p>
          <p><b>Beispiele aus der Praxis</b> (Ausbildung, Praktikum, Homelab) nach dem STAR-Muster: Situation, Aufgabe (Task), Vorgehen (Action), Ergebnis (Result).</p>
          <p><b>Ehrlich bei Lücken:</b> „Das habe ich noch nicht gemacht, ich würde so vorgehen …“ wirkt besser als Raten.</p>
          <p><b>Englisch:</b> Rechne damit, dass ein Teil des Gesprächs auf Englisch läuft, z. B. „Walk me through how you would troubleshoot …“.</p>
        </div>
      </details>

      <section className="space-y-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Bereich">
          <button type="button" aria-pressed={area === 'all'} onClick={() => pickArea('all')} className={chip(area === 'all')}>Alle</button>
          {areas.map((a) => (
            <button key={a} type="button" aria-pressed={area === a} onClick={() => pickArea(a)} className={chip(area === a)}>{areaName(a)}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={onlyOpen} onChange={(e) => { setOnlyOpen(e.target.checked); setIdx(0); setShown(false); }} />
          Nur Karten, die ich noch nicht kann
        </label>

        {!card ? (
          <p className="rounded-2xl bg-slate-900 p-4 text-sm text-emerald-300">Alle Karten in diesem Bereich sitzen. 🎉</p>
        ) : (
          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>{areaName(card.area)}{card.lang === 'en' ? ' · English' : ''}</span>
              <span>{Math.min(idx, deck.length - 1) + 1}/{deck.length}{progress.interview[card.id] ? ' · ✓ gekonnt' : ''}</span>
            </div>
            <p className="text-lg font-semibold">{card.q}</p>
            {!shown ? (
              <button type="button" onClick={() => setShown(true)} className="mt-4 w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-snow hover:bg-cyan-400 sm:w-auto">
                Erst selbst antworten, dann Musterantwort zeigen
              </button>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="rounded-xl border-l-4 border-cyan-500 bg-slate-800/60 p-3 text-sm"><RichText text={card.a} /></div>
                {card.tip && <p className="text-sm text-amber-300">💡 {card.tip}</p>}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => mark(true)} className="rounded-full bg-emerald-500 px-5 py-2 font-semibold text-snow">Konnte ich ✓</button>
                  <button type="button" onClick={() => mark(false)} className="rounded-full bg-slate-800 px-5 py-2">Nochmal üben</button>
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-between text-sm">
              <button type="button" onClick={() => go(-1)} className="text-cyan-400">← Zurück</button>
              <button type="button" onClick={() => go(1)} className="text-cyan-400">Weiter →</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
