# Ideen & Verbesserungsvorschläge

## Umsetzungsstand (2026-11-01, Schritt 10)

Alle 35 Ideen aus den Schritten 1–9 sind eingebaut: Mechanik plus Beispielinhalte in den vorhandenen Leveln. Vereinfachungen gegenüber der Idee:

| Idee | Umsetzung | Vereinfacht / offen |
|---|---|---|
| 1–3/1 XP-Bremse | erneut richtige Antworten 2 statt 10 XP | – |
| 1–3/2 Trainer + VLSM | Seite `/trainer`, 20 Aufgabentypen, Bestzeit | Präfixbereich nicht wählbar (fest /16–/30) |
| 1–3/3 interaktive Lektionen | `check`, `diagram` (4 Diagramme) | Verständnisfragen erst in 5 Abschnitten |
| 1–3/4 Prüfungssimulation | `/exam`, Zeitlimit, Auswertung nach `domains` | Domains meist pro Level, nur einzelne Fragen eigens getaggt |
| 1–3/5 PWA + Erinnerung | vite-plugin-pwa, Icons, Notification | Erinnerung nur bei geöffneter App (kein Push-Server) |
| B2/1 Reihenfolge | Fragetyp `ordering` (▲/▼) | – |
| B2/2 Kostenaufgaben | Generatoren `cost-vm`, `cost-sla` | – |
| B2/3 Glossar | `/glossary`, automatisch aus `terms` | – |
| B2/4 Labs | `lab` je Level, Checkliste, +20 XP | in 7 von 10 Leveln |
| B2/5 Fehlerstatistik | Profil: pro Level und Fragetyp, Empfehlung | – |
| B3/1 NSG-Simulator | Generator `nsg` | nur eingehend, nur TCP |
| B3/2 Hierarchie/RBAC | Generator `rbac` mit Baum und Sperren | Baum wird angezeigt, nicht selbst gebaut |
| B3/3 Portal-Hinweise | `portal` bei CLI-Fragen | bei 8 Fragen |
| B3/4 Zertifikats-Fokus | Profil-Einstellung, Fragen mit `certs` | nur in B3 getaggt |
| B3/5 Quellen | `sources` je Abschnitt | in ausgewählten Abschnitten |
| A5/1–2 IPv6-Trainer + Normalisierung | 6 IPv6-Generatoren, `lib/ipv6.ts` | – |
| A5/3 NDP-Animation | Schritt-Animation `ndp-slaac` | eigene Animation statt auf der Topologie-Ansicht |
| A5/4 Vergleichskarten | `compare` (IPv4↔IPv6, Azure↔AWS) | – |
| A5/5 Häufige Fehler | Box im Level-Überblick (`wrongTotal`) | – |
| B4/1 Code-Blöcke | ``` in RichText | – |
| B4/2 IAM-Auswerter | Generator `iam` | gleiches Konto, keine Permission Boundaries |
| B4/3 VPC-Baukasten | Fragetyp `config` | Schalter statt editierbarer Kanten |
| B4/4 Prüfungsdomänen | `certs.ts` domains, `Level.domains`, `domain` | siehe 1–3/4 |
| B4/5 Playwright | `npm run test:e2e` | – |
| A6/1 STP-Simulator | Generator `stp` mit Topologie | Root Bridge + ein Root Port per Auswahl, keine anklickbaren Ports |
| A6/2 CLI-Sessions | mehrzeiliges `cli`-Template (Beispiel in A6) | – |
| A6/3 show-Ausgaben | Code-Blöcke in `scenario` (2 Beispiele) | – |
| A6/4 Fehlersuche-Kette | Fragetyp `chain` mit `next` | Beispiel ist linear |
| A6/5 Testmodus | `?dev=unlock-all`, eigener Speicher | – |
| B5/1 Entscheidungsbaum | `/decide` | – |
| B5/2 Hub-and-Spoke-Puzzle | `config`-Frage in B5 | wie B4/3 |
| B5/3 Netzwerkkosten | Generator `cost-nat` | VPN vs. ExpressRoute und Regions-Traffic fehlen noch |
| B5/4 Fehler-Diagramme | 2 `topology`-Fragen in B5 | – |
| B5/5 Glossar-Verlinkung | **fette** Begriffe → Level | nur exakte Treffer auf Begriff/Abkürzung |

## Schritt 1–3: Grundgerüst + A1–A4, B1 (2026-11-01)

1. **XP-Farming begrenzen:** Quiz-Wiederholungen geben derzeit volle XP. Vorschlag: Für bereits richtig beantwortete Fragen eines bestandenen Levels nur noch 2 XP vergeben. Alternativ einen Tages-XP-Bonus nur für den ersten Durchlauf.
2. **Subnetting-Trainer als eigener Modus:** Eine Endlos-Übungsseite mit wählbarem Aufgabentyp und Präfixbereich, Zeitmessung und Bestzeit. Zusätzlich echte VLSM-Aufgaben (mehrere Netze aus einem Block planen) als neuer `subnet`-Task `vlsm`.
3. **Lektionen interaktiver machen:** Kleine „Check dein Verständnis“-Fragen zwischen den Lektionsabschnitten. Außerdem SVG-Diagramme (OSI-Stapel, Kapselung als Animation, Frame-Aufbau) statt nur Tabellen.
4. **Prüfungssimulation pro Zertifikat:** Zufällige Mischung aller Fragen, die einem Zertifikat zugeordnet sind, mit Zeitlimit und Auswertung nach Themenbereich (Exam Objectives). Dazu müsste jede Frage optional einem Prüfungsziel (z. B. „N10-009 1.4“) zugeordnet werden.
5. **PWA/Offline-Modus:** Manifest und Service Worker, damit die App am Handy installierbar ist und offline läuft. Optional eine tägliche Erinnerung für die Streak (Notification API).

## Schritt 4: B2 Virtualisierung (2026-11-01)

1. **Neuer Fragetyp „Reihenfolge“ (ordering):** Schritte in die richtige Reihenfolge bringen, z. B. Live-Migration, Kapselung, DHCP-DORA oder TCP-Handshake. Das wäre ein Drag-&-Drop-Sortieren mit `items` und `order[]`. Viele Prüfungsthemen sind Abläufe.
2. **Kostenrechner-Aufgaben mit Zufallswerten (wie der Subnetting-Generator):** z. B. „VM kostet X €/h, läuft Y h im Monat, wie viel spart Deallocate nachts?“ oder SLA-Verbund-Rechnungen. Das trainiert die AZ-900/SAA-Rechenfragen mit immer neuen Zahlen.
3. **Lektion-Glossar global:** Alle `terms` aus allen Lektionen in einer durchsuchbaren Glossar-Seite (Deutsch ↔ Englisch) sammeln, mit Link zum Level. Das ist hilfreich, weil Prüfungen nur auf Englisch verfügbar sind.
4. **Labor-Anleitungen als optionaler Abschnitt:** Pro Level ein kurzes Hands-on (z. B. „Erstelle mit VirtualBox eine VM im Bridged-Modus“, „Deallocate eine Azure-VM mit der CLI“) mit Checkliste zum Abhaken (+XP). Theorie allein reicht für den Job nicht.
5. **Fehlerstatistik pro Thema:** Im Profil anzeigen, welche Fragetypen und Level die meisten Fehler haben (Daten liegen schon im Review-Stapel: `wrongCount`). Daraus folgt eine Empfehlung „Wiederhole Level X“.

## Schritt 5: B3 Microsoft Azure (2026-11-01)

1. **NSG-Simulator als Fragetyp:** Regelliste (Priorität, Quelle, Port, Allow/Deny) plus Testpaket. Der Lernende sagt vorher, ob das Paket durchkommt und welche Regel greift. Die Regeln könnten zufällig erzeugt werden, ähnlich wie beim Subnetting-Generator. Dieselbe Logik lässt sich später für AWS Security Groups/NACLs und Cisco-ACLs (A11) wiederverwenden.
2. **Hierarchie-Baum-Aufgabe:** Verwaltungsgruppe → Abonnement → Ressourcengruppe → Ressource interaktiv bauen. Danach Fragen wie „Rolle X auf Ebene Y zugewiesen: Darf Benutzer Z Ressource W löschen?“. Das trainiert Vererbung, RBAC und Sperren zusammen.
3. **„Portal vs. CLI“-Paare:** Zu CLI-Aufgaben optional ein kurzer Hinweis, wo man dieselbe Aktion im Azure-Portal findet. AZ-104 fragt beides ab, und im Job braucht man das Portal für den Einstieg.
4. **Zertifikats-Filter im Quiz:** Fragen bekommen optional `certs` (z. B. nur AZ-104). Ein „AZ-900-Modus“ blendet dann tiefe AZ-104-Details aus, und Einsteiger werden nicht überfordert.
5. **Verweise auf offizielle Doku pro Lektion:** Ein optionales Feld `sources: { title, url }[]` je Lektionsabschnitt (Microsoft Learn, AWS Docs). Das macht die fachliche Korrektheit prüfbar und erleichtert die Aktualisierung bei Produktänderungen (z. B. die Abkündigung des Default Outbound Access).

## Schritt 6: A5 IPv6 (2026-11-01)

1. **IPv6-Trainer als Zufallsaufgaben:** Analog zum IPv4-Generator in `lib/subnet.ts` neue `task`-Varianten: Adresse kürzen/expandieren (RFC 5952), /64-Präfix bestimmen, EUI-64 aus zufälliger MAC, Solicited-Node-Adresse, n-tes /64 aus /48 oder /56. Damit gibt es unbegrenzt Übungsmaterial für die fehleranfälligsten Rechenschritte.
2. **Freitext-Antworten mit Normalisierung:** Ein Typ „Adresse eintippen“, der IPv6-Eingaben vor dem Vergleich normalisiert (expandieren und kanonisch kürzen). Dann zählt `2001:DB8:0::1` genauso wie `2001:db8::1`. Das ist Voraussetzung für Idee 1.
3. **Paketablauf-Animation für NDP/SLAAC:** Schrittweise Darstellung RS → RA → DAD (NS) → Adresse aktiv, auf der bestehenden Topologie-Ansicht mit animierten Paketen. Abläufe bleiben so deutlich besser hängen als Tabellen.
4. **Vergleichs-Karten IPv4 ↔ IPv6:** Eine wiederverwendbare Lektions-Komponente „Gegenüberstellung“ (ARP ↔ NDP, Broadcast ↔ Multicast, DHCP ↔ SLAAC/DHCPv6, TTL ↔ Hop Limit) mit Flip-Karten. Sie lässt sich später auch für Azure ↔ AWS (B3/B4) nutzen.
5. **„Häufige Fehler“-Box pro Level:** Aus den Review-Daten aller Fragen eines Levels die 3 meistverfehlten Fragen im Level-Überblick anzeigen, z. B. das EUI-64-Bit-Flip. Das braucht keine neuen Daten, nur eine Auswertung von `review[...].wrongCount`.

## Schritt 7: B4 AWS (2026-11-01)

1. **Code-Blöcke in RichText:** Mehrzeilige Blöcke mit ``` für JSON-Policies, Bicep/Terraform und Skripte, mit Monospace-Schrift und horizontalem Scrollen. Bisher passt eine IAM-Policy nur einzeilig in Inline-Code. Spätestens für B8 (IaC) und A13 (Python/Ansible) wird das nötig.
2. **IAM-Policy-Auswerter als Fragetyp:** 2–3 Policies (Identity, Bucket Policy, SCP) plus eine API-Anfrage. Der Lernende entscheidet „Allow oder Deny und warum“. Die Auswertungslogik (explizites Deny > Allow > implizites Deny) ist klein und gut testbar. Gemeinsam mit dem NSG-Simulator (Idee B3/1) entstünde ein „Zugriffsentscheidungs“-Trainer.
3. **VPC-Baukasten:** Eine Topologie-Aufgabe, bei der man Subnetze in AZs anordnet und Route Tables zuweist (IGW/NAT/local). Danach wird automatisch geprüft, ob die Anforderungen erfüllt sind (öffentlich/privat, AZ-redundant). Dazu muss `topology` um bearbeitbare Kanten erweitert werden.
4. **Zertifikats-Prüfungsdomänen:** Fragen optional einer Prüfungsdomäne von SAA-C03 zuordnen (Secure, Resilient, High-Performing, Cost-Optimized Architectures). Im Profil steht dann der Fortschritt pro Domäne, und der Lernende sieht, wo noch Lücken sind.
5. **Visuelle Regression für Handybreite:** Ein kleiner Test, der alle Lektionen mit Playwright bei 375 px rendert und `scrollWidth > innerWidth` meldet. Der Überlauf durch lange Inline-Codes ist erst beim manuellen Test aufgefallen. Das wäre die erste neue Dev-Dependency, deshalb vorher abwägen.

## Schritt 8: A6 Switching (2026-11-01)

1. **STP-Simulator als Zufallsaufgabe:** Zufällige Topologie aus 3–5 Switches mit Prioritäten, MACs und Link-Geschwindigkeiten generieren. Der Lernende bestimmt Root Bridge, Root Ports und blockierte Ports. Dafür braucht `topology` anklickbare **Links/Ports** statt nur Knoten. Das ist auch für den VPC-Baukasten (Idee B4/3) nötig.
2. **Mehrzeilige CLI-Sessions mit Kontextwechsel:** Aufgaben über mehrere Prompts hinweg (`SW1#` → `conf t` → `SW1(config)#` → `interface …`), bei denen auch die Moduswechsel abgefragt werden. Typischer CCNA-Fehler: der richtige Befehl im falschen Modus.
3. **„show“-Ausgaben interpretieren:** Ein Fragetyp mit realistischer Ausgabe (`show interfaces trunk`, `show spanning-tree`, `show etherchannel summary`) als Monospace-Block. Die Frage bezieht sich auf die Ausgabe („Welches VLAN fehlt auf dem Trunk?“). Das ist sehr prüfungs- und praxisnah und baut auf Idee B4/1 (Code-Blöcke) auf.
4. **Fehlersuche-Szenarien als Kette:** 3–4 aufeinanderfolgende Fragen zu einem Störungsfall (Symptom → erste Prüfung → Befund → Lösung), wobei jede Antwort die nächste Frage bestimmt. Das ist eine Vorstufe für A14 (Troubleshooting) und übt die Methodik statt Einzelwissen.
5. **Testdaten-Modus statt localStorage überschreiben:** Ein Entwickler-Schalter (z. B. `?dev=unlock-all` in der URL), der alle Level im Speicher freischaltet, ohne den gespeicherten Fortschritt anzufassen. Beim Testen im Browser-Pane wurde der echte Fortschritt bisher jedes Mal überschrieben.

## Schritt 9: B5 Cloud-Networking (2026-11-01)

1. **Architektur-Entscheidungsbaum:** Eine interaktive Seite „Welche Verbindung/welcher Load Balancer?“ mit Fragen wie global oder regional, Layer 4 oder 7, Internet erlaubt?, Bandbreite? Am Ende steht die empfohlene Azure- und AWS-Lösung. Das ist gleichzeitig Nachschlagewerk und Lernhilfe, die Daten passen in eine Content-Datei.
2. **Hub-and-Spoke-Routing-Puzzle:** Topologie mit Hub, Spokes und Rechenzentrum, der Lernende setzt Peering-Optionen (Gateway Transit, Use Remote Gateways) und UDRs. Die App prüft, welche Pfade danach funktionieren. Das baut auf den editierbaren Kanten aus Idee A6/1 auf.
3. **Kosten-Vergleichsaufgaben Netzwerk:** NAT-Gateway-Datenkosten vs. Gateway Endpoint, VPN vs. ExpressRoute, regionsübergreifender Traffic. Die Zahlen werden zufällig erzeugt (wie Idee B2/2), und die Preise stehen zentral in einer Datei, damit sie aktualisierbar bleiben.
4. **„Was ist hier falsch?“-Diagramme:** Eine fertige Architektur mit einem eingebauten Fehler (überlappende CIDRs, fehlende private DNS-Zone, nur ein NAT Gateway für 3 AZs). Der Lernende klickt die Fehlerstelle an. Das geht schon mit dem bestehenden `topology`-Typ im `click`-Modus.
5. **Glossar-Verlinkung im Text:** Fachbegriffe in Lektionen automatisch mit dem Level verlinken, in dem sie eingeführt wurden (z. B. „BGP“ → A7, „IPsec“ → A11). Das zeigt Zusammenhänge zwischen Netzwerk- und Cloud-Teil und nutzt das Glossar aus Idee B2/3.

## Schritt 10: alle Ideen umgesetzt (2026-11-01)

1. **Anklickbare Links/Ports in `TopologyCanvas`:** Kanten und Port-Beschriftungen als Klickziele. Damit kann der STP-Simulator auch Designated und blockierte Ports abfragen, und VPC-/Hub-and-Spoke-Baukästen lassen sich direkt im Diagramm bedienen statt über Schalterlisten.
2. **Tagesziel mit Fortschrittsring:** Ein selbst gewähltes Tagesziel (z. B. 30 XP oder 10 Fragen) mit Ring im Header. Die Streak zählt erst ab Erreichen des Ziels. Das motiviert zu regelmäßigen, kurzen Einheiten statt Marathon-Sessions.
3. **Prüfungsmodus wie echt:** Fragen markieren, frei zwischen Fragen springen und erst am Ende abgeben, ohne Sofort-Feedback. Am Schluss eine Übersicht aller Antworten mit Erklärungen. Das trainiert das Zeitmanagement realer Prüfungen.
4. **Link-Check für Quellen:** Ein Skript (`npm run check:links`), das alle `sources`-URLs per HEAD-Anfrage prüft. In CI regelmäßig laufen lassen, damit veraltete Doku-Links auffallen. Das ist wichtig, weil Microsoft und AWS URLs öfter umbauen.
5. **Spickzettel pro Level drucken:** Eine Druckansicht (Print-CSS) mit allen Tabellen, `terms` und Merksätzen eines Levels auf 1–2 Seiten, als PDF speicherbar. Nützlich zur Prüfungsvorbereitung offline und auf Papier.
