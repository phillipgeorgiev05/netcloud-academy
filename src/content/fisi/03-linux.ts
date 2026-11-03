import type { Level } from '../../types/content';

const level: Level = {
  id: 'fisi-03',
  track: 'fisi',
  order: 3,
  title: 'Linux-Administration',
  titleEn: 'Linux Administration Basics',
  summary: 'Distributionen, Verzeichnisbaum, die wichtigsten Befehle, Rechte mit rwx und Oktalzahlen, Benutzer und sudo, Pakete installieren, Dienste mit systemd steuern, Logs lesen und sicher per SSH arbeiten.',
  certs: ['fisi'],
  domains: { fisi: 'ap2-admin' },
  lab: {
    title: 'Ubuntu-Server in einer VM einrichten',
    needs: 'Hyper-V, VirtualBox oder WSL 2; ISO von Ubuntu Server LTS (kostenlos), 2 GB RAM für die VM',
    steps: [
      'Installiere Ubuntu Server in einer VM. Lege bei der Installation einen Benutzer an und wähle „Install OpenSSH server“.',
      'Melde dich an und aktualisiere das System: `sudo apt update && sudo apt upgrade -y`.',
      'Lege einen Benutzer und eine Gruppe an: `sudo adduser anna`, `sudo groupadd vertrieb`, `sudo usermod -aG vertrieb anna`. Prüfe mit `id anna`.',
      'Lege `/srv/vertrieb` an, gib es der Gruppe und setze Rechte: `sudo mkdir /srv/vertrieb`, `sudo chown root:vertrieb /srv/vertrieb`, `sudo chmod 770 /srv/vertrieb`. Prüfe mit `ls -ld /srv/vertrieb`.',
      'Installiere einen Webserver und steuere ihn: `sudo apt install nginx`, `systemctl status nginx`, `sudo systemctl stop nginx`, `sudo systemctl enable --now nginx`. Prüfe mit `ss -tulpn`, dass Port 80 lauscht.',
      'Erzeuge auf deinem PC einen SSH-Schlüssel (`ssh-keygen -t ed25519`), kopiere ihn mit `ssh-copy-id anna@<IP>` auf die VM und melde dich ohne Passwort an.',
      'Aufräumen: VM herunterfahren (`sudo poweroff`) und löschen, wenn du sie nicht mehr brauchst.',
    ],
  },
  lesson: [
    {
      heading: 'Linux, Distributionen und der Verzeichnisbaum',
      body: `**Linux** ist streng genommen nur der **Kernel**, der Kern des Betriebssystems. Zusammen mit Werkzeugen, Paketverwaltung und Installationsprogramm entsteht eine **Distribution**:
| Familie | Beispiele | Paketverwaltung |
|---|---|---|
| Debian | **Debian**, **Ubuntu** | \`apt\` (.deb) |
| Red Hat | **RHEL**, Rocky Linux, AlmaLinux, Fedora | \`dnf\` (.rpm) |

Auf Servern läuft Linux fast immer **ohne grafische Oberfläche**. Verwaltet wird in der **Shell** (meist **Bash**), lokal oder per **SSH**.

Unter Linux gibt es keine Laufwerksbuchstaben. Alles hängt in **einem Baum** unter **/** (Wurzel, root). Datenträger werden in Ordner **eingehängt** (mount). Die wichtigsten Ordner (nach dem Filesystem Hierarchy Standard):
| Ordner | Inhalt |
|---|---|
| \`/etc\` | **Konfigurationsdateien** (Textdateien) |
| \`/home\` | Heimatverzeichnisse der Benutzer (\`/home/anna\`) |
| \`/root\` | Heimatverzeichnis des Benutzers root |
| \`/var/log\` | **Logdateien** |
| \`/bin\`, \`/usr/bin\` | Programme |
| \`/tmp\` | temporäre Dateien |
| \`/dev\` | Geräte, z. B. Festplatte \`/dev/sda\` |
| \`/proc\` | virtuelle Infos über Prozesse und Kernel |

**Groß- und Kleinschreibung zählt:** \`Datei.txt\` und \`datei.txt\` sind zwei verschiedene Dateien. Dateien, deren Name mit einem Punkt beginnt (\`.bashrc\`), sind versteckt.

**Pfade:** absolut ab \`/\` (\`/etc/ssh/sshd_config\`) oder relativ zum aktuellen Ordner (\`../log\`). \`~\` ist dein Heimatverzeichnis, \`.\` der aktuelle Ordner, \`..\` der übergeordnete.`,
      analogy: 'Windows hat mehrere Schränke (C:, D:, E:). Linux hat einen einzigen großen Schrank mit Fächern. Ein neuer Datenträger wird nicht als neuer Schrank aufgestellt, sondern als Schublade in ein Fach eingeschoben.',
      terms: [
        { de: 'Kernel (Betriebssystemkern)', en: 'kernel' },
        { de: 'Distribution', en: 'distribution (distro)' },
        { de: 'Eingabeaufforderung/Shell', en: 'shell' },
        { de: 'einhängen', en: 'mount' },
        { de: 'Heimatverzeichnis', en: 'home directory' },
      ],
      check: {
        id: 'c1', type: 'single', difficulty: 1,
        prompt: 'Wo suchst du auf einem Linux-Server die Konfiguration des SSH-Dienstes?',
        options: [
          { id: 'a', text: 'Unter `/etc` (z. B. `/etc/ssh/sshd_config`)' },
          { id: 'b', text: 'Unter `/var/log`', whyWrong: 'In `/var/log` liegen Logdateien, also Protokolle darüber, was passiert ist. Die Einstellungen eines Dienstes liegen als Textdateien in `/etc`.' },
          { id: 'c', text: 'In der Registry', whyWrong: 'Eine Registry gibt es nur unter Windows. Linux speichert Einstellungen in lesbaren Textdateien, fast immer unter `/etc`.' },
          { id: 'd', text: 'Unter `/home`', whyWrong: 'In `/home` liegen die persönlichen Dateien der Benutzer. Systemweite Dienste wie SSH werden in `/etc` konfiguriert.' },
        ],
        correct: 'a',
        explanation: '`/etc` enthält die systemweiten Konfigurationsdateien, z. B. `/etc/ssh/sshd_config`, `/etc/hosts`, `/etc/fstab`.',
      },
      sources: [{ title: 'Linux Foundation – Filesystem Hierarchy Standard 3.0', url: 'https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html' }],
    },
    {
      heading: 'Die wichtigsten Befehle',
      body: `| Befehl | macht |
|---|---|
| \`pwd\` | zeigt, in welchem Ordner du bist |
| \`ls -la\` | listet Dateien, auch versteckte, mit Rechten |
| \`cd /etc\` | wechselt den Ordner |
| \`cp a b\` / \`mv a b\` | kopiert / verschiebt oder benennt um |
| \`rm datei\` / \`rm -r ordner\` | löscht (**ohne Papierkorb!**) |
| \`mkdir ordner\` | legt einen Ordner an |
| \`cat\`, \`less\` | zeigt eine Datei an (\`less\`: blätterbar, \`q\` beendet) |
| \`tail -f /var/log/syslog\` | zeigt das Dateiende und neue Zeilen live |
| \`grep fehler datei\` | sucht Zeilen mit einem Wort |
| \`find / -name "*.conf"\` | sucht Dateien |
| \`nano\`, \`vim\` | Texteditoren |
| \`df -h\` / \`du -sh ordner\` | freier Platz der Datenträger / Größe eines Ordners |
| \`free -h\` | Arbeitsspeicher |
| \`ps aux\`, \`top\` | laufende Prozesse |
| \`kill PID\` | beendet einen Prozess (\`kill -9\` erzwingt es) |
| \`man befehl\` | Handbuch zu einem Befehl |

**Umleitungen und Pipes** verbinden Befehle:
- \`befehl > datei\` schreibt die Ausgabe in eine Datei (**überschreibt**)
- \`befehl >> datei\` **hängt an**
- \`befehl 2> fehler.txt\` leitet nur Fehlermeldungen um
- \`befehl1 | befehl2\` gibt die Ausgabe an den nächsten Befehl weiter

Beispiel: \`ps aux | grep nginx\` zeigt nur die Prozesse, in denen „nginx“ vorkommt.

**Vorsicht:** \`rm -rf\` löscht ohne Rückfrage und ohne Papierkorb, als root auch Systemdateien. Vor dem Löschen mit \`ls\` prüfen, was der Pfad wirklich enthält.`,
      terms: [
        { de: 'Umleitung', en: 'redirection' },
        { de: 'Pipe (Verkettung)', en: 'pipe' },
        { de: 'Prozess-ID', en: 'process ID (PID)' },
        { de: 'Handbuchseite', en: 'man page' },
      ],
      check: {
        id: 'c2', type: 'single', difficulty: 2,
        prompt: 'Was macht `echo "neu" > notizen.txt`, wenn `notizen.txt` schon Text enthält?',
        options: [
          { id: 'a', text: 'Der alte Inhalt wird überschrieben, danach steht nur „neu“ in der Datei.' },
          { id: 'b', text: '„neu“ wird ans Ende angehängt.', whyWrong: 'Anhängen macht `>>`. Ein einzelnes `>` leert die Datei zuerst und schreibt dann. Der alte Inhalt ist danach weg, ohne Rückfrage.' },
          { id: 'c', text: 'Es gibt eine Fehlermeldung, weil die Datei existiert.', whyWrong: 'Die Bash fragt standardmäßig nicht nach und meldet keinen Fehler. Sie überschreibt die Datei einfach. (Nur mit der Option `set -o noclobber` würde sie das verhindern.)' },
        ],
        correct: 'a',
        explanation: '`>` überschreibt, `>>` hängt an. Ein Tippfehler bei Logdateien kann so Daten löschen.',
      },
    },
    {
      heading: 'Rechte: rwx und Oktalzahlen',
      diagram: 'game-chmod',
      body: `Jede Datei hat einen **Besitzer** (user), eine **Gruppe** (group) und Rechte für **alle anderen** (others). Für jede dieser drei gibt es drei Rechte:
| Recht | bei Dateien | bei Ordnern | Wert |
|---|---|---|---|
| **r** (read) | lesen | Inhalt auflisten | 4 |
| **w** (write) | ändern | Dateien darin anlegen, löschen, umbenennen | 2 |
| **x** (execute) | als Programm ausführen | hineinwechseln (\`cd\`) | 1 |

\`ls -l\` zeigt das so:
\`\`\`
-rwxr-x---  1 anna vertrieb  2048  bericht.sh
\`\`\`
Das erste Zeichen ist der Typ (\`-\` Datei, \`d\` Ordner, \`l\` Link). Dann kommen je drei Zeichen für **Besitzer** (\`rwx\`), **Gruppe** (\`r-x\`) und **andere** (\`---\`).

**Oktalschreibweise:** Pro Dreiergruppe addiert man die Werte: rwx = 4+2+1 = **7**, r-x = 4+1 = **5**, rw- = 4+2 = **6**, r-- = **4**.
| Oktal | Bedeutung | typisch für |
|---|---|---|
| **755** | rwxr-xr-x | Programme, Ordner |
| **644** | rw-r--r-- | normale Dateien |
| **700** / **600** | nur Besitzer | private Ordner / Dateien, z. B. SSH-Schlüssel |
| **770** | Besitzer und Gruppe alles, andere nichts | Gruppenordner |

**Befehle:**
- \`chmod 640 datei\` oder symbolisch \`chmod g+w datei\`, \`chmod o-r datei\`
- \`chown anna:vertrieb datei\` ändert Besitzer und Gruppe
- \`chmod -R\` bzw. \`chown -R\` wirkt auf alle Unterordner

**root** (Benutzer-ID 0) darf alles, Rechte gelten für ihn nicht. Auf \`/tmp\` liegt das **Sticky Bit** (\`drwxrwxrwt\`): Jeder darf dort schreiben, aber nur eigene Dateien löschen.

**Faustregel:** Niemals \`chmod 777\`, um ein Problem „schnell“ zu lösen. Dann darf jeder Benutzer und jeder kompromittierte Dienst die Datei ändern.`,
      analogy: 'Die drei Dreiergruppen sind wie drei Schlüsselbunde für eine Wohnung: einer für die Mieterin (Besitzer), einer für die Familie (Gruppe), einer für Fremde (andere). Jeder Bund hat bis zu drei Schlüssel: anschauen, verändern, benutzen.',
      terms: [
        { de: 'Besitzer', en: 'owner (user)' },
        { de: 'Dateiberechtigung', en: 'file permission' },
        { de: 'Oktalschreibweise', en: 'octal notation' },
        { de: 'Sticky Bit', en: 'sticky bit' },
      ],
      check: {
        id: 'c3', type: 'single', difficulty: 2,
        prompt: 'Welche Rechte bedeutet `chmod 750 skript.sh`?',
        options: [
          { id: 'a', text: 'Besitzer: lesen, schreiben, ausführen. Gruppe: lesen, ausführen. Andere: nichts.' },
          { id: 'b', text: 'Besitzer: alles. Gruppe: lesen, schreiben. Andere: nichts.', whyWrong: 'Die mittlere Ziffer 5 ist 4+1, also Lesen und Ausführen. Lesen und Schreiben wäre 4+2 = 6.' },
          { id: 'c', text: 'Alle dürfen alles außer löschen.', whyWrong: 'Die letzte Ziffer 0 bedeutet: Andere haben gar keine Rechte. Löschen ist in Linux außerdem kein Recht an der Datei selbst, sondern Schreibrecht am Ordner.' },
          { id: 'd', text: 'Besitzer: lesen, ausführen. Gruppe: alles. Andere: nichts.', whyWrong: 'Die Ziffern stehen in der Reihenfolge Besitzer, Gruppe, andere. 7 gehört also zum Besitzer, 5 zur Gruppe.' },
        ],
        correct: 'a',
        explanation: '7 = rwx (Besitzer), 5 = r-x (Gruppe), 0 = --- (andere).',
      },
      sources: [{ title: 'man7.org – chmod(1)', url: 'https://man7.org/linux/man-pages/man1/chmod.1.html' }],
    },
    {
      heading: 'Benutzer, Gruppen und sudo',
      body: `Benutzer und Gruppen stehen in Textdateien:
| Datei | Inhalt | lesbar für |
|---|---|---|
| \`/etc/passwd\` | Benutzername, UID, Gruppe, Heimatverzeichnis, Shell | alle |
| \`/etc/shadow\` | **Passwort-Hashes**, Ablaufdaten | nur root |
| \`/etc/group\` | Gruppen und ihre Mitglieder | alle |

Eine Zeile aus \`/etc/passwd\`:
\`\`\`
anna:x:1001:1001:Anna Schulz:/home/anna:/bin/bash
\`\`\`
Das \`x\` heißt: Das Passwort steht (als Hash) in \`/etc/shadow\`.

**Befehle:**
- \`adduser anna\` (Debian/Ubuntu, fragt alles ab) bzw. \`useradd -m anna\` (überall)
- \`passwd anna\` setzt das Passwort
- \`usermod -aG vertrieb anna\` nimmt Anna **zusätzlich** in die Gruppe auf. **Ohne \`-a\`** ersetzt \`-G\` alle bisherigen Zusatzgruppen.
- \`id anna\` zeigt UID und Gruppen
- \`userdel -r anna\` löscht den Benutzer samt Heimatverzeichnis

**root und sudo:** Man arbeitet nicht dauerhaft als root. Stattdessen setzt man **\`sudo\`** vor einzelne Befehle, die Adminrechte brauchen. Wer \`sudo\` darf, regelt \`/etc/sudoers\` (bearbeiten nur mit \`visudo\`). Meist reicht es, den Benutzer in die Gruppe **sudo** (Debian/Ubuntu) bzw. **wheel** (Red Hat) aufzunehmen. Jeder \`sudo\`-Aufruf wird protokolliert, und man sieht, wer was getan hat.`,
      terms: [
        { de: 'Benutzer-ID', en: 'user ID (UID)' },
        { de: 'Passwort-Hash', en: 'password hash' },
        { de: 'Superuser', en: 'root' },
        { de: 'Befehl mit Adminrechten ausführen', en: 'sudo' },
      ],
      check: {
        id: 'c4', type: 'single', difficulty: 2,
        prompt: 'Anna ist in den Gruppen `vertrieb` und `messe`. Ein Admin tippt `sudo usermod -G sudo anna`. Was passiert?',
        options: [
          { id: 'a', text: 'Anna ist danach nur noch in `sudo`, `vertrieb` und `messe` sind weg.' },
          { id: 'b', text: 'Anna ist danach in `vertrieb`, `messe` und `sudo`.', whyWrong: 'Genau das wäre mit `-aG` passiert. Ohne `-a` (append) ersetzt `-G` die komplette Liste der Zusatzgruppen. Ein häufiger Fehler, der Benutzern plötzlich Zugriffe nimmt.' },
          { id: 'c', text: 'Der Befehl schlägt fehl, weil `-a` fehlt.', whyWrong: 'Der Befehl ist gültig und läuft ohne Warnung durch. Gerade deshalb ist er tückisch: Er ersetzt still alle Zusatzgruppen.' },
        ],
        correct: 'a',
        explanation: '`usermod -G` setzt die Zusatzgruppen neu. Zum Hinzufügen immer `usermod -aG gruppe benutzer`.',
      },
    },
    {
      heading: 'Pakete, Dienste und Logs',
      body: `**Software installieren** mit der Paketverwaltung. Sie lädt aus geprüften Quellen (Repositories) und löst Abhängigkeiten automatisch auf:
| Debian/Ubuntu | Red Hat | macht |
|---|---|---|
| \`apt update\` | (automatisch) | Paketlisten neu laden, **installiert nichts** |
| \`apt upgrade\` | \`dnf upgrade\` | alle Pakete aktualisieren |
| \`apt install nginx\` | \`dnf install nginx\` | Paket installieren |
| \`apt remove nginx\` | \`dnf remove nginx\` | Paket entfernen |

**Dienste** (Hintergrundprogramme, „Daemons“) steuert auf fast allen Distributionen **systemd** mit \`systemctl\`:
| Befehl | macht |
|---|---|
| \`systemctl status nginx\` | läuft er? letzte Logzeilen |
| \`systemctl start\` / \`stop\` / \`restart nginx\` | jetzt starten / stoppen / neu starten |
| \`systemctl reload nginx\` | Konfiguration neu lesen ohne Unterbrechung |
| \`systemctl enable nginx\` | **beim Booten** automatisch starten |
| \`systemctl enable --now nginx\` | beides: jetzt starten und beim Booten |

**Wichtig:** \`start\` gilt nur bis zum nächsten Neustart. \`enable\` allein startet den Dienst nicht sofort.

**Logs:**
- \`journalctl -u nginx\` zeigt die Logs eines Dienstes, \`-f\` live, \`-b\` seit dem letzten Boot
- klassische Logdateien in \`/var/log\` (z. B. \`syslog\` bzw. \`messages\`, \`auth.log\` für Anmeldungen)

**Netzwerk prüfen:**
- \`ip a\` (Adressen), \`ip r\` (Routen), \`ping\`, \`ss -tulpn\` (welche Ports lauschen, mit Programm)
- Namensauflösung: \`/etc/hosts\`, DNS-Server meist über \`resolvectl status\``,
      terms: [
        { de: 'Paketquelle', en: 'repository' },
        { de: 'Abhängigkeit', en: 'dependency' },
        { de: 'Dienst (Hintergrundprogramm)', en: 'daemon / service' },
        { de: 'Systemprotokoll', en: 'system journal' },
      ],
      check: {
        id: 'c5', type: 'single', difficulty: 2,
        prompt: 'Du hast nginx mit `systemctl start nginx` gestartet. Nach einem Neustart des Servers läuft er nicht. Warum?',
        options: [
          { id: 'a', text: '`start` gilt nur bis zum Neustart. Für den Autostart fehlt `systemctl enable nginx`.' },
          { id: 'b', text: 'nginx ist beim Neustart deinstalliert worden.', whyWrong: 'Ein Neustart deinstalliert keine Pakete. nginx ist noch da, wird aber nicht automatisch gestartet, weil der Dienst nicht mit `enable` aktiviert wurde.' },
          { id: 'c', text: 'Es fehlt `apt update`.', whyWrong: '`apt update` lädt nur die Paketlisten neu. Mit dem Autostart von Diensten hat es nichts zu tun. Dafür ist `systemctl enable` da.' },
          { id: 'd', text: 'Dienste starten unter Linux grundsätzlich nie automatisch.', whyWrong: 'Doch: Jeder Dienst, der mit `systemctl enable` aktiviert ist, startet beim Booten. SSH oder cron laufen genau deshalb nach jedem Neustart.' },
        ],
        correct: 'a',
        explanation: '`enable` = beim Booten starten, `start` = jetzt starten. `enable --now` macht beides.',
      },
      sources: [{ title: 'freedesktop.org – systemctl', url: 'https://www.freedesktop.org/software/systemd/man/latest/systemctl.html' }],
    },
    {
      heading: 'SSH sicher nutzen',
      body: `**SSH** (Secure Shell, TCP-Port **22**) ist der verschlüsselte Fernzugang zu Linux-Servern: \`ssh anna@192.168.10.20\`. Auch Dateien lassen sich darüber kopieren (\`scp\`, \`sftp\`).

**Anmeldung mit Schlüssel statt Passwort:**
1. Auf deinem PC ein Schlüsselpaar erzeugen: \`ssh-keygen -t ed25519\`
2. Der **private Schlüssel** (\`~/.ssh/id_ed25519\`) bleibt auf deinem PC und verlässt ihn nie.
3. Der **öffentliche Schlüssel** (\`.pub\`) kommt auf den Server, in \`~/.ssh/authorized_keys\`, z. B. mit \`ssh-copy-id anna@server\`.
4. Danach meldest du dich ohne Passwort an. Den privaten Schlüssel schützt du mit einer Passphrase.

**Server härten** in \`/etc/ssh/sshd_config\`:
\`\`\`
PermitRootLogin no
PasswordAuthentication no
\`\`\`
Danach \`sudo systemctl reload ssh\` (unter Red Hat heißt der Dienst \`sshd\`).

**Vorsicht beim Aussperren:** Bevor du \`PasswordAuthentication no\` setzt, musst du prüfen, dass die Anmeldung per Schlüssel funktioniert. Die bestehende Sitzung lässt du offen und testest in einer zweiten.

Weitere Grundregeln: Updates regelmäßig einspielen, eine Firewall (\`ufw\` bzw. \`firewalld\`) nur nötige Ports öffnen lassen, Anmeldeversuche in \`/var/log/auth.log\` bzw. per \`journalctl\` überwachen.`,
      analogy: 'Der öffentliche Schlüssel ist wie ein Vorhängeschloss, das du dem Server gibst. Nur dein privater Schlüssel passt dazu. Das Schloss darf jeder sehen, den Schlüssel gibst du nie aus der Hand.',
      terms: [
        { de: 'Schlüsselpaar', en: 'key pair' },
        { de: 'privater / öffentlicher Schlüssel', en: 'private / public key' },
        { de: 'Härtung', en: 'hardening' },
      ],
      check: {
        id: 'c6', type: 'single', difficulty: 2,
        prompt: 'Welcher Schlüssel kommt beim Einrichten der SSH-Schlüsselanmeldung auf den Server?',
        options: [
          { id: 'a', text: 'Der öffentliche Schlüssel (`id_ed25519.pub`) in `~/.ssh/authorized_keys`' },
          { id: 'b', text: 'Der private Schlüssel (`id_ed25519`)', whyWrong: 'Der private Schlüssel ist dein Ausweis und bleibt immer auf deinem PC. Wer ihn hat, kann sich als du anmelden. Auf den Server kommt nur der öffentliche Teil.' },
          { id: 'c', text: 'Beide Schlüssel', whyWrong: 'Der Server braucht nur den öffentlichen Schlüssel, um zu prüfen, dass du den passenden privaten besitzt. Den privaten Schlüssel zu kopieren würde das Verfahren unsicher machen.' },
        ],
        correct: 'a',
        explanation: 'Der Server kennt den öffentlichen Schlüssel. Bei der Anmeldung beweist dein PC mit dem privaten Schlüssel, dass er zum öffentlichen passt.',
      },
      sources: [{ title: 'OpenBSD – sshd_config(5)', url: 'https://man.openbsd.org/sshd_config' }],
    },
  ],
  quiz: [
    {
      id: 'q1', type: 'single', difficulty: 1,
      prompt: 'Welcher Befehl installiert unter Ubuntu ein Paket?',
      options: [
        { id: 'a', text: '`sudo apt install paket`' },
        { id: 'b', text: '`sudo apt update paket`', whyWrong: '`apt update` lädt nur die Paketlisten aus den Repositories neu und nimmt kein Paket als Argument. Installiert wird mit `apt install`.' },
        { id: 'c', text: '`sudo dnf install paket`', whyWrong: '`dnf` ist die Paketverwaltung der Red-Hat-Familie (RHEL, Rocky, Fedora). Ubuntu gehört zur Debian-Familie und nutzt `apt`.' },
        { id: 'd', text: '`sudo systemctl install paket`', whyWrong: '`systemctl` steuert Dienste (starten, stoppen, aktivieren). Software installieren kann es nicht. Das macht die Paketverwaltung.' },
      ],
      correct: 'a',
      explanation: 'Debian/Ubuntu: `apt install`, Red Hat: `dnf install`.',
    },
    {
      id: 'q2', type: 'dragdrop', difficulty: 1,
      prompt: 'Was liegt in welchem Ordner?',
      items: [
        { id: 'conf', text: 'Konfiguration des Webservers' },
        { id: 'log', text: 'Anmeldeprotokoll auth.log' },
        { id: 'home', text: 'Dokumente von Anna' },
        { id: 'disk', text: 'erste Festplatte sda' },
      ],
      buckets: [
        { id: 'etc', label: '/etc' },
        { id: 'var', label: '/var/log' },
        { id: 'h', label: '/home' },
        { id: 'dev', label: '/dev' },
      ],
      solution: { conf: 'etc', log: 'var', home: 'h', disk: 'dev' },
      explanation: '/etc Konfiguration, /var/log Logs, /home Benutzerdaten, /dev Geräte.',
    },
    {
      id: 'q3', type: 'single', difficulty: 2,
      prompt: '`ls -l` zeigt `-rw-r----- 1 anna vertrieb 512 umsatz.csv`. Was darf ein Benutzer, der weder Anna noch in `vertrieb` ist?',
      options: [
        { id: 'a', text: 'Nichts' },
        { id: 'b', text: 'Lesen', whyWrong: 'Lesen darf nur die Gruppe `vertrieb` (mittlere Dreiergruppe `r--`). Für alle anderen steht die letzte Dreiergruppe `---`, also gar kein Recht.' },
        { id: 'c', text: 'Lesen und schreiben', whyWrong: '`rw-` steht nur beim Besitzer Anna, ganz vorne. Die letzte Dreiergruppe für andere ist `---`.' },
        { id: 'd', text: 'Ausführen', whyWrong: 'In keiner der drei Gruppen steht ein `x`. Ausführen darf also niemand, und andere dürfen gar nichts.' },
      ],
      correct: 'a',
      explanation: 'Besitzer `rw-`, Gruppe `r--`, andere `---`. Oktal: 640.',
    },
    {
      id: 'q4', type: 'single', difficulty: 2,
      prompt: 'Welche Oktalzahl entspricht `rwxr-xr-x`?',
      options: [
        { id: 'a', text: '755' },
        { id: 'b', text: '777', whyWrong: '777 wäre `rwxrwxrwx`, also auch Schreibrecht für Gruppe und andere. Hier haben Gruppe und andere nur `r-x` = 4+1 = 5.' },
        { id: 'c', text: '644', whyWrong: '644 ist `rw-r--r--`, ohne jedes Ausführrecht. Hier hat jeder ein `x`, und der Besitzer hat `rwx` = 7.' },
        { id: 'd', text: '711', whyWrong: '1 bedeutet nur `--x`. Gruppe und andere haben hier aber `r-x`, also zusätzlich Lesen: 4+1 = 5.' },
      ],
      correct: 'a',
      explanation: 'rwx = 7, r-x = 5, r-x = 5. Typisch für Programme und Ordner.',
    },
    {
      id: 'q5', type: 'cli', shell: 'linux', difficulty: 2,
      prompt: 'Der private SSH-Schlüssel soll nur für den Besitzer lesbar und schreibbar sein. Setze die Rechte in Oktalschreibweise.',
      template: '$ chmod {{0}} ~/.ssh/id_ed25519',
      blanks: [{ accept: ['600'] }],
      explanation: '600 = `rw-------`. SSH verweigert private Schlüssel, die andere lesen können.',
    },
    {
      id: 'q6', type: 'cli', shell: 'linux', difficulty: 2,
      prompt: 'Nimm `anna` **zusätzlich** in die Gruppe `vertrieb` auf, ohne ihre anderen Gruppen zu entfernen.',
      template: '$ sudo usermod {{0}} vertrieb anna',
      blanks: [{ accept: ['-aG', '-a -G', '--append --groups', '-Ga'] }],
      explanation: '`-a` (append) fügt hinzu. Ohne `-a` ersetzt `-G` alle Zusatzgruppen.',
    },
    {
      id: 'q7', type: 'single', difficulty: 2,
      prompt: 'Wo stehen unter Linux die Passwort-Hashes der Benutzer?',
      options: [
        { id: 'a', text: '`/etc/shadow`' },
        { id: 'b', text: '`/etc/passwd`', whyWrong: 'Früher standen sie dort. Weil `/etc/passwd` für alle lesbar sein muss (Programme brauchen Namen und UIDs), wurden die Hashes nach `/etc/shadow` verschoben, das nur root lesen darf. In `/etc/passwd` steht heute nur ein `x`.' },
        { id: 'c', text: '`/etc/group`', whyWrong: '`/etc/group` enthält Gruppen und ihre Mitglieder, keine Benutzerpasswörter.' },
        { id: 'd', text: '`/home/benutzer/.password`', whyWrong: 'Eine solche Datei gibt es nicht. Passwörter liegen zentral und nur für root lesbar in `/etc/shadow`, damit kein Benutzer die Hashes anderer sieht.' },
      ],
      correct: 'a',
      explanation: '`/etc/shadow` ist nur für root lesbar. So können normale Benutzer die Hashes nicht stehlen und offline knacken.',
    },
    {
      id: 'q8', type: 'single', difficulty: 2,
      prompt: 'Warum arbeitet man nicht dauerhaft als root, sondern nutzt `sudo`?',
      options: [
        { id: 'a', text: 'Fehler und Schadsoftware haben nur bei bewusst erhöhten Befehlen volle Rechte, und jeder sudo-Aufruf wird protokolliert.' },
        { id: 'b', text: 'Weil root langsamer ist', whyWrong: 'Befehle laufen als root genauso schnell. Es geht um Sicherheit: Ein Tippfehler oder ein schädliches Skript kann als root das ganze System zerstören.' },
        { id: 'c', text: 'Weil root keine Dateien löschen darf', whyWrong: 'Im Gegenteil: root darf alles, auch Systemdateien löschen. Genau deshalb ist dauerhaftes Arbeiten als root gefährlich.' },
        { id: 'd', text: 'Weil sudo kein Passwort braucht', whyWrong: 'sudo fragt standardmäßig nach dem Passwort des Benutzers (und merkt es sich einige Minuten). Der Vorteil ist nicht Bequemlichkeit, sondern Kontrolle und Nachvollziehbarkeit.' },
      ],
      correct: 'a',
      explanation: 'Least Privilege: Adminrechte nur für den einen Befehl, der sie braucht. Dazu ist nachvollziehbar, wer was getan hat.',
    },
    {
      id: 'q9', type: 'dragdrop', difficulty: 2,
      prompt: 'Welcher `systemctl`-Befehl passt?',
      items: [
        { id: 'now', text: 'Dienst jetzt starten' },
        { id: 'boot', text: 'Dienst beim Booten automatisch starten' },
        { id: 'conf', text: 'Konfiguration neu einlesen ohne Unterbrechung' },
        { id: 'check', text: 'prüfen, ob der Dienst läuft' },
      ],
      buckets: [
        { id: 'start', label: 'start' },
        { id: 'enable', label: 'enable' },
        { id: 'reload', label: 'reload' },
        { id: 'status', label: 'status' },
      ],
      solution: { now: 'start', boot: 'enable', conf: 'reload', check: 'status' },
      explanation: '`start` jetzt, `enable` beim Booten, `reload` Konfiguration neu lesen, `status` Zustand und letzte Logs.',
    },
    {
      id: 'q10', type: 'cli', shell: 'linux', difficulty: 2,
      prompt: 'Zeige die Logs des Dienstes `nginx` aus dem systemd-Journal an.',
      template: '$ journalctl {{0}}',
      blanks: [{ accept: ['-u nginx', '--unit nginx', '--unit=nginx', '-u nginx.service'] }],
      explanation: '`journalctl -u <dienst>` filtert nach einem Dienst. Mit `-f` laufen neue Zeilen live mit.',
    },
    {
      id: 'q11', type: 'single', difficulty: 2,
      prompt: 'Mit welchem Befehl siehst du, welche Programme auf welchen TCP- und UDP-Ports lauschen?',
      options: [
        { id: 'a', text: '`ss -tulpn`' },
        { id: 'b', text: '`ip a`', whyWrong: '`ip a` zeigt die Netzwerkschnittstellen und ihre IP-Adressen. Offene Ports und die Programme dahinter zeigt es nicht.' },
        { id: 'c', text: '`ping localhost`', whyWrong: '`ping` prüft per ICMP, ob ein Ziel antwortet. ICMP kennt keine Ports, über lauschende Dienste sagt es nichts.' },
        { id: 'd', text: '`df -h`', whyWrong: '`df -h` zeigt den belegten und freien Platz der Datenträger. Mit dem Netzwerk hat es nichts zu tun.' },
      ],
      correct: 'a',
      explanation: '`ss -tulpn`: t = TCP, u = UDP, l = lauschend, p = Programm, n = Zahlen statt Namen. Der Vorgänger war `netstat -tulpn`.',
    },
    {
      id: 'q12', type: 'single', difficulty: 1,
      prompt: 'Was macht `ps aux | grep nginx`?',
      options: [
        { id: 'a', text: 'Listet alle Prozesse und zeigt nur die Zeilen, die „nginx“ enthalten' },
        { id: 'b', text: 'Startet nginx', whyWrong: '`ps` listet nur Prozesse auf, `grep` filtert Text. Gestartet wird dabei nichts. Dafür wäre `systemctl start nginx` zuständig.' },
        { id: 'c', text: 'Sucht eine Datei namens nginx', whyWrong: 'Dateien sucht man mit `find` oder `locate`. Hier filtert `grep` die Ausgabe von `ps`, also die Liste laufender Prozesse.' },
        { id: 'd', text: 'Beendet alle nginx-Prozesse', whyWrong: 'Beenden würde `kill` bzw. `pkill nginx`. `ps` und `grep` lesen und filtern nur, sie ändern nichts.' },
      ],
      correct: 'a',
      explanation: 'Die Pipe `|` gibt die Ausgabe von `ps aux` an `grep` weiter, das nur passende Zeilen durchlässt.',
    },
    {
      id: 'q13', type: 'single', difficulty: 2,
      prompt: 'Ein Prozess hängt und reagiert nicht auf `kill 4711`. Was ist der nächste Schritt?',
      options: [
        { id: 'a', text: '`kill -9 4711` (SIGKILL), der Kernel beendet den Prozess sofort' },
        { id: 'b', text: 'Den Server sofort hart ausschalten', whyWrong: 'Ein harter Ausschalter trifft alle Dienste und kann Daten beschädigen. Erst den einen Prozess mit `kill -9` gezielt beenden.' },
        { id: 'c', text: '`rm /proc/4711`', whyWrong: '`/proc` ist ein virtuelles Dateisystem mit Infos, man kann dort keine Prozesse löschen. Prozesse beendet man mit Signalen über `kill`.' },
        { id: 'd', text: '`kill 4711` so lange wiederholen, bis es klappt', whyWrong: '`kill` ohne Option sendet SIGTERM, eine höfliche Bitte zum Beenden. Ein hängender Prozess ignoriert sie auch beim zehnten Mal. SIGKILL (`-9`) kann ein Prozess nicht abfangen.' },
      ],
      correct: 'a',
      explanation: 'Zuerst SIGTERM (15), damit der Prozess sauber aufräumen kann. Erst wenn das nicht hilft, SIGKILL (9).',
    },
    {
      id: 'q14', type: 'multi', difficulty: 2,
      prompt: 'Welche Maßnahmen härten einen SSH-Zugang?',
      options: [
        { id: 'a', text: '`PermitRootLogin no` in `sshd_config`' },
        { id: 'b', text: 'Anmeldung mit Schlüssel statt Passwort, danach `PasswordAuthentication no`' },
        { id: 'c', text: 'Regelmäßige Updates des Systems und von OpenSSH' },
        { id: 'd', text: 'Den privaten Schlüssel auf den Server kopieren', whyWrong: 'Der private Schlüssel bleibt auf dem Client. Auf dem Server liegt nur der öffentliche in `authorized_keys`. Ein kopierter privater Schlüssel könnte bei einem Einbruch gestohlen werden.' },
        { id: 'e', text: 'Rechte von `~/.ssh` auf 777 setzen', whyWrong: '777 erlaubt jedem, den Ordner zu ändern und eigene Schlüssel einzutragen. SSH lehnt so offene Ordner deshalb sogar ab. Richtig sind 700 für `~/.ssh` und 600 für die Schlüsseldateien.' },
      ],
      correct: ['a', 'b', 'c'],
      explanation: 'Kein root-Login, nur Schlüssel, Updates. Dazu eine Firewall und Überwachung der Anmeldeversuche.',
    },
    {
      id: 'q15', type: 'single', difficulty: 2,
      prompt: 'Was ist der Unterschied zwischen `apt update` und `apt upgrade`?',
      options: [
        { id: 'a', text: '`update` lädt die Paketlisten neu, `upgrade` installiert die neuen Versionen.' },
        { id: 'b', text: 'Beide machen dasselbe.', whyWrong: '`update` ändert keine installierte Software, es fragt nur die Repositories nach neuen Versionen. Erst `upgrade` lädt und installiert sie.' },
        { id: 'c', text: '`update` aktualisiert den Kernel, `upgrade` die Programme.', whyWrong: '`update` aktualisiert gar keine Software, nur die Listen. `upgrade` aktualisiert alle Pakete, auch den Kernel, wenn ein neuer bereitsteht.' },
        { id: 'd', text: '`upgrade` macht ein Upgrade auf die nächste Ubuntu-Version.', whyWrong: 'Für einen Versionssprung (z. B. von 24.04 auf die nächste LTS) gibt es `do-release-upgrade`. `apt upgrade` aktualisiert nur die Pakete der installierten Version.' },
      ],
      correct: 'a',
      explanation: 'Typisch: `sudo apt update && sudo apt upgrade`. Erst Listen holen, dann aktualisieren.',
    },
    {
      id: 'q16', type: 'single', difficulty: 2,
      prompt: 'Im Ordner `/srv/team` (Rechte `drwxr-xr-x root team`) kann ein Gruppenmitglied keine neuen Dateien anlegen. Was hilft?',
      options: [
        { id: 'a', text: '`chmod 775 /srv/team` (Gruppe bekommt Schreibrecht am Ordner)' },
        { id: 'b', text: '`chmod 777 /srv/team`', whyWrong: 'Damit dürfte jeder Benutzer auf dem System dort schreiben und Dateien löschen, nicht nur das Team. Das ist zu viel. Für die Gruppe reicht 775 (oder 770, wenn andere gar nichts sehen sollen).' },
        { id: 'c', text: 'Den Benutzer zu root machen', whyWrong: 'root darf zwar alles, aber ein normaler Teamkollege braucht keine vollen Systemrechte, nur Schreibrecht an einem Ordner. Das wäre ein grober Verstoß gegen das Prinzip der geringsten Rechte.' },
        { id: 'd', text: '`chmod +x` auf alle Dateien im Ordner', whyWrong: 'Ausführrechte an Dateien helfen nicht beim Anlegen neuer Dateien. Dafür braucht man Schreibrecht (w) am Ordner selbst. Die Gruppe hat hier nur `r-x`.' },
      ],
      correct: 'a',
      explanation: 'Neue Dateien anlegen = Schreibrecht am Ordner. Gruppe von `r-x` auf `rwx`: 755 → 775.',
    },
  ],
  boss: {
    hearts: 3,
    questions: [
      {
        id: 'b1', type: 'scenario', difficulty: 3,
        prompt: 'Warum kommt Anna nicht in den Ordner?',
        scenario: '```\n$ id anna\nuid=1001(anna) gid=1001(anna) groups=1001(anna),1005(vertrieb)\n\n$ ls -ld /srv/einkauf\ndrwxrwx--- 2 root einkauf 4096 Nov  3 09:12 /srv/einkauf\n\n$ sudo -u anna ls /srv/einkauf\nls: cannot open directory \'/srv/einkauf\': Permission denied\n```',
        options: [
          { id: 'a', text: 'Anna ist nicht in der Gruppe `einkauf`, und andere haben keine Rechte (`---`).' },
          { id: 'b', text: 'Der Ordner gehört root, darum darf niemand außer root hinein.', whyWrong: 'Der Besitzer ist root, aber die Gruppe `einkauf` hat `rwx`. Deren Mitglieder dürfen hinein. Anna ist nur nicht Mitglied, sondern in `vertrieb`.' },
          { id: 'c', text: 'Es fehlt das Ausführrecht für den Besitzer.', whyWrong: 'Der Besitzer hat `rwx`, also auch `x`. Anna ist aber nicht der Besitzer. Für sie gilt die Dreiergruppe „andere“, und die ist `---`.' },
          { id: 'd', text: 'Der Ordner ist leer.', whyWrong: 'Ein leerer Ordner liefert bei `ls` einfach keine Ausgabe, keine Fehlermeldung. „Permission denied“ heißt: Die Rechte fehlen.' },
        ],
        correct: 'a',
        explanation: 'Lösung: `sudo usermod -aG einkauf anna`. Danach muss Anna sich neu anmelden, damit die neue Gruppe gilt.',
      },
      {
        id: 'b2', type: 'scenario', difficulty: 3,
        prompt: 'Was ist das Problem?',
        scenario: '```\n$ sudo systemctl status nginx\n× nginx.service - A high performance web server\n     Active: failed (Result: exit-code)\n...\nnginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)\n\n$ sudo ss -tulpn | grep :80\ntcp LISTEN 0 511 0.0.0.0:80 0.0.0.0:* users:(("apache2",pid=812,fd=4))\n```',
        options: [
          { id: 'a', text: 'Apache belegt bereits Port 80, darum kann nginx nicht starten.' },
          { id: 'b', text: 'nginx ist nicht installiert.', whyWrong: 'systemd kennt den Dienst `nginx.service` und nginx selbst meldet einen Fehler. Er ist also installiert. Er scheitert beim Start, weil Port 80 belegt ist.' },
          { id: 'c', text: 'Die Firewall blockiert Port 80.', whyWrong: 'Eine Firewall blockiert eingehende Pakete, sie verhindert aber nicht, dass ein Dienst einen Port öffnet. Die Meldung „Address already in use“ heißt: Ein anderes Programm lauscht schon dort, laut `ss` Apache.' },
          { id: 'd', text: 'nginx braucht root-Rechte und wurde ohne sudo gestartet.', whyWrong: 'Der Start lief hier über `sudo systemctl`. Fehlende Rechte würden „Permission denied“ melden. Gemeldet wird aber „Address already in use“.' },
        ],
        correct: 'a',
        explanation: 'Zwei Programme können nicht auf demselben Port lauschen. Apache stoppen und deaktivieren (`systemctl disable --now apache2`) oder nginx auf einen anderen Port legen.',
      },
      {
        id: 'b3', type: 'ordering', difficulty: 3,
        prompt: 'Bringe die Schritte in die richtige Reihenfolge, um SSH auf Schlüssel umzustellen, ohne dich auszusperren.',
        items: [
          { id: 'gen', text: 'Auf dem PC `ssh-keygen -t ed25519` ausführen' },
          { id: 'copy', text: 'Öffentlichen Schlüssel mit `ssh-copy-id` auf den Server kopieren' },
          { id: 'test', text: 'In einer zweiten Sitzung die Anmeldung per Schlüssel testen' },
          { id: 'conf', text: '`PasswordAuthentication no` in `sshd_config` setzen' },
          { id: 'reload', text: '`systemctl reload ssh` und erneut testen' },
        ],
        explanation: 'Erst Schlüssel erzeugen und hinterlegen, dann testen, erst danach Passwörter abschalten. Die alte Sitzung bleibt offen, bis die neue Anmeldung sicher klappt.',
      },
      {
        id: 'b4', type: 'scenario', difficulty: 3,
        prompt: 'Was ist hier passiert und was tust du?',
        scenario: 'Der Server meldet „No space left on device“.\n```\n$ df -h /\nFilesystem  Size  Used Avail Use% Mounted on\n/dev/sda2    40G   40G     0 100% /\n\n$ sudo du -sh /var/log\n31G   /var/log\n\n$ ls -lh /var/log/app/\n-rw-r----- 1 app app  30G Nov  3 10:01 debug.log\n```',
        options: [
          { id: 'a', text: 'Eine Debug-Logdatei hat die Platte gefüllt. Debug-Logging abschalten, die Datei leeren (`truncate -s 0`) und Logrotation einrichten.' },
          { id: 'b', text: 'Die Festplatte ist defekt und muss getauscht werden.', whyWrong: 'Die Platte funktioniert, sie ist nur voll. `du` zeigt 31 GB in `/var/log`, davon 30 GB in einer einzigen Debug-Datei. Ursache ist ein zu gesprächiges Logging.' },
          { id: 'c', text: '`rm -rf /var/log` ausführen, um Platz zu schaffen.', whyWrong: 'Das löscht alle Logs und Logordner aller Dienste. Manche Dienste starten danach nicht mehr, und die Spuren für die Fehlersuche sind weg. Gezielt nur die eine riesige Datei bearbeiten.' },
          { id: 'd', text: 'Den Server neu starten, dann ist der Platz wieder frei.', whyWrong: 'Die 30-GB-Datei liegt auf der Festplatte und bleibt nach dem Neustart bestehen. Die Platte ist danach genauso voll.' },
        ],
        correct: 'a',
        explanation: '`truncate -s 0` leert die Datei, auch wenn das Programm sie noch offen hat (ein `rm` würde den Platz erst nach dem Schließen freigeben). Langfristig: Loglevel senken und `logrotate` nutzen.',
      },
      {
        id: 'b5', type: 'multi', difficulty: 3,
        prompt: 'Welche Aussagen zu Linux-Rechten stimmen?',
        options: [
          { id: 'a', text: 'Um eine Datei zu löschen, braucht man Schreibrecht am Ordner, in dem sie liegt.' },
          { id: 'b', text: 'Um mit `cd` in einen Ordner zu wechseln, braucht man das x-Recht am Ordner.' },
          { id: 'c', text: 'Das Sticky Bit auf `/tmp` verhindert, dass Benutzer fremde Dateien dort löschen.' },
          { id: 'd', text: 'root unterliegt den normalen Dateirechten genau wie andere Benutzer.', whyWrong: 'root (UID 0) übergeht die normalen Lese- und Schreibrechte. Darum ist root so mächtig und gefährlich und wird nur gezielt per sudo genutzt.' },
          { id: 'e', text: '`chmod 777` ist eine sichere Standardlösung bei Rechteproblemen.', whyWrong: '777 gibt jedem Benutzer und jedem kompromittierten Dienst Schreibrecht. Ein Angreifer könnte Dateien verändern oder Skripte austauschen. Man vergibt gezielt nur die nötigen Rechte an die richtige Gruppe.' },
        ],
        correct: ['a', 'b', 'c'],
        explanation: 'Löschen hängt am Ordner (w), Wechseln braucht x, das Sticky Bit schützt fremde Dateien in gemeinsamen Ordnern.',
      },
    ],
  },
};

export default level;
