import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";

export class SourcesTemplate extends DetailBaseTemplate {

    render(application) {

        const references = application.references || [];

        return `
            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">🌐</span>
                        <div>
                            <h2>Quellen</h2>
                            <p>Information wo die Daten herkommen</p>
                        </div>
                    </div>
                </section>
                
                <section class="section-body">
                    <div class="field">
                        <label>Gesuchte Stelle</label>
                        <p>${HtmlUtils.escape(application.job?.title || "—")}</p>
                    </div>

                    
                    <div class="field">
                        <label>Stellenanzeige</label>
                        <p class="muted">Noch nicht implementiert</p>
                    </div>

                    <div class="field">
                        <label>Unternehmensseite</label>
                        <p>${this.link(application.company?.website)}</p>
                    </div>

                    <div class="field">
                        <label>Quelle</label>
                        <p class="muted">Noch nicht implementiert</p>
                    </div>

                    <div class="field field-ultra-wide">
                        <label>Weitere Quellen</label>
                        <div id="sourcesList" class="contact-list">
                            <div class="field-with-button contact-row sources-header">
                                <span data-sort="date">Datum <span class="sort-arrow" data-sort-arrow="date"></span></span>
                                <span data-sort="name">Name <span class="sort-arrow" data-sort-arrow="name"></span></span>
                            </div>
                            ${this.sourceRows(references)}
                        </div>
                    </div>
                </section>
            </section>
        `;

    }

    sourceRows(references) {
        if (!references.length) {
            return `<p class="muted">Keine weiteren Quellen erfasst.</p>`;
        }

        return references.map(reference => `
            <div class="field-with-button contact-row" data-url="${HtmlUtils.escape(reference.url)}" data-date="${HtmlUtils.escape(reference.capturedAt || "")}" data-name="${HtmlUtils.escape(reference.name || "")}">
                <span>${HtmlUtils.escape(reference.capturedAt || "—")}</span>
                <span>${this.link(reference.url, reference.name)}</span>
            </div>
        `).join("");
    }
}