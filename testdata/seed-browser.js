import { AppDB } from "../js/store/AppDB.js";
import { AppModel } from "../js/models/AppModel.js";
import { LocalDB } from "../js/store/LocalDB.js";

// Im Browser-Devtools-Konsole aufrufen:
//   import("/teststore/seed-browser.js").then(m => m.seedFromTestdata());
export async function seedFromTestdata() {
    const db = new AppDB();
    await db.ensureStore();

    // Alte Datensätze entfernen, damit keine Reste aus früheren Läufen (z. B. mit
    // inzwischen geänderten Statuswerten) liegen bleiben.
    const existing = await LocalDB.get();
    for (const raw of existing) {
        await LocalDB.delete(raw.id);
    }

    const response = await fetch("/testdata/Jobsinput.json");
    const data = await response.json();

    for (const record of data.app) {
        const app = new AppModel();
        app.data = record;
        await db.save(app);
    }

    console.log(`${existing.length} alte Datensätze gelöscht, ${data.app.length} Testdatensätze gespeichert.`);
}
