import { SkillDB } from "./SkillDB.js";
import { SkillModel } from "../models/SkillModel.js";
import { SkillAliasConstants } from "../constants/SkillAliasConstants.js";

export class SkillCache {

    constructor() {
        this.db = new SkillDB();
        this.list = null;
    }

    async load() {
        this.list = await this.db.get();
    }

    getAll() {
        return this.list.skills;
    }

    async setLevel(id, level) {
        const skill = this.list.skills.find(skill => skill.id === id);
        if (!skill) return;

        skill.level = level;
        await this.db.save(this.list);
    }

    async addManual(name) {
        const resolvedName = SkillAliasConstants.resolve(name);
        if (!resolvedName || this.list.findByName(resolvedName)) return;

        const skill = new SkillModel();
        skill.name = resolvedName;
        this.list.skills.push(skill);

        await this.db.save(this.list);
    }

    // Zwei Einträge, die dasselbe meinen, zusammenlegen. "keepId" bleibt
    // bestehen (inkl. seiner Einstufung), "removeId" wird als Alias
    // übernommen und aus der Liste entfernt.
    async merge(keepId, removeId) {
        const keep = this.list.skills.find(skill => skill.id === keepId);
        const remove = this.list.skills.find(skill => skill.id === removeId);

        if (!keep || !remove || keep === remove) return;

        if (!keep.aliases.includes(remove.name)) {
            keep.aliases.push(remove.name);
        }

        for (const alias of remove.aliases) {
            if (!keep.aliases.includes(alias)) {
                keep.aliases.push(alias);
            }
        }

        this.list.skills = this.list.skills.filter(skill => skill.id !== removeId);
        await this.db.save(this.list);
    }

    // Übernimmt neue Tags aus einer Bewerbung ins globale Kenntnisprofil.
    // Bereits bekannte Kenntnisse (Name oder Alias) bleiben unverändert.
    async syncFromApplication(application) {
        const rawTags = [
            ...(application.qualifications?.required?.tags || []),
            ...(application.qualifications?.preferred?.tags || []),
            ...(application.qualifications?.personal?.tags || [])
        ];

        let changed = false;

        for (const rawTag of rawTags) {
            const resolvedName = SkillAliasConstants.resolve(rawTag);
            if (!resolvedName || this.list.findByName(resolvedName)) continue;

            const skill = new SkillModel();
            skill.name = resolvedName;
            this.list.skills.push(skill);
            changed = true;
        }

        if (changed) {
            await this.db.save(this.list);
        }
    }
}