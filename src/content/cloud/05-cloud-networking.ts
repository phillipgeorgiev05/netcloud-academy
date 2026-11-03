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
        { id: 'b', text: 'Beide Netze müssen in derselben Region liegen.', whyWrong: 'Peering über Regionen hinweg geht: In Azure heißt es Global VNet Peering, in AWS Inter-Region VPC Peering. Der Verkehr läuft dann über das Backbone des Anbieters. Immer nötig ist nur, dass sich die Adressräume nicht überschneiden, sonst wüsste niemand, welches Netz gemeint ist.' },
        { id: 'c', text: 'Beide Netze brauchen ein VPN-Gateway.', whyWrong: 'Peering verbindet zwei Netze direkt über das Backbone des Anbieters, ganz ohne Gateway. VPN-Gateways braucht man für Verbindungen über das Internet, z. B. zum eigenen Rechenzentrum. Für Peering zählt nur, dass sich die Adressräume nicht überschneiden.' },
        { id: 'd', text: 'Beide Netze müssen im selben Abonnement/Konto sein.', whyWrong: 'Peering geht auch zwischen verschiedenen Azure-Abonnements und sogar Mandanten bzw. zwischen verschiedenen AWS-Konten. Beide Seiten müssen nur zustimmen bzw. die Rechte haben. Voraussetzung ist immer: keine überlappenden Adressräume.' },
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
        { id: 'b', text: 'VPC Peering', whyWrong: 'VPC Peering verbindet genau zwei VPCs 1:1 und ist nicht transitiv. Ist A mit B und B mit C gepeert, kommt A trotzdem nicht zu C. Bei vielen VPCs wird das schnell unübersichtlich. Ein Transit Gateway ist ein zentraler Router, an den alle angeschlossen werden.' },
        { id: 'c', text: 'Internet Gateway', whyWrong: 'Das Internet Gateway verbindet eine einzelne VPC mit dem Internet. VPCs untereinander, VPNs oder Direct Connect verbindet es nicht. Dafür gibt es das Transit Gateway als zentralen Knoten.' },
        { id: 'd', text: 'NAT Gateway', whyWrong: 'Ein NAT Gateway lässt Instanzen in privaten Subnetzen ausgehend ins Internet, ohne dass sie von außen erreichbar sind. Zwischen VPCs routet es nicht. Der zentrale Router für viele VPCs und VPNs ist das Transit Gateway.' },
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
        { id: 'd', text: 'Ein S2S-VPN braucht Wochen zur Bereitstellung.', whyWrong: 'Ein Site-to-Site-VPN läuft über die vorhandene Internetleitung. In der Cloud legt man nur Gateway und Verbindung an und konfiguriert den lokalen Router, das geht in Minuten bis Stunden. Wochen dauern dedizierte Leitungen wie ExpressRoute oder Direct Connect, weil dafür ein Provider Kabel schalten muss.' },
        { id: 'e', text: 'S2S-VPN garantiert eine feste Bandbreite.', whyWrong: 'Das VPN läuft durch das öffentliche Internet, und dort garantiert niemand eine feste Bandbreite oder Latenz. Das Gateway hat zwar eine Höchstgrenze, die tatsächliche Leistung schwankt aber. Feste Bandbreite bieten ExpressRoute oder Direct Connect.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'S2S-VPN ist der schnelle, günstige Einstieg in hybride Netze und ein gutes Backup für eine Standleitung.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Welche Aussage zu **ExpressRoute** bzw. **Direct Connect** ist **falsch**?',
      options: [
        { id: 'a', text: 'Der Verkehr ist automatisch Ende-zu-Ende verschlüsselt.' },
        { id: 'b', text: 'Der Verkehr läuft nicht über das öffentliche Internet.', whyWrong: 'Diese Aussage stimmt: ExpressRoute und Direct Connect sind private Leitungen über einen Provider oder Colocation-Partner, nicht über das öffentliche Internet. Gesucht war die falsche Aussage: Diese Leitungen sind standardmäßig nicht verschlüsselt.' },
        { id: 'c', text: 'Das Routing erfolgt per BGP.', whyWrong: 'Diese Aussage stimmt: Über ExpressRoute und Direct Connect tauschen eigener Router und Cloud ihre Routen per BGP aus. Gesucht war die falsche Aussage: Automatische Ende-zu-Ende-Verschlüsselung gibt es nicht.' },
        { id: 'd', text: 'Die Bereitstellung dauert oft Wochen.', whyWrong: 'Diese Aussage stimmt: Für eine dedizierte Leitung muss ein Provider physische Verbindungen schalten, das dauert oft Wochen. Gesucht war die falsche Aussage: Der Verkehr ist nicht automatisch verschlüsselt. Dafür braucht man zusätzlich IPsec oder MACsec.' },
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
        { id: 'b', text: 'Point-to-Site-VPN', whyWrong: 'Ein Point-to-Site-VPN verbindet einzelne Geräte, z. B. den Laptop eines Admins, mit dem VNet. Ein ganzes Rechenzentrum hängt man so nicht an. Außerdem läuft P2S über das Internet, was hier ausgeschlossen ist.' },
        { id: 'c', text: 'Site-to-Site-VPN allein', whyWrong: 'Ein Site-to-Site-VPN ist zwar verschlüsselt, läuft aber über das öffentliche Internet. Die Vorgabe verbietet genau das, und konstante Latenz gibt es dort nicht. ExpressRoute ist eine private Leitung. Ein S2S-VPN kann höchstens als Backup daneben dienen.' },
        { id: 'd', text: 'Öffentliche IPs auf allen VMs', whyWrong: 'Öffentliche IPs auf allen VMs würden sie direkt aus dem Internet erreichbar machen. Das ist ein Sicherheitsrisiko und widerspricht der Vorgabe, nicht über das Internet zu gehen. Gesucht ist eine private Leitung: ExpressRoute.' },
      ],
      correct: 'a',
      explanation: 'ExpressRoute = private Leitung mit planbarer Bandbreite und Latenz. Ein VPN als Backup sichert gegen Leitungsausfälle ab (dann ggf. mit Compliance-Ausnahme).',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Was unterscheidet einen **Azure Private Endpoint** von einem **Service Endpoint**?',
      options: [
        { id: 'a', text: 'Der Private Endpoint gibt dem Dienst eine private IP im eigenen VNet; der Service Endpoint lässt den Dienst auf seiner öffentlichen IP.' },
        { id: 'b', text: 'Service Endpoints sind die neuere, sicherere Variante.', whyWrong: 'Genau umgekehrt. Service Endpoints sind die ältere, einfachere Lösung: Der Dienst bleibt auf seiner öffentlichen IP, nur der Zugriff aus bestimmten Subnetzen wird erlaubt. Private Endpoints (Private Link) bringen den Dienst mit einer privaten IP ins eigene VNet und sind strenger.' },
        { id: 'c', text: 'Private Endpoints funktionieren nur innerhalb derselben Region.', whyWrong: 'Ein Private Endpoint ist eine private IP im VNet. Er ist auch aus gepeerten VNets in anderen Regionen und von lokal per VPN oder ExpressRoute erreichbar. Service Endpoints funktionieren dagegen nur aus den freigeschalteten Subnetzen.' },
        { id: 'd', text: 'Es gibt keinen Unterschied.', whyWrong: 'Der Unterschied ist grundlegend. Der Private Endpoint gibt dem Dienst eine private IP im eigenen VNet, und der öffentliche Zugang kann ganz zu. Beim Service Endpoint bleibt der Dienst auf seiner öffentlichen IP, nur der Weg dorthin geht über das Azure-Backbone.' },
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
        { id: 'b', text: 'Ein NAT Gateway', whyWrong: 'Ein NAT Gateway schickt Verkehr nach außen über eine öffentliche IP. Der Speicher akzeptiert aber nur noch den privaten Weg, der öffentliche Zugang ist gesperrt. Das Problem ist die Namensauflösung: Der Name zeigt noch auf die öffentliche IP statt auf 10.1.2.5.' },
        { id: 'c', text: 'Ein größeres Subnetz', whyWrong: 'Die Subnetzgröße bestimmt nur, wie viele Adressen frei sind. Der Private Endpoint hat seine IP 10.1.2.5 ja schon bekommen. Es fehlt die private DNS-Zone, damit der Name auf diese private IP zeigt.' },
        { id: 'd', text: 'Eine NSG-Regel für Port 53', whyWrong: 'DNS funktioniert ja: Die Abfrage liefert eine Antwort, nur die falsche, nämlich die öffentliche IP. Ohne private DNS-Zone `privatelink.blob.core.windows.net` im VNet kennt der Resolver die private Adresse nicht. Eine NSG-Regel ändert daran nichts.' },
      ],
      correct: 'a',
      explanation: 'Private Endpoints und DNS gehören immer zusammen. Ohne private Zone löst der Name auf den öffentlichen Endpunkt auf, und der ist gesperrt. Typisches AZ-104-Troubleshooting.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Private EC2-Instanzen sollen **S3** erreichen, **ohne NAT Gateway** und ohne zusätzliche Kosten. Was nutzt du?',
      options: [
        { id: 'a', text: 'Einen Gateway VPC Endpoint für S3 (Eintrag in der Route Table)' },
        { id: 'b', text: 'Einen Interface Endpoint für S3', whyWrong: 'Ein Interface Endpoint für S3 gibt es auch. Er legt eine Netzwerkschnittstelle mit privater IP ins Subnetz, kostet aber pro Stunde und pro GB. Der Gateway Endpoint ist nur ein Eintrag in der Route Table und kostenlos. Genau das war gefordert.' },
        { id: 'c', text: 'Ein Internet Gateway im privaten Subnetz', whyWrong: 'Ein Internet Gateway hängt an der VPC, nicht an einem Subnetz. Mit einer Route dorthin wäre das Subnetz öffentlich, und Instanzen bräuchten öffentliche IPs. Der Verkehr liefe über das Internet. Ein Gateway Endpoint hält den Weg zu S3 privat.' },
        { id: 'd', text: 'VPC Peering mit S3', whyWrong: 'S3 ist ein regionaler AWS-Dienst und keine VPC, darum kann man nicht mit ihm peeren. Privaten Zugriff auf S3 gibt es über VPC Endpoints. Der Gateway Endpoint ist dabei kostenlos.' },
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
        { id: 'b', text: 'Network Load Balancer (NLB)', whyWrong: 'Ein Network Load Balancer arbeitet auf Layer 4 und sieht nur IP-Adressen und Ports. Den URL-Pfad wie `/api` kann er nicht lesen, der steckt im HTTP-Inhalt. Für Routing nach Pfad braucht man den Application Load Balancer (Layer 7).' },
        { id: 'c', text: 'Gateway Load Balancer', whyWrong: 'Der Gateway Load Balancer bindet virtuelle Appliances wie Firewalls oder IDS transparent in den Verkehr ein. Er verteilt nicht nach URL-Pfaden. Das kann nur der Application Load Balancer.' },
        { id: 'd', text: 'Route 53 Weighted Routing', whyWrong: 'DNS löst nur Hostnamen wie `shop.example.com` auf. Der Pfad nach dem Schrägstrich kommt erst in der HTTP-Anfrage und ist für DNS unsichtbar. Für `/api/*` gegen `/shop/*` braucht man einen Application Load Balancer.' },
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
        { id: 'd', text: 'Dynamische, personalisierte Inhalte werden automatisch korrekt gecacht', whyWrong: 'Personalisierte Inhalte wie Warenkorb oder Kontoseite sind für jeden Nutzer anders. Würde das CDN sie cachen, könnte ein Nutzer die Daten eines anderen sehen. Das CDN erkennt das nicht automatisch. Man muss es mit Cache-Regeln und Headern (z. B. `Cache-Control: private`) steuern.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Typisch für statische Inhalte. Wird eine Datei geändert, hilft eine Cache-Invalidierung (Purge) oder versionierte Dateinamen (`app.3f9a.js`).',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Wozu dient eine **Health Probe** am Load Balancer?',
      options: [
        { id: 'a', text: 'Sie prüft regelmäßig, ob ein Backend antwortet, und nimmt kranke Backends aus der Verteilung.' },
        { id: 'b', text: 'Sie misst die Zufriedenheit der Nutzer.', whyWrong: 'Eine Health Probe ist eine technische Prüfung: Antwortet das Backend auf Port oder URL, z. B. `/health` mit HTTP 200? Wie zufrieden Nutzer sind, misst sie nicht. Dafür gibt es Monitoring wie Application Insights oder Umfragen.' },
        { id: 'c', text: 'Sie verschlüsselt den Verkehr.', whyWrong: 'Verschlüsselung macht TLS, das man z. B. am Load Balancer terminiert. Die Health Probe prüft nur, ob ein Backend gesund ist, und nimmt kranke aus der Verteilung.' },
        { id: 'd', text: 'Sie startet abgestürzte VMs neu.', whyWrong: 'Der Load Balancer startet nichts neu. Er schickt nur keinen Verkehr mehr an ein krankes Backend. VMs ersetzen oder neu starten machen andere Dienste, z. B. VM Scale Sets mit automatischer Reparatur oder AWS Auto Scaling.' },
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
        { id: 'b', text: 'Eine NSG-Regel „Allow 10.0.1.4“', whyWrong: 'Eine NSG entscheidet nur, ob Verkehr durchgelassen oder blockiert wird. Den Weg ändert sie nicht. Damit der Internetverkehr über die Firewall 10.0.1.4 im Hub läuft, braucht man eine Route Table (UDR) mit Next Hop „Virtual Appliance“.' },
        { id: 'c', text: 'Einen Private Endpoint für das Internet', whyWrong: 'Private Endpoints bringen einen einzelnen PaaS-Dienst, z. B. ein Speicherkonto, mit privater IP ins VNet. „Das Internet“ lässt sich so nicht anbinden. Um Verkehr über die Firewall zu leiten, braucht man eine benutzerdefinierte Route.' },
        { id: 'd', text: 'Ein zweites Peering zum Internet', whyWrong: 'Peering verbindet zwei VNets. Das Internet ist kein VNet, mit ihm kann man nicht peeren. Damit Spoke-Verkehr über die Firewall im Hub ins Internet geht, setzt man eine UDR: 0.0.0.0/0 zu 10.0.1.4.' },
      ],
      correct: 'a',
      explanation: 'Benutzerdefinierte Routen überschreiben die Systemroute zum Internet. Die Firewall muss die Spokes über das Peering erreichen und die Verbindung per Regel erlauben.',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Warum kann ein **DNS-basiertes Failover** (Traffic Manager, Route 53) einige Minuten dauern, obwohl der Health Check den Ausfall sofort erkennt?',
      options: [
        { id: 'a', text: 'Clients und Resolver cachen die alte Antwort, bis die DNS-TTL abläuft.' },
        { id: 'b', text: 'DNS-Server werden nur einmal pro Stunde aktualisiert.', whyWrong: 'Die Änderung ist im autoritativen DNS sofort aktiv, sobald der Health Check den Ausfall erkennt. Verzögert wird sie durch Caches: Resolver und Clients verwenden die alte Antwort weiter, bis deren TTL abgelaufen ist. Darum setzt man bei Failover-Einträgen kurze TTLs.' },
        { id: 'c', text: 'Der Load Balancer muss neu starten.', whyWrong: 'Bei DNS-Failover liegt kein Load Balancer im Datenpfad. DNS gibt nur eine andere Adresse heraus, und die Clients verbinden sich direkt dorthin. Die Verzögerung kommt daher, dass Clients die alte Antwort bis zum Ablauf der TTL zwischenspeichern.' },
        { id: 'd', text: 'Das ist ein Fehler, DNS-Failover ist immer sofort.', whyWrong: 'Wie DNS funktioniert, macht sofortiges Umschalten unmöglich: Antworten werden zwischengespeichert, bis die TTL abläuft. Das ist kein Fehler, sondern gewollt. Kurze TTLs verkürzen die Zeit. Sofortiges Umschalten bieten Lösungen im Datenpfad, z. B. Azure Front Door oder AWS Global Accelerator.' },
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
          { id: 'b', text: 'Vollvermaschtes VPC Peering', whyWrong: 'Vollvermaschtes Peering für 12 VPCs braucht 12 · 11 / 2 = 66 Verbindungen, und jede neue VPC macht es schlimmer. Weil Peering nicht transitiv ist, käme das Rechenzentrum trotzdem nicht über eine VPC zu den anderen. Ein Transit Gateway braucht nur eine Verbindung pro VPC.' },
          { id: 'c', text: 'Alle Anwendungen in eine einzige große VPC migrieren', whyWrong: 'Eine einzige große VPC würde die Trennung zwischen Teams und Umgebungen (z. B. Test und Produktion) aufheben. Fehler oder Angriffe könnten sich leichter ausbreiten. Außerdem wäre der Umzug ein riesiges Projekt. Ein Transit Gateway vereinfacht, ohne die Trennung aufzugeben.' },
          { id: 'd', text: 'Öffentliche IPs auf allen Instanzen und Kommunikation übers Internet', whyWrong: 'Öffentliche IPs auf allen Instanzen machen sie aus dem Internet angreifbar. Datenverkehr über das Internet kostet zusätzlich, und die Verwaltung der Freigaben wird unübersichtlich. Ein Transit Gateway verbindet alles privat über einen zentralen Punkt.' },
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
          { id: 'b', text: 'Peering zwischen verschiedenen Firmen ist verboten.', whyWrong: 'Peering zwischen verschiedenen Abonnements und sogar Mandanten (also Firmen) ist erlaubt, wenn auf beiden Seiten die nötigen Rechte vorliegen. Das Problem ist ein anderes: Beide VNets nutzen denselben Adressraum, und dann ist Peering technisch unmöglich.' },
          { id: 'c', text: 'Man braucht vorher ein VPN-Gateway in beiden VNets.', whyWrong: 'Peering braucht kein VPN-Gateway, es verbindet die VNets direkt über das Backbone. Auch mit Gateway würde das Problem bleiben: Bei identischem Adressraum weiß kein Router, welches Netz gemeint ist. Ein Netz muss neu adressiert werden.' },
          { id: 'd', text: 'Die NSGs blockieren das Peering.', whyWrong: 'NSGs filtern Pakete erst, wenn eine Verbindung besteht. Das Anlegen eines Peerings verhindern sie nicht. Hier scheitert das Peering schon beim Anlegen, weil sich die Adressräume überschneiden.' },
        ],
        correct: 'a',
        explanation: 'Darum lohnt sich eine zentrale IP-Adressplanung (IPAM). Ein Re-IP ist aufwendig, NAT ist nur eine Übergangslösung mit Nebenwirkungen (Logging, Firewall-Regeln).',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Eine Bank nutzt AWS Direct Connect. Die Compliance verlangt **Verschlüsselung aller Daten auf dem Weg**. Was ist eine passende Lösung?',
        options: [
          { id: 'a', text: 'Ein Site-to-Site-IPsec-VPN über die Direct-Connect-Verbindung (oder MACsec, wo unterstützt)' },
          { id: 'b', text: 'Nichts – Direct Connect ist automatisch verschlüsselt.', whyWrong: 'Direct Connect ist eine private Leitung, aber standardmäßig unverschlüsselt. Wer auf der Strecke Zugriff hat, z. B. im Colocation-Rechenzentrum, könnte mitlesen. Für die Vorgabe „alles verschlüsselt“ braucht man zusätzlich ein IPsec-VPN über die Leitung oder MACsec.' },
          { id: 'c', text: 'Eine Security Group mit „encrypt=true“', whyWrong: 'Security Groups filtern Verkehr nach Ports und Adressen. Verschlüsseln können sie nicht, und eine Option „encrypt=true“ gibt es nicht. Verschlüsselung auf der Leitung erreicht man mit IPsec-VPN über Direct Connect oder MACsec.' },
          { id: 'd', text: 'Auf ein Internet-Gateway umsteigen', whyWrong: 'Ein Internet Gateway verschlüsselt ebenfalls nichts. Der Verkehr liefe dann über das öffentliche Internet statt über die private Leitung, also schlechter als vorher. Richtig ist, Direct Connect zu behalten und darüber ein IPsec-VPN zu legen.' },
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
          { id: 'c', text: 'Ein einzelner Azure Load Balancer in einer Region', whyWrong: 'Ein Azure Load Balancer ist regional und arbeitet auf Layer 4. Er sieht keine HTTP-Inhalte, kann also keine SQL-Injection erkennen (keine WAF). Fällt die Region aus, fällt er mit aus. Weltweit, mit Failover und WAF, bietet das Azure Front Door.' },
          { id: 'd', text: 'Ein Point-to-Site-VPN für alle Besucher', whyWrong: 'Besucher einer öffentlichen Website rufen sie einfach im Browser auf. Niemand installiert dafür einen VPN-Client. Point-to-Site-VPN dient Mitarbeitern für den Zugriff auf interne Netze. Für schnelle, geschützte Auslieferung sorgen Front Door und WAF.' },
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
