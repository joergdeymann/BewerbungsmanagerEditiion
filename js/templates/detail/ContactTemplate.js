import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { UiContact } from "../../ui/detail/UiContact.js";

export class ContactTemplate extends DetailBaseTemplate {

    render(application) {

        const uiContact = new UiContact(application);
        const contacts = application.contacts || [];

        return `
            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">👤</span>
                        <div>
                            <h2>Ansprechpartner</h2>
                            <p>Hier können die Daten des / der Ansprechpartner eingesehen werden</p>
                        </div>
                    </div>
                </section>

                <section class="section-body">
                    <div class="field">
                        <label>Name</label>
                        <p>${HtmlUtils.escape(uiContact.name || "—")}</p>
                    </div>

                    <div class="field">
                        <label>Position:</label>
                        <p>${HtmlUtils.escape(uiContact.role || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Telefon:</label>
                        <div class="field-value-row">
                            <p>${HtmlUtils.escape(uiContact.phone || "—")}</p>
                            <button type="button" class="primary" data-call-contact>Anrufen</button>
                        </div>
                    </div>
                    <div class="field">
                        <label>E-Mail:</label>
                        <p>${HtmlUtils.escape(uiContact.email || "—")}</p>
                    </div>

                </section>

                <section class="section-body">
                    <div class="field field-ultra-wide">
                        <label>Ansprechpartner</label>
                        <div id="contactList" class="contact-list">
                            ${this.contactListRows(contacts)}
                        </div>
                        <button type="button" class="secondary" data-add-contact>+ Ansprechpartner hinzufügen</button>
                    </div>
                </section>
            </section>
        `;

    }

    contactListRows(contacts) {
        if (!contacts.length) {
            return `<p class="muted">Keine Ansprechpartner hinterlegt.</p>`;
        }

        return contacts.map((contact, index) => `
            <div class="field-with-button contact-row${index === 0 ? " active" : ""}" data-select-contact="${HtmlUtils.escape(contact.id)}">
                <span>${HtmlUtils.escape(contact.name?.full || "—")}${contact.role ? " – " + HtmlUtils.escape(contact.role) : ""}</span>
                <span>
                    <button type="button" class="success" data-edit-contact="${HtmlUtils.escape(contact.id)}">Ändern</button>
                    <button type="button" class="danger" data-remove-contact="${HtmlUtils.escape(contact.id)}">Entfernen</button>
                </span>
            </div>
        `).join("");
    }
}