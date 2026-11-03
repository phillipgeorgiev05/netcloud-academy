import type { Level } from '../../types/content';

const level: Level = {
  id: 'basics-06',
  track: 'basics',
  order: 6,
  title: 'IT-Sicherheit Grundwissen',
  titleEn: 'Security Fundamentals',
  summary: 'Die drei Schutzziele (CIA), Authentifizierung und Autorisierung, sichere Passwörter, MFA, Phishing und Social Engineering erkennen, Malware und Ransomware, Updates, das Prinzip der geringsten Rechte, Backups nach der 3-2-1-Regel und Verschlüsselung einfach erklärt.',
  certs: ['netplus', 'ccna', 'az900', 'fisi'],
  domains: { netplus: '4', ccna: '5', az900: 'concepts', fisi: 'ap1' },
  lesson: [
    {
      heading: 'Die drei Schutzziele: CIA',
      body: `IT-Sicherheit schützt drei Dinge, kurz **CIA** (englisch) oder **VIV** (deutsch):

| Schutzziel | Frage | Bedroht durch |
|---|---|---|
| **Vertraulichkeit** (Confidentiality) | Sehen nur Befugte die Daten? | Mitlesen, Datendiebstahl |
| **Integrität** (Integrity) | Sind die Daten unverändert und korrekt? | Manipulation, Übertragungsfehler |
| **Verfügbarkeit** (Availability) | Sind Daten und Dienste da, wenn man sie braucht? | Ausfall, DDoS, Ransomware |

Jede Schutzmaßnahme lässt sich einem Ziel zuordnen:
- Verschlüsselung → Vertraulichkeit
- Prüfsummen, digitale Signaturen → Integrität
- Backups, redundante Server, USV → Verfügbarkeit

Das **BSI** (Bundesamt für Sicherheit in der Informationstechnik) beschreibt im **IT-Grundschutz**, wie Firmen diese Ziele systematisch erreichen.`,
      analogy: 'Ein Tagebuch: Vertraulichkeit = niemand liest heimlich mit (Schloss). Integrität = niemand reißt Seiten heraus oder schreibt etwas hinein. Verfügbarkeit = du findest es, wenn du hineinschreiben willst.',
      terms: [
        { de: 'Vertraulichkeit', en: 'confidentiality' },
        { de: 'Integrität', en: 'integrity' },
        { de: 'Verfügbarkeit', en: 'availability' },
        { de: 'Schutzziele', en: 'CIA triad' },
      ],
      sources: [
        { title: 'BSI – IT-Grundschutz', url: 'https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/IT-Grundschutz/it-grundschutz_node.html' },
      ],
      check: {
        id: 'c1', type: 'dragdrop', difficulty: 2,
        prompt: 'Welches Schutzziel ist verletzt?',
        items: [
          { id: 'leak', text: 'Kundendaten tauchen im Internet auf.' },
          { id: 'mod', text: 'Ein Angreifer ändert die Kontonummer in einer Rechnung.' },
          { id: 'down', text: 'Der Webshop ist nach einem Angriff stundenlang nicht erreichbar.' },
        ],
        buckets: [
          { id: 'c', label: 'Vertraulichkeit' },
          { id: 'i', label: 'Integrität' },
          { id: 'a', label: 'Verfügbarkeit' },
        ],
        solution: { leak: 'c', mod: 'i', down: 'a' },
        explanation: 'Gelesen = Vertraulichkeit, verändert = Integrität, nicht erreichbar = Verfügbarkeit.',
      },
    },
    {
      heading: 'Wer bist du, und was darfst du?',
      body: `Zwei Begriffe, die oft verwechselt werden:
- **Authentifizierung** (authentication): **Wer bist du?** Nachweis der Identität, z. B. Passwort.
- **Autorisierung** (authorization): **Was darfst du?** Rechte prüfen, z. B. Lesezugriff auf einen Ordner.

Erst wird authentifiziert, dann autorisiert. Zusammen mit dem **Protokollieren** (Accounting) spricht man von **AAA**.

**Faktoren** für die Authentifizierung:
| Faktor | Beispiel |
|---|---|
| **Wissen** | Passwort, PIN |
| **Besitz** | Smartphone mit Authenticator-App, Sicherheitsschlüssel (FIDO2), Chipkarte |
| **Sein** (Biometrie) | Fingerabdruck, Gesichtserkennung |

**MFA** (Multi-Faktor-Authentifizierung) kombiniert **mindestens zwei verschiedene** Faktoren. Passwort + PIN ist kein MFA, beides ist Wissen.

MFA verhindert die meisten Kontoübernahmen, selbst wenn das Passwort gestohlen wurde. Am sichersten sind **Passkeys** bzw. FIDO2-Schlüssel, weil sie nicht auf Phishing-Seiten funktionieren.

**Prinzip der geringsten Rechte** (least privilege): Jeder bekommt nur die Rechte, die er für seine Arbeit braucht. Admin-Konten nur für Admin-Aufgaben, nicht zum Surfen und Mailen.`,
      terms: [
        { de: 'Authentifizierung', en: 'authentication (AuthN)' },
        { de: 'Autorisierung', en: 'authorization (AuthZ)' },
        { de: 'Multi-Faktor-Authentifizierung', en: 'multi-factor authentication (MFA)' },
        { de: 'Prinzip der geringsten Rechte', en: 'principle of least privilege' },
        { de: 'Passkey', en: 'passkey (FIDO2/WebAuthn)' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Welche Kombination ist echte MFA?',
        options: [
          { id: 'a', text: 'Passwort + Code aus der Authenticator-App' },
          { id: 'b', text: 'Passwort + Sicherheitsfrage', whyWrong: 'Beides ist Wissen, also nur ein Faktor. Für MFA braucht man zwei verschiedene Arten, z. B. Wissen + Besitz.' },
          { id: 'c', text: 'Zwei verschiedene Passwörter', whyWrong: 'Zwei Passwörter sind zweimal derselbe Faktor (Wissen). Wer eins abfängt, kann meist auch das zweite abfangen.' },
        ],
        correct: 'a',
        explanation: 'Wissen (Passwort) + Besitz (Handy mit App) = zwei Faktoren.',
      },
    },
    {
      heading: 'Passwörter, Phishing und Social Engineering',
      body: `**Gute Passwörter:**
- **lang** schlägt kompliziert: eine Passphrase aus 4–5 zufälligen Wörtern ist stark und merkbar
- für **jeden Dienst ein eigenes** Passwort, sonst öffnet ein Datenleck alle Konten
- einen **Passwort-Manager** nutzen, der zufällige Passwörter erzeugt und speichert
- nur bei Verdacht auf Kompromittierung ändern, nicht stur alle 90 Tage (so empfehlen es BSI und NIST heute)

**Social Engineering** greift den Menschen an, nicht die Technik. Die häufigste Form ist **Phishing**: gefälschte Mails, SMS (Smishing) oder Anrufe (Vishing), die zu einem Klick, einer Anmeldung oder einer Zahlung verleiten.

**Warnzeichen:**
- **Zeitdruck** („Konto wird in 24 h gesperrt“)
- **Autorität** („Hier ist der Chef, überweise sofort“ – CEO-Fraud)
- Absender oder Link-Ziel passt nicht (Maus über den Link halten: \`micros0ft-login.com\`)
- unerwartete Anhänge, vor allem Office-Dateien mit Makros oder ZIP-Archive

**Richtig reagieren:** nicht klicken, über einen bekannten Weg nachfragen (Telefonnummer aus dem Adressbuch, nicht aus der Mail), Phishing an die IT melden.`,
      analogy: 'Phishing ist wie ein falscher Paketbote an der Tür: Uniform und Klemmbrett sehen echt aus, aber du lässt ihn trotzdem nicht in die Wohnung, ohne beim Paketdienst nachzufragen.',
      terms: [
        { de: 'Passwort-Manager', en: 'password manager' },
        { de: 'Passphrase', en: 'passphrase' },
        { de: 'Social Engineering', en: 'social engineering' },
        { de: 'Phishing', en: 'phishing' },
        { de: 'Chef-Betrug', en: 'CEO fraud / business email compromise (BEC)' },
      ],
      sources: [
        { title: 'BSI – Sichere Passwörter erstellen', url: 'https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Accountschutz/Sichere-Passwoerter-erstellen/sichere-passwoerter-erstellen_node.html' },
      ],
      check: {
        id: 'c3', type: 'multi', difficulty: 2,
        prompt: 'Welche Merkmale deuten auf Phishing hin?',
        options: [
          { id: 'a', text: '„Ihr Konto wird in 2 Stunden gesperrt!“' },
          { id: 'b', text: 'Der Link führt zu `paypa1-sicherheit.com`.' },
          { id: 'c', text: 'Unerwarteter ZIP-Anhang „Rechnung.zip“' },
          { id: 'd', text: 'Die Mail kommt von einem Kollegen, den du erwartet hast, mit dem besprochenen Dokument.', whyWrong: 'Eine erwartete Mail mit besprochenem Inhalt ist erst mal unauffällig. Phishing arbeitet mit Überraschung, Zeitdruck und falschen Absendern oder Links.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Zeitdruck, falsche Domain (1 statt l), unerwarteter Anhang = klassisches Phishing.',
      },
    },
    {
      heading: 'Malware, Updates und Backups',
      body: `**Malware** (Schadsoftware) – die wichtigsten Arten:
| Art | macht |
|---|---|
| **Virus** | hängt sich an Dateien, verbreitet sich beim Öffnen |
| **Wurm** | verbreitet sich selbstständig übers Netz |
| **Trojaner** | tarnt sich als nützliches Programm |
| **Ransomware** | verschlüsselt Daten und fordert Lösegeld |
| **Spyware / Keylogger** | spioniert, zeichnet Tastatureingaben auf |

**Schutz:**
- **Updates** zeitnah einspielen: Die meisten Angriffe nutzen Lücken, für die es längst einen Patch gibt.
- **Virenschutz** bzw. EDR (z. B. Microsoft Defender)
- **Firewall** und nur nötige Dienste offen
- geringste Rechte: Malware kann nur, was das Konto darf

**Backup nach der 3-2-1-Regel:**
- **3** Kopien der Daten (Original + 2 Backups)
- auf **2** verschiedenen Medien
- **1** Kopie außer Haus bzw. offline

Gegen Ransomware hilft vor allem eine Kopie, die der Angreifer **nicht erreichen** kann (offline oder unveränderlich/immutable). Und: Backups regelmäßig **testweise wiederherstellen**, sonst weiß man nicht, ob sie funktionieren.`,
      terms: [
        { de: 'Schadsoftware', en: 'malware' },
        { de: 'Erpressungstrojaner', en: 'ransomware' },
        { de: 'Sicherheitsupdate', en: 'security patch' },
        { de: 'Datensicherung', en: 'backup' },
        { de: 'unveränderlich', en: 'immutable' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Was bedeutet die „1“ in der 3-2-1-Regel?',
        options: [
          { id: 'a', text: 'Eine Kopie liegt außer Haus bzw. offline.' },
          { id: 'b', text: 'Ein Backup pro Tag', whyWrong: 'Die Regel sagt nichts über die Häufigkeit. Die 1 steht für eine Kopie an einem anderen Ort oder offline.' },
          { id: 'c', text: 'Eine Festplatte reicht.', whyWrong: 'Das Gegenteil: Die Regel verlangt zwei verschiedene Medien und eine Kopie außer Haus.' },
        ],
        correct: 'a',
        explanation: '3 Kopien, 2 Medien, 1 außer Haus/offline.',
      },
    },
    {
      heading: 'Verschlüsselung einfach erklärt',
      body: `**Verschlüsselung** macht Daten für Unbefugte unlesbar. Nur wer den **Schlüssel** hat, kann sie wieder lesen.

| | **symmetrisch** | **asymmetrisch** |
|---|---|---|
| Schlüssel | **ein** gemeinsamer Schlüssel | **Schlüsselpaar**: öffentlich + privat |
| Tempo | sehr schnell | langsamer |
| Problem | Wie kommt der Schlüssel sicher zum Partner? | – |
| Beispiel | **AES** | **RSA**, ECC |

Asymmetrisch: Was mit dem **öffentlichen** Schlüssel verschlüsselt wurde, kann nur der **private** Schlüssel entschlüsseln. Den öffentlichen darf jeder kennen.

**HTTPS kombiniert beides:** Mit asymmetrischen Verfahren wird sicher ein gemeinsamer Schlüssel vereinbart, danach läuft die Verbindung schnell symmetrisch mit AES.

**Hash** (z. B. **SHA-256**) ist **keine** Verschlüsselung: Er macht aus beliebigen Daten einen festen Fingerabdruck und lässt sich nicht zurückrechnen. Man nutzt ihn, um **Integrität** zu prüfen und Passwörter zu speichern.

Weitere Begriffe:
- **Daten im Ruhezustand** (at rest), z. B. BitLocker für die Festplatte
- **Daten bei der Übertragung** (in transit), z. B. TLS, VPN`,
      analogy: 'Symmetrisch ist wie ein Haustürschlüssel, den du nachmachen und übergeben musst. Asymmetrisch ist wie ein Briefkasten: Jeder kann etwas einwerfen (öffentlicher Schlüssel), aber nur du hast den Schlüssel zum Herausnehmen (privater Schlüssel).',
      terms: [
        { de: 'Verschlüsselung', en: 'encryption' },
        { de: 'symmetrische Verschlüsselung', en: 'symmetric encryption (AES)' },
        { de: 'asymmetrische Verschlüsselung', en: 'asymmetric / public-key encryption (RSA)' },
        { de: 'Hashwert', en: 'hash' },
        { de: 'ruhende Daten', en: 'data at rest' },
        { de: 'übertragene Daten', en: 'data in transit' },
      ],
      compare: {
        left: 'Verschlüsselung',
        right: 'Hash',
        rows: [
          ['umkehrbar mit Schlüssel', 'nicht umkehrbar'],
          ['schützt Vertraulichkeit', 'prüft Integrität'],
          ['Ausgabe so lang wie die Daten', 'Ausgabe immer gleich lang'],
          ['z. B. AES, RSA', 'z. B. SHA-256'],
        ],
      },
      check: {
        id: 'c5', type: 'single', difficulty: 2,
        prompt: 'Anna will Bob eine verschlüsselte Nachricht schicken (asymmetrisch). Mit welchem Schlüssel verschlüsselt sie?',
        options: [
          { id: 'a', text: 'Mit Bobs öffentlichem Schlüssel' },
          { id: 'b', text: 'Mit Bobs privatem Schlüssel', whyWrong: 'Bobs privaten Schlüssel hat nur Bob, und das muss so bleiben. Anna nutzt den öffentlichen, Bob entschlüsselt mit dem privaten.' },
          { id: 'c', text: 'Mit Annas privatem Schlüssel', whyWrong: 'Mit dem eigenen privaten Schlüssel unterschreibt man (Signatur). Dann könnte jeder mit Annas öffentlichem Schlüssel mitlesen. Vertraulich wird es nur mit Bobs öffentlichem Schlüssel.' },
        ],
        correct: 'a',
        explanation: 'Verschlüsseln für Bob: Bobs öffentlicher Schlüssel. Nur Bobs privater Schlüssel kann entschlüsseln.',
      },
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Wofür steht das „C“ in CIA?',
      options: [
        { id: 'a', text: 'Confidentiality – Vertraulichkeit' },
        { id: 'b', text: 'Control – Kontrolle', whyWrong: 'CIA steht für Confidentiality, Integrity, Availability. Kontrolle ist kein eigenes Schutzziel in diesem Modell.' },
        { id: 'c', text: 'Cloud', whyWrong: 'Die Schutzziele gelten für jede IT, nicht nur die Cloud. C steht für Confidentiality (Vertraulichkeit).' },
        { id: 'd', text: 'Compliance', whyWrong: 'Compliance heißt, Regeln und Gesetze einzuhalten. Das C in der CIA-Triade ist Confidentiality.' },
      ],
      correct: 'a',
      explanation: 'Confidentiality, Integrity, Availability.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 2,
      prompt: 'Welche Maßnahme schützt vor allem welches Ziel?',
      items: [
        { id: 'enc', text: 'Festplattenverschlüsselung (BitLocker)' },
        { id: 'hash', text: 'Prüfsumme beim Download vergleichen' },
        { id: 'bak', text: 'Backup mit Wiederherstellungstest' },
        { id: 'usv', text: 'USV und zweites Netzteil' },
      ],
      buckets: [
        { id: 'c', label: 'Vertraulichkeit' },
        { id: 'i', label: 'Integrität' },
        { id: 'a', label: 'Verfügbarkeit' },
      ],
      solution: { enc: 'c', hash: 'i', bak: 'a', usv: 'a' },
      explanation: 'Verschlüsselung → C, Prüfsumme → I, Backup und Redundanz → A.',
    },
    {
      id: 'q3', type: 'single', difficulty: 1,
      prompt: 'Was ist Authentifizierung?',
      options: [
        { id: 'a', text: 'Nachweis, wer man ist' },
        { id: 'b', text: 'Prüfung, was man darf', whyWrong: 'Das ist Autorisierung. Authentifizierung kommt vorher und beantwortet „Wer bist du?“.' },
        { id: 'c', text: 'Aufzeichnen, was man getan hat', whyWrong: 'Das ist Accounting bzw. Protokollierung, das dritte A in AAA.' },
      ],
      correct: 'a',
      explanation: 'AuthN = wer, AuthZ = was, Accounting = was wurde getan.',
    },
    {
      id: 'q4', type: 'dragdrop', difficulty: 2,
      prompt: 'Welcher Faktor ist das?',
      items: [
        { id: 'pw', text: 'Passwort' },
        { id: 'pin', text: 'PIN' },
        { id: 'app', text: 'Authenticator-App auf dem Handy' },
        { id: 'key', text: 'FIDO2-Sicherheitsschlüssel' },
        { id: 'fp', text: 'Fingerabdruck' },
      ],
      buckets: [
        { id: 'know', label: 'Wissen' },
        { id: 'have', label: 'Besitz' },
        { id: 'are', label: 'Sein (Biometrie)' },
      ],
      solution: { pw: 'know', pin: 'know', app: 'have', key: 'have', fp: 'are' },
      explanation: 'MFA = mindestens zwei verschiedene dieser Kategorien.',
    },
    {
      id: 'q5', type: 'single', difficulty: 2,
      prompt: 'Welches Passwort ist am stärksten?',
      options: [
        { id: 'a', text: '`Tasse-Wolke-Fahrrad-Pinsel-Kompass`' },
        { id: 'b', text: '`P@ssw0rt!`', whyWrong: 'Ersetzungen wie @ für a und 0 für o kennt jedes Knackprogramm. Das Passwort ist kurz und steht praktisch in jeder Wortliste.' },
        { id: 'c', text: '`Sommer2026`', whyWrong: 'Jahreszeit plus Jahr ist eines der häufigsten Muster und wird in Sekunden erraten.' },
        { id: 'd', text: '`Xk9#p`', whyWrong: 'Zufällig, aber nur 5 Zeichen. So kurze Passwörter sind durch reines Durchprobieren schnell geknackt. Länge zählt mehr.' },
      ],
      correct: 'a',
      explanation: 'Lange Passphrase aus zufälligen Wörtern: stark und merkbar.',
    },
    {
      id: 'q6', type: 'single', difficulty: 2,
      prompt: 'Warum soll man für jeden Dienst ein eigenes Passwort nutzen?',
      options: [
        { id: 'a', text: 'Wird ein Dienst gehackt, probieren Angreifer die Zugangsdaten bei anderen Diensten aus.' },
        { id: 'b', text: 'Weil Dienste gleiche Passwörter ablehnen', whyWrong: 'Dienste wissen nicht, welches Passwort du woanders nutzt. Das Problem ist Credential Stuffing: geleakte Daten werden überall ausprobiert.' },
        { id: 'c', text: 'Damit man sie besser vergisst', whyWrong: 'Vergessen soll man sie nicht – dafür gibt es Passwort-Manager. Eigene Passwörter verhindern, dass ein Leck alle Konten öffnet.' },
      ],
      correct: 'a',
      explanation: 'Credential Stuffing. Lösung: Passwort-Manager + MFA.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Eine Mail vom „Geschäftsführer“ verlangt eine dringende Überweisung, man solle niemanden informieren. Was tust du?',
      options: [
        { id: 'a', text: 'Über einen bekannten Weg (z. B. Telefonnummer aus dem Adressbuch) nachfragen und die IT informieren' },
        { id: 'b', text: 'Sofort überweisen, es ist ja der Chef', whyWrong: 'Zeitdruck, Autorität und Geheimhaltung sind die klassischen Merkmale von CEO-Fraud. Erst über einen unabhängigen Weg prüfen.' },
        { id: 'c', text: 'Auf die Mail antworten und fragen, ob sie echt ist', whyWrong: 'Die Antwort geht an den Betrüger, der natürlich „ja“ sagt. Nachfragen nur über einen Weg, der nicht aus der Mail stammt.' },
      ],
      correct: 'a',
      explanation: 'Immer über einen zweiten, bekannten Kanal prüfen.',
    },
    {
      id: 'q8', type: 'dragdrop', difficulty: 2,
      prompt: 'Welche Malware ist das?',
      items: [
        { id: 'ran', text: 'verschlüsselt Dateien und fordert Lösegeld' },
        { id: 'wurm', text: 'verbreitet sich selbstständig übers Netz' },
        { id: 'troj', text: 'gibt sich als nützliches Programm aus' },
        { id: 'key', text: 'zeichnet Tastatureingaben auf' },
      ],
      buckets: [
        { id: 'r', label: 'Ransomware' },
        { id: 'w', label: 'Wurm' },
        { id: 't', label: 'Trojaner' },
        { id: 'k', label: 'Keylogger' },
      ],
      solution: { ran: 'r', wurm: 'w', troj: 't', key: 'k' },
      explanation: 'Ransomware erpresst, Würmer verbreiten sich selbst, Trojaner tarnen sich, Keylogger spionieren.',
    },
    {
      id: 'q9', type: 'single', difficulty: 2,
      prompt: 'Warum sind Updates so wichtig?',
      options: [
        { id: 'a', text: 'Die meisten Angriffe nutzen bekannte Lücken, für die es schon einen Patch gibt.' },
        { id: 'b', text: 'Updates machen den PC immer schneller.', whyWrong: 'Manchmal ja, oft nicht. Der wichtigste Grund sind geschlossene Sicherheitslücken.' },
        { id: 'c', text: 'Ohne Updates startet Windows nicht mehr.', whyWrong: 'Windows startet auch ohne Updates. Gefährlich ist, dass bekannte Lücken offen bleiben.' },
      ],
      correct: 'a',
      explanation: 'Bekannte Lücke + fehlender Patch = einfachster Weg für Angreifer.',
    },
    {
      id: 'q10', type: 'single', difficulty: 2,
      prompt: 'Was beschreibt die 3-2-1-Regel?',
      options: [
        { id: 'a', text: '3 Kopien, 2 verschiedene Medien, 1 Kopie außer Haus/offline' },
        { id: 'b', text: '3 Passwörter, 2 Faktoren, 1 Admin', whyWrong: 'Die 3-2-1-Regel betrifft Backups: Anzahl der Kopien, Medien und Standorte.' },
        { id: 'c', text: '3 Backups pro Tag, 2 pro Woche, 1 pro Monat', whyWrong: 'Die Regel sagt nichts über Häufigkeit, sondern über Kopien, Medien und Orte.' },
      ],
      correct: 'a',
      explanation: '3-2-1 schützt vor Defekt, Brand, Diebstahl und Ransomware.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Wie viele Schlüssel nutzt symmetrische Verschlüsselung?',
      options: [
        { id: 'a', text: 'Einen gemeinsamen Schlüssel zum Ver- und Entschlüsseln' },
        { id: 'b', text: 'Ein Schlüsselpaar aus öffentlichem und privatem Schlüssel', whyWrong: 'Das ist asymmetrische Verschlüsselung (z. B. RSA). Symmetrisch (z. B. AES) nutzt denselben Schlüssel für beide Richtungen.' },
        { id: 'c', text: 'Gar keinen', whyWrong: 'Ohne Schlüssel gäbe es keine Verschlüsselung. Symmetrisch heißt: ein Schlüssel für beides.' },
      ],
      correct: 'a',
      explanation: 'Symmetrisch = ein Schlüssel (AES). Asymmetrisch = Schlüsselpaar (RSA).',
    },
    {
      id: 'q12', type: 'single', difficulty: 2,
      prompt: 'Was ist ein Hash (z. B. SHA-256)?',
      options: [
        { id: 'a', text: 'Ein fester Fingerabdruck von Daten, der sich nicht zurückrechnen lässt' },
        { id: 'b', text: 'Eine Verschlüsselung, die man mit dem Passwort aufheben kann', whyWrong: 'Ein Hash ist eine Einwegfunktion. Man kann aus dem Hash nicht die Originaldaten zurückgewinnen, auch nicht mit Passwort.' },
        { id: 'c', text: 'Eine Komprimierung wie ZIP', whyWrong: 'ZIP lässt sich entpacken. Ein Hash ist immer gleich lang, egal wie groß die Datei ist, und nicht umkehrbar.' },
      ],
      correct: 'a',
      explanation: 'Hash = Integrität prüfen und Passwörter sicher speichern.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Was bedeutet „Prinzip der geringsten Rechte“?',
      options: [
        { id: 'a', text: 'Jeder bekommt nur die Rechte, die er für seine Aufgabe braucht.' },
        { id: 'b', text: 'Alle Mitarbeiter bekommen Admin-Rechte, damit nichts blockiert.', whyWrong: 'Das Gegenteil: Admin-Rechte für alle bedeuten, dass jede Malware und jeder Fehler sofort das ganze System trifft.' },
        { id: 'c', text: 'Nur der Chef darf sich anmelden.', whyWrong: 'Es geht nicht darum, wer sich anmelden darf, sondern dass jedes Konto nur die nötigen Rechte hat.' },
      ],
      correct: 'a',
      explanation: 'Weniger Rechte = weniger Schaden bei Fehlern oder Angriffen.',
    },
    {
      id: 'q14', type: 'multi', difficulty: 2,
      prompt: 'Was hilft am besten gegen Ransomware?',
      options: [
        { id: 'a', text: 'Offline- oder unveränderliche Backups' },
        { id: 'b', text: 'Zeitnahe Sicherheitsupdates' },
        { id: 'c', text: 'Keine Admin-Rechte für normale Benutzer' },
        { id: 'd', text: 'RAID 1 auf dem Dateiserver', whyWrong: 'RAID spiegelt die verschlüsselten Dateien sofort mit. Es schützt nur vor Plattenausfall, nicht vor Ransomware.' },
        { id: 'e', text: 'Ein Synchronisations-Ordner (z. B. OneDrive) als einziges Backup', whyWrong: 'Sync-Ordner übertragen verschlüsselte Dateien sofort in die Cloud. Versionierung kann helfen, ersetzt aber kein getrenntes Backup.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Vorbeugen (Updates, wenig Rechte) + unerreichbares Backup.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Ein Laptop wird gestohlen. Welche Maßnahme schützt die Daten auf der Festplatte?',
      options: [
        { id: 'a', text: 'Festplattenverschlüsselung (z. B. BitLocker)' },
        { id: 'b', text: 'Ein starkes Windows-Passwort allein', whyWrong: 'Ohne Verschlüsselung baut der Dieb die SSD aus und liest sie an einem anderen PC. Das Windows-Passwort schützt dann nicht.' },
        { id: 'c', text: 'HTTPS', whyWrong: 'HTTPS schützt Daten bei der Übertragung. Gespeicherte Daten (at rest) schützt nur Verschlüsselung der Festplatte.' },
        { id: 'd', text: 'Ein Virenscanner', whyWrong: 'Ein Virenscanner erkennt Schadsoftware, verhindert aber nicht, dass jemand die ausgebaute Festplatte ausliest.' },
      ],
      correct: 'a',
      explanation: 'Daten at rest → Festplattenverschlüsselung.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Was ist die beste Reaktion?',
        scenario: 'Mail an alle:\n```\nVon: IT-Support <support@firma-it-helpdesk.net>\nBetreff: Ihr Postfach ist voll!\nIhr Postfach wird in 1 Stunde gesperrt.\nMelden Sie sich hier an, um Speicher freizugeben:\nhttps://firma-login.microsoft-365-verify.com\n```\nDie echte Firmendomain ist `firma.de`.',
        options: [
          { id: 'a', text: 'Nicht klicken, die Mail an die IT bzw. per „Phishing melden“ weitergeben' },
          { id: 'b', text: 'Klicken und anmelden, MFA schützt ja.', whyWrong: 'Moderne Phishing-Seiten leiten auch den MFA-Code in Echtzeit weiter (Adversary-in-the-Middle). Gar nicht erst anmelden.' },
          { id: 'c', text: 'Antworten und fragen, ob die Mail echt ist', whyWrong: 'Die Antwort landet beim Absender, also beim Angreifer. Er bestätigt natürlich, dass alles echt ist.' },
          { id: 'd', text: 'Die Mail löschen und niemandem etwas sagen', whyWrong: 'Löschen ist besser als klicken, aber die IT muss Bescheid wissen, um Kollegen zu warnen und die Absender zu sperren.' },
        ],
        correct: 'a',
        explanation: 'Falsche Domains, Zeitdruck, Anmeldelink = Phishing. Melden hilft allen.',
      },
      {
        id: 'b2', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen stimmen?',
        options: [
          { id: 'a', text: 'HTTPS nutzt asymmetrische Verfahren für den Schlüsselaustausch und danach symmetrische Verschlüsselung.' },
          { id: 'b', text: 'Passwörter sollte ein Server als Hash speichern, nicht im Klartext.' },
          { id: 'c', text: 'Passkeys/FIDO2 funktionieren auf Phishing-Seiten nicht, weil sie an die echte Domain gebunden sind.' },
          { id: 'd', text: 'Passwort + Sicherheitsfrage ist Zwei-Faktor-Authentifizierung.', whyWrong: 'Beides ist Wissen. Echte MFA braucht zwei verschiedene Kategorien, z. B. Wissen + Besitz.' },
          { id: 'e', text: 'Ein Hash lässt sich mit dem richtigen Schlüssel entschlüsseln.', whyWrong: 'Ein Hash ist eine Einwegfunktion ohne Schlüssel. Man kann nur prüfen, ob eine Eingabe denselben Hash ergibt.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Hybride Verschlüsselung bei TLS, gehashte Passwörter, phishing-resistente Passkeys.',
      },
      {
        id: 'b3', type: 'scenario', difficulty: 3,
        prompt: 'Was hätte den Schaden am stärksten begrenzt?',
        scenario: 'Ein Buchhalter öffnet einen Mailanhang. Ransomware startet und verschlüsselt seinen PC, alle Netzlaufwerke und den Backup-Ordner auf dem Dateiserver. Der Buchhalter arbeitet täglich mit einem Konto, das Domänen-Admin-Rechte hat.',
        options: [
          { id: 'a', text: 'Geringste Rechte für das Konto und ein Backup, das vom Netz aus nicht erreichbar ist' },
          { id: 'b', text: 'Ein schnellerer Dateiserver', whyWrong: 'Mehr Leistung ändert nichts daran, dass die Ransomware mit Admin-Rechten überall hinkam und auch das Backup erreichbar war.' },
          { id: 'c', text: 'Ein längeres Passwort für den Buchhalter', whyWrong: 'Das Passwort wurde nicht geknackt, er hat den Anhang selbst geöffnet. Entscheidend sind Rechte und ein unerreichbares Backup.' },
          { id: 'd', text: 'RAID 5 statt RAID 1 auf dem Dateiserver', whyWrong: 'Jede RAID-Stufe spiegelt oder verteilt die bereits verschlüsselten Daten. RAID ist kein Schutz vor Ransomware.' },
        ],
        correct: 'a',
        explanation: 'Ohne Admin-Rechte kein Zugriff auf alles, mit Offline-Backup schnelle Wiederherstellung.',
      },
      {
        id: 'b4', type: 'dragdrop', difficulty: 3,
        prompt: 'Ordne die Maßnahme dem Schutzziel zu, das sie vor allem stärkt.',
        items: [
          { id: 'mfa', text: 'MFA für alle Konten' },
          { id: 'sig', text: 'Digitale Signatur einer Rechnung' },
          { id: 'ddos', text: 'DDoS-Schutz für den Webshop' },
          { id: 'tls', text: 'TLS für das Kundenportal' },
          { id: 'cluster', text: 'Zweiter Server im Cluster' },
        ],
        buckets: [
          { id: 'c', label: 'Vertraulichkeit' },
          { id: 'i', label: 'Integrität' },
          { id: 'a', label: 'Verfügbarkeit' },
        ],
        solution: { mfa: 'c', sig: 'i', ddos: 'a', tls: 'c', cluster: 'a' },
        explanation: 'MFA und TLS halten Unbefugte fern, Signaturen zeigen Veränderungen, DDoS-Schutz und Cluster halten Dienste erreichbar. (TLS sichert nebenbei auch die Integrität.)',
      },
      {
        id: 'b5', type: 'single', difficulty: 3,
        prompt: 'Ein Admin will prüfen, ob eine heruntergeladene ISO-Datei unverändert ist. Was tut er?',
        options: [
          { id: 'a', text: 'Den SHA-256-Hash der Datei berechnen und mit dem Wert auf der Herstellerseite vergleichen' },
          { id: 'b', text: 'Die Datei mit AES verschlüsseln', whyWrong: 'Verschlüsseln schützt die Vertraulichkeit, sagt aber nichts darüber, ob die Datei vorher verändert wurde.' },
          { id: 'c', text: 'Die Dateigröße prüfen', whyWrong: 'Ein Angreifer kann Schadcode einbauen, ohne die Größe auffällig zu ändern. Nur ein Hash erkennt jede Veränderung zuverlässig.' },
          { id: 'd', text: 'Die Datei in einen ZIP-Ordner packen', whyWrong: 'Packen ändert nichts an der Frage, ob der Inhalt echt ist. Dafür vergleicht man den Hash.' },
        ],
        correct: 'a',
        explanation: 'Gleicher Hash = gleiche Datei. Unter Windows: `Get-FileHash datei.iso`, Linux: `sha256sum datei.iso`.',
      },
    ],
  },
};

export default level;
