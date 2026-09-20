import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { UiContact } from "../../ui/UiContact.js";

export class ContactTemplate extends DetailBaseTemplate {

    render(application) {

        const uiContact = new UiContact(application);
        const others = (application.contacts || []).slice(1);

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
                        <p>${HtmlUtils.escape(uiContact.phone || "—")}</p>
                    </div>
                    <div class="field">
                        <label>E-Mail:</label>
                        <p>${HtmlUtils.escape(uiContact.email || "—")}</p>
                    </div>

                </section>

                <section class="section-body">
                    <div class="field field-ultra-wide">
                        <label>Weitere Ansprechpartner</label>
                        <div id="contactList">
                            ${this.contactListRows(others)}
                        </div>
                        <button type="button" class="secondary" data-add-contact>+ Ansprechpartner hinzufügen</button>
                    </div>
                </section>
            </section>
        `;

    }

    contactListRows(others) {
        if (!others.length) {
            return `<p class="muted">Keine weiteren Ansprechpartner hinterlegt.</p>`;
        }

        return others.map(contact => `
            <div class="field-with-button">
                <span>${HtmlUtils.escape(contact.name || "—")}${contact.role ? " – " + HtmlUtils.escape(contact.role) : ""}</span>
                <span>
                    <button type="button" class="secondary" data-select-contact="${HtmlUtils.escape(contact.id)}">Als aktuell festlegen</button>
                    <button type="button" data-edit-contact="${HtmlUtils.escape(contact.id)}">Ändern</button>
                    <button type="button" class="danger" data-remove-contact="${HtmlUtils.escape(contact.id)}">Entfernen</button>
                </span>
            </div>
        `).join("");
    }
}