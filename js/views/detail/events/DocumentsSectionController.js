import { UploadFileModel } from "../../../models/UploadFileModel.js";
import { VerifyPrompt } from "../../windows/VerifyPrompt.js";

export class DocumentsSectionController {

    constructor(repository) {
        this.repository = repository;
    }

    bind(root, application, onUpdate) {
        this.bindUploadTrigger(root);
        this.bindUploadChange(root, application, onUpdate);
        this.bindRemove(root, application, onUpdate);
    }

    bindUploadTrigger(root) {
        root.querySelectorAll("[data-upload-trigger]").forEach(button => {
            button.onclick = () => {
                const input = root.querySelector("#" + button.dataset.uploadTrigger);
                input?.click();
            };
        });
    }

    bindUploadChange(root, application, onUpdate) {
        root.querySelectorAll("[data-upload-field]").forEach(input => {
            if (input.tagName !== "INPUT") return;

            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;

                const uploaded = await this.upload(file);
                const model = new UploadFileModel();
                model.originalName = uploaded.originalName;
                model.link = uploaded.link;

                this.assign(application, input.dataset.uploadField, model);

                await this.repository.save(application);
                onUpdate();
            };
        });
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

    bindRemove(root, application, onUpdate) {
        root.querySelectorAll("[data-remove-upload]").forEach(button => {
            button.onclick = async () => {
                const field = button.dataset.uploadField;
                const id = button.dataset.removeUpload;

                const model = field === "resume"
                    ? application.application.resume.find(file => file.id === id)
                    : application.application[field];

                if (!model) return;

                const verifyPrompt = new VerifyPrompt();
                const confirmed = await verifyPrompt.show(
                    model.displayName,
                    "Datei wirklich löschen?"
                );
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
            };
        });
    }
}