import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Liefert eine statische Datei aus dem Projekt aus.
 */
async function serveStaticFile(req, res) {

    try {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const requestedPath = decodeURIComponent(url.pathname);

        // Führende "/" entfernen
        const relativePath = requestedPath.replace(/^\/+/, "");

        // Dateipfad erzeugen
        const filePath = path.resolve(__dirname, relativePath);

        // Sicherheit:
        // Datei muss innerhalb des Projektverzeichnisses liegen
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403);
            res.end("403 - Zugriff verweigert");
            return true;
        }

        const stats = await fs.stat(filePath);

        // Verzeichnis ohne Dateinamen (z.B. "/admin/") -> index.html darin verwenden
        const resolvedPath = stats.isDirectory()
            ? path.join(filePath, "index.html")
            : filePath;

        const file = await fs.readFile(resolvedPath);

        const contentType = getContentType(resolvedPath);

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(file);

        return true;

    } catch (error) {

        if (error.code === "ENOENT" || error.code === "EISDIR") {
            return false;
        }

        console.error(error);

        res.writeHead(500);
        res.end("500 - Interner Serverfehler");

        return true;
    }
}


/**
 * Ermittelt den MIME-Type anhand der Dateiendung.
 */
function getContentType(filePath) {

    const extension = path.extname(filePath).toLowerCase();

    const types = {
        // Web Core
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",

        // Bilder & Icons
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".ico": "image/x-icon",
        ".webp": "image/webp",

        // Dokumente (PDF & Microsoft Office)
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".ppt": "application/vnd.ms-powerpoint",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",

        // Dokumente (OpenDocument / LibreOffice / OpenOffice)
        ".odt": "application/vnd.oasis.opendocument.text",
        ".ods": "application/vnd.oasis.opendocument.spreadsheet",
        ".odp": "application/vnd.oasis.opendocument.presentation",

        // Text & Tabellendaten
        ".txt": "text/plain; charset=utf-8",
        ".csv": "text/csv; charset=utf-8",
        ".rtf": "application/rtf",

        // Archive / Komprimiert
        ".zip": "application/zip",
        ".rar": "application/x-rar-compressed",
        ".7z": "application/x-7z-compressed",
        ".tar": "application/x-tar",
        ".gz": "application/gzip",

        // Audio
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".ogg": "audio/ogg",
        ".m4a": "audio/x-m4a",

        // Video
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".avi": "video/x-msvideo",

        // Webfonts
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject"
    };

    return types[extension] ?? "application/octet-stream";
}


/**
 * Proxy-Endpunkt: ruft eine fremde URL serverseitig ab und gibt das
 * HTML zurück. Notwendig, weil der Browser fremde Domains wegen CORS
 * nicht direkt per fetch() lesen darf - der Server hat dieses
 * Problem nicht.
 */
async function handleFetchUrl(req, res, url) {
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
                // Manche Seiten liefern ohne "echten" Browser-User-Agent
                // stark eingeschränkte/andere HTML-Varianten aus.
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
        console.error(error);

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


/**
 * Datei-Upload: rohe Bytes im Body, Originalname im Header.
 * Speichert unter /documents/<GUID>.<endung>, damit Namen nie kollidieren.
 */
async function handleUploadDocument(req, res) {
    const originalNameHeader = req.headers["x-original-filename"] || "";
    const originalName = decodeURIComponent(originalNameHeader);

    if (!originalName) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Kein Dateiname übergeben (X-Original-Filename)." }));
        return;
    }

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const extension = path.extname(originalName);
        const storedName = crypto.randomUUID() + extension;
        const documentsDir = path.join(__dirname, "documents");

        await fs.mkdir(documentsDir, { recursive: true });
        await fs.writeFile(path.join(documentsDir, storedName), buffer);

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
            link: `/documents/${storedName}`,
            originalName
        }));

    } catch (error) {
        console.error(error);

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
async function handleDeleteDocument(req, res, url) {
    const link = url.searchParams.get("link") || "";
    const documentsDir = path.join(__dirname, "documents");
    const filePath = path.resolve(documentsDir, link.replace(/^\/documents\//, ""));

    // Sicherheit: darf nur innerhalb von /documents liegen
    if (!filePath.startsWith(documentsDir)) {
        res.writeHead(403);
        res.end("403 - Zugriff verweigert");
        return;
    }

    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error(error);
        }
    }

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true }));
}


/**
 * HTTP-Server
 */
const server = http.createServer(async (req, res) => {

    const requestUrl = new URL(req.url, `http://localhost:${PORT}`);

    // Proxy für externe Seiten (siehe ParseUrl.js)
    if (requestUrl.pathname === "/api/fetch-url") {
        await handleFetchUrl(req, res, requestUrl);
        return;
    }

    if (requestUrl.pathname === "/api/upload-document" && req.method === "POST") {
        await handleUploadDocument(req, res);
        return;
    }

    if (requestUrl.pathname === "/api/delete-document" && req.method === "DELETE") {
        await handleDeleteDocument(req, res, requestUrl);
        return;
    }

    // Startseite (auch mit Query-String, z.B. /?importUrl=... vom Bookmarklet)
    if (requestUrl.pathname === "/") {

        const filePath = path.join(__dirname, "index.html");

        try {

            const html = await fs.readFile(filePath, "utf8");

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(html);

        } catch (error) {

            console.error(error);

            res.writeHead(500, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            res.end("Fehler beim Laden der index.html");
        }

        return;
    }


    // Statische Dateien
    const served = await serveStaticFile(req, res);

    if (served) {
        return;
    }


    // Nicht gefunden
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("404 - Nicht gefunden");
});


server.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});