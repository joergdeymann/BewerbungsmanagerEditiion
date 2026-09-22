# Verzeichnisvorgaben

- Verzeichnisstruktur logisch halten.
- Verzeichnisse nicht unnötig tief verschachteln.
- Eine Datei soll möglichst eine klar erkennbare Verantwortung haben.
- Dateinamen sollen die enthaltene Klasse bzw. Funktion widerspiegeln.
- Jede Klasse wird in einer eigenen Datei definiert.
- Dateien und Verzeichnisse mit `temp`, `old`, `bak` oder `sav` im Namen werden grundsätzlich nicht angesehen oder verarbeitet.
- Dateien und Verzeichnisse mit `test` im Namen werden nur verarbeitet, wenn sie ausdrücklich Teil der angeforderten Aufgabe sind.
- 
## Verzeichnisinformation Root Ebene
- `AI` - KI-Vorgaben
- `testdata` - Testdaten die nicht in das laufende System gehören
- `dok` - Dokumentation
- `css` - CSS-Dateien
- `js` - JavaScript-Dateien
- `assets` - Bilder,Icons, Audio, Video

## Verzeichnisinformation  erster Ebene
- `js/api` - externe Schnittstellen (Aufrufe an den eigenen Server bzw. Dritte)
- `js/analysis` - Auswertung des importierten Stellenanzeigentexts
- `js/constants` - alle Konstanten des Projekts
- `js/data` - lokaler Datenzugriff (Persistenz), keine externen Aufrufe
- `js/io` - Zukunft: Daten-IO (lokale Datenbank, Dateisystem) jetzte noch `js/store/`
- `js/models` - reine Datenmodelle ohne UI- oder DOM-Logik
- `js/utils` - allgemeine Funktionen und Klassen, die wieder gebrauch werden
- `js/templates/` enthält ausschließlich die **HTML-Strukturen** der Views.
- `js/views/` übernimmt ausschließlich die **Verarbeitung** der Templates.
- `js/ui/` definiert ausschließlich den **Datenfluss** zwischen Daten und Views.
