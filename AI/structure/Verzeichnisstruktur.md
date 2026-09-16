# Verzeichnisstruktur

Diese Datei beschreibt den aktuell vorgesehenen Verzeichnisbaum.

> Die konkrete Projektstruktur ist noch zu ergänzen.

## Projektbereiche

- `js/API/` – Zugriff auf Datenhaltung und externe Schnittstellen.
  - `LocalDB.js` – generischer Zugriff auf die IndexedDB (Object Stores, CRUD).
  - `JobDB.js` – speichert und lädt `AppModel`-Daten über `LocalDB` im Store `Bewerbungsmanager`.
- `js/models/` – reine Datenmodelle ohne UI- oder DOM-Logik.
  - `AppModel.js`, `JobModel.js`, `CompanyModel.js`, `ContactModel.js`,
    `AddressModel.js`, `StreetModel.js`, `CityModel.js`,
    `QualificationModel.js`, `ReferenceModel.js`, `BenefitsModel.js`,
    `ApplicationModel.js`, `StatusHistoryModel.js`, `ApplicationHistoryModel.js`,
    `ApplicationPortalModel.js`, `ApplicationEmailModel.js`,
    `ApplicationPhoneModel.js`, `ApplicationPersonalModel.js`

## Regeln

- Änderungen am Verzeichnisbaum müssen hier nachgezogen werden.
- Wird eine hier dokumentierte Struktur für eine vereinbarte Änderung benötigt, aber noch nicht angelegt, muss sie entsprechend dieser Dokumentation angelegt werden.
