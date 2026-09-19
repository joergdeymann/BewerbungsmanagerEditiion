import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";

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
                        <p>${(application.benefits?.tags || []).length
                            ? application.benefits.tags.map(tag => `<span class="tag-badge">${HtmlUtils.escape(tag)}</span>`).join(" ")
                            : "—"}</p>
                    </div>
                </section>
            </section>
        `;
    }
}