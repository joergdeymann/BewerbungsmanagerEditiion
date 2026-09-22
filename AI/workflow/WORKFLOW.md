# Entwicklungs-Sprint (Workflow 01)

## 1. Ziel
- Bewerbungsverwaltung überarbeiten: Löschen korrigieren, Ansprechpartner-Popup anpassen und Architektur prüfen.

## 2. Schritte
- [ ] **Schritt 1.10:** Bewerbung löschen
  - Bestätigungs-Popup statt `alert` verwenden.
  - Vorhandene Popup-Vorlage verwenden.
  - Nach dem Löschen Overview aktualisieren; gelöschte Bewerbung darf nicht weiter angezeigt werden.

- [ ] **Schritt 1.11:** Ansprechpartner hinzufügen
  - Popup an bestehendes Design anpassen.
  - Felder wie in der Ansicht gestalten.
  - Eingabefelder mit etwas hellerem Hintergrund darstellen.

- [ ] **Schritt 2:** Architektur überprüfen

  - Gewünschte Datenstruktur:

    ```text
    js/
    ├── controllers/
    │   ├── edit/
    │   └── details/
    │
    ├── events/
    │   ├── edit/
    │   └── details/
    │
    ├── views/
    │   ├── edit/
    │   └── details/
    │
    ├── templates/
    │   ├── edit/
    │   └── details/
    │
    └── ui/
        ├── edit/
        └── details/
    ```

  - Verantwortlichkeiten:
    - `templates/` = HTML-Strukturen und `${}`-Platzhalter.
    - `views/` = Rendering und Verarbeitung der Templates.
    - `events/` = Benutzeraktionen und EventListener.
    - `controller/` = Ablaufsteuerung und Anwendungslogik.
    - `store/` = Datenzugriff.
    - `ui/` = Datenfluss zwischen Daten und Views.

  - Ablauf:
    - templates holen keine Daten und erzeugen keine EventListener.
    - templates erhalten fertige Werte und erzeugen daraus HTML.
    - views rendern die Templates.
    - events werden nach dem Rendern gebunden.
    - events rufen die zuständigen Controller-Aktionen auf.
    - controller koordinieren Datenzugriff, Verarbeitung und Aktualisierung der Views.
    - store übernimmt ausschließlich den Datenzugriff.
    - ui vermittelt ausschließlich den definierten Datenfluss.

  - Prüfung:
    - Bestehende Dateien und Abhängigkeiten analysieren.
    - Verantwortlichkeiten der vorhandenen Dateien prüfen.
    - Unklare oder doppelte Zuständigkeiten identifizieren.
    - Erforderliche Controller und Event-Klassen je Ebene bestimmen.
    - Bestehende Struktur nur ändern, wenn sie der neuen Trennung widerspricht.
    - Vor dem Umbau die vorgeschlagene Zielstruktur vorlegen.