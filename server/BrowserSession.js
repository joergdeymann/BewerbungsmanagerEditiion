// server/BrowserSession.js
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { CdpClient } from "./CdpClient.js";
import { BrowserConstants } from "../shared/BrowserConstants.js";
import { stateScript, clickScript, readScript } from "./BrowserScripts.js";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Fehler mit Code und HTTP-Status fuer die Antwort an die App. */
export class BrowserError extends Error {
    constructor(code, message, status = 502) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

const call = (fn, ...args) => `(${fn})(${args.map(arg => JSON.stringify(arg)).join(",")})`;

/**
 * Laedt Seiten in einem echten Chrome, das der Server bei Bedarf mit festem Profil startet.
 * Die Anmeldung des Benutzers (z. B. bei LinkedIn) bleibt im Profil erhalten; Zugangsdaten
 * verarbeitet der Server nicht. Ist eine Anmeldung noetig, bleibt der Tab sichtbar, bis der
 * Benutzer sie im Chrome-Fenster erledigt hat. Jeder Abruf nutzt einen eigenen Tab, der danach
 * geschlossen wird; ein vom Server gestarteter Chrome wird nach kurzer Ruhezeit beendet.
 */
export class BrowserSession {

    /**
     * @param {string} rootDir Projektordner (das Profil liegt darin).
     * @param {{port?: number, executable?: string|null, log?: (message: string) => void}} [options]
     *        executable ueberschreibt die Suche nach Chrome; log erhaelt jeden Schritt als Text.
     */
    constructor(rootDir, { port = BrowserConstants.CDP_PORT, executable = null, log = () => {} } = {}) {
        this.log = log;
        this.rootDir = rootDir;
        this.port = port;
        this.executable = executable;
        this.profile = path.join(rootDir, BrowserConstants.PROFILE_DIR);
        this.child = null;
        this.queue = Promise.resolve();
        this.idleTimer = null;
    }

    /**
     * Laedt die Seite und liefert ihr HTML nach Cookie-Zustimmung und Aufklappen.
     * Abrufe laufen nacheinander.
     * @param {string} url Adresse der Seite.
     * @returns {Promise<{html: string, url: string, title: string}>}
     * @throws {BrowserError}
     */
    loadPage(url) {
        const run = this.queue.then(() => this.load(url));
        this.queue = run.catch(() => {});
        return run;
    }

    async load(url) {
        clearTimeout(this.idleTimer);

        try {
            await this.ensureBrowser();
            return await this.readTab(url);
        } finally {
            this.scheduleIdleClose();
        }
    }

    // ---------- Browser starten und beenden ----------

    async isUp() {
        try {
            const response = await fetch(`http://127.0.0.1:${this.port}/json/version`, { signal: AbortSignal.timeout(1500) });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Zustand fuer die Fehlersuche: gefundener Browser, Port, Profil.
     * @returns {Promise<object>}
     */
    async status() {
        let executable = null;
        let executableError = null;
        try {
            executable = this.findBrowser();
        } catch (error) {
            executableError = error.message;
        }

        return {
            platform: process.platform,
            node: process.version,
            webSocket: typeof WebSocket !== "undefined",
            executable,
            executableError,
            chromePathVariable: process.env.CHROME_PATH || null,
            port: this.port,
            portInUse: await this.isUp(),
            profile: this.profile,
            startedByServer: !!this.child
        };
    }

    async ensureBrowser() {
        if (await this.isUp()) {
            this.log(`Port ${this.port} antwortet bereits: vorhandener Chrome wird genutzt.`);
            return;
        }

        const executable = this.findBrowser();
        this.log(`Starte ${executable} (Profil ${this.profile}) ...`);
        const startedAt = Date.now();
        const args = [
            `--remote-debugging-port=${this.port}`,
            `--user-data-dir=${this.profile}`,
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-gpu",
            "about:blank"
        ];

        if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0) {
            args.push("--no-sandbox");
        }

        let startError = null;
        this.child = spawn(executable, args, { stdio: "ignore", windowsHide: false });
        this.child.on("error", error => { startError = error; });
        this.child.on("exit", () => { this.child = null; });

        const deadline = Date.now() + BrowserConstants.START_TIMEOUT_MS;
        while (Date.now() < deadline) {
            if (await this.isUp()) {
                this.log(`Chrome bereit nach ${Date.now() - startedAt} ms.`);
                return;
            }
            if (startError) break;
            await sleep(400);
        }

        this.log(`Chrome meldet sich nicht auf Port ${this.port}${startError ? " (" + startError.message + ")" : ""}.`);
        throw new BrowserError(
            "BROWSER_START",
            `Chrome konnte nicht gestartet werden (${startError?.message ?? "keine Antwort auf Port " + this.port}).`,
            503
        );
    }

    findBrowser() {
        if (this.executable) return this.executable;
        if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;

        const env = process.env;
        const candidates = {
            win32: [
                [env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"],
                [env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"],
                [env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"],
                [env.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"],
                [env["PROGRAMFILES(X86)"], "Microsoft", "Edge", "Application", "msedge.exe"]
            ].filter(parts => parts[0]).map(parts => path.join(...parts)),
            darwin: [
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                "/Applications/Chromium.app/Contents/MacOS/Chromium",
                "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
            ]
        }[process.platform];

        if (candidates) {
            const found = candidates.find(existsSync);
            if (found) return found;
        } else {
            const names = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"];
            const dirs = (env.PATH || "").split(path.delimiter);
            for (const name of names) {
                const hit = dirs.map(dir => path.join(dir, name)).find(existsSync);
                if (hit) return hit;
            }
        }

        throw new BrowserError(
            "BROWSER_NOT_FOUND",
            "Kein Google Chrome oder Microsoft Edge gefunden. Setze die Umgebungsvariable CHROME_PATH auf die EXE des Browsers.",
            503
        );
    }

    scheduleIdleClose() {
        clearTimeout(this.idleTimer);
        if (!this.child) return;

        this.idleTimer = setTimeout(() => this.stop(), BrowserConstants.IDLE_CLOSE_MS);
        this.idleTimer.unref?.();
    }

    /** Beendet einen vom Server gestarteten Chrome (ein schon vorher laufender bleibt unberuehrt). */
    async stop() {
        clearTimeout(this.idleTimer);
        const child = this.child;
        if (!child) return;

        try {
            const info = await (await fetch(`http://127.0.0.1:${this.port}/json/version`, { signal: AbortSignal.timeout(1500) })).json();
            const cdp = new CdpClient(info.webSocketDebuggerUrl);
            await cdp.connect();
            cdp.send("Browser.close").catch(() => {});
            await sleep(500);
            cdp.close();
        } catch { /* wird unten beendet */ }

        try { child.kill(); } catch { /* bereits beendet */ }
        this.child = null;
    }

    /** Sofortiges, synchrones Beenden (Prozessende des Servers). */
    killNow() {
        try { this.child?.kill(); } catch { /* bereits beendet */ }
    }

    // ---------- Tab nutzen ----------

    async json(endpoint, options) {
        const response = await fetch(`http://127.0.0.1:${this.port}${endpoint}`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${endpoint}`);
        return response;
    }

    async createTab() {
        // Chrome verlangt bei /json/new eine PUT-Anfrage (aeltere Versionen GET).
        try {
            return await (await this.json("/json/new?about:blank", { method: "PUT" })).json();
        } catch {
            return await (await this.json("/json/new?about:blank")).json();
        }
    }

    async closeTab(id) {
        try { await this.json(`/json/close/${id}`); } catch { /* Tab ist schon weg */ }
    }

    async activateTab(id) {
        try { await this.json(`/json/activate/${id}`); } catch { /* nicht kritisch */ }
    }

    async evaluate(cdp, expression) {
        const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
        if (result.exceptionDetails) {
            throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Skript fehlgeschlagen.");
        }
        return result.result?.value;
    }

    describeState(state) {
        const reason = state.why ? `, Grund: ${state.why}` : "";
        return `Anmeldung=${state.login}, Captcha=${state.captcha}, gesperrt=${state.blocked}, Text=${state.textLength} Zeichen, URL=${state.url}${reason}`;
    }

    async readTab(url) {
        this.log(`Lade ${url}`);
        let tab;
        try {
            tab = await this.createTab();
            this.log(`Tab ${tab.id} geöffnet.`);
        } catch (error) {
            this.log(`Tab konnte nicht geöffnet werden: ${error.message}`);
            throw new BrowserError("TAB", `Es konnte kein Browser-Tab geöffnet werden (${error.message}).`);
        }

        const cdp = new CdpClient(tab.webSocketDebuggerUrl);
        try {
            await cdp.connect();
            await cdp.send("Page.enable");

            await this.navigate(cdp, url);
            let state = await this.settle(cdp);
            this.log(`Seite geladen: ${this.describeState(state)}`);

            if (state.login || state.captcha) {
                this.log("Anmeldung nötig: Tab wird in den Vordergrund geholt, bitte im Chrome-Fenster anmelden ...");
                await this.activateTab(tab.id);
                await this.waitForSignIn(cdp);

                this.log("Angemeldet, lade die Seite erneut ...");
                await this.navigate(cdp, url);
                state = await this.settle(cdp);
                this.log(`Seite geladen: ${this.describeState(state)}`);
                if (state.login || state.captcha) {
                    throw new BrowserError("LOGIN", "Die Anmeldung wurde nicht abgeschlossen.", 401);
                }
            }

            if (state.blocked) {
                throw new BrowserError("BLOCKED", "Die Seite blockiert den Zugriff (ungewöhnliche Aktivität erkannt).", 403);
            }

            const page = await this.evaluate(cdp, call(readScript));
            this.log(`Gelesen: ${page.text.length} Zeichen sichtbarer Text, ${page.html.length} Zeichen HTML.`);
            return page;
        } catch (error) {
            this.log(`Fehler: ${error.message}`);
            if (error instanceof BrowserError) throw error;
            throw new BrowserError("BROWSER", `Browser-Abruf fehlgeschlagen: ${error.message}`);
        } finally {
            cdp.close();
            await this.closeTab(tab.id);
            this.log("Tab geschlossen.");
        }
    }

    async navigate(cdp, url) {
        const loaded = cdp.once("Page.loadEventFired", BrowserConstants.PAGE_TIMEOUT_MS).catch(() => null);
        const result = await cdp.send("Page.navigate", { url });

        if (result.errorText) {
            throw new BrowserError("NAVIGATION", `Die Seite konnte nicht geladen werden (${result.errorText}).`);
        }
        await loaded;
    }

    /** Bestaetigt Cookie-Abfragen, klappt "mehr" auf und wartet, bis der Text sich nicht mehr aendert. */
    async settle(cdp) {
        const started = Date.now();
        let last = -1;
        let stable = 0;
        let walls = 0;
        let state = null;

        while (Date.now() - started < BrowserConstants.SETTLE_MAX_MS) {
            await sleep(BrowserConstants.SETTLE_STEP_MS);

            state = await this.evaluate(cdp, call(stateScript));

            // Anmeldung/Captcha erst melden, wenn es zweimal hintereinander gemessen wird (Weiterleitungen).
            walls = (state.login || state.captcha) ? walls + 1 : 0;
            if (walls >= 2) return state;

            await this.evaluate(cdp, call(clickScript, BrowserConstants.COOKIE_ACCEPT_LABELS));
            await this.evaluate(cdp, call(clickScript, BrowserConstants.EXPAND_LABELS));

            const grown = state.textLength !== last;
            stable = grown ? 0 : stable + 1;
            last = state.textLength;
            if (state.textLength >= BrowserConstants.MIN_TEXT_CHARS && stable >= 2) break;
        }

        // Nachladende Bereiche: nach unten scrollen, noch einmal aufklappen.
        await this.evaluate(cdp, "/*scroll*/ window.scrollTo(0, document.body.scrollHeight)");
        await sleep(BrowserConstants.SCROLL_WAIT_MS);
        await this.evaluate(cdp, call(clickScript, BrowserConstants.EXPAND_LABELS));
        await sleep(BrowserConstants.SETTLE_STEP_MS);

        return await this.evaluate(cdp, call(stateScript));
    }

    /** Wartet, bis der Benutzer im Chrome-Fenster angemeldet ist (inklusive Captcha/Bestaetigungscode). */
    async waitForSignIn(cdp) {
        const deadline = Date.now() + BrowserConstants.LOGIN_TIMEOUT_MS;

        while (Date.now() < deadline) {
            await sleep(BrowserConstants.LOGIN_POLL_MS);
            try {
                const state = await this.evaluate(cdp, call(stateScript));
                if (!state.login && !state.captcha) return;
            } catch { /* Seite wechselt gerade */ }
        }

        throw new BrowserError(
            "LOGIN_TIMEOUT",
            "Zeitüberschreitung: Bitte im geöffneten Chrome-Fenster bei LinkedIn anmelden und den Import erneut starten.",
            401
        );
    }
}
