# Datenstruktur

Diese Datei beschreibt die aktuell vorgesehenen Models, Datenstrukturen und deren Beziehungen.

Alle Models stellen ihre Daten über `get data` / `set data` bereit. Die flache Form von
`data` entspricht der JSON-Struktur aus `/dok/output.json`.

## Models

- `JobModel` – Klammer um einen Datensatz: `id`, `createDate`, `company`, `contacts`,
  `benefits`, `actionHistory`, `importedRawData`.
- `JobDetailModel` – Stellendaten: `companyId`, `contactId`, `title`, `workLocation`,
  `employmentType`, `workModel`, `salary`, `vacationPay`, `christmasPay`,
  `referenceNumber`, `tasks`, `tags`.
- `CompanyModel` – Firmendaten: `id`, `name`, `legalForm`, `relationship`, `industry`,
  `size`, `founded`, `website`, `address`, `verifiedAt`, `description`, `specialties`,
  `img`, `foundImages`. `relationship` unterscheidet Hauptsitz, Filiale und Arbeitsort.
- `ContactModel` – Ansprechpartner: `name`, `email`, `phone`.
- `AddressModel` – Anschrift aus `StreetModel`, `CityModel` und `postBox`.
  `lines(company, contact)` setzt die vollständige Postanschrift zusammen und holt
  Firmenname und Ansprechpartner aus den übergebenen Models.
- `StreetModel` – `name`, `houseNumber`.
- `CityModel` – `zipCountry`, `zip`, `city`, `country`.
- `QualificationModel` – drei Bereiche `required`, `preferred`, `personal`,
  jeweils mit `tags` und `content`.
- `ReferenceModel` – Quelle einer Erfassung: `id`, `name`, `url`, `capturedAt`, `content`.

## Beziehungen

```text
JobModel
 ├─ CompanyModel ─ AddressModel ─ StreetModel
 │                              └ CityModel
 ├─ ContactModel (Liste)
 ├─ JobDetailModel
 ├─ QualificationModel
 └─ ReferenceModel (Liste)
```

## Regeln

- Änderungen an der Datenstruktur müssen hier nachgezogen werden.
- Wird eine hier dokumentierte Struktur für eine vereinbarte Änderung benötigt, aber noch nicht angelegt, muss sie entsprechend dieser Dokumentation angelegt werden.
