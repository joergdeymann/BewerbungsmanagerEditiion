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
                website: company.domain,
                street: company.street,
                location: company.location,
                postBox: company.postbox
            },
            job: {
                salary: parsed.job.salary,
                vacationPay: parsed.job.vacationPay,
                christmasPay: parsed.job.christmasPay,
                tasks: new TaskExtractor().extract(
                    (parsed.sections["tasks"]?.lines || []).join("\n")
                )
            },
            qualifications: parsed.qualifications,
            benefits: parsed.benefits
        };
    }

    // Grobe erste Version - wird bei Bedarf verfeinert.
    detectSource() {
        return "Manuell eingefügt";
    }
}