# AI Rules Summary (Strict)

## 1. Arbeitsweise

* **Aktuelle Aufgabe zuerst:** Keine ungefragten Nebenaufgaben, Refactorings oder Verbesserungen.
* **Pfade exakt verwenden:** Nicht interpretieren oder durch Synonyme ersetzen. Nur offensichtliche Tippfehler korrigieren.
* **Nur Notwendiges:** Nur relevante Dateien und relevante Bereiche lesen und bearbeiten.
* `node_modules/`, `.vs/`, `.vscode/`, `documents/` niemals lesen oder durchsuchen.
* Wiederholte Analyse ohne neuen Erkenntnisgewinn abbrechen.

## 2. Ergebnis

* Laufende Analyse, Planung, Dateisuche, Recherche und Statusberichte sind **kein Ergebnis**.
* Jede Session muss Codeänderung, Testergebnis, Fehlerursache oder verwertbaren Zwischenstand erzeugen.
* Spätestens nach **3 Sessions**: fertiges Ergebnis oder verwertbarer Zwischenstand. Keine weitere Session ohne diesen.
* Bei Blockade: Ursache, aktueller Stand und nächster konkreter Schritt ausgeben.
* Unfertige Zwischenergebnisse nicht ausgeben.
* Bei Dateiänderungen ist die **vollständige fertige Datei** das Ergebnis.

## 3. Architektur

* `AI/structure/` ist die verbindliche Quelle für Datenstruktur, Metadaten und Systemgrenzen. Vor datenbezogenen Änderungen prüfen.
* `AI/workflow/WORKFLOW.md` einmalig pro Session lesen; bei Änderung erneut lesen.
* `AI/workflow/NewFiles/` ausschließlich für extern bereitgestellte Dateien. Niemals eigene Dateien dort ablegen oder darauf verweisen.
* Bestehende Architektur und Namenskonventionen einhalten: PascalCase für Klassen/Models/Views/Controller, camelCase für Funktionen und Instanzen.
* Komplexe, aktuell nicht notwendige Aufgaben in `AI/workflow/todo.md` verschieben.

## 4. Code

* JavaScript: ES6+, ESM mit `.js`, `async/await`, keine globalen Variablen, JSDoc.
* HTML: semantisch, keine Inline-Styles, ARIA verwenden.
* CSS: BEM, Mobile-First, Vanilla CSS bevorzugen.
* **Kapselung:** Thematisch zusammengehörenden Code sauber in einer Klasse bzw. einem Modul kapseln. Trennung bei unterschiedlichen Verantwortlichkeiten; keine Refactorings allein wegen der Codegröße.
* DOM-Manipulationen minimieren; State bevorzugen.

## 5. Log

* `AI/log/log.md` ist das Änderungslog.
* Format: `YYYY-MM-DD HH:MM | [FLAG] | Beschreibung auf Deutsch.`
* Flags: `[NEW]` `[UPDATE]` `[REMOVE]` `[FIX]` `[INFO]` `[REFACTOR]`
* Einträge während der Arbeit sammeln und **erst bei Task-Ende** gebündelt schreiben.
