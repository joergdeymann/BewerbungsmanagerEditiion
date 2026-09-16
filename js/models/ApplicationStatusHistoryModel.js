export class ApplicationStatusHistoryModel {
    constructor() {
        this.date = "";
        this.status = "";
        this.reason = "";
    }

    get data() {
        return {
            date: this.date,
            status: this.status,
            reason: this.reason
        };
    }

    set data(raw) {
        if (!raw) return;
        this.date = raw.date ?? this.date;
        this.status = raw.status ?? this.status;
        this.reason = raw.reason ?? this.reason;
    }
}
