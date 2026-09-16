# Workflow01.md

## Schritt-für-Schritt-Anleitung

- Jeder Workflow muss diese Anleitung als festen Bestandteil enthalten.
- Führe die einzelnen Schritte **nacheinander** aus.
- Beginne den nächsten Schritt erst, nachdem der vorherige vollständig abgeschlossen und manuell freigegeben wurde.
- Warte nach jedem abgeschlossenen Schritt auf die manuelle Freigabe.
- passe fehelende Daten und andere Formatierungen in der Datei /dok/Jobsoutput.json und im code an

## Schritt „LocalDB“

- Erstelle die Klasse `js/API/LocalDB`, die für das Laden und Speichern von Daten in der IndexedDB verantwortlich ist.
- Prüfe, ob die Klasse statisch implementiert werden kann (siehe Schritt „JobDB“).
- Verwende eine GUID als ID.
- `json.id` enthält immer eine ID, `null`, `0` oder ist nicht vorhanden.
- `add(json)` fügt einen neuen Datensatz hinzu und ignoriert eine mitgegebene ID. Die ID wird neu generiert.
- `update(json)` aktualisiert einen bestehenden Datensatz anhand seiner ID.
- `updateOrAdd(json)` prüft, ob ein Datensatz mit der angegebenen ID existiert, und ruft entsprechend `update` oder `add` auf.
- `delete(id)` löscht den Datensatz mit der angegebenen ID.
- `get(id)` ruft einen Datensatz anhand seiner ID ab. Ist `id` gleich `null` oder nicht angegeben, werden alle Datensätze zurückgegeben. Der Wert `0` gilt nicht als fehlende ID.
- `create(name)` erstellt einen Object Store mit dem angegebenen Namen und legt einen Index für die ID an.
- `use(name)` wählt einen vorhandenen Object Store für weitere Aktionen aus. Ist der Object Store nicht vorhanden, wird ein Fehler ausgelöst.

### Regeln für IDs und `updateOrAdd(json)`

- Fehlt `json.id` oder ist sie `null` bzw. `0`, wird ein neuer Datensatz mit einer neu generierten GUID angelegt.
- Ist eine gültige ID angegeben, wird geprüft, ob ein Datensatz mit dieser ID existiert.
- Existiert der Datensatz, wird `update(json)` aufgerufen.
- Existiert kein Datensatz mit dieser ID, wird `add(json)` aufgerufen. Dabei wird die mitgegebene ID ignoriert und eine neue GUID generiert.

## Schritt „Beispiele“

- Erstelle anhand der JSON-Datei aus `/dok` vier Beispieldatensätze.
- Speichere die Beispieldatensätze mithilfe der LocalDB Klasse unter dem Namen `Bewerbungsmanager`.

## Schritt „Models“

- Erstelle auf Basis der vorhandenen Modelle `JobModel` und `ContactModel` folgende Modelle:
  - `CompanyModel` 
    Firmenname, Branche, Beschäftigte, Grundungsdatum, / Jahr, Webseite, Adresse das Model einbinde, wie im Model, Verifizeiert, firmenbeschreibung, Spezialgebiete, Bilder
  - `AdressModel` - gibt die Adresse zurück welche aus den Firmenname, Ansprechpartner, Strasse Hausnummer PLZ Darten und Stadt, Land, besteht die daten jeweisl aus den Models raussucehn
  - `StreetModel` - aufgebaut aus Strassenname und und Hausnummer (name, houseNumber)
  - `CityModel`- aufgebaut aus Länderkennzeichen,Postleitahl,Stadt,Land
  - `JobDetailModel`- aufgebaut aus Titkle, Arbeitsort, Anstellungsartm, Arbeitsmodell, gehalt, referenznummen, Aufgaben
  - `qualificationModel`- aufgebaut aus erforderliche Qualifikation, gewünschhte Qualifikationsname, Persönliche Stärken, SkillTAG in den jeweiligen bereichen 
  - `ReferenceModel`- Webseite, Name, Erfassungs-Datum, Inhalt
  - später erweitern mit Bewerbung und Ausgabe


## Schritt „JobDB“

- Erstelle die Klasse `js/API/JobDB`, die `LocalDB` verwendet.
- Rufe im Konstruktor `LocalDB.use("Bewerbungsmanager")` auf.
- Erstelle eine Methode, die Daten aus einem `JobModel` mithilfe von `LocalDB` speichert.
- Erstelle eine Methode, die anhand einer ID Daten über `LocalDB` abruft und als `JobModel` zurückgibt.
- Wenn `LocalDB` statisch implementiert ist, muss `JobDB` keine eigene Instanz davon erstellen.
- Stelle sicher, dass die ausgewählte Tabelle für alle nachfolgenden Datenbankoperationen zuverlässig verfügbar bleibt.