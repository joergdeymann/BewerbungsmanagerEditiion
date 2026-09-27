# Regel
- Jedes Model git die Daten vor und darf nur auf Anweisung oder Nachfrage geändert werden

# Entwicklungs-Sprint (Workflow)
- Das Model ImportedRawDataModel für das speichern der Importdaten exitstiert noch nicht da es für die details nicht benötitgt wird, wenn ich mich irre hier stoppen
   - Erstelle das Model ImportedRawDataModel mit den Feldern id, content, url, date, name
   - Das Model ist en teil das direkt ins AppModel eingebunden wird
   - Hinweis: id = UUID, content = Text, url = URL des Imports, date = Datum des Imports, name = Title der Webseite Name der Seite die Importiert wurde, bzw ausgelesene werte der den Namen der Seite herausgibt (könnte LinkedIn sein) 
- Die Daten aus IndexDB müssen ageasst werden nach dem Model
- Stelle danach die Verknüpfung richttig einfür ImprortEditTab
- Erstelle neue Testdaten
- Überprüfe ob die Testdaten geladen werden 
