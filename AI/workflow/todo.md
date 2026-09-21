# Workflow TODO

Sammlung zurückgestellter Punkte ohne aktuell passende Datenquelle im Model,
oder für später geplante Funktionen. Wird ergänzt, sobald weitere Templates
bearbeitet werden.

## CompanyTemplate.js
- Feld "Tätigkeitsbeschreibung der Firma" war ein Duplikat der Selbstbeschreibung
  und wurde in Schritt 1.2 entfernt (explizite Entscheidung).

## RequirementsTemplate.js
- Feld "Fachliche Fähigkeiten / Technologien" war ein Duplikat der
  Muss-Anforderungen und wurde in Schritt 1.3 entfernt. Stattdessen werden
  jetzt die Tags aus `qualifications.*.tags` als Badges angezeigt.

## SourcesTemplate.js
- Felder "Stellenanzeige" (Link zur Stellenanzeige selbst) und "Quelle"
  (z. B. LinkedIn/Indeed) haben keine Entsprechung in einem Model.
  Wird aktuell mit "Noch nicht implementiert" angezeigt.

## Bearbeitung / Editor
- Editier-Modus für Tabs (Eingabefelder, Speichern) existiert noch nicht,
  nur Anzeige. Siehe Rückfrage zu ContactTab.
- `ContactModel` unterstützt nur ein Bild (`img`), keine Bildergalerie
  wie im alten `ContactTab.js`/`ImageGallery.js`.

## ApplicationTemplate.js / Legende
- "Neu angelegt" und "Antwort der Firma erhalten" werden aktuell beim Rendern
  aus `createDate`/`statusHistory` abgeleitet (nicht als echte `history`-Einträge
  gespeichert). Sobald der Editor Datensätze anlegt bzw. Status ändert, sollten
  diese Aktionen direkt als `ApplicationHistoryModel`-Einträge geschrieben werden.
- `<details class="history-entry">` ist aktuell ungestylt (Browser-Standard).
  Styling + Individualisierung pro Aktionstyp steht noch aus.

## Tags / Kenntnisstufen (neues Feature)
- Alle Tags aus allen Stellen der App sammeln (Job-Badges, Benefits-Tags,
  Qualifikations-Tags aus allen drei Bereichen usw.) und daraus eine
  zusätzliche einheitliche Tag-Liste erstellen.
- Jedes Tag bekommt eine Kenntnisstufe: 0 = keine Kenntnisse,
  1 = Grundkenntnisse, 2 = erweiterte Kenntnisse, 3 = Expertenkenntnisse.
- Eigene Seite, auf der alle Tags als klickbare Elemente aufgelistet werden.
- Klick auf ein Tag erhöht die Stufe um 1 (0→1→2→3), ein weiterer Klick bei
  Stufe 3 springt zurück auf 0.
- jeder Tag bekommt eine farbe, als hintergrund, grau bei Stufe 0, blau bei Stufe 1,
  grün bei Stufe 2, lila bei Stufe 3.

## SourcesTemplate.js / Datenerfassung
- Quellen (`references[]`) sollten bereits bei der Erfassung (Import/Analyse
  einer Stellenanzeige) automatisch gespeichert werden - inkl. Firmenwebsite,
  gefundener Bilder usw. als eigene `ReferenceModel`-Einträge.
- Diese Erfassung selbst ist noch nicht implementiert. Aktuell müssen
  Quellen manuell in `references[]` stehen, damit sie hier angezeigt werden.
- `SourcesTemplate.js` zeigt bewusst nur, was in `references[]` gespeichert
  ist - keine Live-Ableitung aus Firmenwebsite/Bildern mehr.