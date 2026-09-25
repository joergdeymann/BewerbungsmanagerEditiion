import { JobConstants } from "../../constants/JobConstants.js";

export class JobEditTemplate {

    render() {
        return `
            <section id="section-job" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">💼</span><h2>Stellendetails</h2></div></div>
                <div class="field-grid">
                    <div class="field"><label>Jobtitel</label><input id="jobTitle"></div>
                    <div class="field"><label>Kennziffer</label><input id="referenceNumber"></div>
                    <div class="field"></div>

                    <div class="field"><label>Beschäftigungsart</label>
                        <select id="employmentType">
                            <option value="">– bitte wählen –</option>
                            ${JobConstants.EMPLOYMENT_TYPE.map(type => `<option value="${type}">${type}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field field-wide">
                        <label>Arbeitsmodell</label>
                        <div class="checkbox-list">
                            ${JobConstants.WORK_MODEL.map(option => `
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

                    <div class="field field-wide"><label>Straße (Arbeitsort)</label><input id="jobStreet" placeholder="Musterstraße"></div>
                    <div class="field"><label>Hausnr.</label><input id="jobHouseNumber" placeholder="12"></div>

                    <div class="field"><label>PLZ</label><input id="jobZip" placeholder="12345"></div>
                    <div class="field"><label>Stadt</label><input id="jobCity" placeholder="Musterstadt"></div>
                    <div class="field"><label>Land</label><input id="jobCountry" placeholder="Deutschland"></div>
                    <div class="field field-ultra-wide"><label>Badges (Zeilengetrennt)</label><textarea id="jobTags" rows="3"></textarea></div>
                    <div class="field field-ultra-wide"><label>Aufgaben (Zeilengetrennt)</label><textarea id="tasks" rows="6"></textarea></div>
                </div>
            </section>
        `;
    }
}