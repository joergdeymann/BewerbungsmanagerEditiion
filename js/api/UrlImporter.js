import { ImportJobPage } from "../io/ImportJobPage.js";
import { BrowserConstants } from "../../shared/BrowserConstants.js";

export class UrlImporter {

    constructor() {
        this.page = new ImportJobPage();
    }

    /**
     * Ruft die Seite über den lokalen Server ab und extrahiert die Anzeige. Adressen, die eine
     * Anmeldung verlangen (LinkedIn), lädt der Server in einem echten Chrome (BrowserSession),
     * alle anderen per einfachem Abruf.
     */
    async fetch(url) {
        const html = UrlImporter.usesBrowser(url)
            ? await this.getHtml(url, BrowserConstants.API_PATH)
            : await this.getHtml(url);
        return this.fromHtml(html, url);
    }

    /**
     * @param {string} url Adresse der Seite.
     * @returns {boolean} true, wenn die Seite über den Browser des Servers geladen wird.
     */
    static usesBrowser(url) {
        try {
            return BrowserConstants.HOST_REGEX.test(new URL(url).hostname);
        } catch {
            return false;
        }
    }

    /** Extrahiert die Anzeige aus bereits vorliegendem HTML (z. B. vom Bookmarklet). */
    fromHtml(html, url) {
        return { html, ...this.page.extract(html, url) };
    }

    async getHtml(url, endpoint = "/api/fetch-url") {
        let response;
        try {
            response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`);
        } catch (error) {
            console.error(`Abruf fehlgeschlagen (${endpoint}):`, error);
            throw new Error(
                `Der lokale Server ist nicht erreichbar (${error.message}). Läuft "node server.js"?`
            );
        }

        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
            const body = contentType.includes("application/json")
                ? (await response.json()).error
                : `HTTP-Fehler ${response.status}`;
            throw new Error(body || `HTTP-Fehler ${response.status}`);
        }

        return await response.text();
    }
}
