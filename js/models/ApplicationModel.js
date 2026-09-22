import { ApplicationStatusHistoryModel } from "./ApplicationStatusHistoryModel.js";
import { ApplicationHistoryModel } from "./ApplicationHistoryModel.js";
import { UploadFileModel } from "./UploadFileModel.js";

export class ApplicationModel {
    constructor() {
        this.status = "";
        this.appliedAt = "";
        // "portal", "email", "phone" oder "personal"
        this.channel = "";
        this.coverLetter = null;
        this.resume = [];
        this.emailCoverLetter = null;
        this.signature = "";
        this.statusHistory = [];
        this.history = [];
    }

    get data() {
        return {
            status: this.status,
            appliedAt: this.appliedAt,
            channel: this.channel,
            coverLetter: this.coverLetter ? this.coverLetter.data : null,
            resume: this.resume.map(file => file.data),
            emailCoverLetter: this.emailCoverLetter ? this.emailCoverLetter.data : null,
            signature: this.signature,
            statusHistory: this.statusHistory.map(entry => entry.data),
            history: this.history.map(entry => entry.data)
        };
    }

    set data(raw) {
        if (!raw) return;

        this.status = raw.status ?? this.status;
        this.appliedAt = raw.appliedAt ?? this.appliedAt;
        this.channel = raw.channel ?? this.channel;
        this.signature = raw.signature ?? this.signature;

        if (raw.coverLetter) {
            this.coverLetter = new UploadFileModel();
            this.coverLetter.data = raw.coverLetter;
        }

        if (raw.emailCoverLetter) {
            this.emailCoverLetter = new UploadFileModel();
            this.emailCoverLetter.data = raw.emailCoverLetter;
        }

        if (raw.resume && Array.isArray(raw.resume)) {
            this.resume = [];
            for (const rawFile of raw.resume) {
                const file = new UploadFileModel();
                file.data = rawFile;
                this.resume.push(file);
            }
        }

        if (raw.statusHistory && Array.isArray(raw.statusHistory)) {
            this.statusHistory = [];
            for (const rawEntry of raw.statusHistory) {
                const entry = new ApplicationStatusHistoryModel();
                entry.data = rawEntry;
                this.statusHistory.push(entry);
            }
        }

        if (raw.history && Array.isArray(raw.history)) {
            this.history = [];
            for (const rawEntry of raw.history) {
                const entry = new ApplicationHistoryModel();
                entry.data = rawEntry;
                this.history.push(entry);
            }
        }
    }

    addStatus(status, reason = "") {
        const entry = new ApplicationStatusHistoryModel();
        entry.date = new Date().toISOString();
        entry.status = status;
        entry.reason = reason;

        this.statusHistory.push(entry);
        this.status = status;
        return entry;
    }
}