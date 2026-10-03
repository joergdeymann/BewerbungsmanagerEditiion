import { CompanyNameExtractor } from "./CompanyNameExtractor.js"
import { PhoneExtractor } from "./PhoneExtractor.js"
import { EmailExtractor } from "./EmailExtractor.js"
import { StreetExtractor } from "./StreetExtractor.js"
import { LocationExtractor } from "./LocationExtractor.js"
import { DomainExtractor } from "./DomainExtractor.js"
import { PostBoxExtractor } from "./PostBoxExtractor.js"
import { CompanyConstants } from "../../constants/CompanyConstants.js"
import { FormatUtils } from "../../utils/FormatUtils.js"

export class CompanyExtractor {
    /**
     * @param {string[]} lines Kombinierte Zeilen (Kontakt + Firmeninfo + Team).
     * @param {string[]} [companyInfoLines] Zeilen der companyInformation-Sektion (für die Beschreibung).
     */
    constructor(lines, companyInfoLines = []) {
        this.lines = lines;
        this.companyInfoLines = companyInfoLines;
    }

    extractCompany() {
        const name = new CompanyNameExtractor(this.lines).extractCompanyName();

        return {
            name,
            phone: new PhoneExtractor(this.lines).extractFirstPhoneNumber(),
            email: new EmailExtractor(this.lines).extractFirstEmail(),
            street: new StreetExtractor(this.lines).extractStreet(),
            location: new LocationExtractor(this.lines).extractLocation(),
            domain: new DomainExtractor(this.lines).extractDomain(),
            postbox: new PostBoxExtractor(this.lines).extractPostbox(),
            legalForm: this.extractLegalForm(name),
            industry: this.extractInfoValue("industry"),
            size: this.extractInfoValue("size"),
            founded: this.extractInfoValue("founded"),
            website: this.extractInfoValue("website"),
            verifiedAt: FormatUtils.parseGermanDate(this.extractInfoValue("verifiedAt")),
            specialties: this.extractSpecialties(),
            description: this.extractDescription()
        }
    }

    /**
     * Liest den Wert zu einem Firmeninfo-Label (zweizeilig: Label -> Folgezeile).
     * @param {string} key Schlüssel aus CompanyConstants.COMPANY_INFO_LABELS.
     * @returns {string} Gefundener Wert oder "".
     */
    extractInfoValue(key) {
        const labels = CompanyConstants.COMPANY_INFO_LABELS[key] ?? [];

        for (let i = 0; i < this.lines.length; i++) {
            const match = CompanyConstants.matchInfoLabel(this.lines[i], labels);
            if (!match) continue;

            if (match.value) return match.value;

            const value = this.nextContentLine(i);
            if (value) return value;
        }

        return "";
    }

    /**
     * Erste nicht-leere Zeile nach dem angegebenen Index.
     * @param {number} index Index der Labelzeile.
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
     * Rechtsform aus explizitem Label oder aus dem Rechtsform-Suffix des Namens/Textes.
     * @param {string} name Extrahierter Firmenname.
     * @returns {string} Schlüssel aus LegalFormConstants.FORM oder "".
     */
    extractLegalForm(name) {
        const explicit = this.extractInfoValue("legalForm");
        if (explicit) {
            const form = CompanyConstants.matchLegalForm(explicit);
            if (form) return form;
        }

        return CompanyConstants.matchLegalForm(name)
            || CompanyConstants.matchLegalForm(this.lines.join(" "));
    }

    /**
     * Spezialgebiete als Liste (kommagetrennt in einer Wertzeile).
     * @returns {string[]} Liste der Spezialgebiete.
     */
    extractSpecialties() {
        const raw = this.extractInfoValue("specialties");
        if (!raw) return [];

        return raw
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    /**
     * Firmenbeschreibung = Fließtext der companyInformation-Sektion ohne Label-/Wertzeilen.
     * @returns {string} Bereinigter Beschreibungstext.
     */
    extractDescription() {
        const result = [];
        let skipValue = false;

        for (const rawLine of this.companyInfoLines ?? []) {
            const line = rawLine.trim();
            if (!line) continue;

            if (skipValue) { skipValue = false; continue; }
            if (CompanyConstants.isInfoLabelLine(line)) { skipValue = true; continue; }
            if (CompanyConstants.COMPANY_INFO_IGNORE.has(line.toLowerCase())) continue;
            if (/linkedin/i.test(line) || this.isUrlLine(line)) continue;
            if (this.isJobTitleLine(line)) continue;

            result.push(line);
        }

        return result.join("\n").trim();
    }

    /**
     * Erkennt reine URL-Zeilen (z. B. Impressum-Links ohne Label).
     * @param {string} line Zu prüfende Zeile.
     * @returns {boolean} true, wenn die Zeile eine URL ist.
     */
    isUrlLine(line) {
        return /^https?:\/\//i.test(line)
            || /^www\./i.test(line)
            || /^[\w-]+\.[a-z]{2,}(\/|$)/i.test(line);
    }

    /**
     * Erkennt Zeilen, die eine Stellenbezeichnung sind (z. B. "Full-Stack-Entwickler (m/w/d)").
     * @param {string} line Zu prüfende Zeile.
     * @returns {boolean} true, wenn die Zeile eine Stellenbezeichnung ist.
     */
    isJobTitleLine(line) {
        return /\([mwdxyf](?:\/[mwdxyf]){1,2}\)/i.test(line);
    }
}
