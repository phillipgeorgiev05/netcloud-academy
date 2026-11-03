import type { Level } from '../../types/content';

const level: Level = {
  id: 'basics-04',
  track: 'basics',
  order: 4,
  title: 'Internet & Web',
  titleEn: 'How the Internet and the Web Work',
  summary: 'Was passiert, wenn du eine Webseite öffnest: private und öffentliche IP-Adressen, NAT im Heimrouter, DNS als Telefonbuch, HTTP und HTTPS mit Zertifikaten, URLs und die wichtigsten Statuscodes.',
  certs: ['netplus', 'ccna', 'az900', 'fisi'],
  domains: { netplus: '1', ccna: '4', az900: 'concepts', fisi: 'ap1' },
  lesson: [
    {
      heading: 'Private und öffentliche IP-Adressen',
      body: `IPv4-Adressen sind knapp: Es gibt nur rund 4,3 Milliarden. Darum unterscheidet man:

**Private Adressen** (RFC 1918) – nur im eigenen Netz gültig, beliebig oft auf der Welt verwendet:
| Bereich | typisch für |
|---|---|
| \`10.0.0.0 – 10.255.255.255\` (10.0.0.0/8) | Firmen, Cloud-Netze |
| \`172.16.0.0 – 172.31.255.255\` (172.16.0.0/12) | Firmen, Docker |
| \`192.168.0.0 – 192.168.255.255\` (192.168.0.0/16) | Heimnetze |

**Öffentliche Adressen** – weltweit eindeutig, vom Provider zugeteilt. Dein Heimrouter hat meist genau **eine** öffentliche IPv4-Adresse.

Sonderfälle:
- \`127.0.0.1\` ist **localhost**: das Gerät selbst.
- \`169.254.x.x\` (**APIPA**): Das Gerät hat sich selbst eine Adresse gegeben, weil kein DHCP-Server antwortete. Meist ein Zeichen für ein Problem.

**IPv6** hat so viele Adressen (2¹²⁸), dass jedes Gerät eine öffentliche bekommen kann.`,
      terms: [
        { de: 'private IP-Adresse', en: 'private IP address (RFC 1918)' },
        { de: 'öffentliche IP-Adresse', en: 'public IP address' },
        { de: 'Loopback-Adresse', en: 'localhost / loopback (127.0.0.1)' },
        { de: 'automatische private Adresse', en: 'APIPA (169.254.0.0/16)' },
      ],
      sources: [
        { title: 'RFC 1918 – Address Allocation for Private Internets', url: 'https://www.rfc-editor.org/rfc/rfc1918' },
      ],
      check: {
        id: 'c1', type: 'dragdrop', difficulty: 2,
        prompt: 'Privat oder öffentlich?',
        items: [
          { id: 'a', text: '192.168.178.20' },
          { id: 'b', text: '10.1.2.3' },
          { id: 'c', text: '172.20.0.5' },
          { id: 'd', text: '8.8.8.8' },
          { id: 'e', text: '172.32.0.5' },
        ],
        buckets: [
          { id: 'priv', label: 'privat' },
          { id: 'pub', label: 'öffentlich' },
        ],
        solution: { a: 'priv', b: 'priv', c: 'priv', d: 'pub', e: 'pub' },
        explanation: '172.16–172.31 ist privat, 172.32 liegt schon außerhalb und ist öffentlich.',
      },
    },
    {
      heading: 'NAT: viele Geräte, eine öffentliche Adresse',
      body: `Im Heimnetz haben Laptop, Handy und Fernseher private Adressen (192.168.x.x). Im Internet kann man darauf nicht antworten, weil diese Adressen dort nicht geroutet werden.

Der Router löst das mit **NAT** (Network Address Translation), genauer **PAT** (Port Address Translation):
1. Der Laptop (192.168.1.20) schickt eine Anfrage an einen Webserver.
2. Der Router ersetzt die Absenderadresse durch **seine öffentliche IP** und merkt sich in einer Tabelle, welcher Port zu welchem Gerät gehört.
3. Die Antwort kommt an die öffentliche IP zurück.
4. Der Router schaut in der Tabelle nach und leitet sie an den Laptop weiter.

Nebeneffekt: Von außen kann niemand **ungefragt** ein Gerät im Heimnetz ansprechen, weil es keinen Tabelleneintrag dafür gibt. Will man das (z. B. für einen eigenen Server), richtet man eine **Portweiterleitung** ein.`,
      analogy: 'NAT ist wie die Poststelle einer Firma: Alle Briefe gehen mit der Firmenanschrift raus. Die Poststelle notiert, wer welchen Brief geschickt hat, und verteilt die Antworten an die richtigen Schreibtische.',
      terms: [
        { de: 'Netzwerkadressübersetzung', en: 'Network Address Translation (NAT)' },
        { de: 'Portadressübersetzung', en: 'Port Address Translation (PAT) / NAT overload' },
        { de: 'Portweiterleitung', en: 'port forwarding' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Welche Absender-IP sieht ein Webserver, wenn dein Laptop (192.168.1.20) zu Hause eine Seite aufruft?',
        options: [
          { id: 'a', text: 'Die öffentliche IP deines Routers' },
          { id: 'b', text: '192.168.1.20', whyWrong: 'Private Adressen werden im Internet nicht geroutet. Der Router ersetzt sie per NAT durch seine öffentliche Adresse.' },
          { id: 'c', text: 'Die MAC-Adresse des Laptops', whyWrong: 'MAC-Adressen gelten nur im lokalen Netz und werden an jedem Router ersetzt. Der Webserver sieht sie nie.' },
        ],
        correct: 'a',
        explanation: 'NAT: Alle Geräte im Heimnetz teilen sich die öffentliche IP des Routers.',
      },
    },
    {
      heading: 'DNS: das Telefonbuch des Internets',
      body: `Menschen merken sich Namen (\`www.wikipedia.org\`), Computer brauchen IP-Adressen. Das **DNS** (Domain Name System) übersetzt Namen in Adressen.

**Ablauf** (vereinfacht):
1. Der PC fragt seinen DNS-Server (meist den Router oder den Provider): „Welche IP hat www.wikipedia.org?“
2. Kennt der DNS-Server die Antwort nicht, fragt er sich durch: **Root-Server** → Server für \`.org\` → Server für \`wikipedia.org\`.
3. Die Antwort wird zurückgegeben und eine Zeit lang **zwischengespeichert** (Cache, Dauer = **TTL**).

**Aufbau eines Namens** (von rechts nach links):
\`www.\` (Host) \`wikipedia.\` (Domain) \`org\` (Top-Level-Domain, TLD)

**Wichtige Eintragstypen:**
| Typ | bedeutet |
|---|---|
| **A** | Name → IPv4-Adresse |
| **AAAA** | Name → IPv6-Adresse |
| **CNAME** | Alias, zeigt auf einen anderen Namen |
| **MX** | Mailserver der Domain |
| **TXT** | Text, z. B. für Domain-Nachweis oder SPF |

Prüfen kann man das mit \`nslookup www.wikipedia.org\`.`,
      analogy: 'DNS ist wie die Kontakte im Handy: Du tippst auf „Mama“, das Handy wählt die Nummer. Ohne Kontakte müsstest du jede Nummer auswendig kennen.',
      terms: [
        { de: 'Namensauflösung', en: 'Domain Name System (DNS)' },
        { de: 'Top-Level-Domain', en: 'top-level domain (TLD)' },
        { de: 'Zwischenspeicher', en: 'cache' },
        { de: 'Lebensdauer', en: 'time to live (TTL)' },
      ],
      sources: [
        { title: 'RFC 1034 – Domain Names: Concepts and Facilities', url: 'https://www.rfc-editor.org/rfc/rfc1034' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 1,
        prompt: 'Welcher DNS-Eintrag liefert die IPv4-Adresse zu einem Namen?',
        options: [
          { id: 'a', text: 'A' },
          { id: 'b', text: 'AAAA', whyWrong: 'AAAA liefert die IPv6-Adresse (vier A, weil IPv6 viermal so lang ist). Für IPv4 ist es der A-Eintrag.' },
          { id: 'c', text: 'MX', whyWrong: 'MX nennt den Mailserver einer Domain. Die IPv4-Adresse steht im A-Eintrag.' },
          { id: 'd', text: 'CNAME', whyWrong: 'CNAME ist ein Alias, der auf einen anderen Namen zeigt. Die Adresse selbst kommt aus dem A- oder AAAA-Eintrag.' },
        ],
        correct: 'a',
        explanation: 'A = IPv4, AAAA = IPv6.',
      },
    },
    {
      heading: 'HTTP, HTTPS und URLs',
      body: `Das **Web** ist ein Dienst im Internet, so wie E-Mail. Es läuft über **HTTP** (Hypertext Transfer Protocol).

**Aufbau einer URL:**
\`https://shop.beispiel.de:443/produkte/42?farbe=blau\`
| Teil | Bedeutung |
|---|---|
| \`https\` | Protokoll |
| \`shop.beispiel.de\` | Hostname (wird per DNS aufgelöst) |
| \`443\` | Port (bei https Standard, wird meist weggelassen) |
| \`/produkte/42\` | Pfad auf dem Server |
| \`?farbe=blau\` | Parameter |

**HTTPS** = HTTP + **TLS**-Verschlüsselung:
- Niemand unterwegs (z. B. im Café-WLAN) kann mitlesen oder etwas verändern.
- Der Server weist sich mit einem **Zertifikat** aus, das eine vertrauenswürdige Stelle (CA) unterschrieben hat. Der Browser prüft es und zeigt sonst eine Warnung.

**Statuscodes** – die Antwort des Servers:
| Code | Bedeutung |
|---|---|
| **200** | OK |
| **301 / 302** | Umleitung |
| **401 / 403** | nicht angemeldet / kein Zugriff |
| **404** | Seite nicht gefunden |
| **500 / 503** | Fehler auf dem Server / Dienst nicht verfügbar |

Merkregel: 2xx gut, 3xx woanders, 4xx Fehler beim Client, 5xx Fehler beim Server.`,
      terms: [
        { de: 'Webadresse', en: 'Uniform Resource Locator (URL)' },
        { de: 'Hypertext-Übertragungsprotokoll', en: 'Hypertext Transfer Protocol (HTTP)' },
        { de: 'Transportverschlüsselung', en: 'Transport Layer Security (TLS)' },
        { de: 'Zertifikat', en: 'certificate' },
        { de: 'Zertifizierungsstelle', en: 'certificate authority (CA)' },
        { de: 'Statuscode', en: 'status code' },
      ],
      sources: [
        { title: 'MDN – HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 1,
        prompt: 'Der Browser zeigt „404“. Was bedeutet das?',
        options: [
          { id: 'a', text: 'Die Seite wurde auf dem Server nicht gefunden.' },
          { id: 'b', text: 'Der Server ist abgestürzt.', whyWrong: 'Serverfehler haben 5xx-Codes, z. B. 500. Bei 404 läuft der Server, kennt aber den angefragten Pfad nicht.' },
          { id: 'c', text: 'Kein Internet', whyWrong: 'Ohne Internet bekommst du gar keine Antwort vom Server. Ein 404 ist eine Antwort des Servers, also steht die Verbindung.' },
          { id: 'd', text: 'Alles in Ordnung', whyWrong: '„OK“ ist Code 200. 404 heißt „nicht gefunden“, z. B. Tippfehler in der URL oder gelöschte Seite.' },
        ],
        correct: 'a',
        explanation: '4xx = Fehler auf Seite des Clients (falsche URL, keine Berechtigung).',
      },
    },
    {
      heading: 'Was passiert, wenn du eine Webseite öffnest?',
      body: `Alles zusammen, Schritt für Schritt:

1. Du tippst \`https://www.beispiel.de\` und drückst Enter.
2. **DNS**: Der PC fragt nach der IP-Adresse von \`www.beispiel.de\`.
3. **Routing**: Der PC sieht, dass die IP nicht im eigenen Netz liegt, und schickt die Pakete an das **Standardgateway** (Router).
4. **NAT**: Der Router ersetzt die private durch die öffentliche Absenderadresse.
5. **TCP**: Verbindungsaufbau zum Server auf Port 443 (3-Wege-Handshake).
6. **TLS**: Server schickt sein Zertifikat, beide vereinbaren einen Schlüssel.
7. **HTTP**: Der Browser sendet \`GET /\`, der Server antwortet mit **200** und dem HTML.
8. Der Browser lädt Bilder, CSS und Skripte nach (weitere Anfragen) und zeigt die Seite an.

Das alles dauert oft weniger als eine halbe Sekunde.`,
      diagram: 'web-request',
      terms: [
        { de: 'Anfrage', en: 'request' },
        { de: 'Antwort', en: 'response' },
      ],
      check: {
        id: 'c5', type: 'ordering', difficulty: 2,
        prompt: 'Bring die Schritte in die richtige Reihenfolge.',
        items: [
          { id: 'dns', text: 'DNS-Abfrage nach der IP-Adresse' },
          { id: 'tcp', text: 'TCP-Verbindung zu Port 443 aufbauen' },
          { id: 'tls', text: 'TLS-Handshake mit Zertifikatsprüfung' },
          { id: 'get', text: 'HTTP-Anfrage GET senden' },
          { id: 'show', text: 'Browser zeigt die Seite an' },
        ],
        explanation: 'Name → Verbindung → Verschlüsselung → Anfrage → Anzeige.',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welche Adresse ist privat?',
      options: [
        { id: 'a', text: '192.168.0.10' },
        { id: 'b', text: '8.8.8.8', whyWrong: '8.8.8.8 ist ein öffentlicher DNS-Server von Google. Private Bereiche sind 10.x, 172.16–31.x und 192.168.x.' },
        { id: 'c', text: '1.1.1.1', whyWrong: '1.1.1.1 ist ein öffentlicher DNS-Server von Cloudflare. Privat sind nur die drei RFC-1918-Bereiche.' },
        { id: 'd', text: '172.217.0.1', whyWrong: '172.217.x liegt außerhalb von 172.16–172.31 und ist damit öffentlich (Google).' },
      ],
      correct: 'a',
      explanation: '192.168.0.0/16 ist privat.',
    },
    {
      id: 'q2', type: 'single', difficulty: 2,
      prompt: 'Ein PC hat die Adresse 169.254.12.7. Was ist wahrscheinlich passiert?',
      options: [
        { id: 'a', text: 'Er hat keinen DHCP-Server erreicht und sich selbst eine Adresse gegeben.' },
        { id: 'b', text: 'Er hat eine öffentliche Adresse vom Provider bekommen.', whyWrong: '169.254.x.x ist der APIPA-Bereich und wird nie vom Provider vergeben. Er entsteht, wenn kein DHCP-Server antwortet.' },
        { id: 'c', text: 'Er ist mit sich selbst verbunden (localhost).', whyWrong: 'localhost ist 127.0.0.1. 169.254.x.x bedeutet: keine Antwort vom DHCP-Server.' },
        { id: 'd', text: 'Alles normal, so sieht ein Heimnetz aus.', whyWrong: 'Heimnetze nutzen meist 192.168.x.x. Eine 169.254-Adresse zeigt ein Problem: DHCP nicht erreichbar, Kabel oder WLAN prüfen.' },
      ],
      correct: 'a',
      explanation: 'APIPA (169.254.0.0/16) = DHCP hat nicht geantwortet. Internet geht damit nicht.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Wozu dient NAT im Heimrouter?',
      options: [
        { id: 'a', text: 'Viele Geräte mit privaten Adressen teilen sich eine öffentliche IP.' },
        { id: 'b', text: 'Es übersetzt Namen in IP-Adressen.', whyWrong: 'Namen übersetzt DNS. NAT übersetzt private in öffentliche Adressen.' },
        { id: 'c', text: 'Es verschlüsselt den Verkehr.', whyWrong: 'NAT tauscht nur Adressen und Ports aus und verschlüsselt nichts. Verschlüsselung macht z. B. TLS (HTTPS) oder ein VPN.' },
        { id: 'd', text: 'Es vergibt IP-Adressen an die Geräte.', whyWrong: 'Adressen vergibt DHCP. NAT übersetzt die Absenderadresse beim Weg ins Internet.' },
      ],
      correct: 'a',
      explanation: 'NAT/PAT spart öffentliche IPv4-Adressen.',
    },
    {
      id: 'q4', type: 'single', difficulty: 1,
      prompt: 'Was macht DNS?',
      options: [
        { id: 'a', text: 'Es übersetzt Namen wie www.beispiel.de in IP-Adressen.' },
        { id: 'b', text: 'Es vergibt IP-Adressen an Geräte.', whyWrong: 'Das macht DHCP. DNS beantwortet die Frage „Welche IP gehört zu diesem Namen?“.' },
        { id: 'c', text: 'Es verschlüsselt Webseiten.', whyWrong: 'Webseiten verschlüsselt TLS bei HTTPS. DNS ist die Namensauflösung.' },
        { id: 'd', text: 'Es leitet Pakete zwischen Netzen weiter.', whyWrong: 'Pakete leitet der Router weiter. DNS liefert nur die Zieladresse zu einem Namen.' },
      ],
      correct: 'a',
      explanation: 'DNS = Telefonbuch des Internets.',
    },
    {
      id: 'q5', type: 'dragdrop', difficulty: 2,
      prompt: 'Welcher DNS-Eintrag passt?',
      items: [
        { id: 'v4', text: 'Name → IPv4-Adresse' },
        { id: 'v6', text: 'Name → IPv6-Adresse' },
        { id: 'mail', text: 'Mailserver der Domain' },
        { id: 'alias', text: 'www zeigt auf shop.beispiel.de' },
      ],
      buckets: [
        { id: 'a', label: 'A' },
        { id: 'aaaa', label: 'AAAA' },
        { id: 'mx', label: 'MX' },
        { id: 'cname', label: 'CNAME' },
      ],
      solution: { v4: 'a', v6: 'aaaa', mail: 'mx', alias: 'cname' },
      explanation: 'A/AAAA = Adressen, MX = Mail, CNAME = Alias.',
    },
    {
      id: 'q6', type: 'single', difficulty: 1,
      prompt: 'Was ist der Unterschied zwischen HTTP und HTTPS?',
      options: [
        { id: 'a', text: 'HTTPS verschlüsselt die Verbindung mit TLS und prüft die Identität des Servers.' },
        { id: 'b', text: 'HTTPS ist nur schneller.', whyWrong: 'Der entscheidende Unterschied ist die Verschlüsselung per TLS und die Prüfung des Serverzertifikats.' },
        { id: 'c', text: 'HTTPS ist für Bilder, HTTP für Text.', whyWrong: 'Beide können beliebige Inhalte übertragen. HTTPS tut es verschlüsselt.' },
        { id: 'd', text: 'Es gibt keinen Unterschied.', whyWrong: 'HTTP überträgt im Klartext, jeder auf dem Weg kann mitlesen. HTTPS ist verschlüsselt.' },
      ],
      correct: 'a',
      explanation: 'HTTPS = HTTP + TLS, Port 443 statt 80.',
    },
    {
      id: 'q7', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Teile der URL `https://shop.beispiel.de/produkte/42` zu.',
      items: [
        { id: 'p', text: 'https' },
        { id: 'h', text: 'shop.beispiel.de' },
        { id: 'pa', text: '/produkte/42' },
      ],
      buckets: [
        { id: 'proto', label: 'Protokoll' },
        { id: 'host', label: 'Hostname' },
        { id: 'path', label: 'Pfad' },
      ],
      solution: { p: 'proto', h: 'host', pa: 'path' },
      explanation: 'Protokoll://Hostname/Pfad',
    },
    {
      id: 'q8', type: 'dragdrop', difficulty: 2,
      prompt: 'Was bedeutet der Statuscode?',
      items: [
        { id: 's200', text: '200' },
        { id: 's301', text: '301' },
        { id: 's404', text: '404' },
        { id: 's500', text: '500' },
      ],
      buckets: [
        { id: 'ok', label: 'alles OK' },
        { id: 'redir', label: 'dauerhaft umgezogen' },
        { id: 'nf', label: 'nicht gefunden' },
        { id: 'err', label: 'Fehler auf dem Server' },
      ],
      solution: { s200: 'ok', s301: 'redir', s404: 'nf', s500: 'err' },
      explanation: '2xx gut, 3xx Umleitung, 4xx Client-Fehler, 5xx Server-Fehler.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Der Browser warnt: „Das Zertifikat ist ungültig“. Was bedeutet das?',
      options: [
        { id: 'a', text: 'Der Browser kann nicht bestätigen, dass der Server wirklich der ist, der er vorgibt zu sein.' },
        { id: 'b', text: 'Die Seite ist nur langsam.', whyWrong: 'Die Warnung hat nichts mit Geschwindigkeit zu tun. Sie bedeutet, dass die Identität des Servers nicht bestätigt werden kann, z. B. abgelaufenes oder gefälschtes Zertifikat.' },
        { id: 'c', text: 'Das WLAN ist zu schwach.', whyWrong: 'Bei schwachem WLAN lädt die Seite langsam oder gar nicht. Eine Zertifikatswarnung betrifft die Echtheit des Servers.' },
        { id: 'd', text: 'Du musst den Browser neu installieren.', whyWrong: 'Der Browser funktioniert richtig, er warnt dich zu Recht. Das Problem liegt beim Zertifikat des Servers oder es läuft ein Angriff.' },
      ],
      correct: 'a',
      explanation: 'Mögliche Ursachen: abgelaufen, falscher Name, unbekannte CA oder Angriff (Man-in-the-Middle). Nicht einfach wegklicken.',
    },
    {
      id: 'q10', type: 'single', difficulty: 1,
      prompt: 'Welche Adresse steht immer für das eigene Gerät?',
      options: [
        { id: 'a', text: '127.0.0.1' },
        { id: 'b', text: '192.168.1.1', whyWrong: '192.168.1.1 ist oft die Adresse des Heimrouters, also eines anderen Geräts. Das eigene Gerät ist immer 127.0.0.1 (localhost).' },
        { id: 'c', text: '0.0.0.0', whyWrong: '0.0.0.0 bedeutet „keine bestimmte Adresse“ oder „alle Adressen“, z. B. bei Servern, die auf allen Schnittstellen lauschen. Das Gerät selbst ist 127.0.0.1.' },
        { id: 'd', text: '255.255.255.255', whyWrong: 'Das ist die Broadcast-Adresse an alle im lokalen Netz. Das eigene Gerät ist 127.0.0.1.' },
      ],
      correct: 'a',
      explanation: '127.0.0.1 = localhost (IPv6: ::1).',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Welche Rolle hat das Standardgateway beim Aufruf einer Webseite?',
      options: [
        { id: 'a', text: 'Der PC schickt alle Pakete für fremde Netze an das Gateway (Router).' },
        { id: 'b', text: 'Das Gateway liefert die Webseite aus.', whyWrong: 'Die Webseite kommt vom Webserver. Das Gateway ist nur der Router, über den der PC das eigene Netz verlässt.' },
        { id: 'c', text: 'Das Gateway übersetzt den Namen.', whyWrong: 'Namen übersetzt der DNS-Server. Im Heimnetz ist das oft dasselbe Gerät (Router), aber eine andere Aufgabe.' },
      ],
      correct: 'a',
      explanation: 'Ziel nicht im eigenen Netz → an das Gateway.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Warum kann man von außen nicht einfach auf deinen Laptop im Heimnetz zugreifen?',
      options: [
        { id: 'a', text: 'Ohne vorherige Anfrage oder Portweiterleitung weiß der NAT-Router nicht, an welches Gerät er die Verbindung schicken soll.' },
        { id: 'b', text: 'Weil Laptops keine IP-Adresse haben', whyWrong: 'Der Laptop hat eine private IP-Adresse. Sie ist aber nur im Heimnetz gültig, und der Router lässt unaufgeforderte Verbindungen nicht durch.' },
        { id: 'c', text: 'Weil DNS es verbietet', whyWrong: 'DNS übersetzt nur Namen und erlaubt oder verbietet keine Verbindungen. Der Schutz kommt durch NAT und die Firewall im Router.' },
      ],
      correct: 'a',
      explanation: 'NAT wirkt wie eine Einbahnstraße. Für gezielte Freigaben gibt es Portweiterleitungen.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Mit welchem Befehl prüfst du unter Windows, welche IP zu einem Namen gehört?',
      options: [
        { id: 'a', text: '`nslookup www.beispiel.de`' },
        { id: 'b', text: '`ipconfig`', whyWrong: '`ipconfig` zeigt die eigenen Netzwerkeinstellungen. Für eine DNS-Abfrage nutzt man `nslookup`.' },
        { id: 'c', text: '`tracert www.beispiel.de`', whyWrong: '`tracert` zeigt die Router auf dem Weg zum Ziel. Es löst zwar den Namen auf, die gezielte DNS-Abfrage macht aber `nslookup`.' },
        { id: 'd', text: '`dir`', whyWrong: '`dir` listet Dateien im Ordner. Für DNS-Abfragen ist `nslookup` gedacht.' },
      ],
      correct: 'a',
      explanation: 'nslookup (Windows/Linux) bzw. dig (Linux) fragen DNS direkt.',
    },
    {
      id: 'q14', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu HTTPS stimmen?',
      options: [
        { id: 'a', text: 'Der Server weist sich mit einem Zertifikat aus.' },
        { id: 'b', text: 'Standardport ist 443.' },
        { id: 'c', text: 'Die Daten sind unterwegs verschlüsselt.' },
        { id: 'd', text: 'Eine HTTPS-Seite ist garantiert seriös.', whyWrong: 'Auch Betrüger bekommen kostenlose Zertifikate. Das Schloss heißt nur „Verbindung verschlüsselt, Domain bestätigt“, nicht „Inhaber vertrauenswürdig“.' },
        { id: 'e', text: 'Der Server sieht dein Passwort nicht.', whyWrong: 'HTTPS schützt den Weg zwischen dir und dem Server. Der Server selbst entschlüsselt die Daten und sieht, was du eingibst.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'HTTPS = Transportverschlüsselung + Serveridentität, keine Garantie für Seriosität.',
    },
    {
      id: 'q15', type: 'ordering', difficulty: 2,
      prompt: 'DNS ohne Cache: In welcher Reihenfolge fragt der DNS-Server bei `www.wikipedia.org` nach?',
      items: [
        { id: 'root', text: 'Root-Server' },
        { id: 'tld', text: 'Server für .org' },
        { id: 'auth', text: 'Server für wikipedia.org' },
      ],
      explanation: 'Von rechts nach links: Root → TLD → zuständiger (autoritativer) Server.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Was ist die wahrscheinlichste Ursache?',
        scenario: 'Ein Laptop im Büro meldet „Kein Internet“.\n```\nC:\\> ipconfig\n   IPv4-Adresse  . . . . . : 169.254.88.14\n   Subnetzmaske  . . . . . : 255.255.0.0\n   Standardgateway . . . . :\n```',
        options: [
          { id: 'a', text: 'Der Laptop hat keinen DHCP-Server erreicht, z. B. Kabel, WLAN oder DHCP-Server prüfen.' },
          { id: 'b', text: 'Der DNS-Server ist ausgefallen.', whyWrong: 'Bei DNS-Problemen hätte der Laptop trotzdem eine normale IP und ein Gateway. 169.254.x.x zeigt, dass schon DHCP nicht geklappt hat.' },
          { id: 'c', text: 'Die Webseite ist offline.', whyWrong: 'Dann gingen andere Seiten noch. Hier hat der Laptop keine gültige Adresse und kein Gateway, er kommt gar nicht ins Netz.' },
          { id: 'd', text: 'Das Zertifikat ist abgelaufen.', whyWrong: 'Ein Zertifikatsproblem betrifft nur eine Seite und zeigt eine Browserwarnung. Hier fehlt die Netzwerkkonfiguration vollständig.' },
        ],
        correct: 'a',
        explanation: 'APIPA + kein Gateway = DHCP nicht erreicht. Erst Verbindung (Kabel/WLAN), dann DHCP-Server prüfen.',
      },
      {
        id: 'b2', type: 'ordering', difficulty: 3,
        prompt: 'Bring den Weg einer Webanfrage aus dem Heimnetz in die richtige Reihenfolge.',
        items: [
          { id: 'dns', text: 'PC fragt DNS nach der IP-Adresse' },
          { id: 'gw', text: 'PC schickt das Paket an das Standardgateway' },
          { id: 'nat', text: 'Router ersetzt die private Absenderadresse (NAT)' },
          { id: 'srv', text: 'Webserver antwortet an die öffentliche IP des Routers' },
          { id: 'back', text: 'Router leitet die Antwort per NAT-Tabelle an den PC' },
        ],
        explanation: 'DNS → Gateway → NAT → Server → zurück per NAT-Tabelle.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        prompt: 'Was zeigt diese Antwort?',
        scenario: 'Ein Entwickler testet eine Web-App:\n```\n$ curl -I https://app.beispiel.de/admin\nHTTP/2 403\n```',
        options: [
          { id: 'a', text: 'Der Server ist erreichbar, verweigert aber den Zugriff auf /admin.' },
          { id: 'b', text: 'Der Server ist nicht erreichbar.', whyWrong: 'Eine Antwort mit Statuscode bedeutet, dass der Server erreichbar ist und antwortet. Bei Nichterreichbarkeit gäbe es eine Zeitüberschreitung, keinen Code.' },
          { id: 'c', text: 'Die Seite /admin existiert nicht.', whyWrong: 'Dafür käme 404. 403 heißt „Forbidden“: Die Seite existiert, aber du darfst sie nicht sehen.' },
          { id: 'd', text: 'Der Server hat einen internen Fehler.', whyWrong: 'Serverfehler sind 5xx. 403 ist ein 4xx-Code und betrifft die Berechtigung der Anfrage.' },
        ],
        correct: 'a',
        explanation: '403 Forbidden = Zugriff verweigert. 401 wäre „nicht angemeldet“.',
      },
      {
        id: 'b4', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen stimmen?',
        options: [
          { id: 'a', text: '172.16.0.0 bis 172.31.255.255 ist ein privater Bereich.' },
          { id: 'b', text: 'Eine DNS-Antwort wird für die Dauer der TTL zwischengespeichert.' },
          { id: 'c', text: 'Mit einer Portweiterleitung kann man einen Server im Heimnetz von außen erreichbar machen.' },
          { id: 'd', text: 'Private IPv4-Adressen sind weltweit eindeutig.', whyWrong: 'Private Adressen werden in Millionen Netzen gleichzeitig verwendet, darum braucht man NAT. Weltweit eindeutig sind nur öffentliche Adressen.' },
          { id: 'e', text: 'HTTP-Statuscode 500 bedeutet einen Tippfehler in der URL.', whyWrong: 'Bei einem Tippfehler käme meist 404. 500 bedeutet, dass auf dem Server selbst etwas schiefgelaufen ist.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'RFC 1918, DNS-Cache mit TTL, Portweiterleitung durch NAT.',
      },
      {
        id: 'b5', type: 'scenario', difficulty: 3,
        prompt: 'Was ist die wahrscheinlichste Erklärung?',
        scenario: 'Eine Firma hat ihren Webserver gestern auf eine neue IP-Adresse umgezogen und den DNS-Eintrag angepasst. Einige Mitarbeiter landen heute noch auf dem alten Server, andere schon auf dem neuen.',
        options: [
          { id: 'a', text: 'Einige DNS-Server und PCs haben die alte Antwort noch im Cache, bis die TTL abläuft.' },
          { id: 'b', text: 'Der neue Server ist kaputt.', whyWrong: 'Ein Teil der Mitarbeiter erreicht den neuen Server, er funktioniert also. Unterschiedliche Ziele deuten auf zwischengespeicherte alte DNS-Antworten.' },
          { id: 'c', text: 'NAT im Router ist falsch konfiguriert.', whyWrong: 'NAT betrifft die Absenderadresse ins Internet. Hier geht es darum, welche Zieladresse zum Namen geliefert wird: DNS-Cache.' },
          { id: 'd', text: 'Die Mitarbeiter haben unterschiedliche Browser.', whyWrong: 'Der Browser fragt die IP über das Betriebssystem und DNS ab. Unterschiedliche Ergebnisse kommen vom Cache mit alter TTL, nicht vom Browser-Modell.' },
        ],
        correct: 'a',
        explanation: 'DNS-Änderungen brauchen Zeit (TTL). Tipp: vor einem Umzug TTL senken, Cache leeren mit `ipconfig /flushdns`.',
      },
    ],
  },
};

export default level;
