import { WorkModelConstants } from "../constants/WorkModelConstants.js";

/**
 * Arbeitstage pro Woche für einen Typ des Arbeitsmodells
 * (Vor Ort, Hybrid, Homeoffice, Remote).
 */
export class WorkDayModel {
    /**
     * @param {string} [type] Typ aus WorkModelConstants.WORK_DAY_TYPES.
     */
    constructor(type = "") {
        this.type = type;
        this.days = WorkModelConstants.DEFAULT_DAYS;
        this.onSite = null;
        this.remote = null;
    }

    /**
     * Erzeugt einen Eintrag mit den Standardwerten des Typs
     * (Vor Ort: 5/0, Homeoffice und Remote: 0/5, Hybrid: unbekannt).
     * @param {string} type Typ aus WorkModelConstants.WORK_DAY_TYPES.
     * @returns {WorkDayModel} neuer Eintrag.
     */
    static forType(type) {
        const kinds = WorkModelConstants.WORK_DAY_TYPE;
        const day = new WorkDayModel(type);

        if (type === kinds.ON_SITE) {
            day.onSite = day.days;
            day.remote = 0;
        }

        if (type === kinds.HOME_OFFICE || type === kinds.REMOTE) {
            day.onSite = 0;
            day.remote = day.days;
        }

        return day;
    }

    get data() {
        return {
            type: this.type,
            days: this.days,
            onSite: this.onSite,
            remote: this.remote
        };
    }

    set data(raw) {
        if (!raw) return;

        // Abwärtskompatibilität: ältere Datensätze liefern nur den Namen des Typs.
        if (typeof raw === "string") {
            this.type = raw;
            return;
        }

        this.type = raw.type ?? this.type;
        this.days = raw.days ?? this.days;
        this.onSite = raw.onSite ?? this.onSite;
        this.remote = raw.remote ?? this.remote;
    }

    /**
     * Anzeigetext, z. B. "Hybrid (3 Tage vor Ort · 2 Tage Homeoffice)".
     * Ohne bekannte Tage nur der Typ.
     * @returns {string} Anzeigetext.
     */
    get label() {
        const parts = [];
        const dayWord = count => (count === 1 ? "Tag" : "Tage");

        if (this.type !== WorkModelConstants.WORK_DAY_TYPE.HYBRID) return this.type;

        if (this.onSite !== null) parts.push(`${this.onSite} ${dayWord(this.onSite)} vor Ort`);
        if (this.remote !== null) parts.push(`${this.remote} ${dayWord(this.remote)} Homeoffice`);

        return parts.length ? `${this.type} (${parts.join(" · ")})` : this.type;
    }
}
