# JavaScript-Regeln

- Klassen immer mit `export` ausweisen.
- Imports immer mit geschweiften Klammern:
  `import { ClassName } from "./ClassName.js";`
- `const` bevorzugen, `let` nur wenn eine Variable verändert wird.
- `var` nicht verwenden.
- Möglichst keine `forEach`-Schleifen verwenden, wenn eine klassische `for`-Schleife effizienter ist.
- Keine unnötigen Kopien von Arrays oder Objekten erzeugen.
- `null` und `undefined` sinnvoll behandeln, aber keine unnötigen Prüfungen einbauen.
- Methoden sollen möglichst eine klar abgegrenzte Aufgabe haben.

## Code-Struktur

- Eine Methode darf maximal 50 Zeilen umfassen.
- Eine JavaScript-Datei darf maximal 500 Zeilen umfassen, sofern sie keinen oder nur wenig HTML-Code enthält.
- Jede Klasse wird in einer eigenen Datei definiert.

