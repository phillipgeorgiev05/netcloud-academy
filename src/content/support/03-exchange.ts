import type { Level } from '../../types/content';

const level: Level = {
  id: 'sup-03',
  track: 'support',
  order: 3,
  title: 'Microsoft Exchange',
  titleEn: 'Microsoft Exchange for Support',
  summary: 'Postfachtypen, Postfachberechtigungen (Vollzugriff, Senden als, Senden im Auftrag), Automapping, Ordnerrechte, Mailflow und Unzustellbarkeitsberichte, Exchange Online und Hybrid, Nachrichtenablaufverfolgung und die wichtigsten Cmdlets.',
  certs: ['jobready'],
  domains: { jobready: 'infra' },
  lab: {
    title: 'Postfachrechte in Exchange Online',
    needs: 'Microsoft 365 Developer- oder Test-Tenant mit Exchange Online, PowerShell-Modul ExchangeOnlineManagement',
    steps: [
      'Verbinde dich mit `Connect-ExchangeOnline -UserPrincipalName admin@deintenant.onmicrosoft.com`.',
      'Lege ein freigegebenes Postfach an: `New-Mailbox -Shared -Name "Vertrieb" -PrimarySmtpAddress vertrieb@deintenant.onmicrosoft.com`.',
      'Gib einem Testbenutzer Vollzugriff ohne Automapping: `Add-MailboxPermission vertrieb -User test1 -AccessRights FullAccess -AutoMapping $false`.',
      'Gib ihm „Senden als“: `Add-RecipientPermission vertrieb -Trustee test1 -AccessRights SendAs` und prüfe mit `Get-RecipientPermission vertrieb`.',
      'Sende eine Testmail und suche sie mit `Get-MessageTraceV2 -SenderAddress test1@deintenant.onmicrosoft.com`.',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: Postfachtypen und Clients',
      body: `Exchange speichert E-Mails, Kalender und Kontakte in **Postfächern**. Im Support unterscheidest du:

| Typ | Zweck | Besonderheit |
|---|---|---|
| Benutzerpostfach | eine Person | eigenes Konto mit Anmeldung |
| freigegebenes Postfach | Teamadresse wie vertrieb@ | keine eigene Anmeldung, Zugriff über Berechtigungen. In Exchange Online bis 50 GB ohne eigene Lizenz |
| Raumpostfach | Besprechungsraum | nimmt Buchungen automatisch an oder ab |
| Gerätepostfach | Beamer, Dienstwagen | wie Raum, aber ohne Ort |

Wo liegt das Postfach? **Exchange Server** im eigenen Rechenzentrum (on-premises), **Exchange Online** in Microsoft 365, oder bei **Exchange Hybrid** teils lokal, teils in der Cloud.

Clients: Outlook (klassisch und „neues Outlook“), Outlook im Web (OWA), mobile Apps. Outlook findet das Postfach automatisch über **AutoErmittlung** (Autodiscover), meist über den DNS-Eintrag \`autodiscover.firma.de\`. Klappt die Einrichtung nicht, ist AutoErmittlung ein häufiger Grund. Zum Testen gibt es den Microsoft Remote Connectivity Analyzer.`,
      terms: [
        { de: 'Postfach', en: 'mailbox' },
        { de: 'freigegebenes Postfach', en: 'shared mailbox' },
        { de: 'Raumpostfach', en: 'room mailbox' },
        { de: 'AutoErmittlung', en: 'Autodiscover' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Das Team Vertrieb will eine gemeinsame Adresse vertrieb@firma.de, die alle im Team lesen. Was richtest du ein?',
        options: [
          { id: 'a', text: 'Ein freigegebenes Postfach mit Vollzugriff für die Teammitglieder' },
          { id: 'b', text: 'Ein Benutzerpostfach, dessen Kennwort alle kennen', whyWrong: 'Geteilte Kennwörter verhindern jede Nachvollziehbarkeit und widersprechen den Sicherheitsregeln. Genau dafür gibt es freigegebene Postfächer.' },
          { id: 'c', text: 'Ein Raumpostfach', whyWrong: 'Raumpostfächer sind für Ressourcenbuchungen gedacht, nicht als Teamadresse.' },
        ],
        correct: 'a',
        explanation: 'Freigegebene Postfächer haben keine eigene Anmeldung. Zugriff wird pro Person oder Gruppe vergeben und ist nachvollziehbar.',
      },
      sources: [{ title: 'Microsoft Learn – Shared mailboxes in Exchange Online', url: 'https://learn.microsoft.com/en-us/exchange/collaboration-exo/shared-mailboxes' }],
    },
    {
      heading: 'Fortgeschritten: Postfachberechtigungen und Automapping',
      body: `Drei Rechte werden ständig verwechselt:

| Recht | Wirkung | Cmdlet (Exchange Online) |
|---|---|---|
| **Vollzugriff** (Full Access) | Postfach öffnen und lesen, **nicht** senden | \`Add-MailboxPermission -AccessRights FullAccess\` |
| **Senden als** (Send As) | Mail sieht aus, als käme sie direkt vom Postfach | \`Add-RecipientPermission -AccessRights SendAs\` |
| **Senden im Auftrag** (Send on Behalf) | Empfänger sieht „Max im Auftrag von Vertrieb“ | \`Set-Mailbox -GrantSendOnBehalfTo\` |

On-premises wird „Senden als“ als AD-Berechtigung gesetzt: \`Add-ADPermission -ExtendedRights "Send As"\`.

**Automapping:** Bekommt ein Benutzer direkt Vollzugriff, blendet Outlook das Postfach automatisch ein. Das funktioniert **nicht**, wenn das Recht über eine **Gruppe** vergeben wurde. Dann muss der Benutzer das Postfach selbst hinzufügen. Mit \`-AutoMapping $false\` schaltest du es bewusst ab, z. B. für Admins mit Zugriff auf viele Postfächer (sonst wird Outlook langsam).

**Ordnerrechte** sind feiner: Kalender für Kollegen freigeben mit \`Add-MailboxFolderPermission\` und Rollen wie \`Reviewer\` (lesen), \`Editor\` (bearbeiten) oder \`AvailabilityOnly\` (nur frei/gebucht). Der Ordnername ist sprachabhängig: in einem deutschen Postfach „Kalender“, in einem englischen „Calendar“.

Neue Rechte wirken in Outlook nicht immer sofort. Outlook neu starten und bei Exchange Online etwas Zeit geben, bevor du weitersuchst.`,
      analogy: 'Vollzugriff ist der Schlüssel zum Briefkasten: Du darfst alles lesen. „Senden als“ ist der Firmenstempel, mit dem du unterschreibst, als wärst du die Abteilung. „Senden im Auftrag“ ist der Stempel plus deine Unterschrift „i. A.“.',
      terms: [
        { de: 'Vollzugriff', en: 'Full Access' },
        { de: 'Senden als', en: 'Send As' },
        { de: 'Senden im Auftrag', en: 'Send on Behalf' },
        { de: 'automatische Zuordnung', en: 'automapping' },
        { de: 'Ordnerberechtigung', en: 'folder permission' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Max hat Vollzugriff auf das Postfach „Vertrieb“. Er kann alles lesen, aber beim Senden als vertrieb@ kommt ein Unzustellbarkeitsbericht. Warum?',
        options: [
          { id: 'a', text: 'Vollzugriff erlaubt kein Senden. Er braucht zusätzlich „Senden als“ oder „Senden im Auftrag“.' },
          { id: 'b', text: 'Das Postfach ist voll.', whyWrong: 'Ein volles Postfach blockiert eher das Empfangen bzw. ab einem Limit das Senden für alle. Hier ist das fehlende Senderecht die typische Ursache.' },
          { id: 'c', text: 'Automapping ist aktiv.', whyWrong: 'Automapping blendet das Postfach nur in Outlook ein und hat mit Senderechten nichts zu tun.' },
        ],
        correct: 'a',
        explanation: 'Lesen und Senden sind getrennte Rechte. Die Rückmeldung ist meist ein NDR mit 5.7.x („nicht berechtigt, im Namen dieses Benutzers zu senden“).',
      },
      sources: [{ title: 'Microsoft Learn – Manage permissions for recipients in Exchange Online', url: 'https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-permissions-for-recipients' }],
    },
    {
      heading: 'Fortgeschritten: Mailflow und Unzustellbarkeitsberichte',
      body: `Der Weg einer Mail ins Internet, vereinfacht:
1. Outlook übergibt die Mail an das Postfach (Postausgang).
2. Der **Transportdienst** prüft Regeln (Nachrichtenflussregeln), Antispam und Empfänger.
3. Intern wird direkt zugestellt, extern über einen **Sendeconnector** an den Ziel-Mailserver (MX-Eintrag im DNS).
4. Eingehend nimmt ein **Empfangsconnector** die Mail an.

Kommt eine Mail nicht an, ist der **Unzustellbarkeitsbericht** (NDR) dein bester Freund. Der Statuscode sagt viel:

| Code | Bedeutung |
|---|---|
| 4.x.x | vorübergehend, der Server versucht es weiter |
| 5.1.1 | Empfänger unbekannt (Tippfehler, gelöschtes Postfach) |
| 5.2.2 | Postfach des Empfängers voll |
| 5.7.1 | nicht berechtigt (z. B. Senderecht fehlt, Gruppe nimmt nur interne Mails an) |

Zum Nachverfolgen:
- **Exchange Online:** Nachrichtenablaufverfolgung (message trace) im Exchange Admin Center oder per PowerShell mit \`Get-MessageTraceV2\`. Sie löst das ältere \`Get-MessageTrace\` ab. Abfragen gehen bis 90 Tage zurück.
- **Exchange Server:** \`Get-MessageTrackingLog\` auf dem Server, \`Get-Queue\` für hängende Warteschlangen.

Ein häufiger Fall bei externen Empfängern: Die Mail wird beim Empfänger als Spam eingestuft, weil **SPF**, **DKIM** oder **DMARC** für die Absenderdomain nicht stimmen. Das sieht man in den Kopfzeilen der Mail beim Empfänger.`,
      terms: [
        { de: 'Nachrichtenfluss', en: 'mail flow' },
        { de: 'Unzustellbarkeitsbericht', en: 'non-delivery report (NDR)' },
        { de: 'Sendeconnector', en: 'send connector' },
        { de: 'Nachrichtenablaufverfolgung', en: 'message trace' },
        { de: 'Warteschlange', en: 'queue' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Ein NDR enthält `550 5.1.1 RESOLVER.ADR.RecipNotFound`. Was prüfst du zuerst?',
        options: [
          { id: 'a', text: 'Ob die Empfängeradresse richtig geschrieben ist und das Postfach noch existiert' },
          { id: 'b', text: 'Ob das Postfach des Empfängers voll ist', whyWrong: 'Ein volles Postfach meldet 5.2.2. 5.1.1 heißt, die Adresse ist nicht bekannt.' },
          { id: 'c', text: 'Den Sendeconnector neu erstellen', whyWrong: '5.1.1 ist ein Adressproblem, kein Transportproblem. Am Connector zu bauen, kann andere Mails stören.' },
        ],
        correct: 'a',
        explanation: 'Oft ist es ein Tippfehler oder ein veralteter Eintrag im Outlook-Autovervollständigen-Cache (nach Postfachmigration).',
      },
      sources: [
        { title: 'Microsoft Learn – NDRs in Exchange Online', url: 'https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/non-delivery-reports-in-exchange-online/non-delivery-reports-in-exchange-online' },
        { title: 'Microsoft Learn – Message trace in the modern EAC', url: 'https://learn.microsoft.com/en-us/exchange/monitoring/trace-an-email-message/message-trace-modern-eac' },
      ],
    },
    {
      heading: 'Profi: Exchange Online, Hybrid und PowerShell',
      body: `**Exchange Online PowerShell** verbindest du mit dem Modul ExchangeOnlineManagement: \`Connect-ExchangeOnline\`. On-premises nutzt du die **Exchange-Verwaltungsshell** (EMS) auf dem Server. Viele Cmdlets heißen gleich, manche nicht (Senden als: \`Add-RecipientPermission\` online, \`Add-ADPermission\` lokal).

Nützliche Abfragen im Support:
\`\`\`
Get-Mailbox vertrieb | Format-List RecipientTypeDetails, PrimarySmtpAddress
Get-MailboxPermission vertrieb | Where-Object { $_.IsInherited -eq $false }
Get-RecipientPermission vertrieb
Get-MailboxFolderPermission "anna@firma.de:\\Kalender"
Get-MailboxStatistics anna | Format-List TotalItemSize, ItemCount
\`\`\`

**Hybrid** heißt: Lokales AD und Exchange Server sind mit Microsoft 365 verbunden, Benutzer werden mit Entra Connect synchronisiert. Für den Support wichtig:
- Attribute synchronisierter Benutzer (z. B. E-Mail-Adressen) werden **lokal** gepflegt. Änderungen in der Cloud schlagen fehl oder werden überschrieben.
- Ein in die Cloud verschobenes Postfach erscheint lokal als **Remotepostfach** (RemoteMailbox).
- Berechtigungen zwischen lokalen und Cloud-Postfächern funktionieren nur teilweise. Vollzugriff geht, „Senden als“ muss in der Regel in beiden Umgebungen gesetzt werden. Am einfachsten ist es, wenn Postfächer, die sich gegenseitig berechtigen, am selben Ort liegen.

**Kurz merken für Tickets:** Wo liegt das Postfach? Wer pflegt das Objekt (lokal oder Cloud)? Welches Recht genau fehlt?`,
      terms: [
        { de: 'Exchange-Verwaltungsshell', en: 'Exchange Management Shell (EMS)' },
        { de: 'Remotepostfach', en: 'remote mailbox' },
        { de: 'Exchange-Hybridbereitstellung', en: 'Exchange hybrid deployment' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 3,
        prompt: 'Hybrid-Umgebung: Ein Admin ändert in Exchange Online die primäre Adresse eines synchronisierten Benutzers. Es kommt ein Fehler. Warum?',
        options: [
          { id: 'a', text: 'Das Objekt wird lokal verwaltet (Quelle ist das lokale AD). Die Änderung muss lokal gemacht und dann synchronisiert werden.' },
          { id: 'b', text: 'Exchange Online erlaubt keine Adressänderungen.', whyWrong: 'Für reine Cloud-Benutzer geht das problemlos. Synchronisierte Objekte werden aber am Ursprung gepflegt.' },
          { id: 'c', text: 'Die Lizenz fehlt.', whyWrong: 'Eine fehlende Lizenz verhindert kein Ändern von Attributen. Der Fehler weist auf die lokale Quelle hin.' },
        ],
        correct: 'a',
        explanation: 'Source of Authority ist das lokale AD. Mit den Exchange-Verwaltungstools lokal ändern, Synchronisation abwarten.',
      },
      sources: [
        { title: 'Microsoft Learn – Connect to Exchange Online PowerShell', url: 'https://learn.microsoft.com/en-us/powershell/exchange/connect-to-exchange-online-powershell' },
        { title: 'Microsoft Learn – Permissions in Exchange hybrid deployments', url: 'https://learn.microsoft.com/en-us/exchange/permissions-in-exchange-hybrid-deployments' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'dragdrop', difficulty: 1,
      prompt: 'Ordne zu: Was ermöglicht welches Recht?',
      items: [
        { id: 'i1', text: 'Postfach in Outlook öffnen und Mails lesen' },
        { id: 'i2', text: 'Mail erscheint beim Empfänger nur mit „Vertrieb“ als Absender' },
        { id: 'i3', text: 'Empfänger sieht „Max im Auftrag von Vertrieb“' },
      ],
      buckets: [
        { id: 'full', label: 'Vollzugriff' },
        { id: 'sendas', label: 'Senden als' },
        { id: 'behalf', label: 'Senden im Auftrag' },
      ],
      solution: { i1: 'full', i2: 'sendas', i3: 'behalf' },
      explanation: 'Lesen und Senden sind getrennt. „Senden als“ verbirgt den eigentlichen Absender, „im Auftrag“ zeigt ihn.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Braucht ein freigegebenes Postfach in Exchange Online bis 50 GB eine eigene Lizenz?',
      options: [
        { id: 'a', text: 'Nein, solange es unter 50 GB bleibt und kein Archiv oder Litigation Hold braucht' },
        { id: 'b', text: 'Ja, jedes Postfach braucht eine Lizenz', whyWrong: 'Freigegebene Postfächer sind bis 50 GB ohne eigene Lizenz möglich. Die Benutzer, die darauf zugreifen, brauchen aber eine.' },
        { id: 'c', text: 'Nur wenn mehr als fünf Personen zugreifen', whyWrong: 'Die Zahl der zugreifenden Personen spielt für die Lizenz des freigegebenen Postfachs keine Rolle.' },
      ],
      correct: 'a',
      explanation: 'Mehr Speicher, Online-Archiv oder Aufbewahrungsfunktionen erfordern eine Lizenz für das freigegebene Postfach.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Die Gruppe `GG_Vertrieb` hat Vollzugriff auf das Postfach „Vertrieb“. Neue Mitarbeiter sehen es nicht automatisch in Outlook. Warum?',
      options: [
        { id: 'a', text: 'Automapping funktioniert nur bei direkt vergebenem Vollzugriff, nicht über Gruppen.' },
        { id: 'b', text: 'Gruppen dürfen keinen Vollzugriff bekommen.', whyWrong: 'Das geht und ist oft sinnvoll. Nur das automatische Einblenden fehlt dann.' },
        { id: 'c', text: 'Die neuen Mitarbeiter haben keine Lizenz.', whyWrong: 'Ohne Lizenz hätten sie gar kein eigenes Postfach. Das Problem ist das fehlende Automapping bei Gruppenrechten.' },
      ],
      correct: 'a',
      explanation: 'Lösung: Postfach manuell hinzufügen lassen oder Rechte direkt pro Benutzer vergeben (z. B. per IAM-Workflow automatisiert).',
    },
    {
      id: 'q4', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Gib Max Vollzugriff auf das Postfach „Vertrieb“, ohne dass es automatisch in Outlook erscheint (Exchange Online PowerShell).',
      template: 'PS> Add-MailboxPermission -Identity vertrieb -User max -AccessRights {{0}} -AutoMapping {{1}}',
      blanks: [{ accept: ['FullAccess'] }, { accept: ['$false'] }],
      explanation: '`FullAccess` ist das Leserecht aufs ganze Postfach, `-AutoMapping $false` verhindert das Einblenden.',
    },
    {
      id: 'q5', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Gib Max in Exchange Online „Senden als“ auf das Postfach „Vertrieb“.',
      template: 'PS> {{0}} -Identity vertrieb -Trustee max -AccessRights SendAs',
      blanks: [{ accept: ['Add-RecipientPermission'] }],
      explanation: 'Online: `Add-RecipientPermission`. On-premises wäre es `Add-ADPermission -ExtendedRights "Send As"`.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Anna soll Bens Kalender lesen, aber nichts ändern. Welche Rolle passt?',
      options: [
        { id: 'a', text: 'Reviewer' },
        { id: 'b', text: 'Editor', whyWrong: 'Editor darf Elemente erstellen, ändern und löschen. Das ist mehr als lesen.' },
        { id: 'c', text: 'Owner', whyWrong: 'Owner darf alles inklusive Berechtigungen ändern. Das widerspricht Least Privilege.' },
        { id: 'd', text: 'AvailabilityOnly', whyWrong: 'Damit sieht Anna nur frei/gebucht, aber keine Details. Sie soll aber lesen können.' },
      ],
      correct: 'a',
      explanation: '`Add-MailboxFolderPermission ben:\\Kalender -User anna -AccessRights Reviewer`.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Welcher Statuscode im NDR steht für „Postfach des Empfängers voll“?',
      options: [
        { id: 'a', text: '5.2.2' },
        { id: 'b', text: '5.1.1', whyWrong: '5.1.1 bedeutet, die Empfängeradresse ist unbekannt.' },
        { id: 'c', text: '4.4.7', whyWrong: '4.x.x ist vorübergehend. 4.4.7 bedeutet, die Nachricht ist abgelaufen, weil sie zu lange nicht zugestellt werden konnte.' },
      ],
      correct: 'a',
      explanation: '5.2.2 = mailbox full. Empfänger muss aufräumen oder mehr Speicher bekommen.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Ein Kunde fragt, ob eine Mail von gestern an einen externen Partner rausgegangen ist (Exchange Online). Womit prüfst du das?',
      options: [
        { id: 'a', text: 'Nachrichtenablaufverfolgung im Exchange Admin Center oder `Get-MessageTraceV2`' },
        { id: 'b', text: '`Get-MessageTrackingLog`', whyWrong: 'Das ist das Cmdlet für Exchange Server on-premises. In Exchange Online heißt das Werkzeug Nachrichtenablaufverfolgung.' },
        { id: 'c', text: 'Im Postfach des Partners nachsehen', whyWrong: 'Auf das Postfach eines externen Partners hast du keinen Zugriff, und das wäre auch datenschutzrechtlich nicht in Ordnung.' },
      ],
      correct: 'a',
      explanation: 'Message trace zeigt Status wie Delivered, Failed, Pending, Quarantined und die Details zum Zielserver.',
    },
    {
      id: 'q9', type: 'multi', difficulty: 2,
      prompt: 'Welche Aussagen zu freigegebenen Postfächern stimmen?',
      options: [
        { id: 'a', text: 'Man meldet sich nicht direkt am freigegebenen Postfach an, sondern greift über Berechtigungen zu.' },
        { id: 'b', text: 'Zum Senden braucht man zusätzlich zum Vollzugriff „Senden als“ oder „Senden im Auftrag“.' },
        { id: 'c', text: 'Jedes freigegebene Postfach braucht ein bekanntes Kennwort.', whyWrong: 'Das zugehörige Konto ist für die Anmeldung gedacht deaktiviert bzw. blockiert. Zugriff läuft über die Konten der Benutzer.' },
        { id: 'd', text: 'Vollzugriff erlaubt automatisch auch Senden.', whyWrong: 'Vollzugriff ist nur Lesen und Bearbeiten im Postfach. Senden ist ein eigenes Recht.' },
      ],
      correct: ['a', 'b'],
      explanation: 'Die Anmeldung am freigegebenen Postfach sollte blockiert sein. Zugriff und Senden sind getrennte Berechtigungen.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Outlook kann bei einem neuen Benutzer das Postfach nicht automatisch einrichten, OWA funktioniert. Was ist ein typischer Verdächtiger?',
      options: [
        { id: 'a', text: 'AutoErmittlung (Autodiscover), z. B. falscher oder fehlender DNS-Eintrag' },
        { id: 'b', text: 'Das Postfach ist voll.', whyWrong: 'Ein volles Postfach verhindert nicht die Einrichtung in Outlook. OWA geht ja auch.' },
        { id: 'c', text: 'Die Gruppenrichtlinie für den Desktophintergrund', whyWrong: 'Hat mit der Postfacheinrichtung nichts zu tun.' },
      ],
      correct: 'a',
      explanation: 'OWA geht direkt per URL, Outlook braucht AutoErmittlung. Testen mit dem Microsoft Remote Connectivity Analyzer.',
      domain: 'troubleshoot',
    },
    {
      id: 'q11', type: 'single', difficulty: 3,
      prompt: 'Hybrid: Max (Postfach lokal) soll „Senden als“ auf das Postfach „Einkauf“ (in Exchange Online) bekommen. Was ist zu beachten?',
      options: [
        { id: 'a', text: 'Umgebungsübergreifende Rechte gehen nur teilweise. „Senden als“ muss ggf. in beiden Umgebungen gesetzt werden. Am besten liegen beide Postfächer am selben Ort.' },
        { id: 'b', text: 'Es reicht, das Recht in Exchange Online zu setzen, es wird automatisch zurück synchronisiert.', whyWrong: 'Berechtigungen werden nicht einfach zurück synchronisiert. Senden-als über Umgebungen hinweg braucht manuelle Pflege.' },
        { id: 'c', text: 'Das ist technisch unmöglich.', whyWrong: 'Es ist möglich, aber mit Einschränkungen und Mehraufwand. Microsoft empfiehlt, zusammenarbeitende Postfächer gemeinsam zu migrieren.' },
      ],
      correct: 'a',
      explanation: 'Siehe „Permissions in Exchange hybrid deployments“ bei Microsoft Learn.',
    },
    {
      id: 'q12', type: 'ordering', difficulty: 2,
      prompt: 'Bring den Weg einer Mail von Outlook zum externen Empfänger in die richtige Reihenfolge.',
      items: [
        { id: 'a', text: 'Outlook übergibt die Mail ans Postfach (Postausgang)' },
        { id: 'b', text: 'Transport prüft Nachrichtenflussregeln und Antispam' },
        { id: 'c', text: 'Sendeconnector sucht den MX-Eintrag der Zieldomain' },
        { id: 'd', text: 'Mailserver des Empfängers nimmt die Mail an' },
      ],
      explanation: 'Postausgang → Transport → Sendeconnector/MX → Zielserver.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Mails einer Firma landen bei vielen externen Empfängern im Spam. Was prüfst du?',
      options: [
        { id: 'a', text: 'SPF-, DKIM- und DMARC-Einträge der Absenderdomain' },
        { id: 'b', text: 'Die Postfachgröße der Absender', whyWrong: 'Die Größe des eigenen Postfachs beeinflusst nicht, wie fremde Server die Mail bewerten.' },
        { id: 'c', text: 'Die NTFS-Rechte auf dem Exchange-Server', whyWrong: 'Dateirechte auf dem Server haben nichts mit der Spam-Bewertung beim Empfänger zu tun.' },
      ],
      correct: 'a',
      explanation: 'Empfängerserver prüfen, ob der sendende Server erlaubt ist (SPF), die Signatur stimmt (DKIM) und was die Domain bei Fehlern will (DMARC).',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Welcher Befehl zeigt, wer Vollzugriff auf ein Postfach hat?',
      options: [
        { id: 'a', text: '`Get-MailboxPermission vertrieb`' },
        { id: 'b', text: '`Get-RecipientPermission vertrieb`', whyWrong: 'Das zeigt in Exchange Online die „Senden als“-Rechte, nicht Vollzugriff.' },
        { id: 'c', text: '`Get-MailboxStatistics vertrieb`', whyWrong: 'Das zeigt Größe, Anzahl Elemente und letzte Anmeldung, keine Berechtigungen.' },
      ],
      correct: 'a',
      explanation: 'Mit `Where-Object { $_.IsInherited -eq $false }` filterst du auf explizit vergebene Rechte.',
      domain: 'scripting',
    },
    {
      id: 'q15', type: 'single', difficulty: 3,
      prompt: 'Nach Migration eines Postfachs nach Exchange Online kommen interne Mails mit NDR `IMCEAEX-...` zurück. Was ist die typische Ursache?',
      options: [
        { id: 'a', text: 'Outlook nutzt einen alten Eintrag im Autovervollständigen-Cache mit der alten internen Adresse (LegacyExchangeDN).' },
        { id: 'b', text: 'Der MX-Eintrag ist falsch.', whyWrong: 'Der MX-Eintrag betrifft eingehende Mails aus dem Internet. IMCEAEX deutet auf eine X.500-Adresse aus dem Cache hin.' },
        { id: 'c', text: 'Die Lizenz ist abgelaufen.', whyWrong: 'Eine fehlende Lizenz führt nicht zu IMCEAEX-Fehlern bei Absendern.' },
      ],
      correct: 'a',
      explanation: 'Lösung: Cache-Eintrag löschen und Empfänger neu aus dem Adressbuch wählen. Dauerhaft: alte LegacyExchangeDN als X500-Adresse am Postfach hinterlegen.',
      domain: 'troubleshoot',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: '„Unsere Assistentin Lisa kann seit heute keine Mails mehr im Namen der Geschäftsführung senden. Bekommt einen Fehler.“',
        steps: [
          {
            id: 's1', text: 'Was fragst du bzw. prüfst du zuerst?',
            options: [
              { id: 'a', text: 'Genaue Fehlermeldung bzw. NDR und ob sich gestern etwas an Rechten oder Postfächern geändert hat', correct: true, feedback: 'Richtig. Fehlertext und letzte Änderungen grenzen am schnellsten ein.' },
              { id: 'b', text: 'Outlook neu installieren lassen', correct: false, feedback: 'Ohne Analyse ist das Raten und kostet Zeit.' },
            ],
          },
          {
            id: 's2', text: 'NDR: `5.7.60 SMTP; Client does not have permissions to send as this sender`. `Get-RecipientPermission gf` zeigt nur `NT AUTHORITY\\SELF`. Was heißt das?',
            options: [
              { id: 'a', text: 'Lisa hat kein „Senden als“ (mehr) auf das Postfach der Geschäftsführung.', correct: true, feedback: 'Genau. Der Code und die leere Liste passen zusammen.' },
              { id: 'b', text: 'Das Postfach der Geschäftsführung ist voll.', correct: false, feedback: 'Volles Postfach wäre 5.2.2. Hier steht ausdrücklich „permissions to send as“.' },
            ],
          },
          {
            id: 's3', text: 'Im Audit siehst du: Das Recht wurde gestern durch einen Rezertifizierungs-Lauf im IAM-System entzogen. Was tust du?',
            options: [
              { id: 'a', text: 'Mit dem Kunden klären, ob der Entzug gewollt war. Falls nicht: Recht über den IAM-Prozess neu beantragen und genehmigen lassen, dann dokumentieren.', correct: true, feedback: 'Richtig. Am IAM vorbei direkt in Exchange setzen würde beim nächsten Abgleich wieder entfernt bzw. als Abweichung gemeldet.' },
              { id: 'b', text: 'Sofort in Exchange wieder setzen.', correct: false, feedback: 'Das umgeht den Prozess. Das IAM-System würde die Abweichung beim nächsten Lauf erkennen oder das Recht wieder entfernen.' },
            ],
          },
        ],
        explanation: 'Postfachrechte in IAM-verwalteten Umgebungen über den Prozess vergeben, nicht direkt am System.',
        domain: 'troubleshoot',
      },
      {
        id: 'b2', type: 'single', difficulty: 2,
        prompt: 'Max soll Mails so senden, dass der Empfänger nur „Vertrieb“ als Absender sieht. Welches Recht?',
        options: [
          { id: 'a', text: 'Senden als' },
          { id: 'b', text: 'Senden im Auftrag', whyWrong: 'Dann sieht der Empfänger „Max im Auftrag von Vertrieb“, also auch Max.' },
          { id: 'c', text: 'Vollzugriff', whyWrong: 'Vollzugriff erlaubt kein Senden.' },
        ],
        correct: 'a',
        explanation: 'Senden als = Absender ist nur das Postfach.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Ein Admin hat Vollzugriff auf 300 Postfächer per direkter Zuweisung. Sein Outlook ist extrem langsam. Lösung?',
        options: [
          { id: 'a', text: 'Rechte mit `-AutoMapping $false` neu vergeben, damit Outlook nicht alle Postfächer lädt' },
          { id: 'b', text: 'Outlook-Cache-Modus abschalten', whyWrong: 'Das macht Outlook bei so vielen eingebundenen Postfächern eher noch langsamer. Ursache ist das Automapping.' },
          { id: 'c', text: 'Mehr RAM einbauen', whyWrong: 'Das kaschiert das Problem höchstens. 300 automatisch eingebundene Postfächer sind die Ursache.' },
        ],
        correct: 'a',
        explanation: 'Automapping lässt sich nur beim Vergeben steuern: Recht entfernen und mit `-AutoMapping $false` neu setzen.',
      },
      {
        id: 'b4', type: 'single', difficulty: 2,
        prompt: 'Welcher Unterschied zwischen Exchange Online und Exchange Server stimmt?',
        options: [
          { id: 'a', text: '„Senden als“ setzt man online mit `Add-RecipientPermission`, lokal mit `Add-ADPermission`.' },
          { id: 'b', text: 'Exchange Online kennt keine freigegebenen Postfächer.', whyWrong: 'Freigegebene Postfächer gibt es in beiden, in Exchange Online sogar ohne eigene Lizenz bis 50 GB.' },
          { id: 'c', text: 'Lokal gibt es keine PowerShell.', whyWrong: 'Lokal gibt es die Exchange-Verwaltungsshell (EMS).' },
        ],
        correct: 'a',
        explanation: 'Lokal ist „Send As“ ein erweitertes AD-Recht, online ein Empfängerrecht.',
        domain: 'scripting',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'A customer writes: "Emails to partner@contoso.example bounce with 550 5.1.1 since yesterday." What do you ask first?',
        options: [
          { id: 'a', text: 'Please send the full NDR and confirm the exact recipient address. Has the partner changed their address or domain?' },
          { id: 'b', text: 'Please restart your Exchange server.', whyWrong: '5.1.1 means the recipient is unknown on the target side. A restart does not help and causes downtime.' },
          { id: 'c', text: 'Please check if your mailbox is full.', whyWrong: 'A full mailbox is 5.2.2 and would concern the recipient side, not this error.' },
        ],
        correct: 'a',
        explanation: 'Ask for facts (full NDR, address) before acting. 5.1.1 = recipient not found.',
        domain: 'english',
      },
    ],
  },
};

export default level;
