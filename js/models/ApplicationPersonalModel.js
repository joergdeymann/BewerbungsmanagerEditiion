export class ApplicationPersonalModel {
    constructor() {
        this.date = "";
        this.address = "";
        this.content = "";
    }

    get data() {
        return {
            date: this.date,
            address: this.address,
            content: this.content
        };
    }

    set data(raw) {
        if (!raw) return;
        this.date = raw.date ?? this.date;
        this.address = raw.address ?? this.address;
        this.content = raw.content ?? this.content;
    }
}
