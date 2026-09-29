
/*
Am sichersten rufst du sie pro Block auf, etwa this.splitBlocks(lines).map(b => this.removeSimilar(b)), und fügst sie danach wieder zusammen.
*/

import { ParserConstants } from "../../constants/ParserConstants.js";
export class TextCleaner {
constructor(text) {
        this.text = text;

        let lines = this
            .removeInvisibleCharacters()
            .split(/\r?\n/)
            .map(line => this.stripBulletPrefix(line));

        // Zuerst exakte Dubletten zusammenführen (letztes Vorkommen bleibt)
        // und dabei das "?"-Präfix entfernen
        lines = this.removeLineAfterMarker(lines);
        lines = this.mergeDuplicates(lines);
        lines = this.uniqueBlocks(lines, { merge: false });
        lines = lines.filter(Boolean);
        lines = this.removeSimilar(lines);

        this.lines = this.removeDoubleLines(lines)
            .filter(e => {
                const line = e.toLowerCase();
                return !(
                    ParserConstants.IGNORE_LINE_MARKERS.anyOf.some(marker => line.includes(marker)) ||
                    ParserConstants.IGNORE_LINE_MARKERS.allOf.some(markers => markers.every(marker => line.includes(marker))) ||
                    ParserConstants.IGNORE_LINE_MARKERS.line.some(marker => line == marker)
                );
            });

        this.lines = this.lines
            .map(line => this.stripBulletPrefix(line))
            .filter(Boolean); // Jetzt sind wirklich alle Sonderzeichen weg
    }

    mergeDuplicates(values) {
        const stripMarker = value => value.replace(/^\s*\?\s*/, '').trim();
        const toKey = value => stripMarker(value).toLowerCase().replace(/\s+/g, ' ');

        // Pro Schlüssel den Index des letzten Vorkommens merken (leere Zeilen ignorieren)
        const lastIndex = new Map();
        values.forEach((value, index) => {
            const key = toKey(value);
            if (key) {
                lastIndex.set(key, index);
            }
        });

        return values
            .filter((value, index) => {
                const key = toKey(value);
                // Leere Zeilen bleiben unverändert (könnten Blocktrenner sein)
                return !key || lastIndex.get(key) === index;
            })
            .map(stripMarker);
    }

    removeInvisibleCharacters() {
        return this.text.replace(ParserConstants.INVISIBLE_CHARS_REGEX, "");
    }

    /*
    * Gemeinsame Text-Helfer für den Parser. Ersetzt die früher pro
    * Extractor kopierten Bullet-Regex und unique()-Implementierungen.
    */

    stripBulletPrefix(line) {
        return line.replace(ParserConstants.BULLET_PREFIX_REGEX, "").trim();
    }

    unique(values) {
        return [...new Set(values.map(value => value.trim()).filter(Boolean))];
    }


    removeDoubleLines(lines) {
        for (let i = 0; i < lines.length; i++) {

            const isMarkerLine = ParserConstants.IGNORE_DOUBLE_LINE_MARKERS.allOf.every(value =>
                lines[i].toLowerCase().includes(value.toLowerCase())
            );

            if (!isMarkerLine) {
                continue;
            }

            const markerName = lines[i]
                .split("&")[0]
                .trim();

            const previousLine = lines[i - 1];

            if (
                previousLine &&
                markerName.toLowerCase() ===
                previousLine.split(/\s+/)[0].toLowerCase()
            ) {
                lines.splice(i - 1, 2);
                i -= 2;
            } else {
                lines.splice(i, 1);
                i--;
            }
        }
        return lines;    
    }

    // Linkedin Marker für nicht gematched forderung
    removeUnmet(values) {
        const isMarked = value => /^\s*\?/.test(value);
        const stripMarker = value => value.replace(/^\s*\?\s*/, '').trim();
        const normalize = value => value.trim().toLowerCase();

        // Alle Zeilen ohne "?" als Referenz
        const existing = new Set(
            values.filter(value => !isMarked(value)).map(normalize)
        );

        const result = [];

        for (const value of values) {
            if (!isMarked(value)) {
                result.push(value);
                continue;
            }

            const cleaned = stripMarker(value);
            const key = normalize(cleaned);

            // Gleiche Zeile ohne "?" existiert schon -> verwerfen
            if (existing.has(key)) {
                continue;
            }

            // Sonst nur "?" entfernen und behalten
            result.push(cleaned);
            existing.add(key); // verhindert Dubletten bei mehreren "?"-Zeilen
        }

        return result;
    }

    removeSimilar(values, minCoverage = 0.8) {
        const getWords = value =>
            value
                .toLowerCase()
                .split(/\s+/)
                // Tokens ohne Buchstaben/Ziffern ("?", "•", "·") verwerfen
                .filter(word => /[\p{L}\p{N}]/u.test(word))
                // Satzzeichen am Rand entfernen ("Qualifikation," -> "qualifikation")
                .map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''));

        const wordLists = values.map(getWords);
        const keys = wordLists.map(words => words.join(' '));
        const remove = new Set();

        for (let i = 0; i < values.length; i++) {
            const shortWords = wordLists[i];

            // Einzelne Wörter oder Zahlen nicht als ähnliche Texte behandeln
            if (shortWords.length < 2) {
                continue;
            }

            for (let j = 0; j < values.length; j++) {
                if (i === j) {
                    continue;
                }

                const longWords = wordLists[j];

                // Exakte Dublette (nach Normalisierung): nur die spätere entfernen
                if (keys[i] === keys[j]) {
                    if (i > j) {
                        remove.add(i);
                        break;
                    }
                    continue;
                }

                // Nur kürzere Zeilen entfernen
                if (shortWords.length >= longWords.length) {
                    continue;
                }

                // Kurze Zeile muss einen großen Teil der langen ausmachen
                if (shortWords.length / longWords.length < minCoverage) {
                    continue;
                }

                if (this.containsWordSequence(shortWords, longWords)) {
                    remove.add(i);
                    break;
                }
            }
        }

        return values.filter((_, index) => !remove.has(index));
    }

    containsWordSequence(shortWords, longWords) {
        for (let i = 0; i <= longWords.length - shortWords.length; i++) {

            let matches = true;

            for (let j = 0; j < shortWords.length; j++) {
                if (shortWords[j] !== longWords[i + j]) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                return true;
            }
        }

        return false;
    }

    normalizeLine(line) {
        return line.toLowerCase().replace(/\s+/g, " ").trim();
    }

    // Blöcke = Zeilengruppen, getrennt durch Leerzeilen
    splitBlocks(lines) {
        const blocks = [];
        let current = [];
        for (const line of lines) {
            if (line === "") {
                if (current.length) {
                    blocks.push(current);
                    current = [];
                }
            } else {
                current.push(line);
            }
        }
        if (current.length) blocks.push(current);
        return blocks;
    }

    // Qualität eines Blocks: erst Anzahl verschiedener Zeilen, dann Gesamtlänge
    compareBlocks(a, b) {
        const distinct = block => new Set(block.map(l => this.normalizeLine(l))).size;
        const chars = block => block.reduce((sum, l) => sum + l.length, 0);
        return (distinct(b) - distinct(a)) || (chars(b) - chars(a));
    }

    uniqueBlocks(lines, { merge = true } = {}) {
        // Gruppieren nach Schlüssel (hier: erste Zeile), Reihenfolge des ersten Auftretens bleibt
        const groups = new Map();
        for (const block of this.splitBlocks(lines)) {
            const key = this.normalizeLine(block[0]);
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(block);
        }

        const result = [];
        for (const variants of groups.values()) {
            // stabile Sortierung: bei Gleichstand gewinnt der frühere Block
            const [best, ...others] = [...variants].sort((a, b) => this.compareBlocks(a, b));

            const seen = new Set();
            const merged = [];
            const add = line => {
                const key = this.normalizeLine(line);
                if (!seen.has(key)) {
                    seen.add(key);
                    merged.push(line);
                }
            };

            best.forEach(add);
            if (merge) {
                // Zusätzliche Infos der schlechteren Duplikate zusammenhängend am Ende
                others.forEach(block => block.forEach(add));
            }

            result.push(...merged, "");
        }

        result.pop(); // letzte Trennzeile entfernen
        return result;
    }


    removeContainedBlocks(lines) {
        const blocks = this.splitBlocks(lines);
        const toWords = line =>
            this.normalizeLine(line).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

        const lineSets = blocks.map(b => new Set(b.map(l => this.normalizeLine(l))));
        const wordSets = blocks.map(b => new Set(b.flatMap(toWords)));

        const kept = blocks.filter((block, i) => {
            const singleWord = block.length === 1 && toWords(block[0]).length === 1
                ? toWords(block[0])[0]
                : null;

            return !blocks.some((_, j) => {
                if (i === j) return false;

                // 1) Alle Zeilen des Blocks stecken schon in einem größeren Block
                const contained =
                    lineSets[j].size > lineSets[i].size &&
                    [...lineSets[i]].every(l => lineSets[j].has(l));

                // 2) Alleinstehendes Einzelwort kommt als Wort in einem anderen Block vor
                const wordInOther =
                    singleWord !== null &&
                    wordSets[j].size > 1 &&
                    wordSets[j].has(singleWord);

                return contained || wordInOther;
            });
        });

        return kept.flatMap((block, i) => (i < kept.length - 1 ? [...block, ""] : block));
    }
    // Entfernt die Zeile direkt nach bestimmten Marker-Zeilen (z. B. dem Button "Follower:in")
    removeLineAfterMarker(lines, markers = ["follower:in"]) {
        const result = [];
        for (let i = 0; i < lines.length; i++) {
            result.push(lines[i]);
            if (markers.includes(this.normalizeLine(lines[i]))) {
                // nächste nicht-leere Zeile überspringen
                let j = i + 1;
                while (j < lines.length && lines[j] === "") j++;
                if (j < lines.length) {
                    result.push(...lines.slice(i + 1, j)); // Leerzeilen behalten
                    i = j;
                }
            }
        }
        return result;
    }


}