import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-01',
  track: 'network',
  order: 1,
  title: 'Netzwerk-Grundlagen',
  titleEn: 'Networking Fundamentals',
  summary: 'Was ein Netzwerk ist, wie man es aufbaut (Topologien), LAN vs. WAN und welche Geräte welche Aufgabe haben.',
  certs: ['ccna', 'netplus'],
  domains: { ccna: '1', netplus: '1' },
  lesson: [
    {
      heading: 'Was ist ein Netzwerk?',
      body: `Ein **Netzwerk** sind zwei oder mehr Geräte (Hosts/Endgeräte), die Daten austauschen. Dafür brauchen sie ein **Übertragungsmedium** (Kupferkabel, Glasfaser, Funk) und gemeinsame Regeln: **Protokolle**.

**Client** = fragt einen Dienst an (z. B. dein Browser). **Server** = stellt einen Dienst bereit (z. B. Webserver). Ein Gerät kann beides sein. Bei **Peer-to-Peer** sind alle gleichberechtigt.`,
      analogy: 'Ein Netzwerk ist wie das Postsystem: Häuser (Geräte), Straßen (Kabel/Funk) und Regeln, wie ein Brief adressiert sein muss (Protokolle).',
      terms: [
        { de: 'Endgerät', en: 'host / end device' },
        { de: 'Übertragungsmedium', en: 'transmission medium' },
        { de: 'Protokoll', en: 'protocol' },
      ],
    },
    {
      heading: 'Netzwerkarten nach Ausdehnung',
      body: `| Typ | Bedeutung | Beispiel |
|---|---|---|
| PAN | Personal Area Network | Bluetooth-Kopfhörer am Handy |
| LAN | Local Area Network | Büro, Wohnung, ein Gebäude |
| WLAN | Wireless LAN | WLAN im Büro |
| CAN | Campus Area Network | mehrere Gebäude einer Uni/Firma |
| MAN | Metropolitan Area Network | Stadtnetz |
| WAN | Wide Area Network | Verbindung zwischen Standorten, das Internet |

Ein **LAN** gehört meist dir selbst (eigene Kabel, hohe Bandbreite, geringe Kosten pro Bit). Ein **WAN** nutzt meist Leitungen eines Providers (ISP) und überbrückt große Entfernungen.`,
      terms: [{ de: 'Internetanbieter', en: 'Internet Service Provider (ISP)' }],
    },
    {
      heading: 'Topologien',
      body: `Die **physische Topologie** beschreibt die Verkabelung, die **logische** den Datenfluss.

- **Stern (Star):** Alle Geräte hängen an einem zentralen Switch. Standard im heutigen LAN. Fällt ein Kabel aus, ist nur ein Gerät betroffen; fällt der Switch aus, alle.
- **Bus:** Alle an einem gemeinsamen Kabel (altes 10BASE2-Ethernet). Ein Kabelbruch legt alles lahm.
- **Ring:** Daten laufen im Kreis (historisch Token Ring, heute noch in manchen Glasfaser-Ringen im Provider-Netz).
- **Vollvermascht (Full Mesh):** Jeder mit jedem. Maximale Redundanz, aber n·(n−1)/2 Verbindungen.
- **Teilvermascht (Partial Mesh):** Nur wichtige Knoten redundant verbunden – typisch im WAN.
- **Hybrid / erweiterter Stern:** Mehrere Sterne verbunden, z. B. Access-Switches an Core-Switches.

Im Rechenzentrum verbreitet: **Spine-Leaf** – jeder Leaf-Switch ist mit jedem Spine-Switch verbunden.`,
      analogy: 'Stern-Topologie = Flughafen-Drehkreuz: Alle Flüge gehen über den Hub. Fällt der Hub aus, steht alles.',
    },
    {
      heading: 'Die wichtigsten Geräte',
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Welches Gerät verbindet dein Heimnetz mit dem Internet (einem anderen Netz)?',
        options: [
          { id: 'a', text: 'Router' },
          { id: 'b', text: 'Switch', whyWrong: 'Der Switch verbindet Geräte innerhalb des Heimnetzes.' },
          { id: 'c', text: 'Access Point', whyWrong: 'Der AP bringt Geräte per Funk ins lokale Netz, verbindet aber keine Netze.' },
        ],
        correct: 'a',
        explanation: 'Verschiedene Netze verbindet der Router (Schicht 3).',
      },
      body: `- **Switch:** verbindet Geräte **innerhalb eines LANs**. Arbeitet auf Schicht 2 mit **MAC-Adressen** und lernt, an welchem Port welches Gerät hängt.
- **Router:** verbindet **verschiedene Netze** (z. B. LAN mit Internet). Arbeitet auf Schicht 3 mit **IP-Adressen** und entscheidet anhand der Routing-Tabelle.
- **Access Point (AP):** bindet WLAN-Clients ins kabelgebundene Netz ein.
- **Firewall:** filtert Verkehr nach Regeln (erlauben/verbieten). Moderne **Next-Generation Firewalls (NGFW)** erkennen auch Anwendungen.
- **Hub (veraltet):** sendet alles an alle Ports, eine Kollisionsdomäne – heute durch Switches ersetzt.
- **Modem/ONT:** wandelt Signale für die Provider-Leitung (DSL, Kabel, Glasfaser).

Der „WLAN-Router“ zuhause ist ein Kombigerät: Router + Switch + AP + Firewall + Modem in einem.`,
      analogy: 'Switch = Hausmeister, der jede Wohnung im Haus kennt. Router = Postverteilzentrum, das entscheidet, in welche Stadt ein Brief muss.',
      terms: [
        { de: 'Vermittlungsknoten', en: 'switch' },
        { de: 'Wegewahl', en: 'routing' },
        { de: 'Drahtloser Zugangspunkt', en: 'wireless access point' },
      ],
    },
    {
      heading: 'Bandbreite, Durchsatz, Latenz',
      body: `- **Bandbreite (bandwidth):** theoretische Maximalrate, z. B. 1 Gbit/s.
- **Durchsatz (throughput):** tatsächlich erreichte Rate.
- **Latenz (latency):** Verzögerung, gemessen in ms (z. B. mit \`ping\`).
- **Jitter:** Schwankung der Latenz – kritisch für Sprache/Video.

Achtung Einheiten: **Bit** (b) vs. **Byte** (B). 1 Byte = 8 Bit. 100 Mbit/s ≈ 12,5 MB/s.`,
      analogy: 'Bandbreite = Anzahl der Spuren einer Autobahn, Latenz = wie lange die Fahrt dauert, Jitter = mal Stau, mal frei.',
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welches Gerät verbindet **verschiedene Netzwerke** miteinander und trifft Weiterleitungsentscheidungen anhand von IP-Adressen?',
      options: [
        { id: 'a', text: 'Router' },
        { id: 'b', text: 'Switch', whyWrong: 'Ein (Layer-2-)Switch verbindet Geräte innerhalb eines Netzes anhand von MAC-Adressen.' },
        { id: 'c', text: 'Hub', whyWrong: 'Ein Hub verteilt Signale nur stumpf an alle Ports, er kennt keine Adressen.' },
        { id: 'd', text: 'Access Point', whyWrong: 'Ein AP bindet WLAN-Clients an, verbindet aber keine IP-Netze.' },
      ],
      correct: 'a',
      explanation: 'Router arbeiten auf Schicht 3 (Network Layer). Sie lesen die Ziel-IP-Adresse und schicken das Paket über die Routing-Tabelle ins richtige Netz.',
      analogy: 'Der Router ist das Postverteilzentrum: Es schaut auf Stadt und PLZ und entscheidet, welcher LKW den Brief bekommt.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Welche Topologie ist im modernen kabelgebundenen LAN Standard?',
      options: [
        { id: 'a', text: 'Stern (bzw. erweiterter Stern)' },
        { id: 'b', text: 'Bus', whyWrong: 'Bus-Topologien (z. B. 10BASE2-Koax) sind veraltet: Ein Kabelbruch legt das ganze Segment lahm.' },
        { id: 'c', text: 'Ring', whyWrong: 'Token Ring ist im LAN ausgestorben. Ringe gibt es noch im Provider-Glasfasernetz.' },
        { id: 'd', text: 'Vollvermascht', whyWrong: 'Full Mesh ist für Endgeräte viel zu teuer (n·(n−1)/2 Leitungen).' },
      ],
      correct: 'a',
      explanation: 'Jedes Endgerät hat ein eigenes Kabel zum Switch. Fehler betreffen nur einen Port, Erweitern ist einfach.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Wie viele Verbindungen braucht ein **vollvermaschtes** Netz mit 6 Routern?',
      options: [
        { id: 'a', text: '15' },
        { id: 'b', text: '30', whyWrong: '6·5 = 30 zählt jede Verbindung doppelt (A–B und B–A). Man muss durch 2 teilen.' },
        { id: 'c', text: '6', whyWrong: '6 Verbindungen ergeben nur einen Ring.' },
        { id: 'd', text: '36', whyWrong: '6² würde auch Verbindungen eines Routers zu sich selbst zählen.' },
      ],
      correct: 'a',
      explanation: 'Formel n·(n−1)/2 = 6·5/2 = 15.',
    },
    {
      id: 'q4', type: 'dragdrop', difficulty: 1,
      prompt: 'Ordne die Beispiele der passenden Netzwerkart zu.',
      items: [
        { id: 'i1', text: 'Smartwatch per Bluetooth am Handy' },
        { id: 'i2', text: 'Netzwerk im Büro einer Etage' },
        { id: 'i3', text: 'Verbindung Hamburg ↔ München über Provider' },
        { id: 'i4', text: 'Das Internet' },
        { id: 'i5', text: 'Drucker und PCs zu Hause am Switch' },
      ],
      buckets: [
        { id: 'pan', label: 'PAN' },
        { id: 'lan', label: 'LAN' },
        { id: 'wan', label: 'WAN' },
      ],
      solution: { i1: 'pan', i2: 'lan', i3: 'wan', i4: 'wan', i5: 'lan' },
      explanation: 'PAN = wenige Meter um eine Person. LAN = lokal, eigene Infrastruktur. WAN = große Distanzen, meist über Provider-Leitungen; das Internet ist das größte WAN.',
    },
    {
      id: 'q5', type: 'single', difficulty: 1,
      prompt: 'Mit welchen Adressen arbeitet ein klassischer **Layer-2-Switch**, um Frames weiterzuleiten?',
      options: [
        { id: 'a', text: 'MAC-Adressen' },
        { id: 'b', text: 'IP-Adressen', whyWrong: 'IP-Adressen sind Schicht 3 – das ist Aufgabe des Routers (oder eines Layer-3-Switches).' },
        { id: 'c', text: 'Portnummern', whyWrong: 'Portnummern (TCP/UDP) sind Schicht 4.' },
        { id: 'd', text: 'Hostnamen', whyWrong: 'Hostnamen werden per DNS in IP-Adressen aufgelöst; Switches kennen sie nicht.' },
      ],
      correct: 'a',
      explanation: 'Der Switch lernt die Quell-MAC jedes Frames und merkt sich den Port in der **MAC-Adresstabelle** (CAM-Tabelle). Danach leitet er gezielt nur an diesen Port weiter.',
      analogy: 'Wie ein Hausmeister, der sich merkt, in welcher Wohnung (Port) welcher Bewohner (MAC) wohnt.',
    },
    {
      id: 'q6', type: 'multi', difficulty: 2,
      prompt: 'Welche Funktionen stecken typischerweise in einem **Heim-„WLAN-Router“**? (Mehrere richtig)',
      options: [
        { id: 'a', text: 'Router (inkl. NAT)' },
        { id: 'b', text: 'Switch (LAN-Ports)' },
        { id: 'c', text: 'Access Point' },
        { id: 'd', text: 'DHCP-Server' },
        { id: 'e', text: 'Load Balancer für Rechenzentren', whyWrong: 'Rechenzentrums-Load-Balancer sind eigene Geräte/Dienste, nicht Teil eines Heimrouters.' },
      ],
      correct: ['a', 'b', 'c', 'd'],
      explanation: 'Heimrouter sind Kombigeräte: Router mit NAT, kleiner Switch, Access Point, DHCP-Server, oft auch Firewall und Modem.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Warum wurden **Hubs** durch Switches ersetzt?',
      options: [
        { id: 'a', text: 'Ein Hub sendet jeden Frame an alle Ports; alle Ports teilen sich eine Kollisionsdomäne.' },
        { id: 'b', text: 'Hubs können keine Glasfaser.', whyWrong: 'Das Medium war nicht der Grund – das Problem ist das Weiterleitungsverhalten.' },
        { id: 'c', text: 'Hubs arbeiten auf Schicht 3 und sind zu langsam.', whyWrong: 'Hubs arbeiten auf Schicht 1 (nur Signalverstärkung), nicht Schicht 3.' },
        { id: 'd', text: 'Hubs unterstützen keine IP-Adressen.', whyWrong: 'Hubs müssen keine IP-Adressen verstehen; auch Switches tun das (auf Layer 2) nicht.' },
      ],
      correct: 'a',
      explanation: 'Ein Hub ist ein Multiport-Repeater (Schicht 1). Alle Geräte teilen sich die Bandbreite und es kommt zu Kollisionen. Ein Switch hat pro Port eine eigene Kollisionsdomäne und arbeitet im Vollduplex.',
    },
    {
      id: 'q8', type: 'scenario', difficulty: 2,
      scenario: 'In einem Büro mit Stern-Topologie können plötzlich **alle 20 PCs** nicht mehr miteinander kommunizieren. Die PCs selbst funktionieren.',
      prompt: 'Was ist die wahrscheinlichste Ursache?',
      options: [
        { id: 'a', text: 'Der zentrale Switch ist ausgefallen.' },
        { id: 'b', text: 'Ein einzelnes Patchkabel ist defekt.', whyWrong: 'Ein defektes Kabel betrifft im Stern nur ein Gerät, nicht alle 20.' },
        { id: 'c', text: 'Der Internetanbieter hat eine Störung.', whyWrong: 'Eine ISP-Störung betrifft das Internet, nicht die Kommunikation der PCs untereinander im LAN.' },
        { id: 'd', text: 'Eine Netzwerkkarte ist defekt.', whyWrong: 'Eine defekte NIC betrifft nur den einen PC.' },
      ],
      correct: 'a',
      explanation: 'Der Switch ist im Stern der **Single Point of Failure**. Wenn alle betroffen sind, prüfst du zuerst die gemeinsame Komponente.',
    },
    {
      id: 'q9', type: 'single', difficulty: 1,
      prompt: 'Was beschreibt die **Latenz**?',
      options: [
        { id: 'a', text: 'Die Verzögerung, bis Daten beim Ziel ankommen' },
        { id: 'b', text: 'Die maximale Datenrate einer Leitung', whyWrong: 'Das ist die Bandbreite.' },
        { id: 'c', text: 'Die Schwankung der Verzögerung', whyWrong: 'Das ist Jitter.' },
        { id: 'd', text: 'Der Anteil verlorener Pakete', whyWrong: 'Das ist Paketverlust (packet loss).' },
      ],
      correct: 'a',
      explanation: 'Latenz wird in Millisekunden gemessen, z. B. als Round-Trip-Time (RTT) mit `ping`.',
      analogy: 'Latenz = Fahrzeit von A nach B, Bandbreite = Anzahl der Spuren.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Ein Download läuft mit **400 Mbit/s**. Wie viele **Megabyte pro Sekunde** sind das ungefähr?',
      options: [
        { id: 'a', text: '50 MB/s' },
        { id: 'b', text: '400 MB/s', whyWrong: 'Bit ≠ Byte. Du musst durch 8 teilen.' },
        { id: 'c', text: '3200 MB/s', whyWrong: 'Hier wurde mit 8 multipliziert statt geteilt.' },
        { id: 'd', text: '40 MB/s', whyWrong: 'Durch 10 geteilt – richtig ist durch 8.' },
      ],
      correct: 'a',
      explanation: '1 Byte = 8 Bit. 400 / 8 = 50 MB/s.',
    },
    {
      id: 'q11', type: 'topology', mode: 'fill', difficulty: 2,
      prompt: 'Vervollständige das kleine Firmennetz: Welche Geräte gehören an die mit ❓ markierten Stellen?',
      nodes: [
        { id: 'inet', kind: 'cloud', label: 'Internet', x: 50, y: 10 },
        { id: 'u1', kind: 'unknown', label: 'Gerät A', x: 50, y: 35 },
        { id: 'u2', kind: 'unknown', label: 'Gerät B', x: 50, y: 62 },
        { id: 'pc1', kind: 'pc', label: 'PC 1', x: 20, y: 88 },
        { id: 'pc2', kind: 'pc', label: 'PC 2', x: 50, y: 88 },
        { id: 'srv', kind: 'server', label: 'Fileserver', x: 80, y: 88 },
      ],
      links: [['inet', 'u1'], ['u1', 'u2'], ['u2', 'pc1'], ['u2', 'pc2'], ['u2', 'srv']],
      choices: ['router', 'switch', 'ap', 'server'],
      solution: { u1: 'router', u2: 'switch' },
      explanation: 'Zum Internet (anderes Netz) braucht man einen **Router**. Die lokalen Geräte hängen sternförmig an einem **Switch**.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Welche Topologie findet man typischerweise in modernen **Rechenzentren**, bei der jeder Access-Switch mit jedem Backbone-Switch verbunden ist?',
      options: [
        { id: 'a', text: 'Spine-Leaf' },
        { id: 'b', text: 'Bus', whyWrong: 'Bus ist veraltet und bietet keine Redundanz.' },
        { id: 'c', text: 'Ring', whyWrong: 'Ein Ring hat lange Wege und wenig Bandbreite pro Hop.' },
        { id: 'd', text: 'Punkt-zu-Punkt', whyWrong: 'Punkt-zu-Punkt verbindet nur zwei Geräte.' },
      ],
      correct: 'a',
      explanation: 'Bei Spine-Leaf ist jeder Server-Pfad gleich lang (Leaf → Spine → Leaf). Das ergibt vorhersehbare Latenz und gute Skalierung für Ost-West-Verkehr.',
    },
    {
      id: 'q13', type: 'single', difficulty: 1,
      prompt: 'Welches Gerät filtert Datenverkehr anhand von **Regeln** (erlauben/verbieten)?',
      options: [
        { id: 'a', text: 'Firewall' },
        { id: 'b', text: 'Access Point', whyWrong: 'Ein AP stellt Funkzugang bereit; Filterung ist nicht seine Hauptaufgabe.' },
        { id: 'c', text: 'Modem', whyWrong: 'Ein Modem wandelt nur Signale für die Leitung um.' },
        { id: 'd', text: 'Repeater', whyWrong: 'Ein Repeater verstärkt nur Signale (Schicht 1).' },
      ],
      correct: 'a',
      explanation: 'Firewalls prüfen Pakete/Verbindungen gegen ein Regelwerk. Stateful Firewalls merken sich Verbindungen, NGFWs erkennen zusätzlich Anwendungen und Bedrohungen.',
      analogy: 'Die Firewall ist der Türsteher mit Gästeliste.',
    },
    {
      id: 'q14', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu **Client** und **Server** sind richtig?',
      options: [
        { id: 'a', text: 'Ein Server stellt einen Dienst bereit.' },
        { id: 'b', text: 'Ein Client fordert einen Dienst an.' },
        { id: 'c', text: 'Ein Gerät kann gleichzeitig Client und Server sein.' },
        { id: 'd', text: 'Ein Server muss immer spezielle Server-Hardware sein.', whyWrong: '„Server“ ist eine Rolle (Software), keine Hardware. Auch ein Laptop kann einen Webserver betreiben.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Client/Server beschreibt Rollen. Ein PC kann Dateien freigeben (Server) und gleichzeitig im Web surfen (Client).',
    },
    {
      id: 'q15', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Begriffe zu.',
      items: [
        { id: 'i1', text: 'Maximale Rate einer Leitung' },
        { id: 'i2', text: 'Tatsächlich erreichte Rate' },
        { id: 'i3', text: 'Schwankung der Verzögerung' },
        { id: 'i4', text: 'Zeit bis zur Ankunft' },
      ],
      buckets: [
        { id: 'bw', label: 'Bandbreite' },
        { id: 'tp', label: 'Durchsatz' },
        { id: 'jit', label: 'Jitter' },
        { id: 'lat', label: 'Latenz' },
      ],
      solution: { i1: 'bw', i2: 'tp', i3: 'jit', i4: 'lat' },
      explanation: 'Bandbreite = Theorie, Durchsatz = Praxis, Latenz = Verzögerung, Jitter = deren Schwankung.',
    },
    {
      id: 'q16', type: 'single', difficulty: 3,
      prompt: 'Was unterscheidet die **physische** von der **logischen** Topologie?',
      options: [
        { id: 'a', text: 'Physisch = wie Kabel verlegt sind; logisch = wie die Daten fließen' },
        { id: 'b', text: 'Physisch = Schicht 3; logisch = Schicht 2', whyWrong: 'Topologien werden nicht so den OSI-Schichten zugeordnet.' },
        { id: 'c', text: 'Es gibt keinen Unterschied.', whyWrong: 'Beispiel: Ein Hub ist physisch ein Stern, logisch aber ein Bus.' },
        { id: 'd', text: 'Physisch = WLAN; logisch = Kabel', whyWrong: 'Beide Begriffe gelten für jede Art von Medium.' },
      ],
      correct: 'a',
      explanation: 'Klassisches Beispiel: Ein Hub ist **physisch ein Stern**, weil alle Kabel zum Hub gehen. **Logisch ist er ein Bus**, weil jedes Signal bei allen ankommt.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        scenario: 'Eine Firma hat zwei Standorte (Berlin und Köln). In jedem Standort hängen die PCs an einem Switch. Die Standorte sollen über eine Provider-Leitung verbunden werden.',
        prompt: 'Welches Gerät brauchst du **mindestens** an jedem Standort zusätzlich?',
        options: [
          { id: 'a', text: 'Einen Router' },
          { id: 'b', text: 'Einen zweiten Switch', whyWrong: 'Ein Switch verbindet nur innerhalb desselben Netzes. Für zwei Standorte (verschiedene Netze) braucht es Routing.' },
          { id: 'c', text: 'Einen Access Point', whyWrong: 'WLAN löst nicht die Verbindung zwischen den Standorten.' },
          { id: 'd', text: 'Einen Hub', whyWrong: 'Ein Hub kann nicht zwischen Netzen vermitteln.' },
        ],
        correct: 'a',
        explanation: 'Zwei Standorte = zwei IP-Netze, verbunden über ein WAN. Die Weiterleitung zwischen Netzen ist Aufgabe des Routers.',
      },
      {
        id: 'b2', type: 'topology', mode: 'click', difficulty: 3,
        prompt: 'Welche Geräte sind in diesem Netz ein **Single Point of Failure** für die Internetverbindung **aller** PCs?',
        nodes: [
          { id: 'inet', kind: 'cloud', label: 'Internet', x: 50, y: 8 },
          { id: 'fw', kind: 'firewall', label: 'Firewall', x: 50, y: 30 },
          { id: 'core', kind: 'switch', label: 'Core-Switch', x: 50, y: 52 },
          { id: 'sw1', kind: 'switch', label: 'Switch Etage 1', x: 25, y: 72 },
          { id: 'sw2', kind: 'switch', label: 'Switch Etage 2', x: 75, y: 72 },
          { id: 'pc1', kind: 'pc', label: 'PC 1', x: 15, y: 92 },
          { id: 'pc2', kind: 'pc', label: 'PC 2', x: 35, y: 92 },
          { id: 'pc3', kind: 'pc', label: 'PC 3', x: 65, y: 92 },
          { id: 'pc4', kind: 'pc', label: 'PC 4', x: 85, y: 92 },
        ],
        links: [['inet', 'fw'], ['fw', 'core'], ['core', 'sw1'], ['core', 'sw2'], ['sw1', 'pc1'], ['sw1', 'pc2'], ['sw2', 'pc3'], ['sw2', 'pc4']],
        correct: ['fw', 'core'],
        explanation: 'Firewall und Core-Switch liegen auf dem Weg **aller** PCs ins Internet. Fällt ein Etagen-Switch aus, ist nur eine Etage betroffen.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Ein Netz soll 4 Standorte **teilvermascht** verbinden: Die Zentrale mit allen, zusätzlich eine direkte Leitung zwischen zwei Filialen. Wie viele WAN-Leitungen sind das?',
        options: [
          { id: 'a', text: '4' },
          { id: 'b', text: '6', whyWrong: '6 wäre vollvermascht (4·3/2).' },
          { id: 'c', text: '3', whyWrong: '3 Leitungen wären nur der Stern Zentrale ↔ Filialen ohne die Zusatzleitung.' },
          { id: 'd', text: '5', whyWrong: 'Nachzählen: 3 Leitungen zur Zentrale + 1 zusätzliche = 4.' },
        ],
        correct: 'a',
        explanation: 'Zentrale ↔ 3 Filialen = 3 Leitungen, plus 1 direkte Filial-Leitung = 4.',
      },
      {
        id: 'b4', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen über **Switches** im Vergleich zu **Hubs** sind korrekt?',
        options: [
          { id: 'a', text: 'Jeder Switch-Port ist eine eigene Kollisionsdomäne.' },
          { id: 'b', text: 'Switches lernen MAC-Adressen und leiten gezielt weiter.' },
          { id: 'c', text: 'Switch-Ports können Vollduplex betreiben.' },
          { id: 'd', text: 'Switches trennen Broadcast-Domänen standardmäßig.', whyWrong: 'Ohne VLANs leitet ein Switch Broadcasts an alle Ports weiter. Broadcast-Domänen trennen Router (oder VLANs).' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Switches trennen Kollisionsdomänen, aber **nicht** Broadcast-Domänen (ohne VLANs). Das ist eine klassische Prüfungsfalle.',
      },
      {
        id: 'b5', type: 'scenario', difficulty: 2,
        scenario: 'Ein Kunde beschwert sich: „Ich habe eine 1-Gbit/s-Leitung, aber Downloads laufen nur mit ca. 110 MB/s.“',
        prompt: 'Was antwortest du?',
        options: [
          { id: 'a', text: 'Das ist nahezu das Maximum: 1 Gbit/s ÷ 8 = 125 MB/s, abzüglich Protokoll-Overhead.' },
          { id: 'b', text: 'Die Leitung ist defekt, sie sollte 1000 MB/s liefern.', whyWrong: 'Hier werden Bit und Byte verwechselt: 1000 Mbit/s sind nur 125 MB/s.' },
          { id: 'c', text: 'Die Latenz ist zu hoch.', whyWrong: 'Die Rate liegt schon fast am Maximum. Latenz ist hier nicht das Problem.' },
          { id: 'd', text: 'Er braucht einen Hub.', whyWrong: 'Ein Hub würde die Lage verschlechtern.' },
        ],
        correct: 'a',
        explanation: '1000 Mbit/s ÷ 8 = 125 MB/s brutto. Header von Ethernet, IP und TCP kosten einige Prozent. ~110–118 MB/s sind normal.',
      },
      {
        id: 'b6', type: 'single', difficulty: 3,
        prompt: 'Ein Hub mit 8 angeschlossenen PCs bildet wie viele **Kollisionsdomänen**?',
        options: [
          { id: 'a', text: '1' },
          { id: 'b', text: '8', whyWrong: '8 Kollisionsdomänen hätte ein Switch mit 8 belegten Ports.' },
          { id: 'c', text: '0', whyWrong: 'Bei Halbduplex-Shared-Media gibt es immer mindestens eine Kollisionsdomäne.' },
          { id: 'd', text: '2', whyWrong: 'Ein Hub teilt nichts auf.' },
        ],
        correct: 'a',
        explanation: 'Alle Ports eines Hubs teilen sich ein Medium, also genau **eine** Kollisionsdomäne (und eine Broadcast-Domäne).',
      },
    ],
  },
};

export default level;
