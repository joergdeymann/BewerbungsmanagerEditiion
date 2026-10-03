# Vollständige Verzeichnisstruktur (Token-Optimiert)

## 1. Projekt-Übersicht (Hauptverzeichnis)
- **Wurzelverzeichnis:** Enthält Core-Konfigurationen (`package.json`, `server.js`, `index.html`), die Projekt-README (`README.md`, `README.html`), die KI-Kontextdatei `CLAUDE.md` sowie Automatisierungs-Skripte (`push.psl`).
- **Serverseitig:** `server/` enthält die Node-Module des `server.js` (`StaticFileHandler.js`, `DocumentHandler.js`, `ProxyHandler.js`, `MimeTypes.js`, `Logger.js`).
- **Geteilte Konstanten:** `shared/FileConstants.js` wird von Server und Client genutzt.
- **Testdaten & Tests:** `testdata/` (siehe unten).
- **Wichtige Alt-Dateien:** Bereinigte oder veraltete Skripte im Root nicht für neue Workflows nutzen (`old-server.js`, `js.zip`).

## 2. Strukturbaum (Nach Bereichen gruppiert)

### 📂 AI & Dokumentation (Regeln, Logs, Sprints)
```text
AI/
├── README.md              # Zentrale KI-Regeln (Strict Staccato) - immer zuerst lesen
├── dok/                   # Kurzanweisungen (Befehle.md, MusterWorkflow.md)
├── log/
│   └── log.md             # System-Log (Flags, deutsch, Format siehe AI/README.md)
├── readme/                # Detailregeln (AllgemeineRegeln, CSS-, HTML-, JS-Regeln, Notstopp, …)
├── structure/
│   ├── AppRecord.json    # App-Metadaten
│   ├── Datenstruktur.md  # Daten-Schemata
│   └── Verzeichnisstruktur.md (Diese Datei)
└── workflow/
    ├── AI_README.md       # Arbeitsregeln für /AI/workflow - immer zuerst lesen
    ├── WORKFLOW.md        # Aktueller Sprint-Ablauf
    ├── todo.md            # Offene Tasks & Status
    ├── workflow01.md      # Weitere Arbeitsanweisung (bei Bedarf)
    └── NewFiles/          # Import-Verzeichnis für extern bereitgestellte Skripte
```

### 📂 Frontend-Ressourcen (Styles & Assets)
```text
├── assets/               # Globale SVGs und Icons (icon.svg)
└── css/                  # Modulare Stylesheets
    ├── base/             # default.css, style.css
    ├── components/       # UI-Elemente (buttons, checkbox, input, status, windows)
    ├── content/          # Inhalte & Sektionen (badges, benefits, cards, communication,
    │                     #   contact-list, content-frame, dynamic-fields, history-entries,
    │                     #   image-gallery, import-history, important-badges, list-row,
    │                     #   page-frame, section-header, sources, subsections)
    ├── layout/           # Grundgerüst (body, footer, header)
    └── pages/            # Seiten-Styles (editor, overview, skills)
```

### 📂 Applikations-Logik (JavaScript MVC Architektur)
```text
└── js/
    ├── app.js            # Haupteinstiegspunkt (Frontend)
    ├── analysis/         # Parser & Data-Extractor (Regex, Text-Cleaning)
    │   ├── Analyzer.js   # Orchestrierung der Extraktoren
    │   ├── extractors/   # Benefit-, Company-, Contact-, Email-, Job-, Location-, Money-,
    │   │                 #   Phone-, PostBox-, Qualification-, Street-, TaskExtractor
    │   └── parser/       # LineParser, ParseText, SectionParser, SectionPart, TextCleaner
    ├── api/              # Netzwerk-Schnittstellen (UrlImporter.js)
    ├── constants/        # Systemweite Konstanten (Address, Company, Contact, Job, LegalForm,
    │                     #   Location, Parser, PostBox, Skill, SkillAlias, Web)
    ├── controllers/      # Ablaufsteuerung: Repository-Zugriff, Verarbeitung, Speichern
    │   ├── CommunicationController.js
    │   ├── detail/       # Communication-, Contact-, DocumentsSectionController.js
    │   ├── edit/         # EditController.js, AnalysisController.js (Model-Befuellung)
    │   ├── overview/     # OverviewListController.js
    │   └── skills/       # SkillsController.js
    ├── core/             # App-Steuerung (Router.js, NavigationState.js)
    ├── events/           # Reines EventListener-Binding, ruft die zugehörigen Controller
    │   ├── detail/       # Communication-, Contact-, DetailNavigation-, Documents-, SourcesSectionEvent
    │   ├── edit/         # EditNavigationEvent.js
    │   ├── overview/     # OverviewEvent.js, OverviewFilterEvent.js, OverviewListEvent.js
    │   └── skills/       # SkillsEvent.js
    ├── store/             # Caching und IndexedDB-Wrapper (AppDB, AppCache, LocalDB, SkillDB, SkillCache)
    ├── io/               # Datei- und Seitenimporte (ImportJobPage.js)
    ├── models/           # Datenmodelle (Application-, App-, Company-, Contact-, Skill-, WageModel …)
    ├── templates/        # HTML-Strukturen der Views
    │   ├── EditorView.html
    │   ├── detail/       # Application-, Benefits-, Communication-, Company-, Contact-, Job-,
    │   │                 #   Requirements-, Sources-, DetailBase/Header/NavigationTemplate
    │   ├── edit/         # Benefits-, Company-, Contact-, Import-, Job-, Requirements-EditTemplate,
    │   │                 #   EditHeader-/EditNavigationTemplate
    │   ├── overview/     # ApplicationCardTemplate.js, OverviewTemplate.js
    │   ├── skills/       # SkillsTemplate.js
    │   └── windows/      # Call-, Contact-, Info-, Input-, Url-, VerifyPromptTemplate
    ├── ui/               # Datenfluss zwischen Models und Views
    │   ├── detail/       # UiCompany.js, UiContact.js, UiJob.js
    │   ├── edit/         # CompanyImageList.js
    │   ├── overview/     # OverviewFilter.js
    │   ├── windows/      # reserviert (leer)
    │   └── work/         # reserviert (nur README.md)
    ├── utils/            # Hilfsfunktionen (FormatUtils, GlobalUtils, HtmlUtils)
    └── views/            # Orchestrierung: Template rendern, Events verdrahten
        ├── detail/       # DetailView.js
        ├── edit/         # EditView.js + BaseEditTab und die *EditTab.js (Benefits, Company,
        │                 #   Contact, Import, Job, Requirements)
        ├── overview/     # OverviewView.js
        ├── skills/       # SkillsView.js
        ├── windows/      # CallPrompt, ContactPrompt, InfoPrompt, InputPrompt, Toast,
        │                 #   UrlPrompt, VerifyPrompt
        └── work/         # reserviert (leer)
```

### 📂 Daten, Tests, Dokumente & System (Ausgeblendet/Ignoriert)
- `admin/` — Lokale Administrations-Oberfläche (`admin/index.html`, `admin/admin.js`).
- `testdata/` — Testdaten und Testläufe: `Jobsinput.json` (Eingabedatensätze),
  `run-analysis-test.mjs` (`npm run test:analysis`), `run-tests.mjs`, `seed-browser.js`,
  `readme.md`.
- `documents/` — Hochgeladene Nutzerdateien (PDFs, JPGs).
- `dok/` — Unstrukturierte Textnotizen, Entwürfe und Git-Hilfen (kein Code).
- `old/` — Reserviert, derzeit ohne Dateien.
- `.vs/` & `.vscode/` — IDE-Konfigurationen (Für KI-Logik ignorieren).
- `node_modules/` — Externe Abhängigkeiten (`fake-indexeddb` etc. - **Nicht einlesen!**).

## 3. Architektur-Regeln für die KI
- **Regelreihenfolge:** `AI/README.md` → `AI/workflow/AI_README.md` → `AI/workflow/WORKFLOW.md`
  → bei Bedarf weitere Dateien in `AI/workflow/`. Fehlende Angaben werden nicht interpretiert,
  sondern nachgefragt.
- **Code-Ablage:** Neue Controller/Views werden direkt in die passenden Zielordner unter
  `js/` geschrieben (`controllers/`, `views/`, `templates/`). `AI/workflow/NewFiles/` ist
  ausschließlich ein Import-Verzeichnis für extern bereitgestellte Skripte und darf im
  Code nicht referenziert werden.
- **Synchronität:** Models, `AI/structure/AppRecord.json` und `AI/structure/Datenstruktur.md`
  sind gemeinsam zu halten. `AppRecord.json` nur auf Anweisung oder Nachfrage ändern.
- **Namenskonvention:** PascalCase für Klassen, Models, Views und Controller (z.B. `JobModel.js`). camelCase für Hilfsfunktionen und Instanzen.
- **Modularität:** CSS-Änderungen strikt in die passenden Unterordner (`components/`, `content/`, `pages/`) aufteilen. Keine monolithischen Stylesheets.
