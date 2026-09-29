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