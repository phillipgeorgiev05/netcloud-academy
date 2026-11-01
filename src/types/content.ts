// Datenmodell für alle Inhalte unter src/content/. Neue Fragen = nur Daten, kein UI-Code.

export type CertId = 'ccna' | 'netplus' | 'az900' | 'az104' | 'aws-saa';
export type Track = 'network' | 'cloud';

export interface Cert {
  id: CertId;
  name: string;
  exam: string; // aktuelle Prüfungsnummer
  vendor: string;
  /** Prüfungsbereiche laut offiziellem Exam Guide. */
  domains: { id: string; name: string }[];
}

export interface Term {
  de: string;
  en: string;
}

export interface Source {
  title: string;
  url: string;
}

/** Gegenüberstellung als Flip-Karten, z. B. IPv4 ↔ IPv6. */
export interface Compare {
  left: string;
  right: string;
  rows: [string, string][];
}

/** Registrierte SVG-Diagramme/Animationen, siehe components/diagrams. */
export type DiagramId = 'osi-encapsulation' | 'ndp-slaac' | 'ethernet-frame' | 'azure-hierarchy';

export interface LessonSection {
  heading: string;
  /** Absätze durch Leerzeile getrennt. `code`, ```Code-Block```, **fett**, "- " Liste, "|" Tabelle. */
  body: string;
  analogy?: string;
  terms?: Term[];
  diagram?: DiagramId;
  compare?: Compare;
  /** Kurze Verständnisfrage direkt nach dem Abschnitt (zählt nicht fürs Quiz). */
  check?: Question;
  /** Offizielle Doku/RFCs zum Nachlesen. */
  sources?: Source[];
}

export interface Option {
  id: string;
  text: string;
  /** Wird angezeigt, wenn diese (falsche) Option gewählt wurde. */
  whyWrong?: string;
}

interface QBase {
  id: string;
  prompt: string;
  /** Warum die richtige Antwort richtig ist. */
  explanation: string;
  analogy?: string;
  difficulty: 1 | 2 | 3;
  /** Nur für diese Zertifikate relevant (Zertifikats-Fokus filtert danach). Ohne Angabe: für alle Zertifikate des Levels. */
  certs?: CertId[];
  /** Prüfungsbereich (Cert.domains[].id), überschreibt Level.domains. */
  domain?: string;
}

export interface SingleQuestion extends QBase {
  type: 'single' | 'scenario';
  /** Ausgangslage bei Szenario-Fragen. Darf ```Code-Blöcke``` (z. B. show-Ausgaben) enthalten. */
  scenario?: string;
  options: Option[];
  correct: string;
}

export interface MultiQuestion extends QBase {
  type: 'multi';
  options: Option[];
  correct: string[];
}

export interface DragDropQuestion extends QBase {
  type: 'dragdrop';
  items: { id: string; text: string }[];
  buckets: { id: string; label: string }[];
  /** itemId -> bucketId */
  solution: Record<string, string>;
}

/** Schritte in die richtige Reihenfolge bringen. `items` stehen in der richtigen Reihenfolge, angezeigt wird gemischt. */
export interface OrderingQuestion extends QBase {
  type: 'ordering';
  items: { id: string; text: string }[];
}

export type SubnetTask = 'network' | 'broadcast' | 'hosts' | 'mask' | 'range' | 'prefixForHosts';

export interface SubnetQuestion extends Omit<QBase, 'prompt' | 'explanation'> {
  type: 'subnet';
  task: SubnetTask;
  /** Erlaubte Präfixlängen für die Zufallswerte, z. B. [24, 30]. */
  prefixRange: [number, number];
  prompt?: string;
  explanation?: string;
}

/** Zufallsaufgaben aus lib/generators. Prompt, Lösung und Rechenweg erzeugt der Generator. */
export type GeneratorId =
  | 'vlsm'
  | 'ipv6-compress'
  | 'ipv6-expand'
  | 'ipv6-prefix'
  | 'ipv6-eui64'
  | 'ipv6-solicited'
  | 'ipv6-subnet'
  | 'cost-vm'
  | 'cost-sla'
  | 'cost-nat'
  | 'nsg'
  | 'iam'
  | 'rbac'
  | 'stp';

export interface GeneratedQuestion extends Omit<QBase, 'prompt' | 'explanation'> {
  type: 'generated';
  generator: GeneratorId;
  prompt?: string;
  explanation?: string;
}

export type Shell = 'ios' | 'windows' | 'linux' | 'azcli' | 'awscli';

export interface CliQuestion extends QBase {
  type: 'cli';
  shell: Shell;
  /** Platzhalter {{0}}, {{1}} … werden zu Eingabefeldern. Mehrere Zeilen = CLI-Session inkl. Moduswechsel. */
  template: string;
  /** Pro Lücke alle akzeptierten Schreibweisen (Vergleich ohne Groß/Klein, Leerzeichen normalisiert). */
  blanks: { accept: string[] }[];
  /** Wo man dasselbe im Web-Portal findet (Azure/AWS). */
  portal?: string;
}

export type NodeKind = 'pc' | 'laptop' | 'phone' | 'server' | 'switch' | 'router' | 'firewall' | 'ap' | 'cloud' | 'unknown';

export interface TopoNode {
  id: string;
  kind: NodeKind;
  label: string;
  /** Koordinaten im 0–100-Raster */
  x: number;
  y: number;
}

/** [von, nach] oder [von, nach, Beschriftung] */
export type TopoLink = [string, string] | [string, string, string];

interface TopologyBase extends QBase {
  type: 'topology';
  nodes: TopoNode[];
  links: TopoLink[];
}

/** click: richtige Knoten anklicken. fill: für Knoten mit kind 'unknown' das richtige Gerät wählen. */
export type TopologyQuestion =
  | (TopologyBase & { mode: 'click'; correct: string[] })
  | (TopologyBase & { mode: 'fill'; choices: NodeKind[]; solution: Record<string, NodeKind> });

/** Fehlersuche als Kette: Schritt für Schritt eine Entscheidung, `next` kann verzweigen. */
export interface ChainQuestion extends QBase {
  type: 'chain';
  steps: {
    id: string;
    text: string;
    options: { id: string; text: string; correct: boolean; feedback: string; next?: string }[];
  }[];
}

/** Konfigurations-Baukasten: Schalter setzen, bis alle Anforderungen erfüllt sind (VPC, Hub-and-Spoke …). */
export interface ConfigQuestion extends QBase {
  type: 'config';
  nodes?: TopoNode[];
  links?: TopoLink[];
  toggles: { id: string; text: string; why: string }[];
  /** Ids der Schalter, die an sein müssen. Alle anderen müssen aus sein. */
  solution: string[];
  /** Anforderungen mit den Schaltern, die dafür nötig sind (für das Feedback). */
  requirements: { text: string; needs: string[] }[];
}

/** Service-Desk-Ticket: Kundentext als `prompt`, Bearbeitung als Fehlersuche-Kette (Diagnose → Ursache → Lösung). */
export interface Ticket extends ChainQuestion {
  title: string;
  category: 'network' | 'cloud' | 'it';
  /** 1 = kritisch … 4 = niedrig (Auswirkung × Dringlichkeit) */
  priority: 1 | 2 | 3 | 4;
  /** Meldende Person mit Abteilung (fiktiv) */
  reporter: string;
  /** Level zum Nachlernen */
  learn?: string;
}

export type Question =
  | SingleQuestion
  | MultiQuestion
  | DragDropQuestion
  | OrderingQuestion
  | SubnetQuestion
  | GeneratedQuestion
  | CliQuestion
  | TopologyQuestion
  | ChainQuestion
  | ConfigQuestion;

export interface Lab {
  title: string;
  /** Was man braucht (Software, Konto …). */
  needs: string;
  steps: string[];
}

export interface Level {
  id: string;
  track: Track;
  order: number;
  title: string;
  titleEn: string;
  summary: string;
  certs: CertId[];
  /** Standard-Prüfungsbereich je Zertifikat für alle Fragen dieses Levels. */
  domains?: Partial<Record<CertId, string>>;
  lesson: LessonSection[];
  quiz: Question[];
  boss: { hearts: number; questions: Question[] };
  lab?: Lab;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}
