# Workflow01.md


## Schritt 1: `JobTemplate.js` 
- Anordung  Gesuchte Stelle so wie es ist, dann Arbeitsort bis Kennziffer, die sektion mit class field-grid
- Badges: wie es ist mit voller bereite, jeder Tag bekmmt noch zusätzlich eine umrahmnung und eine farbe wie die überschrift Buttons
- Aufgaben bleibt dann unten wie es ist
- Arbeitsort sollte die komplette Adresse stehen und nicht nur die Stadt this.worklocation ist also ein AddressModel
- Worklocation als adresse in den Testdaten auufnehmen
- fehlen Adressangbaen so müssen die von der firma genommen werden
- Arbeitsmodell soolen mehrere Möglich sein, die dann hier durch komma getrennt dargestellt werden
- Gehalt mit dem ForamtUtil formatCurrency anzeigen
- Urlaubsgeld sollte ein Betrag rein, ForamtUtil formatCurrency anzeigen
- Weinnachtsgel sollte ien Betrag rein, ForamtUtil formatCurrency anzeigen

## Schritt 1.1: `Ansprechpartner` 
- Der Aktuelle Ansprechpartner wird oben angezeigt wie es jetzt ist
- Darunter kommt eine Liste mit weiteren potentiellen Ansprechpartnern
- Das AppModel sollte eine Liste von ContactModels haben. Das ist die Liste mit potenziellen Ansprechpartnern.
- Es soll möglich seine einen aus der Liste auszuwählen und als aktuellen Ansprechpartner einzustellen.
- Es soll möglich sein einen Kontankt zu ändern un Button in der Zeile öffnet ein Fenster, das die eingabe aller Kontaktdaten des ContactModels beinhaltet
- Es soll möglich sein einen Kontankt hinzuzufügen, der Button am Ende der Liste oder am Anfang der Liste ermöglicht dies, die handhabung ist wie beim Ändern
- Das Entfernen eines Eintrags muss auch möglich sein, dazu rufe ein bereits gebautes PopUp Fenster auf, passe es eventuell an wie eine MessageBox
- jeder neue Eintrag wird sofort gespeichet, nachdem er erstellt/geändert/gelöscht wurde.

## Schritt 1.2 `Firmeninformationen`
- Das letzte Feld Tätigkeitsbeschreibung der Firma entspricht der Selbstbeschreibung der Firma und kann raus
- hier auch für die kurzen Felder field-grid verwenden

## Schritt 1.3 `Anforderungen`
- Fachliche Fähigkeiten / Technologien entsprechen den Mussanforderungen das Feld kann hier auch weg
- Für die restlichen Bereiche sollten hier die Schlagwörter aus den Textgeholt werden und darunter mittels wie due Tags in JobTemplate.js angezeigt werden
- es gibt bereits einen Datenbakeintrag dafür 

## Schritt 1.4 `Benefits`
- die Tags wieder richtig formatieren (als Tag Kennzeigenen)

## Schritt 1.5 `Quellen`
- da brauche ich eigentlich nur eine Liste, Name der Quelle, Link zur Quelle und Datum der Erfassung Anzeige Reihenfolge Datum dann Name die die Verknüpfung enthält
- Die Liste soll Sortierbarsein indem man auf die Überschriften klickt, (vorwärts und rückwräts)
- Darin enthalt sind alles was mit http anfängt (das wäre der Link wo die Daten herkommen, zb Linkedin, oder die Firmenadresse, Links zu Bildern etc)
- Die Liste soll auch eine Filterfunktion haben, die die Liste filtert, sobald man einen Suchbegriff eingibt, soll nur die Einträge angezeigt werden, die den Suchbegriff enthalten
- Ein klick auf eine Zeile öffnet den Link in neuen Browsertab

## Schritt 1.6 `Legende / History in Bewerbung & Ausgabe`
- sieht gut aus wie es jetzt ist, aber sollte in in der section-body noch eine classe application-card haben oder das selbe in grau

## Schritt 1.7 `Dokumente in Bewerbung & Ausgabe`
- der + Button soll ein Explorerfenster zu auswählen öffen, wenneine Datei ausgewählt wurde wird die Datei als Guid.normale Endung im Ordner /documents gespeichert, der name Der Ursprünglicehn Datei wird zusammen mit dem neuen Link in das Model gespeichert, ich denke das muss dan noch angepasst werden als UploadFileModel welcher den Originallink und denneuen speichert, die Anzeige ist dann der Originallink ohne Verzeichnisse und Endung.
- Beim "+" wird immer ein neuer eintrag erzeeugt, es soll aich ein "-" geben der die datei wieder löscht und aus der liste nimmt.
- Beim Anschreiben soll gibt es nur eine Datei, beim Lebenslauf merhere
- Ausserdem muss noch ein Eintrag Email-Anschreiben geben, welcher wie ANschreiben funktioniert

## Schritt 1.8 `Dokumente in Notizen`
- Die Notizen sollen beim Verlassen des Feldes gespeichert werden, 
- Jede Änderungen solle nach bearbeitung gespeichert werden

## Schritt 1.8 `Telefonate`
- Überschrift sollte Kontakt heißen
- es soll dann mehrere Buttons geben anstatt nur Telefonat spiechern, auch Telefonat, Whatsapp, Mail, Persönlich, die könnten per Radiobutton ausgewählt werden, hier git es noch keine Passende Formatierung, die dann dem UI entspricht, mach dafür eine passendes CSS Klasse, Der Bttun soll sich flexibel anpassen, sobald man den Radiobutton auswählt, muss der Text vom AbsendenButtton auch verändert werden. Standart ist immer Telefonat
- Das Nachfrangen zu löschen dem aktuellen Design anpassen erst Ja dann Nein Ja ist in diesem Fall rot und Nein Grün, den Hintergrund anpassen und kleiner Border mit Schatttierung
- Beim Verlassen des Textfeldes müssen die eingegebenen Daten erhalten bleiben wenn man die Tasb wechselt. Wenn man wieder zurückkommt, soo der Text wieder da stehen und der Cursor an alter stelle bleiben


## Schritt 1.9 `Bewerbung löschen`
- hier auch ein Popup ausführen anstatt alert, eine Vorlage gibt es ja schon, nach dem Löschen die overveiw Daten anpassen die gelöschte wird derzeit noch immer angezeigt

## Schritt 1.9 `Ansprechpartner hinzufügen`
- das Popup soll auch dem Design angepasst werden. Die Felder wie die ansicht designen, nur mit etwas helleren hintergrund anzeigen


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
