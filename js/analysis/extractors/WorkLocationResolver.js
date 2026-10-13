import { BranchExtractor } from "./BranchExtractor.js";

/**
 * Bestimmt den genauen Arbeitsort, wenn die Kopfzeile der Anzeige nur eine Region nennt.
 *
 * Beispiel: Kopfzeile "Osnabrück, Niedersachsen, Deutschland", im Text "BISSENDORF (bei Osnabrück)"
 * und in der Standortliste "Gewerbepark, 9-11, Bissendorf (near Osnabrück), Deutschland 49143":
 * Arbeitsort ist dann Bissendorf mit der Adresse aus der Standortliste.
 */
export class WorkLocationResolver {

    /**
     * @param {string[]} lines Alle Zeilen des analysierten Textes.
     */
    constructor(lines) {
        this.lines = lines ?? [];
        this.branchParser = new BranchExtractor([]);
    }

    /**
     * @param {object} workLocation Arbeitsort aus der Kopfzeile (flach: street, houseNumber, city, zip, country).
     * @param {string[]} [branches] Standortliste der Firma (Text je Standort).
     * @returns {object} Verfeinerter Arbeitsort, sonst unverändert.
     */
    resolve(workLocation, branches = []) {
        const base = workLocation ?? {};
        if (!base.city || base.street || base.zip) return base;

        const entry = this.entryNear(base.city, branches);
        const locality = entry ? this.parse(entry)?.city : this.localityNear(base.city);
        if (!locality) return base;

        const match = entry ?? this.entryOf(locality, branches);
        const address = match ? this.parse(match) : null;

        return address
            ? { ...base, ...address, country: address.country || base.country }
            : { ...base, city: locality };
    }

    /**
     * Ort aus dem Text: "BISSENDORF (bei Osnabrück)" -> "Bissendorf".
     * @param {string} region Ort der Kopfzeile.
     * @returns {string} Ortsname oder "".
     */
    localityNear(region) {
        const pattern = new RegExp(`([\\p{Lu}][\\p{L}ß-]+)\\s*\\(\\s*(?:bei|near|nahe)\\s+${this.escape(region)}\\s*\\)`, "iu");

        // Der Ort steht auf Jobbörsen oft in einer eigenen Zeile über der Klammer ("BISSENDORF" / "(bei Osnabrück).").
        const found = this.lines.join(" ").match(pattern)?.[1];
        return found ? found.charAt(0).toUpperCase() + found.slice(1).toLowerCase() : "";
    }

    /**
     * Standort der Liste, der ausdrücklich bei der Region liegt: "... Bissendorf (near Osnabrück) ...".
     * @param {string} region
     * @param {string[]} branches
     * @returns {string|undefined}
     */
    entryNear(region, branches) {
        const pattern = new RegExp(`\\(\\s*(?:bei|near|nahe)\\s+${this.escape(region)}\\s*\\)`, "i");
        return (branches ?? []).find(entry => pattern.test(entry) && this.parse(entry));
    }

    /**
     * Standort der Liste mit dem Ortsnamen.
     * @param {string} locality
     * @param {string[]} branches
     * @returns {string|undefined}
     */
    entryOf(locality, branches) {
        const pattern = new RegExp(`(?:^|,\\s*)${this.escape(locality)}(?:\\s*\\([^)]*\\))?\\s*,`, "i");
        return (branches ?? []).find(entry => pattern.test(entry) && this.parse(entry));
    }

    /**
     * Zerlegt einen Listeneintrag ("Name – Straße, Nr, Ort (near X), Land PLZ") in Adressdaten.
     * @param {string} entry
     * @returns {{street: string, houseNumber: string, zip: string, city: string, country: string}|null}
     */
    parse(entry) {
        return this.branchParser.parseAddress(entry.includes(" – ") ? entry.split(" – ").pop() : entry);
    }

    /** @param {string} value @returns {string} Wert für einen regulären Ausdruck. */
    escape(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
