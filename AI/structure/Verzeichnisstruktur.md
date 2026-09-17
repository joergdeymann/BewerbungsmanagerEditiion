# Verzeichnisstruktur

Diese Datei beschreibt den aktuell vorgesehenen Verzeichnisbaum.

> Die konkrete Projektstruktur ist noch zu ergänzen.

## Projektbereiche
- `AI/structure/` – Verzeichnisstruktur, Datenstrukturebn auch `AppRecord.json` der KI-Vorgaben
- `js/ui/` – UI-Logik (HTML, CSS, JavaScript)
- `js/io/` – Zukunft: Daten-IO (lokale Datenbank, Dateisystem) jetzte noch `js/data/`
- `js/utils/` – allgemeine Funktionen und Klassen, die wieder gebrauch werden
- `js/constants/` – alle Konstanten des Projekts
- `js/data/` – lokaler Datenzugriff (Persistenz), keine externen Aufrufe.
  - `LocalDB.js` – generischer Zugriff auf die IndexedDB (Object Stores, CRUD).
  - `AppDB.js` – speichert und lädt `AppModel`-Daten über `LocalDB` im Store `Bewerbungsmanager`.
- `js/api/` – externe Schnittstellen (Aufrufe an den eigenen Server bzw. Dritte).
  - `UrlImporter.js` – ruft `/api/fetch-url` auf dem lokalen Server auf und wandelt die
    gelieferte HTML-Seite in reinen Text um.
- `js/analysis/` – Auswertung des importierten Stellenanzeigentexts.
  - `parser/` – zerlegt den Rohtext in Abschnitte und Zeilen
    (`ParseText.js`, `SectionParser.js`, `SectionPart.js`, `LineParser.js`,
    `TextCleaner.js`).
  - `extractors/` – ziehen einzelne Fachdaten aus dem geparsten Text
    (`CompanyExtractor.js`, `CompanyNameExtractor.js`, `DomainExtractor.js`,
    `EmailExtractor.js`, `JobExtractor.js`, `LocationExtractor.js`,
    `MoneyExtractor.js`, `PhoneExtractor.js`, `PostBoxExtractor.js`,
    `QualificationExtractor.js`, `StreetExtractor.js`, `TaskExtractor.js`,
    `BenefitExtractor.js`).
- `js/models/` – reine Datenmodelle ohne UI- oder DOM-Logik.
  - `AppModel.js`
  - `JobModel.js`
  - `CompanyModel.js`
  - `ContactModel.js`
  - `AddressModel.js`
  - `StreetModel.js`
  - `CityModel.js`
  - `QualificationModel.js`
  - `ReferenceModel.js`
  - `BenefitsModel.js`
  - `ApplicationModel.js`
  - `ApplicationStatusHistoryModel.js`
  - `ApplicationHistoryModel.js`
  - `ApplicationPortalModel.js`
  - `ApplicationEmailModel.js`
  - `ApplicationPhoneModel.js`
  - `ApplicationPersonalModel.js`
- `js/io/ImportJobPage.js`  - idee: importiert eine Seite mit einem Stellenanzeigen, Vorlage aus den Models und Ziel das DOM vielleicht heisen die auch DOM-Logik später, ich habe ja derzeit meein ui Verzeichnis für

## Regeln

- Änderungen am Verzeichnisbaum müssen hier nachgezogen werden.
- Wird eine hier dokumentierte Struktur für eine vereinbarte Änderung benötigt, aber noch nicht angelegt, muss sie entsprechend dieser Dokumentation angelegt werden.
