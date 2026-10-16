import { HtmlUtils } from "../../utils/HtmlUtils.js";

export class EditHeaderTemplate {

    render(application) {
        const isNew = !application.id;

        return `
            <header class="app-header pb-0">
                <div class="shrink-to-left">
                    <h1>${isNew ? "Neue Bewerbung" : HtmlUtils.escape(application.company?.name || "Bewerbung bearbeiten")}</h1>
                    <p>${isNew ? "Alle Angaben können später ergänzt werden." : HtmlUtils.escape(application.job?.title || "")}</p>
                </div>

                <nav class="header-detail-view">
                    <button class="warning" data-action="cancel">Abbrechen</button>
                    <button class="primary" data-action="save">Speichern</button>
                </nav>
            </header>
        `;
    }
}