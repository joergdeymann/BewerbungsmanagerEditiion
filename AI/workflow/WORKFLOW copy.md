# Regel
- Jedes Model git die Daten vor und darf nur auf Anweisung oder Nachfrage geändert werden
- Halte Models, AppRecord.json, JobsInput.json, structure/Datenstruktur.md synchronisiert

# Entwicklungs-Sprint (Workflow)
- Du befindest dich bei Neue Bewerbung / Import / Butto: Webadresse der Stellen anzeige. Es öffnet sich ein Fenster indem man die Adresse angeben kann
- Diese Seite wird an einer bestimmten stelle zurückgegeben und dann zur Weiterverarbeiung geschickt
- ein Link den ich per Drag und Drop in die Leiste schieben kann, soll die entsprechende HTML seite zur selben Weiterverarbeitung schicken
- hole den HTML Bereich raus der für die Bewerbung relevant ist, 
zb mit übergeordneten dom Element von "Details zum Jobangebot", oder Übergerordnete dom von "(m/w/d)"
- Das Dom Element nach weiterführenden Links durchsuchen (interne links zur Selle, externe Links zur Firma die Beworben werden kann)
- die Textdaten sind von aussen mit ... gekürzt, ich brauche alle Textdaten
- Rohdaten Zeilenweise speichern wie mit den andern daten auch neue Tags sind immer neue Zeilenweise
- diese daten in das Eingabefeld einfügen
- Rohdaten und Links in der Console ausgeben, damit ich das überprüfen kann
- bei dem Versuch die Seite mit anderer KI zu öffenen gab es unter umständen folgende Fehler:
1. Cookies sollten akzeptiert werden, das soll automatisch bestätigt werden
2. Es wurde ein Login verlangt, das ist nicht nötigt bei den JobBörsen
