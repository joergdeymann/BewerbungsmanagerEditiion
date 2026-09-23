import { UiCompany } from "./UiCompany.js";
export class UiJob {
    constructor(job) {
        this.job = job;
    }

    toHTML() {
        if (!this.job) return;

        for (const company of this.job.jobs) {
            const companyUi = new UiCompany(company);
            companyUi.toHTML();
        }
    }

    fromHTML() {
        if (!this.job) return;

        for (const company of this.job.jobs) {
            const companyUi = new UiCompany(company);
            companyUi.fromHTML();
        }

        return this.job;
    }
}
