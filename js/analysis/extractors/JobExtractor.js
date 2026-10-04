import { MoneyExtractor } from "./MoneyExtractor.js";
import { TaskExtractor } from "./TaskExtractor.js";
import { LocationExtractor } from "./LocationExtractor.js";
import { StreetExtractor } from "./StreetExtractor.js";
import { JobConstants } from "../../constants/JobConstants.js";
import { ParserConstants } from "../../constants/ParserConstants.js";

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
        const employmentType = this.findEmploymentType();
        const workModel = this.findWorkModel();

        return {
            title: this.findTitle(),
            referenceNumber: this.findReferenceNumber(),
            employmentType,
            workModel,
            tags: this.findTags(employmentType, workModel),
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
     * Sucht die Beschaeftigungsart anhand JobConstants.EMPLOYMENT_TYPE.
     * @returns {string} Beschaeftigungsart oder "".
     */
    findEmploymentType() {
        return this.findInConstants(this.sections.general?.lines, JobConstants.EMPLOYMENT_TYPE);
    }

    /**
     * Sucht das Arbeitsmodell anhand JobConstants.WORK_MODEL.
     * @returns {string[]} erkannte Arbeitsmodelle.
     */
    findWorkModel() {
        const found = this.findInConstants(this.sections.general?.lines, JobConstants.WORK_MODEL);

        return found ? [found] : [];
    }

    /**
     * Sucht eine Zeile aus einer Liste bekannter Werte.
     * @param {string[]} lines Kandidatenzeilen.
     * @param {string[]} values Bekannte Werte aus den Constants.
     * @returns {string} gefundener Wert oder "".
     */
    findInConstants(lines, values) {
        for (const line of lines ?? []) {
            const value = line.trim().toLowerCase();
            const match = values.find(entry => value === entry.toLowerCase());
            if (match) return match;
        }

        return "";
    }

    /**
     * Sammelt Badges aus ParserConstants.JOB_TAG_KEYWORDS. Begriffe, die bereits
     * als Arbeitsmodell oder Beschaeftigungsart erkannt wurden, werden nicht
     * doppelt als Badge uebernommen.
     * @param {string} employmentType Erkannte Beschaeftigungsart.
     * @param {string[]} workModel Erkannte Arbeitsmodelle.
     * @returns {string[]} Badge-Begriffe.
     */
    findTags(employmentType, workModel) {
        const used = [employmentType, ...workModel].map(value => (value || "").toLowerCase());
        const lines = (this.sections.general?.lines ?? []).map(line => line.trim().toLowerCase());
        const tags = [];

        for (const keyword of ParserConstants.JOB_TAG_KEYWORDS) {
            const value = keyword.toLowerCase();
            if (used.includes(value)) continue;
            if (!lines.includes(value)) continue;

            tags.push(keyword);
        }

        return tags;
    }

    /**
     * Sucht die Adresse des Arbeitsplatzes in drei Stufen:
     *   1. ab einem Adress-Begriff ("zu erreichen", "Schreib uns an", ...),
     *   2. ohne Begriff in den Kontakt- und Teamabschnitten,
     *   3. sonst leer - dann uebernimmt AnalysisController die Firmenadresse.
     * @returns {object} Adressdaten passend zum AddressModel.
     */
    findWorkLocation() {
        const lines = JobConstants.ADDRESS_SECTIONS.flatMap(name => this.sections[name]?.lines ?? []);
        const hint = this.findAddressHintIndex(lines);

        if (hint >= 0) {
            return this.extractAddress(lines.slice(hint, hint + JobConstants.ADDRESS_MAX_LINES));
        }

        for (const name of JobConstants.CONTACT_ADDRESS_SECTIONS) {
            const found = this.extractAddress(this.sections[name]?.lines ?? []);
            if (found.zip || found.city || found.street) return found;
        }

        return {};
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
