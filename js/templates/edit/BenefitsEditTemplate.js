export class BenefitsEditTemplate {

    render() {
        return `
            <section id="section-benefits" class="tab-content" style="display:none;">
                <div class="section-header"><div><span class="section-icon">🎁</span><h2>Benefits</h2></div></div>
                <div class="field-grid">
                    <div class="field field-ultra-wide"><label>Benefits (Zeilengetrennt)</label><textarea id="benefitsContent" rows="6"></textarea></div>
                    <div class="field field-ultra-wide"><label>Badges (Zeilengetrennt)</label><textarea id="benefitsTags" rows="3"></textarea></div>
                </div>
            </section>
        `;
    }
}