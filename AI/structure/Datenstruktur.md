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
  `job`): `companyId`, `contactId`, `title`, `workLocation` (`AddressModel`),
  `employmentType`, `workModel` (Liste), `wage` (`WageModel`), `referenceNumber`,
  `tasks`, `tags`. `contactId` verweist auf den Primärkontakt der Liste
  `app.contacts` (siehe `AppModel.primaryContact`).
- `WageModel` – Gehaltsangaben: `yearly` (`{ min, max }` in Jahr, `null` wenn keine
  Angabe), `monthly`, `gross` (`true` = brutto, `false` = netto; **Vorgabe ist
  brutto**, weil Stellenanzeigen ohne Angabe in der Regel Bruttobeträge nennen),
  `currency` (z. B. `EUR`), `holiday` (Urlaubsgeld) und `christmas`
  (Weihnachtsgeld) als Zahl oder `null`. Nennt die Anzeige keinen Betrag, sondern
  einen Anteil („mit einem halben Gehalt Urlaubsgeld im Gepäck“), wird das
  Urlaubsgeld aus dem Monatsgehalt bzw. dem Mindest-Jahresbetrag / 12 berechnet
  (`ParserConstants.MONEY_FRACTIONS`, `MONEY_FRACTION_VALUES`). `holidayText` hält
  den Originaltext der Anzeige („mit einem halben Gehalt Urlaubsgeld im Gepäck“),
  `holidayFraction` den erkannten Anteil (`0.5`, `1/3`, `2/3` oder `null`).
  `holidayIsFraction` und `holidayNote` sind abgeleitete Getter: `holidayNote`
  liefert den Hinweistext für die Anzeige, z. B. „Das Urlaubsgeld ist ein halber
  Monatsgehalt. Der angezeigte Betrag ist das Minimum auf Basis des Minimum der
  Gehaltsspanne.“ Die Editor-Felder
  „Gehalt (von/bis)“, „Währung“, „Gehaltsart“, „Urlaubsgeld“, „Urlaub (Originaltext
  der Anzeige)“ und „Weihnachtsgeld“ werden in `JobEditTab.init()` / `save()`
  genau auf diese Felder abgebildet. Die
  früheren Felder `salary`, `vacationPay` und `christmasPay` sind ersetzt.
- `CompanyModel` – Firmendaten: `id`, `name`, `legalForm`, `ownership`, `relationship`, `industry`,
  `size`, `founded`, `website`, `email`, `phone`, `address`, `verifiedAt`, `description`, `specialties`,
  `images`, `branches` (`BranchModel`). `ownership` ist die Eigentumsform ("Privatunternehmen",
  "Öffentliches Unternehmen", LinkedIn: "Typ") und bleibt getrennt von `legalForm` (GmbH, AG).
  `relationship` unterscheidet Hauptsitz, Filiale und Arbeitsort. Aktuell hält `AppModel` genau eine `CompanyModel`-Instanz (keine Liste).
  `industry` ist der Branchentext der Anzeige; die Zuordnung zu Branchen und Stichwörtern
  steht in `IndustryConstants`. `size` ist der Bereich ("51-200") oder eine Zahl mit "+" ("40+").
- `BranchModel` – Standorte des Unternehmens: `locations` (Liste von Texten, z. B.
  "Kohake Center – Berenbosteler Str. 76 B, Garbsen, Deutschland 30823") und `count`
  (Anzahl der Standorte; mindestens die Länge der Liste, größer wenn die Anzeige mehr
  Standorte nennt als Adressen angegeben sind, z. B. "an drei Standorten").
- `ContactModel` – Ansprechpartner: `id`, `role`, `name` (`NameModel`), `img`, `email`, `phone`.
- `NameModel` – Personenname: `salutation` (Anrede, z. B. Herr/Frau), `title`
  (akademischer Titel), `firstname`, `lastname`. `full` liefert die
  zusammengesetzte Anzeige inkl. Anrede und Titel (z. B. "Herr Dr. Max
  Mustermann"). Aktuell von `ContactModel` genutzt, für weitere Personen
  (z. B. Bewerber) vorgesehen.
- `AddressModel` – Anschrift aus `StreetModel`, `CityModel` und `postBox`.
  `lines(company, contact)` setzt die vollständige Postanschrift zusammen und holt
  Firmenname und Ansprechpartner aus den übergebenen Models.
- `StreetModel` – `name`, `houseNumber`.
- `CityModel` – `zipCountry`, `zip`, `city`, `country`.
- `QualificationModel` – drei Bereiche `required`, `preferred`, `personal`,
  jeweils mit `tags` und `content`.
- `CapturedContentModel` – Basisklasse für erfassten Text mit Quelle: `id`, `url`,
  `capturedAt`, `content`. Wird von `ReferenceModel` und `ImportedTextModel` geerbt,
  damit beide unabhängig voneinander eigene Zusatzfelder bekommen können.
- `ReferenceModel` (erbt `CapturedContentModel`) – Quelle einer Erfassung: `id`, `url`,
  `capturedAt`, `content`, zusätzlich `name`. Wird als Liste (`references`) direkt von
  `AppModel` geführt; erscheint in der Detail-Ansicht unter "Quellen".
- `ImportedTextModel` (erbt `CapturedContentModel`) – ein roher, importierter Textblock
  für die Analyse-Pipeline im Editor: `id`, `url`, `capturedAt`, `content`. Wird als Liste
  (`importedRawData`) direkt von `AppModel` geführt. Erscheint einseitig zusätzlich in der
  Detail-"Quellen"-Liste (Anzeige-Ebene only), nie umgekehrt - `references` bleibt von
  `importedRawData` komplett unabhängig.
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
 │              │              └ CityModel
 │              └ BranchModel
 ├─ ContactModel (Liste) ─ NameModel
 ├─ QualificationModel
 ├─ BenefitsModel
 ├─ ReferenceModel (Liste) ─ erbt CapturedContentModel
 ├─ ImportedTextModel (Liste, importedRawData) ─ erbt CapturedContentModel
 └─ ApplicationModel
     ├─ ApplicationStatusHistoryModel (Liste)
     └─ ApplicationHistoryModel (Liste)
         └─ entry: ApplicationPortalModel | ApplicationEmailModel |
                    ApplicationPhoneModel | ApplicationPersonalModel
```

## Regeln

- Änderungen an der Datenstruktur müssen hier nachgezogen werden.
- Wird eine hier dokumentierte Struktur für eine vereinbarte Änderung benötigt, aber noch nicht angelegt, muss sie entsprechend dieser Dokumentation angelegt werden.