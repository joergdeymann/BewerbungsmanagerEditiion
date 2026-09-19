import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { UiContact } from "../../ui/UiContact.js";

export class ContactTemplate extends DetailBaseTemplate {

    render(application) {

        const uiContact = new UiContact(application);

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
            </section>
        `;

    }
}