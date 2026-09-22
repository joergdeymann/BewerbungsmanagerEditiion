import { AppDB } from "../js/store/AppDB.js";
import { AppModel } from "../js/models/AppModel.js";
import { LocalDB } from "../js/store/LocalDB.js";

async function clearAll() {
    const db = new AppDB();
    await db.ensureStore();

    const existing = await LocalDB.get();
    for (const raw of existing) {
        await LocalDB.delete(raw.id);
    }

    return existing.length;
}

export async function seed() {
    const removed = await clearAll();

    const response = await fetch("/teststore/Jobsinput.json");
    const data = await response.json();

    const db = new AppDB();
    for (const record of data.app) {
        const app = new AppModel();
        app.data = record;
        await db.save(app);
    }

    return `${removed} alte Datensätze gelöscht, ${data.app.length} Testdatensätze gespeichert.`;
}

export async function clear() {
    const removed = await clearAll();
    return `${removed} Datensätze gelöscht.`;
}

export async function backup() {
    const db = new AppDB();
    await db.ensureStore();

    const records = await LocalDB.get();

    const blob = new Blob(
        [JSON.stringify({ app: records }, null, 4)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    link.href = url;
    link.download = `bewerbungsmanager-backup-${timestamp}.json`;
    link.click();

    URL.revokeObjectURL(url);

    return `${records.length} Datensätze als Backup heruntergeladen.`;
}