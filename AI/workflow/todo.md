# Workflow TODO

Sammlung zurückgestellter Punkte ohne aktuell passende Datenquelle im Model,
oder für später geplante Funktionen. Wird ergänzt, sobald weitere Templates
bearbeitet werden.

## CompanyTemplate.js
- Feld "Tätigkeitsbeschreibung der Firma" war ein Duplikat der Selbstbeschreibung
  und wurde in Schritt 1.2 entfernt (explizite Entscheidung).

## RequirementsTemplate.js
- Feld "Fachliche Fähigkeiten / Technologien" (`application.skills`) hat keine
  Entsprechung in einem Model. Wird aktuell mit "Noch nicht implementiert" angezeigt.
  Mögliche Quelle: `job.tags`.

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