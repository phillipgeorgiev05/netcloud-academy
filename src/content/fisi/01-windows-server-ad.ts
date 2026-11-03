import type { Level } from '../../types/content';

const level: Level = {
  id: 'fisi-01',
  track: 'fisi',
  order: 1,
  title: 'Windows Server & Active Directory',
  titleEn: 'Windows Server, AD DS, Domains, OUs, Groups',
  summary: 'Was ein Server ist, welche Windows-Server-Editionen es gibt, wie Active Directory aufgebaut ist (Gesamtstruktur, Domäne, OU), warum AD ohne DNS nicht funktioniert, Benutzer und Gruppen nach AGDLP und die FSMO-Rollen.',
  certs: ['fisi'],
  domains: { fisi: 'ap2-admin' },
  lab: {
    title: 'Eigene Test-Domäne in einer VM aufsetzen',
    needs: 'Hyper-V oder VirtualBox, ISO der kostenlosen Testversion von Windows Server (Microsoft Evaluation Center, 180 Tage), mind. 4 GB RAM für die VM',
    steps: [
      'Lege eine VM mit 2 vCPUs, 4 GB RAM und 60 GB Disk an und installiere Windows Server mit Desktopdarstellung.',
      'Gib dem Server einen Namen (z. B. `DC01`) und eine feste IP-Adresse. Trage als DNS-Server zunächst `127.0.0.1` ein, weil der Server gleich selbst DNS-Server wird.',
      'Installiere die Rolle in PowerShell als Administrator: `Install-WindowsFeature AD-Domain-Services -IncludeManagementTools`.',
      'Stufe den Server zum Domänencontroller einer neuen Gesamtstruktur hoch: `Install-ADDSForest -DomainName lab.local` (DNS wird automatisch mit installiert). Der Server startet neu.',
      'Öffne „Active Directory-Benutzer und -Computer“ (`dsa.msc`). Lege eine OU `Mitarbeiter`, darin einen Benutzer und eine globale Gruppe `GG_Vertrieb` an.',
      'Prüfe in PowerShell: `Get-ADUser -Filter *` und `nslookup -type=SRV _ldap._tcp.dc._msdcs.lab.local`. Die SRV-Abfrage muss deinen DC liefern.',
      'Aufräumen: VM herunterfahren und löschen, wenn du sie nicht mehr brauchst. Die Testversion läuft nach 180 Tagen ab.',
    ],
  },
  lesson: [
    {
      heading: 'Was ist ein Server?',
      body: `Ein **Server** ist ein Computer, der **Dienste** für andere Geräte bereitstellt: Dateien, Drucker, Anmeldung, E-Mail, Webseiten. Die Geräte, die diese Dienste nutzen, heißen **Clients**. Dasselbe Wort beschreibt auch das Programm: Ein „Webserver“ kann eine Software auf einem ganz normalen PC sein.

Server-Hardware unterscheidet sich von einem Büro-PC vor allem durch **Ausfallsicherheit**:
- zwei Netzteile (redundant), Festplatten im **RAID**
- **ECC-RAM**, der Speicherfehler erkennt und korrigiert
- Fernwartung ohne Betriebssystem (z. B. iDRAC, iLO, IPMI)
- Bauform für den **Serverschrank** (Rack, Höhe in Höheneinheiten **HE**/U)

**Windows Server** ist das Server-Betriebssystem von Microsoft, aktuell **Windows Server 2025**. Es gibt zwei wichtige Editionen:
| Edition | Virtualisierungsrechte | Einsatz |
|---|---|---|
| **Standard** | 2 VMs pro voll lizenziertem Server | wenig virtualisierte Umgebungen |
| **Datacenter** | unbegrenzt viele VMs | stark virtualisierte Hosts |

Lizenziert wird **pro physischem Prozessorkern**, mindestens 8 Kerne pro Prozessor und 16 pro Server. Dazu kommen **Zugriffslizenzen (CALs)** für Benutzer oder Geräte, die auf den Server zugreifen.

Installieren kann man mit **Desktopdarstellung** (grafische Oberfläche) oder als **Server Core** (nur Kommandozeile). Server Core braucht weniger Ressourcen, bekommt weniger Updates und bietet weniger Angriffsfläche. Verwaltet wird er aus der Ferne, z. B. mit Server-Manager, **Windows Admin Center** oder PowerShell.`,
      analogy: 'Ein Server ist wie die Küche eines Restaurants: Die Gäste (Clients) bestellen, die Küche liefert. Ein Restaurant mit nur einem Koch und einem Herd hat ein Problem, wenn der ausfällt. Darum hat die Server-Küche alles doppelt.',
      terms: [
        { de: 'Dienst', en: 'service' },
        { de: 'Zugriffslizenz', en: 'Client Access License (CAL)' },
        { de: 'Höheneinheit', en: 'rack unit (U)' },
        { de: 'Server Core (ohne grafische Oberfläche)', en: 'Server Core' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Ein Hyper-V-Host soll 12 Windows-Server-VMs betreiben. Welche Edition ist für die Lizenzierung meist die sinnvollere?',
        options: [
          { id: 'a', text: 'Datacenter' },
          { id: 'b', text: 'Standard', whyWrong: 'Standard erlaubt nur 2 Windows-Server-VMs pro voll lizenziertem Host. Für 12 VMs müsste man den Host sechsmal komplett mit Standard lizenzieren. Das ist meist teurer als einmal Datacenter, das unbegrenzt viele VMs erlaubt.' },
          { id: 'c', text: 'Server Core', whyWrong: 'Server Core ist keine Edition, sondern eine Installationsart ohne grafische Oberfläche. Es gibt sie für Standard und Datacenter gleichermaßen. Die Zahl der erlaubten VMs hängt nur von der Edition ab.' },
        ],
        correct: 'a',
        explanation: 'Datacenter erlaubt unbegrenzt viele Windows-Server-VMs auf dem lizenzierten Host. Ab einer gewissen Zahl VMs ist das günstiger als mehrfach gestapelte Standard-Lizenzen.',
      },
      sources: [{ title: 'Microsoft Learn – Neuerungen in Windows Server 2025', url: 'https://learn.microsoft.com/de-de/windows-server/get-started/whats-new-windows-server-2025' }],
    },
    {
      heading: 'Arbeitsgruppe oder Domäne?',
      body: `In einer **Arbeitsgruppe** (workgroup) verwaltet jeder PC seine Benutzer selbst. Wer an fünf PCs arbeiten will, braucht fünf Konten. Ändert er sein Passwort, muss er es an jedem PC einzeln ändern. Für ein paar Rechner zu Hause geht das, für eine Firma nicht.

In einer **Domäne** (domain) gibt es eine zentrale Datenbank mit allen Benutzern, Gruppen und Computern. Bei Microsoft heißt der Dienst dafür **Active Directory Domain Services (AD DS)**. Die Server, auf denen AD DS läuft, heißen **Domänencontroller (DC)**. Sie prüfen jede Anmeldung.

**Vorteile der Domäne:**
- ein Konto pro Person, gültig an jedem PC der Firma (**Single Sign-On** im Netz)
- zentrale Passwortregeln, Sperren bei Austritt mit einem Klick
- **Gruppenrichtlinien** (GPOs) für Einstellungen auf allen PCs
- Rechte auf Dateien und Drucker über Gruppen statt einzeln

**Immer mindestens zwei DCs:** Fällt der einzige DC aus, kann sich niemand mehr anmelden. Die DCs gleichen ihre Datenbank (Datei \`NTDS.dit\`) automatisch untereinander ab (**Replikation**). Jeder DC kann Änderungen annehmen (**Multi-Master**).

Ein PC wird **Mitglied der Domäne** durch den **Domänenbeitritt** (Systemeigenschaften oder \`Add-Computer -DomainName firma.local\`). Danach hat er ein eigenes Computerkonto im AD.`,
      compare: {
        left: 'Arbeitsgruppe', right: 'Domäne',
        rows: [
          ['Benutzer auf jedem PC einzeln', 'Benutzer zentral im AD'],
          ['kein Server nötig', 'mind. ein, besser zwei Domänencontroller'],
          ['bis etwa 10 Geräte sinnvoll', 'für Firmen jeder Größe'],
          ['Einstellungen pro PC von Hand', 'Einstellungen per Gruppenrichtlinie'],
        ],
      },
      terms: [
        { de: 'Arbeitsgruppe', en: 'workgroup' },
        { de: 'Domänencontroller', en: 'domain controller (DC)' },
        { de: 'Active Directory', en: 'Active Directory Domain Services (AD DS)' },
        { de: 'Replikation', en: 'replication' },
        { de: 'Domänenbeitritt', en: 'domain join' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 1,
        prompt: 'Eine Firma hat nur einen Domänencontroller. Was passiert, wenn er ausfällt?',
        options: [
          { id: 'a', text: 'Neue Anmeldungen an der Domäne sind nicht mehr möglich.' },
          { id: 'b', text: 'Nichts, die PCs übernehmen die Anmeldung selbst.', whyWrong: 'PCs in einer Domäne prüfen Domänenkonten nicht selbst. Sie fragen immer einen DC. Höchstens Benutzer, die sich vorher schon einmal angemeldet haben, kommen mit zwischengespeicherten Anmeldedaten noch an ihren eigenen PC. Zugriff auf Netzwerkressourcen haben sie trotzdem nicht.' },
          { id: 'c', text: 'Der Internetzugang fällt automatisch aus.', whyWrong: 'Das Internet hängt nicht direkt am DC. Indirekt kann es Probleme geben, wenn der DC auch der einzige DNS-Server ist: Dann lösen die PCs keine Namen mehr auf. Das eigentliche Problem ist aber, dass sich niemand mehr an der Domäne anmelden kann.' },
        ],
        correct: 'a',
        explanation: 'Ohne erreichbaren DC kann kein Domänenkonto geprüft werden. Darum betreibt man immer mindestens zwei DCs.',
      },
      sources: [{ title: 'Microsoft Learn – Active Directory Domain Services Overview', url: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview' }],
    },
    {
      heading: 'Aufbau: Gesamtstruktur, Domäne, OU',
      body: `Active Directory ist hierarchisch aufgebaut, von groß nach klein:

- **Gesamtstruktur** (forest): das ganze AD einer Organisation. Sie ist die **Sicherheitsgrenze**: Alle Domänen darin vertrauen sich automatisch.
  - **Struktur** (tree): Domänen mit zusammenhängendem DNS-Namen, z. B. \`firma.de\` und \`vertrieb.firma.de\`
  - **Domäne** (domain): Verwaltungseinheit mit eigenen Benutzern und Richtlinien
    - **Organisationseinheit (OU)**: Ordner innerhalb einer Domäne, beliebig verschachtelbar

Kleine und mittlere Firmen haben fast immer **eine Gesamtstruktur mit einer einzigen Domäne**. Gegliedert wird mit OUs, z. B. nach Standort oder Abteilung.

**Wofür OUs da sind:**
- **Gruppenrichtlinien** verknüpfen (z. B. andere Einstellungen für Laptops als für Server)
- **Verwaltung delegieren** (die IT in Hamburg darf nur Benutzer in der OU Hamburg zurücksetzen)
- Übersicht

**Wichtig:** Eine OU ist **kein Sicherheitsprinzipal**. Du kannst einer OU keine Rechte auf einen Ordner geben. Dafür nimmst du **Gruppen**.

Jedes Objekt hat einen eindeutigen Pfad, den **Distinguished Name (DN)**:
\`\`\`
CN=Anna Schulz,OU=Vertrieb,OU=Hamburg,DC=firma,DC=de
\`\`\`
CN = Common Name, OU = Organisationseinheit, DC = Domain Component (hier nicht Domänencontroller!).`,
      analogy: 'Die Gesamtstruktur ist der Konzern, eine Domäne eine Tochterfirma, eine OU eine Abteilung darin. Abteilungen sind gut zum Ordnen und um Regeln festzulegen. Den Schlüssel zum Lager bekommt man aber nicht als Abteilung, sondern als Mitglied einer Berechtigungsgruppe.',
      terms: [
        { de: 'Gesamtstruktur', en: 'forest' },
        { de: 'Organisationseinheit', en: 'organizational unit (OU)' },
        { de: 'Gruppenrichtlinienobjekt', en: 'Group Policy Object (GPO)' },
        { de: 'Delegierung', en: 'delegation of control' },
        { de: 'Distinguished Name', en: 'distinguished name (DN)' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Alle Benutzer der OU „Vertrieb“ sollen Lesezugriff auf den Ordner `\\\\fs01\\Angebote` bekommen. Wie setzt du das richtig um?',
        options: [
          { id: 'a', text: 'Eine Gruppe anlegen, die Vertriebsbenutzer aufnehmen und der Gruppe das Recht geben' },
          { id: 'b', text: 'Der OU „Vertrieb“ direkt das Leserecht auf den Ordner geben', whyWrong: 'Eine OU ist ein Ordner zum Strukturieren, kein Sicherheitsprinzipal. Im Berechtigungsdialog eines Ordners kann man sie gar nicht auswählen. Rechte vergibt man an Benutzer oder, besser, an Gruppen.' },
          { id: 'c', text: 'Jedem Benutzer einzeln das Recht geben', whyWrong: 'Das funktioniert, wird aber schnell unübersichtlich. Bei jedem neuen Mitarbeiter muss man alle Ordner einzeln anpassen, und beim Abgang vergisst man leicht einen. Mit einer Gruppe ändert man nur die Mitgliedschaft.' },
        ],
        correct: 'a',
        explanation: 'Rechte gehören an Gruppen. Neue Mitarbeiter kommen einfach in die Gruppe und haben sofort alle passenden Rechte.',
      },
    },
    {
      heading: 'Ohne DNS kein Active Directory',
      body: `Ein PC findet seinen Domänencontroller über **DNS**. Jeder DC trägt sich mit speziellen **SRV-Einträgen** (Service-Einträgen) ein, z. B.:
\`\`\`
_ldap._tcp.dc._msdcs.firma.local   →  dc01.firma.local
_kerberos._tcp.firma.local         →  dc01.firma.local
\`\`\`
Bei der Anmeldung fragt der PC seinen DNS-Server: „Wo ist ein DC für firma.local?“ Darum gilt:

**Alle Domänen-PCs müssen als DNS-Server den DC (bzw. interne DNS-Server) eingetragen haben, nie direkt 8.8.8.8 oder den Router.** Ein öffentlicher DNS-Server kennt die interne Zone nicht. Domänenbeitritt und Anmeldung scheitern dann mit Meldungen wie „Ein Active Directory-Domänencontroller für die Domäne konnte nicht kontaktiert werden“.

Ins Internet kommen die PCs trotzdem: Der DNS-Server auf dem DC leitet unbekannte Anfragen weiter (**Weiterleitung**, forwarder) an den Provider oder einen öffentlichen Resolver.

**Wichtige Ports** (für Firewalls zwischen Standorten):
| Port | Dienst |
|---|---|
| 53 | DNS |
| 88 | **Kerberos** (Anmeldung) |
| 389 / 636 | **LDAP** / LDAPS (Verzeichnisabfragen) |
| 445 | SMB (u. a. Gruppenrichtlinien aus SYSVOL) |
| 3268 | Globaler Katalog |

**Kerberos** ist das Anmeldeverfahren in der Domäne. Der Benutzer bekommt nach der Anmeldung ein **Ticket** und weist sich damit bei Servern aus, ohne sein Passwort erneut zu senden. Kerberos verträgt standardmäßig nur **5 Minuten Zeitunterschied** zwischen Client und DC. Darum ist eine einheitliche Uhrzeit wichtig: Die PCs holen sie automatisch aus der Domäne.`,
      terms: [
        { de: 'Dienst-Eintrag', en: 'SRV record' },
        { de: 'Weiterleitung', en: 'DNS forwarder' },
        { de: 'Kerberos-Ticket', en: 'Kerberos ticket' },
        { de: 'Verzeichnisprotokoll', en: 'Lightweight Directory Access Protocol (LDAP)' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Ein neuer PC soll der Domäne `firma.local` beitreten. Er hat per DHCP den DNS-Server 8.8.8.8 bekommen. Was passiert?',
        options: [
          { id: 'a', text: 'Der Beitritt scheitert, weil 8.8.8.8 die SRV-Einträge der internen Domäne nicht kennt.' },
          { id: 'b', text: 'Der Beitritt klappt, weil 8.8.8.8 alle Namen weltweit kennt.', whyWrong: 'Öffentliche Resolver wie 8.8.8.8 kennen nur öffentlich registrierte Zonen. `firma.local` existiert nur auf dem internen DNS-Server der Firma. Ohne die SRV-Einträge findet der PC keinen DC.' },
          { id: 'c', text: 'Der Beitritt klappt, dauert aber länger.', whyWrong: 'Es geht nicht um Geschwindigkeit. Der PC fragt nach `_ldap._tcp.dc._msdcs.firma.local` und bekommt von 8.8.8.8 keine Antwort, weil diese Zone dort nicht existiert. Ohne Antwort findet er keinen DC, und der Beitritt bricht ab.' },
        ],
        correct: 'a',
        explanation: 'Domänen-PCs brauchen den internen DNS-Server (meist den DC). Der leitet unbekannte Namen per Weiterleitung ins Internet weiter.',
      },
      sources: [{ title: 'Microsoft Learn – Kerberos Authentication Overview', url: 'https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview' }],
    },
    {
      heading: 'Benutzer und Gruppen: AGDLP',
      body: `Es gibt zwei **Gruppentypen**:
- **Sicherheitsgruppen**: für Berechtigungen (und auch als Verteiler nutzbar)
- **Verteilergruppen**: nur für E-Mail-Verteiler, keine Rechte

Und drei **Gruppenbereiche** (scopes), die bestimmen, wer Mitglied sein kann und wo die Gruppe gilt:
| Bereich | Mitglieder | Einsatz |
|---|---|---|
| **Global** | Benutzer/Gruppen aus der **eigenen** Domäne | Personen sammeln (z. B. nach Abteilung) |
| **Lokal (in Domäne)** | aus allen Domänen der Gesamtstruktur | Rechte auf eine Ressource |
| **Universal** | aus allen Domänen der Gesamtstruktur | große Gesamtstrukturen mit mehreren Domänen |

Die Faustregel heißt **AGDLP**:
- **A**ccounts (Benutzerkonten) kommen in
- **G**lobale Gruppen (wer: „GG_Vertrieb“), diese kommen in
- **D**omänen**l**okale Gruppen (was: „DL_Angebote_Lesen“), und diese bekommen die
- **P**ermissions (Berechtigungen) auf die Ressource.

Vorteil: Kommt ein neuer Vertriebler, nimmst du ihn nur in **GG_Vertrieb** auf. Soll die Buchhaltung auch lesen, kommt **GG_Buchhaltung** in **DL_Angebote_Lesen**. Die Berechtigungen am Ordner fasst du nie wieder an.

**Least Privilege** (geringste Rechte): Jeder bekommt nur, was er braucht. Admins haben für den Alltag ein normales Konto und ein **getrenntes Admin-Konto**. Die Gruppe **Domänen-Admins** ist so klein wie möglich.`,
      analogy: 'Globale Gruppen sind die Teams (wer gehört zusammen?), domänenlokale Gruppen sind die Schlüsselbunde (welche Türen gehen auf?). Man gibt ganzen Teams einen Schlüsselbund, statt jedem einzelnen Mitarbeiter Schlüssel nachzumachen.',
      terms: [
        { de: 'Sicherheitsgruppe', en: 'security group' },
        { de: 'Verteilergruppe', en: 'distribution group' },
        { de: 'Gruppenbereich', en: 'group scope' },
        { de: 'Prinzip der geringsten Rechte', en: 'least privilege' },
      ],
      check: {
        id: 'c5', type: 'ordering', difficulty: 2,
        prompt: 'Bringe AGDLP in die richtige Reihenfolge (vom Benutzer zur Berechtigung).',
        items: [
          { id: 'a', text: 'Benutzerkonto' },
          { id: 'g', text: 'Globale Gruppe' },
          { id: 'dl', text: 'Domänenlokale Gruppe' },
          { id: 'p', text: 'Berechtigung auf die Ressource' },
        ],
        explanation: 'Konten kommen in globale Gruppen, diese in domänenlokale Gruppen, und nur die domänenlokalen Gruppen erhalten die Berechtigung.',
      },
      sources: [{ title: 'Microsoft Learn – Active Directory security groups', url: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups' }],
    },
    {
      heading: 'FSMO-Rollen, Verwaltung und Cloud',
      body: `Fast alle Änderungen kann jeder DC annehmen. Einige Aufgaben darf aber immer nur **ein** DC erledigen, sonst gäbe es Konflikte. Das sind die fünf **FSMO-Rollen** (Flexible Single Master Operations):

| Rolle | gilt für | Aufgabe |
|---|---|---|
| **Schemamaster** | Gesamtstruktur | Änderungen am Schema (welche Objektarten und Attribute es gibt) |
| **Domänennamenmaster** | Gesamtstruktur | Domänen hinzufügen oder entfernen |
| **RID-Master** | Domäne | vergibt ID-Blöcke an DCs, damit jedes neue Objekt eine eindeutige SID bekommt |
| **PDC-Emulator** | Domäne | Zeitquelle der Domäne, Passwortänderungen haben Vorrang, Kontosperren |
| **Infrastrukturmaster** | Domäne | Verweise auf Objekte aus anderen Domänen aktuell halten |

Anzeigen: \`netdom query fsmo\`. Bei der ersten Domäne liegen alle fünf auf dem ersten DC.

**Werkzeuge:**
- **Active Directory-Benutzer und -Computer** (\`dsa.msc\`) für Benutzer, Gruppen, OUs
- **Gruppenrichtlinienverwaltung** (\`gpmc.msc\`)
- **PowerShell**: \`New-ADUser\`, \`Get-ADUser\`, \`Add-ADGroupMember\`, \`Unlock-ADAccount\`

**Und die Cloud?** **Microsoft Entra ID** (früher Azure AD) ist der Identitätsdienst für Microsoft 365 und Azure. Es ist **kein** Ersatz für AD DS: Es gibt dort keine OUs im klassischen Sinn, keine klassischen GPOs und keinen Kerberos-Domänenbeitritt. Viele Firmen betreiben beides (**hybride Identität**) und synchronisieren Benutzer mit **Microsoft Entra Connect** vom lokalen AD in die Cloud.`,
      terms: [
        { de: 'Betriebsmasterrollen', en: 'FSMO roles' },
        { de: 'Sicherheits-ID', en: 'security identifier (SID)' },
        { de: 'hybride Identität', en: 'hybrid identity' },
      ],
      check: {
        id: 'c6', type: 'single', difficulty: 3,
        prompt: 'Welche FSMO-Rolle ist die maßgebliche Zeitquelle einer Domäne?',
        options: [
          { id: 'a', text: 'PDC-Emulator' },
          { id: 'b', text: 'RID-Master', whyWrong: 'Der RID-Master vergibt Blöcke von Relativ-IDs an die DCs, damit neue Benutzer, Gruppen und Computer eindeutige SIDs bekommen. Mit der Uhrzeit hat er nichts zu tun. Zeitquelle ist der PDC-Emulator der Stammdomäne.' },
          { id: 'c', text: 'Schemamaster', whyWrong: 'Der Schemamaster ist nur für Änderungen am AD-Schema zuständig, z. B. wenn Exchange neue Attribute einführt. Das kommt selten vor. Die Zeit gibt der PDC-Emulator vor.' },
          { id: 'd', text: 'Infrastrukturmaster', whyWrong: 'Der Infrastrukturmaster hält Verweise auf Objekte aus anderen Domänen aktuell, z. B. Gruppenmitglieder aus einer Nachbardomäne. Die Uhrzeit liefert der PDC-Emulator.' },
        ],
        correct: 'a',
        explanation: 'Der PDC-Emulator der Stammdomäne holt die Zeit von einer externen Quelle. Alle anderen DCs und PCs synchronisieren sich über die Domänenhierarchie mit ihm, damit Kerberos funktioniert.',
      },
      sources: [{ title: 'Microsoft Learn – FSMO roles in Active Directory', url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles' }],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Wie heißt ein Server, auf dem Active Directory Domain Services läuft und der Anmeldungen prüft?',
      options: [
        { id: 'a', text: 'Domänencontroller' },
        { id: 'b', text: 'Dateiserver', whyWrong: 'Ein Dateiserver stellt freigegebene Ordner bereit. Anmeldungen prüft er nicht selbst, er fragt dafür einen Domänencontroller. Ein Server kann zwar beide Rollen haben, der Begriff für die AD-Rolle ist aber Domänencontroller.' },
        { id: 'c', text: 'DHCP-Server', whyWrong: 'Ein DHCP-Server verteilt IP-Adressen und Netzwerkeinstellungen an Clients. Mit Benutzerkonten und Anmeldung hat er nichts zu tun.' },
        { id: 'd', text: 'Hypervisor', whyWrong: 'Ein Hypervisor (z. B. Hyper-V) führt virtuelle Maschinen aus. Ein DC kann als VM darauf laufen, der Hypervisor selbst prüft aber keine Domänenanmeldungen.' },
      ],
      correct: 'a',
      explanation: 'Domänencontroller (DCs) halten die AD-Datenbank und prüfen Anmeldungen per Kerberos.',
    },
    {
      id: 'q2', type: 'multi', difficulty: 1,
      prompt: 'Welche Vorteile bringt eine Domäne gegenüber einer Arbeitsgruppe?',
      options: [
        { id: 'a', text: 'Ein Konto pro Person für alle PCs der Firma' },
        { id: 'b', text: 'Zentrale Einstellungen per Gruppenrichtlinie' },
        { id: 'c', text: 'Konto eines ausgeschiedenen Mitarbeiters an einer Stelle sperren' },
        { id: 'd', text: 'Kein Server nötig', whyWrong: 'Genau umgekehrt: Eine Domäne braucht mindestens einen, besser zwei Domänencontroller. Ohne Server kommt nur die Arbeitsgruppe aus, in der jeder PC seine Konten selbst verwaltet.' },
        { id: 'e', text: 'PCs brauchen keine Updates mehr', whyWrong: 'Auch Domänen-PCs brauchen Updates. Die Domäne macht es nur einfacher, sie zentral zu steuern, z. B. per Gruppenrichtlinie oder WSUS. Wegfallen tun sie nicht.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Zentrale Konten, zentrale Richtlinien und zentrale Sperre sind die Hauptgründe für eine Domäne.',
    },
    {
      id: 'q3', type: 'ordering', difficulty: 2,
      prompt: 'Ordne die AD-Ebenen von der größten zur kleinsten.',
      items: [
        { id: 'forest', text: 'Gesamtstruktur (forest)' },
        { id: 'tree', text: 'Struktur (tree)' },
        { id: 'domain', text: 'Domäne' },
        { id: 'ou', text: 'Organisationseinheit (OU)' },
      ],
      explanation: 'Gesamtstruktur → Struktur → Domäne → OU. Die Gesamtstruktur ist die Sicherheitsgrenze.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Was ist die eigentliche Sicherheitsgrenze in Active Directory?',
      options: [
        { id: 'a', text: 'Die Gesamtstruktur' },
        { id: 'b', text: 'Die Domäne', whyWrong: 'Alle Domänen einer Gesamtstruktur vertrauen sich automatisch gegenseitig, und Administratoren der Stammdomäne können die ganze Gesamtstruktur übernehmen. Eine Domäne trennt also nicht sicher. Wer echte Trennung braucht, baut eine eigene Gesamtstruktur.' },
        { id: 'c', text: 'Die OU', whyWrong: 'OUs dienen zum Ordnen, zum Verknüpfen von Gruppenrichtlinien und zum Delegieren. Domänen-Admins haben aber auf alle OUs Zugriff. Eine OU ist darum keine Sicherheitsgrenze.' },
        { id: 'd', text: 'Der Standort (site)', whyWrong: 'Standorte bilden die physische Netzwerkstruktur ab, z. B. Hamburg und München. Sie steuern Replikation und welchen DC ein PC bevorzugt. Mit Sicherheitsgrenzen haben sie nichts zu tun.' },
      ],
      correct: 'a',
      explanation: 'Laut Microsoft ist die Gesamtstruktur die Sicherheitsgrenze. Innerhalb einer Gesamtstruktur vertrauen sich alle Domänen.',
    },
    {
      id: 'q5', type: 'multi', difficulty: 2,
      prompt: 'Wofür nutzt man Organisationseinheiten (OUs)?',
      options: [
        { id: 'a', text: 'Gruppenrichtlinien gezielt verknüpfen' },
        { id: 'b', text: 'Verwaltung delegieren (z. B. Passwort-Reset für einen Standort)' },
        { id: 'c', text: 'Objekte übersichtlich ordnen' },
        { id: 'd', text: 'NTFS-Rechte auf Ordner vergeben', whyWrong: 'Eine OU ist kein Sicherheitsprinzipal und hat keine SID. Im Berechtigungsdialog eines Ordners kann man sie nicht auswählen. Rechte vergibt man an Gruppen, nach AGDLP an domänenlokale Gruppen.' },
        { id: 'e', text: 'Als E-Mail-Verteiler nutzen', whyWrong: 'Eine OU hat keine E-Mail-Adresse. Für Verteiler gibt es Verteilergruppen (oder Sicherheitsgruppen mit Mailadresse). Die OU ordnet nur Objekte.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'OUs sind Container für Gruppenrichtlinien, Delegierung und Ordnung, aber keine Sicherheitsprinzipale.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Welchen DNS-Server tragen Domänen-PCs ein?',
      options: [
        { id: 'a', text: 'Den internen DNS-Server (meist den Domänencontroller)' },
        { id: 'b', text: 'Den Router', whyWrong: 'Der Router leitet DNS-Anfragen meist an den Provider weiter. Die interne AD-Zone mit den SRV-Einträgen kennt er nicht. Ohne sie findet der PC keinen DC, Anmeldung und Gruppenrichtlinien scheitern.' },
        { id: 'c', text: '8.8.8.8, weil er schneller ist', whyWrong: 'Öffentliche Resolver kennen keine internen Zonen wie `firma.local`. Der PC fände keinen DC. Ins Internet kommen die PCs trotzdem: Der interne DNS-Server leitet unbekannte Anfragen per Weiterleitung nach außen.' },
        { id: 'd', text: 'Gar keinen, AD funktioniert ohne DNS', whyWrong: 'AD ist auf DNS angewiesen. PCs finden Domänencontroller über SRV-Einträge wie `_ldap._tcp.dc._msdcs.firma.local`. Ohne DNS gibt es keinen Domänenbeitritt und keine Anmeldung.' },
      ],
      correct: 'a',
      explanation: 'Nur der interne DNS kennt die SRV-Einträge der Domäne. Externe Namen löst er per Weiterleitung auf.',
    },
    {
      id: 'q7', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Ports den Diensten im AD-Umfeld zu.',
      items: [
        { id: 'p53', text: '53' },
        { id: 'p88', text: '88' },
        { id: 'p389', text: '389' },
        { id: 'p445', text: '445' },
      ],
      buckets: [
        { id: 'dns', label: 'DNS' },
        { id: 'krb', label: 'Kerberos' },
        { id: 'ldap', label: 'LDAP' },
        { id: 'smb', label: 'SMB' },
      ],
      solution: { p53: 'dns', p88: 'krb', p389: 'ldap', p445: 'smb' },
      explanation: 'DNS 53, Kerberos 88, LDAP 389 (LDAPS 636), SMB 445.',
    },
    {
      id: 'q8', type: 'scenario', difficulty: 2,
      prompt: 'Was ist die wahrscheinlichste Ursache?',
      scenario: 'Mehrere Benutzer an einem Standort können sich nicht anmelden. Meldung: „Die Uhrzeit oder das Datum zwischen Client und Server weichen voneinander ab.“ Die PCs zeigen eine Uhrzeit, die 12 Minuten vorgeht.',
      options: [
        { id: 'a', text: 'Kerberos lehnt die Anmeldung ab, weil die Zeitabweichung über 5 Minuten liegt.' },
        { id: 'b', text: 'Die Passwörter sind abgelaufen.', whyWrong: 'Bei abgelaufenen Passwörtern fordert Windows zum Ändern auf. Die Meldung hier nennt ausdrücklich die Uhrzeit. Kerberos-Tickets enthalten Zeitstempel und werden bei zu großer Abweichung abgelehnt.' },
        { id: 'c', text: 'Der DHCP-Server ist ausgefallen.', whyWrong: 'Ohne DHCP bekämen neu gestartete PCs keine IP-Adresse (oder eine 169.254.x.x). Die Meldung weist aber klar auf die Zeit hin. Mit 12 Minuten Abweichung liegt sie über der Kerberos-Grenze von 5 Minuten.' },
        { id: 'd', text: 'Die Benutzer sind in der falschen OU.', whyWrong: 'Die OU bestimmt, welche Gruppenrichtlinien gelten. Ob die Anmeldung gelingt, hängt nicht davon ab. Hier scheitert Kerberos an der Zeitabweichung.' },
      ],
      correct: 'a',
      explanation: 'Kerberos erlaubt standardmäßig maximal 5 Minuten Zeitunterschied. Die PCs müssen ihre Zeit wieder aus der Domänenhierarchie beziehen.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Ein Vertriebsmitarbeiter soll Zugriff auf den Ordner „Angebote“ bekommen. Nach AGDLP: Was machst du?',
      options: [
        { id: 'a', text: 'Ihn in die globale Gruppe GG_Vertrieb aufnehmen, die schon Mitglied von DL_Angebote_Lesen ist' },
        { id: 'b', text: 'Ihm direkt Leserechte auf den Ordner geben', whyWrong: 'Direkte Rechte für einzelne Benutzer machen Berechtigungen unübersichtlich. Beim Abteilungswechsel vergisst man sie leicht. Nach AGDLP ändert man nur Gruppenmitgliedschaften und fasst die Ordnerrechte nicht an.' },
        { id: 'c', text: 'Ihn in die Gruppe Domänen-Admins aufnehmen', whyWrong: 'Domänen-Admins dürfen alles in der Domäne. Für einen Ordnerzugriff wäre das ein massiver Verstoß gegen das Prinzip der geringsten Rechte. Ein gestohlenes Konto hätte dann vollen Zugriff.' },
        { id: 'd', text: 'Ihn in die domänenlokale Gruppe aufnehmen und die globale Gruppe auflösen', whyWrong: 'Benutzer gehören nach AGDLP in globale Gruppen, nicht direkt in domänenlokale. Die globale Gruppe GG_Vertrieb bündelt alle Vertriebler und kann vielen Ressourcen-Gruppen zugeordnet werden. Sie aufzulösen würde die Struktur zerstören.' },
      ],
      correct: 'a',
      explanation: 'Neuer Mitarbeiter → globale Abteilungsgruppe. Alle Rechte ergeben sich über deren Mitgliedschaften.',
    },
    {
      id: 'q10', type: 'single', difficulty: 1,
      prompt: 'Welche Gruppenart verwendest du, um NTFS-Rechte zu vergeben?',
      options: [
        { id: 'a', text: 'Sicherheitsgruppe' },
        { id: 'b', text: 'Verteilergruppe', whyWrong: 'Verteilergruppen haben keine SID und tauchen in Berechtigungsdialogen nicht auf. Sie sind nur für E-Mail-Verteiler da, z. B. in Exchange. Für Rechte braucht man Sicherheitsgruppen.' },
        { id: 'c', text: 'Organisationseinheit', whyWrong: 'Eine OU ist gar keine Gruppe, sondern ein Container zum Ordnen. Rechte auf Ordner kann man ihr nicht geben. Dafür gibt es Sicherheitsgruppen.' },
      ],
      correct: 'a',
      explanation: 'Nur Sicherheitsgruppen haben eine SID und können Berechtigungen erhalten.',
    },
    {
      id: 'q11', type: 'dragdrop', difficulty: 3,
      prompt: 'Gilt die FSMO-Rolle für die ganze Gesamtstruktur oder für jede Domäne einzeln?',
      items: [
        { id: 'schema', text: 'Schemamaster' },
        { id: 'naming', text: 'Domänennamenmaster' },
        { id: 'rid', text: 'RID-Master' },
        { id: 'pdc', text: 'PDC-Emulator' },
        { id: 'infra', text: 'Infrastrukturmaster' },
      ],
      buckets: [
        { id: 'forest', label: 'einmal pro Gesamtstruktur' },
        { id: 'domain', label: 'einmal pro Domäne' },
      ],
      solution: { schema: 'forest', naming: 'forest', rid: 'domain', pdc: 'domain', infra: 'domain' },
      explanation: 'Schema- und Domänennamenmaster gibt es einmal pro Gesamtstruktur, RID-, PDC- und Infrastrukturmaster einmal pro Domäne.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Neue Benutzer lassen sich nicht mehr anlegen: „Die Kontokennung (RID) kann nicht zugewiesen werden.“ Welche FSMO-Rolle ist vermutlich nicht erreichbar?',
      options: [
        { id: 'a', text: 'RID-Master' },
        { id: 'b', text: 'PDC-Emulator', whyWrong: 'Der PDC-Emulator ist Zeitquelle und bevorzugtes Ziel bei Passwortänderungen und Kontosperren. Neue Objekt-IDs vergibt er nicht. Die RID-Blöcke kommen vom RID-Master.' },
        { id: 'c', text: 'Schemamaster', whyWrong: 'Der Schemamaster wird nur für Schemaänderungen gebraucht, z. B. bei der Installation von Exchange. Für neue Benutzer ist er nicht nötig. Die Meldung nennt ausdrücklich die RID.' },
        { id: 'd', text: 'Domänennamenmaster', whyWrong: 'Der Domänennamenmaster wird nur beim Hinzufügen oder Entfernen von Domänen gebraucht. Neue Benutzer betrifft er nicht. Fehlende RIDs kommen vom RID-Master.' },
      ],
      correct: 'a',
      explanation: 'Jeder DC bekommt vom RID-Master Blöcke von Relativ-IDs. Sind sie aufgebraucht und der RID-Master ist nicht erreichbar, kann der DC keine neuen Objekte anlegen.',
    },
    {
      id: 'q13', type: 'single', difficulty: 1,
      prompt: 'Was beschreibt Server Core?',
      options: [
        { id: 'a', text: 'Eine Installation von Windows Server ohne grafische Oberfläche, verwaltet per PowerShell oder aus der Ferne' },
        { id: 'b', text: 'Eine eigene, günstigere Edition für kleine Firmen', whyWrong: 'Server Core ist keine Edition, sondern eine Installationsoption von Standard und Datacenter. Die Lizenzkosten sind gleich. Unterschied ist nur die fehlende grafische Oberfläche.' },
        { id: 'c', text: 'Die Mindestanzahl an Prozessorkernen für die Lizenz', whyWrong: 'Die Mindestlizenz ist 16 Kerne pro Server bzw. 8 pro Prozessor. Das hat mit Server Core nichts zu tun. Server Core heißt: Installation ohne Desktop.' },
        { id: 'd', text: 'Ein Cloud-Dienst von Microsoft', whyWrong: 'Server Core ist eine lokale Installationsart von Windows Server, kein Cloud-Dienst. Sie läuft auf eigener Hardware oder in einer VM.' },
      ],
      correct: 'a',
      explanation: 'Server Core spart Ressourcen und Angriffsfläche. Man verwaltet ihn mit PowerShell, Server-Manager oder Windows Admin Center aus der Ferne.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Was ist Microsoft Entra Connect?',
      options: [
        { id: 'a', text: 'Ein Werkzeug, das Benutzer aus dem lokalen AD nach Microsoft Entra ID synchronisiert' },
        { id: 'b', text: 'Ein VPN zu Azure', whyWrong: 'Für eine Netzwerkverbindung zu Azure gibt es das VPN-Gateway oder ExpressRoute. Entra Connect überträgt keine Netzwerkpakete, sondern gleicht Identitäten zwischen lokalem AD und Entra ID ab.' },
        { id: 'c', text: 'Der neue Name für Active Directory Domain Services', whyWrong: 'AD DS heißt weiter AD DS. Umbenannt wurde 2023 Azure AD in Microsoft Entra ID. Entra Connect ist das Synchronisierungswerkzeug zwischen beiden.' },
        { id: 'd', text: 'Ein Dienst, der lokale DCs überflüssig macht', whyWrong: 'Entra Connect setzt ein lokales AD voraus: Es liest die Benutzer daraus und überträgt sie in die Cloud. Die DCs bleiben für Anmeldung, Gruppenrichtlinien und Kerberos vor Ort nötig.' },
      ],
      correct: 'a',
      explanation: 'Mit Entra Connect (Sync oder Cloud Sync) haben Benutzer lokal und in Microsoft 365 dieselbe Identität (hybride Identität).',
    },
    {
      id: 'q15', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Das Konto von `aschulz` ist nach zu vielen Fehlversuchen gesperrt. Entsperre es per PowerShell.',
      template: '{{0}} -Identity aschulz',
      blanks: [{ accept: ['Unlock-ADAccount'] }],
      explanation: '`Unlock-ADAccount` hebt eine Kontosperre auf. Das Passwort bleibt dabei gleich.',
    },
    {
      id: 'q16', type: 'multi', difficulty: 2,
      prompt: 'Welche Maßnahmen entsprechen dem Prinzip der geringsten Rechte?',
      options: [
        { id: 'a', text: 'Admins nutzen für E-Mail und Surfen ein normales Konto, für Verwaltung ein getrenntes Admin-Konto.' },
        { id: 'b', text: 'Die Gruppe Domänen-Admins enthält nur wenige Personen.' },
        { id: 'c', text: 'Helpdesk-Mitarbeiter dürfen per Delegierung nur Passwörter in ihrer OU zurücksetzen.' },
        { id: 'd', text: 'Alle IT-Mitarbeiter sind Domänen-Admins, damit niemand warten muss.', whyWrong: 'Je mehr Domänen-Admins, desto mehr Konten, mit denen ein Angreifer die ganze Domäne übernehmen kann. Wer nur Passwörter zurücksetzt, braucht dafür eine Delegierung auf die passende OU, nicht volle Rechte.' },
        { id: 'e', text: 'Ein gemeinsames Admin-Konto für das ganze Team', whyWrong: 'Bei einem geteilten Konto ist nicht nachvollziehbar, wer was getan hat. Bei Austritt eines Kollegen muss das Passwort überall geändert werden. Jeder Admin bekommt ein eigenes, personalisiertes Admin-Konto.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Getrennte Admin-Konten, kleine Admin-Gruppen und Delegierung begrenzen den Schaden, wenn ein Konto kompromittiert wird.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Was ist die Ursache?',
        scenario: 'Ein neuer Laptop soll der Domäne `firma.local` beitreten.\n```\nC:\\> ipconfig /all\n   IPv4-Adresse . . . . : 192.168.10.57\n   Standardgateway  . . : 192.168.10.1\n   DNS-Server . . . . . : 192.168.10.1\n\nC:\\> nslookup -type=SRV _ldap._tcp.dc._msdcs.firma.local\n*** _ldap._tcp.dc._msdcs.firma.local wurde von fritz.box nicht gefunden: Non-existent domain\n```\nDer DC hat die Adresse 192.168.10.5.',
        options: [
          { id: 'a', text: 'Der Laptop nutzt den Router als DNS-Server, der die AD-Zone nicht kennt. Der DHCP-Server muss 192.168.10.5 als DNS verteilen.' },
          { id: 'b', text: 'Der DC ist ausgefallen.', whyWrong: 'Die Ausgabe zeigt, dass die Anfrage gar nicht beim DC landet: Antwort kommt von fritz.box, dem Router. Ob der DC läuft, lässt sich daraus nicht ablesen. Erst mit dem richtigen DNS-Server kann der Laptop ihn überhaupt finden.' },
          { id: 'c', text: 'Das Standardgateway ist falsch.', whyWrong: 'Das Gateway 192.168.10.1 ist für Ziele außerhalb des eigenen Netzes zuständig. Der DC liegt aber im selben Netz (192.168.10.5). Falsch ist der DNS-Server: Der Router kennt die SRV-Einträge der Domäne nicht.' },
          { id: 'd', text: 'Der Laptop muss zuerst in eine OU verschoben werden.', whyWrong: 'Vor dem Beitritt existiert im AD noch gar kein Computerkonto, das man verschieben könnte. Neue Computer landen standardmäßig im Container „Computers“. Das Problem ist die DNS-Auflösung.' },
        ],
        correct: 'a',
        explanation: 'Der Router kennt `firma.local` nicht. Mit dem DC als DNS-Server findet der Laptop die SRV-Einträge, und der Beitritt klappt. Externe Namen löst der DC per Weiterleitung auf.',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Eine Firma mit einer Domäne hat 40 Ordner und 6 Abteilungen. Die Rechte wurden bisher einzeln an Benutzer vergeben. Was ist die sauberste Neuordnung?',
        options: [
          { id: 'a', text: 'Globale Gruppen je Abteilung, domänenlokale Gruppen je Ordner und Recht, Rechte nur an die domänenlokalen Gruppen' },
          { id: 'b', text: 'Eine OU je Abteilung und die Rechte an die OUs vergeben', whyWrong: 'OUs ordnen Objekte und tragen Gruppenrichtlinien, sie können aber keine Rechte bekommen. Eine OU hat keine SID. Für Berechtigungen braucht man Gruppen.' },
          { id: 'c', text: 'Eine einzige Gruppe „Alle Mitarbeiter“ mit Vollzugriff auf alle Ordner', whyWrong: 'Dann könnte jeder alles lesen, ändern und löschen, auch Personal- oder Gehaltsdaten. Das verstößt gegen das Prinzip der geringsten Rechte und gegen den Datenschutz. Ein einziger Trojaner könnte alle Ordner verschlüsseln.' },
          { id: 'd', text: 'Für jeden Ordner eine eigene Domäne', whyWrong: 'Domänen sind große Verwaltungseinheiten mit eigenen DCs. Für Ordnerrechte sind sie völlig überdimensioniert. Die Lösung sind Gruppen nach AGDLP innerhalb einer Domäne.' },
        ],
        correct: 'a',
        explanation: 'AGDLP: Benutzer → globale Abteilungsgruppe → domänenlokale Ressourcengruppe (z. B. DL_Angebote_Lesen) → Berechtigung.',
      },
      {
        id: 'b3', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen zu Domänencontrollern stimmen?',
        options: [
          { id: 'a', text: 'Man betreibt mindestens zwei DCs, damit Anmeldungen bei einem Ausfall weiter möglich sind.' },
          { id: 'b', text: 'DCs replizieren die AD-Datenbank untereinander.' },
          { id: 'c', text: 'Jeder DC kann Änderungen an Benutzern annehmen (Multi-Master).' },
          { id: 'd', text: 'Ein DC sollte als DNS-Server 8.8.8.8 eintragen, damit Clients schneller surfen.', whyWrong: 'Auch der DC selbst muss einen AD-fähigen DNS-Server eintragen, meist sich selbst oder einen anderen DC. Mit 8.8.8.8 fände er seine eigenen SRV-Einträge nicht, und Replikation und Anmeldung würden gestört. Für Internetnamen nutzt man Weiterleitungen.' },
          { id: 'e', text: 'Alle FSMO-Rollen müssen auf verschiedenen DCs liegen.', whyWrong: 'Die FSMO-Rollen dürfen alle auf einem DC liegen. In kleinen Domänen ist das sogar der Normalfall. Man kann sie verteilen, wenn man mehrere DCs hat, Pflicht ist das nicht.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Mehrere DCs mit Multi-Master-Replikation sorgen für Ausfallsicherheit. FSMO-Rollen dürfen auf einem DC liegen.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Der Helpdesk am Standort Köln soll nur dort Passwörter zurücksetzen dürfen. Wie setzt du das um?',
        options: [
          { id: 'a', text: 'Benutzer aus Köln in eine OU „Koeln“ legen und der Helpdesk-Gruppe dort per Delegierung das Recht „Kennwort zurücksetzen“ geben' },
          { id: 'b', text: 'Die Helpdesk-Mitarbeiter in die Gruppe Domänen-Admins aufnehmen', whyWrong: 'Domänen-Admins dürfen alles in der ganzen Domäne, auch an allen anderen Standorten. Das ist weit mehr als nötig. Delegierung auf eine OU gibt genau das eine Recht, nur für Köln.' },
          { id: 'c', text: 'Eine eigene Domäne für Köln aufbauen', whyWrong: 'Eine zusätzliche Domäne bedeutet eigene DCs, Vertrauensstellungen und viel Aufwand. Für ein einziges Recht an einem Standort ist das völlig überdimensioniert. Dafür gibt es Delegierung auf OUs.' },
          { id: 'd', text: 'Den Benutzern in Köln erlauben, ihre Passwörter selbst zu sehen', whyWrong: 'AD speichert Passwörter nur als Hash, niemand kann sie im Klartext ansehen. Das wäre auch ein schweres Sicherheitsrisiko. Der Helpdesk setzt ein neues Passwort, er liest kein altes aus.' },
        ],
        correct: 'a',
        explanation: 'Delegierung über OUs ist genau dafür gedacht: gezielte Rechte für bestimmte Teams auf bestimmte Teile des Verzeichnisses.',
      },
      {
        id: 'b5', type: 'single', difficulty: 3,
        prompt: 'Eine Firma nutzt Microsoft 365 und hat ein lokales AD. Benutzer sollen sich mit denselben Zugangsdaten an PC und Microsoft 365 anmelden. Was richtest du ein?',
        options: [
          { id: 'a', text: 'Microsoft Entra Connect (bzw. Cloud Sync) zur Synchronisierung vom lokalen AD nach Entra ID' },
          { id: 'b', text: 'Alle Benutzer in Microsoft 365 von Hand mit gleichem Passwort anlegen', whyWrong: 'Zwei getrennte Konten mit zufällig gleichem Passwort laufen schnell auseinander: Ändert jemand sein Passwort am PC, gilt in der Cloud das alte weiter. Austritte muss man doppelt pflegen. Entra Connect gleicht das automatisch ab.' },
          { id: 'c', text: 'Das lokale AD abschalten, Entra ID ersetzt es vollständig', whyWrong: 'Entra ID kennt keine klassischen OUs, keine klassischen Gruppenrichtlinien und keinen Kerberos-Domänenbeitritt für Server und Fileshares. Lokale Anwendungen, die AD brauchen, würden nicht mehr funktionieren. Solche Umstellungen sind große Projekte, keine Einstellung.' },
          { id: 'd', text: 'Ein Site-to-Site-VPN zu Azure', whyWrong: 'Ein VPN verbindet Netzwerke, gleicht aber keine Benutzerkonten ab. Microsoft 365 wird ohnehin über das Internet genutzt. Für gemeinsame Identitäten braucht man Synchronisierung mit Entra Connect.' },
        ],
        correct: 'a',
        explanation: 'Entra Connect synchronisiert Benutzer, Gruppen und (optional) Passwort-Hashes. So entsteht eine hybride Identität mit einem Konto für lokal und Cloud.',
      },
    ],
  },
};

export default level;
