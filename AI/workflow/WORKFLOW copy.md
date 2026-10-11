# Regel
- Jedes Model git die Daten vor und darf nur auf Anweisung oder Nachfrage geändert werden
- Halte Models, AppRecord.json, JobsInput.json, structure/Datenstruktur.md synchronisiert

# Entwicklungs-Sprint (Workflow)
## Arbeitsmodell (WorkModel.js / ArbeitsModel)
- Neues Model `WorkModel.js` (deutsch: ArbeitsModel), das alle Arbeitsmodelle einer Stelle erfasst, statt nur der Tags in `job.workModel`:
  - Schichtarbeit (ja/nein, Schichtform wenn genannt, z. B. Früh-/Spät-/Nachtschicht, Wechselschicht)
  - Homeoffice / Remote (ja/nein, vollständig remote)
  - x Tage pro Woche vor Ort
  - x Tage pro Woche zuhause (Homeoffice)
  - Bedingungen und Hinweise als Text (z. B. "nach erfolgreicher Probezeit 2 Tage pro Woche im Homeoffice")
  - Gleitzeit / Teilzeit / Vollzeit bleiben in `employmentType`.
- Beispiel INSIDE M2M (Info-Seite): "Arbeitsmodell: Hybrid", "Übliche Anwesenheit vor Ort: 3 Tage pro Woche", "nach der Probezeit 2 Tage pro Woche im Homeoffice, einige Bereiche mit täglicher Präsenz".
- Quellen: Zeile "Arbeitsmodell: ...", "Übliche Anwesenheit vor Ort", Fließtext ("2 Tage pro Woche im Homeoffice"), Stichwörter (Schicht, Homeoffice, Remote, Hybrid). Als Konstanten in `WorkModelConstants.js`, Extraktion in `WorkModelExtractor.js`.
- Danach `AppRecord.json`, `Datenstruktur.md`, `Jobsinput.json` und Reiter/Detailansicht der Stelle anpassen. Erst auf Anweisung umsetzen (Models nur auf Anweisung ändern).


Models: 
WorkModel.js 
WorkTimeModel.js - da es nur bei einer Liste bleibt kein Model
WorktypeModel.js - auch hier nur eine Liste
WorkNotes,js - auch hier nur eine Liste
WorkDayModel.js 

WorkModel.js
  "Type": []
  "WorkTime": []
  "WorkDays": []
  "notes": []
Type: eine Liste
[
  "Teilzeit",
  "Vollzeit",
]
WorkTime: eine Liste
[
  "Gleitzeit",
  "Schichtarbeit",
  "Conti-Schicht",
  "Wechselschicht",
  "Frühschicht",
  "Spätschicht",
  "Nachtschicht",
  "Bereitschaftsdienst"
]
Notes: eine Liste
[
    "2 Tage pro Woche Homeoffice nach erfolgreicher Probezeit",
    "Einige Bereiche mit täglicher Präsenz"
]

WorkDay: eine Klasse "WorkDayModel"
  "type": "Vor Ort",
  "days": 5,
  "onSite": 5,
  "remote": 0


Mehrere:
    "WorkDays": [
      {
        "type": "Vor Ort",
        "days": 5,
        "onSite": 5,
        "remote": 0
      },
      {
        "type": "Hybrid",
        "days": 5,
        "onSite": 3,
        "remote": 2
      },
      {
        "type": "Homeoffice",
        "days": 5,
        "onSite": 0,
        "remote": 5
      },
      {
        "type": "Remote",
        "days": 5,
        "onSite": 0,
        "remote": 5
      }
    ]
  
- Texte wie "Übliche Anwesenheit vor Ort" und der Homeoffice-Hinweis: gehören in das WorkModel als Notes (siehe oben).
- suche zuerst die zugehörigkeiten und schlage sie mir dann vor bevor du das Umstezt.
- Aus dem Model kommen wieder Daten die in das Frontend zum Speichern eingebaut werden müssen





