import { BaseEditTab } from "./BaseEditTab.js";
import { ImportEditTemplate } from "../../templates/edit/ImportEditTemplate.js";
import { Toast } from "../windows/Toast.js";
import { UrlPrompt } from "../windows/UrlPrompt.js";
import { UrlImporter } from "../../api/UrlImporter.js";
import { Analyzer } from "../../analysis/Analyzer.js";

export class ImportEditTab extends BaseEditTab {

    render() {
        return new ImportEditTemplate().render();
    }

    init(application, applyAnalysisToAllTabs) {
        this.applyAnalysisToAllTabs = applyAnalysisToAllTabs;
        this.analyzer = new Analyzer();
        this.urlPrompt = new UrlPrompt();
        this.urlImporter = new UrlImporter();

        this.history = (application.importedRawData || []).map(entry => ({ ...entry }));
        this.selectedEntryId = null;
        this.lastCommittedText = "";

        const input = this.root.querySelector("#originalText");

        this.root.querySelector("#clearOriginalText").onclick = () => {
            this.set("originalText", "");
            this.selectedEntryId = null;
            this.lastCommittedText = "";
            this.renderHistory();
        };

        input.onblur = () => this.commitIfChanged();
        this.root.querySelector("#fetchUrl").onclick = () => this.fetchFromUrl();

        this.renderHistory();
    }

    commitIfChanged() {
        const text = this.get("originalText").trim();
        if (!text || text === this.lastCommittedText) return;

        const source = this.analyzer.detectSource(text);

        if (this.selectedEntryId) {
            const entry = this.history.find(item => item.id === this.selectedEntryId);
            if (entry) {
                entry.text = text;
                entry.source = source;
            }
            this.lastCommittedText = text;
            this.renderHistory();
            this.runCombinedAnalysis();
            Toast.show("Änderung automatisch übernommen.", "success");
            return;
        }

        this.addHistoryEntry({ text, source, link: null });
        this.set("originalText", "");
        this.lastCommittedText = "";

        Toast.show(`Text automatisch übernommen (${this.history.length} Einträge insgesamt).`, "success");
    }

    async fetchFromUrl() {
        const url = await this.urlPrompt.show();
        if (!url) return;

        const button = this.root.querySelector("#fetchUrl");
        button.disabled = true;
        button.textContent = "Wird abgerufen...";

        try {
            const { text } = await this.urlImporter.fetch(url);
            this.addHistoryEntry({ text, source: url, link: url });
            Toast.show("Seite abgerufen und übernommen.", "success");
        } catch (error) {
            console.error(error);
            Toast.show(`Fehler beim Abrufen der URL: ${error.message}`, "error");
        } finally {
            button.disabled = false;
            button.textContent = "Webadresse der Stellenanzeige";
        }
    }

    addHistoryEntry({ text, source, link }) {
        this.history.push({
            id: crypto.randomUUID(),
            text,
            source,
            link,
            importedAt: new Date().toISOString()
        });

        this.renderHistory();
        this.runCombinedAnalysis();
    }

    runCombinedAnalysis() {
        if (!this.history.length) return;

        const combinedText = this.history.map(entry => entry.text).join("\n\n----\n\n");

        let result;
        try {
            result = this.analyzer.analyze(combinedText);
        } catch (error) {
            console.error("Fehler beim Einlesen des Textes:", error);
            return;
        }

        this.applyAnalysisToAllTabs(result);
    }

    editEntry(id) {
        const entry = this.history.find(item => item.id === id);
        if (!entry) return;

        this.selectedEntryId = id;
        this.lastCommittedText = entry.text;
        this.set("originalText", entry.text);
        this.renderHistory();
        this.root.querySelector("#originalText").focus();
    }

    removeEntry(id) {
        this.history = this.history.filter(entry => entry.id !== id);
        if (this.selectedEntryId === id) {
            this.selectedEntryId = null;
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

        empty.style.display = this.history.length ? "none" : "";
        list.innerHTML = "";

        this.history.forEach(entry => {
                        const preview = this.preview(entry.text);
            const row = document.createElement("div");
            row.className = "import-history-row" + (entry.id === this.selectedEntryId ? " selected" : "");
            row.innerHTML = `
              <div class="import-history-meta">
                                <strong>${this.escapeAttribute(entry.source || "Unbekannt")}</strong>
                <small>${this.formatDate(entry.importedAt)}</small>
                ${entry.link ? `<a href="${this.escapeAttribute(entry.link)}" target="_blank" rel="noopener">Quelle öffnen ↗</a>` : ""}
              </div>
                            ${preview !== null
                                ? `<p class="import-history-preview">${this.escapeAttribute(preview)}</p>`
                                : `<p class="import-history-preview import-history-missing">⚠ Kein Text vorhanden – dieser Eintrag ist unvollständig.</p>`}
              <div class="import-history-actions">
                                <button type="button" class="secondary switch-entry" ${preview === null ? "disabled" : ""}>${entry.id === this.selectedEntryId ? "Wird bearbeitet" : "Bearbeiten"}</button>
                <button type="button" class="icon-button remove-entry">×</button>
              </div>
            `;
            row.querySelector(".switch-entry").onclick = () => this.editEntry(entry.id);
            row.querySelector(".remove-entry").onclick = () => this.removeEntry(entry.id);
            list.appendChild(row);
        });
    }

    preview(text) {
        if (text == null) {
            console.log("ImportEditTab.js: preview text null");
            return null;
        }
        if (typeof text !== "string" || !text.trim()) return null;

        const flat = text.replace(/\s+/g, " ").trim();
        return flat.length > 140 ? flat.slice(0, 140) + "…" : flat;
    }

    formatDate(value) {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "";
        return parsed.toLocaleString("de-DE", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    }

    applyAnalysis() {
        // Der Import-Verlauf selbst wird durch spätere Analysen nicht verändert.
    }

    save(application) {
        application.importedRawData = this.history;
    }
}