import type { Level } from '../../types/content';

// Generisches IAM-Produkt: keine Herstellerdetails, nur allgemein gültige Konzepte.
const level: Level = {
  id: 'sup-05',
  track: 'support',
  order: 5,
  title: 'Identity & Access Management',
  titleEn: 'Identity and Access Management (IAM)',
  summary: 'Joiner-Mover-Leaver, Quellsystem und Konnektoren, rollenbasierte Zugriffssteuerung, Self-Service mit Genehmigungsworkflows, Rezertifizierung, Rechteanhäufung, Funktionstrennung, Abgleich und Audit sowie was DSGVO, NIS2 und ISO 27001 von Berechtigungsmanagement verlangen.',
  certs: ['jobready'],
  domains: { jobready: 'iam' },
  lab: {
    title: 'Ein kleines Rollenmodell entwerfen',
    needs: 'Tabellenkalkulation, optional eine Test-Domäne aus Modul 1',
    steps: [
      'Lege eine Tabelle mit 10 fiktiven Mitarbeitern an: Name, Abteilung, Position, Standort.',
      'Lege eine zweite Tabelle mit technischen Berechtigungen an: AD-Gruppen, Fileserver-Ordner, Postfächer, Apps.',
      'Bilde drei Geschäftsrollen (z. B. „Vertrieb Basis“, „Vertrieb Leitung“, „Buchhaltung“) und ordne ihnen die technischen Berechtigungen zu.',
      'Spiele einen Mover durch: Ein Mitarbeiter wechselt vom Vertrieb in die Buchhaltung. Welche Rechte kommen dazu, welche müssen weg?',
      'Prüfe auf Funktionstrennung: Gibt es eine Rolle, die gleichzeitig Lieferanten anlegen und Zahlungen freigeben darf?',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: Was ein IAM-System macht',
      body: `**Identity & Access Management** (IAM) beantwortet drei Fragen: **Wer** ist jemand (Identität)? **Was** darf er (Berechtigungen)? **Warum** darf er es, und wer hat es genehmigt (Nachweis)?

Ohne IAM-System pflegen Admins Rechte von Hand in AD, Fileserver, Exchange, Microsoft 365 und Fachanwendungen. Das führt zu vergessenen Konten, zu vielen Rechten und fehlenden Nachweisen. Ein IAM-System automatisiert das über den Lebenszyklus einer Identität, den **Joiner-Mover-Leaver**-Prozess:

| Phase | Was passiert | Typischer Fehler ohne IAM |
|---|---|---|
| Joiner (Eintritt) | Konto, Postfach, Grundrechte am ersten Tag | Mitarbeiter wartet tagelang auf Zugänge |
| Mover (Wechsel) | neue Rechte dazu, alte **weg** | alte Rechte bleiben, Rechte häufen sich an |
| Leaver (Austritt) | Konto deaktivieren, Rechte entziehen, Daten übergeben | Konto bleibt aktiv, Ex-Mitarbeiter hat Zugriff |

Die Daten kommen meist aus einem **führenden System** (Quellsystem), typischerweise der Personalabteilung (HR). Das IAM-System liest Eintritte, Wechsel und Austritte von dort und setzt sie über **Konnektoren** in den Zielsystemen um (AD, Entra ID, Exchange, Fileserver, SAP …).`,
      analogy: 'Ein IAM-System ist wie der Hausmeister mit Schlüsselbuch: Neue bekommen am ersten Tag ihre Schlüssel, wer umzieht, gibt die alten ab, wer geht, gibt alle zurück. Und im Buch steht, wer welchen Schlüssel warum hat.',
      terms: [
        { de: 'Identitäts- und Zugriffsverwaltung', en: 'Identity and Access Management (IAM)' },
        { de: 'Eintritt, Wechsel, Austritt', en: 'Joiner, Mover, Leaver (JML)' },
        { de: 'führendes System', en: 'authoritative source' },
        { de: 'Konnektor', en: 'connector' },
        { de: 'Bereitstellung', en: 'provisioning' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Welche Phase führt ohne IAM am häufigsten zu Rechteanhäufung?',
        options: [
          { id: 'a', text: 'Mover: Neue Rechte kommen dazu, alte werden nicht entzogen.' },
          { id: 'b', text: 'Joiner', whyWrong: 'Beim Eintritt fehlen eher Rechte. Anhäufen können sie sich erst durch Wechsel.' },
          { id: 'c', text: 'Leaver', whyWrong: 'Beim Austritt ist das Risiko ein aktives Konto, nicht die Anhäufung über die Zeit.' },
        ],
        correct: 'a',
        explanation: 'Abteilungswechsel ohne Entzug alter Rechte = Rechteanhäufung (privilege creep).',
      },
    },
    {
      heading: 'Fortgeschritten: Rollen, Self-Service und Genehmigungen',
      body: `**Rollenbasierte Zugriffssteuerung** (RBAC) heißt: Rechte hängen nicht an Personen, sondern an Rollen.
- **Geschäftsrolle** (business role): „Vertrieb Innendienst Linz“. Sie bündelt
- **technische Berechtigungen**: AD-Gruppen, Ordnerrechte, Postfächer, App-Rollen.

Wer die Geschäftsrolle bekommt, erhält automatisch alle zugehörigen Rechte. Grundrechte, die jeder einer Abteilung braucht, werden oft automatisch anhand von HR-Attributen vergeben (**Basisberechtigungen**, birthright access). Zu feine Rollen führen zur **Rollenexplosion**: Am Ende gibt es mehr Rollen als Mitarbeiter.

Was nicht in Rollen passt, beantragen Benutzer per **Self-Service**:
1. Antrag im Portal: „Ich brauche Lesezugriff auf den Ordner Projekte\\Kunde-A“.
2. **Genehmigungsworkflow:** Vorgesetzter und/oder **Dateneigentümer** (data owner) stimmen zu.
3. Das IAM-System setzt die Berechtigung über den Konnektor automatisch, z. B. durch Aufnahme in die passende AD-Gruppe.
4. Optional mit **Ablaufdatum**, danach wird das Recht automatisch entzogen.

Der Dateneigentümer ist die Fachperson, die weiß, wer auf ihre Daten zugreifen darf, z. B. die Leitung der Buchhaltung. Die IT setzt um, der Fachbereich entscheidet.

Ergänzend zu RBAC gibt es **attributbasierte Zugriffssteuerung** (ABAC), bei der Regeln Attribute wie Abteilung, Standort oder Gerät auswerten.`,
      compare: {
        left: 'manuelle Rechtevergabe', right: 'IAM mit Rollen und Workflows',
        rows: [
          ['Ticket an die IT, Admin setzt Gruppe', 'Antrag im Portal, Fachbereich genehmigt, Konnektor setzt Gruppe'],
          ['Wer hat genehmigt? Steht in einer Mail', 'Genehmigung im Audit-Protokoll'],
          ['Rechte bleiben für immer', 'Ablaufdatum und Rezertifizierung'],
          ['jeder Admin macht es etwas anders', 'gleiche Regeln für alle'],
        ],
      },
      terms: [
        { de: 'rollenbasierte Zugriffssteuerung', en: 'role-based access control (RBAC)' },
        { de: 'Geschäftsrolle', en: 'business role' },
        { de: 'Basisberechtigung', en: 'birthright access' },
        { de: 'Dateneigentümer', en: 'data owner' },
        { de: 'Genehmigungsworkflow', en: 'approval workflow' },
        { de: 'attributbasierte Zugriffssteuerung', en: 'attribute-based access control (ABAC)' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Wer sollte über den Zugriff auf den Ordner „Gehaltsabrechnung“ entscheiden?',
        options: [
          { id: 'a', text: 'Der Dateneigentümer aus dem Fachbereich, z. B. die Leitung Personal' },
          { id: 'b', text: 'Der Administrator, der den Fileserver betreut', whyWrong: 'Der Admin kennt die Technik, aber nicht den fachlichen Bedarf. Er setzt um, entscheidet aber nicht.' },
          { id: 'c', text: 'Jeder Mitarbeiter selbst', whyWrong: 'Dann wäre jeder sein eigener Genehmiger. Das hebelt jede Kontrolle aus.' },
        ],
        correct: 'a',
        explanation: 'Dateneigentümer-Prinzip: Fachbereich entscheidet, IT setzt um, IAM dokumentiert.',
      },
      sources: [{ title: 'NIST – Role Based Access Control', url: 'https://csrc.nist.gov/projects/role-based-access-control' }],
    },
    {
      heading: 'Fortgeschritten: Rezertifizierung, Funktionstrennung und Abgleich',
      body: `**Rezertifizierung** (access review): In festen Abständen bestätigen Vorgesetzte oder Dateneigentümer, ob die Rechte ihrer Leute noch nötig sind. Was nicht bestätigt wird, wird entzogen. Das ist die wichtigste Waffe gegen **Rechteanhäufung**. Problem in der Praxis: Prüfer klicken aus Bequemlichkeit alles durch („Abnicken“). Gute Kampagnen sind darum klein, zeigen Kontext (wann zuletzt genutzt, wer hat genehmigt) und schlagen Entzug vor, wo Rechte ungewöhnlich sind.

**Funktionstrennung** (segregation of duties, SoD): Bestimmte Rechte dürfen nicht bei einer Person zusammenkommen, z. B. „Lieferant anlegen“ und „Zahlung freigeben“. Ein IAM-System prüft solche Regeln bei Antrag und Rezertifizierung.

**Abgleich** (reconciliation): Das IAM-System liest regelmäßig den Ist-Zustand der Zielsysteme und vergleicht ihn mit dem Soll-Zustand. Hat ein Admin direkt im AD jemanden in eine Gruppe aufgenommen, fällt das als Abweichung auf. Je nach Konfiguration wird sie gemeldet oder automatisch zurückgesetzt. Darum sind „schnell mal direkt gesetzte“ Rechte in IAM-Umgebungen eine häufige Ticketursache: Am nächsten Tag sind sie wieder weg.

Weitere Begriffe aus dem Alltag:
- **Verwaiste Konten:** Konten ohne zugehörige Person (z. B. Ex-Mitarbeiter, Testkonten). Ein IAM-Bericht findet sie über den Abgleich mit HR.
- **Dienstkonten:** Konten für Programme, gehören einem verantwortlichen Menschen und werden ebenfalls rezertifiziert.
- **Privilegierte Konten:** Admin-Konten, besonders streng geschützt und getrennt vom Alltagskonto.`,
      terms: [
        { de: 'Rezertifizierung', en: 'access review / recertification' },
        { de: 'Rechteanhäufung', en: 'privilege creep' },
        { de: 'Funktionstrennung', en: 'segregation of duties (SoD)' },
        { de: 'Abgleich', en: 'reconciliation' },
        { de: 'verwaistes Konto', en: 'orphaned account' },
        { de: 'Dienstkonto', en: 'service account' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Ein Kunde meldet: „Wir haben Max gestern direkt im AD in die Gruppe GG_Controlling aufgenommen, heute ist er wieder draußen.“ Was ist die wahrscheinlichste Ursache?',
        options: [
          { id: 'a', text: 'Der Abgleich des IAM-Systems hat die Mitgliedschaft als Abweichung vom Soll erkannt und zurückgesetzt.' },
          { id: 'b', text: 'Die AD-Replikation ist defekt.', whyWrong: 'Eine defekte Replikation entfernt keine Mitgliedschaften. Das Muster „gestern direkt gesetzt, heute weg“ passt zum IAM-Abgleich.' },
          { id: 'c', text: 'Max hat sich selbst entfernt.', whyWrong: 'Normale Benutzer dürfen ihre Gruppenmitgliedschaft in Sicherheitsgruppen nicht ändern.' },
        ],
        correct: 'a',
        explanation: 'In IAM-verwalteten Gruppen Rechte über den Antragsprozess vergeben. Das Audit-Log des IAM-Systems zeigt den Entzug.',
      },
      sources: [{ title: 'Microsoft Learn – What are access reviews?', url: 'https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview' }],
    },
    {
      heading: 'Profi: Audit, DSGVO, NIS2 und ISO 27001',
      body: `Berechtigungsmanagement ist nicht nur Komfort, sondern Pflicht. Im Gespräch mit Kunden-Admins hilft es, die Anforderungen zu kennen (keine Rechtsberatung):

**DSGVO** (Datenschutz-Grundverordnung):
- Art. 5: Grundsätze, u. a. Datenminimierung und **Integrität und Vertraulichkeit**. Nur wer personenbezogene Daten braucht, darf sie sehen.
- Art. 25: Datenschutz durch Technikgestaltung und datenschutzfreundliche Voreinstellungen.
- Art. 32: Sicherheit der Verarbeitung durch technische und organisatorische Maßnahmen (TOM), dazu gehören Zugriffskontrollen.

**NIS2** (EU-Richtlinie 2022/2555) verpflichtet wichtige und besonders wichtige Einrichtungen zu Risikomanagement. Art. 21 nennt u. a. Sicherheit des Personals, **Konzepte für die Zugriffskontrolle** und die Verwaltung von Anlagen sowie den Einsatz von Multi-Faktor-Authentifizierung. Erhebliche Sicherheitsvorfälle müssen gemeldet werden (Frühwarnung innerhalb von 24 Stunden). Die Leitung haftet für die Umsetzung. Die konkreten Pflichten regelt das nationale Umsetzungsgesetz des jeweiligen Landes.

**ISO/IEC 27001:2022** Anhang A enthält u. a. Zugangssteuerung (5.15), Identitätsmanagement (5.16) und Zugangsrechte (5.18), also Vergabe, Überprüfung und Entzug.

Was Auditoren typischerweise sehen wollen:
- Wer hat **heute** welche Rechte? (Berechtigungsbericht)
- Wer **hatte** sie zu einem Zeitpunkt in der Vergangenheit? (Historie)
- **Wer hat genehmigt**, und wann? (Workflow-Protokoll)
- Werden Rechte **regelmäßig überprüft**? (Rezertifizierungsnachweise)
- Werden Austritte **zeitnah** umgesetzt? (Leaver-Bericht)

Genau diese Fragen kommen auch als Support-Tickets: „Der Auditor will einen Bericht über …“`,
      terms: [
        { de: 'Datenschutz-Grundverordnung', en: 'General Data Protection Regulation (GDPR)' },
        { de: 'technische und organisatorische Maßnahmen', en: 'technical and organisational measures (TOMs)' },
        { de: 'Zugriffskontrollkonzept', en: 'access control policy' },
        { de: 'Prüfpfad', en: 'audit trail' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 3,
        prompt: 'Ein Auditor fragt: „Wer hatte am 1. März Zugriff auf den Ordner Gehälter, und wer hat das genehmigt?“ Welche IAM-Funktion beantwortet das?',
        options: [
          { id: 'a', text: 'Historische Berechtigungsberichte plus Workflow- bzw. Audit-Protokoll' },
          { id: 'b', text: 'Ein aktueller `icacls`-Export', whyWrong: '`icacls` zeigt nur den heutigen Stand und keine Genehmigungen. Für Vergangenheit und Genehmiger braucht man die Historie.' },
          { id: 'c', text: 'Die Ereignisanzeige des Fileservers', whyWrong: 'Die zeigt Zugriffe, sofern Überwachung aktiviert ist, aber keine Berechtigungsstände und keine Genehmigungen.' },
        ],
        correct: 'a',
        explanation: 'Nachvollziehbarkeit (wer, was, wann, wer hat genehmigt) ist einer der Hauptgründe für ein IAM-System.',
      },
      sources: [
        { title: 'EUR-Lex – Richtlinie (EU) 2022/2555 (NIS2)', url: 'https://eur-lex.europa.eu/eli/dir/2022/2555/oj' },
        { title: 'EUR-Lex – Verordnung (EU) 2016/679 (DSGVO)', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'dragdrop', difficulty: 1,
      prompt: 'Ordne die Ereignisse der passenden Phase im Lebenszyklus zu.',
      items: [
        { id: 'i1', text: 'Neue Mitarbeiterin startet am Montag' },
        { id: 'i2', text: 'Mitarbeiter wechselt vom Vertrieb ins Marketing' },
        { id: 'i3', text: 'Mitarbeiterin kündigt, letzter Tag Freitag' },
        { id: 'i4', text: 'Beförderung zur Teamleitung' },
      ],
      buckets: [
        { id: 'j', label: 'Joiner' },
        { id: 'm', label: 'Mover' },
        { id: 'l', label: 'Leaver' },
      ],
      solution: { i1: 'j', i2: 'm', i3: 'l', i4: 'm' },
      explanation: 'Auch eine Beförderung ist ein Mover-Ereignis: Rechte ändern sich.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Was ist typischerweise das führende System für Mitarbeiterdaten in einem IAM-Projekt?',
      options: [
        { id: 'a', text: 'Das HR-System' },
        { id: 'b', text: 'Das Active Directory', whyWrong: 'Das AD ist meist ein Zielsystem. Ob jemand eingestellt oder gekündigt ist, weiß verbindlich die Personalabteilung.' },
        { id: 'c', text: 'Das Mailsystem', whyWrong: 'Exchange ist ein Zielsystem. Es weiß nicht, wann jemand eintritt oder austritt.' },
      ],
      correct: 'a',
      explanation: 'HR-getriebene Bereitstellung: Eintritt im HR-System → Konto im AD → Postfach usw.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Was beschreibt „Rechteanhäufung“ (privilege creep)?',
      options: [
        { id: 'a', text: 'Ein Mitarbeiter sammelt über Jahre Rechte an, die er nicht mehr braucht.' },
        { id: 'b', text: 'Ein Angreifer erhöht seine Rechte über eine Sicherheitslücke.', whyWrong: 'Das heißt Rechteausweitung (privilege escalation). Rechteanhäufung entsteht schleichend durch fehlende Entzüge.' },
        { id: 'c', text: 'Ein Admin vergibt Rechte an zu viele Gruppen.', whyWrong: 'Das kann dazu beitragen, beschreibt aber nicht den Begriff. Es geht um die Rechte einer Person über die Zeit.' },
      ],
      correct: 'a',
      explanation: 'Gegenmittel: Entzug beim Mover und regelmäßige Rezertifizierung.',
    },
    {
      id: 'q4', type: 'ordering', difficulty: 2,
      prompt: 'Bring einen Self-Service-Antrag in die richtige Reihenfolge.',
      items: [
        { id: 'a', text: 'Benutzer stellt Antrag im Portal mit Begründung' },
        { id: 'b', text: 'Vorgesetzter genehmigt' },
        { id: 'c', text: 'Dateneigentümer genehmigt' },
        { id: 'd', text: 'Konnektor setzt die Gruppenmitgliedschaft im Zielsystem' },
        { id: 'e', text: 'Benutzer wird benachrichtigt, Vorgang ist protokolliert' },
      ],
      explanation: 'Mehrstufige Genehmigung ist üblich: erst Bedarf (Vorgesetzter), dann fachliche Freigabe (Dateneigentümer).',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Was ist eine Geschäftsrolle?',
      options: [
        { id: 'a', text: 'Ein Bündel technischer Berechtigungen, das zu einer Tätigkeit passt, z. B. „Buchhaltung Kreditoren“' },
        { id: 'b', text: 'Eine AD-Gruppe mit Bereich Global', whyWrong: 'Eine Geschäftsrolle ist eine fachliche Ebene darüber. Sie kann mehrere AD-Gruppen, Postfächer und App-Rechte bündeln.' },
        { id: 'c', text: 'Die Stellenbeschreibung aus dem HR-System', whyWrong: 'Die Stelle kann Grundlage sein, die Rolle selbst ist aber die Zuordnung zu Berechtigungen.' },
      ],
      correct: 'a',
      explanation: 'Geschäftsrolle → technische Berechtigungen in vielen Systemen.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Was prüft eine Funktionstrennungsregel (SoD)?',
      options: [
        { id: 'a', text: 'Dass unverträgliche Rechte nicht bei derselben Person zusammenkommen' },
        { id: 'b', text: 'Dass Admins getrennte Konten für Alltag und Verwaltung haben', whyWrong: 'Das ist eine gute Praxis für privilegierte Konten, aber keine Funktionstrennung im Sinne von SoD.' },
        { id: 'c', text: 'Dass Dateien in getrennten Ordnern liegen', whyWrong: 'SoD betrifft Kombinationen von Rechten, nicht die Ablagestruktur.' },
      ],
      correct: 'a',
      explanation: 'Klassisch: Bestellung anlegen + Bestellung freigeben, Lieferant anlegen + Zahlung freigeben.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Warum ist „Abnicken“ bei Rezertifizierungen ein Problem, und was hilft?',
      options: [
        { id: 'a', text: 'Unnötige Rechte bleiben bestehen. Hilfe: kleinere Kampagnen, Kontext wie letzte Nutzung, Hinweise auf ungewöhnliche Rechte' },
        { id: 'b', text: 'Es ist kein Problem, Hauptsache die Kampagne ist abgeschlossen', whyWrong: 'Dann ist die Rezertifizierung nur ein Formular. Auditoren erkennen das z. B. an 100 % Bestätigungen in Sekunden.' },
        { id: 'c', text: 'Rezertifizierungen abschaffen', whyWrong: 'Sie sind nach ISO 27001 und vielen Prüfungsstandards erwartet. Besser die Kampagnen verbessern.' },
      ],
      correct: 'a',
      explanation: 'Gute Rezertifizierung ist gezielt und verständlich, sonst wird sie zur Formsache.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Was macht der Abgleich (reconciliation) in einem IAM-System?',
      options: [
        { id: 'a', text: 'Er vergleicht den Ist-Zustand im Zielsystem mit dem Soll im IAM und meldet oder korrigiert Abweichungen.' },
        { id: 'b', text: 'Er gleicht Kennwörter zwischen Systemen ab.', whyWrong: 'Kennwortsynchronisation ist eine andere Funktion. Der Abgleich betrifft Konten und Berechtigungen.' },
        { id: 'c', text: 'Er sichert die Datenbank.', whyWrong: 'Sicherung ist Aufgabe des Backups. Der Abgleich vergleicht Soll und Ist.' },
      ],
      correct: 'a',
      explanation: 'So werden direkte Änderungen am IAM vorbei sichtbar.',
    },
    {
      id: 'q9', type: 'multi', difficulty: 2,
      prompt: 'Was gehört zu einem sauberen Leaver-Prozess?',
      options: [
        { id: 'a', text: 'Konto zum Austrittszeitpunkt deaktivieren' },
        { id: 'b', text: 'Gruppenmitgliedschaften und App-Rechte entziehen' },
        { id: 'c', text: 'Daten (Postfach, OneDrive) an Nachfolger oder Vorgesetzten übergeben' },
        { id: 'd', text: 'Konto aktiv lassen, falls der Mitarbeiter zurückkommt', whyWrong: 'Ein aktives Konto eines Ex-Mitarbeiters ist ein Sicherheitsrisiko. Bei Rückkehr wird neu bereitgestellt.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Deaktivieren, entziehen, übergeben, später nach Aufbewahrungsfrist löschen.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Welcher DSGVO-Artikel verlangt technische und organisatorische Maßnahmen zur Sicherheit der Verarbeitung?',
      options: [
        { id: 'a', text: 'Art. 32' },
        { id: 'b', text: 'Art. 15', whyWrong: 'Art. 15 ist das Auskunftsrecht der betroffenen Person.' },
        { id: 'c', text: 'Art. 17', whyWrong: 'Art. 17 ist das Recht auf Löschung („Recht auf Vergessenwerden“).' },
      ],
      correct: 'a',
      explanation: 'Zugriffskontrollen sind ein Kernbestandteil der TOM nach Art. 32.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Was verlangt NIS2 (Art. 21) unter anderem ausdrücklich?',
      options: [
        { id: 'a', text: 'Konzepte für die Zugriffskontrolle und den Einsatz von Multi-Faktor-Authentifizierung' },
        { id: 'b', text: 'Den Einsatz eines bestimmten IAM-Produkts', whyWrong: 'NIS2 schreibt keine Produkte vor, sondern Maßnahmen und Ergebnisse.' },
        { id: 'c', text: 'Dass alle Daten in der EU-Cloud liegen', whyWrong: 'Datenstandorte regelt NIS2 nicht in dieser Form. Es geht um Risikomanagement und Meldepflichten.' },
      ],
      correct: 'a',
      explanation: 'Art. 21 listet Mindestmaßnahmen, darunter Zugriffskontrolle, Personalsicherheit und MFA.',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Wie schnell verlangt NIS2 eine Frühwarnung bei einem erheblichen Sicherheitsvorfall?',
      options: [
        { id: 'a', text: 'Innerhalb von 24 Stunden' },
        { id: 'b', text: 'Innerhalb von 7 Tagen', whyWrong: 'Zu spät. Die Frühwarnung muss innerhalb von 24 Stunden kommen, eine ausführlichere Meldung innerhalb von 72 Stunden.' },
        { id: 'c', text: 'Gar nicht, nur bei Datenschutzverletzungen', whyWrong: 'NIS2 hat eigene Meldepflichten, unabhängig von den Meldepflichten der DSGVO.' },
      ],
      correct: 'a',
      explanation: '24 h Frühwarnung, 72 h Meldung, Abschlussbericht spätestens einen Monat danach.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Ein Bericht findet aktive AD-Konten, zu denen es im HR-System keine Person gibt. Was sind das?',
      options: [
        { id: 'a', text: 'Verwaiste Konten (oder nicht zugeordnete Dienst- und Testkonten)' },
        { id: 'b', text: 'Gastkonten aus Entra ID', whyWrong: 'Gäste liegen in Entra ID, nicht als normale AD-Konten. Hier geht es um Konten ohne verantwortliche Person.' },
        { id: 'c', text: 'Konten mit abgelaufenem Kennwort', whyWrong: 'Das Kennwortalter sagt nichts darüber, ob es eine zugehörige Person gibt.' },
      ],
      correct: 'a',
      explanation: 'Jedes Konto braucht eine verantwortliche Person. Sonst prüfen, deaktivieren, löschen.',
    },
    {
      id: 'q14', type: 'single', difficulty: 3,
      prompt: 'Ein Mitarbeiter wechselt die Abteilung, braucht aber noch zwei Wochen Zugriff auf alte Projektdaten zur Übergabe. Beste Lösung im IAM?',
      options: [
        { id: 'a', text: 'Alte Rolle entziehen und das nötige Einzelrecht befristet per Antrag mit Ablaufdatum vergeben' },
        { id: 'b', text: 'Alte Rolle einfach behalten', whyWrong: 'Dann bleibt alles, auch was er nicht mehr braucht, und das Entziehen wird meist vergessen.' },
        { id: 'c', text: 'Kollegen schicken ihm die Dateien per Mail', whyWrong: 'Das umgeht die Zugriffssteuerung und erzeugt unkontrollierte Kopien.' },
      ],
      correct: 'a',
      explanation: 'Befristung ist das Mittel gegen „vorübergehend“, das für immer bleibt.',
    },
    {
      id: 'q15', type: 'single', difficulty: 3,
      prompt: 'Ein Kunde will, dass sein IAM direkte AD-Änderungen nur meldet, nicht zurücksetzt. Welches Risiko besprichst du?',
      options: [
        { id: 'a', text: 'Abweichungen bleiben bestehen, bis jemand reagiert. Ohne klaren Prozess für die Meldungen entsteht wieder Wildwuchs.' },
        { id: 'b', text: 'Kein Risiko, Melden ist immer besser als Zurücksetzen', whyWrong: 'Melden ist schonender, setzt aber voraus, dass jemand die Meldungen bearbeitet. Sonst bleibt das Soll nur Theorie.' },
        { id: 'c', text: 'Das IAM-System funktioniert dann nicht mehr', whyWrong: 'Es funktioniert weiter. Es geht um die Wirksamkeit der Kontrolle.' },
      ],
      correct: 'a',
      explanation: 'Beides ist legitim. Entscheidend ist, wer Abweichungen wann bearbeitet.',
      domain: 'troubleshoot',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: '„Ein Mitarbeiter, der vor drei Wochen ausgetreten ist, hat sich gestern noch per VPN angemeldet. Wie kann das sein?“',
        steps: [
          {
            id: 's1', text: 'Was prüfst du zuerst im IAM-System?',
            options: [
              { id: 'a', text: 'Ob der Austritt im HR-System erfasst und vom IAM importiert wurde', correct: true, feedback: 'Richtig. Ohne Leaver-Ereignis aus dem führenden System passiert nichts automatisch.' },
              { id: 'b', text: 'Die VPN-Firmware', correct: false, feedback: 'Das VPN hat korrekt ein gültiges Konto angemeldet. Die Frage ist, warum das Konto noch gültig war.' },
            ],
          },
          {
            id: 's2', text: 'HR hat das Austrittsdatum erst gestern nachgetragen. Im IAM-Protokoll: „Leaver-Workflow gestartet, AD-Konto deaktiviert 06:00“. Was folgt daraus?',
            options: [
              { id: 'a', text: 'Das IAM hat korrekt gearbeitet. Ursache ist der verspätete HR-Eintrag (Prozesslücke).', correct: true, feedback: 'Genau. Technisch sauber, organisatorisch zu spät.' },
              { id: 'b', text: 'Der IAM-Konnektor ist defekt.', correct: false, feedback: 'Der Konnektor hat deaktiviert, sobald das Ereignis da war. Kein technischer Fehler.' },
            ],
          },
          {
            id: 's3', text: 'Was empfiehlst du?',
            options: [
              { id: 'a', text: 'Prozess mit HR schärfen (Austritte vor dem letzten Tag erfassen), Sofort-Deaktivierung für Notfälle, Anmeldungen des Kontos prüfen lassen, alles dokumentieren', correct: true, feedback: 'Richtig. Technik, Prozess und Sicherheitsprüfung zusammen.' },
              { id: 'b', text: 'Das IAM-System austauschen', correct: false, feedback: 'Das System hat funktioniert. Das Problem lag beim Prozess.' },
            ],
          },
        ],
        explanation: 'IAM ist nur so gut wie die Daten des führenden Systems. Viele Tickets sind Prozess-, nicht Technikfehler.',
        domain: 'troubleshoot',
      },
      {
        id: 'b2', type: 'single', difficulty: 2,
        prompt: 'Welche Kombination ist ein klassischer Funktionstrennungskonflikt?',
        options: [
          { id: 'a', text: 'Lieferanten anlegen und Zahlungen freigeben' },
          { id: 'b', text: 'E-Mails lesen und E-Mails senden', whyWrong: 'Das braucht jeder Mitarbeiter. Ein SoD-Konflikt betrifft Rechte, die zusammen Betrug ermöglichen.' },
          { id: 'c', text: 'Ordner lesen und Ordner durchsuchen', whyWrong: 'Beides sind Leserechte. Kein Konflikt.' },
        ],
        correct: 'a',
        explanation: 'Wer beides darf, kann einen Scheinlieferanten anlegen und an ihn zahlen.',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Ein Kunde hat 2.400 Mitarbeiter und 3.100 Geschäftsrollen. Was ist das Problem?',
        options: [
          { id: 'a', text: 'Rollenexplosion: Das Rollenmodell ist zu fein und nicht mehr verwaltbar.' },
          { id: 'b', text: 'Kein Problem, mehr Rollen bedeuten mehr Genauigkeit', whyWrong: 'Wenn es mehr Rollen als Mitarbeiter gibt, ist der Vorteil von Rollen (Bündelung, Übersicht) weg.' },
          { id: 'c', text: 'Zu wenige Rollen', whyWrong: 'Im Gegenteil, es sind viel zu viele.' },
        ],
        correct: 'a',
        explanation: 'Gegenmittel: Basisrollen nach Abteilung/Standort, Einzelrechte per Antrag statt Spezialrollen.',
      },
      {
        id: 'b4', type: 'single', difficulty: 2,
        prompt: 'Was ist der Hauptnutzen eines IAM-Systems im Audit?',
        options: [
          { id: 'a', text: 'Nachweis, wer wann welche Rechte hatte und wer sie genehmigt hat' },
          { id: 'b', text: 'Es ersetzt die Firewall.', whyWrong: 'IAM steuert Identitäten und Berechtigungen, nicht den Netzwerkverkehr.' },
          { id: 'c', text: 'Es verschlüsselt alle Dateien.', whyWrong: 'Verschlüsselung ist eine andere Schutzmaßnahme. IAM regelt, wer zugreifen darf.' },
        ],
        correct: 'a',
        explanation: 'Historie + Genehmigungen + Rezertifizierungsnachweise.',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'In an interview you are asked: "What is the difference between authentication and authorization in IAM?" Best answer?',
        options: [
          { id: 'a', text: 'Authentication verifies who you are, authorization decides what you are allowed to access.' },
          { id: 'b', text: 'They are the same thing.', whyWrong: 'They are two separate steps: first identity is verified, then permissions are checked.' },
          { id: 'c', text: 'Authorization verifies your password, authentication grants permissions.', whyWrong: 'This is reversed. Authentication = identity (e.g. password, MFA), authorization = permissions.' },
        ],
        correct: 'a',
        explanation: 'AuthN = who, AuthZ = what. IAM covers both plus lifecycle and governance.',
        domain: 'english',
      },
    ],
  },
};

export default level;
