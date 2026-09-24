import { BaseEditTab } from "./BaseEditTab.js";
import { RequirementsEditTemplate } from "../../templates/edit/RequirementsEditTemplate.js";

export class RequirementsEditTab extends BaseEditTab {

    render() {
        return new RequirementsEditTemplate().render();
    }

    init(application) {
        const qualifications = application.qualifications;

        this.set("requiredContent", (qualifications?.required?.content || []).join("\n"));
        this.set("requiredTags", (qualifications?.required?.tags || []).join("\n"));
        this.set("preferredContent", (qualifications?.preferred?.content || []).join("\n"));
        this.set("preferredTags", (qualifications?.preferred?.tags || []).join("\n"));
        this.set("personalContent", (qualifications?.personal?.content || []).join("\n"));
        this.set("personalTags", (qualifications?.personal?.tags || []).join("\n"));
    }

    applyAnalysis() {
        // Wird beim Import-Thema ergänzt.
    }

    save(application) {
        application.qualifications.required = {
            content: this.list("requiredContent"),
            tags: this.list("requiredTags")
        };
        application.qualifications.preferred = {
            content: this.list("preferredContent"),
            tags: this.list("preferredTags")
        };
        application.qualifications.personal = {
            content: this.list("personalContent"),
            tags: this.list("personalTags")
        };
    }
}