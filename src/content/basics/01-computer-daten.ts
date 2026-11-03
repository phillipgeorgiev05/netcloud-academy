import type { Level } from '../../types/content';

const level: Level = {
  id: 'basics-01',
  track: 'basics',
  order: 1,
  title: 'Computer & Daten',
  titleEn: 'How Computers Work: Hardware, Binary, Units',
  summary: 'Woraus ein Computer besteht, was das Betriebssystem tut, wie Computer mit Nullen und Einsen rechnen, wie man Binär- und Hexadezimalzahlen liest und warum 1 KB nicht immer 1024 Byte sind.',
  certs: ['netplus', 'fisi'],
  domains: { netplus: '1', fisi: 'ap1' },
  lesson: [
    {
      heading: 'Was ein Computer tut: das EVA-Prinzip',
      body: `Jeder Computer, vom Smartphone bis zum Server, arbeitet nach dem **EVA-Prinzip**:
- **E**ingabe: Daten kommen herein (Tastatur, Maus, Mikrofon, Netzwerk)
- **V**erarbeitung: der Prozessor rechnet damit
- **A**usgabe: Ergebnisse gehen hinaus (Bildschirm, Lautsprecher, Drucker, Netzwerk)

Dazu kommt das **Speichern**: Daten werden für später abgelegt.

Ein Beispiel: Du tippst eine Webadresse ein (Eingabe). Der Computer schickt eine Anfrage über das Netz und baut die Seite zusammen (Verarbeitung). Die Seite erscheint auf dem Bildschirm (Ausgabe).

**Hardware** sind die Teile, die man anfassen kann. **Software** sind die Programme, die darauf laufen. Ohne Software ist Hardware nur ein Stück Metall, ohne Hardware kann Software nirgends laufen.`,
      analogy: 'Ein Computer ist wie eine Küche: Zutaten kommen herein (Eingabe), der Koch verarbeitet sie (Verarbeitung), der Teller geht raus (Ausgabe). Der Vorratsschrank ist der Speicher.',
      terms: [
        { de: 'EVA-Prinzip', en: 'input–process–output (IPO) model' },
        { de: 'Hardware', en: 'hardware' },
        { de: 'Software', en: 'software' },
      ],
      check: {
        id: 'c1', type: 'dragdrop', difficulty: 1,
        prompt: 'Ordne die Geräte dem EVA-Prinzip zu.',
        items: [
          { id: 'kb', text: 'Tastatur' },
          { id: 'cpu', text: 'Prozessor (CPU)' },
          { id: 'mon', text: 'Bildschirm' },
          { id: 'mic', text: 'Mikrofon' },
          { id: 'prn', text: 'Drucker' },
        ],
        buckets: [
          { id: 'e', label: 'Eingabe' },
          { id: 'v', label: 'Verarbeitung' },
          { id: 'a', label: 'Ausgabe' },
        ],
        solution: { kb: 'e', cpu: 'v', mon: 'a', mic: 'e', prn: 'a' },
        explanation: 'Tastatur und Mikrofon geben Daten hinein, die CPU verarbeitet, Bildschirm und Drucker geben aus.',
      },
    },
    {
      heading: 'Die Bauteile im Inneren',
      body: `| Bauteil | Aufgabe | Merkhilfe |
|---|---|---|
| **Prozessor (CPU)** | rechnet, führt Programme aus | das Gehirn |
| **Arbeitsspeicher (RAM)** | hält, woran gerade gearbeitet wird; **flüchtig**, beim Ausschalten leer | der Schreibtisch |
| **Massenspeicher (SSD/HDD)** | speichert dauerhaft Programme und Dateien | der Aktenschrank |
| **Mainboard** | verbindet alle Teile | das Straßennetz |
| **Grafikkarte (GPU)** | berechnet das Bild, auch KI-Aufgaben | der Maler |
| **Netzteil** | wandelt Steckdosenstrom in Gleichstrom für die Bauteile | das Kraftwerk |
| **Netzwerkkarte (NIC)** | verbindet mit dem Netzwerk (Kabel oder WLAN) | die Haustür |

**SSD oder HDD?** Eine **HDD** (Festplatte) speichert auf drehenden Magnetscheiben, ist günstig pro Terabyte, aber langsam und stoßempfindlich. Eine **SSD** speichert in Flash-Chips ohne bewegliche Teile und ist viel schneller. **NVMe**-SSDs hängen direkt am schnellen PCIe-Bus und sind nochmals deutlich schneller als SSDs mit SATA-Anschluss.

**Mehr RAM** hilft, wenn viele Programme gleichzeitig laufen. Reicht der RAM nicht, lagert das Betriebssystem auf die SSD aus, und alles wird langsam.

Beim Start lädt die **Firmware** (heute **UEFI**, früher BIOS) auf dem Mainboard das Betriebssystem von der SSD in den RAM.`,
      analogy: 'Der RAM ist dein Schreibtisch, die SSD dein Aktenschrank. Zum Arbeiten holst du Akten auf den Schreibtisch. Je größer der Tisch, desto mehr kannst du gleichzeitig offen haben. Abends (Ausschalten) wird der Tisch abgeräumt, der Schrank bleibt voll.',
      terms: [
        { de: 'Prozessor', en: 'central processing unit (CPU)' },
        { de: 'Arbeitsspeicher', en: 'random access memory (RAM)' },
        { de: 'Massenspeicher', en: 'storage (SSD/HDD)' },
        { de: 'Hauptplatine', en: 'mainboard / motherboard' },
        { de: 'Netzwerkkarte', en: 'network interface card (NIC)' },
        { de: 'Firmware', en: 'firmware (UEFI/BIOS)' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 1,
        prompt: 'Der Strom fällt aus. Welche Daten sind danach weg?',
        options: [
          { id: 'a', text: 'Was nur im Arbeitsspeicher (RAM) stand, z. B. ein ungespeichertes Dokument' },
          { id: 'b', text: 'Alles auf der SSD', whyWrong: 'SSDs speichern dauerhaft, auch ohne Strom. Gespeicherte Dateien sind nach dem Neustart wieder da. Verloren geht nur, was noch nicht gespeichert war und im flüchtigen RAM lag.' },
          { id: 'c', text: 'Das Betriebssystem', whyWrong: 'Das Betriebssystem ist auf der SSD installiert und wird bei jedem Start von dort neu in den RAM geladen. Ein Stromausfall löscht es nicht.' },
        ],
        correct: 'a',
        explanation: 'RAM ist flüchtig: Ohne Strom verliert er seinen Inhalt. SSD und HDD behalten ihre Daten.',
      },
    },
    {
      heading: 'Betriebssystem und Treiber',
      body: `Das **Betriebssystem** (operating system, OS) ist die wichtigste Software. Es
- verwaltet die Hardware (CPU-Zeit, RAM, Datenträger),
- startet Programme und trennt sie voneinander,
- verwaltet Dateien und Benutzer,
- stellt die Oberfläche bereit.

Bekannte Betriebssysteme: **Windows**, **macOS**, **Linux** (auf den meisten Servern und in der Cloud), **Android** und **iOS**.

**Treiber** (driver) sind kleine Programme, mit denen das Betriebssystem ein bestimmtes Gerät ansprechen kann, z. B. eine Grafikkarte oder einen Drucker. Fehlt der passende Treiber, funktioniert das Gerät nicht oder nur eingeschränkt.

**Anwendungen** (Apps) sind alle Programme, mit denen man etwas erledigt: Browser, Office, Spiele. Sie laufen auf dem Betriebssystem und nutzen dessen Dienste.

**Dateien** liegen in **Ordnern**. Wie sie auf dem Datenträger organisiert werden, regelt das **Dateisystem**: **NTFS** bei Windows, **ext4** bei Linux, **APFS** bei macOS, **FAT32/exFAT** auf USB-Sticks (von allen Systemen lesbar).`,
      terms: [
        { de: 'Betriebssystem', en: 'operating system (OS)' },
        { de: 'Treiber', en: 'device driver' },
        { de: 'Anwendung', en: 'application' },
        { de: 'Dateisystem', en: 'file system' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 1,
        prompt: 'Ein neuer Drucker wird erkannt, druckt aber nichts. Was fehlt am wahrscheinlichsten?',
        options: [
          { id: 'a', text: 'Der passende Treiber' },
          { id: 'b', text: 'Mehr Arbeitsspeicher', whyWrong: 'Drucken braucht kaum RAM. Wenn ein Gerät erkannt wird, aber nicht funktioniert, fehlt meist die Software, mit der das Betriebssystem es richtig ansprechen kann: der Treiber.' },
          { id: 'c', text: 'Ein neues Betriebssystem', whyWrong: 'Ein neues Betriebssystem ist ein riesiger Eingriff. Fast immer reicht es, den Treiber des Herstellers zu installieren.' },
        ],
        correct: 'a',
        explanation: 'Treiber übersetzen zwischen Betriebssystem und Gerät. Ohne den passenden Treiber kann Windows den Drucker nicht richtig steuern.',
      },
    },
    {
      heading: 'Bits und Bytes: Binärzahlen',
      diagram: 'game-binary',
      body: `Computer kennen intern nur zwei Zustände: Strom an oder aus, **1** oder **0**. Eine einzelne 0 oder 1 heißt **Bit**. **8 Bit = 1 Byte**.

Wir zählen im **Dezimalsystem** mit zehn Ziffern (0–9). Computer zählen im **Binärsystem** (Dualsystem) mit zwei Ziffern (0 und 1). Jede Stelle ist doppelt so viel wert wie die rechts daneben:
| Stelle | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|
| Bit | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |

\`11000000\` = 128 + 64 = **192**. Das ist z. B. die erste Zahl in der IP-Adresse 192.168.1.10.

**Dezimal → binär** (Beispiel 10): Von links prüfen, ob der Stellenwert hineinpasst.
- 128, 64, 32, 16 passen nicht → 0000
- 8 passt (Rest 2) → 1
- 4 passt nicht → 0
- 2 passt (Rest 0) → 1
- 1 passt nicht → 0
- Ergebnis: \`00001010\`

**Ein Byte** kann 2⁸ = **256** verschiedene Werte haben, von 0 bis 255. Darum liegt jede Zahl einer IPv4-Adresse zwischen 0 und 255.

**Hexadezimal** (Basis 16) nutzt 0–9 und A–F (A=10 … F=15). Eine Hex-Ziffer steht genau für 4 Bit, ein Byte für zwei Hex-Ziffern: \`FF\` = 255, \`C0\` = 192. Hex begegnet dir bei **MAC-Adressen** (\`3C:52:82:1A:F0:07\`), **IPv6** und Farben (\`#FF0000\` = Rot).`,
      analogy: 'Binärzahlen sind wie eine Reihe Lichtschalter. Jeder Schalter hat einen festen Wert (1, 2, 4, 8 …). Welche an sind, ergibt zusammengezählt die Zahl.',
      terms: [
        { de: 'Bit (Binärziffer)', en: 'bit (binary digit)' },
        { de: 'Byte', en: 'byte (8 bits)' },
        { de: 'Binärsystem / Dualsystem', en: 'binary' },
        { de: 'Hexadezimalsystem', en: 'hexadecimal (hex)' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Welche Dezimalzahl ist `10101000`?',
        options: [
          { id: 'a', text: '168' },
          { id: 'b', text: '170', whyWrong: '170 wäre `10101010`. Hier ist das Bit mit Wert 2 aber 0. Richtig: 128 + 32 + 8 = 168.' },
          { id: 'c', text: '84', whyWrong: '84 wäre `01010100`, alles um eine Stelle nach rechts verschoben. Die erste Stelle von links hat den Wert 128: 128 + 32 + 8 = 168.' },
          { id: 'd', text: '10101000', whyWrong: 'Das ist die Binärzahl selbst, nicht ihr Dezimalwert. Man addiert die Stellenwerte der Einsen: 128 + 32 + 8 = 168.' },
        ],
        correct: 'a',
        explanation: 'Einsen an den Stellen 128, 32 und 8: 128 + 32 + 8 = 168. Wie in 192.168.x.x.',
      },
    },
    {
      heading: 'Einheiten: KB, MB, GB – und KiB',
      body: `Für große Datenmengen nutzt man Vorsilben. Hier gibt es zwei Systeme, die oft verwechselt werden:
| Dezimal (SI) | Wert | Binär (IEC) | Wert |
|---|---|---|---|
| 1 **KB** (Kilobyte) | 1 000 Byte | 1 **KiB** (Kibibyte) | 1 024 Byte |
| 1 **MB** | 1 000 KB | 1 **MiB** | 1 024 KiB |
| 1 **GB** | 1 000 MB | 1 **GiB** | 1 024 MiB |
| 1 **TB** | 1 000 GB | 1 **TiB** | 1 024 GiB |

Festplattenhersteller rechnen dezimal, Windows zeigt binär an (schreibt aber „GB“). Darum zeigt Windows eine **1-TB-SSD** mit etwa **931 GB** an: 10¹² Byte ÷ 1024³ ≈ 931 GiB. Es fehlt nichts, es ist nur eine andere Einheit.

**Bit oder Byte?** Datenraten im Netzwerk gibt man in **Bit pro Sekunde** an (kleines **b**): 100 **Mbit/s** = 100 Mbps. Dateigrößen in **Byte** (großes **B**): 100 **MB**. Weil 1 Byte = 8 Bit, lädt eine 100-Mbit/s-Leitung höchstens etwa **12,5 MB pro Sekunde**.

**Rechenbeispiel:** Wie lange dauert eine 1-GB-Datei über 100 Mbit/s?
- 1 GB = 1 000 MB = 8 000 Mbit
- 8 000 Mbit ÷ 100 Mbit/s = **80 Sekunden** (in der Praxis etwas mehr wegen Protokoll-Overhead)`,
      terms: [
        { de: 'Datenrate', en: 'data rate / bandwidth' },
        { de: 'Bit pro Sekunde', en: 'bits per second (bit/s, bps)' },
        { de: 'Kibibyte', en: 'kibibyte (KiB)' },
      ],
      check: {
        id: 'c5', type: 'single', difficulty: 2,
        prompt: 'Du hast eine 250-Mbit/s-Leitung. Wie viele Megabyte pro Sekunde lädst du höchstens?',
        options: [
          { id: 'a', text: 'etwa 31 MB/s' },
          { id: 'b', text: '250 MB/s', whyWrong: 'Leitungen werden in Megabit angegeben, Dateien in Megabyte. 1 Byte = 8 Bit, also 250 ÷ 8 ≈ 31 MB/s.' },
          { id: 'c', text: '2000 MB/s', whyWrong: 'Hier wurde mit 8 multipliziert statt geteilt. Ein Byte besteht aus 8 Bit, also passen in 250 Mbit nur 250 ÷ 8 ≈ 31 MB.' },
          { id: 'd', text: 'etwa 244 MB/s', whyWrong: 'Das wäre die Umrechnung von MB in MiB (÷ 1,024). Entscheidend ist aber Bit gegen Byte: ÷ 8, also etwa 31 MB/s.' },
        ],
        correct: 'a',
        explanation: '250 Mbit/s ÷ 8 = 31,25 MB/s. Kleines b = Bit, großes B = Byte.',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Was ist Hardware?',
      options: [
        { id: 'a', text: 'Alle Teile eines Computers, die man anfassen kann' },
        { id: 'b', text: 'Alle Programme auf einem Computer', whyWrong: 'Programme sind Software. Hardware sind die greifbaren Teile wie Prozessor, RAM, SSD und Bildschirm.' },
        { id: 'c', text: 'Besonders schwer zu bedienende Software', whyWrong: '„Hard“ heißt hier nicht „schwer“, sondern „fest, greifbar“. Hardware sind die physischen Bauteile, Software die Programme.' },
        { id: 'd', text: 'Nur das Gehäuse', whyWrong: 'Das Gehäuse gehört dazu, aber Hardware umfasst alle physischen Teile: CPU, RAM, Mainboard, SSD, Netzteil, Bildschirm, Tastatur.' },
      ],
      correct: 'a',
      explanation: 'Hardware = physische Bauteile. Software = Programme, die darauf laufen.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 1,
      prompt: 'Welches Bauteil erledigt welche Aufgabe?',
      items: [
        { id: 'cpu', text: 'CPU' },
        { id: 'ram', text: 'RAM' },
        { id: 'ssd', text: 'SSD' },
        { id: 'nic', text: 'Netzwerkkarte' },
      ],
      buckets: [
        { id: 'calc', label: 'rechnet und führt Programme aus' },
        { id: 'work', label: 'hält die gerade benutzten Daten (flüchtig)' },
        { id: 'store', label: 'speichert dauerhaft' },
        { id: 'net', label: 'verbindet mit dem Netzwerk' },
      ],
      solution: { cpu: 'calc', ram: 'work', ssd: 'store', nic: 'net' },
      explanation: 'CPU rechnet, RAM ist der flüchtige Arbeitsplatz, SSD der dauerhafte Speicher, NIC die Verbindung zum Netz.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Ein PC wird sehr langsam, sobald viele Browser-Tabs und Programme offen sind. Welche Aufrüstung hilft am ehesten?',
      options: [
        { id: 'a', text: 'Mehr Arbeitsspeicher (RAM)' },
        { id: 'b', text: 'Ein stärkeres Netzteil', whyWrong: 'Das Netzteil liefert nur Strom. Solange es ausreicht, macht ein stärkeres den PC nicht schneller. Viele offene Programme brauchen vor allem mehr RAM.' },
        { id: 'c', text: 'Ein größerer Bildschirm', whyWrong: 'Ein größerer Bildschirm zeigt mehr an, rechnet aber nicht schneller. Wird der RAM knapp, lagert Windows auf die SSD aus, und das bremst. Mehr RAM verhindert das.' },
        { id: 'd', text: 'Eine größere HDD', whyWrong: 'Mehr Speicherplatz hilft, wenn die Platte voll ist. Langsamkeit bei vielen offenen Programmen liegt aber meist an zu wenig RAM. Eine HDD wäre außerdem langsamer als eine SSD.' },
      ],
      correct: 'a',
      explanation: 'Reicht der RAM nicht, lagert das Betriebssystem Daten auf die SSD aus (Auslagerungsdatei). Das ist viel langsamer als RAM.',
    },
    {
      id: 'q4', type: 'single', difficulty: 1,
      prompt: 'Welcher Speicher ist am schnellsten?',
      options: [
        { id: 'a', text: 'NVMe-SSD' },
        { id: 'b', text: 'HDD (Festplatte)', whyWrong: 'Eine HDD muss Scheiben drehen und einen Lesekopf bewegen. Sie ist von den drei Speichern mit Abstand am langsamsten, dafür günstig pro Terabyte.' },
        { id: 'c', text: 'SATA-SSD', whyWrong: 'SATA-SSDs sind viel schneller als HDDs, aber der SATA-Anschluss bremst sie auf etwa 550 MB/s. NVMe-SSDs hängen direkt an PCIe und schaffen ein Vielfaches.' },
      ],
      correct: 'a',
      explanation: 'HDD < SATA-SSD < NVMe-SSD. NVMe nutzt den schnellen PCIe-Bus.',
    },
    {
      id: 'q5', type: 'single', difficulty: 1,
      prompt: 'Was ist die Aufgabe des Betriebssystems?',
      options: [
        { id: 'a', text: 'Hardware verwalten, Programme starten, Dateien und Benutzer verwalten' },
        { id: 'b', text: 'Nur den Desktop-Hintergrund anzeigen', whyWrong: 'Die Oberfläche ist nur der sichtbare Teil. Im Hintergrund verteilt das Betriebssystem CPU-Zeit und RAM, steuert Geräte über Treiber und verwaltet Dateien und Rechte.' },
        { id: 'c', text: 'Den PC mit Strom versorgen', whyWrong: 'Strom liefert das Netzteil, also Hardware. Das Betriebssystem ist Software und verwaltet, was mit der Hardware passiert.' },
        { id: 'd', text: 'Das Internet bereitstellen', whyWrong: 'Den Internetzugang liefern Router und Provider. Das Betriebssystem stellt nur die Netzwerkfunktionen des PCs bereit, damit Programme das Netz nutzen können.' },
      ],
      correct: 'a',
      explanation: 'Das Betriebssystem ist der Vermittler zwischen Hardware und Anwendungen.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Welches Dateisystem nimmst du für einen USB-Stick, der an Windows, macOS und Linux funktionieren soll und Dateien über 4 GB speichern muss?',
      options: [
        { id: 'a', text: 'exFAT' },
        { id: 'b', text: 'FAT32', whyWrong: 'FAT32 läuft zwar überall, erlaubt aber nur Dateien bis knapp 4 GB. Ein großes Video oder ISO-Abbild passt nicht drauf. exFAT hat diese Grenze nicht.' },
        { id: 'c', text: 'NTFS', whyWrong: 'NTFS ist das Windows-Dateisystem. macOS kann es ohne Zusatzsoftware nur lesen, nicht beschreiben. Für den Austausch zwischen allen Systemen ist exFAT gedacht.' },
        { id: 'd', text: 'ext4', whyWrong: 'ext4 ist das Standard-Dateisystem von Linux. Windows und macOS können es ohne Zusatzsoftware nicht lesen.' },
      ],
      correct: 'a',
      explanation: 'exFAT: von allen großen Betriebssystemen lesbar und beschreibbar, ohne 4-GB-Grenze.',
    },
    {
      id: 'q7', type: 'single', difficulty: 1,
      prompt: 'Wie viele Bit hat ein Byte?',
      options: [
        { id: 'a', text: '8' },
        { id: 'b', text: '10', whyWrong: 'Die Zahl 10 kommt vom Dezimalsystem. Ein Byte besteht aus 8 Bit und kann damit 2⁸ = 256 Werte darstellen.' },
        { id: 'c', text: '1024', whyWrong: '1024 ist die Zahl der Byte in einem Kibibyte (KiB). Ein einzelnes Byte hat 8 Bit.' },
        { id: 'd', text: '16', whyWrong: '16 ist die Basis des Hexadezimalsystems. Ein Byte hat 8 Bit, das entspricht zwei Hex-Ziffern.' },
      ],
      correct: 'a',
      explanation: '1 Byte = 8 Bit, Werte von 0 bis 255.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Welche Dezimalzahl ist `11111111`?',
      options: [
        { id: 'a', text: '255' },
        { id: 'b', text: '256', whyWrong: 'Ein Byte hat 256 mögliche Werte, aber weil man bei 0 anfängt, ist der höchste 255. Alle acht Stellenwerte addiert: 128+64+32+16+8+4+2+1 = 255.' },
        { id: 'c', text: '128', whyWrong: '128 ist nur die erste Stelle (`10000000`). Wenn alle acht Bits 1 sind, addiert man alle Stellenwerte: 255.' },
        { id: 'd', text: '8', whyWrong: '8 ist die Anzahl der Einsen, nicht der Wert. Jede Eins steht für einen anderen Stellenwert: 128+64+32+16+8+4+2+1 = 255.' },
      ],
      correct: 'a',
      explanation: 'Alle acht Bits gesetzt = 255. Darum endet die Subnetzmaske 255.255.255.0 mit lauter Einsen in den ersten drei Bytes.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Wie lautet 10 als 8-Bit-Binärzahl?',
      options: [
        { id: 'a', text: '`00001010`' },
        { id: 'b', text: '`00010000`', whyWrong: '`00010000` ist 16 (nur das Bit mit Wert 16 gesetzt). 10 ist 8 + 2, also die Bits für 8 und 2: `00001010`.' },
        { id: 'c', text: '`00001100`', whyWrong: '`00001100` ist 8 + 4 = 12. Für 10 braucht man 8 + 2: `00001010`.' },
        { id: 'd', text: '`00000101`', whyWrong: '`00000101` ist 4 + 1 = 5, die Hälfte von 10. Ein Bit nach links verschoben ergibt 10: `00001010`.' },
      ],
      correct: 'a',
      explanation: '10 = 8 + 2 → Bits 8 und 2 gesetzt: 0000 1010.',
    },
    {
      id: 'q10', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne Hex- und Dezimalwerte zu.',
      items: [
        { id: 'ff', text: 'FF' },
        { id: 'a', text: 'A' },
        { id: 'x10', text: '10 (hex)' },
        { id: 'c0', text: 'C0' },
      ],
      buckets: [
        { id: 'd255', label: '255' },
        { id: 'd10', label: '10' },
        { id: 'd16', label: '16' },
        { id: 'd192', label: '192' },
      ],
      solution: { ff: 'd255', a: 'd10', x10: 'd16', c0: 'd192' },
      explanation: 'FF = 15·16 + 15 = 255, A = 10, 10 hex = 1·16 = 16, C0 = 12·16 = 192.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Wo begegnen dir Hexadezimalzahlen in der Netzwerktechnik?',
      options: [
        { id: 'a', text: 'In MAC-Adressen und IPv6-Adressen' },
        { id: 'b', text: 'In IPv4-Adressen wie 192.168.1.1', whyWrong: 'IPv4-Adressen schreibt man dezimal mit Punkten. Hex begegnet dir bei MAC-Adressen (`3C:52:82:1A:F0:07`) und IPv6 (`2001:db8::1`).' },
        { id: 'c', text: 'In Portnummern wie 443', whyWrong: 'Ports schreibt man dezimal (0–65535). Hex steht bei MAC- und IPv6-Adressen, weil dort je 4 Bit genau eine Ziffer ergeben.' },
        { id: 'd', text: 'Nirgends, Hex ist veraltet', whyWrong: 'Hex ist überall in der IT: MAC-Adressen, IPv6, Speicheradressen, Farben. Es ist die kompakteste lesbare Form von Binärdaten.' },
      ],
      correct: 'a',
      explanation: 'MAC: 48 Bit = 12 Hex-Ziffern. IPv6: 128 Bit = 32 Hex-Ziffern.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Windows zeigt eine neue 1-TB-SSD mit 931 GB an. Warum?',
      options: [
        { id: 'a', text: 'Hersteller rechnen mit 1000, Windows mit 1024. Es fehlt nichts.' },
        { id: 'b', text: 'Die SSD ist defekt.', whyWrong: 'Die Abweichung kommt durch die Umrechnung: 1 TB = 10¹² Byte, Windows teilt durch 1024³ und erhält etwa 931. Eine defekte SSD würde Fehler melden, nicht genau diesen Wert.' },
        { id: 'c', text: 'Windows hat 69 GB für sich reserviert.', whyWrong: 'Windows belegt zwar Platz, aber die angezeigte Gesamtgröße ist schon vor jeder Installation 931 GB. Es ist nur eine andere Einheit (GiB statt GB).' },
        { id: 'd', text: 'Der Hersteller hat betrogen.', whyWrong: 'Hersteller geben die Größe korrekt in dezimalen Terabyte an, so wie es das SI-System vorsieht. Windows zeigt binäre Einheiten, schreibt aber „GB“ statt „GiB“.' },
      ],
      correct: 'a',
      explanation: '10¹² Byte ÷ 1024³ ≈ 931 GiB. Windows schreibt nur „GB“ statt „GiB“.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Wie lange dauert eine 500-MB-Datei über eine 100-Mbit/s-Leitung (ohne Overhead)?',
      options: [
        { id: 'a', text: '40 Sekunden' },
        { id: 'b', text: '5 Sekunden', whyWrong: 'Hier wurden Megabyte und Megabit gleichgesetzt. 500 MB = 4000 Mbit, geteilt durch 100 Mbit/s = 40 Sekunden.' },
        { id: 'c', text: '0,625 Sekunden', whyWrong: 'Hier wurde durch 8 geteilt statt mit 8 multipliziert. Aus Byte werden Bit, indem man mit 8 multipliziert: 500 · 8 = 4000 Mbit, ÷ 100 = 40 s.' },
        { id: 'd', text: '400 Sekunden', whyWrong: 'Das wäre bei 10 Mbit/s. Bei 100 Mbit/s: 4000 Mbit ÷ 100 Mbit/s = 40 Sekunden.' },
      ],
      correct: 'a',
      explanation: '500 MB · 8 = 4000 Mbit. 4000 ÷ 100 = 40 s. Klassische Prüfungsrechnung.',
    },
    {
      id: 'q14', type: 'single', difficulty: 1,
      prompt: 'Was startet beim Einschalten zuerst und lädt dann das Betriebssystem?',
      options: [
        { id: 'a', text: 'Die Firmware (UEFI) auf dem Mainboard' },
        { id: 'b', text: 'Der Browser', whyWrong: 'Der Browser ist eine Anwendung und braucht ein laufendes Betriebssystem. Ganz am Anfang läuft die Firmware (UEFI), die das Betriebssystem lädt.' },
        { id: 'c', text: 'Der Treiber der Grafikkarte', whyWrong: 'Treiber lädt das Betriebssystem, also erst später. Vorher muss die Firmware das Betriebssystem überhaupt starten.' },
      ],
      correct: 'a',
      explanation: 'UEFI (früher BIOS) prüft die Hardware und startet den Bootloader des Betriebssystems.',
    },
    {
      id: 'q15', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen stimmen?',
      options: [
        { id: 'a', text: 'RAM verliert seinen Inhalt ohne Strom.' },
        { id: 'b', text: 'Netzwerkgeschwindigkeit gibt man in Bit pro Sekunde an.' },
        { id: 'c', text: 'Ein Byte kann 256 verschiedene Werte haben.' },
        { id: 'd', text: 'Eine Hex-Ziffer steht für 8 Bit.', whyWrong: 'Eine Hex-Ziffer steht für 4 Bit (16 Werte). Für ein Byte (8 Bit) braucht man zwei Hex-Ziffern, z. B. FF.' },
        { id: 'e', text: 'Eine SSD hat bewegliche Teile.', whyWrong: 'Bewegliche Teile (drehende Scheiben, Lesekopf) hat die HDD. Eine SSD speichert in Flash-Chips und ist dadurch schneller und stoßfest.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'RAM ist flüchtig, Netzwerk in bit/s, ein Byte hat 2⁸ = 256 Werte.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'single', difficulty: 3,
        prompt: 'Welche Dezimalzahl ist `11000000`, und wo kommt sie häufig vor?',
        options: [
          { id: 'a', text: '192, z. B. in privaten IP-Adressen wie 192.168.0.1' },
          { id: 'b', text: '96, z. B. in Subnetzmasken', whyWrong: '96 wäre `01100000`. Hier ist das erste Bit (Wert 128) gesetzt: 128 + 64 = 192.' },
          { id: 'c', text: '3, weil zwei Einsen gesetzt sind', whyWrong: 'Binär `11` wäre 3, aber nur, wenn die Einsen ganz rechts stünden. Hier stehen sie an den Stellen 128 und 64: 192.' },
          { id: 'd', text: '255, weil es ein ganzes Byte ist', whyWrong: '255 hätte alle acht Bits gesetzt. Hier sind nur die zwei vorderen gesetzt: 128 + 64 = 192.' },
        ],
        correct: 'a',
        explanation: '128 + 64 = 192. Private Netze beginnen oft mit 192.168.',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Ein Backup von 90 GB soll über eine 1-Gbit/s-Leitung kopiert werden. Wie lange dauert das mindestens?',
        options: [
          { id: 'a', text: '12 Minuten' },
          { id: 'b', text: '90 Sekunden', whyWrong: 'Hier wurden GB und Gbit gleichgesetzt. 90 GB = 720 Gbit. Bei 1 Gbit/s sind das 720 Sekunden = 12 Minuten.' },
          { id: 'c', text: '11,25 Sekunden', whyWrong: 'Hier wurde durch 8 geteilt statt mit 8 multipliziert. Byte → Bit heißt mal 8: 90 · 8 = 720 Gbit, also 720 s.' },
          { id: 'd', text: '2 Stunden', whyWrong: 'Das wäre bei etwa 100 Mbit/s. Bei 1 Gbit/s: 720 Gbit ÷ 1 Gbit/s = 720 s = 12 Minuten.' },
        ],
        correct: 'a',
        explanation: '90 GB · 8 = 720 Gbit. 720 Gbit ÷ 1 Gbit/s = 720 s = 12 min (ohne Overhead).',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        prompt: 'Was ist die wahrscheinlichste Ursache?',
        scenario: 'Ein Büro-PC (8 GB RAM, HDD) braucht 4 Minuten zum Starten. Im Task-Manager steht der Datenträger dauerhaft bei 100 % Auslastung, der Prozessor bei 15 %, der Arbeitsspeicher bei 60 %.',
        options: [
          { id: 'a', text: 'Die langsame HDD bremst. Ein Tausch gegen eine SSD bringt am meisten.' },
          { id: 'b', text: 'Der Prozessor ist zu schwach.', whyWrong: 'Die CPU ist nur zu 15 % ausgelastet, sie wartet also meist. Der Flaschenhals ist der Datenträger mit 100 %.' },
          { id: 'c', text: 'Es fehlt Arbeitsspeicher.', whyWrong: '60 % RAM-Auslastung lässt noch Luft. Mehr RAM würde wenig ändern. Der Datenträger bei 100 % ist der Engpass.' },
          { id: 'd', text: 'Die Netzwerkkarte ist defekt.', whyWrong: 'Eine defekte Netzwerkkarte stört die Verbindung, nicht den Start des lokalen Systems. Die Messwerte zeigen klar den Datenträger als Engpass.' },
        ],
        correct: 'a',
        explanation: 'Wer bei 100 % steht, ist der Flaschenhals. Eine SSD ist um ein Vielfaches schneller als eine HDD, besonders beim Start.',
      },
      {
        id: 'b4', type: 'multi', difficulty: 3,
        prompt: 'Welche Umrechnungen stimmen?',
        options: [
          { id: 'a', text: '1 KiB = 1024 Byte' },
          { id: 'b', text: '`FF` (hex) = 255 (dez) = `11111111` (bin)' },
          { id: 'c', text: '100 Mbit/s ≈ 12,5 MB/s' },
          { id: 'd', text: '1 KB = 1024 Byte nach SI-Norm', whyWrong: 'Nach SI-Norm ist „Kilo“ immer 1000. 1024 Byte heißt korrekt 1 KiB (Kibibyte). Im Alltag wird das aber oft vermischt.' },
          { id: 'e', text: '`A` (hex) = 11 (dez)', whyWrong: 'A ist 10, B ist 11, bis F = 15. Hex zählt 0–9 und dann A–F.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'KiB = 1024, FF = 255, Mbit ÷ 8 = MB. KB = 1000 (SI), A = 10.',
      },
      {
        id: 'b5', type: 'ordering', difficulty: 3,
        prompt: 'Bringe den Startvorgang eines PCs in die richtige Reihenfolge.',
        items: [
          { id: 'power', text: 'Netzteil versorgt die Bauteile mit Strom' },
          { id: 'uefi', text: 'Firmware (UEFI) prüft die Hardware' },
          { id: 'boot', text: 'Bootloader lädt das Betriebssystem von der SSD in den RAM' },
          { id: 'drv', text: 'Betriebssystem lädt Treiber und Dienste' },
          { id: 'login', text: 'Anmeldebildschirm erscheint' },
        ],
        explanation: 'Strom → UEFI → Bootloader → Betriebssystem mit Treibern → Anmeldung.',
      },
    ],
  },
};

export default level;
