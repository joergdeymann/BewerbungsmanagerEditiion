import { SkillsTemplate } from "../../templates/skills/SkillsTemplate.js";
import { SkillsEvent } from "../../events/skills/SkillsEvent.js";

export class SkillsView {

    constructor(skillCache) {
        this.skillCache = skillCache;
        this.template = new SkillsTemplate();
        this.event = new SkillsEvent(skillCache);
        this.selectedId = null;
    }

    render(root) {
        this.draw(root);
    }

    draw(root, selectedId = this.selectedId) {
        this.selectedId = selectedId;
        root.innerHTML = this.template.render(this.skillCache.getAll(), this.selectedId);
        this.event.bind(root, id => this.draw(root, id));
    }
}