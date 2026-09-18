# Datenstruktur

Diese Datei beschreibt die aktuell vorgesehenen Models, Datenstrukturen und deren Beziehungen.

Alle Models stellen ihre Daten über `get data` / `set data` bereit. Die flache Form von
`data` entspricht der JSON-Struktur aus `/AI/structure/AppRecord.json`.

## Models

- `AppModel` – Klammer um einen Datensatz (vormals `JobModel`), entspricht dem
  JSON-Wrapper `app`: `id`, `createDate`, `status`, `updatedAt`, `job`, `company`,
  `contacts`, `qualifications`, `benefits`, `application`, `references`,
  `actionHistory`, `importedRawData`.
- `JobModel` – Stellendaten (vormals `JobDetailModel`, entspricht JSON-Schlüssel
  `job`): `companyId`, `contactId`, `title`, `workLocation`,
  `employmentType`, `workModel`, `salary`, `vacationPay`, `christmasPay`,
  `referenceNumber`, `tasks`, `tags`.
- `CompanyModel` – Firmendaten: `id`, `name`, `legalForm`, `relationship`, `industry`,
  `size`, `founded`, `website`, `address`, `verifiedAt`, `description`, `specialties`,
  `images`. `relationship` unterscheidet Hauptsitz, Filiale und Arbeitsort. Aktuell hält
  `AppModel` genau eine `CompanyModel`-Instanz (keine Liste); eine Filialliste ist
  zurückgestellt.
- `ContactModel` – Ansprechpartner: `id`, `role`, `name`, `img`, `email`, `phone`.
- `AddressModel` – Anschrift aus `StreetModel`, `CityModel` und `postBox`.
  `lines(company, contact)` setzt die vollständige Postanschrift zusammen und holt
  Firmenname und Ansprechpartner aus den übergebenen Models.
- `StreetModel` – `name`, `houseNumber`.
- `CityModel` – `zipCountry`, `zip`, `city`, `country`.
- `QualificationModel` – drei Bereiche `required`, `preferred`, `personal`,
  jeweils mit `tags` und `content`.
- `ReferenceModel` – Quelle einer Erfassung: `id`, `name`, `url`, `capturedAt`, `content`.
  Wird als Liste (`references`) direkt von `AppModel` geführt.
- `BenefitsModel` – Benefits als `tags` + `content`, gleiches Format wie ein Bereich
  von `QualificationModel`.
- `ApplicationModel` – die eigentliche Bewerbung: `status`, `appliedAt`, `channel`
  (`portal` | `email` | `phone` | `personal`), `coverLetter`, `resume`,
  `emailCoverLetter`, `signature`, `statusHistory` (Liste
  `ApplicationStatusHistoryModel`), `history` (Liste `ApplicationHistoryModel`).
  `addStatus(status, reason)` hängt einen neuen Statuseintrag an und setzt `status`.
- `ApplicationStatusHistoryModel` – Statusänderung: `date`, `status`, `reason`.
- `ApplicationHistoryModel` – ein Kontaktereignis: `channel` plus `entry`, das je nach
  `channel` eine Instanz von `ApplicationPortalModel`, `ApplicationEmailModel`,
  `ApplicationPhoneModel` oder `ApplicationPersonalModel` enthält.
- `ApplicationPortalModel` – `date`, `portalName`, `website`, `username`, `password`
  (nur der verschlüsselte Wert), `information`.
- `ApplicationEmailModel` – `date`, `emailTo`, `emailFrom`, `subject`, `content`,
  `attachments` (Liste von Links).
- `ApplicationPhoneModel` – `date`, `phoneTo`, `phoneFrom`, `content`.
- `ApplicationPersonalModel` – `date`, `address`, `content`.

## Beziehungen

```text
AppModel
 ├─ JobModel
 ├─ CompanyModel ─ AddressModel ─ StreetModel
 │                              └ CityModel
 ├─ ContactModel (Liste)
 ├─ QualificationModel
 ├─ BenefitsModel
 ├─ ReferenceModel (Liste)
 └─ ApplicationModel
     ├─ ApplicationStatusHistoryModel (Liste)
     └─ ApplicationHistoryModel (Liste)
         └─ entry: ApplicationPortalModel | ApplicationEmailModel |
                    ApplicationPhoneModel | ApplicationPersonalModel
```

## Regeln

- Änderungen an der Datenstruktur müssen hier nachgezogen werden.
- Wird eine hier dokumentierte Struktur für eine vereinbarte Änderung benötigt, aber noch nicht angelegt, muss sie entsprechend dieser Dokumentation angelegt werden.
