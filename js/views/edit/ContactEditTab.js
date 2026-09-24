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
        this.renderContactSection();
    }

    renderContactSection() {
        const container = this.root.querySelector("#contactSection");

        container.innerHTML = new ContactTemplate().render(this.application);

        const event = new ContactSectionEvent(this.repository);
        event.bind(this.root, this.application, () => this.renderContactSection());
    }

    applyAnalysis() {
        // Wird beim Import-Thema ergänzt.
    }

    save() {
        // Firmenfelder werden jetzt im Firma-Tab gespeichert;
        // die Ansprechpartner-Liste speichert sich über die
        // wiederverwendete Detail-Logik selbst (s. Punkt 3).
    }
}