import { BaseEditTab } from "./BaseEditTab.js";
import { ImportEditTemplate } from "../../templates/edit/ImportEditTemplate.js";
import { ImportedTextModel } from "../../models/ImportedTextModel.js";
import { Toast } from "../windows/Toast.js";
import { UrlPrompt } from "../windows/UrlPrompt.js";
import { UrlImporter } from "../../api/UrlImporter.js";
import { Analyzer } from "../../analysis/Analyzer.js";

export class ImportEditTab extends BaseEditTab {

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

        const input = this.root.querySelector("#originalText");

        this.root.querySelector("#clearOriginalText").onclick = () => {
            this.set("originalText", "");
            this.selectedId = null;
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

        const button = this.root.querySelector("#fetchUrl");
        button.disabled = true;
        button.textContent = "Wird abgerufen...";

        try {
            const { text } = await this.urlImporter.fetch(url);
            this.addHistoryEntry(text, url);
            Toast.show('Seite abgerufen und übernommen (siehe "Übernommene Texte" unten).', "success");
        } catch (error) {
            console.error(error);
            Toast.show(`Fehler beim Abrufen der URL: ${error.message}`, "error");
        } finally {
            button.disabled = false;
            button.textContent = "Webadresse der Stellenanzeige";
        }
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
            return;
        }

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

    applyAnalysis() {
        // Der Import-Verlauf selbst wird durch spätere Analysen nicht verändert.
    }

    save() {
        // importedRawData wird direkt am Application-Objekt verändert (s.o.),
        // hier daher nichts weiter zu tun.
    }
}