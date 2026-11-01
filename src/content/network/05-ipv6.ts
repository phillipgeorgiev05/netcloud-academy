import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-05',
  track: 'network',
  order: 5,
  title: 'IPv6',
  titleEn: 'IPv6 Addressing, NDP, SLAAC & Transition',
  summary: 'Aufbau und Kurzschreibweise von IPv6-Adressen, Adresstypen, Präfixe, NDP statt ARP, SLAAC/DHCPv6, EUI-64, der IPv6-Header und Übergangstechniken.',
  certs: ['ccna', 'netplus'],
  domains: { ccna: '1', netplus: '1' },
  lab: {
    title: 'IPv6 am eigenen Rechner',
    needs: 'einen Windows- oder Linux-PC',
    steps: [
      '`ipconfig` (Windows) bzw. `ip -6 addr` (Linux): Welche IPv6-Adressen hat deine Netzwerkkarte? Ordne sie zu: Link-Local, Global Unicast, temporär.',
      'Erkennst du an einer Adresse das `ff:fe` von EUI-64 oder sind alle Interface-IDs zufällig?',
      '`ping -6 ::1` (Windows) bzw. `ping -6 ::1` (Linux): Loopback testen.',
      'Neighbor-Cache ansehen: `netsh interface ipv6 show neighbors` (Windows) bzw. `ip -6 neigh` (Linux). Welche Einträge gehören zu deinem Router?',
      'Prüfe mit einer IPv6-Testseite im Browser, ob dein Anschluss IPv6 ins Internet hat (z. B. test-ipv6.com).',
    ],
  },
  lesson: [
    {
      heading: 'Warum IPv6?',
      compare: {
        left: 'IPv4',
        right: 'IPv6',
        rows: [
          ['32 Bit', '128 Bit'],
          ['ARP', 'NDP (ICMPv6)'],
          ['Broadcast', 'Multicast (ff02::1)'],
          ['DHCP', 'SLAAC / DHCPv6'],
          ['TTL', 'Hop Limit'],
          ['A-Record', 'AAAA-Record'],
          ['NAT üblich', 'global eindeutige Adressen'],
        ],
      },
      body: `IPv4 hat 2³² ≈ 4,3 Milliarden Adressen, die Vergabestellen (RIRs) haben keine freien Blöcke mehr. NAT hat das Problem nur verschoben. **IPv6** hat **128 Bit** = 2¹²⁸ ≈ 3,4 × 10³⁸ Adressen.

Weitere Änderungen gegenüber IPv4:
- **kein Broadcast** mehr, stattdessen Multicast
- **kein ARP**, stattdessen das **Neighbor Discovery Protocol (NDP)** auf Basis von ICMPv6
- Geräte konfigurieren sich selbst (**SLAAC**)
- vereinfachter Header fester Länge, keine Fragmentierung durch Router
- kein NAT nötig: jedes Gerät kann eine global eindeutige Adresse haben (die Firewall bleibt trotzdem Pflicht)`,
      analogy: 'IPv4 ist ein Telefonbuch mit nur noch belegten Nummern, in dem sich Familien eine Nummer teilen (NAT). IPv6 gibt jedem Sandkorn der Erde eine eigene Nummer.',
      terms: [{ de: 'Nachbarschaftserkennung', en: 'Neighbor Discovery Protocol (NDP)' }],
    },
    {
      heading: 'Schreibweise und Kürzung',
      sources: [{ title: 'RFC 5952 (Textdarstellung)', url: 'https://www.rfc-editor.org/rfc/rfc5952' }],
      body: `128 Bit werden als **8 Blöcke (Hextets) zu je 16 Bit** in Hexadezimal geschrieben, getrennt durch Doppelpunkte:

\`2001:0db8:0000:0000:0000:ff00:0042:8329\`

**Regel 1:** Führende Nullen in jedem Block weglassen → \`2001:db8:0:0:0:ff00:42:8329\`

**Regel 2:** **Eine** zusammenhängende Folge von Null-Blöcken durch \`::\` ersetzen, **nur einmal pro Adresse** → \`2001:db8::ff00:42:8329\`

Empfohlen nach RFC 5952: Kleinbuchstaben, die **längste** Nullfolge kürzen. Bei gleich langen Folgen kürzt man die **erste**. Ein einzelner Null-Block wird nicht mit \`::\` gekürzt.

Der **Präfix** wird wie bei CIDR angegeben: \`2001:db8:acad:1::/64\`. In URLs stehen IPv6-Adressen in eckigen Klammern: \`http://[2001:db8::1]:8080/\`.`,
      terms: [
        { de: 'Block aus 16 Bit', en: 'hextet' },
        { de: 'Präfixlänge', en: 'prefix length' },
      ],
    },
    {
      heading: 'Adresstypen',
      body: `| Typ | Präfix | Zweck |
|---|---|---|
| **Global Unicast (GUA)** | \`2000::/3\` (beginnt mit 2 oder 3) | weltweit routbar, „öffentlich“ |
| **Unique Local (ULA)** | \`fc00::/7\`, in der Praxis \`fd00::/8\` | privat, nicht im Internet geroutet (ähnlich RFC 1918) |
| **Link-Local** | \`fe80::/10\` | nur im eigenen Segment, **jedes IPv6-Interface hat eine** |
| **Multicast** | \`ff00::/8\` | an eine Gruppe |
| Loopback | \`::1\` | das Gerät selbst |
| Unspezifiziert | \`::\` | „noch keine Adresse“ |
| Dokumentation | \`2001:db8::/32\` | nur für Beispiele |

**Anycast** ist eine normale Unicast-Adresse, die mehreren Geräten zugewiesen ist. Das Paket geht an das nächstgelegene (genutzt z. B. bei DNS-Root-Servern).

**Wichtige Multicast-Gruppen:**
- \`ff02::1\` – alle Knoten im Link (ersetzt den Broadcast)
- \`ff02::2\` – alle Router im Link
- \`ff02::1:ffXX:XXXX\` – **Solicited-Node**-Adresse: die letzten 24 Bit der Unicast-Adresse, wird von NDP genutzt
- \`ff02::5\`/\`ff02::6\` OSPFv3, \`ff02::1:2\` DHCPv6-Server/Relays`,
      terms: [
        { de: 'Globale Unicast-Adresse', en: 'Global Unicast Address (GUA)' },
        { de: 'Verbindungslokale Adresse', en: 'link-local address' },
      ],
    },
    {
      heading: 'Präfixe und Subnetting',
      body: `Eine IPv6-Unicast-Adresse besteht meist aus **64 Bit Präfix** (Netz) + **64 Bit Interface-ID** (Host).

Typische Aufteilung einer GUA:
| Teil | Bits | Beispiel |
|---|---|---|
| Global Routing Prefix (vom Provider) | meist 48 oder 56 | \`2001:db8:acad::/48\` |
| Subnetz-ID | 16 (bei /48) bzw. 8 (bei /56) | \`:0001:\` |
| Interface-ID | 64 | \`::1\` |

- **Jedes LAN bekommt ein /64.** SLAAC funktioniert nur mit /64.
- Aus einem **/48** entstehen 2¹⁶ = **65.536** /64-Subnetze, aus einem **/56** 2⁸ = **256**.
- Subnetting im Kopf ist bei IPv6 meist einfacher: Bei Präfixen, die durch 16 teilbar sind, zählt man einfach den Subnetz-Block hoch: \`2001:db8:acad:1::/64\`, \`2001:db8:acad:2::/64\` …
- Punkt-zu-Punkt-Router-Links bekommen oft ein **/127** (RFC 6164).`,
    },
    {
      heading: 'NDP, SLAAC und DHCPv6',
      diagram: 'ndp-slaac',
      sources: [
        { title: 'RFC 4861 (NDP)', url: 'https://www.rfc-editor.org/rfc/rfc4861' },
        { title: 'RFC 4862 (SLAAC)', url: 'https://www.rfc-editor.org/rfc/rfc4862' },
      ],
      body: `Das **Neighbor Discovery Protocol** nutzt ICMPv6-Nachrichten:
| Nachricht | ICMPv6-Typ | Zweck |
|---|---|---|
| Router Solicitation (RS) | 133 | Host: „Gibt es hier einen Router?“ (an \`ff02::2\`) |
| Router Advertisement (RA) | 134 | Router: Präfix, Default Gateway, Flags (an \`ff02::1\`) |
| Neighbor Solicitation (NS) | 135 | „Wer hat diese IPv6-Adresse? Nenn mir deine MAC“ (ersetzt den ARP-Request) |
| Neighbor Advertisement (NA) | 136 | Antwort mit MAC (ersetzt die ARP-Reply) |
| Redirect | 137 | besseren Next Hop melden |

**Duplicate Address Detection (DAD):** Bevor ein Host eine Adresse nutzt, fragt er per NS, ob sie schon vergeben ist.

**Automatische Adressvergabe – die Flags im RA entscheiden:**
- **SLAAC** (Stateless Address Autoconfiguration): Der Host nimmt das /64-Präfix aus dem RA und bildet die Interface-ID selbst, per **EUI-64** oder zufällig (**Privacy Extensions**, Standard bei Windows, macOS, iOS, Android). DNS kann per RDNSS-Option im RA kommen.
- **Stateless DHCPv6** (O-Flag): Die Adresse kommt per SLAAC, weitere Infos (DNS, Domain) per DHCPv6.
- **Stateful DHCPv6** (M-Flag): Die Adresse kommt vom DHCPv6-Server. **Achtung:** Android unterstützt die Adressvergabe per stateful DHCPv6 nicht, in gemischten Netzen also immer auch SLAAC anbieten.

Das **Default Gateway** lernt der Host **immer aus dem RA**, nicht über DHCPv6. Es ist die **Link-Local-Adresse** des Routers.`,
      analogy: 'SLAAC ist wie ein Neubaugebiet: Die Gemeinde (Router) nennt per Aushang den Straßennamen (Präfix), jeder sucht sich seine Hausnummer selbst aus und fragt kurz laut, ob sie schon jemand hat (DAD).',
      terms: [
        { de: 'Zustandslose Autokonfiguration', en: 'Stateless Address Autoconfiguration (SLAAC)' },
        { de: 'Erkennung doppelter Adressen', en: 'Duplicate Address Detection (DAD)' },
      ],
    },
    {
      heading: 'EUI-64',
      body: `Aus der 48-Bit-MAC wird eine 64-Bit-Interface-ID:
1. MAC in der Mitte teilen: \`00:1A:2B\` | \`3C:4D:5E\`
2. \`FF:FE\` einfügen: \`00:1A:2B:FF:FE:3C:4D:5E\`
3. Das **7. Bit** des ersten Bytes umdrehen (U/L-Bit): \`00\` = 0000 00**0**0 → 0000 00**1**0 = \`02\` (praktisch: zum ersten Byte 2 addieren bzw. abziehen)

Ergebnis: Interface-ID \`021a:2bff:fe3c:4d5e\`, mit Präfix z. B. \`2001:db8:acad:1:21a:2bff:fe3c:4d5e\`.

Am \`ff:fe\` in der Mitte erkennt man EUI-64-Adressen. Nachteil: Die MAC ist in der Adresse sichtbar, das Gerät ist über Netze hinweg verfolgbar. Deshalb nutzen Clients heute zufällige Interface-IDs.`,
    },
    {
      heading: 'IPv6-Header, ICMPv6 und Übergang',
      sources: [{ title: 'RFC 8200 (IPv6)', url: 'https://www.rfc-editor.org/rfc/rfc8200' }],
      body: `**Header:** feste **40 Byte**. Felder: Version, Traffic Class, Flow Label, Payload Length, **Next Header**, **Hop Limit** (entspricht der TTL), Quell- und Zieladresse. Optionen stehen in **Extension Headers**.
- **keine Header-Prüfsumme** (das erledigen L2 und L4)
- **Router fragmentieren nicht.** Nur der Absender darf das, er nutzt Path MTU Discovery mit ICMPv6 „Packet Too Big“. Die minimale MTU ist **1280 Byte**.
- **ICMPv6 nie komplett blockieren:** Ohne ICMPv6 funktionieren NDP und PMTUD nicht.

**Übergangstechniken (transition):**
- **Dual Stack:** IPv4 und IPv6 parallel auf allen Geräten. Das ist der Standardweg.
- **Tunneling:** IPv6 in IPv4 verpackt (6in4, GRE). 6to4 und Teredo sind veraltet.
- **Translation:** **NAT64 + DNS64** lassen reine IPv6-Clients IPv4-Server erreichen. Mobilfunknetze nutzen oft **464XLAT**.

DNS-Eintrag für IPv6: **AAAA** (statt A).

**Cisco IOS – Grundkonfiguration:**
- \`ipv6 unicast-routing\` (global: Ohne diesen Befehl routet der Router kein IPv6 und sendet keine RAs)
- \`ipv6 address 2001:db8:acad:1::1/64\` (im Interface)
- \`show ipv6 interface brief\`, \`show ipv6 route\`, \`show ipv6 neighbors\``,
      terms: [
        { de: 'Erweiterungs-Header', en: 'extension header' },
        { de: 'Doppelbetrieb', en: 'dual stack' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Wie lang ist eine IPv6-Adresse?',
      options: [
        { id: 'a', text: '128 Bit' },
        { id: 'b', text: '64 Bit', whyWrong: '64 Bit ist üblicherweise nur die Interface-ID bzw. der Präfix eines LANs.' },
        { id: 'c', text: '32 Bit', whyWrong: '32 Bit hat IPv4.' },
        { id: 'd', text: '48 Bit', whyWrong: '48 Bit hat eine MAC-Adresse.' },
      ],
      correct: 'a',
      explanation: '8 Blöcke × 16 Bit = 128 Bit.',
    },
    {
      id: 'q2', type: 'single', difficulty: 2,
      prompt: 'Welche Kurzschreibweise von `2001:0db8:0000:0000:0000:ff00:0042:8329` ist korrekt?',
      options: [
        { id: 'a', text: '2001:db8::ff00:42:8329' },
        { id: 'b', text: '2001:db8::ff:42:8329', whyWrong: 'Nur führende Nullen dürfen weg. Aus `ff00` wird nicht `ff`, die Nullen am Ende gehören zum Wert.' },
        { id: 'c', text: '2001:db8:::ff00:42:8329', whyWrong: 'Es gibt kein `:::`. Die Nullfolge wird durch genau `::` ersetzt.' },
        { id: 'd', text: '21:db8::ff00:42:8329', whyWrong: 'Aus `2001` dürfen keine Nullen in der Mitte entfernt werden.' },
      ],
      correct: 'a',
      explanation: 'Führende Nullen weg (0db8 → db8, 0042 → 42), die drei Null-Blöcke durch `::` ersetzen.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Warum ist `2001:db8::ab::1` **ungültig**?',
      options: [
        { id: 'a', text: '`::` darf nur einmal vorkommen, sonst ist nicht eindeutig, wie viele Null-Blöcke wo fehlen.' },
        { id: 'b', text: 'Hex-Buchstaben müssen großgeschrieben werden.', whyWrong: 'Groß- und Kleinschreibung sind beide gültig. RFC 5952 empfiehlt sogar Kleinbuchstaben.' },
        { id: 'c', text: 'Eine Adresse darf nicht auf `1` enden.', whyWrong: '`::1` am Ende ist völlig normal, z. B. für Router-Interfaces.' },
        { id: 'd', text: '`2001:db8` ist kein gültiger Präfix.', whyWrong: '`2001:db8::/32` ist der offizielle Dokumentationsbereich.' },
      ],
      correct: 'a',
      explanation: 'Bei zwei `::` könnten z. B. 2+3 oder 1+4 Null-Blöcke gemeint sein. Die Adresse wäre nicht eindeutig.',
    },
    {
      id: 'q4', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Adressen dem richtigen **Typ** zu.',
      items: [
        { id: 'i1', text: 'fe80::1a2b:3cff:fe4d:5e6f' },
        { id: 'i2', text: '2a01:4f8:c17:1::1' },
        { id: 'i3', text: 'fd12:3456:789a:1::10' },
        { id: 'i4', text: 'ff02::1' },
        { id: 'i5', text: '2001:db8:acad:1::5' },
        { id: 'i6', text: 'ff02::2' },
      ],
      buckets: [
        { id: 'gua', label: 'Global Unicast' },
        { id: 'ula', label: 'Unique Local' },
        { id: 'll', label: 'Link-Local' },
        { id: 'mc', label: 'Multicast' },
      ],
      solution: { i1: 'll', i2: 'gua', i5: 'gua', i3: 'ula', i4: 'mc', i6: 'mc' },
      explanation: '`fe80` = Link-Local, `fd` = ULA, `ff` = Multicast, `2`/`3` am Anfang = Global Unicast (2000::/3). `2001:db8::/32` ist zwar der Dokumentationsbereich, liegt aber im GUA-Raum.',
    },
    {
      id: 'q5', type: 'single', difficulty: 1,
      prompt: 'Welches Protokoll ersetzt bei IPv6 das **ARP**?',
      options: [
        { id: 'a', text: 'Neighbor Discovery Protocol (NDP) über ICMPv6' },
        { id: 'b', text: 'ARPv6', whyWrong: 'Ein ARPv6 gibt es nicht. Die Adressauflösung erledigt NDP.' },
        { id: 'c', text: 'DHCPv6', whyWrong: 'DHCPv6 vergibt Adressen und Optionen, löst aber keine MAC-Adressen auf.' },
        { id: 'd', text: 'DNS AAAA', whyWrong: 'DNS löst Namen in IPv6-Adressen auf, nicht IPv6-Adressen in MACs.' },
      ],
      correct: 'a',
      explanation: 'Neighbor Solicitation (Typ 135) und Neighbor Advertisement (Typ 136) übernehmen die Rolle von ARP-Request und -Reply, per Multicast statt Broadcast.',
    },
    {
      id: 'q6', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen über IPv6 stimmen?',
      options: [
        { id: 'a', text: 'Es gibt keinen Broadcast.' },
        { id: 'b', text: 'Jedes IPv6-fähige Interface hat eine Link-Local-Adresse.' },
        { id: 'c', text: 'Ein Interface kann mehrere IPv6-Adressen gleichzeitig haben.' },
        { id: 'd', text: 'Router fragmentieren zu große Pakete unterwegs.', whyWrong: 'Bei IPv6 fragmentiert nur der Absender. Router verwerfen zu große Pakete und senden ICMPv6 „Packet Too Big“.' },
        { id: 'e', text: 'Der IPv6-Header hat eine Prüfsumme wie IPv4.', whyWrong: 'Der IPv6-Header hat keine Prüfsumme. Router müssen sie dadurch nicht bei jedem Hop neu berechnen.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Typisch hat ein Client gleichzeitig eine Link-Local-Adresse, eine oder mehrere GUAs (inkl. temporärer Privacy-Adresse) und ggf. eine ULA.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Ein Provider gibt dir ein **/48**. Wie viele **/64-Subnetze** kannst du daraus bilden?',
      options: [
        { id: 'a', text: '65.536' },
        { id: 'b', text: '256', whyWrong: '256 /64-Netze hätte ein /56 (8 Bit Subnetz-ID).' },
        { id: 'c', text: '16', whyWrong: '16 ist nur die Anzahl der Subnetz-Bits, nicht der Subnetze: 2¹⁶ = 65.536.' },
        { id: 'd', text: '4.096', whyWrong: '4.096 = 2¹², das passt nicht zu 64 − 48 = 16 Bit.' },
      ],
      correct: 'a',
      explanation: '64 − 48 = 16 Bit für die Subnetz-ID → 2¹⁶ = 65.536 /64-Netze.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Zu welchem /64-Netz gehört `2001:db8:acad:12:a1b2::5`?',
      options: [
        { id: 'a', text: '2001:db8:acad:12::/64' },
        { id: 'b', text: '2001:db8:acad::/64', whyWrong: 'Der 4. Block (`12`) gehört bei /64 noch zum Präfix.' },
        { id: 'c', text: '2001:db8:acad:12:a1b2::/64', whyWrong: 'Bei /64 sind nur die ersten 4 Blöcke (4 × 16 Bit) der Präfix. `a1b2` gehört zur Interface-ID.' },
        { id: 'd', text: '2001:db8::/64', whyWrong: 'Es fehlen die Blöcke 3 und 4 des Präfixes.' },
      ],
      correct: 'a',
      explanation: '/64 = die ersten 4 Hextets. Alles danach ist Interface-ID und wird für die Netzadresse auf 0 gesetzt.',
    },
    {
      id: 'q9', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die NDP-Nachrichten ihrer Aufgabe zu.',
      items: [
        { id: 'rs', text: 'Router Solicitation' },
        { id: 'ra', text: 'Router Advertisement' },
        { id: 'ns', text: 'Neighbor Solicitation' },
        { id: 'na', text: 'Neighbor Advertisement' },
      ],
      buckets: [
        { id: 'b1', label: 'Host fragt nach Routern' },
        { id: 'b2', label: 'Router verteilt Präfix & Gateway' },
        { id: 'b3', label: 'Wer hat diese IPv6? (wie ARP-Request)' },
        { id: 'b4', label: 'Antwort mit MAC (wie ARP-Reply)' },
      ],
      solution: { rs: 'b1', ra: 'b2', ns: 'b3', na: 'b4' },
      explanation: 'RS = ICMPv6 133, RA = 134, NS = 135, NA = 136. Duplicate Address Detection nutzt ebenfalls NS.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Woher bekommt ein IPv6-Client sein **Default Gateway**?',
      options: [
        { id: 'a', text: 'Aus dem Router Advertisement (RA) – es ist die Link-Local-Adresse des Routers.' },
        { id: 'b', text: 'Vom DHCPv6-Server', whyWrong: 'DHCPv6 hat keine Option für ein Default Gateway. Das kommt immer per RA.' },
        { id: 'c', text: 'Per DNS', whyWrong: 'DNS liefert Adressen zu Namen, kein Gateway.' },
        { id: 'd', text: 'Es ist immer `ff02::2`.', whyWrong: '`ff02::2` ist die Multicast-Gruppe aller Router, an die Hosts ihre RS schicken. Als Gateway wird eine Unicast-Adresse eingetragen.' },
      ],
      correct: 'a',
      explanation: 'Deshalb siehst du in `ipconfig` als Gateway eine Adresse wie `fe80::1%12`. Die `%12` ist die Zonen-ID (Interface), nötig, weil Link-Local-Adressen auf jedem Interface gleich sein können.',
    },
    {
      id: 'q11', type: 'scenario', difficulty: 2,
      scenario: 'Ein Netz soll Adressen automatisch per **SLAAC** bekommen, die **DNS-Server** aber per DHCPv6 verteilen. Es soll **keine** Adressvergabe per DHCPv6 stattfinden.',
      prompt: 'Wie nennt man diese Variante?',
      options: [
        { id: 'a', text: 'Stateless DHCPv6 (RA mit O-Flag)' },
        { id: 'b', text: 'Stateful DHCPv6 (RA mit M-Flag)', whyWrong: 'Stateful DHCPv6 vergibt die Adressen selbst und merkt sich, wer welche hat.' },
        { id: 'c', text: 'Reines SLAAC ohne DHCPv6', whyWrong: 'Dann käme DNS höchstens per RDNSS-Option im RA, nicht per DHCPv6.' },
        { id: 'd', text: 'APIPA', whyWrong: 'APIPA ist der IPv4-Notfallmechanismus (169.254.x.x).' },
      ],
      correct: 'a',
      explanation: 'O-Flag = „Other configuration“: Adresse per SLAAC, sonstige Infos per DHCPv6. M-Flag = „Managed“: auch die Adresse per DHCPv6.',
    },
    {
      id: 'q12', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Aktiviere auf einem Cisco-Router das **Routing von IPv6** (global).',
      template: 'R1(config)# {{0}}',
      blanks: [{ accept: ['ipv6 unicast-routing'] }],
      explanation: 'Ohne `ipv6 unicast-routing` leitet der Router keine IPv6-Pakete weiter und sendet keine Router Advertisements, die Clients bekommen dann per SLAAC keine globale Adresse.',
    },
    {
      id: 'q13', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Weise dem Interface die Adresse `2001:db8:acad:1::1` mit **/64** zu.',
      template: 'R1(config-if)# {{0}} 2001:db8:acad:1::1{{1}}',
      blanks: [{ accept: ['ipv6 address', 'ipv6 add'] }, { accept: ['/64'] }],
      explanation: 'Bei IPv6 wird der Präfix in IOS als `/64` direkt an die Adresse gehängt, nicht als Maske wie bei IPv4.',
    },
    {
      id: 'q14', type: 'single', difficulty: 1,
      prompt: 'Welcher DNS-Eintragstyp ordnet einem Namen eine **IPv6-Adresse** zu?',
      options: [
        { id: 'a', text: 'AAAA' },
        { id: 'b', text: 'A', whyWrong: 'A-Records enthalten IPv4-Adressen.' },
        { id: 'c', text: 'PTR', whyWrong: 'PTR dient der Rückwärtsauflösung (Adresse → Name).' },
        { id: 'd', text: 'MX', whyWrong: 'MX nennt Mailserver einer Domain.' },
      ],
      correct: 'a',
      explanation: '„Quad-A“ – viermal so lang wie A, weil 128 statt 32 Bit.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Welche Übergangstechnik ist der empfohlene Standard, damit Netze IPv4 und IPv6 gleichzeitig nutzen?',
      options: [
        { id: 'a', text: 'Dual Stack' },
        { id: 'b', text: 'Teredo', whyWrong: 'Teredo (IPv6 über UDP/IPv4 durch NAT) gilt als veraltet und wird kaum noch genutzt.' },
        { id: 'c', text: '6to4', whyWrong: '6to4 ist veraltet (RFC 7526).' },
        { id: 'd', text: 'NAT44', whyWrong: 'NAT44 übersetzt IPv4 zu IPv4 und hat mit IPv6 nichts zu tun.' },
      ],
      correct: 'a',
      explanation: 'Dual Stack: Jedes Gerät spricht beide Protokolle. Clients bevorzugen dabei IPv6 („Happy Eyeballs“ fällt bei Problemen schnell auf IPv4 zurück).',
    },
    {
      id: 'q16', type: 'topology', mode: 'click', difficulty: 2,
      prompt: 'Ein neuer Laptop sendet eine **Router Solicitation** an `ff02::2`. Welches Gerät antwortet mit einem **Router Advertisement**?',
      nodes: [
        { id: 'inet', kind: 'cloud', label: 'Internet', x: 50, y: 10 },
        { id: 'r1', kind: 'router', label: 'R1', x: 50, y: 35 },
        { id: 'sw', kind: 'switch', label: 'Switch', x: 50, y: 60 },
        { id: 'lap', kind: 'laptop', label: 'neuer Laptop', x: 20, y: 88 },
        { id: 'pc', kind: 'pc', label: 'PC', x: 50, y: 88 },
        { id: 'srv', kind: 'server', label: 'DNS-Server', x: 80, y: 88 },
      ],
      links: [['inet', 'r1'], ['r1', 'sw'], ['sw', 'lap'], ['sw', 'pc'], ['sw', 'srv']],
      correct: ['r1'],
      explanation: '`ff02::2` = alle Router im Link. Nur R1 ist Mitglied und antwortet mit einem RA. Der Switch leitet die Nachricht nur weiter (Layer 2).',
    },
    { id: 'g1', type: 'generated', generator: 'ipv6-compress', difficulty: 2 },
    { id: 'g2', type: 'generated', generator: 'ipv6-prefix', difficulty: 2 },
    { id: 'g3', type: 'generated', generator: 'ipv6-eui64', difficulty: 3 },
    {
      id: 'o1', type: 'ordering', difficulty: 2,
      prompt: 'In welcher Reihenfolge läuft die automatische Adressvergabe per **SLAAC** ab?',
      items: [
        { id: 's1', text: 'Link-Local-Adresse erzeugen und per DAD prüfen' },
        { id: 's2', text: 'Router Solicitation an ff02::2 senden' },
        { id: 's3', text: 'Router Advertisement mit Präfix empfangen' },
        { id: 's4', text: 'Globale Adresse aus Präfix + Interface-ID bilden' },
        { id: 's5', text: 'DAD für die globale Adresse, danach ist sie aktiv' },
      ],
      explanation: 'Ohne Link-Local-Adresse kann der Host noch gar nicht mit dem Router sprechen. Deshalb kommt sie zuerst.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'single', difficulty: 3,
        prompt: 'Welche **EUI-64-Interface-ID** ergibt sich aus der MAC `00:1A:2B:3C:4D:5E`?',
        options: [
          { id: 'a', text: '021a:2bff:fe3c:4d5e' },
          { id: 'b', text: '001a:2bff:fe3c:4d5e', whyWrong: 'Das 7. Bit (U/L) des ersten Bytes muss umgedreht werden: 00 → 02.' },
          { id: 'c', text: '021a:2bfe:ff3c:4d5e', whyWrong: 'Eingefügt wird `FF:FE` (in dieser Reihenfolge), nicht `FE:FF`.' },
          { id: 'd', text: '001a:2b3c:4d5e:fffe', whyWrong: '`FF:FE` kommt in die Mitte der MAC, nicht ans Ende.' },
        ],
        correct: 'a',
        explanation: 'Teilen → 00:1A:2B | 3C:4D:5E, FF:FE einfügen, 7. Bit flippen (00 → 02) → 021a:2bff:fe3c:4d5e.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        scenario: 'Nach einem Router-Tausch haben alle PCs im LAN nur noch eine `fe80::`-Adresse und keine globale IPv6-Adresse mehr. Das Interface des neuen Routers hat `2001:db8:acad:10::1/64` konfiguriert.',
        prompt: 'Was fehlt am wahrscheinlichsten?',
        options: [
          { id: 'a', text: 'Der globale Befehl `ipv6 unicast-routing` – ohne ihn sendet der Router keine RAs.' },
          { id: 'b', text: 'Ein DHCPv4-Pool', whyWrong: 'DHCPv4 betrifft nur IPv4-Adressen.' },
          { id: 'c', text: 'Ein AAAA-Record', whyWrong: 'DNS hat keinen Einfluss darauf, ob Clients per SLAAC eine Adresse bekommen.' },
          { id: 'd', text: 'Die PCs brauchen eine statische Link-Local-Adresse.', whyWrong: 'Link-Local haben die PCs ja. Es fehlen die RAs mit dem globalen Präfix.' },
        ],
        correct: 'a',
        explanation: 'Link-Local erzeugt jeder Host selbst. Für SLAAC mit GUA braucht er ein RA mit Präfix, und das sendet IOS erst nach `ipv6 unicast-routing`.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Wie lautet die **Solicited-Node-Multicast-Adresse** zu `2001:db8:acad:1::12:3456`?',
        options: [
          { id: 'a', text: 'ff02::1:ff12:3456' },
          { id: 'b', text: 'ff02::1:ff00:3456', whyWrong: 'Übernommen werden die letzten **24** Bit (12:3456), nicht nur 16.' },
          { id: 'c', text: 'ff02::1', whyWrong: '`ff02::1` ist „alle Knoten“, nicht die Solicited-Node-Adresse.' },
          { id: 'd', text: 'ff02::2:ff12:3456', whyWrong: 'Das Präfix ist `ff02::1:ff00:0/104`.' },
        ],
        correct: 'a',
        explanation: '`ff02::1:ff` + die letzten 24 Bit der Unicast-Adresse. NS-Nachrichten gehen an diese Gruppe, so stört die Adressauflösung nicht alle Hosts (anders als ein ARP-Broadcast).',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Wie kürzt man `2001:db8:0:0:1:0:0:1` **korrekt nach RFC 5952**?',
        options: [
          { id: 'a', text: '2001:db8::1:0:0:1' },
          { id: 'b', text: '2001:db8:0:0:1::1', whyWrong: 'Gültig, aber nicht RFC-5952-konform: Bei gleich langen Nullfolgen wird die **erste** gekürzt.' },
          { id: 'c', text: '2001:db8::1::1', whyWrong: '`::` darf nur einmal vorkommen.' },
          { id: 'd', text: '2001:db8:1:1', whyWrong: 'Hier fehlen Blöcke, die Adresse hätte eine ganz andere Bedeutung.' },
        ],
        correct: 'a',
        explanation: 'Beide Nullfolgen sind 2 Blöcke lang. RFC 5952 sagt: die erste kürzen. Das sorgt für eine einheitliche Darstellung in Logs und Tools.',
      },
      {
        id: 'b5', type: 'scenario', difficulty: 3,
        scenario: 'Ein Kollege will die Firewall „sicher“ machen und blockiert **alles ICMPv6**. Danach hängen manche HTTPS-Verbindungen, und Hosts im LAN finden einander nicht mehr zuverlässig.',
        prompt: 'Was ist die Ursache?',
        options: [
          { id: 'a', text: 'NDP (NS/NA/RS/RA) und Path MTU Discovery („Packet Too Big“) brauchen ICMPv6.' },
          { id: 'b', text: 'HTTPS läuft über ICMPv6.', whyWrong: 'HTTPS nutzt TCP 443. Es hängt nur, weil zu große Pakete ohne „Packet Too Big“-Rückmeldung verschwinden.' },
          { id: 'c', text: 'Die Firewall ist überlastet.', whyWrong: 'Das Symptom passt genau zu fehlendem ICMPv6, nicht zu Überlast.' },
          { id: 'd', text: 'IPv6 funktioniert grundsätzlich nicht mit Firewalls.', whyWrong: 'Firewalls funktionieren mit IPv6. Sie müssen die nötigen ICMPv6-Typen aber durchlassen (RFC 4890).' },
        ],
        correct: 'a',
        explanation: 'Da Router bei IPv6 nicht fragmentieren, ist „Packet Too Big“ (Typ 2) lebenswichtig. NDP läuft komplett über ICMPv6. Sinnvoll ist, nur unnötige ICMPv6-Typen zu filtern.',
      },
      {
        id: 'b6', type: 'cli', shell: 'linux', difficulty: 3,
        prompt: 'Zeige unter Linux den IPv6-**Neighbor-Cache** an (das Gegenstück zur ARP-Tabelle).',
        template: '$ {{0}}',
        blanks: [{ accept: ['ip -6 neigh', 'ip -6 neighbor', 'ip -6 neighbour', 'ip -6 neigh show', 'ip -6 n'] }],
        explanation: 'Windows: `netsh interface ipv6 show neighbors` oder PowerShell `Get-NetNeighbor -AddressFamily IPv6`. Cisco: `show ipv6 neighbors`.',
      },
      {
        id: 'b7', type: 'single', difficulty: 3,
        prompt: 'Ein Unternehmen bekommt `2001:db8:5a00::/56`. Welches ist das **letzte** /64-Subnetz daraus?',
        options: [
          { id: 'a', text: '2001:db8:5a00:ff::/64' },
          { id: 'b', text: '2001:db8:5aff:ffff::/64', whyWrong: 'Das liegt außerhalb des /56. Nur die letzten 8 Bit des 4. Blocks sind Subnetz-ID.' },
          { id: 'c', text: '2001:db8:5a00:ffff::/64', whyWrong: 'Bei /56 sind nur 8 Bit (nicht 16) frei: 0x00–0xff im 4. Block.' },
          { id: 'd', text: '2001:db8:5a00:100::/64', whyWrong: '0x100 = 256 ist bereits außerhalb von 0–255.' },
        ],
        correct: 'a',
        explanation: '/56 → 64 − 56 = 8 Bit Subnetz-ID im 4. Block: `00` bis `ff` → 256 Subnetze, das letzte ist `2001:db8:5a00:ff::/64`.',
      },
      { id: 'bg1', type: 'generated', generator: 'ipv6-subnet', difficulty: 3 },
      { id: 'bg2', type: 'generated', generator: 'ipv6-solicited', difficulty: 3 },
    ],
  },
};

export default level;
