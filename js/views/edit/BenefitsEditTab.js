import { BaseEditTab } from "./BaseEditTab.js";
import { BenefitsEditTemplate } from "../../templates/edit/BenefitsEditTemplate.js";

export class BenefitsEditTab extends BaseEditTab {

    render() {
        return new BenefitsEditTemplate().render();
    }

    init(application) {
        this.set("benefitsContent", (application.benefits?.content || []).join("\n"));
        this.set("benefitsTags", (application.benefits?.tags || []).join("\n"));
    }

    applyAnalysis(result) {
        const benefits = result.benefits;
        if (!benefits) return;

        this.set("benefitsContent", (benefits.content || []).join("\n"));
        this.set("benefitsTags", (benefits.tags || []).join("\n"));
    }

    save(application) {
        application.benefits.content = this.list("benefitsContent");
        application.benefits.tags = this.list("benefitsTags");
    }
}