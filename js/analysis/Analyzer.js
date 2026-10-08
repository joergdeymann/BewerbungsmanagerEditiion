import { ParseText } from "./parser/ParseText.js";

export class Analyzer {

    analyze(text) {
        const parsed = new ParseText(text).parse();
        const company = parsed.company;
        console.log(parsed.contacts);

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
                ownership: company.ownership,
                industry: company.industry,
                size: company.size,
                founded: company.founded,
                verifiedAt: company.verifiedAt,
                description: company.description,
                specialties: company.specialties,
                branches: company.branches
            },
            job: parsed.job,
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
