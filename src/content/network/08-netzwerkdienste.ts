import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-08',
  track: 'network',
  order: 8,
  title: 'Netzwerkdienste',
  titleEn: 'DHCP, DNS, NAT/PAT, NTP, SNMP, Syslog, SSH',
  summary: 'Die Dienste, ohne die kein Netz läuft: DHCP mit Relay, DNS mit allen wichtigen Eintragstypen, NAT und PAT, Zeit mit NTP, Überwachung mit SNMP und Syslog, sicherer Fernzugriff mit SSH sowie FTP/TFTP.',
  certs: ['ccna', 'netplus'],
  domains: { ccna: '4', netplus: '3' },
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
          { id: 'b', text: 'Auf der SVI von VLAN 99', whyWrong: 'Der Relay muss die Broadcasts der Clients empfangen, also auf deren Gateway.' },
          { id: 'c', text: 'Auf dem DHCP-Server', whyWrong: 'Der Server braucht keinen Relay, er empfängt die Unicasts direkt.' },
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
          { id: 'b', text: 'Inside Global', whyWrong: 'Inside Global ist 203.0.113.5, die öffentliche Adresse.' },
          { id: 'c', text: 'Outside Local', whyWrong: 'Outside bezeichnet die Geräte im Internet.' },
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
          { id: 'b', text: 'Nur Level 3', whyWrong: 'Die Einstellung gilt für das Level und alle schwereren (kleineren) Levels.' },
          { id: 'c', text: 'Level 3 bis 7', whyWrong: 'Umgekehrt: Je höher die Zahl, desto unwichtiger. Level 4–7 werden weggelassen.' },
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
        { id: 'b', text: 'Er hat eine gültige öffentliche Adresse.', whyWrong: '169.254.0.0/16 ist link-local und wird nicht geroutet.' },
        { id: 'c', text: 'Der DNS-Server ist falsch eingetragen.', whyWrong: 'DNS hat mit der Adressvergabe nichts zu tun.' },
        { id: 'd', text: 'Die Adresse wurde vom Admin fest eingetragen.', whyWrong: 'Feste Adressen aus diesem Bereich wären unüblich. 169.254.x.x ist typisch für APIPA.' },
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
        { id: 'b', text: 'MX', whyWrong: 'MX legt fest, wer Mails für die Domain empfängt, nicht wer senden darf.' },
        { id: 'c', text: 'SOA', whyWrong: 'SOA enthält Verwaltungsdaten der Zone.' },
        { id: 'd', text: 'NS', whyWrong: 'NS nennt die zuständigen Nameserver.' },
      ],
      correct: 'a',
      explanation: 'SPF, DKIM und DMARC stehen in TXT-Einträgen. TXT wird auch für Domain-Nachweise (z. B. bei Microsoft 365) genutzt.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Der PC fragt seinen DNS-Server nach www.example.com. Der DNS-Server fragt dann nacheinander Root-, TLD- und autoritativen Server. Wie heißen die beiden Abfragearten?',
      options: [
        { id: 'a', text: 'PC → DNS-Server rekursiv, DNS-Server → andere Server iterativ' },
        { id: 'b', text: 'Beide iterativ', whyWrong: 'Der PC will eine fertige Antwort, das ist eine rekursive Anfrage.' },
        { id: 'c', text: 'PC → DNS-Server iterativ, DNS-Server → andere Server rekursiv', whyWrong: 'Genau umgekehrt.' },
        { id: 'd', text: 'Beide sind Zonentransfers', whyWrong: 'Zonentransfers synchronisieren ganze Zonen zwischen DNS-Servern.' },
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
        { id: 'd', text: 'DNS nutzt ausschließlich TCP.', whyWrong: 'Standard ist UDP. TCP kommt bei großen Antworten und Zonentransfers dazu.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'UDP 53 für Abfragen, TCP 53 für große Antworten und Zonentransfers, DoH auf 443, DoT auf 853.',
    },
    {
      id: 'q8', type: 'single', difficulty: 1,
      prompt: '200 PCs einer Firma surfen über eine einzige öffentliche IP-Adresse. Welche Technik wird genutzt?',
      options: [
        { id: 'a', text: 'PAT (NAT Overload)' },
        { id: 'b', text: 'Statisches NAT', whyWrong: 'Statisches NAT ordnet genau eine private einer öffentlichen Adresse zu.' },
        { id: 'c', text: 'Dynamisches NAT ohne Overload', whyWrong: 'Dafür bräuchte man so viele öffentliche Adressen wie gleichzeitig aktive PCs.' },
        { id: 'd', text: 'DHCP', whyWrong: 'DHCP verteilt Adressen im LAN, übersetzt aber nichts.' },
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
        { id: 'b', text: '192.168.1.10', whyWrong: 'Das ist die private Adresse des PCs, also Inside Local.' },
        { id: 'c', text: '142.250.1.1', whyWrong: 'Das ist der externe Server (Outside).' },
        { id: 'd', text: '51200', whyWrong: 'Das ist ein Port, keine Adresse.' },
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
        { id: 'b', text: 'Ein DNS-Server', whyWrong: 'DNS beeinflusst nicht, ob NAT übersetzt.' },
        { id: 'c', text: 'Ein DHCP-Pool', whyWrong: 'NAT funktioniert auch mit fest eingetragenen Adressen.' },
        { id: 'd', text: '`ip routing`', whyWrong: 'Auf Routern ist Routing standardmäßig aktiv.' },
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
        { id: 'c', text: 'NTP erhöht die Bandbreite der Schnittstellen.', whyWrong: 'NTP synchronisiert nur Uhren und beeinflusst keine Bandbreite.' },
        { id: 'd', text: 'Ohne NTP funktioniert kein Routing.', whyWrong: 'Routing funktioniert auch mit falscher Uhrzeit.' },
      ],
      correct: ['a', 'b'],
      explanation: 'Zeit ist die Grundlage für Fehlersuche (Logs), Sicherheit (Kerberos, Zertifikate) und geplante Aufgaben.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Ein NTP-Server bezieht seine Zeit direkt von einer GPS-Uhr. Welches Stratum hat er?',
      options: [
        { id: 'a', text: 'Stratum 1' },
        { id: 'b', text: 'Stratum 0', whyWrong: 'Stratum 0 ist die Referenzuhr selbst (GPS, Atomuhr).' },
        { id: 'c', text: 'Stratum 2', whyWrong: 'Stratum 2 holt die Zeit von einem Stratum-1-Server.' },
        { id: 'd', text: 'Stratum 16', whyWrong: '16 bedeutet „nicht synchronisiert“.' },
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
        { id: 'b', text: 'SNMPv2c, weil der Community-String verschlüsselt ist', whyWrong: 'Der Community-String geht bei v1/v2c im Klartext über das Netz.' },
        { id: 'c', text: 'SNMPv1, weil sie am schnellsten ist', whyWrong: 'v1 ist veraltet und unsicher.' },
        { id: 'd', text: 'Egal, alle Versionen sind gleich sicher', whyWrong: 'Nur v3 hat echte Benutzer, Authentifizierung und Verschlüsselung.' },
      ],
      correct: 'a',
      explanation: 'SNMPv3 mit Sicherheitsstufe authPriv: Benutzer-Authentifizierung und verschlüsselte Daten.',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Ein Switch soll einen Schnittstellenausfall sofort von sich aus an das Monitoring melden, ohne dass dieses fragt. Welche SNMP-Nachricht ist das?',
      options: [
        { id: 'a', text: 'Trap (oder Inform mit Bestätigung)' },
        { id: 'b', text: 'Get', whyWrong: 'Get ist eine Abfrage des Managers.' },
        { id: 'c', text: 'Set', whyWrong: 'Set ändert einen Wert auf dem Gerät.' },
        { id: 'd', text: 'Walk', whyWrong: 'Ein Walk liest viele Werte nacheinander vom Gerät ab, auf Anfrage des Managers.' },
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
          { id: 'b', text: 'Für einen Webserver braucht man PAT statt statischem NAT.', whyWrong: 'Statisches NAT ist genau richtig für einen Server, der von außen erreichbar sein soll.' },
          { id: 'c', text: 'Es fehlt eine Access-List.', whyWrong: 'Statisches NAT braucht keine ACL. Die ist nur für dynamisches NAT/PAT nötig.' },
          { id: 'd', text: 'Die öffentliche Adresse muss auf dem Server eingetragen werden.', whyWrong: 'Der Server behält seine private Adresse, der Router übersetzt.' },
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
          { id: 'b', text: 'Die VTY-Leitungen müssen 0 4 statt 0 15 heißen.', whyWrong: 'Beide Bereiche sind gültig, 0 15 schließt mehr Leitungen ein.' },
          { id: 'c', text: '`login local` verhindert SSH.', whyWrong: '`login local` ist für SSH sogar nötig.' },
          { id: 'd', text: 'SSH funktioniert nur mit TACACS+.', whyWrong: 'SSH funktioniert auch mit lokalen Benutzern.' },
        ],
        correct: 'a',
        explanation: 'Lösung: `ip domain-name …` (falls fehlend) und `crypto key generate rsa modulus 2048`, dann `ip ssh version 2`.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Eine Website wurde auf einen neuen Server umgezogen und der A-Eintrag geändert. Einige Nutzer landen nach einer Stunde noch beim alten Server. Was ist die wahrscheinlichste Erklärung?',
        options: [
          { id: 'a', text: 'Resolver und Clients nutzen noch die zwischengespeicherte alte Antwort, bis deren TTL abläuft.' },
          { id: 'b', text: 'Der MX-Eintrag zeigt auf den alten Server.', whyWrong: 'MX betrifft nur E-Mail, nicht den Webseitenaufruf.' },
          { id: 'c', text: 'DNS nutzt TCP statt UDP.', whyWrong: 'Das Transportprotokoll hat mit veralteten Antworten nichts zu tun.' },
          { id: 'd', text: 'Der PTR-Eintrag fehlt.', whyWrong: 'PTR dient der Rückwärtsauflösung und wird beim Aufruf der Seite nicht gebraucht.' },
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
          { id: 'd', text: 'TFTP statt SFTP für Konfigurationssicherungen', whyWrong: 'TFTP hat weder Anmeldung noch Verschlüsselung. SFTP/SCP sind sicherer.' },
          { id: 'e', text: 'SNMP-Community „public“ beibehalten', whyWrong: '„public“ ist der bekannteste Standardwert und wird als Erstes ausprobiert.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Verschlüsselte Protokolle (SSH, SNMPv3, SFTP), gehashte Passwörter und keine Standardwerte.',
      },
    ],
  },
};

export default level;
