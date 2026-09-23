export class SkillConstants {

    static LEVEL = {
        EXPERT: "EXPERT",
        ADVANCED: "ADVANCED",
        BASIC: "BASIC",
        NONE: "NONE"
    };

    static LEVEL_CLASS = {
        EXPERT: "skill-expert",
        ADVANCED: "skill-advanced",
        BASIC: "skill-basic",
        NONE: "skill-none"
    };

    static LEVEL_LABEL = {
        EXPERT: "Experte",
        ADVANCED: "Erweiterte Kenntnisse",
        BASIC: "Grundkenntnisse",
        NONE: "Keine Kenntnisse"
    };

    static getClass(level) {
        return this.LEVEL_CLASS[level] || "";
    }
}