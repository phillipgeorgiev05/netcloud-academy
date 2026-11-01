// Entscheidungshilfe „Welche Verbindung / welcher Load Balancer?“. Knoten sind entweder Fragen oder Ergebnisse.

export type DecisionNode =
  | { question: string; options: { text: string; next: string }[] }
  | { result: string; azure: string; aws: string; levelId?: string };

export const decisionTree: Record<string, DecisionNode> = {
  start: {
    question: 'Was willst du lösen?',
    options: [
      { text: 'Netze verbinden (Cloud ↔ Cloud oder Rechenzentrum ↔ Cloud)', next: 'connect' },
      { text: 'Verkehr auf mehrere Server verteilen', next: 'lb' },
      { text: 'PaaS-Dienste (Storage, Datenbank) privat erreichen', next: 'paas' },
    ],
  },
  connect: {
    question: 'Was soll verbunden werden?',
    options: [
      { text: 'Virtuelle Netze untereinander', next: 'cloud2cloud' },
      { text: 'Eigenes Rechenzentrum/Büro mit der Cloud', next: 'onprem' },
      { text: 'Einzelne Mitarbeiter-PCs (Homeoffice)', next: 'p2s' },
    ],
  },
  cloud2cloud: {
    question: 'Wie viele Netze, und müssen alle mit allen sprechen?',
    options: [
      { text: 'Wenige (2–3), direkte Verbindung reicht', next: 'peering' },
      { text: 'Viele, auch transitiv und mit gemeinsamer Firewall/VPN', next: 'hub' },
    ],
  },
  peering: {
    result: 'Direktes **Peering**: niedrige Latenz, keine Gateways. Adressräume dürfen sich nicht überschneiden, und Peering ist nicht transitiv.',
    azure: 'VNet Peering (auch Global VNet Peering)',
    aws: 'VPC Peering',
    levelId: 'cloud-05',
  },
  hub: {
    result: '**Hub-and-Spoke** mit zentralem, transitivem Router oder Firewall. Gemeinsame Dienste (VPN, Firewall, DNS) liegen im Hub.',
    azure: 'Azure Virtual WAN oder Hub-VNet mit Azure Firewall + UDRs',
    aws: 'AWS Transit Gateway',
    levelId: 'cloud-05',
  },
  onprem: {
    question: 'Darf der Verkehr über das öffentliche Internet laufen?',
    options: [
      { text: 'Ja', next: 'onprem-internet' },
      { text: 'Nein (Compliance)', next: 'dedicated' },
    ],
  },
  'onprem-internet': {
    question: 'Brauchst du hohe, planbare Bandbreite und konstant niedrige Latenz?',
    options: [
      { text: 'Nein, normales Internet reicht', next: 's2s' },
      { text: 'Ja', next: 'dedicated' },
    ],
  },
  s2s: {
    result: '**Site-to-Site-VPN** (IPsec über das Internet): schnell eingerichtet und günstig.',
    azure: 'VPN Gateway (im GatewaySubnet) + Local Network Gateway',
    aws: 'Site-to-Site VPN (2 Tunnel) an Virtual Private Gateway oder Transit Gateway',
    levelId: 'cloud-05',
  },
  dedicated: {
    result: '**Dedizierte private Leitung**, BGP-Routing, Bereitstellung dauert Wochen. Privat ist **nicht** automatisch verschlüsselt (bei Bedarf MACsec oder IPsec darüber). Empfehlung: VPN als Backup.',
    azure: 'ExpressRoute',
    aws: 'AWS Direct Connect',
    levelId: 'cloud-05',
  },
  p2s: {
    result: '**Client-VPN** für einzelne Geräte. Für reinen Admin-Zugriff auf VMs ist ein Bastion-Dienst oft besser, dann braucht keine VM eine öffentliche IP.',
    azure: 'VPN Gateway mit Point-to-Site (oder Azure Bastion für RDP/SSH)',
    aws: 'AWS Client VPN (oder Systems Manager Session Manager)',
  },
  lb: {
    question: 'Regional oder global (mehrere Regionen/Kontinente)?',
    options: [
      { text: 'Regional', next: 'lb-regional' },
      { text: 'Global', next: 'lb-global' },
    ],
  },
  'lb-regional': {
    question: 'Brauchst du HTTP-Funktionen wie Pfad-Routing, TLS-Terminierung oder WAF?',
    options: [
      { text: 'Ja (Layer 7)', next: 'l7' },
      { text: 'Nein, nur TCP/UDP verteilen (Layer 4)', next: 'l4' },
    ],
  },
  l7: { result: 'Regionaler **Layer-7**-Load-Balancer.', azure: 'Application Gateway (optional mit WAF)', aws: 'Application Load Balancer (+ AWS WAF)', levelId: 'cloud-05' },
  l4: { result: 'Regionaler **Layer-4**-Load-Balancer: sehr schnell, schaut nicht in den Inhalt.', azure: 'Azure Load Balancer (Standard)', aws: 'Network Load Balancer', levelId: 'cloud-05' },
  'lb-global': {
    question: 'Nur HTTP(S)?',
    options: [
      { text: 'Ja, Website/API (gern mit CDN und WAF)', next: 'global-http' },
      { text: 'Nein, beliebige Protokolle', next: 'global-dns' },
    ],
  },
  'global-http': { result: 'Globaler HTTP-Einstieg mit **CDN**, **WAF** und automatischem Failover.', azure: 'Azure Front Door', aws: 'Amazon CloudFront (+ AWS WAF)', levelId: 'cloud-05' },
  'global-dns': {
    result: 'Verteilung per **DNS** (Failover hängt von der DNS-TTL ab) oder per Anycast-IP.',
    azure: 'Traffic Manager',
    aws: 'Route 53 Routing-Richtlinien oder AWS Global Accelerator',
    levelId: 'cloud-05',
  },
  paas: {
    question: 'Muss der Dienst auch aus dem Rechenzentrum privat erreichbar sein, oder soll der öffentliche Zugriff komplett aus?',
    options: [
      { text: 'Ja', next: 'private-endpoint' },
      { text: 'Nein, nur aus dem eigenen Cloud-Netz ohne Internetweg', next: 'service-endpoint' },
    ],
  },
  'private-endpoint': {
    result: '**Private Endpoint**: Der Dienst bekommt eine private IP in deinem Netz. Private DNS-Zone nicht vergessen!',
    azure: 'Private Endpoint (Private Link) + private DNS-Zone',
    aws: 'Interface VPC Endpoint (PrivateLink)',
    levelId: 'cloud-05',
  },
  'service-endpoint': {
    result: 'Leichtgewichtige Variante ohne private IP, Verkehr bleibt im Backbone des Anbieters.',
    azure: 'Service Endpoint am Subnetz + Firewall des Dienstes',
    aws: 'Gateway VPC Endpoint (nur S3 und DynamoDB, kostenlos)',
    levelId: 'cloud-05',
  },
};
