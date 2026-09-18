# Workflow01.md


## Schritt 1: `app.js` einführen

- Die vorhandene HTML-Struktur liegt noch nicht komplett im Repository.
- HTML-Struktur und `app.js` **gemeinsam Schritt für Schritt** integrieren.
- Keine eigenständigen Änderungen an der HTML-Struktur ohne Absprache.
- `app.js` bildet nur den **Grundstock der Anwendung** und enthält den Router.
- Die Views werden in `Overview`, `Edit`, `Work` und später weitere Bereiche aufgeteilt.
- `Templates/` enthält ausschließlich die **HTML-Strukturen** der Views.
- `Views/` übernimmt ausschließlich die **Verarbeitung** der Templates.
- `UI/` definiert ausschließlich den **Datenfluss** zwischen Daten und Views.
- `uiCompany.js` und `uiJob.js` dienen als Basis für den Datenfluss.

### Abgleich `/workflow/NewFiles`

- Dateien aus `/workflow/NewFiles` zunächst mit dem bestehenden Projekt abgleichen.
- Nur benötigte Dateien bzw. Funktionen übernehmen.
- Nicht benötigte Dateien verwerfen.
- Andere Dateien aus `/workflow/NewFiles` **noch nicht bearbeiten**.

### `ApplicationRepository.js`

- `ApplicationRepository.js` ist strukturell an `LocalDB.js` angelehnt.
- Prüfen, ob darin Funktionen enthalten sind, die für `LocalDB` oder andere bestehende Dateien benötigt werden.
- Benötigte Funktionen übernehmen bzw. an der richtigen Stelle einordnen.
- Nicht benötigte Funktionen nicht übernehmen 

### `Overview`

- `Overview` war bisher der erste aufgerufene Bereich und wird als erster View integriert.
- `OverviewView.js` analysieren und aufteilen:
  - Konstanten → `Constants`
  - HTML-Struktur → `Templates`
  - Verarbeitung → `Views`
  - Datenfluss → `UI`
- Nur `Overview` in diesem Schritt bearbeiten.
- Andere Views/Files **noch nicht analysieren oder umbauen**.




## Schritt 2: Loader aktivieren

* Nach erfolgreichem Laden der ersten Seite die Daten aus der LocalDB laden.
* Die geladenen Daten in das vorgesehene JSON-Array übernehmen.

## Schritt 3: Datensatzliste anzeigen

* Die geladene Liste im **Eingangsbereich (Bearbeitung)** und im **Arbeitsbereich (Anzeigeliste)** bereitstellen.
* Die konkrete Umsetzung vorher abstimmen.

## Schritt 4: Datensatz anzeigen

* Nach Auswahl eines Datensatzes die zugehörigen Daten in die vorgesehenen HTML-Bereiche des Editors und der normalen Anzeige übertragen.
* Die zugehörigen Tabs korrekt aktualisieren.
