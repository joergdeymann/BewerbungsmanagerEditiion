import { HtmlUtils } from "../../utils/HtmlUtils.js";

export class ContactPromptTemplate {

    create(contact = {}, title = "Ansprechpartner") {
        const name = contact.name || {};

        return `
        <div id="contact-container" class="input-container">
            <div class="input-prompt auto-height">
                <label>${title}</label>

                <div class="field">
                    <label for="contact-salutation">Anrede</label>
                    <select id="contact-salutation">
                        <option value="">—</option>
                        <option value="Herr" ${name.salutation === "Herr" ? "selected" : ""}>Herr</option>
                        <option value="Frau" ${name.salutation === "Frau" ? "selected" : ""}>Frau</option>
                    </select>
                </div>

                <div class="field">
                    <label for="contact-title">Titel</label>
                    <input id="contact-title" value="${HtmlUtils.escape(name.title)}">
                </div>

                <div class="field">
                    <label for="contact-firstname">Vorname</label>
                    <input id="contact-firstname" value="${HtmlUtils.escape(name.firstname)}">
                </div>

                <div class="field">
                    <label for="contact-lastname">Nachname</label>
                    <input id="contact-lastname" value="${HtmlUtils.escape(name.lastname)}">
                </div>

                <div class="field">
                    <label for="contact-role">Position</label>
                    <input id="contact-role" value="${HtmlUtils.escape(contact.role)}">
                </div>

                <div class="field">
                    <label for="contact-email">E-Mail</label>
                    <input id="contact-email" type="email" value="${HtmlUtils.escape(contact.email)}">
                </div>

                <div class="field">
                    <label for="contact-phone">Telefon</label>
                    <input id="contact-phone" value="${HtmlUtils.escape(contact.phone)}">
                </div>

                <div class="prompt-buttons">
                    <button id="cancelContact" class="danger">Abbrechen</button>
                    <button id="submitContact" class="primary">Speichern</button>
                </div>
            </div>
        </div>
        `;
    }
}
