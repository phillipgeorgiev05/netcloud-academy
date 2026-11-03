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
          { id: 'b', text: 'Ziel-MAC', whyWrong: 'Die Ziel-MAC nutzt der Switch zum Weiterleiten: Er schaut in seiner Tabelle nach, an welchem Port dieses Ziel hängt. Lernen kann er daraus nichts, denn das Ziel hat den Frame nicht geschickt. Aus der Quell-MAC weiß er dagegen sicher: Dieses Gerät sitzt hinter dem Port, an dem der Frame ankam.' },
          { id: 'c', text: 'Ziel-IP', whyWrong: 'Ein Layer-2-Switch schaut nur in den Ethernet-Header, also auf die MAC-Adressen. Den IP-Header dahinter wertet er nicht aus. Seine MAC-Adresstabelle enthält darum nur MAC-Adresse, Port und VLAN. IP-Adressen lernt erst ein Router oder Layer-3-Switch (ARP-Tabelle).' },
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
        { id: 'b', text: '32 Bit', whyWrong: '32 Bit ist die Länge einer IPv4-Adresse (4 Zahlen à 8 Bit, z. B. 192.168.1.10). Eine MAC-Adresse ist länger: 48 Bit, geschrieben als 6 Hex-Paare wie 3C:22:FB:1A:9E:07. Jedes Paar ist ein Byte, 6 · 8 = 48.' },
        { id: 'c', text: '128 Bit', whyWrong: '128 Bit hat eine IPv6-Adresse (8 Blöcke à 16 Bit). Eine MAC-Adresse hat 48 Bit, also 6 Byte. Das sieht man an der Schreibweise: 6 Hex-Paare, jedes Paar ist ein Byte.' },
        { id: 'd', text: '64 Bit', whyWrong: '64 Bit kommt bei IPv6 vor: Die Interface-ID ist 64 Bit lang und wird per EUI-64 aus der 48-Bit-MAC gebildet (mit FFFE in der Mitte). Die Ethernet-MAC selbst hat 48 Bit.' },
      ],
      correct: 'a',
      explanation: '12 Hex-Ziffern × 4 Bit = 48 Bit. Die ersten 24 Bit sind der OUI (Hersteller).',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Was ist die **Ethernet-Broadcast-Adresse**?',
      options: [
        { id: 'a', text: 'FF:FF:FF:FF:FF:FF' },
        { id: 'b', text: '00:00:00:00:00:00', whyWrong: 'Eine MAC-Adresse aus lauter Nullen ist keine Broadcast-Adresse und wird als Ziel nicht verwendet. Broadcast heißt „an alle“, und dafür sind alle Bits auf 1 gesetzt. In Hex ist das FF:FF:FF:FF:FF:FF.' },
        { id: 'c', text: '255.255.255.255', whyWrong: '255.255.255.255 ist der IPv4-Broadcast (limited broadcast) auf Schicht 3, keine MAC-Adresse. Das erkennt man an der Schreibweise: 4 Dezimalzahlen mit Punkten. Der Ethernet-Broadcast auf Schicht 2 lautet FF:FF:FF:FF:FF:FF. Ein IPv4-Broadcast wird in einem Frame mit genau dieser Ziel-MAC verschickt.' },
        { id: 'd', text: '01:00:5E:00:00:01', whyWrong: '01:00:5E:… ist der Bereich für IPv4-Multicast-MACs. Hier: 224.0.0.1, die Gruppe „alle Hosts“. Multicast geht an eine Gruppe von Empfängern, die sich angemeldet haben. Broadcast geht an alle und hat die Adresse FF:FF:FF:FF:FF:FF.' },
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
        { id: 'b', text: 'Er verwirft den Frame, weil das Ziel unbekannt ist.', whyWrong: 'Ein Switch verwirft Frames mit unbekanntem Ziel nicht, sonst würde die erste Nachricht an ein neues Gerät nie ankommen. Er flutet den Frame an alle Ports im selben VLAN außer dem Eingangsport (unknown unicast flooding). Antwortet PC B, lernt der Switch dessen Port.' },
        { id: 'c', text: 'Er sendet einen ARP-Request für PC B.', whyWrong: 'ARP ist Aufgabe der Endgeräte und Router, die IP-Adressen kennen. Ein Layer-2-Switch kennt keine IP-Adressen und schickt darum auch keine ARP-Anfragen. Er flutet unbekannte Ziele einfach an alle Ports.' },
        { id: 'd', text: 'Er lernt die MAC von PC B.', whyWrong: 'Der Switch lernt immer die Quell-MAC eines eingehenden Frames. Hier hat PC A gesendet, also lernt der Switch: MAC von PC A sitzt an diesem Port. Die MAC von PC B lernt er erst, wenn PC B selbst einen Frame sendet, z. B. die Antwort.' },
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
        { id: 'b', text: 'Cat 6', whyWrong: 'Cat 6 schafft 10GBASE-T nur auf kurzen Strecken, je nach Umgebung bis etwa 37–55 m. Für 10 Gbit/s über die vollen 100 m braucht es Cat 6a, das für 500 MHz ausgelegt und besser gegen Übersprechen geschützt ist.' },
        { id: 'c', text: 'Cat 5e', whyWrong: 'Cat 5e ist für 1 Gbit/s (1000BASE-T) über 100 m spezifiziert. Für 10 Gbit/s reichen seine 100 MHz Bandbreite nicht. Bis 100 m braucht man dafür Cat 6a.' },
        { id: 'd', text: 'Cat 8', whyWrong: 'Cat 8 schafft zwar 25 oder 40 Gbit/s, aber nur bis 30 m. Es ist für kurze Verbindungen im Rechenzentrum gedacht, z. B. von Server zu Switch im selben Rack. Für 100 m ist Cat 8 nicht spezifiziert. Die Mindestanforderung erfüllt Cat 6a.' },
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
        { id: 'b', text: '0x86DD', whyWrong: '0x86DD ist der EtherType für IPv6. Der Empfänger liest das Typfeld, um zu wissen, welches Protokoll im Frame steckt. Für IPv4 steht dort 0x0800.' },
        { id: 'c', text: '0x0806', whyWrong: '0x0806 ist ARP, also die Anfrage „Wer hat IP X? Sag mir deine MAC“. ARP läuft direkt in Ethernet, nicht in IP. Ein IPv4-Paket trägt den EtherType 0x0800.' },
        { id: 'd', text: '0x8100', whyWrong: '0x8100 steht dort, wo sonst der EtherType steht, und zeigt an: Jetzt folgt ein 802.1Q-VLAN-Tag mit der VLAN-ID. Erst danach kommt der eigentliche EtherType, z. B. 0x0800 für IPv4.' },
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
        { id: 'b', text: 'Falsches VLAN', whyWrong: 'Ein falsches VLAN trennt das Gerät logisch vom Netz: Es erreicht die Zielgeräte gar nicht. Hier läuft die Verbindung, nur langsam, und die Fehlerzähler (CRC, Late Collisions) steigen. Das passt zu einem Duplex-Mismatch: eine Seite sendet Vollduplex, die andere erwartet Halbduplex.' },
        { id: 'c', text: 'Kabel zu kurz', whyWrong: 'Zu kurze Kabel sind in der Praxis kein Problem, schon ein 0,5-m-Patchkabel funktioniert einwandfrei. Late Collisions und CRC-Fehler bei langsamer Verbindung sind das typische Zeichen für einen Duplex-Mismatch.' },
        { id: 'd', text: 'IP-Adresskonflikt', whyWrong: 'Ein IP-Adresskonflikt ist ein Schicht-3-Problem: Verbindungen brechen ab oder Pakete landen beim falschen Gerät. Er erzeugt aber keine Schicht-1/2-Fehlerzähler wie CRC oder Late Collisions. Diese Zähler zeigen auf einen Duplex-Mismatch.' },
      ],
      correct: 'a',
      explanation: 'Der Switch spricht nicht mit, der PC erkennt die Gegenstelle per Autoneg nicht und fällt auf **Halbduplex** zurück. Lösung: beide Seiten auf Auto oder beide fest auf denselben Wert.',
    },
    {
      id: 'q9', type: 'single', difficulty: 1,
      prompt: 'Welcher PoE-Standard heißt **PoE+** und liefert bis zu 30 W pro Port?',
      options: [
        { id: 'a', text: 'IEEE 802.3at' },
        { id: 'b', text: 'IEEE 802.3af', whyWrong: '802.3af ist das ursprüngliche PoE von 2003 mit 15,4 W am Switch-Port (12,95 W kommen am Gerät an). Für Telefone reicht das, für Kameras mit Heizung oder starke APs nicht. PoE+ mit bis zu 30 W ist 802.3at.' },
        { id: 'c', text: 'IEEE 802.3bt', whyWrong: '802.3bt ist PoE++ (auch 4PPoE) und nutzt alle 4 Adernpaare. Typ 3 liefert bis 60 W, Typ 4 bis 90 W am Port. Gefragt war PoE+ mit 30 W, das ist 802.3at.' },
        { id: 'd', text: 'IEEE 802.11ax', whyWrong: '802.11ax gehört zur 802.11-Familie, den WLAN-Standards (Wi-Fi 6). Mit Strom über das Netzwerkkabel hat das nichts zu tun. PoE-Standards gehören zur Ethernet-Familie 802.3: af, at, bt.' },
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
        { id: 'd', text: 'Kann Endgeräte per PoE mit Strom versorgen', whyWrong: 'Glasfaser überträgt Licht und leitet keinen Strom. PoE braucht Kupferadern, über die neben den Daten auch Gleichstrom fließt. Ein Endgerät am Glasfaserkabel braucht darum eine eigene Stromversorgung. Gerade dass Glas nicht leitet, sorgt für die galvanische Trennung.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Weil Licht statt Strom übertragen wird, gibt es keine EMI und keine Erdschleifen. Deshalb nimmt man zwischen Gebäuden praktisch immer Glas.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Was macht **Auto-MDIX**?',
      options: [
        { id: 'a', text: 'Es erkennt automatisch, ob Sende- und Empfangsadern gekreuzt werden müssen.' },
        { id: 'b', text: 'Es handelt automatisch Geschwindigkeit und Duplex aus.', whyWrong: 'Geschwindigkeit und Duplex handelt Autonegotiation aus, ein eigenes Feature. Auto-MDIX klärt nur die Verkabelung: Es erkennt, ob Sende- und Empfangsadern gekreuzt werden müssen, und tauscht sie intern. Dann funktioniert jedes Kabel, gerade oder gekreuzt.' },
        { id: 'c', text: 'Es vergibt automatisch MAC-Adressen.', whyWrong: 'MAC-Adressen sind fest in der Netzwerkkarte gespeichert oder werden vom Betriebssystem gesetzt, z. B. zufällige MACs im WLAN. Auto-MDIX hat damit nichts zu tun. Es betrifft nur die Belegung der Adernpaare im Kabel.' },
        { id: 'd', text: 'Es schaltet PoE automatisch ein.', whyWrong: 'Ob ein Gerät PoE bekommt, erkennt der Switch über eine eigene Signaturmessung (Widerstand ca. 25 kΩ). Erst dann schaltet er Strom zu. Auto-MDIX betrifft nur die Sende- und Empfangsadern.' },
      ],
      correct: 'a',
      explanation: 'Mit Auto-MDIX funktioniert jedes Patchkabel, egal ob Straight-through oder Crossover. Gigabit-Ports unterstützen es praktisch immer.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Welcher Teil einer MAC-Adresse identifiziert den **Hersteller**?',
      options: [
        { id: 'a', text: 'Die ersten 24 Bit (OUI)' },
        { id: 'b', text: 'Die letzten 24 Bit', whyWrong: 'Die letzten 24 Bit vergibt der Hersteller selbst, wie eine Seriennummer für jede einzelne Netzwerkkarte. Am Hersteller erkennt man eine MAC an den ersten 24 Bit, dem OUI (Organizationally Unique Identifier).' },
        { id: 'c', text: 'Das erste Byte', whyWrong: 'Das erste Byte allein reicht nicht. Der OUI umfasst die ersten drei Bytes, also 24 Bit, z. B. 00:1A:2B. Im ersten Byte stecken außerdem zwei Steuerbits: Unicast/Multicast und global/lokal verwaltet.' },
        { id: 'd', text: 'Gar kein Teil', whyWrong: 'Die IEEE vergibt jedem Hersteller einen eigenen OUI. Über Datenbanken wie die IEEE-OUI-Liste findet man so den Hersteller einer MAC. Ausnahme: Lokal verwaltete und zufällige MACs (z. B. Handys im WLAN) haben keinen echten OUI.' },
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
        { id: 'b', text: '1518 Byte', whyWrong: '1518 Byte ist die Größe des ganzen Frames: 14 Byte Header (Ziel-MAC, Quell-MAC, Typ) + 1500 Byte Nutzlast + 4 Byte FCS. Die MTU zählt nur die Nutzlast, also den Platz für das IP-Paket: 1500 Byte.' },
        { id: 'c', text: '9000 Byte', whyWrong: '9000 Byte ist eine typische Größe für Jumbo Frames, z. B. für Speichernetze im Rechenzentrum. Sie müssen auf allen Geräten im Pfad extra eingeschaltet werden. Der Ethernet-Standard ohne Jumbo Frames erlaubt 1500 Byte Nutzlast.' },
        { id: 'd', text: '64 Byte', whyWrong: '64 Byte ist die Mindestgröße eines Ethernet-Frames. Kürzere Frames gelten als Fehler (Runts) und werden verworfen. Die Mindestgröße kommt aus der Kollisionserkennung. Die maximale Nutzlast (MTU) beträgt 1500 Byte.' },
      ],
      correct: 'a',
      explanation: '1500 Byte Nutzlast + 14 Byte Header + 4 Byte FCS = 1518 Byte.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Welchen Glasfaser-Stecker findest du am häufigsten an SFP/SFP+-Modulen?',
      options: [
        { id: 'a', text: 'LC (Duplex)' },
        { id: 'b', text: 'RJ45', whyWrong: 'RJ45 ist ein Kupferstecker für Twisted-Pair-Kabel und kein Glasfaserstecker. Es gibt zwar SFP-Module mit RJ45-Buchse (1000BASE-T), gefragt war aber der Glasfaserstecker. Der ist bei SFP und SFP+ fast immer LC-Duplex: klein, mit einer Faser zum Senden und einer zum Empfangen.' },
        { id: 'c', text: 'ST', whyWrong: 'ST ist ein älterer runder Glasfaserstecker mit Bajonettverschluss. Man findet ihn noch an alten Patchfeldern. Für die kleinen SFP-Module ist er zu groß. Dort sitzt der LC-Stecker.' },
        { id: 'd', text: 'BNC', whyWrong: 'BNC ist ein Bajonettstecker für Koaxialkabel, z. B. vom alten 10BASE2-Ethernet oder von Videokameras. Mit Glasfaser hat er nichts zu tun. An SFP-Modulen sind LC-Duplex-Stecker üblich.' },
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
        { id: 'd', text: 'Unicasts mit bekannter Ziel-MAC', whyWrong: 'Bei einer bekannten Ziel-MAC steht in der MAC-Tabelle, an welchem Port das Ziel hängt. Der Switch leitet den Frame dann nur dorthin weiter. Genau dieses gezielte Weiterleiten macht ihn effizienter als einen Hub. Fluten gibt es nur bei Broadcast, unbekanntem Unicast und Multicast ohne IGMP Snooping.' },
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
          { id: 'b', text: 'Cat 6a mit einem Repeater in der Mitte', whyWrong: 'Kupfer reicht nur 100 m, darum bräuchte man in der Mitte einen aktiven Zwischenpunkt mit Strom. Zwischen Gebäuden ist Kupfer außerdem riskant: Es verbindet unterschiedliche Erdpotentiale (Ausgleichsströme, Blitzschaden) und ist anfällig für elektromagnetische Störungen. Glasfaser hat diese Probleme nicht.' },
          { id: 'c', text: 'Multimode OM3 mit 10GBASE-SR', whyWrong: '10GBASE-SR ist für Multimode und kurze Strecken gedacht: etwa 300 m auf OM3, 400 m auf OM4. Für 800 m ist das zu kurz. Singlemode mit 10GBASE-LR schafft bis 10 km und ist die passende Wahl.' },
          { id: 'd', text: 'Cat 8', whyWrong: 'Cat 8 ist ein Kupferkabel für 25/40 Gbit/s und auf 30 m begrenzt. Für 800 m zwischen zwei Gebäuden ist es völlig ungeeignet. Dafür nimmt man Glasfaser.' },
        ],
        correct: 'a',
        explanation: '10GBASE-LR über Singlemode reicht bis 10 km, ist immun gegen EMI und trennt die Gebäude galvanisch.',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Die MAC-Adresse `3A:5F:12:9C:00:01` taucht im WLAN auf. Was sagt das zweite Hex-Zeichen **A** aus?',
        options: [
          { id: 'a', text: 'Die Adresse ist lokal verwaltet (z. B. eine zufällige/private MAC).' },
          { id: 'b', text: 'Es ist eine Multicast-Adresse.', whyWrong: 'Ob eine MAC Multicast ist, zeigt das niedrigste Bit des ersten Bytes (I/G-Bit). 0x3A ist binär 0011 1010, das letzte Bit ist 0. Also ist es Unicast. Das A steckt im zweitniedrigsten Bit (U/L-Bit), und das ist hier 1: lokal verwaltet.' },
          { id: 'c', text: 'Es ist eine Broadcast-Adresse.', whyWrong: 'Eine Broadcast-MAC besteht nur aus Einsen: FF:FF:FF:FF:FF:FF. 3A:5F:12:… ist eine normale Unicast-Adresse eines einzelnen Geräts. Das A an zweiter Stelle setzt das U/L-Bit: Die Adresse ist lokal verwaltet.' },
          { id: 'd', text: 'Das Gerät ist von Cisco.', whyWrong: 'Das zweite Zeichen A setzt das U/L-Bit und bedeutet: lokal verwaltet. Solche Adressen vergibt das Betriebssystem selbst, z. B. als zufällige private MAC im WLAN. Ein Hersteller-OUI steckt darin nicht, man kann also keinen Hersteller wie Cisco ablesen.' },
        ],
        correct: 'a',
        explanation: 'Erstes Byte 0x3A = 0011 10**1**0. Das zweitniedrigste Bit (U/L-Bit) = 1 bedeutet „locally administered“. Typisch für die MAC-Randomisierung von iOS, Android und Windows. Merke: Zweites Hex-Zeichen 2, 6, A oder E = lokal verwaltet.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        scenario: 'Ein 48-Port-Switch hat ein **PoE-Budget von 370 W**. Du willst 12 Access Points (je 25 W, PoE+) und 20 IP-Telefone (je 6 W) anschließen.',
        prompt: 'Reicht das Budget?',
        options: [
          { id: 'a', text: 'Ja, es bleiben sogar 50 W Reserve.', whyWrong: 'Hier wurde falsch gerechnet. Die Kameras brauchen 12 · 25 W = 300 W, die Telefone 20 · 6 W = 120 W, zusammen 420 W. Das Budget ist 370 W. Es fehlen also 50 W, es bleiben keine 50 W übrig. Der Switch würde einige Ports nach Priorität nicht versorgen.' },
          { id: 'b', text: 'Nein, 420 W werden benötigt – mehr als 370 W.' },
          { id: 'c', text: 'Ja, 300 W reichen.', whyWrong: '300 W sind nur die 12 Kameras. Die 20 Telefone mit je 6 W wurden vergessen: zusammen 120 W mehr. 300 + 120 = 420 W liegt über dem Budget von 370 W.' },
          { id: 'd', text: 'Ja, PoE-Budgets spielen keine Rolle.', whyWrong: 'PoE-Budgets spielen sehr wohl eine Rolle. Das Netzteil des Switches kann nur eine begrenzte Leistung auf alle Ports verteilen. Ist das Budget erschöpft, bekommen weitere Geräte keinen Strom. Welche zuerst leer ausgehen, bestimmt die Port-Priorität.' },
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
          { id: 'd', text: 'Die Tabelle enthält IP-Adressen.', whyWrong: 'Die MAC-Adresstabelle (CAM-Tabelle) eines Switches enthält nur MAC-Adresse, Port und VLAN. Die Zuordnung IP zu MAC steht in der ARP-Tabelle, und die führen Endgeräte, Router und Layer-3-Switches. Mit `show mac address-table` siehst du die eine, mit `show ip arp` die andere.' },
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
          { id: 'b', text: 'Das Kabel ist zu lang.', whyWrong: 'Ein zu langes Kabel schwächt das Signal. Typische Folgen sind CRC-Fehler, Link-Abbrüche oder eine niedrigere Geschwindigkeit. Frames werden dadurch aber nicht größer. Giants sind Frames über der eingestellten MTU, also passt der MTU-Mismatch.' },
          { id: 'c', text: 'Duplex-Mismatch', whyWrong: 'Ein Duplex-Mismatch zeigt sich durch Kollisionen, vor allem Late Collisions, sowie Runts und CRC-Fehler. Zu große Frames entstehen dabei nicht. Giants mit einer Gegenseite auf MTU 9000 sind das Zeichen dafür, dass Jumbo Frames nur auf einer Seite eingeschaltet sind.' },
          { id: 'd', text: 'Falscher EtherType', whyWrong: 'Der EtherType sagt nur, welches Protokoll im Frame steckt (z. B. 0x0800 = IPv4). Auf die Größe des Frames hat er keinen Einfluss. Giants entstehen, wenn ein Frame größer ist als die MTU des Empfängers, hier wegen MTU 9000 auf der Gegenseite.' },
        ],
        correct: 'a',
        explanation: 'Giants sind Frames größer als die erlaubte Maximalgröße. Die MTU muss auf dem gesamten Pfad gleich konfiguriert sein.',
      },
    ],
  },
};

export default level;
