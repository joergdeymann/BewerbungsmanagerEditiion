// server/DocumentHandler.js
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { Logger } from "./Logger.js";
import { FileConstants } from "../shared/FileConstants.js";

export class DocumentHandler {

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

        const contentLength = Number(req.headers["content-length"]);
        if (Number.isFinite(contentLength) && contentLength > FileConstants.MAX_UPLOAD_SIZE) {
            res.writeHead(413, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: `Datei zu groß. Maximal zulässig sind ${FileConstants.MAX_UPLOAD_SIZE_MB} MB.` }));
            return;
        }

        try {
            const chunks = [];
            let currentSize = 0;
            let tooLarge = false;

            // Fallback, falls Content-Length fehlt (z.B. chunked encoding) oder gefälscht war
            for await (const chunk of req) {
                currentSize += chunk.length;

                if (currentSize > FileConstants.MAX_UPLOAD_SIZE) {
                    tooLarge = true;
                    continue;
                }

                chunks.push(chunk);
            }

            if (tooLarge) {
                res.writeHead(413, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify({ error: `Datei zu groß. Maximal zulässig sind ${FileConstants.MAX_UPLOAD_SIZE_MB} MB.` }));
                return;
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

    /**
     * Prüft rein, ob eine Datei existiert (analog zu File.Exists) -
     * antwortet immer mit 200, das Ergebnis steckt im Body, nicht im Status-Code.
     */
    async handleCheckDocument(req, res, url) {
        const link = url.searchParams.get("link") || "";
        const filePath = path.resolve(this.documentsDir, link.replace(/^\/documents\//, ""));

        if (!filePath.startsWith(this.documentsDir)) {
            res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "403 - Zugriff verweigert" }));
            return;
        }

        let exists = false;
        try {
            await fs.access(filePath);
            exists = true;
        } catch {
            exists = false;
        }

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ exists }));
    }    
}
