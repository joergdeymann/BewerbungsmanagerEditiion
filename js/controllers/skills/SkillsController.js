export class SkillsController {

    constructor(skillCache) {
        this.skillCache = skillCache;
    }

    async setLevel(id, level, onUpdate) {
        await this.skillCache.setLevel(id, level);
        onUpdate();
    }

    async addSkill(name, onUpdate) {
        const trimmed = name.trim();
        if (!trimmed) return;

        await this.skillCache.addManual(trimmed);
        onUpdate();
    }

    async mergeSkills(sourceId, targetId, onUpdate) {
        if (!targetId || sourceId === targetId) return;

        await this.skillCache.merge(targetId, sourceId);
        onUpdate();
    }
}