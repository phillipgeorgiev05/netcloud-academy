import type { Level } from '../../types/content';

const level: Level = {
  id: 'basics-05',
  track: 'basics',
  order: 5,
  title: 'Server, Virtualisierung & Cloud',
  titleEn: 'Servers, Virtualization and Cloud Basics',
  summary: 'Was ein Server ist und wo er steht (Rechenzentrum), wie Virtualisierung mit Hypervisor und VMs funktioniert, was Container anders machen und was Cloud wirklich bedeutet: Eigenschaften, IaaS/PaaS/SaaS, Bereitstellungsmodelle und das Modell der geteilten Verantwortung.',
  certs: ['az900', 'aws-saa', 'fisi'],
  domains: { az900: 'concepts', 'aws-saa': 'cost', fisi: 'ap1' },
  lesson: [
    {
      heading: 'Server und Rechenzentrum',
      body: `Ein **Server** ist ein Computer, der Dienste für andere bereitstellt: Dateien, E-Mail, Webseiten, Datenbanken, Anmeldung.

Server-Hardware ist auf **Dauerbetrieb** ausgelegt:
- **redundante Netzteile** und Lüfter (fällt eins aus, läuft der Server weiter)
- **ECC-RAM**, der Speicherfehler erkennt und korrigiert
- **RAID**: mehrere Festplatten, sodass der Ausfall einer Platte keine Daten kostet
- **Fernwartung** (z. B. iDRAC, iLO) auch bei ausgeschaltetem Betriebssystem

Server stehen im **Rechenzentrum** (data center) in **Racks** (19-Zoll-Schränke, Höhe in **HE**/U). Dort gibt es Klimatisierung, **USV** (unterbrechungsfreie Stromversorgung), Notstrom-Generatoren, Brandschutz und Zutrittskontrolle.

Firmen betreiben Server entweder selbst im eigenen Serverraum (**On-Premises**) oder mieten sie beim Anbieter, bis hin zur **Cloud**.`,
      analogy: 'Ein Server ist wie die Küche eines Restaurants: Sie läuft den ganzen Tag, bedient viele Gäste gleichzeitig und hat für wichtige Geräte Ersatz, damit der Betrieb nie stillsteht.',
      terms: [
        { de: 'Rechenzentrum', en: 'data center' },
        { de: 'Serverschrank', en: 'rack (19-inch)' },
        { de: 'unterbrechungsfreie Stromversorgung (USV)', en: 'uninterruptible power supply (UPS)' },
        { de: 'im eigenen Haus betrieben', en: 'on-premises (on-prem)' },
        { de: 'Festplattenverbund', en: 'RAID (redundant array of independent disks)' },
      ],
      check: {
        id: 'c1', type: 'multi', difficulty: 1,
        prompt: 'Was unterscheidet einen Server typischerweise von einem Büro-PC?',
        options: [
          { id: 'a', text: 'Redundante Netzteile' },
          { id: 'b', text: 'Fernwartung unabhängig vom Betriebssystem' },
          { id: 'c', text: 'ECC-RAM' },
          { id: 'd', text: 'Eine besonders gute Grafikkarte', whyWrong: 'Die meisten Server haben gar keine leistungsstarke Grafikkarte, weil niemand davor sitzt. Ausnahme sind KI-Server mit GPUs, das ist aber eine Spezialaufgabe.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Server sind auf Ausfallsicherheit und Fernverwaltung gebaut.',
      },
    },
    {
      heading: 'Virtualisierung: viele Server auf einer Hardware',
      body: `Früher lief auf jedem physischen Server nur ein Dienst. Die Hardware war oft nur zu 10–20 % ausgelastet.

Mit **Virtualisierung** laufen viele **virtuelle Maschinen** (VMs) auf einem physischen Server (dem **Host**). Ein **Hypervisor** verteilt CPU, RAM, Speicher und Netz an die VMs. Jede VM hat ihr eigenes Betriebssystem (**Gast**) und merkt nicht, dass sie sich die Hardware teilt.

| Typ | läuft | Beispiele |
|---|---|---|
| **Typ 1** (bare metal) | direkt auf der Hardware | VMware ESXi, Microsoft Hyper-V, KVM |
| **Typ 2** (hosted) | als Programm auf einem Betriebssystem | VirtualBox, VMware Workstation |

**Vorteile:**
- bessere Auslastung, weniger Hardware, weniger Strom
- **Snapshots**: Zustand sichern und bei Problemen zurückspringen
- VMs lassen sich im laufenden Betrieb auf einen anderen Host verschieben (Live-Migration)
- schnell neue Server bereitstellen, aus Vorlagen`,
      analogy: 'Ein Hypervisor ist wie ein Vermieter, der ein großes Haus in Wohnungen aufteilt. Jede Partei hat ihre eigene abgeschlossene Wohnung (VM), aber alle teilen sich Dach, Heizung und Strom (Hardware).',
      terms: [
        { de: 'Virtualisierung', en: 'virtualization' },
        { de: 'virtuelle Maschine (VM)', en: 'virtual machine (VM)' },
        { de: 'Hypervisor', en: 'hypervisor' },
        { de: 'Wirtssystem', en: 'host' },
        { de: 'Gastsystem', en: 'guest' },
        { de: 'Momentaufnahme', en: 'snapshot' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Welcher Hypervisor läuft direkt auf der Hardware (Typ 1)?',
        options: [
          { id: 'a', text: 'VMware ESXi' },
          { id: 'b', text: 'VirtualBox', whyWrong: 'VirtualBox ist ein Programm, das auf Windows, macOS oder Linux installiert wird, also Typ 2.' },
          { id: 'c', text: 'VMware Workstation', whyWrong: 'Workstation läuft als Anwendung auf einem Desktop-Betriebssystem, also Typ 2. Das Gegenstück für Server ist ESXi (Typ 1).' },
        ],
        correct: 'a',
        explanation: 'Typ 1: ESXi, Hyper-V, KVM. Typ 2: VirtualBox, Workstation.',
      },
    },
    {
      heading: 'Container: noch leichter',
      body: `**Container** (z. B. mit **Docker**) gehen einen Schritt weiter: Sie teilen sich den **Kernel des Host-Betriebssystems** und packen nur die Anwendung mit ihren Bibliotheken ein.

| | VM | Container |
|---|---|---|
| enthält | ganzes Betriebssystem | nur App + Bibliotheken |
| Größe | Gigabytes | oft nur Megabytes |
| Start | Minuten | Sekunden |
| Isolation | sehr stark | gut, aber gemeinsamer Kernel |

Ein Container-**Image** ist eine Vorlage, aus der beliebig viele gleiche Container gestartet werden können. Das löst das Problem „Bei mir läuft es aber“: Was auf dem Laptop des Entwicklers läuft, läuft genauso auf dem Server.

Viele Container verwaltet man mit **Kubernetes** (Orchestrierung).`,
      terms: [
        { de: 'Container', en: 'container' },
        { de: 'Abbild / Vorlage', en: 'image' },
        { de: 'Orchestrierung', en: 'orchestration (z. B. Kubernetes)' },
      ],
      compare: {
        left: 'Virtuelle Maschine',
        right: 'Container',
        rows: [
          ['eigenes Betriebssystem', 'teilt den Kernel des Hosts'],
          ['startet in Minuten', 'startet in Sekunden'],
          ['GB groß', 'MB groß'],
          ['z. B. Hyper-V, ESXi', 'z. B. Docker, Kubernetes'],
        ],
      },
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Warum starten Container viel schneller als VMs?',
        options: [
          { id: 'a', text: 'Sie booten kein eigenes Betriebssystem, sondern nutzen den Kernel des Hosts.' },
          { id: 'b', text: 'Sie laufen immer in der Cloud.', whyWrong: 'Container laufen auch auf dem eigenen Laptop oder Server. Schnell sind sie, weil kein eigenes Betriebssystem hochfahren muss.' },
          { id: 'c', text: 'Sie haben keine Daten.', whyWrong: 'Container enthalten die Anwendung und ihre Bibliotheken. Sie sind schnell, weil das Betriebssystem nicht mitgestartet werden muss.' },
        ],
        correct: 'a',
        explanation: 'Kein eigener Kernel → kein Bootvorgang → Start in Sekunden.',
      },
    },
    {
      heading: 'Was ist Cloud?',
      body: `**Cloud Computing** heißt: IT-Ressourcen (Server, Speicher, Datenbanken, Software) **über das Internet nach Bedarf** mieten, statt sie selbst zu kaufen und zu betreiben.

Die fünf Merkmale nach **NIST**:
1. **Selbstbedienung** (on-demand self-service): per Klick oder API, ohne Anruf beim Anbieter
2. **Netzwerkzugriff** (broad network access): von überall über das Netz
3. **Ressourcen-Pooling**: viele Kunden teilen sich die Rechenzentren des Anbieters
4. **Elastizität** (rapid elasticity): schnell mehr oder weniger Leistung
5. **Messbarer Dienst** (measured service): Abrechnung nach Verbrauch (**pay-as-you-go**)

**Kostenmodell:**
- **CapEx** (Investitionsausgaben): Server kaufen, vorher bezahlen, über Jahre abschreiben
- **OpEx** (Betriebsausgaben): laufend nach Verbrauch zahlen – typisch für Cloud

Die großen Anbieter sind **Microsoft Azure**, **Amazon Web Services (AWS)** und **Google Cloud**.

**Skalieren:**
- **vertikal** (scale up): größere Maschine (mehr CPU/RAM)
- **horizontal** (scale out): mehr Maschinen gleicher Größe`,
      analogy: 'Cloud ist wie Strom aus der Steckdose: Du baust kein eigenes Kraftwerk, sondern zahlst nur, was du verbrauchst. Brauchst du mehr, steckst du einfach mehr ein.',
      terms: [
        { de: 'Cloud-Computing', en: 'cloud computing' },
        { de: 'Elastizität', en: 'elasticity' },
        { de: 'nutzungsbasierte Abrechnung', en: 'pay-as-you-go' },
        { de: 'Investitionsausgaben', en: 'capital expenditure (CapEx)' },
        { de: 'Betriebsausgaben', en: 'operational expenditure (OpEx)' },
        { de: 'horizontal skalieren', en: 'scale out' },
        { de: 'vertikal skalieren', en: 'scale up' },
      ],
      sources: [
        { title: 'NIST SP 800-145 – The NIST Definition of Cloud Computing', url: 'https://csrc.nist.gov/pubs/sp/800/145/final' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Ein Shop braucht nur im Dezember die dreifache Serverleistung. Welches Cloud-Merkmal hilft?',
        options: [
          { id: 'a', text: 'Elastizität' },
          { id: 'b', text: 'Ressourcen-Pooling', whyWrong: 'Pooling heißt, dass Kunden sich die Rechenzentren teilen. Dass man kurzfristig mehr und danach wieder weniger Leistung nutzt, ist Elastizität.' },
          { id: 'c', text: 'CapEx', whyWrong: 'CapEx bedeutet, Hardware vorab zu kaufen. Dann stünden die Server im Rest des Jahres ungenutzt herum. Elastizität vermeidet das.' },
        ],
        correct: 'a',
        explanation: 'Elastizität: bei Bedarf hoch, danach wieder runter – und nur das Genutzte bezahlen.',
      },
    },
    {
      heading: 'IaaS, PaaS, SaaS und wer wofür zuständig ist',
      body: `**Dienstmodelle** – je weiter rechts, desto mehr übernimmt der Anbieter:
| | IaaS | PaaS | SaaS |
|---|---|---|---|
| Name | Infrastructure as a Service | Platform as a Service | Software as a Service |
| du bekommst | VMs, Netz, Speicher | fertige Plattform für deinen Code | fertige Anwendung |
| du kümmerst dich um | Betriebssystem, Updates, App, Daten | App und Daten | nur Daten und Benutzer |
| Beispiele | Azure VMs, Amazon EC2 | Azure App Service, AWS Elastic Beanstalk | Microsoft 365, Gmail |

**Modell der geteilten Verantwortung** (shared responsibility):
- Der **Anbieter** ist immer für das Rechenzentrum, die Hardware und das physische Netz zuständig.
- Der **Kunde** ist **immer** für seine **Daten**, **Konten und Zugriffsrechte** und die Geräte seiner Benutzer zuständig – auch bei SaaS.

**Bereitstellungsmodelle:**
| Modell | bedeutet |
|---|---|
| **Public Cloud** | Rechenzentren des Anbieters, für alle Kunden |
| **Private Cloud** | nur für eine Organisation, oft im eigenen Rechenzentrum |
| **Hybrid Cloud** | Kombination aus beidem, verbunden |`,
      analogy: 'Pizza-Vergleich: On-Premises = selbst backen. IaaS = Fertigteig kaufen, belegen und backen. PaaS = Pizza bestellen, aber zu Hause essen. SaaS = im Restaurant essen.',
      terms: [
        { de: 'Infrastruktur als Dienst', en: 'Infrastructure as a Service (IaaS)' },
        { de: 'Plattform als Dienst', en: 'Platform as a Service (PaaS)' },
        { de: 'Software als Dienst', en: 'Software as a Service (SaaS)' },
        { de: 'Modell der geteilten Verantwortung', en: 'shared responsibility model' },
        { de: 'hybride Cloud', en: 'hybrid cloud' },
      ],
      sources: [
        { title: 'Microsoft Learn – Shared responsibility in the cloud', url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility' },
        { title: 'AWS – Shared Responsibility Model', url: 'https://aws.amazon.com/compliance/shared-responsibility-model/' },
      ],
      check: {
        id: 'c5', type: 'dragdrop', difficulty: 2,
        prompt: 'IaaS, PaaS oder SaaS?',
        items: [
          { id: 'vm', text: 'Virtuelle Maschine mieten, Windows selbst patchen' },
          { id: 'app', text: 'Code hochladen, Plattform kümmert sich um Server' },
          { id: 'm365', text: 'Microsoft 365 nutzen' },
        ],
        buckets: [
          { id: 'iaas', label: 'IaaS' },
          { id: 'paas', label: 'PaaS' },
          { id: 'saas', label: 'SaaS' },
        ],
        solution: { vm: 'iaas', app: 'paas', m365: 'saas' },
        explanation: 'IaaS = VM, PaaS = Plattform für Code, SaaS = fertige Software.',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Was macht ein Hypervisor?',
      options: [
        { id: 'a', text: 'Er verteilt die Hardware eines Hosts auf mehrere virtuelle Maschinen.' },
        { id: 'b', text: 'Er überwacht die Temperatur im Rechenzentrum.', whyWrong: 'Das erledigen Gebäude- und Klimasysteme. Der Hypervisor ist die Software, die VMs auf einem Host betreibt.' },
        { id: 'c', text: 'Er übersetzt Namen in IP-Adressen.', whyWrong: 'Das macht DNS. Ein Hypervisor teilt CPU, RAM und Speicher eines Hosts auf VMs auf.' },
        { id: 'd', text: 'Er ist ein besonders schneller Router.', whyWrong: 'Router leiten Pakete zwischen Netzen. Der Hypervisor ist die Virtualisierungsschicht für VMs.' },
      ],
      correct: 'a',
      explanation: 'Hypervisor = Software zwischen Hardware und VMs.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 2,
      prompt: 'Typ 1 oder Typ 2?',
      items: [
        { id: 'esxi', text: 'VMware ESXi' },
        { id: 'hv', text: 'Microsoft Hyper-V' },
        { id: 'vb', text: 'Oracle VirtualBox' },
        { id: 'ws', text: 'VMware Workstation' },
      ],
      buckets: [
        { id: 't1', label: 'Typ 1 (bare metal)' },
        { id: 't2', label: 'Typ 2 (hosted)' },
      ],
      solution: { esxi: 't1', hv: 't1', vb: 't2', ws: 't2' },
      explanation: 'Typ 1 läuft direkt auf der Hardware, Typ 2 als Programm.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Was ist ein Snapshot einer VM?',
      options: [
        { id: 'a', text: 'Ein gespeicherter Zustand, zu dem man zurückkehren kann' },
        { id: 'b', text: 'Ein Bildschirmfoto der VM', whyWrong: 'Der Name klingt so, aber ein Snapshot sichert Festplatten- und ggf. Arbeitsspeicherzustand der VM, nicht nur das Bild.' },
        { id: 'c', text: 'Ein vollwertiges Backup an einem anderen Ort', whyWrong: 'Ein Snapshot liegt auf demselben Speicher wie die VM und hängt von ihr ab. Fällt der Speicher aus, ist er mit weg. Er ersetzt kein Backup.' },
      ],
      correct: 'a',
      explanation: 'Snapshot = schneller Rücksprungpunkt, z. B. vor Updates. Kein Ersatz für ein Backup.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Was teilen sich alle Container auf einem Host?',
      options: [
        { id: 'a', text: 'Den Kernel des Host-Betriebssystems' },
        { id: 'b', text: 'Ihre Anwendungsdaten', whyWrong: 'Jeder Container hat sein eigenes Dateisystem. Gemeinsam ist der Kernel des Hosts.' },
        { id: 'c', text: 'Nichts, jeder hat sein eigenes Betriebssystem', whyWrong: 'Das wäre eine VM. Container sparen genau das ein und teilen sich den Kernel des Hosts.' },
      ],
      correct: 'a',
      explanation: 'Gemeinsamer Kernel = klein und schnell, aber etwas schwächere Isolation als VMs.',
    },
    {
      id: 'q5', type: 'multi', difficulty: 2,
      prompt: 'Welche Merkmale gehören laut NIST zu Cloud Computing?',
      options: [
        { id: 'a', text: 'Selbstbedienung nach Bedarf' },
        { id: 'b', text: 'Elastizität' },
        { id: 'c', text: 'Messbarer Dienst (Abrechnung nach Verbrauch)' },
        { id: 'd', text: 'Ressourcen-Pooling' },
        { id: 'e', text: 'Hardware steht immer im eigenen Keller', whyWrong: 'Bei der Public Cloud steht die Hardware im Rechenzentrum des Anbieters. Der Kunde sieht sie nie.' },
      ],
      correct: ['a', 'b', 'c', 'd'],
      explanation: 'Dazu kommt noch: breiter Netzwerkzugriff.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Eine Firma kauft Server für 50.000 € und schreibt sie über 5 Jahre ab. Welches Kostenmodell ist das?',
      options: [
        { id: 'a', text: 'CapEx (Investitionsausgaben)' },
        { id: 'b', text: 'OpEx (Betriebsausgaben)', whyWrong: 'OpEx sind laufende Kosten nach Verbrauch, z. B. die monatliche Cloud-Rechnung. Ein Hardwarekauf vorab ist CapEx.' },
        { id: 'c', text: 'Pay-as-you-go', whyWrong: 'Pay-as-you-go heißt, nur den tatsächlichen Verbrauch zu bezahlen. Hier wird vorab gekauft: CapEx.' },
      ],
      correct: 'a',
      explanation: 'Kaufen = CapEx, Mieten nach Verbrauch = OpEx.',
    },
    {
      id: 'q7', type: 'dragdrop', difficulty: 2,
      prompt: 'Welches Dienstmodell?',
      items: [
        { id: 'ec2', text: 'Amazon EC2' },
        { id: 'azvm', text: 'Azure Virtual Machines' },
        { id: 'appsvc', text: 'Azure App Service' },
        { id: 'gmail', text: 'Gmail' },
        { id: 'm365', text: 'Microsoft 365' },
      ],
      buckets: [
        { id: 'iaas', label: 'IaaS' },
        { id: 'paas', label: 'PaaS' },
        { id: 'saas', label: 'SaaS' },
      ],
      solution: { ec2: 'iaas', azvm: 'iaas', appsvc: 'paas', gmail: 'saas', m365: 'saas' },
      explanation: 'VMs = IaaS, Plattform für Code = PaaS, fertige Anwendung = SaaS.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Wer ist bei SaaS (z. B. Microsoft 365) für die Benutzerkonten und deren Rechte verantwortlich?',
      options: [
        { id: 'a', text: 'Der Kunde' },
        { id: 'b', text: 'Der Anbieter', whyWrong: 'Der Anbieter betreibt die Software, aber wer welche Rechte bekommt und ob MFA aktiv ist, entscheidet der Kunde. Identitäten und Daten bleiben immer Kundensache.' },
        { id: 'c', text: 'Niemand, das regelt sich automatisch', whyWrong: 'Rechte und Konten müssen aktiv verwaltet werden. Laut Modell der geteilten Verantwortung ist das immer Aufgabe des Kunden.' },
      ],
      correct: 'a',
      explanation: 'Immer beim Kunden: Daten, Identitäten/Konten, Endgeräte.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Ein Webshop startet bei Last automatisch weitere gleich große Server. Wie heißt das?',
      options: [
        { id: 'a', text: 'Horizontal skalieren (scale out)' },
        { id: 'b', text: 'Vertikal skalieren (scale up)', whyWrong: 'Vertikal heißt, eine Maschine größer zu machen (mehr CPU/RAM). Mehr Maschinen gleicher Größe ist horizontal.' },
        { id: 'c', text: 'Virtualisieren', whyWrong: 'Virtualisierung ist die Technik, VMs zu betreiben. Das Hinzufügen weiterer Server bei Last heißt horizontal skalieren.' },
      ],
      correct: 'a',
      explanation: 'Scale out = mehr Instanzen, scale up = größere Instanz.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Eine Firma betreibt sensible Daten im eigenen Rechenzentrum und ihre Webseite in Azure, beides verbunden. Welches Bereitstellungsmodell ist das?',
      options: [
        { id: 'a', text: 'Hybrid Cloud' },
        { id: 'b', text: 'Public Cloud', whyWrong: 'Bei reiner Public Cloud läge alles beim Anbieter. Hier ist ein Teil im eigenen Rechenzentrum: hybrid.' },
        { id: 'c', text: 'Private Cloud', whyWrong: 'Private Cloud wäre nur das eigene Rechenzentrum. Mit Azure dazu ist es eine Kombination: Hybrid Cloud.' },
      ],
      correct: 'a',
      explanation: 'Hybrid = On-Premises/Private + Public, miteinander verbunden.',
    },
    {
      id: 'q11', type: 'single', difficulty: 1,
      prompt: 'Wofür steht USV im Rechenzentrum?',
      options: [
        { id: 'a', text: 'Unterbrechungsfreie Stromversorgung – überbrückt Stromausfälle mit Akkus' },
        { id: 'b', text: 'Universeller Server-Verteiler', whyWrong: 'Den Begriff gibt es so nicht. USV ist die unterbrechungsfreie Stromversorgung (englisch UPS).' },
        { id: 'c', text: 'Ein Netzwerkprotokoll', whyWrong: 'USV ist ein Gerät mit Akkus, das bei Stromausfall die Versorgung übernimmt, bis Generatoren laufen oder die Server sauber herunterfahren.' },
      ],
      correct: 'a',
      explanation: 'USV (UPS) überbrückt Sekunden bis Minuten, Generatoren übernehmen längere Ausfälle.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Wozu dient RAID 1 in einem Server?',
      options: [
        { id: 'a', text: 'Daten werden auf zwei Platten gespiegelt, fällt eine aus, läuft der Server weiter.' },
        { id: 'b', text: 'Es ersetzt ein Backup.', whyWrong: 'RAID schützt nur vor Plattenausfall. Gelöschte oder verschlüsselte Dateien (Ransomware) werden sofort auf beide Platten übertragen. Ein Backup bleibt Pflicht.' },
        { id: 'c', text: 'Es verdoppelt den nutzbaren Speicher.', whyWrong: 'Bei RAID 1 steht nur die Kapazität einer Platte zur Verfügung, weil die zweite eine Kopie ist.' },
      ],
      correct: 'a',
      explanation: 'RAID = Verfügbarkeit, kein Backup.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Welches Problem lösen Container-Images besonders gut?',
      options: [
        { id: 'a', text: '„Bei mir läuft es aber“: gleiche Umgebung auf Laptop, Test und Server' },
        { id: 'b', text: 'Stromausfälle im Rechenzentrum', whyWrong: 'Stromausfälle fängt eine USV ab. Container sorgen dafür, dass eine Anwendung überall mit denselben Bibliotheken läuft.' },
        { id: 'c', text: 'Fehlende Internetverbindung', whyWrong: 'Container brauchen fürs Herunterladen der Images oft Internet, lösen aber kein Verbindungsproblem. Ihr Vorteil ist die identische Laufzeitumgebung.' },
      ],
      correct: 'a',
      explanation: 'Image = App + Abhängigkeiten in einem Paket, überall gleich.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Wer ist bei IaaS für Sicherheitsupdates des Betriebssystems in der VM zuständig?',
      options: [
        { id: 'a', text: 'Der Kunde' },
        { id: 'b', text: 'Der Cloud-Anbieter', whyWrong: 'Bei IaaS stellt der Anbieter nur Hardware, Netz und Hypervisor. Das Gast-Betriebssystem verwaltet der Kunde selbst, inklusive Updates.' },
        { id: 'c', text: 'Microsoft, wenn Windows läuft, sonst niemand', whyWrong: 'Microsoft liefert die Updates, installieren und planen muss sie aber der Kunde in seiner VM. Bei Linux gilt dasselbe.' },
      ],
      correct: 'a',
      explanation: 'IaaS: Betriebssystem und alles darüber = Kunde. Bei PaaS übernimmt der Anbieter das OS.',
    },
    {
      id: 'q15', type: 'ordering', difficulty: 2,
      prompt: 'Ordne nach „Wie viel muss der Kunde selbst verwalten?“ – von am meisten zu am wenigsten.',
      items: [
        { id: 'onprem', text: 'On-Premises' },
        { id: 'iaas', text: 'IaaS' },
        { id: 'paas', text: 'PaaS' },
        { id: 'saas', text: 'SaaS' },
      ],
      explanation: 'On-Prem: alles selbst. SaaS: nur Daten, Benutzer, Geräte.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Welche Lösung passt am besten?',
        scenario: 'Ein Start-up will eine Web-App veröffentlichen. Es hat zwei Entwickler und keinen Administrator. Niemand will sich um Betriebssystem-Updates oder Server kümmern. Die App ist in Python geschrieben.',
        options: [
          { id: 'a', text: 'PaaS, z. B. Azure App Service' },
          { id: 'b', text: 'IaaS-VM mit selbst installiertem Webserver', whyWrong: 'Bei IaaS müsste das Team Betriebssystem, Updates und Webserver selbst pflegen. Genau das will es ohne Administrator vermeiden.' },
          { id: 'c', text: 'Eigener Server im Büro', whyWrong: 'On-Premises bedeutet Hardware, Strom, Kühlung, Updates und Internetanbindung selbst zu stemmen. Für ein kleines Team ohne Admin ist das die aufwendigste Lösung.' },
          { id: 'd', text: 'SaaS, z. B. Microsoft 365', whyWrong: 'SaaS ist fertige Software für Endnutzer. Eigenen Python-Code kann man darin nicht betreiben. Dafür braucht man eine Plattform: PaaS.' },
        ],
        correct: 'a',
        explanation: 'PaaS: Code hochladen, Anbieter kümmert sich um Server und OS.',
      },
      {
        id: 'b2', type: 'multi', difficulty: 3,
        prompt: 'Welche Aufgaben bleiben laut Modell der geteilten Verantwortung bei JEDEM Dienstmodell beim Kunden?',
        options: [
          { id: 'a', text: 'Schutz der eigenen Daten' },
          { id: 'b', text: 'Verwaltung von Konten und Zugriffsrechten' },
          { id: 'c', text: 'Sicherheit der Endgeräte der Benutzer' },
          { id: 'd', text: 'Physische Sicherheit des Rechenzentrums', whyWrong: 'Rechenzentrum, Hardware und physisches Netz liegen in der Public Cloud immer beim Anbieter.' },
          { id: 'e', text: 'Patchen des Hypervisors', whyWrong: 'Den Hypervisor betreibt der Cloud-Anbieter. Kunden haben darauf gar keinen Zugriff.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Daten, Identitäten und Endgeräte sind immer Kundensache.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        prompt: 'Was ist der beste Rat?',
        scenario: 'Ein Admin sagt: „Unser Dateiserver läuft als VM mit RAID 1 und täglichen Snapshots auf demselben Speicher. Ein Backup brauchen wir nicht.“',
        options: [
          { id: 'a', text: 'Widersprechen: RAID und Snapshots schützen nicht vor Totalausfall des Speichers, Ransomware oder Brand. Ein getrenntes Backup ist nötig.' },
          { id: 'b', text: 'Zustimmen: RAID plus Snapshots reichen.', whyWrong: 'Snapshots liegen auf demselben Speicher. Fällt der aus oder verschlüsselt Ransomware alles, sind VM, Snapshots und Spiegel gleichzeitig weg.' },
          { id: 'c', text: 'Zustimmen, aber auf RAID 0 umstellen.', whyWrong: 'RAID 0 verteilt Daten ohne Redundanz. Fällt eine Platte aus, ist alles weg. Das macht es schlimmer, nicht besser.' },
        ],
        correct: 'a',
        explanation: 'Backup = eigene Kopie an anderem Ort, idealerweise offline oder unveränderlich.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Ein Datenbankserver in der Cloud ist am Limit. Die Software kann nur auf einem Server laufen. Was tust du?',
        options: [
          { id: 'a', text: 'Vertikal skalieren: eine größere VM-Größe wählen' },
          { id: 'b', text: 'Horizontal skalieren: weitere Datenbankserver starten', whyWrong: 'Horizontal skalieren hilft nur, wenn die Software auf mehrere Server verteilt werden kann. Hier geht nur ein Server, also bleibt eine größere Maschine.' },
          { id: 'c', text: 'Einen Snapshot erstellen', whyWrong: 'Ein Snapshot sichert den Zustand, bringt aber keine zusätzliche Leistung.' },
          { id: 'd', text: 'Auf einen Typ-2-Hypervisor wechseln', whyWrong: 'Typ-2-Hypervisoren laufen auf einem Desktop-Betriebssystem und sind eher langsamer. In der Cloud wählt man die VM-Größe, der Hypervisor ist Sache des Anbieters.' },
        ],
        correct: 'a',
        explanation: 'Nur ein Server möglich → scale up. Mehrere möglich → scale out.',
      },
      {
        id: 'b5', type: 'dragdrop', difficulty: 3,
        prompt: 'Wer ist bei IaaS zuständig?',
        items: [
          { id: 'hw', text: 'Physische Server und Rechenzentrum' },
          { id: 'hyp', text: 'Hypervisor' },
          { id: 'os', text: 'Betriebssystem der VM patchen' },
          { id: 'fw', text: 'Firewall-Regeln für die VM' },
          { id: 'data', text: 'Daten und Backups' },
        ],
        buckets: [
          { id: 'prov', label: 'Anbieter' },
          { id: 'cust', label: 'Kunde' },
        ],
        solution: { hw: 'prov', hyp: 'prov', os: 'cust', fw: 'cust', data: 'cust' },
        explanation: 'IaaS: Anbieter bis zum Hypervisor, Kunde ab dem Betriebssystem aufwärts.',
      },
    ],
  },
};

export default level;
