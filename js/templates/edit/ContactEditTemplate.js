export class ContactEditTemplate {

    render() {
        return `
            <section id="section-contact" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">✉️</span><h2>Allgemeiner Kontakt</h2></div></div>
                <div class="field-grid">
                    <div class="field"><label>Allgemeine E-Mail</label><input id="companyEmail"></div>
                    <div class="field"><label>Allgemeine Telefonnummer</label><input id="companyPhone"></div>
                </div>
                <p class="muted">Für konkrete Ansprechpartner siehe unten.</p>

                <div id="contactSection"></div>
            </section>
        `;
    }
}