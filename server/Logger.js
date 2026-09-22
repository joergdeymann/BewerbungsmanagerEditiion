// server/Logger.js
import fs from "node:fs/promises";
import path from "node:path";

export class Logger {
    static #logFile = path.resolve(process.cwd(), "error.log");

    /**
     * Schreibt einen Fehler asynchron in die Log-Datei und gibt ihn in der Konsole aus.
     * @param {string} context - Wo der Fehler auftrat (z.B. 'Upload')
     * @param {Error|string} error - Das Fehlerobjekt oder die Nachricht
     */
    static async logError(context, error) {
        const timestamp = new Date().toISOString();
        const errorMessage = error instanceof Error ? error.stack : error;
        const logEntry = `[${timestamp}] [ERROR] [${context}]: ${errorMessage}\n\n`;

        // In Konsole ausgeben
        // console.error(`[${context}]`, error);

        // In Datei anhängen (wird erstellt falls nicht vorhanden)
        try {
            await fs.appendFile(this.#logFile, logEntry, "utf-8");
        } catch (fail) {
            console.error("Kritischer Fehler: Log-Datei konnte nicht geschrieben werden!", fail);
        }
    }
}
