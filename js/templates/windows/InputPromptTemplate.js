import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { FormatUtils } from "../../utils/FormatUtils.js";

export class InputPromptTemplate {

    // contact optional: {name, email, phone} - zeigt eine zusätzliche
    // Zeile mit Ansprechpartner, E-Mail und Telefon als verlinkten Text.
    create(defaultValue = "", contact = null) {
        return `
        <div id="input-container" class="input-container">
            <div class="input-prompt">
                ${this.createContactLine(contact)}
                <div class="field">
                    <label for="input-text">Telefonat / Rückruf dokumentieren:</label>
                    <textarea id="input-text" rows="4" placeholder="Informationen zum Telefonat eingeben ...">${defaultValue}</textarea>
                </div>
                <div class="prompt-buttons">
                    <button id="cancelInput" class="danger">Abbrechen</button>
                    <button id="submitInput" class="primary">Speichern</button>
                </div>
            </div>
        </div>
        `;
    }

    createContactLine(contact) {
        if (!contact || (!contact.name && !contact.email && !contact.phone)) {
            return "";
        }

        const name = HtmlUtils.escape(contact.name || "—");
        const email = this.createEmailLink(contact.email);
        const phone = this.createLink(contact.phone, "tel");

        return `<p class="call-contact-line">${name}, ${email}, ${phone}</p>`;
    }

    // mailto-Link mit vorausgefülltem Betreff "Anruf vom <Datum>"
    createEmailLink(email) {
        if (!email) return "—";

        const escaped = HtmlUtils.escape(email);
        const subject = encodeURIComponent(
            `Anruf vom ${FormatUtils.toGermanDateTime(new Date().toISOString())}`
        );

        return `<a href="mailto:${escaped}?subject=${subject}">${escaped}</a>`;
    }

    createLink(value, scheme) {
        if (!value) return "—";
        const escaped = HtmlUtils.escape(value);
        return `<a href="${scheme}:${escaped}">${escaped}</a>`;
    }
}
