import type { Level } from '../../types/content';

const level: Level = {
  id: 'basics-02',
  track: 'basics',
  order: 2,
  title: 'Netzwerke verstehen',
  titleEn: 'Networking Basics: Devices, LAN, WAN, Addresses',
  summary: 'Was ein Netzwerk ist, wer darin mit wem spricht (Client und Server), welche Geräte man braucht (Switch, Router, Access Point, Modem, Firewall), wie LAN, WLAN, WAN und Internet zusammenhängen und wozu es MAC- und IP-Adressen gibt.',
  certs: ['netplus', 'ccna', 'fisi'],
  domains: { netplus: '1', ccna: '1', fisi: 'ap1' },
  lesson: [
    {
      heading: 'Was ist ein Netzwerk?',
      body: `Ein **Netzwerk** sind zwei oder mehr Geräte, die miteinander Daten austauschen. Das kann ein Laptop und ein Drucker zu Hause sein oder das Internet mit Milliarden Geräten.

**Wozu Netzwerke?**
- **Ressourcen teilen**: ein Drucker, ein Internetanschluss, ein Dateiserver für alle
- **Kommunizieren**: E-Mail, Chat, Videokonferenz
- **Zentral verwalten**: Benutzer, Updates und Backups an einer Stelle

Jedes Gerät im Netzwerk heißt **Host** oder **Endgerät** (PC, Smartphone, Drucker, Server). Die Geräte, die die Daten weiterleiten (Switch, Router), heißen **Netzwerkgeräte**.

Daten werden nicht am Stück verschickt, sondern in kleine **Pakete** zerlegt. Jedes Paket trägt eine **Absender-** und **Zieladresse**, ähnlich wie ein Brief. Am Ziel werden die Pakete wieder zusammengesetzt.`,
      analogy: 'Ein Netzwerk ist wie die Post: Briefe (Pakete) haben Absender und Empfänger, Sortierzentren (Switches und Router) leiten sie weiter. Ein großes Paket wird in viele Briefe aufgeteilt und am Ziel wieder zusammengesetzt.',
      terms: [
        { de: 'Netzwerk', en: 'network' },
        { de: 'Endgerät', en: 'host / end device' },
        { de: 'Datenpaket', en: 'packet' },
      ],
      check: {
        id: 'c1', type: 'multi', difficulty: 1,
        prompt: 'Welche Vorteile bringt ein Netzwerk im Büro?',
        options: [
          { id: 'a', text: 'Alle können einen gemeinsamen Drucker nutzen.' },
          { id: 'b', text: 'Dateien liegen zentral und werden zentral gesichert.' },
          { id: 'c', text: 'Ein Internetanschluss für alle Geräte' },
          { id: 'd', text: 'Die PCs brauchen keinen Strom mehr.', whyWrong: 'Ein Netzwerk verbindet Geräte, versorgt sie aber nicht mit Strom (Ausnahme: PoE für kleine Geräte wie Telefone oder Access Points). PCs brauchen weiter ihr Netzteil.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Netzwerke teilen Ressourcen, ermöglichen Kommunikation und zentrale Verwaltung.',
      },
    },
    {
      heading: 'Client und Server',
      body: `Die meisten Dienste funktionieren nach dem **Client-Server-Prinzip**:
- Der **Client** stellt eine Anfrage („Gib mir die Webseite“).
- Der **Server** beantwortet sie („Hier ist sie“).

Dein Browser ist ein Client, der Webserver eines Online-Shops ein Server. Ein Server ist meist ein besonders zuverlässiger Computer, der rund um die Uhr läuft und viele Clients gleichzeitig bedient.

Bei **Peer-to-Peer** (P2P) sind alle Geräte gleichberechtigt und tauschen direkt Daten aus, z. B. zwei Laptops, die sich per Nearby Share oder AirDrop Fotos schicken. Das ist einfach, lässt sich aber schlecht zentral verwalten.

| | Client-Server | Peer-to-Peer |
|---|---|---|
| Rollen | feste Rollen | alle gleich |
| Verwaltung | zentral | jedes Gerät einzeln |
| typisch | Firmen, Web, E-Mail | kleine Netze, direkter Dateitausch |`,
      analogy: 'Client-Server ist wie ein Restaurant: Gäste (Clients) bestellen, die Küche (Server) liefert. Peer-to-Peer ist wie ein Picknick, bei dem jeder etwas mitbringt und alle untereinander tauschen.',
      terms: [
        { de: 'Client', en: 'client' },
        { de: 'Server', en: 'server' },
        { de: 'Peer-to-Peer', en: 'peer-to-peer (P2P)' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 1,
        prompt: 'Du öffnest im Browser eine Webseite. Welche Rolle hat dein Laptop?',
        options: [
          { id: 'a', text: 'Client' },
          { id: 'b', text: 'Server', whyWrong: 'Der Server ist der Rechner, der die Webseite bereitstellt. Dein Laptop fragt die Seite an, er ist der Client.' },
          { id: 'c', text: 'Router', whyWrong: 'Ein Router leitet Pakete zwischen Netzen weiter. Dein Laptop ist hier das Endgerät, das eine Anfrage stellt, also der Client.' },
        ],
        correct: 'a',
        explanation: 'Wer anfragt, ist Client. Wer antwortet, ist Server.',
      },
    },
    {
      heading: 'Die wichtigsten Geräte',
      body: `| Gerät | Aufgabe | arbeitet mit |
|---|---|---|
| **Switch** | verbindet Geräte **im selben Netz** (z. B. alle PCs im Büro) | **MAC-Adressen** |
| **Router** | verbindet **verschiedene Netze**, z. B. das Büro mit dem Internet | **IP-Adressen** |
| **Access Point (AP)** | bringt Geräte per **WLAN** ins Netz | Funk |
| **Modem** | wandelt das Signal der Leitung (DSL, Kabel, Glasfaser) um | Leitungssignal |
| **Firewall** | lässt nur erlaubten Verkehr durch | Regeln |

Die **Fritzbox** oder der **Speedport** zu Hause ist alles in einem: Modem, Router, Switch (die LAN-Buchsen), Access Point und Firewall. In Firmen sind das getrennte Geräte, damit jedes seine Aufgabe besser und ausfallsicherer erledigt.

**Kabel oder Funk?** Mit **Kabel** (Ethernet, Stecker **RJ45**) ist die Verbindung schneller, stabiler und sicherer. **WLAN** ist bequem und mobil, teilt sich aber die Funkzelle mit allen anderen Geräten und wird durch Wände gebremst.`,
      diagram: 'devices',
      terms: [
        { de: 'Switch', en: 'switch' },
        { de: 'Router', en: 'router' },
        { de: 'Zugangspunkt', en: 'access point (AP)' },
        { de: 'Modem', en: 'modem (modulator/demodulator)' },
        { de: 'Firewall', en: 'firewall' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 1,
        prompt: 'Welches Gerät verbindet das Büronetz mit dem Internet?',
        options: [
          { id: 'a', text: 'Router' },
          { id: 'b', text: 'Switch', whyWrong: 'Ein Switch verbindet Geräte innerhalb desselben Netzes. Für den Weg in ein anderes Netz, z. B. das Internet, braucht man einen Router.' },
          { id: 'c', text: 'Access Point', whyWrong: 'Ein Access Point bringt WLAN-Geräte ins lokale Netz. Ins Internet kommen sie erst über den Router.' },
          { id: 'd', text: 'Drucker', whyWrong: 'Ein Drucker ist ein Endgerät im Netz, er leitet keinen Verkehr weiter. Netze verbindet der Router.' },
        ],
        correct: 'a',
        explanation: 'Router verbinden Netze. Switches verbinden Geräte innerhalb eines Netzes.',
      },
    },
    {
      heading: 'LAN, WLAN, WAN und Internet',
      body: `Netzwerke unterscheidet man nach ihrer Größe:
| Abkürzung | Name | Ausdehnung | Beispiel |
|---|---|---|---|
| **PAN** | Personal Area Network | wenige Meter | Kopfhörer per Bluetooth |
| **LAN** | Local Area Network | ein Gebäude | Büro, Wohnung |
| **WLAN** | Wireless LAN | wie LAN, per Funk | WLAN zu Hause |
| **MAN** | Metropolitan Area Network | eine Stadt | Netz der Stadtwerke |
| **WAN** | Wide Area Network | Länder, weltweit | Standorte einer Firma verbinden |

Das **Internet** ist das größte WAN: ein Netz aus Netzen. Tausende Provider sind miteinander verbunden und tauschen Daten aus. Kein einzelnes Unternehmen besitzt es.

Dein Zugang zum Internet läuft über einen **Provider** (Internet Service Provider, **ISP**), z. B. die Telekom oder Vodafone.`,
      terms: [
        { de: 'lokales Netz', en: 'local area network (LAN)' },
        { de: 'Weitverkehrsnetz', en: 'wide area network (WAN)' },
        { de: 'Internetanbieter', en: 'Internet Service Provider (ISP)' },
      ],
      check: {
        id: 'c4', type: 'ordering', difficulty: 1,
        prompt: 'Ordne die Netzwerkarten von klein nach groß.',
        items: [
          { id: 'pan', text: 'PAN' },
          { id: 'lan', text: 'LAN' },
          { id: 'man', text: 'MAN' },
          { id: 'wan', text: 'WAN' },
        ],
        explanation: 'PAN (Person) → LAN (Gebäude) → MAN (Stadt) → WAN (Länder).',
      },
    },
    {
      heading: 'Adressen: MAC und IP',
      body: `Damit Pakete ankommen, braucht jedes Gerät Adressen. Es gibt zwei Arten:

**MAC-Adresse** (Media Access Control)
- fest in die Netzwerkkarte eingebaut, weltweit eindeutig
- 48 Bit, hexadezimal: \`3C:52:82:1A:F0:07\`
- wird **im lokalen Netz** genutzt, vom **Switch**

**IP-Adresse** (Internet Protocol)
- wird vom Netz vergeben, ändert sich, wenn du das Netz wechselst
- IPv4: vier Zahlen von 0–255, z. B. \`192.168.1.20\`
- IPv6: länger und hexadezimal, z. B. \`2001:db8::20\`
- wird **zwischen Netzen** genutzt, vom **Router**

Zur IP-Adresse gehören noch:
- die **Subnetzmaske** (z. B. 255.255.255.0): Welcher Teil der Adresse bezeichnet das Netz, welcher das Gerät?
- das **Standardgateway**: der Router, an den alles geht, was nicht im eigenen Netz liegt
- der **DNS-Server**: übersetzt Namen wie \`google.de\` in IP-Adressen

All das bekommt ein Gerät meist automatisch per **DHCP** vom Router.`,
      analogy: 'Die MAC-Adresse ist wie dein Name, er bleibt gleich, egal wo du bist. Die IP-Adresse ist wie deine Postanschrift, sie ändert sich, wenn du umziehst. Innerhalb eines Hauses ruft man sich beim Namen, für Post in eine andere Stadt braucht man die Anschrift.',
      terms: [
        { de: 'MAC-Adresse (Hardware-Adresse)', en: 'MAC address' },
        { de: 'IP-Adresse', en: 'IP address' },
        { de: 'Subnetzmaske', en: 'subnet mask' },
        { de: 'Standardgateway', en: 'default gateway' },
        { de: 'automatische Adressvergabe', en: 'Dynamic Host Configuration Protocol (DHCP)' },
      ],
      check: {
        id: 'c5', type: 'single', difficulty: 2,
        prompt: 'Du nimmst deinen Laptop von zu Hause mit ins Büro. Was ändert sich?',
        options: [
          { id: 'a', text: 'Die IP-Adresse, die MAC-Adresse bleibt gleich.' },
          { id: 'b', text: 'Die MAC-Adresse, die IP-Adresse bleibt gleich.', whyWrong: 'Genau umgekehrt: Die MAC-Adresse ist fest in der Netzwerkkarte. Die IP-Adresse vergibt das jeweilige Netz, im Büro bekommst du also eine neue.' },
          { id: 'c', text: 'Beide bleiben gleich.', whyWrong: 'Die IP-Adresse gehört zum Netz. Im Büronetz gelten andere Adressen als zu Hause, darum vergibt der DHCP-Server dort eine neue.' },
          { id: 'd', text: 'Beide ändern sich.', whyWrong: 'Die MAC-Adresse ist in die Hardware eingebaut und ändert sich nicht durch einen Ortswechsel. (Manche Geräte nutzen im WLAN zufällige MACs aus Datenschutzgründen, das ist aber eine Sonderfunktion.)' },
        ],
        correct: 'a',
        explanation: 'MAC = Name (fest), IP = Anschrift (je nach Netz).',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Was ist ein Netzwerk?',
      options: [
        { id: 'a', text: 'Zwei oder mehr Geräte, die Daten austauschen' },
        { id: 'b', text: 'Nur das Internet', whyWrong: 'Das Internet ist das größte Netzwerk, aber schon zwei Geräte, die Daten austauschen, bilden ein Netzwerk, z. B. ein PC und ein Drucker.' },
        { id: 'c', text: 'Ein einzelner Computer mit vielen Programmen', whyWrong: 'Ein einzelner Computer ist kein Netzwerk, egal wie viel Software darauf läuft. Ein Netzwerk entsteht erst durch die Verbindung mehrerer Geräte.' },
        { id: 'd', text: 'Ein Kabel', whyWrong: 'Ein Kabel ist nur das Übertragungsmedium. Das Netzwerk sind die verbundenen Geräte, die darüber Daten austauschen.' },
      ],
      correct: 'a',
      explanation: 'Schon zwei verbundene Geräte bilden ein Netzwerk.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 1,
      prompt: 'Welches Gerät erledigt welche Aufgabe?',
      items: [
        { id: 'sw', text: 'Switch' },
        { id: 'rt', text: 'Router' },
        { id: 'ap', text: 'Access Point' },
        { id: 'fw', text: 'Firewall' },
        { id: 'mo', text: 'Modem' },
      ],
      buckets: [
        { id: 'lan', label: 'verbindet Geräte im selben Netz' },
        { id: 'net', label: 'verbindet verschiedene Netze' },
        { id: 'wifi', label: 'bringt Geräte per Funk ins Netz' },
        { id: 'filter', label: 'filtert Verkehr nach Regeln' },
        { id: 'line', label: 'wandelt das Leitungssignal um' },
      ],
      solution: { sw: 'lan', rt: 'net', ap: 'wifi', fw: 'filter', mo: 'line' },
      explanation: 'Switch: im Netz. Router: zwischen Netzen. AP: WLAN. Firewall: Regeln. Modem: Leitungssignal.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Welche Adresse nutzt ein Switch, um Daten an das richtige Gerät zu schicken?',
      options: [
        { id: 'a', text: 'MAC-Adresse' },
        { id: 'b', text: 'IP-Adresse', whyWrong: 'IP-Adressen nutzt der Router, um zwischen Netzen weiterzuleiten. Ein normaler Switch arbeitet im lokalen Netz mit den MAC-Adressen der Netzwerkkarten.' },
        { id: 'c', text: 'E-Mail-Adresse', whyWrong: 'E-Mail-Adressen sind für Mailprogramme. Ein Switch kennt nur die MAC-Adressen der angeschlossenen Geräte.' },
        { id: 'd', text: 'Webadresse (URL)', whyWrong: 'Eine URL wie https://beispiel.de nutzt der Browser. Der Switch sieht nur MAC-Adressen in den Rahmen, die durch ihn hindurchgehen.' },
      ],
      correct: 'a',
      explanation: 'Switch → MAC, Router → IP.',
    },
    {
      id: 'q4', type: 'single', difficulty: 1,
      prompt: 'Welche Rolle hat ein Webserver?',
      options: [
        { id: 'a', text: 'Er beantwortet Anfragen von Clients und liefert Webseiten aus.' },
        { id: 'b', text: 'Er stellt Anfragen an Browser.', whyWrong: 'Umgekehrt: Der Browser (Client) fragt, der Webserver antwortet.' },
        { id: 'c', text: 'Er verbindet WLAN-Geräte.', whyWrong: 'Das macht ein Access Point. Ein Webserver ist ein Rechner, der Webseiten bereitstellt.' },
      ],
      correct: 'a',
      explanation: 'Server = antwortet und liefert, Client = fragt an.',
    },
    {
      id: 'q5', type: 'single', difficulty: 1,
      prompt: 'Wie heißt ein Netzwerk, das sich auf ein Gebäude beschränkt?',
      options: [
        { id: 'a', text: 'LAN' },
        { id: 'b', text: 'WAN', whyWrong: 'Ein WAN verbindet weit entfernte Standorte über Länder hinweg. Ein Netz in einem Gebäude ist ein LAN.' },
        { id: 'c', text: 'PAN', whyWrong: 'Ein PAN reicht nur wenige Meter, z. B. Bluetooth zwischen Handy und Kopfhörer. Ein Gebäudenetz ist ein LAN.' },
        { id: 'd', text: 'MAN', whyWrong: 'Ein MAN umfasst eine ganze Stadt. Für ein einzelnes Gebäude spricht man von LAN.' },
      ],
      correct: 'a',
      explanation: 'LAN = Local Area Network, z. B. Büro oder Wohnung.',
    },
    {
      id: 'q6', type: 'single', difficulty: 1,
      prompt: 'Was ist das Internet?',
      options: [
        { id: 'a', text: 'Ein weltweites Netz aus vielen verbundenen Netzen' },
        { id: 'b', text: 'Ein großer Server von Google', whyWrong: 'Google betreibt viele Server im Internet, aber das Internet selbst besteht aus Tausenden Netzen vieler Provider und Firmen. Niemand besitzt es allein.' },
        { id: 'c', text: 'Dasselbe wie WLAN', whyWrong: 'WLAN ist nur eine Funkverbindung im lokalen Netz. Auch ohne Internet kann man WLAN nutzen, z. B. um zu Hause zu drucken.' },
        { id: 'd', text: 'Ein Programm auf dem PC', whyWrong: 'Der Browser ist ein Programm, mit dem man das Internet nutzt. Das Internet selbst ist die weltweite Verbindung vieler Netze.' },
      ],
      correct: 'a',
      explanation: 'Das Internet ist ein „Netz der Netze“, verbunden über Provider.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Welche Geräte stecken typischerweise in einer Fritzbox?',
      options: [
        { id: 'a', text: 'Modem, Router, Switch, Access Point und Firewall' },
        { id: 'b', text: 'Nur ein Modem', whyWrong: 'Ein reines Modem hätte keine LAN-Buchsen für mehrere Geräte und kein WLAN. Eine Fritzbox vereint Modem, Router, Switch, Access Point und Firewall.' },
        { id: 'c', text: 'Ein Server mit Festplatte', whyWrong: 'Manche Fritzboxen können zwar Dateien von einem USB-Stick freigeben, ihre Hauptaufgabe ist aber die Netzwerktechnik: Modem, Router, Switch, WLAN und Firewall.' },
        { id: 'd', text: 'Nur ein Switch', whyWrong: 'Ein Switch allein käme nicht ins Internet. Für den Internetzugang braucht man Modem und Router, die in der Fritzbox ebenfalls stecken.' },
      ],
      correct: 'a',
      explanation: 'Heimrouter sind Kombigeräte. In Firmen sind diese Aufgaben auf getrennte Geräte verteilt.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Warum schließt man einen Server lieber per Kabel als per WLAN an?',
      options: [
        { id: 'a', text: 'Kabel ist schneller, stabiler und schwerer abzuhören.' },
        { id: 'b', text: 'Server können kein WLAN.', whyWrong: 'Technisch könnte man eine WLAN-Karte einbauen. Man tut es nicht, weil Kabel schneller und stabiler ist und Funk von außen empfangen werden kann.' },
        { id: 'c', text: 'WLAN ist teurer.', whyWrong: 'Eine WLAN-Karte kostet nicht viel. Der Grund ist die Qualität: Kabel liefert gleichbleibende Geschwindigkeit ohne Funkstörungen.' },
      ],
      correct: 'a',
      explanation: 'Kabel: volle Geschwindigkeit, keine Störungen durch Wände oder Nachbarnetze, kein Funk nach außen.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Welches Format hat eine MAC-Adresse?',
      options: [
        { id: 'a', text: '`3C:52:82:1A:F0:07` (48 Bit, hexadezimal)' },
        { id: 'b', text: '`192.168.1.20`', whyWrong: 'Das ist eine IPv4-Adresse: vier Dezimalzahlen mit Punkten. MAC-Adressen haben sechs Hex-Paare, meist mit Doppelpunkten oder Bindestrichen.' },
        { id: 'c', text: '`2001:db8::20`', whyWrong: 'Das ist eine IPv6-Adresse (128 Bit). Sie ist auch hexadezimal, aber länger und mit Gruppen von bis zu vier Ziffern. Eine MAC hat genau sechs Hex-Paare.' },
        { id: 'd', text: '`www.firma.de`', whyWrong: 'Das ist ein Domänenname, den DNS in eine IP-Adresse übersetzt. Eine MAC-Adresse ist eine Hardware-Adresse aus Hex-Ziffern.' },
      ],
      correct: 'a',
      explanation: 'MAC: 6 Bytes in Hex. Die ersten 3 Bytes kennzeichnen den Hersteller.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Wofür braucht ein PC das Standardgateway?',
      options: [
        { id: 'a', text: 'Um Ziele außerhalb des eigenen Netzes zu erreichen, z. B. das Internet' },
        { id: 'b', text: 'Um Namen in IP-Adressen zu übersetzen', whyWrong: 'Namen übersetzt der DNS-Server. Das Gateway ist der Router, an den der PC alles schickt, was nicht im eigenen Netz liegt.' },
        { id: 'c', text: 'Um eine IP-Adresse zu bekommen', whyWrong: 'IP-Adressen vergibt der DHCP-Server (oft im selben Router). Das Gateway selbst ist die Adresse des Routers, über den der PC andere Netze erreicht.' },
        { id: 'd', text: 'Um mit dem Drucker im selben Raum zu sprechen', whyWrong: 'Geräte im selben Netz erreicht der PC direkt über den Switch. Das Gateway braucht er nur für Ziele in anderen Netzen.' },
      ],
      correct: 'a',
      explanation: 'Gateway = Ausgang aus dem eigenen Netz, meist der Router.',
    },
    {
      id: 'q11', type: 'dragdrop', difficulty: 2,
      prompt: 'Wer liefert welche Einstellung?',
      items: [
        { id: 'ip', text: 'IP-Adresse automatisch zuteilen' },
        { id: 'name', text: '`google.de` in eine IP-Adresse übersetzen' },
        { id: 'out', text: 'Pakete ins Internet weiterleiten' },
      ],
      buckets: [
        { id: 'dhcp', label: 'DHCP-Server' },
        { id: 'dns', label: 'DNS-Server' },
        { id: 'gw', label: 'Standardgateway (Router)' },
      ],
      solution: { ip: 'dhcp', name: 'dns', out: 'gw' },
      explanation: 'DHCP vergibt Adressen, DNS übersetzt Namen, das Gateway leitet in andere Netze weiter.',
    },
    {
      id: 'q12', type: 'single', difficulty: 1,
      prompt: 'Zwei Laptops schicken sich direkt Fotos, ohne Server dazwischen. Wie nennt man das?',
      options: [
        { id: 'a', text: 'Peer-to-Peer' },
        { id: 'b', text: 'Client-Server', whyWrong: 'Bei Client-Server gibt es einen festen Server, der Anfragen beantwortet. Hier sind beide Laptops gleichberechtigt und tauschen direkt aus: Peer-to-Peer.' },
        { id: 'c', text: 'WAN', whyWrong: 'WAN beschreibt die Größe eines Netzes (weltweit). Ob Geräte direkt oder über einen Server tauschen, ist eine andere Frage. Direkt heißt Peer-to-Peer.' },
      ],
      correct: 'a',
      explanation: 'P2P: gleichberechtigte Geräte tauschen direkt.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Warum werden Daten in viele kleine Pakete zerlegt?',
      options: [
        { id: 'a', text: 'Damit viele Geräte die Leitung gleichzeitig nutzen und fehlerhafte Teile einzeln neu gesendet werden können' },
        { id: 'b', text: 'Weil Kabel nur kleine Daten transportieren können', whyWrong: 'Kabel könnten auch lange Datenströme übertragen. Pakete sind sinnvoll, weil sich dann viele Geräte die Leitung teilen können und bei einem Fehler nur ein kleines Stück neu gesendet wird.' },
        { id: 'c', text: 'Damit die Daten verschlüsselt sind', whyWrong: 'Das Zerlegen allein verschlüsselt nichts, jedes Paket kann mitgelesen werden. Verschlüsselung macht z. B. HTTPS. Pakete dienen der fairen Aufteilung und Fehlerbehandlung.' },
      ],
      correct: 'a',
      explanation: 'Paketvermittlung: faire Aufteilung der Leitung, flexible Wege, gezielte Wiederholung.',
    },
    {
      id: 'q14', type: 'single', difficulty: 1,
      prompt: 'Welcher Stecker wird für Netzwerkkabel (Ethernet) verwendet?',
      options: [
        { id: 'a', text: 'RJ45' },
        { id: 'b', text: 'HDMI', whyWrong: 'HDMI überträgt Bild und Ton zu Bildschirm oder Fernseher. Netzwerkkabel nutzen den etwas breiteren RJ45-Stecker mit 8 Kontakten.' },
        { id: 'c', text: 'USB-C', whyWrong: 'Über USB-C kann man zwar Netzwerkadapter anschließen, der Netzwerkstecker selbst ist aber RJ45.' },
        { id: 'd', text: 'RJ11', whyWrong: 'RJ11 ist der schmalere Telefonstecker, z. B. für den DSL-Anschluss. Ethernet nutzt RJ45 mit 8 statt 4 bzw. 6 Kontakten.' },
      ],
      correct: 'a',
      explanation: 'RJ45 (genauer 8P8C) ist der Standardstecker für Ethernet über Kupferkabel.',
    },
    {
      id: 'q15', type: 'multi', difficulty: 2,
      prompt: 'Was bekommt ein PC typischerweise automatisch per DHCP?',
      options: [
        { id: 'a', text: 'IP-Adresse' },
        { id: 'b', text: 'Subnetzmaske' },
        { id: 'c', text: 'Standardgateway' },
        { id: 'd', text: 'DNS-Server' },
        { id: 'e', text: 'MAC-Adresse', whyWrong: 'Die MAC-Adresse ist fest in der Netzwerkkarte gespeichert. Der DHCP-Server bekommt sie vom PC mitgeteilt und vergibt passend dazu die übrigen Einstellungen.' },
      ],
      correct: ['a', 'b', 'c', 'd'],
      explanation: 'DHCP liefert alles, was der PC fürs Netz braucht. Nur die MAC bringt er selbst mit.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Was fehlt im Aufbau?',
        scenario: 'Ein kleines Büro: 6 PCs und ein Drucker hängen per Kabel an einem Switch. Die PCs können drucken und Dateien austauschen. Ins Internet kommen sie nicht. Am Glasfaseranschluss hängt ein Modem, das nur mit einem Kabel zum Switch verbunden ist.',
        options: [
          { id: 'a', text: 'Ein Router zwischen Modem und Switch, der das Büronetz mit dem Internet verbindet' },
          { id: 'b', text: 'Ein zweiter Switch', whyWrong: 'Ein weiterer Switch verbindet nur noch mehr Geräte im selben Netz. Für den Übergang ins Internet, also in ein anderes Netz, braucht man einen Router.' },
          { id: 'c', text: 'Ein Access Point', whyWrong: 'Ein Access Point bringt WLAN-Geräte ins Büronetz. Ins Internet kommen sie damit genauso wenig wie die Kabel-PCs, weil der Router fehlt.' },
          { id: 'd', text: 'Neue Netzwerkkabel', whyWrong: 'Drucken und Dateien tauschen klappt, die Kabel funktionieren also. Es fehlt das Gerät, das zwischen Büronetz und Internet vermittelt: der Router.' },
        ],
        correct: 'a',
        explanation: 'Switch = innerhalb des Netzes. Router = zwischen Netzen, z. B. Büro ↔ Internet. Das Modem passt nur das Signal der Leitung an.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        prompt: 'Was ist das Problem?',
        scenario: 'Ein PC hat diese Einstellungen:\n```\nIP-Adresse . . . : 192.168.1.50\nSubnetzmaske . . : 255.255.255.0\nStandardgateway  : (leer)\nDNS-Server . . . : 192.168.1.1\n```\nDer Drucker unter 192.168.1.30 funktioniert. Webseiten laden nicht.',
        options: [
          { id: 'a', text: 'Das Standardgateway fehlt, darum kommt der PC nicht aus dem eigenen Netz hinaus.' },
          { id: 'b', text: 'Die IP-Adresse ist falsch.', whyWrong: 'Mit 192.168.1.50 erreicht der PC den Drucker im selben Netz, die Adresse passt also. Für das Internet fehlt ihm aber der Weg nach draußen: das Gateway.' },
          { id: 'c', text: 'Die Netzwerkkarte ist defekt.', whyWrong: 'Mit defekter Netzwerkkarte würde auch der Drucker nicht funktionieren. Das Problem betrifft nur Ziele außerhalb des Netzes, also fehlt das Gateway.' },
          { id: 'd', text: 'Der Drucker blockiert das Internet.', whyWrong: 'Ein Drucker leitet keinen Verkehr weiter und kann das Internet nicht blockieren. Ohne Gateway weiß der PC einfach nicht, wohin er Pakete für fremde Netze schicken soll.' },
        ],
        correct: 'a',
        explanation: 'Im eigenen Netz geht alles direkt, für andere Netze braucht der PC das Gateway (hier vermutlich 192.168.1.1).',
      },
      {
        id: 'b3', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen stimmen?',
        options: [
          { id: 'a', text: 'Switches arbeiten mit MAC-Adressen, Router mit IP-Adressen.' },
          { id: 'b', text: 'Die IP-Adresse eines Laptops ändert sich, wenn er in ein anderes Netz kommt.' },
          { id: 'c', text: 'Das Internet besteht aus vielen verbundenen Netzen verschiedener Betreiber.' },
          { id: 'd', text: 'Ein Access Point verbindet das LAN mit dem Internet.', whyWrong: 'Ein Access Point bringt WLAN-Geräte nur ins lokale Netz. Die Verbindung ins Internet macht der Router.' },
          { id: 'e', text: 'Ein Server ist immer ein besonders großer Computer.', whyWrong: '„Server“ beschreibt die Rolle (antwortet auf Anfragen), nicht die Größe. Ein Raspberry Pi oder ein normaler PC kann Server sein. In Firmen nutzt man aber meist ausfallsichere Server-Hardware.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Switch/MAC und Router/IP, IP hängt am Netz, Internet = Netz der Netze.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Eine Firma mit Standorten in Hamburg und München will beide Netze verbinden. Wie heißt so ein Netz?',
        options: [
          { id: 'a', text: 'WAN' },
          { id: 'b', text: 'LAN', whyWrong: 'Ein LAN ist auf ein Gebäude oder Gelände begrenzt. Zwei Städte, Hunderte Kilometer auseinander, verbindet ein WAN.' },
          { id: 'c', text: 'PAN', whyWrong: 'Ein PAN reicht nur wenige Meter um eine Person, z. B. Bluetooth. Für Standorte in verschiedenen Städten braucht man ein WAN.' },
          { id: 'd', text: 'WLAN', whyWrong: 'WLAN ist Funk im lokalen Netz und reicht einige Dutzend Meter. Standorte in verschiedenen Städten verbindet man über ein WAN, meist über Provider-Leitungen oder VPN.' },
        ],
        correct: 'a',
        explanation: 'WAN verbindet weit entfernte Standorte, z. B. per VPN über das Internet oder über gemietete Leitungen.',
      },
      {
        id: 'b5', type: 'ordering', difficulty: 3,
        prompt: 'Dein Laptop im WLAN ruft eine Webseite auf. In welcher Reihenfolge passieren die Daten die Geräte auf dem Weg nach draußen?',
        items: [
          { id: 'lap', text: 'Laptop' },
          { id: 'ap', text: 'Access Point' },
          { id: 'rt', text: 'Router (mit Firewall)' },
          { id: 'mo', text: 'Modem' },
          { id: 'isp', text: 'Netz des Providers / Internet' },
        ],
        explanation: 'Laptop → AP (Funk ins LAN) → Router (in andere Netze) → Modem (Leitungssignal) → Provider.',
      },
    ],
  },
};

export default level;
