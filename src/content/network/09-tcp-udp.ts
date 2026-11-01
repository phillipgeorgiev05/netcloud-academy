import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-09',
  track: 'network',
  order: 9,
  title: 'TCP/UDP & Protokolle',
  titleEn: 'TCP, UDP, Ports, ICMP, Application Protocols',
  summary: 'Wie TCP zuverlässig überträgt (Handshake, Sequenznummern, Fenster), wann UDP besser ist, Ports und Sockets, ICMP mit ping und traceroute und alle wichtigen Anwendungsprotokolle mit ihren Ports.',
  certs: ['ccna', 'netplus'],
  domains: { ccna: '1', netplus: '1' },
  lab: {
    title: 'TCP-Handshake mit Wireshark ansehen',
    needs: 'Wireshark (kostenlos, wireshark.org) auf dem eigenen PC',
    steps: [
      'Starte Wireshark und wähle deine aktive Netzwerkkarte (WLAN oder Ethernet).',
      'Setze den Anzeigefilter `tcp.flags.syn == 1` und rufe im Browser eine Webseite auf.',
      'Suche ein Paket mit SYN, dann SYN-ACK, dann ACK zwischen deinem PC und dem Server (Rechtsklick → Folgen → TCP-Stream). Notiere die Ports: Dein PC nutzt einen hohen Port, der Server 443.',
      'Ändere den Filter auf `dns` und rufe eine neue Seite auf. Sieh dir Anfrage und Antwort an: UDP, Port 53, kein Handshake.',
      'Öffne eine Eingabeaufforderung und führe `netstat -an` (Windows) bzw. `ss -tuna` (Linux) aus. Finde Verbindungen im Zustand ESTABLISHED und offene Ports im Zustand LISTEN.',
      'Führe `tracert 8.8.8.8` aus und filtere in Wireshark nach `icmp`. Beobachte die steigende TTL und die „Time-to-live exceeded“-Antworten der Router.',
    ],
  },
  lesson: [
    {
      heading: 'Die Transportschicht: Ports und Sockets',
      body: `IP bringt ein Paket zum richtigen **Gerät**. Auf dem Gerät laufen aber viele Programme gleichzeitig: Browser, Mailprogramm, Teams. Die **Transportschicht** (Schicht 4) bringt die Daten zum richtigen **Programm**. Dafür gibt es **Ports**: Nummern von 0 bis 65535.

**Portbereiche:**
| Bereich | Name | Beispiel |
|---|---|---|
| 0–1023 | **Well-known Ports** (bekannte Ports) | 80 HTTP, 443 HTTPS, 22 SSH |
| 1024–49151 | **Registered Ports** (registrierte Ports) | 3389 RDP, 3306 MySQL |
| 49152–65535 | **Dynamische/private Ports** (ephemeral) | zufälliger Quellport des Clients |

**So sieht eine Verbindung aus:** Dein Browser öffnet eine Webseite.
- Quelle: 192.168.1.10, Port **51544** (zufällig gewählt)
- Ziel: 93.184.215.14, Port **443** (HTTPS)

Die Kombination aus IP-Adresse und Port heißt **Socket** (z. B. 192.168.1.10:51544). Eine Verbindung ist eindeutig durch **Quell-IP, Quellport, Ziel-IP, Zielport und Protokoll** (das „5-Tupel“). Darum kannst du zehn Tabs mit derselben Webseite öffnen: Jeder Tab hat einen anderen Quellport.

**Server** warten (**listen**) auf einem festen Port. **Clients** nehmen einen zufälligen hohen Port als Quelle.

Im IP-Header steht, welches Protokoll folgt (**Protokollnummer**): **ICMP = 1, TCP = 6, UDP = 17**, GRE = 47, ESP = 50, AH = 51. Das sind keine Ports.`,
      analogy: 'Die IP-Adresse ist die Hausadresse eines Bürogebäudes, der Port ist die Zimmernummer. Die Post bringt den Brief zum Gebäude (IP), am Empfang wird er ins richtige Zimmer (Programm) gebracht.',
      terms: [
        { de: 'Anschluss/Portnummer', en: 'port' },
        { de: 'Socket (IP + Port)', en: 'socket' },
        { de: 'flüchtiger Port', en: 'ephemeral port' },
        { de: 'Protokollnummer', en: 'protocol number' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Du rufst eine Webseite per HTTPS auf. Welcher Port ist der Zielport, welcher der Quellport?',
        options: [
          { id: 'a', text: 'Ziel 443, Quelle ein zufälliger hoher Port (z. B. 51544)' },
          { id: 'b', text: 'Ziel und Quelle 443', whyWrong: 'Der Client wählt als Quelle einen zufälligen dynamischen Port.' },
          { id: 'c', text: 'Ziel 80, Quelle 443', whyWrong: '80 ist HTTP ohne Verschlüsselung. Der Client nutzt keinen festen Quellport.' },
        ],
        correct: 'a',
        explanation: 'Server lauschen auf festen Ports, Clients nehmen dynamische Ports als Quelle.',
      },
    },
    {
      heading: 'TCP – zuverlässig und verbindungsorientiert',
      body: `**TCP** (Transmission Control Protocol) garantiert, dass alle Daten **vollständig, in der richtigen Reihenfolge und fehlerfrei** ankommen.

**Verbindungsaufbau: 3-Way-Handshake**
| Schritt | Flag | Bedeutung |
|---|---|---|
| 1 | **SYN** | Client: „Ich möchte verbinden, meine Startnummer ist x.“ |
| 2 | **SYN-ACK** | Server: „Einverstanden, meine Startnummer ist y, ich erwarte x+1.“ |
| 3 | **ACK** | Client: „Verstanden, ich erwarte y+1.“ |

Danach ist die Verbindung **ESTABLISHED** und Daten fließen.

**Verbindungsabbau:** Jede Seite sendet **FIN** und bekommt ein **ACK** (meist 4 Segmente: FIN, ACK, FIN, ACK). **RST** (Reset) bricht eine Verbindung sofort ab, z. B. wenn auf dem Zielport niemand lauscht.

**Wie TCP Zuverlässigkeit erreicht:**
- **Sequenznummern:** Jedes Byte ist nummeriert. Der Empfänger setzt die Daten in der richtigen Reihenfolge zusammen.
- **Bestätigungen (ACK):** Der Empfänger meldet, welches Byte er als Nächstes erwartet.
- **Neuübertragung (retransmission):** Bleibt das ACK aus, sendet der Absender die Daten erneut.
- **Prüfsumme (checksum):** erkennt beschädigte Segmente.

**Flusskontrolle mit dem Fenster (window):** Der Empfänger teilt mit, wie viele Bytes er ohne Bestätigung annehmen kann (**Window Size**). So kann der Absender mehrere Segmente am Stück senden, ohne auf jedes ACK zu warten. Ist der Empfänger überlastet, verkleinert er das Fenster. Dieses Verfahren heißt **Sliding Window** (gleitendes Fenster).

**Staukontrolle (congestion control):** Bei Paketverlust nimmt TCP an, dass das Netz überlastet ist, und sendet langsamer. Danach steigert es das Tempo wieder.

**MSS** (Maximum Segment Size): größte Datenmenge pro Segment, typisch 1460 Byte (1500 Byte MTU minus 20 Byte IP- und 20 Byte TCP-Header).

Der TCP-Header ist mindestens **20 Byte** groß.`,
      analogy: 'TCP ist wie ein Einschreiben mit Rückschein: Erst wird die Zustellung vereinbart, jedes Paket ist nummeriert, und für jedes kommt eine Bestätigung zurück. Fehlt eine, wird nachgeschickt.',
      terms: [
        { de: 'Drei-Wege-Handschlag', en: 'three-way handshake' },
        { de: 'Sequenznummer', en: 'sequence number' },
        { de: 'Bestätigung', en: 'acknowledgment (ACK)' },
        { de: 'Flusskontrolle / gleitendes Fenster', en: 'flow control / sliding window' },
        { de: 'Staukontrolle', en: 'congestion control' },
        { de: 'maximale Segmentgröße', en: 'maximum segment size (MSS)' },
      ],
      sources: [{ title: 'RFC 9293 – Transmission Control Protocol (TCP)', url: 'https://www.rfc-editor.org/rfc/rfc9293' }],
    },
    {
      heading: 'UDP – schnell und schlank',
      body: `**UDP** (User Datagram Protocol) verzichtet auf alles, was Zeit kostet:
- **kein Verbindungsaufbau**, kein Handshake
- **keine Bestätigungen**, keine Neuübertragung
- **keine Reihenfolge-Garantie**, keine Flusskontrolle
- Header nur **8 Byte** (Quellport, Zielport, Länge, Prüfsumme)

Klingt schlechter, ist aber oft genau richtig:
- **Echtzeit:** Sprache (VoIP), Video, Online-Spiele. Ein verspätetes Paket ist nutzlos, Neuübertragung käme zu spät. Lieber kurz ein Knacken als ständiges Stocken.
- **Kurze Anfragen:** DNS, DHCP, NTP, SNMP. Eine Frage, eine Antwort. Ein Handshake würde die Zeit verdoppeln. Geht etwas verloren, fragt die Anwendung einfach noch mal.
- **Broadcast/Multicast:** DHCP-Discover und Video-Multicast gehen an viele Empfänger. TCP funktioniert nur zwischen genau zwei Endpunkten.

Braucht eine UDP-Anwendung trotzdem Zuverlässigkeit, baut sie diese selbst ein. Beispiel: **QUIC** (die Basis von **HTTP/3**) läuft über **UDP 443** und bringt eigene Bestätigungen und Verschlüsselung mit.`,
      analogy: 'UDP ist wie eine Postkarte: einfach einwerfen, keine Bestätigung. Für „Grüße aus dem Urlaub“ völlig ausreichend und viel schneller als ein Einschreiben.',
      terms: [
        { de: 'verbindungslos', en: 'connectionless' },
        { de: 'Datagramm', en: 'datagram' },
      ],
      compare: {
        left: 'TCP',
        right: 'UDP',
        rows: [
          ['verbindungsorientiert (Handshake)', 'verbindungslos'],
          ['zuverlässig: ACK, Neuübertragung', 'keine Garantie'],
          ['Reihenfolge durch Sequenznummern', 'keine Reihenfolge'],
          ['Fluss- und Staukontrolle', 'keine'],
          ['Header ≥ 20 Byte', 'Header 8 Byte'],
          ['Web, E-Mail, SSH, Dateiübertragung', 'DNS, DHCP, VoIP, Video, NTP, SNMP'],
        ],
      },
      sources: [{ title: 'RFC 768 – User Datagram Protocol', url: 'https://www.rfc-editor.org/rfc/rfc768' }],
    },
    {
      heading: 'ICMP, ping und traceroute',
      body: `**ICMP** (Internet Control Message Protocol, IP-Protokoll 1) transportiert **Steuer- und Fehlermeldungen**. Es hat **keine Ports**.

Wichtige ICMP-Typen:
| Typ | Name | Wann |
|---|---|---|
| 8 | Echo Request | ping fragt |
| 0 | Echo Reply | ping-Antwort |
| 3 | Destination Unreachable | Ziel nicht erreichbar (Netz, Host oder Port) |
| 11 | Time Exceeded | TTL ist auf 0 gefallen |
| 5 | Redirect | Router kennt einen besseren Next Hop |

**ping** prüft, ob ein Ziel antwortet, und misst die **Umlaufzeit** (RTT, Round-Trip Time). Antwortet ein Ziel nicht, kann auch eine Firewall ICMP blockieren. Ein fehlender Ping beweist also nicht, dass das Gerät aus ist.

Typische ping-Ergebnisse:
- „Antwort von …“: alles gut
- „Zeitüberschreitung“ (Request timed out): keine Antwort, z. B. Firewall oder Ziel aus
- „Zielhost nicht erreichbar“ (Destination host unreachable): ein Router oder der eigene PC kennt keinen Weg bzw. bekommt keine ARP-Antwort

**traceroute** zeigt den **Weg** zum Ziel, Router für Router:
1. Erstes Paket mit **TTL 1**: Der erste Router verwirft es und meldet „Time Exceeded“. Damit kennt man Hop 1.
2. Dann TTL 2, TTL 3 … bis das Ziel antwortet.
- Windows: \`tracert\` (sendet ICMP Echo)
- Linux/macOS: \`traceroute\` (sendet standardmäßig UDP an hohe Ports)
- Cisco: \`traceroute\`
- Sternchen (\`* * *\`): Dieser Hop antwortet nicht (oft gefiltert). Geht es danach weiter, ist das kein Fehler.

**pathping** (Windows) und **mtr** (Linux) kombinieren beides und zeigen den Paketverlust pro Hop.`,
      terms: [
        { de: 'Umlaufzeit', en: 'round-trip time (RTT)' },
        { de: 'Ziel nicht erreichbar', en: 'destination unreachable' },
        { de: 'Zeit überschritten', en: 'time exceeded' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Wie findet traceroute heraus, welche Router auf dem Weg liegen?',
        options: [
          { id: 'a', text: 'Es sendet Pakete mit TTL 1, 2, 3 … und wertet die „Time Exceeded“-Meldungen der Router aus.' },
          { id: 'b', text: 'Es fragt jeden Router nach seiner Routingtabelle.', whyWrong: 'traceroute hat keinen Zugriff auf Routingtabellen.' },
          { id: 'c', text: 'Es liest die Route aus dem DNS.', whyWrong: 'DNS kennt keine Netzwerkpfade, nur Namen und Adressen.' },
        ],
        correct: 'a',
        explanation: 'Jeder Router verringert die TTL. Bei 0 schickt er ICMP Typ 11 zurück und verrät damit seine Adresse.',
      },
      sources: [{ title: 'RFC 792 – Internet Control Message Protocol', url: 'https://www.rfc-editor.org/rfc/rfc792' }],
    },
    {
      heading: 'Anwendungsprotokolle und ihre Ports',
      body: `Diese Tabelle ist **Pflichtwissen** für Network+ und CCNA. Lerne sie mit dem Trainer und den Fragen unten.

| Port | Protokoll | Transport | Zweck |
|---|---|---|---|
| 20/21 | FTP | TCP | Dateiübertragung (21 Steuerung, 20 Daten), Klartext |
| 22 | SSH / SFTP / SCP | TCP | sichere Fernwartung und Dateiübertragung |
| 23 | Telnet | TCP | Fernwartung im Klartext (veraltet) |
| 25 | SMTP | TCP | E-Mail zwischen Mailservern |
| 53 | DNS | UDP/TCP | Namensauflösung |
| 67/68 | DHCP | UDP | Adressvergabe (Server 67, Client 68) |
| 69 | TFTP | UDP | einfache Dateiübertragung ohne Anmeldung |
| 80 | HTTP | TCP | Web unverschlüsselt |
| 110 | POP3 | TCP | Mails abholen (werden meist vom Server gelöscht) |
| 123 | NTP | UDP | Zeit |
| 143 | IMAP | TCP | Mails auf dem Server verwalten |
| 161/162 | SNMP | UDP | Überwachung (162 = Traps) |
| 389 | LDAP | TCP | Verzeichnisdienst (z. B. Active Directory) |
| 443 | HTTPS | TCP (HTTP/3: UDP) | Web verschlüsselt mit TLS |
| 445 | SMB | TCP | Windows-Dateifreigaben |
| 514 | Syslog | UDP | Logmeldungen |
| 587 | SMTP Submission | TCP | Mail vom Client an den Server senden (mit STARTTLS) |
| 636 | LDAPS | TCP | LDAP über TLS |
| 993 | IMAPS | TCP | IMAP über TLS |
| 995 | POP3S | TCP | POP3 über TLS |
| 1433 | Microsoft SQL Server | TCP | Datenbank |
| 3306 | MySQL | TCP | Datenbank |
| 3389 | RDP | TCP (auch UDP) | Windows-Remotedesktop |
| 5060/5061 | SIP | UDP/TCP (5061 TLS) | Aufbau von VoIP-Anrufen |

**E-Mail im Überblick:**
- **Senden:** Client → Server mit SMTP (Port 587), Server → Server mit SMTP (Port 25)
- **Abholen:** **IMAP** lässt die Mails auf dem Server und synchronisiert alle Geräte (Handy und PC sehen dasselbe). **POP3** lädt sie auf ein Gerät herunter.

**TLS** (Transport Layer Security, Nachfolger von SSL) verschlüsselt Verbindungen. Der Server weist sich mit einem **Zertifikat** aus, das eine vertrauenswürdige Zertifizierungsstelle (CA) unterschrieben hat. Aktuelle Versionen: **TLS 1.2 und 1.3**. SSL und TLS 1.0/1.1 gelten als unsicher.

**Offene Ports prüfen:** \`netstat -an\` (Windows), \`ss -tuna\` (Linux) zeigt Verbindungen und lauschende Ports. \`Test-NetConnection server -Port 443\` (PowerShell) prüft, ob ein Port erreichbar ist.`,
      analogy: 'Ports sind wie die festen Schalter in einem Amt: Schalter 25 für ausgehende Post, Schalter 443 für vertrauliche Gespräche. Jeder weiß, wo er hingehen muss.',
      terms: [
        { de: 'Transportschichtsicherheit', en: 'Transport Layer Security (TLS)' },
        { de: 'Zertifizierungsstelle', en: 'certificate authority (CA)' },
        { de: 'Verzeichnisdienst', en: 'directory service (LDAP)' },
        { de: 'Dateifreigabe', en: 'file share (SMB)' },
      ],
      sources: [
        { title: 'IANA – Service Name and Transport Protocol Port Number Registry', url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml' },
        { title: 'RFC 8446 – TLS 1.3', url: 'https://www.rfc-editor.org/rfc/rfc8446' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'ordering', difficulty: 1,
      prompt: 'Bringe den TCP-Verbindungsaufbau in die richtige Reihenfolge.',
      items: [
        { id: 'syn', text: 'Client sendet SYN' },
        { id: 'synack', text: 'Server antwortet mit SYN-ACK' },
        { id: 'ack', text: 'Client sendet ACK' },
        { id: 'data', text: 'Daten werden übertragen' },
      ],
      explanation: '3-Way-Handshake: SYN → SYN-ACK → ACK. Danach ist die Verbindung ESTABLISHED.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 1,
      prompt: 'Welches Transportprotokoll passt besser?',
      items: [
        { id: 'web', text: 'Webseite laden' },
        { id: 'voip', text: 'Telefonat über VoIP' },
        { id: 'dns', text: 'DNS-Abfrage' },
        { id: 'ssh', text: 'SSH-Fernwartung' },
        { id: 'stream', text: 'Live-Videostream' },
        { id: 'file', text: 'Datei auf Netzlaufwerk kopieren' },
      ],
      buckets: [
        { id: 'tcp', label: 'TCP' },
        { id: 'udp', label: 'UDP' },
      ],
      solution: { web: 'tcp', voip: 'udp', dns: 'udp', ssh: 'tcp', stream: 'udp', file: 'tcp' },
      explanation: 'Wo jedes Byte zählen muss: TCP. Wo Tempo wichtiger ist als Vollständigkeit oder es um kurze Anfragen geht: UDP. (HTTP/3 nutzt zwar UDP, bringt über QUIC aber eigene Zuverlässigkeit mit.)',
    },
    {
      id: 'q3', type: 'multi', difficulty: 2,
      prompt: 'Welche Mechanismen machen TCP zuverlässig?',
      options: [
        { id: 'a', text: 'Sequenznummern' },
        { id: 'b', text: 'Bestätigungen (ACK) und Neuübertragung' },
        { id: 'c', text: 'Prüfsumme' },
        { id: 'd', text: 'Verschlüsselung der Nutzdaten', whyWrong: 'TCP verschlüsselt nicht. Das macht TLS darüber.' },
        { id: 'e', text: 'Die TTL im TCP-Header', whyWrong: 'Die TTL steht im IP-Header und hat mit Zuverlässigkeit nichts zu tun.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Sequenznummern (Reihenfolge), ACKs mit Neuübertragung (Vollständigkeit) und Prüfsumme (Fehlerfreiheit). Dazu Fluss- und Staukontrolle.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Was regelt die TCP-Window-Size?',
      options: [
        { id: 'a', text: 'Wie viele Bytes der Sender ohne Bestätigung senden darf (Flusskontrolle)' },
        { id: 'b', text: 'Wie lange ein Paket im Netz leben darf', whyWrong: 'Das ist die TTL im IP-Header.' },
        { id: 'c', text: 'Die maximale Größe eines Ethernet-Rahmens', whyWrong: 'Das ist die MTU auf Schicht 2.' },
        { id: 'd', text: 'Wie viele Verbindungen ein Server annimmt', whyWrong: 'Das Fenster gilt pro Verbindung und steuert die Datenmenge.' },
      ],
      correct: 'a',
      explanation: 'Der Empfänger meldet seine Window Size. Ist er überlastet, verkleinert er sie, und der Sender wird langsamer (Sliding Window).',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Ein Client sendet ein SYN an Port 8080 eines Servers. Dort läuft kein Dienst, und keine Firewall ist dazwischen. Was antwortet der Server?',
      options: [
        { id: 'a', text: 'Ein TCP-Segment mit RST-Flag' },
        { id: 'b', text: 'SYN-ACK', whyWrong: 'SYN-ACK kommt nur, wenn ein Dienst auf dem Port lauscht.' },
        { id: 'c', text: 'Gar nichts', whyWrong: 'Ohne Firewall antwortet das Betriebssystem mit einem Reset. Schweigen deutet eher auf eine Firewall hin.' },
        { id: 'd', text: 'FIN', whyWrong: 'FIN beendet eine bestehende Verbindung. Hier gab es noch keine.' },
      ],
      correct: 'a',
      explanation: 'RST heißt „Port geschlossen“. Keine Antwort (Timeout) heißt meist „gefiltert“ (Firewall verwirft).',
    },
    {
      id: 'q6', type: 'single', difficulty: 1,
      prompt: 'Welcher Portbereich gehört zu den Well-known Ports?',
      options: [
        { id: 'a', text: '0–1023' },
        { id: 'b', text: '1024–49151', whyWrong: 'Das sind die Registered Ports.' },
        { id: 'c', text: '49152–65535', whyWrong: 'Das sind die dynamischen (ephemeral) Ports für Clients.' },
        { id: 'd', text: '0–65535', whyWrong: 'Das ist der gesamte Portbereich.' },
      ],
      correct: 'a',
      explanation: 'Well-known 0–1023, Registered 1024–49151, dynamisch 49152–65535 (laut IANA).',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Warum nutzt VoIP für die Sprachdaten UDP statt TCP?',
      options: [
        { id: 'a', text: 'Ein neu übertragenes Sprachpaket käme zu spät. Kurze Lücken stören weniger als Verzögerung.' },
        { id: 'b', text: 'UDP verschlüsselt automatisch.', whyWrong: 'UDP verschlüsselt nicht. Dafür gibt es SRTP.' },
        { id: 'c', text: 'UDP ist zuverlässiger als TCP.', whyWrong: 'Umgekehrt: UDP hat keine Bestätigungen und keine Neuübertragung.' },
        { id: 'd', text: 'TCP kann keine Audiodaten übertragen.', whyWrong: 'TCP kann jede Art von Daten übertragen, nur mit Verzögerung bei Verlusten.' },
      ],
      correct: 'a',
      explanation: 'Bei Echtzeit zählt geringe Verzögerung (Latenz) mehr als Vollständigkeit.',
    },
    {
      id: 'q8', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Protokolle ihren Ports zu.',
      items: [
        { id: 'http', text: 'HTTP' },
        { id: 'https', text: 'HTTPS' },
        { id: 'smtp', text: 'SMTP (Server zu Server)' },
        { id: 'rdp', text: 'RDP' },
        { id: 'smb', text: 'SMB' },
        { id: 'ldap', text: 'LDAP' },
      ],
      buckets: [
        { id: '80', label: '80' },
        { id: '443', label: '443' },
        { id: '25', label: '25' },
        { id: '3389', label: '3389' },
        { id: '445', label: '445' },
        { id: '389', label: '389' },
      ],
      solution: { http: '80', https: '443', smtp: '25', rdp: '3389', smb: '445', ldap: '389' },
      explanation: 'Diese Ports kommen in Prüfungen und im Firewall-Alltag ständig vor.',
    },
    {
      id: 'q9', type: 'dragdrop', difficulty: 3,
      prompt: 'Ordne die verschlüsselten Varianten ihren Ports zu.',
      items: [
        { id: 'imaps', text: 'IMAPS' },
        { id: 'pop3s', text: 'POP3S' },
        { id: 'ldaps', text: 'LDAPS' },
        { id: 'sub', text: 'SMTP Submission (Client sendet Mail)' },
        { id: 'sips', text: 'SIP über TLS' },
      ],
      buckets: [
        { id: '993', label: '993' },
        { id: '995', label: '995' },
        { id: '636', label: '636' },
        { id: '587', label: '587' },
        { id: '5061', label: '5061' },
      ],
      solution: { imaps: '993', pop3s: '995', ldaps: '636', sub: '587', sips: '5061' },
      explanation: 'IMAP 143 → IMAPS 993, POP3 110 → POP3S 995, LDAP 389 → LDAPS 636, SIP 5060 → SIPS 5061. Mailprogramme senden über 587 mit STARTTLS.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Eine Nutzerin liest ihre Mails auf Handy, Tablet und PC und will überall dieselben Ordner und Gelesen-Markierungen sehen. Welches Protokoll passt?',
      options: [
        { id: 'a', text: 'IMAP' },
        { id: 'b', text: 'POP3', whyWrong: 'POP3 lädt die Mails meist auf ein Gerät und löscht sie auf dem Server. Andere Geräte sehen sie dann nicht.' },
        { id: 'c', text: 'SMTP', whyWrong: 'SMTP verschickt Mails, zum Lesen ist es nicht da.' },
        { id: 'd', text: 'SNMP', whyWrong: 'SNMP dient der Geräteüberwachung, nicht der E-Mail.' },
      ],
      correct: 'a',
      explanation: 'IMAP lässt die Mails auf dem Server und synchronisiert den Zustand über alle Geräte.',
    },
    {
      id: 'q11', type: 'single', difficulty: 1,
      prompt: 'Welches Protokoll nutzt ping?',
      options: [
        { id: 'a', text: 'ICMP (Echo Request und Echo Reply)' },
        { id: 'b', text: 'TCP Port 7', whyWrong: 'Der alte Echo-Dienst auf Port 7 ist nicht ping. ping nutzt ICMP ohne Ports.' },
        { id: 'c', text: 'UDP Port 53', whyWrong: 'Port 53 ist DNS.' },
        { id: 'd', text: 'ARP', whyWrong: 'ARP findet MAC-Adressen im lokalen Netz.' },
      ],
      correct: 'a',
      explanation: 'ICMP Typ 8 (Echo Request) und Typ 0 (Echo Reply). ICMP hat keine Ports.',
    },
    {
      id: 'q12', type: 'scenario', difficulty: 2,
      prompt: 'Was bedeuten die Sternchen bei Hop 3?',
      scenario: '```\nC:\\> tracert 8.8.8.8\n  1    1 ms    1 ms    1 ms  192.168.1.1\n  2    9 ms    8 ms    9 ms  100.64.0.1\n  3     *        *        *     Zeitüberschreitung der Anforderung.\n  4   14 ms   13 ms   14 ms  142.250.160.1\n  5   14 ms   14 ms   14 ms  8.8.8.8\n```',
      options: [
        { id: 'a', text: 'Router 3 beantwortet keine traceroute-Pakete (gefiltert), leitet aber weiter. Kein Problem.' },
        { id: 'b', text: 'Router 3 ist ausgefallen.', whyWrong: 'Dann kämen die Hops 4 und 5 nicht an.' },
        { id: 'c', text: 'Das Ziel ist nicht erreichbar.', whyWrong: '8.8.8.8 antwortet in Hop 5.' },
        { id: 'd', text: 'Die DNS-Auflösung ist fehlgeschlagen.', whyWrong: 'tracert zeigt hier IP-Adressen. Die Sternchen betreffen ICMP-Antworten.' },
      ],
      correct: 'a',
      explanation: 'Viele Provider-Router senden kein „Time Exceeded“ oder drosseln es. Wichtig ist, ob es danach weitergeht.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Welcher ICMP-Typ meldet, dass die TTL eines Pakets auf 0 gefallen ist?',
      options: [
        { id: 'a', text: 'Typ 11 – Time Exceeded' },
        { id: 'b', text: 'Typ 3 – Destination Unreachable', whyWrong: 'Typ 3 meldet, dass ein Netz, Host oder Port nicht erreichbar ist.' },
        { id: 'c', text: 'Typ 0 – Echo Reply', whyWrong: 'Typ 0 ist die Antwort auf einen ping.' },
        { id: 'd', text: 'Typ 5 – Redirect', whyWrong: 'Redirect schlägt einen besseren Next Hop vor.' },
      ],
      correct: 'a',
      explanation: 'Typ 11 ist die Grundlage von traceroute.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Welche Protokollnummern stehen im IP-Header für ICMP, TCP und UDP?',
      options: [
        { id: 'a', text: 'ICMP 1, TCP 6, UDP 17' },
        { id: 'b', text: 'ICMP 0, TCP 80, UDP 53', whyWrong: 'Das verwechselt Protokollnummern mit Ports.' },
        { id: 'c', text: 'ICMP 8, TCP 6, UDP 17', whyWrong: '8 ist der ICMP-Typ Echo Request, nicht die Protokollnummer.' },
        { id: 'd', text: 'ICMP 1, TCP 17, UDP 6', whyWrong: 'TCP und UDP sind vertauscht.' },
      ],
      correct: 'a',
      explanation: 'Weitere: GRE 47, ESP 50, AH 51 (IPsec), OSPF 89. Firewalls filtern danach.',
    },
    {
      id: 'q15', type: 'multi', difficulty: 2,
      prompt: 'Welche Protokolle übertragen Zugangsdaten im **Klartext** und sollten ersetzt werden?',
      options: [
        { id: 'a', text: 'Telnet' },
        { id: 'b', text: 'FTP' },
        { id: 'c', text: 'HTTP (bei Anmeldeformularen)' },
        { id: 'd', text: 'SSH', whyWrong: 'SSH verschlüsselt die gesamte Sitzung.' },
        { id: 'e', text: 'LDAPS', whyWrong: 'LDAPS ist LDAP über TLS, also verschlüsselt.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Ersatz: Telnet → SSH, FTP → SFTP oder FTPS, HTTP → HTTPS.',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Welche TLS-Versionen gelten heute als sicher?',
      options: [
        { id: 'a', text: 'TLS 1.2 und TLS 1.3' },
        { id: 'b', text: 'SSL 3.0 und TLS 1.0', whyWrong: 'Beide haben bekannte Schwachstellen und sind abgeschaltet bzw. veraltet.' },
        { id: 'c', text: 'Alle, solange ein Zertifikat vorhanden ist', whyWrong: 'Alte Versionen sind auch mit gültigem Zertifikat angreifbar.' },
        { id: 'd', text: 'Nur SSL 2.0', whyWrong: 'SSL 2.0 ist seit Langem unsicher und verboten (RFC 6176).' },
      ],
      correct: 'a',
      explanation: 'TLS 1.0 und 1.1 sind offiziell veraltet (RFC 8996). TLS 1.3 ist schneller und sicherer.',
    },
    {
      id: 'q17', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Prüfe in PowerShell, ob der Server **fs01** auf **Port 445** (SMB) erreichbar ist.',
      template: 'PS C:\\> {{0}}',
      blanks: [{ accept: ['Test-NetConnection fs01 -Port 445', 'test-netconnection -computername fs01 -port 445', 'tnc fs01 -port 445'] }],
      explanation: '`Test-NetConnection` zeigt `TcpTestSucceeded : True`, wenn der Port antwortet. Gut, um Firewall-Probleme von Dienstproblemen zu unterscheiden.',
    },
    {
      id: 'q18', type: 'single', difficulty: 3,
      prompt: 'Auf einem Link mit MTU 1500 Byte – wie groß ist die typische TCP-MSS (IPv4, ohne Optionen)?',
      options: [
        { id: 'a', text: '1460 Byte' },
        { id: 'b', text: '1500 Byte', whyWrong: 'Davon gehen noch IP- und TCP-Header ab.' },
        { id: 'c', text: '1480 Byte', whyWrong: 'Das zieht nur den IP-Header ab. Der TCP-Header (20 Byte) fehlt.' },
        { id: 'd', text: '1518 Byte', whyWrong: 'Das ist die maximale Ethernet-Rahmengröße inklusive Header und FCS.' },
      ],
      correct: 'a',
      explanation: '1500 − 20 (IPv4) − 20 (TCP) = 1460 Byte Nutzdaten pro Segment.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: 'Nutzer können die interne Webanwendung `crm.firma.local` nicht öffnen. Gehe die Schichten durch.',
        steps: [
          {
            id: 's1', text: '`ping crm.firma.local` liefert Antworten von 10.0.5.20. Was ist damit bewiesen?',
            options: [
              { id: 'a', text: 'DNS funktioniert und der Server ist auf Schicht 3 erreichbar.', correct: true, feedback: 'Richtig. Name aufgelöst, Antwort kommt zurück. Das Problem liegt höher.' },
              { id: 'b', text: 'Die Webanwendung läuft.', correct: false, feedback: 'ping prüft nur ICMP. Ob der Webdienst läuft, sagt es nicht.' },
              { id: 'c', text: 'Nichts, ping ist unzuverlässig.', correct: false, feedback: 'Eine Antwort beweist sehr wohl Namensauflösung und IP-Erreichbarkeit.' },
            ],
          },
          {
            id: 's2', text: 'Was prüfst du als Nächstes?',
            options: [
              { id: 'a', text: '`Test-NetConnection crm.firma.local -Port 443`', correct: true, feedback: 'Genau. Jetzt die Transportschicht: Antwortet der Dienstport?' },
              { id: 'b', text: '`ipconfig /renew`', correct: false, feedback: 'Die IP-Konfiguration funktioniert, der Ping ging ja durch.' },
              { id: 'c', text: 'Das Netzwerkkabel tauschen', correct: false, feedback: 'Schicht 1 ist in Ordnung, sonst ginge kein Ping.' },
            ],
          },
          {
            id: 's3', text: 'Ergebnis: `TcpTestSucceeded : False`. Auf dem Server zeigt `netstat -an | findstr :443` **keine** Zeile mit LISTENING. Was ist die Ursache?',
            options: [
              { id: 'a', text: 'Der Webserver-Dienst lauscht nicht auf Port 443 (gestoppt oder abgestürzt).', correct: true, feedback: 'Richtig. Kein LISTENING = kein Programm wartet auf diesem Port.' },
              { id: 'b', text: 'Die Firewall des Clients blockiert ausgehend 443.', correct: false, feedback: 'Der Server selbst zeigt, dass niemand auf 443 lauscht. Das ist die Ursache.' },
              { id: 'c', text: 'DNS zeigt auf den falschen Server.', correct: false, feedback: 'Der richtige Server antwortet, nur der Dienst fehlt.' },
            ],
          },
        ],
        explanation: 'Bottom-up: Name/IP (ping) → Port (Test-NetConnection) → Dienst auf dem Server (netstat LISTENING). Jede Stufe grenzt die Ursache weiter ein.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        prompt: 'Ein Mitschnitt zeigt wiederholt dieses Muster. Was passiert?',
        scenario: '```\n10.0.0.5:50122 → 10.0.9.9:1433  [SYN]\n10.0.0.5:50122 → 10.0.9.9:1433  [SYN]  (Retransmission)\n10.0.0.5:50122 → 10.0.9.9:1433  [SYN]  (Retransmission)\n```',
        options: [
          { id: 'a', text: 'Der SQL-Server antwortet nicht, vermutlich verwirft eine Firewall die Pakete.' },
          { id: 'b', text: 'Der Port ist geschlossen und der Server sendet RST.', whyWrong: 'Dann sähe man ein RST zurück, nicht wiederholte SYNs ohne Antwort.' },
          { id: 'c', text: 'Die Verbindung ist aufgebaut und überträgt Daten.', whyWrong: 'Es gibt weder SYN-ACK noch ACK. Der Handshake kommt nie zustande.' },
          { id: 'd', text: 'Der Client nutzt UDP statt TCP.', whyWrong: 'SYN ist ein TCP-Flag.' },
        ],
        correct: 'a',
        explanation: 'SYN ohne Antwort = gefiltert (Firewall verwirft still). SYN → RST = Port geschlossen. SYN → SYN-ACK = Port offen.',
      },
      {
        id: 'b3', type: 'multi', difficulty: 3,
        prompt: 'Eine Firewall soll nur das Nötigste erlauben. Welche Regeln braucht ein Client, um Webseiten per Namen aufzurufen (inkl. HTTP/3)?',
        options: [
          { id: 'a', text: 'UDP 53 zum DNS-Server (und TCP 53 für große Antworten)' },
          { id: 'b', text: 'TCP 443 ins Internet' },
          { id: 'c', text: 'UDP 443 ins Internet' },
          { id: 'd', text: 'TCP 3389 ins Internet', whyWrong: 'RDP wird zum Surfen nicht gebraucht und sollte nie pauschal offen sein.' },
          { id: 'e', text: 'UDP 69 ins Internet', whyWrong: 'TFTP hat beim Surfen nichts verloren.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'DNS für die Namensauflösung, TCP 443 für HTTPS, UDP 443 für HTTP/3 (QUIC). Ohne UDP 443 fallen Browser auf TCP zurück. HTTP (80) nur noch, wenn es nötig ist.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Ein Server hat 50.000 gleichzeitige Verbindungen auf Port 443. Wie unterscheidet er sie?',
        options: [
          { id: 'a', text: 'Über das 5-Tupel: Quell-IP, Quellport, Ziel-IP, Zielport, Protokoll' },
          { id: 'b', text: 'Jede Verbindung bekommt einen eigenen Serverport.', whyWrong: 'Der Serverport bleibt 443. Unterschiedlich sind die Client-Seiten.' },
          { id: 'c', text: 'Über die MAC-Adressen der Clients', whyWrong: 'MAC-Adressen sieht der Server nur vom letzten Router, nicht von den Clients im Internet.' },
          { id: 'd', text: 'Über die TTL', whyWrong: 'Die TTL sinkt unterwegs und taugt nicht zur Unterscheidung.' },
        ],
        correct: 'a',
        explanation: 'Jede Verbindung ist durch die Kombination beider Sockets eindeutig. Darum reicht ein Serverport für beliebig viele Clients.',
      },
      {
        id: 'b5', type: 'dragdrop', difficulty: 3,
        prompt: 'Ordne die Dienste dem Transportprotokoll zu, das sie hauptsächlich nutzen.',
        items: [
          { id: 'dhcp', text: 'DHCP' },
          { id: 'tftp', text: 'TFTP' },
          { id: 'snmp', text: 'SNMP' },
          { id: 'smtp', text: 'SMTP' },
          { id: 'ssh', text: 'SSH' },
          { id: 'ldap', text: 'LDAP' },
          { id: 'ntp', text: 'NTP' },
          { id: 'smb', text: 'SMB' },
        ],
        buckets: [
          { id: 'tcp', label: 'TCP' },
          { id: 'udp', label: 'UDP' },
        ],
        solution: { dhcp: 'udp', tftp: 'udp', snmp: 'udp', smtp: 'tcp', ssh: 'tcp', ldap: 'tcp', ntp: 'udp', smb: 'tcp' },
        explanation: 'Kurze Anfrage-Antwort-Dienste und Broadcasts (DHCP, TFTP, SNMP, NTP): UDP. Sitzungen und Datenübertragung (SMTP, SSH, LDAP, SMB): TCP.',
      },
    ],
  },
};

export default level;
