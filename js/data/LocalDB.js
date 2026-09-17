export class LocalDB {
    static databaseName = "BewerbungsmanagerDB";
    static storeName = null;
    static db = null;

    // IndexedDB arbeitet ereignisbasiert, deshalb werden alle Requests in Promises gekapselt.
    static request(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    static async open() {
        if (LocalDB.db) return LocalDB.db;

        LocalDB.db = await LocalDB.request(indexedDB.open(LocalDB.databaseName));
        return LocalDB.db;
    }

    static async create(name) {
        const db = await LocalDB.open();

        if (db.objectStoreNames.contains(name)) {
            LocalDB.storeName = name;
            return;
        }

        // Ein Object Store kann nur in einer versionchange-Transaktion angelegt werden.
        const version = db.version + 1;
        db.close();
        LocalDB.db = null;

        const openRequest = indexedDB.open(LocalDB.databaseName, version);
        openRequest.onupgradeneeded = () => {
            const store = openRequest.result.createObjectStore(name, { keyPath: "id" });
            store.createIndex("id", "id", { unique: true });
        };

        LocalDB.db = await LocalDB.request(openRequest);
        LocalDB.storeName = name;
    }

    static async use(name) {
        const db = await LocalDB.open();

        if (!db.objectStoreNames.contains(name)) {
            throw new Error(`Object Store "${name}" ist nicht vorhanden.`);
        }

        LocalDB.storeName = name;
    }

    static async store(mode) {
        const db = await LocalDB.open();

        if (!LocalDB.storeName) {
            throw new Error("Es wurde kein Object Store ausgewählt.");
        }

        return db.transaction(LocalDB.storeName, mode).objectStore(LocalDB.storeName);
    }

    static async add(json) {
        json.id = crypto.randomUUID();

        const store = await LocalDB.store("readwrite");
        await LocalDB.request(store.add(json));
        return json.id;
    }

    static async update(json) {
        const store = await LocalDB.store("readwrite");
        await LocalDB.request(store.put(json));
        return json.id;
    }

    static async updateOrAdd(json) {
        // null, undefined und 0 gelten hier als fehlende ID.
        if (!json.id) return LocalDB.add(json);

        const existing = await LocalDB.get(json.id);
        if (!existing) return LocalDB.add(json);

        return LocalDB.update(json);
    }

    static async delete(id) {
        const store = await LocalDB.store("readwrite");
        await LocalDB.request(store.delete(id));
    }

    static async get(id = null) {
        const store = await LocalDB.store("readonly");

        // Nur null und undefined gelten als fehlende ID, 0 ist eine gültige ID.
        if (id === null || id === undefined) return LocalDB.request(store.getAll());

        return LocalDB.request(store.get(id));
    }
}
