import type { SubnetTask } from '../types/content';

export const ipToInt = (ip: string): number =>
  ip.split('.').reduce((acc, o) => acc * 256 + Number(o), 0);

export const intToIp = (n: number): string =>
  [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join('.');

export const isValidIp = (ip: string): boolean =>
  /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(ip) && ip.split('.').every((o) => Number(o) <= 255);

export const prefixToMaskInt = (prefix: number): number => (prefix === 0 ? 0 : 2 ** 32 - 2 ** (32 - prefix));
export const prefixToMask = (prefix: number): string => intToIp(prefixToMaskInt(prefix));

export const networkOf = (ip: string, prefix: number): string => {
  const size = 2 ** (32 - prefix);
  return intToIp(Math.floor(ipToInt(ip) / size) * size);
};

export const broadcastOf = (ip: string, prefix: number): string =>
  intToIp(ipToInt(networkOf(ip, prefix)) + 2 ** (32 - prefix) - 1);

/** Nutzbare Hosts. /31 = 2 (RFC 3021, Point-to-Point), /32 = 1 (Host-Route). */
export const usableHosts = (prefix: number): number => {
  if (prefix === 32) return 1;
  if (prefix === 31) return 2;
  return 2 ** (32 - prefix) - 2;
};

/** Kleinstes Präfix (= kleinstes Netz), das mindestens `hosts` nutzbare Adressen hat. */
export const prefixForHosts = (hosts: number): number => {
  for (let p = 30; p >= 0; p--) if (usableHosts(p) >= hosts) return p;
  return 0;
};

export const toBinaryOctets = (ip: string): string =>
  ip.split('.').map((o) => Number(o).toString(2).padStart(8, '0')).join('.');

export interface SubnetField {
  label: string;
  answer: string;
  placeholder: string;
}

export interface SubnetProblem {
  prompt: string;
  fields: SubnetField[];
  explanation: string;
}

type Rng = () => number;
const randInt = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

/** Zufällige private Adresse, passend zur Präfixlänge (kleine Präfixe -> großer privater Bereich). */
function randomPrivateIp(rng: Rng, prefix: number): string {
  const host = () => randInt(rng, 0, 255);
  if (prefix < 16) return `10.${host()}.${host()}.${host()}`;
  if (prefix < 24) return `172.${randInt(rng, 16, 31)}.${host()}.${host()}`;
  return `192.168.${host()}.${host()}`;
}

/** Erklärt die Blockgrößen-Methode für das "interessante" Oktett. */
function blockExplanation(ip: string, prefix: number): string {
  const mask = prefixToMask(prefix);
  const idx = Math.min(Math.floor(prefix / 8), 3);
  const maskOctet = Number(mask.split('.')[idx]);
  const block = 256 - maskOctet;
  const val = Number(ip.split('.')[idx]);
  const start = Math.floor(val / block) * block;
  return [
    `/${prefix} = Maske ${mask} (${prefix} Einsen von 32 Bit).`,
    `Interessantes Oktett: Nr. ${idx + 1} (Maskenwert ${maskOctet}) → Blockgröße 256 − ${maskOctet} = ${block}.`,
    `${val} liegt im Block ${start}–${start + block - 1}.`,
    `Netzadresse: ${networkOf(ip, prefix)}, Broadcast: ${broadcastOf(ip, prefix)}.`,
  ].join('\n');
}

export function generateSubnetProblem(task: SubnetTask, prefixRange: [number, number], rng: Rng = Math.random): SubnetProblem {
  // Host-Aufgaben nur bis /30, damit Sonderfälle /31 /32 nicht verwirren.
  const max = task === 'network' || task === 'broadcast' ? prefixRange[1] : Math.min(prefixRange[1], 30);
  const prefix = randInt(rng, prefixRange[0], max);
  const ip = randomPrivateIp(rng, prefix);
  const net = networkOf(ip, prefix);
  const bc = broadcastOf(ip, prefix);

  switch (task) {
    case 'network':
      return {
        prompt: `Wie lautet die Netzadresse (Network Address) von ${ip}/${prefix}?`,
        fields: [{ label: 'Netzadresse', answer: net, placeholder: 'z. B. 10.0.0.0' }],
        explanation: blockExplanation(ip, prefix),
      };
    case 'broadcast':
      return {
        prompt: `Wie lautet die Broadcast-Adresse von ${ip}/${prefix}?`,
        fields: [{ label: 'Broadcast', answer: bc, placeholder: 'z. B. 10.0.0.255' }],
        explanation: blockExplanation(ip, prefix),
      };
    case 'range':
      return {
        prompt: `Erste und letzte nutzbare Host-Adresse im Netz von ${ip}/${prefix}?`,
        fields: [
          { label: 'Erster Host', answer: intToIp(ipToInt(net) + 1), placeholder: 'erste Adresse' },
          { label: 'Letzter Host', answer: intToIp(ipToInt(bc) - 1), placeholder: 'letzte Adresse' },
        ],
        explanation: `${blockExplanation(ip, prefix)}\nErster Host = Netzadresse + 1, letzter Host = Broadcast − 1.`,
      };
    case 'hosts':
      return {
        prompt: `Wie viele nutzbare Host-Adressen hat ein /${prefix}-Netz?`,
        fields: [{ label: 'Hosts', answer: String(usableHosts(prefix)), placeholder: 'Anzahl' }],
        explanation: `Host-Bits = 32 − ${prefix} = ${32 - prefix}. 2^${32 - prefix} = ${2 ** (32 - prefix)} Adressen, minus Netz- und Broadcast-Adresse = ${usableHosts(prefix)}.`,
      };
    case 'mask':
      return {
        prompt: `Wie lautet die Subnetzmaske zu /${prefix} in Dezimalschreibweise (dotted decimal)?`,
        fields: [{ label: 'Maske', answer: prefixToMask(prefix), placeholder: '255.255.x.x' }],
        explanation: `/${prefix} = ${prefix} Einsen: ${toBinaryOctets(prefixToMask(prefix))} = ${prefixToMask(prefix)}.`,
      };
    case 'prefixForHosts': {
      const target = prefix; // Zielpräfix, daraus eine Hostzahl ableiten, die genau hineinpasst
      const lower = target === 30 ? 1 : usableHosts(target + 1) + 1;
      const hosts = randInt(rng, lower, usableHosts(target));
      return {
        prompt: `Ein Subnetz soll ${hosts} Hosts aufnehmen und so klein wie möglich sein. Welche Präfixlänge wählst du?`,
        fields: [{ label: 'Präfix', answer: `/${target}`, placeholder: '/xx' }],
        explanation: `Gesucht: kleinstes n mit 2^n − 2 ≥ ${hosts}. n = ${32 - target} (2^${32 - target} − 2 = ${usableHosts(target)}). Präfix = 32 − ${32 - target} = /${target}.` +
          (target < 30 ? ` /${target + 1} hätte nur ${usableHosts(target + 1)} Hosts – zu wenig.` : ''),
      };
    }
  }
}

/** Vergleicht eine Eingabe tolerant (Leerzeichen, führender Slash beim Präfix). */
export function subnetAnswerMatches(input: string, answer: string): boolean {
  const norm = (s: string) => s.trim().replace(/\s+/g, '').replace(/^\//, '');
  return norm(input) === norm(answer);
}
