import { LocalDB } from "./LocalDB.js";
import { AppDB } from "./AppDB.js";
import { SkillListModel } from "../models/SkillListModel.js";

export class SkillDB {

    // Nutzt denselben Object Store wie AppDB.
    async ensureStore() {
        if (LocalDB.storeName !== AppDB.storeName) {
            await LocalDB.create(AppDB.storeName);
        }
    }

    async get() {
        await this.ensureStore();
        const raw = await LocalDB.get(SkillListModel.GLOBAL_ID);

        const list = new SkillListModel();
        if (raw) list.data = raw;
        return list;
    }

    async save(skillListModel) {
        await this.ensureStore();
        return LocalDB.update(skillListModel.data);
    }
}