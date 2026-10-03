import { BaseEditTab } from "./BaseEditTab.js";
import { ContactEditTemplate } from "../../templates/edit/ContactEditTemplate.js";
import { ContactTemplate } from "../../templates/detail/ContactTemplate.js";
import { ContactSectionEvent } from "../../events/detail/ContactSectionEvent.js";
import { ContactModel } from "../../models/ContactModel.js";

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

    /**
     * Übernimmt die im Anzeigentext gefundenen Ansprechpartner in das Model
     * und aktualisiert die Anzeige (Liste = alle möglichen Ansprechpartner).
     * @param {{contacts?: Array}} result Ergebnis der Textanalyse.
     */
    applyAnalysis(result) {
        const contacts = result?.contacts;
        if (!contacts?.length || !this.application) return;

        const added = contacts.filter(raw => !this.hasContact(raw));
        if (!added.length) return;

        added.forEach(raw => {
            const contact = new ContactModel();
            contact.name.data = raw.name;
            contact.role = raw.role;
            contact.email = raw.email;
            contact.phone = raw.phone;
            this.application.contacts.push(contact);
        });

        this.renderContactSection();
    }

    /**
     * Prüft, ob ein gleichnamiger Ansprechpartner bereits vorliegt.
     * @param {{name?: object}} raw Analyseergebnis eines Kontakts.
     * @returns {boolean} true, wenn der Kontakt bereits existiert.
     */
    hasContact(raw) {
        const full = `${raw.name?.firstname} ${raw.name?.lastname}`.trim().toLowerCase();
        if (!full) return false;

        return this.application.contacts.some(contact =>
            `${contact.name?.firstname} ${contact.name?.lastname}`.trim().toLowerCase() === full
        );
    }

    save() {
        // Firmenfelder werden jetzt im Firma-Tab gespeichert;
        // die Ansprechpartner-Liste speichert sich über die
        // wiederverwendete Detail-Logik selbst (s. Punkt 3).
    }
}