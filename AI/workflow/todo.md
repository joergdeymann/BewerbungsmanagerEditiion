# Workflow TODO

Sammlung zurückgestellter Punkte und für später geplanter Funktionen.
Erledigtes steht nicht mehr hier, sondern in `AI/log/log.md`.
Stand: 2026-10-13 (ArbeitsModel umgesetzt)

## Quellen (SourcesTemplate.js / Datenerfassung)
- `SourcesTemplate.js`: Die Felder "Stellenanzeige" (Link zur Anzeige selbst) und "Quelle"
  (z. B. LinkedIn/Indeed) zeigen noch "Noch nicht implementiert". Sie haben keine Entsprechung
  in einem Model.
- Quellen (`references[]`) sollen bei der Erfassung automatisch gespeichert werden.
  Importierte Texte sind bereits umgesetzt. Offen:
  - Firmenwebsite als eigener `ReferenceModel`-Eintrag.
  - Bild-URLs der Ansprechpartner (`contact.img`) als eigene `ReferenceModel`-Einträge.
    Bilder werden nur für Ansprechpartner benötigt, daher nur diese.
- `SourcesTemplate.js` zeigt bewusst nur, was in `references[]` gespeichert ist
  (keine Live-Ableitung aus Firmenwebsite/Bildern).
- Quellen-Liste: Sortierung per Spaltenüberschrift ist angelegt; die Filterfunktion
  (Suchbegriff) ist noch zu prüfen bzw. umzusetzen (siehe `workflow01.md`, Schritt 1.5).

## Legende / History (ApplicationTemplate.js)
- "Neu angelegt" und "Antwort der Firma erhalten" werden beim Rendern aus `createDate`/`statusHistory`
  abgeleitet (nicht als echte `history`-Einträge gespeichert). Sobald der Editor Datensätze anlegt
  bzw. Status ändert, sollen diese Aktionen direkt als `ApplicationHistoryModel`-Einträge
  geschrieben werden.
- Grundstyling von `.history-entry` ist vorhanden (`css/content/history-entries.css`). Die
  Individualisierung pro Aktionstyp steht noch aus.

## Ansprechpartner (ContactExtractor)
- Ansprechpartner werden nur über eine Anrede ("Herr/Frau <Vorname> <Nachname>") erkannt.
  Namen ohne Anrede (reine Namenszeile, "Ihr Ansprechpartner: …") werden nicht gefunden.
- Die Positionszeile wird nur erkannt, wenn der Name als alleinstehende Zeile oder am
  Zeilenende vorkommt (nächste Zeile = Position).
- `ContactModel` unterstützt ein Bild (`img`). Bilder werden nur für Ansprechpartner benötigt;
  Ablage in den Quellen siehe oben.

## Firmendaten
- IndustryConstants: Die Branchenliste ordnet nur Stichwörter zu; im Company-Model steht weiter
  der Originaltext (`industry`). Ein Feld für den Schlüssel gibt es noch nicht.
- `CompanyEditTemplate`: Die Auswahl "Rechtsform" nutzt Schlüssel aus `LegalFormConstants.FORM`.
  Ältere Testdaten enthalten gemischte Werte ("GmbH" statt "GMBH"), die nicht zur Optionsliste
  passen. Testdaten anpassen.
- Standorte: Ein Standort ohne Hausnummer in der Adresse ("Gewerbepark, 9-11") wird bei der
  Hauptsitz-Zerlegung nur grob getrennt; betrifft nur den als "Primär" markierten Eintrag.
- Firmenseite: "Mehr anzeigen" der Info-Seite führt auf `/company/<n>/home/`. Wahrscheinlich
  Wiederholung; bei der nächsten Firma prüfen, ob dort weitere Angaben stehen.

## Seitenimport (URL / Bookmarklet / Browser-Abruf)
- Die gefundenen Links (intern/extern) werden nur in der Konsole ausgegeben; im Model gibt es
  dafür kein Feld. Speichern erst nach Entscheidung über Model/`AppRecord.json`.
- Automatischer Test von `ImportJobPage` braucht `jsdom` (DOMParser) als devDependency.
- Aufklapp-Knöpfe mit unbekannter Beschriftung werden nicht erkannt: Beschriftung in
  `ImportConstants.EXPAND_LABELS` ergänzen (laufend, bei neuen Jobbörsen).
- Anzeigenbereich: Die Wachstumsgrenze (`ImportConstants.GROWTH_LIMIT`) ist eine Heuristik.
  Fehlt auf einer Börse ein Bereich oder kommt zu viel dazu, Konsolenzeile "Bereich: ..." und
  Seitenaufbau prüfen.
- Route `/api/browser-fetch` ist auf LinkedIn-Adressen beschränkt, aber im Netz erreichbar;
  bei Zugriff von außen (z. B. Handy-Apps) absichern.
- Mögliche Erweiterung: "Aktuelle LinkedIn-Stelle importieren" per Knopf in der App. Der Server
  liest dann den geöffneten LinkedIn-Tab im vom Server gesteuerten Chrome (Tabs per Titel/Adresse
  suchbar), braucht kein Lesezeichen und funktioniert auch von Handy-Apps aus.
- Seiten, die den Text erst per JavaScript nachladen (z. B. mit Login), liefert der
  Server-Abruf ohne Browser leer; das Bookmarklet bzw. der Chrome-Abruf liefert dort das
  gerenderte HTML.

## Getroffene Entscheidungen (zur Erinnerung, keine Aufgaben)
- Kein automatisches Einloggen mit Zugangsdaten und kein Cookie-Replay (`li_at`): LinkedIn
  untersagt automatisierten Zugriff, koppelt Sitzungen an Browser/Netz und sperrt abweichende
  Zugriffe; das Sitzungs-Cookie gibt vollen Kontozugriff. Stattdessen: Lesezeichen mit der
  Sitzung des Benutzers bzw. eigener Chrome mit Profil `.chrome-profile` (einmal von Hand anmelden).
- Offizielle LinkedIn-API für Firmendaten ist nur für zugelassene Partner verfügbar, daher
  nicht vorgesehen.
- Chrome-Fernsteuerung des laufenden Benutzer-Chrome ist seit Chrome 136 nicht möglich
  (nur mit eigenem Profilordner).
- "Tätigkeitsbeschreibung der Firma" entfernt (Duplikat der Selbstbeschreibung).
- "Fachliche Fähigkeiten / Technologien" entfernt (Duplikat der Muss-Anforderungen); stattdessen
  Tags aus `qualifications.*.tags` als Badges.
- "Privatunternehmen" ist die Eigentumsform (`ownership`), nicht die Rechtsform.
- Bilder werden nur für Ansprechpartner benötigt.