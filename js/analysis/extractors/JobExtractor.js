import { MoneyExtractor } from "./MoneyExtractor.js";
import { TaskExtractor } from "./TaskExtractor.js";
import { LocationExtractor } from "./LocationExtractor.js";
import { StreetExtractor } from "./StreetExtractor.js";
import { WorkModelExtractor } from "./WorkModelExtractor.js";
import { JobConstants } from "../../constants/JobConstants.js";
import { ParserConstants } from "../../constants/ParserConstants.js";
import { WorkModelConstants } from "../../constants/WorkModelConstants.js";

/**
 * Ermittelt die Stellendaten aus dem Anzeigentext.
 *
 * Vorgehen in drei Stufen (Sprint aus AI/workflow/WORKFLOW.md):
 *   1. Sektion waehlen (general, companyInformation, contact, team).
 *   2. Feste Begriffe aus ParserConstants / JobConstants suchen.
 *   3. Feinfilter je Feld anwenden.
 *
 * Die Regeln stehen ausschliesslich in den Constants, damit sie ohne
 * Codeaenderung an weiteren Beispielen erweitert werden koennen.
 */
export class JobExtractor {
    /**
     * @param {object} sections Geparste Sektionen (Name -> { lines: string[] }).
     * @param {string[]} [contactLines] Zeilen des Kontaktblocks.
     * @param {string[]} [allLines] Alle Zeilen des Anzeigentexts (letzte Instanz).
     */
    constructor(sections, contactLines = [], allLines = []) {
        this.sections = sections ?? {};
        this.contactLines = contactLines ?? [];
        this.allLines = allLines ?? [];
    }

    /**
     * Liefert die vollstaendigen Stellendaten.
     * @returns {object} Stellendaten passend zum JobModel.
     */
    extractJob() {
        const workModel = new WorkModelExtractor(this.sections, this.allLines).extract();

        return {
            title: this.findTitle(),
            referenceNumber: this.findReferenceNumber(),
            workModel,
            tags: this.findTags(workModel),
            wage: new MoneyExtractor(this.wageLines()).extractMoney(),
            workLocation: this.findWorkLocation(),
            tasks: new TaskExtractor().extract(
                (this.sections.tasks?.lines ?? []).join("\n")
            ),
            companyId: 0,
            contactId: 0
        };
    }

    /**
     * Zeilen, in denen nach Gehaltsangaben gesucht wird (MoneyExtractor).
     * General-, Benefits-, Kontakt-, Firmen- und Teamabschnitt.
     */
    wageLines() {
        return [
            ...(this.sections.general?.lines ?? []),
            ...(this.sections.benefits?.lines ?? []),
            ...(this.contactLines),
            ...(this.sections.companyInformation?.lines ?? []),
            ...(this.sections.team?.lines ?? [])
        ];
    }

    /**
     * Sucht die Stellenbezeichnung. Bevorzugt companyInformation, weil dort der
     * Anzeigenheader steht.
     * @returns {string} Stellenbezeichnung oder "".
     */
    findTitle() {
        for (const name of JobConstants.TITLE_SECTIONS) {
            for (const line of this.sections[name]?.lines ?? []) {
                if (this.isJobTitle(line)) return line.trim();
            }
        }

        return "";
    }

    /**
     * Feinfilter fuer eine Stellenbezeichnung.
     * @param {string} line Kandidatenzeile.
     * @returns {boolean} true, wenn die Zeile eine Stellenbezeichnung ist.
     */
    isJobTitle(line) {
        const value = line.trim();
        if (value.length < JobConstants.TITLE_MIN_LENGTH) return false;
        if (value.length > JobConstants.TITLE_MAX_LENGTH) return false;
        if (this.isBlockHint(value)) return false;
        if (!ParserConstants.JOB_TITLE_HINTS.some(hint => hint.test(value))) return false;

        return !this.isSentence(value);
    }

    /**
     * Prueft, ob eine Zeile ein Ueberschriften- oder Buttonbegriff ist.
     * @param {string} value Zeile.
     * @returns {boolean} true, wenn die Zeile kein Titel ist.
     */
    isBlockHint(value) {
        const lower = value.toLowerCase();

        return ParserConstants.TITLE_BLOCK_HINTS.some(hint => lower.includes(hint))
            || /https?:|www\.|@/u.test(value);
    }

    /**
     * Erkennt Fliesstext: zu viele Woerter oder ein Satz mit Folge-Grossschreibung.
     * @param {string} value Zeile.
     * @returns {boolean} true, wenn die Zeile Fliesstext ist.
     */
    isSentence(value) {
        const words = value.split(/\s+/).length;

        return words > JobConstants.TITLE_MAX_WORDS || /[.!?;:]\s+\p{Lu}/u.test(value);
    }

    /**
     * Sucht die Kennziffer des Arbeitgebers: bevorzugt neben einem
     * Kennziffer-Begriff, sonst als Muster in Sektion und Kontaktblock.
     * @returns {string} Kennziffer oder "".
     */
    findReferenceNumber() {
        const lines = this.allCandidateLines();

        for (const line of lines) {
            if (!ParserConstants.REFERENCE_HINTS.some(hint => hint.test(line))) continue;

            const match = line.match(ParserConstants.REFERENCE_VALUE_REGEX);
            if (match) return match[1];
        }

        for (const line of lines) {
            const match = line.match(ParserConstants.REFERENCE_VALUE_REGEX);
            if (match) return match[1];
        }

        return "";
    }

    /**
     * Alle Zeilen, die fuer die Kennziffer infrage kommen.
     * @returns {string[]} Kandidatenzeilen.
     */
    allCandidateLines() {
        return [
            ...this.contactLines,
            ...(this.sections.general?.lines ?? []),
            ...(this.sections.benefits?.lines ?? []),
            ...(this.sections.companyInformation?.lines ?? []),
            ...(this.sections.team?.lines ?? []),
            ...this.allLines
        ];
    }

    /**
     * Sammelt Badges aus ParserConstants.JOB_TAG_KEYWORDS. Begriffe, die bereits
     * als Art der Anstellung oder als Arbeitstage (WorkModel) erkannt wurden,
     * werden nicht doppelt als Badge uebernommen (auch nicht in anderer
     * Schreibweise, z. B. "Home Office" fuer Homeoffice).
     * @param {{type: string[], workDays: {type: string}[]}} workModel Erkanntes Arbeitsmodell.
     * @returns {string[]} Badge-Begriffe.
     */
    findTags(workModel) {
        const used = [...workModel.type, ...workModel.workDays.map(day => day.type)]
            .map(value => value.toLowerCase());
        const lines = (this.sections.general?.lines ?? []).map(line => line.trim().toLowerCase());
        const tags = [];

        for (const keyword of ParserConstants.JOB_TAG_KEYWORDS) {
            const value = keyword.toLowerCase();
            if (used.includes(value)) continue;
            if (used.includes(WorkModelConstants.canonical(keyword).toLowerCase())) continue;
            if (!lines.includes(value)) continue;

            tags.push(keyword);
        }

        return tags;
    }

    /**
     * Sucht die Adresse des Arbeitsplatzes in drei Stufen:
     *   1. ab einem Adress-Begriff ("zu erreichen", "Schreib uns an", ...),
     *   2. ohne Begriff in den Kontakt- und Teamabschnitten,
     *   3. Kopfzeile der Anzeige ("Ort, Bundesland, Land"),
     *   4. sonst leer - dann uebernimmt AnalysisController die Firmenadresse.
     * @returns {object} Adressdaten passend zum AddressModel.
     */
    findWorkLocation() {
        const lines = JobConstants.ADDRESS_SECTIONS.flatMap(name => this.sections[name]?.lines ?? []);
        const hint = this.findAddressHintIndex(lines);

        if (hint >= 0) {
            const found = this.extractAddress(lines.slice(hint, hint + JobConstants.ADDRESS_MAX_LINES));
            if (found.zip || found.city || found.street) return found;
        }

        for (const name of JobConstants.CONTACT_ADDRESS_SECTIONS) {
            const found = this.extractAddress(this.sections[name]?.lines ?? []);
            if (found.zip || found.city || found.street) return found;
        }

        // Kopfzeile der Anzeige: "Ort, Bundesland, Land" (Arbeitsort der Stelle).
        const header = (this.sections.general?.lines ?? []).slice(0, ParserConstants.HEADER_LINES);
        const city = new LocationExtractor(header).extractByHeaderLine();

        return city ? { ...city, street: "", houseNumber: "" } : {};
    }

    /**
     * Wertet Adressdaten aus einem Zeilen-Abschnitt aus.
     * @param {string[]} lines Zeilen des Adressblocks.
     * @returns {object} Adressdaten passend zum AddressModel.
     */
    extractAddress(lines) {
        if (!lines.length) return {};

        const location = new LocationExtractor(lines).extractLocation();
        const street = new StreetExtractor(lines).extractStreet();

        return {
            ...(location ?? {}),
            street: street?.name ?? "",
            houseNumber: street?.houseNumber ?? ""
        };
    }

    /**
     * Findet die erste Zeile, die einen Adress-Begriff enthaelt.
     * @param {string[]} lines Kandidatenzeilen.
     * @returns {number} Index der Zeile oder -1.
     */
    findAddressHintIndex(lines) {
        for (let i = 0; i < lines.length; i++) {
            const lower = lines[i].toLowerCase();

            if (ParserConstants.ADDRESS_HINTS.some(hint => lower.includes(hint))) return i;
        }

        return -1;
    }
}
