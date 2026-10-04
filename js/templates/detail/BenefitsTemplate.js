import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { BenefitConstants } from "../../constants/BenefitConstants.js";

export class BenefitsTemplate extends DetailBaseTemplate {

    render(application) {
        return `

            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">🎁</span>
                        <div>
                            <h2>Benefits</h2>
                            <p>Ausgleichmöglichkeiten von der Firma unterstützt</p>
                        </div>
                    </div>
                </section>
                
                <section class="section-body">
                    <div class="field">
                        <label>Benefits</label>
                        ${this.list(application.benefits?.content)}
                    </div>
                    <div class="field">
                        <label>Badges</label>
                        <p>${this.benefitBadges(application.benefits?.tags)}</p>
                    </div>
                </section>
            </section>
        `;
    }

    /**
     * Zeigt die Benefits als Badges in der Farbe ihrer Rubrik
     * (BenefitConstants). Unbekannte Tags bekommen die Standardfarbe.
     * @param {string[]} tags Tags aus dem Model.
     * @returns {string} HTML der Badges.
     */
    benefitBadges(tags) {
        if (!tags?.length) return "—";

        return tags.map(tag => {
            const color = BenefitConstants.colorFor(tag);
            return `<span class="tag-badge tag-badge--${color}">${HtmlUtils.escape(tag)}</span>`;
        }).join(" ");
    }
}