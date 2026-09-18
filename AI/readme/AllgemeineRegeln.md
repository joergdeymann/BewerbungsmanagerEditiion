# Allgemeine Regeln

## Grundsätze
- Verbrauche so wenig Tokens wie möglich, nur soviele wie notwendig sind
- Performance vor Schönheit.
- Code soll einfach und verständlich bleiben.
- Keine unnötigen Abstraktionen oder zusätzlichen Klassen.
- Bestehende Strukturen möglichst beibehalten, wenn keine technische Notwendigkeit zur Änderung besteht.

## Benennung

- Klassen: `PascalCase`
- Methoden und Variablen: `camelCase`
- Namen sollen eindeutig und aussagekräftig sein.
- Abkürzungen nur verwenden, wenn sie im Projekt eindeutig verständlich sind.
- Englische Variablennamen verwenden.

## Kommentare

- Kommentare nur verwenden, wenn sie einen nicht offensichtlichen Sachverhalt erklären.
- Keine Kommentare für offensichtlich verständlichen Code.
- Kommentare sollen erklären, **warum** etwas gemacht wird, nicht nur **was** der Code macht.

## Änderungen am Code

- Korrekturen, Änderungen und Analysen dürfen von der KI nur nach vorheriger ausdrücklicher Absprache durchgeführt werden.
- Bei Änderungen an bestehendem Code nur die tatsächlich notwendigen Änderungen anzeigen.
- Nicht die komplette Datei ausgeben, wenn nur einzelne Stellen geändert werden.
- Zu jeder Änderung den **Dateinamen und die betroffene Zeile bzw. den betroffenen Bereich** angeben.
- Änderungen möglichst als **Diff** darstellen.
- Der geänderte Code soll direkt kopierbar sein.
- Bei mehreren Änderungen diese nach Datei gruppieren.
- Unveränderten Code nicht wiederholen.
- Nur wenn eine komplette Datei neu erstellt wird oder eine vollständige Datei ausdrücklich gewünscht ist, die gesamte Datei ausgeben.
- Bei kleinen Änderungen reicht der Diff; bei Änderungen, die sich über mehrere zusammenhängende Stellen erstrecken, den betroffenen Codeblock vollständig anzeigen.

## Git

- `.gitignore` darf nur geändert werden, wenn dies ausdrücklich angefordert wurde.
- Ein erfolgreicher Push ist Voraussetzung für alle nachfolgenden Verarbeitungsschritte.
- Wenn der Push nicht erfolgreich ausgeführt wurde, wird die Verarbeitung an dieser Stelle beendet.
- Die KI pusht nicht selbst. Nach der Übergabe geänderter oder neuer Dateien wird die Verarbeitung angehalten, bis der Push bestätigt wurde.
- Erst nach der Bestätigung des Pushs wird der nächste Schritt begonnen.
- Vor dem nächsten Schritt wird der aktuelle Stand aus dem Repository erneut gelesen.

## Schreibfehler

- Offensichtliche Schreibfehler in Variablen-, Methoden-, Klassen- oder Dateinamen sowie in Texten dürfen korrigiert werden.

## Hinweise

- Weise darauf hin, wenn ein Name besser gewählt werden könnte.
- Namensänderungen dürfen nur nach vorheriger ausdrücklicher Absprache vorgenommen werden.


## Ausgabestruktur

- Änderungen **klar beschreiben und nummerieren**.
- Bei kleinen Änderungen **diff**, bei größeren Änderungen **Codeausschnitt**, bei umfangreichen Änderungen **gesamte Datei** verwenden.
- Pro Änderung **nur eine Darstellungsform** verwenden, niemals diff und Code gleichzeitig.
- Die Analyse nach **maximal 5 gefundenen Änderungen** stoppen.

