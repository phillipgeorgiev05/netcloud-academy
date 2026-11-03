import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-02',
  track: 'network',
  order: 2,
  title: 'OSI- & TCP/IP-Modell',
  titleEn: 'OSI & TCP/IP Model, Encapsulation',
  summary: 'Die 7 OSI-Schichten, das 4-Schichten-TCP/IP-Modell, PDUs und wie Daten beim Senden eingepackt (Kapselung) werden.',
  certs: ['ccna', 'netplus', 'fisi'],
  domains: { ccna: '1', netplus: '1', fisi: 'ap1' },
  lesson: [
    {
      heading: 'Warum Schichtenmodelle?',
      body: `Netzwerkkommunikation ist komplex. Schichtenmodelle teilen sie in Aufgaben auf. Jede Schicht nutzt die Dienste der darunterliegenden und bietet der darüberliegenden Dienste an. Dadurch kann man z. B. WLAN gegen Kabel tauschen, ohne dass der Browser es merkt.

Das **OSI-Modell** (7 Schichten) ist ein Referenzmodell zum Erklären und Troubleshooten. Das **TCP/IP-Modell** (4 Schichten) beschreibt, was im Internet tatsächlich läuft.`,
      analogy: 'Wie eine Firma: Der Chef schreibt einen Brief (Anwendung), die Sekretärin tütet ein (Darstellung), die Poststelle adressiert (Netzwerk), der Bote trägt ihn (Bitübertragung). Keiner muss den Job des anderen kennen.',
    },
    {
      heading: 'Die 7 OSI-Schichten',
      body: `| Nr. | Schicht | Englisch | PDU | Beispiele |
|---|---|---|---|---|
| 7 | Anwendung | Application | Daten | HTTP, DNS, SMTP, SSH |
| 6 | Darstellung | Presentation | Daten | Kodierung, Kompression, Verschlüsselung (TLS wird oft hier eingeordnet) |
| 5 | Sitzung | Session | Daten | Sitzungsauf- und -abbau, z. B. RPC, NetBIOS |
| 4 | Transport | Transport | Segment (TCP) / Datagramm (UDP) | TCP, UDP, Ports |
| 3 | Vermittlung | Network | Paket | IP, ICMP, Router |
| 2 | Sicherung | Data Link | Frame (Rahmen) | Ethernet, MAC, Switch, 802.11 |
| 1 | Bitübertragung | Physical | Bits | Kabel, Stecker, Funk, Hub, Repeater |

Eselsbrücke von unten (1→7): **„Please Do Not Throw Sausage Pizza Away“** – Physical, Data Link, Network, Transport, Session, Presentation, Application.`,
      terms: [
        { de: 'Protokolldateneinheit', en: 'Protocol Data Unit (PDU)' },
        { de: 'Rahmen', en: 'frame' },
      ],
    },
    {
      heading: 'Jede Schicht einfach erklärt',
      body: `Du schickst eine Nachricht über eine Webseite an eine Freundin. So teilen sich die Schichten die Arbeit (Sender von 7 nach 1, Empfänger von 1 nach 7):

- **7 Anwendung (Application):** die Sprache, die dein Programm mit dem Server spricht, z. B. **HTTP** fürs Web, **SMTP** für E-Mail, **DNS** für Namen. Gemeint ist das Protokoll, nicht der Browser selbst.
- **6 Darstellung (Presentation):** sorgt dafür, dass beide Seiten die Daten gleich verstehen: Zeichensatz (z. B. UTF-8), Bildformat (JPEG), Kompression, Verschlüsselung.
- **5 Sitzung (Session):** verwaltet den Dialog zwischen zwei Programmen: Aufbau, wer wann spricht, Abbau. In der Praxis erledigen das meist die Anwendungen selbst. Darum fasst das TCP/IP-Modell die Schichten 5 bis 7 zusammen.
- **4 Transport:** zerlegt große Daten in Stücke (Segmente), nummeriert sie und sorgt bei **TCP** dafür, dass alles vollständig ankommt. **Ports** bestimmen, welches Programm die Daten bekommt.
- **3 Vermittlung (Network):** findet den Weg durch viele Netze bis zum Ziel. Dafür gibt es **IP-Adressen**. **Router** arbeiten hier.
- **2 Sicherung (Data Link):** bringt die Daten zum nächsten Gerät im selben Netz, mit **MAC-Adressen**, und erkennt Übertragungsfehler. **Switches** arbeiten hier.
- **1 Bitübertragung (Physical):** macht aus Bits echte Signale: Strom im Kupferkabel, Licht in der Glasfaser, Funkwellen im WLAN. Dazu gehören Kabel, Stecker und Hubs.

Jede Schicht „spricht“ nur mit derselben Schicht auf der Gegenseite: TCP beim Sender mit TCP beim Empfänger, IP mit IP.

Deutsche Eselsbrücke von oben (7 → 1): **„Alle Deutschen Studenten Trinken Verschiedene Sorten Bier“** – Anwendung, Darstellung, Sitzung, Transport, Vermittlung, Sicherung, Bitübertragung.

**Typische Fehler pro Schicht** (hilft bei der Fehlersuche):
| Schicht | typischer Fehler |
|---|---|
| 1 | Kabel locker oder defekt, Port-LED aus, WLAN zu schwach |
| 2 | Switch-Port im falschen VLAN oder gesperrt |
| 3 | falsche IP-Adresse oder falsches Default Gateway |
| 4 | Firewall blockiert den Port |
| 7 | DNS-Name falsch, Dienst auf dem Server gestoppt |`,
      analogy: 'Ein Umzug mit Spedition: Du sagst, was transportiert wird (7), alles wird in Kartons verpackt und beschriftet (6), ein Termin wird vereinbart (5), die Kartons werden nummeriert, damit keiner fehlt (4), die Route durch die Städte wird geplant (3), von Kreuzung zu Kreuzung gefahren (2) – und die Straße selbst ist der Asphalt (1).',
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Das Netzwerkkabel deines PCs ist abgezogen. Auf welcher Schicht liegt das Problem?',
        options: [
          { id: 'a', text: 'Schicht 1 – Bitübertragung' },
          { id: 'b', text: 'Schicht 3 – Vermittlung', whyWrong: 'Schicht 3 kümmert sich um IP-Adressen und den Weg durch die Netze. Damit sie arbeiten kann, müssen zuerst Bits über ein Kabel fließen. Ohne Kabel kommt kein einziges Signal an, also liegt die Ursache eine ganze Ebene tiefer: auf Schicht 1, beim Medium selbst.' },
          { id: 'c', text: 'Schicht 7 – Anwendung', whyWrong: 'Die Anwendung (z. B. der Browser) merkt den Fehler zwar zuerst und zeigt „Keine Verbindung“. Die Ursache liegt aber nicht dort. Fehler wandern im Modell immer nach oben sichtbar. Ein abgezogenes Kabel ist ein physisches Problem, also Schicht 1.' },
        ],
        correct: 'a',
        explanation: 'Kabel, Stecker und Signale sind Schicht 1. Bei der Fehlersuche fängt man oft genau dort an (bottom-up).',
      },
    },
    {
      heading: 'Das TCP/IP-Modell',
      body: `| TCP/IP-Schicht | entspricht OSI |
|---|---|
| Anwendung (Application) | 5, 6, 7 |
| Transport | 4 |
| Internet | 3 |
| Netzzugang (Network Access / Link) | 1, 2 |

Manche Lehrbücher (auch Cisco) nutzen ein **5-Schichten-Modell**, das den Netzzugang in Data Link und Physical trennt.`,
    },
    {
      heading: 'Kapselung (Encapsulation)',
      diagram: 'osi-encapsulation',
      body: `Beim **Senden** läuft es von oben nach unten. Jede Schicht fügt ihren **Header** hinzu (Ethernet zusätzlich einen **Trailer**, die FCS-Prüfsumme):

- Daten (Anwendung)
- + TCP/UDP-Header → **Segment**
- + IP-Header → **Paket**
- + Ethernet-Header & Trailer → **Frame**
- → als **Bits** auf das Kabel

Beim **Empfangen** passiert das Gegenteil: **Entkapselung (Decapsulation)**. Jede Schicht liest ihren Header, entfernt ihn und gibt den Rest nach oben weiter.

Wichtig: Ein **Router** packt den Frame aus, schaut auf das IP-Paket und packt es für den nächsten Abschnitt in einen **neuen Frame** (neue MAC-Adressen!). Die IP-Adressen bleiben dabei gleich (ohne NAT).`,
      analogy: 'Kapselung ist wie Matroschka-Puppen: Der Brief steckt in einem Umschlag (TCP), der in einem Paket (IP), das in einem Container (Ethernet). Jede Station öffnet nur ihre eigene Hülle.',
      terms: [
        { de: 'Kapselung', en: 'encapsulation' },
        { de: 'Prüfsumme am Frame-Ende', en: 'Frame Check Sequence (FCS)' },
      ],
    },
    {
      heading: 'Geräte und Schichten',
      body: `- Schicht 1: Hub, Repeater, Kabel, Medienkonverter
- Schicht 2: Switch, Bridge, Netzwerkkarte (NIC), Access Point
- Schicht 3: Router, Layer-3-Switch
- Schicht 4–7: Firewalls (je nach Typ), Load Balancer, Proxys

Troubleshooting nach Schichten: **Bottom-up** (erst Kabel, dann Link, dann IP …), **Top-down** (erst die Anwendung) oder **Divide and Conquer** (in der Mitte starten, z. B. mit \`ping\`).`,
    },
  ],
  quiz: [
    {
      id: 'q17', type: 'dragdrop', difficulty: 1,
      prompt: 'Auf welcher Schicht liegt der Fehler?',
      items: [
        { id: 'cable', text: 'Netzwerkkabel ist gebrochen' },
        { id: 'vlan', text: 'Switch-Port steht im falschen VLAN' },
        { id: 'gw', text: 'Falsches Default Gateway eingetragen' },
        { id: 'fw', text: 'Firewall blockiert TCP-Port 443' },
        { id: 'svc', text: 'Webserver-Dienst ist gestoppt' },
      ],
      buckets: [
        { id: 'l1', label: '1 Bitübertragung' },
        { id: 'l2', label: '2 Sicherung' },
        { id: 'l3', label: '3 Vermittlung' },
        { id: 'l4', label: '4 Transport' },
        { id: 'l7', label: '7 Anwendung' },
      ],
      solution: { cable: 'l1', vlan: 'l2', gw: 'l3', fw: 'l4', svc: 'l7' },
      explanation: 'Kabel = Signal (1), VLAN = Switch (2), Gateway = IP-Weg (3), Port = Transport (4), Dienst = Anwendung (7).',
    },
    {
      id: 'q1', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Protokolle/Begriffe der richtigen **OSI-Schicht** zu.',
      items: [
        { id: 'http', text: 'HTTP' },
        { id: 'tcp', text: 'TCP' },
        { id: 'ip', text: 'IPv4' },
        { id: 'eth', text: 'Ethernet-MAC' },
        { id: 'dns', text: 'DNS' },
        { id: 'udp', text: 'UDP' },
        { id: 'icmp', text: 'ICMP' },
        { id: 'cable', text: 'Cat-6-Kabel' },
      ],
      buckets: [
        { id: 'l7', label: '7 Anwendung' },
        { id: 'l4', label: '4 Transport' },
        { id: 'l3', label: '3 Vermittlung' },
        { id: 'l2', label: '2 Sicherung' },
        { id: 'l1', label: '1 Bitübertragung' },
      ],
      solution: { http: 'l7', dns: 'l7', tcp: 'l4', udp: 'l4', ip: 'l3', icmp: 'l3', eth: 'l2', cable: 'l1' },
      explanation: 'HTTP und DNS sind Anwendungsprotokolle. TCP/UDP transportieren mit Ports. IP und ICMP gehören zur Vermittlungsschicht (ICMP wird von IP getragen, zählt aber zu Schicht 3). MAC = Schicht 2, Kabel = Schicht 1.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Wie heißt die PDU auf **Schicht 3**?',
      options: [
        { id: 'a', text: 'Paket (Packet)' },
        { id: 'b', text: 'Frame', whyWrong: 'Frame (Rahmen) ist die Dateneinheit auf Schicht 2, z. B. ein Ethernet-Frame mit MAC-Adressen. Auf Schicht 3 wird das Paket mit IP-Header gebildet und erst danach in einen Frame verpackt. Merkhilfe von 4 nach 1: Segment, Paket, Frame, Bits.' },
        { id: 'c', text: 'Segment', whyWrong: 'Segment heißt die Einheit von Schicht 4, wenn TCP sie bildet (bei UDP: Datagramm). Sie enthält Ports und Sequenznummern. Schicht 3 setzt den IP-Header davor, und daraus wird ein Paket.' },
        { id: 'd', text: 'Bits', whyWrong: 'Bits sind die Einheit auf Schicht 1: die einzelnen Nullen und Einsen als Strom, Licht oder Funk. Auf Schicht 3 gibt es dagegen strukturierte Pakete mit Absender- und Ziel-IP.' },
      ],
      correct: 'a',
      explanation: 'Merkhilfe von oben: Daten → Segment → Paket → Frame → Bits.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Auf welcher OSI-Schicht arbeitet ein klassischer **Switch**?',
      options: [
        { id: 'a', text: 'Schicht 2 – Sicherung (Data Link)' },
        { id: 'b', text: 'Schicht 1 – Bitübertragung', whyWrong: 'Schicht 1 bedeutet: nur Signale weitergeben, ohne Adressen zu lesen. Das macht ein Hub oder Repeater. Ein Switch liest dagegen die Ziel-MAC-Adresse jedes Frames, lernt, an welchem Port welches Gerät hängt, und leitet gezielt weiter. Das ist Schicht 2.' },
        { id: 'c', text: 'Schicht 3 – Vermittlung', whyWrong: 'Auf Schicht 3 wird mit IP-Adressen geroutet. Das kann nur ein Layer-3-Switch oder ein Router. Ein klassischer Switch schaut nur auf die MAC-Adresse im Ethernet-Header und bleibt damit auf Schicht 2.' },
        { id: 'd', text: 'Schicht 4 – Transport', whyWrong: 'Schicht 4 arbeitet mit TCP/UDP-Ports, also Programmen auf dem Endgerät. Ein Switch wertet keine Ports aus. Die Anschlüsse am Switch heißen zwar auch Ports, sind aber physische Buchsen und keine TCP/UDP-Ports.' },
      ],
      correct: 'a',
      explanation: 'Switches leiten Frames anhand der Ziel-MAC-Adresse weiter, das ist Schicht 2.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Welche OSI-Schichten fasst das TCP/IP-Modell zur **Anwendungsschicht** zusammen?',
      options: [
        { id: 'a', text: '5, 6 und 7' },
        { id: 'b', text: 'Nur 7', whyWrong: 'Nur Schicht 7 reicht nicht. Das TCP/IP-Modell hat keine eigene Sitzungs- (5) und Darstellungsschicht (6). Ihre Aufgaben übernehmen die Anwendungen selbst: Verschlüsselung macht TLS, Sitzungen verwaltet z. B. HTTP mit Cookies. Darum gehen 5, 6 und 7 zusammen in der Anwendungsschicht auf.' },
        { id: 'c', text: '4 bis 7', whyWrong: 'Die Transportschicht (4) bleibt im TCP/IP-Modell eine eigene Schicht. Dort arbeiten TCP und UDP. Nur 5, 6 und 7 werden zur Anwendungsschicht zusammengefasst.' },
        { id: 'd', text: '6 und 7', whyWrong: 'Hier fehlt die Sitzungsschicht (5). Auch sie hat im TCP/IP-Modell keine eigene Schicht und gehört zur Anwendung. Richtig sind also 5, 6 und 7.' },
      ],
      correct: 'a',
      explanation: 'TCP/IP: Anwendung (OSI 5–7), Transport (4), Internet (3), Netzzugang (1–2).',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Was passiert bei der **Kapselung** auf Schicht 2 (Ethernet)?',
      options: [
        { id: 'a', text: 'Es wird ein Header (MAC-Adressen, Typ) und ein Trailer (FCS) hinzugefügt.' },
        { id: 'b', text: 'Es werden Quell- und Zielport hinzugefügt.', whyWrong: 'Quell- und Zielport fügt Schicht 4 hinzu, also TCP oder UDP. Wenn die Daten auf Schicht 2 ankommen, stehen die Ports schon im Segment. Ethernet setzt davor seinen eigenen Header (Ziel-MAC, Quell-MAC, Typ) und hängt hinten die Prüfsumme (FCS) an.' },
        { id: 'c', text: 'Es werden IP-Adressen hinzugefügt.', whyWrong: 'IP-Adressen fügt Schicht 3 im IP-Header hinzu. Auf Schicht 2 ist das Paket mit IP-Adressen schon fertig und wird nur noch in einen Ethernet-Frame gepackt: Header mit MAC-Adressen und Typfeld vorne, FCS-Prüfsumme hinten.' },
        { id: 'd', text: 'Die Daten werden verschlüsselt.', whyWrong: 'Ethernet verschlüsselt grundsätzlich nicht. Der Frame bekommt nur Header und Prüfsumme. Verschlüsselung auf Schicht 2 gibt es nur als Erweiterung (MACsec, IEEE 802.1AE) oder im WLAN (WPA2/WPA3). Meist verschlüsselt man weiter oben, z. B. mit TLS.' },
      ],
      correct: 'a',
      explanation: 'Ethernet ist die einzige Schicht im Stapel, die auch einen **Trailer** anhängt: die Frame Check Sequence (CRC-32) zur Fehlererkennung.',
    },
    {
      id: 'q6', type: 'scenario', difficulty: 2,
      scenario: 'Ein Paket geht von PC A über **zwei Router** zu Server B. Es gibt kein NAT.',
      prompt: 'Was bleibt auf dem gesamten Weg **unverändert**?',
      options: [
        { id: 'a', text: 'Quell- und Ziel-IP-Adresse' },
        { id: 'b', text: 'Quell- und Ziel-MAC-Adresse', whyWrong: 'MAC-Adressen gelten nur in einem Abschnitt, also von einem Gerät zum nächsten Router. Jeder Router entfernt den alten Frame und baut einen neuen: Quell-MAC wird seine eigene, Ziel-MAC die des nächsten Geräts. Darum ändern sich die MACs an jedem Router.' },
        { id: 'c', text: 'Beides', whyWrong: 'Nur eins von beiden bleibt gleich. Die IP-Adressen bleiben ohne NAT auf dem ganzen Weg gleich. Die MAC-Adressen werden an jedem Router neu gesetzt, weil sie nur im jeweiligen lokalen Abschnitt gelten.' },
        { id: 'd', text: 'Nichts', whyWrong: 'Ohne NAT bleiben Quell- und Ziel-IP-Adresse unverändert, damit jeder Router das Ziel kennt und die Antwort zurückfindet. Es ändert sich also nicht alles. Nur die MAC-Adressen und die TTL werden unterwegs neu gesetzt.' },
      ],
      correct: 'a',
      explanation: 'IP-Adressen sind **Ende-zu-Ende**, MAC-Adressen nur **Hop-zu-Hop**. (Die TTL im IP-Header sinkt allerdings an jedem Router um 1.)',
      analogy: 'Die Adresse auf dem Paket (IP) bleibt gleich. Aber jeder Lieferabschnitt hat einen anderen LKW mit anderem Kennzeichen (MAC).',
    },
    {
      id: 'q7', type: 'multi', difficulty: 2,
      prompt: 'Welche Geräte arbeiten primär auf **Schicht 1**?',
      options: [
        { id: 'a', text: 'Hub' },
        { id: 'b', text: 'Repeater' },
        { id: 'c', text: 'Medienkonverter (Kupfer ↔ Glas)' },
        { id: 'd', text: 'Bridge', whyWrong: 'Eine Bridge verbindet zwei Netzsegmente und lernt dabei MAC-Adressen, genau wie ein Switch. Sie trifft also Entscheidungen anhand von Schicht-2-Adressen. Ein Switch ist im Grunde eine Bridge mit vielen Ports. Schicht 1 wäre reines Signal-Weitergeben ohne Adressen.' },
        { id: 'e', text: 'Router', whyWrong: 'Router werten IP-Adressen aus und entscheiden über den Weg durch verschiedene Netze. Damit arbeiten sie auf Schicht 3. Schicht-1-Geräte wie Hub, Repeater und Medienkonverter verstehen dagegen keine Adressen und geben nur Signale weiter.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Schicht-1-Geräte verstehen keine Adressen. Sie verstärken, verteilen oder wandeln nur Signale.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Welche Schicht ist für **End-to-End-Zuverlässigkeit**, Flusskontrolle und Portnummern zuständig?',
      options: [
        { id: 'a', text: 'Transport (4)' },
        { id: 'b', text: 'Vermittlung (3)', whyWrong: 'Schicht 3 (IP) adressiert Geräte und sucht den Weg durch die Netze. IP liefert nach dem Best-Effort-Prinzip: verlorene Pakete werden nicht erneut gesendet, und es gibt keine Ports. Neuübertragung, Flusskontrolle und Ports übernimmt erst Schicht 4 (TCP).' },
        { id: 'c', text: 'Sitzung (5)', whyWrong: 'Die Sitzungsschicht verwaltet den Dialog zwischen Anwendungen: Aufbau, Abbau, Wiederaufnahme. Portnummern, Bestätigungen (ACK) und Flusskontrolle gehören nicht dazu. Diese Aufgaben hat TCP auf Schicht 4.' },
        { id: 'd', text: 'Sicherung (2)', whyWrong: 'Schicht 2 erkennt Fehler mit der FCS-Prüfsumme, aber nur auf einem einzelnen Abschnitt bis zum nächsten Gerät. Kaputte Frames werden verworfen, nicht neu angefordert. Ende-zu-Ende über alle Router hinweg, mit Ports und Neuübertragung, kümmert sich Schicht 4.' },
      ],
      correct: 'a',
      explanation: 'TCP auf Schicht 4 nummeriert Segmente, bestätigt sie (ACK), überträgt Verlorenes neu und regelt den Fluss über das Window.',
    },
    {
      id: 'q9', type: 'single', difficulty: 1,
      prompt: 'Welche Reihenfolge der Kapselung beim **Senden** ist richtig?',
      options: [
        { id: 'a', text: 'Daten → Segment → Paket → Frame → Bits' },
        { id: 'b', text: 'Bits → Frame → Paket → Segment → Daten', whyWrong: 'Das ist die umgekehrte Richtung, die Entkapselung beim Empfangen. Dort kommen Bits an, werden zum Frame, dann zum Paket, zum Segment und zu Daten. Beim Senden geht es von oben nach unten: Daten → Segment → Paket → Frame → Bits.' },
        { id: 'c', text: 'Daten → Paket → Segment → Frame → Bits', whyWrong: 'Hier sind Segment und Paket vertauscht. Schicht 4 (Transport) kommt vor Schicht 3 (Vermittlung). Zuerst entsteht das Segment mit Ports, dann setzt IP seinen Header davor, und daraus wird das Paket.' },
        { id: 'd', text: 'Daten → Frame → Paket → Segment → Bits', whyWrong: 'Hier ist die Reihenfolge der Schichten 2 bis 4 komplett umgedreht. Beim Senden geht es von Schicht 4 nach unten: Segment (4), dann Paket (3), dann Frame (2). Der Frame ist die äußerste Hülle vor den Bits.' },
      ],
      correct: 'a',
      explanation: 'Von oben nach unten: Anwendung (Daten), Transport (Segment), Vermittlung (Paket), Sicherung (Frame), Bitübertragung (Bits).',
    },
    {
      id: 'q10', type: 'scenario', difficulty: 2,
      scenario: 'Ein Benutzer meldet „Internet geht nicht“. Du siehst: Die Link-LED an der Netzwerkdose ist **aus**.',
      prompt: 'Auf welcher Schicht liegt das Problem vermutlich?',
      options: [
        { id: 'a', text: 'Schicht 1' },
        { id: 'b', text: 'Schicht 3', whyWrong: 'Bevor IP-Adressen eine Rolle spielen, muss eine physische Verbindung bestehen. Eine Link-LED, die aus ist, bedeutet: Es fließen gar keine Signale. Eine falsche IP-Adresse würde die LED nicht ausschalten. Die Fehlersuche gehört darum auf Schicht 1: Kabel, Stecker, Port.' },
        { id: 'c', text: 'Schicht 7', whyWrong: 'Die Anwendung kann nichts ausrichten, wenn physisch keine Verbindung besteht. Eine Link-LED, die aus ist, zeigt: Schon auf Schicht 1 kommt nichts an. Erst wenn das Kabel steckt und die LED leuchtet, lohnt sich die Suche weiter oben.' },
        { id: 'd', text: 'Schicht 4', whyWrong: 'TCP und Ports werden erst wichtig, wenn Schichten 1 bis 3 funktionieren. Bei einer Link-LED, die aus ist, kommt nicht einmal ein Signal an. Das ist ein klassischer Schicht-1-Fehler: Kabel defekt, nicht eingesteckt oder Port deaktiviert.' },
      ],
      correct: 'a',
      explanation: 'Keine Link-LED = keine physische Verbindung: Kabel, Stecker, Dose, Switchport oder NIC. Das ist der Bottom-up-Ansatz.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Auf welcher OSI-Schicht wird **Verschlüsselung/Kodierung** (z. B. Zeichensätze, Kompression) klassisch eingeordnet?',
      options: [
        { id: 'a', text: 'Schicht 6 – Darstellung' },
        { id: 'b', text: 'Schicht 5 – Sitzung', whyWrong: 'Die Sitzungsschicht verwaltet die Verbindung zwischen zwei Anwendungen: Aufbau, Synchronisation, Abbau. Wie die Daten aussehen, also Zeichensatz, Kompression und Verschlüsselung, legt sie nicht fest. Das ist die Aufgabe der Darstellungsschicht (6).' },
        { id: 'c', text: 'Schicht 2 – Sicherung', whyWrong: 'Schicht 2 bildet Rahmen (Frames) mit MAC-Adressen und prüft per FCS, ob Bits unterwegs verfälscht wurden. Mit dem Format der Daten hat sie nichts zu tun. Zeichensätze, Kompression und Verschlüsselung gehören klassisch zur Darstellungsschicht (6).' },
        { id: 'd', text: 'Schicht 4 – Transport', whyWrong: 'Schicht 4 teilt Daten in Segmente, nummeriert sie und sorgt bei TCP für vollständige Zustellung. Der Inhalt ist ihr egal. Ob Daten als UTF-8, JPEG oder verschlüsselt vorliegen, regelt im OSI-Modell die Darstellungsschicht (6).' },
      ],
      correct: 'a',
      explanation: 'Die Darstellungsschicht übersetzt Datenformate (z. B. ASCII/UTF-8, JPEG), komprimiert und verschlüsselt. In der Praxis sind die Grenzen fließend: TLS wird je nach Quelle Schicht 5, 6 oder „zwischen 4 und 7“ zugeordnet.',
    },
    {
      id: 'q12', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Geräte ihrer typischen Arbeitsschicht zu.',
      items: [
        { id: 'hub', text: 'Hub' },
        { id: 'sw', text: 'Switch' },
        { id: 'rt', text: 'Router' },
        { id: 'nic', text: 'Netzwerkkarte (MAC)' },
        { id: 'rep', text: 'Repeater' },
        { id: 'l3', text: 'Layer-3-Switch (Routing)' },
      ],
      buckets: [
        { id: 'l1', label: 'Schicht 1' },
        { id: 'l2', label: 'Schicht 2' },
        { id: 'l3', label: 'Schicht 3' },
      ],
      solution: { hub: 'l1', rep: 'l1', sw: 'l2', nic: 'l2', rt: 'l3', l3: 'l3' },
      explanation: 'Hub/Repeater kennen keine Adressen (L1). Switch und NIC nutzen MAC-Adressen (L2). Router und L3-Switches routen anhand von IP-Adressen (L3).',
    },
    {
      id: 'q13', type: 'single', difficulty: 3,
      prompt: 'Ein Router empfängt einen Frame und leitet das Paket weiter. Was macht er mit dem **Ethernet-Header**?',
      options: [
        { id: 'a', text: 'Er entfernt ihn und baut für den nächsten Hop einen neuen Frame mit neuen MAC-Adressen.' },
        { id: 'b', text: 'Er lässt ihn unverändert.', whyWrong: 'Die alten MAC-Adressen gelten nur im eingehenden Netz. Im nächsten Netz gibt es das Gerät mit der alten Ziel-MAC nicht. Der Router entfernt darum den alten Ethernet-Header und baut einen neuen Frame für den nächsten Abschnitt.' },
        { id: 'c', text: 'Er tauscht nur die Ziel-MAC aus.', whyWrong: 'Es ändert sich nicht nur die Ziel-MAC, sondern auch die Quell-MAC. Neue Quell-MAC ist die MAC des Router-Interfaces, über das der Frame hinausgeht. Neue Ziel-MAC ist die des nächsten Geräts. Der Router baut den Frame komplett neu.' },
        { id: 'd', text: 'Er verschlüsselt ihn.', whyWrong: 'Normales Routing verschlüsselt nichts. Der Router entfernt den Ethernet-Header, verringert die TTL und baut einen neuen Frame. Verschlüsselung gibt es nur mit zusätzlichen Techniken wie IPsec-VPN oder MACsec.' },
      ],
      correct: 'a',
      explanation: 'Neue Quell-MAC = ausgehendes Router-Interface. Neue Ziel-MAC = nächster Hop (per ARP ermittelt). Außerdem: TTL −1 und neue IP-Header-Prüfsumme.',
    },
    {
      id: 'q14', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zum **OSI-Modell** stimmen?',
      options: [
        { id: 'a', text: 'Es hat 7 Schichten.' },
        { id: 'b', text: 'Es ist vor allem ein Referenz- und Lernmodell.' },
        { id: 'c', text: 'Jede Schicht kommuniziert logisch mit derselben Schicht auf der Gegenseite.' },
        { id: 'd', text: 'Das Internet basiert direkt auf OSI-Protokollen.', whyWrong: 'Das Internet basiert auf der TCP/IP-Protokollfamilie (IP, TCP, UDP, HTTP …), nicht auf OSI-Protokollen. Es gab eigene OSI-Protokolle wie CLNP oder X.400, aber sie haben sich nicht durchgesetzt. Übrig blieb das OSI-Modell als Referenz zum Lernen und für die Fehlersuche.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Die „Peer-to-Peer-Kommunikation“ der Schichten: Der TCP-Header des Senders wird vom TCP des Empfängers gelesen, egal wie viele Router dazwischen liegen.',
    },
    {
      id: 'q15', type: 'single', difficulty: 1,
      prompt: 'Wie heißt die PDU auf **Schicht 2**?',
      options: [
        { id: 'a', text: 'Frame (Rahmen)' },
        { id: 'b', text: 'Paket', whyWrong: 'Paket heißt die Einheit auf Schicht 3, mit IP-Header und IP-Adressen. Auf Schicht 2 wird das Paket in einen Ethernet-Header mit MAC-Adressen und eine FCS-Prüfsumme eingepackt. Daraus entsteht ein Frame.' },
        { id: 'c', text: 'Segment', whyWrong: 'Segment heißt die TCP-Einheit auf Schicht 4, mit Ports und Sequenznummern. Bis Schicht 2 kommt noch der IP-Header dazu, dann der Ethernet-Rahmen. Auf Schicht 2 spricht man vom Frame.' },
        { id: 'd', text: 'Datagramm', whyWrong: 'Datagramm nennt man die Einheit bei UDP (Schicht 4) und teilweise auch IP-Pakete (Schicht 3). Für Schicht 2 ist der Fachbegriff Frame (Rahmen). In der Prüfung wird diese Zuordnung genau abgefragt.' },
      ],
      correct: 'a',
      explanation: 'Schicht 2 bildet Frames mit Header (MAC-Adressen) und Trailer (FCS).',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Du startest das Troubleshooting mit einem `ping` zum Ziel. Welchen Ansatz nutzt du?',
      options: [
        { id: 'a', text: 'Divide and Conquer' },
        { id: 'b', text: 'Bottom-up', whyWrong: 'Bottom-up beginnt ganz unten auf Schicht 1: Kabel, Link-LED, Port-Status. Erst danach prüft man Schicht 2, 3 und so weiter. Ein Ping testet dagegen sofort Schicht 3, also die Mitte des Modells. Das ist Divide and Conquer.' },
        { id: 'c', text: 'Top-down', whyWrong: 'Top-down beginnt oben bei der Anwendung, z. B. ob die Webseite im Browser lädt oder der Dienst läuft. Ein Ping testet dagegen IP-Erreichbarkeit auf Schicht 3, also die Mitte. Je nach Ergebnis sucht man dann darüber oder darunter weiter: Divide and Conquer.' },
        { id: 'd', text: 'Follow the Path', whyWrong: 'Follow the Path verfolgt den Weg eines Pakets Gerät für Gerät, z. B. mit traceroute oder durch Prüfen jedes Switches und Routers. Ein einzelner Ping zum Ziel prüft dagegen nur, ob Schicht 3 durchgehend funktioniert. Danach entscheidet man, ob man oben oder unten weitersucht.' },
      ],
      correct: 'a',
      explanation: '`ping` testet Schicht 3. Klappt er, liegt das Problem eher oben; klappt er nicht, eher unten. So halbierst du den Suchraum.',
    },
    {
      id: 'o1', type: 'ordering', difficulty: 1,
      prompt: 'Ordne die OSI-Schichten von **unten (1)** nach **oben (7)**.',
      items: [
        { id: 'l1', text: 'Bitübertragung (Physical)' },
        { id: 'l2', text: 'Sicherung (Data Link)' },
        { id: 'l3', text: 'Vermittlung (Network)' },
        { id: 'l4', text: 'Transport' },
        { id: 'l5', text: 'Sitzung (Session)' },
        { id: 'l6', text: 'Darstellung (Presentation)' },
        { id: 'l7', text: 'Anwendung (Application)' },
      ],
      explanation: 'Eselsbrücke von unten: „Please Do Not Throw Sausage Pizza Away“.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'dragdrop', difficulty: 3,
        prompt: 'Ordne jedes Element der Schicht zu, die es beim Senden **hinzufügt**.',
        items: [
          { id: 'sport', text: 'Quellport 52344' },
          { id: 'dip', text: 'Ziel-IP 93.184.216.34' },
          { id: 'fcs', text: 'FCS (CRC-32)' },
          { id: 'ttl', text: 'TTL = 64' },
          { id: 'seq', text: 'Sequenznummer' },
          { id: 'smac', text: 'Quell-MAC' },
        ],
        buckets: [
          { id: 'l4', label: 'Transport (4)' },
          { id: 'l3', label: 'Vermittlung (3)' },
          { id: 'l2', label: 'Sicherung (2)' },
        ],
        solution: { sport: 'l4', seq: 'l4', dip: 'l3', ttl: 'l3', fcs: 'l2', smac: 'l2' },
        explanation: 'Ports und Sequenznummern: TCP-Header (L4). IP-Adressen und TTL: IP-Header (L3). MAC-Adressen und FCS: Ethernet-Header/-Trailer (L2).',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        scenario: 'PC A (192.168.1.10) sendet an Server (10.0.0.5). Dazwischen liegt Router R1 mit dem Interface 192.168.1.1.',
        prompt: 'Welche **Ziel-MAC-Adresse** trägt der Frame, den PC A abschickt?',
        options: [
          { id: 'a', text: 'Die MAC-Adresse von R1 (192.168.1.1)' },
          { id: 'b', text: 'Die MAC-Adresse des Servers', whyWrong: 'Der Server steht in einem anderen Netz. PC A schickt Pakete in fremde Netze immer an sein Default Gateway, hier R1. Die MAC-Adresse des Servers kann PC A auch nicht per ARP erfragen: ARP-Broadcasts gehen nicht über den Router hinaus. Ziel-MAC ist darum die von R1, Ziel-IP bleibt die des Servers.' },
          { id: 'c', text: 'FF:FF:FF:FF:FF:FF', whyWrong: 'FF:FF:FF:FF:FF:FF ist die Broadcast-Adresse. PC A nutzt sie nur für die ARP-Anfrage „Wer hat 192.168.1.1?“, um die MAC von R1 herauszufinden. Die eigentlichen Daten gehen danach gezielt (Unicast) an die MAC von R1.' },
          { id: 'd', text: 'Die eigene MAC-Adresse', whyWrong: 'Die eigene MAC-Adresse steht als Quell-MAC im Frame, sie ist der Absender. Als Ziel-MAC braucht der Frame die Adresse des nächsten Geräts auf dem Weg. Weil der Server in einem anderen Netz liegt, ist das R1, das Default Gateway.' },
        ],
        correct: 'a',
        explanation: 'Ziel in fremdem Netz → Frame an das **Default Gateway**. Die Ziel-IP bleibt 10.0.0.5, die Ziel-MAC ist die des Routers.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Welche Aussage über **Entkapselung** ist korrekt?',
        options: [
          { id: 'a', text: 'Jede Schicht entfernt ihren eigenen Header und reicht den Rest an die nächsthöhere Schicht weiter.' },
          { id: 'b', text: 'Der Empfänger entfernt alle Header gleichzeitig auf Schicht 1.', whyWrong: 'Schicht 1 kennt keine Header, sie überträgt nur Bits. Beim Empfangen arbeitet sich jede Schicht von unten nach oben vor. Schicht 2 entfernt den Ethernet-Header und gibt das Paket weiter, Schicht 3 entfernt den IP-Header und so weiter. Jede Schicht bearbeitet nur ihren eigenen Header.' },
          { id: 'c', text: 'Entkapselung findet nur beim Router statt.', whyWrong: 'Jeder Empfänger entkapselt, egal ob PC, Server, Switch oder Router. Der Unterschied ist nur, wie weit: Ein Switch liest bis Schicht 2, ein Router bis Schicht 3, das Zielgerät bis Schicht 7.' },
          { id: 'd', text: 'Entkapselung läuft von Schicht 7 nach Schicht 1.', whyWrong: 'Von 7 nach 1 läuft die Kapselung beim Senden. Beim Empfangen kommen Bits unten an, und jede Schicht entfernt nacheinander ihren Header. Die Entkapselung geht also von Schicht 1 nach Schicht 7.' },
        ],
        correct: 'a',
        explanation: 'Ethernet prüft FCS und Ziel-MAC und gibt das Paket an IP. IP prüft die Ziel-IP und gibt das Segment an TCP. TCP gibt die Daten anhand des Ports an die Anwendung.',
      },
      {
        id: 'b4', type: 'multi', difficulty: 3,
        prompt: 'Welche Paare **OSI-Schicht ↔ TCP/IP-Schicht** sind korrekt?',
        options: [
          { id: 'a', text: 'OSI 3 ↔ Internet' },
          { id: 'b', text: 'OSI 4 ↔ Transport' },
          { id: 'c', text: 'OSI 1+2 ↔ Netzzugang' },
          { id: 'd', text: 'OSI 5 ↔ Transport', whyWrong: 'Die Sitzungsschicht (5) gehört nicht zur Transportschicht. Im TCP/IP-Modell gehen die OSI-Schichten 5, 6 und 7 zusammen in der Anwendungsschicht auf. Die TCP/IP-Transportschicht entspricht genau OSI-Schicht 4 (TCP, UDP).' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'TCP/IP: Netzzugang (1–2), Internet (3), Transport (4), Anwendung (5–7).',
      },
      {
        id: 'b5', type: 'scenario', difficulty: 3,
        scenario: 'Ein Nutzer kann Webseiten per IP-Adresse aufrufen (`http://142.250.185.78`), aber **nicht** per Namen (`google.com`).',
        prompt: 'Welche Schicht/welcher Dienst ist am wahrscheinlichsten betroffen?',
        options: [
          { id: 'a', text: 'Schicht 7 – DNS-Namensauflösung' },
          { id: 'b', text: 'Schicht 1 – Kabel', whyWrong: 'Wenn die Seite per IP-Adresse erreichbar ist, fließen Bits über das Kabel, also funktioniert Schicht 1. Ein Kabelproblem würde alle Verbindungen betreffen, auch die per IP. Der Fehler muss dort liegen, wo nur der Name eine Rolle spielt: bei DNS.' },
          { id: 'c', text: 'Schicht 3 – Routing', whyWrong: 'Der Aufruf per IP-Adresse klappt. Also findet Routing den Weg zum Server, und Schicht 3 funktioniert. Nur der Aufruf per Namen scheitert. Der Name muss erst per DNS in eine IP übersetzt werden, und genau das klappt nicht.' },
          { id: 'd', text: 'Schicht 2 – Switch', whyWrong: 'Wenn der Server per IP erreichbar ist, funktioniert auch Schicht 2 auf dem Weg: Switches leiten die Frames korrekt weiter. Ein Schicht-2-Problem würde jede Verbindung stören. Das Fehlerbild „nur per Name nicht“ zeigt eindeutig auf DNS.' },
        ],
        correct: 'a',
        explanation: 'Die unteren Schichten funktionieren. Nur die Übersetzung Name → IP (DNS, ein Anwendungsprotokoll) schlägt fehl. Prüfe z. B. mit `nslookup google.com`.',
      },
      {
        id: 'b6', type: 'single', difficulty: 3,
        prompt: 'Welches Feld im IP-Header verändert ein Router bei **jedem** Weiterleiten (ohne NAT)?',
        options: [
          { id: 'a', text: 'TTL (Time to Live), und damit die Header-Prüfsumme' },
          { id: 'b', text: 'Ziel-IP-Adresse', whyWrong: 'Die Ziel-IP bleibt ohne NAT auf dem ganzen Weg gleich. Sonst wüsste der nächste Router nicht mehr, wohin das Paket soll. Ändern würde sie sich nur bei Destination NAT (z. B. Port-Forwarding).' },
          { id: 'c', text: 'Quellport', whyWrong: 'Ports stehen gar nicht im IP-Header, sondern im TCP- oder UDP-Header darüber. Ein normaler Router schaut für das Weiterleiten nicht hinein. Nur bei PAT (NAT mit Portübersetzung, z. B. am Heimrouter) wird der Quellport geändert.' },
          { id: 'd', text: 'Protokollfeld', whyWrong: 'Das Protokollfeld gibt an, was im Paket steckt, z. B. 6 = TCP, 17 = UDP, 1 = ICMP. Das ändert sich unterwegs nicht. Bei jedem Hop ändert sich nur die TTL: Jeder Router zieht 1 ab und berechnet deshalb die Header-Prüfsumme neu.' },
        ],
        correct: 'a',
        explanation: 'TTL sinkt pro Router um 1. Bei 0 wird das Paket verworfen und eine ICMP-„Time Exceeded“-Meldung gesendet. Darauf basiert `traceroute`.',
      },
    ],
  },
};

export default level;
