import { WorkModelConstants } from "../../constants/WorkModelConstants.js";

export class JobEditTemplate {

    render() {
        return `
            <section id="section-job" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">💼</span><h2>Stellendetails</h2></div></div>
                <div class="field-grid">
                    <div class="field"><label>Jobtitel</label><input id="jobTitle"></div>
                    <div class="field"><label>Kennziffer</label><input id="referenceNumber"></div>
                    <div class="field"></div>

                    <div class="field field-ultra-wide">
                        <label>Beschäftigungsart</label>
                        ${this.checkboxList("work-type-option", WorkModelConstants.TYPE)}
                    </div>
                    <div class="field field-ultra-wide">
                        <label>Arbeitszeit</label>
                        ${this.checkboxList("work-time-option", WorkModelConstants.WORK_TIME)}
                    </div>
                    <div class="field field-ultra-wide">
                        <label>Arbeitsmodell (Arbeitstage pro Woche)</label>
                        <div class="work-days">
                            ${WorkModelConstants.WORK_DAY_TYPES.map(type => this.workDayRow(type)).join("")}
                        </div>
                    </div>
                    <div class="field field-ultra-wide">
                        <label>Hinweise zum Arbeitsmodell (Zeilengetrennt, kurz)</label>
                        <textarea id="workNotes" rows="3"></textarea>
                    </div>
                    <div class="field"><label>Gehalt (von)</label><input id="salaryFrom" type="number" min="0" step="100"></div>
                    <div class="field"><label>Gehalt (bis)</label><input id="salaryTo" type="number" min="0" step="100"></div>
                    <div class="field"><label>Währung</label><input id="salaryCurrency" placeholder="EUR"></div>
                    <div class="field"><label>Gehaltsart</label>
                        <select id="salaryGross">
                            <option value="">– keine Angabe –</option>
                            <option value="brutto">Brutto</option>
                            <option value="netto">Netto</option>
                        </select>
                    </div>
                    <div class="field"><label>Urlaubsgeld</label><input id="vacationPay" type="number" min="0" step="100"></div>
                    <div class="field"><label>Weihnachtsgeld</label><input id="christmasPay" type="number" min="0" step="100"></div>
                    <div class="field field-ultra-wide"><label>Urlaub (Originaltext der Anzeige)</label><input id="holidayText" placeholder="z. B. mit einem halben Gehalt Urlaubsgeld im Gepäck"></div>

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

    /**
     * Liste von Checkboxen (Mehrfachauswahl).
     * @param {string} cssClass Klasse der Checkboxen.
     * @param {string[]} options Auswahlwerte.
     * @returns {string} HTML.
     */
    checkboxList(cssClass, options) {
        return `
            <div class="checkbox-list">
                ${options.map(option => `
                    <label class="checkbox-item">
                        <input type="checkbox" class="${cssClass}" value="${option}">
                        ${option}
                    </label>
                `).join("")}
            </div>
        `;
    }

    /**
     * Eine Zeile der Arbeitstage: Typ (an/aus) mit Tagen gesamt, vor Ort und remote.
     * @param {string} type Typ aus WorkModelConstants.WORK_DAY_TYPES.
     * @returns {string} HTML.
     */
    workDayRow(type) {
        const max = WorkModelConstants.MAX_DAYS;
        const input = (name, label) => `
            <label class="work-day__field">${label}
                <input type="number" class="work-day__input work-day__${name}" min="0" max="${max}" step="1">
            </label>
        `;

        return `
            <div class="work-day" data-type="${type}">
                <label class="checkbox-item work-day__type">
                    <input type="checkbox" class="work-day__enabled">
                    ${type}
                </label>
                ${input("days", "Tage")}
                ${input("on-site", "vor Ort")}
                ${input("remote", "zuhause")}
            </div>
        `;
    }
}
