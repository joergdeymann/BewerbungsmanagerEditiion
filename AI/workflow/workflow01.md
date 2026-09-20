# Workflow01.md


## Schritt 1: `Bererbung und Ausgabe` 
- Portalinformationen, Prüfe ob die Daten richtig aus dem ApplicationPortalModel kommen auch über den Umweg. Das Kennwort was angegeben ist muss mit dem Passwort übereinstimmen und die anderen Felder müssen auch daher komen,
- Die Legende History soll Flgende informationen anzeigen: Datum, was wurre gemacht, Kurzinfo
- was wurde gemacht: 
  - "Neu angelegt", "Daten aus <Webseite> geladen",
  - "Beworben"," "Via Mail beworben an <Mail> und <Name>"
  - "Antwort erhalten", "Antwort der Firma erhalten"
  - "Rückruf erhalten", "Rückruf der Firma erhalten"
  - und weitere Möglichkeiten
- Die Zeile soll anklickbar sein, jede Zeile bekommt also ein eigenen sector


## Schritt 1B: Überarbeitungen
Die vorhandenn Strucktur einmal überprüfen und logisch aufteilen
- `Templates/` enthält ausschließlich die **HTML-Strukturen** der Views.
- `Views/` übernimmt ausschließlich die **Verarbeitung** der Templates.
- `UI/` definiert ausschließlich den **Datenfluss** zwischen Daten und Views.
- Es gibt controller und events: Ich brauche ien Vorschlag ob man die Controller aufteilt oder nicht und schlage ein passende Strucktur im system vor wie es sauber angelegt werden soll



## Schritt 2: Erstellen der `OverviewView`
- ich habe die /workflow/NewFiles/OverviewView einmal auseinandergenommen und in /js/viewable/overview erstellt
- das einmal durchgehen damit es für das repository passt
- villeicht passt es das es mit der struktur zum Template / Views / Ui 




## Schritt 3: Erstellen der neuer Dateien
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




## Schritt 4: Loader aktivieren

* Nach erfolgreichem Laden der ersten Seite die Daten aus der LocalDB laden.
* Die geladenen Daten in das vorgesehene JSON-Array übernehmen.

## Schritt 5: Datensatzliste anzeigen

* Die geladene Liste im **Eingangsbereich (Bearbeitung)** und im **Arbeitsbereich (Anzeigeliste)** bereitstellen.
* Die konkrete Umsetzung vorher abstimmen.

## Schritt 6: Datensatz anzeigen

* Nach Auswahl eines Datensatzes die zugehörigen Daten in die vorgesehenen HTML-Bereiche des Editors und der normalen Anzeige übertragen.
* Die zugehörigen Tabs korrekt aktualisieren.
