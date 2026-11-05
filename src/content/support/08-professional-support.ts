import type { Level } from '../../types/content';

const level: Level = {
  id: 'sup-08',
  track: 'support',
  order: 8,
  title: 'Professioneller 2nd/3rd Level Support',
  titleEn: 'Professional 2nd/3rd Level Support',
  summary: 'Support-Level und Eskalation, strukturierte Fehleranalyse, Logs lesen, Fehler reproduzieren, Tickets sauber dokumentieren, Bugreports für die Entwicklung schreiben und technisch klar kommunizieren, auf Deutsch und Englisch.',
  certs: ['jobready'],
  domains: { jobready: 'troubleshoot' },
  lab: {
    title: 'Einen echten Bugreport schreiben',
    needs: 'Eine beliebige Software, in der du einen Fehler oder ein unerwartetes Verhalten findest (z. B. aus einem Homelab), ein Texteditor',
    steps: [
      'Suche ein reproduzierbares Fehlverhalten und schreibe die genauen Schritte auf, bis es auftritt.',
      'Notiere Version, Betriebssystem, Zeitpunkt und erwartetes vs. tatsächliches Ergebnis.',
      'Suche im passenden Log (Ereignisanzeige, Anwendungslog) den Eintrag zum Zeitpunkt des Fehlers.',
      'Schreibe den Bugreport nach der Vorlage aus der Lektion, einmal auf Deutsch und einmal auf Englisch.',
      'Lass jemanden die Schritte nur anhand deines Reports nachstellen. Klappt es ohne Rückfrage?',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: Support-Level und deine Rolle',
      body: `Support ist meist in Stufen organisiert:

| Level | Aufgabe | Beispiel beim Softwarehersteller |
|---|---|---|
| 1st Level | annehmen, einordnen, Standardfälle lösen | Lizenzfrage, Link zur Doku |
| 2nd Level | tiefe technische Analyse beim Kunden | Konnektor schreibt nicht ins AD, Logs auswerten |
| 3rd Level | Produktfehler, Code-nahe Analyse, mit der Entwicklung | Bug im Produkt bestätigen, Workaround, Fix |

Beim Hersteller sind deine „Kunden“ oft selbst Administratoren. Sie erwarten, dass du ihre Umgebung (AD, Exchange, Fileserver, Microsoft 365) verstehst und zielgerichtete Fragen stellst.

Wichtige Begriffe:
- **SLA** (Service Level Agreement): vereinbarte Reaktions- und Lösungszeiten, oft nach **Priorität**.
- **Priorität** ergibt sich aus **Auswirkung** (wie viele betroffen, wie kritisch) und **Dringlichkeit** (wie schnell es schadet). Ein Ausfall aller Leaver-Prozesse ist dringender als ein Schönheitsfehler im Bericht.
- **Workaround:** vorübergehende Umgehung, bis die eigentliche Lösung da ist.
- **Ursachenanalyse** (root cause analysis): Warum ist es passiert, nicht nur wie ging es weg.`,
      terms: [
        { de: 'Servicevereinbarung', en: 'Service Level Agreement (SLA)' },
        { de: 'Auswirkung', en: 'impact' },
        { de: 'Dringlichkeit', en: 'urgency' },
        { de: 'Umgehungslösung', en: 'workaround' },
        { de: 'Ursachenanalyse', en: 'root cause analysis (RCA)' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Welches Ticket hat die höchste Priorität?',
        options: [
          { id: 'a', text: 'Seit heute Nacht werden keine Austritte mehr verarbeitet, ausgetretene Mitarbeiter sind weiter aktiv.' },
          { id: 'b', text: 'Ein Bericht zeigt Datumswerte im US-Format.', whyWrong: 'Lästig, aber kein Risiko und keine Blockade. Niedrige Priorität.' },
          { id: 'c', text: 'Ein Admin wünscht sich eine neue Spalte in der Übersicht.', whyWrong: 'Das ist ein Funktionswunsch, kein Störfall.' },
        ],
        correct: 'a',
        explanation: 'Hohe Auswirkung (Sicherheitsrisiko, viele Konten) und hohe Dringlichkeit (wird jede Stunde schlimmer).',
      },
    },
    {
      heading: 'Fortgeschritten: Strukturiert analysieren',
      body: `Gute Supporter raten nicht, sie **grenzen ein**. Ein bewährtes Vorgehen:

1. **Problem verstehen:** Was genau passiert? Was sollte passieren? Seit wann? Wer und wie viele sind betroffen? Was hat sich geändert (Update, neue GPO, Migration)?
2. **Fakten sammeln:** Fehlermeldung im Wortlaut, Screenshots, Zeitpunkt, Logs, Version des Produkts.
3. **Eingrenzen:** Betrifft es alle oder nur einige? Ein System oder alle? Immer oder nur manchmal? Was ist bei den Betroffenen anders?
4. **Hypothese bilden** und **gezielt prüfen**. Eine Änderung nach der anderen, nicht fünf gleichzeitig.
5. **Lösen** oder Workaround, **bestätigen lassen**.
6. **Dokumentieren** und ggf. vorbeugen.

**Reproduzieren** ist im 3rd Level Gold: Lässt sich der Fehler in einer Testumgebung nachstellen, kann die Entwicklung ihn beheben. Dafür brauchst du genaue Schritte, die Version und die Konfiguration.

**Logs lesen:**
- Zeitpunkt des Fehlers bestimmen und genau dort suchen. Zeitzonen beachten (Log in UTC, Kunde nennt Ortszeit?).
- Den **ersten** Fehler suchen, nicht den letzten. Folgefehler sind laut, die Ursache steht oft weiter oben.
- Stufen: Debug, Info, Warning, Error. Für die Analyse kann man das Log-Level vorübergehend erhöhen, danach wieder zurücksetzen.
- Typische Quellen bei Windows: Ereignisanzeige (System, Anwendung, Sicherheit), Anwendungslogs des Produkts, Dienst-Logs.`,
      analogy: 'Fehlersuche ist wie ein Arztbesuch: Erst fragen (Anamnese), dann gezielt untersuchen, dann Diagnose. Ein Arzt, der ohne Fragen fünf Medikamente gleichzeitig verschreibt, weiß hinterher nicht, welches geholfen hat.',
      terms: [
        { de: 'Eingrenzung', en: 'isolation / narrowing down' },
        { de: 'Hypothese', en: 'hypothesis' },
        { de: 'Reproduktion', en: 'reproduction (repro)' },
        { de: 'Protokollstufe', en: 'log level' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Ein Log zeigt um 02:00:14 „Connection to DC01 failed“, danach 300 Zeilen „Object not found“. Wo setzt du an?',
        options: [
          { id: 'a', text: 'Beim ersten Fehler: Verbindung zu DC01. Die 300 Meldungen sind wahrscheinlich Folgefehler.' },
          { id: 'b', text: 'Bei den 300 „Object not found“, weil es die meisten sind', whyWrong: 'Die Menge sagt nichts über die Ursache. Ohne Verbindung zum DC findet der Prozess natürlich keine Objekte.' },
          { id: 'c', text: 'Ganz am Ende des Logs', whyWrong: 'Am Ende stehen meist Folgen. Die Ursache steht beim ersten Fehler.' },
        ],
        correct: 'a',
        explanation: 'Erster Fehler = beste Spur. Dann prüfen: Warum war DC01 um 02:00 nicht erreichbar (Neustart, Updates, Netzwerk)?',
      },
    },
    {
      heading: 'Fortgeschritten: Dokumentation und Bugreport',
      body: `Ein Ticket ist erst fertig, wenn ein Kollege es ohne dich verstehen kann. **Ticketdokumentation** enthält:
- **Symptom:** was der Kunde meldet, mit Fehlermeldung im Wortlaut
- **Analyse:** was du geprüft hast und was dabei herauskam (auch, was es **nicht** war)
- **Ursache**
- **Lösung bzw. Workaround**
- **Prävention / nächste Schritte**

Wenn du einen **Produktfehler** vermutest, geht er an die Entwicklung. Ein guter **Bugreport**:

| Feld | Inhalt |
|---|---|
| Titel | kurz und konkret: „Konnektor AD: Gruppenmitgliedschaft wird bei Umlaut im CN nicht entfernt“ |
| Version / Umgebung | Produktversion, OS, Datenbank, betroffene Zielsysteme |
| Schritte zur Reproduktion | nummeriert, so genau, dass jemand Fremdes es nachstellen kann |
| Erwartet | was passieren sollte |
| Tatsächlich | was passiert, mit Fehlermeldung |
| Häufigkeit / Auswirkung | immer/manchmal, wie viele Kunden/Objekte, Workaround vorhanden? |
| Anhänge | Logs (ausgeschnitten auf den Zeitraum), Screenshots, Konfiguration |

Personenbezogene Daten in Logs vor dem Weitergeben **schwärzen** oder pseudonymisieren, wenn sie für die Analyse nicht nötig sind.

**Eskalieren** ist keine Niederlage, sondern ein Prozess. Eskaliere, wenn du die Analyse ausgeschöpft hast, ein Produktfehler wahrscheinlich ist oder das SLA gefährdet ist, und übergib so, dass niemand von vorne anfangen muss.`,
      terms: [
        { de: 'Fehlerbericht', en: 'bug report' },
        { de: 'Schritte zur Reproduktion', en: 'steps to reproduce' },
        { de: 'Eskalation', en: 'escalation' },
        { de: 'erwartetes Ergebnis', en: 'expected result' },
        { de: 'tatsächliches Ergebnis', en: 'actual result' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Welcher Bugreport-Titel ist am besten?',
        options: [
          { id: 'a', text: '„Fileserver-Konnektor: Rechte werden bei Pfaden über 260 Zeichen nicht gesetzt (Fehler 0x80070003)“' },
          { id: 'b', text: '„Geht nicht!!!“', whyWrong: 'Sagt nichts über Komponente, Verhalten oder Fehler. Die Entwicklung muss erst nachfragen.' },
          { id: 'c', text: '„Problem beim Kunden Müller“', whyWrong: 'Der Kundenname hilft der Entwicklung nicht, das Problem einzuordnen, und gehört nicht in einen Titel.' },
        ],
        correct: 'a',
        explanation: 'Komponente + Verhalten + Bedingung + Fehlercode. Daran erkennt man Duplikate und kann priorisieren.',
      },
    },
    {
      heading: 'Profi: Technische Kommunikation auf Deutsch und Englisch',
      body: `Beim Hersteller schreibst du mit Admins, Entwicklern und manchmal mit Managern, oft auf Englisch. Grundregeln:

- **Erst die Antwort, dann die Details.** Der Kunde will wissen: Was ist los, was muss er tun, wann ist es gelöst?
- **Konkrete Bitten** statt offener Fragen: „Bitte senden Sie das Log \`connector.log\` vom 12.03. zwischen 02:00 und 02:30“ statt „Können Sie Logs schicken?“
- **Kein Schuldzuweisen**, sachlich bleiben, auch wenn der Kunde verärgert ist.
- **Erwartungen steuern:** Nichts versprechen, was du nicht in der Hand hast („Die Entwicklung analysiert das, ich melde mich bis Donnerstag mit einem Zwischenstand“).
- **Abschluss bestätigen lassen,** bevor du das Ticket schließt.

Nützliche englische Formulierungen:

| Situation | Formulierung |
|---|---|
| Infos anfordern | Could you please send us the log files from … to …? |
| Zwischenstand | Quick update: we have reproduced the issue in our lab and handed it over to development. |
| Workaround | As a workaround, you can … until a fix is available. |
| Ursache | The root cause is … |
| Abschluss | Could you please confirm that the issue is resolved so we can close this ticket? |
| Eskalation | I'm escalating this to our 3rd level team, who will get back to you by … |

Im Interview kommt fast immer eine Frage wie „Walk me through how you would troubleshoot …“. Antworte strukturiert: verstehen, Fakten sammeln, eingrenzen, Hypothese prüfen, lösen, dokumentieren.`,
      terms: [
        { de: 'Zwischenstand', en: 'status update' },
        { de: 'Lösung bestätigen', en: 'confirm resolution' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Which sentence is the best status update to an upset customer admin?',
        options: [
          { id: 'a', text: '"We have reproduced the issue and our developers are working on a fix. Meanwhile you can use the workaround below. I will update you by Thursday."' },
          { id: 'b', text: '"It\'s probably your configuration."', whyWrong: 'Blames the customer without evidence and gives no next step.' },
          { id: 'c', text: '"We are looking into it."', whyWrong: 'Gives no information on progress, workaround or timeline. The customer will ask again.' },
        ],
        correct: 'a',
        explanation: 'Status + workaround + next update time.',
        domain: 'english',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'ordering', difficulty: 1,
      prompt: 'Bring die Schritte der strukturierten Fehleranalyse in die richtige Reihenfolge.',
      items: [
        { id: 'a', text: 'Problem verstehen (was, seit wann, wer, was hat sich geändert)' },
        { id: 'b', text: 'Fakten sammeln (Fehlermeldung, Logs, Version)' },
        { id: 'c', text: 'Eingrenzen und Hypothese bilden' },
        { id: 'd', text: 'Hypothese gezielt prüfen' },
        { id: 'e', text: 'Lösen und vom Kunden bestätigen lassen' },
        { id: 'f', text: 'Dokumentieren' },
      ],
      explanation: 'Verstehen → Fakten → eingrenzen → prüfen → lösen → dokumentieren.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 1,
      prompt: 'Welches Support-Level übernimmt typischerweise?',
      items: [
        { id: 'i1', text: 'Kunde fragt nach dem Link zur Installationsanleitung' },
        { id: 'i2', text: 'Konnektor-Log auswerten, warum Gruppen nicht gesetzt werden' },
        { id: 'i3', text: 'Bestätigter Fehler im Produkt-Code, Fix wird entwickelt' },
      ],
      buckets: [
        { id: 'l1', label: '1st Level' },
        { id: 'l2', label: '2nd Level' },
        { id: 'l3', label: '3rd Level' },
      ],
      solution: { i1: 'l1', i2: 'l2', i3: 'l3' },
      explanation: 'Je tiefer und produktnäher, desto höher das Level.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Was ist ein Workaround?',
      options: [
        { id: 'a', text: 'Eine vorübergehende Umgehung, bis die eigentliche Lösung verfügbar ist' },
        { id: 'b', text: 'Die endgültige Behebung des Fehlers', whyWrong: 'Das ist der Fix. Ein Workaround umgeht das Problem nur.' },
        { id: 'c', text: 'Eine Beschwerde beim Hersteller', whyWrong: 'Das wäre eine Eskalation durch den Kunden, kein Workaround.' },
      ],
      correct: 'a',
      explanation: 'Workaround immer dokumentieren und später durch den Fix ersetzen.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Ein Kunde meldet: „Seit dem Update gehen manche Workflows nicht.“ Welche Rückfrage grenzt am besten ein?',
      options: [
        { id: 'a', text: 'Welche Workflows genau, seit wann, mit welcher Fehlermeldung, und was haben die betroffenen gemeinsam?' },
        { id: 'b', text: 'Haben Sie es schon mit einem Neustart versucht?', whyWrong: 'Kann man später fragen, grenzt aber nichts ein. Admins empfinden das als Standardfloskel.' },
        { id: 'c', text: 'Welches Update meinen Sie?', whyWrong: 'Gute Teilfrage, aber allein grenzt sie nicht ein, welche Workflows betroffen sind und was sie gemeinsam haben.' },
      ],
      correct: 'a',
      explanation: '„Manche“ ist der Schlüssel: Was unterscheidet die betroffenen von den funktionierenden?',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Das Produktlog ist in UTC, der Kunde in Wien sagt „Fehler um 14:30 im Sommer“. Wo suchst du im Log?',
      options: [
        { id: 'a', text: 'Um 12:30 UTC (Sommerzeit = UTC+2)' },
        { id: 'b', text: 'Um 14:30 UTC', whyWrong: 'Dann suchst du zwei Stunden zu spät. Wien hat im Sommer UTC+2.' },
        { id: 'c', text: 'Um 16:30 UTC', whyWrong: 'Falsche Richtung: Ortszeit minus Abstand ergibt UTC.' },
      ],
      correct: 'a',
      explanation: 'MESZ = UTC+2, MEZ (Winter) = UTC+1. Im Ticket immer mit Zeitzone notieren.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Warum ändert man bei der Fehlersuche nur eine Sache auf einmal?',
      options: [
        { id: 'a', text: 'Sonst weiß man nicht, welche Änderung gewirkt hat oder einen neuen Fehler verursacht hat.' },
        { id: 'b', text: 'Weil mehrere Änderungen technisch nicht möglich sind', whyWrong: 'Möglich ist es schon, aber man verliert die Aussagekraft.' },
        { id: 'c', text: 'Weil es Vorschrift im SLA ist', whyWrong: 'SLAs regeln Zeiten, nicht die Methode. Es ist schlicht gute Praxis.' },
      ],
      correct: 'a',
      explanation: 'Und jede Änderung protokollieren, damit man sie zurücknehmen kann.',
    },
    {
      id: 'q7', type: 'multi', difficulty: 2,
      prompt: 'Was gehört in einen guten Bugreport an die Entwicklung?',
      options: [
        { id: 'a', text: 'Produktversion und Umgebung' },
        { id: 'b', text: 'Nummerierte Schritte zur Reproduktion' },
        { id: 'c', text: 'Erwartetes und tatsächliches Ergebnis' },
        { id: 'd', text: 'Das komplette Log der letzten drei Monate ungefiltert', whyWrong: 'Das ist kaum auswertbar und enthält unnötig viele personenbezogene Daten. Den relevanten Zeitraum ausschneiden.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Dazu Häufigkeit, Auswirkung, Workaround und passende Logauszüge.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Wann eskalierst du an den 3rd Level?',
      options: [
        { id: 'a', text: 'Wenn deine Analyse ausgeschöpft ist, ein Produktfehler wahrscheinlich ist oder das SLA gefährdet ist' },
        { id: 'b', text: 'Sofort bei jedem neuen Ticket', whyWrong: 'Dann ist der 3rd Level überlastet, und einfache Fälle dauern länger.' },
        { id: 'c', text: 'Nie, das wirkt inkompetent', whyWrong: 'Rechtzeitiges Eskalieren ist professionell. Zu spätes Eskalieren gefährdet SLA und Kundenzufriedenheit.' },
      ],
      correct: 'a',
      explanation: 'Mit vollständiger Übergabe: was geprüft, was ausgeschlossen, welche Logs.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Du schickst Logs an die Entwicklung. Darin stehen Namen und E-Mail-Adressen von Mitarbeitern des Kunden. Was tust du?',
      options: [
        { id: 'a', text: 'Nur den nötigen Ausschnitt senden und personenbezogene Daten schwärzen, wenn sie für die Analyse nicht gebraucht werden' },
        { id: 'b', text: 'Alles unverändert schicken, ist ja intern', whyWrong: 'Auch intern gilt Datenminimierung. Nur so viel Personenbezug, wie für die Analyse nötig ist.' },
        { id: 'c', text: 'Gar keine Logs schicken', whyWrong: 'Ohne Logs kann die Entwicklung oft nicht analysieren. Richtig ist, sie datensparsam aufzubereiten.' },
      ],
      correct: 'a',
      explanation: 'DSGVO-Grundsatz der Datenminimierung gilt auch im Support.',
      domain: 'iam',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Was gehört in die Ticketdokumentation, auch wenn es „nichts gebracht“ hat?',
      options: [
        { id: 'a', text: 'Geprüfte und ausgeschlossene Ursachen' },
        { id: 'b', text: 'Nichts, nur die Lösung zählt', whyWrong: 'Was ausgeschlossen ist, spart dem nächsten Kollegen Zeit und verhindert doppelte Prüfungen.' },
        { id: 'c', text: 'Die private Meinung über den Kunden', whyWrong: 'Unprofessionell, und Tickets können vom Kunden eingesehen oder bei Audits gelesen werden.' },
      ],
      correct: 'a',
      explanation: 'Auch Negativbefunde sind Analyseergebnisse.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Which phrase politely asks a customer for logs?',
      options: [
        { id: 'a', text: '"Could you please send us the connector log from March 12, 02:00 to 02:30 UTC?"' },
        { id: 'b', text: '"Send logs."', whyWrong: 'Too short and unclear: which logs, which time range?' },
        { id: 'c', text: '"We need everything you have."', whyWrong: 'Unspecific requests lead to huge, unusable uploads and delay the analysis.' },
      ],
      correct: 'a',
      explanation: 'Polite, specific file, specific time range, time zone.',
      domain: 'english',
    },
    {
      id: 'q12', type: 'dragdrop', difficulty: 2,
      prompt: 'Match the English terms to their German meaning.',
      items: [
        { id: 'i1', text: 'root cause' },
        { id: 'i2', text: 'steps to reproduce' },
        { id: 'i3', text: 'expected result' },
        { id: 'i4', text: 'workaround' },
      ],
      buckets: [
        { id: 'rc', label: 'Grundursache' },
        { id: 'str', label: 'Schritte zur Reproduktion' },
        { id: 'exp', label: 'erwartetes Ergebnis' },
        { id: 'wa', label: 'Umgehungslösung' },
      ],
      solution: { i1: 'rc', i2: 'str', i3: 'exp', i4: 'wa' },
      explanation: 'Diese Begriffe kommen in jedem Bugreport und jedem englischen Ticket vor.',
      domain: 'english',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Wie ergibt sich die Priorität eines Tickets?',
      options: [
        { id: 'a', text: 'Aus Auswirkung und Dringlichkeit' },
        { id: 'b', text: 'Aus der Lautstärke des Anrufers', whyWrong: 'Emotion ist ein Signal, aber kein Maßstab. Priorität folgt Auswirkung und Dringlichkeit.' },
        { id: 'c', text: 'Aus der Reihenfolge des Eingangs', whyWrong: 'Wer zuerst kommt, ist nicht automatisch am wichtigsten. Ein Ausfall geht vor einer Schönheitskorrektur.' },
      ],
      correct: 'a',
      explanation: 'Viele Helpdesk-Tools rechnen das über eine Matrix aus.',
    },
    {
      id: 'q14', type: 'single', difficulty: 3,
      prompt: 'Ein Fehler tritt nur bei einem Kunden auf und lässt sich im Labor nicht nachstellen. Was ist der nächste sinnvolle Schritt?',
      options: [
        { id: 'a', text: 'Unterschiede der Kundenumgebung zum Labor sammeln (Versionen, Konfiguration, Datenmengen, Sonderzeichen) und das Log-Level beim Kunden vorübergehend erhöhen' },
        { id: 'b', text: 'Ticket schließen, weil nicht reproduzierbar', whyWrong: 'Der Kunde hat weiter das Problem. „Nicht reproduzierbar“ heißt, es fehlt noch eine Bedingung.' },
        { id: 'c', text: 'Dem Kunden eine Neuinstallation empfehlen', whyWrong: 'Das ist aufwendig, riskant und erklärt die Ursache nicht. Der Fehler kann danach wiederkommen.' },
      ],
      correct: 'a',
      explanation: 'Danach das Log-Level wieder zurücksetzen, sonst wachsen Logs und Performance leidet.',
    },
    {
      id: 'q15', type: 'single', difficulty: 3,
      prompt: 'Ein verärgerter Kunde schreibt in Großbuchstaben, euer Produkt sei „Schrott“. Wie antwortest du?',
      options: [
        { id: 'a', text: 'Sachlich: Verständnis für die Lage zeigen, konkret sagen, was du als Nächstes prüfst, und wann er von dir hört' },
        { id: 'b', text: 'Genauso scharf zurückschreiben', whyWrong: 'Eskaliert die Lage und schadet der Kundenbeziehung. Professionell bleiben.' },
        { id: 'c', text: 'Nicht antworten, bis er sich beruhigt hat', whyWrong: 'Funkstille verstärkt den Ärger und gefährdet das SLA.' },
      ],
      correct: 'a',
      explanation: 'Hinter dem Ärger steht meist Druck vom eigenen Management. Ein klarer Plan entlastet ihn.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: '„Nach dem Update auf Version 6.2 werden bei uns keine Mitglieder mehr aus Gruppen mit Umlaut im Namen entfernt (z. B. GG_Büro). Andere Gruppen gehen.“',
        steps: [
          {
            id: 's1', text: 'Was tust du zuerst?',
            options: [
              { id: 'a', text: 'Im Labor mit Version 6.2 eine Gruppe mit Umlaut anlegen und das Entfernen nachstellen', correct: true, feedback: 'Richtig. Der Kunde liefert schon eine klare Bedingung (Umlaut, seit 6.2). Ideal zum Reproduzieren.' },
              { id: 'b', text: 'Dem Kunden raten, Gruppen ohne Umlaut neu anzulegen', correct: false, feedback: 'Das wäre ein Workaround ohne Analyse. Erst nachstellen.' },
            ],
          },
          {
            id: 's2', text: 'Im Labor reproduzierbar. Log: `RemoveMember failed: Object CN=GG_B?ro not found`. Was ist die wahrscheinliche Ursache?',
            options: [
              { id: 'a', text: 'Ein Kodierungsfehler: Der Umlaut wird beim Entfernen falsch übergeben (`?` statt `ü`).', correct: true, feedback: 'Genau. Das Fragezeichen ist das typische Zeichen für eine falsche Zeichenkodierung.' },
              { id: 'b', text: 'Die Gruppe wurde im AD gelöscht.', correct: false, feedback: 'Im Labor existiert sie. Der Name kommt verstümmelt an.' },
            ],
          },
          {
            id: 's3', text: 'Wie geht es weiter?',
            options: [
              { id: 'a', text: 'Bugreport an die Entwicklung (Version, Repro-Schritte, erwartet/tatsächlich, Logauszug). Dem Kunden Zwischenstand und Workaround (Mitglieder vorübergehend manuell entfernen und dokumentieren) geben.', correct: true, feedback: 'Richtig. Entwicklung bekommt alles für den Fix, Kunde kann weiterarbeiten.' },
              { id: 'b', text: 'Dem Kunden ein Downgrade auf 6.1 empfehlen, ohne Entwicklung zu informieren', correct: false, feedback: 'Andere Kunden hätten denselben Fehler, und ein Downgrade kann eigene Risiken haben. Die Entwicklung muss Bescheid wissen.' },
            ],
          },
        ],
        explanation: 'Klare Bedingung → reproduzieren → Bugreport → Workaround + Kommunikation.',
      },
      {
        id: 'b2', type: 'single', difficulty: 2,
        prompt: 'Was ist bei einer Eskalation an den 3rd Level am wichtigsten?',
        options: [
          { id: 'a', text: 'Eine vollständige Übergabe: Symptom, bisherige Analyse, ausgeschlossene Ursachen, Logs, Kundenumgebung' },
          { id: 'b', text: 'Möglichst schnell weiterleiten, Details klärt der 3rd Level selbst', whyWrong: 'Dann fragt der 3rd Level alles noch einmal beim Kunden ab. Das kostet Zeit und Vertrauen.' },
          { id: 'c', text: 'Den Kunden bitten, selbst beim 3rd Level anzurufen', whyWrong: 'Die Übergabe ist Aufgabe des Supports, nicht des Kunden.' },
        ],
        correct: 'a',
        explanation: 'Niemand soll von vorne anfangen müssen.',
      },
      {
        id: 'b3', type: 'single', difficulty: 2,
        prompt: 'Ein Kunde will das Ticket offen lassen, „falls es wieder auftritt“. Was ist professionell?',
        options: [
          { id: 'a', text: 'Lösung bestätigen lassen, Ticket mit klarer Dokumentation schließen und erklären, wie er es bei Bedarf wieder öffnet' },
          { id: 'b', text: 'Ticket ewig offen lassen', whyWrong: 'Offene Tickets ohne Aktivität verfälschen Kennzahlen und gehen im Alltag unter.' },
          { id: 'c', text: 'Ohne Rückmeldung schließen', whyWrong: 'Ohne Bestätigung weiß niemand, ob das Problem wirklich gelöst ist.' },
        ],
        correct: 'a',
        explanation: 'Klare Absprache schafft Vertrauen.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'In an interview: "Walk me through how you would troubleshoot a user who cannot access a file share." Which answer structure is best?',
        options: [
          { id: 'a', text: 'Clarify the exact error and scope, check the user\'s group membership and token, check share and NTFS permissions, test with a known-good user, fix, verify and document.' },
          { id: 'b', text: 'Give the user full control and close the ticket.', whyWrong: 'This violates least privilege and does not find the root cause.' },
          { id: 'c', text: 'Restart the file server.', whyWrong: 'A restart affects everyone, is not a diagnosis and rarely fixes permission issues.' },
        ],
        correct: 'a',
        explanation: 'Interviewers value a structured approach more than a single quick fix.',
        domain: 'english',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'Welche Information hilft der Entwicklung am meisten bei einem sporadischen Fehler?',
        options: [
          { id: 'a', text: 'Genaue Zeitpunkte mehrerer Vorkommen samt Logauszügen und was zu diesen Zeiten sonst lief' },
          { id: 'b', text: '„Passiert manchmal“', whyWrong: 'Ohne Zeitpunkte kann niemand im Log suchen oder Muster erkennen.' },
          { id: 'c', text: 'Ein Screenshot vom Desktop', whyWrong: 'Zeigt meist nicht den Fehler und keine Zeitpunkte.' },
        ],
        correct: 'a',
        explanation: 'Muster erkennen: immer nachts? Immer nach Backup? Immer bei großen Gruppen?',
      },
    ],
  },
};

export default level;
