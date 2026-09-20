import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { FormatUtils } from "../../utils/FormatUtils.js";
import { JobConstants } from "../../constants/JobConstants.js";

export class ApplicationTemplate extends DetailBaseTemplate {

    render(application) {

        const status =
            application.application?.status ||
            JobConstants.STATUS.ENTWURF;

        const portalEntry = [...(application.application?.history || [])]
            .reverse()
            .find(item => item.channel === "portal");
        
            return `
            <section class="subsection-display ">
                <section class="section-header">
                    <div>
                        <span class="section-icon">📤</span>
                        <div>
                            <h2>Bewerbung & Ausgabe</h2>
                            <p>Histroy der Bewerbungsschritte , Möglichkeiten Bewerbung zu versenden</p>
                        </div>
                    </div>
                </section>
                
                <div class="field-grid">
                    <div class="field">
                        <label>Beworben am</label>
                        <p>${HtmlUtils.escape(FormatUtils.toGermanDate(application.application?.appliedAt || "—"))}</p>
                    </div>

                    <div class="field">
                        <label>Bewerbungsweg</label>
                        <p>${HtmlUtils.escape(application.application?.channel ||"—")}</p>
                    </div>

                    <div class="field"> 
                        <label>Kennziffer</label>
                        <p>${HtmlUtils.escape(application.job?.referenceNumber || "—")}</p>
                    </div>


                </div>
                <div class="section-header">
                    <div>
                        <span class="section-icon">⌘</span>

                        <div>
                            <h2>Portal-Informationen</h2>
                            <p>
                                Daten zum Login der Bewerbung.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="field-grid">
                    <div class="field">
                        <label>Portal</label>
                        <p>${this.link(portalEntry?.entry?.website)}</p> 
                    </div>
                    
                    <div class="field"> 
                        <label>Benutzer</label>
                        <p>${HtmlUtils.escape(portalEntry?.entry?.username || "—")}</p>
                    </div>

                    <div class="field"> 
                        <label>Kennwort</label>
                        <p>${HtmlUtils.escape(portalEntry?.entry?.password || "—")}</p>
                    </div>
                </div>

                <div class="section-header">
                    <div>
                        <span class="section-icon">📝</span>

                        <div>
                            <h2>Dokumente</h2>
                            <p>
                                Alles was du an Unterlagen benötigtst
                            </p>
                        </div>
                    </div>
                </div>

                <div class="section-body">
                    <div class="field"> 
                        <label>Lebenslauf</label>
                        <div class="field-with-button">
                            ${this.documentButton("Lebenslauf", application.application?.resume)}
                            <button>+</button>
                        </div>
                    </div>          

                    <div class="field">
                        <label>Anschreiben</label>
                        <div class="field-with-button">
                            ${this.documentButton("Anschreiben", application.application?.coverLetter)}
                            <button>+</button>
                        </div>
                    </div>
                </div>

                <section class="application-card output-card">

                    <div class="output-actions">
                        <button class="output-action flex-column">
                            <div>
                                <span>📧</span>
                                <strong>E-Mail erstellen</strong>
                            </div>
                            <small>
                                Ansprechpartner und Stelleninformationen übernehmen
                            </small>
                        </button>

                        <button class="output-action">
                            <div>
                                <span>🌐</span>
                                <strong>Portal vorbereiten</strong>
                            </div>
                            <small>
                                Felder für ein Bewerbungsportal bereitstellen
                            </small>
                        </button>

                        <button class="output-action">
                            <div>
                                <span>📋</span>
                                <strong>Felder kopieren</strong>
                            </div>

                            <small>
                                Einzelne Informationen schnell übernehmen
                            </small>
                        </button>
                    </div>
                </section>

                <div class="section-header">
                    <div>
                        <span class="section-icon">📝</span>

                        <div>
                            <h2>Notizen</h2>
                            <p>
                                Freie Informationen zur Bewerbung.
                            </p>
                        </div>
                    </div>
                </div>
                <textarea id="notes" class="large-input" rows="7" placeholder="Weitere Notizen ..."></textarea>
            </section>

            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">📤</span>
                        <div>
                            <h2>Legende/ History</h2>
                            <p>Zeigt auf was du bereits alle getan hast</p>
                        </div>
                    </div>
                </section>

                <div class="section-body">
                    ${this.historyList(application)}
                </div>
            </section>
        `;

    }

    historyList(application) {

        const entries = [
            ...this.creationEntries(application),
            ...this.channelEntries(application),
            ...this.statusEntries(application)
        ];

        if (!entries.length) {
            return `<p class="muted">Noch keine Einträge vorhanden.</p>`;
        }

        return entries
            .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
            .map(entry => this.historyItem(entry))
            .join("");
    }

    // "Neu angelegt" ist kein Kanal-Eintrag, sondern ergibt sich aus dem Anlegedatum.
    creationEntries(application) {
        if (!application.createDate) return [];

        return [{
            date: application.createDate,
            action: "Neu angelegt",
            info: ""
        }];
    }

    channelEntries(application) {
        const history = application.application?.history || [];
        const contactName = application.contacts?.[0]?.name || "";

        return history.map(item => {
            const entry = item.entry || {};

            switch (item.channel) {
                case "portal":
                    return {
                        date: entry.date,
                        action: `Daten aus ${entry.website || "Portal"} geladen`,
                        info: entry.information || entry.portalName || ""
                    };
                case "email":
                    return {
                        date: entry.date,
                        action: `Via Mail beworben an ${entry.emailTo || "—"}`
                            + (contactName ? ` und ${contactName}` : ""),
                        info: entry.subject || entry.content || ""
                    };
                case "phone":
                    return {
                        date: entry.date,
                        action: "Rückruf erhalten",
                        info: entry.content || ""
                    };
                case "personal":
                    return {
                        date: entry.date,
                        action: "Bewerbung persönlich abgegeben",
                        info: entry.content || ""
                    };
                default:
                    return {
                        date: entry.date,
                        action: item.channel,
                        info: entry.content || ""
                    };
            }
        });
    }

    // Nur EINGANG wird als "Antwort erhalten" abgebildet - RUECKRUF kommt bereits
    // über die Telefon-Kanal-Einträge (channelEntries), sonst gäbe es Dopplungen.
    statusEntries(application) {
        const statusHistory = application.application?.statusHistory || [];

        return statusHistory
            .filter(item => item.status === JobConstants.STATUS.EINGANG)
            .map(item => ({
                date: item.date,
                action: "Antwort der Firma erhalten",
                info: item.reason || ""
            }));
    }

    historyItem(entry) {
        return `
            <details class="field history-entry">
                <summary>
                    <span>${HtmlUtils.escape(FormatUtils.toGermanDate(entry.date))}</span>
                    <strong>${HtmlUtils.escape(entry.action)}</strong>
                </summary>
                <p>${HtmlUtils.escape(entry.info || "Keine weiteren Details.")}</p>
            </details>
        `;
    }

    documentButton(label, url) {

        if (!url) {
            return `
                <span class="muted">
                    ${HtmlUtils.escape(label)}: nicht hinterlegt
                </span>
            `;
        }

        const safe = HtmlUtils.escape(url);

        return `
            <a class="output-action"
               href="${safe}"
               target="_blank"
               rel="noopener">
                📄 ${HtmlUtils.escape(label)} öffnen
            </a>
        `;
    }
}