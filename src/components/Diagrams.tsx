import { useEffect, useState, type ReactNode } from 'react';
import type { DiagramId } from '../types/content';
import { CloudSymbol, ConnectorGallery, DeviceGallery, NetworkSymbols, PcSymbol, RouterSymbol, ServerSymbol, SwitchSymbol } from './Illustrations';

/** Schrittweise Animation: ◀ ▶ zum Blättern, ▶︎ Abspielen läuft automatisch durch. */
function Stepper({ steps, render }: { steps: string[]; render: (i: number) => ReactNode }) {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    if (i >= steps.length - 1) {
      setPlay(false);
      return;
    }
    const t = setTimeout(() => setI((x) => x + 1), 1600);
    return () => clearTimeout(t);
  }, [play, i, steps.length]);
  const btn = 'rounded-lg bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700 disabled:opacity-30';
  return (
    <figure className="mt-3 rounded-xl bg-slate-950 p-3">
      <div className="min-h-40">{render(i)}</div>
      <figcaption className="mt-2 text-sm text-slate-300" aria-live="polite">
        <span className="text-slate-500">Schritt {i + 1}/{steps.length}: </span>
        {steps[i]}
      </figcaption>
      <div className="mt-2 flex gap-2">
        <button type="button" className={btn} disabled={i === 0} onClick={() => setI(i - 1)} aria-label="Zurück">◀</button>
        <button type="button" className={btn} disabled={i === steps.length - 1} onClick={() => setI(i + 1)} aria-label="Weiter">▶</button>
        <button type="button" className={btn} onClick={() => { if (i === steps.length - 1) setI(0); setPlay(!play); }}>
          {play ? '⏸ Pause' : '▶︎ Abspielen'}
        </button>
      </div>
    </figure>
  );
}

const layerColors = ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-slate-400'];

function OsiEncapsulation() {
  const parts = [
    { label: 'Daten (HTTP)', color: layerColors[0] },
    { label: 'TCP-Header', color: layerColors[1] },
    { label: 'IP-Header', color: layerColors[2] },
    { label: 'Ethernet-Header', color: layerColors[3] },
  ];
  const steps = [
    'Die Anwendung erzeugt Daten, z. B. eine HTTP-Anfrage.',
    'Schicht 4 setzt den TCP-Header (Ports, Sequenznummer) davor → Segment.',
    'Schicht 3 setzt den IP-Header (IP-Adressen, TTL) davor → Paket.',
    'Schicht 2 setzt den Ethernet-Header (MACs) davor und hängt die FCS an → Frame.',
    'Schicht 1 sendet den Frame als Bits über das Medium.',
  ];
  return (
    <Stepper
      steps={steps}
      render={(i) => (
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full flex-row-reverse flex-wrap justify-center gap-1 text-[12px] font-semibold text-ink sm:text-xs">
            {i >= 3 && <span className={`rounded px-2 py-3 ${layerColors[3]}`}>FCS</span>}
            {parts.slice(0, Math.min(i + 1, 4)).map((p) => (
              <span key={p.label} className={`rounded px-2 py-3 transition-all ${p.color}`}>{p.label}</span>
            ))}
          </div>
          {i === 4 && <div className="font-mono text-xs tracking-widest text-slate-400">0110100101100001 0111…</div>}
          <div className="text-xs text-slate-500">PDU: {['Daten', 'Segment', 'Paket', 'Frame', 'Bits'][i]}</div>
        </div>
      )}
    />
  );
}

function NdpSlaac() {
  const steps = [
    'Der Host erzeugt sich eine Link-Local-Adresse (fe80::…) und prüft per Neighbor Solicitation, ob sie frei ist (DAD).',
    'Er sendet eine Router Solicitation (ICMPv6 133) an ff02::2 – alle Router.',
    'Der Router antwortet mit einem Router Advertisement (134) an ff02::1: Präfix, Flags, Default Gateway.',
    'Der Host bildet seine globale Adresse aus Präfix + Interface-ID (zufällig oder EUI-64).',
    'Erneut DAD per Neighbor Solicitation (135). Antwortet niemand, ist die Adresse aktiv.',
  ];
  const msg = [
    { from: 'host', text: 'NS (DAD) fe80::…' },
    { from: 'host', text: 'RS → ff02::2' },
    { from: 'router', text: 'RA → ff02::1: 2001:db8:1::/64' },
    { from: 'host', text: '2001:db8:1::a1b2:…' },
    { from: 'host', text: 'NS (DAD) – keine Antwort ✓' },
  ];
  return (
    <Stepper
      steps={steps}
      render={(i) => (
        <div className="flex items-center justify-between gap-2">
          <div className="text-center"><div className="text-3xl">💻</div><div className="text-xs">Host</div></div>
          <div className="flex-1 text-center">
            <div
              key={i}
              className={`mx-auto inline-block animate-pulse rounded-lg px-2 py-1 text-xs ${msg[i].from === 'host' ? 'bg-sky-500/30' : 'bg-emerald-500/30'}`}
            >
              {msg[i].from === 'host' ? `${msg[i].text} →` : `← ${msg[i].text}`}
            </div>
          </div>
          <div className="text-center"><div className="text-3xl">🔁</div><div className="text-xs">Router</div></div>
        </div>
      )}
    />
  );
}

function EthernetFrame() {
  const fields = [
    { name: 'Präambel+SFD', size: '8', w: 'flex-[8]' },
    { name: 'Ziel-MAC', size: '6', w: 'flex-[6]' },
    { name: 'Quell-MAC', size: '6', w: 'flex-[6]' },
    { name: 'Typ', size: '2', w: 'flex-[3]' },
    { name: 'Nutzdaten', size: '46–1500', w: 'flex-[20]' },
    { name: 'FCS', size: '4', w: 'flex-[4]' },
  ];
  return (
    <figure className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3">
      <div className="flex min-w-[32rem] gap-0.5 text-center text-[12px]">
        {fields.map((f, i) => (
          <div key={f.name} className={`${f.w} rounded py-2 text-ink ${layerColors[i % 4]}`}>
            <div className="font-semibold">{f.name}</div>
            <div>{f.size} B</div>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-slate-400">Ethernet-II-Frame. Mit 802.1Q-Tag kommen 4 Byte zwischen Quell-MAC und Typ hinzu.</figcaption>
    </figure>
  );
}

function AzureHierarchy() {
  const rows = [
    { icon: '🏢', name: 'Verwaltungsgruppe', ex: 'mg-firma' },
    { icon: '💳', name: 'Abonnement', ex: 'sub-prod' },
    { icon: '📁', name: 'Ressourcengruppe', ex: 'rg-web' },
    { icon: '🖥️', name: 'Ressource', ex: 'vm-web01' },
  ];
  return (
    <figure className="mt-3 rounded-xl bg-slate-950 p-3 text-sm">
      {rows.map((r, i) => (
        <div key={r.name} className="flex items-center gap-2 py-1" style={{ paddingLeft: `${i * 1.25}rem` }}>
          <span>{i > 0 ? '└' : ''}</span>
          <span>{r.icon}</span>
          <span className="font-semibold">{r.name}</span>
          <code className="text-xs text-cyan-300">{r.ex}</code>
        </div>
      ))}
      <figcaption className="mt-2 text-xs text-slate-400">RBAC-Zuweisungen, Policies und Sperren vererben sich von oben nach unten.</figcaption>
    </figure>
  );
}

function WebRequest() {
  const nodes = [
    { x: 25, label: 'Dein PC', Sym: PcSymbol },
    { x: 85, label: 'Switch', Sym: SwitchSymbol },
    { x: 145, label: 'Router', Sym: RouterSymbol },
    { x: 205, label: 'Internet', Sym: CloudSymbol },
    { x: 265, label: 'Webserver', Sym: ServerSymbol },
  ];
  // Station des Pakets pro Schritt
  const at = [0, 0, 1, 2, 3, 4, 0];
  const steps = [
    'Du tippst www.beispiel.de in den Browser und drückst Enter.',
    'Computer verstehen keine Namen, nur Zahlen. Dein PC fragt darum einen DNS-Server: „Welche IP-Adresse hat www.beispiel.de?“ Antwort: 93.184.215.14.',
    'Dein PC packt die Anfrage in ein Paket mit Absender (deine IP) und Ziel (93.184.215.14) und schickt es übers Kabel oder WLAN zum Switch. Der Switch leitet es anhand der MAC-Adresse an den Router weiter.',
    'Der Router (dein Default Gateway) sieht: Das Ziel liegt nicht im eigenen Netz. Er schickt das Paket ins Internet, zu deinem Provider.',
    'Im Internet reichen viele Router das Paket von Netz zu Netz weiter, jeder einen Schritt näher ans Ziel.',
    'Der Webserver bekommt die Anfrage und schickt die Webseite in vielen Paketen zurück, auf dem Weg über die Router bis zu dir.',
    'Dein Browser setzt die Pakete in der richtigen Reihenfolge zusammen und zeigt die Seite an. Das alles dauert meist weniger als eine Sekunde.',
  ];
  return (
    <Stepper
      steps={steps}
      render={(i) => {
        const n = nodes[at[i]];
        const back = i >= 5;
        return (
          <svg viewBox="0 0 290 80" className="w-full" role="img" aria-label="Weg einer Webseiten-Anfrage">
            <line x1="25" y1="34" x2="265" y2="34" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
            {nodes.map((m, k) => (
              <g key={m.label} opacity={k === at[i] ? 1 : 0.55}>
                {k === at[i] && <circle cx={m.x} cy="32" r="24" fill="#0a84ff" fillOpacity="0.15" />}
                {m.Sym({ x: m.x, y: 32 })}
                <text x={m.x} y="70" fontSize="9" textAnchor="middle" fill="currentColor">{m.label}</text>
              </g>
            ))}
            <g key={i} style={{ transition: 'transform 0.6s' }} transform={`translate(${n.x} 8)`}>
              <rect x="-17" y="-7" width="34" height="13" rx="6.5" fill={back ? '#30d158' : '#ff9f0a'} />
              <text y="2.5" fontSize="7" textAnchor="middle" fill="#000" fontWeight="600">{i === 1 ? 'DNS?' : back ? 'Seite' : 'Paket'}</text>
            </g>
          </svg>
        );
      }}
    />
  );
}

export function Diagram({ id }: { id: DiagramId }) {
  switch (id) {
    case 'osi-encapsulation':
      return <OsiEncapsulation />;
    case 'ndp-slaac':
      return <NdpSlaac />;
    case 'ethernet-frame':
      return <EthernetFrame />;
    case 'azure-hierarchy':
      return <AzureHierarchy />;
    case 'devices':
      return <DeviceGallery />;
    case 'connectors':
      return <ConnectorGallery />;
    case 'network-symbols':
      return <NetworkSymbols />;
    case 'web-request':
      return <WebRequest />;
  }
}
