export class CapturedContentModel {

    constructor() {
        this.id = crypto.randomUUID();
        this.url = "";
        this.capturedAt = "";
        this.content = "";
    }

    get data() {
        return {
            id: this.id,
            url: this.url,
            capturedAt: this.capturedAt,
            content: this.content
        };
    }

    set data(raw) {
        if (!raw) return;
        this.id = raw.id ?? this.id;
        this.url = raw.url ?? this.url;
        this.capturedAt = raw.capturedAt ?? this.capturedAt;
        this.content = raw.content ?? this.content;
    }
}