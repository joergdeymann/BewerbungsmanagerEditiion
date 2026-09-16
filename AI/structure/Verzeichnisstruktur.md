# Verzeichnisstruktur

Diese Datei beschreibt den aktuell vorgesehenen Verzeichnisbaum.

> Die konkrete Projektstruktur ist noch zu ergänzen.

## Projektbereiche

- `js/API/` – Zugriff auf Datenhaltung und externe Schnittstellen.
  - `LocalDB.js` – generischer Zugriff auf die IndexedDB (Object Stores, CRUD).
- `js/models/` – reine Datenmodelle ohne UI- oder DOM-Logik.
  - `JobModel.js`, `JobDetailModel.js`, `CompanyModel.js`, `ContactModel.js`,
    `AddressModel.js`, `StreetModel.js`, `CityModel.js`,
    `QualificationModel.js`, `ReferenceModel.js`

## Regeln

- Änderungen am Verzeichnisbaum müssen hier nachgezogen werden.
- Wird eine hier dokumentierte Struktur für eine vereinbarte Änderung benötigt, aber noch nicht angelegt, muss sie entsprechend dieser Dokumentation angelegt werden.
