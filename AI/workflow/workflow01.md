# Workflow01.md

## Schritt-für-Schritt-Anleitung

- Jeder Workflow muss diese Anleitung als festen Bestandteil enthalten.
- Führe die einzelnen Schritte **nacheinander** aus.
- Beginne den nächsten Schritt erst, nachdem der vorherige vollständig abgeschlossen und manuell freigegeben wurde.
- Warte nach jedem abgeschlossenen Schritt auf die manuelle Freigabe.
- passe fehelende Daten und andere Formatierungen in der Datei /dok/Jobsoutput.json und im code an

## Schritt Erstellen von Testdaten
- Erstelle eine neie JSON Datei im ordner Testdaten auf grundlage der Datei /dok/Jobsinput.json.
- Es sollen 5 Datensätze erzeugt werden und jeweils 3 Einträge pro Liste und UnterListe
- Diese Daten bitte vorher in die Models eintragen und dann zusammen mit API-Methoden aus /js/API/LocalDB.js erzeugen.
- die erstellte JSON bitte als neuen namen im /testdata verzeicnis speichern
- lösche die Daten im Hauptspeicher, lade dann einen der datensätze und vegeleiche die JSON mit einen aus der kompletten liste
- es sollte keine Differenzen da sein wenn ja code überarbeiten
- einmal einen Wert ändern und den datensatz speicehrn, wird die rchige überschrieben ? was ist wwennid fehlt wird der Datensatz dann angehängt ?

## Schritt 1: app.js einführen und anpassen 
- Es ibt eine HTML Strucktur die noch nicht im Repository steht ich möchte geren das wir das zusammen schrit für schritt durchgehen

## Schritt 2: den Loader aktivieren daten ins JSON Arry laden
- wenn die app erfolgreich die erste Seite laden kann, dann sollen die Daten geladen werden die in der Lokalen Datenbank stehen

## Schritt 3: geladenene List im Eingangsbereich anzeigen (Berbeitungsbereich), und auch in der Anzeigeliste (Arbeitsbereich)
- Im Bewerbungsmanager gibt es 2 Stellen wo die Auswahl für einen Datensatz ist, hier schon mal Teile vorbereiten, mit meiner Absprache

## Schritt 4: Die angeklickte Auswahl im Editor und im normalen Fenster anzeigen
- nach Auswahl eines Datensatzes sollen die infos in den HTL Berieche aufgefüllt werden und die korrekte Anzeige in den Tabs soll passen



