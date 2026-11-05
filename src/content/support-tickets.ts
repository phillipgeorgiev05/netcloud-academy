import type { SupportTicket } from '../types/content';

// Ticket-Simulator Teil D: Hersteller-Support für ein GENERISCHES IAM-System (kein echtes Produkt).
// Firmen und Personen sind fiktiv. Log- und Fehlertexte des IAM-Systems sind Beispiele; Windows-, AD-, Exchange- und Entra-Meldungen sind echt.
// IDs nie umbenennen (Fortschritt speichert sie). Stichwörter in doc.points klein schreiben, inkl. Synonyme (bei EN auch englisch).

const PREV = ['künftig', 'zukünftig', 'vorbeug', 'prävention', 'damit', 'hinweis', 'dokument', 'wissensdatenbank', 'checkliste', 'prozess', 'monitoring', 'überwach'];
const PREV_EN = ['prevent', 'future', 'going forward', 'monitor', 'document', 'knowledge base', 'process', 'checklist', 'next time', 'avoid'];

export const supportTickets: SupportTicket[] = [
  // ───────────── Einsteiger ─────────────
  {
    id: 'sd01', type: 'chain', difficulty: 1, priority: 2, lang: 'de', area: 'iam', learn: 'sup-05',
    title: 'Neue Mitarbeiterin kann sich am ersten Tag nicht anmelden',
    company: 'Brenner Logistik GmbH', requester: 'Tobias Reiter (IT-Leitung)',
    prompt: 'Hallo Support,\n\nunsere neue Kollegin Lena Fuchs hat heute ihren ersten Tag und kann sich nicht anmelden: „Ihr Konto wurde deaktiviert. Wenden Sie sich an den Systemadministrator.“ Das Konto wurde laut IAM-Portal letzte Woche automatisch angelegt.\n\nGruß, Tobias Reiter',
    steps: [
      {
        id: 's1', text: 'Was prüfst du zuerst?',
        options: [
          { id: 'a', text: 'Den Status des Kontos im AD und den Joiner-Vorgang für Lena im IAM-Protokoll', correct: true, feedback: 'Richtig. Erst Fakten: Wie sieht das Konto aus, und was hat das IAM-System damit gemacht?' },
          { id: 'b', text: 'Ihr Kennwort zurücksetzen', correct: false, feedback: 'Die Meldung sagt „deaktiviert“, nicht „Kennwort falsch“. Ein neues Kennwort ändert daran nichts.' },
          { id: 'c', text: 'Das Konto direkt im AD aktivieren', correct: false, feedback: 'Möglich, aber ohne Ursache. Außerdem könnte das IAM-System die Änderung beim Abgleich zurücknehmen.' },
        ],
      },
      {
        id: 's2', text: 'AD: `Enabled: False`. IAM-Protokoll:\n```\n2026-11-02 06:00 Joiner  lfuchs  Konto angelegt (deaktiviert)\n2026-11-02 06:00 Joiner  lfuchs  Aktivierung geplant für 2026-11-16 (Eintrittsdatum lt. HR)\n```\nWas ist los?',
        options: [
          { id: 'a', text: 'Im HR-System steht der 16.11. als Eintrittsdatum. Das IAM aktiviert das Konto erst dann.', correct: true, feedback: 'Genau. Das IAM-System arbeitet korrekt mit falschen Quelldaten.' },
          { id: 'b', text: 'Der AD-Konnektor ist defekt.', correct: false, feedback: 'Der Konnektor hat das Konto angelegt und die Aktivierung geplant. Technisch läuft alles.' },
        ],
      },
      {
        id: 's3', text: 'Was empfiehlst du?',
        options: [
          { id: 'a', text: 'HR korrigiert das Eintrittsdatum im führenden System. Nach dem nächsten Import aktiviert das IAM das Konto. Bei Eile Import manuell anstoßen.', correct: true, feedback: 'Richtig. Korrektur an der Quelle, damit Soll und Ist zusammenpassen.' },
          { id: 'b', text: 'Konto im AD aktivieren und fertig', correct: false, feedback: 'Das IAM kennt weiter den 16.11. als Eintritt. Je nach Konfiguration wird das Konto beim Abgleich wieder deaktiviert.' },
        ],
      },
    ],
    explanation: '**Ursache:** falsches Eintrittsdatum im HR-System. **Lösung:** an der Quelle korrigieren, Import anstoßen. **Merke:** Bei IAM-Tickets immer zuerst prüfen, ob das System korrekt mit falschen Daten arbeitet.',
    doc: {
      points: [
        { label: 'Ursache: falsches Eintrittsdatum im HR-System', keywords: ['eintritt', 'datum', 'hr', 'personal', '16.11'] },
        { label: 'Lösung: Datum im HR korrigieren, Import anstoßen', keywords: ['korrig', 'import', 'anpass', 'ändern', 'nachtragen'] },
        { label: 'Prävention: Eintritte rechtzeitig und korrekt erfassen', keywords: PREV },
      ],
      model: '**Ursache:** Das Eintrittsdatum von Frau Fuchs ist im HR-System mit 16.11. erfasst. Das IAM-System hat das Konto korrekt angelegt und die Aktivierung für dieses Datum geplant.\n\n**Lösung:** Bitte das Eintrittsdatum im HR-System auf den 02.11. korrigieren. Nach dem nächsten Import (oder manuell angestoßen) wird das Konto aktiviert.\n\n**Prävention:** Mit HR abstimmen, dass Eintrittsdaten vor dem ersten Arbeitstag geprüft werden.',
    },
  },
  {
    id: 'sd02', type: 'chain', difficulty: 1, priority: 3, lang: 'de', area: 'perm', learn: 'sup-01',
    title: 'Antrag genehmigt, Zugriff trotzdem verweigert',
    company: 'Stadtwerke Talheim', requester: 'Martina Kogler (Systemadministration)',
    prompt: 'Hallo,\n\nHerr Pichler hat über das Self-Service-Portal Zugriff auf `\\\\fs01\\Projekte\\Netzausbau` beantragt. Der Antrag wurde vor 20 Minuten genehmigt und laut Portal umgesetzt. Er bekommt aber weiter „Zugriff verweigert“.\n\nViele Grüße\nMartina Kogler',
    steps: [
      {
        id: 's1', text: 'Was prüfst du zuerst?',
        options: [
          { id: 'a', text: 'Ob er im AD in der Gruppe ist und ob er sich seitdem neu angemeldet hat', correct: true, feedback: 'Richtig. Gruppenmitgliedschaft und Token sind die häufigste Ursache.' },
          { id: 'b', text: 'Die NTFS-Rechte des ganzen Fileservers neu setzen', correct: false, feedback: 'Viel zu grob und riskant, bevor du überhaupt weißt, ob die Gruppe gesetzt ist.' },
        ],
      },
      {
        id: 's2', text: '`Get-ADPrincipalGroupMembership pichler` zeigt `DL_Projekte_Netzausbau_RW`. `whoami /groups` auf seinem PC zeigt die Gruppe **nicht**. Ursache?',
        options: [
          { id: 'a', text: 'Sein Zugriffstoken stammt von vor der Änderung, neue Gruppen kommen erst bei neuer Anmeldung hinein.', correct: true, feedback: 'Genau. Das Token wird bei der Anmeldung gebaut.' },
          { id: 'b', text: 'Die AD-Replikation ist kaputt.', correct: false, feedback: 'Möglich, aber dann würde das Problem meist mehr Benutzer betreffen. Hier passt das alte Token perfekt.' },
        ],
      },
      {
        id: 's3', text: 'Lösung?',
        options: [
          { id: 'a', text: 'Ab- und wieder anmelden (bzw. `klist purge` für neue Kerberos-Tickets), dann testen', correct: true, feedback: 'Richtig. Danach steht die Gruppe im Token.' },
          { id: 'b', text: 'PC neu installieren', correct: false, feedback: 'Völlig unnötig. Eine neue Anmeldung reicht.' },
        ],
      },
    ],
    explanation: '**Merke:** Gruppenänderungen wirken erst nach neuer Anmeldung. Ein guter Hinweistext im Self-Service-Portal spart viele Tickets.',
    doc: {
      points: [
        { label: 'Ursache: altes Token ohne neue Gruppe', keywords: ['token', 'anmeld', 'kerberos', 'ticket', 'whoami'] },
        { label: 'Lösung: ab-/anmelden bzw. klist purge', keywords: ['abmeld', 'neu anmeld', 'klist', 'logoff', 'neustart'] },
        { label: 'Prävention: Hinweis im Portal nach Genehmigung', keywords: PREV },
      ],
      model: '**Ursache:** Die Gruppe wurde korrekt gesetzt, aber Herr Pichlers Zugriffstoken stammt von vor der Änderung.\n\n**Lösung:** Ab- und wieder anmelden (oder `klist purge`). Danach funktioniert der Zugriff.\n\n**Prävention:** Im Portal nach der Umsetzung den Hinweis „Bitte neu anmelden“ anzeigen.',
    },
  },
  {
    id: 'sd03', type: 'chain', difficulty: 1, priority: 3, lang: 'de', area: 'perm', learn: 'sup-02',
    title: 'Dateien sichtbar, aber nicht zu öffnen',
    company: 'Kanzlei Rauch & Partner', requester: 'Daniel Rauch (IT)',
    prompt: 'Servus,\n\nnach der Einrichtung des neuen Ordners `Mandate-2026` über euren Fileserver-Konnektor sehen die Sekretärinnen alle Dateien, aber beim Öffnen kommt „Zugriff verweigert“.\n\nLG Daniel',
    steps: [
      {
        id: 's1', text: 'Du lässt dir `icacls` des Ordners schicken:\n```\nD:\\Daten\\Mandate-2026 FIRMA\\DL_Mandate_R:(RX)\n                       FIRMA\\DL_Mandate_RW:(OI)(CI)(M)\n                       VORDEFINIERT\\Administratoren:(OI)(CI)(F)\n```\nWas fällt auf?',
        options: [
          { id: 'a', text: 'Bei `DL_Mandate_R` fehlen `(OI)(CI)`, der Eintrag gilt nur für den Ordner selbst.', correct: true, feedback: 'Genau. Die Dateien bekommen kein Leserecht vererbt.' },
          { id: 'b', text: 'RX reicht nicht zum Lesen.', correct: false, feedback: 'RX (Lesen, Ausführen) reicht völlig. Es kommt nur nicht bei den Dateien an.' },
        ],
      },
      {
        id: 's2', text: 'Die Sekretärinnen sind in `DL_Mandate_R`. Passt das zum Symptom?',
        options: [
          { id: 'a', text: 'Ja: Ordner auflisten geht, Dateien selbst haben kein Recht für die Gruppe.', correct: true, feedback: 'Richtig, klassisches „Nur diesen Ordner“-Muster.' },
          { id: 'b', text: 'Nein, dann dürften sie den Ordner gar nicht sehen.', correct: false, feedback: 'Das Leserecht auf den Ordner erlaubt das Auflisten. Nur die Dateien sind nicht abgedeckt.' },
        ],
      },
      {
        id: 's3', text: 'Wie löst du es nachhaltig?',
        options: [
          { id: 'a', text: 'Vorlage bzw. Berechtigungsprofil im IAM korrigieren (Vererbung auf Unterordner und Dateien) und neu anwenden lassen', correct: true, feedback: 'Richtig. Sonst entsteht der Fehler bei jedem neuen Ordner wieder.' },
          { id: 'b', text: 'Allen Sekretärinnen direkt Vollzugriff auf die Dateien geben', correct: false, feedback: 'Zu viele Rechte, direkt an Personen und am IAM vorbei.' },
        ],
      },
    ],
    explanation: '**Merke:** `(OI)(CI)` fehlen = Recht gilt nur für den Ordner. Fehler in Vorlagen beheben, nicht im Einzelfall.',
    doc: {
      points: [
        { label: 'Ursache: Recht ohne Vererbung (nur dieser Ordner)', keywords: ['(oi)', 'vererb', 'nur diesen ordner', 'nur für den ordner', 'anwenden auf'] },
        { label: 'Lösung: Vorlage korrigieren und neu anwenden', keywords: ['vorlage', 'profil', 'korrig', 'neu anwend', 'template'] },
        { label: 'Prüfung/Test nach der Änderung', keywords: ['test', 'prüf', 'kontroll', 'bestätig'] },
      ],
      model: '**Ursache:** Der Eintrag für `DL_Mandate_R` gilt nur für den Ordner selbst (ohne `(OI)(CI)`), die Dateien erben kein Leserecht.\n\n**Lösung:** In der Ordnervorlage „Anwenden auf: Diesen Ordner, Unterordner und Dateien“ setzen und die Vorlage auf `Mandate-2026` neu anwenden.\n\n**Test:** Eine Sekretärin öffnet eine Datei, Ergebnis im Ticket bestätigt.',
    },
  },
  {
    id: 'sd04', type: 'chain', difficulty: 1, priority: 3, lang: 'en', area: 'infra', learn: 'sup-03',
    title: 'Cannot send from shared mailbox',
    company: 'Halvorsen Shipping AS', requester: 'Ingrid Dahl (IT Operations)',
    prompt: 'Hi team,\n\nwe granted our new colleague access to the shared mailbox bookings@ through your IAM portal. He can read all emails, but when he sends as bookings@ he gets an NDR: `550 5.7.60 SMTP; Client does not have permissions to send as this sender`.\n\nThanks, Ingrid',
    steps: [
      {
        id: 's1', text: 'What does the NDR tell you?',
        options: [
          { id: 'a', text: 'He has no Send As permission on the shared mailbox.', correct: true, feedback: 'Correct. Reading works (Full Access), sending as the mailbox is a separate right.' },
          { id: 'b', text: 'The shared mailbox is full.', correct: false, feedback: 'A full mailbox would be 5.2.2. The NDR explicitly says "permissions to send as".' },
        ],
      },
      {
        id: 's2', text: 'In the IAM portal, the role "Bookings team" contains only `FullAccess` for bookings@. What is missing?',
        options: [
          { id: 'a', text: 'The role should also contain `SendAs` (or Send on Behalf, depending on what the customer wants).', correct: true, feedback: 'Exactly. The role definition is incomplete.' },
          { id: 'b', text: 'Nothing, Full Access includes sending.', correct: false, feedback: 'Full Access never includes sending. Exchange keeps them separate.' },
        ],
      },
      {
        id: 's3', text: 'What do you recommend?',
        options: [
          { id: 'a', text: 'Add Send As to the role, let the connector apply it, test with a mail, and remind the user that Exchange Online may need a little time', correct: true, feedback: 'Correct. Fix the role so all team members get it.' },
          { id: 'b', text: 'Give him the password of the shared mailbox', correct: false, feedback: 'Shared mailboxes should not be used with a password. This breaks traceability.' },
        ],
      },
    ],
    explanation: '**Remember:** Full Access = read, Send As = send as the mailbox, Send on Behalf = "on behalf of".',
    doc: {
      points: [
        { label: 'Root cause: Send As missing (only Full Access)', keywords: ['send as', 'sendas', 'full access', 'permission'] },
        { label: 'Solution: add Send As to the role and apply', keywords: ['role', 'add', 'grant', 'assign'] },
        { label: 'Verification / test', keywords: ['test', 'verify', 'confirm', 'check'] },
      ],
      model: '**Root cause:** The role "Bookings team" grants only Full Access to bookings@. Full Access allows reading, not sending.\n\n**Solution:** Add the Send As permission to the role. The Exchange connector will apply it to all members.\n\n**Verification:** Please send a test email as bookings@ after a short while and confirm.',
    },
  },
  {
    id: 'sd05', type: 'chain', difficulty: 1, priority: 4, lang: 'de', area: 'scripting', learn: 'sup-06',
    title: 'Exportierter Bericht: alles in einer Spalte, Umlaute kaputt',
    company: 'Alpenmetall AG', requester: 'Sandra Moser (Applikationsbetreuung)',
    prompt: 'Hallo,\n\nich exportiere eure Benutzerliste per PowerShell weiter:\n```\n$daten | Export-Csv C:\\Temp\\liste.csv -NoTypeInformation\n```\nIn Excel steht alles in Spalte A, und aus „Müller“ wird „MÃ¼ller“.\n\nDanke, Sandra',
    steps: [
      {
        id: 's1', text: 'Warum steht alles in Spalte A?',
        options: [
          { id: 'a', text: 'Export-Csv trennt mit Komma, deutsches Excel erwartet Semikolon.', correct: true, feedback: 'Richtig. Regionale Einstellung bestimmt das Trennzeichen.' },
          { id: 'b', text: 'Die Datei ist beschädigt.', correct: false, feedback: 'Die Daten sind da, nur das Trennzeichen passt nicht.' },
        ],
      },
      {
        id: 's2', text: 'Warum „MÃ¼ller“?',
        options: [
          { id: 'a', text: 'Die Datei ist UTF-8 ohne BOM, Excel liest sie als ANSI.', correct: true, feedback: 'Genau. Excel erkennt UTF-8 zuverlässig nur mit BOM.' },
          { id: 'b', text: 'Der Name ist im AD falsch gespeichert.', correct: false, feedback: 'Im AD steht „Müller“ korrekt. Es ist ein Kodierungsproblem beim Öffnen.' },
        ],
      },
      {
        id: 's3', text: 'Korrekte Zeile?',
        options: [
          { id: 'a', text: '`Export-Csv C:\\Temp\\liste.csv -NoTypeInformation -Delimiter \';\' -Encoding UTF8` (PowerShell 7: `utf8BOM`)', correct: true, feedback: 'Richtig. In 5.1 schreibt UTF8 mit BOM, in 7 braucht es utf8BOM.' },
          { id: 'b', text: '`Export-Csv … | Format-Table`', correct: false, feedback: 'Format-Table hilft nicht und gehört nie hinter oder vor Export-Csv.' },
        ],
      },
    ],
    explanation: '**Merke:** Deutsches Excel: `-Delimiter \';\'`, Umlaute: UTF-8 mit BOM.',
    doc: {
      points: [
        { label: 'Ursache 1: Trennzeichen Komma statt Semikolon', keywords: ['trennzeichen', 'delimiter', 'semikolon', ';'] },
        { label: 'Ursache 2: Kodierung ohne BOM', keywords: ['utf', 'bom', 'kodierung', 'encoding'] },
        { label: 'Lösung: Befehl mit -Delimiter und -Encoding', keywords: ['-delimiter', '-encoding', 'export-csv'] },
      ],
      model: '**Ursache:** Export-Csv nutzt standardmäßig Komma als Trennzeichen, deutsches Excel erwartet Semikolon. Die Datei ist außerdem nicht als UTF-8 mit BOM gespeichert, darum zeigt Excel Umlaute falsch.\n\n**Lösung:** `Export-Csv C:\\Temp\\liste.csv -NoTypeInformation -Delimiter \';\' -Encoding UTF8` (PowerShell 7: `-Encoding utf8BOM`).',
    },
  },
  {
    id: 'sd06', type: 'chain', difficulty: 1, priority: 3, lang: 'de', area: 'iam', learn: 'sup-05',
    title: 'Antrag hängt seit einer Woche in der Genehmigung',
    company: 'Brenner Logistik GmbH', requester: 'Tobias Reiter (IT-Leitung)',
    prompt: 'Hallo,\n\nein Antrag auf Zugriff zum Ordner „Fuhrpark“ steht seit 7 Tagen auf „Wartet auf Genehmigung“. Der Kollege braucht das dringend. Ist euer Workflow kaputt?\n\nTobias',
    steps: [
      {
        id: 's1', text: 'Was schaust du dir im Antrag zuerst an?',
        options: [
          { id: 'a', text: 'Bei wem der Antrag gerade liegt (aktueller Genehmiger) und ob Benachrichtigungen versendet wurden', correct: true, feedback: 'Richtig. „Hängt“ heißt oft: liegt bei jemandem, der nicht reagiert.' },
          { id: 'b', text: 'Den Workflow-Dienst neu starten', correct: false, feedback: 'Ohne Hinweis auf einen technischen Fehler ist das Raten. Andere Anträge laufen ja.' },
        ],
      },
      {
        id: 's2', text: 'Genehmiger: Fuhrparkleiter Herr Gruber. Mail-Benachrichtigung zugestellt. Abwesenheitsnotiz: Urlaub bis 20.11. Kein Stellvertreter hinterlegt. Ursache?',
        options: [
          { id: 'a', text: 'Der Dateneigentümer ist im Urlaub und es gibt keine Vertretung oder Eskalation.', correct: true, feedback: 'Genau. Technisch läuft alles, organisatorisch fehlt die Vertretung.' },
          { id: 'b', text: 'Die Mail-Benachrichtigung ist im Spam gelandet.', correct: false, feedback: 'Laut Abwesenheitsnotiz ist er schlicht nicht da.' },
        ],
      },
      {
        id: 's3', text: 'Empfehlung?',
        options: [
          { id: 'a', text: 'Kurzfristig: Antrag an berechtigte Vertretung umleiten (laut Kundenprozess). Dauerhaft: Stellvertreter und Eskalationsregel (z. B. nach 3 Tagen) im Workflow hinterlegen.', correct: true, feedback: 'Richtig. Akut lösen und Wiederholung verhindern.' },
          { id: 'b', text: 'Antrag selbst genehmigen, damit es weitergeht', correct: false, feedback: 'Du bist nicht der Dateneigentümer. Das hebelt das Vier-Augen-Prinzip aus.' },
        ],
      },
    ],
    explanation: '**Merke:** Genehmigungsworkflows brauchen Vertretung und Eskalation, sonst wird Urlaub zum Ticket.',
    doc: {
      points: [
        { label: 'Ursache: Genehmiger abwesend, keine Vertretung', keywords: ['urlaub', 'abwesen', 'vertret', 'stellvertret'] },
        { label: 'Sofortmaßnahme: Antrag an Vertretung umleiten', keywords: ['umleit', 'weiterleit', 'delegier', 'neu zuweis'] },
        { label: 'Prävention: Vertretung/Eskalationsregel hinterlegen', keywords: ['eskalation', 'regel', 'hinterleg', ...PREV] },
      ],
      model: '**Ursache:** Der Antrag liegt beim Dateneigentümer Herrn Gruber, der bis 20.11. im Urlaub ist. Eine Vertretung ist nicht hinterlegt.\n\n**Sofortmaßnahme:** Antrag an die laut Ihrem Prozess berechtigte Vertretung umleiten.\n\n**Prävention:** Für alle Dateneigentümer Stellvertreter pflegen und eine Eskalationsregel (z. B. nach 3 Werktagen) einrichten.',
    },
  },
  {
    id: 'sd07', type: 'chain', difficulty: 1, priority: 3, lang: 'en', area: 'english', learn: 'sup-08',
    title: '"Your IAM is not working!!!"',
    company: 'Clearwater Dental Group', requester: 'Mark Ellison (Office Manager)',
    prompt: 'Your IAM is not working!!! Nobody can do anything. Fix it ASAP.\n\nMark',
    steps: [
      {
        id: 's1', text: 'What is your first reply?',
        options: [
          { id: 'a', text: 'Thank him, acknowledge the urgency, and ask specific questions: what exactly fails, error message, since when, how many users, what changed.', correct: true, feedback: 'Correct. Calm, structured, specific.' },
          { id: 'b', text: '"Please restart all servers and come back if it still does not work."', correct: false, feedback: 'Guessing and potentially harmful. You do not know yet what is broken.' },
          { id: 'c', text: '"Our product works fine, it must be your network."', correct: false, feedback: 'Blaming without facts escalates the situation.' },
        ],
      },
      {
        id: 's2', text: 'Answer: "Users cannot log in to the self-service portal since 8 am. Error: *The remote certificate is invalid*. Windows logon works." What do you suspect?',
        options: [
          { id: 'a', text: 'The TLS certificate of the portal has expired or was replaced incorrectly.', correct: true, feedback: 'Very likely. Only the portal is affected, and the error mentions the certificate.' },
          { id: 'b', text: 'All AD accounts are locked.', correct: false, feedback: 'Windows logon works, so the accounts are fine.' },
        ],
      },
      {
        id: 's3', text: 'The certificate expired yesterday. Next step?',
        options: [
          { id: 'a', text: 'Ask the customer to install the renewed certificate on the portal web server (as described in the admin guide), verify, and suggest certificate expiry monitoring.', correct: true, feedback: 'Correct. Fix plus prevention.' },
          { id: 'b', text: 'Tell users to ignore the browser warning.', correct: false, feedback: 'Teaching users to ignore certificate warnings is a security risk.' },
        ],
      },
    ],
    explanation: '**Remember:** Vague, angry tickets get a calm reply with precise questions. The first facts often point straight to the cause.',
    doc: {
      points: [
        { label: 'Root cause: expired portal certificate', keywords: ['certificate', 'cert', 'expired', 'tls', 'ssl'] },
        { label: 'Solution: install renewed certificate and verify', keywords: ['renew', 'install', 'replace', 'new certificate'] },
        { label: 'Prevention: monitor certificate expiry', keywords: PREV_EN },
      ],
      model: '**Root cause:** The TLS certificate of the self-service portal expired yesterday, so browsers reject the connection.\n\n**Solution:** Please install the renewed certificate on the portal web server and bind it to the site. Users can log in again afterwards.\n\n**Prevention:** Set up monitoring or a reminder for certificate expiry at least 30 days in advance.',
    },
  },
  {
    id: 'sd08', type: 'chain', difficulty: 1, priority: 4, lang: 'de', area: 'infra', learn: 'sup-03',
    title: 'Freigegebenes Postfach erscheint nicht in Outlook',
    company: 'Stadtwerke Talheim', requester: 'Martina Kogler (Systemadministration)',
    prompt: 'Hallo,\n\nüber die neue Rolle „Kundenservice“ bekommen Mitarbeiter Vollzugriff auf das Postfach kundenservice@. Bei den alten Mitarbeitern (Rechte damals direkt gesetzt) erscheint es automatisch in Outlook, bei den neuen nicht. Rechte sind laut `Get-MailboxPermission` da.\n\nGruß, Martina',
    steps: [
      {
        id: 's1', text: 'Wie sind die Rechte bei den neuen Mitarbeitern vergeben?',
        options: [
          { id: 'a', text: 'Über die Gruppe `GG_Kundenservice`, die Vollzugriff hat', correct: true, feedback: 'Richtig, das ist der Unterschied zu den alten Mitarbeitern.' },
          { id: 'b', text: 'Gar nicht', correct: false, feedback: '`Get-MailboxPermission` zeigt die Gruppe mit Vollzugriff. Die Rechte sind da.' },
        ],
      },
      {
        id: 's2', text: 'Warum erscheint das Postfach nicht automatisch?',
        options: [
          { id: 'a', text: 'Automapping funktioniert nur bei direkt an Benutzer vergebenem Vollzugriff.', correct: true, feedback: 'Genau. Gruppen lösen kein Automapping aus.' },
          { id: 'b', text: 'Outlook ist veraltet.', correct: false, feedback: 'Bei den alten Mitarbeitern geht es mit derselben Outlook-Version.' },
        ],
      },
      {
        id: 's3', text: 'Was schlägst du vor?',
        options: [
          { id: 'a', text: 'Entweder Postfach in Outlook manuell hinzufügen (Anleitung) oder die Rolle so konfigurieren, dass Vollzugriff pro Benutzer gesetzt wird. Vor- und Nachteile dem Kunden erklären.', correct: true, feedback: 'Richtig. Beides ist legitim, der Kunde entscheidet.' },
          { id: 'b', text: 'Allen Mitarbeitern Global Administrator geben', correct: false, feedback: 'Völlig unverhältnismäßig und ohne Bezug zum Problem.' },
        ],
      },
    ],
    explanation: '**Merke:** Automapping nur bei direkter Zuweisung. Gruppenrechte sind leichter zu verwalten, brauchen aber manuelles Einbinden.',
    doc: {
      points: [
        { label: 'Ursache: Vollzugriff über Gruppe, kein Automapping', keywords: ['automapping', 'gruppe', 'automatisch'] },
        { label: 'Lösung A: manuell in Outlook hinzufügen', keywords: ['manuell', 'hinzufüg', 'outlook', 'anleitung'] },
        { label: 'Lösung B: Rechte pro Benutzer über die Rolle', keywords: ['pro benutzer', 'direkt', 'einzeln', 'rolle'] },
      ],
      model: '**Ursache:** Die neuen Mitarbeiter haben Vollzugriff über die Gruppe `GG_Kundenservice`. Automapping funktioniert nur, wenn der Vollzugriff direkt am Benutzer vergeben ist.\n\n**Lösungen:** a) Postfach in Outlook manuell hinzufügen (Anleitung anbei) oder b) die Rolle so konfigurieren, dass Vollzugriff pro Benutzer gesetzt wird. Variante b) bindet automatisch ein, erzeugt aber mehr Einzelrechte.',
    },
  },
  {
    id: 'sd09', type: 'chain', difficulty: 1, priority: 4, lang: 'de', area: 'perm', learn: 'sup-04',
    title: 'Externe Freigabe in SharePoint nicht möglich',
    company: 'Kanzlei Rauch & Partner', requester: 'Daniel Rauch (IT)',
    prompt: 'Hi,\n\nein Anwalt will ein Dokument aus der Website „Mandat Huber“ mit dem Gegenanwalt teilen. Beim Teilen kommt: „Ihre Organisation lässt das Teilen mit externen Benutzern nicht zu.“ Bei der Website „Allgemein“ geht es.\n\nDaniel',
    steps: [
      {
        id: 's1', text: 'Was sagt dir „bei einer anderen Website geht es“?',
        options: [
          { id: 'a', text: 'Die Organisation erlaubt externe Freigabe, die Website „Mandat Huber“ ist strenger eingestellt.', correct: true, feedback: 'Richtig. Websites können strenger sein als die Organisation.' },
          { id: 'b', text: 'Die Lizenz des Anwalts ist abgelaufen.', correct: false, feedback: 'Dann ginge es bei „Allgemein“ auch nicht.' },
        ],
      },
      {
        id: 's2', text: 'Im SharePoint Admin Center steht bei „Mandat Huber“: Externe Freigabe „Nur Personen in Ihrer Organisation“. Ist das ein Fehler?',
        options: [
          { id: 'a', text: 'Nicht unbedingt, das kann gewollt sein (vertrauliches Mandat). Muss der Kunde fachlich entscheiden.', correct: true, feedback: 'Genau. Nicht einfach öffnen, sondern Entscheidung beim Verantwortlichen.' },
          { id: 'b', text: 'Ja, sofort auf „Jeder“ stellen', correct: false, feedback: 'Jeder-Links sind anonym. Bei Mandatsdaten ein großes Risiko.' },
        ],
      },
      {
        id: 's3', text: 'Was empfiehlst du?',
        options: [
          { id: 'a', text: 'Klärung mit Websitebesitzer bzw. Datenschutz. Wenn freigegeben: Website auf „Neue und vorhandene Gäste“ und mit „Bestimmte Personen“ teilen, ggf. mit Ablaufdatum.', correct: true, feedback: 'Richtig. So eng wie möglich öffnen.' },
          { id: 'b', text: 'Das Dokument per privatem Mailkonto verschicken', correct: false, feedback: 'Umgeht alle Kontrollen und ist bei vertraulichen Daten ein Datenschutzverstoß.' },
        ],
      },
    ],
    explanation: '**Merke:** Externe Freigabe: Website ≤ Organisation. Vor dem Öffnen den fachlich Verantwortlichen fragen.',
    doc: {
      points: [
        { label: 'Ursache: Website strenger eingestellt', keywords: ['website', 'site', 'einstellung', 'nur personen in', 'strenger'] },
        { label: 'Entscheidung durch Verantwortliche klären', keywords: ['besitzer', 'datenschutz', 'klär', 'entscheid', 'freigabe durch'] },
        { label: 'Lösung: gezielt öffnen (bestimmte Personen, Ablauf)', keywords: ['bestimmte personen', 'gäste', 'gast', 'ablauf'] },
      ],
      model: '**Ursache:** Die Website „Mandat Huber“ erlaubt nur interne Freigaben. Organisationsweit ist externe Freigabe erlaubt, darum geht es bei „Allgemein“.\n\n**Vorgehen:** Bitte mit dem Websitebesitzer bzw. Datenschutz klären, ob externe Freigabe hier gewollt ist. Falls ja: Website auf „Neue und vorhandene Gäste“ stellen und nur mit „Bestimmte Personen“ und Ablaufdatum teilen.',
    },
  },
  {
    id: 'sd10', type: 'chain', difficulty: 1, priority: 2, lang: 'de', area: 'infra', learn: 'sup-01',
    title: 'Konto sperrt sich ständig',
    company: 'Alpenmetall AG', requester: 'Sandra Moser (Applikationsbetreuung)',
    prompt: 'Hallo,\n\nder Benutzer `jbauer` wird seit seiner Kennwortänderung gestern alle paar Minuten gesperrt. Euer Portal entsperrt ihn, kurz danach ist er wieder gesperrt.\n\nSandra',
    steps: [
      {
        id: 's1', text: 'Wo findest du, woher die Fehlversuche kommen?',
        options: [
          { id: 'a', text: 'Sicherheitsprotokoll des PDC-Emulators, Ereignis 4740, Feld „Aufrufername des Computers“', correct: true, feedback: 'Richtig. Dort steht, welcher Rechner die Sperre ausgelöst hat.' },
          { id: 'b', text: 'Im Anwendungsprotokoll des Fileservers', correct: false, feedback: 'Kontosperren protokolliert der DC, gesammelt beim PDC-Emulator.' },
        ],
      },
      {
        id: 's2', text: 'Ereignis 4740 zeigt als Aufrufer `NB-JBAUER-ALT`, sein altes Notebook im Schrank, das noch läuft. Ursache?',
        options: [
          { id: 'a', text: 'Auf dem alten Gerät versucht etwas (z. B. Laufwerk, Outlook, Dienst) weiter mit dem alten Kennwort anzumelden.', correct: true, feedback: 'Genau. Jeder Versuch zählt als Fehlversuch.' },
          { id: 'b', text: 'Ein Angreifer probiert Kennwörter.', correct: false, feedback: 'Möglich ist das immer, aber ein bekanntes eigenes Gerät nach Kennwortwechsel ist die naheliegende Erklärung.' },
        ],
      },
      {
        id: 's3', text: 'Lösung?',
        options: [
          { id: 'a', text: 'Altes Notebook abmelden bzw. ausschalten oder dort das neue Kennwort hinterlegen, Konto entsperren, beobachten', correct: true, feedback: 'Richtig. Quelle abstellen, dann entsperren.' },
          { id: 'b', text: 'Kontosperre in der Domäne abschalten', correct: false, feedback: 'Schwächt die Sicherheit für alle, um ein Einzelproblem zu verstecken.' },
        ],
      },
    ],
    explanation: '**Merke:** Wiederkehrende Sperren = irgendwo ist das alte Kennwort gespeichert. 4740 zeigt die Quelle.',
    doc: {
      points: [
        { label: 'Ursache: altes Gerät mit altem Kennwort', keywords: ['altes kennwort', 'alte kennwort', 'altes passwort', 'altes notebook', 'gespeichert'] },
        { label: 'Analyse: Ereignis 4740 / Aufrufer', keywords: ['4740', 'aufrufer', 'pdc', 'caller'] },
        { label: 'Lösung: Quelle abstellen, dann entsperren', keywords: ['ausschalt', 'abmeld', 'entsperr', 'neues kennwort'] },
      ],
      model: '**Analyse:** Ereignis 4740 auf dem PDC-Emulator zeigt als Quelle das alte Notebook `NB-JBAUER-ALT`.\n\n**Ursache:** Dort versucht ein Prozess sich weiter mit dem alten Kennwort anzumelden.\n\n**Lösung:** Gerät ausschalten bzw. abmelden, Konto entsperren, Sperren beobachten.',
    },
  },

  // ───────────── Fortgeschritten ─────────────
  {
    id: 'sd11', type: 'chain', difficulty: 2, priority: 3, lang: 'de', area: 'iam', learn: 'sup-05',
    title: 'Gruppenmitgliedschaft verschwindet über Nacht',
    company: 'Brenner Logistik GmbH', requester: 'Tobias Reiter (IT-Leitung)',
    prompt: 'Hallo,\n\nwir haben Frau Schuster gestern direkt im AD in `GG_Controlling` aufgenommen, weil es schnell gehen musste. Heute früh ist sie wieder draußen. Löscht euer Tool einfach Gruppen?\n\nTobias',
    steps: [
      {
        id: 's1', text: 'Wo schaust du zuerst?',
        options: [
          { id: 'a', text: 'Im IAM-Protokoll nach Änderungen an `GG_Controlling` heute Nacht', correct: true, feedback: 'Richtig. Das IAM protokolliert, was es geändert hat und warum.' },
          { id: 'b', text: 'In der AD-Replikation', correct: false, feedback: 'Replikation entfernt keine Mitglieder. Erst prüfen, ob jemand aktiv entfernt hat.' },
        ],
      },
      {
        id: 's2', text: 'Protokoll:\n```\n2026-11-04 03:00 Abgleich GG_Controlling  Abweichung: Mitglied cschuster ohne Zuweisung\n2026-11-04 03:00 Abgleich GG_Controlling  Mitglied cschuster entfernt (Richtlinie: korrigieren)\n```\nWas ist passiert?',
        options: [
          { id: 'a', text: 'Die Gruppe wird vom IAM verwaltet. Die direkte Änderung war eine Abweichung vom Soll und wurde korrigiert.', correct: true, feedback: 'Genau. Das System hat wie konfiguriert gearbeitet.' },
          { id: 'b', text: 'Ein Fehler im Konnektor hat zufällig Mitglieder gelöscht.', correct: false, feedback: 'Das Protokoll begründet die Entfernung eindeutig mit dem Abgleich.' },
        ],
      },
      {
        id: 's3', text: 'Was empfiehlst du?',
        options: [
          { id: 'a', text: 'Zugriff über Antrag/Rolle im IAM vergeben (ggf. mit Express-Genehmigung). Erklären, dass IAM-verwaltete Gruppen nicht direkt geändert werden sollen.', correct: true, feedback: 'Richtig. So bleibt das Recht und ist nachvollziehbar.' },
          { id: 'b', text: 'Abgleich für alle Gruppen abschalten', correct: false, feedback: 'Dann verliert der Kunde die Kontrolle über Abweichungen und die Audit-Sicherheit.' },
        ],
      },
    ],
    explanation: '**Merke:** In IAM-verwalteten Gruppen sind direkte Änderungen Abweichungen. Der Abgleich korrigiert oder meldet sie.',
    doc: {
      points: [
        { label: 'Ursache: Abgleich hat direkte Änderung korrigiert', keywords: ['abgleich', 'abweichung', 'reconcil', 'soll'] },
        { label: 'Lösung: Recht über IAM-Antrag/Rolle vergeben', keywords: ['antrag', 'rolle', 'über das iam', 'self-service', 'portal'] },
        { label: 'Hinweis: IAM-Gruppen nicht direkt ändern', keywords: ['nicht direkt', 'direkt im ad', 'am iam vorbei', ...PREV] },
      ],
      model: '**Ursache:** `GG_Controlling` wird vom IAM verwaltet. Der nächtliche Abgleich hat Frau Schuster als Mitglied ohne Zuweisung erkannt und gemäß Richtlinie entfernt.\n\n**Lösung:** Bitte den Zugriff über einen Antrag bzw. die passende Rolle im IAM vergeben. Dann bleibt er dauerhaft und ist dokumentiert.\n\n**Hinweis:** IAM-verwaltete Gruppen bitte nicht direkt im AD ändern.',
    },
  },
  {
    id: 'sd12', type: 'chain', difficulty: 2, priority: 1, lang: 'de', area: 'troubleshoot', learn: 'sup-01',
    title: 'AD-Konnektor meldet seit heute nur Fehler',
    company: 'Stadtwerke Talheim', requester: 'Martina Kogler (Systemadministration)',
    prompt: 'Dringend!\n\nSeit heute früh schlagen alle Aufträge an das AD fehl. Wir haben am Wochenende den alten Domänencontroller DC01 abgebaut und durch DC03 ersetzt.\n\nMartina',
    steps: [
      {
        id: 's1', text: 'Konnektor-Log:\n```\n07:00:02 ERROR LDAP bind to dc01.stadtwerke.local:636 failed: The server is not operational\n```\nWas ist die naheliegende Ursache?',
        options: [
          { id: 'a', text: 'Der Konnektor ist fest auf DC01 konfiguriert, den es nicht mehr gibt.', correct: true, feedback: 'Richtig. Das passt perfekt zum Abbau am Wochenende.' },
          { id: 'b', text: 'Das Dienstkonto des Konnektors ist gesperrt.', correct: false, feedback: 'Dann käme ein Anmeldefehler (LDAP 49), nicht „server is not operational“.' },
        ],
      },
      {
        id: 's2', text: 'Was ist die bessere Konfiguration statt eines festen DCs?',
        options: [
          { id: 'a', text: 'Den Domänennamen verwenden bzw. DC-Ermittlung über DNS, sofern das Produkt es unterstützt, sonst einen aktuellen DC plus Ausweich-DC', correct: true, feedback: 'Genau. Dann übersteht der Konnektor DC-Wechsel.' },
          { id: 'b', text: 'Die IP-Adresse von DC03 fest eintragen', correct: false, feedback: 'Löst das akute Problem, wiederholt aber denselben Fehler beim nächsten Wechsel.' },
        ],
      },
      {
        id: 's3', text: 'Nach der Änderung: `LDAPS certificate validation failed`. Was prüfst du?',
        options: [
          { id: 'a', text: 'Ob DC03 ein gültiges Zertifikat für LDAPS hat, dessen Name zum Verbindungsnamen passt und dem der Konnektor-Server vertraut', correct: true, feedback: 'Richtig. Neue DCs haben oft noch kein passendes Zertifikat.' },
          { id: 'b', text: 'Auf unverschlüsseltes LDAP (389) umstellen', correct: false, feedback: 'Dann gehen Kennwörter und Daten unverschlüsselt übers Netz. Nur als bewusst entschiedener Notfall.' },
        ],
      },
    ],
    explanation: '**Merke:** Nach Infrastrukturänderungen zuerst prüfen, was fest konfiguriert war. Bei LDAPS gehört das Zertifikat zum DC-Tausch dazu.',
    doc: {
      points: [
        { label: 'Ursache: Konnektor fest auf abgebauten DC01', keywords: ['dc01', 'fest', 'abgebaut', 'alter dc', 'alten dc'] },
        { label: 'Lösung: Domänenname/DC-Ermittlung + LDAPS-Zertifikat auf DC03', keywords: ['domänenname', 'dns', 'dc03', 'zertifikat', 'ldaps'] },
        { label: 'Prävention: Checkliste für DC-Wechsel', keywords: PREV },
      ],
      model: '**Ursache:** Der AD-Konnektor war fest auf `dc01.stadtwerke.local` konfiguriert. Nach dem Abbau von DC01 ist keine Verbindung mehr möglich.\n\n**Lösung:** Verbindung auf den Domänennamen bzw. DC-Ermittlung umgestellt. Auf DC03 fehlte ein LDAPS-Zertifikat, Kunde hat es ausgestellt. Danach laufen die Aufträge wieder, Rückstau abgearbeitet.\n\n**Prävention:** IAM-Konnektoren in die Checkliste für DC-Wechsel aufnehmen.',
    },
  },
  {
    id: 'sd13', type: 'chain', difficulty: 2, priority: 3, lang: 'en', area: 'perm', learn: 'sup-02',
    title: 'User with "Modify" cannot save files',
    company: 'Brightfield Insurance', requester: 'Priya Natarajan (Infrastructure)',
    prompt: 'Hello,\n\nuser *tlee* has Modify on `\\\\fs02\\Claims` through the role "Claims Handler". He can open files but cannot save. Share permissions: Authenticated Users – Change.\n\nRegards, Priya',
    steps: [
      {
        id: 's1', text: 'What do you check?',
        options: [
          { id: 'a', text: 'All groups of tlee (including nested) and all NTFS entries, especially Deny entries', correct: true, feedback: 'Correct. Effective access is the sum of all groups minus Deny.' },
          { id: 'b', text: 'Only the role "Claims Handler"', correct: false, feedback: 'The role looks right. Something else must be limiting him.' },
        ],
      },
      {
        id: 's2', text: 'tlee is also in `GG_Trainees`. NTFS shows: `GG_Trainees: Deny Write (OI)(CI)`. Effective result?',
        options: [
          { id: 'a', text: 'Read yes, write no. The explicit Deny beats the Allow from the other group.', correct: true, feedback: 'Exactly. That is the symptom.' },
          { id: 'b', text: 'Modify, because Allow always wins.', correct: false, feedback: 'At the same level, Deny wins over Allow.' },
        ],
      },
      {
        id: 's3', text: 'tlee finished his traineeship last month. What is the clean fix?',
        options: [
          { id: 'a', text: 'Remove tlee from GG_Trainees through the IAM (mover process), ask him to log off and on, verify', correct: true, feedback: 'Correct. The real error is the leftover trainee membership.' },
          { id: 'b', text: 'Remove the Deny entry for all trainees', correct: false, feedback: 'That changes the rules for real trainees. The problem is tlee being in the wrong group.' },
        ],
      },
    ],
    explanation: '**Remember:** "Can read, cannot write" with correct Allow → look for Deny and leftover groups.',
    doc: {
      points: [
        { label: 'Root cause: Deny Write via GG_Trainees', keywords: ['deny', 'trainee', 'gg_trainees'] },
        { label: 'Solution: remove leftover membership (mover)', keywords: ['remove', 'mover', 'membership', 'leftover'] },
        { label: 'Verification after new logon', keywords: ['log off', 'logoff', 'log on', 'verify', 'test', 'confirm'] },
      ],
      model: '**Root cause:** tlee is still a member of `GG_Trainees`, which has an explicit Deny Write. Deny overrides the Modify permission from the role.\n\n**Solution:** Remove tlee from `GG_Trainees` via the IAM mover process. After a new logon he can save files.\n\n**Recommendation:** Check whether the trainee role is removed automatically when the position changes in HR.',
    },
  },
  {
    id: 'sd14', type: 'chain', difficulty: 2, priority: 3, lang: 'de', area: 'scripting', learn: 'sup-07',
    title: 'Auswertung: Ausgetretene mit aktiven Gruppen',
    company: 'Alpenmetall AG', requester: 'Sandra Moser (Applikationsbetreuung)',
    prompt: 'Hallo,\n\nunsere Revision möchte eine Liste aller Personen, die laut HR ausgetreten sind, aber in der IAM-Datenbank noch Gruppenmitgliedschaften haben. Könnt ihr uns eine Abfrage geben? Tabellen laut Doku: `Persons (Id, Name, Status)`, `Accounts (Id, PersonId)`, `Memberships (AccountId, GroupId)`.\n\nSandra',
    steps: [
      {
        id: 's1', text: 'Mit welchem Konto sollte der Kunde die Abfrage ausführen?',
        options: [
          { id: 'a', text: 'Mit einem nur lesenden Konto (z. B. Rolle db_datareader)', correct: true, feedback: 'Richtig. Für Auswertungen reicht Lesen.' },
          { id: 'b', text: 'Mit dem Dienstkonto des IAM-Systems, das hat ja alle Rechte', correct: false, feedback: 'Genau deshalb nicht. Ein Tippfehler könnte die Produktdaten verändern.' },
        ],
      },
      {
        id: 's2', text: 'Welche Abfrage passt?',
        options: [
          { id: 'a', text: '```\nSELECT DISTINCT p.Name\nFROM Persons p\nJOIN Accounts a ON a.PersonId = p.Id\nJOIN Memberships m ON m.AccountId = a.Id\nWHERE p.Status = \'Ausgetreten\';\n```', correct: true, feedback: 'Richtig. INNER JOIN liefert nur Personen, die tatsächlich Mitgliedschaften haben.' },
          { id: 'b', text: '```\nSELECT p.Name FROM Persons p\nLEFT JOIN Accounts a ON a.PersonId = p.Id\nWHERE p.Status = \'Ausgetreten\';\n```', correct: false, feedback: 'Das listet alle Ausgetretenen, auch ohne Konto oder Mitgliedschaft.' },
        ],
      },
      {
        id: 's3', text: 'Ergebnis: 14 Personen. Was ist der nächste sinnvolle Schritt?',
        options: [
          { id: 'a', text: 'Prüfen, warum der Leaver-Prozess bei diesen 14 nicht gegriffen hat (z. B. Austritt nachträglich erfasst, Fehler im Protokoll), und Entzug über das IAM nachholen', correct: true, feedback: 'Richtig. Liste ist der Anfang, die Ursache ist das Ziel.' },
          { id: 'b', text: 'Die Zeilen per DELETE aus Memberships entfernen', correct: false, feedback: 'Direktes Löschen in der Produktdatenbank entfernt die Rechte nicht im AD und zerstört die Nachvollziehbarkeit.' },
        ],
      },
    ],
    explanation: '**Merke:** Lesen mit Lesekonto, ändern nur über die Anwendung. Auffällige Ergebnisse sind ein Startpunkt für die Ursachenanalyse.',
    doc: {
      points: [
        { label: 'Abfrage mit JOIN und Status-Filter', keywords: ['join', 'select', 'ausgetreten', 'where'] },
        { label: 'Nur lesendes Konto', keywords: ['lesend', 'datareader', 'read-only', 'nur lesen', 'leserecht'] },
        { label: 'Nächster Schritt: Ursache Leaver-Prozess, Entzug über IAM', keywords: ['leaver', 'ursache', 'entzug', 'über das iam', 'nachholen'] },
      ],
      model: '**Abfrage** (bitte mit einem nur lesenden Konto, z. B. db_datareader):\n```\nSELECT DISTINCT p.Name\nFROM Persons p\nJOIN Accounts a ON a.PersonId = p.Id\nJOIN Memberships m ON m.AccountId = a.Id\nWHERE p.Status = \'Ausgetreten\';\n```\n**Nächster Schritt:** Für die gefundenen Personen prüfen wir gemeinsam, warum der Leaver-Prozess nicht gegriffen hat. Der Entzug erfolgt über das IAM, nicht per SQL.',
    },
  },
  {
    id: 'sd15', type: 'chain', difficulty: 2, priority: 2, lang: 'de', area: 'troubleshoot', learn: 'sup-08',
    title: 'HR-Import läuft seit drei Nächten nicht durch',
    company: 'Kanzlei Rauch & Partner', requester: 'Daniel Rauch (IT)',
    prompt: 'Hallo,\n\nseit Montag werden keine neuen Mitarbeiter mehr angelegt. Im Dashboard steht beim HR-Import „Fehlgeschlagen“. Wir haben nichts geändert.\n\nDaniel',
    steps: [
      {
        id: 's1', text: 'Was forderst du an?',
        options: [
          { id: 'a', text: 'Das Import-Log der letzten Nacht und die Importdatei (bzw. den betroffenen Ausschnitt)', correct: true, feedback: 'Richtig. Gezielt anfordern: welches Log, welcher Zeitraum.' },
          { id: 'b', text: 'Einen Screenshot vom Dashboard', correct: false, feedback: 'Den Status kennst du schon. Du brauchst die Details.' },
        ],
      },
      {
        id: 's2', text: 'Log:\n```\n02:00:01 INFO  Import gestartet, 412 Datensätze\n02:00:03 ERROR Zeile 287: Feld Eintrittsdatum \'31.02.2026\' ungültig\n02:00:03 ERROR Import abgebrochen, keine Änderungen übernommen\n```\nUrsache?',
        options: [
          { id: 'a', text: 'Ein ungültiges Datum in der HR-Datei bricht den ganzen Import ab.', correct: true, feedback: 'Genau. Der erste Fehler erklärt alles.' },
          { id: 'b', text: 'Die Datenbank ist voll.', correct: false, feedback: 'Davon steht nichts im Log. Der Abbruch folgt direkt auf den Datumsfehler.' },
        ],
      },
      {
        id: 's3', text: 'Was ist die richtige Lösung?',
        options: [
          { id: 'a', text: 'HR korrigiert den Datensatz im Quellsystem, Import neu starten. Zusätzlich mit dem Kunden besprechen, ob fehlerhafte Zeilen künftig übersprungen und gemeldet werden sollen (falls konfigurierbar).', correct: true, feedback: 'Richtig. Quelle korrigieren und Robustheit prüfen.' },
          { id: 'b', text: 'Die Datei selbst ändern und importieren', correct: false, feedback: 'Dann weicht das IAM von HR ab, und morgen kommt der Fehler mit der nächsten Datei wieder.' },
        ],
      },
    ],
    explanation: '**Merke:** „Wir haben nichts geändert“ heißt oft: in den Daten hat sich etwas geändert. Den ersten Fehler im Log suchen.',
    doc: {
      points: [
        { label: 'Ursache: ungültiges Datum in Zeile 287', keywords: ['31.02', 'datum', 'zeile 287', 'ungültig'] },
        { label: 'Lösung: an der Quelle (HR) korrigieren, Import neu starten', keywords: ['hr', 'korrig', 'neu start', 'erneut'] },
        { label: 'Prävention: Validierung/Fehlerzeilen überspringen', keywords: ['überspring', 'validier', 'plausib', ...PREV] },
      ],
      model: '**Ursache:** In der HR-Datei steht in Zeile 287 das ungültige Eintrittsdatum 31.02.2026. Der Import bricht dadurch komplett ab.\n\n**Lösung:** Datensatz im HR-System korrigieren und Import neu starten.\n\n**Prävention:** Plausibilitätsprüfung im HR-System bzw. Import so konfigurieren, dass fehlerhafte Zeilen gemeldet und übersprungen werden.',
    },
  },
  {
    id: 'sd16', type: 'chain', difficulty: 2, priority: 3, lang: 'en', area: 'infra', learn: 'sup-03',
    title: 'Approval emails never arrive',
    company: 'Halvorsen Shipping AS', requester: 'Ingrid Dahl (IT Operations)',
    prompt: 'Hi,\n\nsince Tuesday, managers no longer receive the approval emails from the IAM system. The IAM log says "Mail sent successfully". We use Exchange Online.\n\nBR, Ingrid',
    steps: [
      {
        id: 's1', text: 'What is the best tool to see what happened to these emails?',
        options: [
          { id: 'a', text: 'Message trace in the Exchange admin center (or `Get-MessageTraceV2`) filtered by the IAM sender address', correct: true, feedback: 'Correct. It shows the delivery status of each message.' },
          { id: 'b', text: 'Ask managers to check their deleted items', correct: false, feedback: 'Possible later, but message trace answers it for all recipients at once.' },
        ],
      },
      {
        id: 's2', text: 'Message trace shows status **Quarantined**, reason: high confidence phish. What happened?',
        options: [
          { id: 'a', text: 'Exchange Online Protection classifies the approval mails as phishing (e.g. because of links and an unauthenticated sender).', correct: true, feedback: 'Exactly. The mails never reached the inbox.' },
          { id: 'b', text: 'The IAM system did not send them.', correct: false, feedback: 'The message trace proves Exchange received them.' },
        ],
      },
      {
        id: 's3', text: 'What do you recommend?',
        options: [
          { id: 'a', text: 'Release the messages, then make sure the IAM sends through an authenticated, SPF/DKIM-aligned route and review the filter result with the customer’s mail admin instead of disabling protection', correct: true, feedback: 'Correct. Fix authentication, do not weaken security.' },
          { id: 'b', text: 'Turn off anti-phishing for the whole tenant', correct: false, feedback: 'That exposes all users to real phishing.' },
        ],
      },
    ],
    explanation: '**Remember:** "Sent" in the application log does not mean "delivered". Message trace shows the truth.',
    doc: {
      points: [
        { label: 'Root cause: mails quarantined as phishing', keywords: ['quarantin', 'phish', 'filter', 'spam'] },
        { label: 'Analysis: message trace', keywords: ['message trace', 'messagetrace', 'trace'] },
        { label: 'Solution: release + authenticated sending (SPF/DKIM)', keywords: ['release', 'spf', 'dkim', 'authenticat'] },
      ],
      model: '**Analysis:** Message trace shows the approval emails as Quarantined (high confidence phish).\n\n**Root cause:** The IAM system sends from an address that is not authenticated for the domain, combined with links, so EOP classifies the mails as phishing.\n\n**Solution:** Release the quarantined messages. Configure the IAM to send through an authenticated connector or account so that SPF and DKIM align. Do not disable anti-phishing.',
    },
  },
  {
    id: 'sd17', type: 'chain', difficulty: 2, priority: 3, lang: 'de', area: 'perm', learn: 'sup-04',
    title: 'Neues Teammitglied sieht Dateien eines Kanals nicht',
    company: 'Brenner Logistik GmbH', requester: 'Tobias Reiter (IT-Leitung)',
    prompt: 'Hallo,\n\nHerr Wolf wurde über das IAM ins Team „Disposition“ aufgenommen. Die Standardkanäle sieht er, den Kanal „Tarifverhandlung“ nicht. Kollegen sehen ihn.\n\nTobias',
    steps: [
      {
        id: 's1', text: 'Welche Vermutung liegt nahe?',
        options: [
          { id: 'a', text: '„Tarifverhandlung“ ist ein privater Kanal mit eigener Mitgliedschaft.', correct: true, feedback: 'Richtig. Private Kanäle haben eigene Mitglieder und eine eigene Website.' },
          { id: 'b', text: 'Herr Wolf hat keine Teams-Lizenz.', correct: false, feedback: 'Dann sähe er das Team gar nicht.' },
        ],
      },
      {
        id: 's2', text: 'Bestätigt: privater Kanal. Was folgt daraus für das IAM?',
        options: [
          { id: 'a', text: 'Die Teammitgliedschaft reicht nicht. Der private Kanal braucht eine eigene Zuweisung durch einen Kanalbesitzer bzw. eine eigene Berechtigung im IAM.', correct: true, feedback: 'Genau.' },
          { id: 'b', text: 'Das IAM hat einen Fehler gemacht.', correct: false, feedback: 'Das IAM hat das Team korrekt zugewiesen. Private Kanäle sind gewollt getrennt.' },
        ],
      },
      {
        id: 's3', text: 'Empfehlung?',
        options: [
          { id: 'a', text: 'Kanalbesitzer entscheidet über Aufnahme. Falls gewünscht, privaten Kanal als eigene beantragbare Berechtigung im IAM abbilden.', correct: true, feedback: 'Richtig. Fachliche Entscheidung beim Besitzer.' },
          { id: 'b', text: 'Alle privaten Kanäle in Standardkanäle umwandeln', correct: false, feedback: 'Private Kanäle sind bewusst vertraulich, hier offensichtlich (Tarifverhandlung).' },
        ],
      },
    ],
    explanation: '**Merke:** Private und freigegebene Kanäle haben eigene Mitgliedschaft und eigene SharePoint-Websites.',
    doc: {
      points: [
        { label: 'Ursache: privater Kanal mit eigener Mitgliedschaft', keywords: ['privat', 'eigene mitglied', 'kanal'] },
        { label: 'Entscheidung durch Kanalbesitzer', keywords: ['besitzer', 'owner', 'entscheid'] },
        { label: 'Option: eigene Berechtigung im IAM', keywords: ['iam', 'beantrag', 'berechtigung', 'rolle'] },
      ],
      model: '**Ursache:** „Tarifverhandlung“ ist ein privater Kanal. Er hat eine eigene Mitgliedschaft und eigene Website, die Teammitgliedschaft reicht nicht.\n\n**Lösung:** Der Kanalbesitzer entscheidet über die Aufnahme. Auf Wunsch bilden wir den privaten Kanal als eigene beantragbare Berechtigung im IAM ab.',
    },
  },
  {
    id: 'sd18', type: 'chain', difficulty: 2, priority: 3, lang: 'de', area: 'iam', learn: 'sup-05',
    title: 'Revision kritisiert Rezertifizierung',
    company: 'Stadtwerke Talheim', requester: 'Dr. Eva Lindner (Informationssicherheit)',
    prompt: 'Guten Tag,\n\nunsere Revision bemängelt, dass bei der letzten Rezertifizierung 99,6 % aller Rechte bestätigt wurden, viele Kampagnen in unter einer Minute. Was können wir am Produkt ändern?\n\nMit freundlichen Grüßen\nEva Lindner',
    steps: [
      {
        id: 's1', text: 'Was ist das eigentliche Problem?',
        options: [
          { id: 'a', text: 'Prüfer „nicken ab“, die Kontrolle ist wirkungslos.', correct: true, feedback: 'Richtig. Das ist ein Prozess- und Gestaltungsproblem, kein Produktfehler.' },
          { id: 'b', text: 'Das Produkt bestätigt Rechte automatisch.', correct: false, feedback: 'Laut Protokoll haben Menschen geklickt, nur sehr schnell.' },
        ],
      },
      {
        id: 's2', text: 'Kampagnen hatten bis zu 900 Einträge pro Prüfer. Was hilft am meisten?',
        options: [
          { id: 'a', text: 'Kleinere Kampagnen (z. B. nach Datenbereich), Kontext anzeigen (letzte Nutzung, wer genehmigt hat), riskante Rechte hervorheben', correct: true, feedback: 'Genau. Prüfer brauchen machbare Mengen und Entscheidungshilfen.' },
          { id: 'b', text: 'Prüfern mehr Einträge geben, damit es schneller geht', correct: false, feedback: 'Mehr Einträge verstärken das Abnicken.' },
        ],
      },
      {
        id: 's3', text: 'Was gehört noch in die Antwort?',
        options: [
          { id: 'a', text: 'Vorschlag für Schulung der Prüfer und Kennzahlen (z. B. Entzugsquote, Bearbeitungszeit) für die nächste Kampagne', correct: true, feedback: 'Richtig. Messbar machen, ob es besser wird.' },
          { id: 'b', text: 'Rezertifizierung abschaffen', correct: false, feedback: 'Wird von ISO 27001 und Revision erwartet. Verbessern statt abschaffen.' },
        ],
      },
    ],
    explanation: '**Merke:** Rezertifizierung wirkt nur, wenn Prüfer verstehen, was sie bestätigen, und die Menge machbar ist.',
    doc: {
      points: [
        { label: 'Problem: Abnicken / Kontrolle wirkungslos', keywords: ['abnick', 'durchklick', 'rubber', 'wirkungslos', 'bestätigt'] },
        { label: 'Maßnahme: kleinere Kampagnen mit Kontext', keywords: ['kleiner', 'kontext', 'letzte nutzung', 'aufteil'] },
        { label: 'Schulung und Kennzahlen', keywords: ['schulung', 'kennzahl', 'entzugsquote', 'messen'] },
      ],
      model: '**Bewertung:** 99,6 % Bestätigungen in sehr kurzer Zeit deuten auf Abnicken hin. Das Produkt funktioniert, die Kampagnen sind zu groß.\n\n**Maßnahmen:** Kampagnen nach Datenbereichen aufteilen (max. ca. 50 Einträge pro Prüfer), letzte Nutzung und Genehmiger anzeigen, riskante Rechte hervorheben.\n\n**Begleitend:** Kurze Schulung der Prüfer, Kennzahlen (Entzugsquote, Bearbeitungszeit) für die nächste Kampagne festlegen.',
    },
  },
  {
    id: 'sd19', type: 'chain', difficulty: 2, priority: 3, lang: 'de', area: 'scripting', learn: 'sup-06',
    title: 'Skript meldet Erfolg, aber nichts passiert',
    company: 'Alpenmetall AG', requester: 'Sandra Moser (Applikationsbetreuung)',
    prompt: 'Hallo,\n\nunser Begleitskript zum IAM soll Benutzer aus einer CSV in Gruppen aufnehmen:\n```\nforeach ($z in Import-Csv neu.csv) {\n  try { Add-ADGroupMember $z.Gruppe -Members $z.Sam; "OK $($z.Sam)" }\n  catch { "FEHLER $($z.Sam)" }\n}\n```\nAlle Zeilen sagen „OK“, aber einige Benutzer fehlen in den Gruppen.\n\nSandra',
    steps: [
      {
        id: 's1', text: 'Warum steht trotz Fehler „OK“?',
        options: [
          { id: 'a', text: 'Der Fehler ist nicht beendend, catch greift nicht, die nächste Zeile läuft weiter.', correct: true, feedback: 'Richtig. Ohne `-ErrorAction Stop` läuft das Skript einfach weiter.' },
          { id: 'b', text: 'Add-ADGroupMember meldet nie Fehler.', correct: false, feedback: 'Doch, rot in der Konsole. Nur fängt catch sie hier nicht.' },
        ],
      },
      {
        id: 's2', text: 'Mit `-ErrorAction Stop` und `$_.Exception.Message` im catch: `Cannot find an object with identity: \'mmüller\'`. In der CSV steht `mmÃ¼ller`. Ursache?',
        options: [
          { id: 'a', text: 'Die CSV wird mit falscher Kodierung gelesen, Umlaute kommen verstümmelt an.', correct: true, feedback: 'Genau. Import-Csv mit passendem `-Encoding` lesen.' },
          { id: 'b', text: 'Der Benutzer existiert nicht.', correct: false, feedback: 'Er existiert als mmüller. Der Name kommt nur falsch an.' },
        ],
      },
      {
        id: 's3', text: 'Was baust du ein?',
        options: [
          { id: 'a', text: '`-ErrorAction Stop`, Fehlermeldung im catch ausgeben, `Import-Csv -Encoding UTF8` (passend zur Datei), Protokoll pro Zeile, vorher Testlauf', correct: true, feedback: 'Richtig. Jetzt sieht man jeden Fehler und die Umlaute stimmen.' },
          { id: 'b', text: 'Umlaute in Benutzernamen verbieten', correct: false, feedback: 'Löst das Kodierungsproblem nicht und betrifft bestehende Konten.' },
        ],
      },
    ],
    explanation: '**Merke:** try/catch nur mit `-ErrorAction Stop`. Umlaute: Kodierung beim Lesen und Schreiben prüfen.',
    doc: {
      points: [
        { label: 'Ursache 1: nicht beendender Fehler, catch greift nicht', keywords: ['erroraction', 'nicht beendend', 'catch', 'stop'] },
        { label: 'Ursache 2: Kodierung der CSV (Umlaute)', keywords: ['kodierung', 'encoding', 'utf', 'umlaut'] },
        { label: 'Lösung: -ErrorAction Stop, -Encoding, Protokoll', keywords: ['-erroraction stop', '-encoding', 'protokoll', 'log'] },
      ],
      model: '**Ursache:** 1) `Add-ADGroupMember` wirft ohne `-ErrorAction Stop` keinen beendenden Fehler, darum greift catch nie. 2) Die CSV wird mit falscher Kodierung gelesen, Namen mit Umlauten werden nicht gefunden.\n\n**Lösung:** `-ErrorAction Stop` ergänzen, im catch `$_.Exception.Message` protokollieren, `Import-Csv neu.csv -Encoding UTF8` (passend zur Datei) verwenden, Ergebnis pro Zeile protokollieren.',
    },
  },
  {
    id: 'sd20', type: 'chain', difficulty: 2, priority: 3, lang: 'en', area: 'troubleshoot', learn: 'sup-02',
    title: 'Permissions not applied on some folders',
    company: 'Brightfield Insurance', requester: 'Priya Natarajan (Infrastructure)',
    prompt: 'Hello,\n\nthe file server connector applies permissions to most project folders, but about 40 folders always fail. No pattern visible to us.\n\nRegards, Priya',
    steps: [
      {
        id: 's1', text: 'What do you request?',
        options: [
          { id: 'a', text: 'The connector log for one failing run and the full paths of a few failing folders', correct: true, feedback: 'Correct. Specific log and examples.' },
          { id: 'b', text: 'Remote access to all servers for a week', correct: false, feedback: 'Too broad. Start with the log and examples.' },
        ],
      },
      {
        id: 's2', text: 'Log:\n```\nERROR SetAcl D:\\Projects\\2019_Long-Term-Infrastructure-Modernisation-Programme\\…\\Final_Approved_Versions failed: The filename or extension is too long\n```\nAll failing paths are longer than 260 characters. Root cause?',
        options: [
          { id: 'a', text: 'Paths exceed the classic 260-character limit (MAX_PATH).', correct: true, feedback: 'Exactly. The pattern is the path length.' },
          { id: 'b', text: 'The folders are corrupted.', correct: false, feedback: 'The error message and the pattern point to path length, not corruption.' },
        ],
      },
      {
        id: 's3', text: 'Next steps?',
        options: [
          { id: 'a', text: 'Workaround: shorten folder structure or names with the data owners. Check whether the product version supports long paths; if it should, escalate to 3rd level with log and examples.', correct: true, feedback: 'Correct. Workaround for the customer, clarification for the product.' },
          { id: 'b', text: 'Grant Everyone full control on the parent folder', correct: false, feedback: 'Does not fix the error and violates least privilege massively.' },
        ],
      },
    ],
    explanation: '**Remember:** "No pattern visible" → compare failing and working cases. Here: path length.',
    doc: {
      points: [
        { label: 'Root cause: paths longer than 260 characters', keywords: ['260', 'path length', 'too long', 'long path', 'max_path'] },
        { label: 'Workaround: shorten paths', keywords: ['shorten', 'rename', 'flatten', 'restructure'] },
        { label: 'Escalation / product check', keywords: ['escalat', '3rd level', 'development', 'product version', 'long path support'] },
      ],
      model: '**Root cause:** All 40 failing folders have paths longer than 260 characters. The connector fails with "The filename or extension is too long".\n\n**Workaround:** Together with the data owners, shorten the folder structure or names.\n\n**Next step:** We are checking whether your product version supports long paths and have escalated the case to our 3rd level with the log and examples.',
    },
  },
  {
    id: 'sd21', type: 'chain', difficulty: 2, priority: 2, lang: 'en', area: 'infra', learn: 'sup-01',
    title: 'Connector server: Kerberos errors after reboot',
    company: 'Clearwater Dental Group', requester: 'Sam Okafor (IT Contractor)',
    prompt: 'Hi,\n\nafter patching and rebooting the IAM server last night, all AD jobs fail. Other servers are fine.\n\nSam',
    steps: [
      {
        id: 's1', text: 'Log:\n```\nERROR Kerberos authentication failed: KRB_AP_ERR_SKEW\n```\nWhat does this mean?',
        options: [
          { id: 'a', text: 'The clock of the IAM server differs too much from the domain controller (default tolerance 5 minutes).', correct: true, feedback: 'Correct. Kerberos tickets contain timestamps.' },
          { id: 'b', text: 'The service account password is wrong.', correct: false, feedback: 'That would give a different error. SKEW means time difference.' },
        ],
      },
      {
        id: 's2', text: '`w32tm /query /status` on the IAM server shows source "Local CMOS Clock", time is 9 minutes off. Why?',
        options: [
          { id: 'a', text: 'The server does not sync time from the domain hierarchy (e.g. wrong time configuration after patching or VM time settings).', correct: true, feedback: 'Exactly. Domain members should sync from the domain hierarchy.' },
          { id: 'b', text: 'The DC is 9 minutes wrong.', correct: false, feedback: 'Other servers work fine, so the DC time is most likely correct.' },
        ],
      },
      {
        id: 's3', text: 'Fix?',
        options: [
          { id: 'a', text: 'Set the server back to domain hierarchy sync (`w32tm /config /syncfromflags:domhier /update`, restart the time service, `w32tm /resync`), verify, rerun jobs', correct: true, feedback: 'Correct. Then check the VM host time settings too.' },
          { id: 'b', text: 'Increase the Kerberos tolerance to 30 minutes', correct: false, feedback: 'That weakens replay protection for the whole domain instead of fixing one server.' },
        ],
      },
    ],
    explanation: '**Remember:** KRB_AP_ERR_SKEW = time. Domain members sync from the domain hierarchy, the PDC emulator syncs from an external source.',
    doc: {
      points: [
        { label: 'Root cause: time difference (clock skew)', keywords: ['skew', 'time', 'clock', '9 minutes'] },
        { label: 'Solution: domain hierarchy time sync', keywords: ['w32tm', 'domhier', 'resync', 'time sync'] },
        { label: 'Prevention / monitoring', keywords: PREV_EN },
      ],
      model: '**Root cause:** After patching, the IAM server used its local clock and was 9 minutes off. Kerberos rejects tickets with more than 5 minutes difference (KRB_AP_ERR_SKEW).\n\n**Solution:** Time sync reset to the domain hierarchy (`w32tm /config /syncfromflags:domhier /update`, `w32tm /resync`). Jobs run again.\n\n**Prevention:** Check VM time settings and monitor time offset on the IAM server.',
    },
  },
  {
    id: 'sd22', type: 'chain', difficulty: 2, priority: 3, lang: 'de', area: 'scripting', learn: 'sup-07',
    title: 'Bericht: Wer hat Zugriff auf die Finanzgruppe, je Abteilung?',
    company: 'Brenner Logistik GmbH', requester: 'Tobias Reiter (IT-Leitung)',
    prompt: 'Hallo,\n\nfür ein Audit brauche ich: Wie viele Personen pro Abteilung sind Mitglied in `GG_Finanzen`? Tabellen: `Users (Id, Name, Department)`, `Groups (Id, Name)`, `Memberships (UserId, GroupId)`.\n\nTobias',
    steps: [
      {
        id: 's1', text: 'Welche Bausteine brauchst du?',
        options: [
          { id: 'a', text: 'JOIN über alle drei Tabellen, WHERE auf den Gruppennamen, GROUP BY Department, COUNT', correct: true, feedback: 'Richtig.' },
          { id: 'b', text: 'Nur `SELECT * FROM Users`', correct: false, feedback: 'Damit fehlt die Verbindung zur Gruppe, und es wird nichts gezählt.' },
        ],
      },
      {
        id: 's2', text: 'Welche Abfrage ist korrekt?',
        options: [
          { id: 'a', text: '```\nSELECT u.Department, COUNT(*) AS Anzahl\nFROM Users u\nJOIN Memberships m ON m.UserId = u.Id\nJOIN Groups g ON g.Id = m.GroupId\nWHERE g.Name = \'GG_Finanzen\'\nGROUP BY u.Department;\n```', correct: true, feedback: 'Richtig.' },
          { id: 'b', text: '```\nSELECT u.Department, COUNT(*)\nFROM Users u JOIN Memberships m ON m.UserId = u.Id\nWHERE COUNT(*) > 0;\n```', correct: false, feedback: 'Aggregate gehören nicht ins WHERE, und der Gruppenfilter fehlt.' },
        ],
      },
      {
        id: 's3', text: 'Im Ergebnis steht eine Zeile `NULL | 7`. Was bedeutet das?',
        options: [
          { id: 'a', text: '7 Mitglieder haben keine Abteilung gepflegt. Das ist selbst ein Befund für den Kunden (Datenqualität).', correct: true, feedback: 'Genau. GROUP BY fasst alle NULL-Werte zu einer Gruppe zusammen.' },
          { id: 'b', text: 'Ein Fehler in der Abfrage', correct: false, feedback: 'Die Abfrage ist korrekt. NULL zeigt fehlende Daten.' },
        ],
      },
    ],
    explanation: '**Merke:** NULL in Berichten ist meist ein Datenqualitätsthema und gehört in die Antwort.',
    doc: {
      points: [
        { label: 'Abfrage mit JOIN, WHERE, GROUP BY, COUNT', keywords: ['group by', 'count', 'join'] },
        { label: 'Hinweis: NULL = fehlende Abteilung', keywords: ['null', 'keine abteilung', 'fehlende abteilung', 'nicht gepflegt'] },
        { label: 'Empfehlung: Datenqualität im HR prüfen', keywords: ['datenqualität', 'hr', 'pflegen', 'nachpflegen'] },
      ],
      model: '**Abfrage:**\n```\nSELECT u.Department, COUNT(*) AS Anzahl\nFROM Users u\nJOIN Memberships m ON m.UserId = u.Id\nJOIN Groups g ON g.Id = m.GroupId\nWHERE g.Name = \'GG_Finanzen\'\nGROUP BY u.Department;\n```\n**Hinweis:** Die Zeile „NULL“ sind 7 Mitglieder ohne gepflegte Abteilung. Bitte im HR-System nachpflegen, sonst greifen abteilungsbasierte Rollen bei ihnen nicht.',
    },
  },

  // ───────────── Profi ─────────────
  {
    id: 'sd23', type: 'chain', difficulty: 3, priority: 1, lang: 'de', area: 'troubleshoot', learn: 'sup-08',
    title: 'Austritte werden seit zwei Wochen nicht verarbeitet',
    company: 'Stadtwerke Talheim', requester: 'Dr. Eva Lindner (Informationssicherheit)',
    prompt: 'Dringend!\n\nBei einer Stichprobe ist aufgefallen, dass 9 ausgetretene Mitarbeiter noch aktive AD-Konten haben. Im HR stehen die Austritte korrekt. Im IAM-Dashboard ist alles grün.\n\nEva Lindner',
    steps: [
      {
        id: 's1', text: 'Was prüfst du zuerst?',
        options: [
          { id: 'a', text: 'Das IAM-Protokoll zu einem der 9 Leaver: Wurde der Austritt importiert, und was passierte beim Deaktivieren?', correct: true, feedback: 'Richtig. Einen konkreten Fall durchverfolgen.' },
          { id: 'b', text: 'Die 9 Konten sofort löschen', correct: false, feedback: 'Deaktivieren ja (Sofortmaßnahme mit dem Kunden), aber Löschen vernichtet Daten und Beweise.' },
        ],
      },
      {
        id: 's2', text: 'Protokoll:\n```\n2026-10-22 06:00 Leaver  hmayr   Deaktivierung angefordert\n2026-10-22 06:00 AD-Con  hmayr   LDAP 49: 80090308: LdapErr: DSID-0C09044E, comment: AcceptSecurityContext error, data 532\n2026-10-22 06:00 Leaver  hmayr   Auftrag in Warteschlange (Wiederholung)\n```\nWas bedeutet `data 532`?',
        options: [
          { id: 'a', text: 'Das Kennwort des Konnektor-Dienstkontos ist abgelaufen.', correct: true, feedback: 'Genau. LDAP 49 mit data 532 = password expired.' },
          { id: 'b', text: 'Der Benutzer hmayr existiert nicht.', correct: false, feedback: 'Das wäre data 525. Hier scheitert schon die Anmeldung des Dienstkontos.' },
        ],
      },
      {
        id: 's3', text: 'Warum war das Dashboard grün?',
        options: [
          { id: 'a', text: 'Die Aufträge standen nur in der Wiederholungs-Warteschlange und galten nicht als „fehlgeschlagen“. Monitoring auf Warteschlangenalter fehlt.', correct: true, feedback: 'Richtig. Das ist der zweite Befund: Überwachungslücke.' },
          { id: 'b', text: 'Das Dashboard ist kaputt.', correct: false, feedback: 'Es zeigt, wofür es konfiguriert ist. Gefehlt hat eine Überwachung für hängende Aufträge.' },
        ],
      },
      {
        id: 's4', text: 'Gesamte Lösung?',
        options: [
          { id: 'a', text: 'Kennwort des Dienstkontos erneuern und im Konnektor hinterlegen, Warteschlange abarbeiten lassen und prüfen, Anmeldungen der 9 Konten seit Austritt auswerten lassen. Prävention: gMSA bzw. Kennwortablauf-Überwachung, Alarm auf Warteschlangenalter. Prüfen, ob ein Produktfehler vorliegt (Status grün trotz Dauerfehler) und ggf. eskalieren.', correct: true, feedback: 'Sehr gut: Technik, Sicherheit, Prozess und Produktfeedback.' },
          { id: 'b', text: 'Kennwortablauf für alle Konten der Domäne abschalten', correct: false, feedback: 'Viel zu breit. Für Dienstkonten gibt es bessere Lösungen (gMSA, Überwachung).' },
        ],
      },
    ],
    explanation: '**Merke:** Grünes Dashboard ≠ alles gut. LDAP 49 data-Codes: 525 Benutzer unbekannt, 52e falsche Anmeldedaten, 532 Kennwort abgelaufen, 533 deaktiviert, 775 gesperrt.',
    doc: {
      points: [
        { label: 'Ursache: Kennwort des Dienstkontos abgelaufen (data 532)', keywords: ['532', 'abgelaufen', 'dienstkonto', 'kennwort'] },
        { label: 'Sofortmaßnahmen: Kennwort erneuern, Warteschlange, Anmeldungen prüfen', keywords: ['erneu', 'warteschlange', 'anmeldungen', 'nachhol'] },
        { label: 'Prävention: gMSA/Überwachung, Alarm auf Warteschlange', keywords: ['gmsa', 'alarm', 'überwach', 'monitoring'] },
        { label: 'Produktfeedback/Eskalation zum grünen Status', keywords: ['eskal', 'produkt', 'entwicklung', 'dashboard', 'grün'] },
      ],
      model: '**Ursache:** Das Kennwort des AD-Konnektor-Dienstkontos ist am 22.10. abgelaufen (LDAP 49, data 532). Seitdem standen alle Deaktivierungen in der Wiederholungs-Warteschlange. Das Dashboard zeigt diese nicht als Fehler.\n\n**Sofortmaßnahmen:** Kennwort erneuert und im Konnektor hinterlegt, Warteschlange abgearbeitet, alle 9 Konten deaktiviert. Bitte Anmeldungen dieser Konten seit Austritt durch die Sicherheit prüfen lassen.\n\n**Prävention:** gMSA oder Ablaufüberwachung für Dienstkonten, Alarm bei Aufträgen älter als 24 h.\n\n**Produkt:** Statusanzeige bei Dauerfehlern an die Entwicklung gemeldet.',
    },
  },
  {
    id: 'sd24', type: 'chain', difficulty: 3, priority: 2, lang: 'en', area: 'iam', learn: 'sup-05',
    title: 'Request blocked: SoD conflict, manager furious',
    company: 'Brightfield Insurance', requester: 'Oliver Grant (Head of Finance)',
    prompt: 'This is ridiculous. I requested "Payment Approval" for my team lead Anna and your system rejects it with "SoD conflict: Vendor Master Data". She needs it by Friday for the quarter close. Override this now.\n\nOliver Grant',
    steps: [
      {
        id: 's1', text: 'How do you open your reply?',
        options: [
          { id: 'a', text: 'Acknowledge the deadline, explain briefly that the rule prevents one person from creating vendors and approving payments, and that there are options.', correct: true, feedback: 'Correct. Empathy, explanation, outlook.' },
          { id: 'b', text: '"The system is working as designed. Ticket closed."', correct: false, feedback: 'Technically true, but it ignores the business need and escalates the conflict.' },
          { id: 'c', text: 'Override the rule silently in the database', correct: false, feedback: 'Bypassing SoD controls without approval is a serious compliance violation.' },
        ],
      },
      {
        id: 's2', text: 'Anna still has "Vendor Master Data" from her previous role. Which option solves it cleanly?',
        options: [
          { id: 'a', text: 'Remove the old right if she no longer needs it (mover leftover). Then the new request no longer conflicts.', correct: true, feedback: 'Exactly. Often the conflict is privilege creep.' },
          { id: 'b', text: 'Give her both rights permanently', correct: false, feedback: 'That is exactly what the SoD rule is meant to prevent.' },
        ],
      },
      {
        id: 's3', text: 'What if she really needs both until Friday?',
        options: [
          { id: 'a', text: 'Use the customer’s documented exception process: approved by the risk/compliance owner, time-limited, with a mitigating control (e.g. second approval on payments) and logged.', correct: true, feedback: 'Correct. Exceptions are possible, but controlled and documented.' },
          { id: 'b', text: 'Support decides on the exception', correct: false, feedback: 'Support is not the risk owner. The customer’s compliance function decides.' },
        ],
      },
    ],
    explanation: '**Remember:** SoD conflicts are often leftovers from a previous role. Exceptions only via the customer’s risk owner, time-limited and documented.',
    doc: {
      points: [
        { label: 'Explain SoD rule and its purpose', keywords: ['segregation', 'sod', 'conflict', 'vendor', 'payment'] },
        { label: 'Solution: remove leftover right from previous role', keywords: ['previous role', 'leftover', 'remove', 'mover', 'old right'] },
        { label: 'Alternative: approved, time-limited exception', keywords: ['exception', 'time-limited', 'temporary', 'compliance', 'risk owner', 'mitigat'] },
      ],
      model: 'Dear Mr Grant,\n\nI understand the deadline. The rule prevents one person from both maintaining vendor data and approving payments.\n\n**Root cause:** Anna still holds "Vendor Master Data" from her previous role.\n\n**Solution:** If she no longer needs it, please remove it via the IAM. The Payment Approval request will then pass.\n\n**If both are needed:** your compliance owner can approve a time-limited exception with a mitigating control (e.g. second approval for payments). It will be logged for audit.',
    },
  },
  {
    id: 'sd25', type: 'chain', difficulty: 3, priority: 1, lang: 'de', area: 'scripting', learn: 'sup-06',
    title: 'Skript hat 312 falsche Konten deaktiviert',
    company: 'Alpenmetall AG', requester: 'Sandra Moser (Applikationsbetreuung)',
    prompt: 'Hilfe!\n\nUnser nächtliches Zusatzskript hat heute 312 Konten deaktiviert, eigentlich sollten es 4 Leiharbeiter sein. Die Leute können nicht arbeiten.\n```\n$abt = $config.LeiharbeitAbteilung\nGet-ADUser -Filter "Department -eq \'$abt\'" | Disable-ADAccount\n```\nSandra',
    steps: [
      {
        id: 's1', text: 'Was ist die erste Priorität?',
        options: [
          { id: 'a', text: 'Betrieb wiederherstellen: die fälschlich deaktivierten Konten identifizieren und wieder aktivieren', correct: true, feedback: 'Richtig. Erst den Schaden beheben, dann Ursachenanalyse.' },
          { id: 'b', text: 'Erst den genauen Fehler im Skript finden', correct: false, feedback: 'Wichtig, aber 312 Menschen können gerade nicht arbeiten. Wiederherstellung zuerst.' },
        ],
      },
      {
        id: 's2', text: 'Wie findest du die 312 Konten zuverlässig?',
        options: [
          { id: 'a', text: 'Über das Transkript bzw. Ereignis 4725 (Konto deaktiviert) im Sicherheitsprotokoll der DCs zum Zeitpunkt des Laufs, abgeglichen mit dem Soll im IAM', correct: true, feedback: 'Richtig. Belastbare Liste statt Raten.' },
          { id: 'b', text: 'Alle deaktivierten Konten aktivieren', correct: false, feedback: 'Dann würden auch echte Austritte wieder aktiv. Ein Sicherheitsrisiko.' },
        ],
      },
      {
        id: 's3', text: 'In der Konfiguration fehlt `LeiharbeitAbteilung`. Was ist passiert?',
        options: [
          { id: 'a', text: '`$abt` ist leer, der Filter lautet `Department -eq \'\'` und trifft alle Konten ohne Abteilung.', correct: true, feedback: 'Genau, die Leervariablen-Falle.' },
          { id: 'b', text: 'Disable-ADAccount ignoriert Filter.', correct: false, feedback: 'Der Filter wurde angewendet, nur mit leerem Wert.' },
        ],
      },
      {
        id: 's4', text: 'Wie verhinderst du das künftig?',
        options: [
          { id: 'a', text: 'Eingabe prüfen (`if (-not $abt) { throw }`), Obergrenze für Anzahl (z. B. Abbruch bei mehr als 10 Treffern), Testlauf mit -WhatIf, Transkript; besser: Leiharbeiter-Austritte über den Leaver-Prozess im IAM abbilden', correct: true, feedback: 'Sehr gut. Schutz im Skript und Prozess ins IAM verlagern.' },
          { id: 'b', text: 'Skript einfach nicht mehr nachts laufen lassen', correct: false, feedback: 'Der Fehler passiert tagsüber genauso.' },
        ],
      },
    ],
    explanation: '**Merke:** Bei Massenschäden: erst wiederherstellen, dann analysieren. Skripte mit Eingabeprüfung, Mengenbremse und -WhatIf absichern.',
    doc: {
      points: [
        { label: 'Wiederherstellung: betroffene Konten ermittelt und aktiviert', keywords: ['aktivier', 'wiederherstell', '4725', 'transkript'] },
        { label: 'Ursache: leere Variable im Filter', keywords: ['leer', 'variable', 'konfiguration', "-eq ''", 'ohne abteilung'] },
        { label: 'Prävention: Eingabeprüfung, Mengenbremse, -WhatIf', keywords: ['prüf', 'throw', 'obergrenze', 'whatif', 'mengenbremse', 'grenze'] },
        { label: 'Empfehlung: Prozess ins IAM verlagern', keywords: ['leaver', 'iam', 'prozess'] },
      ],
      model: '**Sofortmaßnahme:** Anhand der Ereignisse 4725 zum Laufzeitpunkt wurden 312 Konten ermittelt, mit dem IAM-Soll abgeglichen und reaktiviert.\n\n**Ursache:** `LeiharbeitAbteilung` fehlte in der Konfiguration. `$abt` war leer, der Filter `Department -eq \'\'` traf alle Konten ohne Abteilung.\n\n**Prävention:** Eingabeprüfung (`throw` bei leerem Wert), Abbruch bei mehr als 10 Treffern, Testlauf mit `-WhatIf`, Transkript. Empfehlung: Austritte von Leiharbeitern über den Leaver-Prozess im IAM abbilden statt per Zusatzskript.',
    },
  },
  {
    id: 'sd26', type: 'chain', difficulty: 3, priority: 2, lang: 'en', area: 'troubleshoot', learn: 'sup-08',
    title: 'Workflow fails for one specific employee',
    company: 'Halvorsen Shipping AS', requester: 'Ingrid Dahl (IT Operations)',
    prompt: 'Hi,\n\nthe joiner workflow for our new employee Siobhan O’Neill fails every time. All other joiners this week worked.\n\nIngrid',
    steps: [
      {
        id: 's1', text: 'What is your first hypothesis?',
        options: [
          { id: 'a', text: 'Something in her data is different from the others, e.g. special characters in the name.', correct: true, feedback: 'Correct. Only one case fails, so compare her data with working cases.' },
          { id: 'b', text: 'The workflow engine is down.', correct: false, feedback: 'Other joiners worked the same week.' },
        ],
      },
      {
        id: 's2', text: 'Workflow log:\n```\nERROR SqlException: Incorrect syntax near \'Neill\'. Unclosed quotation mark after the character string \'\'.\n```\nWhat is happening?',
        options: [
          { id: 'a', text: 'The apostrophe in O’Neill breaks an SQL statement the product builds from the name: the value is not passed safely as a parameter.', correct: true, feedback: 'Exactly. This is a product bug and also a potential SQL injection risk.' },
          { id: 'b', text: 'The database is offline.', correct: false, feedback: 'The database answered with a syntax error, so it is online.' },
        ],
      },
      {
        id: 's3', text: 'What do you do?',
        options: [
          { id: 'a', text: 'Reproduce in the lab, file a bug for development (version, steps, expected/actual, log), flag the possible injection risk as security-relevant, and give the customer a workaround if one is supported.', correct: true, feedback: 'Correct. Clear bug report plus security flag.' },
          { id: 'b', text: 'Ask HR to remove the apostrophe from her name', correct: false, feedback: 'Her name is correct. The product has to handle it. At most a short-term workaround agreed with the customer.' },
        ],
      },
    ],
    explanation: '**Remember:** One failing case among many → compare data. Unescaped input in SQL is a bug and a security issue.',
    doc: {
      points: [
        { label: 'Root cause: apostrophe breaks SQL statement', keywords: ['apostrophe', 'quotation', 'sql', 'escap', 'parameter'] },
        { label: 'Bug report with repro to development', keywords: ['bug', 'reproduc', 'development', 'escalat'] },
        { label: 'Security relevance (SQL injection)', keywords: ['injection', 'security'] },
      ],
      model: '**Root cause:** The workflow builds an SQL statement with the last name. The apostrophe in "O’Neill" ends the string early (SqlException: Unclosed quotation mark).\n\n**Next steps:** Reproduced in our lab with version X. Bug filed for development with steps, expected/actual result and log. Flagged as security-relevant (possible SQL injection).\n\n**Workaround:** We will send you a supported workaround as soon as development confirms it.',
    },
  },
  {
    id: 'sd27', type: 'chain', difficulty: 3, priority: 2, lang: 'de', area: 'infra', learn: 'sup-04',
    title: 'Neuer Benutzer wird nicht nach Entra ID synchronisiert',
    company: 'Kanzlei Rauch & Partner', requester: 'Daniel Rauch (IT)',
    prompt: 'Hallo,\n\ndie neue Kollegin Julia Berger (jberger) wurde vom IAM im AD angelegt, taucht aber nicht in Microsoft 365 auf. Entra Connect meldet einen Fehler bei diesem Objekt.\n\nDaniel',
    steps: [
      {
        id: 's1', text: 'Fehler in Entra Connect Health: `AttributeValueMustBeUnique`, Attribut `proxyAddresses`, Wert `smtp:j.berger@rauch-partner.at`. Was heißt das?',
        options: [
          { id: 'a', text: 'Ein anderes Objekt in Entra ID hat dieselbe Adresse bereits.', correct: true, feedback: 'Richtig. Adressen müssen im Tenant eindeutig sein.' },
          { id: 'b', text: 'Die Lizenz fehlt.', correct: false, feedback: 'Lizenzen haben mit der Eindeutigkeit von Attributen nichts zu tun.' },
        ],
      },
      {
        id: 's2', text: 'Die Adresse gehört zum Postfach von Jakob Berger, ausgetreten vor 2 Monaten, Konto deaktiviert, Postfach noch aufbewahrt. Was ist die Ursache im Prozess?',
        options: [
          { id: 'a', text: 'Die Adressbildung im IAM prüft nicht gegen bestehende Adressen deaktivierter Konten bzw. Leaver behalten ihre Adressen.', correct: true, feedback: 'Genau. Der Konflikt entsteht durch die Regel für Adressen.' },
          { id: 'b', text: 'Entra Connect ist defekt.', correct: false, feedback: 'Entra Connect schützt hier korrekt vor doppelten Adressen.' },
        ],
      },
      {
        id: 's3', text: 'Lösung?',
        options: [
          { id: 'a', text: 'Mit dem Kunden klären, wer die Adresse bekommt (z. B. Julia `ju.berger@`). Adresse im IAM bzw. lokal anpassen, Synchronisation abwarten. Adressregel um Prüfung gegen alle Objekte ergänzen.', correct: true, feedback: 'Richtig. Akut lösen und Regel verbessern.' },
          { id: 'b', text: 'Jakobs Postfach sofort löschen', correct: false, feedback: 'Das Postfach ist evtl. aus Aufbewahrungsgründen noch da. Löschen ohne Klärung kann Pflichten verletzen.' },
        ],
      },
    ],
    explanation: '**Merke:** Synchronisierte Objekte werden lokal gepflegt. Eindeutigkeitskonflikte entstehen oft durch Adressregeln, die deaktivierte Konten nicht berücksichtigen.',
    doc: {
      points: [
        { label: 'Ursache: doppelte Adresse (proxyAddresses)', keywords: ['proxyaddresses', 'doppelt', 'eindeutig', 'unique', 'gleiche adresse'] },
        { label: 'Lösung: Adresse anpassen, lokal ändern, Sync', keywords: ['anpass', 'ändern', 'lokal', 'synchron', 'sync'] },
        { label: 'Prävention: Adressregel prüft alle Objekte', keywords: ['adressregel', 'regel', 'prüfung', ...PREV] },
      ],
      model: '**Ursache:** Die für Frau Berger gebildete Adresse j.berger@ ist noch am Postfach des ausgetretenen Jakob Berger hinterlegt. Entra Connect lehnt das Objekt ab (AttributeValueMustBeUnique).\n\n**Lösung:** Nach Abstimmung erhält Frau Berger ju.berger@. Adresse lokal angepasst, nach der Synchronisation erscheint sie in Microsoft 365.\n\n**Prävention:** Adressregel im IAM gegen alle Objekte inklusive deaktivierter Konten prüfen lassen.',
    },
  },
  {
    id: 'sd28', type: 'chain', difficulty: 3, priority: 3, lang: 'de', area: 'iam', learn: 'sup-05',
    title: 'Auditor will Historie der Zugriffe auf HR-Daten',
    company: 'Brenner Logistik GmbH', requester: 'Tobias Reiter (IT-Leitung)',
    prompt: 'Hallo,\n\nder Wirtschaftsprüfer will wissen, wer am 30.06. Zugriff auf `\\\\fs01\\HR\\Gehälter` hatte und wer diese Zugriffe genehmigt hat. Bitte schickt uns einfach alles als Excel per Mail.\n\nTobias',
    steps: [
      {
        id: 's1', text: 'Welche Datenquelle beantwortet die Frage?',
        options: [
          { id: 'a', text: 'Historischer Berechtigungsbericht des IAM zum Stichtag plus Genehmigungsprotokoll der Anträge', correct: true, feedback: 'Richtig. Stichtag und Genehmiger kommen aus der Historie.' },
          { id: 'b', text: 'Aktueller `icacls`-Export', correct: false, feedback: 'Zeigt nur heute, ohne Genehmiger.' },
        ],
      },
      {
        id: 's2', text: 'Im Bericht stehen auch 3 Personen mit Zugriff über die Gruppe „Administratoren“. Gehören die in die Antwort?',
        options: [
          { id: 'a', text: 'Ja. Auch administrativer Zugriff ist Zugriff und muss für den Prüfer sichtbar sein, mit Hinweis auf die Rolle.', correct: true, feedback: 'Richtig. Vollständigkeit ist im Audit entscheidend.' },
          { id: 'b', text: 'Nein, Admins zählen nicht.', correct: false, feedback: 'Gerade privilegierte Zugriffe interessieren Prüfer.' },
        ],
      },
      {
        id: 's3', text: 'Wie übergibst du den Bericht?',
        options: [
          { id: 'a', text: 'Nur die nötigen Spalten, über den vom Kunden vorgesehenen sicheren Weg (z. B. Freigabe mit Zugriffsbeschränkung), nicht als offener Mailanhang. Bericht im Ticket referenzieren, nicht anhängen.', correct: true, feedback: 'Richtig. Datenminimierung und sichere Übertragung.' },
          { id: 'b', text: 'Alles als Excel per Mail an alle Beteiligten', correct: false, feedback: 'Personenbezogene HR-Daten per offener Mail verteilen widerspricht Datenschutz und Need-to-know.' },
        ],
      },
    ],
    explanation: '**Merke:** Audits brauchen Stichtag, Genehmiger und Vollständigkeit. Berichte datensparsam und sicher übergeben.',
    doc: {
      points: [
        { label: 'Quelle: historischer Bericht + Genehmigungsprotokoll', keywords: ['histor', 'stichtag', 'genehmig', 'protokoll'] },
        { label: 'Vollständigkeit inkl. administrativer Zugriffe', keywords: ['admin', 'administrat', 'privilegiert', 'vollständig'] },
        { label: 'Sichere, datensparsame Übergabe', keywords: ['sicher', 'datensparsam', 'datenschutz', 'nicht per mail', 'verschlüssel', 'freigabe'] },
      ],
      model: '**Inhalt:** Historischer Berechtigungsbericht für `\\\\fs01\\HR\\Gehälter` zum 30.06. mit Genehmiger und Genehmigungsdatum je Zugriff. Enthalten sind auch 3 Zugriffe über die Gruppe Administratoren (gekennzeichnet).\n\n**Übergabe:** Aus Datenschutzgründen nicht per offener Mail. Der Bericht liegt mit Zugriff nur für Sie und den Prüfer auf der vereinbarten geschützten Ablage.',
    },
  },
  {
    id: 'sd29', type: 'chain', difficulty: 3, priority: 2, lang: 'en', area: 'perm', learn: 'sup-04',
    title: 'External auditors cannot open the IAM review portal',
    company: 'Brightfield Insurance', requester: 'Priya Natarajan (Infrastructure)',
    prompt: 'Hello,\n\nwe invited two external auditors as guests in Entra ID to review access reports in the IAM portal (SSO via Entra ID). They get "You cannot access this right now". Internal users are fine.\n\nPriya',
    steps: [
      {
        id: 's1', text: 'Where do you look first?',
        options: [
          { id: 'a', text: 'Entra sign-in logs for one auditor: error code and the Conditional Access tab', correct: true, feedback: 'Correct. The message is typical for a Conditional Access block.' },
          { id: 'b', text: 'IAM portal web server logs', correct: false, feedback: 'The auditors never reach the portal. The sign-in is blocked before.' },
        ],
      },
      {
        id: 's2', text: 'Error `AADSTS53003`. Policy "Require compliant device – all users, all apps" applied. Why does it block the auditors?',
        options: [
          { id: 'a', text: 'Their devices are not enrolled in the customer’s device management, so they can never be compliant.', correct: true, feedback: 'Exactly. Guests use their own company devices.' },
          { id: 'b', text: 'Guests cannot use SSO at all.', correct: false, feedback: 'Guests can use SSO to apps. The policy is the barrier.' },
        ],
      },
      {
        id: 's3', text: 'What do you recommend?',
        options: [
          { id: 'a', text: 'Customer’s security team adds a separate policy for guests on this app (e.g. MFA required, limited session) and excludes guests from the device policy for this app only. Test with What If and report-only first.', correct: true, feedback: 'Correct. Targeted, secure and tested.' },
          { id: 'b', text: 'Disable the compliant device policy for everyone', correct: false, feedback: 'That weakens security for all internal users.' },
        ],
      },
    ],
    explanation: '**Remember:** AADSTS53003 = blocked by Conditional Access. Guests cannot satisfy device compliance of your tenant; design separate guest policies.',
    doc: {
      points: [
        { label: 'Root cause: CA policy requires compliant device', keywords: ['conditional access', 'compliant', '53003', 'policy'] },
        { label: 'Solution: separate guest policy (e.g. MFA)', keywords: ['guest', 'mfa', 'exclude', 'separate policy'] },
        { label: 'Testing: What If / report-only', keywords: ['what if', 'report-only', 'report only', 'test'] },
      ],
      model: '**Root cause:** Sign-ins are blocked by Conditional Access (AADSTS53003). The policy requires a compliant device for all users. The auditors’ devices are not managed by your tenant.\n\n**Recommendation:** Your security team creates a dedicated policy for guests on the IAM portal (MFA required, short sessions) and excludes guests from the device policy for this app only.\n\n**Testing:** Validate with the What If tool and report-only mode before enabling.',
    },
  },
  {
    id: 'sd30', type: 'chain', difficulty: 3, priority: 2, lang: 'de', area: 'troubleshoot', learn: 'sup-08',
    title: 'Nächtlicher Abgleich dauert plötzlich 9 Stunden',
    company: 'Alpenmetall AG', requester: 'Sandra Moser (Applikationsbetreuung)',
    prompt: 'Hallo,\n\nder Abgleich lief immer ca. 40 Minuten. Seit etwa drei Wochen dauert er 8–9 Stunden und ist morgens noch nicht fertig. Die Datenbank ist auf 180 GB gewachsen (vorher 12 GB).\n\nSandra',
    steps: [
      {
        id: 's1', text: 'Was fragst du zuerst?',
        options: [
          { id: 'a', text: 'Was sich vor drei Wochen geändert hat (Updates, Konfiguration, frühere Supportfälle) und welche Tabellen so gewachsen sind', correct: true, feedback: 'Richtig. Zeitlicher Zusammenhang und wo das Wachstum liegt.' },
          { id: 'b', text: 'Ob mehr RAM möglich ist', correct: false, feedback: 'Mehr Hardware kaschiert vielleicht, erklärt aber das 15-fache Wachstum nicht.' },
        ],
      },
      {
        id: 's2', text: 'Die Tabelle mit Protokolleinträgen ist 165 GB groß. Vor drei Wochen gab es einen Supportfall, bei dem das Log-Level auf „Debug“ gestellt wurde. Ursache?',
        options: [
          { id: 'a', text: 'Das Debug-Log-Level wurde nach dem Supportfall nicht zurückgesetzt, jeder Lauf schreibt riesige Mengen.', correct: true, feedback: 'Genau. Die Analyse von damals hat ein neues Problem erzeugt.' },
          { id: 'b', text: 'Die Mitarbeiterzahl hat sich verzehnfacht.', correct: false, feedback: 'Dann wären Benutzer- und Berechtigungstabellen gewachsen, nicht vor allem das Protokoll.' },
        ],
      },
      {
        id: 's3', text: 'Lösung?',
        options: [
          { id: 'a', text: 'Log-Level zurück auf Standard. Bereinigung der Protokolldaten nur nach Herstelleranleitung bzw. mit freigegebenem Skript und Backup. Interne Lernpunkt: Checkliste „Log-Level zurücksetzen“ beim Ticketabschluss.', correct: true, feedback: 'Sehr gut, inklusive eigener Prozessverbesserung.' },
          { id: 'b', text: 'Protokolltabelle mit `TRUNCATE` leeren', correct: false, feedback: 'Ohne Herstellerfreigabe und Backup riskant, und Protokolle können für Audits aufbewahrungspflichtig sein.' },
        ],
      },
    ],
    explanation: '**Merke:** Was du zur Analyse änderst (Log-Level, Testkonten, Ausnahmen), musst du beim Abschluss zurücknehmen. Am besten per Checkliste.',
    doc: {
      points: [
        { label: 'Ursache: Debug-Log-Level nicht zurückgesetzt', keywords: ['debug', 'log-level', 'loglevel', 'protokollstufe', 'zurückgesetzt'] },
        { label: 'Lösung: Log-Level zurück, Bereinigung nach Anleitung mit Backup', keywords: ['zurück', 'standard', 'bereinig', 'backup', 'anleitung'] },
        { label: 'Prävention: Checkliste beim Ticketabschluss', keywords: ['checkliste', 'abschluss', ...PREV] },
      ],
      model: '**Ursache:** Im Supportfall vor drei Wochen wurde das Log-Level auf Debug gestellt und nicht zurückgesetzt. Die Protokolltabelle ist dadurch auf 165 GB gewachsen, der Abgleich wird langsam.\n\n**Lösung:** Log-Level wieder auf Standard. Bereinigung der Protokolldaten gemäß Herstelleranleitung nach Backup (Aufbewahrungsfristen beachten).\n\n**Prävention:** In unserem Support ergänzen wir die Abschluss-Checkliste um „Log-Level zurücksetzen“.',
    },
  },
  {
    id: 'sd31', type: 'chain', difficulty: 3, priority: 2, lang: 'de', area: 'infra', learn: 'sup-01',
    title: 'Zugriff über DNS-Alias fragt nach Anmeldedaten',
    company: 'Stadtwerke Talheim', requester: 'Martina Kogler (Systemadministration)',
    prompt: 'Hallo,\n\nnach der Migration auf FS02 haben wir den Alias `daten.stadtwerke.local` (CNAME) auf FS02 zeigen lassen. Über `\\\\fs02\\projekte` klappt alles, über `\\\\daten.stadtwerke.local\\projekte` kommt eine Anmeldeaufforderung. Euer Fileserver-Konnektor nutzt auch den Alias und meldet „Access denied“.\n\nMartina',
    steps: [
      {
        id: 's1', text: '`klist` nach dem Zugriffsversuch zeigt kein Ticket für `cifs/daten.stadtwerke.local`. `setspn -Q cifs/daten.stadtwerke.local` meldet „No such SPN found“. Was fehlt?',
        options: [
          { id: 'a', text: 'Für den Alias ist kein Dienstprinzipalname registriert, Kerberos kann kein Ticket ausstellen.', correct: true, feedback: 'Richtig. Ohne SPN kein Kerberos-Ticket für diesen Namen.' },
          { id: 'b', text: 'Der CNAME-Eintrag im DNS fehlt.', correct: false, feedback: 'Die Namensauflösung funktioniert, sonst käme „Pfad nicht gefunden“.' },
        ],
      },
      {
        id: 's2', text: 'Was ist der saubere Weg, einen zusätzlichen Namen für einen Server zu registrieren?',
        options: [
          { id: 'a', text: '`netdom computername fs02.stadtwerke.local /add:daten.stadtwerke.local` (registriert den alternativen Namen samt SPNs) bzw. SPN gezielt mit `setspn -S`', correct: true, feedback: 'Richtig. So kennt Kerberos den Alias.' },
          { id: 'b', text: 'NTLM für die ganze Domäne erzwingen', correct: false, feedback: 'NTLM ist schwächer und wird zurückgedrängt. Das wäre ein Rückschritt für alle.' },
        ],
      },
      {
        id: 's3', text: 'Was gehört in die Dokumentation zusätzlich?',
        options: [
          { id: 'a', text: 'Die Migrations-Checkliste um „Alias-Namen mit SPN registrieren“ ergänzen und den Konnektor-Test mit Alias aufnehmen', correct: true, feedback: 'Richtig. Damit passiert es beim nächsten Umzug nicht wieder.' },
          { id: 'b', text: 'Nichts, es funktioniert ja jetzt', correct: false, feedback: 'Ohne Doku wiederholt sich der Fehler beim nächsten Umzug.' },
        ],
      },
    ],
    explanation: '**Merke:** Zugriff über Alias = Kerberos braucht einen SPN für genau diesen Namen. `klist` und `setspn -Q` zeigen es schnell.',
    doc: {
      points: [
        { label: 'Ursache: kein SPN für den Alias', keywords: ['spn', 'dienstprinzipal', 'service principal'] },
        { label: 'Lösung: netdom computername /add bzw. setspn -S', keywords: ['netdom', 'setspn', 'alternativ'] },
        { label: 'Prävention: Migrations-Checkliste', keywords: ['checkliste', 'migration', ...PREV] },
      ],
      model: '**Ursache:** Für den Alias `daten.stadtwerke.local` ist kein SPN registriert. Clients erhalten kein Kerberos-Ticket für `cifs/daten.stadtwerke.local`, es folgt eine Anmeldeaufforderung bzw. „Access denied“.\n\n**Lösung:** `netdom computername fs02.stadtwerke.local /add:daten.stadtwerke.local` ausgeführt, SPNs mit `setspn -L fs02` geprüft. Zugriff und Konnektor funktionieren.\n\n**Prävention:** Migrations-Checkliste um „Alias mit SPN registrieren“ ergänzt.',
    },
  },
  {
    id: 'sd32', type: 'chain', difficulty: 3, priority: 3, lang: 'en', area: 'infra', learn: 'sup-02',
    title: 'Changes lost on replicated file share',
    company: 'Halvorsen Shipping AS', requester: 'Ingrid Dahl (IT Operations)',
    prompt: 'Hi,\n\nour Oslo and Bergen offices both work on `\\\\halvorsen.local\\data\\fleet`. Yesterday a planner in Bergen lost two hours of work in the fleet schedule. Same file was edited in Oslo. Is your IAM connector overwriting files?\n\nIngrid',
    steps: [
      {
        id: 's1', text: 'Does the IAM file server connector change file contents?',
        options: [
          { id: 'a', text: 'No, it manages permissions (ACLs), not file contents. Look at the file share infrastructure.', correct: true, feedback: 'Correct. Rule out your product with facts, then help anyway.' },
          { id: 'b', text: 'Yes, it rewrites files during reconciliation', correct: false, feedback: 'A permission connector does not write file contents.' },
        ],
      },
      {
        id: 's2', text: 'The namespace has two folder targets (Oslo and Bergen), replicated with DFS-R. What happened?',
        options: [
          { id: 'a', text: 'Both users edited the file on different servers at the same time. DFS-R has no distributed locking, last writer wins, the other version went to ConflictAndDeleted.', correct: true, feedback: 'Exactly.' },
          { id: 'b', text: 'DFS-N deleted the file.', correct: false, feedback: 'The namespace only redirects. Conflicts come from replication.' },
        ],
      },
      {
        id: 's3', text: 'What do you recommend?',
        options: [
          { id: 'a', text: 'Recover the lost version from `DfsrPrivate\\ConflictAndDeleted`. Going forward, use only one active target for jointly edited data or a collaboration platform with co-authoring.', correct: true, feedback: 'Correct. Recover now, prevent later.' },
          { id: 'b', text: 'Disable DFS-R completely', correct: false, feedback: 'That removes redundancy for all data. A targeted change is better.' },
        ],
      },
    ],
    explanation: '**Remember:** Even when the product is not at fault, a helpful answer explains the real cause. DFS-R: no distributed locks.',
    doc: {
      points: [
        { label: 'IAM connector ruled out (permissions only)', keywords: ['permission', 'acl', 'not the connector', 'does not change', 'only manages'] },
        { label: 'Root cause: DFS-R conflict, last writer wins', keywords: ['dfs', 'conflict', 'last writer', 'locking', 'replication'] },
        { label: 'Recovery and prevention', keywords: ['conflictanddeleted', 'recover', 'restore', 'one active target', 'single target', 'co-author'] },
      ],
      model: '**Our product:** The IAM file server connector only manages permissions, it does not modify file contents.\n\n**Root cause:** The file was edited at the same time in Oslo and Bergen on two DFS-R replicas. DFS-R has no distributed locking, so the last save wins and the other version is moved to `DfsrPrivate\\ConflictAndDeleted`.\n\n**Recovery:** The Bergen version can be restored from there.\n\n**Prevention:** Use one active folder target for jointly edited files, or a platform with co-authoring.',
    },
  },
];
