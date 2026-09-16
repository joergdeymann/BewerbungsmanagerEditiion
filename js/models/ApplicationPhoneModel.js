export class ApplicationPhoneModel {
    constructor() {
        this.date = "";
        this.phoneTo = "";
        this.phoneFrom = "";
        this.content = "";
    }

    get data() {
        return {
            date: this.date,
            phoneTo: this.phoneTo,
            phoneFrom: this.phoneFrom,
            content: this.content
        };
    }

    set data(raw) {
        if (!raw) return;
        this.date = raw.date ?? this.date;
        this.phoneTo = raw.phoneTo ?? this.phoneTo;
        this.phoneFrom = raw.phoneFrom ?? this.phoneFrom;
        this.content = raw.content ?? this.content;
    }
}
