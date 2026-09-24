import { BaseEditTab } from "./BaseEditTab.js";
import { ContactEditTemplate } from "../../templates/edit/ContactEditTemplate.js";
import { ContactTemplate } from "../../templates/detail/ContactTemplate.js";
import { ContactSectionEvent } from "../../events/detail/ContactSectionEvent.js";

export class ContactEditTab extends BaseEditTab {

    constructor(root, repository) {
        super(root);
        this.repository = repository;
    }

    render() {
        return new ContactEditTemplate().render();
    }

    init(application) {
        this.application = application;
        this.set("companyEmail", application.company?.email);
        this.set("companyPhone", application.company?.phone);

        this.renderContactSection();
    }

    renderContactSection() {
        const container = this.root.querySelector("#contactSection");
        const isNew = !this.application.id;

        if (isNew) {
            container.innerHTML = `<p class="muted">Ansprechpartner können hinzugefügt werden, sobald die Bewerbung einmal gespeichert wurde.</p>`;
            return;
        }

        container.innerHTML = new ContactTemplate().render(this.application);

        const event = new ContactSectionEvent(this.repository);
        event.bind(this.root, this.application, () => this.renderContactSection());
    }

    applyAnalysis() {
        // Wird beim Import-Thema ergänzt.
    }

    save(application) {
        application.company.email = this.get("companyEmail");
        application.company.phone = this.get("companyPhone");
    }
}