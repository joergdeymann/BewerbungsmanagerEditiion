import { AppDB } from "../store/AppDB.js";

// IndexedDB ist asynchron, Overview greift aber synchron auf getAll()/getById() zu.
// Deshalb: einmal beim Start laden, danach aus dem Speicher-Array bedienen.
export class AppCache {
    constructor(skillCache = null) {
        this.db = new AppDB();
        this.applications = [];
        this.skillCache = skillCache;
    }

    async load() {
        this.applications = await this.db.getAll();
    }

    getAll() {
        return this.applications;
    }

    getById(id) {
        return this.applications.find(app => app.id === id);
    }

    async save(application) {
        const id = await this.db.save(application);
        application.id = id;

        const index = this.applications.findIndex(app => app.id === id);
        if (index === -1) {
            this.applications.push(application);
        } else {
            this.applications[index] = application;
        }

        if (this.skillCache) {
            await this.skillCache.syncFromApplication(application);
        }

        return id;
    }

    async delete(id) {
        await this.db.delete(id);
        this.applications = this.applications.filter(app => app.id !== id);
    }
}
