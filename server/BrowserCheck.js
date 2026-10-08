// server/BrowserCheck.js
// Prueft den Browser-Abruf ohne die App:  npm run browser:check  [-- <url>]
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BrowserSession } from "./BrowserSession.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const url = process.argv[2] || "https://www.linkedin.com/company/inside-m2m-gmbh/about/";
const session = new BrowserSession(root, { log: message => console.log(`[Browser] ${message}`) });

console.log("--- Zustand");
console.log(JSON.stringify(await session.status(), null, 2));

console.log(`--- Abruf: ${url}`);
try {
    const page = await session.loadPage(url);
    await writeFile(path.join(root, "browser-check.html"), page.html, "utf8");
    await writeFile(path.join(root, "browser-check.txt"), page.text, "utf8");
    console.log(`--- Ergebnis: ${page.text.length} Zeichen sichtbarer Text, ${page.html.length} Zeichen HTML`);
    console.log("    gespeichert in browser-check.txt (Text) und browser-check.html (für den Import)");
    console.log(page.text.replace(/\s+/g, " ").slice(0, 600));
} catch (error) {
    console.log(`--- FEHLER (${error.code ?? "?"}): ${error.message}`);
    process.exitCode = 1;
} finally {
    await session.stop();
}
