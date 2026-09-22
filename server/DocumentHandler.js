// server/DocumentHandler.js
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { Logger } from "./Logger.js";

export class DocumentHandler {
    // 10 MB in Bytes (10 * 1024 * 1024)
    static #MAX_FILE_SIZE = 10485760; 

    constructor(baseDir) {
        this.baseDir = baseDir;
        this.documentsDir = path.join(this.baseDir, "documents");
    }

    /**
     * Datei-Upload: Prüft die Dateigröße während des Datenstroms (Streaming).
     */
    async handleUploadDocument(req, res) {
        const originalNameHeader = req.headers["x-original-filename"] || "";
        const originalName = decodeURIComponent(originalNameHeader);

        if (!originalName) {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "Kein Dateiname übergeben (X-Original-Filename)." }));
            return;
        }

        try {
            const chunks = [];
            let currentSize = 0;

            for await (const chunk of req) {
                currentSize += chunk.length;
                
                // Sofortiger Abbruch, wenn die Datei zu groß wird
                if (currentSize > DocumentHandler.#MAX_FILE_SIZE) {
                    res.writeHead(413, { "Content-Type": "application/json; charset=utf-8" });
                    res.end(JSON.stringify({ error: "Datei zu groß. Maximal zulässig sind 10 MB." }));
                    return;
                }
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            const extension = path.extname(originalName);
            const storedName = crypto.randomUUID() + extension;

            await fs.mkdir(this.documentsDir, { recursive: true });
            await fs.writeFile(path.join(this.documentsDir, storedName), buffer);

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({
                link: `/documents/${storedName}`,
                originalName
            }));

        } catch (error) {
            Logger.logError("DocumentHandler.handleUploadDocument", error);

            const accessDenied = error.code === "EACCES" || error.code === "EPERM";
            const message = accessDenied
                ? "Zugriff verweigert - der Zielordner ist schreibgeschützt."
                : "Datei konnte nicht gespeichert werden.";

            res.writeHead(accessDenied ? 403 : 500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: message }));
        }
    }

    /**
     * Löscht eine zuvor hochgeladene Datei wieder aus /documents.
     */
    async handleDeleteDocument(req, res, url) {
        const link = url.searchParams.get("link") || "";
        const filePath = path.resolve(this.documentsDir, link.replace(/^\/documents\//, ""));

        // Sicherheit: darf nur innerhalb von /documents liegen
        if (!filePath.startsWith(this.documentsDir)) {
            res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "403 - Zugriff verweigert" }));
            return;
        }

        try {
            await fs.unlink(filePath);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ success: true, message: "Datei erfolgreich gelöscht." }));
        } catch (error) {
            if (error.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify({ error: "Datei nicht gefunden." }));
            } else {
                Logger.logError("DocumentHandler.handleDeleteDocument", error);
                res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify({ error: "Fehler beim Löschen der Datei." }));
            }
        }
    }
}
