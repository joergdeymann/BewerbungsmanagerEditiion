import { SkillsController } from "../../controllers/skills/SkillsController.js";

export class SkillsEvent {

    constructor(skillCache) {
        this.controller = new SkillsController(skillCache);
    }

    bind(root, onUpdate) {
        this.bindAdd(root, onUpdate);
        this.bindSelect(root, onUpdate);
        this.bindLevel(root, onUpdate);
        this.bindMerge(root, onUpdate);
    }

    bindAdd(root, onUpdate) {
        const button = root.querySelector("#addSkill");
        if (!button) return;

        button.onclick = () => {
            const input = root.querySelector("#newSkillName");
            this.controller.addSkill(input.value, onUpdate);
            input.value = "";
        };
    }

    bindSelect(root, onUpdate) {
        root.querySelectorAll("[data-select-skill]").forEach(badge => {
            badge.onclick = () => onUpdate(badge.dataset.selectSkill);
        });
    }

    bindLevel(root, onUpdate) {
        root.querySelectorAll("[data-set-level]").forEach(badge => {
            badge.onclick = () =>
                this.controller.setLevel(
                    badge.dataset.setLevel,
                    badge.dataset.level,
                    onUpdate
                );
        });
    }

    bindMerge(root, onUpdate) {
        root.querySelectorAll("[data-merge-trigger]").forEach(button => {
            button.onclick = () => {
                const sourceId = button.dataset.mergeTrigger;
                const select = root.querySelector(`[data-merge-target="${sourceId}"]`);

                this.controller.mergeSkills(sourceId, select.value, onUpdate);
            };
        });
    }
}