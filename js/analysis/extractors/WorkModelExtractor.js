import { WorkModelConstants } from "../../constants/WorkModelConstants.js";
import { WorkDayModel } from "../../models/WorkDayModel.js";

/**
 * Ermittelt das Arbeitsmodell einer Stelle (WorkModel) aus dem Anzeigentext.
 *
 * Quellen:
 *   - Art (Vollzeit, Teilzeit, ...): ganze Zeile im Abschnitt general.
 *   - Arbeitszeit (Gleitzeit, Schicht, ...): kurze Zeilen in general, benefits, tasks.
 *   - Arbeitstage: ganze Zeile im Abschnitt general, Zeile "Arbeitsmodell: Hybrid",
 *     "Übliche Anwesenheit vor Ort" (Tage vor Ort) und Sätze wie
 *     "2 Tage pro Woche im Homeoffice" (Tage zuhause).
 *   - Hinweise: Sätze hinter "Arbeitsmodell: ...", die Zeile "Übliche Anwesenheit vor Ort"
 *     und Sätze mit Tagen pro Woche im Fließtext - im Originalwortlaut, höchstens
 *     WorkModelConstants.NOTE_MAX_WORDS Wörter.
 *
 * Alle Regeln stehen in WorkModelConstants.
 */
export class WorkModelExtractor {
    /**
     * @param {object} sections Geparste Sektionen (Name -> { lines: string[] }).
     * @param {string[]} [allLines] Alle Zeilen des Anzeigentexts.
     */
    constructor(sections, allLines = []) {
        this.sections = sections ?? {};
        this.allLines = (allLines ?? []).map(line => String(line));
    }

    /**
     * Liefert das vollständige Arbeitsmodell.
     * @returns {{type: string[], workTime: string[], workDays: object[], notes: string[]}}
     *          Daten passend zu WorkModel.data.
     */
    extract() {
        const label = this.findLabel();
        const presence = this.findPresence();
        const freeSentences = this.findFreeSentences();
        const sentences = [...label.sentences, ...freeSentences];

        const homeDays = this.findDays(sentences, WorkModelConstants.HOME_REGEX);
        const siteDays = presence?.days ?? this.findDays(sentences, WorkModelConstants.SITE_REGEX);

        return {
            type: this.findTypes(),
            workTime: this.findWorkTimes(),
            workDays: this.buildWorkDays(this.findWorkDayTypes(label.value, siteDays), siteDays, homeDays),
            notes: this.buildNotes(label.sentences, presence, freeSentences)
        };
    }

    // ---------- Art und Arbeitszeit ----------

    /**
     * Art der Anstellung: ganze Zeile in general.
     * @returns {string[]} Namen aus WorkModelConstants.TYPE.
     */
    findTypes() {
        return this.matchLines(this.generalLines(), WorkModelConstants.TYPE_KEYWORDS);
    }

    /**
     * Arbeitszeit: kurze Zeilen ohne Verneinung in general, benefits und tasks.
     * @returns {string[]} Namen aus WorkModelConstants.WORK_TIME.
     */
    findWorkTimes() {
        const lines = [
            ...this.generalLines(),
            ...(this.sections.benefits?.lines ?? []),
            ...(this.sections.tasks?.lines ?? [])
        ].filter(line => this.countWords(line) <= WorkModelConstants.WORK_TIME_MAX_WORDS
            && !WorkModelConstants.NEGATION_REGEX.test(line));

        const found = [];
        for (const [label, keywords] of Object.entries(WorkModelConstants.WORK_TIME_KEYWORDS)) {
            if (lines.some(line => keywords.some(word => this.containsWord(line, word)))) found.push(label);
        }

        return WorkModelConstants.WORK_TIME.filter(label => found.includes(label));
    }

    // ---------- Arbeitstage ----------

    /**
     * Typen der Arbeitstage: ganze Zeile in general oder Wert hinter "Arbeitsmodell:".
     * Gibt es Tage vor Ort, aber keinen Typ, gilt Hybrid.
     * @param {string} labelValue Wert der Zeile "Arbeitsmodell: ..." oder "".
     * @param {number|null} siteDays Gefundene Tage vor Ort.
     * @returns {string[]} Namen aus WorkModelConstants.WORK_DAY_TYPES.
     */
    findWorkDayTypes(labelValue, siteDays) {
        const found = new Set(this.matchLines(this.generalLines(), WorkModelConstants.WORK_DAY_KEYWORDS));

        for (const [label, keywords] of Object.entries(WorkModelConstants.WORK_DAY_KEYWORDS)) {
            if (keywords.some(word => this.containsWord(labelValue, word))) found.add(label);
        }

        if (!found.size && siteDays !== null) found.add(WorkModelConstants.WORK_DAY_TYPE.HYBRID);

        return WorkModelConstants.WORK_DAY_TYPES.filter(label => found.has(label));
    }

    /**
     * Baut die Arbeitstage je Typ. Hybrid erhält Tage vor Ort und zuhause, soweit bekannt;
     * fehlt eine der beiden Zahlen, ergibt sie sich aus den Standard-Arbeitstagen.
     * @param {string[]} types Typen der Arbeitstage.
     * @param {number|null} siteDays Tage vor Ort.
     * @param {number|null} homeDays Tage im Homeoffice.
     * @returns {object[]} Daten passend zu WorkDayModel.data.
     */
    buildWorkDays(types, siteDays, homeDays) {
        return types.map(type => {
            const day = WorkDayModel.forType(type);

            if (type === WorkModelConstants.WORK_DAY_TYPE.HYBRID) {
                day.onSite = siteDays ?? (homeDays !== null ? day.days - homeDays : null);
                day.remote = homeDays ?? (siteDays !== null ? day.days - siteDays : null);

                if (day.onSite !== null && day.remote !== null && day.onSite + day.remote > day.days) {
                    day.days = Math.min(day.onSite + day.remote, WorkModelConstants.MAX_DAYS);
                }
                if (day.onSite !== null && day.onSite < 0) day.onSite = 0;
                if (day.remote !== null && day.remote < 0) day.remote = 0;
            }

            return day.data;
        });
    }

    /**
     * Zeile "Übliche Anwesenheit vor Ort": Wert in derselben oder der nächsten Zeile.
     * @returns {{days: number|null, value: string}|null} Tage pro Woche und Wert oder null.
     */
    findPresence() {
        for (let index = 0; index < this.allLines.length; index++) {
            const match = this.allLines[index].trim().match(WorkModelConstants.PRESENCE_LABEL_REGEX);
            if (!match) continue;

            const value = (match[1] || this.nextLine(index)).trim();
            if (!value) return null;

            const days = value.match(WorkModelConstants.DAYS_PER_WEEK_REGEX)
                ?? value.match(WorkModelConstants.DAYS_REGEX);

            return { days: days ? this.toDays(days[1]) : null, value };
        }

        return null;
    }

    /**
     * Tage aus Sätzen mit "n Tage pro Woche", die zum Muster passen. Nennt ein Satz
     * mehrere Zahlen ("2 Tage pro Woche im Homeoffice und 3 Tage vor Ort"), gilt die
     * Zahl, die dem Stichwort am nächsten steht.
     * @param {string[]} sentences Sätze.
     * @param {RegExp} regex Muster für Homeoffice bzw. Vor Ort.
     * @returns {number|null} Tage oder null.
     */
    findDays(sentences, regex) {
        for (const sentence of sentences) {
            if (!regex.test(sentence) || !WorkModelConstants.DAYS_PER_WEEK_REGEX.test(sentence)) continue;

            const days = this.nearestDays(sentence, sentence.search(regex));
            if (days !== null) return days;
        }

        return null;
    }

    /**
     * Wählt aus den Tagesangaben eines Satzes die zum Stichwort gehörende:
     * zuerst die Zahl, hinter der das Stichwort folgt, ohne dass eine weitere Zahl
     * dazwischen steht ("2 Tage pro Woche im Homeoffice"); sonst die nächstgelegene.
     * @param {string} sentence Satz mit Tagesangaben.
     * @param {number} position Stelle des Stichworts im Satz.
     * @returns {number|null} Tage oder null.
     */
    nearestDays(sentence, position) {
        const matches = [...sentence.matchAll(WorkModelConstants.DAYS_ALL_REGEX)]
            .map(match => ({ days: this.toDays(match[1]), start: match.index, end: match.index + match[0].length }))
            .filter(match => match.days !== null);

        const followed = matches.find((match, index) => {
            const next = matches[index + 1];
            const reach = position - match.end;

            return reach >= 0 && reach <= 30 && (!next || next.start > position);
        });
        if (followed) return followed.days;

        let best = null;
        let distance = Infinity;
        for (const match of matches) {
            const gap = Math.abs(match.start - position);
            if (gap < distance) {
                best = match.days;
                distance = gap;
            }
        }

        return best;
    }

    // ---------- Hinweise ----------

    /**
     * Zeile "Arbeitsmodell: <Wert>" und die Hinweissätze der folgenden Zeilen.
     * Der Block endet bei der Zeile "Übliche Anwesenheit vor Ort", einer Adresse,
     * einer leeren oder kurzen Beschriftungszeile oder nach LABEL_BLOCK_LINES Zeilen.
     * @returns {{value: string, sentences: string[]}} Wert und Hinweissätze.
     */
    findLabel() {
        for (let index = 0; index < this.allLines.length; index++) {
            const match = this.allLines[index].trim().match(WorkModelConstants.LABEL_REGEX);
            if (!match) continue;

            const sentences = [];
            for (let offset = 1; offset <= WorkModelConstants.LABEL_BLOCK_LINES; offset++) {
                const line = (this.allLines[index + offset] ?? "").trim();
                if (this.endsLabelBlock(line)) break;

                sentences.push(...this.splitSentences(line).filter(sentence => this.isWorkSentence(sentence)));
            }

            return { value: match[1].trim(), sentences };
        }

        return { value: "", sentences: [] };
    }

    /**
     * Sätze im Fließtext mit "n Tage pro Woche" und Bezug zum Arbeitsmodell,
     * z. B. "Du arbeitest 2 Tage pro Woche im Homeoffice."
     * @returns {string[]} Sätze.
     */
    findFreeSentences() {
        const found = [];

        for (const line of this.allLines) {
            for (const sentence of this.splitSentences(line)) {
                if (WorkModelConstants.DAYS_PER_WEEK_REGEX.test(sentence) && this.isWorkSentence(sentence)) {
                    found.push(sentence);
                }
            }
        }

        return found;
    }

    /**
     * Baut die Hinweisliste: Block hinter "Arbeitsmodell", Anwesenheit, Fließtext.
     * Doppelte entfallen, zu lange Sätze werden geteilt oder verworfen.
     * @param {string[]} labelSentences Sätze hinter "Arbeitsmodell: ...".
     * @param {{value: string}|null} presence Zeile "Übliche Anwesenheit vor Ort".
     * @param {string[]} freeSentences Sätze aus dem Fließtext.
     * @returns {string[]} Hinweise im Originalwortlaut.
     */
    buildNotes(labelSentences, presence, freeSentences) {
        const candidates = [...labelSentences];
        if (presence) candidates.push(`${WorkModelConstants.PRESENCE_LABEL}: ${presence.value}`);
        candidates.push(...freeSentences);

        const notes = [];
        const seen = new Set();

        for (const candidate of candidates) {
            for (const note of this.shorten(candidate)) {
                const key = note.toLowerCase();
                if (seen.has(key)) continue;

                seen.add(key);
                notes.push(note);
            }
        }

        return notes.slice(0, WorkModelConstants.NOTE_MAX_COUNT);
    }

    /**
     * Kürzt einen Hinweis auf höchstens NOTE_MAX_WORDS Wörter: Ein zu langer Satz wird an
     * Semikolon, Gedankenstrich oder Komma geteilt; es bleiben nur Teile mit Bezug zum
     * Arbeitsmodell und mindestens NOTE_MIN_WORDS Wörtern.
     * @param {string} sentence Satz im Originalwortlaut.
     * @returns {string[]} Hinweise (leer, wenn nichts Kurzes übrig bleibt).
     */
    shorten(sentence) {
        const text = sentence.trim();
        if (!text) return [];
        if (this.countWords(text) <= WorkModelConstants.NOTE_MAX_WORDS) return [text];

        return text
            .split(WorkModelConstants.PART_SPLIT_REGEX)
            .map(part => part.trim())
            .filter(part => this.countWords(part) >= WorkModelConstants.NOTE_MIN_WORDS
                && this.countWords(part) <= WorkModelConstants.NOTE_MAX_WORDS
                && this.isWorkSentence(part));
    }

    // ---------- Hilfen ----------

    /** @returns {string[]} Zeilen des Abschnitts general. */
    generalLines() {
        return this.sections.general?.lines ?? [];
    }

    /**
     * Namen, deren Stichwort genau einer Zeile entspricht (Groß-/Kleinschreibung egal).
     * @param {string[]} lines Kandidatenzeilen.
     * @param {Object<string, string[]>} keywords Name -> Stichwörter (klein).
     * @returns {string[]} gefundene Namen in der Reihenfolge von keywords.
     */
    matchLines(lines, keywords) {
        const values = lines.map(line => line.trim().toLowerCase());

        return Object.entries(keywords)
            .filter(([, list]) => list.some(word => values.includes(word)))
            .map(([label]) => label);
    }

    /**
     * Prüft, ob ein Stichwort als ganzes Wort im Text vorkommt.
     * @param {string} text Text.
     * @param {string} word Stichwort (klein).
     * @returns {boolean} true, wenn enthalten.
     */
    containsWord(text, word) {
        if (!text) return false;

        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`(?:^|[^\\p{L}])${escaped}(?![\\p{L}])`, "iu").test(text);
    }

    /**
     * Teilt eine Zeile in Sätze und entfernt Aufzählungszeichen.
     * @param {string} line Zeile.
     * @returns {string[]} Sätze.
     */
    splitSentences(line) {
        return line
            .replace(/^[\s•*·–—-]+/u, "")
            .split(WorkModelConstants.SENTENCE_SPLIT_REGEX)
            .map(sentence => sentence.trim())
            .filter(Boolean);
    }

    /**
     * @param {string} sentence Satz.
     * @returns {boolean} true, wenn der Satz vom Arbeitsmodell handelt.
     */
    isWorkSentence(sentence) {
        return WorkModelConstants.NOTE_KEYWORD_REGEX.test(sentence);
    }

    /**
     * @param {string} line Zeile hinter "Arbeitsmodell: ...".
     * @returns {boolean} true, wenn der Hinweisblock hier endet.
     */
    endsLabelBlock(line) {
        if (!line) return true;
        if (/^https?:\/\//i.test(line)) return true;
        if (WorkModelConstants.PRESENCE_LABEL_REGEX.test(line)) return true;

        // Kurze Zeile ohne Satzzeichen = Beschriftung des nächsten Feldes.
        return this.countWords(line) <= 3 && !/[.!?]$/.test(line);
    }

    /**
     * @param {number} index Zeilenindex.
     * @returns {string} nächste nicht leere Zeile oder "".
     */
    nextLine(index) {
        for (let next = index + 1; next < this.allLines.length; next++) {
            if (this.allLines[next].trim()) return this.allLines[next];
        }

        return "";
    }

    /**
     * @param {string} text Text.
     * @returns {number} Anzahl der Wörter.
     */
    countWords(text) {
        return String(text).split(/\s+/).filter(Boolean).length;
    }

    /**
     * @param {string} value Zahl als Text.
     * @returns {number|null} Tage von 0 bis MAX_DAYS, sonst null.
     */
    toDays(value) {
        const days = Number(value);
        return Number.isInteger(days) && days >= 0 && days <= WorkModelConstants.MAX_DAYS ? days : null;
    }
}
