import { ParserConstants } from "../../constants/ParserConstants.js";
import { LineParser } from "../parser/LineParser.js";

export class QualificationExtractor {

    constructor(lines, subFilters = ParserConstants.QUALIFICATION_SUBFILTERS) {
        this.lines = lines;
        this.subFilters = subFilters;
    }

    extractQualifications() {
        const result = {
            required: { tags: [], content: [] },
            preferred: { tags: [], content: [] },
            personal: { tags: [], content: [] }
        };

        // Ziel der letzten Einleitungszeile mit ":" ("Erfahrung in folgenden Gebieten:").
        let inherited = null;

        for (const line of this.lines) {
            let target;

            if (inherited && this.isListItem(line)) {
                target = inherited;
            } else {
                target = this.matchTarget(line.toLowerCase());
                inherited = line.trim().endsWith(":") ? target : null;
            }

            result[target].content.push(line);

            const tags = new LineParser(line).getTags();
            result[target].tags = [...new Set([...result[target].tags, ...tags])];
        }

        return result;
    }

    /**
     * Unterpunkt einer Aufzaehlung: kurz, ohne Satzende und ohne eigenes ":".
     * @param {string} line Zu pruefende Zeile.
     * @returns {boolean} true, wenn die Zeile ein Unterpunkt sein kann.
     */
    isListItem(line) {
        const text = line.trim();
        const words = text.split(/\s+/).length;

        return !/[.!?:]$/.test(text) && words <= ParserConstants.SUBLIST_MAX_WORDS;
    }

    matchTarget(lowerLine) {
        const rule = this.subFilters.find(({ anyOf }) =>
            anyOf.some(term => lowerLine.includes(term))
        );
        return rule ? rule.target : "required";
    }
}
