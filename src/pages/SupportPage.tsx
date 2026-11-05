import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getLevel } from '../content';
import { certs } from '../content/certs';
import { supportTickets } from '../content/support-tickets';
import type { ReadinessArea, SupportTicket } from '../types/content';
import { ChainQuestionView } from '../components/questions/ChainQuestionView';
import { RichText, type Result } from '../components/questions/shared';
import { recordSupportTicket, SUPPORT_PASS, XP } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import { docHits, grade, ticketScore } from '../lib/support';

const priorities: Record<SupportTicket['priority'], [string, string]> = {
  1: ['Dringend', 'bg-rose-500 text-snow'],
  2: ['Hoch', 'bg-amber-500 text-ink'],
  3: ['Mittel', 'bg-cyan-500 text-snow'],
  4: ['Niedrig', 'bg-slate-700'],
};
const areaName = (a: ReadinessArea) => certs.jobready.domains.find((d) => d.id === a)?.name ?? a;
const ticketNo = (t: SupportTicket) => `#${4100 + supportTickets.indexOf(t) + 1}`;
const level = (d: number) => ['', 'Einsteiger', 'Fortgeschritten', 'Profi'][d];

/** Ticket-Simulator: Hersteller-Support eines generischen IAM-Produkts, Tickets von Kunden-Admins im Helpdesk-Stil. */
export function SupportPage() {
  const { progress } = useProgress();
  const [lang, setLang] = useState<'all' | 'de' | 'en'>('all');
  const [area, setArea] = useState<ReadinessArea | 'all'>('all');
  const [open, setOpen] = useState<SupportTicket | null>(null);
  const solved = supportTickets.filter((t) => (progress.support[t.id] ?? 0) >= SUPPORT_PASS).length;

  if (open) return <TicketView key={open.id} ticket={open} onClose={() => setOpen(null)} />;

  const list = supportTickets
    .filter((t) => (lang === 'all' || t.lang === lang) && (area === 'all' || t.area === area))
    .sort((a, b) => a.difficulty - b.difficulty);
  const chip = (active: boolean) => `rounded-full px-3 py-1 text-sm ${active ? 'bg-cyan-500 text-snow' : 'bg-slate-800 text-slate-300'}`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">Ticket-Simulator</h1>
        <p className="mt-1 text-sm text-slate-400">
          Du arbeitest im 2nd/3rd Level Support eines Herstellers für Identity & Access Management. Kunden-Admins melden sich mit Problemen rund um AD, Fileserver, Exchange, Microsoft 365 und die IAM-Software. Prüfen, Logs lesen, Ursache finden, lösen und sauber dokumentieren. {solved}/{supportTickets.length} gelöst.
        </p>
      </div>

      <details className="rounded-2xl bg-slate-900 p-4 text-sm">
        <summary className="cursor-pointer font-semibold">📘 So wird bewertet</summary>
        <div className="mt-3 space-y-2 text-slate-300">
          <p><b>60 % Analyse:</b> Jeder Schritt (Rückfrage, Prüfschritt, Log-Auswertung, Ursache, Lösung) zählt, wenn er beim ersten Versuch stimmt.</p>
          <p><b>40 % Dokumentation:</b> Deine Antwort an den Kunden bzw. interne Notiz. Die Auswertung sucht die Pflichtpunkte (z. B. Ursache, Lösung, Prävention) über Stichwörter. Danach siehst du die Musterlösung.</p>
          <p>Ab <b>{SUPPORT_PASS} %</b> gilt das Ticket als gelöst (+{XP.ticket} XP beim ersten Mal). Das Produkt im Simulator ist ein generisches IAM-System, keine echte Herstellersoftware.</p>
        </div>
      </details>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sprache">
          {(['all', 'de', 'en'] as const).map((l) => (
            <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={chip(lang === l)}>
              {l === 'all' ? 'Alle Sprachen' : l === 'de' ? 'Deutsch' : 'English'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Bereich">
          <button type="button" aria-pressed={area === 'all'} onClick={() => setArea('all')} className={chip(area === 'all')}>Alle Bereiche</button>
          {certs.jobready.domains.filter((d) => supportTickets.some((t) => t.area === d.id)).map((d) => (
            <button key={d.id} type="button" aria-pressed={area === d.id} onClick={() => setArea(d.id as ReadinessArea)} className={chip(area === d.id)}>{d.name}</button>
          ))}
        </div>
      </div>

      <ul className="space-y-2">
        {list.map((t) => {
          const best = progress.support[t.id];
          return (
            <li key={t.id}>
              <button type="button" onClick={() => setOpen(t)} className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-slate-900 p-3 text-left hover:border-cyan-400">
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${priorities[t.priority][1]}`}>{priorities[t.priority][0]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{t.lang === 'en' && <span className="mr-1 text-xs text-slate-400">EN</span>}{t.title}</span>
                  <span className="block truncate text-xs text-slate-400">{ticketNo(t)} · {t.company} · {level(t.difficulty)}</span>
                </span>
                {best !== undefined && <span className={`shrink-0 text-sm font-semibold ${best >= SUPPORT_PASS ? 'text-emerald-400' : 'text-amber-400'}`}>{best} %</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TicketView({ ticket, onClose }: { ticket: SupportTicket; onClose: () => void }) {
  const { progress, update } = useProgress();
  const [attempt, setAttempt] = useState(0);
  const [chain, setChain] = useState<Result | null>(null);
  const [doc, setDoc] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const learn = ticket.learn && getLevel(ticket.learn);
  const en = ticket.lang === 'en';
  const hits = docHits(doc, ticket.doc.points);
  const mistakes = chain?.whyWrong.length ?? 0;
  const best = progress.support[ticket.id];

  const submit = () => {
    const s = ticketScore(ticket.steps.length, mistakes, hits);
    setScore(s);
    update((p) => recordSupportTicket(p, ticket.id, s));
  };
  const restart = () => {
    setChain(null);
    setDoc('');
    setScore(null);
    setAttempt((a) => a + 1);
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={onClose} className="text-sm text-cyan-400">← Zur Ticketliste</button>

      {/* Kopf wie in einem Helpdesk-Tool: Betreff, Status, Eigenschaften */}
      <div className="rounded-2xl bg-slate-900 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-md px-2 py-0.5 font-semibold ${priorities[ticket.priority][1]}`}>{priorities[ticket.priority][0]}</span>
          <span className={`rounded-md px-2 py-0.5 font-semibold ${score !== null && score >= SUPPORT_PASS ? 'bg-emerald-500 text-snow' : 'bg-slate-800 text-slate-300'}`}>
            {score !== null && score >= SUPPORT_PASS ? 'Gelöst' : chain ? 'In Bearbeitung' : 'Offen'}
          </span>
          <span className="text-slate-400">{ticketNo(ticket)} · Quelle: E-Mail · {areaName(ticket.area)} · {level(ticket.difficulty)}</span>
          {best !== undefined && <span className="text-slate-400">· Bestwert {best} %</span>}
        </div>
        <h1 className="mt-2 text-xl font-bold">{ticket.title}</h1>
        <div className="mt-3 flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500 font-semibold text-snow" aria-hidden="true">{ticket.requester[0]}</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm"><b>{ticket.requester}</b> <span className="text-slate-400">· {ticket.company}</span></div>
            <div className="mt-1 rounded-xl rounded-tl-none bg-slate-800/70 p-3 text-sm">
              <RichText text={ticket.prompt} />
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Bearbeitung</h2>
        <ChainQuestionView key={attempt} q={ticket} locked={!!chain} onResult={setChain} />
        {chain && <p className="mt-3 text-sm text-slate-400">Analyse: {ticket.steps.length - mistakes}/{ticket.steps.length} Schritte beim ersten Versuch richtig.</p>}
      </section>

      {chain && (
        <section className="rounded-2xl bg-slate-900 p-4">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">{en ? 'Antwort an den Kunden & interne Notiz (auf Englisch)' : 'Antwort an den Kunden & interne Notiz'}</h2>
          <p className="mb-2 text-sm text-slate-400">Schreibe kurz: {ticket.doc.points.map((p) => p.label).join(' · ')}</p>
          <textarea
            value={doc}
            disabled={score !== null}
            onChange={(e) => setDoc(e.target.value)}
            rows={7}
            aria-label="Dokumentation"
            placeholder={en ? 'Root cause: …\nSolution: …\nPrevention / next steps: …' : 'Ursache: …\nLösung: …\nPrävention / nächste Schritte: …'}
            className="w-full rounded-xl border-2 border-slate-700 bg-slate-950 p-3 text-sm outline-none focus:border-cyan-400"
          />
          {score === null && (
            <button type="button" disabled={doc.trim().length < 20} onClick={submit} className="mt-3 w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-snow hover:bg-cyan-400 disabled:opacity-40 sm:w-auto">
              Ticket lösen und bewerten
            </button>
          )}
        </section>
      )}

      {score !== null && (
        <section className="space-y-4 rounded-2xl bg-slate-900 p-4">
          <div className="flex items-center gap-4">
            <span className={`text-4xl font-bold ${score >= SUPPORT_PASS ? 'text-emerald-400' : 'text-amber-400'}`}>{score} %</span>
            <span className="text-sm text-slate-300">{grade(score)}</span>
          </div>
          <ul className="space-y-1 text-sm">
            {ticket.doc.points.map((p, i) => (
              <li key={p.label} className={hits[i] ? 'text-emerald-300' : 'text-rose-300'}>{hits[i] ? '✓' : '✗'} {p.label}</li>
            ))}
          </ul>
          <div>
            <h3 className="mb-1 font-semibold">Musterlösung</h3>
            <div className="rounded-xl border-l-4 border-cyan-500 bg-slate-800/60 p-3 text-sm"><RichText text={ticket.doc.model} /></div>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Fazit</h3>
            <RichText text={ticket.explanation} className="text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {score < 100 && <button type="button" onClick={restart} className="rounded-full bg-cyan-500 px-5 py-2 font-semibold text-snow">Nochmal bearbeiten</button>}
            <button type="button" onClick={onClose} className="rounded-full bg-slate-800 px-5 py-2">Nächstes Ticket</button>
            {learn && <Link to={`/level/${learn.id}`} className="rounded-full bg-slate-800 px-5 py-2">📖 Nachlernen: {learn.title}</Link>}
          </div>
        </section>
      )}
    </div>
  );
}
