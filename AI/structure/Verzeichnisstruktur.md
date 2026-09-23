# Vollständige Verzeichnisstruktur (Token-Optimiert)

## 1. Projekt-Übersicht (Hauptverzeichnis)
- **Wurzelverzeichnis:** Enthält Core-Konfigurationen (`package.json`, `server.js`, `index.html`) und Automatisierungs-Skripte (`push.psl`).
- **Wichtige Alt-Dateien:** Bereinigte oder veraltete Skripte im Root nicht für neue Workflows nutzen (`old-server.js`).

## 2. Strukturbaum (Nach Bereichen gruppiert)

### 📂 AI & Dokumentation (Regeln, Logs, Sprints)
```text
AI/
├── AI_readmefirst.md     # Zentrale KI-Regeln (Strict Staccato)
├── log/                  # System-Logs
├── structure/
│   ├── AppRecord.json    # App-Metadaten
│   ├── Datenstruktur.md  # Daten-Schemata
│   └── Verzeichnisstruktur.md (Diese Datei)
└── workflow/
    ├── log.md            # Aktuelles Workflow-Log (English Flags)
    ├── todo.md           # Offene Tasks & Status
    ├── workflow01.md     # Aktueller Sprint-Ablauf
    └── NewFiles/         # Sammelordner für neu generierte Module
```

### 📂 Frontend-Ressourcen (Styles & Assets)
```text
├── assets/               # Globale SVGs und Icons
└── css/                  # Modulare Stylesheets
    ├── base/             # default.css, style.css
    ├── components/       # UI-Elemente (buttons, input, status, windows)
    ├── content/          # Spezifische Sektionen (cards, communication, badges)
    ├── layout/           # Grundgerüst (body, footer, header)
    └── pages/            # Seiten-Styles (editor, overview)
```

### 📂 Applikations-Logik (JavaScript MVC Architektur)
```text
└── js/
    ├── app.js            # Haupteinstiegspunkt (Frontend)
    ├── analysis/         # Parser & Data-Extractor (Regex, Text-Cleaning)
    ├── api/              # Netzwerk-Schnittstellen (UrlImporter.js)
    ├── constants/        # Systemweite Konstanten (Address-, Job-, WebConstants)
    ├── controllers/      # Ablaufsteuerung: Repository-Zugriff, Verarbeitung, Speichern
    │   ├── detail/       # Communication-, Contact-, DocumentsSectionController.js
    │   └── overview/     # OverviewListController.js
    ├── core/             # App-Steuerung (Router.js)
    ├── events/           # Reines EventListener-Binding, ruft die zugehörigen Controller
    │   ├── detail/       # Navigation-, Sources-, Communication-, Contact-, DocumentsSectionEvent.js
    │   └── overview/     # OverviewEvent.js, OverviewFilterEvent.js, OverviewListEvent.js
    ├── store/             # Caching und IndexedDB-Wrapper (AppDB, LocalDB)
    ├── io/               # Datei- und Seitenimporte (ImportJobPage.js)
    ├── models/           # Datenmodelle (Application-, Company-, ContactModel)
    ├── templates/        # HTML-Strukturen der Views
    │   ├── detail/       # Company-, Job-, Contact-, Communication-, SourcesTemplate.js
    │   ├── overview/     # ApplicationCardTemplate.js, OverviewTemplate.js
    │   └── windows/      # Contact-, Verify-, Url-, InputPromptTemplate.js
    ├── ui/               # Datenfluss zwischen Models und Views
    │   ├── detail/       # UiContact.js (UiCompany.js/UiJob.js: unbenutzte Beispiele)
    │   └── overview/     # OverviewFilter.js
    ├── utils/            # Hilfsfunktionen (Format-, HTML-, GlobalUtils)
    └── views/            # Orchestrierung: Template rendern, Events verdrahten
        ├── detail/       # DetailView.js
        ├── overview/     # OverviewView.js
        └── windows/      # Contact-, Verify-, Url-, InputPrompt.js, Toast.js
```

### 📂 Daten, Dokumente & System (Ausgeblendet/Ignoriert)
- `admin/` — Lokale Administrations-Oberfläche.
- `documents/` — Hochgeladene Nutzerdateien (PDFs, JPGs).
- `dok/` — Unstrukturierte Textnotizen, Entwürfe und Git-Hilfen.
- `.vs/` & `.vscode/` — IDE-Konfigurationen (Für KI-Logik ignorieren).
- `node_modules/` — Externe Abhängigkeiten (`fake-indexeddb` etc. - **Nicht einlesen!**).

## 3. Architektur-Regeln für die KI
- **Code-Ablage:** Neue Controller/Views vor dem finalen Refactoring immer in `AI/workflow/NewFils/` zwischenspeichern.
- **Namenskonvention:** PascalCase für Klassen, Models, Views und Controller (z.B. `JobModel.js`). camelCase für Hilfsfunktionen und Instanzen.
- **Modularität:** CSS-Änderungen strikt in die passenden Unterordner (`components/`, `content/`, `pages/`) aufteilen. Keine monolithischen Stylesheets.
