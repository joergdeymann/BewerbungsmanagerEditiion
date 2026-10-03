import { ParseText } from "./parser/ParseText.js";
import { TaskExtractor } from "./extractors/TaskExtractor.js";

export class Analyzer {

    analyze(text) {
        const parsed = new ParseText(text).parse();
        const company = parsed.company;

        return {
            company: {
                name: company.name,
                email: company.email,
                phone: company.phone,
                website: company.website || this.domainToUrl(company.domain),
                street: company.street,
                location: company.location,
                postBox: company.postbox,
                legalForm: company.legalForm,
                industry: company.industry,
                size: company.size,
                founded: company.founded,
                verifiedAt: company.verifiedAt,
                description: company.description,
                specialties: company.specialties
            },
            job: {
                wage: parsed.job.wage,
                tasks: new TaskExtractor().extract(
                    (parsed.sections["tasks"]?.lines || []).join("\n")
                )
            },
            contacts: parsed.contacts,
            qualifications: parsed.qualifications,
            benefits: parsed.benefits
        };
    }

    // Grobe erste Version - wird bei Bedarf verfeinert.
    detectSource() {
        return "Manuell eingefügt";
    }

    /**
     * Baut aus dem erkannten Domain-Objekt eine nutzbare URL.
     * @param {{name?: string}} domain Ergebnis des DomainExtractor.
     * @returns {string} URL oder "".
     */
    domainToUrl(domain) {
        return domain?.name ? `https://${domain.name}` : "";
    }
}