import { DetailBaseTemplate } from "./DetailBaseTemplate.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { SkillConstants } from "../../constants/SkillConstants.js";

export class RequirementsTemplate extends DetailBaseTemplate {

    render(application, skills = []) {

        return `
            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">🎯</span>
                        <div>
                            <h2>Anforderungen</h2>
                            <p>Diese Eigenschaften erwartet die Firma von Dir</p>
                        </div>
                    </div>
                </section>
                
                <section class="section-body">
                    <div class="field">
                        <label>Muss-Anforderungen</label>
                        ${this.list(application.qualifications?.required?.content)}
                        <p>${this.skillBadges(application.qualifications?.required?.tags, skills)}</p>
                    </div>

                    <div class="field">
                        <label>Persönliche Anforderungen</label>
                        ${this.list(application.qualifications?.personal?.content)}
                        <p>${this.skillBadges(application.qualifications?.personal?.tags, skills)}</p>
                    </div>
                    <div class="field">
                        <label>Wünschenswerte Kenntnisse</label>
                        ${this.list(application.qualifications?.preferred?.content)}
                        <p>${this.skillBadges(application.qualifications?.preferred?.tags, skills)}</p>
                    </div>
                </section>
            </section>    
        `;
    }

    skillBadges(items, skills) {

        if (!items?.length) {
            return "—";
        }

        return items
            .map(item => {
                const skill = skills.find(skill => skill.matches(item));
                const levelClass = skill ? SkillConstants.getClass(skill.level) : "";

                return `<span class="tag-badge ${levelClass}">${HtmlUtils.escape(item)}</span>`;
            })
            .join(" ");
    }
}