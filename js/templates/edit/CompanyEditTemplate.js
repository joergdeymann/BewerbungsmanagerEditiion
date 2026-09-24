import { LegalFormConstants } from "../../constants/LegalFormConstants.js";

export class CompanyEditTemplate {

    render() {
        return `
            <section id="section-company" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">🏢</span><h2>Unternehmensdaten</h2></div></div>
                <div class="field-grid">
                    <div class="field"><label>Firmenname</label><input id="companyName" placeholder="Muster GmbH"></div>
                    <div class="field">
                        <label>Rechtsform</label>
                        <select id="legalForm">
                            <option value="">– bitte wählen –</option>
                            ${LegalFormConstants.list().map(form => `<option value="${form}">${LegalFormConstants.LABEL[form]}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field"><label>Beziehung</label><input id="relationship" placeholder="z.B. Hauptsitz"></div>

                    <div class="field"><label>Branche</label><input id="industry" placeholder="z.B. IT-Dienstleistungen"></div>
                    <div class="field"><label>Mitarbeiter</label><input id="companySize" placeholder="z.B. 50-200"></div>
                    <div class="field"><label>Gegründet</label><input id="founded" placeholder="z.B. 1998"></div>

                    <div class="field"><label>Website</label><input id="website" placeholder="https://..."></div>
                    <div class="field"><label>Allgemeine E-Mail</label><input id="companyEmail" placeholder="info@firma.de"></div>
                    <div class="field"><label>Allgemeine Telefonnummer</label><input id="companyPhone" placeholder="+49 ..."></div>

                    <div class="field field-wide"><label>Straße</label><input id="street" placeholder="Musterstraße"></div>
                    <div class="field"><label>Hausnr.</label><input id="houseNumber" placeholder="12"></div>

                    <div class="field"><label>Länderkürzel</label><input id="zipCountry" placeholder="D"></div>
                    <div class="field"><label>PLZ</label><input id="zip" placeholder="12345"></div>
                    <div class="field"><label>Stadt</label><input id="city" placeholder="Musterstadt"></div>

                    <div class="field"><label>Land</label><input id="country" placeholder="Deutschland"></div>
                    <div class="field field-wide"><label>Postfach</label><input id="postBox" placeholder="falls abweichend, z.B. Postfach 12 34"></div>

                    <div class="field"><label>Verifiziert am</label><input type="date" id="verifiedAt"></div>
                    <div class="field field-ultra-wide"><label>Firmenbeschreibung</label><textarea id="companyDescription" rows="4"></textarea></div>
                    <div class="field field-ultra-wide"><label>Spezialgebiete (Zeilengetrennt)</label><textarea id="specialties" rows="4"></textarea></div>
                </div>

                <div class="subsection">
                    <div class="subsection-header"><h3>Bilder zur Firma</h3></div>
                    <div id="companyImages"></div>
                </div>
            </section>
        `;
    }
}