import type { Level, Track } from '../types/content';

// Jede Datei unter basics/, network/, cloud/ und fisi/ exportiert `default` ein Level. Neue Dateien werden automatisch gefunden.
const modules = import.meta.glob<{ default: Level }>(['./basics/*.ts', './network/*.ts', './cloud/*.ts', './fisi/*.ts'], { eager: true });

const trackOrder: Track[] = ['basics', 'network', 'cloud', 'fisi'];

export const levels: Level[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => trackOrder.indexOf(a.track) - trackOrder.indexOf(b.track) || a.order - b.order);

export const getLevel = (id: string) => levels.find((l) => l.id === id);

/** Geplanter Lernpfad. Titel ohne passende Level-Datei erscheinen als „in Arbeit“.
 *  `basics`: Grundlagen aus Teil 0, die man vor diesem Teil kennen sollte (Level-IDs). */
export const tracks: Record<Track, { title: string; subtitle: string; planned: string[]; basics?: string[] }> = {
  basics: {
    title: 'Teil 0 – Grundlagen',
    subtitle: 'Für alle ohne Vorwissen: Computer, Netze, OSI, Internet, Cloud und Sicherheit einfach erklärt',
    planned: [
      'Computer & Daten', 'Netzwerke verstehen', 'Das OSI-Modell', 'Internet & Web',
      'Server, Virtualisierung & Cloud', 'IT-Sicherheit Grundwissen',
    ],
  },
  network: {
    title: 'Teil A – Netzwerktechnik',
    subtitle: 'Vom Kabel bis zum Router: CCNA und Network+',
    basics: ['basics-01', 'basics-02', 'basics-03', 'basics-04'],
    planned: [
      'Grundlagen', 'OSI- & TCP/IP-Modell', 'Ethernet, MAC & Kabel', 'IPv4 & Subnetting', 'IPv6',
      'Switching', 'Routing', 'Netzwerkdienste', 'TCP/UDP & Protokolle', 'WLAN',
      'Netzwerksicherheit', 'WAN, SD-WAN & QoS', 'Betrieb & Monitoring', 'Automatisierung', 'Troubleshooting',
    ],
  },
  cloud: {
    title: 'Teil B – Cloud',
    subtitle: 'Azure und AWS: AZ-900, AZ-104 und Solutions Architect',
    basics: ['basics-02', 'basics-04', 'basics-05', 'basics-06'],
    planned: [
      'Cloud-Grundlagen', 'Virtualisierung', 'Microsoft Azure', 'AWS', 'Cloud-Networking',
      'Identität & Sicherheit', 'Speicher & Datenbanken', 'Container & Kubernetes', 'Serverless & Integration',
      'Infrastructure as Code', 'Monitoring, Backup & HA', 'Kosten & Governance', 'DevOps & CI/CD',
    ],
  },
  fisi: {
    title: 'Teil C – Fachinformatiker Systemintegration (IHK)',
    subtitle: 'Server, Verwaltung und Prüfungswissen für AP1 und AP2',
    basics: ['basics-01', 'basics-02', 'basics-03', 'basics-04', 'basics-05', 'basics-06'],
    planned: [
      'Windows Server & Active Directory', 'Gruppenrichtlinien & Berechtigungen', 'Linux-Administration',
      'Datensicherung & RAID', 'IT-Sicherheit & Datenschutz', 'Server-Hardware & USV', 'Skripte: PowerShell & Bash',
      'Projektmanagement & Kalkulation', 'Wirtschafts- und Sozialkunde', 'Arbeitsplatz einrichten (AP1)',
    ],
  },
};
