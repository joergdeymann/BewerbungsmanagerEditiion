import { LegalFormConstants } from "../../constants/LegalFormConstants.js";

export class CompanyEditTemplate {

    render() {
        return `
            <section id="section-company" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">🏢</span><h2>Unternehmensdaten</h2></div></div>
                <div class="field-grid">
                    <div class="field"><label>Firmenname</label><input id="companyName"></div>
                    <div class="field">
                        <label>Rechtsform</label>
                        <select id="legalForm">
                            <option value="">– bitte wählen –</option>
                            ${LegalFormConstants.list().map(form => `<option value="${form}">${LegalFormConstants.LABEL[form]}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field"><label>Beziehung</label><input id="relationship" placeholder="z.B. Hauptsitz"></div>
                    <div class="field"><label>Branche</label><input id="industry"></div>
                    <div class="field"><label>Größe</label><input id="companySize"></div>
                    <div class="field"><label>Gegründet</label><input id="founded"></div>
                    <div class="field field-wide"><label>Website</label><input id="website"></div>
                    <div class="field"><label>Straße</label><input id="street"></div>
                    <div class="field"><label>Hausnummer</label><input id="houseNumber"></div>
                    <div class="field"><label>Länderkürzel (PLZ-Vorsatz)</label><input id="zipCountry" placeholder="z.B. DE"></div>
                    <div class="field"><label>PLZ</label><input id="zip"></div>
                    <div class="field"><label>Stadt</label><input id="city"></div>
                    <div class="field"><label>Land</label><input id="country"></div>
                    <div class="field"><label>Postfach</label><input id="postBox"></div>
                    <div class="field"><label>Verifiziert am</label><input type="date" id="verifiedAt"></div>
                    <div class="field field-wide"><label>Firmenbeschreibung</label><textarea id="companyDescription" rows="4"></textarea></div>
                    <div class="field"><label>Spezialgebiete (Zeilengetrennt)</label><textarea id="specialties" rows="4"></textarea></div>
                </div>

                <div class="subsection">
                    <div class="subsection-header">
                        <h3>Bilder zur Firma</h3>
                        <span>Bild-URLs eintragen und ein Hauptbild markieren.</span>
                    </div>
                    <div id="companyImages"></div>
                </div>
            </section>
        `;
    }
}