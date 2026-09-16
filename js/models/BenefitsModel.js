export class BenefitsModel {
    constructor() {
        this.tags = [];
        this.content = [];
    }

    get data() {
        return {
            tags: this.tags,
            content: this.content
        };
    }

    set data(raw) {
        if (!raw) return;
        this.tags = raw.tags ?? this.tags;
        this.content = raw.content ?? this.content;
    }

    add(text, tag = "") {
        if (text) this.content.push(text);
        if (tag) this.tags.push(tag);
    }
}
