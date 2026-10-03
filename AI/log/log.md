# Workflow-Log

2026-09-27 00:00 | [NEW] | Anrufen-Button beim Ansprechpartner (Detailansicht) neben dem Telefonfeld ergänzt.
2026-09-27 00:00 | [REFACTOR] | Anrufen-Fenster vereinheitlicht: Ansprechpartner-Bereich nutzt jetzt dasselbe InputPrompt-Fenster wie die Übersicht, gemeinsame Logik in neuem CommunicationController gebündelt.
2026-09-27 00:00 | [NEW] | NameModel (salutation, title, firstname, lastname) eingeführt und in ContactModel, UiContact, ContactPrompt/-Template, AddressModel sowie ApplicationTemplate integriert; AppRecord.json und Datenstruktur.md nachgezogen.
2026-09-27 00:00 | [UPDATE] | InputPromptTemplate zeigt Ansprechpartner-Zeile (Name, mailto-Link mit Betreff, tel-Link) im Anrufen-Fenster an.
2026-09-27 00:00 | [NEW] | Betreff-Feld bei Telefonaten ergänzt (ApplicationPhoneModel.subject, CommunicationController setzt "Telefonat vom <Datum>" via FormatUtils.toGermanDateTime), im Verlauf (ApplicationTemplate) angezeigt.
2026-09-27 00:00 | [NEW] | Import-Reiter im Editor realisiert (ImportEditTab.js, ImportEditTemplate.js, JobTextAnalyzer.js als Wrapper um ParseText), abgeglichen mit AI/workflow/NewFiles/JobTextAnalyzer.js. Ersetzt die extern bereitgestellte alte ImportTab.js-Struktur.
2026-09-27 00:00 | [UPDATE] | applyAnalysis() in Company-, Job-, Requirements-, Benefits- und ContactEditTab implementiert; Import-Reiter verteilt Analyseergebnisse an alle Tabs.
2026-09-27 00:00 | [UPDATE] | Importierte Texte werden als ReferenceModel direkt in application.references gespeichert (statt eigener History) - schließt den in todo.md offenen Punkt zur automatischen Quellenerfassung.
2026-09-29 21:02 | [FIX] | Toast-Meldungen in ImportEditTab.js korrigiert: korrekte Einzahl/Mehrzahl ("1 Eintrag" statt "1 Einträge") und Hinweis auf den Bereich "Übernommene Texte" ergänzt. X-Button/Auto-Ausblenden des Toasts war bereits über Toast.js/windows.css gelöst.
2026-10-03 12:56 | [FIX] | Analyzer.js: Website wurde als Domain-Objekt durchgereicht und im UI als "[object Object]" angezeigt - jetzt URL-Ableitung über domainToUrl() (DomainExtractor-Ergebnis .name).
2026-10-03 12:56 | [FIX] | Land wird ausgeschrieben angezeigt (Deutschland) statt Länderkürzel: LocationConstants.COUNTRY_NAMES + countryName() ergänzt, DEFAULT_COUNTRY auf "Deutschland" gesetzt, LocationExtractor nutzt countryName().
2026-10-03 12:56 | [NEW] | CompanyExtractor liest Firmeninfo-Labelzeilen (Label -> Folgezeile): Branche, Größe/Mitarbeiter, Gegründet, Verifizierte Seite, Spezialgebiete, Website, Rechtsform; Labeldefinitionen in CompanyConstants (COMPANY_INFO_LABELS).
2026-10-03 12:56 | [NEW] | FormatUtils.parseGermanDate() ergänzt ("15. Juni 2023" / "15.06.2023" -> ISO); toGermanDate() nutzt es, damit Verifiziert-Datum angezeigt wird.
2026-10-03 12:56 | [NEW] | Firmenbeschreibung wird aus dem Fließtext der companyInformation-Sektion gefüllt (CompanyExtractor.extractDescription, companyInfoLines aus ParseText).
2026-10-03 12:56 | [NEW] | Rechtsform wird aus dem Firmenname-Suffix abgeleitet (FERCHAU GmbH -> GMBH, CompanyConstants.LEGAL_FORM_PATTERNS); LegalFormConstants.SHORT/shortLabel für die Anzeige.
2026-10-03 12:56 | [UPDATE] | CompanyEditTab.applyAnalysis() füllt Rechtsform, Branche, Mitarbeiter, Gegründet, Verifiziert, Beschreibung und Spezialgebiete; CompanyTemplate zeigt zusätzlich das Feld Rechtsform.
2026-10-03 12:56 | [NEW] | testdata/run-analysis-test.mjs (npm run test:analysis) verifiziert die Sprint-Punkte aus AI/workflow/WORKFLOW.md am Ferchau-Beispiel inkl. Render-Smoke-Test.
2026-10-03 16:21 | [FIX] | Stellenbezeichnungen ("... (m/w/d)") werden aus der Firmenbeschreibung gefiltert (CompanyExtractor.isJobTitleLine); "Full-Stack-Entwickler (m/w/d)" taucht nicht mehr in company.description auf.
2026-10-03 16:21 | [FIX] | "Im Fokus" wird als Benefits-Titel erkannt (ParserConstants.SECTION_HEADLINES um "im fokus" ergänzt); die Weiterbildungs-Absätze gehören damit zur benefits-Sektion statt zur Firmenbeschreibung.
2026-10-03 16:21 | [UPDATE] | Abgearbeitete Sprint-Punkte aus AI/workflow/WORKFLOW.md entfernt; offene Punkte in AI/workflow/todo.md nachgezogen.