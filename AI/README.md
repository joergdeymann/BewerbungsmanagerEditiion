# AI Rules Summary (Strict)

## 1. System & Log Rules
- Einlesen: Einmalig bei Session-Start. Im Kontext halten. Nur bei Datei-Update neu lesen.
- Log-Pfad: `AI/log/log.md`
- Log-Format: `YYYY-MM-DD HH:MM | [FLAG] | Beschreibung auf Deutsch.`
- Flags: [NEW], [UPDATE], [REMOVE], [FIX], [INFO], [REFACTOR]
- Push: Einträge im Kontext sammeln. Erst bei Task-Ende bündelnd in Datei schreiben.

## 2. Code & Tech Rules
- HTML: Valide Semantik. Keine Inline-Styles. ARIA-Attribute nutzen.
- CSS: BEM-Naming verwenden. Mobile-First. Vanilla CSS bevorzugt.
- JS: ES6+ (ESM mit Extension: import { X } from "./X.js"), async/await, keine globalen Variablen, striktes JSDoc.
- Limits: Max. 50 Zeilen pro Funktion. Max. 500 Zeilen pro Klasse. Bei Überschreitung: Refactoring erzwingen.
- UI/DOM: Manipulationen minimal halten. Virtuellen Zustand (State) bevorzugen.

## 3. Architektur-Regeln für die KI
- **Zentrale Referenz (Structure):** Dateien in `AI/structure/` (`AppRecord.json`, `Datenstruktur.md`, `Verzeichnisstruktur.md`) are die primäre Quelle für Metadaten, Datenbank-Schemata und Systemgrenzen. Vor jeder datenbezogenen Änderung zwingend prüfen.
- **Code-Ablage (NewFiles):** `AI/workflow/NewFiles/` dient exklusiv als Import-Verzeichnis für extern bereitgestellte Skripte. Die KI darf dort selbst keine Dateien zwischenspeichern. Es darf im Code niemals eine Pfad-Referenz oder ein Link auf diesen Ordner verweisen.
- **Namenskonvention:** PascalCase für Klassen/Models/Views/Controller. camelCase für Hilfsfunktionen und Instanzen.
- **Modularität (CSS):** Stylesheets strikt und trennscharf in die oben definierten `css/` Unterordner aufteilen. Keine monolithischen Dateien.
- **Tasks & Aufschiebung:** Komplexe, momentan zu aufwendige Zwischenschritte oder Features strikt in `AI/workflow/todo.md` auslagern, um den aktuellen Fokus nicht zu blockieren. Später realisieren.
- **Lese-Verbote (Ignorieren):** `node_modules/`, `.vs/`, `.vscode/` und `documents/` niemals einlesen oder durchsuchen (Token-Schutz).

## 4. Workflow
- `AI/workflow/WORKFLOW.md` einmalig lesen und im Kontext halten; nur bei Dateiänderung erneut lesen.

**## 5. Grundsätze**
* **Klare Anweisung:** Pfadangaben nicht Interpetieren, es sei denn es sind offensichtliche Fehler enthalten
* **Effizienz:** Minimale Tokens und Tool-Aufrufe; nur aufgabenrelevante Aktionen.
* **Fokus:** Keine ungefragten Nebenaufgaben oder Refactorings.
* **Ausgabe:** Laufende Analyse und unfertige Zwischenergebnisse nicht ausgeben; nur Ergebnis oder verwertbarer Zwischenstand.
* **Fortschritt:** Statusbericht, Planung, Dateisuche, Recherche und reine Analyse **zählen nicht als Ergebnis**.
* **Max. 3 Sessions:** Spätestens nach 3 Sessions muss ein Ergebnis oder verwertbarer Zwischenstand vorliegen; keine weitere Session ohne diesen.
* **Blockade:** Wiederholte Aktionen ohne Fortschritt → abbrechen und Zwischenstand liefern.
