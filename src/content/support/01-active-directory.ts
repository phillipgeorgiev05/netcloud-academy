import type { Level } from '../../types/content';

// Baut auf C1 (fisi-01: Aufbau, DNS, AGDLP, FSMO) und C2 (fisi-02: GPO, LSDOU) auf und vertieft sie für den Support-Alltag.
const level: Level = {
  id: 'sup-01',
  track: 'support',
  order: 1,
  title: 'Active Directory für den Support',
  titleEn: 'Active Directory Troubleshooting',
  summary: 'AD aus Sicht des 2nd Level: Gruppenbereiche und AGDLP im Detail, Replikation, FSMO, DNS-Abhängigkeit, Kerberos und NTLM, Kontosperren und die wichtigsten Werkzeuge dcdiag, repadmin, nltest, klist und gpresult.',
  certs: ['jobready'],
  domains: { jobready: 'infra' },
  lab: {
    title: 'AD-Diagnose in der Test-Domäne',
    needs: 'Die Test-Domäne `lab.local` aus dem Lab von C1 (ein DC als VM, optional ein zweiter DC und ein Client)',
    steps: [
      'Führe auf dem DC `dcdiag /v > C:\\dcdiag.txt` aus und suche in der Datei nach „failed“. Notiere, welche Tests bestanden wurden.',
      'Prüfe die FSMO-Rollen mit `netdom query fsmo` und die Replikation mit `repadmin /replsummary` (mit einem DC gibt es keine Partner, das ist normal).',
      'Prüfe am Client mit `nltest /dsgetdc:lab.local`, welchen DC er findet, und mit `nslookup -type=SRV _ldap._tcp.dc._msdcs.lab.local`, ob die SRV-Einträge da sind.',
      'Lege die Gruppen `GG_Test` (global) und `DL_Test_R` (domänenlokal) an, nimm einen Testbenutzer in `GG_Test` auf und `GG_Test` in `DL_Test_R`. Prüfe am Client mit `whoami /groups`, dass die Gruppe erst nach Ab- und Anmelden erscheint.',
      'Sperre den Testbenutzer durch mehrere falsche Passwörter und suche auf dem DC im Sicherheitsprotokoll das Ereignis 4740. Entsperre ihn mit `Unlock-ADAccount`.',
    ],
  },
  lesson: [
    {
      heading: 'Einsteiger: Was der Support über AD wissen muss',
      body: `Den Aufbau (Gesamtstruktur, Domäne, **Organisationseinheit**, **Domänencontroller**) kennst du aus C1. Im Support zählt vor allem, **wo** etwas schiefgehen kann:

- **Konto**: gesperrt, deaktiviert, abgelaufen, Passwort abgelaufen, falsche OU
- **Gruppen**: Mitgliedschaft fehlt, falsch verschachtelt, erst nach Neuanmeldung wirksam
- **DNS**: Client nutzt den falschen DNS-Server, SRV-Einträge fehlen
- **Replikation**: Änderung ist auf DC1 da, auf DC2 noch nicht
- **Zeit**: Uhr weicht mehr als 5 Minuten ab, Kerberos scheitert
- **Gruppenrichtlinie**: GPO gilt nicht, weil gefiltert oder falsch verknüpft

Fast jedes AD-Ticket lässt sich in eine dieser Schubladen sortieren. Die erste Frage lautet deshalb immer: **Betrifft es einen Benutzer, viele Benutzer oder einen Standort?** Ein Benutzer deutet auf Konto oder Gruppe, viele auf DNS, DC oder Replikation.

Wichtige Objektattribute für den Support:
| Attribut | Bedeutung |
|---|---|
| \`sAMAccountName\` | Anmeldename alt (DOMÄNE\\name), max. 20 Zeichen |
| \`userPrincipalName\` | Anmeldename im E-Mail-Format (name@firma.de) |
| \`distinguishedName\` | voller Pfad im Verzeichnis (CN=…,OU=…,DC=…) |
| \`objectSid\` | eindeutige Sicherheits-ID, ändert sich beim Umbenennen nicht |
| \`memberOf\` | direkte Gruppenmitgliedschaften |
| \`lastLogonTimestamp\` | letzte Anmeldung, repliziert, aber bis zu ca. 14 Tage ungenau |`,
      analogy: 'AD ist das Einwohnermeldeamt der Firma. Ein Ticket ist fast immer eins von: falscher Ausweis (Konto), falscher Vereinsausweis (Gruppe), Amt nicht erreichbar (DNS/DC) oder zwei Ämter mit unterschiedlichem Stand (Replikation).',
      terms: [
        { de: 'Anmeldename (alt)', en: 'sAMAccountName' },
        { de: 'Benutzerprinzipalname', en: 'user principal name (UPN)' },
        { de: 'Kontosperre', en: 'account lockout' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: '40 Benutzer eines Standorts können sich seit heute früh nicht anmelden, alle anderen schon. Wo suchst du zuerst?',
        options: [
          { id: 'a', text: 'Bei Infrastruktur des Standorts: DC, DNS, Netzwerk, Replikation' },
          { id: 'b', text: 'Bei den 40 Benutzerkonten einzeln', whyWrong: '40 gleichzeitig betroffene Konten sind unwahrscheinlich. Wenn ein ganzer Standort betroffen ist, liegt die Ursache meist an gemeinsamer Infrastruktur wie DC, DNS oder Leitung.' },
          { id: 'c', text: 'An den Passwörtern der Benutzer', whyWrong: 'Dass 40 Personen am selben Standort gleichzeitig ihr Passwort falsch eingeben, ist praktisch ausgeschlossen. Das Muster „ein Standort“ zeigt auf Infrastruktur.' },
        ],
        correct: 'a',
        explanation: 'Viele Betroffene an einem Ort = gemeinsame Ursache. Ein einzelner Betroffener = meist Konto oder Gruppe.',
      },
    },
    {
      heading: 'Fortgeschritten: Gruppenbereiche und AGDLP im Detail',
      body: `**AGDLP** heißt: **A**ccounts in **G**lobale Gruppen, diese in **D**omänen**l**okale Gruppen, und nur die domänenlokalen bekommen **P**ermissions (Rechte). Bei mehreren Domänen kommt eine universelle Gruppe dazwischen (**AGUDLP**).

| Bereich | Mitglieder dürfen sein | einsetzbar für Rechte |
|---|---|---|
| **Global** | Konten und globale Gruppen **derselben** Domäne | in jeder Domäne der Gesamtstruktur und vertrauenden Domänen |
| **Domänenlokal** | Konten, globale und universelle Gruppen aus **jeder** vertrauten Domäne, domänenlokale Gruppen derselben Domäne | nur in **der eigenen** Domäne |
| **Universell** | Konten, globale und universelle Gruppen aus **jeder** Domäne der Gesamtstruktur | überall in der Gesamtstruktur, steht im globalen Katalog |

**Warum der Aufwand?** Die globale Gruppe beschreibt **wer** (Rolle/Abteilung: \`GG_Vertrieb\`), die domänenlokale **was** (Ressource + Recht: \`DL_Angebote_RW\`). Kommt ein neuer Mitarbeiter, landet er nur in \`GG_Vertrieb\` und hat sofort alle passenden Rechte. Genau dieses Prinzip nutzen auch IAM-Systeme: Rolle → Gruppen → Rechte.

**Wichtig im Support: Das Zugriffstoken.** Bei der Anmeldung baut Windows ein **Zugriffstoken** mit allen SIDs der (auch verschachtelten) Gruppen. Neue Gruppenmitgliedschaften wirken deshalb erst nach **Ab- und Anmelden** (bzw. neuem Kerberos-Ticket). Mit \`whoami /groups\` siehst du, was im aktuellen Token steht.

**Token Bloat:** Wer in sehr vielen Gruppen steckt, bekommt ein großes Kerberos-Ticket. Ab einer bestimmten Größe scheitern Anmeldungen an Webdiensten (HTTP 400, „Header zu groß“). Das ist ein Grund, Gruppen sauber aufzuräumen.`,
      terms: [
        { de: 'globale Gruppe', en: 'global group' },
        { de: 'domänenlokale Gruppe', en: 'domain local group' },
        { de: 'universelle Gruppe', en: 'universal group' },
        { de: 'Zugriffstoken', en: 'access token' },
        { de: 'globaler Katalog', en: 'global catalog (GC)' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Anna wurde vor 10 Minuten in `GG_Vertrieb` aufgenommen, kommt aber noch nicht auf die Vertriebsfreigabe. Was ist die wahrscheinlichste Ursache?',
        options: [
          { id: 'a', text: 'Ihr Zugriffstoken stammt von der Anmeldung heute früh und kennt die neue Gruppe noch nicht.' },
          { id: 'b', text: 'Globale Gruppen dürfen keine Benutzer enthalten.', whyWrong: 'Doch: Globale Gruppen enthalten genau die Benutzerkonten derselben Domäne. Das ist der „A in G“-Schritt von AGDLP.' },
          { id: 'c', text: 'Die Freigabe muss neu erstellt werden.', whyWrong: 'Die Freigabe und ihre Rechte sind unverändert richtig. Es fehlt nur die neue Gruppen-SID in Annas Token. Neu erstellen würde nichts ändern.' },
        ],
        correct: 'a',
        explanation: 'Gruppen-SIDs kommen bei der Anmeldung ins Token. Lösung: ab- und anmelden (oder `klist purge` und Laufwerk neu verbinden).',
      },
      sources: [{ title: 'Microsoft Learn – Active Directory security groups', url: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups' }],
    },
    {
      heading: 'Fortgeschritten: Kerberos, NTLM und die Uhrzeit',
      body: `In der Domäne meldet man sich standardmäßig per **Kerberos** an (Port 88):
1. Anmeldung: Der Client bekommt vom DC (KDC) ein **Ticket Granting Ticket** (TGT).
2. Zugriff auf einen Dienst (z. B. \`\\\\fs01\\daten\`): Mit dem TGT holt der Client ein **Service-Ticket** für genau diesen Dienst.
3. Der Dienst prüft das Ticket, ohne den DC zu fragen.

Kerberos braucht drei Dinge:
- **Zeit:** Client und DC dürfen standardmäßig höchstens **5 Minuten** auseinanderliegen. Der **PDC-Emulator** ist die Zeitquelle der Domäne.
- **Namen:** Der Dienst wird über seinen **Service Principal Name** (SPN) gefunden, z. B. \`cifs/fs01.firma.local\`. Fehlt der SPN oder ist er doppelt, scheitert Kerberos.
- **DNS:** Ohne passende Namensauflösung findet der Client weder KDC noch Dienst.

**NTLM** ist das ältere Challenge-Response-Verfahren. Windows fällt darauf zurück, wenn Kerberos nicht geht, z. B. beim Zugriff **über die IP-Adresse** (\`\\\\10.0.0.20\\daten\`) statt über den Namen, oder bei Geräten außerhalb der Domäne. NTLM ist schwächer und sollte nach und nach abgeschaltet werden. Wenn ein Zugriff „nur per IP“ klappt oder nur per Name scheitert, ist das ein Hinweis auf SPN- oder DNS-Probleme.

Werkzeuge:
\`\`\`
klist              Kerberos-Tickets des aktuellen Benutzers anzeigen
klist purge        Tickets löschen, neue werden beim nächsten Zugriff geholt
w32tm /query /status   Zeitquelle und Abweichung prüfen
setspn -Q cifs/fs01*   SPN suchen (auch doppelte finden)
\`\`\``,
      analogy: 'Das TGT ist das Tagesticket für den Freizeitpark, das Service-Ticket die Fahrkarte für ein Fahrgeschäft. Mit dem Tagesticket holst du dir am Automaten Fahrkarten, ohne jedes Mal an die Hauptkasse zu müssen.',
      compare: {
        left: 'Kerberos', right: 'NTLM',
        rows: [
          ['Tickets vom KDC (DC), Port 88', 'Challenge-Response über den Dienst zum DC'],
          ['braucht Namen/SPN, DNS und Zeit ±5 min', 'funktioniert auch per IP-Adresse'],
          ['gegenseitige Authentifizierung', 'nur der Client weist sich aus'],
          ['Standard in der Domäne', 'Rückfallverfahren, sollte reduziert werden'],
        ],
      },
      terms: [
        { de: 'Ticket-gewährendes Ticket', en: 'ticket granting ticket (TGT)' },
        { de: 'Dienstprinzipalname', en: 'service principal name (SPN)' },
        { de: 'Schlüsselverteilungscenter', en: 'key distribution center (KDC)' },
        { de: 'Zeitabweichung', en: 'clock skew' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Ein Laptop meldet bei der Anmeldung Kerberos-Fehler. `w32tm /query /status` zeigt eine Abweichung von 12 Minuten zum DC. Was ist die Ursache?',
        options: [
          { id: 'a', text: 'Die Zeitabweichung ist größer als die erlaubten 5 Minuten, Kerberos-Tickets werden abgelehnt.' },
          { id: 'b', text: 'NTLM ist auf dem Laptop deaktiviert.', whyWrong: 'Das Problem liegt bei Kerberos selbst: Tickets sind zeitgestempelt und dürfen standardmäßig höchstens 5 Minuten abweichen. 12 Minuten sind zu viel, egal ob NTLM aktiv ist.' },
          { id: 'c', text: 'Der SPN des Laptops ist doppelt.', whyWrong: 'Ein doppelter SPN stört den Zugriff auf einen bestimmten Dienst. Hier zeigt die Ausgabe aber eindeutig eine Zeitabweichung von 12 Minuten, die allein schon Kerberos scheitern lässt.' },
        ],
        correct: 'a',
        explanation: 'Kerberos toleriert standardmäßig 5 Minuten. Zeitsynchronisation reparieren (`w32tm /resync`), Quelle = Domänenhierarchie mit PDC-Emulator an der Spitze.',
      },
      sources: [{ title: 'Microsoft Learn – Kerberos Authentication Overview', url: 'https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview' }],
    },
    {
      heading: 'Fortgeschritten: Replikation, FSMO und DNS',
      body: `Jeder DC hat eine beschreibbare Kopie der Datenbank. Änderungen werden per **Replikation** verteilt: innerhalb eines Standorts nach wenigen Sekunden (Änderungsbenachrichtigung), zwischen Standorten nach Zeitplan (Standard alle **180 Minuten**). Die Wege berechnet der **KCC** (Knowledge Consistency Checker) automatisch.

Typisches Support-Muster: **„Auf DC1 ist der Benutzer da, auf DC2 nicht.“** Dann ist die Änderung noch nicht repliziert, oder die Replikation ist gestört.

**FSMO-Rollen** (aus C1): Schemamaster und Domänennamenmaster (je Gesamtstruktur), RID-Master, PDC-Emulator und Infrastrukturmaster (je Domäne). Für den Support besonders wichtig ist der **PDC-Emulator**: Zeitquelle, bekommt Passwortänderungen bevorzugt, verarbeitet Kontosperren. Ist der **RID-Master** lange weg, können DCs irgendwann keine neuen Objekte mehr anlegen, weil ihr RID-Pool leer wird.

**DNS:** Clients finden DCs über **SRV-Einträge** wie \`_ldap._tcp.dc._msdcs.firma.local\`. Darum müssen Domänen-Clients **ausschließlich interne AD-DNS-Server** eingetragen haben. Ein öffentlicher DNS wie 8.8.8.8 als Zweiteintrag führt zu sporadischen, schwer erklärbaren Fehlern.

**Tombstone:** Gelöschte Objekte bleiben eine Zeit lang als Grabstein erhalten (Standard bei neueren Gesamtstrukturen 180 Tage), damit die Löschung repliziert wird. Ein DC, der länger offline war, darf nicht einfach wieder ans Netz. Mit aktiviertem **AD-Papierkorb** (AD Recycle Bin) kann man gelöschte Objekte samt Gruppenmitgliedschaften wiederherstellen.`,
      terms: [
        { de: 'Wissenskonsistenzprüfung', en: 'Knowledge Consistency Checker (KCC)' },
        { de: 'Standort', en: 'site' },
        { de: 'Grabstein', en: 'tombstone' },
        { de: 'AD-Papierkorb', en: 'AD Recycle Bin' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Ein Client hat als DNS-Server `10.0.0.10` (DC) und `8.8.8.8` eingetragen. Was ist daran problematisch?',
        options: [
          { id: 'a', text: 'Fragt der Client 8.8.8.8, findet er keine internen SRV-Einträge und damit sporadisch keinen DC.' },
          { id: 'b', text: 'Nichts, ein zweiter DNS-Server erhöht nur die Ausfallsicherheit.', whyWrong: 'Ausfallsicherheit ja, aber nur mit einem zweiten **internen** DNS-Server. Der öffentliche DNS kennt die Zone firma.local nicht und liefert für DC-Suchen keine Antwort.' },
          { id: 'c', text: '8.8.8.8 blockiert Kerberos.', whyWrong: 'Ein DNS-Server blockiert keine Protokolle. Er kann nur keine internen Namen auflösen, und genau deshalb findet der Client manchmal seinen DC nicht.' },
        ],
        correct: 'a',
        explanation: 'Domänen-Clients nur auf AD-DNS zeigen lassen. Die DCs leiten externe Anfragen per Weiterleitung ins Internet.',
      },
      sources: [{ title: 'Microsoft Learn – FSMO roles in Active Directory', url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles' }],
    },
    {
      heading: 'Profi: Diagnosewerkzeuge und Kontosperren',
      body: `Die Werkzeuge, die in jedem AD-Ticket auftauchen:

| Befehl | wofür |
|---|---|
| \`dcdiag /v\` | Gesundheitscheck eines DC (Dienste, DNS, Replikation, FSMO, SYSVOL) |
| \`dcdiag /test:dns\` | nur DNS-Tests |
| \`repadmin /replsummary\` | Übersicht: Welche DCs replizieren mit Fehlern? |
| \`repadmin /showrepl\` | Details pro Partner, letzter Erfolg, Fehlercode |
| \`repadmin /syncall /AdeP\` | Replikation aller Partitionen sofort anstoßen |
| \`netdom query fsmo\` | Wer hält welche FSMO-Rolle? |
| \`nltest /dsgetdc:firma.local\` | Welchen DC findet dieser Client? |
| \`nltest /sc_verify:firma.local\` | sicheren Kanal des Computers prüfen |
| \`gpresult /r\` bzw. \`/h bericht.html\` | angewendete und gefilterte GPOs |
| \`whoami /groups\` | Gruppen im aktuellen Token |

**Kontosperre suchen:** Ein Konto wird immer wieder gesperrt. Ursache sind fast immer alte Anmeldedaten irgendwo: gespeichertes Passwort in einem Netzlaufwerk, einem Dienst, einer geplanten Aufgabe, am Handy (ActiveSync) oder in einer getrennten RDP-Sitzung.
1. Auf dem **PDC-Emulator** im Sicherheitsprotokoll nach Ereignis **4740** suchen.
2. Das Feld **„Aufrufender Computername“** (Caller Computer Name) nennt das Gerät, von dem die Fehlversuche kamen.
3. Dort gespeicherte Anmeldedaten finden und aktualisieren.

Weitere Ereignis-IDs: **4625** fehlgeschlagene Anmeldung, **4771** Kerberos-Vorauthentifizierung fehlgeschlagen (auf DCs), **4624** erfolgreiche Anmeldung.

**Vertrauensstellung defekt:** „Die Vertrauensstellung zwischen dieser Arbeitsstation und der primären Domäne konnte nicht hergestellt werden.“ Das Computerkonto-Passwort passt nicht mehr (z. B. nach Snapshot-Rücksprung). Reparatur ohne Neuaufnahme: \`Test-ComputerSecureChannel -Repair -Credential FIRMA\\admin\`.`,
      terms: [
        { de: 'sicherer Kanal', en: 'secure channel' },
        { de: 'aufrufender Computername', en: 'caller computer name' },
      ],
      check: {
        id: 'c5', type: 'ordering', difficulty: 3,
        prompt: 'Ein Konto wird alle 30 Minuten gesperrt. Bring das Vorgehen in die richtige Reihenfolge.',
        items: [
          { id: 'a', text: 'Auf dem PDC-Emulator Ereignis 4740 suchen' },
          { id: 'b', text: 'Aufrufenden Computernamen aus dem Ereignis ablesen' },
          { id: 'c', text: 'Auf diesem Gerät gespeicherte Anmeldedaten finden (Dienst, Aufgabe, Laufwerk, Handy)' },
          { id: 'd', text: 'Anmeldedaten aktualisieren, Konto entsperren, beobachten' },
        ],
        explanation: 'Erst die Quelle finden, dann beheben. Nur entsperren hilft nicht, die Sperre kommt sonst wieder.',
      },
      sources: [
        { title: 'Microsoft Learn – dcdiag', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/dcdiag' },
        { title: 'Microsoft Learn – repadmin', url: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc770963(v=ws.11)' },
        { title: 'Microsoft Learn – Event 4740', url: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4740' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welches Attribut ist der Anmeldename im E-Mail-Format, z. B. `anna.berg@firma.de`?',
      options: [
        { id: 'a', text: '`userPrincipalName` (UPN)' },
        { id: 'b', text: '`sAMAccountName`', whyWrong: 'Der sAMAccountName ist der alte Anmeldename im Format `FIRMA\\aberg`, ohne @-Teil und höchstens 20 Zeichen lang.' },
        { id: 'c', text: '`distinguishedName`', whyWrong: 'Der Distinguished Name ist der volle Pfad im Verzeichnis (CN=…,OU=…,DC=…). Damit meldet man sich nicht an.' },
        { id: 'd', text: '`objectSid`', whyWrong: 'Die SID ist eine eindeutige Nummer für Berechtigungen, kein Anmeldename.' },
      ],
      correct: 'a',
      explanation: 'UPN = name@suffix. Er sollte für Microsoft 365 meist mit der E-Mail-Adresse übereinstimmen.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 2,
      prompt: 'Ordne nach AGDLP zu: Was ist was?',
      items: [
        { id: 'i1', text: 'anna.berg' },
        { id: 'i2', text: 'GG_Vertrieb' },
        { id: 'i3', text: 'DL_Angebote_RW' },
        { id: 'i4', text: 'NTFS „Ändern“ auf D:\\Angebote' },
      ],
      buckets: [
        { id: 'a', label: 'A – Account' },
        { id: 'g', label: 'G – globale Gruppe' },
        { id: 'dl', label: 'DL – domänenlokale Gruppe' },
        { id: 'p', label: 'P – Permission' },
      ],
      solution: { i1: 'a', i2: 'g', i3: 'dl', i4: 'p' },
      explanation: 'Konto → globale Rollengruppe → domänenlokale Ressourcengruppe → Recht auf die Ressource.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: 'Welche Gruppe darf Mitglieder aus **anderen** Domänen der Gesamtstruktur enthalten und ist **nur in der eigenen Domäne** für Rechte nutzbar?',
      options: [
        { id: 'a', text: 'Domänenlokale Gruppe' },
        { id: 'b', text: 'Globale Gruppe', whyWrong: 'Bei globalen Gruppen ist es umgekehrt: Mitglieder nur aus derselben Domäne, nutzbar aber überall in der Gesamtstruktur.' },
        { id: 'c', text: 'Universelle Gruppe', whyWrong: 'Universelle Gruppen dürfen zwar Mitglieder aus allen Domänen haben, sind aber auch überall nutzbar, nicht nur in der eigenen Domäne.' },
        { id: 'd', text: 'Verteilergruppe', whyWrong: 'Verteilergruppen sind für E-Mail gedacht und haben keine Sicherheits-SID. Sie lassen sich gar nicht für Rechte nutzen.' },
      ],
      correct: 'a',
      explanation: 'Domänenlokal: Mitglieder von überall (vertraut), Rechte nur lokal. Darum gehört sie an die Ressource.',
    },
    {
      id: 'q4', type: 'cli', shell: 'windows', difficulty: 1,
      prompt: 'Zeige, welche Gruppen im aktuellen Zugriffstoken des angemeldeten Benutzers stehen.',
      template: 'C:\\> whoami {{0}}',
      blanks: [{ accept: ['/groups'] }],
      explanation: '`whoami /groups` zeigt die Gruppen-SIDs des Tokens. Fehlt eine neue Gruppe, hilft ab- und anmelden.',
    },
    {
      id: 'q5', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Zeige eine Übersicht, welche DCs mit Fehlern replizieren.',
      template: 'C:\\> repadmin {{0}}',
      blanks: [{ accept: ['/replsummary', '/replsum'] }],
      explanation: '`repadmin /replsummary` fasst pro DC zusammen: größte Verzögerung, Fehler, Anzahl Partner.',
    },
    {
      id: 'q6', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Lösche alle Kerberos-Tickets des aktuellen Benutzers, damit beim nächsten Zugriff neue geholt werden.',
      template: 'C:\\> klist {{0}}',
      blanks: [{ accept: ['purge'] }],
      explanation: '`klist purge` löscht die zwischengespeicherten Tickets. Neue Service-Tickets enthalten dann aktuelle Gruppen, wenn auch das TGT erneuert wurde. Sicherer ist ab- und anmelden.',
    },
    {
      id: 'q7', type: 'cli', shell: 'windows', difficulty: 2,
      prompt: 'Finde heraus, welche Server die FSMO-Rollen halten.',
      template: 'C:\\> netdom query {{0}}',
      blanks: [{ accept: ['fsmo'] }],
      explanation: '`netdom query fsmo` listet alle fünf Rollen. In PowerShell: `Get-ADDomain` und `Get-ADForest`.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Welche Ereignis-ID auf dem PDC-Emulator zeigt, dass ein Konto gesperrt wurde, inklusive Quellgerät?',
      options: [
        { id: 'a', text: '4740' },
        { id: 'b', text: '4624', whyWrong: '4624 ist eine erfolgreiche Anmeldung. Eine Sperre steht dort nicht.' },
        { id: 'c', text: '4625', whyWrong: '4625 ist eine fehlgeschlagene Anmeldung. Viele davon führen zur Sperre, die Sperre selbst protokolliert aber 4740.' },
        { id: 'd', text: '1074', whyWrong: '1074 im Systemprotokoll steht für ein Herunterfahren oder einen Neustart, nicht für Kontosperren.' },
      ],
      correct: 'a',
      explanation: '4740 „Ein Benutzerkonto wurde gesperrt“ mit dem Feld „Aufrufender Computername“.',
    },
    {
      id: 'q9', type: 'scenario', difficulty: 2,
      prompt: 'Was ist hier los?',
      scenario: '```\nC:\\> nltest /dsgetdc:firma.local\nGetting DC name failed: Status = 1355 0x54b ERROR_NO_SUCH_DOMAIN\n\nC:\\> ipconfig /all | findstr DNS\n   DNS-Server  . . . . . . . . . : 192.168.178.1\n```',
      options: [
        { id: 'a', text: 'Der Client nutzt den Router als DNS-Server und findet deshalb keine SRV-Einträge der Domäne.' },
        { id: 'b', text: 'Die Domäne firma.local wurde gelöscht.', whyWrong: 'Wahrscheinlicher ist ein lokales Problem: Der eingetragene DNS-Server ist der Router (192.168.178.1), der die interne Zone nicht kennt. Die Domäne existiert vermutlich weiterhin.' },
        { id: 'c', text: 'Das Computerkonto ist deaktiviert.', whyWrong: 'Ein deaktiviertes Computerkonto würde zu Anmelde- oder Vertrauensfehlern führen. Hier findet der Client aber überhaupt keinen DC, weil DNS ins Leere fragt.' },
      ],
      correct: 'a',
      explanation: 'DC-Suche = DNS-SRV-Abfrage. Falscher DNS-Server (z. B. Router nach Homeoffice oder falscher DHCP-Option) → keine Domäne gefunden.',
    },
    {
      id: 'q10', type: 'multi', difficulty: 2,
      prompt: 'Wann fällt Windows typischerweise von Kerberos auf NTLM zurück?',
      options: [
        { id: 'a', text: 'Zugriff auf eine Freigabe über die IP-Adresse statt über den Namen' },
        { id: 'b', text: 'Gerät ist nicht Mitglied der Domäne' },
        { id: 'c', text: 'Benutzer hat ein Passwort mit mehr als 14 Zeichen', whyWrong: 'Die Passwortlänge entscheidet nicht über das Protokoll. Lange Passwörter funktionieren mit Kerberos problemlos.' },
        { id: 'd', text: 'Die Freigabe liegt auf einem Server mit SSD', whyWrong: 'Die Hardware des Servers hat mit dem Authentifizierungsprotokoll nichts zu tun.' },
      ],
      correct: ['a', 'b'],
      explanation: 'Kerberos braucht einen Namen mit SPN und ein Domänenmitglied. Per IP oder ohne Domäne bleibt nur NTLM.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Welche FSMO-Rolle ist die Zeitquelle der Domäne und verarbeitet Kontosperren?',
      options: [
        { id: 'a', text: 'PDC-Emulator' },
        { id: 'b', text: 'RID-Master', whyWrong: 'Der RID-Master verteilt Pools relativer IDs, damit neue Objekte eindeutige SIDs bekommen. Zeit und Sperren macht er nicht.' },
        { id: 'c', text: 'Schemamaster', whyWrong: 'Der Schemamaster erlaubt Änderungen am Schema (Objektklassen, Attribute), z. B. bei der Installation von Exchange.' },
        { id: 'd', text: 'Infrastrukturmaster', whyWrong: 'Der Infrastrukturmaster aktualisiert Verweise auf Objekte aus anderen Domänen. Zeit und Sperren gehören zum PDC-Emulator.' },
      ],
      correct: 'a',
      explanation: 'PDC-Emulator: Zeit, bevorzugte Passwortreplikation, Kontosperren, Standard-DC für GPO-Bearbeitung.',
    },
    {
      id: 'q12', type: 'single', difficulty: 3,
      prompt: 'Auf DC1 (Standort Berlin) wurde ein Benutzer angelegt. Am Standort München meldet der Benutzer 20 Minuten später „Benutzername unbekannt“. Was ist die wahrscheinlichste Erklärung?',
      options: [
        { id: 'a', text: 'Die standortübergreifende Replikation hat noch nicht stattgefunden (Standardintervall 180 Minuten).' },
        { id: 'b', text: 'Das Konto wurde falsch angelegt und muss gelöscht werden.', whyWrong: 'Das Konto existiert auf DC1 korrekt. Es ist nur noch nicht beim DC in München angekommen. Löschen und neu anlegen würde das Problem nicht lösen.' },
        { id: 'c', text: 'Der Benutzer muss erst eine E-Mail bekommen.', whyWrong: 'Eine E-Mail hat mit der Anmeldung am AD nichts zu tun. Entscheidend ist, ob der DC in München das Objekt schon kennt.' },
      ],
      correct: 'a',
      explanation: 'Zwischen Standorten repliziert AD nach Zeitplan. Abhilfe: Konto direkt am DC des Zielstandorts anlegen oder `repadmin /syncall /AdeP` (mit Bedacht).',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Meldung am PC: „Die Vertrauensstellung zwischen dieser Arbeitsstation und der primären Domäne konnte nicht hergestellt werden.“ Was ist der sauberste erste Lösungsweg?',
      options: [
        { id: 'a', text: 'Mit lokalem Admin anmelden und `Test-ComputerSecureChannel -Repair -Credential` ausführen' },
        { id: 'b', text: 'Das Benutzerkonto zurücksetzen', whyWrong: 'Das Problem liegt beim **Computerkonto**, nicht beim Benutzer. Dessen Passwort passt nicht mehr zum Stand im AD.' },
        { id: 'c', text: 'Den DC neu starten', whyWrong: 'Der DC funktioniert, andere PCs melden sich an. Das Computerkonto dieses einen PCs ist außer Tritt, daran ändert ein DC-Neustart nichts.' },
        { id: 'd', text: 'Windows neu installieren', whyWrong: 'Viel zu drastisch. Der sichere Kanal lässt sich in Sekunden reparieren, notfalls reicht ein Domänen-Neubeitritt.' },
      ],
      correct: 'a',
      explanation: 'Der sichere Kanal wird mit dem Computerkontopasswort aufgebaut. `-Repair` setzt es neu, ohne Neuaufnahme.',
    },
    {
      id: 'q14', type: 'single', difficulty: 2,
      prompt: 'Ein Benutzer soll ermittelt werden, der sich seit über 90 Tagen nicht angemeldet hat. Welches Attribut ist dafür geeignet, obwohl es ungenau ist?',
      options: [
        { id: 'a', text: '`lastLogonTimestamp`, weil es repliziert wird (Ungenauigkeit bis ca. 14 Tage ist für 90 Tage egal)' },
        { id: 'b', text: '`lastLogon`, weil es auf allen DCs gleich ist', whyWrong: '`lastLogon` wird gerade **nicht** repliziert. Jeder DC kennt nur die Anmeldungen, die er selbst verarbeitet hat. Man müsste alle DCs abfragen.' },
        { id: 'c', text: '`whenCreated`', whyWrong: '`whenCreated` ist das Erstellungsdatum des Kontos und sagt nichts über die letzte Anmeldung.' },
      ],
      correct: 'a',
      explanation: 'Für „inaktive Konten“-Reports nimmt man `lastLogonTimestamp` (in PowerShell als `LastLogonDate`). Für genaue Zeiten alle DCs nach `lastLogon` fragen.',
      domain: 'iam',
    },
    {
      id: 'q15', type: 'chain', difficulty: 3,
      prompt: 'Ein Benutzer kommt auf `\\\\fs01\\projekte` nicht drauf („Zugriff verweigert“). Kollegen in derselben Abteilung schon.',
      steps: [
        {
          id: 's1', text: 'Was prüfst du zuerst?',
          options: [
            { id: 'a', text: 'Gruppenmitgliedschaft im AD und `whoami /groups` am Client', correct: true, feedback: 'Richtig. Steht die Gruppe im AD, aber nicht im Token, fehlt nur die Neuanmeldung.' },
            { id: 'b', text: 'Die Festplatte des Fileservers', correct: false, feedback: 'Kollegen kommen drauf, der Server läuft. Es geht um die Rechte dieses einen Benutzers.' },
          ],
        },
        {
          id: 's2', text: 'Im AD ist der Benutzer seit heute Mittag in `GG_Projekte`. `whoami /groups` zeigt die Gruppe nicht. Ursache?',
          options: [
            { id: 'a', text: 'Token von der Anmeldung heute früh, die neue Gruppe ist noch nicht drin', correct: true, feedback: 'Genau. Gruppen-SIDs kommen bei der Anmeldung ins Token.' },
            { id: 'b', text: 'Die Gruppe ist kaputt', correct: false, feedback: 'Bei Kollegen wirkt dieselbe Gruppe. Das Problem ist das veraltete Token dieses Benutzers.' },
          ],
        },
        {
          id: 's3', text: 'Lösung?',
          options: [
            { id: 'a', text: 'Ab- und anmelden lassen, Zugriff testen, im Ticket vermerken', correct: true, feedback: 'Richtig, einfach und nachhaltig.' },
            { id: 'b', text: 'Dem Benutzer direkt NTFS-Vollzugriff geben', correct: false, feedback: 'Das umgeht das Gruppenkonzept, gibt zu viele Rechte und wird bei der nächsten Rezertifizierung zum Befund.' },
          ],
        },
      ],
      explanation: 'Neue Gruppe wirkt erst mit neuem Token. Erst prüfen (AD vs. Token), dann neu anmelden.',
      domain: 'troubleshoot',
    },
    {
      id: 'q16', type: 'single', difficulty: 3,
      prompt: 'Ein Benutzer in über 1000 Gruppen bekommt beim Öffnen einer internen Webanwendung „HTTP 400 Bad Request – Request Header Too Long“. Andere nicht. Ursache?',
      options: [
        { id: 'a', text: 'Token Bloat: Das Kerberos-Ticket ist durch die vielen Gruppen zu groß für den HTTP-Header.' },
        { id: 'b', text: 'Der Webserver ist überlastet.', whyWrong: 'Dann wären alle Benutzer betroffen. Der Fehler tritt nur bei dem Benutzer mit extrem vielen Gruppen auf.' },
        { id: 'c', text: 'Das Passwort ist abgelaufen.', whyWrong: 'Mit abgelaufenem Passwort käme der Benutzer gar nicht bis zur Webanwendung, er müsste es bei der Anmeldung ändern.' },
      ],
      correct: 'a',
      explanation: 'Viele (verschachtelte) Gruppen = großes Ticket. Nachhaltige Lösung: Gruppen aufräumen (auch ein IAM-Thema). Kurzfristig: Header-Limit am Webserver erhöhen.',
      domain: 'perm',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Was zeigt die Ausgabe?',
        scenario: '```\nC:\\> repadmin /replsummary\nSource DSA          largest delta    fails/total %   error\n DC01                     01m:12s    0 /  10    0\n DC02                  14d.03h:22m  10 /  10  100  (1722) The RPC server is unavailable.\n```',
        options: [
          { id: 'a', text: 'DC02 repliziert seit 14 Tagen nicht, weil er per RPC nicht erreichbar ist (Netzwerk, Firewall, Dienst).' },
          { id: 'b', text: 'Alles in Ordnung, 14 Tage sind das normale Intervall.', whyWrong: 'Normal sind Sekunden (im Standort) bis wenige Stunden (zwischen Standorten). 14 Tage mit 100 % Fehlern sind ein ernstes Problem.' },
          { id: 'c', text: 'DC01 ist defekt.', whyWrong: 'DC01 hat 0 Fehler und eine Verzögerung von nur einer Minute. Die Fehler betreffen die Replikation von DC02.' },
        ],
        correct: 'a',
        explanation: 'Fehler 1722 = RPC nicht erreichbar. Prüfen: Ping, DNS, Firewall (RPC 135 + dynamische Ports), läuft der DC? Tombstone-Lebensdauer im Blick behalten.',
        domain: 'troubleshoot',
      },
      {
        id: 'b2', type: 'single', difficulty: 3,
        prompt: 'Zwei Domänen in einer Gesamtstruktur. Vertriebler aus beiden Domänen sollen auf eine Freigabe in Domäne A. Welche Gruppenstruktur ist richtig (AGUDLP)?',
        options: [
          { id: 'a', text: 'Je Domäne eine globale Gruppe → beide in eine universelle Gruppe → diese in eine domänenlokale Gruppe in A → Recht auf die Freigabe' },
          { id: 'b', text: 'Alle Benutzer direkt in eine globale Gruppe in A', whyWrong: 'Globale Gruppen dürfen nur Konten aus **derselben** Domäne enthalten. Benutzer aus Domäne B passen nicht hinein.' },
          { id: 'c', text: 'Alle Benutzer direkt auf die Freigabe berechtigen', whyWrong: 'Funktioniert technisch, ist aber unwartbar. Jeder Eintritt und Austritt müsste an der Freigabe nachgepflegt werden, und Rezertifizierungen werden unübersichtlich.' },
        ],
        correct: 'a',
        explanation: 'Accounts → Global (je Domäne) → Universal (domänenübergreifend) → Domain Local (an der Ressource) → Permission.',
        domain: 'perm',
      },
      {
        id: 'b3', type: 'cli', shell: 'windows', difficulty: 3,
        prompt: 'Stoße die Replikation aller Partitionen sofort an, über Standorte hinweg, im Push-Modus und mit Namen statt GUIDs in der Ausgabe.',
        template: 'C:\\> repadmin /syncall {{0}}',
        blanks: [{ accept: ['/AdeP', '/APed', '/Aped', '/adep'] }],
        explanation: '`/A` alle Partitionen, `/d` Namen statt GUIDs, `/e` standortübergreifend (enterprise), `/P` Push vom Ausgangs-DC.',
      },
      {
        id: 'b4', type: 'single', difficulty: 3,
        prompt: 'Zugriff auf `\\\\fs01\\daten` scheitert, `\\\\10.0.0.20\\daten` (IP von fs01) klappt. `setspn -Q cifs/fs01*` findet den SPN auf **zwei** Computerkonten. Was ist die Ursache?',
        options: [
          { id: 'a', text: 'Doppelter SPN: Kerberos kann das Ticket keinem eindeutigen Konto zuordnen, per IP greift NTLM.' },
          { id: 'b', text: 'Die Freigabe ist per Name gesperrt.', whyWrong: 'Freigaben haben keine Sperre „nur per Name“. Der Unterschied Name/IP ist das typische Zeichen für Kerberos (Name) gegen NTLM (IP).' },
          { id: 'c', text: 'Der DNS-Eintrag zeigt auf den falschen Server.', whyWrong: 'Möglich wäre das, aber `setspn` hat schon den doppelten SPN gefunden, und das erklärt das Muster vollständig.' },
        ],
        correct: 'a',
        explanation: 'SPNs müssen eindeutig sein. Doppelten Eintrag am falschen Konto entfernen (`setspn -D`), danach `klist purge` am Client.',
        domain: 'troubleshoot',
      },
      {
        id: 'b5', type: 'single', difficulty: 2,
        prompt: 'Ein Admin hat versehentlich eine OU mit 30 Benutzern gelöscht. Der AD-Papierkorb ist aktiviert. Was ist der beste Weg?',
        options: [
          { id: 'a', text: 'Objekte mit `Get-ADObject -IncludeDeletedObjects` finden und mit `Restore-ADObject` wiederherstellen (erst die OU, dann die Benutzer)' },
          { id: 'b', text: 'Die Benutzer neu anlegen', whyWrong: 'Neu angelegte Konten bekommen neue SIDs. Alle Rechte, Gruppenmitgliedschaften und Postfachzuordnungen wären verloren.' },
          { id: 'c', text: 'Den DC aus einem Backup komplett zurücksetzen', whyWrong: 'Das ist mit aktiviertem Papierkorb unnötig aufwendig und setzt alle anderen Änderungen seit dem Backup zurück.' },
        ],
        correct: 'a',
        explanation: 'Mit AD-Papierkorb bleiben Attribute und Gruppenmitgliedschaften erhalten. Reihenfolge: übergeordnete OU zuerst.',
      },
      {
        id: 'b6', type: 'single', difficulty: 2,
        prompt: 'An English-speaking admin writes: "Users get *The trust relationship between this workstation and the primary domain failed* after we reverted the VM to a snapshot." What do you answer?',
        options: [
          { id: 'a', text: 'The snapshot restored an old computer account password. Repair the secure channel with `Test-ComputerSecureChannel -Repair` or rejoin the domain.' },
          { id: 'b', text: 'Reset the user passwords.', whyWrong: 'The user accounts are fine. The computer account password on the VM no longer matches the one in AD because of the snapshot.' },
          { id: 'c', text: 'Disable Kerberos.', whyWrong: 'Disabling Kerberos is neither possible in a sensible way nor related. The secure channel of the computer account is broken.' },
        ],
        correct: 'a',
        explanation: 'Snapshot = old machine password. Repair the secure channel instead of reinstalling.',
        domain: 'english',
      },
    ],
  },
};

export default level;
