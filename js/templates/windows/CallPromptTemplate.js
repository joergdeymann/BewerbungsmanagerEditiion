import { HtmlUtils } from "../../utils/HtmlUtils.js";

export class CallPromptTemplate {

    /**
     * Erstellt das Markup des Anrufen-Fensters.
     * Zeigt Ansprechpartner, Telefonnummer und E-Mail als reinen Text
     * mit Standard-Verlinkung (tel: / mailto:) an.
     * @param {{name?: string, phone?: string, email?: string}} contact
     * @returns {string}
     */
    create(contact = {}) {
        return `
        <div id="call-container" class="input-container">
            <div class="input-prompt auto-height">
                <label>Anrufen</label>

                <div class="field">
                    <label>Ansprechpartner</label>
                    <p>${HtmlUtils.escape(contact.name || "—")}</p>
                </div>

                <div class="field">
                    <label>Telefon</label>
                    <p>${this.createLink(contact.phone, "tel")}</p>
                </div>

                <div class="field">
                    <label>E-Mail</label>
                    <p>${this.createLink(contact.email, "mailto")}</p>
                </div>

                <div class="prompt-buttons prompt-center">
                    <button id="closeCall" class="primary">Schließen</button>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Erstellt einen Standard-Link (tel: bzw. mailto:) oder einen
     * Platzhalter, falls kein Wert vorhanden ist.
     * @param {string} value
     * @param {"tel"|"mailto"} scheme
     * @returns {string}
     */
    createLink(value, scheme) {
        if (!value) return "—";

        const escaped = HtmlUtils.escape(value);
        return `<a href="${scheme}:${escaped}">${escaped}</a>`;
    }
}
