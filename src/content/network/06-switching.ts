import type { Level } from '../../types/content';

const level: Level = {
  id: 'net-06',
  track: 'network',
  order: 6,
  title: 'Switching',
  titleEn: 'VLANs, 802.1Q Trunking, STP/RSTP, EtherChannel',
  summary: 'VLANs und Access-Ports, Trunks mit 802.1Q und Native VLAN, DTP, Spanning Tree (Root Bridge, Port-Rollen, RSTP, PortFast, BPDU Guard) und EtherChannel mit LACP.',
  certs: ['ccna', 'netplus'],
  domains: { ccna: '2', netplus: '2' },
  lab: {
    title: 'VLANs, Trunk und STP in Packet Tracer',
    needs: 'Cisco Packet Tracer (kostenlos über die Cisco Networking Academy)',
    steps: [
      'Baue 2 Switches (z. B. 2960) und 4 PCs auf. PC1/PC2 an SW1, PC3/PC4 an SW2. Vergib IPs: PC1 und PC3 in 192.168.10.0/24, PC2 und PC4 in 192.168.20.0/24.',
      'Lege auf beiden Switches `vlan 10` und `vlan 20` an und konfiguriere die PC-Ports als Access-Ports im passenden VLAN.',
      'Verbinde die Switches und konfiguriere den Link als Trunk (`switchport mode trunk`). Prüfe mit `show interfaces trunk`.',
      'Teste: PC1 → PC3 klappt (gleiches VLAN), PC1 → PC2 nicht (kein Router).',
      'Füge ein zweites Kabel zwischen den Switches hinzu und beobachte mit `show spanning-tree`, welcher Port blockiert.',
      'Bündle beide Links mit `channel-group 1 mode active` und prüfe `show etherchannel summary`.',
    ],
  },
  lesson: [
    {
      heading: 'VLANs – Virtuelle LANs',
      body: `Ein **VLAN** teilt einen physischen Switch in mehrere logische Switches. Jedes VLAN ist eine eigene **Broadcast-Domäne** und meist ein eigenes IP-Subnetz.

Vorteile:
- weniger Broadcast-Last pro Segment
- **Sicherheit/Trennung:** Gäste, Mitarbeiter, Server, Telefone getrennt
- Gruppierung nach Funktion statt nach Standort

Zwischen VLANs kommunizieren Geräte nur über einen **Router oder Layer-3-Switch** (Inter-VLAN-Routing, siehe A7).

**VLAN-Nummern:**
| Bereich | Bedeutung |
|---|---|
| 1 | Standard-VLAN, alle Ports sind anfangs darin, kann nicht gelöscht werden |
| 2–1001 | normaler Bereich |
| 1002–1005 | reserviert (historisch FDDI/Token Ring) |
| 1006–4094 | erweiterter Bereich |

**Access-Port:** gehört zu **genau einem** Daten-VLAN, das Endgerät sieht keine Tags. Zusätzlich kann ein **Voice-VLAN** konfiguriert sein, dann trennt das IP-Telefon Sprache und Daten des angeschlossenen PCs.`,
      analogy: 'VLANs sind wie Stockwerke in einem Bürogebäude mit getrennten Fluren: Wer im 2. Stock ruft (Broadcast), wird im 3. Stock nicht gehört. Zwischen den Stockwerken geht es nur über das Treppenhaus (Router).',
      terms: [
        { de: 'Virtuelles LAN', en: 'Virtual LAN (VLAN)' },
        { de: 'Zugangsport', en: 'access port' },
        { de: 'Sprach-VLAN', en: 'voice VLAN' },
      ],
    },
    {
      heading: 'Trunks und IEEE 802.1Q',
      body: `Ein **Trunk** transportiert **mehrere VLANs** über einen Link, typischerweise zwischen Switches oder zum Router/Hypervisor. Damit der Empfänger weiß, zu welchem VLAN ein Frame gehört, wird ein **802.1Q-Tag** (4 Byte) zwischen Quell-MAC und EtherType eingefügt:

| Feld | Bits | Inhalt |
|---|---|---|
| TPID | 16 | \`0x8100\` = „hier kommt ein VLAN-Tag“ |
| PCP | 3 | Priorität (CoS) für QoS |
| DEI | 1 | darf bei Überlast verworfen werden |
| **VID** | 12 | VLAN-ID → max. 4094 nutzbare VLANs |

Durch das Tag ändert sich der Frame, deshalb wird die **FCS neu berechnet**.

**Native VLAN:** Frames des Native VLANs gehen **ungetaggt** über den Trunk (Standard: VLAN 1). Es muss auf **beiden Seiten gleich** sein, sonst landen Frames im falschen VLAN (Cisco meldet per CDP „Native VLAN mismatch“). **Best Practice:** ein ungenutztes VLAN als Native VLAN verwenden (z. B. 999) und nur benötigte VLANs auf dem Trunk erlauben.

**DTP (Dynamic Trunking Protocol)**, Cisco-proprietär, handelt Trunks automatisch aus:
| Seite A \\ Seite B | dynamic auto | dynamic desirable | trunk |
|---|---|---|---|
| dynamic auto | **Access** | Trunk | Trunk |
| dynamic desirable | Trunk | Trunk | Trunk |

Sicherheit: DTP abschalten (\`switchport mode access\` bzw. \`switchport mode trunk\` + \`switchport nonegotiate\`). Sonst kann ein Angreifer per **Switch Spoofing** einen Trunk aushandeln (**VLAN Hopping**).`,
      analogy: 'Ein Trunk ist wie ein Bus mit Fahrgästen aus verschiedenen Stockwerken: Jeder trägt ein Namensschild (Tag) mit seinem Stockwerk. Nur die Gäste vom Native VLAN fahren ohne Schild, deshalb müssen beide Haltestellen wissen, wohin Gäste ohne Schild gehören.',
      terms: [
        { de: 'Bündelleitung', en: 'trunk' },
        { de: 'Ungetaggtes VLAN', en: 'native VLAN' },
      ],
    },
    {
      heading: 'Cisco-Konfiguration: VLANs und Trunks',
      body: `| Ziel | Befehl |
|---|---|
| VLAN anlegen | \`vlan 10\` → \`name Vertrieb\` |
| Access-Port | \`switchport mode access\` + \`switchport access vlan 10\` |
| Voice-VLAN | \`switchport voice vlan 150\` |
| Trunk | \`switchport mode trunk\` (ältere Modelle vorher \`switchport trunk encapsulation dot1q\`) |
| erlaubte VLANs | \`switchport trunk allowed vlan 10,20,30\` |
| VLAN später ergänzen | \`switchport trunk allowed vlan add 40\` |
| Native VLAN | \`switchport trunk native vlan 999\` |
| prüfen | \`show vlan brief\`, \`show interfaces trunk\`, \`show interfaces g0/1 switchport\` |

**Achtung:** \`switchport trunk allowed vlan 40\` **ohne** \`add\` **ersetzt** die Liste. Das ist ein klassischer Fehler, der alle anderen VLANs auf dem Trunk kappt.`,
    },
    {
      heading: 'Spanning Tree (STP) – Schleifen verhindern',
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'SW-A und SW-B haben beide Priorität 32768. SW-A hat MAC `0000.0c00.0001`, SW-B `0000.0c00.00ff`. Wer wird Root Bridge?',
        options: [
          { id: 'a', text: 'SW-A' },
          { id: 'b', text: 'SW-B', whyWrong: 'Bei gleicher Priorität gewinnt die **niedrigere** MAC.' },
        ],
        correct: 'a',
        explanation: 'Niedrigste Bridge ID gewinnt: erst Priorität, dann MAC.',
      },
      body: `Redundante Links zwischen Switches sind gut für die Ausfallsicherheit, erzeugen aber **Layer-2-Schleifen**. Ethernet-Frames haben **keine TTL** und kreisen endlos:
- **Broadcast-Sturm** (broadcast storm): Das Netz ist in Sekunden voll ausgelastet
- **instabile MAC-Tabellen** (MAC flapping)
- **doppelte Frames** beim Empfänger

**STP (IEEE 802.1D)** blockiert gezielt Ports, sodass ein schleifenfreier Baum entsteht. Fällt ein Link aus, wird ein blockierter Port aktiviert.

**Ablauf:**
1. **Root Bridge wählen:** die niedrigste **Bridge ID** = Priorität (Standard **32768**, nur in **4096er-Schritten** änderbar) + VLAN-ID (Extended System ID) + MAC-Adresse. Bei gleicher Priorität gewinnt die **niedrigste MAC**.
2. **Root Port** auf jedem anderen Switch: der Port mit den **geringsten Pfadkosten zur Root Bridge**
3. **Designated Port** pro Segment: der Port mit den geringsten Kosten zur Root. Alle Ports der Root Bridge sind Designated.
4. Alle übrigen Ports: **blockieren**.

Bei Gleichstand gilt die Reihenfolge: niedrigste Kosten → niedrigste Bridge ID des Senders → niedrigste Port-ID.

**Pfadkosten (Cisco-Standard, „short“):** 10 Mbit/s = 100, 100 Mbit/s = **19**, 1 Gbit/s = **4**, 10 Gbit/s = **2**.

Switches tauschen dafür **BPDUs** (Bridge Protocol Data Units) aus, standardmäßig alle 2 Sekunden.`,
      analogy: 'STP ist wie ein Straßenplaner, der in einer Stadt mit vielen Ringstraßen so viele Straßen sperrt, bis es von jedem Haus genau einen Weg zum Rathaus (Root Bridge) gibt. Wird eine Straße gesperrt (Ausfall), öffnet er eine Umleitung.',
      terms: [
        { de: 'Wurzelbrücke', en: 'root bridge' },
        { de: 'Bridge-Kennung', en: 'Bridge ID (BID)' },
        { de: 'Broadcast-Sturm', en: 'broadcast storm' },
      ],
    },
    {
      heading: 'RSTP, PVST+ und STP-Schutzfunktionen',
      body: `**Klassisches STP (802.1D)** braucht 30–50 Sekunden zum Umschalten. Portzustände: Blocking → Listening (15 s) → Learning (15 s) → Forwarding (plus bis zu 20 s Max Age beim indirekten Ausfall).

**RSTP (IEEE 802.1w)** konvergiert in **Sekunden oder darunter**:
- Zustände: **Discarding**, **Learning**, **Forwarding**
- Rollen: Root, Designated, **Alternate** (Ersatz für den Root Port), **Backup** (Ersatz für einen Designated Port im selben Segment)

**Cisco-Varianten:** **PVST+** (eine STP-Instanz pro VLAN) und **Rapid PVST+** (RSTP pro VLAN). Pro VLAN kann so eine andere Root Bridge gewählt werden, das ermöglicht Lastverteilung. Der herstellerübergreifende Standard dafür ist **MSTP** (802.1s, heute Teil von 802.1Q): mehrere VLANs teilen sich eine Instanz.

**Schutzfunktionen:**
- **PortFast:** Access-Ports zu Endgeräten gehen **sofort** in Forwarding. **Nur** für Endgeräte!
- **BPDU Guard:** Empfängt ein PortFast-Port eine BPDU (jemand steckt einen Switch an), wird er **err-disabled** (abgeschaltet).
- **Root Guard:** verhindert, dass an diesem Port eine fremde Root Bridge übernimmt.

**Befehle:**
- \`spanning-tree mode rapid-pvst\`
- \`spanning-tree vlan 10 root primary\` (oder \`spanning-tree vlan 10 priority 4096\`)
- \`spanning-tree portfast\` und \`spanning-tree bpduguard enable\` (pro Interface)
- \`show spanning-tree vlan 10\``,
      terms: [
        { de: 'Schneller Spanning Tree', en: 'Rapid Spanning Tree Protocol (RSTP)' },
        { de: 'Fehlerbedingt deaktiviert', en: 'err-disabled' },
      ],
    },
    {
      heading: 'EtherChannel',
      body: `**EtherChannel** (allgemein **Link Aggregation**) bündelt **2–8 aktive** physische Links zu **einem logischen Link** (Port-Channel):
- mehr Bandbreite und Redundanz: Fällt ein Kabel aus, laufen die anderen weiter
- STP sieht nur **einen** Link und blockiert nichts davon

**Lastverteilung pro Flow, nicht pro Paket:** Ein Hash aus z. B. Quell-/Ziel-MAC oder -IP wählt den Link. Eine einzelne Verbindung ist daher nie schneller als ein Einzellink.

**Protokolle und Modi:**
| Protokoll | Modi | bildet Channel mit |
|---|---|---|
| **LACP** (IEEE 802.3ad/802.1AX, offen) | **active**, passive | active–active, active–passive |
| **PAgP** (Cisco) | desirable, auto | desirable–desirable, desirable–auto |
| statisch | **on** | nur on–on (keine Aushandlung) |

passive–passive und auto–auto bilden **keinen** Channel, weil keiner die Aushandlung startet.

**Voraussetzungen:** Alle Member-Ports haben gleiche Geschwindigkeit, gleichen Duplex und gleiche VLAN-/Trunk-Konfiguration.

**Befehle:** \`interface range g0/1 - 2\` → \`channel-group 1 mode active\`. Danach konfiguriert man \`interface port-channel 1\` (z. B. als Trunk). Prüfen mit \`show etherchannel summary\` (Flag **SU** = Layer 2, in Benutzung; **P** = Port gebündelt).`,
      analogy: 'EtherChannel ist eine mehrspurige Autobahn: Mehr Autos kommen gleichzeitig durch, aber jedes einzelne Auto fährt trotzdem nur auf einer Spur und damit nicht schneller.',
      terms: [
        { de: 'Link-Bündelung', en: 'link aggregation' },
        { de: 'Lastverteilung', en: 'load balancing' },
      ],
    },
    {
      heading: 'CDP und LLDP – Nachbarn erkennen',
      body: `Switches, Router, IP-Telefone und APs können sich gegenseitig vorstellen: „Ich bin SW2, Modell C9200, mein Port Gi1/0/24, meine IP 10.0.0.2“. Das hilft beim **Dokumentieren** und bei der **Fehlersuche** („An welchem Switchport hängt dieses Kabel?“).

| | **CDP** | **LLDP** |
|---|---|---|
| Name | Cisco Discovery Protocol | Link Layer Discovery Protocol |
| Standard | Cisco-proprietär | herstellerneutral, **IEEE 802.1AB** |
| Auf Cisco-Geräten | standardmäßig **an** | standardmäßig meist **aus** |
| Senden alle | 60 s | 30 s |
| Haltezeit (holdtime) | 180 s | 120 s |

Beide arbeiten auf **Schicht 2** und gehen **nur bis zum direkten Nachbarn** (sie werden nicht weitergeleitet). Daher funktionieren sie auch ohne IP-Konfiguration.

**Wichtige Befehle (Cisco IOS):**
- \`show cdp neighbors\` – Kurzliste: Nachbar, eigener Port, Modell (Platform), Port des Nachbarn
- \`show cdp neighbors detail\` – zusätzlich **IP-Adresse** und IOS-Version
- \`lldp run\` (global) schaltet LLDP ein, \`show lldp neighbors\` zeigt die Nachbarn
- \`no cdp run\` (global) bzw. \`no cdp enable\` (pro Port) schaltet CDP ab

**Sicherheit:** CDP/LLDP verraten Modell, Softwareversion und IP-Adressen. Auf Ports zu fremden Geräten (Internet-Router des Providers, Gäste) sollte man sie **abschalten**. Zu IP-Telefonen braucht man sie oft, weil das Telefon darüber sein **Voice-VLAN** lernt (LLDP-MED).`,
      analogy: 'CDP/LLDP sind wie Namensschilder bei einem Treffen: Jeder zeigt sein Schild nur den direkten Tischnachbarn. Praktisch, aber in fremder Gesellschaft verrät man lieber nicht zu viel.',
      terms: [
        { de: 'Nachbarerkennung', en: 'neighbor discovery' },
        { de: 'Haltezeit', en: 'holdtime' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 1,
        prompt: 'Im Netz gibt es Switches von Cisco und HP. Welches Protokoll zeigt Nachbarn über Herstellergrenzen hinweg?',
        options: [
          { id: 'a', text: 'LLDP' },
          { id: 'b', text: 'CDP', whyWrong: 'CDP ist Cisco-proprietär, HP-Switches sprechen es in der Regel nicht.' },
          { id: 'c', text: 'STP', whyWrong: 'STP verhindert Schleifen, es zeigt keine Geräteinformationen der Nachbarn.' },
        ],
        correct: 'a',
        explanation: 'LLDP (IEEE 802.1AB) ist herstellerneutral.',
      },
    },
  ],
  quiz: [
    {
      id: 'q18', type: 'cli', shell: 'ios', difficulty: 1,
      prompt: 'Du willst sehen, an welchem Port des Nachbar-Switches dein Uplink endet **und welche IP-Adresse** der Nachbar hat. Welcher Befehl zeigt beides?',
      template: 'SW1# {{0}}',
      blanks: [{ accept: ['show cdp neighbors detail', 'sh cdp nei det', 'show cdp neighbor detail', 'sh cdp neighbors detail'] }],
      explanation: '`show cdp neighbors` zeigt Nachbar, Modell und Ports, aber keine IP-Adresse. Die steht erst in `show cdp neighbors detail` (alternativ `show cdp entry *`).',
    },
    {
      id: 'q19', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu CDP und LLDP stimmen?',
      options: [
        { id: 'a', text: 'Beide arbeiten auf Schicht 2 und erreichen nur direkt verbundene Nachbarn.' },
        { id: 'b', text: 'LLDP ist ein IEEE-Standard (802.1AB).' },
        { id: 'c', text: 'CDP-Meldungen werden von Switches an alle Ports weitergeflutet.', whyWrong: 'CDP-Frames werden vom Nachbarn verarbeitet und nicht weitergeleitet.' },
        { id: 'd', text: 'Ohne IP-Adresse auf dem Port funktioniert CDP nicht.', whyWrong: 'CDP ist ein Layer-2-Protokoll und braucht keine IP-Konfiguration.' },
      ],
      correct: ['a', 'b'],
      explanation: 'CDP und LLDP sind Layer-2-Protokolle zwischen direkten Nachbarn. LLDP ist herstellerneutral (IEEE 802.1AB), CDP Cisco-proprietär.',
    },
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Was ist ein VLAN aus Sicht von Broadcasts?',
      options: [
        { id: 'a', text: 'Eine eigene Broadcast-Domäne' },
        { id: 'b', text: 'Eine eigene Kollisionsdomäne', whyWrong: 'Kollisionsdomänen trennt jeder Switch-Port ohnehin. VLANs trennen Broadcast-Domänen.' },
        { id: 'c', text: 'Ein eigenes Routing-Protokoll', whyWrong: 'VLANs sind ein Layer-2-Konzept, kein Routing-Protokoll.' },
        { id: 'd', text: 'Ein verschlüsselter Tunnel', whyWrong: 'VLANs trennen logisch, verschlüsseln aber nichts.' },
      ],
      correct: 'a',
      explanation: 'Ein Broadcast in VLAN 10 erreicht nur Ports in VLAN 10. In der Regel gilt: ein VLAN = ein IP-Subnetz.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Zwei PCs hängen am selben Switch, PC1 in VLAN 10, PC2 in VLAN 20. Was brauchen sie, um miteinander zu kommunizieren?',
      options: [
        { id: 'a', text: 'Einen Router oder Layer-3-Switch (Inter-VLAN-Routing)' },
        { id: 'b', text: 'Nichts, sie hängen am selben Switch.', whyWrong: 'VLANs trennen die Ports logisch, als wären es zwei verschiedene Switches.' },
        { id: 'c', text: 'Einen Hub zwischen den Ports', whyWrong: 'Ein Hub würde die VLAN-Trennung nicht überbrücken und ist ohnehin veraltet.' },
        { id: 'd', text: 'Ein Crossover-Kabel', whyWrong: 'Das Kabel ändert nichts an der VLAN-Zuordnung.' },
      ],
      correct: 'a',
      explanation: 'Verschiedene VLANs = verschiedene Netze. Die Verbindung zwischen Netzen ist Routing (Layer 3).',
    },
    {
      id: 'q3', type: 'cli', shell: 'ios', difficulty: 1,
      prompt: 'Mach `Gi0/5` zu einem **Access-Port in VLAN 10**.',
      template: 'SW1(config-if)# switchport mode {{0}}\nSW1(config-if)# switchport access vlan {{1}}',
      blanks: [{ accept: ['access'] }, { accept: ['10'] }],
      explanation: '`switchport mode access` schaltet DTP-Trunk-Aushandlung ab, `switchport access vlan 10` weist das VLAN zu. Existiert VLAN 10 noch nicht, legt IOS es automatisch an.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Wie viele Bit hat die **VLAN-ID** im 802.1Q-Tag, und wie viele VLANs sind damit nutzbar?',
      options: [
        { id: 'a', text: '12 Bit → 4094 nutzbare VLANs (0 und 4095 reserviert)' },
        { id: 'b', text: '16 Bit → 65.536 VLANs', whyWrong: '16 Bit ist das TPID-Feld (0x8100). Für die VID bleiben 12 Bit.' },
        { id: 'c', text: '8 Bit → 256 VLANs', whyWrong: 'Das wäre zu wenig für große Netze. Die VID hat 12 Bit.' },
        { id: 'd', text: '12 Bit → 4096 nutzbare VLANs', whyWrong: '2¹² = 4096 Werte, aber VLAN 0 und 4095 sind reserviert.' },
      ],
      correct: 'a',
      explanation: 'Das 4-Byte-Tag: TPID (16 Bit) + PCP (3) + DEI (1) + VID (12).',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Was ist das **Native VLAN** auf einem 802.1Q-Trunk?',
      options: [
        { id: 'a', text: 'Das VLAN, dessen Frames ungetaggt über den Trunk gehen' },
        { id: 'b', text: 'Das VLAN mit der höchsten Priorität', whyWrong: 'Die Priorität steht im PCP-Feld. Mit dem Native VLAN hat das nichts zu tun.' },
        { id: 'c', text: 'Das VLAN für die Verwaltung des Switches', whyWrong: 'Das Management-VLAN ist ein anderes Konzept (die SVI für die Switch-IP). Es kann, sollte aber nicht, das Native VLAN sein.' },
        { id: 'd', text: 'Das einzige VLAN, das ein Trunk transportiert', whyWrong: 'Ein Trunk transportiert viele VLANs. Nur eines davon ist native.' },
      ],
      correct: 'a',
      explanation: 'Standard ist VLAN 1. Es muss auf beiden Trunk-Seiten gleich sein. Best Practice: ein ungenutztes VLAN als Native VLAN.',
    },
    {
      id: 'q6', type: 'scenario', difficulty: 2,
      scenario: 'Auf dem Trunk zwischen SW1 und SW2 waren die VLANs 10, 20 und 30 erlaubt. Ein Kollege gibt auf SW1 `switchport trunk allowed vlan 40` ein. Kurz darauf melden alle Abteilungen in VLAN 10–30 an SW2 Ausfälle.',
      prompt: 'Was ist passiert?',
      options: [
        { id: 'a', text: 'Ohne `add` wurde die Liste ersetzt – jetzt ist nur noch VLAN 40 erlaubt.' },
        { id: 'b', text: 'VLAN 40 hat Vorrang vor den anderen VLANs.', whyWrong: 'Es gibt keine VLAN-Priorität auf Trunks. Die Liste wurde überschrieben.' },
        { id: 'c', text: 'Der Trunk ist in einen Access-Port umgewandelt worden.', whyWrong: 'Der Port bleibt Trunk. Er transportiert nur andere VLANs.' },
        { id: 'd', text: 'STP hat den Trunk blockiert.', whyWrong: 'Die Ursache ist die geänderte erlaubte VLAN-Liste, nicht STP.' },
      ],
      correct: 'a',
      explanation: 'Richtig wäre `switchport trunk allowed vlan add 40` gewesen. Mit `show interfaces trunk` siehst du die tatsächlich erlaubten und aktiven VLANs.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Zwei Cisco-Switches sind verbunden, beide Ports stehen auf **`dynamic auto`**. Was entsteht?',
      options: [
        { id: 'a', text: 'Ein Access-Link (kein Trunk)' },
        { id: 'b', text: 'Ein Trunk', whyWrong: 'Bei `dynamic auto` wartet jede Seite passiv. Ohne eine Seite, die aktiv fragt (desirable oder trunk), entsteht kein Trunk.' },
        { id: 'c', text: 'Ein EtherChannel', whyWrong: 'DTP handelt Trunks aus, keine EtherChannels.' },
        { id: 'd', text: 'Der Link bleibt down.', whyWrong: 'Der Link kommt hoch, nur eben als Access-Port.' },
      ],
      correct: 'a',
      explanation: 'auto + auto = Access. auto + desirable = Trunk. In der Praxis setzt man den Modus fest und deaktiviert DTP.',
    },
    {
      id: 'q8', type: 'multi', difficulty: 2,
      prompt: 'Welche Probleme entstehen bei einer **Layer-2-Schleife ohne STP**?',
      options: [
        { id: 'a', text: 'Broadcast-Sturm' },
        { id: 'b', text: 'Instabile MAC-Adresstabellen (MAC Flapping)' },
        { id: 'c', text: 'Mehrfach zugestellte Frames' },
        { id: 'd', text: 'Frames werden nach Ablauf der TTL verworfen', whyWrong: 'Genau das ist das Problem: Ethernet-Frames haben keine TTL und kreisen deshalb endlos.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Ein Broadcast wird an jeder Schleife vervielfacht. Innerhalb von Sekunden ist das Netz komplett ausgelastet.',
    },
    {
      id: 'q9', type: 'topology', mode: 'click', difficulty: 2,
      prompt: 'Welcher Switch wird **Root Bridge**? SW1: Priorität 32768, MAC `0000.0c00.000b`. SW2: Priorität 32768, MAC `0000.0c00.000a`. SW3: Priorität **28672**, MAC `0000.0c00.00ff`.',
      nodes: [
        { id: 'sw1', kind: 'switch', label: 'SW1', x: 20, y: 25 },
        { id: 'sw2', kind: 'switch', label: 'SW2', x: 80, y: 25 },
        { id: 'sw3', kind: 'switch', label: 'SW3', x: 50, y: 80 },
      ],
      links: [['sw1', 'sw2'], ['sw2', 'sw3'], ['sw3', 'sw1']],
      correct: ['sw3'],
      explanation: 'Die Priorität wird zuerst verglichen: 28672 < 32768, also gewinnt SW3, egal wie hoch seine MAC ist. Die MAC entscheidet nur bei gleicher Priorität.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Welcher Port ist auf einem Nicht-Root-Switch der **Root Port**?',
      options: [
        { id: 'a', text: 'Der Port mit den geringsten Pfadkosten zur Root Bridge' },
        { id: 'b', text: 'Der Port mit der niedrigsten Portnummer', whyWrong: 'Die Port-ID ist nur der letzte Tie-Breaker. Entscheidend sind zuerst die Pfadkosten.' },
        { id: 'c', text: 'Der schnellste Port des Switches', whyWrong: 'Es zählen die gesamten Kosten bis zur Root, nicht nur der erste Link.' },
        { id: 'd', text: 'Jeder Port, der eine BPDU empfängt', whyWrong: 'BPDUs kommen an mehreren Ports an. Nur einer wird Root Port.' },
      ],
      correct: 'a',
      explanation: 'Jeder Nicht-Root-Switch hat genau einen Root Port. Die Root Bridge selbst hat keinen, alle ihre Ports sind Designated.',
    },
    {
      id: 'q11', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Portzustände dem Protokoll zu.',
      items: [
        { id: 'blk', text: 'Blocking' },
        { id: 'lis', text: 'Listening' },
        { id: 'dis', text: 'Discarding' },
        { id: 'fw', text: 'Forwarding' },
        { id: 'lrn', text: 'Learning' },
      ],
      buckets: [
        { id: 'stp', label: 'nur 802.1D (klassisches STP)' },
        { id: 'rstp', label: 'nur 802.1w (RSTP)' },
        { id: 'both', label: 'beide' },
      ],
      solution: { blk: 'stp', lis: 'stp', dis: 'rstp', fw: 'both', lrn: 'both' },
      explanation: 'RSTP fasst Disabled, Blocking und Listening zu Discarding zusammen. Learning und Forwarding gibt es in beiden.',
    },
    {
      id: 'q12', type: 'scenario', difficulty: 2,
      scenario: 'Ein Mitarbeiter steckt einen kleinen Switch unter seinen Schreibtisch an die Netzwerkdose. Sofort geht die LED am Access-Port des Etagen-Switches aus, das Log zeigt `%SPANTREE-2-BLOCK_BPDUGUARD` und `err-disabled`.',
      prompt: 'Was ist passiert?',
      options: [
        { id: 'a', text: 'BPDU Guard hat den PortFast-Port abgeschaltet, weil dort eine BPDU ankam.' },
        { id: 'b', text: 'Der Port ist durch Überspannung kaputtgegangen.', whyWrong: 'Die Meldung `BPDUGUARD` zeigt eindeutig eine Schutzfunktion, keinen Hardwaredefekt.' },
        { id: 'c', text: 'Root Guard hat den Port blockiert.', whyWrong: 'Root Guard reagiert nur auf überlegene BPDUs und setzt den Port in den Zustand „root-inconsistent“, nicht err-disabled.' },
        { id: 'd', text: 'DTP hat einen Trunk ausgehandelt.', whyWrong: 'Ein ausgehandelter Trunk würde den Port nicht abschalten.' },
      ],
      correct: 'a',
      explanation: 'Gewollt: Fremde Switches können so keine Schleifen erzeugen oder Root Bridge werden. Danach Gerät entfernen und Port mit `shutdown` / `no shutdown` reaktivieren (oder `errdisable recovery` nutzen).',
    },
    {
      id: 'q13', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Mach SW1 zur **Root Bridge für VLAN 10** (Cisco-Makro).',
      template: 'SW1(config)# spanning-tree vlan 10 {{0}}',
      blanks: [{ accept: ['root primary'] }],
      explanation: 'Das Makro setzt die Priorität auf 24576 bzw. 4096 unter die aktuelle Root. Alternativ fest: `spanning-tree vlan 10 priority 4096`.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Auf welchen Ports sollte man **PortFast** aktivieren?',
      options: [
        { id: 'a', text: 'Auf Access-Ports zu Endgeräten (PCs, Drucker, Server)' },
        { id: 'b', text: 'Auf allen Trunks zwischen Switches', whyWrong: 'Zwischen Switches kann eine Schleife entstehen. Dort muss STP ganz normal arbeiten.' },
        { id: 'c', text: 'Nur auf dem Root Port', whyWrong: 'Der Root Port führt zu einem anderen Switch, dort ist PortFast falsch.' },
        { id: 'd', text: 'Auf gar keinen Ports, PortFast ist veraltet', whyWrong: 'PortFast ist Best Practice für Endgerät-Ports. Sonst wartet ein PC bei 802.1D 30 s auf Netzwerk und DHCP läuft in Timeouts.' },
      ],
      correct: 'a',
      explanation: 'PortFast überspringt Listening/Learning. Zusammen mit BPDU Guard ist das die Standardkonfiguration für Access-Ports.',
    },
    {
      id: 'q15', type: 'dragdrop', difficulty: 2,
      prompt: 'Bildet sich mit diesen Modi ein **EtherChannel**?',
      items: [
        { id: 'i1', text: 'active – active' },
        { id: 'i2', text: 'active – passive' },
        { id: 'i3', text: 'passive – passive' },
        { id: 'i4', text: 'desirable – auto' },
        { id: 'i5', text: 'auto – auto' },
        { id: 'i6', text: 'on – active' },
      ],
      buckets: [
        { id: 'yes', label: 'Channel entsteht' },
        { id: 'no', label: 'kein Channel' },
      ],
      solution: { i1: 'yes', i2: 'yes', i4: 'yes', i3: 'no', i5: 'no', i6: 'no' },
      explanation: 'Mindestens eine Seite muss aktiv aushandeln (LACP active, PAgP desirable). `on` handelt gar nicht aus und funktioniert nur mit `on` auf der Gegenseite.',
    },
    {
      id: 'q16', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Bündle `Gi0/1–2` per **LACP** (aktiv aushandeln) in Port-Channel 1.',
      template: 'SW1(config)# interface range g0/1 - 2\nSW1(config-if-range)# channel-group {{0}} mode {{1}}',
      blanks: [{ accept: ['1'] }, { accept: ['active'] }],
      explanation: 'LACP-Modi: active/passive. PAgP: desirable/auto. Prüfen mit `show etherchannel summary`.',
    },
    {
      id: 'q17', type: 'multi', difficulty: 2,
      prompt: 'Was muss auf allen Member-Ports eines EtherChannels **gleich** sein?',
      options: [
        { id: 'a', text: 'Geschwindigkeit und Duplex' },
        { id: 'b', text: 'Switchport-Modus (Access/Trunk)' },
        { id: 'c', text: 'Access-VLAN bzw. erlaubte VLANs und Native VLAN' },
        { id: 'd', text: 'Die Interface-Beschreibung (`description`)', whyWrong: 'Die Beschreibung ist nur ein Kommentar und hat keinen Einfluss.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Abweichende Ports werden suspendiert (`s` in `show etherchannel summary`). Am besten konfiguriert man nach dem Bündeln nur noch das Port-Channel-Interface.',
    },
    { id: 'g1', type: 'generated', generator: 'stp', difficulty: 3 },
    {
      id: 'o1', type: 'ordering', difficulty: 2,
      prompt: 'Bringe die Schritte, mit denen STP einen schleifenfreien Baum bildet, in die richtige Reihenfolge.',
      items: [
        { id: 's1', text: 'Alle Switches senden BPDUs und halten sich zunächst selbst für Root' },
        { id: 's2', text: 'Root Bridge wählen (niedrigste Bridge ID)' },
        { id: 's3', text: 'Auf jedem Nicht-Root-Switch den Root Port bestimmen' },
        { id: 's4', text: 'Pro Segment den Designated Port bestimmen' },
        { id: 's5', text: 'Alle übrigen Ports blockieren' },
      ],
      explanation: 'Root Ports und Designated Ports beziehen sich auf die Root Bridge. Deshalb muss sie zuerst feststehen.',
    },
    {
      id: 's1', type: 'scenario', difficulty: 3,
      scenario: 'PCs in **VLAN 30** an SW2 erreichen ihre Kollegen in VLAN 30 an SW1 nicht. VLAN 10 und 20 funktionieren. Auf SW1:\n\n```\nSW1# show interfaces trunk\nPort        Mode         Encapsulation  Status        Native vlan\nGi0/1       on           802.1q         trunking      1\n\nPort        Vlans allowed on trunk\nGi0/1       10,20\n\nPort        Vlans allowed and active in management domain\nGi0/1       10,20\n```',
      prompt: 'Was ist die Ursache?',
      options: [
        { id: 'a', text: 'VLAN 30 ist auf dem Trunk nicht erlaubt (allowed: 10,20).' },
        { id: 'b', text: 'Der Trunk ist down.', whyWrong: 'Status „trunking“ zeigt, dass der Trunk läuft. VLAN 10/20 funktionieren ja auch.' },
        { id: 'c', text: 'Native VLAN mismatch', whyWrong: 'Native VLAN 1 betrifft nur ungetaggten Verkehr. Hier fehlt VLAN 30 in der erlaubten Liste.' },
        { id: 'd', text: 'Die Encapsulation muss ISL sein.', whyWrong: '802.1Q ist der Standard. ISL ist veraltet und würde nichts lösen.' },
      ],
      correct: 'a',
      explanation: 'Lösung: `switchport trunk allowed vlan add 30` (mit **add**, sonst wird die Liste ersetzt). Prüfe auch, ob VLAN 30 auf beiden Switches existiert.',
    },
    {
      id: 'c1', type: 'cli', shell: 'ios', difficulty: 2,
      prompt: 'Konfiguriere `Gi0/5` als Access-Port, ausgehend vom **User-EXEC-Modus**. Gib für jeden Moduswechsel den Befehl an.',
      template: 'SW1> {{0}}\nSW1# {{1}}\nSW1(config)# {{2}}\nSW1(config-if)# switchport mode access',
      blanks: [
        { accept: ['enable', 'en'] },
        { accept: ['configure terminal', 'conf t', 'config t', 'conf terminal'] },
        { accept: ['interface g0/5', 'int g0/5', 'interface gi0/5', 'int gi0/5', 'interface gigabitethernet0/5', 'int gigabitethernet0/5', 'interface gigabitethernet 0/5'] },
      ],
      explanation: 'User EXEC (`>`) → `enable` → Privileged EXEC (`#`) → `configure terminal` → globale Konfiguration → `interface …` → Interface-Konfiguration. Typischer Prüfungsfehler: der richtige Befehl im falschen Modus.',
    },
    {
      id: 'ch1', type: 'chain', difficulty: 3,
      prompt: 'Fehlersuche: PC4 wurde neu an **SW2, Port Gi0/7** angeschlossen und erreicht weder Server noch Internet. Andere PCs am selben Switch funktionieren.',
      steps: [
        {
          id: 'st1',
          text: 'Was prüfst du zuerst?',
          options: [
            { id: 'a', text: 'Am PC `ipconfig`: Hat er eine passende IP-Adresse?', correct: true, feedback: 'Guter Start: Die Adresskonfiguration zeigt schnell, ob grundsätzlich etwas ankommt.' },
            { id: 'b', text: 'Den Core-Router neu starten', correct: false, feedback: 'Andere PCs funktionieren, ein Router-Problem ist unwahrscheinlich, und ein Neustart stört alle.' },
            { id: 'c', text: 'Den DNS-Server tauschen', correct: false, feedback: 'Ohne Hinweis auf ein Namensproblem ist das geraten, nicht geprüft.' },
          ],
        },
        {
          id: 'st2',
          text: '`ipconfig` zeigt `169.254.12.7`. Was bedeutet das?',
          options: [
            { id: 'a', text: 'Der PC hat keinen DHCP-Server erreicht (APIPA).', correct: true, feedback: 'Genau: 169.254.x.x vergibt sich das OS selbst, wenn DHCP nicht antwortet.' },
            { id: 'b', text: 'Jemand hat eine falsche statische IP eingetragen.', correct: false, feedback: '169.254.x.x ist typisch für fehlgeschlagenes DHCP, nicht für eine statische Eingabe.' },
            { id: 'c', text: 'Der DNS-Server ist falsch.', correct: false, feedback: 'DNS beeinflusst nicht die eigene IP-Adresse.' },
          ],
        },
        {
          id: 'st3',
          text: 'Die Link-LED leuchtet. `show interfaces g0/7 switchport` auf SW2 zeigt `Access Mode VLAN: 1 (default)`. Die anderen PCs sind in VLAN 10, dort ist auch DHCP verfügbar. Ursache?',
          options: [
            { id: 'a', text: 'Der Port ist im falschen VLAN (1 statt 10).', correct: true, feedback: 'Richtig: In VLAN 1 gibt es keinen DHCP-Server für den PC.' },
            { id: 'b', text: 'Das Kabel ist defekt.', correct: false, feedback: 'Die Link-LED leuchtet, Layer 1 ist in Ordnung.' },
            { id: 'c', text: 'Der DHCP-Server ist ausgefallen.', correct: false, feedback: 'Die anderen PCs bekommen Adressen, der Server läuft also.' },
          ],
        },
        {
          id: 'st4',
          text: 'Wie behebst du es?',
          options: [
            { id: 'a', text: '`switchport access vlan 10` auf Gi0/7, danach am PC `ipconfig /renew`', correct: true, feedback: 'Port ins richtige VLAN, dann neue Adresse anfordern.' },
            { id: 'b', text: '`switchport mode trunk` auf Gi0/7', correct: false, feedback: 'Ein PC braucht einen Access-Port. Als Trunk landet sein ungetaggter Verkehr im Native VLAN.' },
            { id: 'c', text: 'Am PC eine statische IP aus VLAN 10 eintragen', correct: false, feedback: 'Das bekämpft nur das Symptom: Der Port bliebe in VLAN 1 und der PC im falschen Netz.' },
          ],
        },
      ],
      explanation: 'Methodik: Symptom eingrenzen (nur ein PC), Daten sammeln (ipconfig), Hypothese prüfen (Port-VLAN), gezielt beheben und verifizieren.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'single', difficulty: 3,
        prompt: 'Ein Switch mit Standardpriorität zeigt für **VLAN 10** in `show spanning-tree` die Bridge-Priorität **32778**. Warum nicht 32768?',
        options: [
          { id: 'a', text: 'Die VLAN-ID (10) wird als Extended System ID zur Priorität addiert.' },
          { id: 'b', text: 'Der Switch hat die Priorität automatisch erhöht, weil er langsam ist.', whyWrong: 'Switches ändern ihre Priorität nicht selbst nach Leistung.' },
          { id: 'c', text: 'Es ist ein Anzeigefehler.', whyWrong: 'Die Anzeige ist korrekt und gewollt.' },
          { id: 'd', text: 'Jeder Port erhöht die Priorität um 1.', whyWrong: 'Die Anzahl der Ports spielt keine Rolle.' },
        ],
        correct: 'a',
        explanation: 'Die Bridge ID nutzt 4 Bit Priorität (deshalb 4096er-Schritte) + 12 Bit VLAN-ID + MAC. 32768 + 10 = 32778. So kann pro VLAN eine eigene Root Bridge gewählt werden (PVST+).',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        scenario: 'Zwischen SW1 und SW2 gibt es zwei parallele Links: Gi0/1 (**1 Gbit/s**) und Fa0/24 (**100 Mbit/s**). SW1 ist Root Bridge. EtherChannel ist nicht konfiguriert.',
        prompt: 'Welcher Port von SW2 wird Root Port, und was passiert mit dem anderen?',
        options: [
          { id: 'a', text: 'Gi0/1 wird Root Port (Kosten 4), Fa0/24 wird blockiert (Kosten 19).' },
          { id: 'b', text: 'Fa0/24 wird Root Port, weil die Portnummer höher ist.', whyWrong: 'Die Port-ID entscheidet erst bei gleichen Kosten, und dann gewinnt die niedrigere.' },
          { id: 'c', text: 'Beide leiten weiter und teilen sich die Last.', whyWrong: 'Ohne EtherChannel sieht STP zwei getrennte Links und muss einen blockieren.' },
          { id: 'd', text: 'Beide werden blockiert.', whyWrong: 'Dann hätte SW2 keine Verbindung zur Root Bridge.' },
        ],
        correct: 'a',
        explanation: 'Root Port = geringste Pfadkosten. 1 Gbit/s = 4, 100 Mbit/s = 19. Der langsamere Link bleibt als Reserve blockiert. Mit EtherChannel aus gleich schnellen Links würde man beide nutzen.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        scenario: 'Auf SW1 ist der Trunk zu SW2 mit `switchport trunk native vlan 99` konfiguriert, auf SW2 mit dem Standard. Das Log zeigt `%CDP-4-NATIVE_VLAN_MISMATCH`.',
        prompt: 'Welche Folge hat das?',
        options: [
          { id: 'a', text: 'Ungetaggte Frames aus VLAN 99 auf SW1 landen auf SW2 in VLAN 1 (und umgekehrt) – VLANs „verschmelzen“ ungewollt.' },
          { id: 'b', text: 'Der Trunk geht sofort down.', whyWrong: 'Der Trunk bleibt meist aktiv. Gerade deshalb ist der Fehler tückisch.' },
          { id: 'c', text: 'Alle getaggten VLANs funktionieren nicht mehr.', whyWrong: 'Getaggte VLANs sind nicht betroffen, nur der ungetaggte Verkehr.' },
          { id: 'd', text: 'Keine, CDP-Meldungen sind nur informativ.', whyWrong: 'Die Meldung zeigt einen echten Konfigurationsfehler mit Auswirkungen auf Verkehr und Sicherheit.' },
        ],
        correct: 'a',
        explanation: 'Jede Seite ordnet ungetaggte Frames ihrem eigenen Native VLAN zu. Das kann Verkehr in fremde VLANs leiten und STP-Probleme verursachen. Lösung: auf beiden Seiten dasselbe (ungenutzte) Native VLAN.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Ein EtherChannel aus **4 × 1 Gbit/s** verbindet zwei Switches. Ein einzelner großer Dateitransfer zwischen zwei Servern erreicht nur ca. **1 Gbit/s**. Warum?',
        options: [
          { id: 'a', text: 'Die Lastverteilung erfolgt pro Flow (Hash), ein einzelner Flow nutzt nur einen Member-Link.' },
          { id: 'b', text: 'Der EtherChannel ist defekt, er müsste 4 Gbit/s liefern.', whyWrong: 'Das Verhalten ist normal. 4 Gbit/s gibt es nur in Summe über viele Flows.' },
          { id: 'c', text: 'STP blockiert drei der vier Links.', whyWrong: 'STP sieht den Port-Channel als einen Link und blockiert keine Member.' },
          { id: 'd', text: 'LACP begrenzt auf 1 Gbit/s.', whyWrong: 'LACP begrenzt nichts, es handelt nur die Bündelung aus.' },
        ],
        correct: 'a',
        explanation: 'Würde man pro Paket verteilen, kämen Pakete in falscher Reihenfolge an. Für einen einzelnen schnellen Flow braucht man einen schnelleren Einzellink (z. B. 10G).',
      },
      {
        id: 'b5', type: 'cli', shell: 'ios', difficulty: 3,
        prompt: 'Härte einen Trunk-Port: Native VLAN auf das ungenutzte VLAN **999** setzen und DTP-Aushandlung abschalten.',
        template: 'SW1(config-if)# switchport mode trunk\nSW1(config-if)# switchport trunk native vlan {{0}}\nSW1(config-if)# switchport {{1}}',
        blanks: [{ accept: ['999'] }, { accept: ['nonegotiate'] }],
        explanation: 'Das schützt gegen VLAN Hopping per Switch Spoofing (DTP) und per Double Tagging (Angreifer im Native VLAN). Auf der Gegenseite muss ebenfalls Native VLAN 999 gesetzt sein.',
      },
      {
        id: 'b6', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen zu **RSTP** (802.1w) sind korrekt?',
        options: [
          { id: 'a', text: 'Ein Alternate Port ist ein vorbereiteter Ersatz für den Root Port.' },
          { id: 'b', text: 'RSTP konvergiert typischerweise in wenigen Sekunden oder schneller.' },
          { id: 'c', text: 'RSTP ist abwärtskompatibel zu 802.1D (dann aber mit langsamer Konvergenz).' },
          { id: 'd', text: 'RSTP kennt die Zustände Blocking und Listening.', whyWrong: 'RSTP fasst diese zu „Discarding“ zusammen.' },
          { id: 'e', text: 'RSTP braucht keine Root Bridge mehr.', whyWrong: 'Auch RSTP wählt eine Root Bridge, die Wahl funktioniert gleich.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'RSTP verhandelt aktiv per Proposal/Agreement statt Timer abzuwarten. Fällt der Root Port aus, übernimmt der Alternate Port fast sofort.',
      },
      { id: 'bg1', type: 'generated', generator: 'stp', difficulty: 3 },
      {
        id: 'bs1', type: 'scenario', difficulty: 3,
        scenario: '```\nSW1# show etherchannel summary\nFlags:  D - down        P - bundled in port-channel\n        I - stand-alone s - suspended\n        S - Layer2      U - in use\n\nGroup  Port-channel  Protocol    Ports\n------+-------------+-----------+------------------------\n1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(s)\n```',
        prompt: 'Warum ist **Gi0/2** im Zustand `s` (suspended)?',
        options: [
          { id: 'a', text: 'Seine Konfiguration (z. B. Speed, Duplex, VLAN/Trunk-Einstellungen) passt nicht zu den anderen Member-Ports.' },
          { id: 'b', text: 'STP blockiert den Port.', whyWrong: 'STP sieht nur den Port-Channel. Ein suspendierter Member deutet auf eine Inkonsistenz innerhalb des Bündels hin.' },
          { id: 'c', text: 'Der Port-Channel ist down.', whyWrong: 'Po1 hat die Flags SU: Layer 2, in Benutzung. Gi0/1 ist gebündelt (P).' },
          { id: 'd', text: 'LACP unterstützt nur einen Port pro Channel.', whyWrong: 'LACP bündelt bis zu 8 aktive Ports (plus Standby).' },
        ],
        correct: 'a',
        explanation: 'Vergleiche `show running-config interface g0/1` und `g0/2`. Am besten nur noch das Port-Channel-Interface konfigurieren, die Member übernehmen die Einstellungen.',
      },
    ],
  },
};

export default level;
