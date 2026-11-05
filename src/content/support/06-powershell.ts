import type { Level } from '../../types/content';

const level: Level = {
  id: 'sup-06',
  track: 'support',
  order: 6,
  title: 'PowerShell für den Support',
  titleEn: 'PowerShell for Support Engineers',
  summary: 'Cmdlets, Objekte und Pipeline, Filtern und Auswählen, Active-Directory- und Exchange-Cmdlets, Berichte als CSV, sicher ändern mit -WhatIf, Fehlerbehandlung mit Try/Catch und Skripte von Kunden systematisch debuggen.',
  certs: ['jobready'],
  domains: { jobready: 'scripting' },
  lab: {
    title: 'Ein Berechtigungsbericht per Skript',
    needs: 'Test-Domäne aus Modul 1 mit RSAT bzw. ActiveDirectory-Modul, PowerShell 5.1 oder 7',
    steps: [
      'Lege drei Testbenutzer an: `New-ADUser -Name test1 -SamAccountName test1 -Enabled $false` (für alle drei).',
      'Nimm sie in eine Gruppe auf: `Add-ADGroupMember GG_Vertrieb -Members test1,test2,test3`.',
      'Erzeuge einen Bericht: `Get-ADGroupMember GG_Vertrieb -Recursive | Get-ADUser -Properties Department | Select-Object Name, SamAccountName, Department | Export-Csv C:\\Temp\\vertrieb.csv -NoTypeInformation -Encoding UTF8`.',
      'Probiere eine Änderung zuerst mit `-WhatIf` aus: `Get-ADUser -Filter "Name -like \'test*\'" | Disable-ADAccount -WhatIf`.',
      'Baue absichtlich einen Fehler ein (falscher Gruppenname) und fange ihn mit `try { … -ErrorAction Stop } catch { $_.Exception.Message }` ab.',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: Cmdlets, Hilfe und Objekte',
      body: `PowerShell-Befehle heißen **Cmdlets** und folgen dem Muster **Verb-Nomen**: \`Get-ADUser\`, \`Set-Mailbox\`, \`Remove-Item\`. Das Verb verrät schon das Risiko: **Get** liest nur, **Set**, **New**, **Remove**, **Add** ändern etwas.

Die drei wichtigsten Befehle zum Selbsthelfen:
\`\`\`
Get-Command *ADUser*        # welche Befehle gibt es?
Get-Help Get-ADUser -Examples   # Beispiele anzeigen
Get-ADUser max | Get-Member     # welche Eigenschaften hat das Objekt?
\`\`\`

Der große Unterschied zu cmd: PowerShell gibt **Objekte** zurück, keinen Text. Ein Benutzer ist ein Objekt mit Eigenschaften (\`Name\`, \`Enabled\`, \`LastLogonDate\` …). Darum kannst du direkt filtern und sortieren, statt Text zu zerlegen.

Variablen beginnen mit \`$\`: \`$u = Get-ADUser max\`, dann \`$u.Name\`. \`$true\`, \`$false\` und \`$null\` sind feste Werte.

**Ausführungsrichtlinie:** Wenn ein Skript nicht startet mit „…kann nicht geladen werden, da die Ausführung von Skripts auf diesem System deaktiviert ist“, verhindert die Ausführungsrichtlinie den Start. \`Get-ExecutionPolicy -List\` zeigt, wo sie gesetzt ist. Sie ist eine Schutzschicht gegen versehentliches Ausführen, keine Sicherheitsgrenze.`,
      terms: [
        { de: 'Cmdlet', en: 'cmdlet' },
        { de: 'Ausführungsrichtlinie', en: 'execution policy' },
        { de: 'Eigenschaft', en: 'property' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Welches Cmdlet ändert garantiert **nichts**?',
        options: [
          { id: 'a', text: '`Get-ADUser`' },
          { id: 'b', text: '`Set-ADUser`', whyWrong: 'Set ändert Eigenschaften eines Objekts.' },
          { id: 'c', text: '`Remove-ADUser`', whyWrong: 'Remove löscht das Objekt. Das gefährlichste von den dreien.' },
        ],
        correct: 'a',
        explanation: 'Get = lesen. Im Support beim Kunden zuerst immer nur Get-Befehle.',
      },
      sources: [{ title: 'Microsoft Learn – PowerShell 101', url: 'https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/00-introduction' }],
    },
    {
      heading: 'Fortgeschritten: Pipeline, Filtern, Auswählen, Exportieren',
      body: `Die **Pipeline** \`|\` reicht Objekte an den nächsten Befehl weiter. Ein typischer Support-Bericht:
\`\`\`
Get-ADUser -Filter 'Enabled -eq $true' -Properties LastLogonDate |
  Where-Object { $_.LastLogonDate -lt (Get-Date).AddDays(-90) } |
  Sort-Object LastLogonDate |
  Select-Object Name, SamAccountName, LastLogonDate |
  Export-Csv C:\\Temp\\inaktiv.csv -NoTypeInformation -Encoding UTF8
\`\`\`
- \`$_\` (oder \`$PSItem\`) ist das aktuelle Objekt in der Pipeline.
- **Vergleichsoperatoren** sind Wörter: \`-eq\`, \`-ne\`, \`-lt\`, \`-gt\`, \`-like\` (mit \`*\`), \`-match\` (regulärer Ausdruck).
- \`-Filter\` beim AD-Cmdlet filtert **auf dem Domänencontroller**, \`Where-Object\` erst **lokal**. Bei großen Domänen also so viel wie möglich in \`-Filter\`.
- \`-Properties\` holt Attribute, die standardmäßig nicht mitkommen (z. B. \`LastLogonDate\`, \`Department\`, \`MemberOf\`).
- \`Format-Table\` und \`Format-List\` sind **nur für die Anzeige**. Danach kein \`Export-Csv\` mehr, sonst stehen Formatierungsobjekte in der Datei.

Gruppenmitglieder inklusive verschachtelter Gruppen: \`Get-ADGroupMember GG_Vertrieb -Recursive\`. Gruppen eines Benutzers: \`Get-ADPrincipalGroupMembership max\`.`,
      terms: [
        { de: 'Pipeline', en: 'pipeline' },
        { de: 'Vergleichsoperator', en: 'comparison operator' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Ein Kunde schickt: `Get-ADUser -Filter * | Format-Table Name, Department | Export-Csv user.csv`. Die CSV enthält nur Kauderwelsch und Department ist leer. Zwei Fehler?',
        options: [
          { id: 'a', text: '`Format-Table` vor `Export-Csv` (statt `Select-Object`), und `-Properties Department` fehlt.' },
          { id: 'b', text: '`-Filter *` ist ungültig.', whyWrong: '`-Filter *` ist gültig und liefert alle Benutzer.' },
          { id: 'c', text: 'Export-Csv kann keine AD-Daten exportieren.', whyWrong: 'Doch, Export-Csv exportiert beliebige Objekte. Es bekommt hier nur Formatierungsobjekte statt Benutzer.' },
        ],
        correct: 'a',
        explanation: 'Richtig: `Get-ADUser -Filter * -Properties Department | Select-Object Name, Department | Export-Csv user.csv -NoTypeInformation`.',
      },
      sources: [{ title: 'Microsoft Learn – Get-ADUser', url: 'https://learn.microsoft.com/en-us/powershell/module/activedirectory/get-aduser' }],
    },
    {
      heading: 'Fortgeschritten: Sicher ändern mit -WhatIf und -Confirm',
      body: `Massenänderungen sind im Support das größte Risiko. Fast alle ändernden Cmdlets kennen:
- \`-WhatIf\`: zeigt, **was passieren würde**, ändert aber nichts.
- \`-Confirm\`: fragt bei jedem Objekt nach.

Sicherer Ablauf für eine Änderung beim Kunden:
1. Mit \`Get-…\` genau die Objekte auswählen und **anzeigen** (Anzahl prüfen: \`(…).Count\`).
2. Ausgangszustand sichern, z. B. als CSV.
3. Dieselbe Pipeline mit dem ändernden Cmdlet und \`-WhatIf\` laufen lassen.
4. Erst dann ohne \`-WhatIf\`, am besten zuerst für ein einzelnes Objekt.
5. Ergebnis prüfen und dokumentieren.

Ein häufiger Fehler in Kundenskripten: \`-Filter\` mit einer leeren Variablen. \`Get-ADUser -Filter "Department -eq '$abt'"\` mit leerem \`$abt\` liefert alle Benutzer ohne Abteilung, und die nächste Zeile ändert dann die falschen Objekte. Darum vorher prüfen: \`if (-not $abt) { throw 'Abteilung fehlt' }\`.`,
      analogy: '-WhatIf ist die Generalprobe: Alle Schauspieler gehen ihre Wege, aber der Vorhang bleibt zu. Erst wenn die Probe passt, kommt das Publikum.',
      terms: [
        { de: 'Probelauf', en: 'dry run (-WhatIf)' },
      ],
      check: {
        id: 'c3', type: 'cli', shell: 'windows', difficulty: 2,
        prompt: 'Zeige, welche deaktivierten Benutzer aus der OU „Austritte“ gelöscht **würden**, ohne etwas zu löschen.',
        template: "PS> Get-ADUser -Filter 'Enabled -eq $false' -SearchBase 'OU=Austritte,DC=firma,DC=local' | Remove-ADUser {{0}}",
        blanks: [{ accept: ['-WhatIf'] }],
        explanation: '`-WhatIf` gibt für jedes Objekt „What if: Performing the operation …“ aus und ändert nichts.',
      },
      sources: [{ title: 'Microsoft Learn – about_Preference_Variables (WhatIfPreference)', url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables' }],
    },
    {
      heading: 'Profi: Fehlerbehandlung und Skripte debuggen',
      body: `PowerShell kennt **beendende** und **nicht beendende** Fehler. Viele Cmdlets melden Fehler nur und machen mit dem nächsten Objekt weiter. Darum fängt \`try/catch\` sie **nicht**, außer du erzwingst es:
\`\`\`
try {
    Add-ADGroupMember -Identity GG_Vertrieb -Members $sam -ErrorAction Stop
    "OK: $sam"
} catch {
    "FEHLER bei $sam : $($_.Exception.Message)"
}
\`\`\`
- \`-ErrorAction Stop\` macht einen Fehler beendend, \`catch\` greift.
- \`$Error[0]\` ist der letzte Fehler, \`$Error[0].InvocationInfo\` zeigt Zeile und Befehl.
- \`Set-StrictMode -Version Latest\` meldet z. B. Tippfehler in Variablennamen.

**Kundenskript debuggen**, systematisch:
1. Genaue Fehlermeldung und PowerShell-Version: \`$PSVersionTable\`.
2. Läuft das Skript mit den richtigen Rechten und Modulen? (\`Get-Module -ListAvailable ActiveDirectory\`)
3. Skript in kleine Teile zerlegen, Zwischenergebnisse mit \`Write-Host\` bzw. \`Write-Verbose\` ausgeben oder in VS Code mit Haltepunkten durchgehen.
4. Mit **einem** Testobjekt reproduzieren.
5. Typische Ursachen: Modul fehlt, PowerShell 5.1 vs. 7, Kodierung (Umlaute in CSV, \`-Encoding UTF8\`), Trennzeichen (deutsches Excel nutzt \`;\`, also \`-Delimiter ';'\`), leere Variablen, fehlende Rechte.

Für Protokolle eines ganzen Laufs: \`Start-Transcript C:\\Temp\\log.txt\` … \`Stop-Transcript\`.`,
      terms: [
        { de: 'beendender Fehler', en: 'terminating error' },
        { de: 'Haltepunkt', en: 'breakpoint' },
        { de: 'Transkript', en: 'transcript' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 3,
        prompt: '`try { Get-ADUser gibtsnicht } catch { "Fehler" }` gibt die rote Fehlermeldung aus, aber nie „Fehler“. Warum?',
        options: [
          { id: 'a', text: 'Ohne `-ErrorAction Stop` ist der Fehler nicht beendend, darum greift catch nicht.' },
          { id: 'b', text: 'catch funktioniert in PowerShell grundsätzlich nicht.', whyWrong: 'catch funktioniert, aber nur bei beendenden Fehlern.' },
          { id: 'c', text: 'Der Benutzer existiert doch.', whyWrong: 'Dann käme keine Fehlermeldung. Das Problem ist die Fehlerart.' },
        ],
        correct: 'a',
        explanation: 'Hinweis: Bei `Get-ADUser` mit `-Identity` ist der Fehler je nach Version schon beendend. Verlass dich nicht darauf: `-ErrorAction Stop` setzen.',
      },
      sources: [{ title: 'Microsoft Learn – about_Try_Catch_Finally', url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_try_catch_finally' }],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Wie findest du heraus, welche Eigenschaften ein AD-Benutzerobjekt hat?',
      options: [
        { id: 'a', text: '`Get-ADUser max -Properties * | Get-Member`' },
        { id: 'b', text: '`Get-Help max`', whyWrong: 'Get-Help zeigt Hilfe zu Befehlen, nicht die Eigenschaften eines Objekts.' },
        { id: 'c', text: '`dir max`', whyWrong: 'dir listet Dateien im aktuellen Ordner, keine AD-Objekte.' },
      ],
      correct: 'a',
      explanation: '`Get-Member` zeigt Eigenschaften und Methoden jedes Objekts.',
    },
    {
      id: 'q2', type: 'cli', shell: 'windows', difficulty: 1,
      prompt: 'Zeige alle Mitglieder der Gruppe `GG_Vertrieb`, auch aus verschachtelten Gruppen.',
      template: 'PS> Get-ADGroupMember -Identity GG_Vertrieb {{0}}',
      blanks: [{ accept: ['-Recursive'] }],
      explanation: '`-Recursive` löst verschachtelte Gruppen auf und liefert nur Benutzer und Computer.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Wofür steht `$_` in `Where-Object { $_.Enabled -eq $false }`?',
      options: [
        { id: 'a', text: 'Das aktuelle Objekt in der Pipeline' },
        { id: 'b', text: 'Die letzte Fehlermeldung', whyWrong: 'Die steht in `$Error[0]`. `$_` ist das aktuelle Pipeline-Objekt (im catch-Block der aktuelle Fehler).' },
        { id: 'c', text: 'Eine leere Variable', whyWrong: 'Leer ist `$null`. `$_` enthält das Objekt, das gerade verarbeitet wird.' },
      ],
      correct: 'a',
      explanation: '`$_` und `$PSItem` sind dasselbe.',
    },
    {
      id: 'q4', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne die Operatoren ihrer Bedeutung zu.',
      items: [
        { id: 'i1', text: '-eq' },
        { id: 'i2', text: '-like' },
        { id: 'i3', text: '-lt' },
        { id: 'i4', text: '-ne' },
      ],
      buckets: [
        { id: 'eq', label: 'gleich' },
        { id: 'like', label: 'Muster mit *' },
        { id: 'lt', label: 'kleiner als' },
        { id: 'ne', label: 'ungleich' },
      ],
      solution: { i1: 'eq', i2: 'like', i3: 'lt', i4: 'ne' },
      explanation: 'PowerShell nutzt Wörter statt Zeichen, weil `>` und `<` für Umleitungen reserviert sind.',
    },
    {
      id: 'q5', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Exportiere die Benutzerliste als CSV für deutsches Excel (Semikolon, Umlaute korrekt).',
      template: "PS> $liste | Export-Csv C:\\Temp\\user.csv -NoTypeInformation -Delimiter {{0}} -Encoding {{1}}",
      blanks: [{ accept: ["';'", '";"'] }, { accept: ['UTF8', 'utf8BOM', 'UTF8BOM'] }],
      explanation: 'Deutsches Excel erwartet Semikolon. UTF-8 mit BOM (in PowerShell 5.1 der Standard bei `-Encoding UTF8`) zeigt Umlaute korrekt.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Warum ist `Get-ADUser -Filter "Department -eq \'Vertrieb\'"` bei 50.000 Benutzern besser als `Get-ADUser -Filter * | Where-Object Department -eq \'Vertrieb\'`?',
      options: [
        { id: 'a', text: '-Filter wertet auf dem Domänencontroller aus, es kommen nur die passenden Benutzer übers Netz.' },
        { id: 'b', text: 'Where-Object funktioniert nicht mit AD-Objekten.', whyWrong: 'Where-Object funktioniert mit allen Objekten. Es ist nur langsamer, weil erst alle Benutzer geladen werden. Zusätzlich fehlt hier `-Properties Department`.' },
        { id: 'c', text: 'Es gibt keinen Unterschied.', whyWrong: 'Bei großen Domänen ist der Unterschied enorm: wenige statt 50.000 Objekte übertragen.' },
      ],
      correct: 'a',
      explanation: 'Filter left: So früh wie möglich filtern, am besten an der Quelle.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Was macht `-WhatIf`?',
      options: [
        { id: 'a', text: 'Zeigt, was der Befehl tun würde, ohne etwas zu ändern' },
        { id: 'b', text: 'Fragt bei jedem Objekt nach', whyWrong: 'Das macht `-Confirm`.' },
        { id: 'c', text: 'Macht die Änderung später rückgängig', whyWrong: 'PowerShell hat kein Rückgängig. Deshalb vorher sichern und mit -WhatIf testen.' },
      ],
      correct: 'a',
      explanation: 'Vor jeder Massenänderung Pflicht.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Ein Kundenskript startet nicht: „…kann nicht geladen werden, da die Ausführung von Skripts auf diesem System deaktiviert ist.“ Was prüfst du?',
      options: [
        { id: 'a', text: 'Die Ausführungsrichtlinie mit `Get-ExecutionPolicy -List` (oft per GPO gesetzt)' },
        { id: 'b', text: 'Ob PowerShell installiert ist', whyWrong: 'Die Meldung kommt von PowerShell selbst, also ist es installiert.' },
        { id: 'c', text: 'Die NTFS-Rechte auf C:\\Windows', whyWrong: 'Die Meldung nennt ausdrücklich die Ausführungsrichtlinie.' },
      ],
      correct: 'a',
      explanation: 'Bei GPO-Vorgabe nicht lokal umgehen, sondern mit dem Kunden klären (z. B. signierte Skripte, RemoteSigned).',
      domain: 'troubleshoot',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Welcher Befehl listet alle Gruppen, in denen Max direkt Mitglied ist?',
      options: [
        { id: 'a', text: '`Get-ADPrincipalGroupMembership max`' },
        { id: 'b', text: '`Get-ADGroupMember max`', whyWrong: 'Get-ADGroupMember erwartet eine Gruppe und listet ihre Mitglieder, nicht umgekehrt.' },
        { id: 'c', text: '`whoami /groups` auf dem Server', whyWrong: 'Das zeigt die Gruppen des **angemeldeten** Benutzers, also deine eigenen, nicht die von Max.' },
      ],
      correct: 'a',
      explanation: 'Alternativ `(Get-ADUser max -Properties MemberOf).MemberOf`.',
    },
    {
      id: 'q10', type: 'ordering', difficulty: 2,
      prompt: 'Bring eine sichere Massenänderung in die richtige Reihenfolge.',
      items: [
        { id: 'a', text: 'Objekte mit Get auswählen und Anzahl prüfen' },
        { id: 'b', text: 'Ausgangszustand als CSV sichern' },
        { id: 'c', text: 'Ändernden Befehl mit -WhatIf testen' },
        { id: 'd', text: 'Für ein einzelnes Objekt ausführen und prüfen' },
        { id: 'e', text: 'Für alle ausführen und dokumentieren' },
      ],
      explanation: 'Auswählen, sichern, proben, klein anfangen, dann alles.',
    },
    {
      id: 'q11', type: 'single', difficulty: 3,
      prompt: 'Ein Skript soll Benutzer der Abteilung `$abt` deaktivieren. `$abt` ist durch einen Tippfehler leer. Was kann passieren?',
      options: [
        { id: 'a', text: 'Der Filter `Department -eq \'\'` trifft alle Benutzer ohne Abteilung. Die werden dann deaktiviert.' },
        { id: 'b', text: 'Nichts, leere Variablen werden ignoriert.', whyWrong: 'Sie werden als leerer Text eingesetzt. Der Filter ist dann gültig, trifft aber die falschen Objekte.' },
        { id: 'c', text: 'PowerShell bricht immer mit Fehler ab.', whyWrong: 'Ohne `Set-StrictMode` oder eigene Prüfung läuft das Skript einfach weiter.' },
      ],
      correct: 'a',
      explanation: 'Eingaben prüfen: `if (-not $abt) { throw \'Abteilung fehlt\' }` und vorher mit -WhatIf testen.',
    },
    {
      id: 'q12', type: 'cli', shell: 'windows', difficulty: 3,
      prompt: 'Sorge dafür, dass ein Fehler von `Add-ADGroupMember` im catch-Block landet.',
      template: 'PS> try { Add-ADGroupMember GG_Vertrieb -Members $sam -ErrorAction {{0}} } catch { $_.Exception.Message }',
      blanks: [{ accept: ['Stop'] }],
      explanation: '`-ErrorAction Stop` macht nicht beendende Fehler beendend.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Welches Cmdlet verbindet dich mit Exchange Online?',
      options: [
        { id: 'a', text: '`Connect-ExchangeOnline`' },
        { id: 'b', text: '`Enter-PSSession exchange`', whyWrong: 'Remote-Sitzungen gehen an Server. Für Exchange Online gibt es das Modul ExchangeOnlineManagement mit `Connect-ExchangeOnline`.' },
        { id: 'c', text: '`Import-Module ActiveDirectory`', whyWrong: 'Das lädt das AD-Modul. Mit Exchange Online hat es nichts zu tun.' },
      ],
      correct: 'a',
      explanation: 'Modul installieren: `Install-Module ExchangeOnlineManagement`.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Wie findest du heraus, welche PowerShell-Version der Kunde nutzt?',
      options: [
        { id: 'a', text: '`$PSVersionTable`' },
        { id: 'b', text: '`Get-Version`', whyWrong: 'Dieses Cmdlet gibt es nicht.' },
        { id: 'c', text: '`winver`', whyWrong: 'winver zeigt die Windows-Version, nicht die PowerShell-Version.' },
      ],
      correct: 'a',
      explanation: 'Wichtig, weil sich 5.1 und 7 in Details unterscheiden (z. B. Standard-Kodierung, verfügbare Module).',
      domain: 'troubleshoot',
    },
    {
      id: 'q15', type: 'single', difficulty: 3,
      prompt: 'Ein Skript läuft per Aufgabenplanung nachts und „macht manchmal nichts“. Wie bekommst du am einfachsten ein Protokoll?',
      options: [
        { id: 'a', text: '`Start-Transcript` am Anfang und `Stop-Transcript` am Ende des Skripts' },
        { id: 'b', text: 'Nachts daneben sitzen', whyWrong: 'Unpraktisch und wiederholbar ist das auch nicht. Ein Transkript protokolliert jeden Lauf.' },
        { id: 'c', text: 'Die Ausführungsrichtlinie auf Unrestricted setzen', whyWrong: 'Das ändert nichts am Protokollieren und schwächt die Sicherheit.' },
      ],
      correct: 'a',
      explanation: 'Transkript zeigt Ausgaben und Fehler jedes Laufs. Dazu prüfen, unter welchem Konto die Aufgabe läuft.',
      domain: 'troubleshoot',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'chain', difficulty: 3,
        prompt: '„Unser Skript für den Gruppenbericht liefert seit dem Umstieg auf einen neuen Server eine leere CSV.“\n\n```\nImport-Module ActiveDirectory\nGet-ADGroupMember $gruppe -Recursive |\n  Get-ADUser -Properties Department |\n  Select-Object Name, Department |\n  Export-Csv bericht.csv -NoTypeInformation\n```',
        steps: [
          {
            id: 's1', text: 'Was fragst du zuerst an?',
            options: [
              { id: 'a', text: 'Vollständige Ausgabe inkl. Fehlermeldungen beim manuellen Start und den Wert von `$gruppe`', correct: true, feedback: 'Richtig. Leere Ausgabe hat oft eine Fehlermeldung, die im geplanten Lauf niemand sieht.' },
              { id: 'b', text: 'Ob Excel installiert ist', correct: false, feedback: 'Die Datei ist leer, nicht unlesbar. Excel hat damit nichts zu tun.' },
            ],
          },
          {
            id: 's2', text: 'Ausgabe: `Import-Module : The specified module \'ActiveDirectory\' was not loaded because no valid module file was found`. Ursache?',
            options: [
              { id: 'a', text: 'Auf dem neuen Server fehlen die RSAT-AD-Tools (AD-PowerShell-Modul).', correct: true, feedback: 'Genau. Ohne Modul gibt es kein Get-ADGroupMember.' },
              { id: 'b', text: 'Die Gruppe existiert nicht mehr.', correct: false, feedback: 'Dann käme ein anderer Fehler. Hier fehlt das Modul.' },
            ],
          },
          {
            id: 's3', text: 'Lösung und Vorbeugung?',
            options: [
              { id: 'a', text: 'AD-PowerShell-Modul installieren (Server: `Install-WindowsFeature RSAT-AD-PowerShell`), Skript mit `#Requires -Modules ActiveDirectory` und `-ErrorAction Stop` absichern, Transkript aktivieren', correct: true, feedback: 'Richtig. Jetzt bricht das Skript künftig mit klarer Meldung ab.' },
              { id: 'b', text: 'Skript auf dem alten Server laufen lassen', correct: false, feedback: 'Das verschiebt das Problem nur. Der alte Server wird ja abgelöst.' },
            ],
          },
        ],
        explanation: 'Leere Ergebnisse haben fast immer eine verschluckte Fehlermeldung. Erst sichtbar machen, dann lösen.',
        domain: 'troubleshoot',
      },
      {
        id: 'b2', type: 'single', difficulty: 2,
        prompt: 'Warum gehört `Format-Table` nie vor `Export-Csv`?',
        options: [
          { id: 'a', text: 'Format-Table erzeugt Anzeigeobjekte statt Daten, die CSV enthält dann Unsinn.' },
          { id: 'b', text: 'Format-Table ist veraltet.', whyWrong: 'Format-Table ist aktuell und nützlich, aber nur für die Anzeige am Ende.' },
          { id: 'c', text: 'Export-Csv kann keine Tabellen.', whyWrong: 'Export-Csv schreibt gerade Tabellen. Es braucht dafür aber Datenobjekte, z. B. aus Select-Object.' },
        ],
        correct: 'a',
        explanation: 'Format-* immer ganz am Ende und nur für den Bildschirm.',
      },
      {
        id: 'b3', type: 'cli', shell: 'windows', difficulty: 3,
        prompt: 'Finde aktive Benutzer, deren letzte Anmeldung über 90 Tage her ist.',
        template: "PS> Get-ADUser -Filter 'Enabled -eq $true' -Properties {{0}} | Where-Object { $_.LastLogonDate {{1}} (Get-Date).AddDays(-90) }",
        blanks: [{ accept: ['LastLogonDate'] }, { accept: ['-lt'] }],
        explanation: '`LastLogonDate` kommt nur mit `-Properties`. Es wird zwischen DCs mit Verzögerung repliziert (bis ca. 14 Tage), für so einen Bericht reicht das.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Ein Kunde will per Skript 500 Benutzer aus einer CSV in Gruppen aufnehmen. Was baust du ein?',
        options: [
          { id: 'a', text: 'Pro Zeile try/catch mit `-ErrorAction Stop`, Protokoll mit Erfolg/Fehler pro Benutzer, vorher Lauf mit -WhatIf' },
          { id: 'b', text: 'Nichts, Fehler sieht man ja rot', whyWrong: 'Bei 500 Zeilen gehen rote Meldungen unter, und niemand weiß hinterher, wer fehlt.' },
          { id: 'c', text: '`$ErrorActionPreference = \'SilentlyContinue\'`, damit es durchläuft', whyWrong: 'Das versteckt alle Fehler. Hinterher weiß niemand, was nicht geklappt hat.' },
        ],
        correct: 'a',
        explanation: 'Nachvollziehbarkeit pro Objekt ist bei Massenänderungen Pflicht.',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'A customer asks in English: "Can you send me a one-liner to list all members of the group Finance, including nested groups?" Which answer is correct?',
        options: [
          { id: 'a', text: '`Get-ADGroupMember -Identity Finance -Recursive | Select-Object Name, SamAccountName`' },
          { id: 'b', text: '`Get-ADUser Finance -Recursive`', whyWrong: 'Get-ADUser has no -Recursive parameter and Finance is a group, not a user.' },
          { id: 'c', text: '`net user Finance /domain`', whyWrong: 'net user shows a user account. For groups it would be net group, and that does not resolve nested groups.' },
        ],
        correct: 'a',
        explanation: '-Recursive resolves nested groups and returns only users and computers.',
        domain: 'english',
      },
    ],
  },
};

export default level;
