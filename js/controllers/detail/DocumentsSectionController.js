import { UploadFileModel } from "../../models/UploadFileModel.js";
import { VerifyPrompt } from "../../views/windows/VerifyPrompt.js";
import { InfoPrompt } from "../../views/windows/InfoPrompt.js";
import { FileConstants } from "../../../shared/FileConstants.js";

export class DocumentsSectionController {

    constructor(repository) {
        this.repository = repository;
    }

    async viewFile(link) {
        const available = await this.checkAvailability(link);

        if (!available) {
            const infoPrompt = new InfoPrompt();
            await infoPrompt.show(
                "Die Datei ist nicht verfügbar.",
                "Datei nicht gefunden"
            );
            return;
        }

        window.open(link, "_blank", "noopener");
    }

    async downloadFile(link, displayName) {
        const available = await this.checkAvailability(link);

        if (!available) {
            const infoPrompt = new InfoPrompt();
            await infoPrompt.show(
                "Die Datei ist nicht verfügbar.",
                "Datei nicht gefunden"
            );
            return;
        }

        const a = document.createElement("a");
        a.href = link;
        a.download = displayName || "";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    // Prüft beim Rendern alle Anzeigen-/Download-Buttons und deaktiviert sie,
    // falls die Datei nicht (mehr) existiert. Die Prüfung beim Klick bleibt
    // trotzdem bestehen, da sich der Zustand zwischen Rendern und Klick ändern kann.
    async refreshAvailability(root) {
        const buttons = Array.from(root.querySelectorAll("[data-view-upload], [data-download-upload]"));

        const links = [...new Set(
            buttons
                .map(button => button.dataset.viewUpload || button.dataset.downloadUpload)
                .filter(Boolean)
        )];

        const availability = new Map();
        await Promise.all(links.map(async link => {
            availability.set(link, await this.checkAvailability(link));
        }));

        buttons.forEach(button => {
            const link = button.dataset.viewUpload || button.dataset.downloadUpload;
            if (!link) return;
            button.disabled = !availability.get(link);
        });
    }


    async checkAvailability(link) {
        try {
            const response = await fetch(`/api/document-exists?link=${encodeURIComponent(link)}`);
            if (!response.ok) return false;

            const data = await response.json();
            return data.exists;
        } catch {
            return false;
        }
    }

    async uploadFile(application, field, file, onUpdate) {
        const uploaded = await this.upload(file);
        if (!uploaded) return; // Fehler wurde bereits per InfoPrompt gemeldet

        const model = new UploadFileModel();
        model.originalName = uploaded.originalName;
        model.link = uploaded.link;

        this.assign(application, field, model);

        await this.repository.save(application);
        onUpdate();
    }

    assign(application, field, model) {
        if (field === "resume") {
            application.application.resume.push(model);
        } else {
            application.application[field] = model;
        }
    }

    async upload(file) {
        if (file.size > FileConstants.MAX_UPLOAD_SIZE) {
            const infoPrompt = new InfoPrompt();
            await infoPrompt.show(
                `Datei zu groß. Maximal zulässig sind ${FileConstants.MAX_UPLOAD_SIZE_MB} MB.`,
                "Upload fehlgeschlagen"
            );
            return;
        }        
 
        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "X-Original-Filename": encodeURIComponent(file.name)
                },
                body: file
            });

            if (!response.ok) {
                let message = "Upload fehlgeschlagen.";
                try {
                    const body = await response.json();
                    if (body?.error) message = body.error;
                } catch {
                    // keine JSON-Antwort, Standardmeldung verwenden
                }
                throw new Error(message);
            }

            return await response.json();
        } catch (error) {
            const infoPrompt = new InfoPrompt();
            await infoPrompt.show(
                error.message || "Der Server ist nicht erreichbar.",
                "Upload fehlgeschlagen"
            );
            return null;
        }
    }

    async removeFile(application, field, id, onUpdate) {
        const model = field === "resume"
            ? application.application.resume.find(file => file.id === id)
            : application.application[field];

        if (!model) return;

        const verifyPrompt = new VerifyPrompt();
        const confirmed = await verifyPrompt.show(model.displayName, "Datei wirklich löschen?");
        if (!confirmed) return;

        const deleted = await this.deleteOnServer(model.link);
        if (!deleted) return; // Fehler wurde bereits per InfoPrompt gemeldet

        if (field === "resume") {
            application.application.resume = application.application.resume.filter(file => file.id !== id);
        } else {
            application.application[field] = null;
        }

        await this.repository.save(application);
        onUpdate();
    }

    async deleteOnServer(link) {
        try {
            const response = await fetch(`/api/delete?link=${encodeURIComponent(link)}`, {
                method: "DELETE"
            });

            // 404 zählt als Erfolg: Datei ist ohnehin schon weg
            if (!response.ok && response.status !== 404) {
                throw new Error("Die Datei konnte auf dem Server nicht gelöscht werden.");
            }

            return true;
        } catch (error) {
            const infoPrompt = new InfoPrompt();
            await infoPrompt.show(
                error.message || "Der Server ist nicht erreichbar.",
                "Löschen fehlgeschlagen"
            );
            return false;
        }
    }
}