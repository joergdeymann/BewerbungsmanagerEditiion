import { LocalDB } from "./LocalDB.js";
import { AppModel } from "../models/AppModel.js";

export class AppDB {
    static storeName = "Bewerbungsmanager";

    constructor() {
        this.ready = LocalDB.use(AppDB.storeName);
    }

    // Wählt den Object Store erneut aus, falls LocalDB zwischenzeitlich für einen
    // anderen Store verwendet wurde. So bleibt der Store für jede Operation zuverlässig verfügbar.
    async ensureStore() {
        await this.ready;
        if (LocalDB.storeName !== AppDB.storeName) {
            await LocalDB.use(AppDB.storeName);
        }
    }

    async save(appModel) {
        await this.ensureStore();
        return LocalDB.updateOrAdd(appModel.data);
    }

    async get(id) {
        await this.ensureStore();
        const raw = await LocalDB.get(id);
        if (!raw) return null;

        const app = new AppModel();
        app.data = raw;
        return app;
    }
}
