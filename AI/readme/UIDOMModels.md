# UI / DOM / Models

## Klassen

- Eine Klasse soll eine klar definierte Verantwortung haben.
- Namen sollen die tatsächliche Verantwortung der Klasse beschreiben.
- UI-Klassen und Datenmodelle klar voneinander trennen.

## UI / DOM

- DOM-Elemente möglichst nur einmal suchen und anschließend wiederverwenden.
- DOM-Zugriffe nicht unnötig innerhalb von Schleifen durchführen.
- Datenlogik nicht unnötig mit DOM-Manipulation vermischen.
- Klassen wie `UiCompanyElements` verwalten konkrete DOM-Elemente.
- Übergeordnete UI-Klassen wie `UiCompany` können den gesamten UI-Aufbau übernehmen.

## Models

- Models enthalten ausschließlich Daten und keine UI- oder DOM-Logik.
- Models werden nicht direkt aus der UI heraus umgebaut oder durch UI-spezifische Eigenschaften erweitert.
- Änderungen an Model-Daten erfolgen über die dafür vorgesehenen UI-Klassen bzw. deren `fromHTML()`-Methoden.
- UI-Klassen arbeiten mit dem Model und stellen dessen Daten dar.
- `Ui...Elements` kümmern sich ausschließlich um die Zuordnung zwischen Model-Daten und konkreten DOM-Elementen.
- Ein Model soll möglichst unabhängig davon sein, wo und wie es dargestellt wird.

## Grundstruktur

```text
Model
  ↓
Ui...
  ↓
Ui...Elements
  ↓
DOM / HTML
```
