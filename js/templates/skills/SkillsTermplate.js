import { HtmlUtils } from "../../utils/HtmlUtils.js";
import { SkillConstants } from "../../constants/SkillConstants.js";

export class SkillsTemplate {

    render(skills) {
        return `
            <section class="subsection-display">
                <section class="section-header">
                    <div>
                        <span class="section-icon">🧠</span>
                        <div>
                            <h2>Kenntnisse</h2>
                            <p>Alle erkannten Kenntnisse und deine Einstufung</p>
                        </div>
                    </div>
                </section>

                <section class="section-body">
                    <div class="field">
                        <label>Neue Kenntnis hinzufügen</label>
                        <div class="url-input-row">
                            <input id="newSkillName" placeholder="z.B. Projektmanagement">
                            <button id="addSkill" class="primary">Hinzufügen</button>
                        </div>
                    </div>

                    <div class="field">
                        <label>Alle Kenntnisse (${skills.length})</label>
                        ${skills.length
                            ? this.rows(skills)
                            : `<p class="muted">Noch keine Kenntnisse vorhanden.</p>`}
                    </div>
                </section>
            </section>
        `;
    }

    rows(skills) {
        return skills.map(skill => this.row(skill, skills)).join("");
    }

    row(skill, allSkills) {
        return `
            <div class="field-with-button skill-row">
                <div class="skill-info">
                    <strong>${HtmlUtils.escape(skill.name)}</strong>
                    ${skill.aliases.length
                        ? `<span class="muted"> (${skill.aliases.map(a => HtmlUtils.escape(a)).join(", ")})</span>`
                        : ""}
                </div>

                <div class="skill-levels">
                    ${this.levelBadge(skill, "EXPERT")}
                    ${this.levelBadge(skill, "ADVANCED")}
                    ${this.levelBadge(skill, "BASIC")}
                    ${this.levelBadge(skill, "NONE")}
                </div>

                <div class="skill-merge">
                    <select data-merge-target="${skill.id}">
                        <option value="">In andere Kenntnis übernehmen ...</option>
                        ${allSkills
                            .filter(other => other.id !== skill.id)
                            .map(other => `<option value="${other.id}">${HtmlUtils.escape(other.name)}</option>`)
                            .join("")}
                    </select>
                    <button type="button" class="secondary" data-merge-trigger="${skill.id}">Zusammenlegen</button>
                </div>
            </div>
        `;
    }

    levelBadge(skill, level) {
        const active = skill.level === level;
        const cssClass = active ? SkillConstants.getClass(level) : "";

        return `
            <span class="tag-badge skill-selectable ${cssClass}"
                  data-set-level="${skill.id}" data-level="${level}">
                ${SkillConstants.LEVEL_LABEL[level]}
            </span>
        `;
    }
}