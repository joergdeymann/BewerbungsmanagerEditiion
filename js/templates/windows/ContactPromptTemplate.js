import { HtmlUtils } from "../../utils/HtmlUtils.js";

export class ContactPromptTemplate {

    create(contact = {}, title = "Ansprechpartner") {
        return `
        <div id="contact-container" class="input-container">
            <div class="input-prompt auto-height">
                <label>${title}</label>

                <div class="field">
                    <label for="contact-name">Name</label>
                    <input id="contact-name" value="${HtmlUtils.escape(contact.name)}">
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