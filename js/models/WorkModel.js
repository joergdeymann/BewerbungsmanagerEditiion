import { WorkDayModel } from "./WorkDayModel.js";

/**
 * Arbeitsmodell einer Stelle (deutsch: ArbeitsModel).
 *
 *   type      Art der Anstellung (Liste, z. B. Vollzeit, Teilzeit)
 *   workTime  Arbeitszeit (Liste, z. B. Gleitzeit, Nachtschicht)
 *   workDays  Arbeitstage je Typ (Liste von WorkDayModel)
 *   notes     Hinweise im Originalwortlaut (Liste, kurz)
 *
 * Die Listen type, workTime und notes sind bewusst keine eigenen Models.
 */
export class WorkModel {
    constructor() {
        this.type = [];
        this.workTime = [];
        this.workDays = [];
        this.notes = [];
    }

    get data() {
        return {
            type: [...this.type],
            workTime: [...this.workTime],
            workDays: this.workDays.map(day => day.data),
            notes: [...this.notes]
        };
    }

    set data(raw) {
        if (!raw) return;

        // Abwärtskompatibilität: früher war job.workModel eine Liste von Namen
        // ("Hybrid", "Vor Ort"). Sie wird zu Arbeitstagen mit Standardwerten.
        if (Array.isArray(raw)) {
            this.workDays = raw
                .filter(type => typeof type === "string" && type)
                .map(type => WorkDayModel.forType(type));
            return;
        }

        if (Array.isArray(raw.type)) this.type = [...raw.type];
        else if (typeof raw.type === "string") this.type = raw.type ? [raw.type] : [];

        if (Array.isArray(raw.workTime)) this.workTime = [...raw.workTime];
        if (Array.isArray(raw.notes)) this.notes = [...raw.notes];

        if (Array.isArray(raw.workDays)) {
            this.workDays = raw.workDays.map(item => {
                const day = new WorkDayModel();
                day.data = item;
                return day;
            });
        }
    }

    /**
     * Namen der Typen der Arbeitstage ("Hybrid", "Vor Ort", ...).
     * @returns {string[]} Typen.
     */
    get workDayTypes() {
        return this.workDays.map(day => day.type);
    }
}
