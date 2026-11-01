import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons';

const tools = [
  { to: '/desk', icon: 'headset', tint: 'bg-emerald-500', title: 'Service Desk', text: 'Echte Support-Tickets lösen: Netzwerk, Cloud, allgemeine IT. Jeden Tag ein Ticket des Tages mit Bonus-XP.' },
  { to: '/trainer', icon: 'calculator', tint: 'bg-amber-500', title: 'Trainer', text: 'Endlos-Übung mit Zufallsaufgaben: Subnetting, VLSM, IPv6, STP, NSG, IAM, RBAC, Kosten. Mit Bestzeit.' },
  { to: '/exam', icon: 'cap', tint: 'bg-cyan-500', title: 'Prüfungssimulation', text: 'Gemischte Fragen pro Zertifikat mit Zeitlimit und Auswertung nach Prüfungsbereichen.' },
  { to: '/glossary', icon: 'book', tint: 'bg-violet-500', title: 'Glossar', text: 'Alle Fachbegriffe Deutsch ↔ Englisch, mit Link zum Level.' },
  { to: '/decide', icon: 'compass', tint: 'bg-rose-500', title: 'Entscheidungshilfe', text: 'Welche Verbindung, welcher Load Balancer, welcher private Endpunkt? Azure und AWS im Vergleich.' },
] as const;

export function ToolsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight">Werkzeuge</h1>
      <div className="divide-y divide-slate-800 overflow-hidden rounded-2xl bg-slate-900">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] text-snow ${t.tint}`}><Icon name={t.icon} className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{t.title}</span>
              <span className="block text-sm text-slate-400">{t.text}</span>
            </span>
            <Icon name="chevron" className="h-4 w-4 shrink-0 text-slate-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
