// server/StaticFileHandler.js
import fs from "node:fs/promises";
import path from "node:path";
import { MimeTypes } from "./MimeTypes.js";
import { Logger } from "./Logger.js";

export class StaticFileHandler {
    constructor(baseDir, port) {
        this.baseDir = baseDir;
        this.port = port;
    }

    async serveStaticFile(req, res) {
        try {
            const url = new URL(req.url, `http://localhost:${this.port}`);
            const requestedPath = decodeURIComponent(url.pathname);
            const relativePath = requestedPath.replace(/^\/+/, "");
            const filePath = path.resolve(this.baseDir, relativePath);

            if (!filePath.startsWith(this.baseDir)) {
                res.writeHead(403);
                res.end("403 - Zugriff verweigert");
                return true;
            }

            const stats = await fs.stat(filePath);
            const resolvedPath = stats.isDirectory()
                ? path.join(filePath, "index.html")
                : filePath;

            const file = await fs.readFile(resolvedPath);
            const contentType = MimeTypes.getContentType(resolvedPath);

            res.writeHead(200, { "Content-Type": contentType });
            res.end(file);
            return true;

        } catch (error) {
            if (error.code === "ENOENT" || error.code === "EISDIR") {
                return false;
            }

            // Non-blocking Logger
            Logger.logError("StaticFileHandler", error);
            
            res.writeHead(500);
            res.end("500 - Interner Serverfehler");
            return true;
        }
    }
}
