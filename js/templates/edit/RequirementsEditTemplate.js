export class RequirementsEditTemplate {

    render() {
        return `
            <section id="section-requirements" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">🎯</span><h2>Anforderungen</h2></div></div>
                <div class="field-grid">
                    <div class="field field-ultra-wide"><label>Muss-Anforderungen (Zeilengetrennt)</label><textarea id="requiredContent" rows="4"></textarea></div>
                    <div class="field field-ultra-wide"><label>Muss-Anforderungen – Kenntnisse (Zeilengetrennt)</label><textarea id="requiredTags" rows="2"></textarea></div>

                    <div class="field field-ultra-wide"><label>Wünschenswerte Anforderungen (Zeilengetrennt)</label><textarea id="preferredContent" rows="4"></textarea></div>
                    <div class="field field-ultra-wide"><label>Wünschenswerte Anforderungen – Kenntnisse (Zeilengetrennt)</label><textarea id="preferredTags" rows="2"></textarea></div>

                    <div class="field field-ultra-wide"><label>Persönliche Anforderungen (Zeilengetrennt)</label><textarea id="personalContent" rows="4"></textarea></div>
                    <div class="field field-ultra-wide"><label>Persönliche Anforderungen – Kenntnisse (Zeilengetrennt)</label><textarea id="personalTags" rows="2"></textarea></div>
                </div>
            </section>
        `;
    }
}