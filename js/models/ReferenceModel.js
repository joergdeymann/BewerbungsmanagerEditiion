export class ReferenceModel {
    constructor() {
        this.id = 0;
        this.name = "";
        this.url = "";
        this.capturedAt = "";
        this.content = "";
    }

    get data() {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            capturedAt: this.capturedAt,
            content: this.content
        };
    }

    set data(raw) {
        if (!raw) return;
        this.id = raw.id ?? this.id;
        this.name = raw.name ?? this.name;
        this.url = raw.url ?? this.url;
        this.capturedAt = raw.capturedAt ?? this.capturedAt;
        this.content = raw.content ?? raw.sourceCode ?? this.content;
    }
}
