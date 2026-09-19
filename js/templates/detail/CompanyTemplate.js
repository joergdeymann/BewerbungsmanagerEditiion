import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { FormatUtils } from "../../utils/FormatUtils.js";

export class CompanyTemplate extends DetailBaseTemplate {

    render(application) {

        return `
            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">🏢</span>
                        <div>
                            <h2>Firmeninformation</h2>
                            <p>Alle Informationen über das Unternehmen.</p>
                        </div
                    </div>
                </section>
                
                <section class="section-body">
                    <div class="field">
                        <label>Firmenname</label>
                        <p>${HtmlUtils.escape(application.company?.name || "—")}</p>
                    </div>
 
                    <div class="field">
                        <label>Adresse</label>
                        <p>
                            ${HtmlUtils.escape(application.company?.address?.data?.street || "")}
                            ${HtmlUtils.escape(application.company?.address?.data?.houseNumber || "")}<br>

                            ${HtmlUtils.escape(
                                application.company?.address?.data?.zip || ""
                            )}
                            ${HtmlUtils.escape(
                                application.company?.address?.data?.city || ""
                            )}<br>

                            ${HtmlUtils.escape(
                                application.company?.address?.data?.country || ""
                            )}
                        </p>
                    </div>
                    <div class="field">
                        <label>Webseite</label>
                        <p>${this.link(application.company?.website)}</p>
                    </div>
                    <div class="field">
                        <label>Branche</label>
                        <p>${HtmlUtils.escape(application.company?.industry || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Unternehmensgröße</label>
                        <p>${HtmlUtils.escape(application.company?.size || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Gegründet</label>
                        <p>${HtmlUtils.escape(application.company?.founded || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Verifiziert am</label>
                        <p>${HtmlUtils.escape(FormatUtils.toGermanDate(application.company?.verifiedAt || "—"))}</p>
                    </div>
                    <div class="field">
                        <label>Spezialisierungen</label>
                        ${this.list(application.company?.specialties || "—")}
                    </div>
                    <div class="field">
                        <label>Selbstbeschreibung</label>
                        <p>${HtmlUtils.escape(application.company?.description || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Tätigkeitsbeschreibung der Firma</label>
                        <p class="muted">Noch nicht implementiert</p>
                    </div>
                </section>
            </section>
        `;
    }
}