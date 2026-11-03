import type { Level, Track } from '../types/content';

// Jede Datei unter network/, cloud/ und fisi/ exportiert `default` ein Level. Neue Dateien werden automatisch gefunden.
const modules = import.meta.glob<{ default: Level }>(['./network/*.ts', './cloud/*.ts', './fisi/*.ts'], { eager: true });

const trackOrder: Track[] = ['network', 'cloud', 'fisi'];

export const levels: Level[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => trackOrder.indexOf(a.track) - trackOrder.indexOf(b.track) || a.order - b.order);

export const getLevel = (id: string) => levels.find((l) => l.id === id);

/** Geplanter Lernpfad. Titel ohne passende Level-Datei erscheinen als „in Arbeit“. */
export const tracks: Record<Track, { title: string; planned: string[] }> = {
  network: {
    title: 'Teil A – Netzwerktechnik',
    planned: [
      'Grundlagen', 'OSI- & TCP/IP-Modell', 'Ethernet, MAC & Kabel', 'IPv4 & Subnetting', 'IPv6',
      'Switching', 'Routing', 'Netzwerkdienste', 'TCP/UDP & Protokolle', 'WLAN',
      'Netzwerksicherheit', 'WAN, SD-WAN & QoS', 'Betrieb & Monitoring', 'Automatisierung', 'Troubleshooting',
    ],
  },
  cloud: {
    title: 'Teil B – Cloud',
    planned: [
      'Cloud-Grundlagen', 'Virtualisierung', 'Microsoft Azure', 'AWS', 'Cloud-Networking',
      'Identität & Sicherheit', 'Speicher & Datenbanken', 'Container & Kubernetes', 'Serverless & Integration',
      'Infrastructure as Code', 'Monitoring, Backup & HA', 'Kosten & Governance', 'DevOps & CI/CD',
    ],
  },
  fisi: {
    title: 'Teil C – Fachinformatiker Systemintegration (IHK)',
    planned: [
      'Windows Server & Active Directory', 'Gruppenrichtlinien & Berechtigungen', 'Linux-Administration',
      'Datensicherung & RAID', 'IT-Sicherheit & Datenschutz', 'Server-Hardware & USV', 'Skripte: PowerShell & Bash',
      'Projektmanagement & Kalkulation', 'Wirtschafts- und Sozialkunde', 'Arbeitsplatz einrichten (AP1)',
    ],
  },
};
