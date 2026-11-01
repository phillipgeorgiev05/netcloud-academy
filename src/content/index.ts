import type { Level, Track } from '../types/content';

// Jede Datei unter network/ und cloud/ exportiert `default` ein Level. Neue Dateien werden automatisch gefunden.
const modules = import.meta.glob<{ default: Level }>(['./network/*.ts', './cloud/*.ts'], { eager: true });

export const levels: Level[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.track === b.track ? a.order - b.order : a.track === 'network' ? -1 : 1));

export const getLevel = (id: string) => levels.find((l) => l.id === id);

/** Geplanter Lernpfad. Titel ohne passende Level-Datei erscheinen als „in Arbeit“. */
export const tracks: Record<Track, { title: string; planned: string[] }> = {
  network: {
    title: 'Teil A – Netzwerktechnik',
    planned: [
      'Grundlagen', 'OSI- & TCP/IP-Modell', 'Ethernet, MAC & Kabel', 'IPv4 & Subnetting', 'IPv6',
      'Switching', 'Routing', 'Netzwerkdienste', 'TCP/UDP & Protokolle', 'WLAN',
      'Netzwerksicherheit', 'WAN, SD-WAN & QoS', 'Automatisierung', 'Troubleshooting',
    ],
  },
  cloud: {
    title: 'Teil B – Cloud',
    planned: [
      'Cloud-Grundlagen', 'Virtualisierung', 'Microsoft Azure', 'AWS', 'Cloud-Networking',
      'Identität & Sicherheit', 'Container & Kubernetes', 'Infrastructure as Code',
      'Monitoring, Backup & HA', 'Kosten & Governance', 'DevOps & CI/CD',
    ],
  },
};
