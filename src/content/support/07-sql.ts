import type { Level } from '../../types/content';

// Beispiele in T-SQL (Microsoft SQL Server), weil viele IAM- und Windows-nahe Produkte darauf laufen.
const level: Level = {
  id: 'sup-07',
  track: 'support',
  order: 7,
  title: 'SQL für Berechtigungsdaten',
  titleEn: 'SQL for Permission Data',
  summary: 'Tabellen, SELECT, WHERE, ORDER BY, JOIN, GROUP BY und HAVING an einem Beispielschema mit Benutzern, Gruppen und Rechten. Dazu NULL-Fallen, die logische Reihenfolge einer Abfrage und wie man in Kundendatenbanken sicher und nur lesend analysiert.',
  certs: ['jobready'],
  domains: { jobready: 'scripting' },
  lab: {
    title: 'Eigene Rechte-Datenbank abfragen',
    needs: 'SQL Server Express oder Developer Edition und SQL Server Management Studio (beide kostenlos), alternativ eine Online-SQL-Übungsumgebung',
    steps: [
      'Lege die Tabellen `Users (Id, SamAccountName, Department, Enabled)`, `Groups (Id, Name)` und `Memberships (UserId, GroupId)` an und fülle sie mit je 5 bis 10 Zeilen.',
      'Frage alle aktiven Benutzer der Abteilung Vertrieb ab, sortiert nach Name.',
      'Verbinde die drei Tabellen mit JOIN und liste „Benutzer – Gruppe“ auf.',
      'Zähle mit GROUP BY, wie viele Mitglieder jede Gruppe hat, und zeige nur Gruppen mit mehr als 3 Mitgliedern (HAVING).',
      'Finde mit LEFT JOIN … WHERE … IS NULL alle Benutzer ohne Gruppe.',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: Tabellen und SELECT',
      body: `Viele Produkte, auch IAM-Systeme, speichern ihre Daten in einer **relationalen Datenbank**: Tabellen mit Zeilen (Datensätzen) und Spalten (Feldern). Im 2nd/3rd Level liest du dort nach, wenn die Oberfläche nicht genug zeigt.

Unser Beispielschema:

| Tabelle | Spalten |
|---|---|
| Users | Id, SamAccountName, Department, Enabled, LastLogon |
| Groups | Id, Name, Owner |
| Memberships | UserId, GroupId |

Jede Tabelle hat einen **Primärschlüssel** (\`Id\`), der eine Zeile eindeutig macht. \`Memberships\` verweist mit **Fremdschlüsseln** auf Users und Groups.

Die Grundform jeder Abfrage:
\`\`\`
SELECT SamAccountName, Department
FROM Users
WHERE Department = 'Vertrieb' AND Enabled = 1
ORDER BY SamAccountName;
\`\`\`
- \`SELECT\` = welche Spalten, \`*\` = alle (in großen Tabellen sparsam einsetzen).
- \`WHERE\` = welche Zeilen. Text in **einfachen** Anführungszeichen.
- \`LIKE 'm%'\` = beginnt mit m. \`%\` steht für beliebig viele Zeichen.
- \`ORDER BY … DESC\` = absteigend.
- \`SELECT TOP 10 …\` = nur die ersten 10 Zeilen (in MySQL/PostgreSQL: \`LIMIT 10\` am Ende).`,
      analogy: 'Eine Tabelle ist wie eine Excel-Liste mit festen Spalten. SELECT ist der Filter, den du oben in Excel setzt, nur dass du ihn als Satz hinschreibst.',
      terms: [
        { de: 'relationale Datenbank', en: 'relational database' },
        { de: 'Primärschlüssel', en: 'primary key' },
        { de: 'Fremdschlüssel', en: 'foreign key' },
        { de: 'Abfrage', en: 'query' },
      ],
      check: {
        id: 'c1', type: 'cli', shell: 'sql', difficulty: 1,
        prompt: 'Zeige alle deaktivierten Benutzer (`Enabled = 0`).',
        template: 'SELECT SamAccountName FROM Users {{0}} Enabled = 0;',
        blanks: [{ accept: ['WHERE'] }],
        explanation: 'WHERE filtert Zeilen. Bit-Spalten in SQL Server sind 0 oder 1.',
      },
      sources: [{ title: 'Microsoft Learn – SELECT (Transact-SQL)', url: 'https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql' }],
    },
    {
      heading: 'Fortgeschritten: JOIN – Tabellen verbinden',
      body: `Wer ist in welcher Gruppe? Die Antwort steht in drei Tabellen. **JOIN** verbindet sie über die Schlüssel:
\`\`\`
SELECT u.SamAccountName, g.Name AS Gruppe
FROM Users u
JOIN Memberships m ON m.UserId = u.Id
JOIN Groups g ON g.Id = m.GroupId
WHERE g.Name LIKE 'GG_%'
ORDER BY u.SamAccountName;
\`\`\`
- \`u\`, \`m\`, \`g\` sind **Aliasse**, damit es kurz bleibt.
- \`JOIN\` (= \`INNER JOIN\`) liefert nur Zeilen, die auf **beiden** Seiten einen Partner haben.
- \`LEFT JOIN\` liefert **alle** Zeilen der linken Tabelle, auch ohne Partner. Fehlende Werte sind dann \`NULL\`.

Damit findest du Lücken, z. B. Benutzer ohne jede Gruppe:
\`\`\`
SELECT u.SamAccountName
FROM Users u
LEFT JOIN Memberships m ON m.UserId = u.Id
WHERE m.UserId IS NULL;
\`\`\`

**NULL-Falle:** \`NULL\` heißt „unbekannt“. \`WHERE Department = NULL\` findet **nie** etwas. Richtig ist \`WHERE Department IS NULL\`. Auch \`Department <> 'Vertrieb'\` liefert keine Zeilen mit NULL.`,
      compare: {
        left: 'INNER JOIN', right: 'LEFT JOIN',
        rows: [
          ['nur Zeilen mit Partner auf beiden Seiten', 'alle Zeilen links, rechts ggf. NULL'],
          ['„Wer ist in welcher Gruppe?“', '„Wer ist in keiner Gruppe?“ (mit IS NULL)'],
          ['Benutzer ohne Gruppe fehlen im Ergebnis', 'Benutzer ohne Gruppe erscheinen mit NULL'],
        ],
      },
      terms: [
        { de: 'Verknüpfung', en: 'join' },
        { de: 'Alias', en: 'alias' },
        { de: 'Nullwert', en: 'NULL value' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: '`SELECT * FROM Users WHERE Department = NULL` liefert 0 Zeilen, obwohl es Benutzer ohne Abteilung gibt. Warum?',
        options: [
          { id: 'a', text: 'Vergleiche mit NULL ergeben nie wahr. Richtig ist `IS NULL`.' },
          { id: 'b', text: 'Die Tabelle ist gesperrt.', whyWrong: 'Bei einer Sperre würde die Abfrage warten oder einen Fehler melden, nicht leer zurückkommen.' },
          { id: 'c', text: 'Department ist ein Zahlenfeld.', whyWrong: 'Auch bei Zahlenfeldern gilt: NULL vergleicht man mit IS NULL.' },
        ],
        correct: 'a',
        explanation: 'NULL = unbekannt. Unbekannt = unbekannt ist auch unbekannt, also nicht wahr.',
      },
      sources: [{ title: 'Microsoft Learn – FROM clause plus JOIN (Transact-SQL)', url: 'https://learn.microsoft.com/en-us/sql/t-sql/queries/from-transact-sql' }],
    },
    {
      heading: 'Fortgeschritten: GROUP BY, HAVING und die Reihenfolge',
      body: `Für Berichte willst du zählen und zusammenfassen:
\`\`\`
SELECT g.Name, COUNT(*) AS Mitglieder
FROM Groups g
JOIN Memberships m ON m.GroupId = g.Id
GROUP BY g.Name
HAVING COUNT(*) > 50
ORDER BY Mitglieder DESC;
\`\`\`
- **Aggregatfunktionen:** \`COUNT\`, \`SUM\`, \`MIN\`, \`MAX\`, \`AVG\`.
- \`GROUP BY\` fasst Zeilen mit gleichem Wert zusammen. Jede Spalte im SELECT muss gruppiert oder aggregiert sein.
- \`WHERE\` filtert **Zeilen vor** dem Gruppieren, \`HAVING\` filtert **Gruppen danach**.
- \`COUNT(DISTINCT u.Department)\` zählt verschiedene Werte.

Die **logische Reihenfolge**, in der die Datenbank eine Abfrage auswertet, ist nicht die Schreibreihenfolge:

| Schritt | Klausel |
|---|---|
| 1 | FROM / JOIN |
| 2 | WHERE |
| 3 | GROUP BY |
| 4 | HAVING |
| 5 | SELECT |
| 6 | ORDER BY |

Darum kannst du einen Alias aus dem SELECT (z. B. \`Mitglieder\`) im ORDER BY nutzen, aber nicht im WHERE.`,
      terms: [
        { de: 'Aggregatfunktion', en: 'aggregate function' },
        { de: 'Gruppierung', en: 'grouping (GROUP BY)' },
      ],
      check: {
        id: 'c3', type: 'cli', shell: 'sql', difficulty: 2,
        prompt: 'Zeige nur Abteilungen mit mehr als 10 aktiven Benutzern.',
        template: 'SELECT Department, COUNT(*) AS Anzahl FROM Users WHERE Enabled = 1 {{0}} Department {{1}} COUNT(*) > 10;',
        blanks: [{ accept: ['GROUP BY'] }, { accept: ['HAVING'] }],
        explanation: 'WHERE vor dem Gruppieren (nur aktive), HAVING danach (nur große Abteilungen).',
      },
    },
    {
      heading: 'Profi: Sicher analysieren in Kundendatenbanken',
      body: `Im Support greifst du auf Datenbanken zu, die ein **Produktivsystem** tragen. Regeln, die dich und den Kunden schützen:

- **Nur lesen.** Nutze ein Konto mit Leserechten (in SQL Server z. B. die Datenbankrolle \`db_datareader\`). Ein lesendes Konto kann nichts kaputt machen.
- **Keine UPDATE-, DELETE- oder INSERT-Befehle** in der Produktdatenbank, außer der Hersteller gibt ein geprüftes Skript frei. Direkte Änderungen umgehen die Logik der Anwendung (Workflows, Protokolle, Abgleich) und können Daten inkonsistent machen.
- **Muss doch geändert werden** (z. B. nach Anweisung der Entwicklung): Vorher Backup, in einer Transaktion arbeiten, Ergebnis prüfen, erst dann bestätigen:
\`\`\`
BEGIN TRANSACTION;
UPDATE … WHERE Id = 4711;   -- betroffene Zeilen prüfen: 1?
-- passt: COMMIT;  passt nicht: ROLLBACK;
\`\`\`
- **Last beachten:** Große Abfragen ohne WHERE oder mit \`SELECT *\` über Millionen Zeilen können ein Produktivsystem bremsen. Erst mit \`TOP 100\` testen, gezielt filtern, Berichtsabfragen außerhalb der Hauptzeit.
- **Datenschutz:** Kundendaten sind personenbezogen. Nur abfragen, was für das Ticket nötig ist, Exporte nicht per Mail herumschicken, im Ticket keine ganzen Datensätze einfügen.
- **Dokumentieren:** Welche Abfrage, wann, mit welchem Ergebnis. So kann die Entwicklung nachvollziehen, was du gesehen hast.`,
      terms: [
        { de: 'Transaktion', en: 'transaction' },
        { de: 'nur lesender Zugriff', en: 'read-only access' },
        { de: 'Produktivsystem', en: 'production system' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Ein Kunde bittet dich, „schnell mal per SQL“ den Status eines hängenden Antrags in der IAM-Datenbank auf „genehmigt“ zu setzen. Was tust du?',
        options: [
          { id: 'a', text: 'Ablehnen, Ursache analysieren und über die Anwendung bzw. ein von der Entwicklung freigegebenes Vorgehen lösen' },
          { id: 'b', text: 'UPDATE ausführen, der Kunde hat es ja gewünscht', whyWrong: 'Direkte Änderungen umgehen Genehmigungslogik und Protokoll. Die Berechtigung wird dann womöglich nie gesetzt, und der Audit-Nachweis fehlt.' },
          { id: 'c', text: 'Die Tabelle leeren, damit der Antrag neu gestellt wird', whyWrong: 'Das löscht alle Anträge, nicht nur den einen. Ein massiver Datenverlust.' },
        ],
        correct: 'a',
        explanation: 'Status in der Datenbank ändern ≠ Prozess durchlaufen. Erst verstehen, warum er hängt.',
      },
      sources: [
        { title: 'Microsoft Learn – Database-level roles', url: 'https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/database-level-roles' },
        { title: 'Microsoft Learn – BEGIN TRANSACTION (Transact-SQL)', url: 'https://learn.microsoft.com/en-us/sql/t-sql/language-elements/begin-transaction-transact-sql' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'cli', shell: 'sql', difficulty: 1,
      prompt: 'Zeige Name und Abteilung aller Benutzer, sortiert nach Name.',
      template: '{{0}} SamAccountName, Department FROM Users {{1}} SamAccountName;',
      blanks: [{ accept: ['SELECT'] }, { accept: ['ORDER BY'] }],
      explanation: 'SELECT … FROM … ORDER BY. Ohne ORDER BY ist die Reihenfolge nicht garantiert.',
    },
    {
      id: 'q2', type: 'single', difficulty: 1,
      prompt: 'Was liefert `WHERE SamAccountName LIKE \'adm%\'`?',
      options: [
        { id: 'a', text: 'Alle Konten, deren Name mit „adm“ beginnt' },
        { id: 'b', text: 'Nur das Konto „adm%“', whyWrong: '`%` ist bei LIKE ein Platzhalter für beliebig viele Zeichen, kein Textzeichen.' },
        { id: 'c', text: 'Alle Konten, die „adm“ irgendwo enthalten', whyWrong: 'Dafür bräuchte man `%adm%`. Ohne `%` vorne muss der Name mit „adm“ beginnen.' },
      ],
      correct: 'a',
      explanation: '`%` = beliebig viele Zeichen, `_` = genau ein Zeichen.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Was ist ein Primärschlüssel?',
      options: [
        { id: 'a', text: 'Eine Spalte (oder Kombination), die jede Zeile eindeutig kennzeichnet' },
        { id: 'b', text: 'Das Kennwort der Datenbank', whyWrong: 'Mit Sicherheit hat der Begriff nichts zu tun. Er betrifft die Struktur der Tabelle.' },
        { id: 'c', text: 'Die erste Spalte jeder Tabelle', whyWrong: 'Die Position ist egal. Entscheidend ist, dass die Werte eindeutig und nicht NULL sind.' },
      ],
      correct: 'a',
      explanation: 'Fremdschlüssel in anderen Tabellen verweisen auf den Primärschlüssel.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Welche Abfrage findet Benutzer **ohne** Abteilung?',
      options: [
        { id: 'a', text: '`SELECT * FROM Users WHERE Department IS NULL`' },
        { id: 'b', text: '`SELECT * FROM Users WHERE Department = NULL`', whyWrong: 'Ein Vergleich mit = NULL ist nie wahr. Die Abfrage liefert immer 0 Zeilen.' },
        { id: 'c', text: '`SELECT * FROM Users WHERE Department = \'\'`', whyWrong: 'Das findet nur leere Texte, nicht NULL. Je nach Datenpflege fehlen dann viele Benutzer.' },
      ],
      correct: 'a',
      explanation: 'Wenn beides vorkommt: `WHERE Department IS NULL OR Department = \'\'`.',
    },
    {
      id: 'q5', type: 'cli', shell: 'sql', difficulty: 2,
      prompt: 'Verbinde Benutzer mit ihren Mitgliedschaften.',
      template: 'SELECT u.SamAccountName, m.GroupId FROM Users u {{0}} Memberships m {{1}} m.UserId = u.Id;',
      blanks: [{ accept: ['JOIN', 'INNER JOIN'] }, { accept: ['ON'] }],
      explanation: 'JOIN … ON gibt die Verknüpfungsbedingung an.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Du willst **alle** Benutzer sehen, auch die ohne Gruppe. Welcher JOIN?',
      options: [
        { id: 'a', text: '`Users LEFT JOIN Memberships`' },
        { id: 'b', text: '`Users INNER JOIN Memberships`', whyWrong: 'INNER JOIN lässt Benutzer ohne Mitgliedschaft weg.' },
        { id: 'c', text: 'Gar keinen, einfach beide Tabellen hintereinander nennen', whyWrong: '`FROM Users, Memberships` ohne Bedingung bildet jede Kombination (Kreuzprodukt). Das ist fast nie gewollt.' },
      ],
      correct: 'a',
      explanation: 'LEFT JOIN behält alle Zeilen der linken Tabelle.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Was ist der Unterschied zwischen WHERE und HAVING?',
      options: [
        { id: 'a', text: 'WHERE filtert Zeilen vor dem Gruppieren, HAVING filtert Gruppen danach.' },
        { id: 'b', text: 'Es gibt keinen, beide sind austauschbar.', whyWrong: 'Aggregatfunktionen wie COUNT(*) gehen nur in HAVING, weil sie erst nach dem Gruppieren feststehen.' },
        { id: 'c', text: 'HAVING ist die alte Schreibweise von WHERE.', whyWrong: 'Beide sind aktueller Standard mit unterschiedlicher Aufgabe.' },
      ],
      correct: 'a',
      explanation: 'Reihenfolge: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.',
    },
    {
      id: 'q8', type: 'ordering', difficulty: 3,
      prompt: 'Bring die Klauseln in die **logische** Reihenfolge, in der die Datenbank sie auswertet.',
      items: [
        { id: 'a', text: 'FROM / JOIN' },
        { id: 'b', text: 'WHERE' },
        { id: 'c', text: 'GROUP BY' },
        { id: 'd', text: 'HAVING' },
        { id: 'e', text: 'SELECT' },
        { id: 'f', text: 'ORDER BY' },
      ],
      explanation: 'Darum kennt WHERE keine Aliasse aus dem SELECT, ORDER BY aber schon.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Welche Abfrage zählt die Mitglieder pro Gruppe?',
      options: [
        { id: 'a', text: '`SELECT GroupId, COUNT(*) FROM Memberships GROUP BY GroupId`' },
        { id: 'b', text: '`SELECT GroupId, COUNT(*) FROM Memberships`', whyWrong: 'Ohne GROUP BY gibt es einen Fehler, weil GroupId weder gruppiert noch aggregiert ist.' },
        { id: 'c', text: '`SELECT COUNT(GroupId) FROM Memberships`', whyWrong: 'Das zählt alle Mitgliedschaften insgesamt, nicht pro Gruppe.' },
      ],
      correct: 'a',
      explanation: 'Jede Spalte im SELECT muss gruppiert oder aggregiert sein.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Welche Datenbankrolle in SQL Server gibt Lesezugriff auf alle Tabellen einer Datenbank?',
      options: [
        { id: 'a', text: '`db_datareader`' },
        { id: 'b', text: '`db_owner`', whyWrong: 'db_owner darf alles in der Datenbank, auch löschen und Rechte ändern. Für Analyse viel zu viel.' },
        { id: 'c', text: '`db_datawriter`', whyWrong: 'db_datawriter darf Daten ändern. Für eine reine Analyse unnötig und riskant.' },
      ],
      correct: 'a',
      explanation: 'Least Privilege gilt auch für Supportzugänge.',
      domain: 'iam',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Warum solltest du in einer Produktivdatenbank eine neue Abfrage zuerst mit `TOP 100` testen?',
      options: [
        { id: 'a', text: 'Eine ungefilterte Abfrage über Millionen Zeilen kann das System bremsen. Erst prüfen, ob Filter und JOINs stimmen.' },
        { id: 'b', text: 'Weil SQL Server sonst einen Fehler meldet', whyWrong: 'SQL Server liefert auch Millionen Zeilen, wenn man es verlangt. Genau das ist das Risiko.' },
        { id: 'c', text: 'Weil TOP die Ergebnisse sortiert', whyWrong: 'TOP begrenzt nur die Zeilenzahl. Ohne ORDER BY ist nicht festgelegt, welche Zeilen kommen.' },
      ],
      correct: 'a',
      explanation: 'Klein anfangen gilt für Abfragen genauso wie für Skripte.',
      domain: 'troubleshoot',
    },
    {
      id: 'q12', type: 'single', difficulty: 3,
      prompt: '`SELECT * FROM Users WHERE Department <> \'Vertrieb\'` liefert weniger Zeilen als erwartet. Was fehlt?',
      options: [
        { id: 'a', text: 'Benutzer mit Department NULL. Ergänzen: `OR Department IS NULL`' },
        { id: 'b', text: 'Ein ORDER BY', whyWrong: 'ORDER BY sortiert nur, es ändert nicht die Anzahl der Zeilen.' },
        { id: 'c', text: 'Ein DISTINCT', whyWrong: 'DISTINCT entfernt Duplikate, es würde eher weniger Zeilen liefern.' },
      ],
      correct: 'a',
      explanation: 'NULL <> \'Vertrieb\' ist nicht wahr, sondern unbekannt. Solche Zeilen fallen raus.',
    },
    {
      id: 'q13', type: 'cli', shell: 'sql', difficulty: 3,
      prompt: 'Finde Benutzer, die in **keiner** Gruppe sind.',
      template: 'SELECT u.SamAccountName FROM Users u {{0}} Memberships m ON m.UserId = u.Id WHERE m.UserId {{1}};',
      blanks: [{ accept: ['LEFT JOIN', 'LEFT OUTER JOIN'] }, { accept: ['IS NULL'] }],
      explanation: 'LEFT JOIN + IS NULL ist das Standardmuster für „hat keinen Partner“.',
    },
    {
      id: 'q14', type: 'multi', difficulty: 2,
      prompt: 'Welche Regeln gelten für Abfragen in einer Kunden-Produktivdatenbank?',
      options: [
        { id: 'a', text: 'Mit einem nur lesenden Konto arbeiten' },
        { id: 'b', text: 'Nur die Daten abfragen, die für das Ticket nötig sind' },
        { id: 'c', text: 'Abfragen und Ergebnisse im Ticket nachvollziehbar dokumentieren' },
        { id: 'd', text: 'Fehlerhafte Datensätze direkt per UPDATE korrigieren, das spart Zeit', whyWrong: 'Direkte Änderungen umgehen Anwendungslogik und Protokolle. Nur mit freigegebenem Skript, Backup und Transaktion.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Lesen ja, ändern nur kontrolliert. Datenschutz beachten.',
    },
    {
      id: 'q15', type: 'single', difficulty: 3,
      prompt: 'Die Entwicklung gibt dir ein UPDATE-Skript für genau einen Datensatz. Was ist der sichere Ablauf?',
      options: [
        { id: 'a', text: 'Backup bestätigen, `BEGIN TRANSACTION`, Skript ausführen, Anzahl betroffener Zeilen prüfen, dann `COMMIT` oder `ROLLBACK`' },
        { id: 'b', text: 'Skript ausführen und hoffen', whyWrong: 'Ohne Transaktion ist ein falsches WHERE sofort endgültig, z. B. wenn statt 1 Zeile 40.000 geändert werden.' },
        { id: 'c', text: 'Erst `COMMIT`, dann prüfen', whyWrong: 'Nach COMMIT ist die Änderung dauerhaft. Prüfen muss man vorher.' },
      ],
      correct: 'a',
      explanation: '„(1 row affected)“ erwartet? Dann COMMIT. Sonst ROLLBACK und mit der Entwicklung klären.',
      domain: 'troubleshoot',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: '„Im Bericht ‚Gruppenmitglieder‘ fehlen bei uns 12 Benutzer, die laut AD definitiv in GG_Einkauf sind.“\n\nDie Berichtsabfrage der Anwendung:\n```\nSELECT u.SamAccountName, g.Name\nFROM Users u\nJOIN Memberships m ON m.UserId = u.Id\nJOIN Groups g ON g.Id = m.GroupId\nWHERE u.Enabled = 1 AND u.Department <> \'Extern\'\n```',
        steps: [
          {
            id: 's1', text: 'Was prüfst du zuerst bei den 12 fehlenden Benutzern (lesend)?',
            options: [
              { id: 'a', text: 'Ihre Werte in `Users` (Enabled, Department) und ob sie in `Memberships` stehen', correct: true, feedback: 'Richtig. So siehst du, an welcher Bedingung sie hängen bleiben.' },
              { id: 'b', text: 'Die Tabelle Groups neu aufbauen', correct: false, feedback: 'Das wäre eine Änderung ohne Analyse. Erst lesen, dann verstehen.' },
            ],
          },
          {
            id: 's2', text: 'Alle 12 sind aktiv und in Memberships, haben aber `Department = NULL`. Warum fehlen sie?',
            options: [
              { id: 'a', text: '`NULL <> \'Extern\'` ist nicht wahr, also filtert WHERE sie heraus.', correct: true, feedback: 'Genau, die klassische NULL-Falle.' },
              { id: 'b', text: 'Der JOIN auf Groups schlägt fehl.', correct: false, feedback: 'Sie stehen in Memberships und die Gruppe existiert. Es liegt am WHERE.' },
            ],
          },
          {
            id: 's3', text: 'Wie gehst du weiter vor?',
            options: [
              { id: 'a', text: 'Bug an die Entwicklung mit Abfrage, Testdaten und Vorschlag `OR u.Department IS NULL`. Dem Kunden Ursache und Workaround nennen (Abteilung pflegen).', correct: true, feedback: 'Richtig. Produktfehler gehen sauber dokumentiert an die Entwicklung.' },
              { id: 'b', text: 'Beim Kunden per UPDATE allen 12 eine Abteilung eintragen', correct: false, feedback: 'Das kaschiert den Produktfehler und ändert Kundendaten ohne Freigabe.' },
            ],
          },
        ],
        explanation: 'Gute Bugmeldung: Abfrage, betroffene Daten, erwartetes vs. tatsächliches Ergebnis, Vorschlag.',
        domain: 'troubleshoot',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Welche Abfrage findet Gruppen mit mehr als 100 Mitgliedern, sortiert nach Größe?',
        options: [
          { id: 'a', text: '`SELECT GroupId, COUNT(*) AS n FROM Memberships GROUP BY GroupId HAVING COUNT(*) > 100 ORDER BY n DESC`' },
          { id: 'b', text: '`SELECT GroupId, COUNT(*) AS n FROM Memberships WHERE COUNT(*) > 100 GROUP BY GroupId`', whyWrong: 'Aggregatfunktionen sind im WHERE nicht erlaubt, weil WHERE vor dem Gruppieren läuft.' },
          { id: 'c', text: '`SELECT GroupId FROM Memberships ORDER BY COUNT(*) > 100`', whyWrong: 'Ohne GROUP BY wird nicht pro Gruppe gezählt, und eine Bedingung in ORDER BY filtert nichts.' },
        ],
        correct: 'a',
        explanation: 'Filter auf Aggregate gehört in HAVING.',
      },
      {
        id: 'b3', type: 'single', difficulty: 2,
        prompt: 'Was passiert bei `ROLLBACK` nach einem UPDATE in einer offenen Transaktion?',
        options: [
          { id: 'a', text: 'Alle Änderungen seit `BEGIN TRANSACTION` werden verworfen.' },
          { id: 'b', text: 'Die Änderungen werden gespeichert.', whyWrong: 'Speichern macht COMMIT. ROLLBACK verwirft.' },
          { id: 'c', text: 'Die Datenbank wird aus dem letzten Backup wiederhergestellt.', whyWrong: 'ROLLBACK betrifft nur die offene Transaktion, nicht das Backup.' },
        ],
        correct: 'a',
        explanation: 'Darum Änderungen immer in einer Transaktion und vor COMMIT prüfen.',
      },
      {
        id: 'b4', type: 'cli', shell: 'sql', difficulty: 3,
        prompt: 'Liste Benutzer mit ihrer Anzahl an Gruppen, nur die mit mehr als 20 Gruppen (Hinweis auf Rechteanhäufung).',
        template: 'SELECT u.SamAccountName, COUNT(*) AS Gruppen FROM Users u JOIN Memberships m ON m.UserId = u.Id {{0}} u.SamAccountName {{1}} COUNT(*) > 20;',
        blanks: [{ accept: ['GROUP BY'] }, { accept: ['HAVING'] }],
        explanation: 'Solche Auswertungen sind ein guter Start für eine gezielte Rezertifizierung.',
        domain: 'iam',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'A developer asks you: "Can you run a quick DELETE on the customer\'s production DB to remove the duplicate rows?" What is the professional answer?',
        options: [
          { id: 'a', text: '"Only with an approved script, a confirmed backup and inside a transaction. Please send me the script and the expected row count."' },
          { id: 'b', text: '"Sure, I\'ll do it right away."', whyWrong: 'Deleting in production without review, backup and transaction risks permanent data loss.' },
          { id: 'c', text: '"I\'ll truncate the table, that\'s faster."', whyWrong: 'TRUNCATE removes all rows, not only duplicates. That would be a disaster.' },
        ],
        correct: 'a',
        explanation: 'Production changes need review, backup, transaction and an expected result.',
        domain: 'english',
      },
    ],
  },
};

export default level;
