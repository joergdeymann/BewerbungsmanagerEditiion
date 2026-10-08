// server/BrowserHandler.js
import { Logger } from "./Logger.js";
import { BrowserConstants } from "../shared/BrowserConstants.js";

/**
 * Route /api/browser-fetch?url=...: laedt eine Seite in einem echten Chrome (BrowserSession)
 * und liefert das HTML der fertig aufgebauten Seite.
 */
export class BrowserHandler {

    /**
     * @param {import("./BrowserSession.js").BrowserSession} session
     */
    constructor(session) {
        this.session = session;
    }

    async handleBrowserFetch(req, res, url) {
        // Nur Aufrufe der eigenen Seite (Browser setzen diesen Header, fremde Webseiten koennen ihn nicht aendern).
        const site = req.headers["sec-fetch-site"];
        if (site && site !== "same-origin" && site !== "none") {
            this.sendError(res, 403, "Anfrage nicht erlaubt.");
            return;
        }

        const target = this.parseTarget(url.searchParams.get("url"));
        if (!target) {
            this.sendError(res, 400, "Ungültige oder nicht erlaubte URL (nur LinkedIn-Adressen).");
            return;
        }

        try {
            const page = await this.session.loadPage(target);
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end(page.html);
        } catch (error) {
            Logger.logError("BrowserHandler", error);
            this.sendError(res, error.status ?? 502, error.message || "Der Browser-Abruf ist fehlgeschlagen.");
        }
    }

    /** Route /api/browser-status: Zustand fuer die Fehlersuche (gefundener Browser, Port, Node-Version). */
    async handleBrowserStatus(req, res) {
        const site = req.headers["sec-fetch-site"];
        if (site && site !== "same-origin" && site !== "none") {
            this.sendError(res, 403, "Anfrage nicht erlaubt.");
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(await this.session.status(), null, 2));
    }

    /** @returns {string|null} Die URL, wenn sie http(s) ist und zu einem erlaubten Host gehoert. */
    parseTarget(value) {
        try {
            const target = new URL(value);
            const allowed = /^https?:$/.test(target.protocol) && BrowserConstants.HOST_REGEX.test(target.hostname);
            return allowed ? target.href : null;
        } catch {
            return null;
        }
    }

    sendError(res, status, message) {
        res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: message }));
    }
}
