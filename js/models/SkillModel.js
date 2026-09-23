export class SkillModel {

    constructor() {
        this.id = crypto.randomUUID();
        this.name = "";
        this.level = null; // null = unbewertet (5. Zustand, keine Farbe)
        this.aliases = [];
    }

    get data() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            aliases: this.aliases
        };
    }

    set data(raw) {
        if (!raw) return;
        this.id = raw.id ?? this.id;
        this.name = raw.name ?? this.name;
        this.level = raw.level ?? this.level;
        this.aliases = raw.aliases ?? this.aliases;
    }

    // Prüft Name UND alle bekannten Aliase (z.B. nach manuellem Zusammenlegen)
    matches(name) {
        const normalized = SkillModel.normalize(name);

        return SkillModel.normalize(this.name) === normalized
            || this.aliases.some(alias => SkillModel.normalize(alias) === normalized);
    }

    static normalize(name) {
        return (name || "").trim().toLowerCase();
    }
}