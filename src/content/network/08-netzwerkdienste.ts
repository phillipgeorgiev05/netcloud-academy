import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-08',
  track: 'network',
  order: 8,
  title: 'Netzwerkdienste',
  titleEn: 'DHCP, DNS, NAT/PAT, NTP, SNMP, Syslog, SSH',
  summary: 'Die Dienste, ohne die kein Netz läuft: DHCP mit Relay, DNS mit allen wichtigen Eintragstypen, NAT und PAT, Zeit mit NTP, Überwachung mit SNMP und Syslog, sicherer Fernzugriff mit SSH sowie FTP/TFTP.',
  certs: ['ccna', 'netplus', 'fisi'],
  domains: { ccna: '4', netplus: '3', fisi: 'ap2-admin' },
  lab: {
    title: 'DHCP, NAT und SSH auf einem Router',
    needs: 'Cisco Packet Tracer (kostenlos über die Cisco Networking Academy)',
    steps: [
      'Baue Router R1 mit einem LAN (192.168.1.0/24, Switch, 2 PCs) und einer „Internet“-Seite (203.0.113.0/30 zu einem zweiten Router ISP mit Loopback 8.8.8.8).',
      'Lege auf R1 einen DHCP-Pool an: `ip dhcp excluded-address 192.168.1.1 192.168.1.10`, `ip dhcp pool LAN`, `network 192.168.1.0 255.255.255.0`, `default-router 192.168.1.1`, `dns-server 8.8.8.8`. Stelle die PCs auf DHCP und prüfe `show ip dhcp binding`.',
      'Konfiguriere PAT: `access-list 1 permit 192.168.1.0 0.0.0.255`, `ip nat inside source list 1 interface g0/1 overload`, `ip nat inside` auf G0/0 und `ip nat outside` auf G0/1.',
      'Pinge von einem PC 8.8.8.8 und sieh dir `show ip nat translations` an.',
      'Richte SSH ein: `hostname R1`, `ip domain-name lab.local`, `crypto key generate rsa modulus 2048`, `username admin secret ...`, `line vty 0 4`, `login local`, `transport input ssh`. Teste vom PC mit `ssh -l admin 192.168.1.1`.',
    ],
  },
  lesson: [
    {
      heading: 'DHCP – Adressen automatisch vergeben',
      body: `**DHCP** (Dynamic Host Configuration Protocol) gibt Geräten automatisch alles, was sie für das Netz brauchen:
- IP-Adresse und Subnetzmaske
- **Default Gateway**
- **DNS-Server**
- weitere Optionen (z. B. Domainname, NTP-Server, TFTP-Server für IP-Telefone)

**Ablauf: DORA**
| Schritt | Nachricht | Wer an wen |
|---|---|---|
| D | **Discover** | Client sucht per **Broadcast** einen Server |
| O | **Offer** | Server bietet eine Adresse an |
| R | **Request** | Client fordert das Angebot an (Broadcast, damit andere Server Bescheid wissen) |
| A | **Ack** | Server bestätigt, die Adresse gehört jetzt dem Client |

DHCP nutzt **UDP**: Server Port **67**, Client Port **68**.

**Lease (Leihdauer):** Die Adresse ist nur geliehen. Nach der Hälfte der Zeit (T1, 50 %) versucht der Client zu verlängern. Klappt das nicht, fragt er bei 87,5 % (T2) jeden Server. Läuft die Lease ab, muss er die Adresse abgeben.

**Begriffe:**
- **Scope / Pool:** Adressbereich, den der Server verteilt
- **Ausschluss (exclusion):** Adressen im Bereich, die der Server nicht vergibt (z. B. für Router, Drucker)
- **Reservierung:** Ein Gerät (erkannt an seiner MAC-Adresse) bekommt immer dieselbe Adresse
- **APIPA:** Bekommt Windows keine Antwort, gibt es sich eine 169.254.x.x-Adresse. Das ist immer ein Zeichen für ein DHCP-Problem.

Windows-Befehle: \`ipconfig /all\`, \`ipconfig /release\`, \`ipconfig /renew\`.`,
      analogy: 'DORA ist wie im Hotel: „Habt ihr ein Zimmer?“ (Discover) – „Zimmer 12 ist frei“ (Offer) – „Ich nehme Zimmer 12“ (Request) – „Hier ist der Schlüssel“ (Ack). Das Zimmer gehört dir nur bis zum Check-out (Lease).',
      terms: [
        { de: 'Leihdauer', en: 'lease time' },
        { de: 'Adressbereich', en: 'scope / pool' },
        { de: 'Reservierung', en: 'reservation' },
        { de: 'automatische private IP-Adressierung', en: 'APIPA (link-local)' },
      ],
      sources: [{ title: 'RFC 2131 – Dynamic Host Configuration Protocol', url: 'https://www.rfc-editor.org/rfc/rfc2131' }],
    },
    {
      heading: 'DHCP-Relay und DHCP auf Cisco',
      body: `Ein DHCP-Discover ist ein **Broadcast**. Router leiten Broadcasts **nicht** weiter. Steht der DHCP-Server in einem anderen Netz (typisch: ein zentraler Server für alle VLANs), braucht es einen **DHCP-Relay-Agent**.

Der Relay-Agent sitzt auf dem Gateway der Clients. Er nimmt den Broadcast an und schickt ihn als **Unicast** an den Server. Dabei trägt er die IP des Gateways ein (Feld *giaddr*), damit der Server weiß, aus welchem Pool er eine Adresse wählen muss.

\`\`\`
interface vlan 20
 ip address 192.168.20.1 255.255.255.0
 ip helper-address 10.0.0.10
\`\`\`
\`ip helper-address\` gehört auf die Schnittstelle **zu den Clients**, nicht zum Server.

**Router als DHCP-Server:**
\`\`\`
ip dhcp excluded-address 192.168.1.1 192.168.1.10
ip dhcp pool LAN
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 192.168.1.5
 lease 2
\`\`\`
Prüfen: \`show ip dhcp binding\` (vergebene Adressen), \`show ip dhcp pool\`, \`show ip dhcp conflict\`.

**Router als DHCP-Client** (z. B. am Internetanschluss): \`ip address dhcp\` auf der Schnittstelle.`,
      terms: [
        { de: 'DHCP-Weiterleitung', en: 'DHCP relay agent' },
        { de: 'Hilfsadresse', en: 'helper address' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 2,
        prompt: 'Der DHCP-Server steht in VLAN 99. Clients in VLAN 20 bekommen keine Adresse. Wo konfigurierst du `ip helper-address`?',
        options: [
          { id: 'a', text: 'Auf der SVI bzw. dem Subinterface von VLAN 20' },
          { id: 'b', text: 'Auf der SVI von VLAN 99', whyWrong: 'Der DHCP-Discover der Clients ist ein Broadcast und bleibt in VLAN 20. Die SVI von VLAN 99 sieht ihn nie. Der Relay muss dort sitzen, wo die Broadcasts ankommen: am Gateway von VLAN 20. Von dort schickt er sie als Unicast an den Server in VLAN 99.' },
          { id: 'c', text: 'Auf dem DHCP-Server', whyWrong: 'Der DHCP-Server bekommt die Anfragen vom Relay bereits als Unicast an seine eigene Adresse. Er selbst braucht keinen Relay. Das Problem ist, dass die Broadcasts aus VLAN 20 ihn nie erreichen. Darum gehört `ip helper-address` auf das Gateway von VLAN 20.' },
        ],
        correct: 'a',
        explanation: 'Der Relay-Agent sitzt dort, wo die Discover-Broadcasts ankommen: auf dem Gateway der Clients.',
      },
    },
    {
      heading: 'DNS – Namen in Adressen übersetzen',
      body: `**DNS** (Domain Name System) übersetzt Namen wie \`www.example.com\` in IP-Adressen. Ohne DNS müsste man sich alle Adressen merken.

**Aufbau (Hierarchie):**
- **Root** (\`.\`) ganz oben, 13 logische Root-Server-Adressen
- **Top-Level-Domains (TLD):** \`.com\`, \`.de\`, \`.org\`
- **Second-Level-Domains:** \`example.com\`
- Subdomains: \`www.example.com\`, \`mail.example.com\`

**Ablauf einer Abfrage:**
1. Der PC fragt seinen **Resolver** (z. B. den DNS-Server der Firma). Das ist eine **rekursive** Anfrage: „Bring mir die fertige Antwort.“
2. Kennt der Resolver die Antwort nicht aus dem **Cache**, fragt er **iterativ**: Root → TLD-Server für \`.com\` → der **autoritative** Server von \`example.com\`.
3. Der Resolver speichert die Antwort für die Dauer der **TTL** und gibt sie dem PC.

DNS nutzt Port **53**, normalerweise **UDP**. **TCP** nutzt es für große Antworten und für Zonentransfers zwischen DNS-Servern.

**Eintragstypen (Resource Records):**
| Typ | Zweck | Beispiel |
|---|---|---|
| **A** | Name → IPv4 | www → 203.0.113.10 |
| **AAAA** | Name → IPv6 | www → 2001:db8::10 |
| **CNAME** | Alias auf einen anderen Namen | shop → www.example.com |
| **MX** | Mailserver der Domain (mit Priorität) | 10 mail.example.com |
| **PTR** | IP → Name (Reverse Lookup) | 10.113.0.203.in-addr.arpa → www |
| **NS** | zuständige Nameserver der Zone | ns1.example.com |
| **SOA** | Start of Authority: Verwaltungsdaten der Zone | Seriennummer, Timer |
| **TXT** | Freitext, z. B. SPF/DKIM für E-Mail, Domain-Nachweis | v=spf1 … |
| **SRV** | Dienst mit Port, z. B. für Active Directory | _ldap._tcp |

**Sicherheit:** **DNSSEC** signiert Antworten (Schutz vor Fälschung). **DoH** (DNS over HTTPS, Port 443) und **DoT** (DNS over TLS, Port 853) verschlüsseln die Abfragen.

Befehle: \`nslookup\`, \`dig\` (Linux/macOS), \`ipconfig /displaydns\` und \`ipconfig /flushdns\` (Windows-Cache).`,
      analogy: 'DNS ist das Telefonbuch des Internets. Der Resolver ist eine Auskunft: Du fragst einmal, sie telefoniert für dich herum und merkt sich die Antwort eine Weile.',
      terms: [
        { de: 'Namensauflösung', en: 'name resolution' },
        { de: 'autoritativer Server', en: 'authoritative server' },
        { de: 'Eintrag', en: 'resource record (RR)' },
        { de: 'Rückwärtsauflösung', en: 'reverse lookup' },
      ],
      sources: [{ title: 'RFC 1034 – Domain Names: Concepts and Facilities', url: 'https://www.rfc-editor.org/rfc/rfc1034' }],
    },
    {
      heading: 'NAT und PAT',
      body: `Private Adressen (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) werden im Internet nicht geroutet. **NAT** (Network Address Translation) ersetzt sie am Übergang ins Internet durch öffentliche Adressen.

**Drei Arten:**
| Art | Zuordnung | Einsatz |
|---|---|---|
| **Statisches NAT** | 1 privat ↔ 1 öffentlich, fest | Server, der von außen erreichbar sein muss |
| **Dynamisches NAT** | privat → eine freie Adresse aus einem Pool | selten, braucht viele öffentliche IPs |
| **PAT** (NAT Overload) | viele privat → **eine** öffentliche IP, unterschieden über **Ports** | Standard in jedem Heim- und Firmennetz |

**Cisco-Begriffe** (prüfungsrelevant):
| Begriff | Bedeutung |
|---|---|
| **Inside Local** | private Adresse des internen Hosts (z. B. 192.168.1.10) |
| **Inside Global** | öffentliche Adresse, unter der der interne Host draußen erscheint |
| **Outside Global** | echte Adresse des externen Hosts (z. B. 8.8.8.8) |
| **Outside Local** | externer Host aus Sicht des internen Netzes (meist = Outside Global) |

**PAT konfigurieren:**
\`\`\`
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface GigabitEthernet0/1 overload
interface g0/0
 ip nat inside
interface g0/1
 ip nat outside
\`\`\`
**Statisches NAT:** \`ip nat inside source static 192.168.1.20 203.0.113.20\`

Prüfen: \`show ip nat translations\`, \`show ip nat statistics\`. Häufigster Fehler: \`ip nat inside\`/\`outside\` auf der falschen Schnittstelle oder vergessen.

**Port-Weiterleitung (Port Forwarding)** ist statisches PAT: \`ip nat inside source static tcp 192.168.1.20 443 203.0.113.5 443\`.

NAT spart Adressen, ist aber **kein Sicherheitsersatz** für eine Firewall. Bei IPv6 braucht man es normalerweise nicht.`,
      analogy: 'PAT ist wie eine Firmen-Telefonzentrale: Nach außen gibt es nur eine Nummer. Die Zentrale merkt sich, welcher Anruf zu welcher Durchwahl (Port) gehört.',
      terms: [
        { de: 'Adressübersetzung', en: 'network address translation (NAT)' },
        { de: 'Port-Adressübersetzung', en: 'port address translation (PAT) / NAT overload' },
        { de: 'Portweiterleitung', en: 'port forwarding' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'PC 192.168.1.10 surft über PAT ins Internet, Router-Außenadresse 203.0.113.5. Wie heißt 192.168.1.10 in Cisco-Begriffen?',
        options: [
          { id: 'a', text: 'Inside Local' },
          { id: 'b', text: 'Inside Global', whyWrong: 'Inside Global ist die Adresse, mit der der interne PC draußen im Internet auftritt, hier 203.0.113.5 des Routers. Die private 192.168.1.10 ist Inside Local. Merkhilfe: Inside = unser Gerät, Local = Sicht von innen, Global = Sicht von außen.' },
          { id: 'c', text: 'Outside Local', whyWrong: 'Outside bezeichnet immer Geräte im fremden Netz, z. B. den Webserver im Internet. 192.168.1.10 ist unser eigener PC, also Inside. Und weil es die private Adresse aus Sicht des LANs ist, heißt sie Inside Local.' },
        ],
        correct: 'a',
        explanation: 'Inside = unser Netz, Local = Adresse, wie sie innen gilt. Inside Local ist also die private Adresse des PCs.',
      },
      sources: [{ title: 'RFC 1918 – Address Allocation for Private Internets', url: 'https://www.rfc-editor.org/rfc/rfc1918' }],
    },
    {
      heading: 'NTP – die richtige Uhrzeit',
      body: `**NTP** (Network Time Protocol, **UDP 123**) hält die Uhren aller Geräte synchron. Das klingt banal, ist aber wichtig:
- **Logs** lassen sich nur mit gleicher Zeit vergleichen (Fehlersuche, Sicherheitsvorfälle)
- **Zertifikate** und **Kerberos** (Windows-Anmeldung) scheitern bei zu großer Zeitabweichung (Kerberos: Standard 5 Minuten)
- geplante Aufgaben laufen zur richtigen Zeit

**Stratum** gibt den Abstand zur Referenzuhr an:
- Stratum 0: Referenzuhr (Atomuhr, GPS), nicht direkt im Netz
- Stratum 1: Server direkt an der Referenzuhr
- Stratum 2: holt die Zeit von Stratum 1, usw.
- Je kleiner, desto näher an der Quelle. Stratum 16 = nicht synchronisiert.

**Cisco:**
\`\`\`
ntp server 192.0.2.123
clock timezone CET 1
\`\`\`
Prüfen: \`show ntp status\`, \`show ntp associations\`. Ein Router kann selbst NTP-Server für das LAN sein (\`ntp master\`).`,
      terms: [
        { de: 'Zeitsynchronisation', en: 'time synchronization' },
        { de: 'Schicht (Abstand zur Referenzuhr)', en: 'stratum' },
      ],
    },
    {
      heading: 'SNMP und Syslog – Netzwerk überwachen',
      body: `**SNMP** (Simple Network Management Protocol) fragt Geräte nach Zustand und Werten ab (CPU, Schnittstellen, Fehlerzähler).

- **Manager** (das Monitoring-System, NMS) fragt, **Agent** (auf dem Gerät) antwortet.
- Die Werte stehen in der **MIB** (Management Information Base). Jeder Wert hat eine **OID** (Object Identifier), z. B. 1.3.6.1.2.1.1.3 = Laufzeit.
- Nachrichten: **Get** (lesen), **Set** (ändern), **Trap** (Gerät meldet von sich aus, ohne Bestätigung), **Inform** (wie Trap, aber mit Bestätigung).
- Ports: Abfragen **UDP 161**, Traps/Informs **UDP 162**.

| Version | Sicherheit |
|---|---|
| v1, v2c | nur **Community-String** im Klartext (wie ein Passwort, z. B. „public“) |
| **v3** | Benutzer mit **Authentifizierung** und **Verschlüsselung** (authPriv) – empfohlen |

**Syslog** sammelt Logmeldungen zentral (**UDP 514**). Jede Meldung hat einen **Schweregrad (severity)** 0–7:

| Level | Name | Beispiel |
|---|---|---|
| 0 | Emergency | System unbrauchbar |
| 1 | Alert | sofort handeln |
| 2 | Critical | kritischer Zustand |
| 3 | Error | Fehler |
| 4 | Warning | Warnung |
| 5 | Notification | normal, aber wichtig (z. B. Schnittstelle up/down) |
| 6 | Informational | Information |
| 7 | Debugging | Debug-Ausgaben |

**Kleiner = schlimmer.** Eselsbrücke: „**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily.“ \`logging trap 4\` schickt Level 0–4 an den Server.

Cisco: \`logging host 10.0.0.50\`, \`logging trap warnings\`, \`service timestamps log datetime msec\`. Lokal: \`show logging\`.`,
      terms: [
        { de: 'Verwaltungsdatenbank', en: 'management information base (MIB)' },
        { de: 'Objektkennung', en: 'object identifier (OID)' },
        { de: 'Schweregrad', en: 'severity level' },
        { de: 'Gemeinschaftsname', en: 'community string' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Mit `logging trap 3` – welche Meldungen kommen beim Syslog-Server an?',
        options: [
          { id: 'a', text: 'Level 0 bis 3 (Emergency bis Error)' },
          { id: 'b', text: 'Nur Level 3', whyWrong: 'Syslog-Level wirken als Schwelle, nicht als einzelner Wert. `logging trap 3` heißt: Level 3 und alles Schwerere. Schwerer sind die kleineren Zahlen. Es kommen also 0 (Emergency), 1 (Alert), 2 (Critical) und 3 (Error) an.' },
          { id: 'c', text: 'Level 3 bis 7', whyWrong: 'Bei Syslog ist 0 am wichtigsten (Emergency) und 7 am unwichtigsten (Debug). Die Einstellung 3 schickt Level 3 und alles Wichtigere, also 0 bis 3. Die unwichtigeren Level 4 bis 7 werden weggelassen.' },
        ],
        correct: 'a',
        explanation: 'Ein Level schließt alle wichtigeren (kleineren) Levels ein.',
      },
      sources: [
        { title: 'RFC 5424 – The Syslog Protocol', url: 'https://www.rfc-editor.org/rfc/rfc5424' },
        { title: 'RFC 3411 – SNMP Architecture', url: 'https://www.rfc-editor.org/rfc/rfc3411' },
      ],
    },
    {
      heading: 'Fernzugriff: SSH statt Telnet, FTP und TFTP',
      body: `**Telnet** (TCP 23) überträgt alles im **Klartext**, auch Passwörter. Heute nutzt man **SSH** (TCP 22), das alles verschlüsselt.

**SSH auf einem Cisco-Gerät einrichten:**
\`\`\`
hostname R1
ip domain-name firma.local
crypto key generate rsa modulus 2048
ip ssh version 2
username admin secret S1cheresPasswort!
line vty 0 15
 login local
 transport input ssh
\`\`\`
- Hostname und Domainname braucht IOS, um den RSA-Schlüssel zu benennen.
- \`login local\` = Anmeldung mit lokalem Benutzer.
- \`transport input ssh\` erlaubt nur noch SSH auf den VTY-Leitungen (kein Telnet).
- \`enable secret\` (gehasht) statt \`enable password\`.

**Dateiübertragung:**
| Protokoll | Port | Eigenschaften |
|---|---|---|
| **FTP** | TCP 20 (Daten), 21 (Steuerung) | Benutzer/Passwort, aber Klartext |
| **SFTP** | TCP 22 | Dateiübertragung über SSH, verschlüsselt |
| **TFTP** | UDP 69 | ganz einfach, **keine Anmeldung**, z. B. für IOS-Images und Telefon-Konfiguration |

Beispiel: \`copy running-config tftp:\` sichert die Konfiguration auf einen TFTP-Server.

**Out-of-Band-Management:** Zugriff über einen getrennten Weg (Konsolenport, eigenes Management-Netz), damit man auch bei einem Netzausfall noch ans Gerät kommt. **In-Band** = Zugriff über das normale Produktivnetz.`,
      terms: [
        { de: 'sichere Shell', en: 'Secure Shell (SSH)' },
        { de: 'virtuelle Terminalleitungen', en: 'VTY lines' },
        { de: 'Management außerhalb des Datennetzes', en: 'out-of-band management' },
      ],
      compare: {
        left: 'Telnet',
        right: 'SSH',
        rows: [
          ['TCP 23', 'TCP 22'],
          ['Klartext, Passwörter mitlesbar', 'alles verschlüsselt'],
          ['keine Schlüssel nötig', 'RSA-Schlüssel, Hostname und Domainname nötig'],
          ['nur noch im Labor', 'Standard für Fernzugriff'],
        ],
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'ordering', difficulty: 1,
      prompt: 'Bringe die DHCP-Nachrichten in die richtige Reihenfolge.',
      items: [
        { id: 'd', text: 'Discover' },
        { id: 'o', text: 'Offer' },
        { id: 'r', text: 'Request' },
        { id: 'a', text: 'Acknowledge' },
      ],
      explanation: 'DORA: Discover (Client sucht) → Offer (Server bietet an) → Request (Client fordert an) → Ack (Server bestätigt).',
      analogy: 'Hotel: „Zimmer frei?“ – „Nr. 12“ – „Nehme ich“ – „Hier der Schlüssel“.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Ein Windows-PC zeigt die Adresse 169.254.33.7. Was bedeutet das?',
      options: [
        { id: 'a', text: 'Er hat keine Antwort von einem DHCP-Server bekommen.' },
        { id: 'b', text: 'Er hat eine gültige öffentliche Adresse.', whyWrong: '169.254.0.0/16 ist der Link-Local-Bereich (APIPA, RFC 3927). Router leiten ihn nicht weiter, man kommt damit nur ins eigene Segment und nicht ins Internet. Windows vergibt sich diese Adresse selbst, wenn kein DHCP-Server antwortet.' },
        { id: 'c', text: 'Der DNS-Server ist falsch eingetragen.', whyWrong: 'Ein falscher DNS-Server verhindert nur die Namensauflösung. Die eigene IP-Adresse hat der PC trotzdem vom DHCP-Server. 169.254.x.x zeigt dagegen, dass gar keine DHCP-Antwort kam.' },
        { id: 'd', text: 'Die Adresse wurde vom Admin fest eingetragen.', whyWrong: 'Fest eingetragen wird praktisch nie eine Adresse aus 169.254.x.x, weil man damit nicht über den Router hinauskommt. Diese Adressen vergibt Windows sich automatisch (APIPA), wenn DHCP aktiv ist, aber kein Server antwortet.' },
      ],
      correct: 'a',
      explanation: 'APIPA: Ohne DHCP-Antwort vergibt sich Windows selbst eine 169.254.x.x-Adresse. Erste Prüfungen: Kabel/WLAN, VLAN, DHCP-Server, Relay.',
    },
    {
      id: 'q3', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Der DHCP-Server hat die Adresse **10.0.0.10**. Richte auf der SVI von VLAN 30 das DHCP-Relay ein.',
      template: 'SW1(config)# interface vlan 30\nSW1(config-if)# {{0}}',
      blanks: [{ accept: ['ip helper-address 10.0.0.10'] }],
      explanation: '`ip helper-address` leitet die DHCP-Broadcasts der Clients als Unicast an den Server weiter.',
    },
    {
      id: 'q4', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die DNS-Eintragstypen ihrem Zweck zu.',
      items: [
        { id: 'a', text: 'A' },
        { id: 'aaaa', text: 'AAAA' },
        { id: 'cname', text: 'CNAME' },
        { id: 'mx', text: 'MX' },
        { id: 'ptr', text: 'PTR' },
      ],
      buckets: [
        { id: 'v4', label: 'Name → IPv4' },
        { id: 'v6', label: 'Name → IPv6' },
        { id: 'alias', label: 'Alias auf anderen Namen' },
        { id: 'mail', label: 'Mailserver der Domain' },
        { id: 'rev', label: 'IP → Name' },
      ],
      solution: { a: 'v4', aaaa: 'v6', cname: 'alias', mx: 'mail', ptr: 'rev' },
      explanation: 'A/AAAA für Vorwärtsauflösung, CNAME für Aliase, MX für E-Mail, PTR für Rückwärtsauflösung (Reverse Lookup).',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Welcher DNS-Eintrag wird genutzt, um für E-Mail festzulegen, welche Server im Namen der Domain senden dürfen (SPF)?',
      options: [
        { id: 'a', text: 'TXT' },
        { id: 'b', text: 'MX', whyWrong: 'Der MX-Eintrag (Mail Exchanger) sagt, an welchen Server andere ihre Mails für die Domain schicken sollen. Er regelt also den Empfang. Welche Server senden dürfen, steht im SPF-Datensatz, und der wird als TXT-Eintrag hinterlegt.' },
        { id: 'c', text: 'SOA', whyWrong: 'Der SOA-Eintrag (Start of Authority) steht einmal am Anfang jeder Zone. Er enthält Verwaltungsdaten: primären Nameserver, Admin-Mail, Seriennummer und Timer für Zonentransfers. Mit E-Mail-Absendern hat er nichts zu tun.' },
        { id: 'd', text: 'NS', whyWrong: 'Der NS-Eintrag nennt die Nameserver, die für die Zone zuständig sind. Er sagt nichts über E-Mail. SPF, DKIM und DMARC werden alle als TXT-Einträge hinterlegt.' },
      ],
      correct: 'a',
      explanation: 'SPF, DKIM und DMARC stehen in TXT-Einträgen. TXT wird auch für Domain-Nachweise (z. B. bei Microsoft 365) genutzt.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Der PC fragt seinen DNS-Server nach www.example.com. Der DNS-Server fragt dann nacheinander Root-, TLD- und autoritativen Server. Wie heißen die beiden Abfragearten?',
      options: [
        { id: 'a', text: 'PC → DNS-Server rekursiv, DNS-Server → andere Server iterativ' },
        { id: 'b', text: 'Beide iterativ', whyWrong: 'Der PC (Stub Resolver) will eine fertige Antwort und schickt darum eine rekursive Anfrage: „Finde das bitte für mich heraus.“ Nur der DNS-Server fragt dann iterativ: Jeder Server antwortet mit dem nächsten Verweis (Root, dann .com, dann example.com).' },
        { id: 'c', text: 'PC → DNS-Server iterativ, DNS-Server → andere Server rekursiv', whyWrong: 'Genau umgekehrt. Der PC stellt eine rekursive Anfrage, weil er die fertige IP will. Der DNS-Server arbeitet dann die Kette iterativ ab: Root und TLD-Server liefern nur Verweise, keine Endergebnisse.' },
        { id: 'd', text: 'Beide sind Zonentransfers', whyWrong: 'Ein Zonentransfer (AXFR/IXFR) kopiert eine ganze Zone vom primären zum sekundären DNS-Server. Das passiert zur Synchronisierung, nicht bei normalen Abfragen. Hier geht es um Namensauflösung: rekursiv vom PC, iterativ vom DNS-Server.' },
      ],
      correct: 'a',
      explanation: 'Rekursiv: „Bring mir die Antwort.“ Iterativ: „Ich weiß es nicht, frag dort drüben.“ Der Resolver arbeitet sich iterativ durch die Hierarchie.',
    },
    {
      id: 'q7', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu DNS-Ports stimmen?',
      options: [
        { id: 'a', text: 'Normale Abfragen laufen über UDP 53.' },
        { id: 'b', text: 'Zonentransfers zwischen DNS-Servern nutzen TCP 53.' },
        { id: 'c', text: 'DNS over HTTPS nutzt Port 443.' },
        { id: 'd', text: 'DNS nutzt ausschließlich TCP.', whyWrong: 'Standard ist UDP 53, weil eine kurze Frage und Antwort ohne Verbindungsaufbau schneller geht. TCP 53 kommt nur dazu, wenn die Antwort zu groß ist (Truncated-Flag) und bei Zonentransfers. Ausschließlich TCP stimmt also nicht.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'UDP 53 für Abfragen, TCP 53 für große Antworten und Zonentransfers, DoH auf 443, DoT auf 853.',
    },
    {
      id: 'q8', type: 'single', difficulty: 1,
      prompt: '200 PCs einer Firma surfen über eine einzige öffentliche IP-Adresse. Welche Technik wird genutzt?',
      options: [
        { id: 'a', text: 'PAT (NAT Overload)' },
        { id: 'b', text: 'Statisches NAT', whyWrong: 'Statisches NAT übersetzt eine private Adresse fest auf eine öffentliche, 1:1. Für 200 PCs bräuchte man 200 öffentliche Adressen. Mit nur einer öffentlichen IP geht das nur per PAT: Dort werden die PCs über verschiedene Quellports unterschieden.' },
        { id: 'c', text: 'Dynamisches NAT ohne Overload', whyWrong: 'Dynamisches NAT ohne Overload vergibt aus einem Pool je eine öffentliche Adresse pro aktivem PC. Mit einer einzigen Adresse käme nur ein PC gleichzeitig ins Internet. PAT (Overload) teilt eine Adresse auf viele PCs auf, indem es zusätzlich die Ports übersetzt.' },
        { id: 'd', text: 'DHCP', whyWrong: 'DHCP verteilt im LAN private Adressen an die PCs, übersetzt aber nichts. Damit 200 PCs mit privaten Adressen über eine öffentliche IP ins Internet kommen, braucht es PAT auf dem Router.' },
      ],
      correct: 'a',
      explanation: 'PAT unterscheidet die Verbindungen über die Quellports. So teilen sich viele Geräte eine öffentliche IP.',
    },
    {
      id: 'q9', type: 'scenario', difficulty: 3,
      prompt: 'Welche Adresse ist hier die **Inside Global**?',
      scenario: '```\nR1# show ip nat translations\nPro Inside global       Inside local        Outside local      Outside global\ntcp 203.0.113.5:1025   192.168.1.10:51200  142.250.1.1:443    142.250.1.1:443\n```',
      options: [
        { id: 'a', text: '203.0.113.5' },
        { id: 'b', text: '192.168.1.10', whyWrong: '192.168.1.10 ist die private Adresse des PCs, so wie sie im LAN gilt. Das ist Inside Local. Inside Global ist die Adresse, unter der derselbe PC im Internet auftritt: 203.0.113.5.' },
        { id: 'c', text: '142.250.1.1', whyWrong: '142.250.1.1 ist der Server im Internet, also ein Outside-Gerät (Outside Global). Inside bezeichnet immer unsere eigenen Geräte. Die öffentliche Adresse unseres PCs ist 203.0.113.5.' },
        { id: 'd', text: '51200', whyWrong: '51200 ist ein Port, keine IP-Adresse. PAT nutzt ihn, um viele PCs hinter einer Adresse auseinanderzuhalten. Die vier NAT-Begriffe bezeichnen aber Adressen. Inside Global ist 203.0.113.5.' },
      ],
      correct: 'a',
      explanation: 'Inside Global = Adresse, unter der der interne PC im Internet erscheint. Der Port wurde dabei von 51200 auf 1025 übersetzt (PAT).',
    },
    {
      id: 'q10', type: 'cli', shell: 'ios', difficulty: 3,
      prompt: 'PAT: Übersetze alle Adressen aus ACL 1 auf die Adresse der Schnittstelle **GigabitEthernet0/1**.',
      template: 'R1(config)# {{0}}',
      blanks: [{ accept: ['ip nat inside source list 1 interface gigabitethernet0/1 overload', 'ip nat inside source list 1 interface g0/1 overload', 'ip nat inside source list 1 interface gi0/1 overload'] }],
      explanation: '`overload` macht aus dynamischem NAT ein PAT. Zusätzlich braucht es `ip nat inside` und `ip nat outside` auf den Schnittstellen.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'NAT ist konfiguriert, aber `show ip nat translations` bleibt leer. ACL und `ip nat inside source` stimmen. Was wird am häufigsten vergessen?',
      options: [
        { id: 'a', text: '`ip nat inside` bzw. `ip nat outside` auf den Schnittstellen' },
        { id: 'b', text: 'Ein DNS-Server', whyWrong: 'DNS übersetzt Namen in Adressen. Ob der Router Pakete übersetzt, hängt davon nicht ab: Ein Ping auf eine IP müsste trotzdem in der NAT-Tabelle auftauchen. Leer bleibt sie, wenn der Router nicht weiß, welche Schnittstelle innen und welche außen ist.' },
        { id: 'c', text: 'Ein DHCP-Pool', whyWrong: 'NAT übersetzt jede Quelladresse, die zur ACL passt, egal ob sie per DHCP oder statisch vergeben wurde. Ein DHCP-Pool ist keine Voraussetzung. Häufigster Fehler: `ip nat inside` und `ip nat outside` fehlen auf den Schnittstellen.' },
        { id: 'd', text: '`ip routing`', whyWrong: 'Auf Cisco-Routern ist `ip routing` standardmäßig an. Nur auf Layer-3-Switches muss man es einschalten. Fehlt die NAT-Übersetzung, liegt es meist an fehlendem `ip nat inside`/`outside` auf den Schnittstellen.' },
      ],
      correct: 'a',
      explanation: 'Der Router übersetzt nur Verkehr, der von einer inside- zu einer outside-Schnittstelle (oder zurück) fließt.',
    },
    {
      id: 'q12', type: 'multi', difficulty: 2,
      prompt: 'Warum ist eine einheitliche Uhrzeit per NTP wichtig?',
      options: [
        { id: 'a', text: 'Logmeldungen verschiedener Geräte lassen sich zeitlich vergleichen.' },
        { id: 'b', text: 'Kerberos-Anmeldung und Zertifikatsprüfung scheitern bei großer Zeitabweichung.' },
        { id: 'c', text: 'NTP erhöht die Bandbreite der Schnittstellen.', whyWrong: 'NTP synchronisiert nur die Uhrzeit, und das mit wenigen kleinen Paketen. Auf die Bandbreite einer Schnittstelle hat es keinen Einfluss. Wichtig ist NTP für Logs, Kerberos und Zertifikate.' },
        { id: 'd', text: 'Ohne NTP funktioniert kein Routing.', whyWrong: 'Routing-Protokolle wie OSPF arbeiten mit eigenen Timern (Hello, Dead) und nicht mit der Uhrzeit. Sie funktionieren auch, wenn die Uhr falsch geht. Probleme gibt es bei zeitabhängigen Dingen: Logs, Kerberos, Zertifikate.' },
      ],
      correct: ['a', 'b'],
      explanation: 'Zeit ist die Grundlage für Fehlersuche (Logs), Sicherheit (Kerberos, Zertifikate) und geplante Aufgaben.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Ein NTP-Server bezieht seine Zeit direkt von einer GPS-Uhr. Welches Stratum hat er?',
      options: [
        { id: 'a', text: 'Stratum 1' },
        { id: 'b', text: 'Stratum 0', whyWrong: 'Stratum 0 ist die Referenzuhr selbst, also die GPS- oder Atomuhr. Sie ist kein NTP-Server im Netz. Ein Server, der direkt an ihr hängt, ist Stratum 1. Jede weitere Stufe zählt eins hoch.' },
        { id: 'c', text: 'Stratum 2', whyWrong: 'Stratum 2 holt seine Zeit über das Netz von einem Stratum-1-Server. Hier hängt der Server direkt an der GPS-Uhr (Stratum 0), also ist er selbst Stratum 1.' },
        { id: 'd', text: 'Stratum 16', whyWrong: 'Stratum 16 bedeutet „nicht synchronisiert“. Ein solcher Server hat keine verlässliche Zeitquelle. Mit direkter GPS-Uhr ist der Server dagegen Stratum 1, die beste Stufe für einen NTP-Server.' },
      ],
      correct: 'a',
      explanation: 'Jede Stufe zählt eins hoch: Referenzuhr 0 → direkt angebundener Server 1 → dessen Clients 2 …',
    },
    {
      id: 'q14', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Syslog-Schweregrade zu.',
      items: [
        { id: 'emerg', text: 'Emergency' },
        { id: 'err', text: 'Error' },
        { id: 'warn', text: 'Warning' },
        { id: 'notif', text: 'Notification' },
        { id: 'debug', text: 'Debugging' },
      ],
      buckets: [
        { id: '0', label: '0' },
        { id: '3', label: '3' },
        { id: '4', label: '4' },
        { id: '5', label: '5' },
        { id: '7', label: '7' },
      ],
      solution: { emerg: '0', err: '3', warn: '4', notif: '5', debug: '7' },
      explanation: '0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notification, 6 Informational, 7 Debugging. Eselsbrücke: Every Awesome Cisco Engineer Will Need Ice cream Daily.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Welche SNMP-Version solltest du einsetzen und warum?',
      options: [
        { id: 'a', text: 'SNMPv3, weil sie Authentifizierung und Verschlüsselung bietet' },
        { id: 'b', text: 'SNMPv2c, weil der Community-String verschlüsselt ist', whyWrong: 'Bei SNMPv1 und v2c geht der Community-String im Klartext übers Netz. Wer mitliest, kann ihn auslesen und damit Geräte abfragen oder sogar ändern (bei Schreibrechten). Nur SNMPv3 bietet Benutzer, Authentifizierung und Verschlüsselung (authPriv).' },
        { id: 'c', text: 'SNMPv1, weil sie am schnellsten ist', whyWrong: 'SNMPv1 ist die älteste Version: Community-String im Klartext, nur 32-Bit-Zähler, keine Bulk-Abfragen. Sie ist weder schneller noch sicher. Heute nimmt man SNMPv3 mit authPriv.' },
        { id: 'd', text: 'Egal, alle Versionen sind gleich sicher', whyWrong: 'Die Versionen unterscheiden sich gerade bei der Sicherheit stark. v1 und v2c schützen nur mit einem Community-String im Klartext. SNMPv3 hat echte Benutzer, prüft die Absender (Authentifizierung) und verschlüsselt (Privacy).' },
      ],
      correct: 'a',
      explanation: 'SNMPv3 mit Sicherheitsstufe authPriv: Benutzer-Authentifizierung und verschlüsselte Daten.',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Ein Switch soll einen Schnittstellenausfall sofort von sich aus an das Monitoring melden, ohne dass dieses fragt. Welche SNMP-Nachricht ist das?',
      options: [
        { id: 'a', text: 'Trap (oder Inform mit Bestätigung)' },
        { id: 'b', text: 'Get', whyWrong: 'Get schickt der Manager, um einen Wert vom Gerät abzufragen. Es geht also vom Monitoring aus. Gefragt war eine Meldung, die der Switch von sich aus schickt: Das ist ein Trap, oder ein Inform, wenn er eine Bestätigung will.' },
        { id: 'c', text: 'Set', whyWrong: 'Mit Set ändert der Manager einen Wert auf dem Gerät, z. B. schaltet er eine Schnittstelle ab. Auch das geht vom Monitoring aus. Meldungen vom Gerät an den Manager sind Traps oder Informs.' },
        { id: 'd', text: 'Walk', whyWrong: 'Ein Walk sind viele GetNext-Abfragen hintereinander, die den MIB-Baum auslesen. Er geht vom Manager aus und erfasst nichts sofort. Eine Meldung, die der Switch von sich aus schickt, ist ein Trap.' },
      ],
      correct: 'a',
      explanation: 'Traps (UDP 162) schickt der Agent unaufgefordert. Informs sind Traps mit Empfangsbestätigung.',
    },
    {
      id: 'q17', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Erlaube auf den VTY-Leitungen **nur noch SSH**.',
      template: 'R1(config)# line vty 0 15\nR1(config-line)# login local\nR1(config-line)# {{0}}',
      blanks: [{ accept: ['transport input ssh'] }],
      explanation: '`transport input ssh` sperrt Telnet. Vorher braucht es Hostname, Domainname, RSA-Schlüssel und einen lokalen Benutzer.',
    },
    {
      id: 'q18', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Protokolle ihren Ports zu.',
      items: [
        { id: 'ssh', text: 'SSH / SFTP' },
        { id: 'telnet', text: 'Telnet' },
        { id: 'tftp', text: 'TFTP' },
        { id: 'ntp', text: 'NTP' },
        { id: 'snmp', text: 'SNMP (Abfragen)' },
        { id: 'syslog', text: 'Syslog' },
      ],
      buckets: [
        { id: '22', label: 'TCP 22' },
        { id: '23', label: 'TCP 23' },
        { id: '69', label: 'UDP 69' },
        { id: '123', label: 'UDP 123' },
        { id: '161', label: 'UDP 161' },
        { id: '514', label: 'UDP 514' },
      ],
      solution: { ssh: '22', telnet: '23', tftp: '69', ntp: '123', snmp: '161', syslog: '514' },
      explanation: 'Diese Ports gehören zum Pflichtwissen für CCNA und Network+.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: 'Nach dem Umzug des DHCP-Servers in das Server-VLAN bekommen die PCs in VLAN 10 keine Adressen mehr.',
        steps: [
          {
            id: 's1', text: 'PCs in VLAN 99 (gleiches VLAN wie der Server) bekommen Adressen. Was ist die wahrscheinliche Ursache für VLAN 10?',
            options: [
              { id: 'a', text: 'Die DHCP-Broadcasts aus VLAN 10 erreichen den Server nicht mehr, weil Router keine Broadcasts weiterleiten.', correct: true, feedback: 'Richtig. Vorher stand der Server im selben Netz, jetzt braucht es einen Relay.' },
              { id: 'b', text: 'Der DHCP-Server ist defekt.', correct: false, feedback: 'Er versorgt VLAN 99 ja problemlos.' },
              { id: 'c', text: 'Die PCs haben falsche DNS-Server.', correct: false, feedback: 'Ohne Adresse ist DNS noch gar nicht relevant.' },
            ],
          },
          {
            id: 's2', text: 'Was konfigurierst du?',
            options: [
              { id: 'a', text: '`ip helper-address <Server-IP>` auf der SVI von VLAN 10', correct: true, feedback: 'Genau. Das Gateway von VLAN 10 leitet die Anfragen per Unicast weiter.' },
              { id: 'b', text: '`ip helper-address` auf der SVI von VLAN 99', correct: false, feedback: 'Der Relay muss dort sitzen, wo die Broadcasts der Clients ankommen.' },
              { id: 'c', text: 'Einen zweiten DHCP-Server in VLAN 10', correct: false, feedback: 'Möglich, aber unnötig aufwendig. Genau dafür gibt es den Relay.' },
            ],
          },
          {
            id: 's3', text: 'Der Relay ist eingerichtet, die PCs bekommen trotzdem nichts. Im Mitschnitt am Server kommen die Discover-Nachrichten jetzt an (Relay-Adresse 10.10.0.1), der Server antwortet aber nicht. Was fehlt?',
            options: [
              { id: 'a', text: 'Auf dem DHCP-Server fehlt ein Bereich (Scope) für 10.10.0.0/24.', correct: true, feedback: 'Richtig. Der Server wählt den Pool anhand der Relay-Adresse (giaddr). Ohne passenden Scope schweigt er.' },
              { id: 'b', text: 'Der PC muss neu gestartet werden.', correct: false, feedback: 'Ein Neustart ändert nichts an der Konfiguration des Servers.' },
              { id: 'c', text: 'Die Leasedauer ist zu lang.', correct: false, feedback: 'Die Leasedauer bestimmt nicht, aus welchem Netz die Adresse kommt.' },
            ],
          },
        ],
        explanation: 'Zentraler DHCP-Server: Pro Client-VLAN einen Relay (`ip helper-address`) und auf dem Server einen passenden Scope je Netz.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        prompt: 'Der Webserver 192.168.1.20 soll aus dem Internet über **203.0.113.20** erreichbar sein. Von außen klappt es nicht. Was ist falsch?',
        scenario: '```\nR1# show running-config | include nat\n ip nat inside source static 192.168.1.20 203.0.113.20\ninterface GigabitEthernet0/0\n description LAN\n ip nat outside\ninterface GigabitEthernet0/1\n description INTERNET\n ip nat inside\n```',
        options: [
          { id: 'a', text: '`ip nat inside` und `ip nat outside` sind auf den Schnittstellen vertauscht.' },
          { id: 'b', text: 'Für einen Webserver braucht man PAT statt statischem NAT.', whyWrong: 'Gerade für einen Server, der von außen erreichbar sein soll, ist statisches NAT richtig. Es bildet eine feste öffentliche Adresse (203.0.113.20) auf den Server ab, und Verbindungen von außen finden ihn. Bei PAT kennt der Router ohne Port-Weiterleitung kein Ziel für eingehende Verbindungen.' },
          { id: 'c', text: 'Es fehlt eine Access-List.', whyWrong: 'Statisches NAT (`ip nat inside source static ...`) braucht keine ACL, denn die Zuordnung steht fest in der Zeile. Eine ACL braucht man nur bei dynamischem NAT und PAT, um festzulegen, welche Adressen übersetzt werden.' },
          { id: 'd', text: 'Die öffentliche Adresse muss auf dem Server eingetragen werden.', whyWrong: 'Der Server behält seine private Adresse 192.168.1.20. NAT ist gerade dafür da: Der Router übersetzt 203.0.113.20 in 192.168.1.20 und zurück. Damit das klappt, müssen inside und outside auf den richtigen Schnittstellen stehen.' },
        ],
        correct: 'a',
        explanation: 'Das LAN (G0/0) muss `inside`, die Internetseite (G0/1) `outside` sein. Sonst übersetzt der Router in die falsche Richtung.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        prompt: 'SSH auf R1 schlägt fehl, Telnet ebenfalls. Was ist die Ursache?',
        scenario: '```\nR1# show running-config | section line vty\nline vty 0 15\n login local\n transport input ssh\n\nR1# show ip ssh\nSSH Disabled - version 1.99\n%Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2).\n```',
        options: [
          { id: 'a', text: 'Es gibt keinen RSA-Schlüssel, darum ist SSH deaktiviert. Telnet ist durch `transport input ssh` gesperrt.' },
          { id: 'b', text: 'Die VTY-Leitungen müssen 0 4 statt 0 15 heißen.', whyWrong: '`line vty 0 4` und `line vty 0 15` sind beide gültig. 0 15 deckt auf neueren Geräten einfach alle 16 Leitungen ab. Das Problem: Ohne RSA-Schlüssel (`crypto key generate rsa`) läuft kein SSH, und Telnet ist durch `transport input ssh` gesperrt.' },
          { id: 'c', text: '`login local` verhindert SSH.', whyWrong: '`login local` sagt nur: Prüfe Anmeldungen gegen die lokalen Benutzer (`username ... secret ...`). Für SSH ist das sogar nötig, weil SSH einen Benutzernamen braucht. Hier fehlt der RSA-Schlüssel.' },
          { id: 'd', text: 'SSH funktioniert nur mit TACACS+.', whyWrong: 'SSH funktioniert gut mit lokalen Benutzern auf dem Gerät. TACACS+ oder RADIUS sind nur eine Option für zentrale Anmeldung in großen Netzen. Hier fehlt der RSA-Schlüssel, ohne den SSH nicht startet.' },
        ],
        correct: 'a',
        explanation: 'Lösung: `ip domain-name …` (falls fehlend) und `crypto key generate rsa modulus 2048`, dann `ip ssh version 2`.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Eine Website wurde auf einen neuen Server umgezogen und der A-Eintrag geändert. Einige Nutzer landen nach einer Stunde noch beim alten Server. Was ist die wahrscheinlichste Erklärung?',
        options: [
          { id: 'a', text: 'Resolver und Clients nutzen noch die zwischengespeicherte alte Antwort, bis deren TTL abläuft.' },
          { id: 'b', text: 'Der MX-Eintrag zeigt auf den alten Server.', whyWrong: 'Der MX-Eintrag legt nur fest, wohin E-Mails für die Domain gehen. Browser fragen beim Aufruf einer Website den A-Eintrag (bzw. AAAA) ab und nie den MX. Hier wurde der A-Eintrag geändert, aber die alte Antwort liegt noch in Caches.' },
          { id: 'c', text: 'DNS nutzt TCP statt UDP.', whyWrong: 'Ob die Anfrage über UDP oder TCP läuft, ändert nichts an der Antwort. Veraltete Antworten kommen aus Caches: Resolver und Clients behalten den alten A-Eintrag, bis seine TTL abgelaufen ist.' },
          { id: 'd', text: 'Der PTR-Eintrag fehlt.', whyWrong: 'PTR-Einträge dienen der Rückwärtsauflösung, also von IP zu Name. Beim Aufruf einer Website fragt der Browser den A-Eintrag ab. Hier liefern Caches noch den alten A-Eintrag, bis die TTL abläuft.' },
        ],
        correct: 'a',
        explanation: 'Antworten werden für die TTL zwischengespeichert. Tipp für Umzüge: TTL einige Zeit vorher verkleinern. Lokal hilft `ipconfig /flushdns`.',
      },
      {
        id: 'b5', type: 'multi', difficulty: 3,
        prompt: 'Welche Konfigurationen machen das Netzwerkmanagement sicherer?',
        options: [
          { id: 'a', text: 'SSH Version 2 statt Telnet' },
          { id: 'b', text: 'SNMPv3 mit authPriv statt SNMPv2c' },
          { id: 'c', text: '`enable secret` statt `enable password`' },
          { id: 'd', text: 'TFTP statt SFTP für Konfigurationssicherungen', whyWrong: 'TFTP hat weder Anmeldung noch Verschlüsselung: Jeder im Netz kann die Datei mitlesen oder sogar unterschieben. Konfigurationen enthalten Passwörter und Schlüssel. SFTP und SCP laufen über SSH, also verschlüsselt und mit Anmeldung.' },
          { id: 'e', text: 'SNMP-Community „public“ beibehalten', whyWrong: '„public“ ist der bekannteste Standard-Community-String. Angreifer und Scanner probieren ihn als Erstes aus. Wer ihn beibehält, gibt jedem im Netz Lesezugriff auf das Gerät. Sicher ist SNMPv3, mindestens aber ein eigener, langer Community-String mit ACL.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Verschlüsselte Protokolle (SSH, SNMPv3, SFTP), gehashte Passwörter und keine Standardwerte.',
      },
    ],
  },
};

export default level;
