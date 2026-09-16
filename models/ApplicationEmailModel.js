export class ApplicationEmailModel {
    constructor() {
        this.date = "";
        this.emailTo = "";
        this.emailFrom = "";
        this.subject = "";
        this.content = "";
        this.attachments = [];
    }

    get data() {
        return {
            date: this.date,
            emailTo: this.emailTo,
            emailFrom: this.emailFrom,
            subject: this.subject,
            content: this.content,
            attachments: this.attachments
        };
    }

    set data(raw) {
        if (!raw) return;
        this.date = raw.date ?? this.date;
        this.emailTo = raw.emailTo ?? this.emailTo;
        this.emailFrom = raw.emailFrom ?? this.emailFrom;
        this.subject = raw.subject ?? this.subject;
        this.content = raw.content ?? this.content;
        this.attachments = raw.attachments ?? this.attachments;
    }
}
