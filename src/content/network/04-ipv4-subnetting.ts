import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-04',
  track: 'network',
  order: 4,
  title: 'IPv4 & Subnetting',
  titleEn: 'IPv4 Addressing, Subnetting, CIDR & VLSM',
  summary: 'IPv4-Adressaufbau, private und spezielle Bereiche, Subnetzmasken, CIDR und VLSM, mit Subnetting-Trainer (Zufallsaufgaben).',
  certs: ['ccna', 'netplus', 'az104', 'aws-saa', 'fisi'],
  domains: { ccna: '1', netplus: '1', az104: 'network', fisi: 'ap2-admin' },
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
          { id: 'b', text: '16', whyWrong: '16 ist die Blockgröße bei /28. Die Rechnung: Im letzten Oktett bleiben bei /27 noch 32 − 27 = 5 Hostbits, und 2⁵ = 32. Bei /28 sind es nur 4 Hostbits, also 2⁴ = 16. Alternativ: 256 − Maskenwert. /27 hat die Maske 224, 256 − 224 = 32.' },
          { id: 'c', text: '64', whyWrong: '64 ist die Blockgröße bei /26 (Maske 192, 256 − 192 = 64). Bei /27 ist ein Bit mehr fürs Netz reserviert, darum halbiert sich der Block: 2⁵ = 32, Maske 224, 256 − 224 = 32.' },
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
        { id: 'd', text: '172.32.0.1', whyWrong: 'Der private 172er-Bereich ist 172.16.0.0/12. Das /12 umfasst im zweiten Oktett genau 16 Werte: 172.16 bis 172.31. 172.32.0.1 liegt knapp außerhalb und ist eine öffentliche Adresse. Ein beliebter Prüfungsfehler, weil 172.32 so nah dran aussieht.' },
        { id: 'e', text: '169.254.1.1', whyWrong: '169.254.0.0/16 ist der Link-Local-Bereich (APIPA). Ein PC gibt sich so eine Adresse selbst, wenn er keinen DHCP-Server erreicht. Sie ist auch nicht öffentlich, gehört aber nicht zu RFC 1918. RFC 1918 umfasst nur 10.0.0.0/8, 172.16.0.0/12 und 192.168.0.0/16.' },
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
        { id: 'b', text: 'Der DNS-Server ist ausgefallen.', whyWrong: 'Ein ausgefallener DNS-Server verhindert nur, dass Namen in IP-Adressen übersetzt werden. Die eigene IP-Adresse des PCs ändert er nicht. Eine Adresse aus 169.254.x.x vergibt sich Windows selbst, wenn keine Antwort vom DHCP-Server kommt.' },
        { id: 'c', text: 'Die Firewall blockiert ICMP.', whyWrong: 'Eine Firewall, die ICMP blockiert, lässt Pings scheitern. Mit der Vergabe der eigenen IP-Adresse hat das nichts zu tun. Die APIPA-Adresse 169.254.x.x entsteht nur, wenn der PC per DHCP keine Adresse bekommt.' },
        { id: 'd', text: 'Der PC hat eine statische IP.', whyWrong: 'Bei einer statischen IP trägt man die Adresse von Hand ein, und der PC behält sie. Eine Adresse aus 169.254.x.x gibt sich das Betriebssystem dagegen selbst, wenn DHCP eingeschaltet ist, aber kein Server antwortet. Das spricht gerade für DHCP, nicht für eine statische Adresse.' },
      ],
      correct: 'a',
      explanation: 'APIPA (Automatic Private IP Addressing): Ohne DHCP-Antwort vergibt sich das OS selbst eine Adresse aus 169.254.0.0/16. Prüfe Kabel/WLAN, VLAN, DHCP-Server und DHCP-Relay.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Du teilst `192.168.1.0/24` in Subnetze mit **/27**. Wie viele Subnetze erhältst du, und wie viele Hosts hat jedes?',
      options: [
        { id: 'a', text: '8 Subnetze à 30 Hosts' },
        { id: 'b', text: '8 Subnetze à 32 Hosts', whyWrong: '32 ist die Zahl aller Adressen pro /27-Block. Davon sind zwei nicht für Hosts nutzbar: die erste ist die Netzadresse, die letzte die Broadcast-Adresse. Es bleiben 32 − 2 = 30 Hosts. Die 8 Subnetze stimmen: 3 geliehene Bits, 2³ = 8.' },
        { id: 'c', text: '4 Subnetze à 62 Hosts', whyWrong: '4 Subnetze à 62 Hosts wäre /26: nur 2 Bits geliehen (2² = 4), 6 Hostbits (2⁶ − 2 = 62). Bei /27 werden von /24 aus 3 Bits geliehen. Das ergibt 2³ = 8 Subnetze mit je 2⁵ − 2 = 30 Hosts.' },
        { id: 'd', text: '16 Subnetze à 14 Hosts', whyWrong: '16 Subnetze à 14 Hosts wäre /28: 4 Bits geliehen (2⁴ = 16), 4 Hostbits (2⁴ − 2 = 14). /27 leiht 3 Bits: 8 Subnetze, je 30 Hosts.' },
      ],
      correct: 'a',
      explanation: '/24 → /27 = 3 geliehene Bits → 2³ = 8 Subnetze. Hostbits 5 → 2⁵ − 2 = 30.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Liegen `192.168.1.130/26` und `192.168.1.190/26` im **selben Subnetz**?',
      options: [
        { id: 'a', text: 'Ja, beide im Netz 192.168.1.128/26' },
        { id: 'b', text: 'Nein, .130 liegt in .128/26 und .190 in .192/26', whyWrong: 'Bei /26 ist die Blockgröße 64. Die Blöcke beginnen bei .0, .64, .128 und .192. .190 liegt noch im Block .128 bis .191, denn .192 ist erst die erste Adresse des nächsten Blocks. Beide Adressen sind also im Netz 192.168.1.128/26.' },
        { id: 'c', text: 'Nein, weil die Adressen unterschiedlich sind', whyWrong: 'Hosts im selben Netz haben immer unterschiedliche Adressen, sonst gäbe es einen Konflikt. Entscheidend ist nur der Netzanteil, also das Ergebnis von Adresse UND Maske. Bei /26 ergibt das für .130 und .190 beide Male .128.' },
        { id: 'd', text: 'Kann man ohne Gateway nicht sagen', whyWrong: 'Für die Frage, ob zwei Adressen im selben Netz liegen, reichen Adresse und Maske. Das Gateway spielt keine Rolle: Es ist nur der Ausgang in andere Netze. Rechnung: Blockgröße 64, beide Adressen liegen zwischen .128 und .191.' },
      ],
      correct: 'a',
      explanation: '/26 → Blockgröße 64: 0, 64, 128, 192. Beide (130 und 190) liegen in 128–191.',
    },
    {
      id: 'q5', type: 'single', difficulty: 3,
      prompt: 'Ist `172.20.5.255/16` eine gültige **Host-Adresse**?',
      options: [
        { id: 'a', text: 'Ja – Netz ist 172.20.0.0, Broadcast 172.20.255.255' },
        { id: 'b', text: 'Nein, Adressen mit .255 am Ende sind immer Broadcasts', whyWrong: 'Das stimmt nur bei /24, wo das letzte Oktett allein der Hostteil ist. Bei /16 umfasst der Hostteil die letzten zwei Oktette. Der Broadcast ist dann 172.20.255.255, und 172.20.5.255 ist ein ganz normaler Host mitten im Netz.' },
        { id: 'c', text: 'Nein, 172.20 ist kein gültiger Bereich', whyWrong: '172.20 liegt im privaten Bereich 172.16.0.0/12, der von 172.16 bis 172.31 reicht. Die Adresse ist also gültig und privat. Mit /16 ist das Netz 172.20.0.0 bis 172.20.255.255, und .5.255 liegt mitten darin.' },
        { id: 'd', text: 'Nur mit /24', whyWrong: 'Genau umgekehrt: Mit /24 wäre 172.20.5.255 die Broadcast-Adresse des Netzes 172.20.5.0/24 und damit kein gültiger Host. Erst bei /16 ist sie ein normaler Host.' },
      ],
      correct: 'a',
      explanation: 'Bei /16 umfasst der Hostteil zwei Oktette. Nur 172.20.0.0 und 172.20.255.255 sind reserviert, `.5.255` ist ein normaler Host.',
    },
    {
      id: 'q6', type: 'single', difficulty: 3,
      prompt: 'VLSM aus `192.168.10.0/24`: Vergeben werden zuerst 100 Hosts (/25), dann 50 Hosts (/26). Welches Netz bekommt danach ein LAN mit **20 Hosts**?',
      options: [
        { id: 'a', text: '192.168.10.192/27' },
        { id: 'b', text: '192.168.10.128/27', whyWrong: 'Das /25 für 100 Hosts belegt .0 bis .127. Das /26 für 50 Hosts belegt den nächsten freien Block .128 bis .191. 192.168.10.128/27 würde in diesem /26 liegen und sich überschneiden. Der erste freie Platz ist .192.' },
        { id: 'c', text: '192.168.10.192/28', whyWrong: 'Ein /28 hat nur 16 Adressen, also 14 nutzbare Hosts. Für 20 Hosts reicht das nicht. Man braucht ein /27 mit 32 Adressen und 30 Hosts. Der erste freie /27-Block ist 192.168.10.192/27.' },
        { id: 'd', text: '192.168.10.200/27', whyWrong: '/27-Netze beginnen immer bei Vielfachen von 32: .0, .32, .64, … .192, .224. .200 ist kein Vielfaches von 32 und damit keine gültige Netzadresse für ein /27. Es liegt mitten im Block .192 bis .223.' },
      ],
      correct: 'a',
      explanation: '/25 = .0–.127, /26 = .128–.191. Nächster freier Block .192. 20 Hosts → /27 (30 Hosts) → 192.168.10.192/27.',
    },
    {
      id: 'q7', type: 'single', difficulty: 3,
      prompt: 'Welche **Zusammenfassung** fasst `10.1.0.0/24`, `10.1.1.0/24`, `10.1.2.0/24` und `10.1.3.0/24` exakt zusammen?',
      options: [
        { id: 'a', text: '10.1.0.0/22' },
        { id: 'b', text: '10.1.0.0/16', whyWrong: '/16 würde 10.1.0.0 bis 10.1.255.255 umfassen, also 256 /24-Netze. Die Zusammenfassung wäre viel zu groß und würde auch Netze ankündigen, die es hier nicht gibt. Für genau 4 Netze werden 2 Bits gebraucht: /24 − 2 = /22.' },
        { id: 'c', text: '10.1.0.0/23', whyWrong: '/23 fasst nur 2 /24-Netze zusammen: 10.1.0.0 und 10.1.1.0. 10.1.2.0 und 10.1.3.0 wären nicht abgedeckt. Für 4 Netze braucht man ein Bit weniger: /22.' },
        { id: 'd', text: '10.1.0.0/21', whyWrong: '/21 umfasst 8 /24-Netze, 10.1.0.0 bis 10.1.7.0. Das ist doppelt so viel wie nötig, nicht exakt. Für genau 4 Netze (2²) ist /22 richtig.' },
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
        { id: 'b', text: '0', whyWrong: 'Nach der klassischen Formel 2ⁿ − 2 hätte ein /31 null Hosts, weil Netz- und Broadcast-Adresse abgezogen werden. Auf einer Punkt-zu-Punkt-Leitung gibt es aber nur zwei Teilnehmer, und einen Broadcast braucht man nicht. RFC 3021 erlaubt darum, beide Adressen zu nutzen.' },
        { id: 'c', text: '1', whyWrong: 'Eine einzelne Adresse hat ein /32. Das nutzt man für Loopback-Interfaces oder Host-Routen. Ein /31 hat 2 Adressen, und nach RFC 3021 sind beide auf Punkt-zu-Punkt-Links nutzbar.' },
        { id: 'd', text: '4', whyWrong: '4 Adressen hat ein /30, davon sind 2 nutzbar. Das war lange der Standard für Router-zu-Router-Links. Ein /31 spart Adressen: Es hat nur 2, und beide sind nutzbar.' },
      ],
      correct: 'a',
      explanation: 'Auf einem Link mit genau zwei Teilnehmern braucht man keinen Broadcast. /31 spart gegenüber /30 die Hälfte der Adressen. Cisco unterstützt das.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Wie viele nutzbare Adressen hat ein **/28-Subnetz in Azure oder AWS**?',
      options: [
        { id: 'a', text: '11' },
        { id: 'b', text: '14', whyWrong: '14 gilt im klassischen Netz (16 − Netz − Broadcast). Azure und AWS reservieren aber 5 Adressen pro Subnetz: Netzadresse, die ersten drei Host-Adressen (Gateway, DNS, Reserve) und die letzte Adresse. 16 − 5 = 11.' },
        { id: 'c', text: '16', whyWrong: '16 ist die Gesamtzahl der Adressen in einem /28-Block. Davon kann man nie alle nutzen. In Azure und AWS gehen 5 für Netz, Gateway, DNS, Reserve und Broadcast weg. Es bleiben 11.' },
        { id: 'd', text: '13', whyWrong: 'Es werden 5 Adressen reserviert, nicht 3. Neben den drei Plattform-Adressen (.1 Gateway, .2 DNS, .3 Reserve) fallen auch Netzadresse und letzte Adresse weg. 16 − 5 = 11.' },
      ],
      correct: 'a',
      explanation: '16 − 5 = 11. Reserviert sind: Netzadresse, die ersten 3 Host-Adressen (Gateway/DNS/Reserve) und die letzte Adresse.',
    },
    {
      id: 'q12', type: 'single', difficulty: 1,
      prompt: 'Welche Präfixlänge entspricht der Maske **255.255.255.192**?',
      options: [
        { id: 'a', text: '/26' },
        { id: 'b', text: '/25', whyWrong: '/25 ergibt 255.255.255.128: Im letzten Oktett ist nur das erste Bit gesetzt (128). Bei 192 sind die ersten zwei Bits gesetzt (128 + 64). 24 + 2 = /26.' },
        { id: 'c', text: '/27', whyWrong: '/27 ergibt 255.255.255.224: drei Bits im letzten Oktett (128 + 64 + 32). 192 hat nur zwei gesetzte Bits, also /26.' },
        { id: 'd', text: '/28', whyWrong: '/28 ergibt 255.255.255.240: vier Bits (128 + 64 + 32 + 16). 192 = 128 + 64 hat nur zwei, also 24 + 2 = /26.' },
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
          { id: 'b', text: 'Ja, gleicher Switch und gleiches VLAN reicht.', whyWrong: 'Gleicher Switch und gleiches VLAN reichen nicht. Jeder Host prüft mit seiner Maske, ob das Ziel im eigenen Netz liegt. A (.50/25) liegt in .0 bis .127 und hält .140 für ein fremdes Netz. Darum schickt A an sein Gateway statt direkt per ARP, und ohne Router dazwischen kommt nichts an.' },
          { id: 'c', text: 'Ja, weil beide mit 10.10.10 beginnen.', whyWrong: 'Die ersten drei Oktette gleich zu haben reicht bei /25 nicht. /25 nimmt auch das erste Bit des vierten Oktetts zum Netzanteil. 50 ist kleiner als 128 und liegt in .0/25, 140 liegt in .128/25. Das sind zwei verschiedene Netze.' },
          { id: 'd', text: 'Nur per IPv6.', whyWrong: 'IPv6 hat mit dieser Frage nichts zu tun. Das Problem ist die IPv4-Subnetz-Trennung: Die beiden Hosts liegen in unterschiedlichen /25-Netzen. Lösen lässt sich das mit einem Router oder einer gemeinsamen Maske (z. B. /24).' },
        ],
        correct: 'a',
        explanation: 'A berechnet: 10.10.10.140 liegt nicht in 10.10.10.0/25 → an das Gateway 10.10.10.1 senden. Ohne Router geht das ins Leere.',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Du brauchst aus `172.16.0.0/16` **genau 60 gleich große Subnetze** und willst pro Subnetz möglichst viele Hosts. Welches Präfix wählst du?',
        options: [
          { id: 'a', text: '/22 (64 Subnetze, je 1022 Hosts)' },
          { id: 'b', text: '/21', whyWrong: '/21 leiht von /16 nur 5 Bits: 2⁵ = 32 Subnetze. Das reicht für 60 nicht. Man braucht 6 Bits (2⁶ = 64 ≥ 60), also /22.' },
          { id: 'c', text: '/23', whyWrong: '/23 liefert 128 Subnetze. Die 60 passen zwar hinein, aber jedes Netz hat nur 510 Hosts. Gefragt sind möglichst viele Hosts pro Subnetz, also so wenige Bits leihen wie nötig. Das ist /22 mit 64 Subnetzen und je 1022 Hosts.' },
          { id: 'd', text: '/24', whyWrong: '/24 liefert 256 Subnetze mit je 254 Hosts. Das sind viel mehr Netze als nötig, und jedes ist unnötig klein. Mit /22 reichen die Netze (64) und jedes hat 1022 Hosts.' },
        ],
        correct: 'a',
        explanation: '2^n ≥ 60 → n = 6 Bits. 16 + 6 = /22. Hostbits 10 → 2¹⁰ − 2 = 1022.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Welche Zusammenfassung deckt `192.168.8.0/24` bis `192.168.15.0/24` exakt ab?',
        options: [
          { id: 'a', text: '192.168.8.0/21' },
          { id: 'b', text: '192.168.8.0/22', whyWrong: '/22 umfasst nur 4 /24-Netze: 192.168.8 bis 192.168.11. Die Netze 12 bis 15 fehlen. Für 8 Netze (8 bis 15) braucht man /21.' },
          { id: 'c', text: '192.168.0.0/20', whyWrong: '/20 umfasst 16 /24-Netze, von 192.168.0 bis 192.168.15. Das schließt auch 0 bis 7 ein, die nicht dazugehören. Die Zusammenfassung wäre zu groß. /21 ab 192.168.8.0 deckt genau 8 bis 15 ab.' },
          { id: 'd', text: '192.168.8.0/20', whyWrong: '/20-Netze beginnen im dritten Oktett bei Vielfachen von 16: 0, 16, 32 … 8 ist kein Vielfaches von 16. 192.168.8.0/20 ist also keine gültige Netzadresse, das Netz wäre 192.168.0.0/20. Richtig ist 192.168.8.0/21, weil 8 ein Vielfaches von 8 ist.' },
        ],
        correct: 'a',
        explanation: '8 Netze (8–15) = 2³ → /24 − 3 = /21. 8 ist ein Vielfaches von 8, also eine gültige /21-Grenze.',
      },
      { id: 'bg1', type: 'generated', generator: 'vlsm', difficulty: 3 },
    ],
  },
};

export default level;
