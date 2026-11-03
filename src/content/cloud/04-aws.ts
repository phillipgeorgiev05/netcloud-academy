import type { Level } from '../../types/content';

const level: Level = {
  id: 'cloud-04',
  track: 'cloud',
  order: 4,
  title: 'Amazon Web Services (AWS)',
  titleEn: 'AWS Core: IAM, EC2, EBS, S3, VPC, Security Groups, Route 53',
  summary: 'Globale AWS-Infrastruktur, Konten und IAM, EC2 mit EBS und Kaufoptionen, S3 mit Speicherklassen, VPC mit Subnetzen, Security Groups und NACLs sowie DNS mit Route 53.',
  certs: ['aws-saa'],
  domains: { 'aws-saa': 'secure' },
  lab: {
    title: 'AWS CLI: Identität prüfen und S3 nutzen',
    needs: 'ein AWS-Konto (Free Tier) und AWS CloudShell in der Konsole',
    steps: [
      'Prüfe in der Konsole unter „Sicherheitsanmeldeinformationen“, ob für den Root-Benutzer MFA aktiv ist.',
      '`aws sts get-caller-identity`: Mit welcher Identität arbeitest du?',
      '`aws s3 mb s3://<weltweit-eindeutiger-name>`',
      '`echo hallo > test.txt` und `aws s3 cp test.txt s3://<name>/`',
      '`aws s3 ls s3://<name>/`',
      'Aufräumen: `aws s3 rb s3://<name> --force` löscht den Bucket samt Inhalt.',
    ],
  },
  lesson: [
    {
      heading: 'Globale Infrastruktur und Konten',
      body: `- **Region:** z. B. \`eu-central-1\` (Frankfurt), \`eu-central-2\` (Zürich). Daten verlassen eine Region nur, wenn du es konfigurierst.
- **Availability Zone (AZ):** ein oder mehrere getrennte Rechenzentren in einer Region, in der Regel **mindestens 3 pro Region**. Namen wie \`eu-central-1a\` werden **pro Konto** unterschiedlich auf physische Zonen abgebildet. Eindeutig sind die **AZ-IDs** (z. B. \`euc1-az1\`).
- **Edge Locations:** Standorte für **CloudFront** (CDN) und **Route 53**, nah am Nutzer.

**AWS-Konto (account)** = Abrechnungs- und Sicherheitsgrenze, vergleichbar mit einem Azure-Abonnement. Viele Firmen nutzen **viele Konten** (Prod, Dev, Security …), zusammengefasst in **AWS Organizations** mit **Organizational Units (OUs)** und konsolidierter Abrechnung.

**Service Control Policies (SCPs)** in Organizations setzen die **maximal möglichen** Rechte eines Kontos. Sie **erteilen selbst keine Rechte**, sie begrenzen nur (z. B. „keine Regionen außerhalb der EU“).

Werkzeuge: AWS Management Console, **AWS CLI** (\`aws <dienst> <befehl>\`), SDKs, CloudFormation (IaC, siehe B8).`,
      terms: [
        { de: 'Konto', en: 'AWS account' },
        { de: 'Dienststeuerungsrichtlinie', en: 'Service Control Policy (SCP)' },
      ],
    },
    {
      heading: 'IAM – Identity and Access Management',
      sources: [{ title: 'IAM: Auswertungslogik für Policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' }],
      body: `IAM ist **global** (nicht regional) und kostenlos.

- **Root-Benutzer:** die E-Mail-Adresse, mit der das Konto erstellt wurde, mit **uneingeschränkten** Rechten. Sofort **MFA** aktivieren, **keine Zugriffsschlüssel** anlegen und ihn **nicht für die tägliche Arbeit** nutzen.
- **IAM-Benutzer:** dauerhafte Anmeldedaten (Passwort und/oder Access Key). Heute empfohlen: Menschen melden sich zentral über **IAM Identity Center** (SSO) an.
- **IAM-Gruppen:** Benutzer bündeln, Rechte an Gruppen vergeben
- **IAM-Rollen:** werden **übernommen (assume)** und liefern **temporäre** Anmeldedaten (über STS). Genutzt für EC2-Instanzen (**Instanzprofil**), Lambda, kontoübergreifenden Zugriff und Föderation. **Nie Access Keys auf einer EC2-Instanz ablegen, stattdessen eine Rolle verwenden.**
- **Policies:** JSON-Dokumente mit \`Effect\` (Allow/Deny), \`Action\` (z. B. \`s3:GetObject\`), \`Resource\` (ARN) und optional \`Condition\`.

**Auswertungslogik:**
1. Standard: alles **implizit verboten**
2. Ein **explizites Allow** erlaubt …
3. … aber ein **explizites Deny schlägt immer jedes Allow**.

Beispiel-Policy (eine Zeile): \`{"Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::lern-bucket/*"}\``,
      analogy: 'IAM-Benutzer haben einen eigenen Hausschlüssel. Eine Rolle ist wie ein Besucherausweis an der Pforte: Du bekommst ihn für ein paar Stunden, danach verfällt er automatisch.',
      terms: [
        { de: 'Rolle übernehmen', en: 'assume role' },
        { de: 'Explizite Verweigerung', en: 'explicit deny' },
        { de: 'Amazon-Ressourcenname', en: 'Amazon Resource Name (ARN)' },
      ],
    },
    {
      heading: 'EC2 und EBS',
      body: `**EC2 (Elastic Compute Cloud)** = virtuelle Server (Instanzen). Gestartet aus einem **AMI** (Amazon Machine Image).

**Instanztyp lesen:** \`m7g.large\` → Familie **m** (allgemein), Generation **7**, Zusatz **g** (Graviton/ARM-Prozessor), Größe **large**. Familien: t (burstable), m (allgemein), c (rechenoptimiert), r (speicheroptimiert), i (Storage-I/O), g/p (GPU).

**Speicher:**
- **EBS (Elastic Block Store):** Netzwerk-Blockspeicher, **an eine AZ gebunden**, bleibt beim Stoppen erhalten. Typen: **gp3** (Standard-SSD, Basis 3.000 IOPS unabhängig von der Größe), io2 (hohe IOPS), st1/sc1 (HDD für Durchsatz/kalte Daten). **Snapshots** landen inkrementell in S3. Damit kann man ein Volume in eine andere AZ oder Region kopieren.
- **Instance Store:** lokale Disk des Hosts, sehr schnell, aber **flüchtig**: Die Daten sind beim Stoppen, Ruhezustand oder Beenden weg.

**Kaufoptionen:**
| Option | Idee | typisch für |
|---|---|---|
| On-Demand | pro Sekunde/Stunde, keine Bindung | kurzfristig, unvorhersehbar |
| Savings Plans / Reserved Instances | 1 oder 3 Jahre Bindung, großer Rabatt | Dauerlast |
| **Spot** | ungenutzte Kapazität, bis zu 90 % günstiger, **2 Minuten Vorwarnung** vor Entzug | fehlertolerante Batch-Jobs |
| Dedicated Hosts | physischer Server nur für dich | Lizenzen pro Socket/Kern, Compliance |

**User Data:** Skript, das beim ersten Start ausgeführt wird (z. B. Webserver installieren). Die Anmeldung erfolgt per **Schlüsselpaar** (SSH) oder besser per **Session Manager** (ohne offenen Port 22).`,
      terms: [
        { de: 'Maschinen-Image', en: 'Amazon Machine Image (AMI)' },
        { de: 'Flüchtiger Speicher', en: 'ephemeral storage / instance store' },
      ],
    },
    {
      heading: 'S3 – Simple Storage Service',
      sources: [{ title: 'S3-Speicherklassen', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html' }],
      body: `**Objektspeicher:** Daten liegen als **Objekte** (Datei + Metadaten + Schlüssel) in **Buckets**. Es gibt keine echte Ordnerstruktur, „Ordner“ sind nur Präfixe im Schlüssel.

- Bucket-Namen sind **global eindeutig**, 3–63 Zeichen, Kleinbuchstaben, Ziffern, Punkte, Bindestriche. Ein Bucket liegt in **einer Region**.
- **Haltbarkeit (durability): 99,999999999 % („11 Neunen“)**, weil Daten über mehrere AZs verteilt sind (außer bei One Zone-Klassen).
- Seit 2023 standardmäßig: **Block Public Access** an und **Verschlüsselung** (SSE-S3) für neue Objekte. Zugriff steuert man über IAM-Policies und **Bucket Policies**.
- **Versioning:** schützt vor versehentlichem Überschreiben und Löschen. **Lifecycle-Regeln** verschieben alte Objekte automatisch in günstigere Klassen oder löschen sie.
- S3 kann statische Websites hosten (meist mit CloudFront davor).

**Speicherklassen:**
| Klasse | für | Mindestdauer |
|---|---|---|
| S3 Standard | häufiger Zugriff | – |
| S3 Intelligent-Tiering | unbekanntes Zugriffsmuster, verschiebt automatisch | – |
| S3 Standard-IA | seltener Zugriff, aber sofort verfügbar | 30 Tage |
| S3 One Zone-IA | wie IA, aber nur **eine AZ** (wiederherstellbare Daten) | 30 Tage |
| Glacier Instant Retrieval | Archiv, Abruf in Millisekunden | 90 Tage |
| Glacier Flexible Retrieval | Archiv, Abruf in Minuten bis Stunden | 90 Tage |
| **Glacier Deep Archive** | günstigste Klasse, Abruf **bis 12 Stunden** (Bulk bis 48 h) | 180 Tage |`,
      analogy: 'S3 ist eine riesige Garderobe: Du gibst einen Mantel (Objekt) ab und bekommst eine Marke (Schlüssel). Wie die Garderobe innen sortiert ist, ist dir egal. Mit der Marke bekommst du genau deinen Mantel zurück.',
      terms: [
        { de: 'Objektspeicher', en: 'object storage' },
        { de: 'Haltbarkeit', en: 'durability' },
        { de: 'Lebenszyklusregel', en: 'lifecycle rule' },
      ],
    },
    {
      heading: 'VPC, Security Groups und NACLs',
      sources: [
        { title: 'Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' },
        { title: 'Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' },
      ],
      body: `Eine **VPC (Virtual Private Cloud)** ist dein privates Netz in **einer Region** (CIDR zwischen **/16 und /28**, z. B. \`10.0.0.0/16\`). Jedes Konto hat pro Region eine **Default-VPC**.

- **Subnetze** liegen jeweils in **genau einer AZ**. Für Hochverfügbarkeit legt man Subnetze in mehreren AZs an. AWS reserviert **5 Adressen** pro Subnetz.
- **Route Tables** entscheiden, wohin Verkehr geht. Jede Route Table enthält die Route \`local\` für die ganze VPC.
- **Internet Gateway (IGW):** verbindet die VPC mit dem Internet (eins pro VPC, hochverfügbar).
- **Öffentliches Subnetz** = Route Table mit \`0.0.0.0/0 → IGW\`. Instanzen brauchen zusätzlich eine öffentliche IP oder **Elastic IP**.
- **Privates Subnetz** = keine Route zum IGW. Für ausgehende Updates nutzt man ein **NAT Gateway** im öffentlichen Subnetz (\`0.0.0.0/0 → NAT-GW\`). Von außen sind die Instanzen dann nicht erreichbar. Klassisch betreibt man für Hochverfügbarkeit **ein NAT Gateway pro AZ**.

**Security Group vs. Network ACL:**
| | Security Group | Network ACL |
|---|---|---|
| gilt für | Netzwerkschnittstelle/Instanz | Subnetz |
| Zustand | **stateful** (Antworten automatisch erlaubt) | **stateless** (Rückweg extra erlauben, Ephemeral Ports 1024–65535) |
| Regeln | **nur Allow** | Allow **und Deny** |
| Auswertung | alle Regeln zusammen | nummeriert, **niedrigste Nummer zuerst**, erste passende gewinnt |
| Standard | eigene SG: eingehend nichts, ausgehend alles | Default-NACL: alles erlaubt |

Security Groups können **andere Security Groups als Quelle** referenzieren (z. B. „DB erlaubt 3306 nur von der Web-SG“).`,
      analogy: 'Die NACL ist der Pförtner am Werkstor (Subnetz), die Security Group der Türsteher an jeder Bürotür (Instanz). Der Türsteher erkennt dich beim Rausgehen wieder (stateful), der Pförtner kontrolliert in beide Richtungen neu (stateless).',
      terms: [
        { de: 'Virtuelles privates Netz', en: 'Virtual Private Cloud (VPC)' },
        { de: 'Routentabelle', en: 'route table' },
        { de: 'Netzwerk-Zugriffskontrollliste', en: 'Network ACL (NACL)' },
      ],
    },
    {
      heading: 'Route 53 und der Vergleich mit Azure',
      compare: {
        left: 'Azure',
        right: 'AWS',
        rows: [
          ['Abonnement', 'Konto (account)'],
          ['Virtual Machine', 'EC2-Instanz'],
          ['Managed Disk', 'EBS-Volume'],
          ['Blob Storage', 'S3'],
          ['VNet', 'VPC'],
          ['NSG', 'Security Group (+ NACL)'],
          ['Entra ID + RBAC', 'IAM / Identity Center'],
          ['Azure DNS', 'Route 53'],
        ],
      },
      body: `**Route 53** ist der DNS-Dienst von AWS (benannt nach DNS-Port 53): Domain-Registrierung, **gehostete Zonen** (öffentlich und privat für VPCs), **Health Checks**.

- **Alias-Record:** AWS-Erweiterung, zeigt direkt auf AWS-Ressourcen (Load Balancer, CloudFront, S3-Website). Funktioniert auch an der **Zonenspitze** (\`example.com\` ohne www), wo ein CNAME verboten ist. Abfragen auf AWS-Ziele sind kostenlos.
- **Routing-Richtlinien:** Simple, **Weighted** (z. B. 90/10 für Canary-Releases), **Latency** (schnellste Region), **Failover** (aktiv/passiv mit Health Check), **Geolocation** (nach Land des Nutzers), Geoproximity, Multivalue, IP-based.

**Begriffe Azure ↔ AWS:**
| Azure | AWS |
|---|---|
| Abonnement | Konto (account) |
| Verwaltungsgruppe | Organizations-OU |
| Virtual Machine | EC2-Instanz |
| Managed Disk | EBS-Volume |
| Blob Storage | S3 |
| VNet | VPC |
| NSG | Security Group (+ NACL) |
| Entra ID + Azure RBAC | IAM / IAM Identity Center |
| Azure DNS | Route 53 |`,
      terms: [
        { de: 'Gehostete Zone', en: 'hosted zone' },
        { de: 'Zonenspitze', en: 'zone apex' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Was solltest du direkt nach dem Anlegen eines neuen AWS-Kontos mit dem **Root-Benutzer** tun?',
      options: [
        { id: 'a', text: 'MFA aktivieren und für den Alltag eigene Identitäten (Identity Center/IAM) nutzen' },
        { id: 'b', text: 'Access Keys für den Root-Benutzer anlegen und in Skripten nutzen', whyWrong: 'Access Keys für den Root-Benutzer geben uneingeschränkte Kontrolle über das ganze Konto, und IAM-Policies können sie nicht einschränken. Liegen sie in einem Skript oder Git-Repo, kann ein Angreifer alles löschen oder teure Ressourcen starten. AWS empfiehlt: keine Root-Access-Keys, Root nur mit MFA und nur für Spezialaufgaben.' },
        { id: 'c', text: 'Den Root-Benutzer löschen', whyWrong: 'Der Root-Benutzer ist an die E-Mail-Adresse des Kontos gebunden und lässt sich nicht löschen. Einige Aufgaben gehen nur mit ihm, z. B. das Konto schließen oder den Support-Plan ändern. Darum sichert man ihn mit starkem Passwort und MFA ab und nutzt ihn sonst nicht.' },
        { id: 'd', text: 'Das Passwort im Team teilen, damit jeder Zugriff hat', whyWrong: 'Bei einem geteilten Konto weiß niemand, wer was getan hat. CloudTrail zeigt nur „Root“. Jeder im Team hätte volle Rechte, und nach einem Abgang müsste man das Passwort überall ändern. Jede Person bekommt eigene Identitäten mit nur den nötigen Rechten.' },
      ],
      correct: 'a',
      explanation: 'Root hat alle Rechte und kann nicht per IAM eingeschränkt werden (nur per SCP in Organizations). Deshalb: MFA, keine Keys, nicht täglich verwenden.',
    },
    {
      id: 'q2', type: 'scenario', difficulty: 2,
      scenario: 'Eine Anwendung auf einer EC2-Instanz muss Dateien in einen S3-Bucket schreiben. Ein Entwickler will dafür seine Access Keys in eine Konfigurationsdatei auf der Instanz legen.',
      prompt: 'Was ist die richtige Lösung?',
      options: [
        { id: 'a', text: 'Eine IAM-Rolle mit passender S3-Policy erstellen und der Instanz per Instanzprofil zuweisen' },
        { id: 'b', text: 'Die Keys verschlüsselt in die Datei legen', whyWrong: 'Verschlüsselte Keys müssen irgendwo entschlüsselt werden, also liegt der Schlüssel dazu wieder auf dem Server. Dauerhafte Access Keys laufen nie ab und rotieren nicht von selbst. Eine IAM-Rolle per Instanzprofil liefert dagegen temporäre Anmeldedaten, die AWS automatisch erneuert.' },
        { id: 'c', text: 'Den Bucket öffentlich beschreibbar machen', whyWrong: 'Ein öffentlich beschreibbarer Bucket ist ein schweres Sicherheitsproblem. Jeder im Internet könnte Dateien hochladen, überschreiben oder Schadcode ablegen. Die Instanz braucht Rechte nur für sich, und das löst eine IAM-Rolle mit passender Policy.' },
        { id: 'd', text: 'Die Root-Keys verwenden', whyWrong: 'Root-Keys hätten uneingeschränkten Zugriff auf das ganze Konto und sollten gar nicht existieren. Auf einem Server wären sie besonders gefährdet. Richtig: eine Rolle mit genau den nötigen S3-Rechten (least privilege).' },
      ],
      correct: 'a',
      explanation: 'Das SDK holt sich die temporären Anmeldedaten der Rolle automatisch über den Instance Metadata Service. Es gibt keine statischen Geheimnisse auf der Instanz.',
      analogy: 'Statt einem Handwerker den Generalschlüssel zu geben, bekommt er einen Besucherausweis, der nur für einen Raum gilt und abends verfällt.',
    },
    {
      id: 'q3', type: 'scenario', difficulty: 2,
      scenario: 'Benutzer Anna ist in einer Gruppe mit der Policy `{"Effect":"Allow","Action":"s3:*","Resource":"*"}`. Zusätzlich hat sie direkt die Policy `{"Effect":"Deny","Action":"s3:DeleteObject","Resource":"*"}`.',
      prompt: 'Darf Anna Objekte in S3 löschen?',
      options: [
        { id: 'a', text: 'Nein – ein explizites Deny schlägt immer jedes Allow.' },
        { id: 'b', text: 'Ja – Gruppenrechte haben Vorrang.', whyWrong: 'Bei IAM ist egal, woher eine Policy kommt, ob von der Gruppe, vom Benutzer oder von einer Rolle. Alle zählen gemeinsam. Die Regel ist immer gleich: Ein explizites Deny schlägt jedes Allow, und ohne Allow gilt implizit Deny.' },
        { id: 'c', text: 'Ja – `s3:*` ist spezifischer.', whyWrong: '`s3:*` erlaubt alle S3-Aktionen und ist damit sogar weniger spezifisch als ein Deny auf `s3:DeleteObject`. Spezifität spielt bei IAM aber gar keine Rolle. Es gilt nur: Explizites Deny gewinnt immer.' },
        { id: 'd', text: 'Die Policies sind ungültig, weil sie sich widersprechen.', whyWrong: 'Sich widersprechende Policies sind erlaubt und häufig gewollt. Man erlaubt breit und verbietet gezielt einzelne Aktionen. AWS löst das mit fester Logik auf: explizites Deny vor Allow vor implizitem Deny.' },
      ],
      correct: 'a',
      explanation: 'IAM-Logik: Standard = Deny. Ein Allow öffnet, ein explizites Deny schließt endgültig. Das gilt auch über SCPs, Bucket Policies und Permission Boundaries hinweg.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Was bewirkt eine **Service Control Policy (SCP)** in AWS Organizations?',
      options: [
        { id: 'a', text: 'Sie begrenzt die maximal möglichen Rechte in einem Konto/einer OU, erteilt aber selbst keine.' },
        { id: 'b', text: 'Sie gibt allen Benutzern im Konto die genannten Rechte.', whyWrong: 'Eine SCP gibt niemandem Rechte. Sie zieht nur eine Obergrenze: Was die SCP nicht erlaubt, kann auch keine IAM-Policy im Konto erlauben. Damit ein Benutzer etwas darf, braucht er zusätzlich eine IAM-Policy, die es erlaubt.' },
        { id: 'c', text: 'Sie gilt nur für den Root-Benutzer der Management-Account.', whyWrong: 'SCPs wirken auf alle Benutzer und Rollen in Mitgliedskonten, sogar auf deren Root-Benutzer. Nur das Management-Konto selbst ist von SCPs ausgenommen. Darum betreibt man dort möglichst keine Workloads.' },
        { id: 'd', text: 'Sie ersetzt Security Groups.', whyWrong: 'Security Groups filtern Netzwerkverkehr zu Instanzen, z. B. Port 443. SCPs regeln, welche AWS-API-Aufrufe in einem Konto überhaupt erlaubt sind, z. B. „keine Ressourcen außerhalb der EU“. Beide ergänzen sich, keine ersetzt die andere.' },
      ],
      correct: 'a',
      explanation: 'Effektive Rechte = Schnittmenge aus SCP-Grenze und IAM-Allow (minus aller Denies). Beispiel: SCP verbietet alle Regionen außer `eu-central-1`.',
    },
    {
      id: 'q5', type: 'single', difficulty: 1,
      prompt: 'Was bedeutet der Instanztyp **`c7g.xlarge`**?',
      options: [
        { id: 'a', text: 'Rechenoptimiert (c), 7. Generation, Graviton/ARM-Prozessor (g), Größe xlarge' },
        { id: 'b', text: 'Container-Instanz, 7 vCPUs, GPU', whyWrong: '`c` steht für compute optimized, nicht für Container. Die 7 ist die Generation, keine Zahl von vCPUs. Das `g` nach der Ziffer heißt Graviton (ARM-Prozessor von AWS), nicht GPU. GPU-Familien erkennt man am Buchstaben vorne, z. B. `g5` oder `p5`.' },
        { id: 'c', text: 'Cache-Instanz mit 7 GB RAM', whyWrong: '`c` steht für compute optimized, nicht Cache. Die 7 ist die Generation, nicht der RAM. Wie viel RAM und wie viele vCPUs eine Instanz hat, ergibt sich aus der Größe (`xlarge`) und der Familie.' },
        { id: 'd', text: 'Klassische Instanz, gebaut 2007', whyWrong: 'Die Ziffer ist die Hardware-Generation der Familie, kein Baujahr. Höher heißt neuer, also meist mehr Leistung pro Euro. c7g ist die 7. Generation der rechenoptimierten Familie, hier mit Graviton-Prozessor.' },
      ],
      correct: 'a',
      explanation: 'Schema: Familie + Generation + Zusätze (g = Graviton, i = Intel, a = AMD, n = Netzwerk, d = lokale NVMe-Disk) + Größe.',
    },
    {
      id: 'q6', type: 'scenario', difficulty: 2,
      scenario: 'Eine Anwendung schreibt Zwischenergebnisse auf das **Instance Store**-Volume einer EC2-Instanz. Nach einem Stop/Start über Nacht sind die Daten verschwunden.',
      prompt: 'Warum?',
      options: [
        { id: 'a', text: 'Instance Store ist flüchtig: Beim Stoppen wird die Instanz auf einem anderen Host gestartet, die lokale Disk ist leer.' },
        { id: 'b', text: 'EBS-Snapshots wurden gelöscht.', whyWrong: 'Instance Store ist eine Disk, die direkt im physischen Host steckt. Mit EBS und dessen Snapshots hat sie nichts zu tun. Beim Stoppen gibt AWS den Host frei, und die Daten auf der lokalen Disk sind weg.' },
        { id: 'c', text: 'S3-Lifecycle-Regeln haben die Daten entfernt.', whyWrong: 'Die Daten lagen auf dem Instance Store der Instanz, nicht in S3. S3-Lifecycle-Regeln betreffen nur Objekte in Buckets. Instance Store ist flüchtig und beim Stoppen der Instanz leer.' },
        { id: 'd', text: 'Die Security Group hat die Daten blockiert.', whyWrong: 'Security Groups filtern nur Netzwerkverkehr und löschen keine Daten. Die Daten sind weg, weil sie auf dem flüchtigen Instance Store lagen. Beim Stoppen startet die Instanz auf einem anderen Host mit leerer lokaler Disk.' },
      ],
      correct: 'a',
      explanation: 'Wie die temporäre Disk in Azure (B3): gut für Caches und Scratch-Daten. Dauerhaftes gehört auf EBS oder S3. Ein Neustart (reboot) behält die Daten, ein Stop/Start nicht.',
    },
    {
      id: 'q7', domain: 'resilient', type: 'single', difficulty: 2,
      prompt: 'Ein EBS-Volume liegt in `eu-central-1a`. Du willst es an eine Instanz in `eu-central-1b` hängen. Wie?',
      options: [
        { id: 'a', text: 'Snapshot erstellen und daraus ein neues Volume in eu-central-1b anlegen' },
        { id: 'b', text: 'Einfach anhängen, EBS ist regional.', whyWrong: 'EBS-Volumes sind an genau eine Availability Zone gebunden, nicht an die Region. Sie lassen sich nur an Instanzen in derselben AZ hängen. Für eine andere AZ braucht man einen Snapshot und daraus ein neues Volume.' },
        { id: 'c', text: 'Das Volume per Drag-and-Drop in die andere AZ ziehen', whyWrong: 'Volumes lassen sich nicht direkt zwischen AZs verschieben, auch nicht in der Konsole. Der Weg geht über einen Snapshot: Snapshots werden regional in S3 gespeichert, und daraus legt man ein neues Volume in der Ziel-AZ an.' },
        { id: 'd', text: 'Es geht gar nicht.', whyWrong: 'Es geht, nur nicht direkt. Ein Snapshot des Volumes wird regional gespeichert. Daraus legt man in eu-central-1b ein neues Volume an und hängt es an die Instanz.' },
      ],
      correct: 'a',
      explanation: 'Snapshots sind regional (in S3 gespeichert) und können sogar in andere Regionen kopiert werden, z. B. für Disaster Recovery.',
    },
    {
      id: 'q8', domain: 'cost', type: 'dragdrop', difficulty: 2,
      prompt: 'Welche **EC2-Kaufoption** passt?',
      items: [
        { id: 'i1', text: 'Webserver, läuft 3 Jahre rund um die Uhr' },
        { id: 'i2', text: 'Video-Rendering, darf jederzeit unterbrochen werden' },
        { id: 'i3', text: 'Kurzer Test für 2 Stunden' },
        { id: 'i4', text: 'Software lizenziert pro physischem CPU-Socket' },
      ],
      buckets: [
        { id: 'sp', label: 'Savings Plan / Reserved' },
        { id: 'spot', label: 'Spot' },
        { id: 'od', label: 'On-Demand' },
        { id: 'dh', label: 'Dedicated Host' },
      ],
      solution: { i1: 'sp', i2: 'spot', i3: 'od', i4: 'dh' },
      explanation: 'Dauerlast → Bindung mit Rabatt. Unterbrechbar → Spot (2 Minuten Vorwarnung). Kurz und spontan → On-Demand. Socket-Lizenzen → physischer Host.',
    },
    {
      id: 'q9', type: 'single', difficulty: 1,
      prompt: 'Welche **Haltbarkeit (durability)** gibt AWS für S3 Standard an?',
      options: [
        { id: 'a', text: '99,999999999 % (11 Neunen)' },
        { id: 'b', text: '99,99 %', whyWrong: '99,99 % ist die Verfügbarkeit von S3 Standard, also wie oft man an die Daten herankommt. Haltbarkeit (Durability) ist etwas anderes: wie unwahrscheinlich Datenverlust ist. Dafür nennt AWS 11 Neunen (99,999999999 %).' },
        { id: 'c', text: '100 %', whyWrong: '100 % Haltbarkeit kann kein Speicher garantieren, irgendein Restrisiko bleibt immer. AWS gibt für S3 Standard 99,999999999 % an (11 Neunen). Statistisch geht bei 10 Millionen Objekten etwa eines in 10.000 Jahren verloren.' },
        { id: 'd', text: '99,9 %', whyWrong: '99,9 % Haltbarkeit hieße: Von 1000 Objekten geht im Jahr eines verloren. Für einen Objektspeicher wäre das viel zu wenig. S3 Standard speichert über mindestens drei AZs und kommt auf 11 Neunen.' },
      ],
      correct: 'a',
      explanation: 'Haltbarkeit = Daten gehen nicht verloren. Verfügbarkeit = Daten sind gerade abrufbar. Das sind zwei verschiedene Kennzahlen, die gern verwechselt werden.',
    },
    {
      id: 'q10', domain: 'cost', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Anforderung der günstigsten passenden **S3-Speicherklasse** zu.',
      items: [
        { id: 'i1', text: 'Produktbilder eines Shops, ständig abgerufen' },
        { id: 'i2', text: 'Zugriffsmuster völlig unbekannt' },
        { id: 'i3', text: 'Steuerunterlagen, 10 Jahre aufbewahren, Abruf darf 12 h dauern' },
        { id: 'i4', text: 'Neu erzeugbare Thumbnails, selten genutzt, eine AZ reicht' },
      ],
      buckets: [
        { id: 'std', label: 'S3 Standard' },
        { id: 'it', label: 'Intelligent-Tiering' },
        { id: 'gda', label: 'Glacier Deep Archive' },
        { id: 'oz', label: 'One Zone-IA' },
      ],
      solution: { i1: 'std', i2: 'it', i3: 'gda', i4: 'oz' },
      explanation: 'One Zone-IA nur für Daten, die man notfalls neu erzeugen kann. Deep Archive ist die günstigste Klasse mit Abruf in bis zu 12 Stunden.',
    },
    {
      id: 'q11', portal: 'S3-Konsole → „Bucket erstellen“, danach im Bucket „Hochladen“', type: 'cli', shell: 'awscli', difficulty: 1,
      prompt: 'Erstelle einen S3-Bucket und lade danach eine Datei hoch.',
      template: '$ aws s3 {{0}} s3://lern-bucket-2026\n$ aws s3 {{1}} bericht.pdf s3://lern-bucket-2026/',
      blanks: [{ accept: ['mb'] }, { accept: ['cp'] }],
      explanation: '`mb` = make bucket, `cp` = copy. Weitere: `ls`, `rm`, `sync` (Ordner abgleichen), `rb` (remove bucket).',
    },
    {
      id: 'q12', portal: 'Konsole: Das Kontomenü oben rechts zeigt Konto-ID und angemeldeten Benutzer bzw. Rolle.', type: 'cli', shell: 'awscli', difficulty: 2,
      prompt: 'Prüfe, mit **welcher Identität** (Konto, Benutzer/Rolle) die AWS CLI gerade arbeitet.',
      template: '$ aws sts {{0}}',
      blanks: [{ accept: ['get-caller-identity'] }],
      explanation: 'Gibt Account-ID, UserId und ARN zurück. Das ist der erste Befehl bei „Access Denied“-Fehlern: Bin ich überhaupt, wer ich glaube?',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Was macht ein Subnetz in einer VPC zu einem **öffentlichen Subnetz**?',
      options: [
        { id: 'a', text: 'Seine Route Table enthält eine Route `0.0.0.0/0` zum Internet Gateway.' },
        { id: 'b', text: 'Es hat einen öffentlichen CIDR-Bereich.', whyWrong: 'Auch öffentliche Subnetze nutzen meist private Adressbereiche wie 10.0.1.0/24. Öffentlich erreichbar werden Instanzen über eine zusätzliche öffentliche IP oder Elastic IP, die das IGW übersetzt. Was das Subnetz öffentlich macht, ist die Route `0.0.0.0/0` zum Internet Gateway.' },
        { id: 'c', text: 'Es enthält ein NAT Gateway als Ziel der Default-Route.', whyWrong: 'Eine Default-Route zum NAT Gateway ist gerade das Merkmal eines privaten Subnetzes. Instanzen kommen darüber ins Internet, sind von außen aber nicht erreichbar. Öffentlich ist ein Subnetz nur mit einer Route zum Internet Gateway.' },
        { id: 'd', text: 'Seine Security Group erlaubt alles.', whyWrong: 'Security Groups hängen an Netzwerkschnittstellen von Instanzen, nicht an Subnetzen. Selbst eine Security Group, die alles erlaubt, macht ohne Route zum Internet Gateway nichts öffentlich. Entscheidend ist die Route Table.' },
      ],
      correct: 'a',
      explanation: 'Öffentlich = Route zum IGW. Instanzen brauchen dazu eine öffentliche IP/Elastic IP, und die Security Group muss den Verkehr erlauben.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Instanzen in einem **privaten Subnetz** sollen Updates aus dem Internet laden, aber **von außen nicht erreichbar** sein. Was brauchst du?',
      options: [
        { id: 'a', text: 'Ein NAT Gateway in einem öffentlichen Subnetz und die Route `0.0.0.0/0 → NAT-GW` im privaten Subnetz' },
        { id: 'b', text: 'Eine Route `0.0.0.0/0 → IGW` im privaten Subnetz', whyWrong: 'Mit einer Route zum IGW wäre das Subnetz öffentlich. Instanzen mit öffentlicher IP wären dann von außen erreichbar, genau das soll nicht sein. Instanzen ohne öffentliche IP kämen über das IGW gar nicht ins Internet. Der richtige Weg ist ein NAT Gateway.' },
        { id: 'c', text: 'Ein zweites Internet Gateway', whyWrong: 'An eine VPC kann nur ein Internet Gateway angehängt werden. Es übersetzt für IPv4 in beide Richtungen und kann nicht „nur ausgehend“. Für ausgehenden Verkehr ohne Erreichbarkeit von außen nutzt man ein NAT Gateway (bei IPv6 ein Egress-only Internet Gateway).' },
        { id: 'd', text: 'Eine Elastic IP auf jeder Instanz', whyWrong: 'Eine Elastic IP gibt der Instanz eine feste öffentliche Adresse. Damit ist sie von außen ansprechbar, genau das soll vermieden werden. Ein NAT Gateway lässt Instanzen ausgehend ins Internet, ohne dass sie eigene öffentliche Adressen brauchen.' },
      ],
      correct: 'a',
      explanation: 'Das NAT Gateway übersetzt ausgehende Verbindungen auf seine Elastic IP. Neue Verbindungen von außen hinein sind nicht möglich (wie NAT am Heimrouter).',
    },
    {
      id: 'q15', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen über **Security Groups** sind richtig?',
      options: [
        { id: 'a', text: 'Sie sind stateful: Antwortverkehr ist automatisch erlaubt.' },
        { id: 'b', text: 'Sie enthalten nur Allow-Regeln.' },
        { id: 'c', text: 'Eine Regel kann eine andere Security Group als Quelle angeben.' },
        { id: 'd', text: 'Sie werden auf Subnetzebene ausgewertet, mit nummerierten Regeln.', whyWrong: 'Das beschreibt Network ACLs: Sie gelten für ganze Subnetze, sind nummeriert und werden der Reihe nach geprüft. Security Groups hängen an Netzwerkschnittstellen. Dort werden alle Regeln gemeinsam ausgewertet, ohne Reihenfolge.' },
        { id: 'e', text: 'Man kann einzelne IPs per Deny-Regel aussperren.', whyWrong: 'Security Groups kennen nur Allow-Regeln. Was nicht erlaubt ist, ist verboten. Einzelne IPs gezielt aussperren kann man mit einer Deny-Regel in der Network ACL oder mit AWS WAF bzw. AWS Network Firewall.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Typisches Muster: DB-SG erlaubt Port 3306 nur von der Web-SG. Das funktioniert unabhängig von IP-Adressen und skaliert automatisch.',
    },
    {
      id: 'q16', type: 'topology', mode: 'click', difficulty: 2,
      prompt: 'Subnetz A hat die Route `0.0.0.0/0 → IGW`, seine Instanzen haben öffentliche IPs. Subnetz B hat `0.0.0.0/0 → NAT-GW`. Alle Security Groups erlauben HTTPS. Welche Instanzen sind **aus dem Internet direkt erreichbar**?',
      nodes: [
        { id: 'inet', kind: 'cloud', label: 'Internet', x: 50, y: 8 },
        { id: 'igw', kind: 'router', label: 'IGW', x: 50, y: 28 },
        { id: 'web1', kind: 'server', label: 'web1 (A)', x: 15, y: 55 },
        { id: 'web2', kind: 'server', label: 'web2 (A)', x: 38, y: 55 },
        { id: 'nat', kind: 'router', label: 'NAT-GW (A)', x: 65, y: 55 },
        { id: 'app1', kind: 'server', label: 'app1 (B)', x: 35, y: 88 },
        { id: 'db1', kind: 'server', label: 'db1 (B)', x: 70, y: 88 },
      ],
      links: [['inet', 'igw'], ['igw', 'web1'], ['igw', 'web2'], ['igw', 'nat'], ['nat', 'app1'], ['nat', 'db1']],
      correct: ['web1', 'web2'],
      explanation: 'Nur Instanzen im öffentlichen Subnetz mit öffentlicher IP sind erreichbar. app1 und db1 kommen über das NAT Gateway hinaus, aber niemand von außen herein. Das NAT Gateway ist keine Instanz, die du anklicken solltest.',
    },
    {
      id: 'q17', type: 'single', difficulty: 2,
      prompt: 'Die Domain `example.com` (ohne www) soll auf einen AWS Application Load Balancer zeigen. Welcher Route-53-Eintrag ist richtig?',
      options: [
        { id: 'a', text: 'Ein Alias-Record (A/AAAA) auf den Load Balancer' },
        { id: 'b', text: 'Ein CNAME auf den DNS-Namen des Load Balancers', whyWrong: 'An der Zonenspitze (`example.com` ohne Präfix) stehen immer SOA- und NS-Einträge. Ein CNAME darf laut DNS-Standard nicht neben anderen Einträgen stehen und ist dort darum verboten. Route 53 löst das mit einem Alias-Record.' },
        { id: 'c', text: 'Ein A-Record mit der aktuellen IP des Load Balancers', whyWrong: 'Ein Application Load Balancer hat keine festen IPs. AWS skaliert ihn und tauscht die Adressen. Ein fest eingetragener A-Record würde irgendwann ins Leere zeigen. Ein Alias-Record folgt automatisch den aktuellen Adressen.' },
        { id: 'd', text: 'Ein MX-Record', whyWrong: 'MX-Records nennen die Mailserver einer Domain. Mit dem Aufruf einer Website hat das nichts zu tun. Für den Load Balancer an der Zonenspitze braucht man einen Alias-Record (A/AAAA).' },
      ],
      correct: 'a',
      explanation: 'Alias-Records lösen intern auf die aktuellen IPs des Ziels auf, funktionieren an der Zonenspitze und sind für AWS-Ziele kostenlos.',
    },
    { id: 'g1', type: 'generated', generator: 'iam', difficulty: 2 },
    {
      id: 'cfg1', type: 'config', difficulty: 3, domain: 'resilient',
      prompt: 'VPC-Baukasten: Setze genau die Schalter, die alle Anforderungen erfüllen.',
      nodes: [
        { id: 'inet', kind: 'cloud', label: 'Internet', x: 50, y: 8 },
        { id: 'igw', kind: 'router', label: 'IGW', x: 50, y: 30 },
        { id: 'web', kind: 'server', label: 'Web (Subnetz A)', x: 25, y: 62 },
        { id: 'app', kind: 'server', label: 'App (Subnetz B)', x: 75, y: 88 },
      ],
      links: [['inet', 'igw'], ['igw', 'web'], ['web', 'app']],
      requirements: [
        { text: 'Der Webserver in Subnetz A ist aus dem Internet erreichbar.', needs: ['rtA', 'pipWeb'] },
        { text: 'Der App-Server in Subnetz B lädt Updates aus dem Internet.', needs: ['natA', 'rtB'] },
        { text: 'Der App-Server ist von außen nicht erreichbar.', needs: [] },
      ],
      toggles: [
        { id: 'rtA', text: 'Route Table Subnetz A: 0.0.0.0/0 → Internet Gateway', why: 'Macht Subnetz A öffentlich. Nötig für den Webserver und das NAT Gateway.' },
        { id: 'pipWeb', text: 'Webserver bekommt eine öffentliche IP/Elastic IP', why: 'Ohne öffentliche IP ist er trotz IGW-Route von außen nicht adressierbar.' },
        { id: 'natA', text: 'NAT Gateway im öffentlichen Subnetz A anlegen', why: 'Das NAT Gateway braucht selbst Internetzugang über das IGW.' },
        { id: 'rtB', text: 'Route Table Subnetz B: 0.0.0.0/0 → NAT Gateway', why: 'Gibt dem App-Server ausgehenden Zugang, ohne dass man ihn von außen erreicht.' },
        { id: 'rtBigw', text: 'Route Table Subnetz B: 0.0.0.0/0 → Internet Gateway', why: 'Würde Subnetz B öffentlich machen. Der App-Server soll aber privat bleiben.' },
        { id: 'pipApp', text: 'App-Server bekommt eine öffentliche IP', why: 'Unnötige Angriffsfläche, der App-Server soll privat bleiben.' },
        { id: 'natB', text: 'NAT Gateway im privaten Subnetz B anlegen', why: 'Ein NAT Gateway im privaten Subnetz hätte selbst keinen Weg ins Internet.' },
      ],
      solution: ['rtA', 'pipWeb', 'natA', 'rtB'],
      explanation: 'Öffentlich = Route zum IGW + öffentliche IP. Privat mit Internetzugang = Route zum NAT Gateway, das im öffentlichen Subnetz steht.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        scenario: 'Ein Webserver im öffentlichen Subnetz ist nicht erreichbar. Die **Security Group** erlaubt TCP 443 eingehend. Die **NACL** des Subnetzes hat: Regel 100 `Allow` TCP 443 eingehend und ausgehend nur Regel 100 `Allow` TCP 443, danach `*` Deny.',
        prompt: 'Warum kommt keine Antwort beim Client an?',
        options: [
          { id: 'a', text: 'Die NACL ist stateless: Die Antwort geht vom Port 443 an den Ephemeral Port des Clients (1024–65535) – das muss ausgehend erlaubt sein.' },
          { id: 'b', text: 'Die Security Group blockiert die Antwort.', whyWrong: 'Security Groups sind stateful: Ist eine Anfrage hereingekommen, darf die Antwort automatisch hinaus. An der Security Group liegt es also nicht. Die NACL dagegen ist stateless und braucht eine eigene ausgehende Regel für die Antwort an die Ephemeral Ports.' },
          { id: 'c', text: 'Port 443 muss auch in der Route Table eingetragen sein.', whyWrong: 'Route Tables kennen keine Ports, nur Zielnetze und Next Hops. Ob Port 443 durchgeht, steuern Security Groups und NACLs. Hier fehlt in der NACL die ausgehende Regel für die Antwort an Ports 1024–65535.' },
          { id: 'd', text: 'Das Internet Gateway filtert HTTPS.', whyWrong: 'Das Internet Gateway filtert keinen Verkehr. Es leitet weiter und übersetzt öffentliche in private IPs. Gefiltert wird in Security Groups und NACLs, und hier blockiert die stateless NACL die Antwort.' },
        ],
        correct: 'a',
        explanation: 'Bei stateless Filtern muss der Rückweg explizit erlaubt werden. Ausgehende Regeln filtern auf den **Zielport**, und der ist bei der Antwort der zufällige Client-Port. Das ist eine klassische SAA-Prüfungsfalle.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        scenario: 'Ein Angreifer von der IP `203.0.113.66` schickt massenhaft Anfragen an deine Web-Instanzen. Du willst genau diese IP auf Netzwerkebene sperren.',
        prompt: 'Wo geht das mit Bordmitteln der VPC?',
        options: [
          { id: 'a', text: 'In der Network ACL mit einer Deny-Regel, deren Nummer niedriger ist als die Allow-Regeln' },
          { id: 'b', text: 'In der Security Group mit einer Deny-Regel', whyWrong: 'Security Groups kennen nur Allow-Regeln, eine Deny-Regel lässt sich gar nicht anlegen. Um eine einzelne IP auszusperren, braucht man die Network ACL: Dort gibt es Deny-Regeln, und die mit der kleinsten Nummer greift zuerst.' },
          { id: 'c', text: 'In der Route Table mit einer Blackhole-Route', whyWrong: 'Eine Blackhole-Route verwirft Pakete an ein bestimmtes Ziel, sie betrifft also ausgehenden Verkehr. Eingehende Pakete von einer bestimmten Quelle lassen sich so nicht filtern. Das geht mit einer Deny-Regel in der Network ACL.' },
          { id: 'd', text: 'In IAM mit einer Deny-Policy', whyWrong: 'IAM regelt, wer AWS-APIs aufrufen darf, z. B. Instanzen starten. Auf Netzwerkpakete, die an eine Instanz gehen, hat IAM keinen Einfluss. Eine IP aussperren geht mit einer Deny-Regel in der NACL.' },
        ],
        correct: 'a',
        explanation: 'NACL-Regeln werden aufsteigend geprüft. Ein Deny mit Nummer 50 greift vor dem Allow 100. Für HTTP-Angriffe ist zusätzlich **AWS WAF** am Load Balancer/CloudFront sinnvoll.',
      },
      {
        id: 'b3', domain: 'resilient', type: 'multi', difficulty: 3,
        prompt: 'Eine Webanwendung soll den Ausfall einer **Availability Zone** überstehen. Was ist nötig?',
        options: [
          { id: 'a', text: 'Subnetze und Instanzen in mindestens zwei AZs' },
          { id: 'b', text: 'Ein Load Balancer, der über diese AZs verteilt' },
          { id: 'c', text: 'Für private Subnetze je ein NAT Gateway pro AZ (klassisches Muster)' },
          { id: 'd', text: 'Eine einzige große Instanz mit gp3-Volume', whyWrong: 'Eine Instanz liegt immer in genau einer AZ, und ihr EBS-Volume auch. Fällt die AZ aus, ist die Anwendung weg, egal wie groß die Instanz ist. Für AZ-Ausfallsicherheit braucht es Instanzen in mindestens zwei AZs hinter einem Load Balancer.' },
          { id: 'e', text: 'Ein zweites Internet Gateway pro AZ', whyWrong: 'Pro VPC gibt es nur ein Internet Gateway. Es ist von AWS aus regional hochverfügbar und fällt nicht mit einer AZ aus. Ein zweites ist weder nötig noch möglich.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Fällt die AZ mit dem einzigen NAT Gateway aus, verlieren auch die privaten Instanzen in den anderen AZs den Internetzugang. Deshalb: NAT Gateway pro AZ und Route Tables pro AZ.',
      },
      {
        id: 'b4', type: 'dragdrop', difficulty: 3,
        prompt: 'Ordne den **Azure-Diensten** die AWS-Entsprechung zu.',
        items: [
          { id: 'i1', text: 'Blob Storage' },
          { id: 'i2', text: 'VNet' },
          { id: 'i3', text: 'Managed Disk' },
          { id: 'i4', text: 'Azure DNS' },
        ],
        buckets: [
          { id: 's3', label: 'S3' },
          { id: 'vpc', label: 'VPC' },
          { id: 'ebs', label: 'EBS' },
          { id: 'r53', label: 'Route 53' },
        ],
        solution: { i1: 's3', i2: 'vpc', i3: 'ebs', i4: 'r53' },
        explanation: 'Konzepte übertragen sich gut. Unterschiede liegen im Detail: VNets und VPCs sind beide regional, Subnetze aber nur bei AWS an eine AZ gebunden, in Azure gelten sie zonenübergreifend.',
      },
      {
        id: 'b5', domain: 'cost', type: 'scenario', difficulty: 3,
        scenario: 'Logdateien werden 30 Tage oft gelesen, danach 1 Jahr kaum, müssen aber sofort verfügbar sein, und anschließend 6 Jahre archiviert (Abruf in Stunden okay). Danach sollen sie gelöscht werden.',
        prompt: 'Wie setzt du das am günstigsten um?',
        options: [
          { id: 'a', text: 'S3-Lifecycle-Regel: Standard → nach 30 Tagen Standard-IA → nach ~1 Jahr Glacier Deep Archive → nach 7 Jahren löschen' },
          { id: 'b', text: 'Alles dauerhaft in S3 Standard lassen und manuell löschen', whyWrong: 'Das funktioniert, ist aber teuer: S3 Standard kostet pro GB am meisten, und die Logs würden sieben Jahre dort liegen. Manuelles Löschen vergisst man leicht. Eine Lifecycle-Regel verschiebt automatisch in günstigere Klassen und löscht nach Ablauf.' },
          { id: 'c', text: 'Direkt in Glacier Deep Archive schreiben', whyWrong: 'Glacier Deep Archive ist die günstigste Klasse, aber das Abrufen dauert bis zu 12 Stunden und kostet extra. Die Logs werden in den ersten 30 Tagen oft gelesen. Darum: erst Standard, später automatisch per Lifecycle in günstigere Klassen.' },
          { id: 'd', text: 'Auf EBS-Volumes speichern', whyWrong: 'EBS ist Blockspeicher für eine einzelne Instanz, pro GB deutlich teurer als S3, und man zahlt für die volle Größe. Es gibt keine Speicherklassen und keine Lifecycle-Regeln. Für Logs über Jahre ist S3 mit Lifecycle die richtige Wahl.' },
        ],
        correct: 'a',
        explanation: 'Lifecycle-Regeln automatisieren Übergänge und das Löschen (Expiration). Die Mindestspeicherdauern sind hier eingehalten: IA 30 Tage, Deep Archive 180 Tage.',
      },
      {
        id: 'b6', domain: 'resilient', type: 'single', difficulty: 3,
        prompt: 'Eine Firma will 10 % des Traffics auf die neue Version ihrer Website (anderer Load Balancer) lenken und 90 % auf die alte. Welche Route-53-Routing-Richtlinie?',
        options: [
          { id: 'a', text: 'Weighted (gewichtet)' },
          { id: 'b', text: 'Latency', whyWrong: 'Latency-Routing schickt jeden Nutzer zur Region mit der niedrigsten Latenz. Eine feste Aufteilung 10 % / 90 % lässt sich damit nicht einstellen. Dafür gibt es Weighted Routing mit Gewichten wie 10 und 90.' },
          { id: 'c', text: 'Failover', whyWrong: 'Failover-Routing schickt allen Verkehr an das primäre Ziel und schaltet nur bei dessen Ausfall auf das sekundäre um (aktiv/passiv). Eine prozentuale Aufteilung gibt es dabei nicht. Für 10 % / 90 % braucht man Weighted.' },
          { id: 'd', text: 'Geolocation', whyWrong: 'Geolocation entscheidet nach dem Herkunftsland oder Kontinent des Nutzers, z. B. Deutschland zu Server A. Eine prozentuale Aufteilung aller Nutzer macht Weighted Routing.' },
        ],
        correct: 'a',
        explanation: 'Gewichte 90 und 10 auf zwei Records mit gleichem Namen ergeben einen Canary-Release. Per Health Check fällt ein kaputtes Ziel automatisch heraus.',
      },
      { id: 'bg1', type: 'generated', generator: 'iam', difficulty: 3 },
    ],
  },
};

export default level;
