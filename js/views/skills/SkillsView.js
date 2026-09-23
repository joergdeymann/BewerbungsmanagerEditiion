import { SkillsTemplate } from "../../templates/skills/SkillsTemplate.js";
import { SkillsEvent } from "../../events/skills/SkillsEvent.js";

export class SkillsView {

    constructor(skillCache) {
        this.skillCache = skillCache;
        this.template = new SkillsTemplate();
        this.event = new SkillsEvent(skillCache);
    }

    render(root) {
        this.draw(root);
    }

    draw(root) {
        root.innerHTML = this.template.render(this.skillCache.getAll());
        this.event.bind(root, () => this.draw(root));
    }
}