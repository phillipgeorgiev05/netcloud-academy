import type { Level } from '../../types/content';

// Grundlagen NTFS/Freigabe, Vererbung, Kopieren/Verschieben, ABE und icacls stehen in C2 (fisi-02). Hier: Praxis und Fehlersuche.
const level: Level = {
  id: 'sup-02',
  track: 'support',
  order: 2,
  title: 'Fileserver & effektive Rechte',
  titleEn: 'File Server Permissions and DFS',
  summary: 'Effektive Rechte sicher berechnen, erweiterte NTFS-Rechte und „Anwenden auf“, ERSTELLER-BESITZER, verwaiste SIDs, die UAC-Falle für Admins, DFS-Namespaces und DFS-Replikation sowie die typischen Rechtefehler aus Tickets.',
  certs: ['jobready'],
  domains: { jobready: 'perm' },
  lab: {
    title: 'Effektive Rechte nachstellen',
    needs: 'Test-Domäne `lab.local` mit Fileserver-Rolle (darf der DC sein), ein Testbenutzer',
    steps: [
      'Lege `D:\\Daten\\Projekte` an und gib ihn als `Projekte` frei (Freigabe: Authentifizierte Benutzer – Ändern).',
      'Erstelle `DL_Projekte_R` (Lesen) und `DL_Projekte_RW` (Ändern). Deaktiviere die Vererbung am Ordner und setze nur diese beiden Gruppen plus Administratoren und SYSTEM.',
      'Nimm den Testbenutzer in `DL_Projekte_R` auf. Prüfe unter Eigenschaften → Sicherheit → Erweitert → Effektiver Zugriff, was er darf.',
      'Melde dich als Testbenutzer an und prüfe, dass er lesen, aber keine Datei anlegen kann. Wechsle ihn in `DL_Projekte_RW`, melde ihn neu an und teste erneut.',
      'Sichere die ACL mit `icacls D:\\Daten\\Projekte /save C:\\acl-backup.txt /t` und sieh dir die Datei an.',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: Effektive Rechte in vier Schritten',
      body: `Die Regeln kennst du aus C2 (**Freigabeberechtigung**, **NTFS-Berechtigung**, **Vererbung**). Im Support musst du sie schnell und fehlerfrei **anwenden**. Mit diesem Schema klappt das jedes Mal:

1. **Gruppen des Benutzers sammeln:** direkte und verschachtelte, plus „Jeder“ und „Authentifizierte Benutzer“.
2. **NTFS auswerten:** Alle Zulassen-Einträge der Gruppen **addieren**. Dann Verweigern abziehen. Explizites Verweigern schlägt alles, ein **explizites** Zulassen schlägt aber ein **geerbtes** Verweigern.
3. **Freigabe auswerten:** genauso addieren (dort gibt es nur Lesen, Ändern, Vollzugriff).
4. **Kombinieren:** Über das Netzwerk gilt das **strengere** von beiden. Lokal (RDP auf den Server) nur NTFS.

**Beispiel:** Max ist in \`GG_Vertrieb\` und \`GG_Praktikanten\`.
| Ebene | Einträge | Ergebnis |
|---|---|---|
| Freigabe | Authentifizierte Benutzer: Ändern | Ändern |
| NTFS | DL_Angebote_RW: Ändern (über GG_Vertrieb), GG_Praktikanten: Verweigern Schreiben | Lesen + Löschen, kein Schreiben |
| effektiv übers Netz | strengeres aus Ändern und „Ändern minus Schreiben“ | kann lesen, nicht speichern |

Windows rechnet das auch selbst: **Eigenschaften → Sicherheit → Erweitert → Effektiver Zugriff**. Dort wählst du einen Benutzer und siehst jedes Einzelrecht. Die Freigabeberechtigungen prüfst du zusätzlich getrennt (Freigabe → Erweiterte Freigabe → Berechtigungen).

Unten im Trainer kannst du das mit Zufallsaufgaben üben.`,
      analogy: 'Effektive Rechte sind wie ein Zollformular: Erst alles zusammenzählen, was du dabeihast (Zulassen addieren), dann die verbotenen Sachen abgeben (Verweigern), und an der Grenze (Netzwerk) gilt zusätzlich die strengere Regel des Nachbarlands (Freigabe).',
      terms: [
        { de: 'effektiver Zugriff', en: 'effective access' },
        { de: 'explizite Berechtigung', en: 'explicit permission' },
        { de: 'geerbte Berechtigung', en: 'inherited permission' },
      ],
      check: { id: 'c1', type: 'generated', generator: 'ntfs', difficulty: 2 },
      sources: [{ title: 'Microsoft Learn – Access control overview', url: 'https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control' }],
    },
    {
      heading: 'Fortgeschritten: Erweiterte Rechte, „Anwenden auf“ und ERSTELLER-BESITZER',
      body: `Die Standardrechte (Lesen, Ändern …) sind Bündel aus **erweiterten Berechtigungen** (special permissions). Im Support begegnen dir vor allem:

| erweitertes Recht | Bedeutung |
|---|---|
| **Ordner durchsuchen / Datei ausführen** | durch einen Ordner hindurch in Unterordner gehen |
| **Ordner auflisten / Daten lesen** | Inhalt sehen bzw. Datei lesen |
| **Dateien erstellen / Daten schreiben** | neue Dateien anlegen bzw. ändern |
| **Unterordner und Dateien löschen** | Inhalte löschen, auch ohne Löschrecht auf der Datei selbst |
| **Berechtigungen ändern** | ACL bearbeiten |
| **Besitz übernehmen** | Besitzer werden |

**„Anwenden auf“** (applies to) entscheidet, wohin ein Eintrag vererbt wird: „Nur diesen Ordner“, „Diesen Ordner, Unterordner und Dateien“, „Nur Dateien“ … Ein sehr häufiger Fehler: Ein Recht wurde nur auf „Diesen Ordner“ gesetzt, also sehen Benutzer den Ordner, können aber die Dateien darin nicht öffnen.

Ein klassisches Muster für Projektablagen: Benutzer sollen **eigene Dateien** ändern, fremde nur lesen. Dafür nutzt man **ERSTELLER-BESITZER** (CREATOR OWNER): Ein Eintrag für diese Spezialidentität wird bei neuen Dateien durch die SID des Erstellers ersetzt.

**Durchsuchen übergehen:** Standardmäßig hat „Jeder“ das Benutzerrecht „Auslassen der durchsuchenden Überprüfung“ (bypass traverse checking). Wer den vollen Pfad kennt, kommt deshalb in einen Unterordner, auf den er Rechte hat, auch ohne Rechte auf die Ordner darüber. Das überrascht viele Admins.`,
      terms: [
        { de: 'erweiterte Berechtigung', en: 'special permission' },
        { de: 'Anwenden auf', en: 'applies to' },
        { de: 'ERSTELLER-BESITZER', en: 'CREATOR OWNER' },
        { de: 'Auslassen der durchsuchenden Überprüfung', en: 'bypass traverse checking' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Benutzer sehen im Ordner `Angebote` alle Dateien, bekommen beim Öffnen aber „Zugriff verweigert“. Der Eintrag `DL_Angebote_R: Lesen` gilt für „Nur diesen Ordner“. Was ist falsch?',
        options: [
          { id: 'a', text: 'Der Eintrag wird nicht an die Dateien vererbt. „Anwenden auf“ muss „Diesen Ordner, Unterordner und Dateien“ sein.' },
          { id: 'b', text: 'Lesen reicht nicht zum Öffnen, man braucht Ändern.', whyWrong: 'Zum Öffnen reicht Lesen völlig. Das Problem ist, dass das Leserecht nur am Ordner selbst gilt und nicht an den Dateien darin.' },
          { id: 'c', text: 'Die Freigabe ist defekt.', whyWrong: 'Die Benutzer kommen über die Freigabe in den Ordner und sehen die Dateien. Es fehlt das NTFS-Recht auf die Dateien selbst.' },
        ],
        correct: 'a',
        explanation: '„Nur diesen Ordner“ = Inhalt sichtbar, Dateien selbst ohne Recht. In `icacls` fehlen dann die Flags `(OI)(CI)`.',
      },
      sources: [{ title: 'Microsoft Learn – icacls', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls' }],
    },
    {
      heading: 'Fortgeschritten: Typische Rechtefehler aus Tickets',
      body: `Diese Fälle kommen im 2nd Level immer wieder:

- **Neue Gruppe wirkt nicht:** Token veraltet, ab- und anmelden (siehe Modul 1).
- **Admin bekommt „Sie verfügen zurzeit nicht über die Berechtigung“:** Die **Benutzerkontensteuerung** (UAC) filtert das Admin-Token. Rechte über die Gruppe „Administratoren“ zählen im Explorer dann nicht. Klickt der Admin auf „Fortsetzen“, trägt Windows **sein persönliches Konto** dauerhaft in die ACL jedes Ordners ein. Besser: Admins über eine eigene Gruppe (z. B. \`DL_FS_Admins\`) berechtigen oder per \`icacls\`/PowerShell aus einer erhöhten Konsole arbeiten.
- **Verwaiste SIDs:** In der ACL steht \`S-1-5-21-…-1107\` statt eines Namens. Das Konto oder die Gruppe wurde gelöscht. Harmlos, aber ein Zeichen für direkte Benutzerberechtigungen. Aufräumen, und künftig nur Gruppen berechtigen.
- **Vererbung unterbrochen:** Ein Unterordner hat eigene Rechte, neue Gruppen kommen dort nicht an. Mit \`icacls ordner\` erkennst du geerbte Einträge an \`(I)\`.
- **Datei verschoben, Rechte „falsch“:** Verschieben auf demselben Laufwerk behält die alten expliziten Rechte (C2).
- **Pfad zu lang:** Viele Programme und der Explorer scheitern bei Pfaden über **260 Zeichen**. Tiefe Ordnerstrukturen und lange Namen vermeiden.
- **Datei gesperrt:** „Die Datei wird von einem anderen Prozess verwendet“. In der Computerverwaltung → Freigegebene Ordner → **Geöffnete Dateien** sieht man, wer sie geöffnet hat (PowerShell: \`Get-SmbOpenFile\`).

**Rechte sichern, bevor du änderst:** \`icacls D:\\Daten /save acl.txt /t\` speichert alle ACLs, \`/restore\` spielt sie zurück. Eine falsche Rechteänderung auf einem großen Ordnerbaum ist sonst schwer rückgängig zu machen.`,
      terms: [
        { de: 'Benutzerkontensteuerung', en: 'User Account Control (UAC)' },
        { de: 'verwaiste SID', en: 'orphaned SID' },
        { de: 'geöffnete Dateien', en: 'open files' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'In der ACL eines Ordners steht nur `S-1-5-21-3623811015-3361044348-30300820-1107: (M)`. Was bedeutet das?',
        options: [
          { id: 'a', text: 'Das berechtigte Konto oder die Gruppe existiert nicht mehr, die SID lässt sich nicht in einen Namen auflösen.' },
          { id: 'b', text: 'Ein Hacker hat sich Rechte gegeben.', whyWrong: 'Eine nicht auflösbare SID ist fast immer ein gelöschtes Konto. Ohne weitere Hinweise ist das kein Angriffsindiz, sondern Aufräumbedarf.' },
          { id: 'c', text: 'Die Rechte sind verschlüsselt.', whyWrong: 'ACLs speichern immer SIDs. Normalerweise zeigt Windows den Namen dazu. Kann es keinen Namen finden, zeigt es die SID selbst.' },
        ],
        correct: 'a',
        explanation: 'Verwaiste SID = gelöschtes Objekt. Entfernen und künftig nur über Gruppen berechtigen.',
      },
    },
    {
      heading: 'Profi: DFS-Namespaces und DFS-Replikation',
      body: `**DFS-Namespaces** (DFS-N) machen aus vielen Freigaben einen einheitlichen Pfad: \`\\\\firma.local\\daten\\vertrieb\` zeigt auf \`\\\\fs01\\vertrieb\$\`, \`…\\technik\` auf \`\\\\fs02\\technik\$\`. Ziehen Daten auf einen neuen Server um, ändert man nur das **Ordnerziel** (folder target), nicht die Laufwerkszuordnungen bei allen Benutzern. Ein **domänenbasierter** Namespace liegt im AD und ist auch dann erreichbar, wenn ein Namespace-Server ausfällt.

Hat ein Ordner mehrere Ziele, bekommt der Client eine **Verweisliste** (referral), sortiert nach Standort: zuerst Server am eigenen Standort.

**DFS-Replikation** (DFS-R) hält Ordner auf mehreren Servern synchron, nur geänderte Blöcke werden übertragen. Wichtig für den Support:
- DFS-R kennt **keine verteilten Dateisperren**. Bearbeiten zwei Personen dieselbe Datei auf verschiedenen Servern, gewinnt die zuletzt gespeicherte Version. Die andere landet im Ordner \`DfsrPrivate\\ConflictandDeleted\`.
- Darum für gemeinsam bearbeitete Daten nur **ein aktives Ziel** pro Standort freigeben oder andere Ziele deaktivieren.
- Rechte (NTFS) werden mit repliziert, die **Freigabeberechtigungen nicht**. Die müssen auf jedem Server gleich gesetzt werden.

Werkzeuge: \`dfsutil\`, \`Get-DfsnFolderTarget\`, \`Get-DfsrBacklog\` (wie viele Änderungen warten noch auf Replikation), Ereignisprotokoll „DFS Replication“.`,
      analogy: 'DFS-N ist ein Wegweiser: Er zeigt immer zur richtigen Tür, auch wenn das Büro dahinter umzieht. DFS-R sind zwei Kopien desselben Aktenschranks an zwei Orten, die sich abgleichen, aber nicht wissen, ob gerade jemand am anderen Schrank dieselbe Akte bearbeitet.',
      compare: {
        left: 'DFS-Namespace (DFS-N)', right: 'DFS-Replikation (DFS-R)',
        rows: [
          ['einheitlicher Pfad zu vielen Freigaben', 'hält Ordnerinhalte auf mehreren Servern gleich'],
          ['Ordnerziele, Verweise nach Standort', 'Replikationsgruppen, blockweise Übertragung'],
          ['Umzug ohne neue Laufwerkspfade', 'Ausfallsicherheit, Zweigstellen'],
          ['speichert selbst keine Dateien', 'kein verteiltes Sperren, Konflikte möglich'],
        ],
      },
      terms: [
        { de: 'DFS-Namespace', en: 'DFS Namespace (DFS-N)' },
        { de: 'Ordnerziel', en: 'folder target' },
        { de: 'Verweis', en: 'referral' },
        { de: 'DFS-Replikation', en: 'DFS Replication (DFS-R)' },
        { de: 'Rückstand', en: 'backlog' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 3,
        prompt: 'Zwei Kollegen an verschiedenen Standorten speichern dieselbe Excel-Datei auf einem DFS-R-replizierten Ordner. Danach fehlen die Änderungen von einem. Warum?',
        options: [
          { id: 'a', text: 'DFS-R sperrt Dateien nicht serverübergreifend. Die zuletzt gespeicherte Version gewinnt, die andere landet in ConflictAndDeleted.' },
          { id: 'b', text: 'Excel-Dateien werden von DFS-R nicht repliziert.', whyWrong: 'DFS-R repliziert Office-Dateien normal. Das Problem ist der Konflikt durch gleichzeitiges Bearbeiten an zwei Standorten.' },
          { id: 'c', text: 'Der DFS-Namespace ist falsch konfiguriert.', whyWrong: 'Der Namespace leitet nur zum richtigen Server. Die verlorenen Änderungen entstehen durch einen Replikationskonflikt in DFS-R.' },
        ],
        correct: 'a',
        explanation: 'Last writer wins. Version aus `ConflictandDeleted` wiederherstellen und künftig nur ein aktives Ziel für gemeinsam bearbeitete Daten.',
      },
      sources: [
        { title: 'Microsoft Learn – DFS Namespaces overview', url: 'https://learn.microsoft.com/en-us/windows-server/storage/dfs-namespaces/dfs-overview' },
        { title: 'Microsoft Learn – DFS Replication overview', url: 'https://learn.microsoft.com/en-us/windows-server/storage/dfs-replication/dfsr-overview' },
      ],
    },
  ],
  quiz: [
    { id: 'q1', type: 'generated', generator: 'ntfs', difficulty: 1 },
    { id: 'q2', type: 'generated', generator: 'ntfs', difficulty: 2 },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Anna ist in `GG_Einkauf` (NTFS: Lesen) und `GG_Projekt` (NTFS: Ändern). Was darf sie laut NTFS?',
      options: [
        { id: 'a', text: 'Ändern' },
        { id: 'b', text: 'Lesen', whyWrong: 'Zulassen-Rechte mehrerer Gruppen addieren sich, es gilt nicht das kleinste. Über GG_Projekt hat sie Ändern.' },
        { id: 'c', text: 'Nichts, weil sich die Rechte widersprechen', whyWrong: 'Zwei Zulassen-Einträge widersprechen sich nicht. Sie werden zusammengezählt.' },
      ],
      correct: 'a',
      explanation: 'Innerhalb von NTFS addieren sich Zulassen-Einträge. Nur Verweigern zieht wieder ab.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Am Ordner `Projekte` ist **geerbt** „GG_Extern: Verweigern Lesen“. Am Unterordner `Projekte\\Kunde-A` ist **explizit** „GG_Extern: Zulassen Lesen“. Darf ein Externer `Kunde-A` lesen?',
      options: [
        { id: 'a', text: 'Ja, explizites Zulassen schlägt geerbtes Verweigern.' },
        { id: 'b', text: 'Nein, Verweigern gewinnt immer.', whyWrong: 'Verweigern gewinnt nur auf derselben Ebene. Die Reihenfolge ist: explizit verweigern, explizit zulassen, geerbt verweigern, geerbt zulassen. Das explizite Zulassen steht vor dem geerbten Verweigern.' },
        { id: 'c', text: 'Nur über das Netzwerk', whyWrong: 'Das Ergebnis der NTFS-Auswertung hängt nicht vom Zugriffsweg ab. Übers Netz kommt nur zusätzlich die Freigabe dazu.' },
      ],
      correct: 'a',
      explanation: 'Rangfolge: explizit Deny > explizit Allow > geerbt Deny > geerbt Allow.',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Wo zeigt Windows dir für einen bestimmten Benutzer alle Einzelrechte auf einen Ordner an?',
      options: [
        { id: 'a', text: 'Eigenschaften → Sicherheit → Erweitert → Effektiver Zugriff' },
        { id: 'b', text: 'Eigenschaften → Allgemein → Attribute', whyWrong: 'Dort stehen nur Datei-Attribute wie „Schreibgeschützt“ oder „Versteckt“, keine Berechtigungen.' },
        { id: 'c', text: 'Im Task-Manager unter Benutzer', whyWrong: 'Der Task-Manager zeigt angemeldete Benutzer und ihre Prozesse, keine Dateirechte.' },
      ],
      correct: 'a',
      explanation: 'Die Registerkarte „Effektiver Zugriff“ berechnet die Rechte inklusive Gruppen. Die Freigabeebene prüfst du zusätzlich getrennt.',
    },
    {
      id: 'q6', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Sichere alle ACLs von `D:\\Daten` inklusive Unterordnern in eine Datei, bevor du Rechte änderst.',
      template: 'C:\\> icacls D:\\Daten {{0}} C:\\acl.txt {{1}}',
      blanks: [{ accept: ['/save'] }, { accept: ['/t'] }],
      explanation: '`/save` schreibt die ACLs in eine Datei, `/t` geht rekursiv durch alle Unterordner. Zurück geht es mit `icacls D:\\ /restore C:\\acl.txt`.',
    },
    {
      id: 'q7', type: 'cli', shell: 'windows', difficulty: 3,
      prompt: 'Gib `DL_Angebote_R` Lese- und Ausführungsrechte, die an Unterordner **und** Dateien vererbt werden.',
      template: 'C:\\> icacls D:\\Angebote /grant "FIRMA\\DL_Angebote_R:{{0}}{{1}}RX"',
      blanks: [{ accept: ['(OI)'] }, { accept: ['(CI)'] }],
      explanation: '`(OI)` object inherit = Dateien, `(CI)` container inherit = Unterordner. Ohne beide gilt der Eintrag nur für den Ordner selbst.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Ein Admin öffnet einen Ordner im Explorer und bekommt „Sie verfügen zurzeit nicht über die Berechtigung“, obwohl „Administratoren“ Vollzugriff haben. Warum?',
      options: [
        { id: 'a', text: 'UAC: Der Explorer läuft mit gefiltertem Token ohne die Administratoren-Gruppe.' },
        { id: 'b', text: 'Administratoren dürfen grundsätzlich nicht auf Benutzerdaten zugreifen.', whyWrong: 'Doch, über die Gruppe Administratoren mit Vollzugriff schon. Nur läuft der Explorer wegen UAC ohne diese Gruppe im Token.' },
        { id: 'c', text: 'Die Festplatte ist verschlüsselt.', whyWrong: 'Eine BitLocker-Verschlüsselung ist für angemeldete Benutzer transparent. Die Meldung kommt von der Rechteprüfung mit gefiltertem Admin-Token.' },
      ],
      correct: 'a',
      explanation: 'Klick auf „Fortsetzen“ trägt das persönliche Konto in die ACL ein und vermüllt sie. Besser eigene Admin-Gruppe berechtigen oder erhöhte Konsole nutzen.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Jeder im Team soll eigene Dateien ändern und löschen können, fremde aber nur lesen. Welche Kombination passt?',
      options: [
        { id: 'a', text: 'Team: Lesen + Dateien erstellen auf den Ordner, ERSTELLER-BESITZER: Ändern für Unterordner und Dateien' },
        { id: 'b', text: 'Team: Ändern auf alles', whyWrong: 'Mit Ändern auf alles kann jeder auch fremde Dateien bearbeiten und löschen. Das widerspricht der Anforderung.' },
        { id: 'c', text: 'Team: Lesen auf alles', whyWrong: 'Mit nur Lesen kann niemand eigene Dateien anlegen oder ändern.' },
      ],
      correct: 'a',
      explanation: 'ERSTELLER-BESITZER wird bei neuen Dateien durch den Ersteller ersetzt. So bekommt nur er Ändern auf seine Datei.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Ein Benutzer sagt: „Die Datei `Kalkulation.xlsx` ist von einem anderen Benutzer geöffnet, aber alle sagen, sie haben sie zu.“ Wo findest du am Fileserver, wer die Datei offen hat?',
      options: [
        { id: 'a', text: 'Computerverwaltung → Freigegebene Ordner → Geöffnete Dateien (oder `Get-SmbOpenFile`)' },
        { id: 'b', text: 'Im Papierkorb des Servers', whyWrong: 'Der Papierkorb enthält gelöschte Dateien, keine Informationen über geöffnete Dateien.' },
        { id: 'c', text: 'Mit `ipconfig /displaydns`', whyWrong: 'Das zeigt den DNS-Cache des Rechners. Mit Dateisperren hat es nichts zu tun.' },
      ],
      correct: 'a',
      explanation: 'Dort siehst du Benutzer und Sperrmodus und kannst die Datei notfalls schließen (`Close-SmbOpenFile`). Vorher den Benutzer informieren, sonst gehen ungespeicherte Änderungen verloren.',
      domain: 'troubleshoot',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Wozu dient ein DFS-Namespace?',
      options: [
        { id: 'a', text: 'Ein einheitlicher Pfad wie `\\\\firma.local\\daten`, der auf Freigaben verschiedener Server zeigt' },
        { id: 'b', text: 'Er kopiert Daten zwischen Servern', whyWrong: 'Das macht DFS-Replikation. Der Namespace leitet nur auf die richtigen Freigaben weiter.' },
        { id: 'c', text: 'Er ersetzt NTFS-Rechte', whyWrong: 'Der Namespace hat mit Rechten auf die Daten nichts zu tun. Die NTFS-Rechte liegen weiter auf den Zielfreigaben.' },
      ],
      correct: 'a',
      explanation: 'Umzüge werden einfach: Ordnerziel ändern, Pfade bei Benutzern bleiben gleich.',
    },
    {
      id: 'q12', type: 'multi', difficulty: 3,
      prompt: 'Was stimmt für DFS-Replikation?',
      options: [
        { id: 'a', text: 'NTFS-Rechte werden mit repliziert.' },
        { id: 'b', text: 'Bei gleichzeitigen Änderungen gewinnt die zuletzt gespeicherte Version.' },
        { id: 'c', text: 'Freigabeberechtigungen werden automatisch auf alle Server übertragen.', whyWrong: 'Freigabeberechtigungen sind Teil der Freigabe auf dem jeweiligen Server und werden nicht repliziert. Sie müssen auf jedem Server gleich gesetzt werden.' },
        { id: 'd', text: 'DFS-R sperrt eine geöffnete Datei auf allen Servern.', whyWrong: 'Genau das kann DFS-R nicht. Es gibt kein verteiltes Sperren, darum entstehen Konflikte.' },
      ],
      correct: ['a', 'b'],
      explanation: 'NTFS-ACLs sind Teil der Datei und werden repliziert. Freigaben nicht. Konflikte: last writer wins.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: '`icacls D:\\Daten\\HR` zeigt nur Einträge **ohne** `(I)`. Was bedeutet das?',
      options: [
        { id: 'a', text: 'Alle Einträge sind explizit gesetzt, die Vererbung vom übergeordneten Ordner ist unterbrochen.' },
        { id: 'b', text: 'Der Ordner hat keine Rechte.', whyWrong: 'Es stehen ja Einträge da. Das fehlende `(I)` heißt nur, dass keiner davon geerbt ist.' },
        { id: 'c', text: 'Alle Einträge sind ungültig.', whyWrong: '`(I)` steht für „inherited“. Fehlt es, sind die Einträge explizit am Ordner gesetzt und voll gültig.' },
      ],
      correct: 'a',
      explanation: '`(I)` = geerbt. Für HR-Ordner ist eine unterbrochene Vererbung oft gewollt, neue Admin-Gruppen von oben kommen dann aber nicht an.',
    },
    {
      id: 'q14', type: 'single', difficulty: 3,
      prompt: 'Ein Benutzer hat **keine** Rechte auf `D:\\Daten`, aber Lesen auf `D:\\Daten\\Team\\Ablage`. Er gibt den vollen UNC-Pfad zu `Ablage` ein. Was passiert standardmäßig?',
      options: [
        { id: 'a', text: 'Er kommt hinein, weil „Jeder“ das Recht „Auslassen der durchsuchenden Überprüfung“ hat.' },
        { id: 'b', text: 'Zugriff verweigert, weil ihm Rechte auf dem Weg dorthin fehlen.', whyWrong: 'Das wäre ohne das Benutzerrecht „Auslassen der durchsuchenden Überprüfung“ so. Standardmäßig hat „Jeder“ dieses Recht, die Ordner darüber werden also nicht geprüft.' },
        { id: 'c', text: 'Er sieht den Ordner, aber keine Dateien.', whyWrong: 'Er hat Lesen auf `Ablage` selbst, also sieht er auch die Dateien darin, sofern das Recht vererbt wird.' },
      ],
      correct: 'a',
      explanation: 'Bypass traverse checking ist standardmäßig für „Jeder“ gesetzt. Rechte sollten deshalb nie nur „von oben“ abgesichert sein.',
    },
    {
      id: 'q15', type: 'ordering', difficulty: 2,
      prompt: 'Bring die Auswertung effektiver Rechte über das Netzwerk in die richtige Reihenfolge.',
      items: [
        { id: 'a', text: 'Alle Gruppen des Benutzers ermitteln (auch verschachtelte)' },
        { id: 'b', text: 'NTFS: Zulassen addieren, Verweigern abziehen' },
        { id: 'c', text: 'Freigabe: Rechte der Gruppen addieren' },
        { id: 'd', text: 'Strengeres Ergebnis aus NTFS und Freigabe nehmen' },
      ],
      explanation: 'Gruppen → NTFS → Freigabe → Minimum. NTFS und Freigabe dürfen auch in anderer Reihenfolge ausgewertet werden, das Minimum kommt immer zuletzt.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      { id: 'b1', type: 'generated', generator: 'ntfs', difficulty: 3 },
      {
        id: 'b2', type: 'chain', difficulty: 3,
        prompt: '„Seit dem Umzug auf den neuen Fileserver kann die Buchhaltung im Ordner `Belege` keine Dateien mehr speichern. Lesen geht.“',
        steps: [
          {
            id: 's1', text: 'Was prüfst du zuerst?',
            options: [
              { id: 'a', text: 'NTFS- und Freigabeberechtigungen auf dem neuen Server, getrennt', correct: true, feedback: 'Richtig. Beim Umzug werden NTFS-Rechte oft mitkopiert (robocopy /COPYALL), Freigaberechte aber nicht.' },
              { id: 'b', text: 'Ob die Festplatte voll ist', correct: false, feedback: 'Möglich, dann käme aber eine Meldung „nicht genügend Speicherplatz“. Bei „Lesen geht, Schreiben nicht“ sind Rechte die erste Vermutung.' },
            ],
          },
          {
            id: 's2', text: 'NTFS: `DL_Belege_RW: Ändern (OI)(CI)`. Freigabe: `Jeder: Lesen` (Standard beim Anlegen). Ursache?',
            options: [
              { id: 'a', text: 'Die Freigabe erlaubt nur Lesen, übers Netz gilt das strengere Recht.', correct: true, feedback: 'Genau. Der Standard „Jeder: Lesen“ wurde beim Anlegen der Freigabe nicht angepasst.' },
              { id: 'b', text: 'Die NTFS-Rechte sind falsch.', correct: false, feedback: 'NTFS erlaubt Ändern und vererbt richtig. Die Bremse ist die Freigabe.' },
            ],
          },
          {
            id: 's3', text: 'Saubere Lösung?',
            options: [
              { id: 'a', text: 'Freigabe auf „Authentifizierte Benutzer: Ändern“ setzen, Feinsteuerung bleibt bei NTFS, testen, dokumentieren', correct: true, feedback: 'Richtig, so ist es auf dem alten Server vermutlich auch gewesen.' },
              { id: 'b', text: 'Allen Benutzern NTFS-Vollzugriff geben', correct: false, feedback: 'Löst das Problem nicht (die Freigabe bleibt bei Lesen) und verstößt gegen Least Privilege.' },
            ],
          },
        ],
        explanation: 'Bei Servermigrationen Freigabeberechtigungen nicht vergessen. Typisches Muster: Lesen geht, Schreiben nicht.',
        domain: 'troubleshoot',
      },
      {
        id: 'b3', type: 'single', difficulty: 3,
        prompt: 'Max ist in `GG_Vertrieb` (NTFS: Ändern) und in `GG_Gesperrt` (NTFS: explizit Verweigern Vollzugriff). Freigabe: Jeder – Vollzugriff. Was darf er übers Netz?',
        options: [
          { id: 'a', text: 'Nichts' },
          { id: 'b', text: 'Ändern', whyWrong: 'Das explizite Verweigern auf Vollzugriff steht auf derselben Ebene wie das Zulassen und schlägt es. Damit bleibt kein Recht übrig.' },
          { id: 'c', text: 'Vollzugriff', whyWrong: 'Die Freigabe erlaubt zwar Vollzugriff, aber NTFS verweigert alles. Übers Netz gilt das strengere, also kein Zugriff.' },
        ],
        correct: 'a',
        explanation: 'Explizites Deny schlägt Allow. Darum Verweigern nur sehr gezielt einsetzen.',
      },
      {
        id: 'b4', type: 'single', difficulty: 2,
        prompt: 'Ein Kunde will Rechte auf 200.000 Ordnern per Skript ändern. Was empfiehlst du als Erstes?',
        options: [
          { id: 'a', text: 'ACLs vorher mit `icacls … /save /t` sichern und erst an einem Testordner ausprobieren' },
          { id: 'b', text: 'Sofort ausführen, Rechte lassen sich ja jederzeit ändern', whyWrong: 'Eine falsche Massenänderung ist kaum von Hand zu reparieren. Ohne Sicherung kennt hinterher niemand den alten Zustand.' },
          { id: 'c', text: 'Die Vererbung überall deaktivieren', whyWrong: 'Das macht alles noch komplizierter und verhindert, dass künftige Änderungen von oben ankommen.' },
        ],
        correct: 'a',
        explanation: 'Sichern, testen, dann ausführen. Gilt für jede Massenänderung.',
        domain: 'troubleshoot',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'A customer writes: "After migrating with robocopy, all ACLs on the new server show only *Administrators* and *SYSTEM*." What was most likely missing?',
        options: [
          { id: 'a', text: 'Robocopy was run without copying security information (e.g. `/COPYALL` or `/SEC`).' },
          { id: 'b', text: 'The new server has no NTFS.', whyWrong: 'If the target were not NTFS, there would be no ACL entries at all. Here the files simply inherited the default permissions of the target folder.' },
          { id: 'c', text: 'DFS replication deleted the permissions.', whyWrong: 'No DFS replication is involved in this migration. Robocopy copies data and attributes by default, but not the security descriptors.' },
        ],
        correct: 'a',
        explanation: 'Robocopy default is `/COPY:DAT` (data, attributes, timestamps). Use `/COPYALL` or `/SEC` to keep ACLs.',
        domain: 'english',
      },
    ],
  },
};

export default level;
