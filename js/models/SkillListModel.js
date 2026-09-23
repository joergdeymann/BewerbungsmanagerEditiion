import { SkillModel } from "./SkillModel.js";

// Ein einzelner, fester Datensatz im bestehenden Object Store -
// kein eigener Store für die Kenntnisse nötig.
export class SkillListModel {

    static GLOBAL_ID = "global-skills";

    constructor() {
        this.id = SkillListModel.GLOBAL_ID;
        this.skills = [];
    }

    get data() {
        return {
            id: this.id,
            skills: this.skills.map(skill => skill.data)
        };
    }

    set data(raw) {
        if (!raw) return;

        this.skills = (raw.skills || []).map(rawSkill => {
            const skill = new SkillModel();
            skill.data = rawSkill;
            return skill;
        });
    }

    findByName(name) {
        return this.skills.find(skill => skill.matches(name));
    }
}