import type { Level } from '../../types/content';

const level: Level = {
  id: 'basics-03',
  track: 'basics',
  order: 3,
  title: 'Das OSI-Modell',
  titleEn: 'The OSI Model and TCP/IP',
  summary: 'Die 7 Schichten des OSI-Modells mit Alltagsbeispielen, welche Geräte und Protokolle auf welcher Schicht arbeiten, wie Daten beim Senden verpackt werden (Kapselung) und wie das praxisnahe TCP/IP-Modell dazu passt.',
  certs: ['netplus', 'ccna', 'fisi'],
  domains: { netplus: '1', ccna: '1', fisi: 'ap1' },
  lesson: [
    {
      heading: 'Warum ein Schichtenmodell?',
      body: `Netzwerke sind kompliziert: Kabel, Funk, Adressen, Verschlüsselung, Apps. Damit Hersteller und Techniker nicht alles auf einmal bedenken müssen, teilt man die Aufgaben in **Schichten** (layers) auf.

Das bekannteste Modell ist das **OSI-Modell** (Open Systems Interconnection) mit **7 Schichten**. Jede Schicht hat genau eine Aufgabe und nutzt nur die Schicht direkt darunter.

**Vorteile:**
- **Austauschbar**: WLAN statt Kabel? Nur Schicht 1 und 2 ändern sich, die Apps merken nichts.
- **Herstellerunabhängig**: Ein Cisco-Switch und ein Netgear-Router verstehen sich, weil beide dieselben Regeln (Protokolle) je Schicht einhalten.
- **Fehlersuche**: Man prüft Schicht für Schicht, z. B. „Leuchtet die Link-LED?“ (1) bevor man DNS untersucht (7).

Ein **Protokoll** ist eine feste Regel, wie zwei Geräte auf derselben Schicht miteinander reden, z. B. HTTP oder IP.`,
      analogy: 'Wie beim Versenden eines Pakets: Du packst ein (App), schreibst die Adresse drauf (Netz), der Paketdienst sortiert (Router) und der Lkw fährt (Kabel). Jeder macht nur seinen Teil, und der Lkw-Fahrer muss nicht wissen, was im Paket ist.',
      terms: [
        { de: 'Schicht', en: 'layer' },
        { de: 'OSI-Modell', en: 'Open Systems Interconnection model' },
        { de: 'Protokoll', en: 'protocol' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Ein Büro stellt von Kabel auf WLAN um. Was muss an der Browser-App geändert werden?',
        options: [
          { id: 'a', text: 'Nichts, nur die unteren Schichten ändern sich.' },
          { id: 'b', text: 'Der Browser muss neu installiert werden.', whyWrong: 'Der Browser arbeitet auf Schicht 7 und weiß nicht, ob die Daten per Kabel oder Funk reisen. Genau das ist der Vorteil der Schichten.' },
          { id: 'c', text: 'Alle Webseiten müssen angepasst werden.', whyWrong: 'Webseiten liegen auf Servern und nutzen HTTP (Schicht 7). Ob dein Gerät per WLAN oder Kabel angeschlossen ist, spielt für sie keine Rolle.' },
        ],
        correct: 'a',
        explanation: 'Schichten sind austauschbar: Wechsel bei Schicht 1/2 betrifft die oberen Schichten nicht.',
      },
    },
    {
      heading: 'Die 7 Schichten',
      body: `Von unten (Kabel) nach oben (App):

| Nr. | Schicht | Aufgabe | Beispiel | Gerät |
|---|---|---|---|---|
| 7 | **Anwendung** (Application) | Dienste für Programme | HTTP, DNS, SMTP | – |
| 6 | **Darstellung** (Presentation) | Format, Zeichensatz, Verschlüsselung | UTF-8, JPEG, TLS | – |
| 5 | **Sitzung** (Session) | Verbindung auf- und abbauen | Sitzung einer Videokonferenz | – |
| 4 | **Transport** (Transport) | Ende-zu-Ende, Ports, Zuverlässigkeit | **TCP**, **UDP** | Firewall |
| 3 | **Vermittlung** (Network) | logische Adressen, Weg durchs Netz | **IP** | **Router** |
| 2 | **Sicherung** (Data Link) | Rahmen im lokalen Netz, MAC | Ethernet, WLAN | **Switch** |
| 1 | **Bitübertragung** (Physical) | Bits als Strom, Licht, Funk | Kabel, Stecker, Funk | Hub, Kabel |

**Merksatz** von Schicht 1 bis 7 (englisch): „**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way“ – Physical, Data Link, Network, Transport, Session, Presentation, Application.

Deutsch von 7 nach 1: „**A**lle **D**eutschen **S**chüler **T**rinken **V**erschiedene **S**orten **B**ier“ – Anwendung, Darstellung, Sitzung, Transport, Vermittlung, Sicherung, Bitübertragung.

In der Praxis sagt man oft nur „Layer 2“ oder „Layer 3“: Ein **Layer-2-Switch** arbeitet mit MAC-Adressen, ein **Layer-3-Gerät** (Router) mit IP-Adressen.`,
      terms: [
        { de: 'Anwendungsschicht', en: 'application layer' },
        { de: 'Transportschicht', en: 'transport layer' },
        { de: 'Vermittlungsschicht', en: 'network layer' },
        { de: 'Sicherungsschicht', en: 'data link layer' },
        { de: 'Bitübertragungsschicht', en: 'physical layer' },
      ],
      check: {
        id: 'c2', type: 'ordering', difficulty: 2,
        prompt: 'Ordne die Schichten von 1 (unten) bis 7 (oben).',
        items: [
          { id: 'l1', text: 'Bitübertragung (Physical)' },
          { id: 'l2', text: 'Sicherung (Data Link)' },
          { id: 'l3', text: 'Vermittlung (Network)' },
          { id: 'l4', text: 'Transport' },
          { id: 'l5', text: 'Sitzung (Session)' },
          { id: 'l6', text: 'Darstellung (Presentation)' },
          { id: 'l7', text: 'Anwendung (Application)' },
        ],
        explanation: 'Please Do Not Throw Sausage Pizza Away.',
      },
    },
    {
      heading: 'Kapselung: Daten werden verpackt',
      body: `Beim Senden wandern die Daten **von oben nach unten**. Jede Schicht setzt einen eigenen **Header** (Kopf) mit ihren Infos davor. Das nennt man **Kapselung** (encapsulation).

| Schicht | fügt hinzu | Name der Einheit (PDU) |
|---|---|---|
| 7–5 | die eigentlichen Daten | **Daten** |
| 4 | Ports (z. B. 443) | **Segment** (TCP) / Datagramm (UDP) |
| 3 | IP-Adressen | **Paket** |
| 2 | MAC-Adressen + Prüfsumme am Ende | **Rahmen** (Frame) |
| 1 | – | **Bits** |

Beim Empfänger läuft es **von unten nach oben**: Jede Schicht liest ihren Header, entfernt ihn und gibt den Rest nach oben weiter (**Entkapselung**).

Ein **Router** packt bis Schicht 3 aus, schaut auf die IP-Adresse und packt mit **neuen MAC-Adressen** für den nächsten Abschnitt wieder ein. Die IP-Adressen bleiben auf dem ganzen Weg gleich (ohne NAT).`,
      diagram: 'game-encapsulation',
      analogy: 'Wie russische Puppen: Der Brief (Daten) kommt in einen Umschlag mit Zimmernummer (Port), der in einen mit Anschrift (IP), der in eine Versandbox mit Lieferadresse zum nächsten Depot (MAC). Jedes Depot tauscht nur die äußere Box.',
      terms: [
        { de: 'Kapselung', en: 'encapsulation' },
        { de: 'Kopfteil', en: 'header' },
        { de: 'Protokolldateneinheit', en: 'protocol data unit (PDU)' },
        { de: 'Rahmen', en: 'frame' },
        { de: 'Segment', en: 'segment' },
      ],
      check: {
        id: 'c3', type: 'dragdrop', difficulty: 2,
        prompt: 'Wie heißt die Einheit auf welcher Schicht?',
        items: [
          { id: 'seg', text: 'Segment' },
          { id: 'pkt', text: 'Paket' },
          { id: 'frm', text: 'Rahmen (Frame)' },
          { id: 'bit', text: 'Bits' },
        ],
        buckets: [
          { id: 'l4', label: 'Schicht 4' },
          { id: 'l3', label: 'Schicht 3' },
          { id: 'l2', label: 'Schicht 2' },
          { id: 'l1', label: 'Schicht 1' },
        ],
        solution: { seg: 'l4', pkt: 'l3', frm: 'l2', bit: 'l1' },
        explanation: 'Segment – Paket – Rahmen – Bits. Merkhilfe: „Sie Packen Rahmen Bunt“.',
      },
    },
    {
      heading: 'TCP und UDP: zwei Arten zu transportieren',
      body: `Auf Schicht 4 gibt es zwei wichtige Protokolle:

| | **TCP** | **UDP** |
|---|---|---|
| Verbindung | wird vorher aufgebaut (**3-Wege-Handshake**: SYN, SYN-ACK, ACK) | keine, einfach losschicken |
| Zuverlässig? | ja, Verlorenes wird neu gesendet, Reihenfolge stimmt | nein |
| Tempo | etwas langsamer | schnell, wenig Overhead |
| typisch | Web (HTTP/HTTPS), E-Mail, Dateiübertragung | Video-Streaming live, Telefonie (VoIP), Online-Spiele, DNS-Anfragen |

**Ports** sagen, welches Programm gemeint ist. Die IP-Adresse ist das Haus, der Port die Wohnungstür:
| Port | Dienst |
|---|---|
| 22 | SSH |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3389 | RDP (Remotedesktop) |`,
      analogy: 'TCP ist ein Einschreiben mit Rückschein: Du weißt sicher, dass alles ankam. UDP ist eine Postkarte: schnell und billig, aber wenn eine verloren geht, merkt es niemand. Bei einem Telefonat ist ein kurz fehlendes Wort besser als eine Verzögerung.',
      terms: [
        { de: 'verbindungsorientiert', en: 'connection-oriented (TCP)' },
        { de: 'verbindungslos', en: 'connectionless (UDP)' },
        { de: 'Port', en: 'port' },
        { de: 'Drei-Wege-Handschlag', en: 'three-way handshake' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Welches Protokoll passt besser zu einem Videoanruf?',
        options: [
          { id: 'a', text: 'UDP, weil eine kleine Lücke besser ist als eine Verzögerung' },
          { id: 'b', text: 'TCP, weil kein Bild verloren gehen darf', whyWrong: 'Wenn TCP ein verlorenes Bild neu anfordert, kommt es zu spät an und das Gespräch stockt. Bei Echtzeit ist eine kurze Lücke weniger störend, darum UDP.' },
          { id: 'c', text: 'Egal, beide sind gleich', whyWrong: 'TCP wartet auf Bestätigungen und sendet neu, UDP nicht. Für Echtzeit-Audio und -Video ist UDP deutlich besser geeignet.' },
        ],
        correct: 'a',
        explanation: 'Echtzeit (Telefonie, Video, Spiele) nutzt UDP. Wo alles ankommen muss (Web, Dateien), nutzt man TCP.',
      },
    },
    {
      heading: 'Das TCP/IP-Modell',
      body: `Das OSI-Modell ist ein **Lernmodell**. Im echten Internet nutzt man das **TCP/IP-Modell** mit **4 Schichten**. Es fasst OSI-Schichten zusammen:

| TCP/IP | entspricht OSI | Beispiele |
|---|---|---|
| **Anwendung** | 5, 6, 7 | HTTP, DNS, SMTP, SSH |
| **Transport** | 4 | TCP, UDP |
| **Internet** | 3 | IP, ICMP (ping) |
| **Netzzugang** (Link) | 1, 2 | Ethernet, WLAN |

Manche Bücher zeigen eine 5-Schichten-Variante, die den Netzzugang in „Sicherung“ und „Bitübertragung“ teilt.

**Fehlersuche mit Schichten** (von unten nach oben):
1. Kabel steckt, LED leuchtet? → Schicht 1
2. Richtiges WLAN/VLAN, Switch-Port aktiv? → Schicht 2
3. IP-Adresse, Gateway, \`ping 8.8.8.8\` klappt? → Schicht 3
4. Port offen, Firewall lässt durch? → Schicht 4
5. DNS, Anmeldung, App selbst? → Schicht 7`,
      terms: [
        { de: 'TCP/IP-Modell', en: 'TCP/IP model' },
        { de: 'Netzzugangsschicht', en: 'link / network access layer' },
        { de: 'Fehlersuche von unten nach oben', en: 'bottom-up troubleshooting' },
      ],
      sources: [
        { title: 'RFC 1122 – Requirements for Internet Hosts', url: 'https://www.rfc-editor.org/rfc/rfc1122' },
        { title: 'RFC 9293 – Transmission Control Protocol (TCP)', url: 'https://www.rfc-editor.org/rfc/rfc9293' },
        { title: 'RFC 768 – User Datagram Protocol (UDP)', url: 'https://www.rfc-editor.org/rfc/rfc768' },
      ],
      check: {
        id: 'c5', type: 'single', difficulty: 2,
        prompt: 'Welche OSI-Schichten fasst die TCP/IP-Anwendungsschicht zusammen?',
        options: [
          { id: 'a', text: '5, 6 und 7' },
          { id: 'b', text: 'Nur 7', whyWrong: 'Im TCP/IP-Modell gibt es keine eigene Sitzungs- und Darstellungsschicht. Ihre Aufgaben übernimmt die Anwendung selbst, darum umfasst sie OSI 5 bis 7.' },
          { id: 'c', text: '1 und 2', whyWrong: 'OSI 1 und 2 entsprechen der Netzzugangsschicht ganz unten. Die Anwendungsschicht liegt oben und umfasst OSI 5 bis 7.' },
          { id: 'd', text: '3 und 4', whyWrong: 'OSI 3 entspricht der Internet-, OSI 4 der Transportschicht. Die Anwendungsschicht deckt OSI 5 bis 7 ab.' },
        ],
        correct: 'a',
        explanation: 'TCP/IP: Anwendung (5–7), Transport (4), Internet (3), Netzzugang (1–2).',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Wie viele Schichten hat das OSI-Modell?',
      options: [
        { id: 'a', text: '7' },
        { id: 'b', text: '4', whyWrong: '4 Schichten hat das TCP/IP-Modell. Das OSI-Modell unterteilt feiner in 7 Schichten.' },
        { id: 'c', text: '5', whyWrong: '5 Schichten hat die erweiterte TCP/IP-Variante mancher Lehrbücher. OSI hat 7.' },
        { id: 'd', text: '3', whyWrong: 'Schicht 3 ist die Vermittlungsschicht, nicht die Gesamtzahl. OSI hat 7 Schichten.' },
      ],
      correct: 'a',
      explanation: 'OSI = 7 Schichten, TCP/IP = 4.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 2,
      prompt: 'Auf welcher OSI-Schicht arbeitet das Gerät oder Protokoll hauptsächlich?',
      items: [
        { id: 'sw', text: 'Switch' },
        { id: 'rt', text: 'Router' },
        { id: 'tcp', text: 'TCP' },
        { id: 'http', text: 'HTTP' },
        { id: 'cab', text: 'Netzwerkkabel' },
      ],
      buckets: [
        { id: 'l1', label: 'Schicht 1' },
        { id: 'l2', label: 'Schicht 2' },
        { id: 'l3', label: 'Schicht 3' },
        { id: 'l4', label: 'Schicht 4' },
        { id: 'l7', label: 'Schicht 7' },
      ],
      solution: { cab: 'l1', sw: 'l2', rt: 'l3', tcp: 'l4', http: 'l7' },
      explanation: 'Kabel 1, Switch 2, Router 3, TCP 4, HTTP 7.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Auf welcher Schicht arbeiten IP-Adressen?',
      options: [
        { id: 'a', text: 'Schicht 3 – Vermittlung' },
        { id: 'b', text: 'Schicht 2 – Sicherung', whyWrong: 'Auf Schicht 2 arbeiten MAC-Adressen im lokalen Netz. IP-Adressen gehören zu Schicht 3, wo Router Wege zwischen Netzen finden.' },
        { id: 'c', text: 'Schicht 4 – Transport', whyWrong: 'Schicht 4 nutzt Ports (z. B. 443), um Programme zu unterscheiden. IP-Adressen sind Schicht 3.' },
        { id: 'd', text: 'Schicht 7 – Anwendung', whyWrong: 'Auf Schicht 7 arbeiten Dienste wie HTTP oder DNS. Die IP-Adresse ist die logische Adresse auf Schicht 3.' },
      ],
      correct: 'a',
      explanation: 'IP = Schicht 3, MAC = Schicht 2, Port = Schicht 4.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Was bedeutet Kapselung (encapsulation)?',
      options: [
        { id: 'a', text: 'Jede Schicht setzt beim Senden ihren Header vor die Daten der Schicht darüber.' },
        { id: 'b', text: 'Daten werden verschlüsselt.', whyWrong: 'Verschlüsselung (z. B. TLS) ist eine eigene Aufgabe. Kapselung heißt nur, dass jede Schicht ihre Steuerinfos als Header hinzufügt.' },
        { id: 'c', text: 'Daten werden komprimiert.', whyWrong: 'Komprimieren macht Daten kleiner. Kapselung macht sie sogar etwas größer, weil jede Schicht einen Header ergänzt.' },
        { id: 'd', text: 'Ein Kabel wird abgeschirmt.', whyWrong: 'Abschirmung (z. B. S/FTP-Kabel) schützt vor Störungen auf Schicht 1. Kapselung beschreibt das Verpacken der Daten durch alle Schichten.' },
      ],
      correct: 'a',
      explanation: 'Senden: Header hinzufügen (oben → unten). Empfangen: Header entfernen (unten → oben).',
    },
    {
      id: 'q5', type: 'ordering', difficulty: 2,
      prompt: 'Bring die Einheiten in die Reihenfolge, in der sie beim Senden entstehen.',
      items: [
        { id: 'd', text: 'Daten' },
        { id: 's', text: 'Segment' },
        { id: 'p', text: 'Paket' },
        { id: 'f', text: 'Rahmen' },
        { id: 'b', text: 'Bits' },
      ],
      explanation: 'Von oben nach unten: Daten → Segment → Paket → Rahmen → Bits.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Was ist ein Vorteil von TCP gegenüber UDP?',
      options: [
        { id: 'a', text: 'Verlorene Daten werden neu gesendet und kommen in der richtigen Reihenfolge an.' },
        { id: 'b', text: 'Es ist schneller.', whyWrong: 'TCP ist durch Handshake und Bestätigungen eher langsamer. Sein Vorteil ist die Zuverlässigkeit.' },
        { id: 'c', text: 'Es braucht keine Verbindung.', whyWrong: 'Umgekehrt: TCP baut per 3-Wege-Handshake eine Verbindung auf. UDP ist verbindungslos.' },
        { id: 'd', text: 'Es braucht keine IP-Adressen.', whyWrong: 'TCP läuft über IP (TCP/IP). Ohne IP-Adressen weiß das Netz nicht, wohin das Segment soll.' },
      ],
      correct: 'a',
      explanation: 'TCP = zuverlässig, UDP = schnell und schlank.',
    },
    {
      id: 'q7', type: 'dragdrop', difficulty: 2,
      prompt: 'TCP oder UDP? Ordne typische Anwendungen zu.',
      items: [
        { id: 'web', text: 'Webseite laden (HTTPS)' },
        { id: 'mail', text: 'E-Mail versenden' },
        { id: 'voip', text: 'Internettelefonie (VoIP)' },
        { id: 'game', text: 'Online-Spiel in Echtzeit' },
      ],
      buckets: [
        { id: 'tcp', label: 'TCP' },
        { id: 'udp', label: 'UDP' },
      ],
      solution: { web: 'tcp', mail: 'tcp', voip: 'udp', game: 'udp' },
      explanation: 'Alles muss ankommen → TCP. Echtzeit → UDP. (HTTP/3 nutzt QUIC über UDP, klassisch ist HTTPS aber TCP.)',
    },
    {
      id: 'q8', type: 'single', difficulty: 1,
      prompt: 'Welcher Port gehört zu HTTPS?',
      options: [
        { id: 'a', text: '443' },
        { id: 'b', text: '80', whyWrong: 'Port 80 ist unverschlüsseltes HTTP. HTTPS nutzt Port 443.' },
        { id: 'c', text: '22', whyWrong: 'Port 22 ist SSH für die Fernanmeldung an Servern. HTTPS nutzt 443.' },
        { id: 'd', text: '53', whyWrong: 'Port 53 ist DNS, die Namensauflösung. HTTPS läuft über 443.' },
      ],
      correct: 'a',
      explanation: 'HTTP 80, HTTPS 443, SSH 22, DNS 53, RDP 3389.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Was ändert ein Router an einem Paket, das er weiterleitet?',
      options: [
        { id: 'a', text: 'Die MAC-Adressen im Rahmen, die IP-Adressen bleiben gleich.' },
        { id: 'b', text: 'Die IP-Adressen, die MAC-Adressen bleiben gleich.', whyWrong: 'Umgekehrt: MAC-Adressen gelten nur im lokalen Abschnitt und werden bei jedem Router neu gesetzt. Die IP-Adressen von Quelle und Ziel bleiben (ohne NAT) gleich.' },
        { id: 'c', text: 'Nichts, er reicht es nur weiter.', whyWrong: 'Ein Router packt den Rahmen aus und baut für den nächsten Abschnitt einen neuen mit neuen MAC-Adressen. Er senkt auch die TTL im IP-Header.' },
        { id: 'd', text: 'Den Inhalt der Webseite.', whyWrong: 'Ein Router schaut nur bis Schicht 3. Was in den Daten steht (Schicht 7), verändert er nicht.' },
      ],
      correct: 'a',
      explanation: 'MAC = von Station zu Station, IP = von Ende zu Ende.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Auf welcher OSI-Schicht ordnet man Verschlüsselung und Zeichensätze (z. B. UTF-8) klassisch ein?',
      options: [
        { id: 'a', text: 'Schicht 6 – Darstellung' },
        { id: 'b', text: 'Schicht 5 – Sitzung', whyWrong: 'Die Sitzungsschicht baut Verbindungen zwischen Anwendungen auf und ab. Format, Zeichensatz und Verschlüsselung sind Aufgaben der Darstellungsschicht.' },
        { id: 'c', text: 'Schicht 2 – Sicherung', whyWrong: 'Schicht 2 sichert die Übertragung im lokalen Netz mit Rahmen und Prüfsumme. Das hat mit Zeichensätzen nichts zu tun.' },
        { id: 'd', text: 'Schicht 1 – Bitübertragung', whyWrong: 'Schicht 1 überträgt nur Bits als Signale. Was die Bits bedeuten (Zeichensatz, verschlüsselt oder nicht), regeln höhere Schichten.' },
      ],
      correct: 'a',
      explanation: 'Darstellung: „In welchem Format liegen die Daten vor?“ (Zeichensatz, Kompression, Verschlüsselung).',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Ein Kollege sagt: „Am PC leuchtet keine LED an der Netzwerkbuchse.“ Auf welcher Schicht suchst du zuerst?',
      options: [
        { id: 'a', text: 'Schicht 1 – Kabel, Stecker, Port' },
        { id: 'b', text: 'Schicht 3 – IP-Adresse', whyWrong: 'Ohne leuchtende Link-LED gibt es keine physische Verbindung. Eine korrekte IP nützt dann nichts. Zuerst Kabel und Port prüfen.' },
        { id: 'c', text: 'Schicht 7 – Browser', whyWrong: 'Wenn schon das Kabel keine Verbindung hat, kann kein Browser etwas laden. Fehlersuche beginnt unten bei Schicht 1.' },
      ],
      correct: 'a',
      explanation: 'Keine Link-LED = Schicht-1-Problem: Kabel, Stecker, Switch-Port, Netzwerkkarte.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Was passiert beim 3-Wege-Handshake?',
      options: [
        { id: 'a', text: 'Client und Server bauen mit SYN, SYN-ACK und ACK eine TCP-Verbindung auf.' },
        { id: 'b', text: 'Drei Router tauschen ihre Routen aus.', whyWrong: 'Routen tauschen Routingprotokolle wie OSPF aus. Der 3-Wege-Handshake ist der Aufbau einer TCP-Verbindung zwischen zwei Endpunkten.' },
        { id: 'c', text: 'Ein Gerät bekommt per DHCP eine IP-Adresse.', whyWrong: 'DHCP läuft in vier Schritten (Discover, Offer, Request, Acknowledge) über UDP. Der 3-Wege-Handshake gehört zu TCP.' },
        { id: 'd', text: 'Der Benutzer meldet sich dreimal an.', whyWrong: 'Der Handshake läuft automatisch zwischen den Geräten ab, ohne dass der Benutzer etwas tut.' },
      ],
      correct: 'a',
      explanation: 'SYN („Darf ich?“), SYN-ACK („Ja, du auch?“), ACK („Ja“). Danach fließen Daten.',
    },
    {
      id: 'q13', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die TCP/IP-Schichten den passenden OSI-Schichten zu.',
      items: [
        { id: 'app', text: 'Anwendung (TCP/IP)' },
        { id: 'tr', text: 'Transport (TCP/IP)' },
        { id: 'inet', text: 'Internet (TCP/IP)' },
        { id: 'link', text: 'Netzzugang (TCP/IP)' },
      ],
      buckets: [
        { id: 'o567', label: 'OSI 5–7' },
        { id: 'o4', label: 'OSI 4' },
        { id: 'o3', label: 'OSI 3' },
        { id: 'o12', label: 'OSI 1–2' },
      ],
      solution: { app: 'o567', tr: 'o4', inet: 'o3', link: 'o12' },
      explanation: 'Anwendung 5–7, Transport 4, Internet 3, Netzzugang 1–2.',
    },
    {
      id: 'q14', type: 'single', difficulty: 1,
      prompt: 'Wozu dienen Ports?',
      options: [
        { id: 'a', text: 'Sie unterscheiden die Programme/Dienste auf einem Gerät.' },
        { id: 'b', text: 'Sie unterscheiden die Geräte im Netz.', whyWrong: 'Geräte unterscheidet man über IP- bzw. MAC-Adressen. Ports sagen, welcher Dienst auf dem Gerät gemeint ist, z. B. Webserver (443) oder SSH (22).' },
        { id: 'c', text: 'Es sind die Buchsen am Switch.', whyWrong: 'Die Buchsen heißen auch „Ports“, aber auf Schicht 4 meint man Nummern von 0 bis 65535, die einen Dienst kennzeichnen.' },
      ],
      correct: 'a',
      explanation: 'IP-Adresse = Haus, Port = Wohnungstür.',
    },
    {
      id: 'q15', type: 'multi', difficulty: 2,
      prompt: 'Welche Vorteile bringt das Schichtenmodell?',
      options: [
        { id: 'a', text: 'Geräte verschiedener Hersteller arbeiten zusammen.' },
        { id: 'b', text: 'Eine Schicht kann ausgetauscht werden, ohne die anderen zu ändern.' },
        { id: 'c', text: 'Fehlersuche wird strukturiert (Schicht für Schicht).' },
        { id: 'd', text: 'Netzwerke werden automatisch schneller.', whyWrong: 'Das Modell ordnet die Aufgaben, es macht nichts schneller. Geschwindigkeit hängt von Kabel, Geräten und Auslastung ab.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Schichten = gemeinsame Sprache, Austauschbarkeit und strukturierte Fehlersuche.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Auf welcher Schicht liegt das Problem am wahrscheinlichsten?',
        scenario: 'Ein PC zeigt:\n```\nC:\\> ping 8.8.8.8\nAntwort von 8.8.8.8: Bytes=32 Zeit=14ms TTL=117\n\nC:\\> ping www.google.de\nPing-Anforderung konnte Host "www.google.de" nicht finden.\n```',
        options: [
          { id: 'a', text: 'Schicht 7 – die Namensauflösung (DNS) funktioniert nicht.' },
          { id: 'b', text: 'Schicht 1 – das Kabel ist defekt.', whyWrong: 'Der Ping an 8.8.8.8 kommt zurück, also sind Kabel, Switch und Router in Ordnung. Nur der Name wird nicht aufgelöst: DNS.' },
          { id: 'c', text: 'Schicht 3 – das Gateway fehlt.', whyWrong: 'Ohne Gateway käme der Ping an 8.8.8.8 (im Internet) nicht zurück. IP-Routing funktioniert, nur die Namensauflösung nicht.' },
          { id: 'd', text: 'Schicht 2 – der Switch ist defekt.', whyWrong: 'Mit defektem Switch käme gar kein Ping durch. Die IP-Verbindung steht, es hakt bei DNS (Schicht 7).' },
        ],
        correct: 'a',
        explanation: 'IP-Ping klappt (1–3 OK), Name nicht → DNS-Server falsch oder nicht erreichbar.',
      },
      {
        id: 'b2', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen zur Kapselung stimmen?',
        options: [
          { id: 'a', text: 'Ein Rahmen (Frame) enthält MAC-Adressen und am Ende eine Prüfsumme.' },
          { id: 'b', text: 'Ein Paket enthält Quell- und Ziel-IP-Adresse.' },
          { id: 'c', text: 'Ein TCP-Segment enthält Quell- und Zielport.' },
          { id: 'd', text: 'Beim Empfänger werden die Header von oben nach unten entfernt.', whyWrong: 'Beim Empfangen geht es von unten nach oben: Schicht 1 empfängt Bits, Schicht 2 entfernt den Rahmen, Schicht 3 den IP-Header und so weiter.' },
          { id: 'e', text: 'Die IP-Adressen werden an jedem Router ausgetauscht.', whyWrong: 'An jedem Router werden die MAC-Adressen ausgetauscht. Quell- und Ziel-IP bleiben auf dem Weg gleich, sofern kein NAT im Spiel ist.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Rahmen = MAC + FCS, Paket = IP, Segment = Ports. Empfangen = unten → oben.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        prompt: 'Was ist hier die Ursache?',
        scenario: 'Ein Webserver ist per `ping` erreichbar. Im Browser kommt nach einer Weile „Zeitüberschreitung“. Andere Webseiten laden normal. Der Admin hat gestern eine neue Firewall-Regel angelegt.',
        options: [
          { id: 'a', text: 'Die Firewall blockiert vermutlich den Port 443 (Schicht 4).' },
          { id: 'b', text: 'Das Netzwerkkabel des Clients ist defekt.', whyWrong: 'Andere Webseiten laden und der Ping zum Server klappt. Die physische Verbindung ist in Ordnung.' },
          { id: 'c', text: 'Die IP-Adresse des Servers ist falsch.', whyWrong: 'Der Ping an den Server kommt zurück, die Adresse stimmt also. Ping (ICMP) nutzt aber keine Ports, darum kann Port 443 trotzdem gesperrt sein.' },
          { id: 'd', text: 'Der Switch kennt die MAC-Adresse nicht.', whyWrong: 'Ein Switch lernt MAC-Adressen automatisch. Der Ping beweist, dass Schicht 2 und 3 funktionieren. Das Problem liegt bei Port und Firewall.' },
        ],
        correct: 'a',
        explanation: 'Ping (Schicht 3) geht, HTTPS (Port 443, Schicht 4) nicht → Firewall-Regel prüfen.',
      },
      {
        id: 'b4', type: 'ordering', difficulty: 3,
        prompt: 'Fehlersuche von unten nach oben: Bring die Prüfschritte in die richtige Reihenfolge.',
        items: [
          { id: 'led', text: 'Link-LED und Kabel prüfen' },
          { id: 'vlan', text: 'Switch-Port und VLAN prüfen' },
          { id: 'ip', text: 'IP-Adresse und Gateway prüfen, Gateway pingen' },
          { id: 'port', text: 'Port und Firewall prüfen' },
          { id: 'dns', text: 'DNS und Anwendung prüfen' },
        ],
        explanation: 'Schicht 1 → 2 → 3 → 4 → 7.',
      },
      {
        id: 'b5', type: 'single', difficulty: 3,
        prompt: 'Ein Switch, der zusätzlich zwischen VLANs routen kann, heißt …',
        options: [
          { id: 'a', text: 'Layer-3-Switch' },
          { id: 'b', text: 'Layer-1-Switch', whyWrong: 'Ein reines Schicht-1-Gerät ist ein Hub oder Repeater, er verstärkt nur Signale. Routing zwischen Netzen braucht Schicht 3.' },
          { id: 'c', text: 'Layer-7-Switch', whyWrong: 'Geräte, die bis Schicht 7 schauen, sind z. B. Load Balancer oder Web Application Firewalls. Routing zwischen VLANs ist Schicht 3.' },
          { id: 'd', text: 'Access Point', whyWrong: 'Ein Access Point bringt WLAN-Geräte ins Netz (Schicht 1/2). Routing zwischen VLANs macht ein Router oder ein Layer-3-Switch.' },
        ],
        correct: 'a',
        explanation: 'Layer-3-Switch = Switch + Routing (IP, Schicht 3).',
      },
    ],
  },
};

export default level;
