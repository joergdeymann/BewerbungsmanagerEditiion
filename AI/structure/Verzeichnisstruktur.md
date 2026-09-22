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
    └── NewFils/          # Sammelordner für neu generierte Module
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
    ├── core/             # App-Steuerung (Router.js)
    ├── store/             # Caching und IndexedDB-Wrapper (AppDB, LocalDB)
    ├── io/               # Datei- und Seitenimporte (ImportJobPage.js)
    ├── models/           # Datenmodelle (Application-, Company-, ContactModel)
    ├── templates/        # HTML/JS-Templates (EditorView, Detail, Overview)
    ├── ui/               # UI-Direktzugriffe (UiCompany, UiContact, UiJob)
    ├── utils/            # Hilfsfunktionen (Format-, HTML-, GlobalUtils)
    └── views/            # UI-Views & Event-Controller
        ├── detail/       # DetailView.js & event-driven Sektions-Controller
        ├── overview/     # OverviewView.js & Listen-Events
        └── windows/      # Modale Prompts (Contact-, Url-, Toast-Prompts)
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
