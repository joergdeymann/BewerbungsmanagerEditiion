# Workflow TODO

Sammlung zurückgestellter Punkte ohne aktuell passende Datenquelle im Model,
oder für später geplante Funktionen. Wird ergänzt, sobald weitere Templates
bearbeitet werden.

## CompanyTemplate.js
- Feld "Tätigkeitsbeschreibung der Firma" hatte im alten Template `application.tasks`
  (Job-Aufgaben) als Inhalt - bereits dort als falsch markiert ("ACHTUNG FALSCHER INHALT").
  Keine passende Datenquelle in `CompanyModel` vorhanden. Wird aktuell mit
  "Noch nicht implementiert" angezeigt.

## RequirementsTemplate.js
- Feld "Fachliche Fähigkeiten / Technologien" (`application.skills`) hat keine
  Entsprechung in einem Model. Wird aktuell mit "Noch nicht implementiert" angezeigt.
  Mögliche Quelle: `job.tags`.

## Bearbeitung / Editor
- Editier-Modus für Tabs (Eingabefelder, Speichern) existiert noch nicht,
  nur Anzeige. Siehe Rückfrage zu ContactTab.
- `ContactModel` unterstützt nur ein Bild (`img`), keine Bildergalerie
  wie im alten `ContactTab.js`/`ImageGallery.js`.