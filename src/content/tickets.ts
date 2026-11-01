import type { Ticket } from '../types/content';

// Service-Desk-Tickets: fiktive Firma „Muster GmbH“, fiktive Personen. IDs nie umbenennen (Fortschritt speichert sie).
// Jedes Ticket: Kundentext (prompt) → Schritte wie im echten Support: erst prüfen, dann Ursache, dann Lösung und Nacharbeit.
export const tickets: Ticket[] = [
  // ───────────── Netzwerk ─────────────
  {
    id: 'n01', type: 'chain', category: 'network', priority: 3, difficulty: 1, learn: 'net-04',
    title: 'Kein Internet am Arbeitsplatz',
    reporter: 'Jonas Weber, Buchhaltung',
    prompt: '„Seit ich heute an den neuen Schreibtisch umgezogen bin, habe ich kein Internet und komme auch nicht auf die Laufwerke. Das Netzwerkkabel steckt, die Lampe an der Dose leuchtet.“',
    steps: [
      {
        id: 's1', text: 'Womit fängst du am PC an?',
        options: [
          { id: 'a', text: '`ipconfig /all` ausführen und die IP-Konfiguration ansehen', correct: true, feedback: 'Richtig. Erst Fakten sammeln: Hat der PC eine gültige IP, Maske, Gateway und DNS?' },
          { id: 'b', text: 'Den PC neu aufsetzen', correct: false, feedback: 'Viel zu drastisch. Neu aufsetzen kostet Stunden und löst ein Netzwerkproblem meistens nicht.' },
          { id: 'c', text: 'Den Router im Serverraum neu starten', correct: false, feedback: 'Alle anderen arbeiten normal, also ist der Router nicht das Problem. Ein Neustart würde die ganze Firma stören.' },
        ],
      },
      {
        id: 's2', text: 'Die Ausgabe zeigt:\n```\nAutokonfiguration IPv4-Adresse: 169.254.18.77\nSubnetzmaske: 255.255.0.0\nStandardgateway:\n```\nWas bedeutet das?',
        options: [
          { id: 'a', text: 'Der PC hat keine Antwort von einem DHCP-Server bekommen (APIPA-Adresse).', correct: true, feedback: 'Genau. 169.254.x.x vergibt Windows sich selbst, wenn kein DHCP-Server antwortet.' },
          { id: 'b', text: 'Der PC hat eine gültige Adresse aus dem Firmennetz.', correct: false, feedback: '169.254.0.0/16 ist der APIPA-Bereich (link-local). Damit kommt man nicht ins Firmennetz.' },
          { id: 'c', text: 'Der DNS-Server ist falsch eingetragen.', correct: false, feedback: 'Es fehlt schon die IP-Adresse selbst. DNS ist erst das nächste Thema.' },
        ],
      },
      {
        id: 's3', text: 'Andere PCs im Raum bekommen problemlos eine IP. Auf dem Switch zeigt `show interfaces status` für den Port des PCs **VLAN 99** (ungenutztes VLAN), die Nachbarports **VLAN 10**. Was ist die Ursache?',
        options: [
          { id: 'a', text: 'Der Switchport liegt im falschen VLAN, dort gibt es keinen DHCP-Server.', correct: true, feedback: 'Richtig. Ungenutzte Ports werden oft in ein „totes“ VLAN gelegt. Der neue Platz wurde nie freigeschaltet.' },
          { id: 'b', text: 'Das Netzwerkkabel ist defekt.', correct: false, feedback: 'Der Link ist oben (Lampe leuchtet, Port „connected“). Ein defektes Kabel erklärt nicht das falsche VLAN.' },
          { id: 'c', text: 'Der DHCP-Server ist ausgefallen.', correct: false, feedback: 'Die Nachbar-PCs bekommen Adressen, also läuft der DHCP-Server.' },
        ],
      },
      {
        id: 's4', text: 'Wie löst du das sauber?',
        options: [
          { id: 'a', text: 'Port als Access-Port in VLAN 10 setzen (`switchport access vlan 10`), am PC `ipconfig /renew`, testen und die Änderung im Ticket dokumentieren', correct: true, feedback: 'Perfekt: beheben, prüfen, dokumentieren.' },
          { id: 'b', text: 'Am PC eine feste IP aus VLAN 10 eintragen', correct: false, feedback: 'Der Port liegt weiter in VLAN 99, die feste IP hilft dort nicht. Außerdem drohen Adresskonflikte.' },
          { id: 'c', text: 'Den Port zum Trunk machen', correct: false, feedback: 'Ein Endgerät gehört an einen Access-Port. Ein Trunk zum PC ist unnötig und ein Sicherheitsrisiko.' },
        ],
      },
    ],
    explanation: '**Ursache:** Switchport im ungenutzten VLAN 99, daher keine DHCP-Antwort und APIPA-Adresse.\n\n**Lösung:** Port in VLAN 10, `ipconfig /renew`, Test.\n\n**Merke:** 169.254.x.x heißt immer „DHCP hat nicht geantwortet“. Dann Kabel, Port, VLAN und DHCP-Server prüfen.',
  },
  {
    id: 'n02', type: 'chain', category: 'network', priority: 2, difficulty: 1, learn: 'net-02',
    title: 'Webseiten laden nicht, Teams-Anruf läuft',
    reporter: 'Sabine Krüger, Vertrieb',
    prompt: '„Ich kann keine einzige Webseite öffnen, es kommt immer ‚Server nicht gefunden‘. Komischerweise läuft mein Teams-Anruf weiter.“ Zwei Kolleginnen im selben Büro melden dasselbe.',
    steps: [
      {
        id: 's1', text: 'Du testest am PC:\n```\nping 8.8.8.8        → Antwort, 14 ms\nping www.google.de  → Ping-Anforderung konnte Host nicht finden\n```\nWas schließt du daraus?',
        options: [
          { id: 'a', text: 'Die Internetverbindung steht, aber die Namensauflösung (DNS) klappt nicht.', correct: true, feedback: 'Richtig. IP-Adressen sind erreichbar, nur Namen werden nicht in IPs übersetzt.' },
          { id: 'b', text: 'Die Internetleitung ist ausgefallen.', correct: false, feedback: 'Dann würde auch `ping 8.8.8.8` scheitern.' },
          { id: 'c', text: 'Die Firewall blockiert ICMP.', correct: false, feedback: 'Der Ping auf 8.8.8.8 geht ja durch. Das Problem tritt erst beim Namen auf.' },
        ],
      },
      {
        id: 's2', text: 'Welcher Befehl prüft gezielt den DNS-Server?',
        options: [
          { id: 'a', text: '`nslookup www.google.de`', correct: true, feedback: 'Genau. nslookup zeigt, welcher DNS-Server gefragt wird und ob er antwortet.' },
          { id: 'b', text: '`tracert 8.8.8.8`', correct: false, feedback: 'tracert zeigt den Weg zu einer IP. Für DNS hilft das nicht.' },
          { id: 'c', text: '`arp -a`', correct: false, feedback: 'arp zeigt IP-zu-MAC-Zuordnungen im lokalen Netz, nichts zu DNS.' },
        ],
      },
      {
        id: 's3', text: '`nslookup` meldet: `Server: dc01.muster.local, Address: 10.0.0.10 … DNS request timed out`. Der Server dc01 ist erreichbar. Was prüfst du als Nächstes?',
        options: [
          { id: 'a', text: 'Auf dc01 den DNS-Serverdienst: läuft er? Ereignisanzeige prüfen', correct: true, feedback: 'Richtig. Der Server antwortet auf Ping, aber der DNS-Dienst darauf antwortet nicht.' },
          { id: 'b', text: 'Bei allen Nutzern 8.8.8.8 als DNS eintragen', correct: false, feedback: 'Dann funktionieren interne Namen (Fileserver, Domäne, Anmeldung) nicht mehr. Das ist keine Lösung, sondern ein neues Problem.' },
          { id: 'c', text: 'Die Netzwerkkarte des PCs tauschen', correct: false, feedback: 'Mehrere PCs sind betroffen, der PC selbst ist in Ordnung.' },
        ],
      },
      {
        id: 's4', text: 'Der DNS-Dienst auf dc01 ist nach einem Update nicht gestartet. Du startest ihn. Was gehört noch dazu?',
        options: [
          { id: 'a', text: 'Bei Betroffenen `ipconfig /flushdns` und Test, Ticket mit Ursache schließen, Problem-Ticket für „DNS startet nach Update nicht“ anlegen', correct: true, feedback: 'Sehr gut. Ein Problem-Ticket sorgt dafür, dass die Ursache dauerhaft behoben wird (z. B. zweiter DNS-Server).' },
          { id: 'b', text: 'Nichts, es läuft ja wieder', correct: false, feedback: 'Ohne Doku passiert dasselbe beim nächsten Update wieder.' },
          { id: 'c', text: 'Updates auf dem Server ab sofort deaktivieren', correct: false, feedback: 'Fehlende Sicherheitsupdates sind ein viel größeres Risiko.' },
        ],
      },
    ],
    explanation: '**Ursache:** DNS-Dienst auf dem Domänencontroller lief nicht. Teams lief weiter, weil die bestehende Verbindung schon aufgebaut war.\n\n**Merke:** „Ping auf IP geht, auf Namen nicht“ = DNS-Problem. Werkzeuge: `nslookup`, `ipconfig /flushdns`. Best Practice: mindestens zwei interne DNS-Server.',
  },
  {
    id: 'n03', type: 'chain', category: 'network', priority: 3, difficulty: 2, learn: 'net-08',
    title: 'IP-Adresskonflikt seit dem neuen Drucker',
    reporter: 'Tim Becker, Marketing',
    prompt: '„Mein PC meldet ‚Windows hat einen IP-Adressenkonflikt erkannt‘ und das Netzwerk bricht ständig ab. Seit gestern steht im Flur der neue Farbdrucker.“',
    steps: [
      {
        id: 's1', text: 'Der PC hat per DHCP 192.168.10.50 bekommen. Der neue Drucker hat laut Installationsprotokoll **fest** 192.168.10.50. Der DHCP-Bereich ist 192.168.10.20–192.168.10.200. Was ist passiert?',
        options: [
          { id: 'a', text: 'Die feste Druckeradresse liegt im DHCP-Bereich. Der DHCP-Server hat sie zusätzlich an den PC vergeben.', correct: true, feedback: 'Richtig. Der DHCP-Server weiß nichts von fest eingetragenen Adressen.' },
          { id: 'b', text: 'Der DHCP-Server ist defekt.', correct: false, feedback: 'Er arbeitet korrekt, er kennt die feste Adresse nur nicht.' },
          { id: 'c', text: 'Der Drucker hat einen Virus.', correct: false, feedback: 'Das ist ein klassischer Konfigurationsfehler, kein Angriff.' },
        ],
      },
      {
        id: 's2', text: 'Was ist die saubere dauerhafte Lösung?',
        options: [
          { id: 'a', text: 'Drucker auf DHCP stellen und auf dem DHCP-Server eine **Reservierung** für seine MAC-Adresse anlegen (oder eine Adresse außerhalb des Bereichs bzw. einen Ausschluss nutzen)', correct: true, feedback: 'Genau. Reservierung = feste Adresse, zentral verwaltet.' },
          { id: 'b', text: 'Dem PC eine feste IP geben', correct: false, feedback: 'Dann landet der nächste Konflikt bei einem anderen Gerät. Die Ursache bleibt.' },
          { id: 'c', text: 'Den DHCP-Bereich so lassen und den PC jeden Morgen neu starten', correct: false, feedback: 'Das verschleiert das Problem nur.' },
        ],
      },
      {
        id: 's3', text: 'Wie bekommt der PC danach sofort eine neue, konfliktfreie Adresse?',
        options: [
          { id: 'a', text: '`ipconfig /release` und dann `ipconfig /renew`', correct: true, feedback: 'Richtig. Der PC gibt die alte Adresse zurück und holt eine neue.' },
          { id: 'b', text: '`ipconfig /flushdns`', correct: false, feedback: 'Das leert nur den DNS-Cache, die IP bleibt gleich.' },
          { id: 'c', text: '`netstat -an`', correct: false, feedback: 'netstat zeigt Verbindungen, ändert aber nichts an der Adresse.' },
        ],
      },
    ],
    explanation: '**Ursache:** feste IP eines Druckers mitten im DHCP-Bereich.\n\n**Lösung:** DHCP-Reservierung (MAC → IP) oder feste Adressen nur außerhalb des Bereichs bzw. mit Ausschluss.\n\n**Merke:** Server, Drucker und Netzwerkgeräte bekommen feste Adressen außerhalb des DHCP-Bereichs oder Reservierungen. Dokumentation im IPAM verhindert Doppelvergaben.',
  },
  {
    id: 'n04', type: 'chain', category: 'network', priority: 3, difficulty: 2, learn: 'net-03',
    title: 'Netz im 2. OG extrem langsam',
    reporter: 'Laura Schmidt, Personal',
    prompt: '„Seit dem Austausch des Switches im 2. OG ist das Kopieren auf den Fileserver unerträglich langsam. Internet geht, aber alles ruckelt.“',
    steps: [
      {
        id: 's1', text: 'Auf dem neuen Switch zeigt `show interfaces gi1/0/1` (Uplink zum alten Core-Switch):\n```\nHalf-duplex, 100Mb/s\n  2894 late collision\n```\nDer Core-Switch-Port ist fest auf **100 Mbit/s Vollduplex** konfiguriert. Was liegt vor?',
        options: [
          { id: 'a', text: 'Duplex-Mismatch: Eine Seite ist fest eingestellt, die andere fällt bei Autonegotiation auf Halbduplex zurück.', correct: true, feedback: 'Richtig. Late Collisions auf der Halbduplex-Seite und CRC-Fehler auf der Vollduplex-Seite sind das typische Bild.' },
          { id: 'b', text: 'Das Kabel ist zu lang.', correct: false, feedback: 'Möglich, aber die Kombination „fest auf der einen Seite, Halbduplex auf der anderen“ erklärt die Symptome eindeutig.' },
          { id: 'c', text: 'Ein Broadcast-Sturm', correct: false, feedback: 'Ein Sturm legt meist alles lahm und zeigt sich an sehr hoher Last, nicht an Late Collisions.' },
        ],
      },
      {
        id: 's2', text: 'Wie behebst du es?',
        options: [
          { id: 'a', text: 'Beide Seiten gleich einstellen, am besten beide auf Autonegotiation (`speed auto`, `duplex auto`)', correct: true, feedback: 'Genau. Beide Seiten müssen zueinander passen. Auto/Auto ist heute Standard und bringt oft sogar 1 Gbit/s.' },
          { id: 'b', text: 'Nur den neuen Switch auf Halbduplex fest einstellen', correct: false, feedback: 'Dann ist das Mismatch immer noch da (Core auf Voll-, Access auf Halbduplex).' },
          { id: 'c', text: 'Das Kabel tauschen', correct: false, feedback: 'Das Kabel ist nicht die Ursache, die Konfiguration passt nicht zusammen.' },
        ],
      },
      {
        id: 's3', text: 'Danach prüfst du mit `show interfaces gi1/0/1`. Woran erkennst du den Erfolg?',
        options: [
          { id: 'a', text: '„Full-duplex“ auf beiden Seiten, Fehlerzähler steigen nicht mehr (vorher mit `clear counters` zurücksetzen)', correct: true, feedback: 'Richtig. Zähler zurücksetzen, dann beobachten, ob neue Fehler entstehen.' },
          { id: 'b', text: 'Die Port-LED leuchtet grün', correct: false, feedback: 'Grün heißt nur „Link oben“. Das war auch vorher schon so.' },
          { id: 'c', text: 'Ein einzelner Ping geht durch', correct: false, feedback: 'Ping ging auch vorher. Duplexprobleme zeigen sich erst unter Last.' },
        ],
      },
    ],
    explanation: '**Ursache:** Duplex-Mismatch zwischen fest konfiguriertem Core-Port und Autonegotiation am neuen Switch.\n\n**Merke:** Halbduplex-Seite = Late Collisions, Vollduplex-Seite = CRC-Fehler/Runts. Beide Seiten gleich konfigurieren, am besten auto/auto.',
  },
  {
    id: 'n05', type: 'chain', category: 'network', priority: 1, difficulty: 2, learn: 'net-06',
    title: 'Ganze Etage offline, Switch-LEDs blinken wild',
    reporter: 'Empfang, Erdgeschoss',
    prompt: '„Im ganzen Erdgeschoss geht nichts mehr, weder Telefon noch PC. Die Lämpchen am Switch im Technikschrank blinken alle wie verrückt.“ Kurz vorher hat der Hausmeister im Besprechungsraum „ein Kabel eingesteckt, das herumlag“.',
    steps: [
      {
        id: 's1', text: 'Welche Priorität bekommt das Ticket?',
        options: [
          { id: 'a', text: 'P1 (kritisch): viele Nutzer betroffen, Arbeit unmöglich', correct: true, feedback: 'Richtig. Priorität = Auswirkung × Dringlichkeit. Eine ganze Etage ohne Netz ist kritisch.' },
          { id: 'b', text: 'P3 (mittel), es ist ja nur ein Stockwerk', correct: false, feedback: 'Alle Mitarbeitenden einer Etage können nicht arbeiten. Das ist eine hohe Auswirkung mit hoher Dringlichkeit.' },
          { id: 'c', text: 'P4 (niedrig), erst mal abwarten', correct: false, feedback: 'Abwarten verlängert den Ausfall für viele Menschen.' },
        ],
      },
      {
        id: 's2', text: 'Im Switch-Log steht `%SW_MATM-4-MACFLAP_NOTIF: Host 0011.2233.4455 in vlan 10 is flapping between port Gi1/0/12 and port Gi1/0/14`. Was ist das wahrscheinlichste Problem?',
        options: [
          { id: 'a', text: 'Eine Schleife (Loop), die einen Broadcast-Sturm auslöst', correct: true, feedback: 'Richtig. Dieselbe MAC taucht abwechselnd an zwei Ports auf, weil Frames im Kreis laufen.' },
          { id: 'b', text: 'Ein DHCP-Ausfall', correct: false, feedback: 'Ein DHCP-Ausfall lässt LEDs nicht dauerhaft blinken und erzeugt keine MAC-Flaps.' },
          { id: 'c', text: 'Ein defekter Port', correct: false, feedback: 'Ein defekter Port würde nur ein Gerät betreffen, nicht die ganze Etage.' },
        ],
      },
      {
        id: 's3', text: 'Ports 12 und 14 führen beide in den Besprechungsraum. Dort sind zwei Wanddosen mit einem Kabel direkt verbunden. Was tust du sofort?',
        options: [
          { id: 'a', text: 'Das Kabel ziehen (oder einen der Ports per `shutdown` abschalten) und prüfen, ob das Netz zurückkommt', correct: true, feedback: 'Richtig. Erst den Dienst wiederherstellen, dann die Ursache dauerhaft beseitigen.' },
          { id: 'b', text: 'Den Switch neu starten', correct: false, feedback: 'Nach dem Neustart ist die Schleife sofort wieder da.' },
          { id: 'c', text: 'Den Hausmeister abmahnen lassen', correct: false, feedback: 'Schuldzuweisung löst nichts. Technisch muss das Netz so etwas abfangen.' },
        ],
      },
      {
        id: 's4', text: 'Wie verhinderst du das dauerhaft?',
        options: [
          { id: 'a', text: 'Spanning Tree auf allen Switches aktiv lassen, auf Access-Ports PortFast mit **BPDU Guard** aktivieren, ungenutzte Dosen deaktivieren', correct: true, feedback: 'Genau. STP blockiert Schleifen, BPDU Guard schaltet einen Port ab, sobald dort ein Switch oder eine Schleife auftaucht.' },
          { id: 'b', text: 'Alle Besprechungsräume ohne Netzwerkdosen bauen', correct: false, feedback: 'Unpraktisch, und Schleifen können überall entstehen.' },
          { id: 'c', text: 'Spanning Tree abschalten, damit Ports schneller hochkommen', correct: false, feedback: 'Genau das macht Schleifen so gefährlich. PortFast reicht für schnelle Endgeräte-Ports.' },
        ],
      },
    ],
    explanation: '**Ursache:** zwei Wanddosen miteinander verbunden, dadurch eine Layer-2-Schleife und ein Broadcast-Sturm (STP war auf dem Etagenswitch deaktiviert).\n\n**Merke:** MAC-Flapping + blinkende LEDs + Totalausfall = Loop. Schutz: STP/RSTP, BPDU Guard auf Access-Ports, ungenutzte Ports abschalten.',
  },
  {
    id: 'n06', type: 'chain', category: 'network', priority: 3, difficulty: 3, learn: 'net-04',
    title: 'VPN verbunden, Fileserver trotzdem nicht erreichbar',
    reporter: 'Markus Hoffmann, Einkauf (Homeoffice)',
    prompt: '„Das VPN sagt ‚verbunden‘, aber das Laufwerk \\\\fs01 geht nicht. Meine Kollegen im Homeoffice haben das Problem nicht.“',
    steps: [
      {
        id: 's1', text: 'Am Laptop zeigt `ipconfig`: WLAN-Adapter **192.168.1.34/24** (Heimrouter), VPN-Adapter 10.8.0.15. Der Fileserver fs01 hat in der Firma **192.168.1.20**. Was ist das Problem?',
        options: [
          { id: 'a', text: 'Heimnetz und Firmennetz nutzen dasselbe Subnetz. Der Laptop sucht 192.168.1.20 im eigenen WLAN statt im VPN.', correct: true, feedback: 'Richtig. Für ein direkt angeschlossenes Netz geht der Verkehr nie in den Tunnel (überlappende Subnetze).' },
          { id: 'b', text: 'Das VPN ist zu langsam.', correct: false, feedback: 'Es kommt gar keine Verbindung zustande, das ist kein Tempoproblem.' },
          { id: 'c', text: 'Der Fileserver ist ausgefallen.', correct: false, feedback: 'Die Kollegen im Homeoffice erreichen ihn ja.' },
        ],
      },
      {
        id: 's2', text: 'Was ist für den Nutzer eine schnelle Lösung?',
        options: [
          { id: 'a', text: 'Im Heimrouter das LAN auf ein anderes Netz umstellen (z. B. 192.168.178.0/24)', correct: true, feedback: 'Genau. Dann gibt es keine Überschneidung mehr und 192.168.1.20 geht durch den Tunnel.' },
          { id: 'b', text: 'Den Laptop per Kabel statt WLAN anschließen', correct: false, feedback: 'Auch am Kabel bleibt das Heimnetz 192.168.1.0/24.' },
          { id: 'c', text: 'Das VPN zweimal hintereinander verbinden', correct: false, feedback: 'Die Routingentscheidung bleibt gleich.' },
        ],
      },
      {
        id: 's3', text: 'Was sollte die IT langfristig tun?',
        options: [
          { id: 'a', text: 'Für Firmennetze keine typischen Heimnetz-Bereiche (192.168.0.x/1.x/178.x) verwenden, sondern z. B. Teile von 10.0.0.0/8 – bei der nächsten Umstellung einplanen', correct: true, feedback: 'Richtig. Viele Heimrouter nutzen 192.168.0.0/24, 192.168.1.0/24 oder 192.168.178.0/24.' },
          { id: 'b', text: 'Allen Mitarbeitenden Homeoffice verbieten', correct: false, feedback: 'Das löst ein technisches Problem durch eine unnötige Einschränkung.' },
          { id: 'c', text: 'Öffentliche IP-Adressen im Firmennetz nutzen', correct: false, feedback: 'Fremde öffentliche Adressen intern zu verwenden führt zu neuen Konflikten im Internet.' },
        ],
      },
    ],
    explanation: '**Ursache:** überlappende Subnetze (Heimnetz = Firmennetz 192.168.1.0/24).\n\n**Merke:** Ein direkt verbundenes Netz gewinnt immer gegen die VPN-Route. Firmennetze deshalb aus selten genutzten privaten Bereichen planen.',
  },
  {
    id: 'n07', type: 'chain', category: 'network', priority: 3, difficulty: 2, learn: 'net-10',
    title: 'WLAN im Besprechungsraum bricht ständig ab',
    reporter: 'Nina Wolf, Geschäftsleitung',
    prompt: '„Im großen Besprechungsraum bricht das WLAN in Videokonferenzen ständig ab. Die Balken zeigen volle Stärke.“',
    steps: [
      {
        id: 's1', text: 'Ein WLAN-Scan zeigt im 2,4-GHz-Band: dein AP auf **Kanal 7**, die Nachbarfirma auf Kanal 6 und 8, ein weiterer Firmen-AP auf Kanal 5. Was ist das Problem?',
        options: [
          { id: 'a', text: 'Überlappende Kanäle stören sich gegenseitig (Interferenz).', correct: true, feedback: 'Richtig. Im 2,4-GHz-Band überlappen benachbarte Kanäle. Nur 1, 6 und 11 überlappen sich nicht.' },
          { id: 'b', text: 'Das Signal ist zu schwach.', correct: false, feedback: 'Die Signalstärke ist voll. Das Problem ist Störung, nicht Reichweite.' },
          { id: 'c', text: 'Der DHCP-Server vergibt zu wenige Adressen.', correct: false, feedback: 'Dann würde gar keine Verbindung zustande kommen, statt dass sie abbricht.' },
        ],
      },
      {
        id: 's2', text: 'Was hilft am meisten?',
        options: [
          { id: 'a', text: 'Clients bevorzugt ins **5-GHz-Band** bringen (viel mehr überlappungsfreie Kanäle), im 2,4-GHz-Band nur Kanäle 1, 6, 11 nutzen', correct: true, feedback: 'Genau. 5 GHz hat viel mehr Kanäle. Im 2,4-GHz-Band nur die drei überlappungsfreien verwenden.' },
          { id: 'b', text: 'Die Sendeleistung auf Maximum stellen', correct: false, feedback: 'Mehr Leistung erhöht auch die Störung für andere und hilft gegen Interferenz kaum.' },
          { id: 'c', text: 'Einen zweiten AP auf Kanal 7 daneben stellen', correct: false, feedback: 'Noch ein AP auf einem überlappenden Kanal macht es schlimmer.' },
        ],
      },
    ],
    explanation: '**Ursache:** Kanal-Überlappung im 2,4-GHz-Band.\n\n**Merke:** 2,4 GHz: nur 1/6/11 überlappungsfrei, viele Störquellen (Bluetooth, Mikrowelle). 5 GHz und 6 GHz (Wi-Fi 6E/7) bieten viel mehr Kanäle. Bei vielen APs plant ein WLAN-Controller die Kanäle automatisch.',
  },
  {
    id: 'n08', type: 'chain', category: 'network', priority: 3, difficulty: 1, learn: 'net-04',
    title: 'Neuer PC erreicht nur das eigene Netz',
    reporter: 'Kevin Braun, Lager',
    prompt: '„Der neue Lager-PC kann den Drucker neben sich erreichen, aber nicht den Server in der Zentrale und auch kein Internet.“ Der PC wurde von einem Azubi mit fester IP eingerichtet.',
    steps: [
      {
        id: 's1', text: '`ipconfig` zeigt: IP 10.20.5.40, Maske 255.255.255.0, Gateway **10.20.6.1**. Was fällt auf?',
        options: [
          { id: 'a', text: 'Das Gateway liegt nicht im eigenen Subnetz (10.20.5.0/24).', correct: true, feedback: 'Richtig. Das Gateway muss im eigenen Netz liegen, sonst kann der PC es nicht direkt erreichen.' },
          { id: 'b', text: 'Die Maske ist falsch.', correct: false, feedback: '/24 passt zum Lagernetz. Das Gateway ist falsch eingetragen.' },
          { id: 'c', text: 'Nichts, alles korrekt', correct: false, feedback: 'Ohne erreichbares Gateway kommt der PC nicht aus dem eigenen Subnetz heraus.' },
        ],
      },
      {
        id: 's2', text: 'Laut Netzdoku ist das Gateway des Lagers **10.20.5.1**. Was ist die beste Lösung?',
        options: [
          { id: 'a', text: 'PC auf DHCP umstellen, damit IP, Gateway und DNS automatisch richtig kommen', correct: true, feedback: 'Genau. Clients per DHCP konfigurieren verhindert Tippfehler.' },
          { id: 'b', text: 'Eine statische Route für jedes Zielnetz am PC eintragen', correct: false, feedback: 'Viel zu aufwendig und fehleranfällig. Dafür gibt es das Default Gateway.' },
          { id: 'c', text: 'Die Maske auf 255.255.0.0 vergrößern', correct: false, feedback: 'Dann hält der PC fremde Netze für lokal. Das macht es schlimmer.' },
        ],
      },
    ],
    explanation: '**Ursache:** falsches Default Gateway (Tippfehler bei fester IP).\n\n**Merke:** Lokales Netz geht, alles andere nicht = Gateway prüfen. Endgeräte per DHCP konfigurieren.',
  },
  {
    id: 'n09', type: 'chain', category: 'network', priority: 2, difficulty: 2, learn: 'net-08',
    title: 'Gäste-WLAN: neue Geräte bekommen keine Adresse',
    reporter: 'Empfang',
    prompt: '„Bei der Kundenveranstaltung können sich viele Gäste nicht ins Gäste-WLAN einwählen. Bei manchen steht ‚Keine IP-Adresse erhalten‘. Gestern war auch schon eine Veranstaltung.“',
    steps: [
      {
        id: 's1', text: 'Der DHCP-Server zeigt für das Gäste-Netz 192.168.50.0/24: **Bereich zu 100 % belegt**, Leasedauer **8 Tage**. Was ist passiert?',
        options: [
          { id: 'a', text: 'Die Adressen der Gäste von gestern sind noch verliehen, der Bereich ist erschöpft.', correct: true, feedback: 'Richtig. Mit 8 Tagen Lease bleiben Adressen lange belegt, auch wenn die Geräte längst weg sind.' },
          { id: 'b', text: 'Das WLAN-Passwort ist falsch.', correct: false, feedback: 'Mit falschem Passwort kommt man gar nicht bis zur IP-Vergabe.' },
          { id: 'c', text: 'Der Access Point ist überhitzt.', correct: false, feedback: 'Die Ursache steht im DHCP-Server: keine freien Adressen.' },
        ],
      },
      {
        id: 's2', text: 'Was ist für ein Gäste-WLAN die richtige Lösung?',
        options: [
          { id: 'a', text: 'Kurze Leasedauer (z. B. 1–4 Stunden) und bei Bedarf ein größeres Netz (z. B. /23)', correct: true, feedback: 'Genau. Gäste wechseln oft, kurze Leases geben Adressen schnell frei.' },
          { id: 'b', text: 'Den Gästen feste IP-Adressen auf Zetteln geben', correct: false, feedback: 'Unpraktisch und fehleranfällig (Doppelvergaben).' },
          { id: 'c', text: 'Das Gäste-WLAN ins Firmennetz verlegen', correct: false, feedback: 'Gäste gehören aus Sicherheitsgründen in ein getrenntes Netz.' },
        ],
      },
    ],
    explanation: '**Ursache:** DHCP-Bereich durch lange Leasedauer erschöpft.\n\n**Merke:** Leasedauer an die Nutzung anpassen: Büro-PCs Tage, Gäste-WLAN Stunden. Gäste immer getrennt (eigenes VLAN, nur Internet).',
  },
  {
    id: 'n10', type: 'chain', category: 'network', priority: 3, difficulty: 2, learn: 'net-11',
    title: 'Netzwerkdose plötzlich tot',
    reporter: 'Felix Neumann, Entwicklung',
    prompt: '„Ich habe einen kleinen Switch mitgebracht, damit ich Laptop und Testgerät gleichzeitig anschließen kann. Seitdem geht an meiner Dose gar nichts mehr, auch nicht ohne den Switch.“',
    steps: [
      {
        id: 's1', text: '`show interfaces status` zeigt den Port als **err-disabled**. `show port-security interface gi1/0/8` zeigt `Violation Mode: Shutdown`, `Maximum MAC Addresses: 1`, `Security Violation Count: 1`. Was ist passiert?',
        options: [
          { id: 'a', text: 'Port Security hat eine zweite MAC-Adresse erkannt und den Port abgeschaltet.', correct: true, feedback: 'Richtig. Erlaubt ist 1 MAC, durch den Mini-Switch kamen mehrere. Modus „shutdown“ = Port geht in err-disabled.' },
          { id: 'b', text: 'Der Port ist kaputt.', correct: false, feedback: 'err-disabled ist ein Schutzzustand, kein Hardwaredefekt.' },
          { id: 'c', text: 'STP blockiert den Port wegen einer Schleife.', correct: false, feedback: 'STP zeigt dann „blocking“, nicht err-disabled mit Port-Security-Verstoß.' },
        ],
      },
      {
        id: 's2', text: 'Der Nutzer braucht wirklich zwei Geräte. Was tust du?',
        options: [
          { id: 'a', text: 'Mini-Switch entfernen, zweite Dose oder offiziellen Anschluss bereitstellen, dann den Port mit `shutdown` / `no shutdown` wieder aktivieren', correct: true, feedback: 'Genau. Erst die Ursache beseitigen, dann den Port wieder einschalten. Private Switches sind meist nicht erlaubt.' },
          { id: 'b', text: 'Port Security auf diesem Port komplett abschalten', correct: false, feedback: 'Damit hebelst du eine Sicherheitsmaßnahme aus. Erst klären, ob das erlaubt ist.' },
          { id: 'c', text: 'Den Switch neu starten', correct: false, feedback: 'Das betrifft alle Nutzer am Switch und behebt die Ursache nicht.' },
        ],
      },
    ],
    explanation: '**Ursache:** Port Security (max. 1 MAC, Modus shutdown) hat wegen des privaten Mini-Switches ausgelöst.\n\n**Merke:** err-disabled-Port: Ursache beheben, dann `shutdown` + `no shutdown`. Port Security schützt vor fremden Geräten und Mini-Switches am Arbeitsplatz.',
  },

  // ───────────── Cloud ─────────────
  {
    id: 'c01', type: 'chain', category: 'cloud', priority: 2, difficulty: 2, learn: 'cloud-03',
    title: 'Azure-VM per RDP nicht erreichbar',
    reporter: 'Paul Richter, Entwicklung',
    prompt: '„Ich habe in Azure eine neue Windows-VM angelegt. Die Remotedesktop-Verbindung läuft ins Timeout. Die VM läuft laut Portal.“',
    steps: [
      {
        id: 's1', text: 'Welches Werkzeug prüft am schnellsten, ob eine Regel Port 3389 blockiert?',
        options: [
          { id: 'a', text: 'Network Watcher **IP-Flussüberprüfung** (IP flow verify) bzw. die **effektiven Sicherheitsregeln** der Netzwerkkarte', correct: true, feedback: 'Richtig. Beide zeigen, welche NSG-Regel den Verkehr erlaubt oder blockiert.' },
          { id: 'b', text: 'Die VM löschen und neu anlegen', correct: false, feedback: 'Mit derselben Netzwerkkonfiguration tritt das Problem wieder auf.' },
          { id: 'c', text: 'Azure Advisor', correct: false, feedback: 'Advisor gibt allgemeine Empfehlungen, prüft aber keinen konkreten Verkehrsfluss.' },
        ],
      },
      {
        id: 's2', text: 'Ergebnis: **Zugriff verweigert durch Regel DenyAllInBound**. Es gibt keine Regel für 3389. Was ist die sicherste Lösung?',
        options: [
          { id: 'a', text: '**Azure Bastion** nutzen (RDP über das Portal per HTTPS, die VM braucht keine öffentliche IP) oder Port 3389 nur von der Firmen-IP erlauben', correct: true, feedback: 'Genau. RDP offen ins Internet wird innerhalb von Minuten von Bots angegriffen.' },
          { id: 'b', text: 'Eine Regel „3389 von Any erlauben“ mit Priorität 100 anlegen', correct: false, feedback: 'Funktioniert, ist aber ein großes Sicherheitsrisiko (Brute-Force-Angriffe).' },
          { id: 'c', text: 'Die NSG komplett von der VM entfernen', correct: false, feedback: 'Ohne NSG fehlt der Schutz auf Netzebene ganz.' },
        ],
      },
    ],
    explanation: '**Ursache:** keine eingehende NSG-Regel für RDP, daher greift die Standardregel DenyAllInBound.\n\n**Merke:** RDP/SSH nie für alle offen. Besser: Azure Bastion, Just-in-Time-Zugriff (Defender for Cloud) oder VPN. Diagnose mit Network Watcher (IP flow verify, effektive Regeln).',
  },
  {
    id: 'c02', type: 'chain', category: 'cloud', priority: 2, difficulty: 2, learn: 'cloud-04',
    title: 'App auf EC2: AccessDenied beim S3-Zugriff',
    reporter: 'DevOps-Team',
    prompt: '„Unsere App auf EC2 soll Rechnungen aus dem Bucket `muster-rechnungen` lesen. Im Log steht: `An error occurred (AccessDenied) when calling the GetObject operation`.“',
    steps: [
      {
        id: 's1', text: 'Was prüfst du zuerst auf der Instanz?',
        options: [
          { id: 'a', text: 'Mit welcher Identität die App arbeitet: `aws sts get-caller-identity` (welche IAM-Rolle hat die Instanz?)', correct: true, feedback: 'Richtig. Erst klären, *wer* zugreift, dann *was* diese Identität darf.' },
          { id: 'b', text: 'Den Bucket öffentlich machen', correct: false, feedback: 'Rechnungen öffentlich ins Internet zu stellen wäre ein schwerer Datenschutzverstoß.' },
          { id: 'c', text: 'Die Instanz neu starten', correct: false, feedback: 'Rechte ändern sich durch einen Neustart nicht.' },
        ],
      },
      {
        id: 's2', text: 'Die Instanz nutzt die Rolle `app-role`. Deren Richtlinie erlaubt `s3:ListBucket` auf dem Bucket, aber kein `s3:GetObject`. Wie löst du das richtig?',
        options: [
          { id: 'a', text: 'Der Rolle `s3:GetObject` auf `arn:aws:s3:::muster-rechnungen/*` erlauben (nur das Nötige)', correct: true, feedback: 'Genau. Least Privilege: nur die Aktion, nur dieser Bucket. Achtung: Objekte = `bucket/*`.' },
          { id: 'b', text: 'Der Rolle `AdministratorAccess` geben', correct: false, feedback: 'Viel zu viele Rechte. Wird die App gehackt, gehört dem Angreifer das ganze Konto.' },
          { id: 'c', text: 'Access Keys eines Admins in die App-Konfiguration schreiben', correct: false, feedback: 'Dauerhafte Schlüssel in Dateien sind ein Sicherheitsrisiko. Rollen liefern automatisch kurzlebige Zugangsdaten.' },
        ],
      },
    ],
    explanation: '**Ursache:** IAM-Rolle der Instanz hatte kein `s3:GetObject`.\n\n**Merke:** `ListBucket` gilt für den Bucket (`arn:…:bucket`), `GetObject` für Objekte (`arn:…:bucket/*`). Auf EC2 immer Rollen statt Access Keys verwenden.',
  },
  {
    id: 'c03', type: 'chain', category: 'cloud', priority: 3, difficulty: 2, learn: 'cloud-03',
    title: 'Azure-Rechnung plötzlich doppelt so hoch',
    reporter: 'Claudia Fischer, Controlling',
    prompt: '„Die Azure-Rechnung für Oktober ist doppelt so hoch wie sonst. Niemand kann sagen, warum.“',
    steps: [
      {
        id: 's1', text: 'Wo findest du heraus, welche Ressourcen die Kosten verursachen?',
        options: [
          { id: 'a', text: 'Microsoft **Cost Management**: Kostenanalyse nach Ressource, Ressourcengruppe und Tags gruppieren', correct: true, feedback: 'Richtig. Dort siehst du genau, was wie viel kostet.' },
          { id: 'b', text: 'Im Preisrechner (Pricing Calculator)', correct: false, feedback: 'Der Preisrechner schätzt geplante Kosten, er zeigt keine tatsächlichen Verbräuche.' },
          { id: 'c', text: 'In der Aktivitätsprotokoll-Suche nach „Kosten“', correct: false, feedback: 'Das Aktivitätsprotokoll zeigt Änderungen, keine Kosten.' },
        ],
      },
      {
        id: 's2', text: 'Ergebnis: Drei große Test-VMs laufen seit Wochen. Ein Entwickler sagt: „Die habe ich doch im Betriebssystem heruntergefahren.“ Warum kosten sie trotzdem?',
        options: [
          { id: 'a', text: 'Herunterfahren im Betriebssystem lässt die VM **zugeordnet** (Stopped). Nur „Beenden“ im Portal (**Stopped (deallocated)**) stoppt die Compute-Kosten.', correct: true, feedback: 'Genau. Und die Datenträger kosten in beiden Fällen weiter.' },
          { id: 'b', text: 'Azure berechnet VMs immer, egal ob sie laufen', correct: false, feedback: 'Im Zustand „Stopped (deallocated)“ fallen keine Compute-Kosten an, nur noch Speicher.' },
          { id: 'c', text: 'Die VMs wurden gehackt', correct: false, feedback: 'Die Ursache ist eine bekannte Falle beim Stoppen, kein Angriff.' },
        ],
      },
      {
        id: 's3', text: 'Wie verhinderst du das künftig?',
        options: [
          { id: 'a', text: '**Budgets mit Warnungen** einrichten, Ressourcen taggen (Besitzer, Projekt), Test-VMs mit automatischem Herunterfahren (Auto-Shutdown)', correct: true, feedback: 'Richtig. Budgets warnen früh, Tags zeigen die Verantwortlichen, Auto-Shutdown verhindert Leerlaufkosten.' },
          { id: 'b', text: 'Allen Entwicklern den Zugang zu Azure sperren', correct: false, feedback: 'Das verhindert Arbeit statt Verschwendung.' },
          { id: 'c', text: 'Alles auf Reserved Instances umstellen', correct: false, feedback: 'Reservierungen lohnen sich für dauerhaft laufende VMs, nicht für vergessene Test-VMs.' },
        ],
      },
    ],
    explanation: '**Ursache:** Test-VMs nur im Gastbetriebssystem heruntergefahren, daher weiter zugeordnet und berechnet.\n\n**Merke:** Stopped ≠ Stopped (deallocated). Kosten im Griff: Cost Management, Budgets, Tags, Auto-Shutdown, Azure Advisor.',
  },
  {
    id: 'c04', type: 'chain', category: 'cloud', priority: 3, difficulty: 2, learn: 'cloud-05',
    title: 'EC2 im privaten Subnetz lädt keine Updates',
    reporter: 'DevOps-Team',
    prompt: '„Unsere Datenbank-Instanz im privaten Subnetz kann keine Sicherheitsupdates laden (`Connection timed out`). Die Webserver im öffentlichen Subnetz können es.“',
    steps: [
      {
        id: 's1', text: 'Die Routingtabelle des privaten Subnetzes enthält nur `10.0.0.0/16 → local`. Was fehlt?',
        options: [
          { id: 'a', text: 'Eine Default-Route `0.0.0.0/0` zu einem **NAT Gateway**', correct: true, feedback: 'Richtig. Ohne Default-Route kennt das Subnetz keinen Weg ins Internet.' },
          { id: 'b', text: 'Eine Route `0.0.0.0/0` direkt zum Internet Gateway', correct: false, feedback: 'Dann wäre das Subnetz öffentlich. Ohne öffentliche IP klappt es trotzdem nicht, und die Datenbank soll privat bleiben.' },
          { id: 'c', text: 'Nichts, private Subnetze haben nie Internet', correct: false, feedback: 'Ausgehend ist Internet über ein NAT Gateway möglich und üblich (z. B. für Updates).' },
        ],
      },
      {
        id: 's2', text: 'Wo muss das NAT Gateway liegen?',
        options: [
          { id: 'a', text: 'In einem **öffentlichen** Subnetz (mit Route zum Internet Gateway), mit Elastic IP', correct: true, feedback: 'Genau. Das NAT Gateway braucht selbst den Weg ins Internet.' },
          { id: 'b', text: 'Im privaten Subnetz neben der Datenbank', correct: false, feedback: 'Dort hätte das NAT Gateway selbst keinen Weg ins Internet.' },
          { id: 'c', text: 'Auf der Datenbank-Instanz installiert', correct: false, feedback: 'Das NAT Gateway ist ein verwalteter AWS-Dienst, keine Software auf der Instanz.' },
        ],
      },
    ],
    explanation: '**Ursache:** keine Default-Route im privaten Subnetz.\n\n**Merke:** Privates Subnetz → `0.0.0.0/0` → NAT Gateway (liegt im öffentlichen Subnetz) → Internet Gateway. Für mehr Ausfallsicherheit ein NAT Gateway pro Availability Zone. In Azure ist das Gegenstück das NAT Gateway bzw. die (auslaufende) Standard-Ausgangsverbindung.',
  },
  {
    id: 'c05', type: 'chain', category: 'cloud', priority: 1, difficulty: 3, learn: 'cloud-05',
    title: 'Shop nach Umbau: 504 Gateway Timeout',
    reporter: 'E-Commerce-Team',
    prompt: '„Seit dem Umbau heute Nacht zeigt unser Online-Shop nur noch ‚504 Gateway Time-out‘. Er läuft hinter einem Application Load Balancer.“',
    steps: [
      {
        id: 's1', text: 'Die Target Group zeigt alle Instanzen als **unhealthy** (Health check: Request timed out). Was bedeutet das?',
        options: [
          { id: 'a', text: 'Der Load Balancer erreicht die Instanzen nicht oder bekommt keine Antwort.', correct: true, feedback: 'Richtig. Timeout heißt: Es kommt gar keine Antwort zurück. Häufigste Ursache: eine Firewall-Regel (Security Group).' },
          { id: 'b', text: 'Die Domain ist abgelaufen.', correct: false, feedback: 'Dann käme man gar nicht bis zum Load Balancer.' },
          { id: 'c', text: 'Die Datenbank ist voll.', correct: false, feedback: 'Das würde eher einen Fehler der Anwendung (5xx vom Ziel) erzeugen, keinen Timeout beim Health Check.' },
        ],
      },
      {
        id: 's2', text: 'Die Security Group der Instanzen erlaubt Port 80 nur von `10.0.1.0/24`. Beim Umbau wurde der Load Balancer in die Subnetze `10.0.3.0/24` und `10.0.4.0/24` verschoben. Was ist die beste Lösung?',
        options: [
          { id: 'a', text: 'Eingehende Regel Port 80 mit der **Security Group des Load Balancers als Quelle**', correct: true, feedback: 'Genau. Eine SG als Quelle passt automatisch, egal in welchem Subnetz der Load Balancer liegt.' },
          { id: 'b', text: 'Port 80 von `0.0.0.0/0` erlauben', correct: false, feedback: 'Dann könnte jeder die Instanzen direkt erreichen und den Load Balancer (und eine WAF) umgehen.' },
          { id: 'c', text: 'Den Health Check abschalten', correct: false, feedback: 'Ohne Health Check würden Anfragen auch an kaputte Instanzen gehen. Die Ursache bleibt.' },
        ],
      },
      {
        id: 's3', text: 'Was gehört nach der Behebung eines P1-Ausfalls dazu?',
        options: [
          { id: 'a', text: 'Kurze **Nachbetrachtung (Post-Mortem)**: Was ist passiert, warum, wie verhindern wir es (z. B. Test nach Änderungen, Change-Prozess)?', correct: true, feedback: 'Richtig. Ohne Schuldzuweisung aus dem Ausfall lernen.' },
          { id: 'b', text: 'Den Verantwortlichen für den Umbau suchen und bestrafen', correct: false, feedback: 'Schuldkultur führt dazu, dass Fehler verschwiegen werden. Prozesse verbessern hilft mehr.' },
          { id: 'c', text: 'Nichts weiter, Hauptsache es läuft', correct: false, feedback: 'Dann passiert es beim nächsten Umbau wieder.' },
        ],
      },
    ],
    explanation: '**Ursache:** Security Group der Instanzen ließ den Load Balancer nach dem Subnetzwechsel nicht mehr zu, daher Health-Check-Timeouts und 504.\n\n**Merke:** Bei ALB: 502 = ungültige Antwort vom Ziel, 503 = keine Ziele registriert, 504 = Ziel antwortet nicht rechtzeitig. Security Groups als Quelle referenzieren statt IP-Bereichen.',
  },
  {
    id: 'c06', type: 'chain', category: 'cloud', priority: 3, difficulty: 2, learn: 'cloud-03',
    title: 'App kann Blob-Dateien plötzlich nicht mehr lesen',
    reporter: 'Web-Team',
    prompt: '„Unsere Webseite zeigt seit heute keine Produktbilder mehr. Im Browser-Log: `403 AuthenticationFailed – Signature not valid in the specified time frame`. Die Bilder liegen in Azure Blob Storage.“',
    steps: [
      {
        id: 's1', text: 'Die App greift mit einer URL mit `?sv=…&se=2026-10-31…&sig=…` zu. Was ist die Ursache?',
        options: [
          { id: 'a', text: 'Das **SAS-Token** ist abgelaufen (`se` = Ablaufzeit).', correct: true, feedback: 'Richtig. Ein Shared Access Signature-Token gilt nur bis zur Ablaufzeit.' },
          { id: 'b', text: 'Der Storage Account wurde gelöscht.', correct: false, feedback: 'Dann käme ein anderer Fehler (Ressource nicht gefunden), nicht ein Zeitproblem der Signatur.' },
          { id: 'c', text: 'Der Container ist voll.', correct: false, feedback: 'Container haben praktisch keine Größenbeschränkung, und das wäre kein Signaturfehler.' },
        ],
      },
      {
        id: 's2', text: 'Was ist die beste dauerhafte Lösung für eine App, die in Azure läuft?',
        options: [
          { id: 'a', text: 'Eine **verwaltete Identität** (Managed Identity) mit der Rolle „Storage Blob Data Reader“ nutzen, dann gibt es keine ablaufenden Tokens im Code', correct: true, feedback: 'Genau. Managed Identities brauchen keine gespeicherten Geheimnisse und keine manuelle Erneuerung.' },
          { id: 'b', text: 'Ein neues SAS-Token mit 100 Jahren Laufzeit erzeugen', correct: false, feedback: 'Ein fast unbegrenzt gültiges Token wäre bei einem Leck ein dauerhaftes Sicherheitsrisiko.' },
          { id: 'c', text: 'Den Container auf öffentlich stellen', correct: false, feedback: 'Nur sinnvoll, wenn die Inhalte wirklich öffentlich sein dürfen, und dann bewusst, nicht als schnelle Fehlerbehebung.' },
        ],
      },
    ],
    explanation: '**Ursache:** abgelaufenes SAS-Token.\n\n**Merke:** Zugriff auf Storage: Kontoschlüssel (volle Rechte, vermeiden), SAS (zeitlich begrenzt, kurze Laufzeit), Entra ID/Managed Identity mit RBAC (empfohlen).',
  },
  {
    id: 'c07', type: 'chain', category: 'cloud', priority: 4, difficulty: 1, learn: 'cloud-03',
    title: 'Kollege sieht die Ressourcengruppe nicht',
    reporter: 'Lukas Meyer, Entwicklung',
    prompt: '„Ich soll im Projekt ‚Webshop‘ mitarbeiten. Im Azure-Portal sehe ich die Ressourcengruppe `rg-webshop` aber gar nicht.“',
    steps: [
      {
        id: 's1', text: 'Was ist die wahrscheinlichste Ursache?',
        options: [
          { id: 'a', text: 'Er hat keine **Rollenzuweisung** (RBAC) auf der Ressourcengruppe oder darüber', correct: true, feedback: 'Richtig. Ohne Rollenzuweisung sieht man Ressourcen in Azure nicht.' },
          { id: 'b', text: 'Sein Passwort ist abgelaufen', correct: false, feedback: 'Er ist ja angemeldet, sieht nur die Ressourcen nicht.' },
          { id: 'c', text: 'Die Ressourcengruppe liegt in einer anderen Region', correct: false, feedback: 'Das Portal zeigt Ressourcen aller Regionen, Regionen schränken die Sichtbarkeit nicht ein.' },
        ],
      },
      {
        id: 's2', text: 'Er soll Ressourcen im Webshop anlegen und ändern, aber keine Rechte vergeben dürfen. Welche Zuweisung ist richtig?',
        options: [
          { id: 'a', text: 'Rolle **Contributor (Mitwirkender)** auf der Ressourcengruppe `rg-webshop`, am besten über eine Gruppe', correct: true, feedback: 'Genau. Contributor darf alles verwalten, aber keine Rollen zuweisen. Bereich so klein wie möglich.' },
          { id: 'b', text: 'Rolle **Owner** auf dem Abonnement', correct: false, feedback: 'Owner darf auch Rechte vergeben, und das auf dem ganzen Abonnement. Viel zu viel.' },
          { id: 'c', text: 'Rolle **Reader** auf der Ressourcengruppe', correct: false, feedback: 'Reader darf nur lesen, er soll aber auch ändern.' },
        ],
      },
    ],
    explanation: '**Ursache:** keine RBAC-Rollenzuweisung.\n\n**Merke:** RBAC = Wer (Benutzer/Gruppe/Identität) + Was (Rolle) + Wo (Bereich: Verwaltungsgruppe, Abonnement, Ressourcengruppe, Ressource). Rechte werden nach unten vererbt. Owner > Contributor > Reader.',
  },
  {
    id: 'c08', type: 'chain', category: 'cloud', priority: 2, difficulty: 2, learn: 'cloud-04',
    title: 'Statische Webseite auf S3 zeigt 403 Forbidden',
    reporter: 'Marketing',
    prompt: '„Wir haben unsere Kampagnenseite in einen S3-Bucket hochgeladen. Beim Aufruf kommt nur `403 Forbidden – AccessDenied`.“',
    steps: [
      {
        id: 's1', text: 'Der Bucket hat **Block Public Access** aktiviert (Standard) und keine Bucket Policy. Warum kommt 403?',
        options: [
          { id: 'a', text: 'S3-Objekte sind standardmäßig privat. Niemand Anonymes darf sie lesen.', correct: true, feedback: 'Richtig. S3 ist „sicher per Standard“: Ohne ausdrückliche Freigabe ist alles privat.' },
          { id: 'b', text: 'Die Dateien sind beschädigt.', correct: false, feedback: 'Beschädigte Dateien würden geladen, aber falsch angezeigt. 403 ist ein Rechteproblem.' },
          { id: 'c', text: 'Die Region ist falsch.', correct: false, feedback: 'Die Region beeinflusst nicht, ob der Zugriff erlaubt ist.' },
        ],
      },
      {
        id: 's2', text: 'Welche Lösung empfiehlt AWS für eine öffentliche Webseite aus S3?',
        options: [
          { id: 'a', text: '**CloudFront** davor setzen und per Origin Access Control (OAC) nur CloudFront den Lesezugriff erlauben, der Bucket bleibt privat', correct: true, feedback: 'Genau. Dazu HTTPS, Caching weltweit und Schutz durch AWS WAF möglich.' },
          { id: 'b', text: 'Block Public Access abschalten und „s3:*“ für alle erlauben', correct: false, feedback: '„s3:*“ für alle hieße: Jeder darf auch löschen und hochladen. Ein schwerer Fehler.' },
          { id: 'c', text: 'Die Seite auf eine EC2-Instanz umziehen', correct: false, feedback: 'Möglich, aber teurer und mehr Wartung für eine statische Seite.' },
        ],
      },
    ],
    explanation: '**Ursache:** privater Bucket ohne Freigabe.\n\n**Merke:** S3 ist standardmäßig privat (Block Public Access). Für öffentliche Webseiten: CloudFront + OAC, Bucket bleibt privat.',
  },

  // ───────────── Allgemeine IT ─────────────
  {
    id: 'i01', type: 'chain', category: 'it', priority: 3, difficulty: 1, learn: 'net-11',
    title: 'Konto gesperrt – immer wieder',
    reporter: 'Anruf: „Hier ist Herr Schulz aus dem Vertrieb“',
    prompt: '„Mein Konto ist schon wieder gesperrt! Ich habe gestern mein Passwort geändert und seitdem ist es dreimal passiert. Bitte schnell entsperren und das Passwort auf ‚Sommer2026‘ setzen.“',
    steps: [
      {
        id: 's1', text: 'Was tust du, bevor du irgendetwas am Konto änderst?',
        options: [
          { id: 'a', text: 'Die **Identität prüfen** (z. B. Rückruf an die hinterlegte Nummer oder Bestätigung durch die Führungskraft)', correct: true, feedback: 'Richtig. Anrufer am Telefon können sich als jemand anderes ausgeben (Social Engineering).' },
          { id: 'b', text: 'Sofort entsperren, er klingt gestresst', correct: false, feedback: 'Zeitdruck ist eine typische Masche von Angreifern. Erst die Identität prüfen.' },
          { id: 'c', text: 'Das Passwort wie gewünscht auf „Sommer2026“ setzen', correct: false, feedback: 'Ein vorgegebenes, leicht zu erratendes Passwort ist ein Risiko, und die Identität ist ungeprüft.' },
        ],
      },
      {
        id: 's2', text: 'Die Identität ist bestätigt. Warum sperrt sich das Konto nach der Passwortänderung immer wieder?',
        options: [
          { id: 'a', text: 'Ein Gerät (z. B. das Diensthandy mit E-Mail-Sync) versucht es noch mit dem **alten Passwort**', correct: true, feedback: 'Genau. Das Sicherheitsereignis 4740 auf dem Domänencontroller zeigt, von welchem Gerät die Sperre ausging.' },
          { id: 'b', text: 'Die Sperrrichtlinie ist kaputt', correct: false, feedback: 'Die Richtlinie funktioniert wie gedacht: Zu viele Fehlversuche sperren das Konto.' },
          { id: 'c', text: 'Der Nutzer tippt sein Passwort falsch', correct: false, feedback: 'Er meldet ja, dass es auch ohne seine Eingaben passiert.' },
        ],
      },
      {
        id: 's3', text: 'Wie schließt du das Ticket ab?',
        options: [
          { id: 'a', text: 'Konto entsperren, mit dem Nutzer das neue Passwort auf dem Handy eintragen, Lösung im Ticket dokumentieren', correct: true, feedback: 'Richtig. Ursache behoben, Nutzer kann arbeiten, Doku hilft beim nächsten Fall.' },
          { id: 'b', text: 'Die Kontosperre für ihn deaktivieren', correct: false, feedback: 'Dann wären Passwort-Rateangriffe auf sein Konto unbegrenzt möglich.' },
          { id: 'c', text: 'Nur entsperren, ohne die Ursache zu klären', correct: false, feedback: 'Dann ruft er in einer Stunde wieder an.' },
        ],
      },
    ],
    explanation: '**Ursache:** altes Passwort auf dem Diensthandy, dadurch wiederholte Fehlversuche.\n\n**Merke:** Vor jeder Kontoänderung Identität prüfen. Wiederholte Sperren: Ereignis 4740 (Quelle der Sperre), alte Passwörter auf Handy, gespeicherten Anmeldedaten, Laufwerkszuordnungen.',
  },
  {
    id: 'i02', type: 'chain', category: 'it', priority: 1, difficulty: 2, learn: 'net-11',
    title: 'Link in Mail geklickt und Passwort eingegeben',
    reporter: 'Petra Lange, Buchhaltung',
    prompt: '„Ich habe eine Mail von ‚Microsoft‘ bekommen, dass mein Postfach voll ist. Ich habe auf den Link geklickt und mich angemeldet. Danach kam nur eine Fehlerseite. Jetzt bin ich unsicher.“',
    steps: [
      {
        id: 's1', text: 'Wie stufst du das ein?',
        options: [
          { id: 'a', text: 'Sicherheitsvorfall, hohe Priorität: Zugangsdaten sind vermutlich bei Angreifern (Phishing)', correct: true, feedback: 'Richtig. Jede Minute zählt, Angreifer nutzen gestohlene Daten oft sofort.' },
          { id: 'b', text: 'Harmlos, die Fehlerseite zeigt ja, dass nichts passiert ist', correct: false, feedback: 'Die Fehlerseite ist typisch für Phishing: Die Daten sind schon abgegriffen.' },
          { id: 'c', text: 'Service Request: Postfach vergrößern', correct: false, feedback: 'Die Mail war ein Köder. Das Postfach ist nicht das Problem.' },
        ],
      },
      {
        id: 's2', text: 'Was tust du sofort?',
        options: [
          { id: 'a', text: 'Passwort zurücksetzen, **alle Sitzungen widerrufen** (Entra ID: „Revoke sessions“), MFA-Methoden prüfen, Security-Team informieren', correct: true, feedback: 'Genau. Ohne Sitzungs-Widerruf bleiben bereits angemeldete Angreifer weiter drin.' },
          { id: 'b', text: 'Nur die Mail löschen', correct: false, feedback: 'Die Zugangsdaten sind trotzdem gestohlen.' },
          { id: 'c', text: 'Der Nutzerin sagen, sie soll in einer Woche ihr Passwort ändern', correct: false, feedback: 'Viel zu spät. Angreifer handeln innerhalb von Minuten.' },
        ],
      },
      {
        id: 's3', text: 'Was prüfst du im Postfach zusätzlich?',
        options: [
          { id: 'a', text: 'Neue **Posteingangsregeln** (z. B. automatische Weiterleitung an fremde Adressen) und gesendete Mails', correct: true, feedback: 'Richtig. Angreifer legen oft Weiterleitungsregeln an, um mitzulesen, oder verschicken Phishing an Kollegen.' },
          { id: 'b', text: 'Die Größe des Postfachs', correct: false, feedback: 'Die Größe hat nichts mit dem Angriff zu tun.' },
          { id: 'c', text: 'Nichts, das Passwort ist ja neu', correct: false, feedback: 'Eine Weiterleitungsregel funktioniert auch nach dem Passwortwechsel weiter.' },
        ],
      },
    ],
    explanation: '**Ursache:** Phishing-Seite hat Zugangsdaten abgegriffen.\n\n**Merke:** Phishing-Vorfall: Passwort zurücksetzen, Sitzungen widerrufen, MFA prüfen, Weiterleitungsregeln prüfen, Security informieren, andere Empfänger warnen. Und die Nutzerin loben, dass sie sich gemeldet hat.',
  },
  {
    id: 'i03', type: 'chain', category: 'it', priority: 3, difficulty: 1,
    title: 'Drucker druckt nicht, Aufträge hängen',
    reporter: 'Andrea Koch, Sekretariat',
    prompt: '„Ich habe fünfmal auf Drucken geklickt, aber nichts kommt. In der Warteschlange stehen alle Aufträge mit ‚Fehler‘. Die Kollegen am selben Drucker können drucken.“',
    steps: [
      {
        id: 's1', text: 'Andere können auf demselben Drucker drucken. Wo liegt das Problem wahrscheinlich?',
        options: [
          { id: 'a', text: 'Am PC der Nutzerin (lokale Druckwarteschlange)', correct: true, feedback: 'Richtig. Drucker und Netzwerk funktionieren, also ist der PC betroffen.' },
          { id: 'b', text: 'Am Drucker', correct: false, feedback: 'Dann könnten die Kollegen auch nicht drucken.' },
          { id: 'c', text: 'Am Druckserver für alle', correct: false, feedback: 'Andere drucken erfolgreich über denselben Server.' },
        ],
      },
      {
        id: 's2', text: 'Was ist der übliche erste Lösungsschritt?',
        options: [
          { id: 'a', text: 'Hängende Aufträge löschen und den Dienst **Druckwarteschlange** (Print Spooler) neu starten', correct: true, feedback: 'Genau. Ein hängender Auftrag blockiert oft alle folgenden.' },
          { id: 'b', text: 'Den Druckertreiber auf allen PCs neu installieren', correct: false, feedback: 'Zu viel Aufwand, nur ein PC ist betroffen.' },
          { id: 'c', text: 'Einen neuen Drucker bestellen', correct: false, feedback: 'Der Drucker funktioniert ja.' },
        ],
      },
    ],
    explanation: '**Ursache:** hängender Druckauftrag in der lokalen Warteschlange.\n\n**Merke:** Eingrenzen: Betrifft es einen Nutzer oder alle? Bei einem Nutzer: Warteschlange leeren, Dienst „Druckwarteschlange“ neu starten (`services.msc`), ggf. Treiber prüfen.',
  },
  {
    id: 'i04', type: 'chain', category: 'it', priority: 1, difficulty: 2, learn: 'net-11',
    title: 'Dateien heißen plötzlich „.locked“',
    reporter: 'Thomas Wagner, Konstruktion',
    prompt: '„Alle meine Dateien auf dem Desktop und im Projektlaufwerk heißen jetzt ‚.locked‘ und lassen sich nicht öffnen. Auf dem Desktop liegt eine Datei ‚LIES_MICH.txt‘ mit einer Bitcoin-Adresse.“',
    steps: [
      {
        id: 's1', text: 'Was ist dein allererster Schritt?',
        options: [
          { id: 'a', text: 'Den PC sofort **vom Netzwerk trennen** (Kabel ziehen, WLAN aus), aber nicht ausschalten, und das Security-Team alarmieren', correct: true, feedback: 'Richtig. Ransomware verschlüsselt auch Netzlaufwerke. Trennen stoppt die Ausbreitung, der laufende Zustand hilft der Forensik.' },
          { id: 'b', text: 'Erst mal die Datei LIES_MICH.txt genau lesen und abwarten', correct: false, feedback: 'Jede Minute verschlüsselt die Schadsoftware weitere Dateien, auch auf Servern.' },
          { id: 'c', text: 'Ein Antivirenprogramm herunterladen und laufen lassen', correct: false, feedback: 'Solange der PC im Netz hängt, breitet sich der Schaden weiter aus.' },
        ],
      },
      {
        id: 's2', text: 'Die Geschäftsleitung fragt: „Sollen wir das Lösegeld zahlen?“ Was ist die fachliche Empfehlung?',
        options: [
          { id: 'a', text: 'Nicht zahlen, sondern aus **sauberen Backups** wiederherstellen und Behörden einschalten (Polizei; Datenschutzbehörde, falls personenbezogene Daten betroffen)', correct: true, feedback: 'Genau. Zahlen garantiert nichts und finanziert weitere Angriffe. Deshalb sind Offline- bzw. unveränderliche Backups so wichtig.' },
          { id: 'b', text: 'Schnell zahlen, dann ist es vorbei', correct: false, feedback: 'Oft gibt es keinen funktionierenden Schlüssel, und zahlende Firmen werden häufiger erneut angegriffen.' },
          { id: 'c', text: 'Die Dateien einfach zurück umbenennen', correct: false, feedback: 'Die Dateien sind verschlüsselt, Umbenennen ändert daran nichts.' },
        ],
      },
    ],
    explanation: '**Vorfall:** Ransomware.\n\n**Merke:** Isolieren (Netz trennen), melden, nicht zahlen, aus sauberen Backups wiederherstellen. Vorbeugung: 3-2-1-Backups (davon eins offline/unveränderlich), Updates, MFA, wenig Rechte, Schulungen.',
  },
  {
    id: 'i05', type: 'chain', category: 'it', priority: 4, difficulty: 1,
    title: 'Neue Mitarbeiterin braucht Zugänge',
    reporter: 'Personalabteilung',
    prompt: '„Ab Montag fängt Frau Yilmaz im Einkauf an. Bitte richtet ihr alles ein. Am einfachsten gebt ihr dieselben Rechte wie Herrn Hoffmann, der ist schon 15 Jahre im Einkauf.“',
    steps: [
      {
        id: 's1', text: 'Um welche Art von Ticket handelt es sich?',
        options: [
          { id: 'a', text: '**Service Request** (geplante Anfrage), kein Incident', correct: true, feedback: 'Richtig. Nichts ist kaputt. Es ist eine Standardanfrage, die über einen festen Prozess läuft.' },
          { id: 'b', text: 'Incident (Störung)', correct: false, feedback: 'Ein Incident ist eine ungeplante Unterbrechung oder Verschlechterung eines Dienstes. Hier ist nichts gestört.' },
          { id: 'c', text: 'Problem', correct: false, feedback: 'Ein Problem ist die unbekannte Ursache hinter einem oder mehreren Incidents.' },
        ],
      },
      {
        id: 's2', text: 'Wie vergibst du die Rechte?',
        options: [
          { id: 'a', text: 'Über die **Rollengruppe** „Einkauf“ (rollenbasiert), nur was die Stelle braucht', correct: true, feedback: 'Genau. Least Privilege. Gruppen machen Zugänge nachvollziehbar und beim Austritt leicht entziehbar.' },
          { id: 'b', text: 'Das Konto von Herrn Hoffmann kopieren', correct: false, feedback: 'Nach 15 Jahren hat er oft Rechte aus alten Projekten angesammelt. Kopieren verteilt diese weiter.' },
          { id: 'c', text: 'Ihr Admin-Rechte geben, damit sie nicht anrufen muss', correct: false, feedback: 'Admin-Rechte für normale Arbeit sind ein großes Sicherheitsrisiko.' },
        ],
      },
    ],
    explanation: '**Art:** Service Request (Onboarding).\n\n**Merke:** Incident = Störung, Service Request = Standardanfrage, Problem = Ursache wiederkehrender Incidents, Change = geplante Änderung. Rechte rollenbasiert und nach Least Privilege vergeben, nicht von Kollegen kopieren.',
  },
  {
    id: 'i06', type: 'chain', category: 'it', priority: 3, difficulty: 1,
    title: 'Laptop extrem langsam',
    reporter: 'Julia Hartmann, Vertrieb',
    prompt: '„Mein Laptop ist seit ein paar Tagen extrem langsam. Programme brauchen ewig zum Starten und manchmal friert alles kurz ein.“',
    steps: [
      {
        id: 's1', text: 'Womit verschaffst du dir einen Überblick?',
        options: [
          { id: 'a', text: '**Task-Manager**: Welche Ressource ist ausgelastet (CPU, Arbeitsspeicher, Datenträger)? Welcher Prozess verursacht es?', correct: true, feedback: 'Richtig. Erst messen, dann handeln.' },
          { id: 'b', text: 'Sofort mehr Arbeitsspeicher bestellen', correct: false, feedback: 'Ohne zu wissen, was ausgelastet ist, ist das geraten.' },
          { id: 'c', text: 'Windows neu installieren', correct: false, feedback: 'Zu drastisch, bevor die Ursache bekannt ist.' },
        ],
      },
      {
        id: 's2', text: 'Der Datenträger ist zu 100 % ausgelastet und nur noch 1 % frei (C: ist fast voll). Was hilft?',
        options: [
          { id: 'a', text: 'Speicherplatz freigeben (Downloads, temporäre Dateien, Datenträgerbereinigung), große Dateien auf das Netzlaufwerk/OneDrive verschieben', correct: true, feedback: 'Genau. Fast volle Systemlaufwerke bremsen Windows stark (Auslagerungsdatei, Updates).' },
          { id: 'b', text: 'Die Festplatte defragmentieren', correct: false, feedback: 'Bei SSDs ist Defragmentieren nicht sinnvoll, und es schafft keinen freien Platz.' },
          { id: 'c', text: 'Den Virenschutz deinstallieren, damit es schneller geht', correct: false, feedback: 'Ohne Virenschutz wird der Laptop zum Sicherheitsrisiko.' },
        ],
      },
    ],
    explanation: '**Ursache:** volles Systemlaufwerk.\n\n**Merke:** Leistungsprobleme systematisch eingrenzen: Task-Manager (CPU, RAM, Datenträger, Netzwerk), Autostart-Programme, freier Speicher, Updates.',
  },
  {
    id: 'i07', type: 'chain', category: 'it', priority: 3, difficulty: 1, learn: 'cloud-03',
    title: 'Neues Handy: MFA-Anmeldung klappt nicht mehr',
    reporter: 'Chat: Daniel Schwarz, Außendienst',
    prompt: '„Ich habe ein neues Diensthandy und das alte schon abgegeben. Jetzt will Microsoft 365 eine Bestätigung in der Authenticator-App, aber die ist auf dem alten Handy.“',
    steps: [
      {
        id: 's1', text: 'Was tust du zuerst?',
        options: [
          { id: 'a', text: 'Identität über einen zweiten Weg prüfen (z. B. Videoanruf mit Ausweis oder Bestätigung durch die Führungskraft)', correct: true, feedback: 'Richtig. MFA zurückzusetzen ist für Angreifer der Hauptgewinn. Nie nur auf eine Chatnachricht hin.' },
          { id: 'b', text: 'MFA für sein Konto dauerhaft abschalten', correct: false, feedback: 'Ohne MFA reicht ein gestohlenes Passwort für die Übernahme des Kontos.' },
          { id: 'c', text: 'Ihm das Passwort per Chat schicken', correct: false, feedback: 'Das Passwort ist nicht das Problem, und Passwörter verschickt man nicht im Chat.' },
        ],
      },
      {
        id: 's2', text: 'Die Identität ist bestätigt. Wie geht es weiter?',
        options: [
          { id: 'a', text: 'In Entra ID die alten Authentifizierungsmethoden entfernen bzw. „Erneute MFA-Registrierung anfordern“, damit er die App auf dem neuen Handy einrichtet', correct: true, feedback: 'Genau. Danach meldet er sich an und registriert das neue Gerät.' },
          { id: 'b', text: 'Ihm sagen, er soll sich das alte Handy zurückholen', correct: false, feedback: 'Unpraktisch, und das alte Handy wird meist zurückgesetzt.' },
          { id: 'c', text: 'Ein gemeinsames Konto für den Außendienst anlegen', correct: false, feedback: 'Geteilte Konten sind nicht nachvollziehbar und unsicher.' },
        ],
      },
    ],
    explanation: '**Merke:** MFA-Reset nur nach sicherer Identitätsprüfung. Für Notfälle mehrere Methoden registrieren lassen (z. B. App und Telefonnummer oder FIDO2-Schlüssel). Self-Service (SSPR) entlastet den Service Desk.',
  },
];
