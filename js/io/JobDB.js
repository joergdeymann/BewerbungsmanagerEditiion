import { LocalDB } from "./LocalDB.js";
import { JobModel } from "../models/JobModel.js";

export class JobDB {
    static storeName = "Bewerbungsmanager";

    constructor() {
        this.ready = LocalDB.use(JobDB.storeName);
    }

    // Wählt den Object Store erneut aus, falls LocalDB zwischenzeitlich für einen
    // anderen Store verwendet wurde. So bleibt der Store für jede Operation zuverlässig verfügbar.
    async ensureStore() {
        await this.ready;
        if (LocalDB.storeName !== JobDB.storeName) {
            await LocalDB.use(JobDB.storeName);
        }    
    }

    async save(jobModel) {
        await this.ensureStore();
        return LocalDB.updateOrAdd(jobModel.data);
    }

    async get(id) {
        await this.ensureStore();
        const raw = await LocalDB.get(id);
        if (!raw) return null;

        const job = new JobModel();
        job.data = raw;
        return job;
    }
}
