import { BaseEditTab } from "./BaseEditTab.js";
import { JobEditTemplate } from "../../templates/edit/JobEditTemplate.js";

export class JobEditTab extends BaseEditTab {

    render() {
        return new JobEditTemplate().render();
    }

    init(application) {
        const job = application.job;

        this.set("jobTitle", job?.title);
        this.set("employmentType", job?.employmentType);
        this.set("salary", job?.salary);
        this.set("vacationPay", job?.vacationPay);
        this.set("christmasPay", job?.christmasPay);
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

    applyAnalysis() {
        // Wird beim Import-Thema ergänzt.
    }

    save(application) {
        application.job.title = this.get("jobTitle");
        application.job.employmentType = this.get("employmentType");
        application.job.salary = this.get("salary");
        application.job.vacationPay = this.get("vacationPay");
        application.job.christmasPay = this.get("christmasPay");
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