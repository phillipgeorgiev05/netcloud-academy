// Gezeichnete Geräte-, Stecker- und Symbolbilder für Einsteiger. Feste Gerätefarben (Gehäuse sehen in echt auch so aus),
// Beschriftungen in Theme-Farben.
import type { ReactNode } from 'react';

const CHASSIS = '#3a3a3c';
const EDGE = '#5a5a5e';
const PORT = '#0b0b0c';
const LED = '#30d158';
const LIGHT = '#f2f2f7';
const LIGHT_EDGE = '#aeaeb2';

/** RJ45-Buchse von vorn: Öffnung mit Rastnasen-Kerbe unten. */
function Jack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x} ${y}h${7 * s}v${4.5 * s}h${-2 * s}v${1.5 * s}h${-3 * s}v${-1.5 * s}h${-2 * s}z`} fill={PORT} />;
}

function Sfp({ x, y }: { x: number; y: number }) {
  return <rect x={x} y={y} width="9" height="5" rx="0.5" fill="#1c1c1e" stroke="#8e8e93" strokeWidth="0.6" />;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function Card({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <figure className="rounded-xl bg-slate-900 p-2">
      <svg viewBox="0 0 200 100" className="w-full" role="img" aria-label={title}>{children}</svg>
      <figcaption className="px-1 pb-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-slate-400">{text}</div>
      </figcaption>
    </figure>
  );
}

function Gallery({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="mt-3 rounded-xl bg-slate-950 p-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</div>
      <p className="mt-2 text-xs text-slate-400">{caption}</p>
    </div>
  );
}

export function DeviceGallery() {
  return (
    <Gallery caption="Vereinfachte Zeichnungen. Echte Geräte sehen je nach Hersteller etwas anders aus, die typischen Merkmale stimmen aber.">
      <Card title="Switch" text="Viele gleiche Ports (oft 24 oder 48) mit grünen Status-LEDs, rechts SFP-Schächte für Glasfaser.">
        <rect x="6" y="34" width="188" height="32" rx="2" fill={CHASSIS} stroke={EDGE} />
        {range(12).map((i) => (
          <g key={i}>
            <circle cx={16 + i * 12 + 3.5} cy="38.5" r="1" fill={LED} />
            <Jack x={16 + i * 12} y={41} />
            <Jack x={16 + i * 12} y={52} />
          </g>
        ))}
        {range(2).map((i) => <Sfp key={i} x={163 + i * 12} y={44} />)}
        {range(2).map((i) => <Sfp key={i} x={163 + i * 12} y={53} />)}
      </Card>
      <Card title="Router" text="Wenige Ports, dafür Anschlüsse für verschiedene Netze (LAN, WAN/Internet) und ein Konsolenport (hellblau).">
        <rect x="26" y="36" width="148" height="28" rx="2" fill={CHASSIS} stroke={EDGE} />
        {range(4).map((i) => <Jack key={i} x={40 + i * 12} y={47} />)}
        {range(2).map((i) => <Sfp key={i} x={100 + i * 13} y={47} />)}
        <rect x="136" y="47" width="8" height="5" rx="1" fill="#5ac8fa" />
        <circle cx="158" cy="44" r="1.5" fill={LED} />
        <circle cx="158" cy="52" r="1.5" fill={LED} />
        <text x="40" y="60" fontSize="4.5" fill="#aeaeb2">LAN</text>
        <text x="100" y="60" fontSize="4.5" fill="#aeaeb2">WAN</text>
        <text x="134" y="60" fontSize="4.5" fill="#aeaeb2">CON</text>
      </Card>
      <Card title="WLAN-Router (Zuhause)" text="Kombigerät: Router, Switch, Access Point, Firewall und oft Modem in einem Gehäuse.">
        <line x1="62" y1="48" x2="54" y2="14" stroke={LIGHT_EDGE} strokeWidth="3" strokeLinecap="round" />
        <line x1="100" y1="48" x2="100" y2="12" stroke={LIGHT_EDGE} strokeWidth="3" strokeLinecap="round" />
        <line x1="138" y1="48" x2="146" y2="14" stroke={LIGHT_EDGE} strokeWidth="3" strokeLinecap="round" />
        <rect x="40" y="46" width="120" height="32" rx="6" fill={LIGHT} stroke={LIGHT_EDGE} />
        {range(5).map((i) => <circle key={i} cx={70 + i * 15} cy="62" r="1.8" fill={i === 4 ? '#0a84ff' : LED} />)}
      </Card>
      <Card title="Access Point" text="Flache Scheibe an der Decke. Bringt WLAN-Geräte ins Kabelnetz, Strom meist per PoE über das Netzwerkkabel.">
        <path d="M70 22a40 40 0 0 1 60 0M78 30a28 28 0 0 1 44 0M86 38a16 16 0 0 1 28 0" fill="none" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" />
        <rect x="58" y="46" width="84" height="44" rx="18" fill={LIGHT} stroke={LIGHT_EDGE} />
        <circle cx="100" cy="68" r="3" fill="#0a84ff" />
      </Card>
      <Card title="Firewall" text="Sieht aus wie ein Router, oft mit auffälliger Front. Prüft jedes Paket gegen Regeln: erlauben oder blockieren.">
        <rect x="16" y="36" width="168" height="28" rx="2" fill={CHASSIS} stroke={EDGE} />
        <rect x="16" y="36" width="30" height="28" rx="2" fill="#ff453a" />
        {range(3).map((r) => range(3).map((c) => <rect key={`${r}${c}`} x={20 + c * 9 + (r % 2) * 4} y={40 + r * 7} width="7" height="5" fill="#c4001a" />))}
        {range(8).map((i) => <Jack key={i} x={56 + i * 12} y={47} />)}
        <circle cx="160" cy="49" r="1.5" fill={LED} />
        <circle cx="170" cy="49" r="1.5" fill="#ff9f0a" />
      </Card>
      <Card title="Server (Rack)" text="Flacher Computer zum Einschieben in den Serverschrank. Vorne viele Festplattenschächte, läuft rund um die Uhr.">
        <rect x="6" y="30" width="188" height="40" rx="2" fill={CHASSIS} stroke={EDGE} />
        <rect x="6" y="30" width="8" height="40" fill="#2c2c2e" />
        <rect x="186" y="30" width="8" height="40" fill="#2c2c2e" />
        {range(2).map((r) => range(8).map((c) => (
          <g key={`${r}${c}`}>
            <rect x={20 + c * 20} y={34 + r * 17} width="18" height="15" rx="1" fill="#1c1c1e" stroke={EDGE} strokeWidth="0.5" />
            <circle cx={35 + c * 20} cy={37 + r * 17} r="0.9" fill={LED} />
          </g>
        )))}
      </Card>
      <Card title="Patchfeld" text="Hier enden die fest verlegten Kabel aus den Räumen. Kurze Patchkabel verbinden die Ports mit dem Switch.">
        <rect x="6" y="38" width="188" height="24" rx="1" fill="#2c2c2e" stroke={EDGE} />
        {range(12).map((i) => (
          <g key={i}>
            <rect x={14 + i * 14.5} y="41" width="11" height="5" fill={LIGHT} />
            <text x={19.5 + i * 14.5} y="45" fontSize="3.5" textAnchor="middle" fill="#1d1d1f">{i + 1}</text>
            <Jack x={16 + i * 14.5} y={49} />
          </g>
        ))}
      </Card>
      <Card title="Serverschrank (Rack)" text="19-Zoll-Schrank, Höhe in Höheneinheiten (HE/U). Darin: Patchfeld, Switches, Server, USV.">
        <rect x="66" y="4" width="68" height="92" rx="2" fill="#1c1c1e" stroke={EDGE} />
        <rect x="72" y="10" width="56" height="7" fill="#2c2c2e" />
        <rect x="72" y="19" width="56" height="7" fill={CHASSIS} />
        {range(6).map((i) => <circle key={i} cx={78 + i * 8} cy="22.5" r="0.8" fill={LED} />)}
        <rect x="72" y="30" width="56" height="7" fill={CHASSIS} />
        <rect x="72" y="41" width="56" height="14" fill={CHASSIS} />
        <rect x="72" y="58" width="56" height="14" fill={CHASSIS} />
        <rect x="72" y="78" width="56" height="12" fill="#48484a" />
        <text x="140" y="15" fontSize="5" fill="#aeaeb2">Patchfeld</text>
        <text x="140" y="25" fontSize="5" fill="#aeaeb2">Switch</text>
        <text x="140" y="51" fontSize="5" fill="#aeaeb2">Server</text>
        <text x="140" y="86" fontSize="5" fill="#aeaeb2">USV</text>
      </Card>
      <Card title="Modem / Glasfaser-ONT" text="Übersetzt das Signal der Provider-Leitung (DSL, Kabel, Glasfaser) für dein Netz.">
        <rect x="76" y="14" width="48" height="76" rx="5" fill={LIGHT} stroke={LIGHT_EDGE} />
        {range(4).map((i) => <circle key={i} cx="100" cy={28 + i * 10} r="2" fill={i === 3 ? '#ff9f0a' : LED} />)}
        <path d="M100 90v6h60" fill="none" stroke="#30d158" strokeWidth="2" />
        <text x="130" y="92" fontSize="5" fill="#aeaeb2">Glasfaser</text>
      </Card>
      <Card title="Netzwerkkarte (NIC)" text="Steckt im PC oder Server und hat die MAC-Adresse. Heute meist schon auf der Hauptplatine eingebaut.">
        <rect x="30" y="30" width="120" height="44" rx="2" fill="#1e7a35" />
        {range(14).map((i) => <rect key={i} x={46 + i * 6} y="74" width="4" height="8" fill="#d4a017" />)}
        <rect x="60" y="40" width="22" height="22" fill="#1c1c1e" />
        <rect x="150" y="22" width="8" height="64" fill="#aeaeb2" />
        <Jack x={151} y={48} s={0.85} />
      </Card>
    </Gallery>
  );
}

export function ConnectorGallery() {
  return (
    <Gallery caption="Stecker und Module, die du im Alltag in die Hand nimmst.">
      <Card title="RJ45-Stecker" text="Am Ende jedes Netzwerkkabels (Kupfer). 8 goldene Kontakte, unten eine Rastnase zum Einrasten.">
        <rect x="70" y="20" width="60" height="48" rx="3" fill="#dfe8f0" fillOpacity="0.85" stroke={LIGHT_EDGE} />
        {range(8).map((i) => <rect key={i} x={76 + i * 6.3} y="22" width="3" height="12" fill="#d4a017" />)}
        {['#ff9f0a', '#30d158', '#0a84ff', '#8b5a2b'].map((c, i) => <rect key={c} x={78 + i * 12} y="44" width="8" height="20" fill={c} opacity="0.8" />)}
        <path d="M86 68h28v6H86z" fill="#dfe8f0" stroke={LIGHT_EDGE} />
        <rect x="88" y="74" width="24" height="22" fill="#0a84ff" />
      </Card>
      <Card title="Twisted-Pair-Kabel (Querschnitt)" text="4 verdrillte Adernpaare. Das Verdrillen schützt vor Störungen. Kategorien: Cat 5e, Cat 6, Cat 6a …">
        <circle cx="100" cy="50" r="38" fill="#0a84ff" />
        <circle cx="100" cy="50" r="33" fill="#1c1c1e" />
        {[[-12, -12, '#ff9f0a'], [12, -12, '#30d158'], [-12, 12, '#0a84ff'], [12, 12, '#8b5a2b']].map(([dx, dy, c]) => (
          <g key={c as string}>
            <circle cx={100 + (dx as number) - 4} cy={50 + (dy as number)} r="5" fill={c as string} />
            <circle cx={100 + (dx as number) + 4} cy={50 + (dy as number)} r="5" fill="#f2f2f7" stroke={c as string} strokeWidth="2" />
          </g>
        ))}
      </Card>
      <Card title="LC-Stecker (Glasfaser)" text="Kleiner Doppelstecker: eine Faser zum Senden, eine zum Empfangen. Aqua = Multimode, gelb = Singlemode-Kabel.">
        {[78, 106].map((x) => (
          <g key={x}>
            <rect x={x} y="30" width="16" height="34" rx="2" fill="#5ac8fa" />
            <rect x={x + 6} y="18" width="4" height="12" fill="#f2f2f7" />
            <rect x={x + 4} y="64" width="8" height="24" fill="#64d2ff" />
          </g>
        ))}
        <rect x="76" y="42" width="48" height="8" fill="#32ade6" />
      </Card>
      <Card title="SC-Stecker (Glasfaser)" text="Größerer, eckiger Stecker zum Einstecken und Ziehen. Grün = APC-Schliff (häufig beim Glasfaser-Hausanschluss).">
        <rect x="84" y="24" width="32" height="40" rx="2" fill="#30d158" />
        <rect x="97" y="12" width="6" height="12" fill="#f2f2f7" />
        <rect x="94" y="64" width="12" height="28" fill="#1e7a35" />
      </Card>
      <Card title="SFP-Modul (Transceiver)" text="Wird in den SFP-Schacht eines Switches gesteckt und macht daraus einen Glasfaser- oder Kupferport.">
        <path d="M30 40h120l10 6v12l-10 6H30z" fill="#aeaeb2" stroke="#8e8e93" />
        <rect x="150" y="44" width="16" height="16" rx="1" fill="#1c1c1e" />
        <rect x="153" y="47" width="4" height="10" fill="#5ac8fa" />
        <rect x="159" y="47" width="4" height="10" fill="#5ac8fa" />
        <path d="M150 40v-6h14" fill="none" stroke="#0a84ff" strokeWidth="3" />
        {range(10).map((i) => <rect key={i} x={34 + i * 5} y="50" width="3" height="4" fill="#d4a017" />)}
      </Card>
      <Card title="Konsolenkabel" text="Für die Ersteinrichtung von Switch und Router: RJ45 oder USB auf der Geräteseite, USB am Laptop.">
        <rect x="30" y="40" width="34" height="22" rx="2" fill="#5ac8fa" />
        <path d="M64 51C100 51 100 51 136 51" fill="none" stroke="#5ac8fa" strokeWidth="4" />
        <rect x="136" y="44" width="28" height="14" rx="2" fill="#aeaeb2" />
        <rect x="164" y="47" width="12" height="8" fill="#8e8e93" />
        <text x="47" y="74" fontSize="6" textAnchor="middle" fill="#aeaeb2">RJ45</text>
        <text x="156" y="72" fontSize="6" textAnchor="middle" fill="#aeaeb2">USB</text>
      </Card>
    </Gallery>
  );
}

/* Symbole, wie sie in Netzwerkplänen (Topologien) benutzt werden */
const SYM = '#0a84ff';

export function RouterSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="6" rx="20" ry="7" fill="#0058b8" />
      <rect x="-20" y="-2" width="40" height="8" fill="#0058b8" />
      <ellipse cx="0" cy="-2" rx="20" ry="7" fill={SYM} />
      <path d="M-11 -2h-5m0 0 3-2m-3 2 3 2M11 -2h5m0 0-3-2m3 2-3 2M0 -6v-3m0 0-2 1.5M0 -9l2 1.5M0 2v3" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function SwitchSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-20 -6l6-5h34l-6 5z" fill="#5ac8fa" />
      <path d="M14 -6l6-5v14l-6 5z" fill="#0058b8" />
      <rect x="-20" y="-6" width="34" height="14" fill={SYM} />
      <path d="M-15 -2h20m0 0-3-2m3 2-3 2M9 4h-20m0 0 3-2m-3 2 3 2" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function PcSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-14" y="-12" width="28" height="18" rx="2" fill="#8e8e93" />
      <rect x="-12" y="-10" width="24" height="14" fill="#1c1c1e" />
      <rect x="-3" y="6" width="6" height="4" fill="#8e8e93" />
      <rect x="-9" y="10" width="18" height="2" rx="1" fill="#8e8e93" />
    </g>
  );
}

export function ServerSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[-12, -3, 6].map((dy) => (
        <g key={dy}>
          <rect x="-11" y={dy} width="22" height="8" rx="1" fill="#8e8e93" />
          <circle cx="-7" cy={dy + 4} r="1" fill={LED} />
        </g>
      ))}
    </g>
  );
}

export function CloudSymbol({ x, y }: { x: number; y: number }) {
  return (
    <path
      transform={`translate(${x} ${y})`}
      d="M-14 8a8 8 0 0 1-1-16 11 11 0 0 1 21-2 8 8 0 0 1 9 9 7 7 0 0 1-2 9z"
      fill="#aeaeb2"
    />
  );
}

function FirewallSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {range(3).map((r) => range(3).map((c) => (
        <rect key={`${r}${c}`} x={-15 + c * 10 + (r % 2 ? -5 : 0)} y={-10 + r * 7} width="9" height="6" fill="#ff453a" />
      )))}
    </g>
  );
}

function ApSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-12 -6a17 17 0 0 1 24 0M-7 -1a10 10 0 0 1 14 0" fill="none" stroke={SYM} strokeWidth="2" strokeLinecap="round" />
      <rect x="-14" y="3" width="28" height="8" rx="4" fill={SYM} />
    </g>
  );
}

export function NetworkSymbols() {
  const items: [string, string, (p: { x: number; y: number }) => ReactNode][] = [
    ['Router', 'Zylinder mit Pfeilen in alle Richtungen', RouterSymbol],
    ['Switch', 'flacher Quader mit gegenläufigen Pfeilen', SwitchSymbol],
    ['Firewall', 'Mauer aus Ziegeln', FirewallSymbol],
    ['Access Point', 'Gerät mit Funkwellen', ApSymbol],
    ['PC / Endgerät', 'Bildschirm', PcSymbol],
    ['Server', 'gestapelte Einschübe', ServerSymbol],
    ['Internet / Cloud', 'Wolke = Netz, dessen Inneres egal ist', CloudSymbol],
  ];
  return (
    <div className="mt-3 rounded-xl bg-slate-950 p-3">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map(([name, hint, Sym]) => (
          <li key={name} className="rounded-xl bg-slate-900 p-2 text-center">
            <svg viewBox="-30 -18 60 34" className="mx-auto h-14" aria-hidden="true">{Sym({ x: 0, y: 0 })}</svg>
            <div className="text-sm font-semibold">{name}</div>
            <div className="text-xs text-slate-400">{hint}</div>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-400">So werden Geräte in Netzwerkplänen gezeichnet (angelehnt an die verbreiteten Cisco-Symbole). Linien zwischen den Symbolen sind Verbindungen.</p>
    </div>
  );
}
