import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-03',
  track: 'network',
  order: 3,
  title: 'Ethernet, MAC & Kabel',
  titleEn: 'Ethernet, MAC Addresses, Copper & Fiber',
  summary: 'Aufbau von MAC-Adressen und Ethernet-Frames, wie ein Switch lernt, Kupferkabel-Kategorien, Glasfaser und PoE.',
  certs: ['ccna', 'netplus'],
  domains: { ccna: '1', netplus: '1' },
  lab: {
    title: 'Eigene MAC-Adressen und Link-Infos untersuchen',
    needs: 'einen Windows- oder Linux-PC',
    steps: [
      'Windows: `ipconfig /all`, Linux: `ip link`. Notiere die MAC-Adresse(n) deiner Netzwerkkarte(n).',
      'Prüfe die ersten 3 Bytes (OUI) in einer Online-OUI-Suche: Welcher Hersteller steckt dahinter?',
      'Ist in den WLAN-Einstellungen eine zufällige/private Hardwareadresse aktiv? Prüfe das zweite Hex-Zeichen der WLAN-MAC (2, 6, A oder E = lokal verwaltet).',
      'Windows-PowerShell: `Get-NetAdapter | Select Name, LinkSpeed, MacAddress`, Linux: `ethtool <interface>`. Welche Geschwindigkeit wurde ausgehandelt?',
      '`arp -a` (Windows) bzw. `ip neigh` (Linux): Welche MAC hat dein Default Gateway?',
    ],
  },
  lesson: [
    {
      heading: 'MAC-Adressen',
      body: `Eine **MAC-Adresse** ist 48 Bit (6 Byte) lang und wird hexadezimal geschrieben: \`00:1A:2B:3C:4D:5E\`, \`00-1A-2B-3C-4D-5E\` oder bei Cisco \`001a.2b3c.4d5e\`.

- Die ersten 24 Bit sind der **OUI** (Organizationally Unique Identifier), also die Herstellerkennung.
- Die letzten 24 Bit vergibt der Hersteller pro Gerät.
- **Broadcast:** \`FF:FF:FF:FF:FF:FF\` geht an alle im LAN.
- **Multicast:** Das niedrigste Bit des ersten Bytes ist 1 (z. B. \`01:00:5E:…\` für IPv4-Multicast).

Moderne Betriebssysteme nutzen in WLANs oft **zufällige (private) MAC-Adressen**. Dann ist das zweitniedrigste Bit des ersten Bytes gesetzt („locally administered“).`,
      analogy: 'Die MAC-Adresse ist wie die Fahrgestellnummer eines Autos: fest vom Hersteller vergeben und weltweit eindeutig gedacht. Die IP-Adresse ist das Kennzeichen, das sich bei Umzug ändert.',
      terms: [
        { de: 'Hardware-Adresse', en: 'Media Access Control (MAC) address' },
        { de: 'Herstellerkennung', en: 'Organizationally Unique Identifier (OUI)' },
      ],
    },
    {
      heading: 'Der Ethernet-Frame (Ethernet II)',
      diagram: 'ethernet-frame',
      body: `| Feld | Größe | Zweck |
|---|---|---|
| Präambel + SFD | 7 + 1 Byte | Taktsynchronisation, Start des Frames |
| Ziel-MAC | 6 Byte | Empfänger |
| Quell-MAC | 6 Byte | Absender |
| EtherType | 2 Byte | Was steckt drin? \`0x0800\` IPv4, \`0x86DD\` IPv6, \`0x0806\` ARP |
| Nutzdaten | 46–1500 Byte | z. B. IP-Paket (MTU 1500) |
| FCS | 4 Byte | CRC-32-Prüfsumme |

Ein Frame ist (ohne Präambel) mindestens **64 Byte** und standardmäßig höchstens **1518 Byte** groß, mit 802.1Q-VLAN-Tag 1522 Byte. Kleinere Frames heißen **Runts**, zu große ohne Jumbo-Konfiguration **Giants**. **Jumbo Frames** (MTU bis ca. 9000) nutzt man z. B. im Storage-Netz.`,
      terms: [
        { de: 'Maximale Nutzlast', en: 'Maximum Transmission Unit (MTU)' },
        { de: 'Prüfsumme', en: 'Frame Check Sequence (FCS)' },
      ],
    },
    {
      heading: 'Wie ein Switch arbeitet',
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Aus welcher Adresse eines eingehenden Frames lernt ein Switch?',
        options: [
          { id: 'a', text: 'Quell-MAC' },
          { id: 'b', text: 'Ziel-MAC', whyWrong: 'Die Ziel-MAC nutzt er zum Weiterleiten, gelernt wird aus der Quelle.' },
          { id: 'c', text: 'Ziel-IP', whyWrong: 'IP-Adressen sieht ein Layer-2-Switch nicht an.' },
        ],
        correct: 'a',
        explanation: 'Quell-MAC + Eingangsport = neuer Eintrag in der MAC-Tabelle.',
      },
      body: `1. **Lernen (learn):** Er trägt die **Quell-MAC** des eingehenden Frames mit dem Port in die MAC-Adresstabelle ein (Cisco: Alterung nach 300 s).
2. **Weiterleiten (forward):** Ist die **Ziel-MAC** bekannt, geht der Frame nur an diesen Port.
3. **Fluten (flood):** Ist die Ziel-MAC unbekannt (**unknown unicast**) oder ein Broadcast, geht der Frame an alle Ports außer dem Eingangsport.
4. **Filtern (filter):** Liegt das Ziel am selben Port wie die Quelle, wird der Frame verworfen.

Cisco-Befehl: \`show mac address-table\`

**Duplex:** Halbduplex = abwechselnd senden (CSMA/CD, Kollisionen möglich). Vollduplex = gleichzeitig senden und empfangen, keine Kollisionen. Ein **Duplex-Mismatch** (eine Seite voll, eine halb) zeigt sich durch **Late Collisions** auf der Halbduplex-Seite und CRC-Fehler/Runts auf der Vollduplex-Seite: Die Verbindung ist langsam, aber nicht tot.`,
      analogy: 'Halbduplex = Walkie-Talkie (einer spricht, „Over“). Vollduplex = Telefon (beide gleichzeitig).',
    },
    {
      heading: 'Kupferkabel (Twisted Pair)',
      diagram: 'connectors',
      body: `| Kategorie | typisch | max. Länge |
|---|---|---|
| Cat 5e | 1 Gbit/s | 100 m |
| Cat 6 | 1 Gbit/s; 10 Gbit/s | 100 m; 10G nur bis ca. 55 m |
| Cat 6a | 10 Gbit/s | 100 m |
| Cat 8 | 25/40 Gbit/s | 30 m (Rechenzentrum) |

- Stecker: **RJ45** (8P8C). Belegung nach **T568A** oder **T568B**.
- **UTP** = ungeschirmt, **STP/FTP/S/FTP** = geschirmt (gegen elektromagnetische Störungen, EMI).
- **Straight-through** (gleiche Norm an beiden Enden): PC ↔ Switch. **Crossover** (A an einem, B am anderen Ende): früher für gleichartige Geräte. Heute erledigt das **Auto-MDIX** automatisch.
- 100BASE-TX nutzt 2 Adernpaare, **1000BASE-T alle 4 Paare**.
- **Plenum**-Kabel (schwer entflammbar, raucharm) für Lüftungs- und Deckenhohlräume.`,
      terms: [
        { de: 'Verdrillte Adernpaare', en: 'twisted pair' },
        { de: 'Elektromagnetische Störung', en: 'electromagnetic interference (EMI)' },
      ],
    },
    {
      heading: 'Glasfaser',
      body: `Glasfaser überträgt Licht. Sie ist **unempfindlich gegen EMI**, abhörsicherer und überbrückt große Distanzen.

| | Multimode (MMF) | Singlemode (SMF) |
|---|---|---|
| Kerndurchmesser | 50 oder 62,5 µm | ca. 9 µm |
| Lichtquelle | LED/VCSEL, meist 850 nm | Laser, 1310/1550 nm |
| Reichweite | hunderte Meter | km bis viele 10 km |
| Beispiel | 10GBASE-SR (OM3: 300 m, OM4: 400 m) | 10GBASE-LR (10 km) |
| Kosten | Optiken günstiger | Optiken teurer |

- Stecker: **LC** (klein, am häufigsten), **SC** (quadratisch), ST (Bajonett, alt), **MPO/MTP** (viele Fasern, für 40/100G).
- Module: **SFP** (1G), **SFP+** (10G), **SFP28** (25G), **QSFP+** (40G), **QSFP28** (100G).
- Kupfer-Kurzverbindung im Rack: **DAC** (Direct Attach Copper).`,
      analogy: 'Multimode = Taschenlampe im Flur: Licht prallt hin und her, verschmiert über Distanz. Singlemode = Laserpointer: ein gerader Strahl, kommt weit.',
    },
    {
      heading: 'Power over Ethernet (PoE)',
      body: `PoE versorgt Geräte (APs, IP-Telefone, Kameras) über das Datenkabel mit Strom.

| Standard | Name | max. Leistung am Switch-Port (PSE) |
|---|---|---|
| 802.3af | PoE | 15,4 W |
| 802.3at | PoE+ | 30 W |
| 802.3bt Typ 3 | PoE++ | 60 W |
| 802.3bt Typ 4 | PoE++ | 90 W |

Wichtig in der Planung: das **PoE-Budget** des Switches, also die Summe der Leistung, die er insgesamt liefern kann.`,
      terms: [{ de: 'Stromquelle (Switch)', en: 'Power Sourcing Equipment (PSE)' }, { de: 'Verbraucher', en: 'Powered Device (PD)' }],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Wie lang ist eine MAC-Adresse?',
      options: [
        { id: 'a', text: '48 Bit (6 Byte)' },
        { id: 'b', text: '32 Bit', whyWrong: '32 Bit ist eine IPv4-Adresse.' },
        { id: 'c', text: '128 Bit', whyWrong: '128 Bit ist eine IPv6-Adresse.' },
        { id: 'd', text: '64 Bit', whyWrong: '64 Bit (EUI-64) kommt bei IPv6-Interface-IDs vor, Ethernet-MACs haben 48 Bit.' },
      ],
      correct: 'a',
      explanation: '12 Hex-Ziffern × 4 Bit = 48 Bit. Die ersten 24 Bit sind der OUI (Hersteller).',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Was ist die **Ethernet-Broadcast-Adresse**?',
      options: [
        { id: 'a', text: 'FF:FF:FF:FF:FF:FF' },
        { id: 'b', text: '00:00:00:00:00:00', whyWrong: 'Lauter Nullen ist keine gültige Zieladresse für Broadcasts.' },
        { id: 'c', text: '255.255.255.255', whyWrong: 'Das ist der IPv4-Broadcast (limited broadcast), keine MAC-Adresse.' },
        { id: 'd', text: '01:00:5E:00:00:01', whyWrong: 'Das ist eine IPv4-Multicast-MAC.' },
      ],
      correct: 'a',
      explanation: 'Alle 48 Bit auf 1. Jede Netzwerkkarte im selben Layer-2-Segment (VLAN) nimmt diesen Frame an.',
    },
    {
      id: 'q3', type: 'scenario', difficulty: 2,
      scenario: 'Ein Switch wurde gerade neu gestartet; seine MAC-Tabelle ist leer. PC A sendet einen Unicast-Frame an PC B.',
      prompt: 'Was macht der Switch?',
      options: [
        { id: 'a', text: 'Er lernt die MAC von PC A und flutet den Frame an alle anderen Ports.' },
        { id: 'b', text: 'Er verwirft den Frame, weil das Ziel unbekannt ist.', whyWrong: 'Switches verwerfen unbekannte Unicasts nicht, sie fluten sie (unknown unicast flooding).' },
        { id: 'c', text: 'Er sendet einen ARP-Request für PC B.', whyWrong: 'ARP macht der Host, nicht der Layer-2-Switch.' },
        { id: 'd', text: 'Er lernt die MAC von PC B.', whyWrong: 'Der Switch lernt immer die **Quell**-MAC, hier also die von PC A.' },
      ],
      correct: 'a',
      explanation: 'Lernen geschieht über die Quell-MAC. Unbekannte Ziel-MAC bedeutet Fluten. Antwortet PC B, lernt der Switch auch dessen Port.',
    },
    {
      id: 'q4', type: 'cli', shell: 'ios', difficulty: 1,
      prompt: 'Zeige auf einem Cisco-Switch die **MAC-Adresstabelle** an.',
      template: 'Switch# {{0}}',
      blanks: [{ accept: ['show mac address-table', 'sh mac address-table', 'show mac address-table dynamic'] }],
      explanation: '`show mac address-table` listet VLAN, MAC-Adresse, Typ (DYNAMIC/STATIC) und Port.',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Welche Kabelkategorie brauchst du mindestens für **10 Gbit/s über 100 m** Kupfer?',
      options: [
        { id: 'a', text: 'Cat 6a' },
        { id: 'b', text: 'Cat 6', whyWrong: 'Cat 6 schafft 10GBASE-T nur bis ca. 55 m.' },
        { id: 'c', text: 'Cat 5e', whyWrong: 'Cat 5e ist für 1 Gbit/s spezifiziert.' },
        { id: 'd', text: 'Cat 8', whyWrong: 'Cat 8 ist nur bis 30 m spezifiziert (für 25/40G im Rechenzentrum).' },
      ],
      correct: 'a',
      explanation: 'Cat 6a („augmented“) ist für 500 MHz und 10GBASE-T auf vollen 100 m ausgelegt.',
    },
    {
      id: 'q6', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Eigenschaften der richtigen Glasfaser zu.',
      items: [
        { id: 'i1', text: 'ca. 9 µm Kern' },
        { id: 'i2', text: '50 µm Kern' },
        { id: 'i3', text: '10GBASE-LR' },
        { id: 'i4', text: '10GBASE-SR' },
        { id: 'i5', text: 'Laser 1310/1550 nm' },
        { id: 'i6', text: '850 nm VCSEL' },
      ],
      buckets: [
        { id: 'smf', label: 'Singlemode' },
        { id: 'mmf', label: 'Multimode' },
      ],
      solution: { i1: 'smf', i3: 'smf', i5: 'smf', i2: 'mmf', i4: 'mmf', i6: 'mmf' },
      explanation: 'SR = Short Range (Multimode, 850 nm), LR = Long Range (Singlemode, 1310 nm). Singlemode hat den dünnen Kern.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Welcher **EtherType** kennzeichnet ein IPv4-Paket im Ethernet-Frame?',
      options: [
        { id: 'a', text: '0x0800' },
        { id: 'b', text: '0x86DD', whyWrong: '0x86DD ist IPv6.' },
        { id: 'c', text: '0x0806', whyWrong: '0x0806 ist ARP.' },
        { id: 'd', text: '0x8100', whyWrong: '0x8100 kennzeichnet einen 802.1Q-VLAN-Tag.' },
      ],
      correct: 'a',
      explanation: 'Der EtherType sagt dem Empfänger, welchem Protokoll er die Nutzdaten übergeben soll.',
    },
    {
      id: 'q8', type: 'scenario', difficulty: 3,
      scenario: 'Eine Verbindung PC ↔ Switch funktioniert, ist aber sehr langsam. Auf dem Switchport (fest auf 100/Vollduplex) siehst du viele **CRC-Fehler und Runts**, am PC (Autonegotiation) **Late Collisions**.',
      prompt: 'Was ist die Ursache?',
      options: [
        { id: 'a', text: 'Duplex-Mismatch' },
        { id: 'b', text: 'Falsches VLAN', whyWrong: 'Ein falsches VLAN würde die Kommunikation ganz verhindern, nicht nur verlangsamen.' },
        { id: 'c', text: 'Kabel zu kurz', whyWrong: 'Zu kurze Kabel sind in der Praxis kein Problem.' },
        { id: 'd', text: 'IP-Adresskonflikt', whyWrong: 'Ein IP-Konflikt erzeugt keine Layer-1/2-Fehlerzähler wie CRC oder Late Collisions.' },
      ],
      correct: 'a',
      explanation: 'Der Switch spricht nicht mit, der PC erkennt die Gegenstelle per Autoneg nicht und fällt auf **Halbduplex** zurück. Lösung: beide Seiten auf Auto oder beide fest auf denselben Wert.',
    },
    {
      id: 'q9', type: 'single', difficulty: 1,
      prompt: 'Welcher PoE-Standard heißt **PoE+** und liefert bis zu 30 W pro Port?',
      options: [
        { id: 'a', text: 'IEEE 802.3at' },
        { id: 'b', text: 'IEEE 802.3af', whyWrong: '802.3af ist das ursprüngliche PoE mit 15,4 W.' },
        { id: 'c', text: 'IEEE 802.3bt', whyWrong: '802.3bt (PoE++) liefert 60 bzw. 90 W.' },
        { id: 'd', text: 'IEEE 802.11ax', whyWrong: '802.11ax ist ein WLAN-Standard (Wi-Fi 6).' },
      ],
      correct: 'a',
      explanation: 'af = 15,4 W, at = 30 W, bt = 60/90 W (am Switch-Port gemessen).',
    },
    {
      id: 'q10', type: 'multi', difficulty: 2,
      prompt: 'Welche Vorteile hat **Glasfaser** gegenüber Kupfer?',
      options: [
        { id: 'a', text: 'Unempfindlich gegen elektromagnetische Störungen' },
        { id: 'b', text: 'Deutlich größere Reichweiten' },
        { id: 'c', text: 'Galvanische Trennung zwischen Gebäuden (kein Potentialausgleichs-Problem)' },
        { id: 'd', text: 'Kann Endgeräte per PoE mit Strom versorgen', whyWrong: 'Glas leitet keinen Strom. PoE geht nur über Kupfer.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Weil Licht statt Strom übertragen wird, gibt es keine EMI und keine Erdschleifen. Deshalb nimmt man zwischen Gebäuden praktisch immer Glas.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Was macht **Auto-MDIX**?',
      options: [
        { id: 'a', text: 'Es erkennt automatisch, ob Sende- und Empfangsadern gekreuzt werden müssen.' },
        { id: 'b', text: 'Es handelt automatisch Geschwindigkeit und Duplex aus.', whyWrong: 'Das ist Autonegotiation – ein anderes Feature.' },
        { id: 'c', text: 'Es vergibt automatisch MAC-Adressen.', whyWrong: 'MAC-Adressen sind fest in der NIC hinterlegt oder werden vom OS gesetzt.' },
        { id: 'd', text: 'Es schaltet PoE automatisch ein.', whyWrong: 'Die PoE-Erkennung ist ein eigener Mechanismus (Signaturerkennung).' },
      ],
      correct: 'a',
      explanation: 'Mit Auto-MDIX funktioniert jedes Patchkabel, egal ob Straight-through oder Crossover. Gigabit-Ports unterstützen es praktisch immer.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Welcher Teil einer MAC-Adresse identifiziert den **Hersteller**?',
      options: [
        { id: 'a', text: 'Die ersten 24 Bit (OUI)' },
        { id: 'b', text: 'Die letzten 24 Bit', whyWrong: 'Die letzten 24 Bit vergibt der Hersteller selbst als Seriennummer.' },
        { id: 'c', text: 'Das erste Byte', whyWrong: 'Der OUI umfasst die ersten **drei** Bytes.' },
        { id: 'd', text: 'Gar kein Teil', whyWrong: 'Der OUI wird von der IEEE an Hersteller vergeben.' },
      ],
      correct: 'a',
      explanation: 'Beispiel: `00:1A:2B` = OUI. Mit Online-OUI-Lookups findest du so den Hersteller eines unbekannten Geräts.',
    },
    {
      id: 'q13', type: 'cli', shell: 'windows', difficulty: 1,
      prompt: 'Zeige unter Windows alle Netzwerkadapter **inklusive MAC-Adresse** (Physische Adresse) an.',
      template: 'C:\\> {{0}}',
      blanks: [{ accept: ['ipconfig /all', 'getmac', 'getmac /v'] }],
      explanation: '`ipconfig /all` zeigt pro Adapter die „Physische Adresse“ (MAC), IP, Gateway, DNS und DHCP-Infos. `getmac` zeigt nur MACs.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Wie groß darf die **Nutzlast (MTU)** eines Standard-Ethernet-Frames maximal sein?',
      options: [
        { id: 'a', text: '1500 Byte' },
        { id: 'b', text: '1518 Byte', whyWrong: '1518 Byte ist die gesamte Frame-Größe (inkl. 14 Byte Header + 4 Byte FCS).' },
        { id: 'c', text: '9000 Byte', whyWrong: '9000 Byte ist eine typische Jumbo-Frame-MTU, nicht der Standard.' },
        { id: 'd', text: '64 Byte', whyWrong: '64 Byte ist die minimale Frame-Größe.' },
      ],
      correct: 'a',
      explanation: '1500 Byte Nutzlast + 14 Byte Header + 4 Byte FCS = 1518 Byte.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Welchen Glasfaser-Stecker findest du am häufigsten an SFP/SFP+-Modulen?',
      options: [
        { id: 'a', text: 'LC (Duplex)' },
        { id: 'b', text: 'RJ45', whyWrong: 'RJ45 ist ein Kupferstecker.' },
        { id: 'c', text: 'ST', whyWrong: 'ST ist ein älterer Bajonett-Stecker, der an SFPs nicht verwendet wird.' },
        { id: 'd', text: 'BNC', whyWrong: 'BNC wurde für Koaxialkabel verwendet.' },
      ],
      correct: 'a',
      explanation: 'LC (Lucent Connector) ist klein und passt mit zwei Fasern (Senden/Empfangen) in die schmale SFP-Bauform.',
    },
    {
      id: 'q16', type: 'multi', difficulty: 3,
      prompt: 'Welche Frames **flutet** ein Switch an alle Ports (außer dem Eingangsport) desselben VLANs?',
      options: [
        { id: 'a', text: 'Broadcast-Frames' },
        { id: 'b', text: 'Unicasts mit unbekannter Ziel-MAC' },
        { id: 'c', text: 'Multicasts (ohne IGMP Snooping)' },
        { id: 'd', text: 'Unicasts mit bekannter Ziel-MAC', whyWrong: 'Bekannte Unicasts gehen gezielt nur an den gelernten Port.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Mit **IGMP Snooping** kann ein Switch Multicasts gezielt nur an interessierte Ports schicken.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        scenario: 'Zwei Gebäude sind **800 m** voneinander entfernt. Es sollen 10 Gbit/s übertragen werden. Zwischen den Gebäuden liegt eine Starkstromleitung.',
        prompt: 'Was ist die beste Wahl?',
        options: [
          { id: 'a', text: 'Singlemode-Glasfaser mit 10GBASE-LR-Optiken' },
          { id: 'b', text: 'Cat 6a mit einem Repeater in der Mitte', whyWrong: 'Kupfer ist EMI-anfällig, verbindet Gebäude galvanisch und braucht alle 100 m einen aktiven Zwischenpunkt.' },
          { id: 'c', text: 'Multimode OM3 mit 10GBASE-SR', whyWrong: '10GBASE-SR schafft auf OM3 nur ca. 300 m, auf OM4 ca. 400 m – für 800 m zu kurz.' },
          { id: 'd', text: 'Cat 8', whyWrong: 'Cat 8 ist auf 30 m begrenzt.' },
        ],
        correct: 'a',
        explanation: '10GBASE-LR über Singlemode reicht bis 10 km, ist immun gegen EMI und trennt die Gebäude galvanisch.',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Die MAC-Adresse `3A:5F:12:9C:00:01` taucht im WLAN auf. Was sagt das zweite Hex-Zeichen **A** aus?',
        options: [
          { id: 'a', text: 'Die Adresse ist lokal verwaltet (z. B. eine zufällige/private MAC).' },
          { id: 'b', text: 'Es ist eine Multicast-Adresse.', whyWrong: 'Multicast wäre das niedrigste Bit des ersten Bytes. 0x3A = 0011 1010, das niedrigste Bit ist 0, also Unicast.' },
          { id: 'c', text: 'Es ist eine Broadcast-Adresse.', whyWrong: 'Broadcast wäre FF:FF:FF:FF:FF:FF.' },
          { id: 'd', text: 'Das Gerät ist von Cisco.', whyWrong: 'Bei lokal verwalteten Adressen gibt es keinen echten Hersteller-OUI.' },
        ],
        correct: 'a',
        explanation: 'Erstes Byte 0x3A = 0011 10**1**0. Das zweitniedrigste Bit (U/L-Bit) = 1 bedeutet „locally administered“. Typisch für die MAC-Randomisierung von iOS, Android und Windows. Merke: Zweites Hex-Zeichen 2, 6, A oder E = lokal verwaltet.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        scenario: 'Ein 48-Port-Switch hat ein **PoE-Budget von 370 W**. Du willst 12 Access Points (je 25 W, PoE+) und 20 IP-Telefone (je 6 W) anschließen.',
        prompt: 'Reicht das Budget?',
        options: [
          { id: 'a', text: 'Ja, es bleiben sogar 50 W Reserve.', whyWrong: 'Rechne nach: 12·25 W + 20·6 W = 420 W. Das sind 50 W zu viel, nicht 50 W Reserve.' },
          { id: 'b', text: 'Nein, 420 W werden benötigt – mehr als 370 W.' },
          { id: 'c', text: 'Ja, 300 W reichen.', whyWrong: 'Die Telefone wurden vergessen: 300 + 120 = 420 W.' },
          { id: 'd', text: 'Ja, PoE-Budgets spielen keine Rolle.', whyWrong: 'Wird das Budget überschritten, bekommen Ports nach Priorität keinen Strom.' },
        ],
        correct: 'b',
        explanation: '12 × 25 W = 300 W, 20 × 6 W = 120 W, zusammen 420 W > 370 W. Lösung: größeres Netzteil, zweiter Switch oder PoE-Prioritäten setzen.',
      },
      {
        id: 'b4', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen zur **MAC-Adresstabelle** eines Switches stimmen?',
        options: [
          { id: 'a', text: 'Einträge werden aus der Quell-MAC eingehender Frames gelernt.' },
          { id: 'b', text: 'Dynamische Einträge altern nach einer Zeit ohne Verkehr (Cisco: 300 s) aus.' },
          { id: 'c', text: 'Die Tabelle wird pro VLAN geführt.' },
          { id: 'd', text: 'Die Tabelle enthält IP-Adressen.', whyWrong: 'IP-zu-MAC-Zuordnungen stehen in der ARP-Tabelle der Hosts/Router, nicht in der MAC-Tabelle des Switches.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'MAC-Tabelle = (VLAN, MAC) → Port. ARP-Tabelle = IP → MAC. Diese beiden werden in Prüfungen gern verwechselt.',
      },
      {
        id: 'b5', type: 'cli', shell: 'linux', difficulty: 2,
        prompt: 'Zeige unter Linux mit dem modernen `iproute2`-Werkzeug die Netzwerkschnittstellen inklusive MAC-Adresse (`link/ether`) an.',
        template: '$ {{0}}',
        blanks: [{ accept: ['ip link', 'ip link show', 'ip l', 'ip a', 'ip addr', 'ip address', 'ip addr show', 'ip address show'] }],
        explanation: '`ip link show` zeigt Layer-2-Infos (MAC, MTU, Status). `ip addr` zeigt zusätzlich IP-Adressen. `ifconfig` ist veraltet (net-tools).',
      },
      {
        id: 'b6', type: 'single', difficulty: 3,
        prompt: 'Ein Interface zeigt viele **Giants**. Die Gegenseite sendet mit MTU 9000. Was ist die wahrscheinlichste Ursache?',
        options: [
          { id: 'a', text: 'Jumbo Frames sind nur auf einer Seite konfiguriert (MTU-Mismatch).' },
          { id: 'b', text: 'Das Kabel ist zu lang.', whyWrong: 'Zu lange Kabel verursachen eher CRC-Fehler und Signalverlust, keine zu großen Frames.' },
          { id: 'c', text: 'Duplex-Mismatch', whyWrong: 'Ein Duplex-Mismatch zeigt sich durch Late Collisions und Runts.' },
          { id: 'd', text: 'Falscher EtherType', whyWrong: 'Der EtherType beeinflusst nicht die Frame-Größe.' },
        ],
        correct: 'a',
        explanation: 'Giants sind Frames größer als die erlaubte Maximalgröße. Die MTU muss auf dem gesamten Pfad gleich konfiguriert sein.',
      },
    ],
  },
};

export default level;
