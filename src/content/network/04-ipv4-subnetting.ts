import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-04',
  track: 'network',
  order: 4,
  title: 'IPv4 & Subnetting',
  titleEn: 'IPv4 Addressing, Subnetting, CIDR & VLSM',
  summary: 'IPv4-Adressaufbau, private und spezielle Bereiche, Subnetzmasken, CIDR und VLSM, mit Subnetting-Trainer (Zufallsaufgaben).',
  certs: ['ccna', 'netplus', 'az104', 'aws-saa'],
  domains: { ccna: '1', netplus: '1', az104: 'network' },
  lab: {
    title: 'Subnetting am eigenen Netz',
    needs: 'einen PC in deinem Heimnetz, Papier und Stift',
    steps: [
      '`ipconfig` (Windows) bzw. `ip addr` (Linux): Notiere deine IPv4-Adresse und Maske/Präfix.',
      'Berechne Netzadresse, Broadcast und Anzahl nutzbarer Hosts deines Heimnetzes, ohne Rechner.',
      'Prüfe: Liegt dein Default Gateway im selben Netz?',
      'Plane auf Papier: Teile dein Heimnetz in 4 gleich große Subnetze. Notiere Netz, Broadcast und Präfix je Subnetz.',
      'Kontrolliere deine Lösung im Trainer (🧰 Tools → Trainer → IPv4 Netzadresse).',
    ],
  },
  lesson: [
    {
      heading: 'Aufbau einer IPv4-Adresse',
      body: `Eine IPv4-Adresse hat **32 Bit**, geschrieben als 4 Oktette in Dezimal: \`192.168.10.25\`. Jedes Oktett hat 8 Bit, also 0–255.

Die **Subnetzmaske** trennt **Netzanteil** und **Hostanteil**. Einsen = Netz, Nullen = Host:

\`255.255.255.0\` = \`11111111.11111111.11111111.00000000\` = **/24** (CIDR-Schreibweise: Anzahl der Einsen).

Pro Netz gibt es zwei reservierte Adressen:
- **Netzadresse** (alle Host-Bits 0), z. B. \`192.168.10.0\`
- **Broadcast-Adresse** (alle Host-Bits 1), z. B. \`192.168.10.255\`

Nutzbare Hosts = **2^Hostbits − 2**. Bei /24: 2^8 − 2 = 254.`,
      analogy: 'IP-Adresse = Straße + Hausnummer. Die Subnetzmaske sagt, wie viel davon „Straße“ (Netz) und wie viel „Hausnummer“ (Host) ist. Der Port (später) ist die Wohnungsnummer im Haus.',
      terms: [
        { de: 'Subnetzmaske', en: 'subnet mask' },
        { de: 'Klassenlose Adressierung', en: 'Classless Inter-Domain Routing (CIDR)' },
        { de: 'Netzanteil / Hostanteil', en: 'network portion / host portion' },
      ],
    },
    {
      heading: 'Private und spezielle Adressen',
      sources: [{ title: 'RFC 1918 (private Adressen)', url: 'https://www.rfc-editor.org/rfc/rfc1918' }],
      body: `**Private Bereiche (RFC 1918)** – nicht im Internet geroutet, brauchen NAT:

| Bereich | CIDR |
|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 |

**Spezielle Adressen:**
- \`127.0.0.0/8\` – Loopback (\`127.0.0.1\` = das Gerät selbst)
- \`169.254.0.0/16\` – **APIPA / Link-Local**: Das Gerät hat keinen DHCP-Server erreicht.
- \`100.64.0.0/10\` – Carrier-Grade NAT (Provider-intern)
- \`0.0.0.0\` – „diese Adresse/unbekannt“; \`0.0.0.0/0\` = Default-Route
- \`255.255.255.255\` – Limited Broadcast
- \`224.0.0.0/4\` – Multicast (früher Klasse D)

Die **Adressklassen** A/B/C sind historisch (vor CIDR, 1993). Du solltest sie trotzdem kennen: A = 1–126 (/8), B = 128–191 (/16), C = 192–223 (/24).`,
      analogy: 'Private IPs sind wie Hausnummern auf einem Firmengelände: Drinnen eindeutig, aber von außen nicht adressierbar. Die Pforte (NAT-Router) leitet weiter.',
    },
    {
      heading: 'Subnetting mit der Blockgrößen-Methode',
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Wie groß ist die Blockgröße bei **/27**?',
        options: [
          { id: 'a', text: '32' },
          { id: 'b', text: '16', whyWrong: '16 ist die Blockgröße bei /28 (Maske 240).' },
          { id: 'c', text: '64', whyWrong: '64 ist die Blockgröße bei /26 (Maske 192).' },
        ],
        correct: 'a',
        explanation: '/27 → letztes Oktett der Maske 224 → 256 − 224 = 32.',
      },
      body: `Masken-Oktettwerte zum Auswendiglernen: **128, 192, 224, 240, 248, 252, 254, 255** (1 bis 8 Einsen).

**Beispiel:** \`172.16.45.200/20\`
1. /20 → Maske \`255.255.240.0\`. Das „interessante“ Oktett ist das 3. (Wert 240).
2. **Blockgröße** = 256 − 240 = **16**. Netze beginnen bei 0, 16, 32, 48 …
3. 45 liegt im Block **32–47**.
4. Netzadresse \`172.16.32.0\`, Broadcast \`172.16.47.255\`.
5. Hosts: \`172.16.32.1\` bis \`172.16.47.254\` → 2^12 − 2 = 4094.

**Wie viele Subnetze?** Leihst du dir n Bits vom Hostteil, entstehen **2^n Subnetze**. Aus einem /24 werden mit 3 geliehenen Bits 8 × /27 mit je 30 Hosts.

**Kleinstes passendes Netz für X Hosts:** kleinstes h mit 2^h − 2 ≥ X, Präfix = 32 − h.`,
    },
    {
      heading: 'Spickzettel',
      sources: [{ title: 'RFC 3021 (/31 auf Punkt-zu-Punkt-Links)', url: 'https://www.rfc-editor.org/rfc/rfc3021' }],
      body: `| Präfix | Maske | Blockgröße | Hosts |
|---|---|---|---|
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /29 | 255.255.255.248 | 8 | 6 |
| /30 | 255.255.255.252 | 4 | 2 |
| /31 | 255.255.255.254 | 2 | 2 (nur Punkt-zu-Punkt, RFC 3021) |
| /32 | 255.255.255.255 | 1 | 1 (Host-Route) |

**Cloud-Hinweis:** Azure reserviert pro Subnetz **5** Adressen (Netz, Broadcast und 3 für Azure-Dienste), AWS ebenfalls **5** pro Subnetz. Ein /28 hat dort also nur 11 nutzbare Adressen.`,
    },
    {
      heading: 'VLSM und Zusammenfassung',
      body: `**VLSM** (Variable Length Subnet Masking) heißt: Subnetze unterschiedlicher Größe aus einem Block. Regel: **größtes Netz zuerst** vergeben, damit die Blöcke sauber auf ihren Grenzen liegen.

Beispiel \`192.168.10.0/24\`, Bedarf: 100, 50, 20 Hosts und ein Router-Link mit 2 Hosts:
- 100 Hosts → /25 → \`192.168.10.0/25\` (.0–.127)
- 50 Hosts → /26 → \`192.168.10.128/26\` (.128–.191)
- 20 Hosts → /27 → \`192.168.10.192/27\` (.192–.223)
- 2 Hosts → /30 → \`192.168.10.224/30\` (.224–.227)

**Route Summarization (Supernetting):** Mehrere zusammenhängende Netze als ein Präfix ankündigen. \`10.1.0.0/24\` bis \`10.1.3.0/24\` sind 4 Netze = 2 Bit → \`10.1.0.0/22\`.`,
      terms: [{ de: 'Routen-Zusammenfassung', en: 'route summarization / aggregation' }],
    },
  ],
  quiz: [
    { id: 's1', type: 'subnet', task: 'mask', prefixRange: [17, 30], difficulty: 1 },
    { id: 's2', type: 'subnet', task: 'hosts', prefixRange: [20, 30], difficulty: 1 },
    { id: 's3', type: 'subnet', task: 'network', prefixRange: [24, 30], difficulty: 2 },
    { id: 's4', type: 'subnet', task: 'broadcast', prefixRange: [24, 30], difficulty: 2 },
    { id: 's5', type: 'subnet', task: 'network', prefixRange: [16, 23], difficulty: 2 },
    { id: 's6', type: 'subnet', task: 'range', prefixRange: [25, 29], difficulty: 2 },
    { id: 's7', type: 'subnet', task: 'prefixForHosts', prefixRange: [22, 30], difficulty: 2 },
    {
      id: 'q1', type: 'multi', difficulty: 1,
      prompt: 'Welche Adressen sind **private** Adressen nach RFC 1918?',
      options: [
        { id: 'a', text: '10.200.1.1' },
        { id: 'b', text: '172.20.0.5' },
        { id: 'c', text: '192.168.100.1' },
        { id: 'd', text: '172.32.0.1', whyWrong: 'Der private 172er-Bereich ist 172.16.0.0/12, also nur 172.16.x.x bis 172.31.x.x. 172.32 ist öffentlich.' },
        { id: 'e', text: '169.254.1.1', whyWrong: '169.254.0.0/16 ist Link-Local (APIPA), nicht RFC 1918.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'RFC 1918: 10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), 192.168.0.0/16.',
    },
    {
      id: 'q2', type: 'scenario', difficulty: 1,
      scenario: 'Ein Windows-PC hat die Adresse **169.254.37.12** und kann weder Internet noch Server erreichen.',
      prompt: 'Was ist die wahrscheinlichste Ursache?',
      options: [
        { id: 'a', text: 'Der PC hat keinen DHCP-Server erreicht.' },
        { id: 'b', text: 'Der DNS-Server ist ausgefallen.', whyWrong: 'DNS-Probleme ändern die IP-Adresse nicht. 169.254.x.x zeigt ein DHCP-Problem.' },
        { id: 'c', text: 'Die Firewall blockiert ICMP.', whyWrong: 'Firewall-Regeln führen nicht zu einer APIPA-Adresse.' },
        { id: 'd', text: 'Der PC hat eine statische IP.', whyWrong: '169.254.x.x vergibt sich das OS selbst, wenn DHCP fehlschlägt.' },
      ],
      correct: 'a',
      explanation: 'APIPA (Automatic Private IP Addressing): Ohne DHCP-Antwort vergibt sich das OS selbst eine Adresse aus 169.254.0.0/16. Prüfe Kabel/WLAN, VLAN, DHCP-Server und DHCP-Relay.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Du teilst `192.168.1.0/24` in Subnetze mit **/27**. Wie viele Subnetze erhältst du, und wie viele Hosts hat jedes?',
      options: [
        { id: 'a', text: '8 Subnetze à 30 Hosts' },
        { id: 'b', text: '8 Subnetze à 32 Hosts', whyWrong: '32 sind die Adressen pro Block. Netz- und Broadcast-Adresse abgezogen bleiben 30 nutzbare.' },
        { id: 'c', text: '4 Subnetze à 62 Hosts', whyWrong: 'Das wäre /26 (2 geliehene Bits).' },
        { id: 'd', text: '16 Subnetze à 14 Hosts', whyWrong: 'Das wäre /28 (4 geliehene Bits).' },
      ],
      correct: 'a',
      explanation: '/24 → /27 = 3 geliehene Bits → 2³ = 8 Subnetze. Hostbits 5 → 2⁵ − 2 = 30.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Liegen `192.168.1.130/26` und `192.168.1.190/26` im **selben Subnetz**?',
      options: [
        { id: 'a', text: 'Ja, beide im Netz 192.168.1.128/26' },
        { id: 'b', text: 'Nein, .130 liegt in .128/26 und .190 in .192/26', whyWrong: '.192 ist bereits der nächste Block. .190 liegt noch im Block .128–.191.' },
        { id: 'c', text: 'Nein, weil die Adressen unterschiedlich sind', whyWrong: 'Hosts im selben Netz haben immer unterschiedliche Adressen. Entscheidend ist der Netzanteil.' },
        { id: 'd', text: 'Kann man ohne Gateway nicht sagen', whyWrong: 'Adresse und Maske reichen zur Bestimmung des Netzes.' },
      ],
      correct: 'a',
      explanation: '/26 → Blockgröße 64: 0, 64, 128, 192. Beide (130 und 190) liegen in 128–191.',
    },
    {
      id: 'q5', type: 'single', difficulty: 3,
      prompt: 'Ist `172.20.5.255/16` eine gültige **Host-Adresse**?',
      options: [
        { id: 'a', text: 'Ja – Netz ist 172.20.0.0, Broadcast 172.20.255.255' },
        { id: 'b', text: 'Nein, Adressen mit .255 am Ende sind immer Broadcasts', whyWrong: 'Das gilt nur bei /24. Bei /16 ist erst 172.20.255.255 der Broadcast.' },
        { id: 'c', text: 'Nein, 172.20 ist kein gültiger Bereich', whyWrong: '172.20 liegt im privaten Bereich 172.16.0.0/12.' },
        { id: 'd', text: 'Nur mit /24', whyWrong: 'Mit /24 wäre es gerade der Broadcast und damit ungültig.' },
      ],
      correct: 'a',
      explanation: 'Bei /16 umfasst der Hostteil zwei Oktette. Nur 172.20.0.0 und 172.20.255.255 sind reserviert, `.5.255` ist ein normaler Host.',
    },
    {
      id: 'q6', type: 'single', difficulty: 3,
      prompt: 'VLSM aus `192.168.10.0/24`: Vergeben werden zuerst 100 Hosts (/25), dann 50 Hosts (/26). Welches Netz bekommt danach ein LAN mit **20 Hosts**?',
      options: [
        { id: 'a', text: '192.168.10.192/27' },
        { id: 'b', text: '192.168.10.128/27', whyWrong: '.128–.191 ist bereits durch das /26 für 50 Hosts belegt.' },
        { id: 'c', text: '192.168.10.192/28', whyWrong: 'Ein /28 hat nur 14 Hosts – zu wenig für 20.' },
        { id: 'd', text: '192.168.10.200/27', whyWrong: '.200 liegt nicht auf einer /27-Grenze (Vielfache von 32).' },
      ],
      correct: 'a',
      explanation: '/25 = .0–.127, /26 = .128–.191. Nächster freier Block .192. 20 Hosts → /27 (30 Hosts) → 192.168.10.192/27.',
    },
    {
      id: 'q7', type: 'single', difficulty: 3,
      prompt: 'Welche **Zusammenfassung** fasst `10.1.0.0/24`, `10.1.1.0/24`, `10.1.2.0/24` und `10.1.3.0/24` exakt zusammen?',
      options: [
        { id: 'a', text: '10.1.0.0/22' },
        { id: 'b', text: '10.1.0.0/16', whyWrong: '/16 würde 256 Netze umfassen, viel mehr als die vier.' },
        { id: 'c', text: '10.1.0.0/23', whyWrong: '/23 fasst nur 2 /24-Netze zusammen (10.1.0 und 10.1.1).' },
        { id: 'd', text: '10.1.0.0/21', whyWrong: '/21 umfasst 8 /24-Netze (10.1.0–10.1.7).' },
      ],
      correct: 'a',
      explanation: '4 Netze = 2² → 2 Bits weniger als /24 → /22. Das 3. Oktett 0–3 hat die oberen 6 Bits gemeinsam.',
    },
    {
      id: 'q8', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Adressen der passenden Kategorie zu.',
      items: [
        { id: 'i1', text: '10.5.5.5' },
        { id: 'i2', text: '8.8.8.8' },
        { id: 'i3', text: '127.0.0.1' },
        { id: 'i4', text: '192.168.0.1' },
        { id: 'i5', text: '172.32.1.1' },
        { id: 'i6', text: '169.254.10.10' },
      ],
      buckets: [
        { id: 'priv', label: 'Privat (RFC 1918)' },
        { id: 'pub', label: 'Öffentlich' },
        { id: 'spec', label: 'Spezial (Loopback/Link-Local)' },
      ],
      solution: { i1: 'priv', i4: 'priv', i2: 'pub', i5: 'pub', i3: 'spec', i6: 'spec' },
      explanation: '172.32.1.1 ist die Falle: Der private Bereich endet bei 172.31.255.255. 127.0.0.1 = Loopback, 169.254.x.x = Link-Local/APIPA.',
    },
    {
      id: 'q9', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Weise dem Router-Interface die Adresse **192.168.1.1/24** zu.',
      template: 'R1(config-if)# {{0}} 192.168.1.1 {{1}}',
      blanks: [{ accept: ['ip address', 'ip add', 'ip addr'] }, { accept: ['255.255.255.0'] }],
      explanation: 'Cisco IOS erwartet die Maske in Dezimalschreibweise, nicht als /24. Danach `no shutdown` nicht vergessen.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Wie viele nutzbare Adressen hat ein **/31** auf einer Punkt-zu-Punkt-Verbindung zwischen zwei Routern?',
      options: [
        { id: 'a', text: '2 (RFC 3021 – keine Netz-/Broadcast-Adresse nötig)' },
        { id: 'b', text: '0', whyWrong: 'Nach der klassischen Formel 2¹ − 2 = 0, aber RFC 3021 erlaubt beide Adressen auf Punkt-zu-Punkt-Links.' },
        { id: 'c', text: '1', whyWrong: '1 Adresse hat ein /32.' },
        { id: 'd', text: '4', whyWrong: '4 Adressen (2 nutzbar) hat ein /30.' },
      ],
      correct: 'a',
      explanation: 'Auf einem Link mit genau zwei Teilnehmern braucht man keinen Broadcast. /31 spart gegenüber /30 die Hälfte der Adressen. Cisco unterstützt das.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Wie viele nutzbare Adressen hat ein **/28-Subnetz in Azure oder AWS**?',
      options: [
        { id: 'a', text: '11' },
        { id: 'b', text: '14', whyWrong: '14 gilt im klassischen Netz. Azure und AWS reservieren aber 5 statt 2 Adressen pro Subnetz.' },
        { id: 'c', text: '16', whyWrong: '16 ist die Gesamtzahl der Adressen im Block.' },
        { id: 'd', text: '13', whyWrong: 'Es werden 5 Adressen reserviert, nicht 3.' },
      ],
      correct: 'a',
      explanation: '16 − 5 = 11. Reserviert sind: Netzadresse, die ersten 3 Host-Adressen (Gateway/DNS/Reserve) und die letzte Adresse.',
    },
    {
      id: 'q12', type: 'single', difficulty: 1,
      prompt: 'Welche Präfixlänge entspricht der Maske **255.255.255.192**?',
      options: [
        { id: 'a', text: '/26' },
        { id: 'b', text: '/25', whyWrong: '/25 = 255.255.255.128.' },
        { id: 'c', text: '/27', whyWrong: '/27 = 255.255.255.224.' },
        { id: 'd', text: '/28', whyWrong: '/28 = 255.255.255.240.' },
      ],
      correct: 'a',
      explanation: '192 = 11000000 → 2 Einsen im 4. Oktett. 24 + 2 = /26.',
    },
    { id: 'g1', type: 'generated', generator: 'vlsm', difficulty: 3 },
  ],
  boss: {
    hearts: 3,
    questions: [
      { id: 'bs1', type: 'subnet', task: 'range', prefixRange: [17, 28], difficulty: 3 },
      { id: 'bs2', type: 'subnet', task: 'broadcast', prefixRange: [16, 22], difficulty: 3 },
      { id: 'bs3', type: 'subnet', task: 'prefixForHosts', prefixRange: [19, 29], difficulty: 3 },
      { id: 'bs4', type: 'subnet', task: 'network', prefixRange: [18, 29], difficulty: 3 },
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        scenario: 'PC A: `10.10.10.50/25`, Gateway `10.10.10.1`. PC B: `10.10.10.140/25`, Gateway `10.10.10.129`. Beide hängen am selben Switch im selben VLAN, es gibt keinen Router.',
        prompt: 'Können A und B miteinander kommunizieren?',
        options: [
          { id: 'a', text: 'Nein – sie liegen in verschiedenen Subnetzen (.0/25 und .128/25) und brauchen einen Router.' },
          { id: 'b', text: 'Ja, gleicher Switch und gleiches VLAN reicht.', whyWrong: 'Die Hosts prüfen per Maske, ob das Ziel lokal ist. A hält B für entfernt und schickt an sein Gateway, das es nicht gibt.' },
          { id: 'c', text: 'Ja, weil beide mit 10.10.10 beginnen.', whyWrong: 'Bei /25 gehört auch das 1. Bit des 4. Oktetts zum Netz: 50 → .0/25, 140 → .128/25.' },
          { id: 'd', text: 'Nur per IPv6.', whyWrong: 'Die Frage betrifft IPv4. Das Problem ist die Subnetz-Trennung.' },
        ],
        correct: 'a',
        explanation: 'A berechnet: 10.10.10.140 liegt nicht in 10.10.10.0/25 → an das Gateway 10.10.10.1 senden. Ohne Router geht das ins Leere.',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Du brauchst aus `172.16.0.0/16` **genau 60 gleich große Subnetze** und willst pro Subnetz möglichst viele Hosts. Welches Präfix wählst du?',
        options: [
          { id: 'a', text: '/22 (64 Subnetze, je 1022 Hosts)' },
          { id: 'b', text: '/21', whyWrong: '/21 = 5 geliehene Bits = nur 32 Subnetze.' },
          { id: 'c', text: '/23', whyWrong: '/23 ergibt 128 Subnetze. Das reicht, aber die Netze sind kleiner als nötig.' },
          { id: 'd', text: '/24', whyWrong: '/24 ergibt 256 kleine Subnetze, mehr als nötig.' },
        ],
        correct: 'a',
        explanation: '2^n ≥ 60 → n = 6 Bits. 16 + 6 = /22. Hostbits 10 → 2¹⁰ − 2 = 1022.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Welche Zusammenfassung deckt `192.168.8.0/24` bis `192.168.15.0/24` exakt ab?',
        options: [
          { id: 'a', text: '192.168.8.0/21' },
          { id: 'b', text: '192.168.8.0/22', whyWrong: '/22 deckt nur 8–11 ab.' },
          { id: 'c', text: '192.168.0.0/20', whyWrong: '/20 umfasst 192.168.0–15, also auch 0–7.' },
          { id: 'd', text: '192.168.8.0/20', whyWrong: '/20-Netze beginnen bei Vielfachen von 16 im 3. Oktett. 192.168.8.0/20 ist keine gültige Netzadresse.' },
        ],
        correct: 'a',
        explanation: '8 Netze (8–15) = 2³ → /24 − 3 = /21. 8 ist ein Vielfaches von 8, also eine gültige /21-Grenze.',
      },
      { id: 'bg1', type: 'generated', generator: 'vlsm', difficulty: 3 },
    ],
  },
};

export default level;
