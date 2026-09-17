# Workflow01.md

## Schritt 0: Testdaten erstellen und LocalDB prüfen

* Erstelle auf Basis von `/AI/structure/AppRecord.json` eine neue Testdatei in `/testdata`.
* Erzeuge **5 Datensätze** mit jeweils **3 Einträgen pro Liste und Unterliste**.
* Erstelle die Datensätze zunächst über die Models und anschließend über die API-Methoden aus `/js/API/LocalDB.js`.
* Speichere die erzeugten Daten unter einem neuen Dateinamen in `/testdata`.
* Leere den Hauptspeicher, lade einen Datensatz und vergleiche ihn mit dem entsprechenden Ausgangsdatensatz. Es dürfen keine Differenzen entstehen.
* Ändere einen Wert und speichere den Datensatz. Prüfe, ob der bestehende Datensatz korrekt überschrieben wird.
* Speichere anschließend einen Datensatz ohne `id` und prüfe, ob er korrekt neu angelegt bzw. angehängt wird.
* Bei Fehlern den Code korrigieren und den Test wiederholen.

## Schritt 1: `app.js` einführen

* Die vorhandene HTML-Struktur liegt noch nicht im Repository.
* HTML-Struktur und `app.js` **gemeinsam Schritt für Schritt** integrieren.
* Keine eigenständigen Änderungen an der HTML-Struktur ohne Absprache.

## Schritt 2: Loader aktivieren

* Nach erfolgreichem Laden der ersten Seite die Daten aus der LocalDB laden.
* Die geladenen Daten in das vorgesehene JSON-Array übernehmen.

## Schritt 3: Datensatzliste anzeigen

* Die geladene Liste im **Eingangsbereich (Bearbeitung)** und im **Arbeitsbereich (Anzeigeliste)** bereitstellen.
* Die konkrete Umsetzung vorher abstimmen.

## Schritt 4: Datensatz anzeigen

* Nach Auswahl eines Datensatzes die zugehörigen Daten in die vorgesehenen HTML-Bereiche des Editors und der normalen Anzeige übertragen.
* Die zugehörigen Tabs korrekt aktualisieren.
