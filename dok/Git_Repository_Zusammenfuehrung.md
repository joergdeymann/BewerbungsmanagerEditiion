# Git-Workflow: Zwei Repositories zusammenführen

## Ziel

Das bestehende Repository und das neue Repository sollen zu einem Repository zusammengeführt werden.

Dabei gelten folgende Ziele:

- Die vollständige History des alten Repositories bleibt erhalten.
- Die vollständige History des neuen Repositories bleibt erhalten.
- Der aktuelle Dateistand soll am Ende dem neuen Repository entsprechen.
- Die weitere Arbeit erfolgt auf `main`.
- Das alte Repository wird nicht als neue History überschrieben.
- Vor der Zusammenführung wird ein zusätzlicher Sicherungspunkt angelegt.

## 1. Ausgangspunkt prüfen

Im lokalen Arbeitsverzeichnis des **alten Repositories** arbeiten.

```powershell
git status
git branch
git remote -v
```

## 2. Backup-Branch anlegen

```powershell
git branch backup-vor-zusammenfuehrung
```

Prüfen:

```powershell
git branch
```

Der Branch `backup-vor-zusammenfuehrung` zeigt damit auf den bisherigen Stand.

## 3. Ungesicherte Änderungen zusätzlich als Stash sichern

Falls `git status` Änderungen zeigt:

```powershell
git stash push -u -m "Checkpoint vor Repository-Zusammenführung"
```

Danach:

```powershell
git status
```

Der Stash ist ein zusätzlicher Sicherheitsmechanismus. Die eigentliche Git-History bleibt unabhängig davon erhalten.

## 4. Auf `main` arbeiten

```powershell
git switch main
```

## 5. Alten Projektinhalt löschen

**Wichtig: `.git` darf NICHT gelöscht werden.**

Unter PowerShell:

```powershell
Get-ChildItem -Force |
    Where-Object { $_.Name -ne ".git" } |
    Remove-Item -Recurse -Force
```

Danach:

```powershell
git status
```

Die bisherigen Projektdateien müssen jetzt als gelöscht angezeigt werden.

## 6. Löschung committen

```powershell
git add -A
git commit -m "Projektinhalt für Repository-Zusammenführung entfernt"
```

Danach:

```powershell
git status
```

## 7. Löschung auf `main` pushen

```powershell
git push origin main
```

Die alten Dateien sind damit aus dem aktuellen Dateistand entfernt, aber weiterhin in den vorherigen Commits vorhanden.

## 8. Neues Repository als Remote hinzufügen

```powershell
git remote add new-repo <URL-DES-NEUEN-REPOSITORIES>
```

Beispiel:

```powershell
git remote add new-repo https://github.com/Benutzer/neues-repository.git
```

Kontrollieren:

```powershell
git remote -v
```

## 9. Neue History abrufen

```powershell
git fetch new-repo
```

Danach:

```powershell
git branch -a
```

Der neue Branch sollte beispielsweise als `remotes/new-repo/main` sichtbar sein.

## 10. Beide Histories zusammenführen

```powershell
git merge new-repo/main --allow-unrelated-histories
```

Damit werden die beiden bisher unabhängigen Git-Historien miteinander verbunden.

Wenn Git Konflikte meldet:

```powershell
git status
```

Das Ziel ist, dass der endgültige Dateistand dem neuen Repository entspricht.

## 11. Neuen Repository-Stand übernehmen

Wenn das neue Repository beim Dateistand vollständig Vorrang haben soll:

```powershell
git checkout new-repo/main -- .
```

Danach:

```powershell
git status
```

Jetzt sollten die Dateien des neuen Repositories im Arbeitsverzeichnis liegen.

## 12. Neuen Stand committen

```powershell
git add -A
git commit -m "Neuen Repository-Stand übernehmen"
```

## 13. Ergebnis prüfen

```powershell
git status
git branch --show-current
git log --oneline --graph --all --decorate
```

Erwartet:

```text
main
```

und eine History, in der sowohl die alten als auch die neuen Commits vorhanden sind.

## 14. Zusammengeführte History auf `main` pushen

Wenn der Dateistand und die History geprüft wurden:

```powershell
git push origin main
```

## 15. Stash erst danach entfernen

Prüfen:

```powershell
git stash list
```

Solange die Zusammenführung nicht vollständig geprüft wurde, den Stash behalten.

Wenn alles korrekt ist:

```powershell
git stash drop
```

## 16. Backup-Branch zunächst behalten

Der Branch

```text
backup-vor-zusammenfuehrung
```

sollte zunächst bestehen bleiben.

Später kann er gelöscht werden:

```powershell
git branch -d backup-vor-zusammenfuehrung
```

Die erzwungene Variante:

```powershell
git branch -D backup-vor-zusammenfuehrung
```

nur verwenden, wenn der Backup-Stand definitiv nicht mehr benötigt wird.

## 17. Optional: neues Remote entfernen

Wenn `new-repo` nur für die Zusammenführung benötigt wurde:

```powershell
git remote remove new-repo
```

Das ist optional.

## 18. Kompletter Ablauf

```powershell
# Ausgangspunkt
git status
git branch backup-vor-zusammenfuehrung

# Ungesicherte Änderungen sichern
git stash push -u -m "Checkpoint vor Repository-Zusammenführung"

# main verwenden
git switch main

# Alle Dateien außer .git löschen
Get-ChildItem -Force |
    Where-Object { $_.Name -ne ".git" } |
    Remove-Item -Recurse -Force

# Löschung committen und pushen
git add -A
git commit -m "Projektinhalt für Repository-Zusammenführung entfernt"
git push origin main

# Neues Repository hinzufügen
git remote add new-repo <URL-DES-NEUEN-REPOSITORIES>

# Neue History holen
git fetch new-repo

# Histories zusammenführen
git merge new-repo/main --allow-unrelated-histories

# Neuen Dateistand übernehmen
git checkout new-repo/main -- .

# Neuen Stand committen
git add -A
git commit -m "Neuen Repository-Stand übernehmen"

# Prüfen
git status
git branch --show-current
git log --oneline --graph --all --decorate

# Auf main pushen
git push origin main
```

## 19. Sicherheitsregeln

### `.git` niemals löschen

Nicht ausführen:

```powershell
Remove-Item .git
```

Das würde das lokale Repository zerstören.

### Kein Force-Push

Für diesen Ablauf ist kein Force-Push vorgesehen:

```powershell
git push --force
```

nicht verwenden.

### Stash und Backup nicht zu früh löschen

Erst entfernen, wenn:

- beide Histories vorhanden sind
- der neue Dateistand korrekt ist
- `main` korrekt ist
- der Push erfolgreich war
- das Ergebnis geprüft wurde

## 20. Kontrollpunkte

Nach jedem dieser Schritte anhalten und prüfen:

1. Backup-Branch erstellt
2. Stash erstellt
3. Dateien gelöscht
4. Löschung auf `main` committed
5. Löschung gepusht
6. neues Remote hinzugefügt
7. neue History gefetched
8. Histories gemerged
9. neuer Dateistand übernommen
10. Ergebnis geprüft
11. `main` gepusht
12. Stash und Backup erst danach entfernen

Bei einem unerwarteten Ergebnis nicht weiterarbeiten, sondern zuerst:

```powershell
git status
git log --oneline --graph --all --decorate
git stash list
git branch
```

prüfen.

## Zielzustand

Die alte History und die neue History bleiben erhalten. Der aktuelle Dateistand entspricht dem neuen Repository und die weitere Entwicklung erfolgt auf:

```text
main
```

Der entscheidende Punkt:

> Die Dateien des alten Projekts werden gelöscht, nicht dessen Git-History.
