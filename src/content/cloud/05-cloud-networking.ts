import type { Level } from '../../types/content';

const level: Level = {
  id: 'cloud-05',
  track: 'cloud',
  order: 5,
  title: 'Cloud-Networking',
  titleEn: 'Peering, Hub & Spoke, VPN, ExpressRoute/Direct Connect, Private Endpoints, Load Balancing, CDN',
  summary: 'Netze in der Cloud verbinden: Peering, Hub-and-Spoke, Transit Gateway/Virtual WAN, Site-to-Site-VPN, ExpressRoute und Direct Connect, private Endpunkte für PaaS, Load Balancer auf Layer 4 und 7 sowie CDN.',
  certs: ['az104', 'aws-saa', 'az900', 'netplus'],
  domains: { az104: 'network', 'aws-saa': 'resilient', az900: 'architecture', netplus: '1' },
  lesson: [
    {
      heading: 'Peering – Netze direkt verbinden',
      body: `**VNet Peering** (Azure) und **VPC Peering** (AWS) verbinden zwei virtuelle Netze direkt über das Backbone des Anbieters, nicht über das Internet. Die Ressourcen sprechen sich mit **privaten IPs** an, die Latenz ist niedrig.

- Funktioniert innerhalb einer Region und **regionsübergreifend** (Azure: Global VNet Peering, AWS: Inter-Region Peering), auch zwischen Abonnements bzw. Konten.
- **Adressräume dürfen sich nicht überschneiden.** Deshalb plant man IP-Bereiche von Anfang an zentral (siehe A4).
- **Peering ist nicht transitiv:** Ist A mit B und B mit C gepeert, erreicht A **nicht** automatisch C.
- In Azure muss das Peering in **beiden Richtungen** angelegt werden (A→B und B→A). In AWS erstellt eine Seite die Anfrage, die andere nimmt an, danach braucht es auf beiden Seiten **Routen** in den Route Tables.`,
      analogy: 'Peering ist eine private Brücke zwischen zwei Nachbargrundstücken. Die Brücke von A nach B bringt dich aber nicht über das Grundstück B hinweg zu C – dafür bräuchtest du eine eigene Brücke oder einen zentralen Platz.',
      terms: [
        { de: 'Netzkopplung', en: 'VNet/VPC peering' },
        { de: 'Nicht transitiv', en: 'non-transitive' },
      ],
    },
    {
      heading: 'Hub-and-Spoke, Virtual WAN und Transit Gateway',
      body: `Bei vielen Netzen wird Peering „jeder mit jedem“ schnell unübersichtlich (n·(n−1)/2 Verbindungen, siehe A1). Deshalb nutzt man die **Hub-and-Spoke-Topologie**:
- **Hub:** zentrales Netz mit gemeinsamen Diensten: VPN-/ExpressRoute-Gateway, Firewall, DNS, Bastion
- **Spokes:** Netze der einzelnen Anwendungen oder Teams, jeweils nur mit dem Hub gepeert

Damit Spokes untereinander oder ins lokale Netz kommen, braucht es eine **transitive Komponente**:
- **Azure:** Firewall/NVA im Hub plus **benutzerdefinierte Routen (UDR)** in den Spokes (\`0.0.0.0/0\` bzw. Spoke-Netze → Firewall-IP). Mit **Gateway Transit** dürfen Spokes das VPN-Gateway des Hubs nutzen. Alternativ bietet **Azure Virtual WAN** einen von Microsoft verwalteten Hub.
- **AWS:** **Transit Gateway**, ein regionaler Router, an den VPCs, VPNs und Direct Connect angehängt werden. Er routet **transitiv** zwischen allen Anhängen und ersetzt viele einzelne Peerings.

**Routing in der Cloud:** Systemrouten (Azure) bzw. die \`local\`-Route (AWS) verbinden alle Subnetze eines Netzes. Eigene Routen überschreiben die Standardwege, z. B. um allen Verkehr durch eine Firewall zu zwingen (**forced tunneling**).`,
      terms: [
        { de: 'Nabe und Speichen', en: 'hub and spoke' },
        { de: 'Benutzerdefinierte Route', en: 'user-defined route (UDR)' },
        { de: 'Virtuelle Netzwerk-Appliance', en: 'network virtual appliance (NVA)' },
      ],
    },
    {
      heading: 'Hybride Verbindungen: VPN',
      body: `**Site-to-Site-VPN (S2S):** verschlüsselter **IPsec/IKE**-Tunnel zwischen dem lokalen Firewall/Router und der Cloud, über das Internet. Das ist schnell eingerichtet und günstig, aber Bandbreite und Latenz hängen vom Internet ab.

**Point-to-Site-VPN (P2S, Azure) / Client VPN (AWS):** einzelne Clients (Homeoffice) verbinden sich per VPN-Software mit dem Cloud-Netz.

**Azure:**
- **VPN Gateway** in einem eigenen Subnetz, das **exakt \`GatewaySubnet\`** heißen muss (empfohlen mindestens /27). Keine anderen Ressourcen und keine NSG darin.
- Lokale Seite = **Local Network Gateway** (öffentliche IP + lokale Adressbereiche), Verbindung = **Connection** mit Pre-Shared Key.
- Die Bereitstellung des Gateways kann bis zu 45 Minuten dauern.
- **Route-based** VPN (BGP-fähig) ist heute der Standard.

**AWS:**
- **Virtual Private Gateway** an der VPC oder **Transit Gateway**, lokale Seite = **Customer Gateway**
- Jede Site-to-Site-VPN-Verbindung besteht aus **zwei Tunneln** (zu zwei AWS-Endpunkten) für Redundanz. Für echte Ausfallsicherheit muss man beide auf der lokalen Seite auch konfigurieren.`,
      terms: [
        { de: 'Standortverbindung', en: 'site-to-site VPN' },
        { de: 'Vorab geteilter Schlüssel', en: 'pre-shared key (PSK)' },
      ],
    },
    {
      heading: 'Private Standleitungen: ExpressRoute und Direct Connect',
      body: `**Azure ExpressRoute** und **AWS Direct Connect** sind **private, dedizierte Verbindungen** zwischen deinem Rechenzentrum und der Cloud über einen Provider oder einen Colocation-Standort. Sie laufen **nicht über das öffentliche Internet**.

| | Site-to-Site-VPN | ExpressRoute / Direct Connect |
|---|---|---|
| Weg | Internet | private Leitung |
| Verschlüsselung | ja (IPsec) | **standardmäßig nicht**: optional MACsec auf Layer 2 oder IPsec-VPN über die Leitung |
| Bandbreite | begrenzt durch Gateway/Internet | hoch und planbar (bis 100 Gbit/s und mehr) |
| Latenz | schwankend | konstant niedrig |
| Bereitstellung | Minuten bis Stunden | **Wochen** (Leitung, Provider, Verträge) |
| Kosten | niedrig | hoch |

Routing läuft per **BGP**. Ein ExpressRoute-Circuit hat von Haus aus **zwei Verbindungen** zu zwei Microsoft-Edge-Routern. Bei Direct Connect empfiehlt AWS mehrere Verbindungen an **verschiedenen Standorten**.

Bewährtes Muster: **ExpressRoute/Direct Connect als Hauptweg, Site-to-Site-VPN als Backup.**`,
      analogy: 'VPN ist ein gepanzerter Transporter auf der öffentlichen Autobahn: sicher, aber im Stau. ExpressRoute ist eine eigene Schienenstrecke: immer pünktlich, aber teuer zu bauen, und die Waggons sind standardmäßig nicht abgeschlossen.',
      terms: [{ de: 'Dedizierte Verbindung', en: 'dedicated connection' }],
    },
    {
      heading: 'Privater Zugriff auf PaaS-Dienste',
      body: `PaaS-Dienste wie Storage oder Datenbanken haben standardmäßig **öffentliche Endpunkte**. Für Sicherheit und Compliance will man sie oft nur **privat** erreichen.

**Azure:**
- **Service Endpoint:** Verkehr aus einem Subnetz läuft über das Azure-Backbone zum Dienst. Der Dienst behält seine **öffentliche IP**, akzeptiert aber über seine Firewall nur noch dieses Subnetz. Das ist kostenlos, aber nicht von lokal (on-prem) nutzbar.
- **Private Endpoint (Private Link):** Der Dienst bekommt eine **private IP aus deinem VNet** (eine NIC). Er ist auch über VPN/ExpressRoute von lokal erreichbar, der öffentliche Zugang kann komplett abgeschaltet werden. Voraussetzung ist eine **private DNS-Zone** (z. B. \`privatelink.blob.core.windows.net\`), damit der normale Name auf die private IP auflöst.

**AWS (VPC Endpoints):**
- **Gateway Endpoint:** nur für **S3 und DynamoDB**, wird als Ziel in der Route Table eingetragen, **kostenlos**
- **Interface Endpoint (PrivateLink):** eine ENI mit privater IP im Subnetz, für viele AWS-Dienste und eigene Dienste, kostenpflichtig pro Stunde und GB

Vorteil beider Muster: Private Instanzen erreichen die Dienste **ohne NAT Gateway und ohne Internet**.`,
      terms: [
        { de: 'Privater Endpunkt', en: 'private endpoint' },
        { de: 'Dienstendpunkt', en: 'service endpoint' },
      ],
    },
    {
      heading: 'Load Balancer und CDN',
      body: `**Layer 4** (Transport) verteilt nach IP und Port (TCP/UDP) und ist sehr schnell, schaut aber nicht in den Inhalt. **Layer 7** (Anwendung) versteht HTTP(S): Routing nach Pfad (\`/api\`) oder Hostname, TLS-Terminierung, Cookies, **WAF** (Web Application Firewall).

Alle Load Balancer prüfen per **Health Probe**, ob ein Backend gesund ist, und schicken nur dorthin Verkehr.

| Bedarf | Azure | AWS |
|---|---|---|
| Layer 4, regional | **Azure Load Balancer** | **Network Load Balancer (NLB)** |
| Layer 7, regional, WAF, Pfad-Routing | **Application Gateway** | **Application Load Balancer (ALB)** (+ AWS WAF) |
| global, HTTP(S), mit CDN und WAF | **Azure Front Door** | **CloudFront** (+ Global Accelerator für TCP/UDP) |
| global, DNS-basiert, jedes Protokoll | **Traffic Manager** | **Route 53** Routing-Richtlinien |
| Firewall-Appliances transparent einbinden | Gateway Load Balancer | Gateway Load Balancer |

**CDN (Content Delivery Network):** Inhalte (Bilder, JS, Videos) werden an **Edge-Standorten** weltweit zwischengespeichert (Cache). Das senkt die Latenz für Nutzer und entlastet den Ursprungsserver (**Origin**). Wichtige Begriffe: **TTL** (wie lange gecacht wird), **Cache-Invalidierung/Purge** (Inhalte vorzeitig löschen), TLS am Edge.

DNS-basiertes Failover (Traffic Manager, Route 53) hängt von der **DNS-TTL** ab: Clients nutzen die alte IP, bis ihr Cache abläuft.`,
      analogy: 'Ein Layer-4-Load-Balancer ist der Pförtner, der Besucher nur nach Hausnummer auf freie Aufzüge verteilt. Der Layer-7-Load-Balancer liest den Termin auf der Einladung und schickt dich direkt zur richtigen Abteilung. Das CDN ist ein Kiosk in jeder Stadt, der die Zeitung schon vorrätig hat.',
      terms: [
        { de: 'Lastverteiler', en: 'load balancer' },
        { de: 'Integritätstest', en: 'health probe' },
        { de: 'Ursprungsserver', en: 'origin' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welche Voraussetzung muss für **VNet-/VPC-Peering** immer erfüllt sein?',
      options: [
        { id: 'a', text: 'Die Adressräume der beiden Netze dürfen sich nicht überschneiden.' },
        { id: 'b', text: 'Beide Netze müssen in derselben Region liegen.', whyWrong: 'Regionsübergreifendes Peering ist bei Azure (Global VNet Peering) und AWS (Inter-Region Peering) möglich.' },
        { id: 'c', text: 'Beide Netze brauchen ein VPN-Gateway.', whyWrong: 'Peering braucht kein Gateway, es läuft direkt über das Backbone.' },
        { id: 'd', text: 'Beide Netze müssen im selben Abonnement/Konto sein.', whyWrong: 'Peering funktioniert auch zwischen Abonnements bzw. Konten.' },
      ],
      correct: 'a',
      explanation: 'Bei überlappenden Bereichen wüsste der Router nicht, ob 10.0.1.5 lokal oder im anderen Netz liegt. Deshalb: IP-Planung (IPAM) von Anfang an.',
    },
    {
      id: 'q2', type: 'topology', mode: 'click', difficulty: 2,
      prompt: 'Spoke A und Spoke B sind **nur per normalem Peering** mit dem Hub verbunden (kein Gateway Transit, keine Firewall-Routen). Der Hub ist per VPN mit dem Rechenzentrum verbunden. Welche Netze erreicht **Spoke A**?',
      nodes: [
        { id: 'a', kind: 'cloud', label: 'Spoke A', x: 15, y: 75 },
        { id: 'hub', kind: 'cloud', label: 'Hub', x: 50, y: 40 },
        { id: 'b', kind: 'cloud', label: 'Spoke B', x: 85, y: 75 },
        { id: 'dc', kind: 'server', label: 'Rechenzentrum', x: 50, y: 8 },
      ],
      links: [['a', 'hub'], ['b', 'hub'], ['hub', 'dc']],
      correct: ['hub'],
      explanation: 'Peering ist nicht transitiv: Spoke A erreicht nur den Hub. Für Spoke B bräuchte es eine Firewall/NVA mit UDRs, Virtual WAN oder ein direktes Peering. Fürs Rechenzentrum bräuchte es Gateway Transit (und „Use remote gateways“ im Spoke).',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Welcher AWS-Dienst verbindet viele VPCs, VPNs und Direct-Connect-Verbindungen über einen **zentralen, transitiven Router**?',
      options: [
        { id: 'a', text: 'AWS Transit Gateway' },
        { id: 'b', text: 'VPC Peering', whyWrong: 'VPC Peering ist eine 1:1-Verbindung und nicht transitiv.' },
        { id: 'c', text: 'Internet Gateway', whyWrong: 'Das IGW verbindet eine VPC mit dem Internet, nicht VPCs untereinander.' },
        { id: 'd', text: 'NAT Gateway', whyWrong: 'Ein NAT Gateway ermöglicht ausgehenden Internetzugang für private Subnetze.' },
      ],
      correct: 'a',
      explanation: 'Das Azure-Gegenstück ist Azure Virtual WAN (oder ein selbstgebauter Hub mit Azure Firewall und UDRs).',
    },
    {
      id: 'q4', portal: 'Virtuelles Netzwerk → Subnetze → „+ Gatewaysubnetz“ (der Name ist fest vorgegeben)', type: 'cli', shell: 'azcli', difficulty: 2,
      prompt: 'Lege im Hub-VNet das Subnetz an, in dem das **VPN Gateway** bereitgestellt werden kann.',
      template: '$ az network vnet subnet create -g rg-hub --vnet-name vnet-hub -n {{0}} --address-prefixes 10.0.255.0/27',
      blanks: [{ accept: ['GatewaySubnet'] }],
      explanation: 'Das Gateway-Subnetz muss exakt `GatewaySubnet` heißen. Azure Bastion braucht analog `AzureBastionSubnet`, Azure Firewall `AzureFirewallSubnet`.',
    },
    {
      id: 'q5', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu **Site-to-Site-VPN** in der Cloud stimmen?',
      options: [
        { id: 'a', text: 'Der Verkehr wird per IPsec verschlüsselt über das Internet übertragen.' },
        { id: 'b', text: 'Eine AWS-S2S-VPN-Verbindung besteht aus zwei Tunneln.' },
        { id: 'c', text: 'Bandbreite und Latenz hängen von der Internetverbindung ab.' },
        { id: 'd', text: 'Ein S2S-VPN braucht Wochen zur Bereitstellung.', whyWrong: 'S2S-VPNs sind in Minuten bis Stunden eingerichtet. Wochen dauern dedizierte Leitungen wie ExpressRoute/Direct Connect.' },
        { id: 'e', text: 'S2S-VPN garantiert eine feste Bandbreite.', whyWrong: 'Über das Internet gibt es keine garantierte Bandbreite.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'S2S-VPN ist der schnelle, günstige Einstieg in hybride Netze und ein gutes Backup für eine Standleitung.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Welche Aussage zu **ExpressRoute** bzw. **Direct Connect** ist **falsch**?',
      options: [
        { id: 'a', text: 'Der Verkehr ist automatisch Ende-zu-Ende verschlüsselt.' },
        { id: 'b', text: 'Der Verkehr läuft nicht über das öffentliche Internet.', whyWrong: 'Diese Aussage stimmt, gesucht war die falsche.' },
        { id: 'c', text: 'Das Routing erfolgt per BGP.', whyWrong: 'Diese Aussage stimmt, gesucht war die falsche.' },
        { id: 'd', text: 'Die Bereitstellung dauert oft Wochen.', whyWrong: 'Diese Aussage stimmt, gesucht war die falsche.' },
      ],
      correct: 'a',
      explanation: 'Privat heißt nicht verschlüsselt. Wer Verschlüsselung braucht, nutzt MACsec (Layer 2) oder ein IPsec-VPN über die Leitung.',
      analogy: 'Eine eigene Schienenstrecke schützt vor Stau, aber die Waggons sind trotzdem nicht abgeschlossen.',
    },
    {
      id: 'q7', type: 'scenario', difficulty: 2,
      scenario: 'Ein Unternehmen überträgt täglich mehrere Terabyte zwischen Rechenzentrum und Azure. Die Anwendung braucht **konstant niedrige Latenz**, die Compliance-Abteilung verbietet Übertragung über das öffentliche Internet.',
      prompt: 'Welche Verbindung passt?',
      options: [
        { id: 'a', text: 'ExpressRoute (optional zusätzlich S2S-VPN als Backup)' },
        { id: 'b', text: 'Point-to-Site-VPN', whyWrong: 'P2S verbindet einzelne Clients, nicht ein ganzes Rechenzentrum, und läuft über das Internet.' },
        { id: 'c', text: 'Site-to-Site-VPN allein', whyWrong: 'S2S läuft über das Internet: Das widerspricht der Compliance-Vorgabe, und die Latenz ist nicht konstant.' },
        { id: 'd', text: 'Öffentliche IPs auf allen VMs', whyWrong: 'Das wäre der Weg über das Internet ohne jeden Schutz.' },
      ],
      correct: 'a',
      explanation: 'ExpressRoute = private Leitung mit planbarer Bandbreite und Latenz. Ein VPN als Backup sichert gegen Leitungsausfälle ab (dann ggf. mit Compliance-Ausnahme).',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Was unterscheidet einen **Azure Private Endpoint** von einem **Service Endpoint**?',
      options: [
        { id: 'a', text: 'Der Private Endpoint gibt dem Dienst eine private IP im eigenen VNet; der Service Endpoint lässt den Dienst auf seiner öffentlichen IP.' },
        { id: 'b', text: 'Service Endpoints sind die neuere, sicherere Variante.', whyWrong: 'Umgekehrt: Private Endpoints (Private Link) sind die flexiblere und strengere Variante.' },
        { id: 'c', text: 'Private Endpoints funktionieren nur innerhalb derselben Region.', whyWrong: 'Private Endpoints sind auch regions- und netzübergreifend sowie von lokal per VPN/ExpressRoute erreichbar.' },
        { id: 'd', text: 'Es gibt keinen Unterschied.', whyWrong: 'Der Unterschied ist grundlegend: private IP im VNet vs. öffentlicher Endpunkt mit Subnetzfilter.' },
      ],
      correct: 'a',
      explanation: 'Mit Private Endpoint kann der öffentliche Netzwerkzugriff auf den Dienst komplett deaktiviert werden. Wichtig ist eine private DNS-Zone für die Namensauflösung.',
    },
    {
      id: 'q9', type: 'scenario', difficulty: 3,
      scenario: 'Für ein Storage Account wurde ein **Private Endpoint** (IP `10.1.2.5`) eingerichtet und der öffentliche Zugriff deaktiviert. Eine VM im VNet bekommt beim Zugriff auf `stlernen01.blob.core.windows.net` trotzdem „Zugriff verweigert“. `nslookup` zeigt eine **öffentliche** IP.',
      prompt: 'Was fehlt?',
      options: [
        { id: 'a', text: 'Die private DNS-Zone `privatelink.blob.core.windows.net` mit Verknüpfung zum VNet (A-Record auf 10.1.2.5)' },
        { id: 'b', text: 'Ein NAT Gateway', whyWrong: 'Mit NAT ginge der Verkehr erst recht über die öffentliche IP, und die ist gesperrt.' },
        { id: 'c', text: 'Ein größeres Subnetz', whyWrong: 'Die Subnetzgröße hat nichts mit der Namensauflösung zu tun.' },
        { id: 'd', text: 'Eine NSG-Regel für Port 53', whyWrong: 'Die DNS-Abfrage funktioniert ja, sie liefert nur die falsche (öffentliche) Adresse.' },
      ],
      correct: 'a',
      explanation: 'Private Endpoints und DNS gehören immer zusammen. Ohne private Zone löst der Name auf den öffentlichen Endpunkt auf, und der ist gesperrt. Typisches AZ-104-Troubleshooting.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Private EC2-Instanzen sollen **S3** erreichen, **ohne NAT Gateway** und ohne zusätzliche Kosten. Was nutzt du?',
      options: [
        { id: 'a', text: 'Einen Gateway VPC Endpoint für S3 (Eintrag in der Route Table)' },
        { id: 'b', text: 'Einen Interface Endpoint für S3', whyWrong: 'Ein Interface Endpoint geht auch, kostet aber pro Stunde und GB. Der Gateway Endpoint für S3 ist kostenlos.' },
        { id: 'c', text: 'Ein Internet Gateway im privaten Subnetz', whyWrong: 'Dann wäre das Subnetz öffentlich, und der Verkehr liefe über das Internet.' },
        { id: 'd', text: 'VPC Peering mit S3', whyWrong: 'S3 ist keine VPC und kann nicht gepeert werden.' },
      ],
      correct: 'a',
      explanation: 'Gateway Endpoints gibt es nur für S3 und DynamoDB. Sie sparen außerdem NAT-Gateway-Datenkosten, die bei großen S3-Transfers schnell teuer werden.',
    },
    {
      id: 'q11', type: 'dragdrop', difficulty: 2,
      prompt: 'Welcher **Azure-Dienst** passt zur Anforderung?',
      items: [
        { id: 'i1', text: 'TCP-Verkehr auf mehrere VMs in einer Region verteilen' },
        { id: 'i2', text: 'HTTPS, Routing nach URL-Pfad, WAF, eine Region' },
        { id: 'i3', text: 'Globaler HTTP-Einstiegspunkt mit CDN und WAF' },
        { id: 'i4', text: 'Globales Failover per DNS, beliebiges Protokoll' },
      ],
      buckets: [
        { id: 'lb', label: 'Azure Load Balancer' },
        { id: 'agw', label: 'Application Gateway' },
        { id: 'fd', label: 'Front Door' },
        { id: 'tm', label: 'Traffic Manager' },
      ],
      solution: { i1: 'lb', i2: 'agw', i3: 'fd', i4: 'tm' },
      explanation: 'Merkhilfe: regional/global × Layer 4/Layer 7. Load Balancer = regional L4, Application Gateway = regional L7, Front Door = global L7, Traffic Manager = global DNS.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Eine Webanwendung soll Anfragen an `/api/*` an andere Server schicken als Anfragen an `/shop/*`. Welcher AWS Load Balancer?',
      options: [
        { id: 'a', text: 'Application Load Balancer (ALB)' },
        { id: 'b', text: 'Network Load Balancer (NLB)', whyWrong: 'Ein NLB arbeitet auf Layer 4 und sieht keine URL-Pfade.' },
        { id: 'c', text: 'Gateway Load Balancer', whyWrong: 'Der GWLB dient zum transparenten Einbinden von Firewall-Appliances.' },
        { id: 'd', text: 'Route 53 Weighted Routing', whyWrong: 'DNS kennt nur Hostnamen, keine URL-Pfade.' },
      ],
      correct: 'a',
      explanation: 'Pfad- und Host-basiertes Routing sind Layer-7-Funktionen. Der ALB leitet an verschiedene Target Groups weiter.',
    },
    {
      id: 'q13', type: 'multi', difficulty: 2,
      prompt: 'Welche Vorteile bringt ein **CDN**?',
      options: [
        { id: 'a', text: 'Geringere Latenz durch Auslieferung vom nächstgelegenen Edge-Standort' },
        { id: 'b', text: 'Entlastung des Ursprungsservers (Origin)' },
        { id: 'c', text: 'Schutz vor bestimmten Angriffen (z. B. DDoS-Absorption, oft mit WAF)' },
        { id: 'd', text: 'Dynamische, personalisierte Inhalte werden automatisch korrekt gecacht', whyWrong: 'Personalisierte Inhalte (z. B. Warenkorb) dürfen meist gar nicht gecacht werden. Das muss man per Cache-Regeln steuern.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Typisch für statische Inhalte. Wird eine Datei geändert, hilft eine Cache-Invalidierung (Purge) oder versionierte Dateinamen (`app.3f9a.js`).',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Wozu dient eine **Health Probe** am Load Balancer?',
      options: [
        { id: 'a', text: 'Sie prüft regelmäßig, ob ein Backend antwortet, und nimmt kranke Backends aus der Verteilung.' },
        { id: 'b', text: 'Sie misst die Zufriedenheit der Nutzer.', whyWrong: 'Health Probes prüfen technisch die Erreichbarkeit, nicht die Nutzererfahrung.' },
        { id: 'c', text: 'Sie verschlüsselt den Verkehr.', whyWrong: 'Verschlüsselung (TLS) ist eine andere Funktion.' },
        { id: 'd', text: 'Sie startet abgestürzte VMs neu.', whyWrong: 'Der Load Balancer startet nichts neu. Das machen z. B. Scale Sets/Auto Scaling mit eigenen Health Checks.' },
      ],
      correct: 'a',
      explanation: 'Eine gute Probe prüft einen echten Endpunkt (z. B. `/health`, der auch die DB-Verbindung testet), nicht nur einen offenen Port.',
    },
    {
      id: 'q15', type: 'scenario', difficulty: 2,
      scenario: 'Eine Firma will **allen ausgehenden Internetverkehr** aus ihren Azure-Spokes durch eine **Azure Firewall** im Hub (`10.0.1.4`) schicken.',
      prompt: 'Was konfigurierst du in den Spoke-Subnetzen?',
      options: [
        { id: 'a', text: 'Eine Route Table (UDR): 0.0.0.0/0 → Next Hop „Virtual Appliance“ 10.0.1.4' },
        { id: 'b', text: 'Eine NSG-Regel „Allow 10.0.1.4“', whyWrong: 'NSGs filtern Verkehr, sie ändern aber nicht den Weg.' },
        { id: 'c', text: 'Einen Private Endpoint für das Internet', whyWrong: 'Private Endpoints gelten für einzelne PaaS-Dienste, nicht für „das Internet“.' },
        { id: 'd', text: 'Ein zweites Peering zum Internet', whyWrong: 'Mit dem Internet kann man nicht peeren.' },
      ],
      correct: 'a',
      explanation: 'Benutzerdefinierte Routen überschreiben die Systemroute zum Internet. Die Firewall muss die Spokes über das Peering erreichen und die Verbindung per Regel erlauben.',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Warum kann ein **DNS-basiertes Failover** (Traffic Manager, Route 53) einige Minuten dauern, obwohl der Health Check den Ausfall sofort erkennt?',
      options: [
        { id: 'a', text: 'Clients und Resolver cachen die alte Antwort, bis die DNS-TTL abläuft.' },
        { id: 'b', text: 'DNS-Server werden nur einmal pro Stunde aktualisiert.', whyWrong: 'Die Änderung im autoritativen DNS ist sofort aktiv. Verzögerungen entstehen durch Caches.' },
        { id: 'c', text: 'Der Load Balancer muss neu starten.', whyWrong: 'Bei DNS-Failover ist kein Load Balancer im Datenpfad.' },
        { id: 'd', text: 'Das ist ein Fehler, DNS-Failover ist immer sofort.', whyWrong: 'Durch Caching ist DNS-Failover prinzipbedingt nicht sofort.' },
      ],
      correct: 'a',
      explanation: 'Kurze TTLs (z. B. 30–60 s) beschleunigen das Failover, erhöhen aber die Zahl der DNS-Abfragen. Echte Sofort-Umschaltung bieten Anycast-Dienste wie Front Door oder Global Accelerator.',
    },
    { id: 'g1', type: 'generated', generator: 'cost-nat', difficulty: 2, domain: 'cost' },
    {
      id: 'cfg1', type: 'config', difficulty: 3,
      prompt: 'Hub-and-Spoke-Puzzle (Azure): Setze genau die Optionen, die beide Anforderungen erfüllen.',
      nodes: [
        { id: 'dc', kind: 'server', label: 'Rechenzentrum', x: 50, y: 8 },
        { id: 'hub', kind: 'firewall', label: 'Hub (VPN + Firewall)', x: 50, y: 42 },
        { id: 'a', kind: 'cloud', label: 'Spoke A', x: 18, y: 82 },
        { id: 'b', kind: 'cloud', label: 'Spoke B', x: 82, y: 82 },
      ],
      links: [['dc', 'hub', 'VPN'], ['hub', 'a', 'Peering'], ['hub', 'b', 'Peering']],
      requirements: [
        { text: 'Beide Spokes erreichen das Rechenzentrum über das VPN-Gateway im Hub.', needs: ['peerA', 'peerB', 'transit'] },
        { text: 'Spoke A und Spoke B sprechen miteinander, und zwar über die Firewall im Hub.', needs: ['peerA', 'peerB', 'udr'] },
      ],
      toggles: [
        { id: 'peerA', text: 'Peering Hub ↔ Spoke A (in beide Richtungen)', why: 'Grundvoraussetzung für jede Verbindung zwischen Spoke A und Hub.' },
        { id: 'peerB', text: 'Peering Hub ↔ Spoke B (in beide Richtungen)', why: 'Grundvoraussetzung für jede Verbindung zwischen Spoke B und Hub.' },
        { id: 'transit', text: 'Hub-Peering: Gateway Transit erlauben; Spoke-Peerings: Remote-Gateway verwenden', why: 'Erst damit nutzen die Spokes das VPN-Gateway des Hubs.' },
        { id: 'udr', text: 'UDR in beiden Spokes: Netz des anderen Spokes → Next Hop Firewall-IP im Hub', why: 'Peering ist nicht transitiv: Spoke-zu-Spoke geht nur über die Firewall als Router.' },
        { id: 'peerAB', text: 'Zusätzliches direktes Peering Spoke A ↔ Spoke B', why: 'Würde die Firewall umgehen. Gefordert ist Verkehr über die Firewall.' },
        { id: 'gwSpokes', text: 'Eigenes VPN-Gateway in jedem Spoke', why: 'Teuer und unnötig. Genau das spart Gateway Transit.' },
      ],
      solution: ['peerA', 'peerB', 'transit', 'udr'],
      explanation: 'Hub-and-Spoke lebt von zwei Bausteinen: Gateway Transit für den Weg ins Rechenzentrum und UDRs auf die Firewall für Spoke-zu-Spoke.',
    },
    {
      id: 't1', type: 'topology', mode: 'click', difficulty: 2,
      prompt: '**Was ist hier falsch?** Die App-Server in drei AZs sollen ihren Internetzugang auch beim Ausfall einer AZ behalten. Welche Komponente ist der Schwachpunkt?',
      nodes: [
        { id: 'igw', kind: 'router', label: 'IGW', x: 50, y: 8 },
        { id: 'nat', kind: 'router', label: 'NAT-GW (AZ a)', x: 50, y: 38 },
        { id: 'a', kind: 'server', label: 'App AZ a', x: 15, y: 85 },
        { id: 'b', kind: 'server', label: 'App AZ b', x: 50, y: 85 },
        { id: 'c', kind: 'server', label: 'App AZ c', x: 85, y: 85 },
      ],
      links: [['igw', 'nat'], ['nat', 'a'], ['nat', 'b'], ['nat', 'c']],
      correct: ['nat'],
      explanation: 'Alle privaten Subnetze nutzen das eine NAT Gateway in AZ a. Fällt AZ a aus, verlieren auch b und c den Internetzugang. Lösung: ein NAT Gateway pro AZ, jede AZ routet zu ihrem eigenen.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        scenario: 'Eine Firma hat 12 VPCs in einer AWS-Region, die alle miteinander und mit dem Rechenzentrum (zwei Standorte) kommunizieren sollen. Bisher gibt es ein Gewirr aus VPC-Peerings und einzelnen VPNs.',
        prompt: 'Welche Architektur vereinfacht das am meisten?',
        options: [
          { id: 'a', text: 'Ein Transit Gateway: alle VPCs anhängen, VPNs/Direct Connect am Transit Gateway terminieren' },
          { id: 'b', text: 'Vollvermaschtes VPC Peering', whyWrong: '12 VPCs bräuchten 12·11/2 = 66 Peerings, und das Rechenzentrum wäre damit noch nicht angebunden (Peering ist nicht transitiv).' },
          { id: 'c', text: 'Alle Anwendungen in eine einzige große VPC migrieren', whyWrong: 'Das verliert Isolation zwischen Teams/Umgebungen und ist ein riesiges Migrationsprojekt.' },
          { id: 'd', text: 'Öffentliche IPs auf allen Instanzen und Kommunikation übers Internet', whyWrong: 'Das ist unsicher, teuer (Datenkosten) und schwer zu verwalten.' },
        ],
        correct: 'a',
        explanation: 'Hub-and-Spoke mit Transit Gateway: 12 Anhänge statt 66 Peerings. Routing zentral über TGW-Route-Tables, auch Segmentierung (Prod/Dev getrennt) ist möglich.',
      },
      {
        id: 'b2', type: 'dragdrop', difficulty: 3,
        prompt: 'Ordne den Azure-Diensten die AWS-Entsprechung zu.',
        items: [
          { id: 'i1', text: 'ExpressRoute' },
          { id: 'i2', text: 'Virtual WAN' },
          { id: 'i3', text: 'Private Endpoint' },
          { id: 'i4', text: 'Application Gateway' },
          { id: 'i5', text: 'Azure Load Balancer' },
        ],
        buckets: [
          { id: 'dx', label: 'Direct Connect' },
          { id: 'tgw', label: 'Transit Gateway' },
          { id: 'ie', label: 'Interface Endpoint (PrivateLink)' },
          { id: 'alb', label: 'Application Load Balancer' },
          { id: 'nlb', label: 'Network Load Balancer' },
        ],
        solution: { i1: 'dx', i2: 'tgw', i3: 'ie', i4: 'alb', i5: 'nlb' },
        explanation: 'Die Konzepte sind fast deckungsgleich. Wer eines kann, lernt das andere schnell, wichtig für Multi-Cloud-Jobs.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        scenario: 'VNet A (`10.1.0.0/16`) und VNet B (`10.1.0.0/16`) gehören zwei Firmen, die fusioniert haben. Sie sollen per Peering verbunden werden. Das Portal verweigert das Peering.',
        prompt: 'Was ist die Ursache und eine realistische Lösung?',
        options: [
          { id: 'a', text: 'Überlappende Adressräume – ein Netz muss neu adressiert werden (oder Übergang per NAT-fähiger Appliance als Zwischenlösung).' },
          { id: 'b', text: 'Peering zwischen verschiedenen Firmen ist verboten.', whyWrong: 'Peering über Abonnements und sogar Mandanten hinweg ist mit passenden Rechten möglich.' },
          { id: 'c', text: 'Man braucht vorher ein VPN-Gateway in beiden VNets.', whyWrong: 'Peering braucht kein Gateway. Die Ursache ist der identische Adressraum.' },
          { id: 'd', text: 'Die NSGs blockieren das Peering.', whyWrong: 'NSGs filtern Verkehr, sie verhindern nicht das Anlegen eines Peerings.' },
        ],
        correct: 'a',
        explanation: 'Darum lohnt sich eine zentrale IP-Adressplanung (IPAM). Ein Re-IP ist aufwendig, NAT ist nur eine Übergangslösung mit Nebenwirkungen (Logging, Firewall-Regeln).',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Eine Bank nutzt AWS Direct Connect. Die Compliance verlangt **Verschlüsselung aller Daten auf dem Weg**. Was ist eine passende Lösung?',
        options: [
          { id: 'a', text: 'Ein Site-to-Site-IPsec-VPN über die Direct-Connect-Verbindung (oder MACsec, wo unterstützt)' },
          { id: 'b', text: 'Nichts – Direct Connect ist automatisch verschlüsselt.', whyWrong: 'Direct Connect ist privat, aber standardmäßig nicht verschlüsselt.' },
          { id: 'c', text: 'Eine Security Group mit „encrypt=true“', whyWrong: 'Security Groups filtern Verkehr, sie verschlüsseln nicht. Eine solche Option gibt es nicht.' },
          { id: 'd', text: 'Auf ein Internet-Gateway umsteigen', whyWrong: 'Das Internet-Gateway verschlüsselt ebenfalls nichts und verlässt die private Leitung.' },
        ],
        correct: 'a',
        explanation: 'Gleiches gilt für ExpressRoute: privat ≠ verschlüsselt. Zusätzlich verschlüsselt man Anwendungsverkehr meist ohnehin per TLS.',
      },
      {
        id: 'b5', type: 'multi', difficulty: 3,
        prompt: 'Eine internationale Website soll **weltweit schnell** sein, bei Ausfall einer Region **automatisch** auf eine andere umschalten und gegen **Web-Angriffe** (SQL-Injection) geschützt sein. Was kombinierst du in Azure?',
        options: [
          { id: 'a', text: 'Azure Front Door mit WAF-Richtlinie' },
          { id: 'b', text: 'Backends in mindestens zwei Regionen mit Health Probes' },
          { id: 'c', text: 'Ein einzelner Azure Load Balancer in einer Region', whyWrong: 'Er ist regional und auf Layer 4. Er kennt weder WAF noch Regions-Failover.' },
          { id: 'd', text: 'Ein Point-to-Site-VPN für alle Besucher', whyWrong: 'Besucher einer öffentlichen Website verbinden sich nicht per VPN.' },
        ],
        correct: ['a', 'b'],
        explanation: 'Front Door = globaler Anycast-Einstieg mit CDN, WAF und automatischem Failover anhand von Health Probes. In AWS entspräche das CloudFront + WAF + Origins in mehreren Regionen (ggf. mit Route 53 Failover).',
      },
      {
        id: 'b6', type: 'cli', shell: 'awscli', difficulty: 3,
        prompt: 'Fordere ein **Peering** zwischen zwei VPCs an.',
        template: '$ aws ec2 {{0}} --vpc-id vpc-0a1b2c3d --peer-vpc-id vpc-9f8e7d6c',
        blanks: [{ accept: ['create-vpc-peering-connection'] }],
        explanation: 'Die Gegenseite nimmt mit `aws ec2 accept-vpc-peering-connection` an. Danach braucht es Routen in den Route Tables beider VPCs und passende Security-Group-Regeln.',
      },
      {
        id: 't2', type: 'topology', mode: 'click', difficulty: 3,
        prompt: '**Was ist hier falsch?** Spoke B wurde zuletzt angelegt und soll wie Spoke A mit dem Hub gepeert werden. Welches Netz verhindert das Peering?',
        nodes: [
          { id: 'hub', kind: 'cloud', label: 'Hub 10.0/16', x: 50, y: 15 },
          { id: 'a', kind: 'cloud', label: 'A 10.1/16', x: 20, y: 80 },
          { id: 'b', kind: 'cloud', label: 'B 10.1/16', x: 80, y: 80 },
        ],
        links: [['hub', 'a', 'Peering'], ['hub', 'b', 'Peering?']],
        correct: ['b'],
        explanation: 'Spoke B nutzt denselben Adressraum wie Spoke A (10.1.0.0/16). Der Hub hätte dann zwei Routen für dasselbe Netz. Lösung: B neu adressieren (z. B. 10.2.0.0/16), mit zentraler IP-Planung.',
      },
    ],
  },
};

export default level;
