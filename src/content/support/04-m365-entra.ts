import type { Level } from '../../types/content';

const level: Level = {
  id: 'sup-04',
  track: 'support',
  order: 4,
  title: 'Berechtigungen in Microsoft 365 & Entra ID',
  titleEn: 'Permissions in Microsoft 365 and Entra ID',
  summary: 'SharePoint- und OneDrive-Berechtigungen, Freigabelinks und externe Freigabe, Teams-Dateien, Entra-ID-Gruppen und Admin-Rollen, Privileged Identity Management, bedingter Zugriff und Anmeldeprotokolle lesen. Immer mit Blick auf geringste Rechte.',
  certs: ['jobready'],
  domains: { jobready: 'perm' },
  lab: {
    title: 'Rechte in einem Test-Tenant nachvollziehen',
    needs: 'Microsoft 365 Developer- oder Test-Tenant, zwei Testbenutzer',
    steps: [
      'Lege im SharePoint Admin Center eine Teamwebsite an. Prüfe unter Websiteberechtigungen die Gruppen Besitzer, Mitglieder und Besucher.',
      'Teile eine Datei mit „Bestimmte Personen“ für Testbenutzer 2. Öffne danach „Zugriff verwalten“ und sieh dir an, welche Links und Personen eingetragen sind.',
      'Unterbrich an einem Ordner die Vererbung und prüfe, welche Warnung SharePoint zu eindeutigen Berechtigungen anzeigt.',
      'Weise Testbenutzer 1 im Entra Admin Center die Rolle „Helpdesk Administrator“ zu und teste, für wen er Kennwörter zurücksetzen darf.',
      'Öffne Entra ID → Anmeldeprotokolle, wähle eine Anmeldung und sieh dir die Registerkarten „Bedingter Zugriff“ und „Authentifizierungsdetails“ an.',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: SharePoint, OneDrive und Teams – wo liegen die Dateien?',
      body: `In Microsoft 365 gibt es keine Fileserver-Freigaben, sondern drei Orte, die alle auf **SharePoint** aufbauen:

| Ort | Wem gehört es? | Wer berechtigt? |
|---|---|---|
| OneDrive | einer Person | die Person selbst über Freigabelinks |
| SharePoint-Website | Team oder Abteilung | Websitebesitzer |
| Teams-Kanal | Team (Dateien liegen in der SharePoint-Website des Teams) | Teambesitzer, Mitgliedschaft im Team |

Jede Website hat drei Standardgruppen:
- **Besitzer** (Vollzugriff): darf alles, auch Rechte vergeben.
- **Mitglieder** (Bearbeiten): darf Dateien anlegen, ändern, löschen.
- **Besucher** (Lesen): darf nur lesen und herunterladen.

Bei Teams und Microsoft 365-Gruppen hängen Besitzer und Mitglieder der Website direkt an der Gruppe. Wer ins Team aufgenommen wird, hat also automatisch Zugriff auf die Dateien. **Private** und **freigegebene Kanäle** haben eigene Websites mit eigener Mitgliedschaft.

Wie beim Fileserver erben Bibliotheken, Ordner und Dateien die Rechte der Website. Wird die Vererbung unterbrochen, entstehen **eindeutige Berechtigungen**. Wenige sind okay, viele machen die Website unübersichtlich und schwer prüfbar.`,
      analogy: 'Die SharePoint-Website ist das Bürogebäude, die Bibliotheken sind Stockwerke, Ordner sind Räume. Normalerweise gilt der Hausausweis überall. Jede unterbrochene Vererbung ist ein Raum mit Extra-Schloss, den irgendwann niemand mehr kennt.',
      terms: [
        { de: 'Websitebesitzer', en: 'site owner' },
        { de: 'Berechtigungsstufe', en: 'permission level' },
        { de: 'eindeutige Berechtigungen', en: 'unique permissions' },
        { de: 'Microsoft 365-Gruppe', en: 'Microsoft 365 group' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Ein neuer Kollege wird ins Team „Marketing“ aufgenommen. Warum kann er sofort auf die Dateien im Standardkanal zugreifen?',
        options: [
          { id: 'a', text: 'Die Teammitglieder sind automatisch Mitglieder der zugehörigen SharePoint-Website.' },
          { id: 'b', text: 'Teams-Dateien haben keine Berechtigungen.', whyWrong: 'Sie haben Berechtigungen, nämlich die der SharePoint-Website des Teams. Die Mitgliedschaft im Team steuert sie.' },
          { id: 'c', text: 'Die Dateien liegen in seinem OneDrive.', whyWrong: 'Kanaldateien liegen in der SharePoint-Website des Teams. Im OneDrive liegen nur Dateien aus Einzel- und Gruppenchats.' },
        ],
        correct: 'a',
        explanation: 'Team = Microsoft 365-Gruppe = Website-Mitglieder. Zugriff steuert man über die Teammitgliedschaft.',
      },
      sources: [{ title: 'Microsoft Learn – Understanding permission levels in SharePoint', url: 'https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels' }],
    },
    {
      heading: 'Fortgeschritten: Freigabelinks und externe Freigabe',
      body: `Die meisten Rechte in Microsoft 365 entstehen nicht durch Admins, sondern durch **Freigabelinks** der Benutzer:

| Linktyp | Wer kommt rein? |
|---|---|
| Jeder (Anyone) | jeder mit dem Link, ohne Anmeldung |
| Personen in der Organisation | alle internen Konten mit dem Link |
| Bestimmte Personen | nur namentlich eingetragene Personen, auch Gäste |
| Personen mit vorhandenem Zugriff | niemand Neues, nur zum Teilen der Adresse |

Jeder Link ist entweder „Anzeigen“ oder „Bearbeiten“, optional mit Ablaufdatum.

**Externe Freigabe** wird in Stufen gesteuert: Organisationsweit im SharePoint Admin Center und pro Website. Eine Website darf nie offener sein als die Organisationseinstellung. Typische Ticketfrage: „Ich kann nicht extern teilen.“ Dann ist entweder die Website oder die ganze Organisation strenger eingestellt.

Für Audits zeigt „Zugriff verwalten“ an einer Datei alle Links und Personen. Ein Bericht über Freigaben einer Website lässt sich im SharePoint Admin Center erzeugen.

**Wenn jemand das Unternehmen verlässt:** Sein OneDrive wird nach dem Löschen des Kontos noch eine Zeit lang aufbewahrt (standardmäßig 30 Tage), der Vorgesetzte kann Zugriff bekommen. Wichtige Dateien gehören deshalb nicht ins OneDrive, sondern in Team-Websites.`,
      terms: [
        { de: 'Freigabelink', en: 'sharing link' },
        { de: 'externe Freigabe', en: 'external sharing' },
        { de: 'Gastbenutzer', en: 'guest user' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Organisation: externe Freigabe „Neue und vorhandene Gäste“. Website „Projekt X“: „Nur Personen in der Organisation“. Kann ein Benutzer eine Datei aus „Projekt X“ mit einem Gast teilen?',
        options: [
          { id: 'a', text: 'Nein, die Website ist strenger eingestellt, und die strengere Einstellung gilt.' },
          { id: 'b', text: 'Ja, die Organisationseinstellung überschreibt die Website.', whyWrong: 'Die Organisationseinstellung ist nur die Obergrenze. Die Website darf strenger sein, und dann gilt die Website.' },
          { id: 'c', text: 'Nur mit einem Jeder-Link', whyWrong: 'Jeder-Links wären noch offener und sind weder auf Website- noch auf Organisationsebene hier erlaubt.' },
        ],
        correct: 'a',
        explanation: 'Websiteeinstellung ≤ Organisationseinstellung. Für Projekt X müsste der Websitebesitzer bzw. Admin die Freigabe öffnen, wenn das gewollt ist.',
      },
      sources: [{ title: 'Microsoft Learn – Manage sharing settings for SharePoint and OneDrive', url: 'https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off' }],
    },
    {
      heading: 'Fortgeschritten: Entra ID – Gruppen und Admin-Rollen',
      body: `**Microsoft Entra ID** (früher Azure AD) ist das Verzeichnis für Microsoft 365. Benutzer kommen entweder direkt aus der Cloud oder werden aus dem lokalen AD synchronisiert (**hybride Identität** mit Entra Connect oder Cloud Sync).

Gruppen in Entra ID:
- **Sicherheitsgruppen:** für Rechte auf Apps und Ressourcen, auch für Lizenzzuweisung.
- **Microsoft 365-Gruppen:** mit Postfach, Website und ggf. Team.
- Mitgliedschaft **zugewiesen** oder **dynamisch** per Regel (z. B. alle mit department = "Vertrieb"). Dynamische Gruppen brauchen Entra ID P1.

**Admin-Rollen** folgen dem **Prinzip der geringsten Rechte**: lieber eine passende Rolle als Global Administrator.

| Rolle | darf |
|---|---|
| Global Administrator | alles. Microsoft empfiehlt weniger als fünf davon |
| Global Reader | alles lesen, nichts ändern |
| User Administrator | Benutzer und Gruppen verwalten |
| Helpdesk Administrator | Kennwörter von Nicht-Admins zurücksetzen |
| Exchange Administrator | Exchange Online verwalten |
| SharePoint Administrator | SharePoint und OneDrive verwalten |
| Privileged Role Administrator | Rollen zuweisen |

Rollen lassen sich mit **Verwaltungseinheiten** (administrative units) auf z. B. einen Standort beschränken.

Für Notfälle gehören **Notfallzugriffskonten** (break-glass) dazu: zwei reine Cloud-Konten mit Global Administrator, gut geschützt und überwacht, damit man bei Fehlkonfiguration nicht ausgesperrt ist.`,
      terms: [
        { de: 'Administratorrolle', en: 'administrator role' },
        { de: 'dynamische Gruppe', en: 'dynamic group' },
        { de: 'Verwaltungseinheit', en: 'administrative unit' },
        { de: 'Notfallzugriffskonto', en: 'emergency access account' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Der 1st Level soll Kennwörter normaler Benutzer zurücksetzen können, aber nichts sonst. Welche Rolle passt?',
        options: [
          { id: 'a', text: 'Helpdesk Administrator' },
          { id: 'b', text: 'Global Administrator', whyWrong: 'Viel zu viel Macht für eine Kennwortrücksetzung. Verstößt gegen das Prinzip der geringsten Rechte.' },
          { id: 'c', text: 'Global Reader', whyWrong: 'Global Reader darf nur lesen, keine Kennwörter zurücksetzen.' },
        ],
        correct: 'a',
        explanation: 'Helpdesk Administrator darf Kennwörter von Nicht-Administratoren und anderen Helpdesk-Admins zurücksetzen.',
      },
      sources: [
        { title: 'Microsoft Learn – Entra built-in roles', url: 'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference' },
        { title: 'Microsoft Learn – Best practices for Entra roles', url: 'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices' },
      ],
    },
    {
      heading: 'Profi: PIM, bedingter Zugriff und Anmeldeprotokolle',
      body: `**Privileged Identity Management** (PIM) macht aus dauerhaften Admin-Rechten **berechtigte** (eligible) Zuweisungen. Der Admin aktiviert die Rolle nur bei Bedarf, zeitlich begrenzt, optional mit MFA, Begründung und Genehmigung. Alles wird protokolliert. PIM braucht Entra ID P2 bzw. Entra ID Governance.

**Bedingter Zugriff** (Conditional Access, braucht Entra ID P1) ist eine Wenn-dann-Regel für Anmeldungen:
- **Wenn** Benutzer/Gruppe X auf App Y zugreift, unter Bedingungen (Standort, Gerät, Risiko, Client-App) …
- **dann** blockieren oder erlauben mit Auflagen (MFA, konformes Gerät, Nutzungsbedingungen).

Neue Richtlinien testet man im Modus **Nur Bericht** (report-only), bevor sie wirken. Notfallkonten werden ausgenommen.

Im Support beginnt fast jede Anmeldefrage im **Anmeldeprotokoll** (sign-in logs) in Entra ID. Dort stehen Fehlercode, App, IP, Gerät und welche Richtlinien für bedingten Zugriff gegriffen haben. Häufige Fehlercodes:

| Code | Bedeutung |
|---|---|
| AADSTS50126 | Benutzername oder Kennwort falsch |
| AADSTS50053 | Konto gesperrt (zu viele Fehlversuche) |
| AADSTS50076 | MFA erforderlich |
| AADSTS53003 | durch bedingten Zugriff blockiert |

Mit dem Werkzeug **What If** im Bereich Bedingter Zugriff simulierst du, welche Richtlinien für einen Benutzer und eine App greifen würden.`,
      compare: {
        left: 'dauerhafte Zuweisung', right: 'berechtigte Zuweisung (PIM)',
        rows: [
          ['Rolle immer aktiv', 'Rolle erst nach Aktivierung aktiv'],
          ['großes Risiko bei Kontodiebstahl', 'Angriffsfenster nur für die Aktivierungsdauer'],
          ['kein Nachweis, wann genutzt', 'Aktivierung mit Begründung im Audit'],
          ['ohne Zusatzlizenz', 'Entra ID P2 bzw. Entra ID Governance nötig'],
        ],
      },
      terms: [
        { de: 'Privileged Identity Management', en: 'Privileged Identity Management (PIM)' },
        { de: 'berechtigte Zuweisung', en: 'eligible assignment' },
        { de: 'bedingter Zugriff', en: 'Conditional Access' },
        { de: 'Anmeldeprotokoll', en: 'sign-in log' },
        { de: 'Nur Bericht', en: 'report-only' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 3,
        prompt: 'Im Anmeldeprotokoll steht bei einem Benutzer `AADSTS53003`. Was heißt das, und wo schaust du weiter?',
        options: [
          { id: 'a', text: 'Eine Richtlinie für bedingten Zugriff hat blockiert. In der Registerkarte „Bedingter Zugriff“ der Anmeldung siehst du, welche.' },
          { id: 'b', text: 'Das Kennwort ist falsch. Kennwort zurücksetzen.', whyWrong: 'Falsches Kennwort wäre AADSTS50126. 53003 heißt, die Anmeldung war korrekt, wurde aber durch eine Richtlinie blockiert.' },
          { id: 'c', text: 'Das Konto ist gesperrt.', whyWrong: 'Eine Kontosperre wäre AADSTS50053. Hier hat eine Zugriffsrichtlinie entschieden.' },
        ],
        correct: 'a',
        explanation: 'Dann prüfen: Ist die Blockade gewollt (z. B. Land, nicht konformes Gerät)? Mit What If gegenprüfen.',
      },
      sources: [
        { title: 'Microsoft Learn – What is Conditional Access?', url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview' },
        { title: 'Microsoft Learn – What is Privileged Identity Management?', url: 'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure' },
        { title: 'Microsoft Learn – Entra authentication and authorization error codes', url: 'https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'dragdrop', difficulty: 1,
      prompt: 'Ordne die Standardgruppen einer SharePoint-Website ihrer Berechtigungsstufe zu.',
      items: [
        { id: 'i1', text: 'Besitzer' },
        { id: 'i2', text: 'Mitglieder' },
        { id: 'i3', text: 'Besucher' },
      ],
      buckets: [
        { id: 'full', label: 'Vollzugriff' },
        { id: 'edit', label: 'Bearbeiten' },
        { id: 'read', label: 'Lesen' },
      ],
      solution: { i1: 'full', i2: 'edit', i3: 'read' },
      explanation: 'Besitzer verwalten, Mitglieder arbeiten, Besucher lesen.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Wo liegen Dateien, die in einem Teams-Standardkanal geteilt werden?',
      options: [
        { id: 'a', text: 'In der Dokumentbibliothek der SharePoint-Website des Teams' },
        { id: 'b', text: 'Im OneDrive des Absenders', whyWrong: 'Das gilt für Dateien in Einzel- und Gruppenchats. Kanaldateien liegen in SharePoint.' },
        { id: 'c', text: 'Im Exchange-Postfach des Teams', whyWrong: 'Das Gruppenpostfach speichert Mails und Kalender, keine Kanaldateien.' },
      ],
      correct: 'a',
      explanation: 'Jeder Standardkanal ist ein Ordner in der Bibliothek „Dokumente“ der Teamwebsite.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Welcher Freigabelink erlaubt Zugriff **ohne Anmeldung**?',
      options: [
        { id: 'a', text: 'Jeder (Anyone)' },
        { id: 'b', text: 'Personen in der Organisation', whyWrong: 'Dafür ist eine Anmeldung mit einem internen Konto nötig.' },
        { id: 'c', text: 'Bestimmte Personen', whyWrong: 'Hier muss sich die eingetragene Person anmelden oder per Code bestätigen.' },
      ],
      correct: 'a',
      explanation: 'Jeder-Links sind anonym und deshalb in vielen Firmen deaktiviert oder mit Ablaufdatum versehen.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Ein Benutzer sagt: „Ich kann diese Datei nicht extern teilen, bei der anderen Website geht es.“ Wahrscheinlichste Ursache?',
      options: [
        { id: 'a', text: 'Die externe Freigabe ist für diese Website strenger eingestellt.' },
        { id: 'b', text: 'Seine Lizenz ist abgelaufen.', whyWrong: 'Dann könnte er gar nicht auf SharePoint zugreifen. Dass es auf einer anderen Website geht, spricht für eine Websiteeinstellung.' },
        { id: 'c', text: 'Die Datei ist zu groß.', whyWrong: 'Die Dateigröße beeinflusst nicht, ob extern geteilt werden darf.' },
      ],
      correct: 'a',
      explanation: 'Externe Freigabe ist pro Website einstellbar, aber nie offener als die Organisation.',
      domain: 'troubleshoot',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Warum sind viele eindeutige Berechtigungen auf einer SharePoint-Website problematisch?',
      options: [
        { id: 'a', text: 'Niemand behält den Überblick, wer was darf. Rezertifizierungen und Audits werden schwer.' },
        { id: 'b', text: 'SharePoint löscht eindeutige Berechtigungen nach 30 Tagen.', whyWrong: 'SharePoint löscht keine Berechtigungen automatisch. Das Problem ist die Unübersichtlichkeit.' },
        { id: 'c', text: 'Sie kosten zusätzliche Lizenzen.', whyWrong: 'Berechtigungen sind lizenzfrei. Es geht um Verwaltbarkeit und Sicherheit.' },
      ],
      correct: 'a',
      explanation: 'Wie beim Fileserver: Rechte möglichst auf hoher Ebene über Gruppen vergeben.',
      domain: 'iam',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Welche Entra-ID-Rolle darf alles lesen, aber nichts ändern, z. B. für Auditoren?',
      options: [
        { id: 'a', text: 'Global Reader' },
        { id: 'b', text: 'Global Administrator', whyWrong: 'Der darf alles ändern. Für reines Lesen viel zu mächtig.' },
        { id: 'c', text: 'User Administrator', whyWrong: 'Der verwaltet Benutzer und Gruppen, darf also ändern, und sieht nicht alles.' },
      ],
      correct: 'a',
      explanation: 'Global Reader ist das Lesegegenstück zum Global Administrator.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Wie viele Global Administratoren empfiehlt Microsoft höchstens?',
      options: [
        { id: 'a', text: 'Weniger als fünf' },
        { id: 'b', text: 'Genau einen', whyWrong: 'Nur einer ist ein Risiko: Fällt er aus, kommt niemand mehr an die Verwaltung. Mindestens zwei, aber weniger als fünf.' },
        { id: 'c', text: 'So viele wie Admins im Team', whyWrong: 'Jeder zusätzliche Global Admin vergrößert die Angriffsfläche. Für Teilaufgaben gibt es passende Rollen.' },
      ],
      correct: 'a',
      explanation: 'Dazu zwei Notfallzugriffskonten und für alle anderen Aufgaben spezifische Rollen.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Was ist eine „berechtigte“ (eligible) Rollenzuweisung in PIM?',
      options: [
        { id: 'a', text: 'Der Benutzer kann die Rolle bei Bedarf zeitlich begrenzt aktivieren.' },
        { id: 'b', text: 'Die Rolle ist dauerhaft aktiv.', whyWrong: 'Das ist eine aktive bzw. dauerhafte Zuweisung. Berechtigt heißt: erst aktivieren.' },
        { id: 'c', text: 'Der Benutzer darf die Rolle an andere weitergeben.', whyWrong: 'Rollen weitergeben darf nur, wer selbst Rollen verwalten darf, etwa der Privileged Role Administrator.' },
      ],
      correct: 'a',
      explanation: 'Just-in-time: Rechte nur, wenn sie gebraucht werden. Aktivierungen werden protokolliert.',
      domain: 'iam',
    },
    {
      id: 'q9', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Fehlercodes aus dem Entra-Anmeldeprotokoll zu.',
      items: [
        { id: 'i1', text: 'AADSTS50126' },
        { id: 'i2', text: 'AADSTS50053' },
        { id: 'i3', text: 'AADSTS53003' },
        { id: 'i4', text: 'AADSTS50076' },
      ],
      buckets: [
        { id: 'pw', label: 'Kennwort falsch' },
        { id: 'lock', label: 'Konto gesperrt' },
        { id: 'ca', label: 'durch bedingten Zugriff blockiert' },
        { id: 'mfa', label: 'MFA erforderlich' },
      ],
      solution: { i1: 'pw', i2: 'lock', i3: 'ca', i4: 'mfa' },
      explanation: 'Den Code kopieren und in der Fehlercode-Referenz nachschlagen. Er ist oft schneller als jede Rückfrage.',
      domain: 'troubleshoot',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Du willst eine neue Richtlinie für bedingten Zugriff einführen, ohne Benutzer auszusperren. Wie gehst du vor?',
      options: [
        { id: 'a', text: 'Erst im Modus „Nur Bericht“ laufen lassen, Auswirkungen prüfen, Notfallkonten ausnehmen, dann aktivieren' },
        { id: 'b', text: 'Sofort für alle Benutzer aktivieren', whyWrong: 'Eine Fehlkonfiguration kann alle aussperren, auch Admins.' },
        { id: 'c', text: 'Nur für Global Administratoren aktivieren und abwarten', whyWrong: 'Damit testet man ausgerechnet an den wichtigsten Konten und riskiert, dass niemand mehr verwalten kann.' },
      ],
      correct: 'a',
      explanation: 'Report-only zeigt im Anmeldeprotokoll, was die Richtlinie getan hätte.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Synchronisierter Benutzer (hybride Identität): Wo änderst du seine Abteilung?',
      options: [
        { id: 'a', text: 'Im lokalen AD, dann synchronisiert Entra Connect die Änderung.' },
        { id: 'b', text: 'Im Entra Admin Center', whyWrong: 'Bei synchronisierten Benutzern ist das lokale AD die Quelle. Änderungen in der Cloud sind gesperrt oder werden überschrieben.' },
        { id: 'c', text: 'In Exchange Online', whyWrong: 'Auch hier gilt: Das Objekt wird lokal gepflegt.' },
      ],
      correct: 'a',
      explanation: 'Source of Authority beachten. IAM-Systeme schreiben daher meist ins lokale AD.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Eine Admin-Rolle soll nur für Benutzer am Standort Graz gelten. Was nutzt du in Entra ID?',
      options: [
        { id: 'a', text: 'Eine Verwaltungseinheit (administrative unit) mit den Grazer Benutzern und eine darauf beschränkte Rollenzuweisung' },
        { id: 'b', text: 'Eine eigene Entra-ID-Instanz für Graz', whyWrong: 'Ein eigener Tenant würde Zusammenarbeit und Verwaltung massiv erschweren. Dafür gibt es Verwaltungseinheiten.' },
        { id: 'c', text: 'Eine dynamische Gruppe', whyWrong: 'Eine dynamische Gruppe sammelt Mitglieder, beschränkt aber keine Admin-Rolle. Sie kann aber helfen, die Verwaltungseinheit zu füllen.' },
      ],
      correct: 'a',
      explanation: 'Verwaltungseinheiten sind in Entra ID das, was OUs mit Delegierung im AD sind.',
    },
    {
      id: 'q13', type: 'multi', difficulty: 3,
      prompt: 'Welche Maßnahmen setzen das Prinzip der geringsten Rechte in Microsoft 365 um?',
      options: [
        { id: 'a', text: 'Admin-Rollen über PIM nur bei Bedarf aktivieren' },
        { id: 'b', text: 'Für Teilaufgaben spezifische Rollen statt Global Administrator' },
        { id: 'c', text: 'Gastzugriffe regelmäßig überprüfen lassen' },
        { id: 'd', text: 'Allen IT-Mitarbeitern Global Administrator geben, damit niemand blockiert ist', whyWrong: 'Das ist das Gegenteil von geringsten Rechten und vergrößert die Angriffsfläche enorm.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Just-in-time, spezifische Rollen und regelmäßige Überprüfung gehören zusammen.',
      domain: 'iam',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Ein Mitarbeiter hat das Unternehmen verlassen, sein Konto wurde gelöscht. Der Chef braucht Dateien aus seinem OneDrive. Was gilt standardmäßig?',
      options: [
        { id: 'a', text: 'Das OneDrive bleibt eine Aufbewahrungszeit lang erhalten (Standard 30 Tage), der Vorgesetzte kann Zugriff bekommen.' },
        { id: 'b', text: 'Das OneDrive ist sofort endgültig gelöscht.', whyWrong: 'Es gibt eine Aufbewahrungszeit für OneDrive gelöschter Benutzer, standardmäßig 30 Tage, im Admin Center änderbar.' },
        { id: 'c', text: 'Das OneDrive wird automatisch zur SharePoint-Website des Teams.', whyWrong: 'OneDrive wird nicht umgewandelt. Dateien müssen bei Bedarf verschoben werden.' },
      ],
      correct: 'a',
      explanation: 'Im Leaver-Prozess daher Dateien rechtzeitig übergeben lassen.',
      domain: 'iam',
    },
    {
      id: 'q15', type: 'single', difficulty: 3,
      prompt: 'Was zeigt das Werkzeug „What If“ im Bereich Bedingter Zugriff?',
      options: [
        { id: 'a', text: 'Welche Richtlinien für eine bestimmte Kombination aus Benutzer, App und Bedingungen greifen würden' },
        { id: 'b', text: 'Welche Benutzer welche Lizenzen haben', whyWrong: 'Das zeigt die Lizenzverwaltung, nicht What If.' },
        { id: 'c', text: 'Eine Vorschau neuer Microsoft-Funktionen', whyWrong: 'What If simuliert Richtlinienauswertungen, keine Produktneuheiten.' },
      ],
      correct: 'a',
      explanation: 'Gut für Tickets wie „Warum muss ich MFA machen, mein Kollege nicht?“',
      domain: 'troubleshoot',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: '„Seit gestern kommen unsere Außendienstler nicht mehr in Outlook, im Büro geht alles.“',
        steps: [
          {
            id: 's1', text: 'Erster Schritt?',
            options: [
              { id: 'a', text: 'Im Entra-Anmeldeprotokoll eine fehlgeschlagene Anmeldung eines Außendienstlers öffnen', correct: true, feedback: 'Richtig. Dort stehen Fehlercode und angewendete Richtlinien.' },
              { id: 'b', text: 'Allen Außendienstlern das Kennwort zurücksetzen', correct: false, feedback: 'Im Büro geht es mit demselben Kennwort. Das Kennwort ist nicht das Problem.' },
            ],
          },
          {
            id: 's2', text: 'Fehler `AADSTS53003`. Richtlinie „Block außerhalb vertrauenswürdiger Standorte“, gestern von Report-only auf Ein gestellt. Was ist passiert?',
            options: [
              { id: 'a', text: 'Die neue Richtlinie blockiert alle Anmeldungen außerhalb der Firmen-IPs, also auch den Außendienst.', correct: true, feedback: 'Genau. Bürozugriffe kommen von vertrauenswürdigen IPs, unterwegs nicht.' },
              { id: 'b', text: 'Die Außendienstler haben keine Lizenz mehr.', correct: false, feedback: 'Der Code 53003 sagt eindeutig: bedingter Zugriff hat blockiert.' },
            ],
          },
          {
            id: 's3', text: 'Was empfiehlst du dem Kunden?',
            options: [
              { id: 'a', text: 'Richtlinie anpassen (z. B. außerhalb nur mit MFA und konformem Gerät statt blockieren), mit What If testen, Änderung dokumentieren', correct: true, feedback: 'Richtig. Sicherheitsziel bleibt erhalten, Arbeit wird wieder möglich.' },
              { id: 'b', text: 'Die Richtlinie löschen', correct: false, feedback: 'Das öffnet die Lücke wieder, die die Richtlinie schließen sollte. Besser gezielt anpassen.' },
            ],
          },
        ],
        explanation: 'Report-only-Auswertung vor dem Scharfschalten hätte die betroffenen Außendienstler gezeigt.',
        domain: 'troubleshoot',
      },
      {
        id: 'b2', type: 'single', difficulty: 2,
        prompt: 'Ein Websitebesitzer will wissen, wer extern auf seine Website zugreifen kann. Wo schaut er?',
        options: [
          { id: 'a', text: 'Freigabebericht der Website bzw. „Zugriff verwalten“ an Dateien und Ordnern' },
          { id: 'b', text: 'Im Exchange-Nachrichtenablauf', whyWrong: 'Der zeigt Mails, keine SharePoint-Freigaben.' },
          { id: 'c', text: 'In den NTFS-Rechten des SharePoint-Servers', whyWrong: 'SharePoint Online hat keine sichtbaren NTFS-Rechte. Berechtigungen werden in SharePoint selbst verwaltet.' },
        ],
        correct: 'a',
        explanation: 'Externe Zugriffe gehören in regelmäßige Überprüfungen.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Ein Admin braucht einmal im Monat Exchange-Administratorrechte. Beste Lösung?',
        options: [
          { id: 'a', text: 'Berechtigte Zuweisung der Rolle Exchange Administrator in PIM mit Aktivierung bei Bedarf' },
          { id: 'b', text: 'Dauerhaft Global Administrator', whyWrong: 'Zu viele Rechte, dauerhaft. Größtmögliches Risiko bei Kontodiebstahl.' },
          { id: 'c', text: 'Er bekommt das Kennwort eines Kollegen mit den Rechten', whyWrong: 'Geteilte Kennwörter verhindern Nachvollziehbarkeit und verstoßen gegen jede Richtlinie.' },
        ],
        correct: 'a',
        explanation: 'Passende Rolle, nur bei Bedarf, protokolliert.',
        domain: 'iam',
      },
      {
        id: 'b4', type: 'single', difficulty: 2,
        prompt: 'Neue Mitarbeiter im Vertrieb sollen automatisch in die Gruppe für Vertriebs-Apps. Was geht direkt in Entra ID?',
        options: [
          { id: 'a', text: 'Dynamische Gruppe mit einer Regel wie `user.department -eq "Vertrieb"`' },
          { id: 'b', text: 'Eine Verteilerliste in Exchange', whyWrong: 'Eine Verteilerliste verteilt Mails, sie steuert keinen App-Zugriff.' },
          { id: 'c', text: 'Gar nicht, Gruppen sind immer manuell', whyWrong: 'Dynamische Gruppen gibt es (mit Entra ID P1). Alternativ macht das ein IAM-System über Rollen.' },
        ],
        correct: 'a',
        explanation: 'Voraussetzung: Das Attribut department ist gepflegt. Genau das stellt ein sauberer Joiner-Prozess sicher.',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'A customer asks: "Why does user A get an MFA prompt and user B doesn\'t, for the same app?" What is your best first step?',
        options: [
          { id: 'a', text: 'Compare both sign-ins in the Entra sign-in logs and use the Conditional Access What If tool for both users.' },
          { id: 'b', text: 'Disable MFA for user A.', whyWrong: 'That weakens security without understanding the cause. The difference is most likely a policy assignment.' },
          { id: 'c', text: 'Reinstall the app on user A\'s device.', whyWrong: 'MFA prompts are decided by policies in Entra ID, not by the local app installation.' },
        ],
        correct: 'a',
        explanation: 'Sign-in logs show which policies applied. What If shows why.',
        domain: 'english',
      },
    ],
  },
};

export default level;
