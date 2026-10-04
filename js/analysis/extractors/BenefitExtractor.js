import { BenefitConstants } from "../../constants/BenefitConstants.js";

/**
 * Ermittelt die Benefits aus dem Anzeigentext.
 *
 * Gesucht wird ueber die Rubriken aus BenefitConstants.BENEFIT_TAGS. Gespeichert
 * werden die Tags in ihrer Anzeige-Schreibweise ("JobRad", "13. Gehalt"); die
 * Rubrik determines nur die Farbe in der Anzeige.
 */
export class BenefitExtractor {

    constructor(lines, rubrics = BenefitConstants.BENEFIT_TAGS) {
        this.lines = lines;
        this.rubrics = rubrics;
    }

    /**
     * Liefert die gefundenen Benefits.
     * @returns {{tags: string[], content: string[]}} Tags und Originalzeilen.
     */
    extractBenefits() {
        const text = this.lines.join(" ").toLowerCase();
        const tags = [];

        for (const rubric of this.rubrics) {
            for (const tag of rubric.tags) {
                if (!tags.includes(tag) && this.containsKeyword(text, tag)) tags.push(tag);
            }
        }

        return {
            tags,
            content: this.lines
        };
    }

    /**
     * Prueft ein Stichwort mit Wortgrenzen, damit z. B. "Bonus" nicht in
     * "Bonus mal" und "Remote" nicht in "remotely" faengt.
     * @param {string} text Gesuchter Text in Kleinschreibung.
     * @param {string} keyword Stichwort aus der Rubrik.
     * @returns {boolean} true, wenn das Stichwort vorkommt.
     */
    containsKeyword(text, keyword) {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        return new RegExp(`(^|[^a-z0-9+#])${escaped}($|[^a-z0-9+#])`, "iu").test(text);
    }
}