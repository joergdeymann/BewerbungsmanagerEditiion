import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { FormatUtils } from "../../utils/FormatUtils.js";

export class JobTemplate extends DetailBaseTemplate {

    render(application) {

        const workLocation = this.workLocationText(application);

        return `
            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">💼</span>
                        <div>
                            <h2>Stelle: ${HtmlUtils.escape(application.job?.title || "—")}</h2>
                            <p>Arbeitsstelle, die das Unternehmen anbietet</p>
                        </div>
                    </div>
                </section>

                <section class="section-body field-grid">
                    <div class="field">
                        <label>Arbeitsort</label>
                        <p>${workLocation ? HtmlUtils.escape(workLocation).replace(/\n/g, "<br>") : "—"}</p>
                    </div>
                    <div class="field">
                        <label>Beschäftigungsart</label>
                        <p>${HtmlUtils.escape(application.job?.employmentType || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Arbeitsmodell</label>
                        <p>${HtmlUtils.escape((application.job?.workModel || []).join(", ") || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Gehalt</label>
                        <p>${HtmlUtils.escape(FormatUtils.formatCurrency(application.job?.salary) || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Urlaubsgeld</label>
                        <p>${HtmlUtils.escape(FormatUtils.formatCurrency(application.job?.vacationPay) || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Weihnachtsgeld</label>
                        <p>${HtmlUtils.escape(FormatUtils.formatCurrency(application.job?.christmasPay) || "—")}</p>
                    </div>
                    <div class="field">
                        <label>Kennziffer</label>
                        <p>${HtmlUtils.escape(application.job?.referenceNumber || "—")}</p>
                    </div>
                </section>

                <section class="section-body">
                    <div class="field field-ultra-wide">
                        <label>Badges</label>
                        <p>${this.badges(application.job?.tags)}</p>
                    </div>
                    <div class="field field-ultra-wide">
                        <label>Aufgaben</label>
                        ${this.list(application.job?.tasks)}
                    </div>
                </section>
            </section>
        `;

    }

    // Adresse der Arbeitsstelle - fehlen Angaben, wird die Firmenadresse verwendet.
    workLocationText(application) {
        const own = application.job?.workLocation;
        const ownData = own?.data;
        const hasOwnAddress = ownData?.street || ownData?.city;

        const address = hasOwnAddress
            ? own
            : application.company?.address;

        if (!address) return "";

        return address.text();
    }
}