import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-07',
  track: 'network',
  order: 7,
  title: 'Routing',
  titleEn: 'Routing Table, Static Routes, Inter-VLAN, OSPF, FHRP',
  summary: 'Wie ein Router entscheidet: Routingtabelle, Longest Match, administrative Distanz und Metrik. Statische Routen (Default, Host, Floating) für IPv4 und IPv6, Inter-VLAN-Routing, OSPFv2 in einer Area und Gateway-Redundanz mit HSRP/VRRP.',
  certs: ['ccna', 'netplus', 'fisi'],
  domains: { ccna: '3', netplus: '2', fisi: 'ap2-admin' },
  lab: {
    title: 'Statisch, OSPF und Backup-Route in Packet Tracer',
    needs: 'Cisco Packet Tracer (kostenlos über die Cisco Networking Academy)',
    steps: [
      'Baue drei Router (R1, R2, R3) im Dreieck auf. Jeder Router bekommt ein LAN mit einem PC (192.168.1.0/24, .2.0/24, .3.0/24). Die Verbindungen zwischen den Routern sind /30-Netze aus 10.0.0.0/24.',
      'Prüfe mit `show ip route`: Jeder Router kennt nur seine eigenen Netze (Codes C und L).',
      'Aktiviere OSPF auf allen Routern: `router ospf 1`, `router-id 1.1.1.1` (2.2.2.2, 3.3.3.3), `network 192.168.1.0 0.0.0.255 area 0` und `network 10.0.0.0 0.0.0.255 area 0`.',
      'Prüfe `show ip ospf neighbor` (Zustand FULL) und `show ip route ospf` (Routen mit O). Pinge von PC1 zu PC3.',
      'Setze die LAN-Schnittstellen passiv (`passive-interface g0/0`), damit dort keine Hellos hinausgehen.',
      'Lege auf R1 eine Floating Static Route zu 192.168.3.0/24 mit AD 200 über R2 an. Schalte den Link R1–R3 ab und beobachte, wie erst OSPF umrechnet. Entferne OSPF testweise auf R1 und sieh, wie die statische Route (S) übernimmt.',
    ],
  },
  lesson: [
    {
      heading: 'Was ein Router macht',
      body: `Ein **Router** verbindet verschiedene IP-Netze. Für jedes eingehende Paket schaut er auf die **Ziel-IP-Adresse** und sucht in seiner **Routingtabelle (routing table)** den besten Weg.

Was beim Weiterleiten passiert:
- Der Router entfernt den alten Ethernet-Rahmen (Layer 2).
- Er sucht die passende Route und den **nächsten Hop (next hop)**.
- Er verringert die **TTL** (Time to Live) um 1. Bei 0 verwirft er das Paket und schickt eine ICMP-Meldung „Time Exceeded“ zurück.
- Er baut einen **neuen Rahmen** mit neuer Quell- und Ziel-MAC (die eigene und die des nächsten Hops, per ARP ermittelt).
- Quell- und Ziel-IP bleiben gleich (außer bei NAT, siehe A8).

Findet er keine passende Route und hat keine Default-Route, verwirft er das Paket.

**Merksatz:** MAC-Adressen ändern sich bei jedem Hop, IP-Adressen bleiben von Ende zu Ende gleich.`,
      analogy: 'Ein Router ist wie ein Postverteilzentrum: Es liest nur die Postleitzahl (Ziel-IP), packt den Brief in einen neuen Transportbehälter (neuer Rahmen) und schickt ihn zum nächsten Verteilzentrum. Der Brief selbst bleibt unverändert.',
      terms: [
        { de: 'Routingtabelle', en: 'routing table' },
        { de: 'nächster Hop', en: 'next hop' },
        { de: 'Lebensdauer', en: 'Time to Live (TTL)' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Ein Paket geht von PC1 über zwei Router zu PC2. Was bleibt auf dem ganzen Weg gleich (ohne NAT)?',
        options: [
          { id: 'a', text: 'Quell- und Ziel-IP-Adresse' },
          { id: 'b', text: 'Quell- und Ziel-MAC-Adresse', whyWrong: 'MAC-Adressen gelten nur innerhalb eines Netzabschnitts. Jeder Router packt das IP-Paket aus dem alten Rahmen aus und baut einen neuen. Quell-MAC ist dann seine eigene Ausgangsschnittstelle, Ziel-MAC der nächste Hop. Nur die IP-Adressen bleiben vom Start bis zum Ziel gleich.' },
          { id: 'c', text: 'Die TTL', whyWrong: 'Die TTL (Time to Live) ändert sich an jedem Router: Er zieht 1 ab und verwirft das Paket bei 0. So kreisen Pakete bei Routing-Fehlern nicht ewig. Nach zwei Routern ist die TTL um 2 kleiner. Gleich bleiben nur Quell- und Ziel-IP.' },
        ],
        correct: 'a',
        explanation: 'IP-Adressen gelten Ende zu Ende, MAC-Adressen nur im jeweiligen lokalen Netz.',
      },
    },
    {
      heading: 'Die Routingtabelle lesen',
      body: `Mit \`show ip route\` siehst du die Tabelle eines Cisco-Routers:

\`\`\`
R1# show ip route
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0
O     172.16.5.0/24 [110/20] via 10.1.1.2, 00:12:31, GigabitEthernet0/0
\`\`\`

So liest du eine Zeile:
| Teil | Bedeutung |
|---|---|
| Code (C, L, S, O …) | Woher die Route stammt |
| 172.16.5.0/24 | Zielnetz mit Präfixlänge |
| [110/20] | [administrative Distanz / Metrik] |
| via 10.1.1.2 | nächster Hop |
| GigabitEthernet0/0 | Ausgangsschnittstelle |

Wichtige Codes:
- **C** (connected): Netz an einer eigenen Schnittstelle mit IP und Status up/up
- **L** (local): die eigene Schnittstellen-IP als /32-Hostroute
- **S** (static): statische Route, **S*** = statische Default-Route
- **O**: von OSPF gelernt
- **D**: von EIGRP gelernt, **R**: von RIP, **B**: von BGP

**Gateway of last resort** ist die Default-Route (0.0.0.0/0). Sie passt auf jedes Ziel, wird aber nur genutzt, wenn nichts Genaueres passt.`,
      terms: [
        { de: 'direkt verbunden', en: 'directly connected' },
        { de: 'Default-Route', en: 'default route / gateway of last resort' },
        { de: 'Präfixlänge', en: 'prefix length' },
      ],
    },
    {
      heading: 'Welche Route gewinnt? Longest Match, AD, Metrik',
      body: `Ein Router entscheidet in **drei Stufen**. Diese Reihenfolge ist sehr prüfungsrelevant.

**1. Longest Prefix Match (längste Übereinstimmung)**
Passen mehrere Routen auf ein Ziel, gewinnt die mit dem **längsten Präfix** (der genaueste Eintrag). Beispiel für Ziel 10.1.1.70:
- 10.0.0.0/8 passt
- 10.1.1.0/24 passt
- 10.1.1.64/26 passt (10.1.1.64–127) → **gewinnt**, weil /26 am genauesten ist
- 0.0.0.0/0 passt immer, verliert aber gegen alles Genauere

**2. Administrative Distanz (AD)**
Kennt der Router **dasselbe Präfix** aus mehreren Quellen (z. B. OSPF und statisch), entscheidet die **Vertrauenswürdigkeit** der Quelle. Kleiner ist besser.

| Quelle | AD |
|---|---|
| direkt verbunden | 0 |
| statisch | 1 |
| eBGP | 20 |
| EIGRP (intern) | 90 |
| OSPF | 110 |
| IS-IS | 115 |
| RIP | 120 |
| EIGRP (extern) | 170 |
| iBGP | 200 |
| unbrauchbar | 255 |

**3. Metrik**
Liefert **ein** Routingprotokoll mehrere Wege zum selben Präfix, gewinnt die kleinste **Metrik** (Kosten). Jedes Protokoll misst anders: RIP zählt Hops, OSPF nutzt Kosten aus der Bandbreite. Gleiche Metrik = **ECMP** (Equal-Cost Multi-Path), dann teilt der Router die Last auf.

**Wichtig:** AD und Metrik vergleicht der Router nur bei *gleichem* Präfix. Eine /26 aus RIP (AD 120) schlägt eine /24 aus OSPF (AD 110), weil Longest Match zuerst kommt.`,
      analogy: 'Longest Match ist wie eine Wegbeschreibung: „Hauptstraße 12, 2. Stock, Zimmer 4“ ist genauer als „Hauptstraße“. Die AD ist, wem du mehr glaubst, wenn dir zwei Leute denselben Ort unterschiedlich beschreiben.',
      terms: [
        { de: 'längste Präfix-Übereinstimmung', en: 'longest prefix match' },
        { de: 'administrative Distanz', en: 'administrative distance (AD)' },
        { de: 'Metrik', en: 'metric' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Die Routingtabelle enthält 172.16.0.0/16 (OSPF) und 172.16.4.0/22 (RIP). Welche Route nutzt der Router für 172.16.5.9?',
        options: [
          { id: 'a', text: '172.16.4.0/22 von RIP' },
          { id: 'b', text: '172.16.0.0/16 von OSPF, weil OSPF die kleinere AD hat', whyWrong: 'Die Administrative Distance (AD) vergleicht der Router nur zwischen Routen mit genau demselben Präfix. Zuerst gilt Longest Prefix Match: Die genaueste passende Route gewinnt. 172.16.5.9 liegt in 172.16.4.0/22 (4.0 bis 7.255). /22 ist genauer als /16, darum gewinnt RIP trotz höherer AD.' },
          { id: 'c', text: 'Beide abwechselnd', whyWrong: 'Lastverteilung (ECMP) gibt es nur zwischen Routen zum selben Präfix aus derselben Quelle mit gleicher Metrik. Hier sind die Präfixe verschieden (/16 und /22). Der Router nimmt immer die genaueste Route, also /22.' },
        ],
        correct: 'a',
        explanation: '172.16.4.0/22 umfasst 172.16.4.0–172.16.7.255, also auch 172.16.5.9. /22 ist länger als /16 und gewinnt.',
      },
      sources: [{ title: 'RFC 1812 – Requirements for IP Version 4 Routers', url: 'https://www.rfc-editor.org/rfc/rfc1812' }],
    },
    {
      heading: 'Statische Routen',
      body: `Eine **statische Route** trägt der Admin von Hand ein. Sie ändert sich nicht von selbst.

Vorteile: einfach, keine Protokoll-Last, gut kontrollierbar. Nachteile: passt sich bei Ausfällen nicht an, viel Pflege in großen Netzen.

**Syntax (Cisco IOS):**
\`\`\`
ip route <Zielnetz> <Maske> <Next-Hop-IP | Ausgangsschnittstelle> [AD]
\`\`\`

Die vier Arten:
| Art | Beispiel | Zweck |
|---|---|---|
| Netzroute | \`ip route 192.168.20.0 255.255.255.0 10.0.0.2\` | ein bestimmtes Netz |
| Default-Route | \`ip route 0.0.0.0 0.0.0.0 203.0.113.1\` | alles Unbekannte, z. B. Richtung Internet |
| Hostroute | \`ip route 192.168.20.5 255.255.255.255 10.0.0.2\` | genau ein Host (/32) |
| Floating Static | \`ip route 0.0.0.0 0.0.0.0 198.51.100.1 200\` | Backup-Route mit höherer AD |

**Floating Static Route:** Sie bekommt absichtlich eine **höhere AD** als die Hauptroute. Solange die Hauptroute (z. B. OSPF mit AD 110) existiert, „schwebt“ die statische Route unsichtbar im Hintergrund. Fällt die Hauptroute weg, rückt sie in die Tabelle nach. Die AD muss **größer** sein als die der Hauptroute (z. B. 200 gegen OSPF 110).

**Next Hop oder Schnittstelle?** Mit Next-Hop-IP ist die Route eindeutig. Nur mit Ausgangsschnittstelle funktioniert es sauber auf Punkt-zu-Punkt-Leitungen. Auf Ethernet empfiehlt sich die Next-Hop-IP (oder beides: „fully specified“).

**IPv6:** Zuerst \`ipv6 unicast-routing\` aktivieren, dann z. B.
\`\`\`
ipv6 route 2001:db8:20::/64 2001:db8:0:12::2
ipv6 route ::/0 GigabitEthernet0/0 fe80::1
\`\`\`
Ist der Next Hop eine **Link-Local-Adresse** (fe80::), muss die **Ausgangsschnittstelle** mit angegeben werden, weil fe80:: auf jeder Schnittstelle vorkommen kann.`,
      analogy: 'Eine Floating Static Route ist wie ein Ersatzreifen: Er liegt immer im Kofferraum, wird aber nur benutzt, wenn der normale Reifen platt ist.',
      terms: [
        { de: 'statische Route', en: 'static route' },
        { de: 'schwebende statische Route', en: 'floating static route' },
        { de: 'Hostroute', en: 'host route' },
      ],
    },
    {
      heading: 'Inter-VLAN-Routing',
      body: `Geräte in verschiedenen VLANs (siehe A6) brauchen einen Router, um miteinander zu sprechen. Es gibt drei Varianten:

**1. Ein Router-Port pro VLAN (veraltet):** Jedes VLAN braucht ein eigenes Kabel. Skaliert nicht.

**2. Router-on-a-Stick:** Ein einziger Router-Port als **Trunk**, aufgeteilt in **Subinterfaces** (Unterschnittstellen):
\`\`\`
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
\`\`\`
Der Switch-Port zum Router muss ein Trunk sein. Für das Native VLAN: \`encapsulation dot1Q 99 native\`. Nachteil: Der ganze VLAN-Verkehr teilt sich ein Kabel.

**3. Layer-3-Switch mit SVIs (heute Standard):** Eine **SVI** (Switch Virtual Interface) ist eine virtuelle Schnittstelle pro VLAN:
\`\`\`
ip routing
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
\`\`\`
\`ip routing\` schaltet das Routing auf dem Switch ein. Eine SVI ist nur **up/up**, wenn das VLAN existiert und mindestens ein Port in diesem VLAN aktiv ist.

Ein L3-Switch-Port kann auch ein **gerouteter Port (routed port)** sein: \`no switchport\` und eine IP direkt darauf, z. B. als Uplink zum Router.`,
      terms: [
        { de: 'Unterschnittstelle', en: 'subinterface' },
        { de: 'virtuelle Switch-Schnittstelle', en: 'switch virtual interface (SVI)' },
        { de: 'gerouteter Port', en: 'routed port' },
      ],
      compare: {
        left: 'Router-on-a-Stick',
        right: 'Layer-3-Switch (SVI)',
        rows: [
          ['Subinterfaces mit `encapsulation dot1Q`', 'SVIs mit `interface vlan X`'],
          ['ein Trunk-Kabel zum Router', 'Routing im Switch selbst'],
          ['günstig für kleine Netze', 'schnell (Hardware), Standard im Campus'],
          ['Engpass: alles über einen Link', 'kein zusätzlicher Engpass'],
        ],
      },
    },
    {
      heading: 'Dynamisches Routing im Überblick',
      body: `Bei **dynamischem Routing** tauschen Router selbst Routen aus und reagieren automatisch auf Ausfälle.

**IGP vs. EGP:**
- **IGP** (Interior Gateway Protocol): innerhalb eines Unternehmens bzw. eines autonomen Systems: OSPF, EIGRP, IS-IS, RIP
- **EGP** (Exterior Gateway Protocol): zwischen autonomen Systemen, z. B. zwischen Providern. Heute nur noch **BGP**.

**Arten:**
| Art | Funktionsweise | Beispiele |
|---|---|---|
| Distanzvektor | kennt nur Entfernung und Richtung, „Routing nach Gerüchten“ | RIP (Metrik = Hops, max. 15) |
| erweiterter Distanzvektor | schneller, mit Backup-Wegen | EIGRP (Cisco) |
| Link-State | jeder Router kennt die ganze Karte und rechnet selbst (Dijkstra/SPF) | OSPF, IS-IS |
| Pfadvektor | entscheidet nach Pfad und Richtlinien | BGP |

**Konvergenz** heißt: Alle Router haben nach einer Änderung wieder dieselbe, korrekte Sicht. Link-State-Protokolle konvergieren meist schneller als RIP.`,
      terms: [
        { de: 'Konvergenz', en: 'convergence' },
        { de: 'autonomes System', en: 'autonomous system (AS)' },
        { de: 'Verbindungszustand', en: 'link state' },
      ],
    },
    {
      heading: 'OSPFv2 – Grundlagen',
      body: `**OSPF** (Open Shortest Path First) ist das wichtigste IGP und ein offener Standard. Version 2 ist für IPv4, OSPFv3 für IPv6.

**So arbeitet OSPF:**
1. Router finden **Nachbarn (neighbors)** per **Hello-Paketen** (Multicast 224.0.0.5).
2. Sie tauschen **LSAs** (Link-State Advertisements) aus: Beschreibungen ihrer Links.
3. Alle Router einer Area haben dieselbe **LSDB** (Link-State-Datenbank), also dieselbe Karte.
4. Jeder Router berechnet mit dem **SPF-Algorithmus** (Dijkstra) die kürzesten Wege.

**Areas:** Große Netze teilt man in Areas. **Area 0** ist das **Backbone**, alle anderen Areas hängen daran. Für CCNA reicht **Single-Area-OSPF** (alles in Area 0).

**Router-ID (RID):** eindeutige 32-Bit-Kennung im IP-Format. Auswahl in dieser Reihenfolge:
1. manuell mit \`router-id\`
2. höchste IP einer **Loopback**-Schnittstelle
3. höchste IP einer aktiven physischen Schnittstelle

**Kosten (Metrik):** Kosten = Referenzbandbreite ÷ Schnittstellenbandbreite. Standard-Referenz ist **100 Mbit/s**. Damit haben 100 Mbit/s, 1 Gbit/s und 10 Gbit/s alle die Kosten 1. Abhilfe: \`auto-cost reference-bandwidth 100000\` (in Mbit/s) auf **allen** Routern, oder \`ip ospf cost\` pro Schnittstelle. Die Kosten einer Route sind die Summe aller ausgehenden Schnittstellen auf dem Weg.

**Konfiguration:**
\`\`\`
router ospf 1
 router-id 1.1.1.1
 network 10.0.12.0 0.0.0.3 area 0
 network 192.168.1.0 0.0.0.255 area 0
 passive-interface GigabitEthernet0/1
\`\`\`
- Die **1** in \`router ospf 1\` ist nur eine lokale Prozess-ID. Sie muss bei Nachbarn nicht gleich sein.
- \`network\` nutzt eine **Wildcard-Maske** (umgekehrte Maske: /24 → 0.0.0.255, /30 → 0.0.0.3). Jede Schnittstelle, deren IP passt, wird in OSPF aufgenommen.
- Alternativ direkt auf der Schnittstelle: \`ip ospf 1 area 0\`.
- \`passive-interface\`: Das Netz wird bekannt gemacht, aber es gehen keine Hellos hinaus. Für LAN-Ports zu PCs empfohlen (Sicherheit, weniger Verkehr).
- \`default-information originate\` verteilt eine vorhandene Default-Route an alle OSPF-Router.`,
      terms: [
        { de: 'Nachbar', en: 'neighbor / adjacency' },
        { de: 'Link-State-Datenbank', en: 'link-state database (LSDB)' },
        { de: 'Router-Kennung', en: 'router ID (RID)' },
        { de: 'Wildcard-Maske', en: 'wildcard mask' },
        { de: 'passive Schnittstelle', en: 'passive interface' },
      ],
      sources: [{ title: 'RFC 2328 – OSPF Version 2', url: 'https://www.rfc-editor.org/rfc/rfc2328' }],
    },
    {
      heading: 'OSPF-Nachbarschaften, DR und BDR',
      body: `**Damit zwei Router Nachbarn werden**, müssen übereinstimmen:
- **Area**-Nummer
- **Hello- und Dead-Timer** (Standard auf Ethernet: 10 s / 40 s)
- **Subnetz und Maske** der verbundenen Schnittstellen
- Authentifizierung (falls genutzt) und Area-Typ (z. B. Stub)
- Die **Router-IDs** müssen **verschieden** sein
- Die **MTU** muss passen, sonst hängt die Nachbarschaft im Zustand ExStart/Exchange

**Nachbarzustände** (in dieser Reihenfolge):
| Zustand | Bedeutung |
|---|---|
| Down | noch kein Hello empfangen |
| Init | Hello empfangen, eigene RID steht aber noch nicht darin |
| 2-Way | beide sehen sich gegenseitig im Hello |
| ExStart | wer beginnt den Austausch (Master/Slave)? |
| Exchange | Zusammenfassungen der Datenbank (DBD) austauschen |
| Loading | fehlende LSAs anfordern |
| Full | Datenbanken identisch, Nachbarschaft fertig |

**DR und BDR:** Auf Ethernet-Segmenten mit vielen Routern wählt OSPF einen **Designated Router (DR)** und einen **Backup DR (BDR)**. Alle anderen (**DROTHER**) tauschen ihre Daten nur mit DR und BDR aus (Multicast 224.0.0.6), statt jeder mit jedem.
- Wahl: höchste **OSPF-Priorität** (Standard 1, Bereich 0–255). Bei Gleichstand: höchste **Router-ID**.
- **Priorität 0** = wird nie DR oder BDR.
- Die Wahl ist **nicht präemptiv**: Ein neuer Router mit höherer Priorität übernimmt nicht automatisch. Erst wenn der DR ausfällt (oder der OSPF-Prozess neu startet).
- DROTHER untereinander bleiben in **2-Way**. Das ist **normal**, kein Fehler.
- Auf Punkt-zu-Punkt-Links gibt es keinen DR/BDR (\`ip ospf network point-to-point\`).

**Prüfbefehle:**
- \`show ip ospf neighbor\`: Nachbarn, Zustand, Rolle (z. B. FULL/DR)
- \`show ip ospf interface brief\`: Schnittstellen, Area, Kosten, Rolle
- \`show ip protocols\`: Router-ID, Netze, passive Schnittstellen
- \`show ip route ospf\`: gelernte Routen`,
      terms: [
        { de: 'designierter Router', en: 'designated router (DR)' },
        { de: 'Sicherungs-DR', en: 'backup designated router (BDR)' },
        { de: 'Hello-Intervall / Dead-Intervall', en: 'hello / dead interval' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Vier Router hängen an einem Switch. R3 und R4 sind DROTHER. Welchen Zustand zeigt R3 für R4 in `show ip ospf neighbor`?',
        options: [
          { id: 'a', text: '2WAY/DROTHER – das ist normal' },
          { id: 'b', text: 'FULL/DROTHER', whyWrong: 'Auf Multi-Access-Netzen wie Ethernet bilden DROTHER-Router nur mit DR und BDR eine volle Nachbarschaft (FULL) und tauschen nur mit ihnen die Datenbank aus. Zwischen zwei DROTHERs bleibt es bei 2WAY. Das spart viele Nachbarschaften und ist kein Fehler.' },
          { id: 'c', text: 'INIT – ein Fehler', whyWrong: 'INIT hieße: R3 hat ein Hello von R4 bekommen, aber R4 hat R3 in seinem Hello noch nicht aufgeführt. Das wäre ein Problem. Zwischen zwei DROTHERs ist 2WAY der normale Endzustand: Beide sehen sich, tauschen aber keine Datenbank aus.' },
        ],
        correct: 'a',
        explanation: 'DROTHER bilden untereinander nur 2-Way. Die Datenbank tauschen sie mit DR und BDR aus.',
      },
    },
    {
      heading: 'Gateway-Redundanz: HSRP, VRRP, GLBP',
      body: `Ein PC kennt nur **ein** Default Gateway. Fällt dieser Router aus, ist der PC offline, auch wenn ein zweiter Router da ist. Die Lösung: ein **FHRP** (First Hop Redundancy Protocol).

**Prinzip:** Zwei (oder mehr) Router teilen sich eine **virtuelle IP-Adresse** und eine **virtuelle MAC-Adresse**. Die PCs nutzen die virtuelle IP als Gateway. Ein Router ist aktiv, der andere springt bei Ausfall ein. Die PCs merken nichts.

| | HSRP | VRRP | GLBP |
|---|---|---|---|
| Herkunft | Cisco | offener Standard (IETF) | Cisco |
| Rollen | Active / Standby | Master / Backup | AVG / AVF |
| Lastverteilung | nein (nur pro Gruppe) | nein (nur pro Gruppe) | ja, mehrere Router gleichzeitig |
| Preemption Standard | **aus** | **an** | aus |
| virtuelle MAC | 0000.0c07.acXX (v1) | 0000.5e00.01XX | 0007.b400.XXYY |

**HSRP im Detail:**
- Höchste **Priorität** wird Active (Standard **100**). Bei Gleichstand gewinnt die höchste IP.
- **Preemption** (\`standby 1 preempt\`): Ohne sie holt sich ein Router mit höherer Priorität die Active-Rolle nach seiner Rückkehr **nicht** zurück.
- Version 1: Multicast 224.0.0.2, Gruppen 0–255. Version 2: 224.0.0.102, Gruppen 0–4095, IPv6-fähig.

\`\`\`
interface vlan 10
 ip address 192.168.10.2 255.255.255.0
 standby version 2
 standby 10 ip 192.168.10.1
 standby 10 priority 110
 standby 10 preempt
\`\`\`
Prüfen mit \`show standby brief\`.`,
      analogy: 'FHRP ist wie eine zentrale Hotline-Nummer: Die Kunden wählen immer dieselbe Nummer (virtuelle IP). Wer gerade Dienst hat, nimmt ab. Fällt einer aus, übernimmt die Kollegin, ohne dass sich die Nummer ändert.',
      terms: [
        { de: 'Gateway-Redundanz', en: 'first hop redundancy protocol (FHRP)' },
        { de: 'virtuelle IP-Adresse', en: 'virtual IP address (VIP)' },
        { de: 'Vorrang-Übernahme', en: 'preemption' },
      ],
      sources: [
        { title: 'RFC 2281 – Cisco Hot Standby Router Protocol (HSRP)', url: 'https://www.rfc-editor.org/rfc/rfc2281' },
        { title: 'RFC 5798 – VRRP Version 3', url: 'https://www.rfc-editor.org/rfc/rfc5798' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welche Information im Paket nutzt ein Router für seine Weiterleitungsentscheidung?',
      options: [
        { id: 'a', text: 'Die Ziel-IP-Adresse' },
        { id: 'b', text: 'Die Ziel-MAC-Adresse', whyWrong: 'Die Ziel-MAC nutzt ein Switch auf Schicht 2. Beim Router ist sie immer seine eigene Schnittstelle, denn der PC schickt den Rahmen an sein Gateway. Der Router packt das Paket aus, schaut auf die Ziel-IP und baut einen neuen Rahmen für den nächsten Hop.' },
        { id: 'c', text: 'Die Quell-IP-Adresse', whyWrong: 'Normales Routing schaut nur, wohin ein Paket will, nicht woher es kommt. Die Routingtabelle enthält Zielnetze. Die Quell-IP spielt nur bei Sonderfunktionen eine Rolle, etwa ACLs, NAT oder Policy-Based Routing.' },
        { id: 'd', text: 'Den Zielport (TCP/UDP)', whyWrong: 'TCP/UDP-Ports gehören zu Schicht 4 und sagen, welches Programm auf dem Zielrechner gemeint ist. Ein Router arbeitet auf Schicht 3 und entscheidet nur nach der Ziel-IP. Ports beachten erst Firewalls oder NAT.' },
      ],
      correct: 'a',
      explanation: 'Der Router sucht die Ziel-IP in der Routingtabelle (Longest Match) und leitet zum nächsten Hop weiter.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Routenquellen ihrer Standard-AD (Cisco) zu.',
      items: [
        { id: 'conn', text: 'direkt verbunden' },
        { id: 'stat', text: 'statische Route' },
        { id: 'eigrp', text: 'EIGRP (intern)' },
        { id: 'ospf', text: 'OSPF' },
        { id: 'rip', text: 'RIP' },
      ],
      buckets: [
        { id: '0', label: '0' },
        { id: '1', label: '1' },
        { id: '90', label: '90' },
        { id: '110', label: '110' },
        { id: '120', label: '120' },
      ],
      solution: { conn: '0', stat: '1', eigrp: '90', ospf: '110', rip: '120' },
      explanation: 'Je kleiner die AD, desto vertrauenswürdiger die Quelle. Merkhilfe: C 0, S 1, eBGP 20, EIGRP 90, OSPF 110, IS-IS 115, RIP 120.',
    },
    {
      id: 'q3', type: 'scenario', difficulty: 2,
      prompt: 'Über welchen nächsten Hop schickt R1 ein Paket an **10.10.10.200**?',
      scenario: '```\nR1# show ip route\nS*    0.0.0.0/0 [1/0] via 203.0.113.1\nO     10.10.0.0/16 [110/30] via 10.0.12.2\nO     10.10.10.0/24 [110/20] via 10.0.13.3\nS     10.10.10.128/25 [1/0] via 10.0.14.4\n```',
      options: [
        { id: 'a', text: '10.0.14.4' },
        { id: 'b', text: '10.0.13.3', whyWrong: 'Die Route 10.10.10.0/24 passt zwar zu 10.10.10.200. Es gibt aber noch 10.10.10.128/25 (.128 bis .255), und die passt auch. Bei mehreren Treffern gewinnt immer das längste Präfix. /25 ist genauer als /24, also geht das Paket an 10.0.14.4.' },
        { id: 'c', text: '10.0.12.2', whyWrong: '10.10.0.0/16 passt zwar, ist aber die ungenaueste der passenden Routen (nur 16 Bit stimmen überein). Der Router nimmt immer das längste passende Präfix, hier /25 über 10.0.14.4.' },
        { id: 'd', text: '203.0.113.1', whyWrong: 'Die Default-Route 0.0.0.0/0 passt auf jede Adresse, aber mit 0 Bit Übereinstimmung. Sie ist die letzte Wahl, wenn nichts Genaueres passt. Hier passen /16, /24 und /25. Die /25 gewinnt.' },
      ],
      correct: 'a',
      explanation: '10.10.10.200 liegt in 10.10.10.128/25. Die /25 ist das längste passende Präfix und gewinnt.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'R1 lernt 192.168.50.0/24 per OSPF und hat zusätzlich eine statische Route zu 192.168.50.0/24 ohne Angabe einer AD. Welche Route steht in der Routingtabelle?',
      options: [
        { id: 'a', text: 'Die statische Route (AD 1 schlägt AD 110)' },
        { id: 'b', text: 'Die OSPF-Route, weil sie dynamisch ist', whyWrong: 'Dynamisch gelernt heißt nicht vertrauenswürdiger. Bei gleichem Präfix entscheidet die Administrative Distance, also wie sehr der Router einer Quelle vertraut. Statisch hat AD 1, OSPF AD 110. Die kleinere AD gewinnt, also die statische Route.' },
        { id: 'c', text: 'Beide mit Lastverteilung', whyWrong: 'Lastverteilung gibt es nur zwischen gleichwertigen Routen derselben Quelle. Eine statische und eine OSPF-Route haben verschiedene AD (1 und 110). Nur die mit der kleineren AD kommt in die Tabelle.' },
        { id: 'd', text: 'Die mit der kleineren Metrik', whyWrong: 'Jede Quelle rechnet ihre Metrik anders: OSPF in Kosten, RIP in Hops, statische Routen haben gar keine. Diese Zahlen lassen sich nicht vergleichen. Zwischen verschiedenen Quellen entscheidet deshalb die AD, und statisch (1) schlägt OSPF (110).' },
      ],
      correct: 'a',
      explanation: 'Gleiches Präfix, unterschiedliche Quellen → AD entscheidet. Statisch (1) gewinnt gegen OSPF (110).',
    },
    {
      id: 'q5', type: 'cli', shell: 'ios', difficulty: 1,
      prompt: 'Lege auf R1 eine Default-Route zum Provider-Router **203.0.113.1** an.',
      template: 'R1(config)# {{0}}',
      blanks: [{ accept: ['ip route 0.0.0.0 0.0.0.0 203.0.113.1'] }],
      explanation: '`ip route 0.0.0.0 0.0.0.0 <next-hop>` erzeugt die Default-Route. In der Tabelle erscheint sie als `S*` und als „Gateway of last resort“.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Die Hauptroute ins Internet kommt per OSPF. Eine statische Backup-Route über eine LTE-Leitung soll nur greifen, wenn die OSPF-Route verschwindet. Welche AD gibst du der statischen Route?',
      options: [
        { id: 'a', text: 'Eine AD größer als 110, z. B. 200' },
        { id: 'b', text: 'AD 1, wie jede statische Route', whyWrong: 'Mit AD 1 wäre die statische Route vertrauenswürdiger als OSPF (110). Sie würde die OSPF-Route sofort aus der Tabelle verdrängen, und der ganze Verkehr liefe über LTE. Eine Backup-Route (Floating Static Route) braucht eine höhere AD als die Hauptroute.' },
        { id: 'c', text: 'AD 0', whyWrong: 'AD 0 haben nur direkt verbundene Netze. Bei statischen Routen kann man 1 bis 255 einstellen. Selbst wenn 0 ginge: Sie wäre besser als OSPF und würde die Hauptroute verdrängen, statt nur Backup zu sein.' },
        { id: 'd', text: 'AD 100', whyWrong: '100 ist kleiner als 110, also vertraut der Router der statischen Route mehr als OSPF. Sie würde sofort genommen und die OSPF-Route verdrängen. Für ein Backup muss die AD über 110 liegen, z. B. 200.' },
      ],
      correct: 'a',
      explanation: 'Eine Floating Static Route braucht eine höhere AD als die Hauptroute. Erst wenn OSPF die Route verliert, rückt sie nach.',
      analogy: 'Ersatzreifen: liegt bereit, wird aber erst montiert, wenn der normale Reifen ausfällt.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Du willst eine IPv6-Default-Route mit dem Link-Local-Next-Hop **fe80::1** anlegen. Was musst du zusätzlich angeben?',
      options: [
        { id: 'a', text: 'Die Ausgangsschnittstelle' },
        { id: 'b', text: 'Die Präfixlänge des Next Hops', whyWrong: 'Ein Next Hop ist eine einzelne Adresse, an die das Paket geht, kein Netz mit Präfixlänge. Das Präfix steht nur beim Ziel der Route (::/0). Bei Link-Local fehlt etwas anderes: die Schnittstelle, über die fe80::1 zu erreichen ist.' },
        { id: 'c', text: 'Die MAC-Adresse des Next Hops', whyWrong: 'Die MAC-Adresse des Next Hops findet IPv6 selbst per Neighbor Discovery (NDP), dem Ersatz für ARP. Man trägt sie nie in Routen ein. Was fehlt, ist die Ausgangsschnittstelle, weil fe80::1 auf jedem Link existieren kann.' },
        { id: 'd', text: 'Nichts weiter', whyWrong: 'Link-Local-Adressen gelten nur auf einem einzigen Link. fe80::1 kann an mehreren Schnittstellen gleichzeitig vorkommen. Ohne Schnittstelle weiß der Router nicht, auf welchem Link er den Nachbarn suchen soll. Darum: `ipv6 route ::/0 g0/0 fe80::1`.' },
      ],
      correct: 'a',
      explanation: 'Beispiel: `ipv6 route ::/0 GigabitEthernet0/0 fe80::1`. Link-Local-Adressen sind nur pro Link eindeutig.',
    },
    {
      id: 'q8', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Router-on-a-Stick: Konfiguriere das Subinterface für **VLAN 20** mit der Gateway-Adresse 192.168.20.1/24.',
      template: 'R1(config)# interface g0/0.20\nR1(config-subif)# {{0}}\nR1(config-subif)# {{1}}',
      blanks: [
        { accept: ['encapsulation dot1q 20', 'encapsulation dot1Q 20', 'encap dot1q 20'] },
        { accept: ['ip address 192.168.20.1 255.255.255.0', 'ip add 192.168.20.1 255.255.255.0'] },
      ],
      explanation: 'Erst `encapsulation dot1Q 20` (welches VLAN-Tag dieses Subinterface verarbeitet), dann die IP. Ohne Encapsulation lässt IOS keine IP auf dem Subinterface zu.',
    },
    {
      id: 'q9', type: 'multi', difficulty: 2,
      prompt: 'Eine SVI `interface vlan 30` zeigt **down/down**. Welche Ursachen sind möglich?',
      options: [
        { id: 'a', text: 'VLAN 30 existiert nicht auf dem Switch.' },
        { id: 'b', text: 'Kein Port in VLAN 30 ist aktiv (kein Access-Port up, kein Trunk mit VLAN 30).' },
        { id: 'c', text: 'Auf der SVI fehlt `ip routing`.', whyWrong: '`ip routing` ist ein globaler Befehl, der das Routing zwischen VLANs einschaltet. Auf einer einzelnen SVI gibt es ihn nicht. Ohne ihn routet der Switch nicht, die SVI kann aber trotzdem up/up sein. down/down kommt von fehlendem VLAN oder fehlendem aktiven Port darin.' },
        { id: 'd', text: 'Die SVI hat eine IP aus dem falschen Subnetz.', whyWrong: 'Eine falsche IP-Adresse führt dazu, dass Hosts das Gateway nicht erreichen. Der Status der Schnittstelle bleibt davon unberührt. down/down heißt: Das VLAN existiert nicht, oder kein Port darin ist aktiv.' },
      ],
      correct: ['a', 'b'],
      explanation: 'Eine SVI ist nur up/up, wenn das VLAN existiert und mindestens ein Port in diesem VLAN aktiv (forwarding) ist. Ist sie mit `shutdown` abgeschaltet, steht dort „administratively down“.',
    },
    {
      id: 'q10', type: 'single', difficulty: 1,
      prompt: 'Welches Routingprotokoll nutzt man zwischen Internetprovidern?',
      options: [
        { id: 'a', text: 'BGP' },
        { id: 'b', text: 'OSPF', whyWrong: 'OSPF ist ein Interior Gateway Protocol (IGP) für das Netz einer einzelnen Organisation. Es kennt keine Richtlinien zwischen Firmen und skaliert nicht auf das ganze Internet. Zwischen Providern (autonomen Systemen) läuft BGP, das einzige EGP im Einsatz.' },
        { id: 'c', text: 'RIP', whyWrong: 'RIP ist auf 15 Hops begrenzt und schickt alle 30 Sekunden die ganze Tabelle. Für das Internet mit rund einer Million Routen ist das völlig ungeeignet. Zwischen Providern läuft BGP.' },
        { id: 'd', text: 'EIGRP', whyWrong: 'EIGRP ist ein IGP für das Netz einer Organisation, ursprünglich von Cisco und heute teilweise offengelegt. Es tauscht keine Routen zwischen autonomen Systemen mit Richtlinien aus. Das kann nur BGP.' },
      ],
      correct: 'a',
      explanation: 'BGP (Border Gateway Protocol) ist das einzige heute genutzte EGP. Es verbindet autonome Systeme im Internet.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Ein Router hat keine manuell gesetzte OSPF-Router-ID. Schnittstellen: Loopback0 2.2.2.2, G0/0 10.0.0.1, G0/1 192.168.1.1. Welche Router-ID wählt OSPF?',
      options: [
        { id: 'a', text: '2.2.2.2' },
        { id: 'b', text: '192.168.1.1', whyWrong: '192.168.1.1 ist zwar die höchste physische Adresse. Die Reihenfolge ist aber: erst `router-id` von Hand, dann die höchste Loopback-Adresse, erst danach die höchste physische Adresse. Weil Loopback0 eine IP hat, wird 2.2.2.2 Router-ID.' },
        { id: 'c', text: '10.0.0.1', whyWrong: '10.0.0.1 ist weder Loopback noch die höchste physische Adresse (192.168.1.1 ist höher). Nach keiner Regel käme sie zum Zug. Die Reihenfolge: manuell, dann höchste Loopback (hier 2.2.2.2), dann höchste physische.' },
        { id: 'd', text: '0.0.0.0', whyWrong: '0.0.0.0 ist keine gültige Router-ID. Findet OSPF gar keine IPv4-Adresse, startet der Prozess nicht. Hier gibt es aber drei Adressen, und die Loopback 2.2.2.2 hat Vorrang.' },
      ],
      correct: 'a',
      explanation: 'Reihenfolge: 1) `router-id`, 2) höchste Loopback-IP, 3) höchste aktive physische IP. Die Loopback hat Vorrang, auch wenn ihre Adresse kleiner ist.',
    },
    {
      id: 'q12', type: 'ordering', difficulty: 2,
      prompt: 'Bringe die OSPF-Nachbarzustände in die richtige Reihenfolge.',
      items: [
        { id: 'down', text: 'Down' },
        { id: 'init', text: 'Init' },
        { id: '2way', text: '2-Way' },
        { id: 'exstart', text: 'ExStart' },
        { id: 'exchange', text: 'Exchange' },
        { id: 'loading', text: 'Loading' },
        { id: 'full', text: 'Full' },
      ],
      explanation: 'Down → Init (Hello empfangen) → 2-Way (gegenseitig gesehen) → ExStart (Master/Slave) → Exchange (DBDs) → Loading (fehlende LSAs) → Full.',
    },
    {
      id: 'q13', type: 'multi', difficulty: 3,
      prompt: 'Zwei Router an einem Ethernet-Link werden keine OSPF-Nachbarn. Welche Unterschiede verhindern die Nachbarschaft?',
      options: [
        { id: 'a', text: 'Unterschiedliche Area-Nummern' },
        { id: 'b', text: 'Unterschiedliche Hello-/Dead-Timer' },
        { id: 'c', text: 'Die Schnittstellen liegen in verschiedenen Subnetzen.' },
        { id: 'd', text: 'Unterschiedliche OSPF-Prozess-IDs (`router ospf 1` und `router ospf 2`)', whyWrong: 'Die Prozess-ID hinter `router ospf` gilt nur auf dem eigenen Router. Sie unterscheidet mehrere OSPF-Prozesse auf demselben Gerät und wird nie an Nachbarn gesendet. `router ospf 1` und `router ospf 2` werden problemlos Nachbarn.' },
        { id: 'e', text: 'Unterschiedliche OSPF-Prioritäten', whyWrong: 'Die OSPF-Priorität entscheidet nur, wer DR oder BDR wird. Sie steht zwar im Hello, muss aber nicht übereinstimmen. Gleich sein müssen Area, Subnetz, Hello-/Dead-Timer, Authentifizierung und MTU.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Übereinstimmen müssen: Area, Hello/Dead, Subnetz/Maske, Authentifizierung, Area-Typ. Router-IDs müssen verschieden sein. Prozess-ID und Priorität spielen keine Rolle.',
    },
    {
      id: 'q14', type: 'single', difficulty: 3,
      prompt: 'Ein Link hat 1 Gbit/s, die OSPF-Referenzbandbreite ist auf Standard. Welche Kosten bekommt die Schnittstelle?',
      options: [
        { id: 'a', text: '1' },
        { id: 'b', text: '0,1', whyWrong: 'Die Formel Referenzbandbreite ÷ Bandbreite ergibt 100 Mbit/s ÷ 1000 Mbit/s = 0,1. OSPF-Kosten sind aber ganze Zahlen und mindestens 1. Darum wird auf 1 gerundet. Deshalb haben 100 Mbit/s, 1 Gbit/s und 10 Gbit/s alle Kosten 1, solange man die Referenz nicht erhöht.' },
        { id: 'c', text: '10', whyWrong: '10 sind die Kosten eines 10-Mbit/s-Links (100 ÷ 10). Bei 1 Gbit/s ergibt die Formel 100 ÷ 1000 = 0,1, gerundet auf das Minimum 1.' },
        { id: 'd', text: '1000', whyWrong: '1000 käme heraus, wenn man Bandbreite ÷ Referenz rechnet, also verkehrt herum. Die Formel ist Referenz (100 Mbit/s) ÷ Bandbreite (1000 Mbit/s) = 0,1, gerundet auf 1. Schnellere Links haben kleinere Kosten.' },
      ],
      correct: 'a',
      explanation: '100 Mbit/s ÷ 1000 Mbit/s = 0,1 → aufgerundet auf mindestens 1. Darum unterscheidet OSPF ohne Anpassung nicht zwischen 100 Mbit/s und 1 Gbit/s. Abhilfe: `auto-cost reference-bandwidth` auf allen Routern.',
    },
    {
      id: 'q15', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Nimm das Netz **192.168.1.0/24** in Area 0 von OSPF-Prozess 1 auf.',
      template: 'R1(config)# router ospf 1\nR1(config-router)# {{0}}',
      blanks: [{ accept: ['network 192.168.1.0 0.0.0.255 area 0', 'network 192.168.1.0 0.0.0.255 area 0.0.0.0'] }],
      explanation: '`network` nutzt die Wildcard-Maske (Kehrwert der Subnetzmaske): /24 → 0.0.0.255.',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Wozu dient `passive-interface GigabitEthernet0/1` unter `router ospf 1`, wenn an G0/1 nur PCs hängen?',
      options: [
        { id: 'a', text: 'Das Netz an G0/1 wird weiter bekannt gemacht, aber dort gehen keine Hellos hinaus.' },
        { id: 'b', text: 'Die Schnittstelle wird abgeschaltet.', whyWrong: '`passive-interface` schaltet die Schnittstelle nicht ab, das täte `shutdown`. Die PCs an G0/1 haben weiter Verbindung. Nur OSPF sendet dort keine Hellos mehr, weil dort ohnehin kein Router zuhört.' },
        { id: 'c', text: 'Das Netz an G0/1 wird aus OSPF entfernt.', whyWrong: 'Das Netz an G0/1 bleibt in OSPF und wird weiter an alle anderen Router gemeldet. Sonst wären die PCs dort von außen nicht erreichbar. Passiv heißt nur: keine Hellos, also keine Nachbarschaft über diesen Port.' },
        { id: 'd', text: 'OSPF darf G0/1 nur noch als Backup nutzen.', whyWrong: 'Einen Backup-Modus für Schnittstellen gibt es in OSPF nicht. Welcher Weg genommen wird, bestimmen die Kosten. `passive-interface` unterdrückt nur die Hellos auf Ports, an denen kein OSPF-Nachbar sein soll.' },
      ],
      correct: 'a',
      explanation: 'Passive Schnittstellen verhindern unnötigen Verkehr und dass ein fremdes Gerät im LAN eine OSPF-Nachbarschaft aufbaut.',
    },
    {
      id: 'q17', type: 'single', difficulty: 2,
      prompt: 'Wie wird der OSPF-DR auf einem Ethernet-Segment gewählt?',
      options: [
        { id: 'a', text: 'Höchste OSPF-Priorität, bei Gleichstand höchste Router-ID' },
        { id: 'b', text: 'Niedrigste Router-ID', whyWrong: 'Die Router-ID entscheidet nur bei gleicher Priorität, und dann gewinnt die höchste, nicht die niedrigste. Hier ist OSPF anders als STP, wo der niedrigste Wert gewinnt. Ein beliebter Prüfungsfehler, weil man die beiden verwechselt.' },
        { id: 'c', text: 'Der Router mit den meisten Schnittstellen', whyWrong: 'Die Zahl der Schnittstellen spielt keine Rolle. Die Wahl richtet sich nur nach der OSPF-Priorität auf diesem Segment (Standard 1, 0 = nie DR) und bei Gleichstand nach der höchsten Router-ID.' },
        { id: 'd', text: 'Der zuletzt gestartete Router', whyWrong: 'Eher umgekehrt: Die DR-Wahl ist nicht präemptiv. Ist schon ein DR gewählt, bleibt er, auch wenn ein besserer Router später startet. Darum wird oft der Router DR, der zuerst bereit war. Die Regel selbst ist: höchste Priorität, dann höchste Router-ID.' },
      ],
      correct: 'a',
      explanation: 'Standard-Priorität ist 1. Priorität 0 = nie DR/BDR. Die Wahl ist nicht präemptiv.',
    },
    {
      id: 'q18', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu FHRPs stimmen?',
      options: [
        { id: 'a', text: 'Die PCs tragen die virtuelle IP-Adresse als Default Gateway ein.' },
        { id: 'b', text: 'VRRP ist ein offener Standard, HSRP und GLBP stammen von Cisco.' },
        { id: 'c', text: 'Bei HSRP ist Preemption standardmäßig aktiv.', whyWrong: 'Bei HSRP ist Preemption standardmäßig aus. Ein Router mit höherer Priorität übernimmt nach einem Neustart also nicht automatisch wieder, dafür braucht es `standby <gruppe> preempt`. Bei VRRP ist Preemption dagegen standardmäßig an.' },
        { id: 'd', text: 'HSRP verteilt die Last automatisch auf beide Router.', whyWrong: 'Bei HSRP leitet in einer Gruppe nur der Active-Router weiter, der Standby wartet. Lastverteilung bekommt man nur mit mehreren Gruppen, also verschiedenen Gateways für verschiedene PCs. Automatische Lastverteilung bietet GLBP: Es antwortet auf ARP mit verschiedenen virtuellen MACs.' },
      ],
      correct: ['a', 'b'],
      explanation: 'FHRPs teilen sich eine virtuelle IP/MAC. HSRP: Active/Standby, Priorität 100, kein Preempt per Standard. VRRP: Master/Backup, Preempt an. GLBP: Lastverteilung.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'PC1 (192.168.10.25) erreicht den Server 172.16.1.10 nicht. Was ist die Ursache?',
        scenario: '```\nR1# show ip route\nGateway of last resort is not set\n\nC     192.168.10.0/24 is directly connected, GigabitEthernet0/0\nL     192.168.10.1/32 is directly connected, GigabitEthernet0/0\nC     10.0.12.0/30 is directly connected, GigabitEthernet0/1\nL     10.0.12.1/32 is directly connected, GigabitEthernet0/1\nO     172.16.2.0/24 [110/2] via 10.0.12.2, GigabitEthernet0/1\n```',
        options: [
          { id: 'a', text: 'R1 hat keine Route zu 172.16.1.0 und keine Default-Route.' },
          { id: 'b', text: 'Die OSPF-Nachbarschaft zu 10.0.12.2 ist ausgefallen.', whyWrong: 'Die Nachbarschaft steht: R1 hat 172.16.2.0/24 per OSPF über 10.0.12.2 gelernt. Ohne Nachbarschaft gäbe es keine O-Routen. Für 172.16.1.0 gibt es aber gar keinen Eintrag und keine Default-Route. Darum verwirft R1 das Paket.' },
          { id: 'c', text: 'G0/0 ist abgeschaltet.', whyWrong: '192.168.10.0/24 steht als C (connected) in der Tabelle. Das geht nur, wenn G0/0 up/up ist. PC1 erreicht R1 also. Das Problem liegt dahinter: R1 kennt keinen Weg zu 172.16.1.0.' },
          { id: 'd', text: 'Die AD von OSPF ist zu hoch.', whyWrong: 'Die AD vergleicht der Router nur, wenn mehrere Quellen dasselbe Präfix kennen. Für 172.16.1.0 gibt es überhaupt keinen Eintrag, also nichts zu vergleichen. Ohne passende Route und ohne Default verwirft R1 das Paket.' },
        ],
        correct: 'a',
        explanation: '172.16.1.10 passt auf keinen Eintrag (172.16.2.0/24 ist ein anderes Netz) und es gibt kein Gateway of last resort. R1 verwirft das Paket. Nächster Schritt: Prüfen, warum R2 172.16.1.0/24 nicht per OSPF verteilt.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        prompt: 'R1 und R2 werden keine OSPF-Nachbarn. Was ist der Grund?',
        scenario: '```\nR1# show ip ospf interface g0/0\n  Internet Address 10.0.12.1/30, Area 0\n  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1\n  Timer intervals configured, Hello 10, Dead 40\n\nR2# show ip ospf interface g0/0\n  Internet Address 10.0.12.2/30, Area 0\n  Process ID 10, Router ID 2.2.2.2, Network Type BROADCAST, Cost: 1\n  Timer intervals configured, Hello 5, Dead 20\n```',
        options: [
          { id: 'a', text: 'Hello- und Dead-Timer stimmen nicht überein.' },
          { id: 'b', text: 'Die Prozess-IDs sind unterschiedlich.', whyWrong: 'Die Prozess-ID gilt nur auf dem eigenen Router und wird nicht übertragen. `router ospf 1` und `router ospf 10` werden ohne Probleme Nachbarn. Entscheidend sind die Werte im Hello, und dort weichen die Timer ab.' },
          { id: 'c', text: 'Die Router-IDs sind unterschiedlich.', whyWrong: 'Router-IDs müssen sogar verschieden sein. Zwei Router mit derselben ID würden sich gegenseitig stören, OSPF meldet dann „duplicate router-id“. Unterschiedliche IDs sind der Normalfall.' },
          { id: 'd', text: 'Die Kosten sind gleich.', whyWrong: 'Die Kosten gelten nur auf der eigenen Schnittstelle für die Wegberechnung und stehen nicht im Hello. Ob gleich oder verschieden, die Nachbarschaft entsteht trotzdem. Verhindert wird sie hier durch abweichende Hello-/Dead-Timer.' },
        ],
        correct: 'a',
        explanation: 'R1: 10/40, R2: 5/20. Hello- und Dead-Intervall müssen auf beiden Seiten gleich sein. Lösung z. B. `ip ospf hello-interval 10` und `ip ospf dead-interval 40` auf R2.',
      },
      {
        id: 'b3', type: 'chain', difficulty: 3,
        prompt: 'Nach dem Einbau eines Layer-3-Switches erreichen PCs in VLAN 10 die PCs in VLAN 20 nicht. Beide VLANs haben eine SVI mit IP. Finde den Fehler.',
        steps: [
          {
            id: 's1', text: 'PC in VLAN 10 pingt sein Gateway 192.168.10.1 erfolgreich. Ping auf 192.168.20.1 (SVI VLAN 20) scheitert. Was prüfst du zuerst?',
            options: [
              { id: 'a', text: '`show ip interface brief` auf dem Switch: Ist `Vlan20` up/up?', correct: true, feedback: 'Richtig. Erst prüfen, ob die Ziel-SVI überhaupt läuft.' },
              { id: 'b', text: 'Das Kabel des PCs tauschen', correct: false, feedback: 'Der PC erreicht sein Gateway, das Kabel ist in Ordnung.' },
              { id: 'c', text: 'Auf dem PC die Firewall abschalten', correct: false, feedback: 'Es geht um die SVI des Switches, nicht um den PC.' },
            ],
          },
          {
            id: 's2', text: '`Vlan20` ist up/up. `show ip route` zeigt **keine** C-Routen, und oben steht „Default gateway is not set“. Was fehlt?',
            options: [
              { id: 'a', text: 'Der globale Befehl `ip routing`', correct: true, feedback: 'Genau. Ohne `ip routing` arbeitet der L3-Switch nur als Layer-2-Switch.' },
              { id: 'b', text: 'Eine statische Route zwischen den VLANs', correct: false, feedback: 'Direkt verbundene SVIs brauchen keine statischen Routen, sobald Routing aktiv ist.' },
              { id: 'c', text: 'OSPF zwischen den SVIs', correct: false, feedback: 'Netze auf demselben Gerät sind direkt verbunden, dafür braucht es kein Routingprotokoll.' },
            ],
          },
          {
            id: 's3', text: 'Nach `ip routing` klappt alles. Was gehört zum Abschluss dazu?',
            options: [
              { id: 'a', text: '`copy running-config startup-config` und die Änderung dokumentieren', correct: true, feedback: 'Richtig. Sonst ist die Änderung nach dem nächsten Neustart weg.' },
              { id: 'b', text: 'Den Switch neu starten, um sicherzugehen', correct: false, feedback: 'Ohne Speichern wäre die Konfiguration danach wieder weg.' },
              { id: 'c', text: 'Nichts weiter', correct: false, feedback: 'Ungespeicherte Änderungen gehen beim nächsten Stromausfall verloren.' },
            ],
          },
        ],
        explanation: 'Layer-3-Switch: `ip routing` aktiviert das Routing. Erst dann erscheinen die SVI-Netze als C-Routen.',
      },
      {
        id: 'b4', type: 'scenario', difficulty: 3,
        prompt: 'R1 soll HSRP-Active sein. Nach einem Neustart von R1 bleibt R2 Active. Warum?',
        scenario: '```\nR1# show running-config interface vlan 10\n standby 10 ip 192.168.10.1\n standby 10 priority 120\n\nR2# show running-config interface vlan 10\n standby 10 ip 192.168.10.1\n standby 10 priority 100\n```',
        options: [
          { id: 'a', text: 'Auf R1 fehlt `standby 10 preempt`.' },
          { id: 'b', text: 'Priorität 120 ist zu niedrig.', whyWrong: 'Priorität 120 ist höher als der Standard 100 auf R2, R1 wäre also der bessere Kandidat. Ohne Preemption übernimmt er aber nicht, solange R2 schon Active ist. Bei HSRP muss man das mit `standby 10 preempt` erlauben.' },
          { id: 'c', text: 'Beide Router nutzen dieselbe virtuelle IP.', whyWrong: 'Genau so soll es sein: Alle Router einer HSRP-Gruppe teilen sich dieselbe virtuelle IP. Die PCs tragen sie als Gateway ein. Wer gerade Active ist, beantwortet diese Adresse. Das Problem ist die fehlende Preemption auf R1.' },
          { id: 'd', text: 'HSRP-Version 2 fehlt.', whyWrong: 'HSRP-Version 1 kennt Priorität und Preemption ebenfalls. Version 2 bringt vor allem mehr Gruppennummern (bis 4095), IPv6-Support und Millisekunden-Timer. Hier fehlt `standby 10 preempt`.' },
        ],
        correct: 'a',
        explanation: 'HSRP-Preemption ist standardmäßig aus. Ohne `preempt` holt sich R1 die Active-Rolle nach seiner Rückkehr nicht zurück, trotz höherer Priorität.',
      },
      {
        id: 'b5', type: 'single', difficulty: 3,
        prompt: 'R1 kennt 10.5.0.0/16 per EIGRP (AD 90) und 10.5.5.0/24 per RIP (AD 120). Welche Route nutzt er für 10.5.5.5, welche für 10.5.6.6?',
        options: [
          { id: 'a', text: '10.5.5.5 über RIP, 10.5.6.6 über EIGRP' },
          { id: 'b', text: 'Beide über EIGRP wegen der kleineren AD', whyWrong: 'Die AD zählt nur zwischen Routen mit gleichem Präfix. 10.5.5.5 passt auf /16 und auf /24, und die /24 ist genauer. Longest Match schlägt AD: 10.5.5.5 geht über RIP. Nur 10.5.6.6 passt allein auf die /16 und geht über EIGRP.' },
          { id: 'c', text: 'Beide über RIP', whyWrong: '10.5.5.0/24 umfasst nur 10.5.5.0 bis 10.5.5.255. 10.5.6.6 liegt nicht darin, dafür passt nur 10.5.0.0/16 über EIGRP. Nur 10.5.5.5 geht über RIP.' },
          { id: 'd', text: '10.5.5.5 über EIGRP, 10.5.6.6 über RIP', whyWrong: 'Genau verkehrt herum. 10.5.5.5 passt auf die genauere /24 von RIP und geht dorthin. 10.5.6.6 passt nur auf die /16 von EIGRP.' },
        ],
        correct: 'a',
        explanation: 'Longest Match zuerst: Für 10.5.5.5 passt die /24 (RIP) genauer. Für 10.5.6.6 passt nur die /16 (EIGRP).',
      },
      {
        id: 'b6', type: 'cli', shell: 'ios', difficulty: 3,
        prompt: 'Lege eine Floating Static Default-Route über **198.51.100.1** mit **AD 200** an (Backup für die OSPF-Default-Route).',
        template: 'R1(config)# {{0}}',
        blanks: [{ accept: ['ip route 0.0.0.0 0.0.0.0 198.51.100.1 200'] }],
        explanation: 'Die AD steht am Ende. 200 ist größer als OSPF (110), die Route greift also nur, wenn die OSPF-Default-Route fehlt.',
      },
    ],
  },
};

export default level;
