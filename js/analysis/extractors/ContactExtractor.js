import { ContactConstants } from "../../constants/ContactConstants.js";

/**
 * Findet Ansprechpartner in einem Anzeigentext über die Anrede
 * ("Herr/Frau <Name>") und ermittelt, wenn möglich, die Positionszeile.
 */
export class ContactExtractor {
    /**
     * @param {string[]} lines Bereinigte Textzeilen (gesamter Anzeigentext).
     */
    constructor(lines) {
        this.lines = lines;
    }

    /**
     * Liefert alle gefundenen Ansprechpartner (dedupliziert nach Name).
     * @returns {Array<{name: object, role: string, email: string, phone: string}>}
     */
    extractContacts() {
        const contacts = [];
        const seen = new Set();

        for (const person of this.matchSalutations()) {
            const key = `${person.firstname} ${person.lastname}`.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);

            contacts.push({
                name: {
                    salutation: person.salutation,
                    title: "",
                    firstname: person.firstname,
                    lastname: person.lastname
                },
                role: this.findRole(person.firstname, person.lastname),
                email: "",
                phone: ""
            });
        }

        return contacts;
    }

    /**
     * Findet alle Anrede+Name-Vorkommen in den Zeilen.
     * @returns {Array<{salutation: string, firstname: string, lastname: string}>}
     */
    matchSalutations() {
        const results = [];
        const regex = new RegExp(ContactConstants.SALUTATION_NAME_REGEX.source, "gu");

        for (const line of this.lines) {
            for (const match of line.matchAll(regex)) {
                const tokens = match[2].trim().split(/\s+/);
                if (tokens.length < 2) continue;

                results.push({
                    salutation: ContactConstants.SALUTATION_MAP[match[1].toLowerCase()] ?? "",
                    firstname: tokens[0],
                    lastname: tokens[tokens.length - 1]
                });
            }
        }

        return results;
    }

    /**
     * Sucht die Positionszeile direkt unter der alleinstehenden Namenszeile.
     * @param {string} firstname Vorname.
     * @param {string} lastname Nachname.
     * @returns {string} Position oder "".
     */
    findRole(firstname, lastname) {
        const fullName = `${firstname} ${lastname}`.toLowerCase();

        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].trim().toLowerCase() !== fullName) continue;

            const candidate = this.nextContentLine(i);
            if (candidate && this.isRoleLine(candidate)) return candidate.trim();
        }

        return "";
    }

    /**
     * Erste nicht-leere Zeile nach dem angegebenen Index.
     * @param {number} index Ausgangsindex.
     * @returns {string} Folgezeile oder "".
     */
    nextContentLine(index) {
        for (let i = index + 1; i < this.lines.length; i++) {
            const value = this.lines[i].trim();
            if (value) return value;
        }

        return "";
    }

    /**
     * Prüft, ob eine Zeile eine Positionsangabe sein kann.
     * @param {string} line Zu prüfende Zeile.
     * @returns {boolean} true, wenn die Zeile wie eine Position aussieht.
     */
    isRoleLine(line) {
        if (line.length > ContactConstants.ROLE_MAX_LENGTH) return false;
        if (/\d/.test(line)) return false;
        if (/https?:|www\./i.test(line)) return false;
        if (ContactConstants.LEGAL_FORM_HINT.test(line)) return false;

        return true;
    }
}
