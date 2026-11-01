import type { Level } from '../../types/content';

const level: Level = {
  id: 'cloud-03',
  track: 'cloud',
  order: 3,
  title: 'Microsoft Azure',
  titleEn: 'Azure Core: Resource Groups, VMs, Storage, VNets, NSGs, Entra ID, RBAC',
  summary: 'Azure-Hierarchie und Resource Manager, Ressourcengruppen, VMs und Verfügbarkeit, Storage-Redundanz und Zugriffsebenen, VNets und NSGs, Microsoft Entra ID und Azure RBAC.',
  certs: ['az900', 'az104'],
  domains: { az900: 'architecture', az104: 'identity' },
  lab: {
    title: 'Azure CLI: Ressourcengruppe, Speicherkonto, Sperre',
    needs: 'ein Azure-Konto (z. B. kostenloses Konto oder Azure for Students) und die Cloud Shell im Portal',
    steps: [
      '`az group create -n rg-lab -l germanywestcentral`',
      '`az storage account create -n <eindeutigername> -g rg-lab -l germanywestcentral --sku Standard_LRS` (nur Kleinbuchstaben und Ziffern).',
      '`az lock create --name nicht-loeschen --lock-type CanNotDelete -g rg-lab`',
      'Versuche `az group delete -n rg-lab` und lies die Fehlermeldung: Die Sperre greift auch für dich als Owner.',
      '`az lock delete --name nicht-loeschen -g rg-lab`',
      'Aufräumen: `az group delete -n rg-lab --yes`, damit keine Kosten entstehen.',
    ],
  },
  lesson: [
    {
      heading: 'Hierarchie und Azure Resource Manager',
      diagram: 'azure-hierarchy',
      body: `Azure ordnet alles in vier Ebenen:

| Ebene | Zweck |
|---|---|
| **Verwaltungsgruppen** (management groups) | mehrere Abonnements bündeln, Richtlinien/Rechte gemeinsam vergeben |
| **Abonnement** (subscription) | Abrechnungs- und Verwaltungsgrenze, gehört zu genau einem Entra-ID-Mandanten |
| **Ressourcengruppe** (resource group) | logischer Container für zusammengehörige Ressourcen |
| **Ressource** | VM, Storage Account, VNet … |

Berechtigungen (RBAC) und Richtlinien (Azure Policy) werden **nach unten vererbt**: Was du einem Abonnement zuweist, gilt für alle Ressourcengruppen darin.

**Azure Resource Manager (ARM)** ist die zentrale Verwaltungsschicht. Jede Aktion läuft über ARM, egal ob Portal, Azure CLI, PowerShell, REST-API oder Bicep/ARM-Templates. Deshalb gelten RBAC, Policies und Sperren überall gleich.`,
      analogy: 'Verwaltungsgruppe = Konzern, Abonnement = Tochterfirma mit eigenem Budget, Ressourcengruppe = Projektordner, Ressource = Dokument im Ordner.',
      terms: [
        { de: 'Abonnement', en: 'subscription' },
        { de: 'Ressourcengruppe', en: 'resource group' },
        { de: 'Mandant', en: 'tenant' },
      ],
    },
    {
      heading: 'Ressourcengruppen',
      body: `- Jede Ressource liegt in **genau einer** Ressourcengruppe. Ressourcengruppen lassen sich **nicht verschachteln**.
- Ressourcen können zwischen Ressourcengruppen **verschoben** werden (nicht alle Typen).
- Die Region einer Ressourcengruppe bestimmt nur, wo ihre **Metadaten** liegen. Die Ressourcen darin dürfen in anderen Regionen stehen.
- **Löschst du eine Ressourcengruppe, wird alles darin gelöscht.** Deshalb gruppiert man nach Lebenszyklus: Was zusammen entsteht und zusammen gelöscht wird, kommt in eine Gruppe.
- **Ressourcensperren (resource locks)** schützen vor Unfällen und gelten auch für Owner:
  - \`CanNotDelete\` (im Portal „Löschen“): lesen und ändern erlaubt, löschen verboten
  - \`ReadOnly\` (im Portal „Schreibgeschützt“): nur lesen

Befehl: \`az group create --name rg-lab --location germanywestcentral\``,
      terms: [{ de: 'Ressourcensperre', en: 'resource lock' }],
    },
    {
      heading: 'Virtuelle Maschinen und Verfügbarkeit',
      body: `Beim Anlegen einer VM wählst du Region, Image (z. B. Ubuntu, Windows Server), **Größe** (B/D/E/F-Serie, siehe B2), Disks und Netzwerk.

**Disks:**
- **OS-Disk** und optionale **Daten-Disks** sind **verwaltete Datenträger** (managed disks): Standard HDD, Standard SSD, Premium SSD, Premium SSD v2, Ultra Disk.
- Viele Größen haben eine **temporäre Disk** (Windows meist \`D:\`). **Daten darauf gehen bei Deallocate, Redeploy oder Wartung verloren.** Sie eignet sich nur für Auslagerungsdateien und Caches.

**Verfügbarkeitsoptionen und SLA:**
| Option | Schutz vor | VM-SLA |
|---|---|---|
| Einzel-VM mit Premium SSD/Ultra Disk | – | 99,9 % |
| **Verfügbarkeitsgruppe** (availability set) | Rack-/Host-Ausfall und Wartung: bis zu 3 **Fehlerdomänen**, bis zu 20 **Updatedomänen** | 99,95 % |
| **Verfügbarkeitszonen** (2+ VMs in verschiedenen Zonen) | Ausfall eines Rechenzentrums | 99,99 % |

**VM Scale Sets** erstellen viele identische VMs und skalieren automatisch (Autoscale).

**Fernzugriff:** Statt RDP/SSH per öffentlicher IP ins Internet zu öffnen, nutzt man **Azure Bastion**: RDP/SSH über das Portal per TLS, die VM braucht keine öffentliche IP.

**Sparen:** Reservierungen (1 oder 3 Jahre), **Azure Hybrid Benefit** (vorhandene Windows-Server-/SQL-Lizenzen), **Spot-VMs** (günstig, können jederzeit entfernt werden).`,
      analogy: 'Fehlerdomänen sind verschiedene Stromkreise im Haus: Fliegt eine Sicherung, bleiben die anderen Räume hell. Updatedomänen sind Gruppen, die der Hausmeister nacheinander renoviert, nie alle gleichzeitig.',
      terms: [
        { de: 'Verfügbarkeitsgruppe', en: 'availability set' },
        { de: 'Fehlerdomäne / Updatedomäne', en: 'fault domain / update domain' },
        { de: 'Verwalteter Datenträger', en: 'managed disk' },
      ],
    },
    {
      heading: 'Azure Storage',
      sources: [
        { title: 'Storage-Redundanz', url: 'https://learn.microsoft.com/azure/storage/common/storage-redundancy' },
        { title: 'Zugriffsebenen für Blobs', url: 'https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview' },
      ],
      body: `Ein **Speicherkonto (storage account)** bündelt mehrere Dienste:
- **Blob Storage:** Objektspeicher für unstrukturierte Daten (Bilder, Backups, Logs), Container statt Ordner
- **Azure Files:** Dateifreigaben per **SMB** (und NFS), von Windows/Linux/macOS einbindbar, mit **Azure File Sync** hybrid nutzbar
- **Queue Storage:** Nachrichtenwarteschlangen zwischen Anwendungskomponenten
- **Table Storage:** einfacher NoSQL-Schlüssel-Wert-Speicher

Der Name ist **weltweit eindeutig**, 3–24 Zeichen, **nur Kleinbuchstaben und Ziffern** (er wird Teil der URL \`https://<name>.blob.core.windows.net\`).

**Redundanz:**
| Option | Kopien | übersteht |
|---|---|---|
| **LRS** | 3 in einem Rechenzentrum | Disk-/Rack-Ausfall |
| **ZRS** | 3 über 3 Verfügbarkeitszonen | Ausfall eines Rechenzentrums |
| **GRS** | LRS + asynchron LRS in der **Partnerregion** = 6 | Ausfall der ganzen Region |
| **GZRS** | ZRS + LRS in der Partnerregion = 6 | Zone **und** Region |

Mit **RA-GRS / RA-GZRS** (read access) kann man die Sekundärregion auch ohne Failover **lesen**.

**Zugriffsebenen für Blobs (access tiers):**
| Ebene | Speicherpreis | Zugriffspreis | Mindest-Speicherdauer |
|---|---|---|---|
| Hot | hoch | niedrig | – |
| Cool | niedriger | höher | 30 Tage |
| Cold | noch niedriger | noch höher | 90 Tage |
| **Archive** | am niedrigsten | am höchsten | 180 Tage, **offline**: vor dem Lesen „rehydrieren“ (Stunden) |

Zugriff steuern: **Entra ID + RBAC** (empfohlen), **SAS-Token** (zeitlich begrenzte, eingeschränkte URL), Kontozugriffsschlüssel (Vollzugriff, sparsam verwenden). Werkzeuge: **AzCopy**, Azure Storage Explorer.`,
      analogy: 'Zugriffsebenen sind wie Keller, Dachboden und Lager außerhalb der Stadt: Je billiger der Lagerplatz, desto aufwendiger und teurer ist es, etwas wieder herauszuholen.',
      terms: [
        { de: 'Speicherkonto', en: 'storage account' },
        { de: 'Zugriffsebene', en: 'access tier' },
        { de: 'Shared Access Signature', en: 'SAS token' },
      ],
    },
    {
      heading: 'Virtuelle Netzwerke (VNets) und NSGs',
      sources: [{ title: 'Netzwerksicherheitsgruppen', url: 'https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview' }],
      body: `Ein **VNet** ist dein privates Netz in Azure:
- gehört zu **einer Region** und einem Abonnement, umfasst aber alle Zonen der Region
- hat einen oder mehrere **Adressräume** (meist RFC 1918, z. B. \`10.10.0.0/16\`), aufgeteilt in **Subnetze**
- pro Subnetz sind **5 Adressen reserviert** (siehe A4)
- Ressourcen im selben VNet können sich standardmäßig über alle Subnetze hinweg erreichen
- Für Internetzugang ausgehend plant man einen expliziten Weg (z. B. **NAT Gateway**, öffentliche IP oder Load Balancer). Der implizite „Default Outbound Access“ wird von Microsoft abgekündigt.

**Network Security Group (NSG)** = zustandsbehafteter Paketfilter (stateful), zugeordnet zu einem **Subnetz** und/oder einer **Netzwerkkarte (NIC)**.
- Regeln mit **Priorität 100–4096**: **niedrigere Zahl = wird zuerst geprüft**. Die erste passende Regel gewinnt, danach wird nicht weiter geprüft.
- Felder: Quelle, Quellport, Ziel, Zielport, Protokoll, Richtung, **Allow/Deny**
- **Service Tags** statt IP-Listen, z. B. \`Internet\`, \`VirtualNetwork\`, \`AzureLoadBalancer\`, \`Storage\`
- **Standardregeln** (Priorität 65000+, nicht löschbar, aber überschreibbar): eingehend VNet ↔ VNet und Azure Load Balancer erlaubt, **alles andere eingehend verboten**; ausgehend VNet und Internet erlaubt.
- Eingehend wird zuerst die **Subnetz-NSG**, dann die **NIC-NSG** geprüft (ausgehend umgekehrt). Beide müssen erlauben.`,
      analogy: 'Die NSG ist ein Türsteher mit nummerierter Liste: Er liest von oben (niedrigste Nummer) und handelt nach der ersten Zeile, die passt. Der Rest der Liste ist ihm dann egal.',
      terms: [
        { de: 'Netzwerksicherheitsgruppe', en: 'Network Security Group (NSG)' },
        { de: 'Dienst-Tag', en: 'service tag' },
      ],
    },
    {
      heading: 'Microsoft Entra ID und Azure RBAC',
      sources: [{ title: 'Azure RBAC – Überblick', url: 'https://learn.microsoft.com/azure/role-based-access-control/overview' }],
      body: `**Microsoft Entra ID** (früher Azure Active Directory, Azure AD) ist der cloudbasierte **Identitätsdienst**: Benutzer, Gruppen, Anmeldung (SSO), MFA, App-Registrierungen. Eine Entra-ID-Instanz heißt **Mandant (tenant)**.
- Entra ID ist **nicht** das klassische Active Directory (AD DS): Es gibt keine OUs, keine Gruppenrichtlinien (GPOs) und keinen Domänenbeitritt per Kerberos. Dafür gibt es den Zusatzdienst **Microsoft Entra Domain Services**.
- Lokale AD-Konten synchronisiert man mit **Microsoft Entra Connect** (bzw. Entra Cloud Sync): **hybride Identität**.

**Zwei Rollensysteme, nicht verwechseln:**
- **Entra-Rollen** verwalten das Verzeichnis, z. B. *Global Administrator*, *User Administrator*.
- **Azure-RBAC-Rollen** verwalten Azure-Ressourcen.

**Azure RBAC – die wichtigsten integrierten Rollen:**
| Rolle | darf |
|---|---|
| **Owner** | alles, **inklusive Zugriff an andere vergeben** |
| **Contributor** | alles verwalten, aber **keine Rechte vergeben** |
| **Reader** | nur ansehen |
| **User Access Administrator** | nur Zugriffe verwalten |

Eine **Rollenzuweisung** = **Sicherheitsprinzipal** (Benutzer, Gruppe, Service Principal, Managed Identity) + **Rollendefinition** + **Bereich (scope)**: Verwaltungsgruppe, Abonnement, Ressourcengruppe oder Ressource. Zuweisungen werden nach unten vererbt und **addieren** sich. Prinzip: **geringste Rechte (least privilege)**, am besten an Gruppen statt an Einzelpersonen.

Abgrenzung: **RBAC** regelt, *wer* etwas tun darf. **Azure Policy** regelt, *wie* Ressourcen sein dürfen (z. B. nur Region Deutschland). Mehr dazu in B10.`,
      terms: [
        { de: 'Rollenbasierte Zugriffssteuerung', en: 'role-based access control (RBAC)' },
        { de: 'Sicherheitsprinzipal', en: 'security principal' },
        { de: 'Geringste Rechte', en: 'least privilege' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welche Reihenfolge der Azure-Hierarchie ist richtig (von oben nach unten)?',
      options: [
        { id: 'a', text: 'Verwaltungsgruppe → Abonnement → Ressourcengruppe → Ressource' },
        { id: 'b', text: 'Abonnement → Verwaltungsgruppe → Ressourcengruppe → Ressource', whyWrong: 'Verwaltungsgruppen stehen über Abonnements, sie bündeln mehrere davon.' },
        { id: 'c', text: 'Ressourcengruppe → Abonnement → Ressource', whyWrong: 'Ressourcengruppen liegen in einem Abonnement, nicht umgekehrt.' },
        { id: 'd', text: 'Region → Ressourcengruppe → Abonnement', whyWrong: 'Regionen sind keine Ebene der Verwaltungshierarchie, sondern der Standort von Ressourcen.' },
      ],
      correct: 'a',
      explanation: 'Rechte und Richtlinien werden entlang dieser Hierarchie nach unten vererbt.',
    },
    {
      id: 'q2', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu **Ressourcengruppen** stimmen?',
      options: [
        { id: 'a', text: 'Eine Ressource liegt in genau einer Ressourcengruppe.' },
        { id: 'b', text: 'Ressourcen in einer Ressourcengruppe dürfen in verschiedenen Regionen liegen.' },
        { id: 'c', text: 'Löscht man die Ressourcengruppe, werden alle Ressourcen darin gelöscht.' },
        { id: 'd', text: 'Ressourcengruppen lassen sich verschachteln.', whyWrong: 'Ressourcengruppen können keine anderen Ressourcengruppen enthalten. Für Hierarchie nutzt man Verwaltungsgruppen und Abonnements.' },
        { id: 'e', text: 'Alle Ressourcen müssen in der Region der Ressourcengruppe liegen.', whyWrong: 'Die Region der Ressourcengruppe gilt nur für ihre Metadaten.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Gruppiere nach Lebenszyklus: Was zusammen entsteht und gelöscht wird, gehört in eine Ressourcengruppe.',
    },
    {
      id: 'q3', portal: 'Ressourcengruppen → „+ Erstellen“ → Abonnement, Name und Region wählen', type: 'cli', shell: 'azcli', difficulty: 1,
      prompt: 'Erstelle die Ressourcengruppe `rg-lab` in der Region Deutschland West-Mitte.',
      template: '$ az {{0}} create --name rg-lab --location {{1}}',
      blanks: [{ accept: ['group'] }, { accept: ['germanywestcentral'] }],
      explanation: 'Azure CLI folgt dem Muster `az <Dienst> <Aktion>`. Regionsnamen sind kleingeschrieben ohne Leerzeichen, z. B. `germanywestcentral`, `westeurope`.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Welche **Ressourcensperre** verhindert das Löschen eines Storage Accounts, erlaubt aber weiterhin Konfigurationsänderungen?',
      options: [
        { id: 'a', text: 'CanNotDelete (Löschen)' },
        { id: 'b', text: 'ReadOnly (Schreibgeschützt)', whyWrong: 'ReadOnly blockiert zusätzlich alle Änderungen, auch Konfigurationen.' },
        { id: 'c', text: 'Eine Azure-Policy', whyWrong: 'Azure Policy prüft Eigenschaften von Ressourcen (z. B. Region), schützt aber nicht vor dem Löschen.' },
        { id: 'd', text: 'Die RBAC-Rolle Reader', whyWrong: 'Reader nimmt einem einzelnen Benutzer alle Schreibrechte, schützt die Ressource aber nicht vor anderen Ownern.' },
      ],
      correct: 'a',
      explanation: 'Sperren gelten für alle, auch für Owner. Wer löschen will, muss die Sperre erst bewusst entfernen.',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Über welche Komponente laufen **alle** Verwaltungsaktionen in Azure, egal ob über Portal, CLI, PowerShell oder Bicep?',
      options: [
        { id: 'a', text: 'Azure Resource Manager (ARM)' },
        { id: 'b', text: 'Microsoft Entra ID', whyWrong: 'Entra ID authentifiziert dich. Die Verwaltungsanfrage selbst verarbeitet ARM.' },
        { id: 'c', text: 'Azure Monitor', whyWrong: 'Azure Monitor sammelt Metriken und Logs, verwaltet aber keine Ressourcen.' },
        { id: 'd', text: 'Azure Policy', whyWrong: 'Policy wird von ARM bei Anfragen ausgewertet, ist aber nicht die Verwaltungsschicht.' },
      ],
      correct: 'a',
      explanation: 'Weil alles über ARM läuft, gelten RBAC, Policies und Sperren für jedes Werkzeug gleich.',
    },
    {
      id: 'q6', domain: 'compute', type: 'single', difficulty: 2,
      prompt: 'Welche VM-Verfügbarkeitsoption schützt gegen den Ausfall eines **ganzen Rechenzentrums** in der Region?',
      options: [
        { id: 'a', text: 'VMs auf mehrere Verfügbarkeitszonen verteilen' },
        { id: 'b', text: 'Verfügbarkeitsgruppe (availability set)', whyWrong: 'Ein Availability Set verteilt VMs auf Racks (Fehlerdomänen) innerhalb eines Rechenzentrums.' },
        { id: 'c', text: 'Eine größere VM-Größe', whyWrong: 'Eine größere VM bleibt ein Single Point of Failure.' },
        { id: 'd', text: 'Premium SSD statt Standard HDD', whyWrong: 'Premium SSD verbessert Leistung und Einzel-VM-SLA, schützt aber nicht vor Rechenzentrumsausfällen.' },
      ],
      correct: 'a',
      explanation: 'Zonen = physisch getrennte Rechenzentren. 2+ VMs über Zonen verteilt: 99,99 % SLA. Availability Set: 99,95 %.',
    },
    {
      id: 'q7', domain: 'compute', certs: ['az104'], type: 'scenario', difficulty: 2,
      scenario: 'Ein Admin speichert Datenbank-Exporte auf Laufwerk `D:` einer Windows-VM in Azure. Nach einer Deallocate-Nacht sind die Dateien weg.',
      prompt: 'Was ist passiert?',
      options: [
        { id: 'a', text: '`D:` war die temporäre Disk; ihr Inhalt geht bei Deallocate, Redeploy oder Wartung verloren.' },
        { id: 'b', text: 'Jemand hat die Dateien gelöscht.', whyWrong: 'Das ist möglich, aber das Verhalten ist typisch für die temporäre Disk und tritt hier nach Deallocate erwartungsgemäß auf.' },
        { id: 'c', text: 'Azure löscht nachts automatisch alte Dateien.', whyWrong: 'Azure löscht nichts auf verwalteten Disks.' },
        { id: 'd', text: 'Die OS-Disk ist voll gelaufen.', whyWrong: 'Eine volle OS-Disk löscht keine Dateien auf einem anderen Laufwerk.' },
      ],
      correct: 'a',
      explanation: 'Die temporäre Disk liegt lokal auf dem Host. Wird die VM auf einen anderen Host verschoben, ist sie leer. Wichtige Daten gehören auf eine verwaltete Daten-Disk oder in Storage.',
    },
    {
      id: 'q8', domain: 'storage', type: 'dragdrop', difficulty: 2,
      prompt: 'Welche **Storage-Redundanz** passt zur Anforderung (jeweils die günstigste ausreichende)?',
      items: [
        { id: 'i1', text: 'Testdaten, Verlust bei Rechenzentrumsausfall akzeptabel' },
        { id: 'i2', text: 'Muss Ausfall einer Zone überstehen, Daten dürfen die Region nicht verlassen' },
        { id: 'i3', text: 'Muss Ausfall der ganzen Region überstehen' },
        { id: 'i4', text: 'Muss Zonen- und Regionsausfall überstehen, mit Zonenredundanz in der Primärregion' },
      ],
      buckets: [
        { id: 'lrs', label: 'LRS' },
        { id: 'zrs', label: 'ZRS' },
        { id: 'grs', label: 'GRS' },
        { id: 'gzrs', label: 'GZRS' },
      ],
      solution: { i1: 'lrs', i2: 'zrs', i3: 'grs', i4: 'gzrs' },
      explanation: 'LRS = ein Rechenzentrum. ZRS = drei Zonen einer Region. GRS = zusätzlich Kopie in der Partnerregion. GZRS = ZRS primär + Partnerregion.',
    },
    {
      id: 'q9', domain: 'storage', type: 'single', difficulty: 1,
      prompt: 'Wie viele Kopien der Daten hält **GRS** insgesamt?',
      options: [
        { id: 'a', text: '6 (3 in der Primärregion, 3 in der Partnerregion)' },
        { id: 'b', text: '3', whyWrong: '3 Kopien haben LRS und ZRS. GRS repliziert zusätzlich in die Partnerregion.' },
        { id: 'c', text: '2', whyWrong: 'Schon LRS hält 3 Kopien.' },
        { id: 'd', text: '9', whyWrong: 'Es gibt keine dritte Region bei GRS.' },
      ],
      correct: 'a',
      explanation: 'GRS = LRS in der Primärregion + asynchrone Replikation als LRS in die Partnerregion.',
    },
    {
      id: 'q10', domain: 'storage', type: 'scenario', difficulty: 2,
      scenario: 'Rechtlich müssen Rechnungen 10 Jahre aufbewahrt werden. Zugriffe sind extrem selten, ein paar Stunden Wartezeit beim Abruf sind in Ordnung.',
      prompt: 'Welche Blob-Zugriffsebene ist am kostengünstigsten?',
      options: [
        { id: 'a', text: 'Archive' },
        { id: 'b', text: 'Hot', whyWrong: 'Hot hat den höchsten Speicherpreis und ist für häufig gelesene Daten gedacht.' },
        { id: 'c', text: 'Cool', whyWrong: 'Cool ist für Daten, die mindestens 30 Tage selten genutzt, aber sofort lesbar sein müssen. Für 10 Jahre Archiv ist das zu teuer.' },
        { id: 'd', text: 'Premium', whyWrong: 'Premium-Storage ist für niedrige Latenz gedacht und am teuersten.' },
      ],
      correct: 'a',
      explanation: 'Archive hat den niedrigsten Speicherpreis, ist aber offline: Blobs müssen vor dem Lesen rehydriert werden (Stunden). Mindestdauer 180 Tage.',
      analogy: 'Archive ist das Lager außerhalb der Stadt: spottbillig, aber man muss vorher einen LKW bestellen.',
    },
    {
      id: 'q11', domain: 'storage', type: 'single', difficulty: 2,
      prompt: 'Welcher Name ist für ein **Speicherkonto** gültig?',
      options: [
        { id: 'a', text: 'stlernapp2026' },
        { id: 'b', text: 'St-LernApp-2026', whyWrong: 'Großbuchstaben und Bindestriche sind nicht erlaubt.' },
        { id: 'c', text: 'st_lernapp', whyWrong: 'Unterstriche sind nicht erlaubt.' },
        { id: 'd', text: 'st', whyWrong: 'Der Name muss mindestens 3 Zeichen lang sein.' },
      ],
      correct: 'a',
      explanation: '3–24 Zeichen, nur Kleinbuchstaben und Ziffern, weltweit eindeutig (Teil der DNS-URL).',
    },
    {
      id: 'q12', domain: 'network', type: 'scenario', difficulty: 2,
      scenario: 'Eine NSG enthält eingehend: Priorität **100** `Deny` TCP 3389 von `Internet`, Priorität **200** `Allow` TCP 3389 von `Any`.',
      prompt: 'Was passiert mit einer RDP-Verbindung aus dem Internet?',
      options: [
        { id: 'a', text: 'Sie wird blockiert – Regel 100 passt zuerst.' },
        { id: 'b', text: 'Sie wird erlaubt – Allow-Regeln haben Vorrang.', whyWrong: 'In NSGs gibt es keinen Vorrang von Allow. Es zählt nur die Priorität: Die niedrigste passende Nummer gewinnt.' },
        { id: 'c', text: 'Sie wird erlaubt – die spezifischere Regel 200 gewinnt.', whyWrong: 'Regel 200 ist sogar weniger spezifisch (Any). Außerdem zählt nicht die Spezifität, sondern die Priorität.' },
        { id: 'd', text: 'Die NSG ist ungültig wegen widersprüchlicher Regeln.', whyWrong: 'Widersprüchliche Regeln sind erlaubt. Die Priorität löst den Konflikt.' },
      ],
      correct: 'a',
      explanation: 'NSG-Regeln werden in aufsteigender Priorität geprüft. Die erste passende Regel entscheidet, danach wird nicht weiter geprüft.',
    },
    {
      id: 'q13', domain: 'network', certs: ['az104'], portal: 'Netzwerksicherheitsgruppe → Eingangssicherheitsregeln → „+ Hinzufügen“', type: 'cli', shell: 'azcli', difficulty: 2,
      prompt: 'Erlaube in der NSG `nsg-web` eingehendes **HTTPS**.',
      template: '$ az network nsg rule create -g rg-web --nsg-name nsg-web -n allow-https --priority 100 --direction Inbound --protocol Tcp --destination-port-ranges {{0}} --access {{1}}',
      blanks: [{ accept: ['443'] }, { accept: ['Allow'] }],
      explanation: 'HTTPS = TCP 443. `--access` ist `Allow` oder `Deny`. Ohne Angabe von Quelle gilt `*` (beliebig).',
    },
    {
      id: 'q14', domain: 'network', type: 'multi', difficulty: 2,
      prompt: 'Welche **Standardregeln** hat jede NSG eingehend?',
      options: [
        { id: 'a', text: 'Verkehr innerhalb des VNets erlauben (AllowVNetInBound)' },
        { id: 'b', text: 'Verkehr vom Azure Load Balancer erlauben (AllowAzureLoadBalancerInBound)' },
        { id: 'c', text: 'Alles andere verbieten (DenyAllInBound)' },
        { id: 'd', text: 'RDP und SSH aus dem Internet erlauben', whyWrong: 'Das wäre unsicher. Eingehender Internetverkehr ist standardmäßig verboten. RDP/SSH muss man explizit erlauben, besser per Azure Bastion.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Standardregeln haben Priorität 65000–65500. Man kann sie nicht löschen, aber mit niedrigeren Nummern überstimmen.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Ein Entwickler soll in einer Ressourcengruppe alles anlegen und ändern dürfen, aber **keine Rechte an andere vergeben**. Welche RBAC-Rolle?',
      options: [
        { id: 'a', text: 'Contributor' },
        { id: 'b', text: 'Owner', whyWrong: 'Owner darf zusätzlich Rollen zuweisen. Das ist mehr als nötig (least privilege).' },
        { id: 'c', text: 'Reader', whyWrong: 'Reader darf nur lesen.' },
        { id: 'd', text: 'Global Administrator', whyWrong: 'Global Administrator ist eine Entra-ID-Rolle für das Verzeichnis, keine Azure-RBAC-Rolle für Ressourcen und viel zu mächtig.' },
      ],
      correct: 'a',
      explanation: 'Contributor = volle Verwaltung ohne Zugriffsvergabe. Zuweisung am besten an eine Gruppe mit Bereich Ressourcengruppe.',
    },
    {
      id: 'q16', type: 'multi', difficulty: 2,
      prompt: 'Woraus besteht eine **Azure-RBAC-Rollenzuweisung**?',
      options: [
        { id: 'a', text: 'Sicherheitsprinzipal (wer)' },
        { id: 'b', text: 'Rollendefinition (was)' },
        { id: 'c', text: 'Bereich/Scope (wo)' },
        { id: 'd', text: 'Region', whyWrong: 'Die Region ist kein Teil einer Rollenzuweisung. Der Bereich ist eine Verwaltungsebene (Verwaltungsgruppe, Abonnement, Ressourcengruppe, Ressource).' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Wer + was + wo. Zuweisungen vererben sich nach unten und addieren sich.',
    },
    {
      id: 'q17', type: 'single', difficulty: 2,
      prompt: 'Was ist **Microsoft Entra ID** **nicht**?',
      options: [
        { id: 'a', text: 'Ein 1:1-Ersatz für ein lokales AD DS mit OUs, Gruppenrichtlinien und Kerberos-Domänenbeitritt' },
        { id: 'b', text: 'Ein cloudbasierter Identitätsdienst', whyWrong: 'Genau das ist Entra ID.' },
        { id: 'c', text: 'Der frühere Name „Azure Active Directory“', whyWrong: 'Azure AD wurde 2023 in Microsoft Entra ID umbenannt.' },
        { id: 'd', text: 'Ein Dienst, der MFA und Single Sign-On bereitstellt', whyWrong: 'MFA und SSO sind Kernfunktionen von Entra ID.' },
      ],
      correct: 'a',
      explanation: 'Entra ID ist für Cloud-Identitäten (OAuth/OIDC/SAML). Klassische Domänenfunktionen bietet der Zusatzdienst Microsoft Entra Domain Services.',
    },
    { id: 'g1', type: 'generated', generator: 'nsg', difficulty: 2, domain: 'network' },
    { id: 'g2', type: 'generated', generator: 'rbac', difficulty: 2 },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', domain: 'network', certs: ['az104'], type: 'scenario', difficulty: 3,
        scenario: 'Eine VM hat eine NSG am **Subnetz** (erlaubt TCP 443 eingehend) und eine NSG an der **NIC** (nur Standardregeln).',
        prompt: 'Kommt HTTPS aus dem Internet bei der VM an?',
        options: [
          { id: 'a', text: 'Nein – auch die NIC-NSG muss erlauben; ihre Standardregel DenyAllInBound blockiert.' },
          { id: 'b', text: 'Ja – die Subnetz-NSG erlaubt es, das reicht.', whyWrong: 'Eingehend wird erst die Subnetz-NSG, dann die NIC-NSG geprüft. Beide müssen den Verkehr erlauben.' },
          { id: 'c', text: 'Ja – NIC-NSGs werden ignoriert, wenn eine Subnetz-NSG existiert.', whyWrong: 'Beide NSGs werden ausgewertet.' },
          { id: 'd', text: 'Nur, wenn die VM eine Premium SSD hat.', whyWrong: 'Der Disk-Typ hat nichts mit der Netzwerkfilterung zu tun.' },
        ],
        correct: 'a',
        explanation: 'Doppelte NSGs sind eine häufige Fehlerquelle. Viele Teams nutzen deshalb nur NSGs auf Subnetzebene.',
      },
      {
        id: 'b2', domain: 'storage', certs: ['az104'], portal: 'Speicherkonten → „+ Erstellen“ → Grundeinstellungen → Redundanz: zonenredundanter Speicher (ZRS)', type: 'cli', shell: 'azcli', difficulty: 3,
        prompt: 'Lege ein Speicherkonto an, das den Ausfall einer **Zone** übersteht, dessen Daten aber die **Region nicht verlassen** dürfen.',
        template: '$ az storage account create -n stlernen01 -g rg-lab -l germanywestcentral --sku {{0}}',
        blanks: [{ accept: ['Standard_ZRS'] }],
        explanation: 'ZRS repliziert synchron über 3 Zonen derselben Region. GRS/GZRS würden Daten in die Partnerregion kopieren.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        scenario: 'Ein Praktikant hat versehentlich die Ressourcengruppe `rg-prod` gelöscht. Der Chef will, dass so etwas nie wieder passiert, auch nicht durch Owner.',
        prompt: 'Was ist die passende Maßnahme?',
        options: [
          { id: 'a', text: 'Eine CanNotDelete-Sperre auf rg-prod und dem Praktikanten nur die nötige Rolle (z. B. Contributor auf eine Test-Ressourcengruppe) geben' },
          { id: 'b', text: 'Dem Praktikanten Global Administrator entziehen', whyWrong: 'Global Administrator ist eine Entra-Rolle. Ressourcen löschen erlaubt Azure RBAC. Außerdem schützt das nicht vor Fehlern anderer Owner.' },
          { id: 'c', text: 'Die Ressourcengruppe in eine andere Region verschieben', whyWrong: 'Die Region schützt nicht vor dem Löschen.' },
          { id: 'd', text: 'GRS für alle Speicherkonten aktivieren', whyWrong: 'Wird ein Speicherkonto gelöscht, ist auch seine GRS-Kopie weg. Redundanz schützt vor Hardware-Ausfällen, nicht vor dem Löschen.' },
        ],
        correct: 'a',
        explanation: 'Sperren gelten auch für Owner. Dazu least privilege: Niemand sollte in Produktion mehr Rechte haben als nötig.',
      },
      {
        id: 'b4', type: 'dragdrop', difficulty: 3,
        prompt: 'Ordne zu: **Entra-ID-Rolle** oder **Azure-RBAC-Rolle**?',
        items: [
          { id: 'i1', text: 'Global Administrator' },
          { id: 'i2', text: 'Contributor' },
          { id: 'i3', text: 'User Administrator' },
          { id: 'i4', text: 'Reader' },
          { id: 'i5', text: 'Owner' },
          { id: 'i6', text: 'Helpdesk Administrator' },
        ],
        buckets: [
          { id: 'entra', label: 'Entra-ID-Rolle (Verzeichnis)' },
          { id: 'rbac', label: 'Azure-RBAC-Rolle (Ressourcen)' },
        ],
        solution: { i1: 'entra', i3: 'entra', i6: 'entra', i2: 'rbac', i4: 'rbac', i5: 'rbac' },
        explanation: 'Entra-Rollen verwalten Benutzer, Gruppen und Mandant-Einstellungen. RBAC-Rollen verwalten Azure-Ressourcen. Ein Global Administrator hat nicht automatisch Zugriff auf Abonnements (er kann ihn sich aber per „Elevate access“ verschaffen).',
      },
      {
        id: 'b5', domain: 'compute', type: 'single', difficulty: 3,
        prompt: 'Zwei Web-VMs laufen in einer **Verfügbarkeitsgruppe** mit 2 Fehlerdomänen. Welches Ereignis überlebt die Anwendung **nicht** zuverlässig?',
        options: [
          { id: 'a', text: 'Den Ausfall des ganzen Rechenzentrums' },
          { id: 'b', text: 'Den Ausfall eines Racks (Strom/Switch)', whyWrong: 'Genau dagegen schützen Fehlerdomänen: Die VMs stehen in verschiedenen Racks.' },
          { id: 'c', text: 'Geplante Host-Wartung durch Microsoft', whyWrong: 'Updatedomänen sorgen dafür, dass nicht alle VMs gleichzeitig neu gestartet werden.' },
          { id: 'd', text: 'Den Neustart einer einzelnen VM', whyWrong: 'Die zweite VM übernimmt (mit Load Balancer davor).' },
        ],
        correct: 'a',
        explanation: 'Ein Availability Set liegt in einem Rechenzentrum. Gegen Rechenzentrumsausfälle helfen Verfügbarkeitszonen.',
      },
      {
        id: 'b6', domain: 'network', type: 'scenario', difficulty: 3,
        scenario: 'Admins verbinden sich per RDP (Port 3389) über öffentliche IPs auf Windows-VMs. Im Log siehst du tausende fehlgeschlagene Anmeldeversuche aus aller Welt.',
        prompt: 'Was ist die beste Lösung?',
        options: [
          { id: 'a', text: 'Öffentliche IPs entfernen, Port 3389 in der NSG schließen und Azure Bastion nutzen' },
          { id: 'b', text: 'RDP auf Port 3390 verlegen', whyWrong: 'Security by Obscurity: Scanner finden auch andere Ports. Der Dienst bleibt aus dem Internet erreichbar.' },
          { id: 'c', text: 'Die VM-Größe erhöhen, damit sie die Anmeldeversuche verkraftet', whyWrong: 'Mehr Leistung löst kein Sicherheitsproblem.' },
          { id: 'd', text: 'GRS für die OS-Disk aktivieren', whyWrong: 'Redundanz hat nichts mit Zugriffsschutz zu tun. Zudem haben verwaltete Disks keine GRS-Option.' },
        ],
        correct: 'a',
        explanation: 'Bastion stellt RDP/SSH über TLS im Portal bereit. Die VMs brauchen keine öffentliche IP, die Angriffsfläche verschwindet. Ergänzend: MFA und Just-in-Time-VM-Zugriff (Defender for Cloud).',
      },
      { id: 'bg1', type: 'generated', generator: 'rbac', difficulty: 3 },
      { id: 'bg2', type: 'generated', generator: 'nsg', difficulty: 3, domain: 'network' },
    ],
  },
};

export default level;
