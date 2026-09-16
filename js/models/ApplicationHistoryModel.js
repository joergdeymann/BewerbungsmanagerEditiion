import { ApplicationPortalModel } from "./ApplicationPortalModel.js";
import { ApplicationEmailModel } from "./ApplicationEmailModel.js";
import { ApplicationPhoneModel } from "./ApplicationPhoneModel.js";
import { ApplicationPersonalModel } from "./ApplicationPersonalModel.js";

// Bewerbungswege, für die es jeweils ein eigenes Detail-Model gibt.
const CHANNEL_MODELS = {
    portal: ApplicationPortalModel,
    email: ApplicationEmailModel,
    phone: ApplicationPhoneModel,
    personal: ApplicationPersonalModel
};

export class ApplicationHistoryModel {
    constructor() {
        this.channel = "";
        this.entry = null;
    }

    get data() {
        return {
            channel: this.channel,
            entry: this.entry ? this.entry.data : null
        };
    }

    set data(raw) {
        if (!raw) return;

        this.channel = raw.channel ?? this.channel;

        const ModelClass = CHANNEL_MODELS[this.channel];
        if (!ModelClass) throw new Error(`Unbekannter Bewerbungsweg "${this.channel}".`);

        this.entry = new ModelClass();
        this.entry.data = raw.entry;
    }
}
