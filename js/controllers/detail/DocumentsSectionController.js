import { UploadFileModel } from "../../models/UploadFileModel.js";
import { VerifyPrompt } from "../../views/windows/VerifyPrompt.js";
import { InfoPrompt } from "../../views/windows/InfoPrompt.js";

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

    async checkAvailability(link) {
        try {
            const response = await fetch(link, { method: "HEAD" });
            return response.ok;
        } catch {
            return false;
        }
    }

    async uploadFile(application, field, file, onUpdate) {
        const uploaded = await this.upload(file);
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
        const response = await fetch("/api/upload-document", {
            method: "POST",
            headers: {
                "X-Original-Filename": encodeURIComponent(file.name)
            },
            body: file
        });

        if (!response.ok) {
            throw new Error("Upload fehlgeschlagen.");
        }

        return response.json();
    }

    async removeFile(application, field, id, onUpdate) {
        const model = field === "resume"
            ? application.application.resume.find(file => file.id === id)
            : application.application[field];

        if (!model) return;

        const verifyPrompt = new VerifyPrompt();
        const confirmed = await verifyPrompt.show(model.displayName, "Datei wirklich löschen?");
        if (!confirmed) return;

        await fetch(`/api/delete-document?link=${encodeURIComponent(model.link)}`, {
            method: "DELETE"
        });

        if (field === "resume") {
            application.application.resume = application.application.resume.filter(file => file.id !== id);
        } else {
            application.application[field] = null;
        }

        await this.repository.save(application);
        onUpdate();
    }
}