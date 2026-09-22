// server/ProxyHandler.js
import { Logger } from "./Logger.js";

export class ProxyHandler {
    async handleFetchUrl(req, res, url) {
        const target = url.searchParams.get("url");

        if (!target || !/^https?:\/\//i.test(target)) {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "Ungültige oder fehlende URL." }));
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(target, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; Bewerbungsmanager/1.0)"
                }
            });

            const html = await response.text();

            res.writeHead(response.ok ? 200 : response.status, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            res.end(html);

        } catch (error) {
            const timedOut = error.name === "AbortError";
            const code = error.cause?.code;
            const unreachable = code === "ENOTFOUND" || code === "ECONNREFUSED" || code === "EAI_AGAIN";
            
            // Non-blocking Logger
            Logger.logError("ProxyHandler", error);

            let message = "Die URL konnte nicht abgerufen werden.";
            if (timedOut) {
                message = "Zeitüberschreitung beim Abrufen der URL (Ziel-Server antwortet nicht).";
            } else if (unreachable) {
                message = "Der Ziel-Server ist nicht erreichbar (Domain ungültig oder Server down).";
            }

            res.writeHead(timedOut ? 504 : 502, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: message }));
        } finally {
            clearTimeout(timeout);
        }
    }
}
