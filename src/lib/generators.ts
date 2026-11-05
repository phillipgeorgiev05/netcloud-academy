// Zufallsaufgaben für den Fragetyp `generated` und den Trainer. Jede Funktion liefert Prompt, Felder mit Lösung und Rechenweg.
import type { GeneratorId, TopoLink, TopoNode } from '../types/content';
import { compressIPv6, eui64, expandIPv6, normalizeIPv6 } from './ipv6';
import { intToIp, ipToInt, prefixForHosts, prefixToMask, usableHosts } from './subnet';
import { examplePrices } from '../content/prices';

export interface GenField {
  label: string;
  answer: string;
  placeholder?: string;
  /** Auswahlfeld statt Freitext */
  options?: string[];
  /** Vergleichsart für Freitext. Standard: Text ohne Groß/Klein und Mehrfach-Leerzeichen. */
  /** 'links': Antwort durch Antippen der Verbindungen in `topology` (siehe `linkNames`). */
  kind?: 'text' | 'number' | 'ipv6' | 'hex' | 'links';
  /** Erlaubte Abweichung bei kind 'number' */
  tolerance?: number;
}

export interface GenProblem {
  prompt: string;
  fields: GenField[];
  explanation: string;
  topology?: { nodes: TopoNode[]; links: TopoLink[] };
}

type Rng = () => number;
const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
const pick = <T,>(rng: Rng, a: readonly T[]): T => a[Math.floor(rng() * a.length)];
const eur = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function fieldMatches(f: GenField, input: string): boolean {
  const v = input.trim();
  if (f.options) return v === f.answer;
  switch (f.kind) {
    case 'number': {
      const n = Number(v.replace(/[€%\s]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
      return Number.isFinite(n) && Math.abs(n - Number(f.answer)) <= (f.tolerance ?? 0);
    }
    case 'ipv6':
      return normalizeIPv6(v) !== null && normalizeIPv6(v) === normalizeIPv6(f.answer);
    case 'hex': {
      const norm = (s: string) => s.toLowerCase().split(':').map((x) => parseInt(x, 16)).join(':');
      return /^[0-9a-f:]+$/i.test(v) && norm(v) === norm(f.answer);
    }
    default: {
      // führender Slash optional, damit „26“ und „/26“ beim Präfix beide zählen
      const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').replace(/^\//, '');
      return norm(v) === norm(f.answer);
    }
  }
}

// ---------- VLSM ----------
function vlsm(rng: Rng): GenProblem {
  const base = `192.168.${int(rng, 0, 255)}.0`;
  const needs = [int(rng, 33, 126), int(rng, 9, 30), int(rng, 3, 8), 2];
  const plan = needs
    .map((hosts) => ({ hosts, prefix: prefixForHosts(hosts) }))
    .sort((a, b) => a.prefix - b.prefix);
  let offset = ipToInt(base);
  const rows = plan.map((p) => {
    const net = intToIp(offset);
    offset += 2 ** (32 - p.prefix);
    return { ...p, net };
  });
  // Felder in der Reihenfolge der Aufgabe, nicht sortiert, damit man selbst sortieren muss
  const fields = needs.map((h) => {
    const r = rows.find((x) => x.hosts === h)!;
    return { label: h === 2 ? 'Router-Link (2 Hosts)' : `LAN mit ${h} Hosts`, answer: `${r.net}/${r.prefix}`, placeholder: 'x.x.x.x/yy' };
  });
  return {
    prompt: `Teile **${base}/24** per VLSM auf. Vergib die Netze lückenlos ab ${base}, **größtes Netz zuerst**. Gib jeweils Netzadresse/Präfix an.`,
    fields,
    explanation: [
      'Regel: nach Größe absteigend sortieren und von vorne lückenlos vergeben. So liegt jedes Netz auf seiner Blockgrenze.',
      ...rows.map((r) => `- ${r.hosts} Hosts → /${r.prefix} (${usableHosts(r.prefix)} nutzbar, Maske ${prefixToMask(r.prefix)}) → ${r.net}/${r.prefix}`),
    ].join('\n'),
  };
}

// ---------- IPv6 ----------
function randomIPv6(rng: Rng, zeros = true): number[] {
  const h = [0x2001, 0x0db8, int(rng, 0, 0xffff), int(rng, 0, 0xff), int(rng, 0, 0xffff), int(rng, 0, 0xffff), int(rng, 0, 0xffff), int(rng, 1, 0xffff)];
  if (zeros) {
    const start = int(rng, 2, 5);
    const len = int(rng, 2, 7 - start);
    for (let i = start; i < start + len; i++) h[i] = 0;
    if (rng() < 0.5) h[3] = int(rng, 0, 0xf); // führende Nullen zum Kürzen
  }
  return h;
}

function ipv6(id: GeneratorId, rng: Rng): GenProblem {
  switch (id) {
    case 'ipv6-compress': {
      const h = randomIPv6(rng);
      return {
        prompt: `Kürze nach RFC 5952: \`${expandIPv6(h)}\``,
        fields: [{ label: 'Kurzform', answer: compressIPv6(h), placeholder: '2001:db8::…' }],
        explanation: 'Führende Nullen je Block weglassen, die längste Folge von Null-Blöcken (mind. 2, bei Gleichstand die erste) durch `::` ersetzen, Kleinbuchstaben.',
      };
    }
    case 'ipv6-expand': {
      const h = randomIPv6(rng);
      return {
        prompt: `Schreibe die Adresse vollständig aus (8 Blöcke à 4 Hex-Ziffern): \`${compressIPv6(h)}\``,
        fields: [{ label: 'Vollständig', answer: expandIPv6(h), placeholder: 'xxxx:xxxx:…' }],
        explanation: '`::` steht für so viele Null-Blöcke, dass es zusammen 8 sind. Jeden Block auf 4 Stellen mit Nullen auffüllen.',
      };
    }
    case 'ipv6-prefix': {
      const h = randomIPv6(rng, false);
      const net = [...h.slice(0, 4), 0, 0, 0, 0];
      return {
        prompt: `Zu welchem /64-Netz gehört \`${compressIPv6(h)}\`?`,
        fields: [{ label: 'Präfix', answer: `${compressIPv6(net)}/64`, placeholder: '…::/64', kind: 'ipv6' }],
        explanation: '/64 = die ersten 4 Blöcke. Die letzten 4 Blöcke (Interface-ID) werden für die Netzadresse 0.',
      };
    }
    case 'ipv6-eui64': {
      const mac = Array.from({ length: 6 }, () => int(rng, 0, 255).toString(16).padStart(2, '0'));
      mac[0] = (parseInt(mac[0], 16) & 0xfc).toString(16).padStart(2, '0'); // Unicast, global
      const m = mac.join(':');
      const iid = eui64(m).map((x) => x.toString(16).padStart(4, '0')).join(':');
      return {
        prompt: `Bilde die **EUI-64-Interface-ID** zur MAC \`${m}\` (4 Blöcke).`,
        fields: [{ label: 'Interface-ID', answer: iid, placeholder: 'xxxx:xxff:fexx:xxxx', kind: 'hex' }],
        explanation: `MAC teilen (${mac.slice(0, 3).join(':')} | ${mac.slice(3).join(':')}), ff:fe einfügen, im ersten Byte das 7. Bit umdrehen (${mac[0]} → ${(parseInt(mac[0], 16) ^ 2).toString(16).padStart(2, '0')}). Ergebnis: ${iid}`,
      };
    }
    case 'ipv6-solicited': {
      const h = randomIPv6(rng);
      const last24 = ((h[6] & 0xff) << 16) | h[7];
      const sn = [0xff02, 0, 0, 0, 0, 1, 0xff00 | (last24 >> 16), last24 & 0xffff];
      return {
        prompt: `Wie lautet die **Solicited-Node-Multicast-Adresse** zu \`${compressIPv6(h)}\`?`,
        fields: [{ label: 'Adresse', answer: compressIPv6(sn), placeholder: 'ff02::1:ff…', kind: 'ipv6' }],
        explanation: `\`ff02::1:ff\` + die letzten 24 Bit der Adresse (${(last24 >> 16).toString(16).padStart(2, '0')}:${(last24 & 0xffff).toString(16).padStart(4, '0')}) → ${compressIPv6(sn)}`,
      };
    }
    default: {
      // ipv6-subnet
      const site56 = rng() < 0.5;
      const third = int(rng, 1, 0xffff);
      const fourthBase = site56 ? int(rng, 1, 0xff) << 8 : 0;
      const n = site56 ? int(rng, 1, 255) : int(rng, 1, 4000);
      const prefix = [0x2001, 0xdb8, third, fourthBase, 0, 0, 0, 0];
      const subnet = [...prefix.slice(0, 3), fourthBase + n, 0, 0, 0, 0];
      return {
        prompt: `Aus dem Präfix \`${compressIPv6(prefix)}/${site56 ? 56 : 48}\`: Wie lautet das /64-Subnetz mit der **Subnetz-ID ${n}** (dezimal, gezählt ab 0)?`,
        fields: [{ label: 'Subnetz', answer: `${compressIPv6(subnet)}/64`, placeholder: '…::/64', kind: 'ipv6' }],
        explanation: `${n} dezimal = 0x${n.toString(16)}. Die Subnetz-ID steht im 4. Block${site56 ? ' (nur die letzten 8 Bit, die ersten 8 Bit gehören zum /56)' : ''}: ${(fourthBase + n).toString(16)} → ${compressIPv6(subnet)}/64`,
      };
    }
  }
}

// ---------- Kosten ----------
function cost(id: GeneratorId, rng: Rng): GenProblem {
  if (id === 'cost-sla') {
    const slas = [99.9, 99.95, 99.99, 99.5, 99.9];
    const n = int(rng, 2, 3);
    const chosen = Array.from({ length: n }, () => pick(rng, slas));
    const composite = chosen.reduce((a, s) => a * (s / 100), 1) * 100;
    const downtime = (1 - composite / 100) * 30 * 24 * 60;
    return {
      prompt: `Eine Anwendung braucht ${n} Dienste **in Reihe** mit den SLAs ${chosen.map((s) => `${s.toLocaleString('de-DE')} %`).join(', ')}. Berechne das zusammengesetzte SLA und die erlaubte Ausfallzeit pro Monat (30 Tage).`,
      fields: [
        { label: 'SLA in % (2 Nachkommastellen)', answer: composite.toFixed(2), kind: 'number', tolerance: 0.011, placeholder: '99,85' },
        { label: 'Ausfallzeit in Minuten (gerundet)', answer: Math.round(downtime).toString(), kind: 'number', tolerance: 1, placeholder: '65' },
      ],
      explanation: `SLAs in Reihe multiplizieren: ${chosen.map((s) => (s / 100).toString()).join(' × ')} = ${(composite / 100).toFixed(6)} → ${composite.toFixed(2)} %. Ausfall: (1 − ${(composite / 100).toFixed(6)}) × 43.200 min ≈ ${Math.round(downtime)} min.`,
    };
  }
  if (id === 'cost-nat') {
    const gb = int(rng, 5, 200) * 100;
    const saving = gb * examplePrices.natGatewayPerGb;
    return {
      prompt: `Private EC2-Instanzen laden **${gb.toLocaleString('de-DE')} GB pro Monat** aus S3, bisher über ein NAT Gateway. Beispielpreis: Datenverarbeitung NAT Gateway ${eur(examplePrices.natGatewayPerGb)} €/GB, S3 Gateway Endpoint kostenlos. Wie viel spart der Gateway Endpoint pro Monat (das NAT Gateway bleibt für anderen Verkehr bestehen)?`,
      fields: [{ label: 'Ersparnis in €', answer: saving.toFixed(2), kind: 'number', tolerance: 0.01, placeholder: '0,00' }],
      explanation: `Nur die Datenverarbeitungsgebühr entfällt: ${gb.toLocaleString('de-DE')} GB × ${eur(examplePrices.natGatewayPerGb)} € = ${eur(saving)} €. Die Stundengebühr des NAT Gateways bleibt. (Beispielpreise, echte Preise je Region im Preisrechner prüfen.)`,
    };
  }
  // cost-vm
  const price = int(rng, 5, 80) / 100;
  const offHours = int(rng, 8, 14);
  const saving = price * offHours * 30;
  return {
    prompt: `Eine Entwickler-VM kostet **${eur(price)} €/h** (Compute) und läuft rund um die Uhr. Sie soll künftig jede Nacht **${offHours} Stunden** freigegeben (deallocated) werden. Wie viel Compute-Kosten spart das pro Monat (30 Tage)?`,
    fields: [{ label: 'Ersparnis in €', answer: saving.toFixed(2), kind: 'number', tolerance: 0.01, placeholder: '0,00' }],
    explanation: `${eur(price)} € × ${offHours} h × 30 Tage = ${eur(saving)} €. Disks und statische IPs kosten weiter, nur Compute entfällt. (Beispielpreis.)`,
  };
}

// ---------- NSG ----------
interface NsgRule { prio: number; name: string; source: 'Internet' | 'VirtualNetwork' | 'Any' | string; port: number | 'Any'; action: 'Allow' | 'Deny' }
const nsgMatch = (r: NsgRule, src: string, srcKind: 'Internet' | 'VirtualNetwork', port: number) =>
  (r.source === 'Any' || r.source === srcKind || r.source === src) && (r.port === 'Any' || r.port === port);

export function evaluateNsg(rules: NsgRule[], src: string, srcKind: 'Internet' | 'VirtualNetwork', port: number) {
  const all = [
    ...rules,
    { prio: 65000, name: 'AllowVNetInBound', source: 'VirtualNetwork', port: 'Any', action: 'Allow' } as NsgRule,
    { prio: 65500, name: 'DenyAllInBound', source: 'Any', port: 'Any', action: 'Deny' } as NsgRule,
  ].sort((a, b) => a.prio - b.prio);
  return all.find((r) => nsgMatch(r, src, srcKind, port))!;
}

function nsg(rng: Rng): GenProblem {
  const ports = [22, 80, 443, 3389, 1433];
  const attacker = `203.0.113.${int(rng, 2, 250)}`;
  const n = int(rng, 3, 4);
  const prios = [...new Set(Array.from({ length: n }, () => int(rng, 1, 40) * 100))].sort((a, b) => a - b);
  const rules: NsgRule[] = prios.map((prio, i) => {
    const action = pick(rng, ['Allow', 'Deny'] as const);
    const port = rng() < 0.2 ? 'Any' : pick(rng, ports);
    const source = pick(rng, ['Internet', 'VirtualNetwork', 'Any', attacker]);
    return { prio, name: `${action === 'Allow' ? 'allow' : 'deny'}-${port === 'Any' ? 'all' : port}-${i + 1}`, source, port, action };
  });
  const fromInternet = rng() < 0.7;
  const src = fromInternet ? (rng() < 0.5 ? attacker : `198.51.100.${int(rng, 2, 250)}`) : `10.0.${int(rng, 0, 9)}.${int(rng, 4, 250)}`;
  const port = pick(rng, ports);
  const hit = evaluateNsg(rules, src, fromInternet ? 'Internet' : 'VirtualNetwork', port);
  const ruleLabel = (r: NsgRule) => `${r.prio} ${r.name}`;
  const table = [
    '| Priorität | Name | Quelle | Zielport | Aktion |',
    '|---|---|---|---|---|',
    ...rules.map((r) => `| ${r.prio} | ${r.name} | ${r.source} | ${r.port} | ${r.action} |`),
    '| 65000 | AllowVNetInBound | VirtualNetwork | Any | Allow |',
    '| 65500 | DenyAllInBound | Any | Any | Deny |',
  ].join('\n');
  return {
    prompt: `Eingehende NSG-Regeln (Protokoll jeweils TCP):\n\n${table}\n\nEin Paket kommt von **${src}** (${fromInternet ? 'Internet' : 'aus dem eigenen VNet'}) auf **TCP ${port}**. Was passiert, und welche Regel entscheidet?`,
    fields: [
      { label: 'Ergebnis', answer: hit.action, options: ['Allow', 'Deny'] },
      { label: 'Entscheidende Regel', answer: ruleLabel(hit), options: [...rules.map(ruleLabel), '65000 AllowVNetInBound', '65500 DenyAllInBound'] },
    ],
    explanation: `Regeln aufsteigend nach Priorität prüfen, die erste passende gewinnt. Quelle passt bei „Any“, beim passenden Service Tag (Internet/VirtualNetwork) oder bei exakt der IP. Hier greift zuerst **${ruleLabel(hit)}** → ${hit.action}.`,
  };
}

// ---------- IAM ----------
type Stmt = { effect: 'Allow' | 'Deny'; action: string };
const globMatch = (pattern: string, action: string) => new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`, 'i').test(action);

export function evaluateIam(identity: Stmt[], bucket: Stmt[], scp: string[] | null, action: string) {
  const all = [...identity, ...bucket];
  if (all.some((s) => s.effect === 'Deny' && globMatch(s.action, action))) return { result: 'Deny', reason: 'Explizites Deny' } as const;
  if (scp && !scp.some((a) => globMatch(a, action))) return { result: 'Deny', reason: 'SCP erlaubt es nicht' } as const;
  if (all.some((s) => s.effect === 'Allow' && globMatch(s.action, action))) return { result: 'Allow', reason: 'Allow greift' } as const;
  return { result: 'Deny', reason: 'Kein Allow (implizites Deny)' } as const;
}

function iam(rng: Rng): GenProblem {
  const actions = ['s3:GetObject', 's3:PutObject', 's3:DeleteObject', 'ec2:StartInstances', 'ec2:TerminateInstances'];
  const patterns = ['s3:*', 's3:Get*', 's3:DeleteObject', 's3:PutObject', 'ec2:*', 'ec2:TerminateInstances', 'ec2:Start*', '*'];
  const stmts = (k: number): Stmt[] => Array.from({ length: k }, () => ({ effect: rng() < 0.65 ? 'Allow' : 'Deny', action: pick(rng, patterns) }));
  const identity = stmts(int(rng, 1, 3));
  const bucket = rng() < 0.4 ? stmts(1) : [];
  const scp = rng() < 0.4 ? [pick(rng, ['s3:*', 'ec2:*', 's3:Get*'])] : null;
  const action = pick(rng, actions);
  const r = evaluateIam(identity, bucket, scp, action);
  const fmt = (s: Stmt) => `\`{"Effect":"${s.effect}","Action":"${s.action}","Resource":"*"}\``;
  return {
    prompt: [
      'Gleiches Konto. Benutzer-Policies:',
      ...identity.map((s) => `- ${fmt(s)}`),
      ...(bucket.length ? ['', 'Bucket Policy (für diesen Benutzer):', ...bucket.map((s) => `- ${fmt(s)}`)] : []),
      ...(scp ? ['', `SCP der OU erlaubt nur: \`${scp.join(', ')}\``] : []),
      '',
      `Anfrage: **${action}**. Wird sie erlaubt?`,
    ].join('\n'),
    fields: [
      { label: 'Ergebnis', answer: r.result, options: ['Allow', 'Deny'] },
      { label: 'Grund', answer: r.reason, options: ['Explizites Deny', 'SCP erlaubt es nicht', 'Allow greift', 'Kein Allow (implizites Deny)'] },
    ],
    explanation: 'Reihenfolge: 1. Passt irgendein **explizites Deny** → Deny. 2. Erlaubt die **SCP** die Aktion nicht → Deny. 3. Passt ein **Allow** (Identity oder Bucket Policy im selben Konto) → Allow. 4. Sonst **implizites Deny**.',
  };
}

// ---------- RBAC + Sperren ----------
function rbac(rng: Rng): GenProblem {
  const scopes = ['Verwaltungsgruppe „mg-firma“', 'Abonnement „sub-prod“', 'Ressourcengruppe „rg-web“', 'VM „vm-web01“'];
  const other = 'Ressourcengruppe „rg-db“ (Nachbar von rg-web)';
  const role = pick(rng, ['Reader', 'Contributor', 'Owner'] as const);
  const roleAt = rng() < 0.2 ? -1 : int(rng, 0, 3); // -1 = falscher Zweig
  const lock = rng() < 0.5 ? null : { type: pick(rng, ['CanNotDelete', 'ReadOnly'] as const), at: int(rng, 1, 3) };
  const action = pick(rng, [
    { id: 'read', text: 'die Einstellungen der VM ansehen' },
    { id: 'write', text: 'die VM-Größe ändern' },
    { id: 'delete', text: 'die VM löschen' },
  ] as const);
  const can = { Reader: ['read'], Contributor: ['read', 'write', 'delete'], Owner: ['read', 'write', 'delete'] }[role];
  const hasRole = roleAt >= 0 && can.includes(action.id);
  const blocked = !!lock && ((lock.type === 'CanNotDelete' && action.id === 'delete') || (lock.type === 'ReadOnly' && action.id !== 'read'));
  const answer = !hasRole ? 'Rolle fehlt/reicht nicht' : blocked ? 'Sperre verhindert es' : 'Erlaubt';
  const tree = scopes.map((s, i) => `${'  '.repeat(i)}- ${s}${lock?.at === i ? ` 🔒 ${lock.type}` : ''}`).join('\n');
  return {
    prompt: `Hierarchie:\n\n${tree}\n\nAnna hat die Rolle **${role}** auf **${roleAt >= 0 ? scopes[roleAt] : other}**. Sie will ${action.text}. Klappt das?`,
    fields: [
      { label: 'Erlaubt?', answer: hasRole && !blocked ? 'Ja' : 'Nein', options: ['Ja', 'Nein'] },
      { label: 'Grund', answer, options: ['Erlaubt', 'Rolle fehlt/reicht nicht', 'Sperre verhindert es'] },
    ],
    explanation: [
      'RBAC-Zuweisungen vererben sich nach **unten**, nie zur Seite oder nach oben. Reader = lesen, Contributor/Owner = lesen, ändern, löschen.',
      'Sperren gelten für alle, auch Owner: **CanNotDelete** verbietet Löschen, **ReadOnly** verbietet Ändern und Löschen.',
      `Hier: Rolle ${hasRole ? 'reicht' : 'reicht nicht bzw. gilt nicht für die VM'}${lock ? `, Sperre ${lock.type} ${blocked ? 'blockiert' : 'blockiert nicht'}` : ', keine Sperre'}.`,
    ].join('\n\n'),
  };
}

// ---------- STP ----------
export interface StpSwitch { id: string; prio: number; mac: string }
export interface StpLink { a: string; b: string; aPort: string; bPort: string; cost: number; label: string }

export function stpSolve(sw: StpSwitch[], links: StpLink[]) {
  const bid = (s: StpSwitch) => s.prio * 2 ** 48 + parseInt(s.mac.replace(/\./g, ''), 16);
  const root = [...sw].sort((x, y) => bid(x) - bid(y))[0];
  const dist: Record<string, number> = Object.fromEntries(sw.map((s) => [s.id, Infinity]));
  dist[root.id] = 0;
  for (let i = 0; i < sw.length; i++)
    for (const l of links) {
      dist[l.b] = Math.min(dist[l.b], dist[l.a] + l.cost);
      dist[l.a] = Math.min(dist[l.a], dist[l.b] + l.cost);
    }
  const byId = Object.fromEntries(sw.map((s) => [s.id, s]));
  const rootPort = (id: string) =>
    links
      .filter((l) => l.a === id || l.b === id)
      .map((l) => {
        const nb = l.a === id ? l.b : l.a;
        return { port: l.a === id ? l.aPort : l.bPort, nb, cost: dist[nb] + l.cost, nbBid: bid(byId[nb]) };
      })
      .sort((x, y) => x.cost - y.cost || x.nbBid - y.nbBid || x.port.localeCompare(y.port))[0];
  return { root, dist, rootPort, bid };
}

/** Name von Verbindungen für Felder vom Typ 'links': sortiert, durch Komma getrennt. */
export const linkNames = (ls: { a: string; b: string }[]) => ls.map((l) => `${l.a}–${l.b}`).sort().join(', ');

function stp(rng: Rng): GenProblem {
  const ids = ['SW1', 'SW2', 'SW3', 'SW4'].slice(0, int(rng, 3, 4));
  const sw: StpSwitch[] = ids.map((id) => ({
    id,
    prio: rng() < 0.3 ? pick(rng, [4096, 24576, 28672]) : 32768,
    mac: `0000.0c${int(rng, 0, 255).toString(16).padStart(2, '0')}.${int(rng, 0, 0xffff).toString(16).padStart(4, '0')}`,
  }));
  const speeds = [{ label: '1G', cost: 4 }, { label: '100M', cost: 19 }, { label: '10G', cost: 2 }];
  const pairs = ids.length === 3 ? [[0, 1], [1, 2], [2, 0]] : [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];
  const portNo: Record<string, number> = {};
  const nextPort = (id: string) => `Gi0/${(portNo[id] = (portNo[id] ?? 0) + 1)}`;
  const links: StpLink[] = pairs.map(([i, j]) => {
    const s = pick(rng, speeds);
    return { a: ids[i], b: ids[j], aPort: nextPort(ids[i]), bPort: nextPort(ids[j]), cost: s.cost, label: s.label };
  });
  const { root, dist, rootPort, bid } = stpSolve(sw, links);
  const target = pick(rng, ids.filter((i) => i !== root.id));
  const rp = rootPort(target);
  const portLabel = (id: string, l: StpLink) => (l.a === id ? `${l.aPort} (zu ${l.b})` : `${l.bPort} (zu ${l.a})`);
  const targetLinks = links.filter((l) => l.a === target || l.b === target);
  const pos = ids.length === 3 ? [[20, 25], [80, 25], [50, 85]] : [[20, 20], [80, 20], [80, 80], [20, 80]];
  // Jeder Nicht-Root-Switch nutzt genau einen Link als Root Port, alle übrigen Links blockieren an einem Ende.
  const treeLinks = ids.filter((i) => i !== root.id).map((i) => {
    const p = rootPort(i).port;
    return links.find((l) => (l.a === i && l.aPort === p) || (l.b === i && l.bPort === p))!;
  });
  const blocked = links.filter((l) => !treeLinks.includes(l));
  // Designated ist die Seite mit geringeren Kosten zur Root, bei Gleichstand die niedrigere Bridge ID; die andere Seite blockiert.
  const byId = (id: string) => sw.find((s) => s.id === id)!;
  const blockedPort = (l: StpLink) =>
    dist[l.a] < dist[l.b] || (dist[l.a] === dist[l.b] && bid(byId(l.a)) < bid(byId(l.b))) ? `${l.b} ${l.bPort}` : `${l.a} ${l.aPort}`;
  return {
    prompt: `Bestimme Root Bridge und den Root Port von **${target}** (Kosten: 10G = 2, 1G = 4, 100M = 19).\n\n${sw.map((s) => `- ${s.id}: Priorität ${s.prio}, MAC \`${s.mac}\``).join('\n')}`,
    topology: {
      nodes: sw.map((s, i) => ({ id: s.id, kind: 'switch' as const, label: s.id, x: pos[i][0], y: pos[i][1] })),
      links: links.map((l) => [l.a, l.b, l.label] as TopoLink),
    },
    fields: [
      { label: 'Root Bridge', answer: root.id, options: ids },
      { label: `Root Port von ${target}`, answer: portLabel(target, targetLinks.find((l) => (l.a === target ? l.aPort : l.bPort) === rp.port)!), options: targetLinks.map((l) => portLabel(target, l)) },
      { label: 'Blockierte Verbindung(en): im Diagramm antippen', answer: linkNames(blocked), kind: 'links' },
    ],
    explanation: [
      `Root Bridge = niedrigste Priorität, bei Gleichstand niedrigste MAC → **${root.id}** (${root.prio}, ${root.mac}).`,
      `Pfadkosten zur Root: ${ids.map((i) => `${i} = ${dist[i]}`).join(', ')}.`,
      `Root Port = Port mit den geringsten Gesamtkosten zur Root (Link + Kosten des Nachbarn), bei Gleichstand niedrigere Bridge ID des Nachbarn, dann niedrigere Port-ID → **${rp.port}** (Kosten ${rp.cost}).`,
      `Blockiert: ${blocked.map((l) => `${l.a}–${l.b} (Port ${blockedPort(l)} blockiert, das andere Ende ist Designated Port)`).join(', ')}. Alle anderen Links tragen einen Root Port und bilden den schleifenfreien Baum.`,
    ].join('\n'),
  };
}

// ---------- NTFS + Freigabe: effektive Rechte ----------
export const RIGHTS = ['Kein Zugriff', 'Lesen', 'Ändern', 'Vollzugriff'] as const;
export interface AclEntry { group: string; share: number; ntfs: number; denyAll?: boolean }

/** Effektives Recht (Index in RIGHTS): Rechte mehrerer Gruppen addieren sich, NTFS-Verweigern Vollzugriff sperrt alles,
 *  übers Netzwerk gilt das strengere aus Freigabe und NTFS, lokal nur NTFS. Fehlende Gruppe = 0. */
export function effectiveAccess(entries: AclEntry[], memberOf: string[], network: boolean) {
  const mine = entries.filter((e) => memberOf.includes(e.group));
  const ntfs = mine.some((e) => e.denyAll) ? 0 : Math.max(0, ...mine.map((e) => e.ntfs));
  const share = Math.max(0, ...mine.map((e) => e.share));
  return { share, ntfs, effective: network ? Math.min(share, ntfs) : ntfs };
}

function ntfs(rng: Rng): GenProblem {
  const groups = ['Jeder', 'GG_Vertrieb', 'DL_Angebote_RW', 'DL_Angebote_R', 'GG_Praktikanten'];
  const entries: AclEntry[] = [
    { group: 'Jeder', share: pick(rng, [1, 2, 3]), ntfs: 0 },
    { group: 'DL_Angebote_RW', share: 0, ntfs: pick(rng, [2, 3]) },
    { group: 'DL_Angebote_R', share: 0, ntfs: 1 },
  ];
  if (rng() < 0.35) entries.push({ group: 'GG_Praktikanten', share: 0, ntfs: 0, denyAll: true });
  const memberOf = ['Jeder', ...groups.slice(1).filter(() => rng() < 0.5)];
  const network = rng() < 0.75;
  const r = effectiveAccess(entries, memberOf, network);
  const shareLines = entries.filter((e) => e.share > 0).map((e) => `| ${e.group} | ${RIGHTS[e.share]} |`).join('\n');
  const ntfsLines = entries.filter((e) => e.ntfs > 0 || e.denyAll).map((e) => `| ${e.group} | ${e.denyAll ? 'Verweigern: Vollzugriff' : `Zulassen: ${RIGHTS[e.ntfs]}`} |`).join('\n');
  return {
    prompt: `Ordner \`D:\\Daten\\Angebote\`, freigegeben als \`\\\\FS01\\Angebote\`.\n\n**Freigabe:**\n| Gruppe | Recht |\n|---|---|\n${shareLines}\n\n**NTFS (explizit am Ordner):**\n| Gruppe | Eintrag |\n|---|---|\n${ntfsLines}\n\nMax ist Mitglied in: **${memberOf.join(', ')}**. Er greift **${network ? 'über das Netzwerk' : 'lokal am Server (RDP)'}** zu. Was darf er effektiv?`,
    fields: [{ label: 'Effektives Recht', answer: RIGHTS[r.effective], options: [...RIGHTS] }],
    explanation: [
      'Rechte mehrerer Gruppen **addieren** sich: Es zählt das höchste Zulassen. Ein **Verweigern** schlägt aber jedes Zulassen auf derselben Ebene.',
      'Über das **Netzwerk** gilt das **strengere** aus Freigabe und NTFS. **Lokal** wirkt die Freigabe nicht, nur NTFS.',
      `Hier: Freigabe ${network ? `= ${RIGHTS[r.share]}` : 'spielt keine Rolle'}, NTFS = ${RIGHTS[r.ntfs]}${entries.some((e) => e.denyAll && memberOf.includes(e.group)) ? ' (Verweigern über GG_Praktikanten)' : ''}. Effektiv: **${RIGHTS[r.effective]}**.`,
      'Im echten System prüfst du das unter Eigenschaften → Sicherheit → Erweitert → **Effektiver Zugriff**.',
    ].join('\n\n'),
  };
}

export function generate(id: GeneratorId, rng: Rng = Math.random): GenProblem {
  if (id === 'vlsm') return vlsm(rng);
  if (id.startsWith('ipv6-')) return ipv6(id, rng);
  if (id.startsWith('cost-')) return cost(id, rng);
  if (id === 'nsg') return nsg(rng);
  if (id === 'iam') return iam(rng);
  if (id === 'rbac') return rbac(rng);
  if (id === 'ntfs') return ntfs(rng);
  return stp(rng);
}

export const generatorNames: Record<GeneratorId, string> = {
  vlsm: 'VLSM-Planung',
  'ipv6-compress': 'IPv6 kürzen',
  'ipv6-expand': 'IPv6 ausschreiben',
  'ipv6-prefix': 'IPv6 /64-Präfix',
  'ipv6-eui64': 'EUI-64',
  'ipv6-solicited': 'Solicited-Node-Adresse',
  'ipv6-subnet': 'IPv6-Subnetz aus /48 oder /56',
  'cost-vm': 'Kosten: VM freigeben',
  'cost-sla': 'Verbund-SLA',
  'cost-nat': 'Kosten: NAT vs. Gateway Endpoint',
  nsg: 'NSG-Simulator',
  iam: 'IAM-Policy-Auswertung',
  rbac: 'RBAC & Sperren',
  stp: 'STP-Simulator',
  ntfs: 'Effektive Rechte (NTFS + Freigabe)',
};
