import { ParserConstants } from "../../constants/ParserConstants.js";

/**
 * Trennt den Aufgabenabschnitt einer Anzeige in Aufgaben und Anforderungen.
 * Manche Anzeigen fuehren Aufgaben und Muss-Anforderungen unter einer Ueberschrift auf;
 * die Anforderungen stehen dann am Ende.
 */
export class RequirementSplitter {

    /**
     * @param {string[]} lines Zeilen des Aufgabenabschnitts.
     * @returns {{tasks: string[], requirements: string[]}} Aufgaben vor der ersten Anforderungszeile,
     *          Anforderungen ab dieser Zeile.
     */
    split(lines) {
        const index = lines.findIndex(line => this.isRequirement(line));
        if (index < 0) return { tasks: lines, requirements: [] };

        return { tasks: lines.slice(0, index), requirements: lines.slice(index) };
    }

    /**
     * @param {string} line Zu pruefende Zeile.
     * @returns {boolean} true, wenn die Zeile ein Anforderungs-Marker enthaelt.
     */
    isRequirement(line) {
        const lower = line.toLowerCase();
        return ParserConstants.REQUIREMENT_MARKERS.some(group => group.every(term => lower.includes(term)));
    }
}
