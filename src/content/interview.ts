import type { InterviewCard } from '../types/content';

// Bewerbungsmodus Teil D: typische Fragen für 2nd/3rd-Level-Support bei einem IAM-Hersteller.
// Musterantworten sind generisch (kein echtes Produkt, keine Firmeninterna). IDs nie umbenennen.

export const interviewCards: InterviewCard[] = [
  // ── AD / Exchange / Fileserver ──
  {
    id: 'iv-infra-1', area: 'infra', lang: 'de',
    q: 'Erklären Sie das AGDLP-Prinzip und warum man es verwendet.',
    a: '**A**ccounts kommen in **G**lobale Gruppen (nach Rolle/Abteilung), diese in **D**omänenlokale Gruppen (nach Ressource und Recht), und nur diese bekommen die **P**ermission auf der Ressource.\n\n**Warum:** Rechte stehen an wenigen Stellen, sind nachvollziehbar und lassen sich über Gruppenmitgliedschaft steuern, ideal für ein IAM-System.',
    tip: 'Kurzes Beispiel nennen: GG_Vertrieb → DL_Vertrieb_RW → Ordner Vertrieb (Ändern).',
  },
  {
    id: 'iv-infra-2', area: 'infra', lang: 'de',
    q: 'Ein Benutzer wird immer wieder gesperrt. Wie gehen Sie vor?',
    a: '1. Auf dem PDC-Emulator Ereignis **4740** suchen, Feld „Aufrufername des Computers“ zeigt die Quelle.\n2. Auf diesem Gerät nach gespeicherten alten Anmeldedaten suchen: Laufwerke, Outlook/Mobilgerät, Dienste, geplante Aufgaben, Anmeldeinformationsverwaltung.\n3. Quelle bereinigen, dann entsperren und beobachten.',
    tip: 'Zeigt Methode statt „ich entsperre einfach“.',
  },
  {
    id: 'iv-infra-3', area: 'infra', lang: 'de',
    q: 'Was ist der Unterschied zwischen Vollzugriff, Senden als und Senden im Auftrag bei einem Postfach?',
    a: '**Vollzugriff:** Postfach öffnen und lesen, kein Senden.\n**Senden als:** Mail erscheint, als käme sie direkt vom Postfach.\n**Senden im Auftrag:** Empfänger sieht „X im Auftrag von Y“.\n\nZusatz: Automapping in Outlook gibt es nur bei direkt vergebenem Vollzugriff, nicht über Gruppen.',
  },
  {
    id: 'iv-infra-4', area: 'infra', lang: 'de',
    q: 'Eine Gruppenänderung wirkt beim Benutzer nicht. Woran liegt das meistens?',
    a: 'Am **Zugriffstoken**: Gruppen werden bei der Anmeldung ins Token geschrieben. Lösung: ab- und wieder anmelden bzw. `klist purge`. Außerdem prüfen: Ist die Änderung schon auf den DC repliziert, den der Client nutzt?',
  },
  {
    id: 'iv-infra-5', area: 'infra', lang: 'de',
    q: 'Wie prüfen Sie, warum ein Benutzer auf einen Ordner nicht zugreifen kann?',
    a: 'Effektive Rechte bestimmen: **Freigabe- und NTFS-Rechte**, das restriktivere gewinnt. Alle Gruppen inklusive verschachtelter einbeziehen, auf **Verweigern** achten. Werkzeuge: Registerkarte „Effektiver Zugriff“, `icacls`, `whoami /groups` beim Benutzer. Danach prüfen, ob die Gruppe aktuell im Token ist.',
  },
  {
    id: 'iv-infra-6', area: 'infra', lang: 'en',
    q: 'A customer reports that emails from your application are not arriving. How do you troubleshoot?',
    a: 'First check if the application really handed them over (application log). Then run a **message trace** in Exchange (or `Get-MessageTraceV2`) for the sender address. Status shows the answer: delivered, failed with an NDR code, or quarantined. For quarantine, check SPF/DKIM alignment of the sending route instead of disabling filters.',
  },
  {
    id: 'iv-infra-7', area: 'infra', lang: 'de',
    q: 'Was bedeutet der Fehler KRB_AP_ERR_SKEW?',
    a: 'Die Uhrzeit von Client und DC weicht zu stark ab (Standardtoleranz 5 Minuten). Prüfung mit `w32tm /query /status`. Lösung: Zeitsynchronisierung über die Domänenhierarchie (`w32tm /config /syncfromflags:domhier /update`, `w32tm /resync`), nicht die Toleranz erhöhen.',
  },

  // ── Berechtigungsmanagement ──
  {
    id: 'iv-perm-1', area: 'perm', lang: 'de',
    q: 'Was bedeutet Least Privilege, und wie setzt man es praktisch um?',
    a: 'Jeder bekommt nur die Rechte, die er für seine Aufgabe braucht, und nur so lange wie nötig.\n\n**Praktisch:** rollenbasierte Vergabe, Rechte über Gruppen, Genehmigung durch Dateneigentümer, befristete Rechte, regelmäßige Rezertifizierung, Entzug beim Abteilungswechsel, Admin-Rechte nur just-in-time (z. B. PIM).',
  },
  {
    id: 'iv-perm-2', area: 'perm', lang: 'de',
    q: 'Was ist Privilege Creep, und wie verhindert man ihn?',
    a: 'Das Ansammeln von Rechten über die Zeit, typisch bei Abteilungswechseln, wenn alte Rechte bleiben.\n\n**Gegenmittel:** Mover-Prozess, der alte Rollenrechte entzieht, Rezertifizierungen, Berichte über Rechte außerhalb der Rolle, befristete Sonderrechte.',
  },
  {
    id: 'iv-perm-3', area: 'perm', lang: 'de',
    q: 'Erklären Sie die Freigabelinks in SharePoint und OneDrive.',
    a: '**Jeder:** anonym, keine Anmeldung, höchstes Risiko.\n**Personen in Ihrer Organisation:** alle internen Konten.\n**Personen mit vorhandenem Zugriff:** gibt keine neuen Rechte.\n**Bestimmte Personen:** nur genannte Empfänger, sicherste Variante.\n\nAdministratoren können die externe Freigabe auf Organisations- und Websiteebene einschränken, die Website darf nie offener sein als die Organisation.',
  },
  {
    id: 'iv-perm-4', area: 'perm', lang: 'de',
    q: 'Was ist Privileged Identity Management (PIM) in Entra ID?',
    a: 'Admin-Rollen werden nicht dauerhaft, sondern **berechtigt** zugewiesen. Bei Bedarf aktiviert der Admin die Rolle befristet, optional mit MFA, Begründung und Genehmigung. Alles wird protokolliert. Ziel: keine dauerhaften Hochprivilegien (Just-in-time).',
  },
  {
    id: 'iv-perm-5', area: 'perm', lang: 'de',
    q: 'Warum vergibt man Rechte nicht direkt an Benutzer?',
    a: 'Direkte Rechte sind schwer zu überblicken, bleiben bei Wechseln oft hängen und lassen sich nicht zentral prüfen. Über Gruppen bzw. Rollen ist ein Recht an einer Stelle steuerbar, auditierbar und durch ein IAM-System automatisierbar. Außerdem bleiben bei gelöschten Benutzern keine verwaisten SIDs in den ACLs.',
  },
  {
    id: 'iv-perm-6', area: 'perm', lang: 'en',
    q: 'A user can read files but not save them, although his role grants Modify. What do you check?',
    a: 'All his groups, including nested ones, and all ACL entries. Most likely an explicit **Deny** from another group (e.g. a leftover trainee group) or a more restrictive **share permission**. Also check if the file is read-only or locked. Fix the root cause (leftover membership) instead of removing the Deny for everyone.',
  },

  // ── 2nd/3rd Level Troubleshooting ──
  {
    id: 'iv-ts-1', area: 'troubleshoot', lang: 'de',
    q: 'Beschreiben Sie Ihre Vorgehensweise bei einem unbekannten Fehler.',
    a: '1. **Symptom genau erfassen:** Was, seit wann, wer betroffen, was geändert?\n2. **Daten sammeln:** Logs, Fehlermeldungen, Version.\n3. **Eingrenzen:** Was funktioniert, was nicht? Unterschied finden.\n4. **Hypothese prüfen**, eine Änderung nach der anderen.\n5. **Lösen und verifizieren.**\n6. **Dokumentieren**, ggf. Prävention vorschlagen.',
    tip: 'Ein eigenes Beispiel aus Praxis oder Projekt nennen.',
  },
  {
    id: 'iv-ts-2', area: 'troubleshoot', lang: 'de',
    q: 'Wann eskalieren Sie ein Ticket an den 3rd Level bzw. die Entwicklung?',
    a: 'Wenn ein **Produktfehler** wahrscheinlich ist (reproduzierbar, Konfiguration korrekt), bei Bedarf an Code-Analyse oder Patch, bei Sicherheitsproblemen oder wenn das SLA ohne Hilfe gefährdet ist.\n\n**Mit dabei:** Version, Schritte zur Reproduktion, erwartetes und tatsächliches Ergebnis, Logs, bisherige Analyse, Auswirkung beim Kunden.',
  },
  {
    id: 'iv-ts-3', area: 'troubleshoot', lang: 'de',
    q: 'Was gehört in einen guten Bug-Report?',
    a: 'Kurzer, eindeutiger Titel. Produktversion und Umgebung. **Schritte zur Reproduktion.** Erwartetes vs. tatsächliches Ergebnis. Logs und Screenshots (bereinigt um personenbezogene Daten). Häufigkeit und Auswirkung. Workaround, falls bekannt.',
  },
  {
    id: 'iv-ts-4', area: 'troubleshoot', lang: 'de',
    q: 'Ein Kunde sagt: „Wir haben nichts geändert.“ Wie reagieren Sie?',
    a: 'Höflich akzeptieren, aber prüfen: Updates, Zertifikate, abgelaufene Kennwörter von Dienstkonten, Infrastrukturänderungen (DC-Tausch), neue Datensätze mit Sonderfällen. Oft hat sich nicht die Konfiguration, sondern die Umgebung oder die Daten geändert. Zeitpunkt des ersten Fehlers im Log mit Änderungen abgleichen.',
  },
  {
    id: 'iv-ts-5', area: 'troubleshoot', lang: 'de',
    q: 'Wie lesen Sie eine große Logdatei effizient?',
    a: 'Zeitraum eingrenzen (wann trat es auf?), nach **ERROR/WARN** filtern, den **ersten** Fehler suchen (Folgefehler ignorieren), Korrelation über ID/Benutzer/Auftrag. Werkzeuge: `Select-String`, `Get-Content -Tail -Wait`, Ereignisanzeige mit Filter. Erst danach Details lesen.',
  },
  {
    id: 'iv-ts-6', area: 'troubleshoot', lang: 'de',
    q: 'Erzählen Sie von einem schwierigen Problem, das Sie gelöst haben.',
    a: 'Nach **STAR** antworten: **S**ituation (Kontext), **T**ask (Ihre Aufgabe), **A**ction (Ihre Schritte, konkret), **R**esult (messbares Ergebnis, was Sie gelernt haben).\n\nBeispielstruktur: „Benutzer wurden ständig gesperrt → 4740 ausgewertet → altes Gerät gefunden → bereinigt → Anleitung für Kennwortwechsel geschrieben, Tickets dazu gingen zurück.“',
    tip: 'Eigenes, echtes Beispiel vorbereiten. Nichts erfinden.',
  },

  // ── PowerShell und SQL ──
  {
    id: 'iv-sc-1', area: 'scripting', lang: 'de',
    q: 'Wie finden Sie alle deaktivierten AD-Benutzer und exportieren sie?',
    a: '```\nGet-ADUser -Filter \'Enabled -eq $false\' -Properties LastLogonDate |\n  Select-Object SamAccountName, Name, LastLogonDate |\n  Export-Csv deaktiviert.csv -NoTypeInformation -Delimiter \';\' -Encoding UTF8\n```\nFiltern möglichst früh mit `-Filter`, Ausgabe mit Select-Object, Export statt Format-Table.',
  },
  {
    id: 'iv-sc-2', area: 'scripting', lang: 'de',
    q: 'Wie sichern Sie ein PowerShell-Skript ab, das Massenänderungen macht?',
    a: 'Testlauf mit **`-WhatIf`**, Eingaben prüfen (leere Variablen abfangen), Obergrenze für Treffer, `try/catch` mit **`-ErrorAction Stop`**, Protokoll bzw. `Start-Transcript`, vorher Ist-Stand exportieren (für Rücknahme), erst in Testumgebung oder an wenigen Objekten.',
  },
  {
    id: 'iv-sc-3', area: 'scripting', lang: 'de',
    q: 'Warum greift ein catch-Block manchmal nicht?',
    a: 'Viele Cmdlets erzeugen **nicht beendende Fehler**. catch reagiert nur auf beendende Fehler. Lösung: `-ErrorAction Stop` am Cmdlet oder `$ErrorActionPreference = \'Stop\'`.',
  },
  {
    id: 'iv-sc-4', area: 'scripting', lang: 'de',
    q: 'Was ist der Unterschied zwischen INNER JOIN und LEFT JOIN?',
    a: '**INNER JOIN:** nur Zeilen mit Treffer in beiden Tabellen.\n**LEFT JOIN:** alle Zeilen der linken Tabelle, fehlende rechts als NULL.\n\nPraxis: „Benutzer ohne Gruppe“ findet man mit LEFT JOIN und `WHERE m.UserId IS NULL`.',
  },
  {
    id: 'iv-sc-5', area: 'scripting', lang: 'de',
    q: 'Sie sollen in der Produktdatenbank eines Kunden etwas analysieren. Worauf achten Sie?',
    a: 'Nur **lesend** zugreifen (eigenes Lesekonto, z. B. db_datareader), keine Änderungen per SQL an Produktdaten, Abfragen mit Filter und begrenzter Ergebnismenge (`TOP`), große Abfragen nicht zur Hauptlast. Personenbezogene Daten nur so weit wie nötig. Änderungen immer über die Anwendung oder nach Herstelleranleitung mit Backup.',
  },
  {
    id: 'iv-sc-6', area: 'scripting', lang: 'en',
    q: 'What is the difference between WHERE and HAVING?',
    a: '**WHERE** filters rows before grouping. **HAVING** filters groups after `GROUP BY`, so it can use aggregates like `COUNT(*)`. Example: departments with more than 10 members: `GROUP BY Department HAVING COUNT(*) > 10`.',
  },

  // ── Technisches Englisch ──
  {
    id: 'iv-en-1', area: 'english', lang: 'en',
    q: 'Tell me about yourself.',
    a: 'Keep it to about one minute: **present** (current role or training, key skills: AD, Microsoft 365, scripting), **past** (relevant experience or projects), **future** (why this support role and why identity management). End with what you bring to the team.',
    tip: 'Prepare it, but do not read it. Speak slowly.',
  },
  {
    id: 'iv-en-2', area: 'english', lang: 'en',
    q: 'How would you explain RBAC to a non-technical customer?',
    a: '"Instead of giving each person individual access, we define roles like *Accountant* or *Sales*. Each role has exactly the access the job needs. When someone joins or changes teams, they get the matching role, and the access follows automatically."',
  },
  {
    id: 'iv-en-3', area: 'english', lang: 'en',
    q: 'A customer is angry because the problem is not solved yet. What do you say?',
    a: 'Acknowledge, take ownership, give a clear next step and time:\n"I understand this is blocking your team, and I am sorry for the delay. I have escalated the issue to our development team with all logs. I will update you by 3 pm today, even if we do not have the fix yet."',
  },
  {
    id: 'iv-en-4', area: 'english', lang: 'en',
    q: 'How do you ask a customer for log files in a polite and precise way?',
    a: '"To analyse this further, could you please send us the connector log from yesterday between 2 and 3 am? You can find it in the log folder of the IAM server. Please remove any passwords before sending, and upload it via our secure portal rather than by email."',
  },
  {
    id: 'iv-en-5', area: 'english', lang: 'en',
    q: 'Explain the joiner-mover-leaver process in English.',
    a: '**Joiner:** a new employee is created in HR, the IAM creates accounts and assigns roles before day one.\n**Mover:** when someone changes position, new access is granted and old access is removed.\n**Leaver:** on the exit date accounts are disabled and access is revoked, data is handed over according to policy.',
  },
  {
    id: 'iv-en-6', area: 'english', lang: 'en',
    q: 'Why do you want to work in identity and access management support?',
    a: 'Link your interests to the role: IAM connects many systems (AD, Exchange, file servers, cloud), so troubleshooting is varied. It is security-relevant and helps customers meet compliance like GDPR or NIS2. Mention that you enjoy analysing problems and explaining solutions to customers.',
    tip: 'Be honest and specific. Avoid generic phrases.',
  },

  // ── IAM-Wissen ──
  {
    id: 'iv-iam-1', area: 'iam', lang: 'de',
    q: 'Was ist Identity and Access Management, und welche Vorteile bringt es?',
    a: 'IAM steuert, **wer welche Zugriffe** in welchen Systemen hat, über den ganzen Lebenszyklus (Eintritt, Wechsel, Austritt).\n\n**Vorteile:** schnellere Bereitstellung, weniger Fehler, Least Privilege, sofortiger Entzug bei Austritt, Nachweisbarkeit für Audits, Entlastung der IT durch Self-Service.',
  },
  {
    id: 'iv-iam-2', area: 'iam', lang: 'de',
    q: 'Was ist eine Rezertifizierung (Access Review)?',
    a: 'Regelmäßige Überprüfung, ob bestehende Rechte noch gebraucht werden. Verantwortliche (Vorgesetzte, Dateneigentümer) bestätigen oder entziehen. Wichtig: machbare Mengen und Kontext (letzte Nutzung), sonst wird nur abgenickt. Wird u. a. von ISO 27001 und Prüfern erwartet.',
  },
  {
    id: 'iv-iam-3', area: 'iam', lang: 'de',
    q: 'Was bedeutet Funktionstrennung (Segregation of Duties)?',
    a: 'Kritische Tätigkeiten werden auf verschiedene Personen verteilt, z. B. Lieferanten anlegen und Zahlungen freigeben. Ein IAM kann widersprüchliche Rechte erkennen und blockieren. Ausnahmen nur befristet, mit Genehmigung des Risikoverantwortlichen und kompensierender Kontrolle.',
  },
  {
    id: 'iv-iam-4', area: 'iam', lang: 'de',
    q: 'Welche Rolle spielen DSGVO und NIS2 für IAM?',
    a: '**DSGVO:** Zugriff auf personenbezogene Daten nur für Berechtigte (Vertraulichkeit, Art. 32 Sicherheit der Verarbeitung), Nachweisbarkeit, Datenminimierung.\n**NIS2:** verlangt von betroffenen Einrichtungen Risikomanagement-Maßnahmen, u. a. Zugriffskontrolle und Management von Konten. IAM liefert dafür Prozesse und Nachweise.',
    tip: 'Nicht zu juristisch werden, den Bezug zur Praxis zeigen.',
  },
  {
    id: 'iv-iam-5', area: 'iam', lang: 'de',
    q: 'Was ist der Unterschied zwischen RBAC und ABAC?',
    a: '**RBAC:** Rechte hängen an Rollen, Benutzer bekommen Rollen. Einfach zu verstehen und zu prüfen.\n**ABAC:** Entscheidung anhand von Attributen (Abteilung, Standort, Uhrzeit). Flexibler, aber schwerer nachzuvollziehen.\n\nIn der Praxis oft kombiniert: Rollen werden anhand von HR-Attributen automatisch zugewiesen.',
  },
  {
    id: 'iv-iam-6', area: 'iam', lang: 'de',
    q: 'Was macht ein Abgleich (Reconciliation) im IAM-System?',
    a: 'Er vergleicht das **Soll** (Zuweisungen im IAM) mit dem **Ist** in den Zielsystemen (AD, Fileserver, M365). Abweichungen, z. B. direkt im AD gesetzte Gruppen, werden je nach Richtlinie gemeldet oder korrigiert. So bleiben Berechtigungen nachvollziehbar.',
  },
  {
    id: 'iv-iam-7', area: 'iam', lang: 'en',
    q: 'What happens in an IAM system when an employee leaves the company?',
    a: 'HR sets the exit date. On that date the IAM **disables** the accounts (not delete immediately), removes group memberships and licenses, and logs every step. Mailbox and files are handed over or retained according to the customer’s policy. Later, accounts are deleted after the retention period.',
  },
];
