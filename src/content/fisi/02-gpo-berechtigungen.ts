import type { Level } from '../../types/content';

const level: Level = {
  id: 'fisi-02',
  track: 'fisi',
  order: 2,
  title: 'Gruppenrichtlinien & Berechtigungen',
  titleEn: 'Group Policy, NTFS and Share Permissions',
  summary: 'Wie Gruppenrichtlinien (GPOs) aufgebaut sind und in welcher Reihenfolge sie gelten (LSDOU), wie man sie prüft (gpupdate, gpresult), wie NTFS- und Freigabeberechtigungen zusammenwirken und warum „Verweigern“ meist gewinnt.',
  certs: ['fisi'],
  domains: { fisi: 'ap2-admin' },
  lab: {
    title: 'Gruppenrichtlinie und Dateifreigabe in der Test-Domäne',
    needs: 'Die Test-Domäne `lab.local` aus dem Lab von C1 (DC als VM), optional ein zweiter Windows-PC als Domänenmitglied',
    steps: [
      'Öffne die Gruppenrichtlinienverwaltung (`gpmc.msc`). Klicke mit rechts auf die OU `Mitarbeiter` und wähle „Gruppenrichtlinienobjekt hier erstellen und verknüpfen“. Name: `GPO_Mitarbeiter_Systemsteuerung`.',
      'Bearbeite das GPO: Benutzerkonfiguration → Richtlinien → Administrative Vorlagen → Systemsteuerung → „Zugriff auf die Systemsteuerung und PC-Einstellungen nicht zulassen“ → Aktiviert.',
      'Melde dich (am DC oder Client) als Testbenutzer aus der OU an und führe `gpupdate /force` aus. Prüfe danach mit `gpresult /r`, ob das GPO unter „Angewendete Gruppenrichtlinienobjekte“ steht.',
      'Lege den Ordner `C:\\Freigaben\\Angebote` an. Gib ihn frei (Freigabeberechtigung: „Authentifizierte Benutzer“ Ändern). Entferne unter Sicherheit → Erweitert die Vererbung und gib nur `GG_Vertrieb` (bzw. einer neuen domänenlokalen Gruppe) „Ändern“.',
      'Prüfe mit `icacls C:\\Freigaben\\Angebote`, welche Rechte gesetzt sind. Teste den Zugriff über `\\\\DC01\\Angebote` mit einem Benutzer innerhalb und einem außerhalb der Gruppe.',
      'Aufräumen: GPO-Verknüpfung löschen, GPO löschen, Freigabe entfernen. Oder die ganze Lab-VM löschen, wenn du sie nicht mehr brauchst.',
    ],
  },
  lesson: [
    {
      heading: 'Was ist eine Gruppenrichtlinie?',
      body: `Eine **Gruppenrichtlinie** (Group Policy) legt Einstellungen für viele PCs und Benutzer gleichzeitig fest, zentral vom Domänencontroller aus. Beispiele:
- Passwortlänge und Kontosperre
- Bildschirmsperre nach 10 Minuten
- Netzlaufwerke und Drucker verbinden
- USB-Sticks sperren, Systemsteuerung ausblenden
- Software verteilen, Windows-Firewall konfigurieren

Die Einstellungen stecken in einem **Gruppenrichtlinienobjekt (GPO)**. Ein GPO wirkt erst, wenn man es mit einem **Standort**, der **Domäne** oder einer **OU** **verknüpft** (link). Ein GPO kann an mehreren Stellen verknüpft sein.

Jedes GPO hat zwei Teile:
| Teil | gilt für | wird angewendet |
|---|---|---|
| **Computerkonfiguration** | Computerkonten in der OU | beim Start des PCs |
| **Benutzerkonfiguration** | Benutzerkonten in der OU | bei der Anmeldung |

**Wichtig:** Es zählt, wo das **Objekt** liegt. Eine Benutzereinstellung in einem GPO, das an die OU „Computer-Buchhaltung“ verknüpft ist, wirkt nicht, wenn dort nur Computer liegen (Ausnahme: **Loopback-Verarbeitung**, z. B. für Terminalserver).

Danach aktualisieren PCs ihre Richtlinien im Hintergrund **alle 90 Minuten** (plus zufällig bis zu 30 Minuten), Domänencontroller alle 5 Minuten. Gespeichert werden GPOs im Ordner **SYSVOL** auf jedem DC, von dort holen die Clients sie per SMB.

**Werkzeuge:**
- **Gruppenrichtlinienverwaltung** (\`gpmc.msc\`): GPOs anlegen, verknüpfen, Berichte
- \`gpupdate /force\`: Richtlinien sofort neu anwenden
- \`gpresult /r\` (Kurzbericht) bzw. \`gpresult /h bericht.html\`: welche GPOs tatsächlich gelten`,
      analogy: 'Ein GPO ist wie eine Hausordnung. Solange sie nur in der Schublade liegt, gilt sie nirgends. Erst wenn sie an einer Tür (Domäne, OU) aushängt, gilt sie für alle, die dahinter wohnen.',
      terms: [
        { de: 'Gruppenrichtlinie', en: 'Group Policy' },
        { de: 'Gruppenrichtlinienobjekt', en: 'Group Policy Object (GPO)' },
        { de: 'Verknüpfung', en: 'GPO link' },
        { de: 'Loopbackverarbeitung', en: 'loopback processing' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Du hast ein GPO erstellt und eingestellt, es wirkt aber auf keinem PC. Was fehlt am wahrscheinlichsten?',
        options: [
          { id: 'a', text: 'Die Verknüpfung mit einer Domäne, einem Standort oder einer OU' },
          { id: 'b', text: 'Ein Neustart des Domänencontrollers', whyWrong: 'Ein DC muss für neue GPOs nicht neu starten. Er speichert sie sofort im SYSVOL. Ein GPO, das nirgends verknüpft ist, wirkt aber auf kein einziges Objekt, egal wie oft man neu startet.' },
          { id: 'c', text: 'Eine Lizenz für Gruppenrichtlinien', whyWrong: 'Gruppenrichtlinien sind Teil von Active Directory und kosten nichts extra. Das Problem ist, dass das GPO nur existiert, aber nirgends verknüpft ist.' },
        ],
        correct: 'a',
        explanation: 'Ein GPO gilt nur dort, wo es verknüpft ist. Erst die Verknüpfung mit Domäne, Standort oder OU macht es wirksam.',
      },
      sources: [{ title: 'Microsoft Learn – gpupdate', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpupdate' }],
    },
    {
      heading: 'Reihenfolge: LSDOU',
      body: `Gelten mehrere GPOs, werden sie in fester Reihenfolge angewendet. Merkwort **LSDOU**:
1. **L**okal: die lokale Richtlinie des PCs (\`gpedit.msc\`)
2. **S**tandort (site)
3. **D**omäne
4. **O**rganisations**u**nit, von der übergeordneten zur untergeordneten OU

**Wer zuletzt kommt, gewinnt.** Widersprechen sich zwei GPOs, setzt sich das spätere durch, also meist das GPO an der OU, die dem Objekt am nächsten ist. Setzt die Domäne „Bildschirmsperre nach 15 Minuten“ und die OU „Buchhaltung“ „nach 5 Minuten“, gilt für die Buchhaltung 5 Minuten.

Sind an einer OU mehrere GPOs verknüpft, entscheidet die **Verknüpfungsreihenfolge**: **Nummer 1 hat die höchste Priorität** (wird zuletzt angewendet).

**Eingriffe in die Vererbung:**
- **Vererbung deaktivieren** (block inheritance) an einer OU: GPOs von oben gelten dort nicht mehr.
- **Erzwungen** (enforced) an einer Verknüpfung: Dieses GPO kann von unten **nicht überschrieben** und **nicht blockiert** werden. Erzwungen schlägt also „Vererbung deaktivieren“.

**Ausnahme Kennwortrichtlinie:** Passwortlänge, Ablauf und Kontosperre für **Domänenkonten** wirken nur aus GPOs, die an der **Domäne** verknüpft sind (normalerweise die *Default Domain Policy*). An einer OU verknüpft, betreffen sie nur lokale Konten der PCs. Für abweichende Regeln einzelner Gruppen gibt es **differenzierte Kennwortrichtlinien** (Fine-Grained Password Policies).`,
      analogy: 'LSDOU ist wie Anweisungen auf einer Baustelle: Erst das Gesetz (lokal), dann die Stadt (Standort), dann die Firma (Domäne), zuletzt der Polier vor Ort (OU). Der Polier hat das letzte Wort. Nur was die Firma als „erzwungen“ markiert, darf er nicht ändern.',
      terms: [
        { de: 'Vererbung deaktivieren', en: 'block inheritance' },
        { de: 'Erzwungen', en: 'enforced' },
        { de: 'Verknüpfungsreihenfolge', en: 'link order' },
        { de: 'differenzierte Kennwortrichtlinie', en: 'fine-grained password policy' },
      ],
      check: {
        id: 'c2', type: 'ordering', difficulty: 2,
        prompt: 'In welcher Reihenfolge werden Gruppenrichtlinien angewendet (zuerst oben)?',
        items: [
          { id: 'l', text: 'Lokale Richtlinie' },
          { id: 's', text: 'Standort' },
          { id: 'd', text: 'Domäne' },
          { id: 'ou', text: 'OU (übergeordnet → untergeordnet)' },
        ],
        explanation: 'LSDOU: lokal, Standort, Domäne, OU. Das zuletzt angewendete GPO gewinnt bei Konflikten.',
      },
    },
    {
      heading: 'Filtern, prüfen, Fehler finden',
      body: `Nicht jedes GPO soll für alle Objekte in einer OU gelten. Dafür gibt es Filter:
- **Sicherheitsfilterung**: Standard ist „Authentifizierte Benutzer“. Ersetzt man das durch eine Gruppe, gilt das GPO nur für deren Mitglieder. **Achtung:** Die Computer brauchen weiterhin **Leserecht** auf das GPO (z. B. über „Authentifizierte Benutzer“ oder „Domänencomputer“ unter Delegierung). Sonst wird das GPO seit einem Sicherheitsupdate von 2016 gar nicht angewendet.
- **WMI-Filter**: Bedingungen wie „nur Windows 11“ oder „nur Laptops“.

**Wenn eine Richtlinie nicht greift, prüfe der Reihe nach:**
1. Liegt das Objekt (Benutzer bzw. Computer) in der OU, an der das GPO verknüpft ist?
2. Passt der Teil: Benutzer- oder Computerkonfiguration?
3. Ist die Verknüpfung aktiviert, blockiert eine OU die Vererbung, überschreibt ein anderes GPO?
4. Passt die Sicherheitsfilterung?
5. \`gpupdate /force\`, dann \`gpresult /r\` bzw. \`/h\`: Steht das GPO unter „angewendet“ oder unter „gefiltert“ (mit Grund)?
6. Erreicht der Client den DC (DNS, SYSVOL)?

Manche Einstellungen brauchen mehr als \`gpupdate\`: Softwareinstallation und Ordnerumleitung greifen erst bei **Neustart** bzw. **Neuanmeldung**. \`gpupdate\` sagt das dann selbst an.

**Administrative Vorlagen** (ADMX-Dateien) liefern die Einstellungen für Windows, Office, Edge usw. Damit alle Admins dieselben Vorlagen sehen, legt man sie in den **Zentralspeicher** (central store) im SYSVOL: \`\\\\firma.local\\SYSVOL\\firma.local\\Policies\\PolicyDefinitions\`.`,
      terms: [
        { de: 'Sicherheitsfilterung', en: 'security filtering' },
        { de: 'Richtlinienergebnissatz', en: 'Resultant Set of Policy (RSoP)' },
        { de: 'Administrative Vorlagen', en: 'administrative templates (ADMX)' },
        { de: 'Zentralspeicher', en: 'central store' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Mit welchem Befehl siehst du auf einem PC, welche GPOs tatsächlich für den angemeldeten Benutzer gelten?',
        options: [
          { id: 'a', text: '`gpresult /r`' },
          { id: 'b', text: '`gpupdate /force`', whyWrong: '`gpupdate /force` wendet alle Richtlinien sofort neu an. Welche GPOs dabei gelten, zeigt es nicht an. Dafür ruft man danach `gpresult /r` auf.' },
          { id: 'c', text: '`gpedit.msc`', whyWrong: '`gpedit.msc` bearbeitet nur die lokale Richtlinie dieses einen PCs. Die Domänen-GPOs und das Gesamtergebnis zeigt es nicht. Das Ergebnis aller GPOs liefert `gpresult`.' },
          { id: 'd', text: '`ipconfig /all`', whyWrong: '`ipconfig /all` zeigt Netzwerkeinstellungen wie IP, Gateway und DNS-Server. Das ist bei GPO-Problemen nützlich (findet der PC den DC?), zeigt aber keine Richtlinien.' },
        ],
        correct: 'a',
        explanation: '`gpresult /r` zeigt den Richtlinienergebnissatz: angewendete und gefilterte GPOs für Computer und Benutzer.',
      },
      sources: [{ title: 'Microsoft Learn – gpresult', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpresult' }],
    },
    {
      heading: 'NTFS- und Freigabeberechtigungen',
      body: `Auf einen freigegebenen Ordner wirken **zwei Arten** von Rechten:

**Freigabeberechtigungen** (share permissions) gelten nur beim Zugriff **über das Netzwerk** (\`\\\\server\\freigabe\`). Es gibt nur drei: **Lesen**, **Ändern**, **Vollzugriff**.

**NTFS-Berechtigungen** gelten **immer**, auch lokal am Server. Sie sind feiner:
| Recht | erlaubt |
|---|---|
| **Lesen** | Dateien öffnen und ansehen |
| **Lesen, Ausführen** | dazu Programme starten |
| **Ordnerinhalt anzeigen** | wie Lesen, Ausführen, nur für Ordner |
| **Schreiben** | neue Dateien anlegen, Inhalte ändern |
| **Ändern** | alles davon plus **löschen** |
| **Vollzugriff** | dazu Rechte ändern und Besitz übernehmen |

**Über das Netz gilt das strengere von beiden.** Freigabe „Ändern“ + NTFS „Lesen“ = effektiv nur **Lesen**. Freigabe „Lesen“ + NTFS „Vollzugriff“ = auch nur **Lesen**.

Darum ist es verbreitete Praxis, die Freigabe großzügig zu setzen (z. B. „Authentifizierte Benutzer: Ändern“) und **fein nur per NTFS** zu steuern. Dann muss man nur an einer Stelle nachsehen.

**Rechte mehrerer Gruppen addieren sich.** Ist Anna in „Vertrieb“ (Lesen) und „Projektteam“ (Ändern), hat sie Ändern.

**Verweigern** schlägt Zulassen, mit einer Feinheit: Ein **explizit** (direkt am Ordner) gesetztes Zulassen schlägt ein **geerbtes** Verweigern. Die Rangfolge ist: explizit verweigern → explizit zulassen → geerbt verweigern → geerbt zulassen. Verweigern setzt man sparsam ein, meist reicht es, ein Recht einfach nicht zu geben.`,
      analogy: 'Freigabe und NTFS sind wie Haustür und Zimmertür. Wer übers Netz kommt, muss durch beide. Ist die Haustür nur zum Schauen offen, hilft der Zimmerschlüssel nichts. Wer schon im Haus ist (lokal am Server), braucht nur die Zimmertür.',
      compare: {
        left: 'Freigabeberechtigung', right: 'NTFS-Berechtigung',
        rows: [
          ['nur beim Zugriff übers Netzwerk', 'immer, auch lokal'],
          ['3 Stufen: Lesen, Ändern, Vollzugriff', 'feine Stufen und Spezialrechte'],
          ['gilt für die ganze Freigabe', 'pro Ordner und Datei, mit Vererbung'],
          ['im Freigabe-Dialog', 'Registerkarte „Sicherheit“ oder `icacls`'],
        ],
      },
      terms: [
        { de: 'Freigabeberechtigung', en: 'share permission' },
        { de: 'NTFS-Berechtigung', en: 'NTFS permission' },
        { de: 'effektive Berechtigung', en: 'effective access' },
        { de: 'Zugriffssteuerungsliste', en: 'access control list (ACL)' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Freigabe: Jeder – Vollzugriff. NTFS: Vertrieb – Lesen. Was darf ein Vertriebler über das Netzwerk?',
        options: [
          { id: 'a', text: 'Nur lesen' },
          { id: 'b', text: 'Alles (Vollzugriff)', whyWrong: 'Über das Netzwerk gilt das strengere Recht aus Freigabe und NTFS. Die Freigabe erlaubt zwar Vollzugriff, NTFS aber nur Lesen. Effektiv bleibt Lesen.' },
          { id: 'c', text: 'Gar nichts, weil sich die Rechte widersprechen', whyWrong: 'Die Rechte widersprechen sich nicht, sie werden kombiniert: Das strengere gilt. Beide erlauben mindestens Lesen, also darf der Vertriebler lesen.' },
          { id: 'd', text: 'Lesen und schreiben, aber nicht löschen', whyWrong: 'Schreiben erlaubt NTFS hier nicht, nur Lesen. Über das Netz bestimmt das strengere der beiden Rechte, also NTFS „Lesen“.' },
        ],
        correct: 'a',
        explanation: 'Netzwerkzugriff = strengeres Recht aus Freigabe und NTFS. Vollzugriff + Lesen = Lesen.',
      },
      sources: [{ title: 'Microsoft Learn – icacls', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls' }],
    },
    {
      heading: 'Vererbung, Besitz, Kopieren und Verschieben',
      body: `NTFS-Rechte werden standardmäßig vom übergeordneten Ordner **vererbt** (inheritance). Geerbte Einträge erscheinen ausgegraut. Will man einem Unterordner andere Rechte geben, **deaktiviert man die Vererbung** und wählt, ob die geerbten Einträge als explizite übernommen oder entfernt werden.

**Besitzer** (owner): Wer eine Datei anlegt, wird ihr Besitzer. Der Besitzer kann die Rechte immer ändern. Administratoren können den **Besitz übernehmen** (take ownership), auch wenn sie sonst kein Recht auf die Datei haben. So kommt man an Daten ausgeschiedener Mitarbeiter.

**Kopieren und Verschieben** (klassische Prüfungsfrage):
| Aktion | Rechte danach |
|---|---|
| **Verschieben** auf **demselben** NTFS-Laufwerk | Rechte bleiben erhalten |
| **Kopieren** (egal wohin) | erbt die Rechte des Zielordners |
| **Verschieben** auf ein **anderes** Laufwerk | ist intern Kopieren + Löschen, erbt also vom Ziel |
| auf FAT32/exFAT (z. B. USB-Stick) | alle NTFS-Rechte gehen verloren |

**Zugriffsbasierte Aufzählung** (Access-Based Enumeration, ABE): Benutzer sehen in einer Freigabe nur die Ordner, auf die sie mindestens Lesezugriff haben. Das sorgt für Übersicht und verrät nicht, welche Ordner es sonst gibt.

**Rechte per Kommandozeile** mit \`icacls\`:
\`\`\`
icacls D:\\Daten\\Angebote
icacls D:\\Daten\\Angebote /grant "FIRMA\\DL_Angebote_Lesen:(OI)(CI)RX"
\`\`\`
(OI)(CI) = gilt für Unterordner und Dateien, RX = Lesen und Ausführen. In PowerShell: \`Get-Acl\` und \`Set-Acl\`.`,
      terms: [
        { de: 'Vererbung', en: 'inheritance' },
        { de: 'Besitzer', en: 'owner' },
        { de: 'Besitz übernehmen', en: 'take ownership' },
        { de: 'zugriffsbasierte Aufzählung', en: 'access-based enumeration (ABE)' },
      ],
      check: {
        id: 'c5', type: 'single', difficulty: 2,
        prompt: 'Eine Datei mit eigenen NTFS-Rechten wird von `D:\\Projekte` nach `D:\\Archiv` **kopiert**. Welche Rechte hat die Kopie?',
        options: [
          { id: 'a', text: 'Die geerbten Rechte des Zielordners D:\\Archiv' },
          { id: 'b', text: 'Dieselben Rechte wie das Original', whyWrong: 'Das gilt nur beim Verschieben auf demselben Laufwerk. Eine Kopie ist eine neue Datei. Sie bekommt wie jede neue Datei die vererbten Rechte des Zielordners.' },
          { id: 'c', text: 'Gar keine Rechte, nur der Administrator kann sie öffnen', whyWrong: 'Neue Dateien sind nie rechtelos, sie erben vom Ordner, in dem sie entstehen. Die Kopie bekommt also die Rechte von D:\\Archiv.' },
        ],
        correct: 'a',
        explanation: 'Kopieren erzeugt eine neue Datei, die vom Zielordner erbt. Nur Verschieben auf demselben NTFS-Laufwerk behält die Rechte.',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Womit verwaltest du Gruppenrichtlinien in einer Domäne?',
      options: [
        { id: 'a', text: 'Gruppenrichtlinienverwaltung (`gpmc.msc`)' },
        { id: 'b', text: 'Lokaler Gruppenrichtlinien-Editor (`gpedit.msc`)', whyWrong: '`gpedit.msc` bearbeitet nur die lokale Richtlinie des einen PCs, an dem man sitzt. Domänen-GPOs, die für viele PCs gelten, legt man in der Gruppenrichtlinienverwaltung an und verknüpft sie dort.' },
        { id: 'c', text: 'Geräte-Manager (`devmgmt.msc`)', whyWrong: 'Der Geräte-Manager zeigt Hardware und Treiber eines PCs. Mit Gruppenrichtlinien hat er nichts zu tun.' },
        { id: 'd', text: 'Ereignisanzeige (`eventvwr.msc`)', whyWrong: 'In der Ereignisanzeige findet man Fehlermeldungen, auch zur Gruppenrichtlinie. Anlegen oder verknüpfen kann man GPOs dort aber nicht.' },
      ],
      correct: 'a',
      explanation: 'In `gpmc.msc` legt man GPOs an, bearbeitet und verknüpft sie, und man erzeugt Berichte und Modellierungen.',
    },
    {
      id: 'q2', type: 'single', difficulty: 2,
      prompt: 'Domäne: „Bildschirmsperre nach 15 Minuten“. OU Buchhaltung: „nach 5 Minuten“. Was gilt für einen Benutzer in der OU Buchhaltung?',
      options: [
        { id: 'a', text: '5 Minuten' },
        { id: 'b', text: '15 Minuten', whyWrong: 'Das Domänen-GPO wird vor dem OU-GPO angewendet (LSDOU). Das später angewendete OU-GPO überschreibt es. Nur wenn das Domänen-GPO „erzwungen“ wäre, gälten 15 Minuten.' },
        { id: 'c', text: 'Der kleinere Wert gilt immer, egal wo das GPO verknüpft ist', whyWrong: 'Gruppenrichtlinien suchen nicht den strengsten Wert aus. Es gewinnt das zuletzt angewendete GPO. Hier ist das zufällig der kleinere Wert, weil er an der OU steht.' },
        { id: 'd', text: 'Keiner, die GPOs heben sich gegenseitig auf', whyWrong: 'GPOs heben sich nie auf. Bei Konflikten gewinnt das zuletzt angewendete GPO, nach LSDOU das an der OU.' },
      ],
      correct: 'a',
      explanation: 'LSDOU: Das OU-GPO kommt nach dem Domänen-GPO und überschreibt den Wert.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Die OU „Entwicklung“ hat „Vererbung deaktivieren“ gesetzt. Ein Domänen-GPO mit Sicherheitsvorgaben soll trotzdem dort gelten. Was tust du?',
      options: [
        { id: 'a', text: 'Die Verknüpfung des Domänen-GPOs auf „Erzwungen“ setzen' },
        { id: 'b', text: 'Das GPO in der Verknüpfungsreihenfolge auf 1 setzen', whyWrong: 'Die Verknüpfungsreihenfolge gilt nur für mehrere GPOs an derselben Stelle. Gegen „Vererbung deaktivieren“ an einer tieferen OU hilft sie nicht. Das schafft nur „Erzwungen“.' },
        { id: 'c', text: 'Die Benutzer in die Domänen-Admins aufnehmen', whyWrong: 'Mitgliedschaft in Domänen-Admins ändert nicht, welche GPOs gelten, gibt aber gefährlich viele Rechte. Gegen blockierte Vererbung hilft „Erzwungen“ an der Verknüpfung.' },
        { id: 'd', text: '`gpupdate /force` auf allen PCs ausführen', whyWrong: '`gpupdate /force` wendet nur die Richtlinien neu an, die laut AD gelten. Die blockierte Vererbung bleibt bestehen. Erst „Erzwungen“ durchbricht sie.' },
      ],
      correct: 'a',
      explanation: 'Erzwungene Verknüpfungen können weder blockiert noch von tieferen GPOs überschrieben werden.',
    },
    {
      id: 'q4', type: 'dragdrop', difficulty: 2,
      prompt: 'Wann wird welcher Teil eines GPOs angewendet?',
      items: [
        { id: 'pc', text: 'Computerkonfiguration' },
        { id: 'user', text: 'Benutzerkonfiguration' },
        { id: 'bg', text: 'Hintergrundaktualisierung auf Clients' },
        { id: 'dc', text: 'Hintergrundaktualisierung auf DCs' },
      ],
      buckets: [
        { id: 'boot', label: 'beim Start des PCs' },
        { id: 'logon', label: 'bei der Anmeldung' },
        { id: '90', label: 'etwa alle 90 Minuten' },
        { id: '5', label: 'alle 5 Minuten' },
      ],
      solution: { pc: 'boot', user: 'logon', bg: '90', dc: '5' },
      explanation: 'Computer beim Start, Benutzer bei der Anmeldung, danach im Hintergrund: Clients alle 90 Minuten (plus Zufallsversatz), DCs alle 5 Minuten.',
    },
    {
      id: 'q5', type: 'scenario', difficulty: 2,
      prompt: 'Warum greift die Einstellung nicht?',
      scenario: 'Ein GPO mit der **Benutzer**einstellung „Laufwerk H: verbinden“ ist an die OU `Computer-Vertrieb` verknüpft. In dieser OU liegen nur die PCs des Vertriebs. Die Benutzerkonten liegen in der OU `Benutzer-Vertrieb`.',
      options: [
        { id: 'a', text: 'Benutzereinstellungen wirken nur auf Benutzerkonten in der verknüpften OU. Dort liegen keine Benutzer.' },
        { id: 'b', text: 'Laufwerkszuordnungen gehen nur per Anmeldeskript.', whyWrong: 'Laufwerke lassen sich sehr wohl per GPO verbinden (Gruppenrichtlinien-Einstellungen, Preferences → Laufwerkszuordnungen). Das Problem ist der Ort: Benutzereinstellungen an einer OU ohne Benutzer wirken nicht.' },
        { id: 'c', text: 'Die PCs müssen neu gestartet werden.', whyWrong: 'Ein Neustart wendet die Computerkonfiguration an. Die Benutzerkonfiguration dieses GPOs gilt aber für niemanden, weil in der OU keine Benutzer liegen. Daran ändert auch ein Neustart nichts.' },
        { id: 'd', text: 'Das GPO muss an der Domäne verknüpft sein.', whyWrong: 'An der Domäne verknüpft, würde es für alle Benutzer der Firma gelten, nicht nur für den Vertrieb. Richtig ist, das GPO an `Benutzer-Vertrieb` zu verknüpfen (oder Loopback-Verarbeitung zu nutzen).' },
      ],
      correct: 'a',
      explanation: 'Benutzerkonfiguration wirkt auf Benutzerobjekte, Computerkonfiguration auf Computerobjekte, jeweils in der verknüpften OU. Lösung: GPO an `Benutzer-Vertrieb` verknüpfen.',
    },
    {
      id: 'q6', type: 'cli', shell: 'windows', difficulty: 1,
      prompt: 'Wende auf einem Client alle Gruppenrichtlinien sofort neu an (auch unveränderte).',
      template: 'gpupdate {{0}}',
      blanks: [{ accept: ['/force', '/Force', '/FORCE'] }],
      explanation: '`gpupdate` allein wendet nur geänderte Richtlinien an. `/force` wendet alle neu an.',
    },
    {
      id: 'q7', type: 'single', difficulty: 3,
      prompt: 'Du setzt die Mindestkennwortlänge für Domänenkonten in einem GPO an der OU „Admins“ auf 20 Zeichen. Was passiert?',
      options: [
        { id: 'a', text: 'Für Domänenkonten ändert sich nichts. Kennwortrichtlinien für Domänenkonten wirken nur aus GPOs an der Domäne.' },
        { id: 'b', text: 'Alle Admins müssen ab sofort 20 Zeichen nutzen.', whyWrong: 'Die Kennwortrichtlinie für Domänenkonten wird vom DC nur aus GPOs an der Domänenebene übernommen. An einer OU wirkt sie nur auf die lokalen Konten der Computer in dieser OU. Für abweichende Regeln einzelner Gruppen nutzt man differenzierte Kennwortrichtlinien.' },
        { id: 'c', text: 'Alle Benutzer der Domäne müssen 20 Zeichen nutzen.', whyWrong: 'Ein GPO an einer OU wirkt nie auf die ganze Domäne. Für Domänenkonten wird die Einstellung hier sogar komplett ignoriert, weil sie nicht an der Domäne verknüpft ist.' },
        { id: 'd', text: 'Das GPO lässt sich nicht speichern.', whyWrong: 'Man kann die Einstellung in jedem GPO speichern, Windows warnt nicht. Gerade das macht den Fehler tückisch: Sie wirkt nur nicht auf Domänenkonten.' },
      ],
      correct: 'a',
      explanation: 'Kennwort- und Kontosperrungsrichtlinien für Domänenkonten kommen aus GPOs an der Domäne. Ausnahmen für Gruppen: differenzierte Kennwortrichtlinien (PSO).',
    },
    {
      id: 'q8', type: 'scenario', difficulty: 3,
      prompt: 'Was ist die Ursache?',
      scenario: 'Ein GPO soll nur für die Gruppe `GG_Vertrieb` gelten. In der Sicherheitsfilterung wurde „Authentifizierte Benutzer“ entfernt und `GG_Vertrieb` hinzugefügt. `gpresult /r` zeigt das GPO bei Vertrieblern nicht unter „angewendet“. Unter „Delegierung“ hat nur `GG_Vertrieb` Leserechte.',
      options: [
        { id: 'a', text: 'Die Computerkonten brauchen Leserecht auf das GPO, z. B. über „Domänencomputer“ oder „Authentifizierte Benutzer“ (nur Lesen).' },
        { id: 'b', text: 'Sicherheitsfilterung funktioniert nur mit domänenlokalen Gruppen.', whyWrong: 'Sicherheitsfilterung funktioniert mit globalen, universellen und domänenlokalen Sicherheitsgruppen. Das Problem ist ein anderes: Seit dem Update MS16-072 liest der Computer das GPO mit seinem eigenen Konto und braucht dafür Leserecht.' },
        { id: 'c', text: 'Die Vertriebler müssen Domänen-Admins sein.', whyWrong: 'Für das Anwenden eines GPOs braucht ein Benutzer nur Lesen und „Gruppenrichtlinie übernehmen“. Admin-Rechte sind dafür weder nötig noch sinnvoll. Hier fehlt das Leserecht der Computerkonten.' },
        { id: 'd', text: 'Das GPO muss erst 24 Stunden alt sein.', whyWrong: 'Es gibt keine Wartezeit für neue GPOs. Nach der Replikation zwischen den DCs und `gpupdate` wirkt es sofort. Das GPO wird hier gefiltert, weil die Computer es nicht lesen dürfen.' },
      ],
      correct: 'a',
      explanation: 'Wer „Authentifizierte Benutzer“ aus der Filterung entfernt, muss unter Delegierung ein Leserecht für Computer (z. B. Domänencomputer) ergänzen.',
    },
    {
      id: 'q9', type: 'dragdrop', difficulty: 1,
      prompt: 'Ist das eine Freigabe- oder eine NTFS-Eigenschaft?',
      items: [
        { id: 'net', text: 'gilt nur beim Zugriff übers Netzwerk' },
        { id: 'local', text: 'gilt auch lokal am Server' },
        { id: 'three', text: 'nur drei Stufen: Lesen, Ändern, Vollzugriff' },
        { id: 'inh', text: 'wird an Unterordner und Dateien vererbt' },
        { id: 'icacls', text: 'mit `icacls` anzeigen und ändern' },
      ],
      buckets: [
        { id: 'share', label: 'Freigabeberechtigung' },
        { id: 'ntfs', label: 'NTFS-Berechtigung' },
      ],
      solution: { net: 'share', local: 'ntfs', three: 'share', inh: 'ntfs', icacls: 'ntfs' },
      explanation: 'Freigaben gelten nur übers Netz und kennen drei Stufen. NTFS gilt immer, ist feiner, vererbt sich und wird mit `icacls` gepflegt.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Freigabe: Authentifizierte Benutzer – Lesen. NTFS: GG_Projekt – Ändern. Ein Projektmitglied greift über `\\\\fs01\\Projekt` zu. Was darf es?',
      options: [
        { id: 'a', text: 'Nur lesen' },
        { id: 'b', text: 'Ändern, weil NTFS wichtiger ist', whyWrong: 'Beim Netzwerkzugriff zählen beide, und das strengere gewinnt. Die Freigabe erlaubt nur Lesen, also bleibt es bei Lesen, egal was NTFS erlaubt.' },
        { id: 'c', text: 'Ändern, weil sich die Rechte addieren', whyWrong: 'Addiert werden Rechte aus mehreren Gruppen innerhalb derselben Art (z. B. zwei NTFS-Einträge). Freigabe und NTFS werden nicht addiert, sondern es gilt das strengere von beiden.' },
        { id: 'd', text: 'Gar nichts', whyWrong: 'Beide Ebenen erlauben mindestens Lesen. Das strengere Recht ist Lesen, also darf das Mitglied lesen, aber nicht ändern.' },
      ],
      correct: 'a',
      explanation: 'Netzwerkzugriff: strengeres Recht aus Freigabe (Lesen) und NTFS (Ändern) = Lesen. Lokal am Server hätte es Ändern.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Max ist in `GG_Vertrieb` (NTFS: Lesen) und `GG_Messe` (NTFS: Ändern) auf denselben Ordner. Welches NTFS-Recht hat er?',
      options: [
        { id: 'a', text: 'Ändern' },
        { id: 'b', text: 'Lesen, das strengere Recht gewinnt', whyWrong: '„Das strengere gewinnt“ gilt zwischen Freigabe und NTFS. Innerhalb von NTFS addieren sich die Rechte mehrerer Gruppen. Lesen plus Ändern ergibt Ändern.' },
        { id: 'c', text: 'Gar keins, weil sich die Gruppen widersprechen', whyWrong: 'Zwei Zulassen-Einträge widersprechen sich nicht, sie addieren sich. Nur ein ausdrückliches Verweigern würde Rechte entziehen.' },
        { id: 'd', text: 'Vollzugriff, weil zwei Rechte zusammen mehr ergeben', whyWrong: 'Die Rechte werden vereinigt, nicht hochgestuft. Lesen und Ändern zusammen ergibt Ändern. Vollzugriff (Rechte ändern, Besitz übernehmen) kommt nur, wenn ein Eintrag ihn ausdrücklich erlaubt.' },
      ],
      correct: 'a',
      explanation: 'NTFS-Rechte aus mehreren Gruppen werden vereinigt. Max hat also Ändern.',
    },
    {
      id: 'q12', type: 'single', difficulty: 3,
      prompt: 'Am Ordner `Personal` erbt `GG_Alle` ein **Verweigern** für Lesen. Direkt am Unterordner `Personal\\Formulare` ist für `GG_Alle` **Zulassen** Lesen explizit gesetzt. Kann ein Mitglied die Formulare lesen?',
      options: [
        { id: 'a', text: 'Ja, ein explizites Zulassen schlägt ein geerbtes Verweigern.' },
        { id: 'b', text: 'Nein, Verweigern gewinnt immer.', whyWrong: '„Verweigern gewinnt“ gilt nur auf gleicher Ebene. Windows prüft zuerst explizite, dann geerbte Einträge. Ein direkt am Ordner gesetztes Zulassen kommt darum vor dem geerbten Verweigern.' },
        { id: 'c', text: 'Nein, weil Unterordner keine eigenen Rechte haben dürfen', whyWrong: 'Unterordner dürfen eigene, explizite Rechte zusätzlich zu den geerbten haben. Genau so ist es hier eingerichtet.' },
        { id: 'd', text: 'Nur wenn die Vererbung deaktiviert ist', whyWrong: 'Die Vererbung muss nicht deaktiviert sein. Explizite Einträge werden ohnehin vor geerbten ausgewertet, daher greift das explizite Zulassen schon jetzt.' },
      ],
      correct: 'a',
      explanation: 'Reihenfolge: explizit verweigern → explizit zulassen → geerbt verweigern → geerbt zulassen.',
    },
    {
      id: 'q13', type: 'dragdrop', difficulty: 2,
      prompt: 'Welche Rechte hat die Datei nach der Aktion?',
      items: [
        { id: 'mvsame', text: 'Verschieben von D:\\A nach D:\\B' },
        { id: 'cpsame', text: 'Kopieren von D:\\A nach D:\\B' },
        { id: 'mvother', text: 'Verschieben von D:\\A nach E:\\B (beides NTFS)' },
        { id: 'usb', text: 'Kopieren auf einen FAT32-USB-Stick' },
      ],
      buckets: [
        { id: 'keep', label: 'behält ihre Rechte' },
        { id: 'inherit', label: 'erbt vom Zielordner' },
        { id: 'none', label: 'keine NTFS-Rechte mehr' },
      ],
      solution: { mvsame: 'keep', cpsame: 'inherit', mvother: 'inherit', usb: 'none' },
      explanation: 'Nur Verschieben auf demselben NTFS-Laufwerk behält die Rechte. Kopieren und Verschieben auf ein anderes Laufwerk erzeugen eine neue Datei, die vom Ziel erbt. FAT32 kennt keine NTFS-Rechte.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Ein Mitarbeiter ist ausgeschieden. Auf seinen Ordner haben selbst Administratoren keinen Zugriff. Was tust du?',
      options: [
        { id: 'a', text: 'Als Administrator den Besitz übernehmen und danach die Rechte anpassen' },
        { id: 'b', text: 'Das Benutzerkonto löschen, dann werden die Rechte frei', whyWrong: 'Wird das Konto gelöscht, bleiben in der ACL nur unbekannte SIDs stehen. Zugriff bekommt dadurch niemand. Man übernimmt als Administrator den Besitz und setzt die Rechte neu.' },
        { id: 'c', text: 'Den Ordner formatieren', whyWrong: 'Formatieren betrifft ganze Laufwerke und löscht alle Daten darauf, nicht nur die Rechte. Die Daten des Mitarbeiters wären verloren. Administratoren dürfen jederzeit den Besitz übernehmen.' },
        { id: 'd', text: 'Den Server neu starten', whyWrong: 'NTFS-Rechte sind auf dem Datenträger gespeichert und bleiben nach einem Neustart unverändert. Der Weg ist, den Besitz zu übernehmen.' },
      ],
      correct: 'a',
      explanation: 'Administratoren haben das Recht „Besitz übernehmen“. Der neue Besitzer kann dann die Berechtigungen ändern.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Benutzer sollen in der Freigabe `\\\\fs01\\Abteilungen` nur die Ordner sehen, auf die sie Zugriff haben. Was aktivierst du?',
      options: [
        { id: 'a', text: 'Zugriffsbasierte Aufzählung (Access-Based Enumeration)' },
        { id: 'b', text: 'Ein Verweigern für alle anderen Ordner', whyWrong: 'Ein Verweigern verhindert den Zugriff, die Ordner bleiben aber sichtbar. Benutzer sehen weiterhin alle Namen und bekommen beim Öffnen „Zugriff verweigert“. Ausblenden kann nur die zugriffsbasierte Aufzählung.' },
        { id: 'c', text: 'Die Ordner als versteckt markieren', whyWrong: 'Das Attribut „versteckt“ blendet Ordner für alle aus, auch für Berechtigte. Wer „Ausgeblendete Elemente“ einschaltet, sieht sie trotzdem. Zugriffsbasierte Aufzählung blendet abhängig von den Rechten aus.' },
        { id: 'd', text: 'Eine eigene Freigabe pro Benutzer', whyWrong: 'Das ginge, ergibt aber Hunderte Freigaben, die man einzeln pflegen müsste. Zugriffsbasierte Aufzählung erledigt das mit einer einzigen Einstellung an der Freigabe.' },
      ],
      correct: 'a',
      explanation: 'ABE zeigt nur Ordner, auf die der Benutzer mindestens Lesezugriff hat. Man aktiviert sie in den Freigabeeinstellungen (Server-Manager).',
    },
    {
      id: 'q16', type: 'multi', difficulty: 2,
      prompt: 'Ein GPO greift bei einem Benutzer nicht. Was prüfst du?',
      options: [
        { id: 'a', text: 'Liegt das Benutzerkonto in der OU, an der das GPO verknüpft ist (oder darunter)?' },
        { id: 'b', text: 'Ist die Einstellung in der Benutzer- und nicht in der Computerkonfiguration?' },
        { id: 'c', text: 'Was zeigt `gpresult /r` unter „angewendet“ bzw. „gefiltert“?' },
        { id: 'd', text: 'Wie viel freier Speicher auf dem Client ist?', whyWrong: 'Freier Speicher hat mit der Anwendung von GPOs nichts zu tun, sie sind nur wenige Kilobyte groß. Prüfen muss man Ort des Objekts, Konfigurationsteil, Filterung und das Ergebnis in `gpresult`.' },
        { id: 'e', text: 'Ob der Benutzer lokaler Administrator ist', whyWrong: 'GPOs gelten für normale Benutzer genauso wie für Admins. Lokale Adminrechte sind dafür nicht nötig. Entscheidend sind OU, Filterung und Vererbung.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Typische Ursachen: falscher Ort des Objekts, falscher Konfigurationsteil, Filterung oder blockierte Vererbung. `gpresult` zeigt, was wirklich gilt.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Welche Bildschirmsperre gilt für den Benutzer?',
        scenario: 'Benutzer Tom liegt in `OU=Lager,OU=Hamburg,DC=firma,DC=de`.\n- Domäne: GPO „Sperre 15 min“\n- OU Hamburg: GPO „Sperre 10 min“\n- OU Lager: GPO „Sperre 30 min“\n\nKeine Verknüpfung ist erzwungen, nirgends ist die Vererbung deaktiviert.',
        options: [
          { id: 'a', text: '30 Minuten' },
          { id: 'b', text: '15 Minuten', whyWrong: 'Das Domänen-GPO wird zuerst angewendet und dann von beiden OU-GPOs überschrieben. Ohne „Erzwungen“ hat es hier kein letztes Wort.' },
          { id: 'c', text: '10 Minuten', whyWrong: 'Das GPO an Hamburg kommt nach der Domäne, aber vor der untergeordneten OU Lager. Das GPO an Lager wird zuletzt angewendet und gewinnt.' },
          { id: 'd', text: 'Der kleinste Wert, also 10 Minuten', whyWrong: 'Gruppenrichtlinien wählen nicht den strengsten Wert. Es gilt das zuletzt angewendete GPO. Bei LSDOU ist das die OU, die dem Benutzer am nächsten ist: Lager.' },
        ],
        correct: 'a',
        explanation: 'LSDOU: Domäne (15) → Hamburg (10) → Lager (30). Das letzte gewinnt: 30 Minuten.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        prompt: 'Und jetzt?',
        scenario: 'Gleiche Struktur wie zuvor: Domäne „Sperre 15 min“, OU Hamburg „Sperre 10 min“, OU Lager „Sperre 30 min“. Jetzt ist die Verknüpfung des **Domänen-GPOs erzwungen**, und an der OU **Lager** ist die **Vererbung deaktiviert**.',
        options: [
          { id: 'a', text: '15 Minuten' },
          { id: 'b', text: '30 Minuten', whyWrong: 'Ein erzwungenes GPO kann von tieferen GPOs nicht überschrieben werden. Es wird sozusagen zuletzt angewendet. Das GPO an Lager gilt zwar, verliert aber den Konflikt.' },
          { id: 'c', text: '10 Minuten', whyWrong: 'Das Hamburg-GPO wird durch „Vererbung deaktivieren“ an Lager blockiert, es kommt bei Tom gar nicht an. Das erzwungene Domänen-GPO kommt trotz Blockade an und gewinnt.' },
          { id: 'd', text: 'Keine, weil die Vererbung deaktiviert ist', whyWrong: '„Vererbung deaktivieren“ blockiert nur nicht erzwungene GPOs von oben. Das GPO an Lager selbst gilt weiter, und das erzwungene Domänen-GPO kommt trotzdem an.' },
        ],
        correct: 'a',
        explanation: 'Erzwungen schlägt „Vererbung deaktivieren“ und gewinnt gegen tiefer verknüpfte GPOs. Hamburg ist blockiert, Lager unterliegt. Ergebnis: 15 Minuten.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        prompt: 'Was darf Lisa über das Netzwerk mit Dateien im Ordner `Angebote`?',
        scenario: 'Freigabe `\\\\fs01\\Vertrieb`: Authentifizierte Benutzer – **Ändern**\n\nNTFS-Rechte am Ordner `Vertrieb\\Angebote`:\n- `DL_Angebote_Lesen` – Lesen, Ausführen\n- `DL_Angebote_Aendern` – Ändern\n\nLisa ist Mitglied von `GG_Vertrieb`. `GG_Vertrieb` ist Mitglied von `DL_Angebote_Lesen`. Lisa ist außerdem direkt Mitglied von `GG_Messe`, und `GG_Messe` ist Mitglied von `DL_Angebote_Aendern`.',
        options: [
          { id: 'a', text: 'Lesen, ändern und löschen (Ändern)' },
          { id: 'b', text: 'Nur lesen', whyWrong: 'Über `GG_Messe` ist Lisa indirekt auch in `DL_Angebote_Aendern`. NTFS-Rechte aus mehreren Gruppen addieren sich zu Ändern. Die Freigabe erlaubt ebenfalls Ändern, also bleibt Ändern.' },
          { id: 'c', text: 'Vollzugriff', whyWrong: 'Weder Freigabe noch NTFS erlauben Vollzugriff. Das höchste Recht ist auf beiden Ebenen Ändern. Rechte ändern oder Besitz übernehmen darf Lisa darum nicht.' },
          { id: 'd', text: 'Gar nichts, weil sie nicht direkt in den DL-Gruppen ist', whyWrong: 'Verschachtelte Mitgliedschaften zählen. Genau darauf baut AGDLP auf: Benutzer → globale Gruppe → domänenlokale Gruppe → Recht.' },
        ],
        correct: 'a',
        explanation: 'NTFS: Lesen + Ändern = Ändern (über verschachtelte Gruppen). Freigabe: Ändern. Strengeres von beiden: Ändern.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Ein Admin verschiebt den Ordner `D:\\Projekte\\Geheim` (eigene, strenge Rechte) per Explorer nach `E:\\Archiv` (Rechte: Jeder – Lesen). Was ist das Risiko?',
        options: [
          { id: 'a', text: 'Der Ordner erbt auf E: die Rechte von `E:\\Archiv`, jeder kann ihn jetzt lesen.' },
          { id: 'b', text: 'Kein Risiko, beim Verschieben bleiben Rechte immer erhalten.', whyWrong: 'Rechte bleiben nur beim Verschieben auf demselben NTFS-Laufwerk erhalten. Von D: nach E: kopiert Windows intern und löscht danach das Original. Die neue Kopie erbt vom Zielordner, hier „Jeder – Lesen“.' },
          { id: 'c', text: 'Der Ordner ist danach für niemanden mehr lesbar.', whyWrong: 'Neue Dateien sind nie rechtelos, sie erben vom Zielordner. Das Problem ist das Gegenteil: Jeder darf lesen.' },
          { id: 'd', text: 'Der Explorer verweigert das Verschieben zwischen Laufwerken.', whyWrong: 'Der Explorer verschiebt problemlos zwischen Laufwerken, ohne Warnung zu den Rechten. Gerade deshalb ist das ein typischer Fehler, durch den vertrauliche Daten offenliegen.' },
        ],
        correct: 'a',
        explanation: 'Verschieben auf ein anderes Laufwerk = Kopieren + Löschen. Die Daten erben die Rechte des Ziels. Danach Rechte prüfen oder mit `robocopy /COPYALL` kopieren.',
      },
      {
        id: 'b5', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen zu Gruppenrichtlinien stimmen?',
        options: [
          { id: 'a', text: 'An einer OU mit mehreren GPOs hat Verknüpfungsreihenfolge 1 die höchste Priorität.' },
          { id: 'b', text: 'Ein erzwungenes GPO kann durch „Vererbung deaktivieren“ nicht blockiert werden.' },
          { id: 'c', text: 'ADMX-Vorlagen legt man für alle Admins in den Zentralspeicher im SYSVOL.' },
          { id: 'd', text: 'Lokale Richtlinien haben Vorrang vor Domänen-GPOs.', whyWrong: 'Die lokale Richtlinie wird zuerst angewendet (das L in LSDOU) und von Standort-, Domänen- und OU-GPOs überschrieben. Sie hat also den geringsten Vorrang.' },
          { id: 'e', text: 'Ein GPO wirkt nur auf Objekte, die direkt in der verknüpften OU liegen, nicht in Unter-OUs.', whyWrong: 'GPOs vererben sich standardmäßig auf alle Unter-OUs. Nur „Vererbung deaktivieren“ an einer Unter-OU stoppt das, und erzwungene GPOs kommen auch dann durch.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Link-Reihenfolge 1 gewinnt, Erzwungen schlägt Blockade, ADMX gehören in den Zentralspeicher. Lokale Richtlinien haben den geringsten Vorrang, GPOs vererben sich nach unten.',
      },
    ],
  },
};

export default level;
