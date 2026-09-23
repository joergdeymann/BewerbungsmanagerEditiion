import { InfoPrompt } from "../../views/windows/InfoPrompt.js";

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

        const result = await this.skillCache.addManual(trimmed);

        if (result.duplicate) {
            const infoPrompt = new InfoPrompt();
            await infoPrompt.show(
                `„${trimmed}" ist bereits als „${result.existingName}" vorhanden.`,
                "Kenntnis bereits vorhanden"
            );
        }

        onUpdate();
    }

    async mergeSkills(sourceId, targetId, onUpdate) {
        if (!targetId || sourceId === targetId) return;

        await this.skillCache.merge(targetId, sourceId);
        onUpdate(targetId);
    }
}