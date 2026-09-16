export class QualificationModel {
    constructor() {
        this.required = { tags: [], content: [] };
        this.preferred = { tags: [], content: [] };
        this.personal = { tags: [], content: [] };
    }

    get data() {
        return {
            required: this.required,
            preferred: this.preferred,
            personal: this.personal
        };
    }

    set data(raw) {
        if (!raw) return;
        this.setArea("required", raw.required);
        this.setArea("preferred", raw.preferred);
        this.setArea("personal", raw.personal);
    }

    setArea(area, raw) {
        if (!raw) return;
        this[area].tags = raw.tags ?? this[area].tags;
        this[area].content = raw.content ?? this[area].content;
    }

    add(area, text, tag = "") {
        const target = this[area];
        if (!target) throw new Error(`Unbekannter Qualifikationsbereich "${area}".`);

        if (text) target.content.push(text);
        if (tag) target.tags.push(tag);
    }
}
