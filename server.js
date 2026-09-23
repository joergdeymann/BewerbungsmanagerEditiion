// server.js
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Klassen-Imports
import { StaticFileHandler } from "./server/StaticFileHandler.js";
import { ProxyHandler } from "./server/ProxyHandler.js";
import { DocumentHandler } from "./server/DocumentHandler.js";

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Instanziierung der Klassen
const staticFileHandler = new StaticFileHandler(__dirname, PORT);
const proxyHandler = new ProxyHandler();
const documentHandler = new DocumentHandler(__dirname);

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const pathname = url.pathname;
        const method = req.method.toUpperCase();

        // 1. API-Routing
        if (pathname === "/api/fetch-url" && method === "GET") {
            await proxyHandler.handleFetchUrl(req, res, url);
            return;
        }

        if (pathname === "/api/upload" && method === "POST") {
            await documentHandler.handleUploadDocument(req, res);
            return;
        }

        if (pathname === "/api/delete" && method === "DELETE") {
            await documentHandler.handleDeleteDocument(req, res, url);
            return;
        }

        // 2. Fallback: Statische Dateien ausliefern
        const handled = await staticFileHandler.serveStaticFile(req, res);
        
        // Falls die Datei nicht gefunden wurde und kein anderer Handler gegriffen hat
        if (!handled) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 - Seite oder Datei nicht gefunden");
        }

    } catch(error)
    {
        console.error("Unbehandelter Fehler im Request-Handler:", error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "Interner Serverfehler." }));
        } else {
            res.end();
        }        
    }
});

server.listen(PORT, () => {
    console.log(`Server läuft erfolgreich auf http://localhost:${PORT}`);
});
