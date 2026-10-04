import { BaseEditTab } from "./BaseEditTab.js";
import { JobEditTemplate } from "../../templates/edit/JobEditTemplate.js";

export class JobEditTab extends BaseEditTab {

    render() {
        return new JobEditTemplate().render();
    }

    init(application) {
        const job = application.job;
        const wage = job?.wage;

        this.set("jobTitle", job?.title);
        this.set("employmentType", job?.employmentType);
        this.set("salaryFrom", wage?.yearly?.min ?? "");
        this.set("salaryTo", wage?.yearly?.max ?? "");
        this.set("salaryCurrency", wage?.currency);
        this.set("salaryGross", this.grossValue(wage?.gross));
        this.set("vacationPay", wage?.holiday ?? "");
        this.set("holidayText", wage?.holidayText);
        this.set("christmasPay", wage?.christmas ?? "");
        this.set("referenceNumber", job?.referenceNumber);
        this.set("jobTags", (job?.tags || []).join("\n"));
        this.set("tasks", (job?.tasks || []).join("\n"));
        this.set("jobStreet", job?.workLocation?.street?.name);
        this.set("jobHouseNumber", job?.workLocation?.street?.houseNumber);
        this.set("jobZip", job?.workLocation?.city?.zip);
        this.set("jobCity", job?.workLocation?.city?.city);
        this.set("jobCountry", job?.workLocation?.city?.country);

        const selected = job?.workModel || [];
        this.root.querySelectorAll(".work-model-option").forEach(checkbox => {
            checkbox.checked = selected.includes(checkbox.value);
        });
    }

    /**
     * Wandelt die boolesche Angabe "brutto/netto" in den Feldwert um.
     * @param {boolean|null} gross true = brutto, false = netto.
     * @returns {string} "brutto", "netto" oder "".
     */
    grossValue(gross) {
        if (gross === true) return "brutto";
        if (gross === false) return "netto";

        return "";
    }

    /**
     * Wandelt den Feldwert "brutto/netto" in die boolesche Angabe um.
     * @param {string} value Feldwert.
     * @returns {boolean|null} true, false oder null ohne Angabe.
     */
    grossFromValue(value) {
        if (value === "brutto") return true;
        if (value === "netto") return false;

        return null;
    }

    /**
     * Liest eine Zahl aus einem Eingabefeld.
     * @param {string} id Feld-ID.
     * @returns {number|null} Zahl oder null bei leerem Feld.
     */
    number(id) {
        const value = this.get(id).trim();
        if (!value) return null;

        const parsed = Number(value.replace(",", "."));

        return Number.isNaN(parsed) ? null : parsed;
    }

    /**
     * Baut die Gehaltsspanne aus den beiden Gehaltsfeldern.
     * @returns {object|null} { min, max } oder null ohne Angabe.
     */
    salaryRange() {
        const min = this.number("salaryFrom");
        const max = this.number("salaryTo");
        if (min === null && max === null) return null;
        if (min === null || max === null) return { min: min ?? max, max: max ?? min };

        return { min, max };
    }

    save(application) {
        application.job.title = this.get("jobTitle");
        application.job.employmentType = this.get("employmentType");
        application.job.wage.yearly = this.salaryRange();
        application.job.wage.gross = this.grossFromValue(this.get("salaryGross"));
        application.job.wage.currency = this.get("salaryCurrency").trim();
        application.job.wage.holiday = this.number("vacationPay");
        application.job.wage.holidayText = this.get("holidayText").trim();
        application.job.wage.christmas = this.number("christmasPay");
        application.job.referenceNumber = this.get("referenceNumber");
        application.job.tags = this.list("jobTags");
        application.job.tasks = this.list("tasks");
        application.job.workModel = [...this.root.querySelectorAll(".work-model-option:checked")]
            .map(checkbox => checkbox.value);

        application.job.workLocation.street.name = this.get("jobStreet");
        application.job.workLocation.street.houseNumber = this.get("jobHouseNumber");
        application.job.workLocation.city.zip = this.get("jobZip");
        application.job.workLocation.city.city = this.get("jobCity");
        application.job.workLocation.city.country = this.get("jobCountry");
        // companyId/contactId bleiben unangetastet (reserviert für spätere Verknüpfung).
    }
}