import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-01',
  track: 'network',
  order: 1,
  title: 'Netzwerk-Grundlagen',
  titleEn: 'Networking Fundamentals',
  summary: 'Was ein Netzwerk ist, wie man es aufbaut (Topologien), LAN vs. WAN und welche Geräte welche Aufgabe haben.',
  certs: ['ccna', 'netplus', 'fisi'],
  domains: { ccna: '1', netplus: '1', fisi: 'ap1' },
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
      heading: 'Bits und Bytes: die Sprache der Computer',
      body: `Computer kennen nur zwei Zustände: Strom an oder aus, Licht an oder aus. Das schreibt man als **1** und **0**. Eine solche Stelle heißt **Bit** (binary digit, Binärziffer). Alles, was durchs Netz geht – Text, Bilder, Videos, Sprache – ist am Ende eine lange Kette aus Nullen und Einsen.

- **8 Bit = 1 Byte.** Ein Byte reicht für einen einfachen Buchstaben, z. B. „A“ = \`01000001\`.
- Größere Mengen: Kilobyte (kB), Megabyte (MB), Gigabyte (GB), Terabyte (TB). Jede Stufe ist rund 1000-mal größer als die vorige.

**Wichtig:** Geschwindigkeiten im Netz werden in **Bit pro Sekunde** angegeben (Mbit/s, Gbit/s), Dateigrößen in **Byte** (MB, GB). Eine 100-Mbit/s-Leitung lädt darum höchstens etwa **12,5 MB pro Sekunde** (100 ÷ 8).

| Schreibweise | Bedeutung |
|---|---|
| b (klein) | Bit |
| B (groß) | Byte |
| Mbit/s oder Mbps | Megabit pro Sekunde |
| MB/s | Megabyte pro Sekunde |

Kleines Detail: Genau genommen ist 1 kB = 1000 Byte, aber 1 KiB (Kibibyte) = 1024 Byte. Darum zeigt Windows bei einer „1-TB-Festplatte“ nur etwa 931 „GB“ an: Es rechnet in Gibibyte.`,
      analogy: 'Wie Morsezeichen: Aus nur „kurz“ und „lang“ lassen sich alle Buchstaben bilden. Computer machen dasselbe mit 0 und 1.',
      terms: [
        { de: 'Bit (Binärziffer)', en: 'bit (binary digit)' },
        { de: 'Byte (8 Bit)', en: 'byte' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 1,
        prompt: 'Deine Internetleitung hat 400 Mbit/s. Wie viele Megabyte pro Sekunde kannst du höchstens herunterladen?',
        options: [
          { id: 'a', text: '50 MB/s' },
          { id: 'b', text: '400 MB/s', whyWrong: 'Hier wurden Bit und Byte gleichgesetzt. Die Leitung wird in Megabit pro Sekunde angegeben, Dateien in Megabyte. Ein Byte besteht aus 8 Bit, also passen in 400 Mbit nur 400 ÷ 8 = 50 MB. 400 MB/s bräuchte eine Leitung mit 3,2 Gbit/s.' },
          { id: 'c', text: '3200 MB/s', whyWrong: 'Hier wurde mit 8 multipliziert statt geteilt. Von Bit zu Byte wird die Zahl kleiner, weil ein Byte 8 Bit zusammenfasst: 400 Mbit/s ÷ 8 = 50 MB/s. 3200 MB/s wären 25,6 Gbit/s, das schafft keine Heimleitung.' },
        ],
        correct: 'a',
        explanation: '400 Mbit/s ÷ 8 = 50 MB/s. In der Praxis etwas weniger, weil auch Header und Protokolle Platz brauchen.',
      },
    },
    {
      heading: 'Adressen: Wie findet eine Nachricht ihr Ziel?',
      body: `Damit Daten beim richtigen Gerät und im richtigen Programm ankommen, braucht es Adressen – wie bei der Post.

| Adresse | Beispiel | wie bei der Post |
|---|---|---|
| **IP-Adresse** | 192.168.1.20 | Postanschrift: findet das Gerät, auch über das Internet |
| **MAC-Adresse** | 3C:22:FB:1A:9E:07 | Name am Briefkasten: nur im eigenen lokalen Netz |
| **Port** | 443 | Wohnungsnummer: findet das richtige Programm |
| **DNS-Name** | www.beispiel.de | Telefonbuch-Eintrag: wird in eine IP übersetzt |

- Die **IP-Adresse** hängt davon ab, in welchem Netz du gerade bist. Im WLAN zuhause hat dein Handy eine andere IP als im Büro. Meist vergibt sie der Router automatisch (**DHCP**).
- Die **MAC-Adresse** ist fest in der Netzwerkkarte gespeichert. Handys nutzen aus Datenschutzgründen oft pro WLAN eine zufällige MAC.
- Ein Gerät kann viele Programme gleichzeitig im Netz haben. Die **Ports** halten sie auseinander.

Alle vier lernst du in eigenen Leveln genau kennen: MAC in A3, IP in A4 und A5, DNS und DHCP in A8, Ports in A9.`,
      analogy: 'Ein Paket an „Max Muster, Hauptstraße 5, Wohnung 3“: Die Straße und Hausnummer sind die IP-Adresse, die Wohnung ist der Port. Der Postbote im Haus kennt die Briefkästen – das ist die MAC-Adresse.',
      terms: [
        { de: 'IP-Adresse', en: 'IP address' },
        { de: 'Hardware-Adresse', en: 'MAC address' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 1,
        prompt: 'Welche Adresse braucht dein PC, um einen Server in einem anderen Netz (z. B. im Internet) zu erreichen?',
        options: [
          { id: 'a', text: 'Die IP-Adresse des Servers' },
          { id: 'b', text: 'Die MAC-Adresse des Servers', whyWrong: 'Die MAC-Adresse gilt nur im eigenen lokalen Netz (Schicht 2). Ein Paket ins Internet geht erst an deinen Router, und der setzt bei jedem Weiterleiten neue MAC-Adressen ein. Die MAC-Adresse des fernen Servers bekommt dein PC nie zu sehen. Was über alle Netze gleich bleibt, ist die IP-Adresse.' },
          { id: 'c', text: 'Nur den Port 443', whyWrong: 'Der Port (z. B. 443 für HTTPS) sagt nur, welches Programm auf dem Zielgerät die Daten bekommt. Er sagt nicht, welches Gerät gemeint ist. Ohne IP-Adresse weiß kein Router, wohin das Paket soll. Port und IP gehören zusammen, wie Wohnungsnummer und Hausanschrift.' },
        ],
        correct: 'a',
        explanation: 'Über Netzgrenzen hinweg zählt die IP-Adresse. Die MAC-Adresse braucht es nur für den nächsten Schritt im lokalen Netz.',
      },
    },
    {
      heading: 'Was passiert, wenn du eine Webseite öffnest?',
      diagram: 'web-request',
      body: `Klicke dich mit ▶ durch die Animation oder drücke „Abspielen“. Das ist der Weg, den jede Webseite nimmt.

Was du dabei schon kennenlernst:
- **DNS** übersetzt den Namen in eine IP-Adresse (A8).
- Der **Switch** verbindet die Geräte in deinem Netz (A3, A6).
- Der **Router** verbindet dein Netz mit anderen Netzen, hier dem Internet (A7).
- **TCP** sorgt dafür, dass alle Pakete vollständig und in der richtigen Reihenfolge ankommen (A9).

Große Daten werden nie am Stück geschickt, sondern in viele kleine **Pakete** zerlegt. Jedes Paket trägt Absender und Ziel und kann einzeln weitergeleitet werden.`,
      terms: [{ de: 'Datenpaket', en: 'packet' }],
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
      heading: 'Netzwerkarchitekturen: 2-Tier, 3-Tier, Spine-Leaf, SOHO',
      body: `Firmennetze sind in **Schichten (tiers)** aufgebaut. Jede Schicht hat eine klare Aufgabe:

| Schicht | Englisch | Aufgabe |
|---|---|---|
| Zugang | **Access** | Endgeräte anschließen (PCs, Telefone, APs), PoE, Port Security |
| Verteilung | **Distribution** | Access-Switches bündeln, Routing zwischen VLANs, Richtlinien (ACLs) |
| Kern | **Core** | nur schnelles Weiterleiten zwischen Gebäuden/Bereichen, hochverfügbar, keine Filter |

- **3-Tier (Three-Tier):** Access, Distribution und Core getrennt. Für große Campus-Netze mit mehreren Gebäuden.
- **2-Tier / Collapsed Core:** Distribution und Core sind **zusammengelegt**. Spart Geräte, typisch für mittlere Firmen oder ein einzelnes Gebäude.
- **Spine-Leaf:** im Rechenzentrum. Server hängen an **Leaf**-Switches, jeder Leaf ist mit **jedem Spine** verbunden. Leafs sind nie direkt verbunden, Spines auch nicht. Jeder Weg Server → Server ist gleich lang (Leaf → Spine → Leaf). Gut für viel **Ost-West-Verkehr** (Server zu Server). **Nord-Süd-Verkehr** geht dagegen in das Rechenzentrum hinein oder heraus.
- **SOHO (Small Office/Home Office):** ein Kombigerät (Router, Switch, WLAN, Firewall) für wenige Nutzer.
- **On-Premises vs. Cloud:** On-Premises steht die Technik im eigenen Gebäude. In der Cloud mietest du sie beim Anbieter (Teil B). Viele Firmen mischen beides (**hybrid**).
- **WAN:** verbindet Standorte über Provider-Leitungen, VPN oder SD-WAN (siehe A12).`,
      analogy: 'Das 3-Tier-Modell ist wie ein Straßennetz: Access = Wohnstraßen zu jedem Haus, Distribution = Hauptstraßen eines Stadtteils (mit Ampeln = Regeln), Core = Autobahn ohne Ampeln, nur schnell.',
      terms: [
        { de: 'Zugangsschicht', en: 'access layer' },
        { de: 'Verteilungsschicht', en: 'distribution layer' },
        { de: 'Kernschicht', en: 'core layer' },
        { de: 'zusammengelegter Kern', en: 'collapsed core' },
        { de: 'Ost-West-Verkehr', en: 'east-west traffic' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 1,
        prompt: 'Ein mittelgroßes Unternehmen in einem Gebäude legt Core- und Distribution-Schicht auf dieselben Switches. Wie heißt das?',
        options: [
          { id: 'a', text: 'Collapsed Core (2-Tier)' },
          { id: 'b', text: 'Spine-Leaf', whyWrong: 'Spine-Leaf ist ein Design für Rechenzentren: Jeder Leaf-Switch hängt an jedem Spine-Switch, damit Server untereinander schnell und gleich weit voneinander entfernt sind. Es beschreibt nicht das Zusammenlegen von Core und Distribution in einem Firmengebäude.' },
          { id: 'c', text: '3-Tier', whyWrong: 'Beim 3-Tier-Modell sind Access, Distribution und Core drei getrennte Schichten mit eigenen Geräten. Das lohnt sich bei großen Campus-Netzen mit vielen Gebäuden. Legt man Core und Distribution zusammen, bleiben nur zwei Schichten: Das ist der Collapsed Core (2-Tier).' },
        ],
        correct: 'a',
        explanation: 'Beim Collapsed Core (2-Tier) übernimmt eine Geräteschicht Core- und Distribution-Aufgaben.',
      },
    },
    {
      heading: 'Die wichtigsten Geräte',
      diagram: 'devices',
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Welches Gerät verbindet dein Heimnetz mit dem Internet (einem anderen Netz)?',
        options: [
          { id: 'a', text: 'Router' },
          { id: 'b', text: 'Switch', whyWrong: 'Ein Switch verbindet Geräte innerhalb desselben Netzes, z. B. PC, Drucker und Fernseher zuhause. Er arbeitet mit MAC-Adressen auf Schicht 2 und kann Pakete nicht in ein anderes Netz wie das Internet weiterleiten. Dafür braucht es einen Router, der mit IP-Adressen arbeitet.' },
          { id: 'c', text: 'Access Point', whyWrong: 'Ein Access Point bringt Geräte per Funk ins lokale Netz. Er ist praktisch ein Switch ohne Kabel und bleibt im selben Netz. Die Verbindung in ein anderes Netz, hier das Internet, schafft erst der Router. Im Heim-WLAN-Router stecken beide Geräte in einem Gehäuse, darum verwechselt man sie leicht.' },
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
- **Layer-3-Switch:** Switch, der zusätzlich routen kann. Verbindet im Firmennetz die VLANs untereinander, schneller als ein Router.
- **WLAN-Controller (WLC):** verwaltet viele Access Points zentral (Kanäle, Sendeleistung, SSIDs).
- **IDS/IPS:** erkennt Angriffe im Verkehr. Ein **IDS** meldet nur, ein **IPS** blockiert auch.
- **Endgeräte (endpoints):** PCs, Handys, Drucker, IoT-Geräte. **Server** stellen Dienste bereit (Web, Datei, E-Mail).

Der „WLAN-Router“ zuhause ist ein Kombigerät: Router + Switch + AP + Firewall + Modem in einem.`,
      analogy: 'Switch = Hausmeister, der jede Wohnung im Haus kennt. Router = Postverteilzentrum, das entscheidet, in welche Stadt ein Brief muss.',
      terms: [
        { de: 'Vermittlungsknoten', en: 'switch' },
        { de: 'Wegewahl', en: 'routing' },
        { de: 'Drahtloser Zugangspunkt', en: 'wireless access point' },
      ],
    },
    {
      heading: 'Netzwerkpläne lesen: die Symbole',
      diagram: 'network-symbols',
      body: `Admins zeichnen Netzwerke als **Plan** (Topologie-Diagramm). Statt Fotos nutzen sie einfache Symbole. Diese Symbole siehst du in Prüfungen, Dokumentationen und in den Fragen dieser App.

- Ein **physischer Plan** zeigt echte Kabel und Ports: Welcher PC hängt an welchem Switch-Port, wo steht welcher Schrank?
- Ein **logischer Plan** zeigt Netze und Adressen: Welche Geräte sind im selben Netz, welche IP-Bereiche gibt es?

Ein ganz einfacher Plan eines kleinen Büros:
\`\`\`
[PC]    [PC]    [Drucker]
   \\     |      /
    [  Switch  ]
         |
     [ Router ]
         |
    ( Internet )
\`\`\`
Die Linien sind Kabel. Alle Geräte am Switch bilden zusammen ein **LAN**. Der Router verbindet es mit dem Internet.`,
      terms: [{ de: 'Netzwerkplan', en: 'network diagram' }],
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
      id: 'q19', type: 'single', difficulty: 1,
      prompt: 'Wie viele Bit hat ein Byte?',
      options: [
        { id: 'a', text: '8' },
        { id: 'b', text: '4', whyWrong: '4 Bit sind nur ein halbes Byte, auch Nibble genannt. Ein Nibble passt genau zu einer Hexadezimalziffer (0–F), darum begegnet es dir bei MAC- und IPv6-Adressen. Ein ganzes Byte hat 8 Bit und damit 256 mögliche Werte (0–255).' },
        { id: 'c', text: '10', whyWrong: 'Computer rechnen im Zweiersystem, nicht im Zehnersystem. Ein Byte hat darum 8 Bit (eine Zweierpotenz: 2³). 10 Bit gibt es als Byte-Größe nicht. Mit 8 Bit lassen sich 2⁸ = 256 Werte darstellen, z. B. eine Zahl von 0 bis 255 in einer IPv4-Adresse.' },
        { id: 'd', text: '1024', whyWrong: '1024 ist keine Bitzahl, sondern die Anzahl Byte in einem Kibibyte (KiB = 2¹⁰ Byte). Ein einzelnes Byte hat nur 8 Bit. Die Verwechslung kommt daher, dass 1024 in der Computerwelt oft auftaucht.' },
      ],
      correct: 'a',
      explanation: '1 Byte = 8 Bit. Darum teilt man Mbit/s durch 8, um MB/s zu erhalten.',
    },
    {
      id: 'q20', type: 'dragdrop', difficulty: 1,
      prompt: 'Was für eine Adresse ist das?',
      items: [
        { id: 'ip4', text: '192.168.0.15' },
        { id: 'mac1', text: '00:1A:2B:3C:4D:5E' },
        { id: 'port', text: '443' },
        { id: 'name', text: 'www.beispiel.de' },
        { id: 'ip6', text: '2001:db8::1' },
        { id: 'mac2', text: 'a4-83-e7-12-0f-9b' },
      ],
      buckets: [
        { id: 'ip', label: 'IP-Adresse' },
        { id: 'mac', label: 'MAC-Adresse' },
        { id: 'port', label: 'Port' },
        { id: 'dns', label: 'DNS-Name' },
      ],
      solution: { ip4: 'ip', ip6: 'ip', mac1: 'mac', mac2: 'mac', port: 'port', name: 'dns' },
      explanation: 'IPv4: vier Zahlen mit Punkten. IPv6: Hexadezimal-Blöcke mit Doppelpunkten. MAC: sechs Hex-Paare (mit : oder -). Port: eine Zahl von 0 bis 65535. DNS-Name: lesbarer Name.',
    },
    {
      id: 'q21', type: 'ordering', difficulty: 1,
      prompt: 'Bringe in die richtige Reihenfolge: Du öffnest eine Webseite.',
      items: [
        { id: 'type', text: 'Du gibst www.beispiel.de im Browser ein.' },
        { id: 'dns', text: 'Ein DNS-Server liefert die IP-Adresse des Webservers.' },
        { id: 'gw', text: 'Dein PC schickt das Paket zu seinem Router (Default Gateway).' },
        { id: 'net', text: 'Router im Internet leiten das Paket bis zum Webserver weiter.' },
        { id: 'reply', text: 'Der Webserver schickt die Seite zurück, der Browser zeigt sie an.' },
      ],
      explanation: 'Name → IP (DNS) → zum eigenen Router → durchs Internet → Antwort zurück.',
    },
    {
      id: 'q17', type: 'single', difficulty: 2,
      prompt: 'In welcher Schicht des 3-Tier-Modells werden Endgeräte angeschlossen und Funktionen wie PoE und Port Security bereitgestellt?',
      options: [
        { id: 'a', text: 'Access' },
        { id: 'b', text: 'Distribution', whyWrong: 'Die Distribution-Schicht sammelt viele Access-Switches ein und setzt dort Regeln um: Routing zwischen VLANs, ACLs und Redundanz. Endgeräte werden dort normalerweise nicht angesteckt, weil die teuren Distribution-Ports für Uplinks gedacht sind. PoE und Port Security gehören an den Access-Port, wo PC, Telefon und Kamera hängen.' },
        { id: 'c', text: 'Core', whyWrong: 'Der Core ist das schnelle Rückgrat des Netzes und soll nur Daten zwischen den Distribution-Blöcken weiterleiten. Dort hängen keine Endgeräte, und es laufen möglichst wenige Zusatzfunktionen, damit nichts bremst. PoE und Port Security gibt es an der Access-Schicht.' },
      ],
      correct: 'a',
      explanation: 'Die Access-Schicht ist der Anschlusspunkt für Endgeräte. Dort sitzen PoE für Telefone und APs sowie Port Security.',
    },
    {
      id: 'q18', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Geräte ihrer Aufgabe zu.',
      items: [
        { id: 'i1', text: 'verwaltet 50 Access Points zentral' },
        { id: 'i2', text: 'blockiert erkannte Angriffe im Datenstrom' },
        { id: 'i3', text: 'routet zwischen VLANs im Firmennetz' },
        { id: 'i4', text: 'meldet verdächtigen Verkehr nur' },
      ],
      buckets: [
        { id: 'wlc', label: 'WLC' },
        { id: 'ips', label: 'IPS' },
        { id: 'l3', label: 'Layer-3-Switch' },
        { id: 'ids', label: 'IDS' },
      ],
      solution: { i1: 'wlc', i2: 'ips', i3: 'l3', i4: 'ids' },
      explanation: 'WLC = zentrale AP-Verwaltung. IPS blockiert, IDS meldet nur. Ein Layer-3-Switch routet zwischen VLANs.',
    },
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welches Gerät verbindet **verschiedene Netzwerke** miteinander und trifft Weiterleitungsentscheidungen anhand von IP-Adressen?',
      options: [
        { id: 'a', text: 'Router' },
        { id: 'b', text: 'Switch', whyWrong: 'Ein klassischer Switch (Layer 2) verbindet Geräte innerhalb eines Netzes und entscheidet anhand der MAC-Adresse. IP-Adressen und andere Netze kennt er nicht. Nur ein Layer-3-Switch kann zusätzlich routen, die Frage zielt aber auf das Gerät, dessen Kernaufgabe das Verbinden von Netzen ist: den Router.' },
        { id: 'c', text: 'Hub', whyWrong: 'Ein Hub ist ein reiner Signalverteiler auf Schicht 1. Er kennt weder MAC- noch IP-Adressen und schickt alles, was ankommt, an alle anderen Ports. Er kann darum weder Netze verbinden noch Weiterleitungsentscheidungen treffen.' },
        { id: 'd', text: 'Access Point', whyWrong: 'Ein Access Point bindet WLAN-Geräte in ein bestehendes Netz ein. Er arbeitet wie ein Switch auf Schicht 2 und bleibt im selben IP-Netz. Verschiedene IP-Netze verbindet er nicht. Das erledigt der Router.' },
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
        { id: 'b', text: 'Bus', whyWrong: 'Beim Bus hängen alle Geräte an einem gemeinsamen Kabel (z. B. altes Koax-Ethernet 10BASE2). Ein einziger Kabelbruch oder ein fehlender Abschlusswiderstand legt das ganze Segment lahm, und alle teilen sich die Bandbreite. Darum ist der Bus seit den 1990ern durch den Stern mit Switch ersetzt.' },
        { id: 'c', text: 'Ring', whyWrong: 'Im Ring wird jedes Gerät mit zwei Nachbarn verbunden (früher Token Ring). Fällt ein Gerät oder Kabel aus, ist der Ring unterbrochen, und neue Geräte einzufügen ist umständlich. Im LAN ist das ausgestorben. Ringe findest du heute nur noch bei Provider-Glasfasernetzen mit Schutzumschaltung.' },
        { id: 'd', text: 'Vollvermascht', whyWrong: 'Vollvermascht heißt: jedes Gerät hat eine eigene Leitung zu jedem anderen. Das sind n·(n−1)/2 Leitungen, bei 50 PCs schon 1225 Kabel und je 49 Netzwerkkarten pro PC. Für Endgeräte ist das unbezahlbar. Vollvermaschung nutzt man nur zwischen wenigen wichtigen Routern.' },
      ],
      correct: 'a',
      explanation: 'Jedes Endgerät hat ein eigenes Kabel zum Switch. Fehler betreffen nur einen Port, Erweitern ist einfach.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Wie viele Verbindungen braucht ein **vollvermaschtes** Netz mit 6 Routern?',
      options: [
        { id: 'a', text: '15' },
        { id: 'b', text: '30', whyWrong: '6·5 = 30 zählt jede Leitung doppelt: einmal von A nach B und einmal von B nach A. Eine Leitung verbindet aber immer zwei Router gleichzeitig. Darum teilt man durch 2: 6·5/2 = 15.' },
        { id: 'c', text: '6', whyWrong: '6 Leitungen reichen nur für einen Ring, in dem jeder Router zwei Nachbarn hat. Vollvermascht heißt: jeder Router ist direkt mit jedem anderen verbunden, also mit 5 anderen. Das ergibt n·(n−1)/2 = 15 Leitungen.' },
        { id: 'd', text: '36', whyWrong: '6² = 36 zählt auch Leitungen eines Routers zu sich selbst und jede Verbindung doppelt. Richtig ist die Formel n·(n−1)/2: Jeder der 6 Router hat 5 Partner, und jede Leitung gehört zu zwei Routern. 6·5/2 = 15.' },
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
        { id: 'b', text: 'IP-Adressen', whyWrong: 'IP-Adressen gehören zu Schicht 3 (Vermittlung). Mit ihnen entscheidet der Router, in welches Netz ein Paket geht. Ein klassischer Layer-2-Switch schaut nur in den Ethernet-Rahmen und dort auf die MAC-Adresse. Erst ein Layer-3-Switch wertet zusätzlich IP-Adressen aus.' },
        { id: 'c', text: 'Portnummern', whyWrong: 'Portnummern (TCP/UDP) gehören zu Schicht 4 und sagen, welches Programm auf dem Zielgerät die Daten bekommt, z. B. 443 für HTTPS. Ein Layer-2-Switch schaut so tief nicht in die Daten. Nicht verwechseln: Die Anschlüsse am Switch heißen auch Ports, haben aber nichts mit TCP/UDP-Ports zu tun.' },
        { id: 'd', text: 'Hostnamen', whyWrong: 'Hostnamen wie pc-buero01 werden per DNS in IP-Adressen übersetzt. Das ist Sache der Anwendung (Schicht 7). Ein Switch sieht nur die MAC-Adressen in den Ethernet-Rahmen, Namen kennt er nicht.' },
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
        { id: 'e', text: 'Load Balancer für Rechenzentren', whyWrong: 'Ein Load Balancer für Rechenzentren verteilt Anfragen auf viele Server, z. B. für einen großen Webshop. Das ist ein eigenes Gerät oder ein Cloud-Dienst und gehört nicht in einen Heimrouter. Im Heimrouter stecken Router mit NAT, ein kleiner Switch, ein Access Point und ein DHCP-Server, oft auch Modem und Firewall.' },
      ],
      correct: ['a', 'b', 'c', 'd'],
      explanation: 'Heimrouter sind Kombigeräte: Router mit NAT, kleiner Switch, Access Point, DHCP-Server, oft auch Firewall und Modem.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Warum wurden **Hubs** durch Switches ersetzt?',
      options: [
        { id: 'a', text: 'Ein Hub sendet jeden Frame an alle Ports; alle Ports teilen sich eine Kollisionsdomäne.' },
        { id: 'b', text: 'Hubs können keine Glasfaser.', whyWrong: 'Hubs gab es für Kupfer, und das Medium war nicht das Problem. Entscheidend ist das Verhalten: Ein Hub schickt jedes Signal an alle Ports. Alle Geräte teilen sich so die Bandbreite und stören sich gegenseitig durch Kollisionen. Ein Switch leitet gezielt nur an den Zielport weiter.' },
        { id: 'c', text: 'Hubs arbeiten auf Schicht 3 und sind zu langsam.', whyWrong: 'Hubs arbeiten auf Schicht 1, nicht auf Schicht 3. Sie verstärken und verteilen nur elektrische Signale, ohne irgendetwas auszuwerten. Langsam sind sie, weil sich alle Ports eine Kollisionsdomäne und die Bandbreite teilen und nur Halbduplex möglich ist.' },
        { id: 'd', text: 'Hubs unterstützen keine IP-Adressen.', whyWrong: 'IP-Adressen müssen weder Hubs noch klassische Switches verstehen: Beide arbeiten unterhalb von Schicht 3. Der Grund für den Ersatz war, dass ein Hub jeden Frame an alle Ports schickt. Ein Switch lernt MAC-Adressen und leitet gezielt weiter.' },
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
        { id: 'b', text: 'Ein einzelnes Patchkabel ist defekt.', whyWrong: 'In einer Sterntopologie hat jedes Gerät sein eigenes Kabel zum Switch. Ein defektes Patchkabel trennt darum nur ein einziges Gerät vom Netz. Fallen alle 20 PCs gleichzeitig aus, muss das Problem an der Stelle liegen, die alle gemeinsam nutzen: dem zentralen Switch.' },
        { id: 'c', text: 'Der Internetanbieter hat eine Störung.', whyWrong: 'Eine Störung beim Internetanbieter betrifft nur die Verbindung nach draußen. Die PCs im eigenen LAN könnten sich weiterhin gegenseitig erreichen, Dateien teilen und drucken. Wenn auch das nicht mehr geht, liegt der Fehler im lokalen Netz.' },
        { id: 'd', text: 'Eine Netzwerkkarte ist defekt.', whyWrong: 'Eine defekte Netzwerkkarte steckt in einem einzigen PC und betrifft nur diesen. Die anderen 19 PCs hätten weiter Netz. Ein Ausfall aller Geräte zugleich deutet auf den gemeinsamen Mittelpunkt des Sterns hin, den Switch.' },
      ],
      correct: 'a',
      explanation: 'Der Switch ist im Stern der **Single Point of Failure**. Wenn alle betroffen sind, prüfst du zuerst die gemeinsame Komponente.',
    },
    {
      id: 'q9', type: 'single', difficulty: 1,
      prompt: 'Was beschreibt die **Latenz**?',
      options: [
        { id: 'a', text: 'Die Verzögerung, bis Daten beim Ziel ankommen' },
        { id: 'b', text: 'Die maximale Datenrate einer Leitung', whyWrong: 'Die maximale Datenrate einer Leitung heißt Bandbreite, z. B. 1 Gbit/s. Sie sagt, wie viel gleichzeitig durchpasst, nicht wie lange ein Paket unterwegs ist. Vergleich: Die Bandbreite ist die Zahl der Spuren einer Autobahn, die Latenz die Fahrzeit von A nach B.' },
        { id: 'c', text: 'Die Schwankung der Verzögerung', whyWrong: 'Die Schwankung der Verzögerung heißt Jitter. Beispiel: ein Paket braucht 20 ms, das nächste 80 ms. Jitter stört vor allem Telefonie und Video. Die Latenz ist die Verzögerung selbst, also wie lange ein Paket bis zum Ziel braucht.' },
        { id: 'd', text: 'Der Anteil verlorener Pakete', whyWrong: 'Der Anteil verlorener Pakete heißt Paketverlust (packet loss), z. B. 2 % der Pakete kommen nie an. Er entsteht durch volle Puffer oder Funkstörungen. Die Latenz misst dagegen die Zeit, die angekommene Pakete brauchen.' },
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
        { id: 'b', text: '400 MB/s', whyWrong: 'Hier wurden Bit und Byte gleichgesetzt. Downloadraten stehen in Megabit pro Sekunde, Dateigrößen in Megabyte. Weil 1 Byte = 8 Bit, teilt man durch 8: 400 Mbit/s ÷ 8 = 50 MB/s. Achte auf die Schreibweise: kleines b = Bit, großes B = Byte.' },
        { id: 'c', text: '3200 MB/s', whyWrong: 'Hier wurde mit 8 multipliziert statt geteilt. Ein Byte ist größer als ein Bit, also muss die Zahl in Byte kleiner werden: 400 ÷ 8 = 50 MB/s.' },
        { id: 'd', text: '40 MB/s', whyWrong: 'Hier wurde durch 10 geteilt, vermutlich als Faustformel wegen des Protokoll-Overheads. Die exakte Umrechnung ist durch 8, weil ein Byte 8 Bit hat: 400 ÷ 8 = 50 MB/s. In der Praxis kommt wegen der Header etwas weniger an, gefragt war aber der ungefähre Rechenwert.' },
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
        { id: 'b', text: 'Bus', whyWrong: 'Beim Bus hängen alle Geräte an einem einzigen Kabel. Es gibt keine Redundanz: ein Bruch legt alles lahm. Alle teilen sich die Bandbreite. Für Rechenzentren mit tausenden Servern ist das völlig ungeeignet und seit Jahrzehnten veraltet.' },
        { id: 'c', text: 'Ring', whyWrong: 'Im Ring läuft der Verkehr von Nachbar zu Nachbar. Je mehr Switches, desto mehr Zwischenstationen auf dem Weg, und die Bandbreite verteilt sich schlecht. Spine-Leaf hat dagegen immer gleich kurze Wege: Leaf → Spine → Leaf.' },
        { id: 'd', text: 'Punkt-zu-Punkt', whyWrong: 'Punkt-zu-Punkt verbindet genau zwei Geräte über eine Leitung, z. B. zwei Router per WAN-Leitung. Die Frage beschreibt, dass jeder Access-Switch mit jedem Backbone-Switch verbunden ist. Das ist das Kennzeichen von Spine-Leaf.' },
      ],
      correct: 'a',
      explanation: 'Bei Spine-Leaf ist jeder Server-Pfad gleich lang (Leaf → Spine → Leaf). Das ergibt vorhersehbare Latenz und gute Skalierung für Ost-West-Verkehr.',
    },
    {
      id: 'q13', type: 'single', difficulty: 1,
      prompt: 'Welches Gerät filtert Datenverkehr anhand von **Regeln** (erlauben/verbieten)?',
      options: [
        { id: 'a', text: 'Firewall' },
        { id: 'b', text: 'Access Point', whyWrong: 'Ein Access Point stellt den Funkzugang (WLAN) bereit und verbindet ihn mit dem kabelgebundenen Netz. Er kann zwar einfache Dinge wie die Trennung von Gästen, ist aber kein Regelwerk für erlaubten und verbotenen Verkehr. Das ist die Kernaufgabe einer Firewall.' },
        { id: 'c', text: 'Modem', whyWrong: 'Ein Modem wandelt Signale um: digitale Daten in Signale für DSL, Kabel oder Glasfaser und zurück. Es prüft nicht, welcher Verkehr erlaubt ist. Das übernimmt die Firewall, die oft mit Modem und Router in einem Gehäuse steckt.' },
        { id: 'd', text: 'Repeater', whyWrong: 'Ein Repeater verstärkt nur das Signal auf Schicht 1, damit es weiter reicht. Er versteht keine Adressen und Inhalte und kann darum auch nichts filtern. Regeln wie „Port 23 verbieten“ setzt eine Firewall um.' },
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
        { id: 'd', text: 'Ein Server muss immer spezielle Server-Hardware sein.', whyWrong: '„Server“ beschreibt eine Rolle, keine Hardware. Ein Server ist ein Programm, das Dienste anbietet: Auch dein Laptop wird zum Server, wenn du dort einen Webserver oder eine Dateifreigabe startest. Spezielle Server-Hardware (Rack, redundante Netzteile) ist nur im Firmeneinsatz üblich.' },
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
        { id: 'b', text: 'Physisch = Schicht 3; logisch = Schicht 2', whyWrong: 'Topologien werden nicht nach OSI-Schichten eingeteilt. Physisch beschreibt die echte Verkabelung, logisch den Weg der Daten. Beides kann man auf jeder Ebene betrachten.' },
        { id: 'c', text: 'Es gibt keinen Unterschied.', whyWrong: 'Es gibt einen Unterschied, und das klassische Beispiel ist der Hub. Physisch ist er ein Stern: jedes Gerät hat ein Kabel zum Hub. Logisch verhält er sich wie ein Bus, weil jedes Signal an alle geht. Physisch = Kabel, logisch = Datenfluss.' },
        { id: 'd', text: 'Physisch = WLAN; logisch = Kabel', whyWrong: 'Physisch und logisch hat nichts mit WLAN oder Kabel zu tun. Auch ein WLAN hat eine physische Topologie (wo stehen die Access Points?) und eine logische (welche Geräte sind in welchem Netz?). Beide Begriffe gelten für jedes Medium.' },
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
          { id: 'b', text: 'Einen zweiten Switch', whyWrong: 'Ein zweiter Switch vergrößert nur das lokale Netz an einem Standort. Zwei Standorte sind aber zwei verschiedene Netze. Switches leiten nur innerhalb eines Netzes weiter. Um ein Paket in das Netz des anderen Standorts zu bringen, braucht es Routing, also einen Router.' },
          { id: 'c', text: 'Einen Access Point', whyWrong: 'Ein Access Point bringt Geräte per Funk ins lokale Netz eines Standorts. Die Verbindung zwischen zwei Standorten über das Internet oder eine WAN-Leitung baut er nicht auf. Dafür braucht jeder Standort einen Router.' },
          { id: 'd', text: 'Einen Hub', whyWrong: 'Ein Hub ist ein veralteter Signalverteiler auf Schicht 1 und kennt keine Adressen. Er kann nicht zwischen Netzen vermitteln und würde das lokale Netz sogar verschlechtern. Für die Verbindung der Standorte braucht es einen Router.' },
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
          { id: 'b', text: '6', whyWrong: '6 Leitungen wären vollvermascht: Jeder der 4 Standorte direkt mit jedem anderen, 4·3/2 = 6. Gefragt ist teilvermascht: nur Zentrale zu allen (3 Leitungen) plus eine Zusatzleitung zwischen zwei Filialen. Das sind 4.' },
          { id: 'c', text: '3', whyWrong: '3 Leitungen wären ein reiner Stern: Die Zentrale ist mit jeder der 3 Filialen verbunden. Die Aufgabe verlangt zusätzlich eine direkte Leitung zwischen zwei Filialen. 3 + 1 = 4.' },
          { id: 'd', text: '5', whyWrong: 'Hier wurde eine Leitung zu viel gezählt. Bei 4 Standorten gibt es 1 Zentrale und 3 Filialen, also 3 Leitungen zur Zentrale. Dazu kommt genau 1 Zusatzleitung: 3 + 1 = 4.' },
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
          { id: 'd', text: 'Switches trennen Broadcast-Domänen standardmäßig.', whyWrong: 'Ein Switch ohne VLANs leitet Broadcasts (z. B. ARP-Anfragen) an alle Ports weiter. Alle angeschlossenen Geräte bilden also eine einzige Broadcast-Domäne. Getrennt werden Broadcast-Domänen erst durch einen Router oder durch VLANs auf dem Switch. Ein Switch trennt standardmäßig nur Kollisionsdomänen.' },
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
          { id: 'b', text: 'Die Leitung ist defekt, sie sollte 1000 MB/s liefern.', whyWrong: 'Hier werden Bit und Byte verwechselt. Der Anschluss liefert 1000 Mbit/s, das sind 1000 ÷ 8 = 125 MB/s. Nach Abzug des Overheads für Header bleiben etwa 110–118 MB/s. Die gemessenen Werte sind also fast das Maximum, nichts ist defekt.' },
          { id: 'c', text: 'Die Latenz ist zu hoch.', whyWrong: 'Latenz ist die Verzögerung pro Paket, nicht die Datenrate. Hier liegt die Rate schon nahe am theoretischen Maximum von 125 MB/s. Eine hohe Latenz würde eher die Reaktionszeit verschlechtern, z. B. beim Seitenaufbau oder in Spielen.' },
          { id: 'd', text: 'Er braucht einen Hub.', whyWrong: 'Ein Hub würde alles verschlechtern: Er teilt die Bandbreite auf alle Ports auf, kann nur Halbduplex und verursacht Kollisionen. Moderne Netze nutzen keine Hubs mehr. Die Messung ist bereits nahe am Maximum.' },
        ],
        correct: 'a',
        explanation: '1000 Mbit/s ÷ 8 = 125 MB/s brutto. Header von Ethernet, IP und TCP kosten einige Prozent. ~110–118 MB/s sind normal.',
      },
      {
        id: 'b6', type: 'single', difficulty: 3,
        prompt: 'Ein Hub mit 8 angeschlossenen PCs bildet wie viele **Kollisionsdomänen**?',
        options: [
          { id: 'a', text: '1' },
          { id: 'b', text: '8', whyWrong: '8 Kollisionsdomänen hätte ein Switch mit 8 belegten Ports, denn jeder Switch-Port ist eine eigene Kollisionsdomäne. Ein Hub verstärkt dagegen jedes Signal auf alle Ports. Senden zwei PCs gleichzeitig, kollidieren ihre Signale. Alle 8 PCs teilen sich also eine Kollisionsdomäne.' },
          { id: 'c', text: '0', whyWrong: 'Sobald sich mehrere Geräte ein Medium im Halbduplex teilen, gibt es mindestens eine Kollisionsdomäne. Am Hub ist das der Fall: Alle 8 PCs können sich gegenseitig stören. 0 Kollisionsdomänen gibt es nur ohne geteiltes Medium.' },
          { id: 'd', text: '2', whyWrong: 'Ein Hub teilt nichts auf. Er hat keine Logik, die Ports in Gruppen trennen könnte, und gibt jedes Signal an alle weiter. Darum bilden alle angeschlossenen Geräte zusammen genau eine Kollisionsdomäne.' },
        ],
        correct: 'a',
        explanation: 'Alle Ports eines Hubs teilen sich ein Medium, also genau **eine** Kollisionsdomäne (und eine Broadcast-Domäne).',
      },
    ],
  },
};

export default level;
