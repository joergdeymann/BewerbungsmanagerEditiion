export class UploadFileModel {
    constructor() {
        this.id = crypto.randomUUID();
        this.originalName = "";
        this.link = "";
    }

    get data() {
        return {
            id: this.id,
            originalName: this.originalName,
            link: this.link
        };
    }

    set data(raw) {
        if (!raw) return;
        this.id = raw.id || this.id;
        this.originalName = raw.originalName ?? this.originalName;
        this.link = raw.link ?? this.link;
    }

    // Anzeige: Originalname ohne Verzeichnisse und ohne Endung.
    get displayName() {
        const base = this.originalName.split(/[\\/]/).pop() || "";
        const dot = base.lastIndexOf(".");
        return dot > 0 ? base.slice(0, dot) : base;
    }
}