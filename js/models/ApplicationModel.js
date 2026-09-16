import { StatusHistoryModel } from "./StatusHistoryModel.js";
import { ApplicationHistoryModel } from "./ApplicationHistoryModel.js";

export class ApplicationModel {
    constructor() {
        this.status = "";
        this.appliedAt = "";
        // "portal", "email", "phone" oder "personal"
        this.channel = "";
        this.coverLetter = "";
        this.resume = "";
        this.emailCoverLetter = "";
        this.signature = "";
        this.statusHistory = [];
        this.history = [];
    }

    get data() {
        return {
            status: this.status,
            appliedAt: this.appliedAt,
            channel: this.channel,
            coverLetter: this.coverLetter,
            resume: this.resume,
            emailCoverLetter: this.emailCoverLetter,
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
        this.coverLetter = raw.coverLetter ?? this.coverLetter;
        this.resume = raw.resume ?? this.resume;
        this.emailCoverLetter = raw.emailCoverLetter ?? this.emailCoverLetter;
        this.signature = raw.signature ?? this.signature;

        if (raw.statusHistory && Array.isArray(raw.statusHistory)) {
            this.statusHistory = [];
            for (const rawEntry of raw.statusHistory) {
                const entry = new StatusHistoryModel();
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
        const entry = new StatusHistoryModel();
        entry.date = new Date().toISOString();
        entry.status = status;
        entry.reason = reason;

        this.statusHistory.push(entry);
        this.status = status;
        return entry;
    }
}
