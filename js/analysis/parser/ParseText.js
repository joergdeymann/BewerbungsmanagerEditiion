import { ParserConstants } from "../../constants/ParserConstants.js"
import { SectionParser } from "./SectionParser.js"
import { SectionPart } from "./SectionPart.js"
import { RequirementSplitter } from "./RequirementSplitter.js"
import { TextCleaner } from "./TextCleaner.js"
import { CompanyExtractor } from "../extractors/CompanyExtractor.js"
import { CompanyNameExtractor } from "../extractors/CompanyNameExtractor.js"
import { ContactExtractor } from "../extractors/ContactExtractor.js"
import { JobExtractor } from "../extractors/JobExtractor.js"
import { QualificationExtractor } from "../extractors/QualificationExtractor.js"
import { BenefitExtractor } from "../extractors/BenefitExtractor.js"

export class ParseText {
    constructor(text) {
        this.lines = [];
        this.text = '';

        this.add(text);
    }

    add(text) {
        if (!text) return;
        this.lines.push(...new TextCleaner(text).lines);
        this.text += text;
    }

    parse() {
        const sectionParser = new SectionParser(ParserConstants.SECTION_HEADLINES);
        const sections = sectionParser.parse(this.lines);

        const qualificationLines = this.moveRequirements(sections);

        const companyContent = sections["companyInformation"]?.lines??[];
        const contactContent = sections["contact"]?.lines??[];
        const teamContent = sections["team"]?.lines??[];
        let addressContent = [...contactContent, ...companyContent,...teamContent];
        // Ohne eigene Firmenabschnitte (z. B. nur die LinkedIn-Info-Seite) zaehlt der Gesamttext.
        if (!addressContent.length) addressContent = sections["general"]?.lines ?? [];

        const company = new CompanyExtractor(addressContent, companyContent).extractCompany();
        this.fillCompanyFromHeader(company, sections["general"]?.lines ?? []);

        return {
            sections: sections,
            company,
            contacts: new ContactExtractor(this.lines).extractContacts(),
            job: new JobExtractor(sections, contactContent, this.lines).extractJob(),
            qualifications: new QualificationExtractor(qualificationLines).extractQualifications(),
            benefits: new BenefitExtractor(sections["benefits"]?.lines??[]).extractBenefits(),
        };
    }

    /**
     * Verschiebt Anforderungen, die im Aufgabenabschnitt stehen, in die Qualifikationen
     * (siehe RequirementSplitter, ParserConstants.REQUIREMENT_MARKERS).
     * @param {object} sections Geparste Abschnitte (werden angepasst).
     * @returns {string[]} Zeilen fuer die Qualifikationen.
     */
    moveRequirements(sections) {
        const own = sections["qualifications"]?.lines ?? [];
        if (!sections["tasks"]) return own;

        const { tasks, requirements } = new RequirementSplitter().split(sections["tasks"].lines);
        if (!requirements.length) return own;

        sections["tasks"].lines = tasks;
        sections["qualifications"] ??= new SectionPart("qualifications");
        sections["qualifications"].lines = [...requirements, ...own];
        return sections["qualifications"].lines;
    }

    /**
     * Findet die Analyse keinen Firmennamen mit Rechtsform, wird er in den Kopfzeilen vor der ersten
     * Ueberschrift gesucht (Jobboersen nennen dort die Firma). Nur ueber die Rechtsform
     * (GmbH, AG, ...), damit keine Zufallstreffer entstehen.
     */
    fillCompanyFromHeader(company, generalLines) {
        // Ein sicherer Treffer (Name mit Rechtsform) bleibt; sonst gilt die Kopfzeile mehr als eine Häufigkeitsschätzung.
        if (company.name && company.legalForm) return;

        const header = generalLines.slice(0, ParserConstants.HEADER_LINES);
        const name = new CompanyNameExtractor(header).extractBySuffix();
        if (!name) return;

        company.name = name;
        company.legalForm = company.legalForm || new CompanyExtractor(header).extractLegalForm(name);
    }
}
