import { CompanyNameExtractor } from "./CompanyNameExtractor.js"
import { PhoneExtractor } from "./PhoneExtractor.js"
import { EmailExtractor } from "./EmailExtractor.js"
import { StreetExtractor } from "./StreetExtractor.js"
import { LocationExtractor } from "./LocationExtractor.js"
import { DomainExtractor } from "./DomainExtractor.js"
import { PostBoxExtractor } from "./PostBoxExtractor.js"
import { BranchExtractor } from "./BranchExtractor.js"
import { IndustryExtractor } from "./IndustryExtractor.js"
import { CompanyConstants } from "../../constants/CompanyConstants.js"
import { LocationConstants } from "../../constants/LocationConstants.js"
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
        const branches = new BranchExtractor(this.lines).extract();
        const industry = this.extractInfoValue("industry") || new IndustryExtractor(this.lines).extractIndustry();
        const size = CompanyConstants.normalizeSize(this.extractInfoValue("size")) || this.extractSizeFromText();

        return {
            name,
            phone: new PhoneExtractor(this.lines).extractFirstPhoneNumber(),
            email: new EmailExtractor(this.lines).extractFirstEmail(),
            street: this.extractStreet(branches.primary),
            location: this.extractLocation(branches.primary),
            domain: new DomainExtractor(this.lines).extractDomain(),
            postbox: new PostBoxExtractor(this.lines).extractPostbox(),
            legalForm: this.extractLegalForm(name),
            ownership: this.extractOwnership(),
            industry,
            size,
            founded: this.extractInfoValue("founded") || this.extractFoundedFromText(),
            website: this.extractInfoValue("website"),
            verifiedAt: FormatUtils.parseGermanDate(this.extractInfoValue("verifiedAt")),
            specialties: this.extractSpecialties(),
            branches: { locations: branches.locations, count: branches.count },
            description: this.extractDescription(industry, branches.blockLines)
        }
    }

    /**
     * Eigentumsform (z. B. "Privatunternehmen"): Wert hinter dem Label "Typ", sonst eine Zeile,
     * die nur aus einem bekannten Wert besteht. Die Rechtsform (GmbH, AG) ist ein anderes Feld.
     * @returns {string} Eigentumsform oder "".
     */
    extractOwnership() {
        const labeled = this.extractInfoValue("companyType");
        if (labeled) return labeled;

        const line = this.lines.map(item => item.trim()).find(item => CompanyConstants.OWNERSHIP_TYPES.includes(item.toLowerCase()));
        return line ?? "";
    }

    /**
     * Strasse: die Adresse des Hauptstandorts (Adressliste) hat Vorrang vor dem Textfund.
     * @param {object|null} primary Hauptstandort aus BranchExtractor.
     * @returns {{name: string, houseNumber: string}|null}
     */
    extractStreet(primary) {
        if (primary?.street) return { name: primary.street, houseNumber: primary.houseNumber };

        return new StreetExtractor(this.lines).extractStreet();
    }

    /**
     * Ort: Hauptstandort, sonst Postleitzahl-Treffer, sonst die Zeile hinter "Hauptsitz".
     * @param {object|null} primary Hauptstandort aus BranchExtractor.
     * @returns {{country: string, zip: string|null, city: string}|null}
     */
    extractLocation(primary) {
        if (primary?.city) {
            return { country: primary.country || LocationConstants.DEFAULT_COUNTRY, zip: primary.zip, city: primary.city };
        }

        const found = new LocationExtractor(this.lines).extractLocation();
        if (found) return found;

        const headquarters = this.extractInfoValue("headquarters");
        return headquarters ? new LocationExtractor([headquarters]).extractByHeaderLine() : null;
    }

    /**
     * Gruendungsjahr aus dem Fliesstext ("Firmengründung im Jahr 2004").
     * @returns {string} Vierstellige Jahreszahl oder "".
     */
    extractFoundedFromText() {
        const currentYear = new Date().getFullYear();

        for (const line of this.lines) {
            for (const pattern of CompanyConstants.FOUNDED_PATTERNS) {
                const year = Number(line.match(pattern)?.[1]);
                if (year >= CompanyConstants.MIN_FOUNDED_YEAR && year <= currentYear) return String(year);
            }
        }
        return "";
    }

    /**
     * Mitarbeiterzahl ohne Label: eigene Zeile ("51-200 Mitarbeiter:innen"), sonst Angabe im
     * Text ("über 40 Kollegen*innen" -> "40+").
     * @returns {string} Bereich oder Zahl, sonst "".
     */
    extractSizeFromText() {
        const own = this.lines.map(line => line.trim()).find(line => CompanyConstants.SIZE_LINE_REGEX.test(line));
        if (own) return CompanyConstants.normalizeSize(own);

        for (const line of this.lines) {
            const match = line.match(CompanyConstants.SIZE_COUNT_REGEX);
            if (match) return match[1] ? `${match[2]}+` : match[2];
        }
        return "";
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
     * @param {string} [industry] Erkannte Branche (die Zeile gehoert nicht in die Beschreibung).
     * @param {string[]} [consumed] Zeilen, die schon als Standortliste verwendet wurden.
     * @returns {string} Bereinigter Beschreibungstext.
     */
    extractDescription(industry = "", consumed = []) {
        const result = [];
        const seen = new Set();
        let skipValue = false;

        for (const rawLine of this.companyInfoLines ?? []) {
            const line = rawLine.trim();
            if (!line) continue;

            if (skipValue) { skipValue = false; continue; }
            if (CompanyConstants.isInfoLabelLine(line)) { skipValue = true; continue; }
            if (CompanyConstants.COMPANY_INFO_IGNORE.has(line.toLowerCase())) continue;
            if (/linkedin/i.test(line) || this.isUrlLine(line)) continue;
            if (this.isJobTitleLine(line)) continue;
            if (this.isHeaderNoise(line, industry) || consumed.includes(rawLine)) continue;

            if (seen.has(line)) continue;

            seen.add(line);
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

    /**
     * Reste der Seitenkopfzeile (Follower, Ortszeile, Groessenzeile, Branche, Firmenname mit
     * Rechtsform, Trenner), die nicht zur Beschreibung gehoeren.
     * @param {string} line Zu pruefende Zeile.
     * @param {string} industry Erkannte Branche.
     * @returns {boolean} true, wenn die Zeile ausgelassen wird.
     */
    isHeaderNoise(line, industry) {
        return CompanyConstants.SEPARATOR_LINE_REGEX.test(line)
            || CompanyConstants.FOLLOWER_LINE_REGEX.test(line)
            || CompanyConstants.SIZE_LINE_REGEX.test(line)
            || LocationConstants.HEADER_LOCATION_ONLY_REGEX.test(line)
            || (industry !== "" && line === industry)
            || (line.split(/\s+/).length <= 5 && CompanyConstants.matchLegalForm(line) !== "");
    }
}
