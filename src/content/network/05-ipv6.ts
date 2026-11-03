import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-05',
  track: 'network',
  order: 5,
  title: 'IPv6',
  titleEn: 'IPv6 Addressing, NDP, SLAAC & Transition',
  summary: 'Aufbau und Kurzschreibweise von IPv6-Adressen, Adresstypen, Präfixe, NDP statt ARP, SLAAC/DHCPv6, EUI-64, der IPv6-Header und Übergangstechniken.',
  certs: ['ccna', 'netplus', 'fisi'],
  domains: { ccna: '1', netplus: '1', fisi: 'ap2-admin' },
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
        { id: 'b', text: '64 Bit', whyWrong: '64 Bit ist nur die Hälfte einer IPv6-Adresse. In einem normalen LAN sind die ersten 64 Bit das Präfix (Netzanteil) und die letzten 64 Bit die Interface-ID. Zusammen ergibt das 128 Bit, geschrieben als 8 Blöcke à 16 Bit.' },
        { id: 'c', text: '32 Bit', whyWrong: '32 Bit hat eine IPv4-Adresse. Das reicht nur für etwa 4,3 Milliarden Adressen, und genau deshalb wurde IPv6 entwickelt. IPv6 hat 128 Bit, also 2¹²⁸ Adressen, eine Zahl mit 39 Stellen.' },
        { id: 'd', text: '48 Bit', whyWrong: '48 Bit hat eine MAC-Adresse (6 Byte). IPv6 ist deutlich länger: 128 Bit. Mit EUI-64 kann aus der 48-Bit-MAC eine 64-Bit-Interface-ID gebildet werden, die dann die hintere Hälfte der IPv6-Adresse ist.' },
      ],
      correct: 'a',
      explanation: '8 Blöcke × 16 Bit = 128 Bit.',
    },
    {
      id: 'q2', type: 'single', difficulty: 2,
      prompt: 'Welche Kurzschreibweise von `2001:0db8:0000:0000:0000:ff00:0042:8329` ist korrekt?',
      options: [
        { id: 'a', text: '2001:db8::ff00:42:8329' },
        { id: 'b', text: '2001:db8::ff:42:8329', whyWrong: 'Nur führende Nullen eines Blocks dürfen wegfallen, also Nullen am Anfang. Aus 0042 wird 42, aus ff00 aber nicht ff. Die Nullen am Ende gehören zum Wert: ff00 ist 65280, ff nur 255. So entstünde eine andere Adresse.' },
        { id: 'c', text: '2001:db8:::ff00:42:8329', whyWrong: 'Ein dreifacher Doppelpunkt ist nie gültig. Eine Folge von Null-Blöcken wird durch genau zwei Doppelpunkte (::) ersetzt. Die richtige Form ist 2001:db8::ff00:42:8329.' },
        { id: 'd', text: '21:db8::ff00:42:8329', whyWrong: 'Aus 2001 dürfen keine Nullen entfernt werden, denn sie stehen in der Mitte, nicht am Anfang des Blocks. Weglassen darf man nur führende Nullen: aus 0db8 wird db8. 2001 bleibt 2001.' },
      ],
      correct: 'a',
      explanation: 'Führende Nullen weg (0db8 → db8, 0042 → 42), die drei Null-Blöcke durch `::` ersetzen.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Warum ist `2001:db8::ab::1` **ungültig**?',
      options: [
        { id: 'a', text: '`::` darf nur einmal vorkommen, sonst ist nicht eindeutig, wie viele Null-Blöcke wo fehlen.' },
        { id: 'b', text: 'Hex-Buchstaben müssen großgeschrieben werden.', whyWrong: 'Groß- und Kleinschreibung ist bei Hex-Ziffern gleichwertig: AB und ab bedeuten dasselbe. RFC 5952 empfiehlt sogar Kleinbuchstaben. Das Problem ist das doppelte ::. Damit wäre unklar, wie viele Null-Blöcke an welcher Stelle fehlen.' },
        { id: 'c', text: 'Eine Adresse darf nicht auf `1` enden.', whyWrong: 'Eine Adresse darf auf 1 enden. ::1 ist sogar sehr üblich, z. B. als Adresse eines Router-Interfaces wie 2001:db8:acad:1::1. Ungültig ist hier, dass :: zweimal vorkommt.' },
        { id: 'd', text: '`2001:db8` ist kein gültiger Präfix.', whyWrong: '2001:db8::/32 ist der offizielle Dokumentationsbereich für Beispiele (RFC 3849). Er ist also gültig und taucht in jeder Prüfung auf. Das Problem ist das doppelte ::.' },
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
        { id: 'b', text: 'ARPv6', whyWrong: 'Ein Protokoll namens ARPv6 gibt es nicht. IPv6 hat ARP abgeschafft und nutzt stattdessen Neighbor Discovery (NDP) auf Basis von ICMPv6. Statt eines Broadcasts geht eine Neighbor Solicitation an eine Solicited-Node-Multicast-Adresse.' },
        { id: 'c', text: 'DHCPv6', whyWrong: 'DHCPv6 vergibt Adressen und Optionen wie DNS-Server. Es übersetzt keine IPv6-Adressen in MAC-Adressen. Das macht NDP mit Neighbor Solicitation (Frage) und Neighbor Advertisement (Antwort).' },
        { id: 'd', text: 'DNS AAAA', whyWrong: 'Ein AAAA-Record übersetzt einen Namen in eine IPv6-Adresse. ARP und sein Nachfolger NDP gehen den nächsten Schritt: von der IPv6-Adresse zur MAC-Adresse im lokalen Netz. Das sind zwei verschiedene Ebenen.' },
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
        { id: 'd', text: 'Router fragmentieren zu große Pakete unterwegs.', whyWrong: 'Bei IPv6 fragmentieren Router nicht mehr. Ist ein Paket zu groß für die nächste Leitung, verwirft der Router es und schickt dem Absender ICMPv6 „Packet Too Big“ mit der passenden MTU. Der Absender verkleinert seine Pakete dann selbst (Path MTU Discovery). Das entlastet die Router.' },
        { id: 'e', text: 'Der IPv6-Header hat eine Prüfsumme wie IPv4.', whyWrong: 'Der IPv6-Header hat bewusst keine Prüfsumme. Bei IPv4 muss jeder Router sie neu berechnen, weil sich die TTL ändert. Das kostet Zeit. Fehler erkennen ohnehin Schicht 2 (FCS) und Schicht 4 (TCP/UDP-Prüfsumme). IPv6 lässt sie darum weg.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Typisch hat ein Client gleichzeitig eine Link-Local-Adresse, eine oder mehrere GUAs (inkl. temporärer Privacy-Adresse) und ggf. eine ULA.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Ein Provider gibt dir ein **/48**. Wie viele **/64-Subnetze** kannst du daraus bilden?',
      options: [
        { id: 'a', text: '65.536' },
        { id: 'b', text: '256', whyWrong: '256 /64-Netze hätte ein /56: 64 − 56 = 8 Bit Subnetz-ID, 2⁸ = 256. Ein /48 hat 16 Bit Platz bis /64. Das ergibt 2¹⁶ = 65.536 Subnetze.' },
        { id: 'c', text: '16', whyWrong: '16 ist die Zahl der Subnetz-Bits (64 − 48), nicht die Zahl der Subnetze. Jedes Bit verdoppelt die Anzahl: 2¹⁶ = 65.536.' },
        { id: 'd', text: '4.096', whyWrong: '4.096 = 2¹² würde 12 Subnetz-Bits bedeuten, z. B. von /52 bis /64. Von /48 bis /64 sind es aber 16 Bit. 2¹⁶ = 65.536.' },
      ],
      correct: 'a',
      explanation: '64 − 48 = 16 Bit für die Subnetz-ID → 2¹⁶ = 65.536 /64-Netze.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Zu welchem /64-Netz gehört `2001:db8:acad:12:a1b2::5`?',
      options: [
        { id: 'a', text: '2001:db8:acad:12::/64' },
        { id: 'b', text: '2001:db8:acad::/64', whyWrong: 'Bei /64 gehören die ersten vier Blöcke zum Präfix (4 · 16 = 64 Bit). Der vierte Block ist hier 12 und gehört dazu. 2001:db8:acad::/64 würde 2001:db8:acad:0 bedeuten, ein anderes Netz.' },
        { id: 'c', text: '2001:db8:acad:12:a1b2::/64', whyWrong: 'Bei /64 gehören nur die ersten vier Blöcke zum Präfix. a1b2 ist der fünfte Block und damit schon Teil der Interface-ID, die das Gerät kennzeichnet. Das Netz endet nach 2001:db8:acad:12.' },
        { id: 'd', text: '2001:db8::/64', whyWrong: '2001:db8::/64 würde 2001:db8:0:0 als Präfix bedeuten. Damit fehlen die Blöcke acad und 12, die bei /64 zum Netzanteil gehören. Richtig: 2001:db8:acad:12::/64.' },
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
        { id: 'b', text: 'Vom DHCPv6-Server', whyWrong: 'DHCPv6 hat keine Option für ein Default Gateway, anders als DHCPv4 mit Option 3. Bei IPv6 lernen Clients das Gateway immer aus dem Router Advertisement. Eingetragen wird die Link-Local-Adresse des Routers (fe80::…), von dem das RA kam.' },
        { id: 'c', text: 'Per DNS', whyWrong: 'DNS übersetzt Namen in Adressen. Ein Default Gateway liefert es nie. Bei IPv6 kommt das Gateway aus dem Router Advertisement.' },
        { id: 'd', text: 'Es ist immer `ff02::2`.', whyWrong: 'ff02::2 ist die Multicast-Gruppe „alle Router“. Dorthin schicken Hosts ihre Router Solicitation, um nach einem RA zu fragen. Als Gateway trägt der Client aber eine Unicast-Adresse ein: die Link-Local-Adresse des antwortenden Routers.' },
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
        { id: 'b', text: 'Stateful DHCPv6 (RA mit M-Flag)', whyWrong: 'Beim stateful DHCPv6 (M-Flag) vergibt der DHCPv6-Server die IPv6-Adresse selbst und merkt sich die Zuordnung. In der Frage bildet der Client seine Adresse aber selbst per SLAAC und holt nur Zusatzinfos wie DNS per DHCPv6. Das ist stateless DHCPv6 mit O-Flag (Other configuration).' },
        { id: 'c', text: 'Reines SLAAC ohne DHCPv6', whyWrong: 'Bei reinem SLAAC kommt gar kein DHCPv6 zum Einsatz. Den DNS-Server bekommt der Client dann höchstens über die RDNSS-Option im Router Advertisement. Hier fragt der Client aber zusätzlich einen DHCPv6-Server: stateless DHCPv6.' },
        { id: 'd', text: 'APIPA', whyWrong: 'APIPA ist der Notfallmechanismus von IPv4: Ein PC gibt sich 169.254.x.x, wenn kein DHCP-Server antwortet. Mit IPv6 und Router Advertisements hat das nichts zu tun.' },
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
        { id: 'b', text: 'A', whyWrong: 'Ein A-Record ordnet einem Namen eine IPv4-Adresse zu. Für IPv6 gibt es einen eigenen Typ: AAAA. Die vier A stehen für die vierfache Länge (128 statt 32 Bit).' },
        { id: 'c', text: 'PTR', whyWrong: 'PTR-Records arbeiten rückwärts: von der Adresse zum Namen (Reverse Lookup), z. B. in der Zone ip6.arpa. Gefragt ist die Vorwärtsrichtung von Name zu IPv6-Adresse, das ist AAAA.' },
        { id: 'd', text: 'MX', whyWrong: 'Ein MX-Record nennt die Mailserver einer Domain mit Priorität. Er enthält einen Namen, keine Adresse. Für Name zu IPv6-Adresse ist AAAA zuständig.' },
      ],
      correct: 'a',
      explanation: '„Quad-A“ – viermal so lang wie A, weil 128 statt 32 Bit.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Welche Übergangstechnik ist der empfohlene Standard, damit Netze IPv4 und IPv6 gleichzeitig nutzen?',
      options: [
        { id: 'a', text: 'Dual Stack' },
        { id: 'b', text: 'Teredo', whyWrong: 'Teredo tunnelt IPv6 in UDP über IPv4, um auch hinter NAT-Routern IPv6 zu nutzen. Es war als Notlösung gedacht, ist langsam, schwer zu kontrollieren und wurde von Microsoft weitgehend abgeschaltet. Empfohlen ist Dual Stack, bei dem IPv4 und IPv6 parallel laufen.' },
        { id: 'c', text: '6to4', whyWrong: '6to4 verpackte IPv6 automatisch in IPv4 über öffentliche Relays. Wegen schlechter Zuverlässigkeit wurde es mit RFC 7526 offiziell als veraltet erklärt. Heute empfiehlt man Dual Stack.' },
        { id: 'd', text: 'NAT44', whyWrong: 'NAT44 übersetzt private in öffentliche IPv4-Adressen (z. B. am Heimrouter). Mit IPv6 hat das nichts zu tun. Für den Übergang zu IPv6 ist Dual Stack der Standard.' },
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
          { id: 'b', text: '001a:2bff:fe3c:4d5e', whyWrong: 'Hier fehlt ein Schritt von EUI-64: Das siebte Bit des ersten Bytes (U/L-Bit) wird umgedreht. 00 ist binär 0000 0000, nach dem Umdrehen 0000 0010 = 02. Das FF:FE in der Mitte ist richtig eingefügt, das erste Byte muss aber 02 heißen.' },
          { id: 'c', text: '021a:2bfe:ff3c:4d5e', whyWrong: 'Die Reihenfolge der eingefügten Bytes ist vertauscht. EUI-64 setzt FF:FE in die Mitte (nach den ersten drei Bytes), nicht FE:FF. Richtig: 02:1A:2B:FF:FE:3C:4D:5E, also 021a:2bff:fe3c:4d5e.' },
          { id: 'd', text: '001a:2b3c:4d5e:fffe', whyWrong: 'FF:FE gehört in die Mitte der MAC, zwischen OUI und Gerätenummer, nicht ans Ende. Außerdem wurde das U/L-Bit nicht umgedreht. Richtig: 021a:2bff:fe3c:4d5e.' },
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
          { id: 'b', text: 'Ein DHCPv4-Pool', whyWrong: 'Ein DHCPv4-Pool vergibt nur IPv4-Adressen. Die PCs sollen aber per SLAAC eine IPv6-Adresse bilden. Dafür brauchen sie ein Router Advertisement mit dem Präfix. Ein Cisco-Router sendet RAs erst, wenn global `ipv6 unicast-routing` aktiv ist.' },
          { id: 'c', text: 'Ein AAAA-Record', whyWrong: 'Ein AAAA-Record im DNS ordnet einem Namen eine IPv6-Adresse zu. Ob ein Client sich per SLAAC eine Adresse bildet, hängt nur vom Router Advertisement ab. DNS spielt dabei keine Rolle.' },
          { id: 'd', text: 'Die PCs brauchen eine statische Link-Local-Adresse.', whyWrong: 'Eine Link-Local-Adresse (fe80::) bildet jeder PC automatisch selbst, sobald IPv6 aktiv ist. Die haben die PCs also. Es fehlen die globalen Adressen, und die kommen aus dem Präfix im Router Advertisement.' },
        ],
        correct: 'a',
        explanation: 'Link-Local erzeugt jeder Host selbst. Für SLAAC mit GUA braucht er ein RA mit Präfix, und das sendet IOS erst nach `ipv6 unicast-routing`.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Wie lautet die **Solicited-Node-Multicast-Adresse** zu `2001:db8:acad:1::12:3456`?',
        options: [
          { id: 'a', text: 'ff02::1:ff12:3456' },
          { id: 'b', text: 'ff02::1:ff00:3456', whyWrong: 'Übernommen werden die letzten 24 Bit der Adresse, nicht nur 16. Das sind die letzten 6 Hex-Ziffern: 12:3456. Sie kommen hinter das Präfix ff02::1:ff. Ergebnis: ff02::1:ff12:3456.' },
          { id: 'c', text: 'ff02::1', whyWrong: 'ff02::1 ist die Gruppe „alle Knoten“ im lokalen Netz, praktisch der Ersatz für Broadcast. Die Solicited-Node-Adresse ist gezielter: Sie enthält die letzten 24 Bit der Zieladresse. So hören nur sehr wenige Geräte die Anfrage.' },
          { id: 'd', text: 'ff02::2:ff12:3456', whyWrong: 'Das Präfix der Solicited-Node-Adressen lautet ff02::1:ff00:0/104, also ff02::1:ff…. Mit ff02::2 beginnt es nicht, das ist die Gruppe aller Router. Richtig: ff02::1:ff12:3456.' },
        ],
        correct: 'a',
        explanation: '`ff02::1:ff` + die letzten 24 Bit der Unicast-Adresse. NS-Nachrichten gehen an diese Gruppe, so stört die Adressauflösung nicht alle Hosts (anders als ein ARP-Broadcast).',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Wie kürzt man `2001:db8:0:0:1:0:0:1` **korrekt nach RFC 5952**?',
        options: [
          { id: 'a', text: '2001:db8::1:0:0:1' },
          { id: 'b', text: '2001:db8:0:0:1::1', whyWrong: 'Diese Form ist technisch gültig, aber nicht RFC-5952-konform. Die Adresse hat zwei gleich lange Nullfolgen (je zwei Blöcke). Für diesen Fall schreibt RFC 5952 vor: Die erste Folge wird mit :: gekürzt. Also 2001:db8::1:0:0:1.' },
          { id: 'c', text: '2001:db8::1::1', whyWrong: ':: darf nur einmal vorkommen. Bei zweimal :: wäre nicht klar, wie viele Null-Blöcke an welcher Stelle fehlen, z. B. 1+3 oder 2+2. Die Adresse wäre mehrdeutig und damit ungültig.' },
          { id: 'd', text: '2001:db8:1:1', whyWrong: 'Hier wurden die Null-Blöcke einfach weggelassen, ohne :: zu setzen. Dann hat die Adresse nur 4 statt 8 Blöcke und ist ungültig. Null-Blöcke darf man nur durch :: ersetzen.' },
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
          { id: 'b', text: 'HTTPS läuft über ICMPv6.', whyWrong: 'HTTPS nutzt TCP Port 443, nicht ICMPv6. Es hängt aber trotzdem: Große Pakete verschwinden, weil der Router die Meldung „Packet Too Big“ per ICMPv6 nicht zum Absender bringen kann. Kleine Pakete wie der Handshake gehen durch, große Antworten bleiben stecken.' },
          { id: 'c', text: 'Die Firewall ist überlastet.', whyWrong: 'Eine überlastete Firewall würde alles verlangsamen oder zufällig Pakete verlieren. Hier ist das Muster eindeutig: IPv6-Adressen fehlen (RA blockiert) und große Pakete verschwinden (Packet Too Big blockiert). Beides braucht ICMPv6, das die Firewall komplett sperrt.' },
          { id: 'd', text: 'IPv6 funktioniert grundsätzlich nicht mit Firewalls.', whyWrong: 'Firewalls funktionieren mit IPv6 einwandfrei. Man darf ICMPv6 aber nicht pauschal sperren wie oft bei IPv4. RFC 4890 listet, welche Typen durchgelassen werden müssen, u. a. Packet Too Big und die NDP-Nachrichten.' },
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
          { id: 'b', text: '2001:db8:5aff:ffff::/64', whyWrong: '2001:db8:5aff:… liegt außerhalb des /56. Bei /56 sind die ersten 56 Bit fest: 2001:db8:5a00 (48 Bit) plus die ersten 8 Bit des vierten Blocks (00). Frei sind nur die letzten 8 Bit des vierten Blocks. Der dritte Block 5a00 bleibt unverändert.' },
          { id: 'c', text: '2001:db8:5a00:ffff::/64', whyWrong: 'Bei /56 sind nur 8 Bit für Subnetze frei, nicht 16. Im vierten Block bleiben die ersten zwei Hex-Ziffern 00 fest, die letzten zwei laufen von 00 bis ff. Das letzte Subnetz ist darum 2001:db8:5a00:ff::/64, nicht ffff.' },
          { id: 'd', text: '2001:db8:5a00:100::/64', whyWrong: '0x100 = 256 liegt bereits außerhalb des Bereichs 0 bis 255, den 8 Bit abbilden. 2001:db8:5a00:100:: würde in das nächste /56 fallen. Das letzte Subnetz ist :ff::/64.' },
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
