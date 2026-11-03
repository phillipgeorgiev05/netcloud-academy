import type { Level } from '../../types/content';

const level: Level = {
  id: 'cloud-02',
  track: 'cloud',
  order: 2,
  title: 'Virtualisierung & Hypervisor',
  titleEn: 'Virtualization & Hypervisors',
  summary: 'Hypervisor Typ 1 und Typ 2, Bausteine einer VM, virtuelle Netzwerke, Snapshots, Live-Migration, VMs vs. Container und wie Azure und AWS virtualisieren.',
  certs: ['az900', 'az104', 'aws-saa', 'netplus', 'fisi'],
  domains: { az900: 'architecture', az104: 'compute', netplus: '1', fisi: 'ap2-admin' },
  lab: {
    title: 'Erste VM mit VirtualBox',
    needs: 'Oracle VirtualBox (kostenlos) und ein Linux-ISO, z. B. Ubuntu Server',
    steps: [
      'Prüfe, ob Hardware-Virtualisierung aktiv ist: Windows Task-Manager → Leistung → CPU → „Virtualisierung: Aktiviert“.',
      'Lege eine VM an: 2 vCPUs, 2 GB RAM, 20 GB **dynamisch** wachsende Disk (Thin Provisioning). Installiere Linux.',
      'Erstelle einen Snapshot „frisch installiert“.',
      'Wechsle den Netzwerkmodus von NAT auf **Netzwerkbrücke (Bridged)** und prüfe mit `ip addr`, ob die VM eine Adresse aus deinem Heimnetz bekommt.',
      'Lege in der VM eine Datei an, stelle den Snapshot wieder her: Ist die Datei weg?',
      'Lösche den Snapshot danach wieder. Snapshots sind Rücksprungpunkte, keine Backups.',
    ],
  },
  lesson: [
    {
      heading: 'Was ist Virtualisierung?',
      body: `Virtualisierung trennt Software von der physischen Hardware. Ein **Hypervisor** (auch Virtual Machine Monitor, VMM) teilt einen physischen Server (**Host**) in mehrere **virtuelle Maschinen (VMs)** auf, die **Gäste** (guests). Jede VM hat ihr eigenes Betriebssystem und glaubt, eigene Hardware zu besitzen.

Vorteile:
- **Konsolidierung:** viele schwach ausgelastete Server auf wenigen Hosts, das spart Strom, Platz und Hardware
- **Isolation:** Stürzt eine VM ab, laufen die anderen weiter
- **Flexibilität:** VMs in Minuten erstellen, klonen, verschieben, sichern
- **Grundlage der Cloud:** Ohne Virtualisierung gäbe es kein IaaS

Moderne CPUs unterstützen Virtualisierung in Hardware: **Intel VT-x** bzw. **AMD-V**, dazu **SLAT** (Second Level Address Translation: Intel EPT, AMD RVI/NPT) für schnelle Speicherübersetzung. Diese Funktionen müssen oft im BIOS/UEFI aktiviert werden.`,
      analogy: 'Ein Host mit VMs ist wie ein Mehrfamilienhaus: ein Gebäude (Hardware), aber jede Wohnung (VM) hat eigene Tür, Küche und Klingel (OS). Der Hausverwalter (Hypervisor) verteilt Strom und Wasser.',
      terms: [
        { de: 'Gastgeber / Gast', en: 'host / guest' },
        { de: 'Virtuelle Maschine', en: 'virtual machine (VM)' },
        { de: 'Hardwareunterstützte Virtualisierung', en: 'hardware-assisted virtualization' },
      ],
    },
    {
      heading: 'Hypervisor-Typen',
      body: `| | Typ 1 (bare metal) | Typ 2 (hosted) |
|---|---|---|
| läuft auf | direkt auf der Hardware | als Programm auf einem Host-Betriebssystem |
| Beispiele | VMware ESXi, Microsoft Hyper-V, KVM, Xen | Oracle VirtualBox, VMware Workstation, Parallels Desktop |
| Einsatz | Rechenzentrum, Cloud | Desktop, Labor, Entwicklung |
| Leistung | hoch, wenig Overhead | geringer, Host-OS liegt dazwischen |

Sonderfälle, die gern abgefragt werden:
- **Hyper-V** ist auch unter Windows 11 Pro ein **Typ-1**-Hypervisor. Nach der Aktivierung läuft Hyper-V direkt auf der Hardware, und Windows selbst wird zur privilegierten „Root-Partition“.
- **KVM** ist ein Modul im Linux-Kernel und macht Linux selbst zum Hypervisor, daher wird es als Typ 1 eingeordnet.

**Paravirtualisierung:** Der Gast weiß, dass er virtualisiert ist, und nutzt optimierte Treiber (z. B. **virtio** bei KVM, Hyper-V Integration Services, VMware Tools). Das bringt mehr Leistung bei Netzwerk- und Disk-Zugriffen.`,
      terms: [{ de: 'Hypervisor auf blanker Hardware', en: 'bare-metal (Type 1) hypervisor' }],
    },
    {
      heading: 'Bausteine einer VM',
      body: `- **vCPU:** virtuelle CPU-Kerne, die der Hypervisor auf physische Kerne verteilt. Mehr vCPUs als physische Kerne heißt **Overcommitment** (z. B. 4:1). Das funktioniert, solange nicht alle gleichzeitig voll rechnen.
- **vRAM:** Auch RAM lässt sich überbuchen, z. B. mit Hyper-V **Dynamic Memory** oder VMware **Ballooning**. Zu viel Überbuchung führt zu Swapping und macht alles langsam.
- **Virtuelle Festplatte:** eine Datei auf dem Host-Speicher. Formate: **VMDK** (VMware), **VHD/VHDX** (Hyper-V, Azure nutzt VHD), **qcow2** (KVM/QEMU).
  - **Thin Provisioning:** Die Datei wächst erst bei Bedarf. Spart Platz, aber der Datenspeicher kann überlaufen, wenn alle VMs gleichzeitig wachsen.
  - **Thick Provisioning:** Der volle Platz wird sofort reserviert. Planbar, aber verschwenderisch.
- **vNIC:** virtuelle Netzwerkkarte mit eigener MAC-Adresse, verbunden mit einem **virtuellen Switch**.`,
      analogy: 'Overcommitment ist wie ein Fitnessstudio mit 1000 Mitgliedern und 100 Geräten: Es klappt, weil nie alle gleichzeitig trainieren. Am Montagabend um 18 Uhr wird es eng.',
      terms: [
        { de: 'Überbuchung', en: 'overcommitment' },
        { de: 'Bedarfsgerechte Speicherzuweisung', en: 'thin provisioning' },
      ],
    },
    {
      heading: 'Virtuelle Netzwerke',
      body: `Ein **virtueller Switch (vSwitch)** arbeitet im Hypervisor wie ein Layer-2-Switch und verbindet die vNICs der VMs untereinander und optional mit der physischen Netzwerkkarte (Uplink). vSwitches können **VLAN-Tags (802.1Q)** setzen.

**Hyper-V-Switch-Typen:**
| Typ | Verbindung |
|---|---|
| External | VMs ↔ Host ↔ physisches Netz |
| Internal | VMs ↔ Host, **kein** physisches Netz |
| Private | nur VMs untereinander |

**VirtualBox-Netzwerkmodi:**
- **NAT** (Standard): VM kommt ins Internet, ist von außen aber nicht erreichbar
- **Bridged:** VM hängt direkt im physischen LAN und bekommt dort eine IP (z. B. vom Router per DHCP)
- **Host-only:** nur VM ↔ Host
- **Internal Network:** nur VMs untereinander

**NFV** (Network Functions Virtualization) heißt: Router, Firewalls und Load Balancer laufen als VMs statt als eigene Hardware. Das ist die Basis vieler Cloud-Netzwerkdienste.`,
      terms: [
        { de: 'Netzwerkfunktions-Virtualisierung', en: 'Network Functions Virtualization (NFV)' },
        { de: 'Netzwerkbrücke', en: 'bridged networking' },
      ],
    },
    {
      heading: 'Betrieb: Snapshots, Migration, Hochverfügbarkeit',
      body: `- **Snapshot / Checkpoint:** friert den Zustand einer VM ein. Ab dann werden Änderungen in eine Delta-Datei geschrieben. Ideal **kurz vor einem Update**, um schnell zurückzurollen.
- **Vorlage / Golden Image:** vorkonfiguriertes, gepatchtes Image, aus dem neue VMs geklont werden.
- **Live-Migration:** eine laufende VM ohne Ausfallzeit auf einen anderen Host verschieben (VMware **vMotion**, Hyper-V **Live Migration**). Typisch für Hardware-Wartung.
- **HA-Cluster:** Fällt ein Host aus, werden seine VMs automatisch auf anderen Hosts **neu gestartet**. Das ist ein kurzer Ausfall, kein unterbrechungsfreier Betrieb.
- **Nested Virtualization:** ein Hypervisor in einer VM, z. B. für Labs.

**Ein Snapshot ist kein Backup!** Er liegt auf demselben Speicher und hängt von der Basis-Disk ab. Ist der Speicher defekt, sind beide weg. Viele alte Snapshots kosten außerdem Leistung und Platz.`,
      analogy: 'Ein Snapshot ist wie ein Lesezeichen in einem Buch: Du kommst schnell zurück zur Stelle. Brennt das Buch, ist das Lesezeichen mit verbrannt. Ein Backup ist eine Kopie des Buchs in einem anderen Haus.',
      terms: [
        { de: 'Momentaufnahme', en: 'snapshot / checkpoint' },
        { de: 'Live-Migration', en: 'live migration (vMotion)' },
      ],
    },
    {
      heading: 'VMs vs. Container',
      body: `| | Virtuelle Maschine | Container |
|---|---|---|
| virtualisiert | Hardware | Betriebssystem |
| eigener Kernel | ja, volles Gast-OS | nein, **teilt den Kernel des Hosts** |
| Größe | GB | MB |
| Start | Minuten (OS bootet) | Sekunden |
| Isolation | stark | schwächer (gemeinsamer Kernel) |
| Beispiel | Windows-Server-VM | Docker-Container mit Nginx |

Ein Linux-Container braucht einen Linux-Kernel. Auf einem Windows-Host läuft er deshalb in einer leichten Linux-VM (z. B. Docker Desktop mit WSL 2). In der Praxis werden beide kombiniert: Container laufen auf VMs, z. B. Kubernetes-Knoten in AKS/EKS. Mehr dazu in Level B7.`,
      analogy: 'VMs sind Einfamilienhäuser: jedes mit eigenem Fundament. Container sind Wohnungen in einem Haus: Sie teilen sich Fundament und Leitungen (Kernel), sind aber schneller bezogen.',
    },
    {
      heading: 'Virtualisierung in der Cloud',
      body: `- **Azure** nutzt einen angepassten **Hyper-V**-basierten Hypervisor.
- **AWS** nutzt das **Nitro-System**: Ein schlanker Hypervisor auf Basis von **KVM**, Netzwerk, Speicher und Sicherheit sind auf eigene Nitro-Karten (Hardware) ausgelagert. Ältere EC2-Generationen liefen auf **Xen**.
- Standard ist **geteilte Hardware** (Multi-Tenancy). Für Compliance oder Lizenzen pro physischem Kern/Socket (BYOL) gibt es **Azure Dedicated Host** bzw. **AWS Dedicated Hosts**: ein physischer Server nur für dich.
- **VM-Größen** werden nach Einsatzzweck gewählt, z. B. Azure **B**-Serie (burstable, günstig), **D** (allgemein), **E** (speicheroptimiert), **F** (rechenoptimiert), **N** (GPU). Bei AWS: Instanzfamilien wie t (burstable), m (allgemein), r (Speicher), c (Rechenleistung).

**Kostenfalle Azure:** Eine VM, die im Gast-OS heruntergefahren oder mit \`az vm stop\` gestoppt wird, ist „Stopped“ und **kostet weiter Compute**. Erst **„Stopped (deallocated)“** (\`az vm deallocate\` oder „Beenden“ im Portal) gibt die Hardware frei. Dann zahlst du nur noch Disks und ggf. statische IPs. Bei **AWS** kostet eine gestoppte EC2-Instanz keine Compute-Gebühren mehr, EBS-Volumes werden aber weiter berechnet.`,
      terms: [
        { de: 'Dedizierter Host', en: 'dedicated host' },
        { de: 'Eigene Lizenz mitbringen', en: 'Bring Your Own License (BYOL)' },
        { de: 'Freigegeben (Azure)', en: 'deallocated' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'dragdrop', difficulty: 1,
      prompt: 'Ordne die Produkte dem richtigen **Hypervisor-Typ** zu.',
      items: [
        { id: 'esxi', text: 'VMware ESXi' },
        { id: 'hyperv', text: 'Microsoft Hyper-V' },
        { id: 'kvm', text: 'KVM' },
        { id: 'vbox', text: 'Oracle VirtualBox' },
        { id: 'ws', text: 'VMware Workstation' },
        { id: 'par', text: 'Parallels Desktop' },
      ],
      buckets: [
        { id: 't1', label: 'Typ 1 (bare metal)' },
        { id: 't2', label: 'Typ 2 (hosted)' },
      ],
      solution: { esxi: 't1', hyperv: 't1', kvm: 't1', vbox: 't2', ws: 't2', par: 't2' },
      explanation: 'Typ 1 läuft direkt auf der Hardware (Rechenzentrum/Cloud). Typ 2 ist eine Anwendung auf einem normalen Desktop-Betriebssystem.',
    },
    {
      id: 'q2', type: 'single', difficulty: 2,
      prompt: 'Du aktivierst Hyper-V auf einem Windows-11-Pro-Laptop. Welcher Hypervisor-Typ läuft danach?',
      options: [
        { id: 'a', text: 'Typ 1 – Hyper-V läuft direkt auf der Hardware, Windows wird zur Root-Partition.' },
        { id: 'b', text: 'Typ 2 – Hyper-V ist ja eine Windows-Funktion.', whyWrong: 'Man schaltet Hyper-V zwar als Windows-Funktion ein, beim nächsten Start lädt aber zuerst der Hypervisor direkt auf der Hardware. Windows läuft danach selbst als privilegierte Root-Partition darüber. Ein Typ-2-Hypervisor wie VirtualBox wäre dagegen nur ein Programm im laufenden Windows.' },
        { id: 'c', text: 'Gar keiner, Hyper-V gibt es nur auf Windows Server.', whyWrong: 'Hyper-V gibt es nicht nur auf Windows Server. Es steckt auch in Windows 10/11 Pro, Enterprise und Education, nur nicht in der Home-Edition. Dort ist es derselbe Typ-1-Hypervisor wie auf dem Server.' },
        { id: 'd', text: 'Ein Container-Runtime', whyWrong: 'Eine Container-Runtime (z. B. containerd) startet Container, die sich den Kernel des Hosts teilen. Hyper-V ist ein Hypervisor und startet komplette VMs mit eigenem Betriebssystem. Docker Desktop kann Hyper-V allerdings als Unterbau für seine Linux-VM nutzen.' },
      ],
      correct: 'a',
      explanation: 'Das ist eine klassische Prüfungsfalle: Hyper-V ist immer Typ 1, egal ob auf Windows Server oder Windows 11.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Welche CPU-Funktionen müssen für hardwareunterstützte Virtualisierung meist im BIOS/UEFI aktiviert sein?',
      options: [
        { id: 'a', text: 'Intel VT-x bzw. AMD-V' },
        { id: 'b', text: 'Hyper-Threading', whyWrong: 'Hyper-Threading (SMT) lässt einen physischen Kern als zwei logische Kerne erscheinen. Das bringt mehr Durchsatz, hat aber mit Virtualisierung nichts zu tun. Für Hypervisoren müssen Intel VT-x bzw. AMD-V eingeschaltet sein.' },
        { id: 'c', text: 'Secure Boot', whyWrong: 'Secure Boot prüft beim Start, ob Bootloader und Kernel signiert sind, und schützt so vor Bootkits. Für Virtualisierung braucht man es nicht. Nötig sind die CPU-Erweiterungen Intel VT-x bzw. AMD-V.' },
        { id: 'd', text: 'Turbo Boost', whyWrong: 'Turbo Boost erhöht kurzzeitig den Takt einzelner Kerne. VMs laufen auch ohne ihn. Ohne VT-x bzw. AMD-V starten moderne Hypervisoren dagegen gar nicht oder nur stark eingeschränkt.' },
      ],
      correct: 'a',
      explanation: 'VT-x/AMD-V erlauben dem Hypervisor, Gast-Code effizient direkt auf der CPU auszuführen. Fehlt die Funktion, verweigern Hyper-V und viele andere Hypervisoren den Start von VMs.',
    },
    {
      id: 'q4', type: 'single', difficulty: 1,
      prompt: 'Was ist der wichtigste Unterschied zwischen **Container** und **VM**?',
      options: [
        { id: 'a', text: 'Container teilen sich den Kernel des Host-Betriebssystems, VMs haben jeweils ein eigenes OS mit eigenem Kernel.' },
        { id: 'b', text: 'Container laufen nur in der Cloud.', whyWrong: 'Container laufen überall, wo eine Container-Runtime und ein passender Kernel vorhanden sind: auf dem Laptop (Docker Desktop), im eigenen Rechenzentrum oder in der Cloud. Der wichtigste Unterschied zur VM ist der geteilte Kernel.' },
        { id: 'c', text: 'VMs starten schneller als Container.', whyWrong: 'Genau umgekehrt. Ein Container ist nur ein abgeschotteter Prozess und startet in Sekunden oder schneller. Eine VM muss erst ein ganzes Betriebssystem booten, das dauert deutlich länger.' },
        { id: 'd', text: 'Container brauchen keinen Host.', whyWrong: 'Container sind Prozesse auf einem Host und nutzen dessen Kernel. Ohne Host mit passendem Kernel (für Linux-Container also ein Linux-Kernel) und Runtime läuft kein Container. Gerade das unterscheidet sie von VMs, die ihr eigenes OS mitbringen.' },
      ],
      correct: 'a',
      explanation: 'VMs virtualisieren die Hardware, Container das Betriebssystem. Deshalb sind Container kleiner und schneller, aber weniger stark isoliert.',
      analogy: 'VMs = Einfamilienhäuser mit eigenem Fundament. Container = Wohnungen in einem Haus mit gemeinsamem Fundament (Kernel).',
    },
    {
      id: 'q5', type: 'scenario', difficulty: 2,
      scenario: 'Ein Admin will morgen ein großes Update auf einer Server-VM einspielen. Er sagt: „Ich mache vorher einen Snapshot, dann brauchen wir für diese VM kein Backup mehr.“',
      prompt: 'Was antwortest du?',
      options: [
        { id: 'a', text: 'Snapshot vor dem Update ist gut, ersetzt aber kein Backup: Er liegt auf demselben Speicher und hängt von der Basis-Disk ab.' },
        { id: 'b', text: 'Stimmt, ein Snapshot ist ein vollständiges Backup.', whyWrong: 'Ein Snapshot ist keine Kopie. Ab dem Snapshot schreibt die VM nur Änderungen in eine Delta-Datei, und die Basis-Disk wird eingefroren. Beide liegen meist auf demselben Speicher. Fällt der aus oder geht die Basis-Disk kaputt, ist auch der Snapshot wertlos.' },
        { id: 'c', text: 'Snapshots sollte man nie verwenden.', whyWrong: 'Für kurzfristiges Zurückrollen, etwa vor einem Update, sind Snapshots genau das richtige Werkzeug. Man darf sie nur nicht lange behalten und nicht mit einem Backup verwechseln.' },
        { id: 'd', text: 'Snapshots funktionieren nur bei ausgeschalteten VMs.', whyWrong: 'Snapshots gehen auch im laufenden Betrieb. Optional sichern sie sogar den RAM-Inhalt, damit man zum exakten laufenden Zustand zurückkehren kann. Auch das macht sie aber nicht zum Backup.' },
      ],
      correct: 'a',
      explanation: 'Snapshots sind kurzlebige Rücksprungpunkte. Backups sind unabhängige Kopien an einem anderen Ort (3-2-1-Regel, dazu mehr in B9). Snapshots nach dem erfolgreichen Update wieder löschen, sonst wachsen die Delta-Dateien.',
      analogy: 'Ein Snapshot ist ein Lesezeichen im Buch, ein Backup eine Kopie des Buchs in einem anderen Haus.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Ein Host hat 16 physische Kerne. Darauf laufen VMs mit zusammen 48 vCPUs. Wie nennt man das?',
      options: [
        { id: 'a', text: 'CPU-Overcommitment (hier 3:1)' },
        { id: 'b', text: 'Thin Provisioning', whyWrong: 'Thin Provisioning betrifft Festplatten: Einer VM wird z. B. eine 500-GB-Disk zugesagt, belegt wird aber nur, was sie wirklich schreibt. Hier geht es um CPUs. Mehr vCPUs zugeteilt, als physische Kerne da sind, heißt CPU-Overcommitment.' },
        { id: 'c', text: 'Live-Migration', whyWrong: 'Live-Migration verschiebt eine laufende VM ohne Unterbrechung auf einen anderen Host. Mit dem Verhältnis von vCPUs zu Kernen hat das nichts zu tun. 48 vCPUs auf 16 Kernen ist Overcommitment im Verhältnis 3:1.' },
        { id: 'd', text: 'Ein Konfigurationsfehler, das ist unmöglich', whyWrong: 'Overcommitment ist üblich und gewollt. Die meisten VMs nutzen ihre CPUs nur selten voll. Der Hypervisor verteilt die Rechenzeit auf die physischen Kerne. Probleme gibt es nur, wenn viele VMs gleichzeitig Last haben (CPU Ready steigt).' },
      ],
      correct: 'a',
      explanation: '48 vCPUs / 16 Kerne = 3:1. Der Hypervisor teilt die echten Kerne zeitlich auf. Bei hoher gleichzeitiger Last steigt die Wartezeit (CPU Ready).',
    },
    {
      id: 'q7', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Eigenschaften zu.',
      items: [
        { id: 'i1', text: 'Eigener Kernel pro Instanz' },
        { id: 'i2', text: 'Startet in Sekunden' },
        { id: 'i3', text: 'Größe typischerweise in GB' },
        { id: 'i4', text: 'Teilt den Host-Kernel' },
        { id: 'i5', text: 'Kann ein anderes OS als der Host ausführen (z. B. Windows auf Linux-Host)' },
        { id: 'i6', text: 'Image typischerweise in MB' },
      ],
      buckets: [
        { id: 'vm', label: 'Virtuelle Maschine' },
        { id: 'ct', label: 'Container' },
      ],
      solution: { i1: 'vm', i3: 'vm', i5: 'vm', i2: 'ct', i4: 'ct', i6: 'ct' },
      explanation: 'Weil Container den Kernel teilen, können sie kein fremdes Betriebssystem ausführen. Ein Windows-Container braucht einen Windows-Kernel.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Welcher **Hyper-V-Switch-Typ** verbindet VMs mit dem Host, aber **nicht** mit dem physischen Netzwerk?',
      options: [
        { id: 'a', text: 'Internal' },
        { id: 'b', text: 'External', whyWrong: 'Ein External Switch ist an die physische Netzwerkkarte gebunden. Die VMs hängen damit im echten LAN, wie eigene PCs. Gesucht war ein Switch nur zwischen VMs und Host, ohne physisches Netz: Internal.' },
        { id: 'c', text: 'Private', whyWrong: 'Ein Private Switch verbindet nur VMs untereinander. Der Host selbst ist nicht angeschlossen. Gesucht war VMs plus Host, aber ohne physisches Netz: Das ist Internal.' },
        { id: 'd', text: 'Bridged', whyWrong: '„Bridged“ ist ein Begriff aus VirtualBox und VMware Workstation, in Hyper-V gibt es ihn nicht. Er entspricht eher dem External Switch, weil die VM damit im echten LAN hängt.' },
      ],
      correct: 'a',
      explanation: 'External = VMs + Host + LAN, Internal = VMs + Host, Private = nur VMs.',
    },
    {
      id: 'q9', type: 'scenario', difficulty: 2,
      scenario: 'Eine VirtualBox-VM soll im Heimnetz als Webserver von anderen PCs erreichbar sein und vom Heimrouter per DHCP eine Adresse aus `192.168.178.0/24` bekommen.',
      prompt: 'Welchen Netzwerkmodus wählst du?',
      options: [
        { id: 'a', text: 'Bridged (Netzwerkbrücke)' },
        { id: 'b', text: 'NAT', whyWrong: 'Bei NAT bekommt die VM eine interne Adresse aus dem VirtualBox-Netz (meist 10.0.2.15) und geht über den Host ins Netz. Von außen ist sie nur mit Portweiterleitung erreichbar. Soll sie eine eigene Adresse im LAN haben, wählt man Bridged.' },
        { id: 'c', text: 'Host-only', whyWrong: 'Host-only verbindet die VM nur mit dem Host-PC. Andere Geräte im LAN erreichen sie nicht, und ins Internet kommt sie auch nicht. Bridged stellt die VM dagegen direkt ins LAN.' },
        { id: 'd', text: 'Internal Network', whyWrong: 'Internal Network verbindet nur VMs untereinander, nicht einmal den Host. Gut für Testnetze, aber nicht, wenn andere Geräte im LAN die VM erreichen sollen. Dafür braucht man Bridged.' },
      ],
      correct: 'a',
      explanation: 'Bridged hängt die vNIC direkt an das physische LAN. Die VM verhält sich wie ein eigener PC im Netz, mit eigener MAC und eigener IP vom Router.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Ein Host muss für einen RAM-Tausch heruntergefahren werden. Die VMs sollen **ohne Ausfallzeit** weiterlaufen. Was nutzt du?',
      options: [
        { id: 'a', text: 'Live-Migration (z. B. vMotion, Hyper-V Live Migration) auf einen anderen Host' },
        { id: 'b', text: 'HA-Cluster-Neustart', whyWrong: 'HA greift erst, wenn ein Host schon ausgefallen ist. Dann startet es die VMs auf einem anderen Host neu, mit Ausfallzeit durch den Neustart. Bei einer geplanten Wartung kann man es besser machen: die VMs vorher per Live-Migration im laufenden Betrieb umziehen.' },
        { id: 'c', text: 'Snapshot', whyWrong: 'Ein Snapshot speichert den Zustand einer VM auf demselben Host und Speicher. Die VM bleibt dabei, wo sie ist. Damit der Host heruntergefahren werden kann, müssen die VMs auf einen anderen Host umziehen: per Live-Migration.' },
        { id: 'd', text: 'Thin Provisioning', whyWrong: 'Thin Provisioning regelt, wie Festplattenplatz belegt wird. Es verschiebt keine VMs. Zum Umziehen laufender VMs auf einen anderen Host braucht man Live-Migration (vMotion, Hyper-V Live Migration).' },
      ],
      correct: 'a',
      explanation: 'Bei der Live-Migration wird der RAM-Inhalt im laufenden Betrieb kopiert und die VM in Millisekunden umgeschaltet. Voraussetzung ist meist ein gemeinsamer Speicher oder eine zusätzliche Storage-Migration.',
    },
    {
      id: 'q11', type: 'scenario', difficulty: 2,
      scenario: 'Ein Datenspeicher (2 TB) hostet 10 VMs mit je 500 GB **thin-provisionierten** Disks. Aktuell sind 1,2 TB belegt. Plötzlich frieren mehrere VMs ein.',
      prompt: 'Was ist die wahrscheinlichste Ursache?',
      options: [
        { id: 'a', text: 'Der Datenspeicher ist vollgelaufen, weil die thin Disks gewachsen sind (5 TB zugesagt, nur 2 TB vorhanden).' },
        { id: 'b', text: 'Thin-Disks sind grundsätzlich instabil.', whyWrong: 'Thin Provisioning ist ausgereift und überall im Einsatz. Gefährlich wird es nur ohne Überwachung: Hier sind 5 TB zugesagt, aber nur 2 TB vorhanden. Wachsen die Disks, läuft der Datenspeicher voll, und VMs, die schreiben wollen, frieren ein.' },
        { id: 'c', text: 'Zu wenige vCPUs', whyWrong: 'Zu wenige vCPUs machen VMs langsam, aber sie frieren nicht deswegen ein. Hier sind die thin Disks gewachsen, bis der Datenspeicher voll war. Dann kann keine VM mehr schreiben und wird angehalten.' },
        { id: 'd', text: 'Falscher vSwitch-Typ', whyWrong: 'Ein falscher vSwitch unterbricht die Netzwerkverbindung. Die VM läuft aber weiter. Einfrieren passiert, wenn VMs nicht mehr auf ihre Disk schreiben können, hier weil der Datenspeicher voll ist.' },
      ],
      correct: 'a',
      explanation: '10 × 500 GB = 5 TB zugesagt bei nur 2 TB physischem Platz. Läuft der Speicher voll, pausieren Hypervisoren betroffene VMs. Lösung: Auslastung überwachen, Alarme setzen, Überbuchung begrenzen.',
    },
    {
      id: 'q12', type: 'cli', shell: 'linux', difficulty: 2,
      prompt: 'Liste mit `virsh` (KVM/libvirt) **alle** VMs auf, auch die ausgeschalteten.',
      template: '$ virsh {{0}}',
      blanks: [{ accept: ['list --all'] }],
      explanation: 'Ohne `--all` zeigt `virsh list` nur laufende VMs (Domains).',
    },
    {
      id: 'q13', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Erstelle in PowerShell einen Hyper-V-**Checkpoint** (Snapshot) der VM `web01`.',
      template: 'PS C:\\> {{0}} -Name web01 -SnapshotName "vor-Update"',
      blanks: [{ accept: ['Checkpoint-VM'] }],
      explanation: 'Hyper-V nennt Snapshots „Checkpoints“. Mit `Get-VMCheckpoint` listest du sie, mit `Restore-VMCheckpoint` springst du zurück.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Welche Technik nutzt **AWS** für aktuelle EC2-Instanzen?',
      options: [
        { id: 'a', text: 'Das Nitro-System (schlanker KVM-basierter Hypervisor plus Nitro-Hardwarekarten)' },
        { id: 'b', text: 'VMware ESXi', whyWrong: 'VMware ESXi ist der Hypervisor von VMware. Bei AWS gibt es ihn nur im separaten Angebot VMware Cloud on AWS auf Bare-Metal-Hosts. Normale EC2-Instanzen laufen auf dem Nitro-System von AWS.' },
        { id: 'c', text: 'Hyper-V', whyWrong: 'Hyper-V ist die Grundlage von Microsoft Azure, nicht von AWS. AWS nutzte früher Xen und setzt heute bei neuen Instanzen auf das Nitro-System mit einem schlanken KVM-basierten Hypervisor.' },
        { id: 'd', text: 'VirtualBox', whyWrong: 'VirtualBox ist ein Typ-2-Hypervisor für Desktops, der als Programm auf Windows, macOS oder Linux läuft. Für Rechenzentren in Cloud-Größe ist er nicht gedacht. AWS nutzt das Nitro-System.' },
      ],
      correct: 'a',
      explanation: 'Nitro lagert Netzwerk, EBS-Speicher und Sicherheit auf eigene Hardware aus, so bleibt fast die ganze Host-Leistung für die Instanzen. Ältere Generationen liefen auf Xen.',
    },
    {
      id: 'q15', type: 'multi', difficulty: 2,
      prompt: 'Wann ist ein **Dedicated Host** (Azure/AWS) sinnvoll?',
      options: [
        { id: 'a', text: 'Compliance verlangt, dass keine fremden Kunden auf derselben Hardware laufen.' },
        { id: 'b', text: 'Software wird pro physischem Kern/Socket lizenziert (BYOL).' },
        { id: 'c', text: 'Man will möglichst günstig ein kleines Testsystem betreiben.', whyWrong: 'Bei einem Dedicated Host mietet man einen ganzen physischen Server, egal wie viel man davon nutzt. Für ein kleines Testsystem ist das sehr teuer. Dafür reicht eine kleine VM auf geteilter Hardware.' },
        { id: 'd', text: 'Man braucht automatisch eine höhere Netzwerkbandbreite.', whyWrong: 'Die Netzwerkbandbreite hängt vom VM-Typ und der Größe ab, nicht davon, ob der Host geteilt ist. Ein Dedicated Host bringt Trennung von anderen Kunden und Kontrolle über die Hardware, z. B. für Lizenzen pro Kern.' },
      ],
      correct: ['a', 'b'],
      explanation: 'Dedicated Hosts geben dir einen physischen Server allein. Das zählt für Isolation und Lizenzen, nicht für Preis oder Leistung.',
    },
    {
      id: 'q16', type: 'topology', mode: 'fill', difficulty: 2,
      prompt: 'Ein Hyper-V-Host mit zwei VMs soll ins Internet. Ergänze die fehlenden Komponenten.',
      nodes: [
        { id: 'vm1', kind: 'server', label: 'VM web01', x: 20, y: 12 },
        { id: 'vm2', kind: 'server', label: 'VM db01', x: 50, y: 12 },
        { id: 'vsw', kind: 'unknown', label: 'im Hypervisor (External)', x: 35, y: 38 },
        { id: 'psw', kind: 'unknown', label: 'physisch im Serverraum', x: 35, y: 62 },
        { id: 'gw', kind: 'unknown', label: 'Gateway zum ISP', x: 70, y: 62 },
        { id: 'inet', kind: 'cloud', label: 'Internet', x: 70, y: 88 },
      ],
      links: [['vm1', 'vsw'], ['vm2', 'vsw'], ['vsw', 'psw'], ['psw', 'gw'], ['gw', 'inet']],
      choices: ['switch', 'router', 'ap', 'server'],
      solution: { vsw: 'switch', psw: 'switch', gw: 'router' },
      explanation: 'Die VMs hängen an einem **virtuellen Switch** im Hypervisor. Dessen Uplink geht über die physische NIC an einen **physischen Switch**. Ins Internet (anderes Netz) geht es über einen **Router**.',
    },
    { id: 'g1', type: 'generated', generator: 'cost-vm', difficulty: 2 },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        scenario: 'Eine Entwickler-VM in Azure wird jeden Abend **im Gast-Betriebssystem** heruntergefahren (`shutdown /s`). Trotzdem steigt die Rechnung für die VM jeden Tag weiter.',
        prompt: 'Warum, und was ist die Lösung?',
        options: [
          { id: 'a', text: 'Die VM ist nur „Stopped“, nicht „deallocated“: Compute wird weiter berechnet. Lösung: `az vm deallocate` bzw. „Beenden“ im Portal oder Auto-Shutdown.' },
          { id: 'b', text: 'Azure berechnet VMs immer 24/7, egal in welchem Zustand.', whyWrong: 'Azure berechnet Compute nur, solange Hardware reserviert ist. Im Zustand „Stopped (deallocated)“ wird die VM freigegeben, Kosten fallen nur noch für Disks und ggf. statische öffentliche IPs an. Wer die VM nur im Gast-OS herunterfährt, landet aber in „Stopped“, und dann läuft die Rechnung weiter.' },
          { id: 'c', text: 'Nur der Speicher kostet, das ist normal.', whyWrong: 'Nur Speicherkosten gäbe es im Zustand „deallocated“. Wird die VM nur im Gast-OS heruntergefahren, steht sie auf „Stopped“: Die Hardware bleibt reserviert, und Compute wird voll weiter berechnet. Darum unbedingt im Portal „Beenden“ oder `az vm deallocate` nutzen.' },
          { id: 'd', text: 'Ein Snapshot läuft im Hintergrund.', whyWrong: 'Ein Snapshot einer Disk kostet nur ein wenig Speicher. Er erklärt nicht, warum die VM-Kosten weiterlaufen. Ursache ist der Zustand „Stopped“ statt „deallocated“: Azure hält die Hardware weiter reserviert.' },
        ],
        correct: 'a',
        explanation: 'Fährt man das Gast-OS herunter, bleibt die VM in Azure „Stopped (allocated)“. Erst die Freigabe (deallocate) gibt die Hardware zurück. Das Azure-Feature **Auto-Shutdown** dealloziert automatisch.',
      },
      {
        id: 'b2', portal: 'Virtueller Computer → Übersicht → „Beenden“. Danach steht als Status „Beendet (Zuordnung aufgehoben)“.', type: 'cli', shell: 'azcli', difficulty: 3,
        prompt: 'Gib die Compute-Ressourcen der VM `vm-dev01` frei, damit keine Compute-Kosten mehr anfallen.',
        template: '$ az vm {{0}} --resource-group rg-dev --name vm-dev01',
        blanks: [{ accept: ['deallocate'] }],
        explanation: '`az vm stop` stoppt nur das OS (Compute wird weiter berechnet). `az vm deallocate` gibt die Hardware frei. Achtung: Eine dynamische öffentliche IP kann sich dabei ändern.',
      },
      {
        id: 'b3', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen zu **Snapshots** sind korrekt?',
        options: [
          { id: 'a', text: 'Nach dem Snapshot schreibt die VM Änderungen in eine Delta-Datei.' },
          { id: 'b', text: 'Lange behaltene Snapshots kosten Speicherplatz und können die Leistung senken.' },
          { id: 'c', text: 'Snapshots sind ideal als kurzfristiger Rücksprungpunkt vor Änderungen.' },
          { id: 'd', text: 'Ein Snapshot schützt vor dem Ausfall des Datenspeichers.', whyWrong: 'Snapshot und Basis-Disk liegen meist auf demselben Datenspeicher. Fällt der aus, sind beide verloren. Gegen Hardwareausfall hilft nur ein Backup an einem anderen Ort.' },
          { id: 'e', text: 'Snapshots ersetzen eine Backup-Strategie.', whyWrong: 'Ein Snapshot hängt von der Basis-Disk ab und liegt am selben Ort. Ein Backup muss unabhängig sein, an einem anderen Ort liegen und länger aufbewahrt werden (3-2-1-Regel). Snapshots sind nur kurzfristige Rücksprungpunkte.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Faustregel: Snapshots nur Stunden bis wenige Tage behalten, Backups separat und nach der 3-2-1-Regel.',
      },
      {
        id: 'b4', type: 'scenario', difficulty: 3,
        scenario: 'Auf einem Laptop mit Windows 11 soll ein Linux-Container laufen. Der Kollege sagt: „Container teilen doch den Kernel des Hosts – wie soll ein Linux-Container auf einem Windows-Kernel laufen?“',
        prompt: 'Wie funktioniert das in Docker Desktop?',
        options: [
          { id: 'a', text: 'Docker Desktop startet eine leichte Linux-VM (z. B. über WSL 2), und die Linux-Container teilen sich deren Linux-Kernel.' },
          { id: 'b', text: 'Docker übersetzt Linux-Systemaufrufe direkt in Windows-Aufrufe ohne VM.', whyWrong: 'Eine Übersetzung von Linux- in Windows-Systemaufrufe gab es beim ersten WSL. Docker Desktop nutzt für Linux-Container heute einen echten Linux-Kernel in einer leichten VM (WSL 2 oder Hyper-V). Die Container teilen sich dann diesen Kernel.' },
          { id: 'c', text: 'Das ist unmöglich.', whyWrong: 'Linux-Container auf Windows gehen sehr wohl. Docker Desktop startet dafür im Hintergrund eine kleine Linux-VM (WSL 2). Die Container laufen darin und nutzen deren Linux-Kernel.' },
          { id: 'd', text: 'Der Container bringt seinen eigenen Kernel mit.', whyWrong: 'Container-Images enthalten nur Programme und Bibliotheken, keinen Kernel. Genau das macht sie so klein und schnell. Den Kernel liefert der Host. Unter Windows kommt er bei Linux-Containern aus einer leichten Linux-VM.' },
        ],
        correct: 'a',
        explanation: 'Die Regel „Container teilen den Kernel des Hosts“ gilt weiter. Der Host ist hier eben die Linux-VM. Das zeigt, wie VMs und Container in der Praxis kombiniert werden.',
      },
      {
        id: 'b5', type: 'single', difficulty: 3,
        prompt: 'Ein HA-Cluster aus 3 Hosts betreibt VMs. Host 2 fällt durch einen Netzteildefekt aus. Was passiert mit seinen VMs?',
        options: [
          { id: 'a', text: 'Sie werden automatisch auf Host 1 und 3 neu gestartet. Es gibt eine kurze Ausfallzeit (Neustart).' },
          { id: 'b', text: 'Sie laufen ohne Unterbrechung per Live-Migration weiter.', whyWrong: 'Für Live-Migration muss der Quell-Host laufen, damit der RAM-Inhalt der VMs übertragen werden kann. Bei einem plötzlichen Netzteilausfall ist der RAM-Inhalt sofort verloren. HA kann die VMs darum nur auf anderen Hosts neu starten, mit kurzer Ausfallzeit.' },
          { id: 'c', text: 'Sie bleiben aus, bis Host 2 repariert ist.', whyWrong: 'Genau dafür gibt es den HA-Cluster. Er merkt, dass Host 2 nicht mehr antwortet, und startet dessen VMs automatisch auf den übrigen Hosts neu. Voraussetzung sind gemeinsamer Speicher und genug freie Kapazität auf Host 1 und 3.' },
          { id: 'd', text: 'Sie werden aus dem letzten Snapshot wiederhergestellt.', whyWrong: 'HA nutzt keine Snapshots. Die Disks der VMs liegen auf gemeinsamem Speicher, auf den alle Hosts zugreifen. HA startet die VMs mit ihren aktuellen Disks auf einem anderen Host neu. Verloren geht nur, was im RAM stand.' },
        ],
        correct: 'a',
        explanation: 'HA = Neustart auf anderem Host (Minuten). Unterbrechungsfrei wäre nur VMware **Fault Tolerance** (eine laufende Schatten-VM) oder Redundanz auf Anwendungsebene (mehrere VMs hinter einem Load Balancer).',
      },
      {
        id: 'b6', type: 'dragdrop', difficulty: 3,
        prompt: 'Welches Disk-Format gehört zu welcher Plattform?',
        items: [
          { id: 'vmdk', text: 'VMDK' },
          { id: 'vhdx', text: 'VHDX' },
          { id: 'qcow2', text: 'qcow2' },
          { id: 'vhd', text: 'VHD (feste Größe, für Upload)' },
        ],
        buckets: [
          { id: 'vmw', label: 'VMware' },
          { id: 'hv', label: 'Hyper-V' },
          { id: 'kvm', label: 'KVM/QEMU' },
          { id: 'az', label: 'Azure' },
        ],
        solution: { vmdk: 'vmw', vhdx: 'hv', qcow2: 'kvm', vhd: 'az' },
        explanation: 'Azure akzeptiert für eigene hochgeladene Disks das ältere **VHD-Format mit fester Größe**. VHDX muss vorher konvertiert werden (z. B. mit `Convert-VHD`).',
      },
    ],
  },
};

export default level;
