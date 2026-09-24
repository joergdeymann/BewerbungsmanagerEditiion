import { JobConstants } from "../../constants/JobConstants.js";

export class JobEditTemplate {

    render() {
        return `
            <section id="section-job" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">💼</span><h2>Stellendetails</h2></div></div>
                <div class="field-grid">
                    <div class="field"><label>Jobtitel</label><input id="jobTitle"></div>
                    <div class="field"><label>Beschäftigungsart</label><input id="employmentType"></div>
                    <div class="field field-ultra-wide">
                        <label>Arbeitsmodell</label>
                        <div class="checkbox-list">
                            ${JobConstants.ART_OPTIONS.map(option => `
                                <label class="checkbox-item">
                                    <input type="checkbox" class="work-model-option" value="${option}">
                                    ${option}
                                </label>
                            `).join("")}
                        </div>
                    </div>
                    <div class="field"><label>Gehalt</label><input id="salary"></div>
                    <div class="field"><label>Urlaubsgeld</label><input id="vacationPay"></div>
                    <div class="field"><label>Weihnachtsgeld</label><input id="christmasPay"></div>
                    <div class="field"><label>Kennziffer</label><input id="referenceNumber"></div>
                    <div class="field"><label>Straße (Arbeitsort)</label><input id="jobStreet"></div>
                    <div class="field"><label>Hausnummer</label><input id="jobHouseNumber"></div>
                    <div class="field"><label>PLZ</label><input id="jobZip"></div>
                    <div class="field"><label>Stadt</label><input id="jobCity"></div>
                    <div class="field"><label>Land</label><input id="jobCountry"></div>
                    <div class="field field-ultra-wide"><label>Badges (Zeilengetrennt)</label><textarea id="jobTags" rows="3"></textarea></div>
                    <div class="field field-ultra-wide"><label>Aufgaben (Zeilengetrennt)</label><textarea id="tasks" rows="6"></textarea></div>
                </div>
            </section>
        `;
    }
}