import { BranchConstants } from "../../constants/BranchConstants.js";

/**
 * Ermittelt die Standorte eines Unternehmens: Liste als Text und Anzahl.
 * Quellen in dieser Reihenfolge: Adressliste ("Orte", LinkedIn-Info-Seite),
 * Aufzaehlung der Orte ("📍Garbsen, Bissendorf, Berlin"). Die Anzahl stammt aus Angaben
 * wie "an drei Standorten" oder aus der Laenge der Liste (der groessere Wert gilt).
 */
export class BranchExtractor {

    /**
     * @param {string[]} lines Zeilen der Firmenabschnitte.
     */
    constructor(lines) {
        this.lines = lines ?? [];
    }

    /**
     * @returns {{locations: string[], count: number, primary: object|null, blockLines: string[]}}
     *          primary = Adresse des Hauptstandorts (street, houseNumber, zip, city, country),
     *          blockLines = Zeilen der Adressliste (gehoeren nicht in die Firmenbeschreibung).
     */
    extract() {
        const block = this.readBlock();
        const locations = block.entries.length ? block.entries : this.readPinLine();
        const stated = this.readStatedCount();

        return {
            locations,
            count: Math.max(stated, locations.length),
            primary: block.primary ? this.parseAddress(block.primary) : null,
            blockLines: block.lines
        };
    }

    /**
     * Liest die Adressliste hinter einer Zeile wie "Orte". Eine Namenszeile vor der Adresse
     * ("Kohake Center") wird dem Eintrag vorangestellt; "Primär" markiert den Hauptstandort.
     */
    readBlock() {
        const start = this.lines.findIndex(line => BranchConstants.BLOCK_LABELS.includes(line.trim().toLowerCase()));
        const block = { entries: [], primary: null, lines: [] };
        if (start < 0) return block;

        block.lines.push(this.lines[start]);
        let name = "";
        let isPrimary = false;

        for (const raw of this.lines.slice(start + 1)) {
            const line = raw.trim();
            const lower = line.toLowerCase();
            if (!line) continue;

            if (BranchConstants.PRIMARY_MARKERS.includes(lower)) { isPrimary = true; block.lines.push(raw); continue; }
            if (BranchConstants.COUNTRY_LINES.has(lower)) { block.lines.push(raw); continue; }

            if (this.isAddressLine(line)) {
                block.entries.push(name ? `${name} – ${line}` : line);
                if (isPrimary && !block.primary) block.primary = line;
                block.lines.push(raw);
                name = "";
                isPrimary = false;
                continue;
            }

            if (!this.isNameLine(line)) break;
            name = line;
            block.lines.push(raw);
        }

        return block;
    }

    isAddressLine(line) {
        return line.length <= BranchConstants.MAX_ADDRESS_CHARS && BranchConstants.ADDRESS_LINE_REGEX.test(line);
    }

    isNameLine(line) {
        return line.split(/\s+/).length <= BranchConstants.MAX_NAME_WORDS && !/[.!?:]$/.test(line);
    }

    /** Orte aus einer Aufzaehlung ("📍Garbsen, Bissendorf, Berlin"). */
    readPinLine() {
        for (const line of this.lines) {
            const lower = line.toLowerCase();
            const marker = BranchConstants.PIN_MARKERS.find(item => lower.includes(item));
            if (!marker) continue;

            const rest = line.slice(lower.indexOf(marker) + marker.length);
            const places = rest.split(/\s*(?:,|&|\bund\b)\s*/i).map(place => place.trim()).filter(Boolean);
            if (places.length) return places;
        }
        return [];
    }

    /** Anzahl aus Angaben wie "an drei Standorten" (0, wenn keine genannt wird). */
    readStatedCount() {
        for (const line of this.lines) {
            const match = line.match(BranchConstants.STATED_COUNT_REGEX);
            if (!match) continue;

            const word = match[1].toLowerCase();
            return Number(word) || BranchConstants.NUMBER_WORDS[word] || 0;
        }
        return 0;
    }

    /**
     * Zerlegt eine Adresszeile: "Berenbosteler Str. 76 B, Garbsen (near Hannover), Deutschland 30823".
     * @param {string} line Adresszeile mit Postleitzahl am Ende.
     * @returns {{street: string, houseNumber: string, zip: string, city: string, country: string}|null}
     */
    parseAddress(line) {
        const parts = line.split(",").map(part => part.trim()).filter(Boolean);
        const tail = (parts.pop() ?? "").match(/^(?:(.+?)\s+)?(\d{4,5})$/);
        if (!tail) return null;

        const city = (parts.pop() ?? "").replace(/\s*\([^)]*\)/g, "").trim();
        const streetText = parts.join(" ");
        const split = streetText.match(/^(.*?)[\s,]+(\d+(?:\s?[A-Za-z])?(?:\s?[-–/]\s?\d+)?)$/);

        return {
            street: split ? split[1].trim() : streetText,
            houseNumber: split ? split[2].trim() : "",
            zip: tail[2],
            city,
            country: BranchConstants.COUNTRY_NAMES[(tail[1] ?? "").toLowerCase()] ?? ""
        };
    }
}
