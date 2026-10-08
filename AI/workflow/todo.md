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

## Firmenbeschreibung / companyInformation
- Die Firmenbeschreibung stammt aus dem Fließtext der `companyInformation`-Sektion.
  "Details zum Jobangebot" mappt bewusst auf `companyInformation` (firmenspezifische
  Angaben, nicht die Stelle selbst).
- Stellenbezeichnungen ("... (m/w/d)") werden bereits herausgefiltert. Die
  LinkedIn-Kopfzeile "5001-10000 Mitarbeiter:innen" bleibt derzeit in der Beschreibung
  und könnte ebenfalls herausgefiltert werden.
- `CompanyEditTemplate` bietet eine Auswahl "Rechtsform" (Schlüssel aus
  `LegalFormConstants.FORM`), ältere Testdaten enthalten dort aber gemischte Werte
  ("GmbH" statt "GMBH"), die nicht zur Optionsliste passen.

## Ansprechpartner-Extraktion (ContactExtractor)
- Ansprechpartner werden nur über eine Anrede ("Herr/Frau <Vorname> <Nachname>")
  erkannt. Namen ohne Anrede (z. B. reine Namenszeile oder "Ihr Ansprechpartner: …")
  werden nicht gefunden.
- Akademische Titel ("Dr.", "Prof. Dr.", "Dipl.-Ing." …) werden seit Sprint
  WORKFLOW.md erkannt und landen im Feld `name.title`; `NameModel.full` zeigt sie mit an.
- E-Mail und Telefon werden aus dem Kontaktblock gelesen (Namenszeile plus
  `ContactConstants.CONTACT_BLOCK_SIZE` Folgezeilen, Abbruch bei der nächsten Person).
  Liegt keine Kontaktzeile vor, bleiben die Felder leer und `UiContact` greift auf die
  Firmendaten zurück.
- Findet die Analyse keinen Ansprechpartner, legt `ContactEditTab.applyAnalysis()`
  einen Ersatzkontakt aus den Firmendaten an (Name = Firmenname, E-Mail, Telefon,
  Position = `job.title`).
- Offen: `JobExtractor.extractJob()` liefert `title: ""`. Die Stellenbezeichnung
  wird noch nicht extrahiert, daher bleibt `role` beim Ersatzkontakt meist leer.
- Offen: Die Positionszeile wird nur erkannt, wenn der Name als alleinstehende
  Zeile oder am Zeilenende vorkommt (nächste Zeile = Position).
## Seitenimport (URL / Bookmarklet)
- Die gefundenen Links (intern/extern) werden nur in der Konsole ausgegeben; im Model gibt es
  dafuer kein Feld. Speichern erst nach Entscheidung ueber Model/AppRecord.json.
- Seiten, die den Text erst per JavaScript nachladen (z. B. mit Login), liefert der
  Server-Abruf leer; das Bookmarklet liefert dort das fertig gerenderte HTML.
- Aufklapp-Knoepfe mit unbekannter Beschriftung werden nicht erkannt: Beschriftung in
  ImportConstants.EXPAND_LABELS ergaenzen.
- Automatischer Test von ImportJobPage braucht jsdom (DOMParser) als devDependency.
- Anzeigenbereich: Die Wachstumsgrenze (ImportConstants.GROWTH_LIMIT) ist eine Heuristik. Fehlt auf einer
  Boerse noch ein Bereich oder kommt zu viel dazu, Konsolenzeile "Bereich: ..." und Seitenaufbau pruefen.
- Fenster-Wiederverwendung: Der Browser findet ein App-Fenster nur, wenn es vom selben Tab/Fenster aus geoeffnet
  wurde (verwandte Fenster). Ein von Hand geoeffneter App-Tab oder ein anderer Job-Tab oeffnet ein neues Fenster.
  Seiten mit Cross-Origin-Opener-Policy koennen die Verbindung zum App-Fenster trennen; dann greift der Abruf der URL ueber den Server.
- Kopfzeile: Der Ort der Jobboerse wird als Arbeitsort (job.workLocation) uebernommen, nicht als Firmenadresse.

- Firmenseite: "Mehr anzeigen" der Info-Seite führt auf /company/<name>/home/. Wahrscheinlich Wiederholung, bei der nächsten Firma prüfen, ob dort weitere Angaben stehen.
- Info-Seite der Firma: Wird aus dem Firmennamen im Link gebildet (linkedin.com/company/<firmenname>/about/). Reihenfolge: 1. Lesezeichen lädt sie im unsichtbaren Rahmen (Browser des Benutzers), 2. sonst lädt der Server sie in einem echten Chrome (BrowserSession, Profil `.chrome-profile`), 3. sonst Hauptseite der Firma, 4. sonst Hinweis. Erst wenn der Chrome-Weg im echten Betrieb sicher läuft, kann der Rahmen entfallen.
- IndustryConstants: Die Branchenliste ordnet nur Stichwörter zu; im Company-Model steht weiter der Originaltext (industry). Ein Feld für den Schlüssel gibt es noch nicht.
- Standorte: Ein Standort ohne Hausnummer in der Adresse ("Gewerbepark, 9-11") wird bei der Hauptsitz-Zerlegung nur grob getrennt; betrifft nur den als "Primär" markierten Eintrag.

## Arbeitsmodell (WorkModel.js / ArbeitsModel)
- Neues Model `WorkModel.js` (deutsch: ArbeitsModel), das alle Arbeitsmodelle einer Stelle erfasst, statt nur der Tags in `job.workModel`:
  - Schichtarbeit (ja/nein, Schichtform wenn genannt, z. B. Früh-/Spät-/Nachtschicht, Wechselschicht)
  - Homeoffice / Remote (ja/nein, vollständig remote)
  - x Tage pro Woche vor Ort
  - x Tage pro Woche zuhause (Homeoffice)
  - Bedingungen und Hinweise als Text (z. B. "nach erfolgreicher Probezeit 2 Tage pro Woche im Homeoffice")
  - Gleitzeit / Teilzeit / Vollzeit bleiben in `employmentType`.
- Beispiel INSIDE M2M (Info-Seite): "Arbeitsmodell: Hybrid", "Übliche Anwesenheit vor Ort: 3 Tage pro Woche", "nach der Probezeit 2 Tage pro Woche im Homeoffice, einige Bereiche mit täglicher Präsenz".
- Quellen: Zeile "Arbeitsmodell: ...", "Übliche Anwesenheit vor Ort", Fließtext ("2 Tage pro Woche im Homeoffice"), Stichwörter (Schicht, Homeoffice, Remote, Hybrid). Als Konstanten in `WorkModelConstants.js`, Extraktion in `WorkModelExtractor.js`.
- Danach `AppRecord.json`, `Datenstruktur.md`, `Jobsinput.json` und Reiter/Detailansicht der Stelle anpassen. Erst auf Anweisung umsetzen (Models nur auf Anweisung ändern).

## Zu klären
- "Übliche Anwesenheit vor Ort" und der Homeoffice-Hinweis: gehören in das WorkModel (siehe oben).

## Anmeldung bei LinkedIn
- Kein automatisches Einloggen mit Zugangsdaten in der App (kein Passwort speichern oder übertragen, keine Browser-Automatisierung): LinkedIn untersagt automatisierten Zugriff, erkennt Bots, verlangt oft Zusatzprüfungen (Bestätigungscode, Captcha) und kann das Konto einschränken. Stattdessen nutzt das Lesezeichen die bereits angemeldete Sitzung des Benutzers im eigenen Browser.
- Das Lesezeichen lädt die Info-Seite der Firma in einem unsichtbaren Rahmen derselben Domain (ImportConstants.FRAME_WAIT_MS, FRAME_TIMEOUT_MS), klickt Cookie-Abfrage und "mehr" und schickt sie als zweite Seite. Pro Klick genau eine zusätzliche Seite, keine Schleifen.
- Offen (nicht im echten LinkedIn geprüft): Erlaubt LinkedIn den Rahmen nicht (X-Frame-Options/CSP) oder liegt die Seite auf einer anderen Subdomain (z. B. de.linkedin.com), ist der Rahmen nicht lesbar. Dann holt die App die Seite über den Server (gesperrt ohne Anmeldung) und zeigt sonst einen Hinweis; die Info-Seite lässt sich immer auch von Hand öffnen und mit dem Lesezeichen übernehmen.
- Offizielle Schnittstelle: Die LinkedIn-API für Firmendaten ist nur für zugelassene Partner verfügbar, daher nicht vorgesehen.

## Browser-Abruf (Chrome mit Fernsteuerung)
- Ablauf aus dem Importer "linkedin-importer-cdp v1.2.0" übernommen (eigenes Chrome, `--remote-debugging-port`, festes Profil, `PUT /json/new`, Zustand von Anmeldung/Captcha/Sperre, Cookie-Zustimmung, "mehr", Scrollen). Nicht übernommen: Ausfüllen von Zugangsdaten durch die App und die festen URLs/Ausgabedateien. Die Anmeldung erledigt der Benutzer einmal von Hand im Chrome-Fenster, sie bleibt im Profil.
- Voraussetzungen: Node.js 22 oder neuer (globales WebSocket), Chrome oder Edge; sonst Umgebungsvariable `CHROME_PATH`. Port 9222 (BrowserConstants.CDP_PORT) muss frei sein oder zu diesem Chrome gehören.
- Ein vom Server gestarteter Chrome wird nach 20 s ohne weiteren Abruf und beim Beenden des Servers geschlossen; ein schon laufender bleibt unberührt. Pro Abruf ein eigener Tab, der danach geschlossen wird.
- Offen: Gegen echtes LinkedIn nicht geprüft (nur gegen einen nachgebauten DevTools-Server). Zeiten (SETTLE_*, LOGIN_TIMEOUT_MS) in BrowserConstants anpassen, falls Seiten zu früh gelesen werden.
- Der Browser-Abruf liest nur die sichtbare Seite als schlankes HTML (BrowserScripts.readScript): ohne Skripte, <code>-Daten, versteckte und nur für Screenreader gedachte Elemente, Navigation, Seitenleisten und Fußbereich; mit Links und JSON-LD; hat die Seite ein <main> mit dem Großteil des Textes, nur dieses. Fehlt auf einer Seite dadurch Inhalt (z. B. in einem <aside>), SKIP_SELECTOR in readScript anpassen; `npm run browser:check` schreibt browser-check.txt (Text) und browser-check.html (Import-HTML) zur Kontrolle.
- Offen: Die erste Seite (Stellenanzeige) kommt weiter über das Lesezeichen. Über den Browser-Abruf lässt sie sich ebenfalls laden (Eingabe der Adresse im Dialog); die Suchergebnis-Adresse mit `currentJobId` ist dafür unzuverlässig, besser `linkedin.com/jobs/view/<id>/`.

- Anmeldung des Benutzers uebernehmen (Cookie-Replay, z. B. li_at an einen einfachen GET): bewusst nicht gebaut. Das Sitzungs-Cookie gibt vollen Zugriff auf das Konto, LinkedIn koppelt Sitzungen an Browser/Netz und sperrt abweichende Zugriffe (HTTP 999, Abmeldung), und die Seite enthaelt den Text meist nur in eingebetteten Daten. Der laufende Chrome des Benutzers laesst sich seit Chrome 136 nicht per Fernsteuerung uebernehmen (Fernsteuerung nur mit eigenem Profilordner). Daher: eigenes Profil `.chrome-profile`, einmal anmelden und Cookie-Hinweis bestaetigen.
- Auch fuer Handy-Apps: Der Abruf laeuft auf dem Rechner, auf dem der Server laeuft (Chrome dort installiert). Die Route /api/browser-fetch ist nur auf LinkedIn-Adressen beschraenkt, aber im Netz erreichbar; bei Zugriff von aussen absichern.
- Ersatzabruf nach 5 s (ImportInbox.expectBookmarklet): Kommt vom Lesezeichen keine Seite im neuen App-Fenster an (z. B. weil LinkedIn die Verbindung zum Fenster trennt), lädt die App die Stellenseite selbst über den Server/Chrome. Die Fehlermeldung nennt dann "automatischer Abruf". Ist das häufig, den Weg über das Lesezeichen prüfen oder die Wartezeit ImportConstants.FALLBACK_DELAY_MS anpassen.
- Fehlermeldungen (Typ "error") bleiben stehen, bis man sie wegklickt (Toast); die Dauer-Angabe gilt nur für andere Typen.
