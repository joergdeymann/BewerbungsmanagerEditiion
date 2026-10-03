import { ContactConstants } from "../../constants/ContactConstants.js";
import { CompanyConstants } from "../../constants/CompanyConstants.js";

/**
 * Findet Ansprechpartner in einem Anzeigentext über die Anrede
 * ("Herr/Frau <Titel> <Name>") und ermittelt Position, E-Mail und Telefon.
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

            const contactLines = this.findContactLines(person);

            contacts.push({
                name: {
                    salutation: person.salutation,
                    title: person.title,
                    firstname: person.firstname,
                    lastname: person.lastname
                },
                role: this.findRole(person.firstname, person.lastname),
                email: this.findContactValue(contactLines, CompanyConstants.EMAIL_PATTERN_G),
                phone: this.findContactValue(contactLines, CompanyConstants.PHONE_PATTERN_G)
            });
        }

        return contacts;
    }

    /**
     * Findet alle Anrede-Vorkommen in den Zeilen und zerlegt Titel und Namen.
     * @returns {Array<{salutation: string, title: string, firstname: string, lastname: string}>}
     */
    matchSalutations() {
        const results = [];
        const regex = new RegExp(ContactConstants.SALUTATION_START_REGEX.source, "gu");

        for (const line of this.lines) {
            for (const match of line.matchAll(regex)) {
                const person = this.parseName(match[2]);
                if (!person) continue;

                results.push({
                    salutation: ContactConstants.SALUTATION_MAP[match[1].toLowerCase()] ?? "",
                    ...person
                });
            }
        }

        return results;
    }

    /**
     * Zerlegt den Text hinter der Anrede in Titel, Vor- und Nachname.
     * @param {string} rest Text hinter der Anrede.
     * @returns {{title: string, firstname: string, lastname: string}|null}
     */
    parseName(rest) {
        const parts = [];
        const titles = [];

        for (const token of (rest ?? "").trim().split(/\s+/)) {
            const clean = token.replace(/[,;:]+$/, "");
            const value = clean.replace(/\.+$/, "");

            if (ContactConstants.TITLE_REGEX.test(clean)) {
                if (parts.length) break;
                titles.push(value);
                continue;
            }

            if (!ContactConstants.NAME_TOKEN_REGEX.test(value)) break;
            parts.push(value);
            if (parts.length === 2) break;
        }

        if (parts.length < 2) return null;

        return { title: titles.join(" "), firstname: parts[0], lastname: parts[1] };
    }

    /**
     * Ermittelt die Zeilen des Kontaktblocks zu einem Ansprechpartner.
     *
     * Der Block beginnt bei jeder Zeile, die den Namen enthaelt, und reicht bis
     * zu einem Stop-Marker, zur naechsten Person oder zur harten Grenze
     * CONTACT_BLOCK_SIZE. Leerzeilen verkuerzen das Fenster auf
     * CONTACT_TAIL_SIZE, sodass Adress- und Firmenzeilen mitgelesen werden,
     * der Block aber nicht in den naechsten Abschnitt ausufert.
     * @param {{firstname: string, lastname: string}} person Erkannter Ansprechpartner.
     * @returns {string[]} Zeilen des Kontaktblocks, in Dokumentreihenfolge.
     */
    findContactLines(person) {
        const fullName = `${person.firstname} ${person.lastname}`.toLowerCase();
        const indexes = new Set();

        for (let i = 0; i < this.lines.length; i++) {
            if (!this.isNameLine(i, fullName)) continue;

            let tail = ContactConstants.CONTACT_BLOCK_SIZE;

            for (let j = i; j < i + ContactConstants.CONTACT_BLOCK_SIZE; j++) {
                if (j >= this.lines.length) break;
                if (j > i && this.startsOtherContact(this.lines[j])) break;
                if (j > i && ContactConstants.CONTACT_BLOCK_STOP_REGEX.test(this.lines[j].trim())) break;
                if (!this.lines[j].trim()) tail = ContactConstants.CONTACT_TAIL_SIZE;
                if (tail <= 0) break;

                indexes.add(j);
                tail--;
            }
        }

        return [...indexes].sort((a, b) => a - b).map(index => this.lines[index]);
    }

    /**
     * Prueft, ob eine Zeile den Namen enthaelt. Neben dem vollen Namen wird auch
     * der Nachname allein akzeptiert, damit Adress- und Firmenzeilen erfasst werden.
     * @param {number} index Zeilenindex.
     * @param {string} fullName Voller Name in Kleinschreibung.
     * @returns {boolean} true, wenn die Zeile zum Ansprechpartner gehoert.
     */
    isNameLine(index, fullName) {
        const line = this.lines[index].toLowerCase();
        return line.includes(fullName);
    }

    /**
     * Prüft, ob eine Zeile mit einem weiteren Ansprechpartner beginnt
     * (damit der Kontaktblock dort endet).
     * @param {string} line Zu prüfende Zeile.
     * @returns {boolean} true, wenn die Zeile eine neue Person einleitet.
     */
    startsOtherContact(line) {
        const regex = new RegExp(ContactConstants.SALUTATION_START_REGEX.source, "u");

        return regex.test(line ?? "");
    }

    /**
     * Liefert E-Mail oder Telefonnummer fuer einen Ansprechpartner.
     *
     * Reihenfolge: zuerst der Kontaktblock (dort bevorzugt Zeilen mit einer
     * Kontakt-Beschriftung), danach - nur wenn im Block nichts gefunden wurde -
     * der gesamte Anzeigentext. Dadurch greift die Zentrale bzw. die
     * Firmenadresse, wenn der Kontakt selbst keine Nummer nennt.
     * @param {string[]} contactLines Zeilen des Kontaktblocks.
     * @param {RegExp} pattern Such-Regex.
     * @returns {string} Treffer oder "".
     */
    findContactValue(contactLines, pattern) {
        return this.findValue(contactLines, pattern) || this.findValue(this.lines, pattern);
    }

    /**
     * Liefert den passenden Wert aus einer Zeilenliste. Zeilen mit einer
     * Kontakt-Beschriftung ("E-Mail:", "Tel.:") werden bevorzugt, damit bei
     * mehreren Nennungen die zum Kontakt gehoerende gewaehlt wird.
     * @param {string[]} lines Zu durchsuchende Zeilen.
     * @param {RegExp} pattern Such-Regex (frische Instanz, damit lastIndex nicht leakt).
     * @returns {string} Treffer oder "".
     */
    findValue(lines, pattern) {
        const regex = new RegExp(pattern.source, pattern.flags.replace("g", ""));
        const labeled = lines.find(line =>
            ContactConstants.CONTACT_LABEL_REGEX.test(line) && regex.test(line)
        );

        if (labeled) return labeled.match(regex)[0].trim();

        for (const line of lines) {
            const match = line.match(regex);
            if (match) return match[0].trim();
        }

        return "";
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
            const line = this.lines[i].trim().toLowerCase();
            const isNameLine = line === fullName || line.endsWith(` ${fullName}`);
            if (!isNameLine) continue;

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