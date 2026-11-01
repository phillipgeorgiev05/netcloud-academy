import { Link } from 'react-router-dom';

const tools = [
  { to: '/desk', icon: '🎧', title: 'Service Desk', text: 'Echte Support-Tickets lösen: Netzwerk, Cloud, allgemeine IT. Jeden Tag ein Ticket des Tages mit Bonus-XP.' },
  { to: '/trainer', icon: '🧮', title: 'Trainer', text: 'Endlos-Übung mit Zufallsaufgaben: Subnetting, VLSM, IPv6, STP, NSG, IAM, RBAC, Kosten. Mit Bestzeit.' },
  { to: '/exam', icon: '🎓', title: 'Prüfungssimulation', text: 'Gemischte Fragen pro Zertifikat mit Zeitlimit und Auswertung nach Prüfungsbereichen.' },
  { to: '/glossary', icon: '📚', title: 'Glossar', text: 'Alle Fachbegriffe Deutsch ↔ Englisch, mit Link zum Level.' },
  { to: '/decide', icon: '🧭', title: 'Entscheidungshilfe', text: 'Welche Verbindung, welcher Load Balancer, welcher private Endpunkt? Azure und AWS im Vergleich.' },
];

export function ToolsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🧰 Werkzeuge</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="rounded-2xl border border-transparent bg-slate-900 p-4 hover:border-cyan-400">
            <div className="text-3xl">{t.icon}</div>
            <div className="mt-1 font-semibold">{t.title}</div>
            <div className="text-sm text-slate-400">{t.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
