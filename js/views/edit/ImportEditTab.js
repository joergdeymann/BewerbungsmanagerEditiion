import { BaseEditTab } from "./BaseEditTab.js";
import { ImportEditTemplate } from "../../templates/edit/ImportEditTemplate.js";
import { ImportedTextModel } from "../../models/ImportedTextModel.js";
import { Toast } from "../windows/Toast.js";
import { UrlPrompt } from "../windows/UrlPrompt.js";
import { UrlImporter } from "../../api/UrlImporter.js";
import { Analyzer } from "../../analysis/Analyzer.js";
import { ImportInbox } from "../../io/ImportInbox.js";
import { ImportStatus } from "../../ui/edit/ImportStatus.js";
import { ImportConstants } from "../../constants/ImportConstants.js";
import { BrowserConstants } from "../../../shared/BrowserConstants.js";

export class ImportEditTab extends BaseEditTab {
    static outdatedShown = false;


    render() {
        return new ImportEditTemplate().render();
    }

    init(application, applyAnalysisToAllTabs) {
        this.application = application;
        this.applyAnalysisToAllTabs = applyAnalysisToAllTabs;
        this.analyzer = new Analyzer();
        this.urlPrompt = new UrlPrompt();
        this.urlImporter = new UrlImporter();

        this.selectedId = null;
        this.lastCommittedText = "";
        this.loading = new Set();
        this.status = new ImportStatus();

        const input = this.root.querySelector("#originalText");

        this.root.querySelector("#clearOriginalText").onclick = () => {
            this.set("originalText", "");
            this.selectedId = null;
            this.lastCommittedText = "";
            this.renderHistory();
        };

        input.onblur = () => this.commitIfChanged();
        this.root.querySelector("#fetchUrl").onclick = () => this.fetchFromUrl();
        this.root.querySelector("#openLinkedIn").onclick = () => this.openLinkedIn();

        this.renderHistory();
        ImportInbox.subscribe(payload => this.importFromPayload(payload), () => this.root.isConnected);
    }

    commitIfChanged() {
        const text = this.get("originalText").trim();
        if (!text || text === this.lastCommittedText) return;

        if (this.selectedId) {
            const entry = this.application.importedRawData.find(item => item.id === this.selectedId);
            if (entry) entry.content = text;

            this.lastCommittedText = text;
            this.renderHistory();
            this.runCombinedAnalysis();
            Toast.show('Änderung automatisch übernommen (siehe "Übernommene Texte" unten).', "success");
            return;
        }

        this.addHistoryEntry(text);
        this.set("originalText", "");
        this.lastCommittedText = "";

        Toast.show(
            `Text automatisch übernommen (${this.entryCountLabel()} insgesamt im Bereich "Übernommene Texte" unten).`,
            "success"
        );
    }

    async fetchFromUrl() {
        const url = await this.urlPrompt.show();
        if (!url) return;

        await this.importPage(url, () => this.urlImporter.fetch(url), false, true, "dialog");
    }

    /**
     * Übernimmt eine Seite vom Bookmarklet (mit HTML) oder, ohne HTML,
     * per Abruf der URL über den Server.
     * @param {{url: string, html: string|null, optional?: boolean, aboutExpected?: boolean, source?: string}} payload
     *        optional = Info-Seite der Firma vom Bookmarklet (html null: über den Server holen);
     *        aboutExpected = das Bookmarklet liefert die Info-Seite, ein Abruf über den Server entfällt;
     *        source = bookmarklet oder fallback (automatischer Abruf, weil nichts vom Lesezeichen ankam).
     */
    async importFromPayload({ url, html, optional = false, aboutExpected = false, source = "bookmarklet", outdated = false }) {
        console.info(`[Import] ${ImportConstants.SOURCE_LABELS[source] ?? source}: ${url}${html ? " (mit HTML)" : " (Abruf über den Server)"}`);
        document.querySelector('[data-section="import"]')?.click();

        if (outdated && !ImportEditTab.outdatedShown) {
            ImportEditTab.outdatedShown = true;
            Toast.show(
                'Das Lesezeichen "Stelle importieren" ist veraltet. Ziehe den Link aus diesem Reiter neu in die Lesezeichen-Leiste und lösche das alte: Das neue nutzt immer denselben Tab.',
                "info", BrowserConstants.HINT_DURATION_MS
            );
        }

        // Eine schon übernommene Seite wird nie ein zweites Mal abgerufen.
        if (!optional && this.hasEntry(url)) {
            console.info(`[Import] Übersprungen, Seite ist bereits übernommen: ${url}`);
            Toast.show("Diese Seite ist bereits unter \"Übernommene Texte\" vorhanden.", "info");
            return;
        }

        if (optional) {
            await this.importCompanyPayload(url, html);
            return;
        }

        const load = html
            ? async () => this.urlImporter.fromHtml(html, url)
            : () => this.urlImporter.fetch(url);
        await this.importPage(url, load, false, !aboutExpected, source);
    }

    /**
     * Öffnet LinkedIn in einem benannten Tab, der mit der App verbunden bleibt. Das Lesezeichen
     * findet dadurch die App wieder, auch wenn sie von Hand geöffnet wurde. Ist dieser Tab schon
     * offen, wird er nur nach vorn geholt (die Seite bleibt, wie sie ist).
     */
    openLinkedIn() {
        const tab = window.open("", ImportConstants.LINKEDIN_WINDOW_NAME);
        if (!tab) {
            Toast.show("Der Browser hat das neue Fenster blockiert. Erlaube Pop-ups für diese Seite.", "error");
            return;
        }

        let existing = true;
        try { existing = tab.location.href !== "about:blank"; } catch { existing = true; }

        if (existing) {
            try { tab.focus(); } catch { /* der Browser darf den Fokus verweigern */ }
            return;
        }
        tab.location.href = ImportConstants.LINKEDIN_URL;
    }

    /** @returns {boolean} true, wenn schon ein Eintrag mit dieser Adresse vorhanden ist. */
    hasEntry(url) {
        return !!url && this.application.importedRawData.some(entry => entry.url === url);
    }

    /**
     * Info-Seite der Firma vom Bookmarklet: mit HTML (aus dem Browser des Benutzers) wird sie
     * direkt übernommen; ohne HTML oder wenn sie nichts liefert, ruft die App sie über den Server ab.
     * @param {string} url Adresse der Info-Seite.
     * @param {string|null} html HTML aus dem Rahmen des Bookmarklets.
     */
    async importCompanyPayload(url, html) {
        if (this.hasEntry(url)) return;

        const imported = html ? !await this.importPage(url, async () => this.urlImporter.fromHtml(html, url), true) : false;

        if (!imported) {
            const home = url.endsWith(ImportConstants.COMPANY_ABOUT_SUFFIX)
                ? url.slice(0, -ImportConstants.COMPANY_ABOUT_SUFFIX.length) + ImportConstants.COMPANY_HOME_SUFFIX
                : "";
            await this.loadCompanyPage(url, home);
        }

        await this.loadWebsite();
    }

    /**
     * Übernimmt eine Seite als Eintrag. Enthält sie einen Firmenlink, wird danach die Info-Seite
     * der Firma über den Server abgerufen und als weiterer Eintrag übernommen.
     * @param {string} url Adresse der Seite.
     * @param {() => Promise<object>} load Liefert das Ergebnis des UrlImporter.
     * @param {boolean} [optional] true für die Info-Seite der Firma: Fehler sind nur ein Hinweis.
     * @param {boolean} [fetchCompany] false, wenn die Info-Seite anders geliefert wird (Bookmarklet).
     * @param {string} [source] Woher der Abruf stammt (ImportConstants.SOURCE_LABELS), für die Fehlermeldung.
     * @param {"main"|"side"|"company"} [kind] Seitenart (ImportConstants.PAGE): Hauptseite, Nebenseite
     *        (z. B. Info-Seite) oder Firmenseite; bestimmt Anzeige im Kopfbereich und Meldungen.
     * @returns {Promise<string>} "" bei Erfolg, sonst der Grund, warum die Seite nicht übernommen wurde.
     */
    async importPage(url, load, optional = false, fetchCompany = true, source = "", kind = optional ? "side" : "main") {
        if (this.loading.has(url)) {
            console.info(`[Import] Seite wird bereits geladen, doppelter Abruf übersprungen: ${url}`);
            return "Die Seite wird bereits geladen";
        }
        this.loading.add(url);

        const button = this.root.querySelector("#fetchUrl");
        button.disabled = true;
        button.textContent = ImportConstants.PAGE[kind].busy;

        // Seiten mit Anmeldung lädt der Server in einem Chrome; dort kann eine Anmeldung nötig sein.
        const signInHint = UrlImporter.usesBrowser(url)
            ? setTimeout(() => Toast.show(
                "Falls ein Chrome-Fenster erscheint: dort bei LinkedIn anmelden, die App wartet darauf.", "info",
                BrowserConstants.HINT_DURATION_MS), BrowserConstants.WAIT_HINT_MS)
            : null;

        try {
            const result = await this.loadWithStatus(kind, load);
            this.logImport(result);

            const reason = this.rejectReason(result, optional);
            if (reason) {
                if (!optional) Toast.show(`Seite nicht übernommen: ${reason}.`, "error");
                return reason;
            }

            this.addHistoryEntry(result.text, url);
            Toast.show(ImportConstants.PAGE[kind].done, "success");

            // Reihenfolge: Hauptseite, Nebenseite(n) auf LinkedIn, zuletzt die Firmenseite (nacheinander).
            if (!optional && fetchCompany) {
                await this.loadCompanyPage(result.companyAboutUrl, result.companyUrl);
                await this.loadWebsite();
            }
            return "";
        } catch (error) {
            console.error(error);
            if (!optional) {
                const origin = source ? ` (${ImportConstants.SOURCE_LABELS[source] ?? source})` : "";
                Toast.show(`Fehler beim Abrufen der URL${origin}: ${error.message}`, "error");
            }
            return error.message;
        } finally {
            this.loading.delete(url);
            clearTimeout(signInHint);
            button.disabled = false;
            button.textContent = "Webadresse der Stellenanzeige";
        }
    }

    /**
     * Grund, eine abgerufene Seite nicht zu übernehmen: Cookie-Abfrage/Anmeldung statt Inhalt,
     * bei der Info-Seite außerdem zu wenig Text.
     * @param {{blocked: boolean, text: string}} result Ergebnis des UrlImporter.
     * @param {boolean} optional true für die Info-Seite der Firma.
     * @returns {string} Grund oder "".
     */
    rejectReason(result, optional) {
        if (result.blocked) return "Die Seite zeigt eine Cookie-Abfrage oder Anmeldung statt des Inhalts";
        if (optional && result.text.length < ImportConstants.MIN_OPTIONAL_CHARS) return "Die Seite lieferte kaum Text";

        return "";
    }

    /**
     * Ruft die Info-Seite der Firma über den Server ab (wie curl) und übernimmt sie als weiteren
     * Eintrag. Ist sie gesperrt, wird die Hauptseite der Firma versucht. Ist eine der Seiten schon
     * vorhanden, passiert nichts.
     * @param {string} aboutUrl Adresse der Info-Seite ("" ohne Firmenlink).
     * @param {string} companyUrl Adresse der Hauptseite der Firma.
     */
    async loadCompanyPage(aboutUrl, companyUrl) {
        const urls = [aboutUrl, companyUrl].filter(Boolean);
        if (!urls.length) return;
        if (urls.some(url => this.hasEntry(url))) return;

        const reasons = [];
        for (const url of urls) {
            const reason = await this.importPage(url, () => this.urlImporter.fetch(url), true, false, "company");
            if (!reason) return;

            reasons.push(reason);
        }

        this.showCompanyPageHint(urls[0], reasons[0]);
    }

    /**
     * Führt einen Abruf aus und zeigt im Kopfbereich, welche Seite gerade geladen wird.
     * @param {"main"|"side"|"company"} kind Seitenart (ImportConstants.PAGE).
     * @param {() => Promise<object>} load Liefert das Ergebnis des UrlImporter.
     * @returns {Promise<object>} Ergebnis von load.
     */
    async loadWithStatus(kind, load) {
        let ok = false;
        this.status.begin(kind);

        try {
            const result = await load();
            ok = true;
            return result;
        } finally {
            this.status.end(kind, ok);
        }
    }

    /**
     * Webadresse der Firma (die Firmenseite selbst, nicht LinkedIn) aus den erfassten Firmendaten.
     * @returns {string} Adresse mit https://, "" ohne Angabe oder für LinkedIn-Adressen.
     */
    websiteUrl() {
        const raw = String(this.application.company?.website ?? "").trim();
        if (!raw) return "";

        try {
            const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).href;
            return UrlImporter.usesBrowser(url) ? "" : url;
        } catch {
            return "";
        }
    }

    /**
     * Lädt immer die Firmenseite (Website der Firma) über den Server und übernimmt sie als weiteren
     * Eintrag, damit fehlende Angaben daraus gelesen werden. Ohne bekannte Webadresse oder bei
     * bereits übernommener Seite passiert nichts; ein Fehler ist nur ein Hinweis.
     */
    async loadWebsite() {
        const url = this.websiteUrl();
        if (!url) {
            console.info("[Import] Firmenseite: keine Webadresse bekannt, übersprungen.");
            return;
        }
        if (this.hasEntry(url) || this.loading.has(url)) return;

        const reason = await this.importPage(url, () => this.urlImporter.fetch(url), true, false, "website", "company");
        if (reason) {
            console.warn(`Firmenseite nicht übernommen (${url}): ${reason}`);
            Toast.show(`Firmenseite nicht übernommen: ${reason}.`, "info", BrowserConstants.HINT_DURATION_MS);
        }
    }

    showCompanyPageHint(url, reason) {
        console.warn(`Info-Seite der Firma nicht übernommen (${url}): ${reason}`);
        Toast.show(
            `Info-Seite der Firma nicht übernommen: ${reason}. Öffne sie selbst und führe dort das Lesezeichen aus.`,
            "error",
            BrowserConstants.HINT_DURATION_MS
        );
    }

    /** Gibt Rohdaten (vollständig, zeilenweise) und Links zur Kontrolle in der Konsole aus. */
    logImport({ url, source, lines, text, links }) {
        console.group(`Import: ${url}`);
        console.log(`Bereich: ${source} | ${lines.length} Zeilen | ${text.length} Zeichen`);
        console.log("Rohdaten:\n" + text);
        console.log(`Links (${links.length}, intern: ${links.filter(l => l.type === "intern").length}):`);
        console.table(links);
        console.groupEnd();
    }

    addHistoryEntry(content, url = "") {
        const entry = new ImportedTextModel();
        entry.content = content;
        entry.url = url;
        entry.capturedAt = new Date().toISOString();

        this.application.importedRawData.push(entry);
        this.renderHistory();
        this.runCombinedAnalysis();
    }

    runCombinedAnalysis() {
        const entries = this.application.importedRawData;
        if (!entries.length) return;

        const combinedText = entries.map(entry => entry.content).join("\n\n----\n\n");

        let result;
        try {
            result = this.analyzer.analyze(combinedText);
        } catch (error) {
            console.error("Fehler beim Einlesen des Textes:", error);
            Toast.show(`Die Analyse des Textes ist fehlgeschlagen: ${error.message}`, "error");
            return;
        }

        console.log("Analyse-Ergebnis:", {
            firma: result.company?.name,
            stelle: result.job?.title,
            arbeitsort: result.job?.workLocation?.city,
            kontakte: result.contacts?.length
        });

        this.applyAnalysisToAllTabs(result);
    }

    editEntry(id) {
        const entry = this.application.importedRawData.find(item => item.id === id);
        if (!entry || typeof entry.content !== "string") return;

        this.selectedId = id;
        this.lastCommittedText = entry.content;
        this.set("originalText", entry.content);
        this.renderHistory();
        this.root.querySelector("#originalText").focus();
    }

    removeEntry(id) {
        this.application.importedRawData = this.application.importedRawData.filter(item => item.id !== id);

        if (this.selectedId === id) {
            this.selectedId = null;
            this.set("originalText", "");
            this.lastCommittedText = "";
        }
        this.renderHistory();
        this.runCombinedAnalysis();
    }

    renderHistory() {
        const list = this.root.querySelector("#importHistoryList");
        const empty = this.root.querySelector("#importHistoryEmpty");
        if (!list) return;

        const entries = this.application.importedRawData;

        empty.style.display = entries.length ? "none" : "";
        list.innerHTML = "";

        entries.forEach(entry => {
            const preview = this.preview(entry.content);
            const row = document.createElement("div");
            row.className = "import-history-row" + (entry.id === this.selectedId ? " selected" : "");
            row.innerHTML = `
              <div class="import-history-meta">
                <strong>${this.formatDate(entry.capturedAt)}</strong>
                ${entry.url ? `<a href="${this.escapeAttribute(entry.url)}" target="_blank" rel="noopener">Quelle öffnen ↗</a>` : ""}
              </div>
              ${preview !== null
                ? `<p class="import-history-preview">${this.escapeAttribute(preview)}</p>`
                : `<p class="import-history-preview import-history-missing">⚠ Kein Text vorhanden – dieser Eintrag ist unvollständig.</p>`}
              <div class="import-history-actions">
                <button type="button" class="secondary switch-entry" ${preview === null ? "disabled" : ""}>${entry.id === this.selectedId ? "Wird bearbeitet" : "Bearbeiten"}</button>
                <button type="button" class="icon-button danger remove-entry">×</button>
              </div>
            `;
            row.querySelector(".switch-entry").onclick = () => this.editEntry(entry.id);
            row.querySelector(".remove-entry").onclick = () => this.removeEntry(entry.id);
            list.appendChild(row);
        });
    }

    preview(text) {
        if (typeof text !== "string" || !text.trim()) return null;

        const flat = text.replace(/\s+/g, " ").trim();
        return flat.length > 140 ? flat.slice(0, 140) + "…" : flat;
    }

    formatDate(value) {
        if (!value) return "–";

        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "–";

        return parsed.toLocaleString("de-DE", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    }

    entryCountLabel() {
        const count = this.application.importedRawData.length;
        return count === 1 ? "1 Eintrag" : `${count} Einträge`;
    }

    save() {
        // importedRawData wird direkt am Application-Objekt verändert (s.o.),
        // hier daher nichts weiter zu tun.
    }
}