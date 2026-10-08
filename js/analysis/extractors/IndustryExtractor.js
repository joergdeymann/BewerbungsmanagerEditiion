import { IndustryConstants } from "../../constants/IndustryConstants.js";
import { ParserConstants } from "../../constants/ParserConstants.js";

/**
 * Erkennt eine Branchenangabe ohne Label: eine kurze Zeile, die ein Stichwort aus
 * IndustryConstants.INDUSTRIES enthaelt (z. B. "IT-Dienstleistungen und IT-Beratung").
 */
export class IndustryExtractor {
    static MAX_WORDS = 7;
    static MAX_CHARS = 60;

    /**
     * @param {string[]} lines Zeilen der Firmenabschnitte.
     */
    constructor(lines) {
        this.lines = lines ?? [];
    }

    /**
     * @returns {string} Text der ersten passenden Zeile oder "".
     */
    extractIndustry() {
        const line = this.lines.map(item => item.trim()).find(item => this.isCandidate(item) && IndustryConstants.match(item));
        return line ?? "";
    }

    /**
     * Kurze Zeile ohne Satzende; keine Stellenbezeichnung, keine Anrede und keine URL.
     * @param {string} line Zu pruefende Zeile.
     * @returns {boolean} true, wenn die Zeile eine Branchenangabe sein kann.
     */
    isCandidate(line) {
        if (!line || line.length > IndustryExtractor.MAX_CHARS) return false;
        if (line.split(/\s+/).length > IndustryExtractor.MAX_WORDS) return false;
        if (/[.!?:]$/.test(line) || /^https?:|^www\./i.test(line)) return false;
        if (/^(du|sie|wir|ihr|ich)\s/i.test(line)) return false;

        return !ParserConstants.JOB_TITLE_HINTS.some(pattern => pattern.test(line));
    }
}
