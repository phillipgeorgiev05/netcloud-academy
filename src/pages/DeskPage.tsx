import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getLevel } from '../content';
import { tickets } from '../content/tickets';
import type { Ticket } from '../types/content';
import { QuestionRenderer } from '../components/questions/QuestionRenderer';
import type { Result } from '../components/questions/shared';
import { recordTicket, ticketOfDay, today, XP } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';

const categories: Record<Ticket['category'], string> = { network: '🌐 Netzwerk', cloud: '☁️ Cloud', it: '💻 IT allgemein' };
const priorities: Record<Ticket['priority'], [string, string]> = {
  1: ['P1 kritisch', 'bg-rose-500 text-snow'],
  2: ['P2 hoch', 'bg-amber-500 text-ink'],
  3: ['P3 mittel', 'bg-cyan-500 text-snow'],
  4: ['P4 niedrig', 'bg-slate-700'],
};

export function DeskPage() {
  const { progress } = useProgress();
  const [filter, setFilter] = useState<Ticket['category'] | 'all'>('all');
  const [open, setOpen] = useState<Ticket | null>(null);
  const daily = ticketOfDay(tickets);
  const dailyDone = progress.deskDaily === today();
  const solved = Object.keys(progress.desk).length;

  if (open) return <TicketView ticket={open} isDaily={open.id === daily.id} onClose={() => setOpen(null)} />;

  const list = tickets.filter((t) => filter === 'all' || t.category === filter).sort((a, b) => a.priority - b.priority);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">🎧 Service Desk</h1>
        <p className="mt-1 text-sm text-slate-400">
          Echte Störungen aus dem Firmenalltag: Netzwerk, Cloud und allgemeine IT. Prüfen, Ursache finden, lösen, dokumentieren. {solved}/{tickets.length} gelöst.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(daily)}
        className="block w-full rounded-2xl border-2 border-yellow-400/50 bg-yellow-400/10 p-4 text-left hover:border-yellow-400"
      >
        <div className="text-xs font-semibold text-yellow-300">⭐ TICKET DES TAGES {dailyDone ? '· erledigt ✓' : `· +${XP.dailyTicket} XP Bonus`}</div>
        <div className="mt-1 font-semibold">{daily.title}</div>
        <div className="text-sm text-slate-400">{categories[daily.category]} · {daily.reporter}</div>
      </button>

      <details className="rounded-2xl bg-slate-900 p-4 text-sm">
        <summary className="cursor-pointer font-semibold">📘 So arbeitet ein Service Desk (ITIL-Grundlagen)</summary>
        <div className="mt-3 space-y-2 text-slate-300">
          <p><b>Incident</b> = ungeplante Störung („geht nicht“). <b>Service Request</b> = Standardanfrage („brauche Zugang“). <b>Problem</b> = unbekannte Ursache hinter wiederkehrenden Incidents. <b>Change</b> = geplante Änderung.</p>
          <p><b>Priorität = Auswirkung × Dringlichkeit.</b> Viele Betroffene und Arbeit unmöglich = P1. Eine Person mit Umweg = P3/P4.</p>
          <p><b>1st Level</b> nimmt auf und löst Standardfälle, <b>2nd Level</b> übernimmt Spezialthemen, <b>3rd Level</b> sind Hersteller oder Entwickler. Wer nicht weiterkommt, <b>eskaliert</b> rechtzeitig.</p>
          <p><b>SLA</b> (Service Level Agreement) legt Reaktions- und Lösungszeiten pro Priorität fest.</p>
          <p>Vorgehen: Identität prüfen (bei Konten), Fakten sammeln, eingrenzen, eine Änderung nach der anderen, testen, <b>dokumentieren</b>, Nutzer informieren.</p>
        </div>
      </details>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Kategorie">
        {(['all', 'network', 'cloud', 'it'] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-sm ${filter === c ? 'bg-cyan-500 text-snow' : 'bg-slate-800 text-slate-300'}`}
          >
            {c === 'all' ? 'Alle' : categories[c]}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {list.map((t) => (
          <li key={t.id}>
            <button type="button" onClick={() => setOpen(t)} className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-slate-900 p-3 text-left hover:border-cyan-400">
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${priorities[t.priority][1]}`}>{priorities[t.priority][0]}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{t.title}</span>
                <span className="block truncate text-xs text-slate-400">{categories[t.category]} · {t.reporter}</span>
              </span>
              {progress.desk[t.id] && <span className="text-emerald-400" aria-label="gelöst">✓</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TicketView({ ticket, isDaily, onClose }: { ticket: Ticket; isDaily: boolean; onClose: () => void }) {
  const { update } = useProgress();
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);
  const learn = ticket.learn && getLevel(ticket.learn);

  return (
    <div className="space-y-4">
      <button type="button" onClick={onClose} className="text-sm text-cyan-400">← Zur Warteschlange</button>
      <div className="rounded-2xl bg-slate-900 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-md px-2 py-0.5 font-semibold ${priorities[ticket.priority][1]}`}>{priorities[ticket.priority][0]}</span>
          <span className="text-slate-400">#{ticket.id.toUpperCase()} · {categories[ticket.category]}</span>
          {isDaily && <span className="text-yellow-300">⭐ Ticket des Tages</span>}
        </div>
        <h1 className="mt-2 text-xl font-bold">{ticket.title}</h1>
        <div className="text-sm text-slate-400">Gemeldet von: {ticket.reporter}</div>
      </div>
      <QuestionRenderer
        key={attempt}
        q={ticket}
        result={result}
        onResult={(r) => {
          setResult(r);
          update((p) => recordTicket(p, ticket.id, r.correct, isDaily));
        }}
      />
      {result && (
        <div className="flex flex-wrap gap-2">
          {!result.correct && (
            <button type="button" onClick={() => { setResult(null); setAttempt((a) => a + 1); }} className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-snow">
              Nochmal bearbeiten
            </button>
          )}
          <button type="button" onClick={onClose} className="rounded-xl bg-slate-800 px-4 py-2">Nächstes Ticket</button>
          {learn && <Link to={`/level/${learn.id}`} className="rounded-xl bg-slate-800 px-4 py-2">📖 Nachlernen: {learn.title}</Link>}
        </div>
      )}
    </div>
  );
}
