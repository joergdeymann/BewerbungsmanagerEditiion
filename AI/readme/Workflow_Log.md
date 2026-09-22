# Systemanweisung: Workflow-Protokollierung (Log Management)

Diese Anweisung regelt die strukturierte und kontinuierliche Dokumentation von Änderungen im Projektfortschritt. Die KI hat diese Regeln bei jeder Aktualisierung strikt zu befolgen.

## 1. Speicherort & Dateiname
* Die Log-Einträge müssen zwingend in der Datei `AI/log/log.md` verwaltet werden.

## 2. Speicherverhalten & Datenhaltung
* **Temporäres Backup:** Die KI ist dafür verantwortlich, neue Log-Einträge im laufenden Chat-Kontext bzw. im Arbeitsspeicher aufzubewahren.
* **Kein Push-Zwang:** Das Log muss nicht bei jedem einzelnen Zwischenschritt oder Push im Repository bereitgestellt werden.
* **Bündelung:** Erst wenn ein finaler Push oder eine explizite Bereitstellung angefordert wird, schreibt die KI alle gesammelten Daten gesammelt in die Datei.

## 3. Format & Syntax
Jede Änderung wird als **exakt eine Zeile** (Single Line) im folgenden Markdown-Tabellenformat oder Listenformat angehängt:

`YYYY-MM-DD HH:MM | [FLAG] | Beschreibung der Änderung oder Aktion`

* **Datum/Uhrzeit:** Strikt im Format `YYYY-MM-DD HH:MM` (z. B. `2026-09-22 14:54`).
* **Trennzeichen:** Ein Pipe-Symbol mit Leerzeichen (` | `) zur Gewährleistung der Maschinenlesbarkeit.

## 4. Erlaubte Flags
Es dürfen ausschließlich die folgenden englischen Flags verwendet werden. Die Beschreibung der Änderung erfolgt auf Deutsch:

* `[NEW]` – Neue Features, Workflows, Skripte oder Dateien wurden hinzugefügt.
* `[UPDATE]` – Bestehende Funktionen, Dokumente oder Konfigurationen wurden modifiziert.
* `[REMOVE]` – Veraltete, ungenutzte oder fehlerhafte Komponenten wurden gelöscht.
* `[FIX]` – Ein Fehler (Bug), ein Systemproblem oder ein logischer Fehler wurde behoben.
* `[INFO]` – Allgemeine Metadaten, Systemhinweise, Dokumentationen oder Statusänderungen.
* `[REFACTOR]` – Code, Strukturen oder Dokumente wurden ohne Funktionsänderung optimiert oder nachgebessert.

---
**Hinweis für die KI:** Achte bei der Ausgabe darauf, keine Zeilenumbrüche innerhalb eines einzelnen Log-Eintrags zu erzeugen, damit die Datei zeilenweise (z. B. via `grep` oder Skripten) filterbar bleibt.
