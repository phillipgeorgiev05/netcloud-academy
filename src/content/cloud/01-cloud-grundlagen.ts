import type { Level } from '../../types/content';

const level: Level = {
  id: 'cloud-01',
  track: 'cloud',
  order: 1,
  title: 'Cloud-Grundlagen',
  titleEn: 'Cloud Concepts',
  summary: 'Was Cloud Computing ausmacht, IaaS/PaaS/SaaS, Bereitstellungsmodelle, Shared Responsibility, CapEx vs. OpEx, Skalierung, Hochverfügbarkeit und Regionen.',
  certs: ['az900', 'aws-saa', 'fisi'],
  domains: { az900: 'concepts', fisi: 'ap2-admin' },
  lesson: [
    {
      heading: 'Was ist Cloud Computing?',
      sources: [{ title: 'NIST SP 800-145 (Definition Cloud Computing)', url: 'https://csrc.nist.gov/pubs/sp/800/145/final' }],
      body: `Cloud Computing heißt: IT-Ressourcen (Rechenleistung, Speicher, Netzwerk, Software) **über das Internet bei Bedarf** beziehen und **nach Verbrauch** bezahlen.

Die NIST-Definition nennt **5 Merkmale**:
- **On-Demand Self-Service:** selbst bereitstellen, ohne Ticket beim Anbieter
- **Broad Network Access:** über das Netz von überall erreichbar
- **Resource Pooling:** Hardware wird mandantenfähig geteilt (Multi-Tenancy)
- **Rapid Elasticity:** schnell hoch- und runterskalieren
- **Measured Service:** Verbrauch wird gemessen und abgerechnet`,
      analogy: 'Cloud ist wie Strom aus der Steckdose: Du baust kein eigenes Kraftwerk, sondern zahlst pro kWh, was du verbrauchst.',
      terms: [
        { de: 'Mandantenfähigkeit', en: 'multi-tenancy' },
        { de: 'Nutzungsbasierte Abrechnung', en: 'consumption-based / pay-as-you-go pricing' },
      ],
    },
    {
      heading: 'Servicemodelle: IaaS, PaaS, SaaS',
      body: `| Modell | Du verwaltest | Anbieter verwaltet | Beispiele |
|---|---|---|---|
| **IaaS** (Infrastructure) | Betriebssystem, Middleware, App, Daten | Hardware, Netzwerk, Virtualisierung | Azure Virtual Machines, AWS EC2 |
| **PaaS** (Platform) | App-Code, Daten, Konfiguration | zusätzlich OS, Runtime, Patches | Azure App Service, Azure SQL Database, AWS Elastic Beanstalk |
| **SaaS** (Software) | Daten, Benutzer, Einstellungen | die komplette Anwendung | Microsoft 365, Salesforce, Gmail |

**Serverless/FaaS** (z. B. Azure Functions, AWS Lambda) ist eine Spielart von PaaS: Du lieferst nur Code-Funktionen. Abgerechnet wird pro Ausführung, Server siehst du gar nicht.`,
      analogy: 'Pizza-Modell: IaaS = Küche mieten, Zutaten und Backen machst du. PaaS = Pizza liefern lassen, du deckst nur noch den Tisch. SaaS = Essen im Restaurant, du bestellst nur noch.',
      terms: [
        { de: 'Infrastruktur als Dienst', en: 'Infrastructure as a Service (IaaS)' },
        { de: 'Plattform als Dienst', en: 'Platform as a Service (PaaS)' },
        { de: 'Software als Dienst', en: 'Software as a Service (SaaS)' },
      ],
    },
    {
      heading: 'Bereitstellungsmodelle',
      body: `- **Public Cloud:** Anbieter (Azure, AWS, Google Cloud) betreibt die Infrastruktur, viele Kunden teilen sie. Keine Anfangsinvestition.
- **Private Cloud:** Cloud-Infrastruktur nur für eine Organisation (eigenes Rechenzentrum oder gehostet). Volle Kontrolle, aber du trägst Kosten und Betrieb.
- **Hybrid Cloud:** Kombination aus Private und Public, verbunden (z. B. per VPN/ExpressRoute). Beispiel: sensible Daten on-premises, Webfrontend in der Public Cloud.
- **Multi-Cloud:** mehrere Public-Cloud-Anbieter parallel nutzen.
- **Community Cloud:** geteilt von Organisationen mit gleichen Anforderungen (z. B. Behörden).

Tools für Hybrid/Multi-Cloud: z. B. **Azure Arc** (Server und Kubernetes außerhalb von Azure verwalten).`,
    },
    {
      heading: 'Modell der geteilten Verantwortung',
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Wer ist bei **SaaS** für die Daten verantwortlich, die Nutzer hochladen?',
        options: [
          { id: 'a', text: 'Der Kunde' },
          { id: 'b', text: 'Der Anbieter', whyWrong: 'Bei SaaS betreibt der Anbieter alles bis zur fertigen Anwendung: Hardware, OS, Software, Updates. Welche Daten hochgeladen werden, wer sie sehen darf und ob sie gesichert oder gelöscht werden, entscheidet aber der Kunde. Darum bleibt er in jedem Modell für seine Daten verantwortlich.' },
        ],
        correct: 'a',
        explanation: 'Daten, Identitäten und Endgeräte bleiben in jedem Modell beim Kunden.',
      },
      sources: [
        { title: 'Microsoft: Shared Responsibility', url: 'https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility' },
        { title: 'AWS: Shared Responsibility Model', url: 'https://aws.amazon.com/compliance/shared-responsibility-model/' },
      ],
      body: `In der Cloud ist Sicherheit **geteilt** (Shared Responsibility Model):

| Bereich | On-Prem | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Daten & Informationen | Kunde | Kunde | Kunde | Kunde |
| Endgeräte (Clients) | Kunde | Kunde | Kunde | Kunde |
| Konten & Identitäten | Kunde | Kunde | Kunde | Kunde |
| Anwendung | Kunde | Kunde | geteilt | Anbieter |
| Betriebssystem | Kunde | Kunde | Anbieter | Anbieter |
| Physisches Rechenzentrum, Hardware | Kunde | Anbieter | Anbieter | Anbieter |

Merke: **Daten, Identitäten und Endgeräte bleiben immer beim Kunden.** Das physische Rechenzentrum ist in der Cloud immer Sache des Anbieters.

AWS formuliert es kurz: Der Anbieter ist für die Sicherheit **der** Cloud verantwortlich (security *of* the cloud), der Kunde für die Sicherheit **in** der Cloud (security *in* the cloud).`,
      analogy: 'Wie eine Mietwohnung: Der Vermieter sorgt für Dach und Fundament (Anbieter), aber wer seine Haustür offen lässt (schwache Passwörter), ist selbst schuld.',
    },
    {
      heading: 'Kostenmodelle, Skalierung, Verfügbarkeit',
      body: `**CapEx** (Capital Expenditure): Investition vorab, z. B. Server kaufen, wird abgeschrieben. **OpEx** (Operational Expenditure): laufende Kosten, z. B. monatliche Cloud-Rechnung. Cloud verschiebt Kosten von CapEx zu **OpEx**.

**Skalierbarkeit:**
- **Vertikal (scale up/down):** größere/kleinere VM (mehr CPU/RAM)
- **Horizontal (scale out/in):** mehr/weniger Instanzen
- **Elastizität:** Skalierung passiert **automatisch** nach Last (Autoscaling)

**Hochverfügbarkeit** misst man über das **SLA** (Service Level Agreement):

| SLA | Ausfallzeit pro Jahr | pro Monat (30 Tage) |
|---|---|---|
| 99 % | ca. 3,65 Tage | ca. 7,2 h |
| 99,9 % | ca. 8,76 h | ca. 43 min |
| 99,95 % | ca. 4,38 h | ca. 22 min |
| 99,99 % | ca. 52,6 min | ca. 4,3 min |

Hängen Dienste **hintereinander** voneinander ab, multipliziert man die SLAs: 99,9 % × 99,9 % ≈ 99,8 %.`,
      terms: [
        { de: 'Investitionsausgaben', en: 'Capital Expenditure (CapEx)' },
        { de: 'Betriebsausgaben', en: 'Operational Expenditure (OpEx)' },
        { de: 'Dienstgütevereinbarung', en: 'Service Level Agreement (SLA)' },
      ],
    },
    {
      heading: 'Regionen und Verfügbarkeitszonen',
      body: `- **Region:** geografisches Gebiet mit einem oder mehreren Rechenzentren (z. B. Azure „Germany West Central“ in Frankfurt, AWS \`eu-central-1\` Frankfurt).
- **Verfügbarkeitszone (Availability Zone, AZ):** physisch getrennte Rechenzentrumsgruppe innerhalb einer Region mit eigener Strom-, Kühlungs- und Netzwerkversorgung. Eine App über **mehrere AZs** verteilt übersteht den Ausfall eines ganzen Rechenzentrums.
- **Azure Regionspaare (Region Pairs):** zwei Regionen in derselben Geografie für Disaster Recovery (z. B. West Europe ↔ North Europe).
- **AWS Edge Locations:** Standorte für CloudFront (CDN) und Route 53, näher am Nutzer.

Region wählen nach: **Nähe zu den Nutzern (Latenz), Datenschutz/Compliance (z. B. DSGVO, Datenresidenz), Dienstverfügbarkeit, Preis**.`,
      terms: [
        { de: 'Verfügbarkeitszone', en: 'Availability Zone (AZ)' },
        { de: 'Datenresidenz', en: 'data residency' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'dragdrop', difficulty: 1,
      prompt: 'Ordne die Dienste dem richtigen **Servicemodell** zu.',
      items: [
        { id: 'i1', text: 'Microsoft 365' },
        { id: 'i2', text: 'Azure Virtual Machines' },
        { id: 'i3', text: 'Azure App Service' },
        { id: 'i4', text: 'AWS EC2' },
        { id: 'i5', text: 'Salesforce CRM' },
        { id: 'i6', text: 'Azure SQL Database' },
      ],
      buckets: [
        { id: 'iaas', label: 'IaaS' },
        { id: 'paas', label: 'PaaS' },
        { id: 'saas', label: 'SaaS' },
      ],
      solution: { i1: 'saas', i5: 'saas', i2: 'iaas', i4: 'iaas', i3: 'paas', i6: 'paas' },
      explanation: 'VMs = IaaS (du verwaltest das OS). App Service und Azure SQL Database = PaaS (Plattform wird verwaltet, du lieferst Code/Daten). Fertige Anwendungen = SaaS.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Wer ist bei **IaaS** für das Patchen des **Betriebssystems** der VM verantwortlich?',
      options: [
        { id: 'a', text: 'Der Kunde' },
        { id: 'b', text: 'Der Cloud-Anbieter', whyWrong: 'Bei IaaS mietest du nur die Infrastruktur: Rechenzentrum, Hardware, Netzwerk und Hypervisor. Das Gast-Betriebssystem in der VM installierst und verwaltest du selbst, also auch Patches. Erst bei PaaS übernimmt der Anbieter das OS.' },
        { id: 'c', text: 'Beide gemeinsam zu gleichen Teilen', whyWrong: 'Das Shared-Responsibility-Modell zieht eine klare Linie, keine Halbe-halbe-Teilung. Bei IaaS endet die Zuständigkeit des Anbieters beim Hypervisor. Alles in der VM, ab dem Gast-OS, gehört dem Kunden.' },
        { id: 'd', text: 'Niemand, VMs patchen sich selbst', whyWrong: 'VMs patchen sich nicht von selbst. Dienste wie Azure Update Manager oder AWS Systems Manager Patch Manager helfen beim Automatisieren. Einrichten, überwachen und verantworten muss das aber der Kunde.' },
      ],
      correct: 'a',
      explanation: 'Bei IaaS verwaltet der Kunde OS, Middleware, Anwendungen und Daten. Erst bei PaaS übernimmt der Anbieter das OS.',
    },
    {
      id: 'q3', type: 'multi', difficulty: 2,
      prompt: 'Wofür ist der Kunde nach dem Shared-Responsibility-Modell **immer** verantwortlich, egal ob IaaS, PaaS oder SaaS?',
      options: [
        { id: 'a', text: 'Daten und Informationen' },
        { id: 'b', text: 'Konten und Identitäten' },
        { id: 'c', text: 'Endgeräte (Clients)' },
        { id: 'd', text: 'Physische Sicherheit des Rechenzentrums', whyWrong: 'Gebäude, Zutrittskontrolle, Strom und Kühlung der Rechenzentren sind in der Public Cloud immer Sache des Anbieters. Kunden kommen dort gar nicht hinein. Immer beim Kunden bleiben Daten, Konten/Identitäten und Endgeräte.' },
        { id: 'e', text: 'Betriebssystem-Patches', whyWrong: 'Wer das Betriebssystem patcht, hängt vom Modell ab. Bei IaaS der Kunde, bei PaaS und SaaS der Anbieter. Immer beim Kunden sind nur Daten, Identitäten und Endgeräte.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Daten, Identitäten und Endgeräte bleiben immer beim Kunden. Das ist eine häufige AZ-900-Frage.',
    },
    {
      id: 'q4', type: 'single', difficulty: 1,
      prompt: 'Welche Kostenart beschreibt die **monatliche Cloud-Rechnung**?',
      options: [
        { id: 'a', text: 'OpEx (Betriebsausgaben)' },
        { id: 'b', text: 'CapEx (Investitionsausgaben)', whyWrong: 'CapEx (Capital Expenditure) sind einmalige Investitionen in Dinge, die man besitzt und über Jahre nutzt, z. B. gekaufte Server. Eine monatliche Rechnung für genutzte Leistung ist laufender Aufwand, also OpEx.' },
        { id: 'c', text: 'Abschreibung', whyWrong: 'Abschreibung verteilt den Kaufpreis eines gekauften Guts (CapEx) über seine Nutzungsdauer, z. B. einen Server über 5 Jahre. In der Cloud kauft man nichts, also gibt es nichts abzuschreiben. Die Rechnung ist laufender Betriebsaufwand (OpEx).' },
        { id: 'd', text: 'Fixkosten ohne Verbrauchsbezug', whyWrong: 'Cloud-Kosten richten sich meist nach dem Verbrauch: VM-Stunden, gespeicherte GB, übertragene Daten (Pay-as-you-go). Wer weniger nutzt, zahlt weniger. Typische Fixkosten wären eher Miete oder ein gekaufter Server.' },
      ],
      correct: 'a',
      explanation: 'Pay-as-you-go ist OpEx: keine Anfangsinvestition, laufende Kosten nach Nutzung.',
    },
    {
      id: 'q5', type: 'scenario', difficulty: 2,
      scenario: 'Ein Online-Shop hat im Dezember 10× so viele Besucher wie sonst. Die Infrastruktur soll **automatisch** zusätzliche Webserver starten und danach wieder entfernen.',
      prompt: 'Welche Cloud-Eigenschaft wird hier genutzt?',
      options: [
        { id: 'a', text: 'Elastizität (horizontale Autoskalierung)' },
        { id: 'b', text: 'Vertikale Skalierung', whyWrong: 'Vertikale Skalierung (Scale Up) macht einen einzelnen Server größer, z. B. mehr CPUs oder RAM. Hier kommen bei Last weitere Instanzen hinzu und verschwinden wieder. Das ist horizontale Skalierung. Läuft sie automatisch nach Bedarf, heißt das Elastizität.' },
        { id: 'c', text: 'Hochverfügbarkeit', whyWrong: 'Hochverfügbarkeit heißt: Die Anwendung läuft weiter, wenn eine Komponente ausfällt, z. B. durch Redundanz in mehreren Zonen. Hier geht es um etwas anderes: Ressourcen wachsen und schrumpfen mit der Last. Das ist Elastizität.' },
        { id: 'd', text: 'Disaster Recovery', whyWrong: 'Disaster Recovery ist der Plan für den Ernstfall: Nach einer Katastrophe (z. B. Ausfall einer Region) wird der Betrieb an einem anderen Ort wiederhergestellt. Mit wechselnder Last hat das nichts zu tun. Hier wird automatisch skaliert, also Elastizität.' },
      ],
      correct: 'a',
      explanation: 'Elastizität = automatische Anpassung an die Last in beide Richtungen. In Azure z. B. VM Scale Sets, in AWS Auto Scaling Groups.',
      analogy: 'Wie ein Supermarkt, der bei langer Schlange automatisch weitere Kassen öffnet und sie später wieder schließt.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Eine VM wird von 2 auf 8 vCPUs vergrößert. Wie nennt man das?',
      options: [
        { id: 'a', text: 'Vertikale Skalierung (Scale Up)' },
        { id: 'b', text: 'Horizontale Skalierung (Scale Out)', whyWrong: 'Scale Out (horizontal) heißt: Man fügt weitere VMs hinzu und verteilt die Last. Hier bleibt es eine VM, die mehr vCPUs bekommt. Mehr Leistung für eine einzelne Maschine ist Scale Up (vertikal).' },
        { id: 'c', text: 'Elastizität', whyWrong: 'Elastizität bedeutet, dass sich Ressourcen automatisch an die Last anpassen und auch wieder schrumpfen. Ein einmaliges Vergrößern einer VM ist eine Skalierungsaktion, und zwar vertikal (Scale Up).' },
        { id: 'd', text: 'Load Balancing', whyWrong: 'Ein Load Balancer verteilt eingehende Anfragen auf mehrere Instanzen. Er ändert keine VM-Größe. Mehr vCPUs für eine VM ist vertikale Skalierung.' },
      ],
      correct: 'a',
      explanation: 'Scale Up/Down = Größe einer Instanz ändern (meist mit Neustart). Scale Out/In = Anzahl ändern.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Wie viel Ausfallzeit pro **Jahr** erlaubt ein SLA von **99,9 %** ungefähr?',
      options: [
        { id: 'a', text: 'ca. 8,8 Stunden' },
        { id: 'b', text: 'ca. 53 Minuten', whyWrong: '53 Minuten pro Jahr erlaubt ein SLA von 99,99 % (0,01 % von 525.600 Minuten). Bei 99,9 % ist die erlaubte Ausfallzeit zehnmal größer: 0,1 % von 8.760 Stunden ≈ 8,8 Stunden.' },
        { id: 'c', text: 'ca. 3,7 Tage', whyWrong: '3,65 Tage pro Jahr entsprechen 99 % (1 % von 365 Tagen). Jede weitere 9 teilt die Ausfallzeit durch 10. Bei 99,9 % sind es also 0,365 Tage ≈ 8,8 Stunden.' },
        { id: 'd', text: 'ca. 43 Minuten', whyWrong: '43 Minuten erlaubt 99,9 % pro Monat (0,1 % von rund 43.800 Minuten). Gefragt war das Jahr: 12 × 43,8 Minuten ≈ 8,8 Stunden.' },
      ],
      correct: 'a',
      explanation: '0,1 % von 8760 Stunden = 8,76 Stunden.',
    },
    {
      id: 'q8', type: 'single', difficulty: 3,
      prompt: 'Eine App braucht eine Web-App (SLA 99,95 %) **und** eine Datenbank (SLA 99,99 %). Beide müssen laufen. Wie hoch ist das **zusammengesetzte SLA** ungefähr?',
      options: [
        { id: 'a', text: 'ca. 99,94 %' },
        { id: 'b', text: '99,99 %', whyWrong: 'Hängt die App von zwei Diensten ab, ist sie down, sobald einer davon ausfällt. Das gute SLA der Datenbank allein hilft nicht. Man multipliziert: 0,9995 × 0,9999 ≈ 0,9994, also ca. 99,94 %.' },
        { id: 'c', text: '99,95 %', whyWrong: 'Das zusammengesetzte SLA ist immer etwas schlechter als das schwächste Glied, weil zu den Ausfällen der Web-App noch die der Datenbank kommen. 0,9995 × 0,9999 ≈ 99,94 %, also knapp unter 99,95 %.' },
        { id: 'd', text: '199,94 %', whyWrong: 'Verfügbarkeit kann nie über 100 % liegen. SLAs in Reihe werden multipliziert, nicht addiert: 0,9995 × 0,9999 ≈ 0,9994, also ca. 99,94 %.' },
      ],
      correct: 'a',
      explanation: '0,9995 × 0,9999 = 0,99940 → ≈ 99,94 %. Abhängigkeiten in Reihe senken die Gesamtverfügbarkeit.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Was ist eine **Verfügbarkeitszone** (Availability Zone)?',
      options: [
        { id: 'a', text: 'Ein oder mehrere physisch getrennte Rechenzentren innerhalb einer Region mit eigener Strom-, Kühlungs- und Netzversorgung' },
        { id: 'b', text: 'Eine eigene geografische Region', whyWrong: 'Eine Region ist ein geografisches Gebiet, z. B. Germany West Central oder eu-central-1. In ihr liegen meist drei oder mehr Verfügbarkeitszonen. Zonen sind die einzelnen, voneinander getrennten Rechenzentrumsgruppen innerhalb der Region.' },
        { id: 'c', text: 'Ein CDN-Standort', whyWrong: 'CDN-Standorte heißen Edge Locations oder Points of Presence (PoPs). Sie liegen nah an den Nutzern und speichern Inhalte zwischen (Cache). Eine Verfügbarkeitszone ist dagegen ein vollwertiges Rechenzentrum in einer Region, in dem VMs und Datenbanken laufen.' },
        { id: 'd', text: 'Ein Rack in einem Rechenzentrum', whyWrong: 'Ein Rack ist viel kleiner. Racks und Servergruppen mit gemeinsamem Strom und Switch entsprechen in Azure Fault Domains (in Availability Sets). Eine Zone ist ein ganzes Rechenzentrum oder mehrere, mit eigener Strom-, Kühlungs- und Netzversorgung.' },
      ],
      correct: 'a',
      explanation: 'Verteilst du VMs über mehrere AZs, übersteht die Anwendung den Ausfall eines ganzen Rechenzentrums.',
    },
    {
      id: 'q10', type: 'scenario', difficulty: 2,
      scenario: 'Eine Bank muss Kundendaten aus regulatorischen Gründen im **eigenen Rechenzentrum** halten. Die öffentliche Website soll aber bei Lastspitzen in der Public Cloud skalieren.',
      prompt: 'Welches Bereitstellungsmodell passt?',
      options: [
        { id: 'a', text: 'Hybrid Cloud' },
        { id: 'b', text: 'Public Cloud', whyWrong: 'In der Public Cloud liegen alle Daten beim Anbieter. Die Vorgabe verlangt aber, dass die Kundendaten im eigenen Rechenzentrum bleiben. Gebraucht wird also eine Kombination: Daten on-premises, flexible Skalierung in der Public Cloud. Das ist Hybrid Cloud.' },
        { id: 'c', text: 'Private Cloud', whyWrong: 'Eine Private Cloud hält zwar die Daten im eigenen Haus, ist aber durch die eigene Hardware begrenzt. Für schnell wechselnde Last bräuchte man viel Reserve. Die Kombination aus beidem, Daten lokal und Rechenleistung aus der Public Cloud, ist Hybrid Cloud.' },
        { id: 'd', text: 'Community Cloud', whyWrong: 'Eine Community Cloud teilen sich mehrere Organisationen mit gleichen Anforderungen, z. B. Behörden oder Kliniken. Hier geht es um eine einzelne Firma, die lokale Daten mit Public-Cloud-Skalierung verbinden will. Das ist Hybrid Cloud.' },
      ],
      correct: 'a',
      explanation: 'Hybrid kombiniert eigenes Rechenzentrum (Kontrolle/Compliance) mit Public Cloud (Skalierung). Verbindung z. B. per Site-to-Site-VPN oder ExpressRoute/Direct Connect.',
    },
    {
      id: 'q11', type: 'multi', difficulty: 2,
      prompt: 'Welche gehören zu den **5 Merkmalen** von Cloud Computing nach NIST?',
      options: [
        { id: 'a', text: 'On-Demand Self-Service' },
        { id: 'b', text: 'Rapid Elasticity' },
        { id: 'c', text: 'Measured Service' },
        { id: 'd', text: 'Resource Pooling' },
        { id: 'e', text: 'Garantierte 100 % Verfügbarkeit', whyWrong: '100 % Verfügbarkeit garantiert kein Anbieter, und sie gehört auch nicht zu den NIST-Merkmalen. Die fünf Merkmale sind: On-Demand Self-Service, Broad Network Access, Resource Pooling, Rapid Elasticity und Measured Service. Typische SLAs liegen bei 99,9 bis 99,99 %.' },
      ],
      correct: ['a', 'b', 'c', 'd'],
      explanation: 'Das fünfte Merkmal ist Broad Network Access.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Ein Entwickler will nur Code-Funktionen hochladen, die bei einem Ereignis laufen, und **pro Ausführung** zahlen. Was nutzt er?',
      options: [
        { id: 'a', text: 'Serverless/FaaS, z. B. Azure Functions oder AWS Lambda' },
        { id: 'b', text: 'Eine IaaS-VM', whyWrong: 'Eine VM läuft und kostet ständig, auch wenn gerade keine Funktion ausgeführt wird. Außerdem muss der Entwickler OS, Patches und Laufzeitumgebung selbst pflegen. Bei Serverless (FaaS) lädt er nur Code hoch und zahlt pro Ausführung.' },
        { id: 'c', text: 'SaaS', whyWrong: 'SaaS ist fertige Software für Endnutzer, z. B. Microsoft 365 oder Salesforce. Eigenen Code kann man dort nicht beliebig hochladen. Für Funktionen, die bei Ereignissen laufen, gibt es FaaS wie Azure Functions oder AWS Lambda.' },
        { id: 'd', text: 'Private Cloud', whyWrong: 'Private Cloud ist ein Bereitstellungsmodell: Es sagt, wem die Infrastruktur gehört. Es ist kein Dienst, mit dem man Funktionen pro Ausführung abrechnet. Gesucht ist das Servicemodell Serverless/FaaS.' },
      ],
      correct: 'a',
      explanation: 'Serverless: kein Serverbetrieb, automatische Skalierung (auch auf null), Abrechnung pro Ausführung/Laufzeit.',
    },
    {
      id: 'q13', type: 'multi', difficulty: 2,
      prompt: 'Welche Kriterien sind bei der **Wahl einer Cloud-Region** wichtig?',
      options: [
        { id: 'a', text: 'Latenz zu den Nutzern' },
        { id: 'b', text: 'Compliance/Datenresidenz (z. B. DSGVO)' },
        { id: 'c', text: 'Verfügbarkeit der benötigten Dienste' },
        { id: 'd', text: 'Preis' },
        { id: 'e', text: 'Die Zeitzone des Admins', whyWrong: 'Die Verwaltung läuft über Portal, CLI oder API von überall aus, egal wo der Admin sitzt. Seine Zeitzone spielt für die Region keine Rolle. Wichtig sind Latenz zu den Nutzern, Datenresidenz, verfügbare Dienste und Preis.' },
      ],
      correct: ['a', 'b', 'c', 'd'],
      explanation: 'Nicht jeder Dienst ist in jeder Region verfügbar, und Preise unterscheiden sich je Region.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Wie fasst **AWS** das Shared-Responsibility-Modell zusammen?',
      options: [
        { id: 'a', text: 'AWS: Sicherheit „der“ Cloud – Kunde: Sicherheit „in“ der Cloud' },
        { id: 'b', text: 'AWS ist für alles verantwortlich', whyWrong: 'AWS sichert nur die Cloud selbst: Rechenzentren, Hardware, Netzwerk, Hypervisor. Was der Kunde darin baut, verantwortet er: Daten, IAM-Benutzer, Security Groups, Verschlüsselung. Eine offene S3-Bucket ist der Fehler des Kunden, nicht von AWS.' },
        { id: 'c', text: 'Der Kunde ist für alles verantwortlich', whyWrong: 'Der Kunde kommt gar nicht an Rechenzentren, Hardware oder die globale Infrastruktur heran. Die sichert AWS (Sicherheit „der“ Cloud). Der Kunde ist für das verantwortlich, was er in der Cloud konfiguriert (Sicherheit „in“ der Cloud).' },
        { id: 'd', text: 'Die Verantwortung hängt nur vom Preis ab', whyWrong: 'Wie viel man zahlt, ändert nichts an der Aufteilung. Entscheidend ist das Servicemodell: Bei EC2 (IaaS) verwaltet der Kunde das OS, bei Lambda oder RDS übernimmt AWS mehr. Die Grundformel bleibt: AWS sichert „die“ Cloud, der Kunde „in“ der Cloud.' },
      ],
      correct: 'a',
      explanation: '„Security OF the cloud“ (Hardware, Software der Infrastruktur, Netz, Rechenzentren) vs. „security IN the cloud“ (Daten, IAM, Security Groups, OS bei EC2).',
    },
    {
      id: 'q15', type: 'single', difficulty: 3,
      prompt: 'Warum ist eine Anwendung, die auf **zwei VMs in derselben Verfügbarkeitszone** läuft, **nicht** gegen den Ausfall eines Rechenzentrums geschützt?',
      options: [
        { id: 'a', text: 'Beide VMs teilen sich Strom, Kühlung und Netzwerk derselben Zone.' },
        { id: 'b', text: 'Zwei VMs sind grundsätzlich nicht hochverfügbar.', whyWrong: 'Zwei VMs können sehr wohl hochverfügbar sein, wenn sie in verschiedenen Ausfallbereichen liegen, z. B. in zwei Zonen. Hier liegen beide in derselben Zone. Fällt deren Strom oder Netz aus, sind beide gleichzeitig weg.' },
        { id: 'c', text: 'VMs können keine Load Balancer nutzen.', whyWrong: 'VMs können problemlos hinter einem Load Balancer laufen. Er verteilt aber nur auf die VMs, die es gibt. Stehen beide in derselben Zone und die fällt aus, hat er kein Ziel mehr. Das Problem ist der gemeinsame Ausfallbereich.' },
        { id: 'd', text: 'Weil die Region gewechselt werden muss.', whyWrong: 'Gegen den Ausfall eines Rechenzentrums reichen mehrere Zonen in derselben Region, denn Zonen sind physisch getrennt. Einen Regionswechsel braucht es erst bei regionalen Katastrophen. Hier fehlt nur die Verteilung über Zonen.' },
      ],
      correct: 'a',
      explanation: 'Eine Zone ist eine Ausfalldomäne. Gegen Rechenzentrumsausfälle hilft nur die Verteilung über mehrere Zonen, gegen Regionsausfälle eine zweite Region (DR).',
    },
    { id: 'g1', type: 'generated', generator: 'cost-sla', difficulty: 2 },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        scenario: 'Eine Firma migriert eine Webanwendung von einer IaaS-VM zu **Azure App Service** (PaaS).',
        prompt: 'Welche Aufgabe fällt für die Firma dadurch **weg**?',
        options: [
          { id: 'a', text: 'Patchen des Betriebssystems' },
          { id: 'b', text: 'Verwalten der Benutzerkonten mit Zugriff auf die App', whyWrong: 'Wer sich an der App anmelden darf und mit welchen Rechten, bleibt in jedem Modell beim Kunden, auch bei PaaS und SaaS. Der Anbieter liefert nur die Werkzeuge, etwa Microsoft Entra ID. Mit PaaS fällt das Patchen des Betriebssystems weg.' },
          { id: 'c', text: 'Schutz der Anwendungsdaten', whyWrong: 'Die Daten gehören immer dem Kunden, egal ob IaaS, PaaS oder SaaS. Er entscheidet über Zugriff, Verschlüsselung und Sicherung. PaaS nimmt ihm die Plattform ab, also OS und Laufzeitumgebung, nicht den Datenschutz.' },
          { id: 'd', text: 'Schreiben und Absichern des Anwendungscodes', whyWrong: 'Bei PaaS stellt der Anbieter die Plattform (OS, Laufzeit, Skalierung). Den Code der Anwendung schreibt und sichert der Kunde weiter selbst, z. B. gegen SQL-Injection. Weg fällt das Patchen des Betriebssystems.' },
        ],
        correct: 'a',
        explanation: 'PaaS übernimmt OS, Runtime und Plattform-Patches. Code, Daten, Identitäten und die App-Konfiguration bleiben beim Kunden.',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Drei Dienste hängen in Reihe voneinander ab, jeweils mit **99,9 %** SLA. Wie hoch ist das zusammengesetzte SLA ungefähr?',
        options: [
          { id: 'a', text: 'ca. 99,7 %' },
          { id: 'b', text: '99,9 %', whyWrong: '99,9 % gilt nur für einen einzelnen Dienst. Hängen drei in Reihe zusammen, ist die App down, sobald einer davon ausfällt. Die Ausfallzeiten summieren sich grob: 0,999 × 0,999 × 0,999 ≈ 0,997, also ca. 99,7 %.' },
          { id: 'c', text: 'ca. 99,97 %', whyWrong: 'Mehrere Abhängigkeiten in Reihe machen das Ganze nie besser als den einzelnen Dienst. Jede zusätzliche Abhängigkeit bringt ihre eigenen Ausfälle mit. 0,999³ ≈ 0,997, also ca. 99,7 %.' },
          { id: 'd', text: 'ca. 97 %', whyWrong: 'Hier ist ein Komma verrutscht: 0,999³ = 0,997, das sind 99,7 % und nicht 97 %. Faustregel: Drei Dienste mit je 0,1 % Ausfall ergeben grob 0,3 % Ausfall.' },
        ],
        correct: 'a',
        explanation: '0,999 × 0,999 × 0,999 ≈ 0,997 → 99,7 %, also ca. 26 h Ausfall pro Jahr statt 8,76 h.',
      },
      {
        id: 'b3', type: 'dragdrop', difficulty: 3,
        prompt: 'Wer ist bei **SaaS** wofür verantwortlich?',
        items: [
          { id: 'i1', text: 'Daten, die Nutzer hochladen' },
          { id: 'i2', text: 'MFA für Benutzerkonten aktivieren' },
          { id: 'i3', text: 'Patches der Anwendung' },
          { id: 'i4', text: 'Physische Server' },
          { id: 'i5', text: 'Betriebssystem der Server' },
          { id: 'i6', text: 'Firmen-Laptops der Nutzer' },
        ],
        buckets: [
          { id: 'cust', label: 'Kunde' },
          { id: 'prov', label: 'Anbieter' },
        ],
        solution: { i1: 'cust', i2: 'cust', i6: 'cust', i3: 'prov', i4: 'prov', i5: 'prov' },
        explanation: 'Auch bei SaaS bleiben Daten, Identitäten (inkl. MFA-Einstellungen) und Endgeräte beim Kunden.',
      },
      {
        id: 'b4', type: 'scenario', difficulty: 3,
        scenario: 'Ein Startup erwartet unvorhersehbares Wachstum und hat kaum Startkapital. Der Gründer fragt, ob er 50.000 € in eigene Server investieren soll.',
        prompt: 'Welches Argument spricht am stärksten für die Public Cloud?',
        options: [
          { id: 'a', text: 'Keine Vorabinvestition (CapEx → OpEx) und Skalierung nach tatsächlichem Bedarf' },
          { id: 'b', text: 'Die Cloud ist immer günstiger als eigene Hardware.', whyWrong: 'Die Cloud ist nicht automatisch günstiger. Bei gleichbleibend hoher Auslastung über Jahre kann eigene Hardware billiger sein. Die Stärke der Public Cloud ist: keine Anfangsinvestition und zahlen nur für tatsächlich genutzte Kapazität.' },
          { id: 'c', text: 'In der Cloud muss man sich nicht um Sicherheit kümmern.', whyWrong: 'Nach dem Shared-Responsibility-Modell bleibt viel Sicherheit beim Kunden: Daten, Identitäten, Zugriffsrechte, Konfiguration. Die meisten Cloud-Vorfälle entstehen durch Fehlkonfigurationen des Kunden. Sicherheit ist also kein Argument nach dem Motto „darum muss ich mich nicht kümmern“.' },
          { id: 'd', text: 'Die Cloud hat 100 % Verfügbarkeit.', whyWrong: 'Kein Anbieter garantiert 100 %. SLAs liegen bei 99,9 bis 99,99 %, und bei Verfehlung gibt es Gutschriften, keinen Ausfallschutz. Das stärkste Argument ist der Wechsel von CapEx zu OpEx mit Skalierung nach Bedarf.' },
        ],
        correct: 'a',
        explanation: 'Bei unsicherem Bedarf vermeidet die Cloud Überdimensionierung (teuer) und Unterdimensionierung (Ausfälle).',
      },
      {
        id: 'b5', type: 'multi', difficulty: 3,
        prompt: 'Welche Maßnahmen erhöhen die Verfügbarkeit einer VM-basierten Webanwendung gegen den **Ausfall eines ganzen Rechenzentrums**?',
        options: [
          { id: 'a', text: 'VMs über mehrere Verfügbarkeitszonen verteilen' },
          { id: 'b', text: 'Einen zonenredundanten Load Balancer davor setzen' },
          { id: 'c', text: 'Die einzelne VM vertikal vergrößern', whyWrong: 'Eine größere VM verträgt mehr Last, steht aber weiter allein in einem Rechenzentrum. Fällt das aus, ist sie trotzdem weg. Das bleibt ein Single Point of Failure. Gegen Rechenzentrumsausfälle hilft nur Verteilung über mehrere Zonen.' },
          { id: 'd', text: 'Mehr Speicherplatz an die VM hängen', whyWrong: 'Mehr Speicherplatz löst Platzprobleme, schützt aber nicht vor Ausfällen. Die VM und ihre Disks liegen weiter in einem einzigen Rechenzentrum. Schutz bringen VMs in mehreren Zonen mit einem zonenredundanten Load Balancer davor.' },
        ],
        correct: ['a', 'b'],
        explanation: 'Redundanz über Ausfalldomänen (Zonen) + Lastverteilung = Hochverfügbarkeit.',
      },
      { id: 'bg1', type: 'generated', generator: 'cost-sla', difficulty: 3 },
    ],
  },
};

export default level;
