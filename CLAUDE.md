# NetCloud Academy – Projektleitfaden

Lern-Web-App für Netzwerktechnik und Cloud (Ziel: CCNA, Network+, AZ-900/AZ-104, AWS SAA).
React 19 + Vite + TypeScript + Tailwind v4, PWA (vite-plugin-pwa). Kein Backend, Fortschritt in `localStorage`.

## Befehle

```bash
npm run dev       # Dev-Server (http://localhost:5173)
npm test          # Vitest: Lib-Logik, Generatoren, Content-Validierung
npm run build     # Typecheck (tsc -b) + Produktions-Build inkl. Service Worker nach dist/
npm run test:e2e  # Playwright: alle Seiten/Lektionen bei 375 px ohne horizontalen Überlauf
npm run icons     # PWA-Icons in public/ neu erzeugen
```

Vor jedem Commit: `npm test` und `npm run build` müssen grün sein. Nach Layout-Änderungen zusätzlich `npm run test:e2e`.

**Testmodus:** `http://localhost:5173/?dev=unlock-all#/` schaltet alle Level frei und nutzt einen getrennten Speicher (`netcloud-progress-dev`). Für Browser-Tests immer den Testmodus (oder `http://[::1]:5173`) nutzen. Auf `localhost` ohne `?dev` liegt der echte Fortschritt des Nutzers.

## Projektstruktur

```
src/
  content/                 NUR Daten – kein UI-Code
    network/NN-*.ts        Teil A, ein Level pro Datei
    cloud/NN-*.ts          Teil B, ein Level pro Datei
    index.ts               lädt Level automatisch (import.meta.glob), geplanter Lernpfad (`tracks`)
    certs.ts               Zertifikate, Prüfungsnummern, Prüfungsbereiche (domains)
    badges.ts              Abzeichen inkl. Bedingung
    glossary.ts            Glossar aus allen `terms` + Glossar-Verlinkung
    decisions.ts           Entscheidungsbaum (Seite /decide)
    prices.ts              Beispielpreise für Kosten-Rechenaufgaben
    content.test.ts        Validiert alle Inhalte (IDs, Lösungen, ≥15 Fragen, Domains, Quellen …)
  types/content.ts         Datenmodell (Level, Question-Union, LessonSection, Lab …)
  lib/
    progress.ts            reine Funktionen: XP, Streak, Leitner, Freischaltung, Labs, Prüfungen, Import
    ProgressContext.tsx    React-Context + localStorage-Persistenz + Badge-Erkennung
    subnet.ts              IPv4-Subnetz-Mathe + Generator für Fragetyp `subnet`
    ipv6.ts                IPv6 parsen, kürzen (RFC 5952), EUI-64
    generators.ts          Zufallsaufgaben für Fragetyp `generated` und Trainer (VLSM, IPv6, Kosten, NSG, IAM, RBAC, STP)
    dev.ts                 Testmodus-Schalter
    reminder.ts            Streak-Erinnerung (Notification API)
  components/
    QuestionSession.tsx    spielt eine Fragenliste ab (Quiz/Boss/Review/Prüfung, Herzen)
    LessonView.tsx         Lektion inkl. Diagrammen, Flip-Karten, Verständnisfragen, Quellen, Glossar-Links
    Diagrams.tsx           registrierte Diagramme/Animationen (DiagramId)
    questions/             ein Component pro Fragetyp + QuestionRenderer + shared (RichText, Result)
  pages/                   Home, Level (Lektion→Quiz→Boss→Lab), Review, Profile, Tools, Trainer, Exam, Glossary, Decide
e2e/mobile.e2e.ts          Playwright-Test (Endung .e2e.ts, damit Vitest ihn nicht einsammelt)
scripts/make-icons.mjs     erzeugt PNG-Icons ohne Zusatzpakete
```

## Neues Level hinzufügen

1. Datei anlegen, z. B. `src/content/network/07-routing.ts` (Vorlage: eine bestehende Level-Datei kopieren).
2. `id` eindeutig (`net-07`, `cloud-06`), `track` und `order` setzen. `order` muss lückenlos an das vorige Level anschließen.
3. `domains` setzen: Prüfungsbereich je Zertifikat (Ids aus `certs.ts`). Einzelne Fragen können per `domain` abweichen.
4. Optional `lab` (Praxis-Lab mit mind. 3 Schritten). Bei Cloud-Labs immer einen Aufräum-Schritt einbauen, damit keine Kosten entstehen.
5. `export default level;` – mehr nicht. Die Datei wird automatisch gefunden. Der Platzhaltertitel in `tracks` wird automatisch ersetzt.
6. `npm test` prüft: mindestens 15 Quizfragen, mindestens 5 Boss-Fragen, eindeutige IDs, gültige Lösungen, Domains und Quellen.

## Lektionsabschnitte

`LessonSection` kann neben `body`, `analogy` und `terms` enthalten:
- `diagram`: Id aus `DiagramId`. Neue Diagramme in `components/Diagrams.tsx` ergänzen.
- `compare`: Flip-Karten-Gegenüberstellung `{ left, right, rows: [links, rechts][] }`
- `check`: eine Verständnisfrage (beliebiger Fragetyp), zählt nicht für XP oder Wiederholen
- `sources`: offizielle Doku/RFCs (`https://`). Nur Links eintragen, die sicher existieren.

**Fett** gesetzte Begriffe im Text werden automatisch zum Level verlinkt, in dem sie als `term` eingeführt wurden.

## Neue Frage hinzufügen

Frage-Objekt in `quiz` oder `boss.questions` eintragen. Alle Typen siehe `src/types/content.ts`:

| type | Pflichtfelder | Hinweis |
|---|---|---|
| `single` / `scenario` | `options[]`, `correct` | `scenario` = Ausgangslage, darf ```-Blöcke (z. B. `show`-Ausgaben) enthalten |
| `multi` | `options[]`, `correct[]` | mind. 2 richtige |
| `dragdrop` | `items[]`, `buckets[]`, `solution` | `solution[itemId] = bucketId` |
| `ordering` | `items[]` in **richtiger** Reihenfolge | wird gemischt angezeigt, mind. 3 Schritte |
| `subnet` | `task`, `prefixRange` | IPv4-Zufallswerte, Erklärung automatisch |
| `generated` | `generator` | Zufallsaufgabe aus `lib/generators.ts`, kein `prompt` nötig |
| `cli` | `shell`, `template` mit `{{0}}`, `blanks[].accept[]` | mehrzeilig = CLI-Session mit Moduswechseln; optional `portal` |
| `topology` | `nodes`, `links`, `mode: 'click'` + `correct[]` oder `mode: 'fill'` + `choices` + `solution` | Koordinaten 0–100, Links optional beschriftet `[a, b, 'Label']` |
| `chain` | `steps[]` mit Optionen (`correct`, `feedback`, optional `next`) | Fehlersuche Schritt für Schritt |
| `config` | `toggles[]`, `solution[]`, `requirements[]`, optional `nodes`/`links` | Baukasten (VPC, Hub-and-Spoke …) |

Immer: `id` (eindeutig im Level), `prompt`, `explanation` (warum richtig), `difficulty` 1–3.
Bei falschen Optionen **immer `whyWrong`** angeben (der Test meldet fehlende). Wo es hilft: `analogy`.
Optional: `certs` (Frage nur für diese Zertifikate, wird vom Zertifikats-Fokus gefiltert), `domain` (Prüfungsbereich).

**IDs nie umbenennen oder wiederverwenden.** Der Wiederholen-Stapel und die Fehlerstatistik speichern `levelId/questionId`. Gelöschte Fragen werden still übersprungen.

### Neuer Generator

Id in `GeneratorId` (types) und `generatorNames` ergänzen, Funktion in `lib/generators.ts`. Sie liefert `prompt`, `fields` (mit `answer`, optional `options`, `kind`, `tolerance`) und `explanation`. Der Test in `generators.test.ts` prüft automatisch 200 Zufallsaufgaben pro Generator. Für die Auswertungslogik zusätzlich einen festen Testfall schreiben.

## Inhalts-Regeln

- Fachlich korrekt und aktuell. Lieber eine Frage weniger als eine falsche. Prüfungsnummern und -bereiche zentral in `certs.ts`.
- Deutsch, Fachbegriffe beim ersten Auftreten zusätzlich Englisch (z. B. „Subnetzmaske (subnet mask)“ oder in `terms`).
- Aktuelle Produktnamen (Microsoft Entra ID statt Azure AD, ggf. alten Namen in Klammern).
- Antwortoptionen werden gemischt: keine „Alle oben genannten“ oder positionsabhängigen Optionen.
- Preise nur als gekennzeichnete Beispielwerte (`prices.ts`), nie als aktuelle Listenpreise.
- `RichText` kann: Absätze (Leerzeile), `- `-Listen (eingerückt = Unterpunkt), `|`-Tabellen, ```-Code-Blöcke, `` `code` ``, `**fett**`.

## Coding-Konventionen

- Inhalte strikt in `src/content/`, Logik in `src/lib/` (rein, testbar), UI in `components/`/`pages/`.
- Fortschritt nur über reine Funktionen in `lib/progress.ts` ändern: `update((p) => fn(p))`. Kein direkter `localStorage`-Zugriff für Fortschritt außerhalb von `ProgressContext.tsx` (Ausnahme: der gerätebezogene Erinnerungs-Merker in `reminder.ts`).
- Neue **optionale** Felder in `Progress` bekommen einen Standardwert in `emptyProgress()`. Das reicht für alte Exporte. Bei inkompatiblen Änderungen `version` erhöhen und in `parseImport` migrieren.
- Neuer Fragetyp: Typ in `types/content.ts`, Component in `components/questions/`, Case + Label in `QuestionRenderer.tsx`, Validierung in `content.test.ts`.
- Tailwind-Utility-Klassen direkt im JSX, dunkles Theme (slate/cyan). Mobile first, keine horizontale Scrollbar bei 375 px.
- Keine neuen Dependencies ohne Grund.

## Spielregeln (Kurzreferenz)

- Bestanden = Quiz ≥ 80 % **und** Boss bestanden (≥ 80 % und mindestens 1 Herz übrig). Erst dann ist das nächste Level im selben Track offen. Level 1 jedes Tracks ist immer offen.
- XP: 10 pro erstmals richtige Antwort, danach 2 (gegen XP-Farming, im Wiederholen-Stapel weiter 10), 5 pro Lektion, 50 pro Boss-Sieg, +25 ohne Herzverlust, 20 pro abgeschlossenem Lab, 2 pro Trainer-Aufgabe. Spielerlevel L ab 50·L·(L−1) XP.
- Leitner: Eine falsche Antwort kommt in Box 1 (fällig morgen). Eine richtige Antwort im Review rückt eine Box weiter (1/3/7/14/30 Tage). Nach Box 5 gilt die Frage als gemeistert.
