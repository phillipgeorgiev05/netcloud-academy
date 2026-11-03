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
        { id: 'b', text: 'Abonnement → Verwaltungsgruppe → Ressourcengruppe → Ressource', whyWrong: 'Verwaltungsgruppen (Management Groups) bündeln mehrere Abonnements, damit Richtlinien und Rechte für alle gleichzeitig gelten. Darum stehen sie oben. Richtig ist: Verwaltungsgruppe, dann Abonnement, dann Ressourcengruppe, dann Ressource. Rechte und Policies vererben sich von oben nach unten.' },
        { id: 'c', text: 'Ressourcengruppe → Abonnement → Ressource', whyWrong: 'Ein Abonnement enthält Ressourcengruppen, nicht umgekehrt. Das Abonnement ist die Abrechnungs- und Grenzebene, darin ordnet man Ressourcen in Gruppen. Reihenfolge: Verwaltungsgruppe, Abonnement, Ressourcengruppe, Ressource.' },
        { id: 'd', text: 'Region → Ressourcengruppe → Abonnement', whyWrong: 'Die Region beschreibt nur, wo eine Ressource physisch läuft, z. B. Germany West Central. Sie ist keine Verwaltungsebene. Eine Ressourcengruppe kann Ressourcen aus vielen Regionen enthalten. Die Hierarchie ist Verwaltungsgruppe, Abonnement, Ressourcengruppe, Ressource.' },
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
        { id: 'd', text: 'Ressourcengruppen lassen sich verschachteln.', whyWrong: 'Ressourcengruppen sind flach: Eine Gruppe kann keine andere Gruppe enthalten. Wer eine Hierarchie braucht, nutzt Verwaltungsgruppen (die schon verschachtelt werden können, bis zu 6 Ebenen) und mehrere Abonnements.' },
        { id: 'e', text: 'Alle Ressourcen müssen in der Region der Ressourcengruppe liegen.', whyWrong: 'Die Region einer Ressourcengruppe legt nur fest, wo ihre Metadaten (die Liste der Ressourcen) gespeichert werden. Die Ressourcen darin dürfen in beliebigen Regionen liegen, z. B. eine VM in Westeuropa und eine Datenbank in Nordeuropa.' },
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
        { id: 'b', text: 'ReadOnly (Schreibgeschützt)', whyWrong: 'ReadOnly geht weiter als gewünscht: Es verbietet Löschen und auch jede Änderung. Danach könnte man z. B. keine Konfiguration des Speicherkontos mehr anpassen, und manche Leseaktionen, die intern POST nutzen, scheitern auch. Für „nur nicht löschen“ ist CanNotDelete richtig.' },
        { id: 'c', text: 'Eine Azure-Policy', whyWrong: 'Azure Policy prüft, ob Ressourcen bestimmten Regeln entsprechen, z. B. nur erlaubte Regionen oder Pflicht-Tags. Vor dem Löschen schützt sie normalerweise nicht. Dafür gibt es Ressourcensperren (Locks), hier CanNotDelete.' },
        { id: 'd', text: 'Die RBAC-Rolle Reader', whyWrong: 'Die Rolle Reader beschränkt nur den Benutzer, dem sie zugewiesen ist. Alle anderen mit Owner- oder Contributor-Rechten könnten das Speicherkonto weiter löschen. Eine Sperre (CanNotDelete) schützt die Ressource selbst, egal wer es versucht, sogar vor Ownern.' },
      ],
      correct: 'a',
      explanation: 'Sperren gelten für alle, auch für Owner. Wer löschen will, muss die Sperre erst bewusst entfernen.',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Über welche Komponente laufen **alle** Verwaltungsaktionen in Azure, egal ob über Portal, CLI, PowerShell oder Bicep?',
      options: [
        { id: 'a', text: 'Azure Resource Manager (ARM)' },
        { id: 'b', text: 'Microsoft Entra ID', whyWrong: 'Microsoft Entra ID prüft nur, wer du bist, und stellt dir ein Token aus (Authentifizierung). Die eigentliche Verwaltungsanfrage, z. B. „VM anlegen“, nimmt danach der Azure Resource Manager entgegen. Er prüft deine RBAC-Rechte und führt sie aus.' },
        { id: 'c', text: 'Azure Monitor', whyWrong: 'Azure Monitor sammelt Metriken, Logs und Warnungen und zeigt an, was passiert. Ressourcen anlegen oder ändern kann er nicht. Alle Verwaltungsaktionen laufen über den Azure Resource Manager (ARM).' },
        { id: 'd', text: 'Azure Policy', whyWrong: 'Azure Policy ist ein Regelwerk, das ARM bei jeder Anfrage prüft, z. B. „nur Region X erlaubt“. Die Schicht, die Anfragen entgegennimmt und ausführt, ist aber ARM selbst. Policy ist nur ein Baustein darin.' },
      ],
      correct: 'a',
      explanation: 'Weil alles über ARM läuft, gelten RBAC, Policies und Sperren für jedes Werkzeug gleich.',
    },
    {
      id: 'q6', domain: 'compute', type: 'single', difficulty: 2,
      prompt: 'Welche VM-Verfügbarkeitsoption schützt gegen den Ausfall eines **ganzen Rechenzentrums** in der Region?',
      options: [
        { id: 'a', text: 'VMs auf mehrere Verfügbarkeitszonen verteilen' },
        { id: 'b', text: 'Verfügbarkeitsgruppe (availability set)', whyWrong: 'Eine Verfügbarkeitsgruppe (Availability Set) verteilt VMs auf verschiedene Racks (Fehlerdomänen) und Update-Domänen, aber alles im selben Rechenzentrum. Fällt das ganze Rechenzentrum aus, sind alle VMs weg. Dagegen helfen nur Verfügbarkeitszonen.' },
        { id: 'c', text: 'Eine größere VM-Größe', whyWrong: 'Eine größere VM verträgt mehr Last, steht aber weiter allein in einem Rechenzentrum. Fällt das aus, ist sie weg. Gegen Rechenzentrumsausfälle braucht man mehrere VMs in mehreren Verfügbarkeitszonen.' },
        { id: 'd', text: 'Premium SSD statt Standard HDD', whyWrong: 'Premium SSD macht die Disk schneller und verbessert das SLA einer einzelnen VM. Liegt die VM aber in einem einzigen Rechenzentrum, ist sie bei dessen Ausfall trotzdem weg. Schutz bringen nur mehrere VMs in verschiedenen Zonen.' },
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
        { id: 'b', text: 'Jemand hat die Dateien gelöscht.', whyWrong: 'Möglich wäre es, aber dann müsste jemand gezielt genau diese Dateien gelöscht haben. Typischer ist: `D:` ist auf vielen Azure-VMs die temporäre Disk, die direkt am Host hängt. Nach Deallocate startet die VM auf einem anderen Host, und die temporäre Disk ist leer. Darauf steht sogar eine Warndatei (DATALOSS_WARNING_README.txt).' },
        { id: 'c', text: 'Azure löscht nachts automatisch alte Dateien.', whyWrong: 'Azure löscht keine Dateien auf verwalteten Disks, weder nachts noch sonst. Verloren gehen nur Daten auf der temporären Disk (meist `D:`), und zwar wenn die VM den Host wechselt, z. B. bei Deallocate, Redeploy oder Wartung.' },
        { id: 'd', text: 'Die OS-Disk ist voll gelaufen.', whyWrong: 'Eine volle OS-Disk (`C:`) führt zu Fehlern beim Schreiben, löscht aber nichts, schon gar nicht auf einem anderen Laufwerk. Die Dateien auf `D:` lagen auf der temporären Disk. Die ist nach Deallocate immer leer.' },
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
        { id: 'b', text: '3', whyWrong: '3 Kopien hält LRS (alle in einem Rechenzentrum) oder ZRS (verteilt auf 3 Zonen). GRS macht dasselbe wie LRS in der Primärregion und kopiert zusätzlich asynchron in die gepaarte Region, dort wieder 3-mal. 3 + 3 = 6.' },
        { id: 'c', text: '2', whyWrong: 'Schon die einfachste Stufe LRS hält 3 Kopien in einem Rechenzentrum. GRS hält 3 in der Primärregion und 3 in der Partnerregion, zusammen 6.' },
        { id: 'd', text: '9', whyWrong: 'GRS nutzt genau zwei Regionen: die Primärregion und ihre gepaarte Region. Eine dritte gibt es nicht. 3 Kopien je Region ergeben 6.' },
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
        { id: 'b', text: 'Hot', whyWrong: 'Hot hat den höchsten Speicherpreis pro GB, dafür sind Lesen und Schreiben am günstigsten. Es ist für Daten gedacht, die oft gebraucht werden. Für Daten, die fast nie gelesen werden, ist Archive die günstigste Ebene.' },
        { id: 'c', text: 'Cool', whyWrong: 'Cool ist günstiger als Hot und für Daten gedacht, die mindestens 30 Tage selten genutzt werden, aber sofort lesbar sein müssen. Noch günstiger ist Archive (mindestens 180 Tage). Dafür muss man die Daten vor dem Lesen erst stundenlang „rehydrieren“.' },
        { id: 'd', text: 'Premium', whyWrong: 'Premium ist kein günstiger Tarif, sondern eigener Speicher auf SSDs mit sehr niedriger Latenz. Pro GB ist er am teuersten. Am günstigsten speichert man in der Zugriffsebene Archive.' },
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
        { id: 'b', text: 'St-LernApp-2026', whyWrong: 'Speicherkonto-Namen werden Teil einer weltweit eindeutigen URL (`name.blob.core.windows.net`). Erlaubt sind nur Kleinbuchstaben und Ziffern, 3 bis 24 Zeichen. Großbuchstaben und Bindestriche sind verboten.' },
        { id: 'c', text: 'st_lernapp', whyWrong: 'Unterstriche sind in Speicherkonto-Namen nicht erlaubt, auch keine Bindestriche oder Punkte. Erlaubt sind nur Kleinbuchstaben und Ziffern, 3 bis 24 Zeichen, weltweit eindeutig.' },
        { id: 'd', text: 'st', whyWrong: 'Der Name muss mindestens 3 und höchstens 24 Zeichen lang sein. „st“ hat nur 2. Erlaubt sind nur Kleinbuchstaben und Ziffern.' },
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
        { id: 'b', text: 'Sie wird erlaubt – Allow-Regeln haben Vorrang.', whyWrong: 'In einer NSG gibt es keinen Vorrang für Allow oder Deny. Die Regeln werden nach Priorität geprüft, von der kleinsten Nummer aufwärts. Die erste passende Regel entscheidet, danach wird nicht weiter geprüft. Regel 100 (Deny) passt zuerst, also wird blockiert.' },
        { id: 'c', text: 'Sie wird erlaubt – die spezifischere Regel 200 gewinnt.', whyWrong: 'Regel 200 ist sogar weniger spezifisch, weil sie „Any“ als Quelle hat. Vor allem aber kennen NSGs keine Spezifität wie Routingtabellen. Es zählt nur die Prioritätsnummer: Die kleinste passende gewinnt, hier 100.' },
        { id: 'd', text: 'Die NSG ist ungültig wegen widersprüchlicher Regeln.', whyWrong: 'Widersprüchliche Regeln sind in NSGs ganz normal und sogar gewollt, z. B. eine Ausnahme vor einem allgemeinen Verbot. Die Priorität löst den Konflikt eindeutig: Die kleinste passende Nummer gilt.' },
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
        { id: 'd', text: 'RDP und SSH aus dem Internet erlauben', whyWrong: 'Eingehender Internetverkehr ist standardmäßig verboten. Die letzte Standardregel DenyAllInBound blockiert alles, was nicht ausdrücklich erlaubt ist. RDP oder SSH muss man selbst freigeben, und besser nicht für das ganze Internet. Sicherer ist Azure Bastion.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Standardregeln haben Priorität 65000–65500. Man kann sie nicht löschen, aber mit niedrigeren Nummern überstimmen.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Ein Entwickler soll in einer Ressourcengruppe alles anlegen und ändern dürfen, aber **keine Rechte an andere vergeben**. Welche RBAC-Rolle?',
      options: [
        { id: 'a', text: 'Contributor' },
        { id: 'b', text: 'Owner', whyWrong: 'Owner darf alles, was Contributor darf, und zusätzlich Rollen an andere vergeben. Genau das soll der Entwickler nicht. Nach dem Prinzip der geringsten Rechte (least privilege) bekommt er Contributor.' },
        { id: 'c', text: 'Reader', whyWrong: 'Reader darf nur lesen, also nichts anlegen oder ändern. Der Entwickler soll aber alles anlegen und ändern. Dafür ist Contributor richtig.' },
        { id: 'd', text: 'Global Administrator', whyWrong: 'Global Administrator ist eine Rolle in Microsoft Entra ID und verwaltet das ganze Verzeichnis: Benutzer, Lizenzen, Einstellungen. Sie ist keine Azure-RBAC-Rolle für Ressourcen und wäre viel zu mächtig. Für eine Ressourcengruppe passt Contributor.' },
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
        { id: 'd', text: 'Region', whyWrong: 'Die Region ist kein Teil einer Rollenzuweisung. Eine Zuweisung besteht aus drei Teilen: wer (Sicherheitsprinzipal), was (Rollendefinition) und wo (Bereich). Der Bereich ist eine Verwaltungsebene wie Abonnement oder Ressourcengruppe, kein Standort.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Wer + was + wo. Zuweisungen vererben sich nach unten und addieren sich.',
    },
    {
      id: 'q17', type: 'single', difficulty: 2,
      prompt: 'Was ist **Microsoft Entra ID** **nicht**?',
      options: [
        { id: 'a', text: 'Ein 1:1-Ersatz für ein lokales AD DS mit OUs, Gruppenrichtlinien und Kerberos-Domänenbeitritt' },
        { id: 'b', text: 'Ein cloudbasierter Identitätsdienst', whyWrong: 'Diese Aussage stimmt: Entra ID ist ein cloudbasierter Identitätsdienst. Er verwaltet Benutzer, Gruppen und Anmeldungen für Microsoft 365, Azure und viele SaaS-Apps. Gesucht war, was Entra ID nicht ist.' },
        { id: 'c', text: 'Der frühere Name „Azure Active Directory“', whyWrong: 'Diese Aussage stimmt: Azure Active Directory heißt seit 2023 Microsoft Entra ID. Gesucht war, was Entra ID nicht ist: ein vollständiger Ersatz für ein lokales AD DS.' },
        { id: 'd', text: 'Ein Dienst, der MFA und Single Sign-On bereitstellt', whyWrong: 'Diese Aussage stimmt: MFA, Single Sign-On und Conditional Access sind Kernfunktionen von Entra ID. Gesucht war, was Entra ID nicht ist. Es kennt keine OUs, keine klassischen Gruppenrichtlinien und keinen Kerberos-Domänenbeitritt wie ein lokales AD DS.' },
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
          { id: 'b', text: 'Ja – die Subnetz-NSG erlaubt es, das reicht.', whyWrong: 'Eingehend prüft Azure zuerst die Subnetz-NSG und danach die NSG an der Netzwerkkarte. Beide müssen den Verkehr erlauben. Hier erlaubt die Subnetz-NSG HTTPS, aber die NIC-NSG hat keine Allow-Regel, und ihr DenyAllInBound blockiert.' },
          { id: 'c', text: 'Ja – NIC-NSGs werden ignoriert, wenn eine Subnetz-NSG existiert.', whyWrong: 'Azure wertet beide NSGs aus, wenn beide vorhanden sind. Keine ersetzt die andere. Eingehend muss der Verkehr erst durch die Subnetz-NSG und dann durch die NIC-NSG. Blockiert eine davon, kommt nichts an.' },
          { id: 'd', text: 'Nur, wenn die VM eine Premium SSD hat.', whyWrong: 'Der Disk-Typ beeinflusst Leistung und SLA einer VM. Mit der Netzwerkfilterung hat er nichts zu tun. Ob HTTPS ankommt, entscheiden nur die NSGs, hier blockiert die NIC-NSG.' },
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
          { id: 'b', text: 'Dem Praktikanten Global Administrator entziehen', whyWrong: 'Global Administrator ist eine Rolle in Entra ID für das Verzeichnis. Das Löschen von Ressourcen steuert Azure RBAC (z. B. Owner, Contributor). Außerdem schützt das Entziehen einer Rolle beim Praktikanten nicht vor Fehlern anderer. Eine CanNotDelete-Sperre schützt die Ressourcengruppe gegen alle.' },
          { id: 'c', text: 'Die Ressourcengruppe in eine andere Region verschieben', whyWrong: 'Die Region bestimmt nur den Standort der Ressourcen. Löschen kann man sie in jeder Region gleich. Schutz bieten eine CanNotDelete-Sperre und minimale Rechte für den Praktikanten.' },
          { id: 'd', text: 'GRS für alle Speicherkonten aktivieren', whyWrong: 'GRS schützt vor Hardware- und Regionsausfällen, nicht vor dem Löschen. Wird das Speicherkonto gelöscht, verschwinden auch die Kopien in der Partnerregion. Gegen versehentliches Löschen helfen Sperren, minimale Rechte und Soft Delete.' },
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
          { id: 'b', text: 'Den Ausfall eines Racks (Strom/Switch)', whyWrong: 'Gerade dagegen schützen Fehlerdomänen: Sie entsprechen getrennten Racks mit eigenem Strom und eigenem Netzwerk-Switch. Mit 2 Fehlerdomänen stehen die beiden VMs in verschiedenen Racks. Fällt eines aus, läuft die andere VM weiter.' },
          { id: 'c', text: 'Geplante Host-Wartung durch Microsoft', whyWrong: 'Für geplante Wartung gibt es Update-Domänen. Microsoft startet bei Wartungen immer nur eine Update-Domäne zur Zeit neu. Die VMs liegen in verschiedenen Update-Domänen, also bleibt immer eine erreichbar.' },
          { id: 'd', text: 'Den Neustart einer einzelnen VM', whyWrong: 'Startet eine einzelne VM neu, übernimmt die zweite. Mit einem Load Balancer davor merken Nutzer kaum etwas. Nicht abgedeckt ist nur der Ausfall des ganzen Rechenzentrums, denn eine Verfügbarkeitsgruppe liegt immer in nur einem.' },
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
          { id: 'b', text: 'RDP auf Port 3390 verlegen', whyWrong: 'Ein anderer Port ist nur Verstecken (Security by Obscurity). Portscanner prüfen alle 65.535 Ports in Minuten und finden RDP auch auf 3390. Der Dienst bleibt aus dem Internet angreifbar. Besser: gar keine öffentliche IP, Zugriff über Azure Bastion.' },
          { id: 'c', text: 'Die VM-Größe erhöhen, damit sie die Anmeldeversuche verkraftet', whyWrong: 'Mehr Leistung lässt die VM zwar mehr Anmeldeversuche verarbeiten. Die Angreifer kommen aber weiter an RDP heran, und ein schwaches Passwort bleibt angreifbar. Das Problem ist der offene Port, nicht die Leistung.' },
          { id: 'd', text: 'GRS für die OS-Disk aktivieren', whyWrong: 'GRS ist eine Redundanzoption für Speicherkonten und schützt vor Datenverlust bei Ausfällen. Gegen Angreifer, die sich per RDP anmelden wollen, hilft sie nicht. Verwaltete Disks bieten GRS außerdem gar nicht an (dort gibt es LRS und ZRS).' },
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
